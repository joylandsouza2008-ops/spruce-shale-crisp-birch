import {
  findMedicine,
  INTERACTIONS,
  MEDICINES,
  PHARMACIES,
  type Medicine,
} from "./catalog";
import type {
  AnalysisResult,
  DaySlot,
  ExtractedMedicine,
  GenericOption,
  PharmacyMatch,
} from "./types";

export type AiExtract = {
  patientName?: string | null;
  age?: string | null;
  diagnosis?: string | null;
  followUp?: string | null;
  medicines?: Array<{
    rawName?: string;
    dose?: string;
    frequency?: string;
    timing?: string;
    duration?: string;
    sos?: boolean;
    purpose?: string;
    confidence?: number;
  }>;
  questionsForDoctor?: string[];
  reasoning?: string[];
  warnings?: string[];
};

function parseFrequency(freq: string, timing: string, sos: boolean): DaySlot["when"][] {
  if (sos) return ["sos"];
  const f = freq.toLowerCase();
  const t = timing.toLowerCase();
  const slots = new Set<DaySlot["when"]>();
  const triple = f.match(/(\d)\s*[-/]\s*(\d)\s*[-/]\s*(\d)/);
  if (triple) {
    if (Number(triple[1]) > 0) slots.add("morning");
    if (Number(triple[2]) > 0) slots.add("afternoon");
    if (Number(triple[3]) > 0) slots.add("night");
    return [...slots];
  }
  if (/bd|twice|1-0-1|morning and night/.test(f + t)) {
    slots.add("morning");
    slots.add("night");
    return [...slots];
  }
  if (/tds|thrice|three times/.test(f + t)) {
    return ["morning", "afternoon", "night"];
  }
  if (/night|hs|bed/.test(t) || /0-0-1/.test(f)) return ["night"];
  if (/afternoon|noon/.test(t)) return ["afternoon"];
  if (/morning|od|once|breakfast|1-0-0/.test(f + t)) return ["morning"];
  return ["morning"];
}

function slotLabel(when: DaySlot["when"]): string {
  if (when === "morning") return "Morning";
  if (when === "afternoon") return "Afternoon";
  if (when === "night") return "Night";
  return "As needed (SOS)";
}

export function enrichExtract(ai: AiExtract, source: "ai" | "local"): AnalysisResult {
  const medicines: ExtractedMedicine[] = (ai.medicines ?? []).map((m) => {
    const raw = m.rawName ?? "Unknown medicine";
    const hit = findMedicine(raw);
    return {
      rawName: raw,
      dose: m.dose ?? hit?.strength ?? "",
      frequency: m.frequency ?? "",
      timing: m.timing ?? "",
      duration: m.duration ?? "",
      sos: Boolean(m.sos),
      purpose: m.purpose || hit?.typicalUse || "As prescribed by your doctor",
      confidence: typeof m.confidence === "number" ? m.confidence : hit ? 0.86 : 0.45,
      medicineId: hit?.id ?? null,
    };
  });

  const scheduleMap = new Map<DaySlot["when"], DaySlot>();
  for (const when of ["morning", "afternoon", "night", "sos"] as DaySlot["when"][]) {
    scheduleMap.set(when, { when, label: slotLabel(when), items: [] });
  }
  for (const med of medicines) {
    const how = [med.dose, med.timing, med.duration].filter(Boolean).join(" · ");
    const display = MEDICINES.find((x) => x.id === med.medicineId)?.brand ?? med.rawName;
    for (const when of parseFrequency(med.frequency, med.timing, med.sos)) {
      scheduleMap.get(when)?.items.push({
        name: display,
        how: how || med.frequency,
        purpose: med.purpose,
      });
    }
  }
  const schedule = [...scheduleMap.values()].filter((s) => s.items.length > 0);

  const generics: GenericOption[] = [];
  const seen = new Set<string>();
  for (const med of medicines) {
    if (!med.medicineId || seen.has(med.medicineId)) continue;
    seen.add(med.medicineId);
    const cat = MEDICINES.find((x) => x.id === med.medicineId) as Medicine;
    const save = Math.max(0, cat.mrp - cat.janAushadhiMrp);
    generics.push({
      medicineId: cat.id,
      prescribed: cat.brand,
      salt: `${cat.salt} ${cat.strength}`,
      brandMrp: cat.mrp,
      genericMrp: cat.genericMrp,
      janAushadhiMrp: cat.janAushadhiMrp,
      saveVsBrand: save,
      savePct: cat.mrp ? Math.round((save / cat.mrp) * 100) : 0,
    });
  }

  const monthlySave = generics.reduce((sum, g) => sum + g.saveVsBrand, 0);

  const needed = medicines.map((m) => m.medicineId).filter((id): id is string => Boolean(id));
  const uniqueNeeded = [...new Set(needed)];

  const pharmacies: PharmacyMatch[] = PHARMACIES.map((p) => {
    let inStock = 0;
    const missing: string[] = [];
    let eta: number | null = null;
    let estimatedTotal = 0;
    for (const id of uniqueNeeded) {
      const row = p.stock.find((s) => s.medicineId === id);
      const name = MEDICINES.find((m) => m.id === id)?.brand ?? id;
      if (row && row.qty > 0) {
        inStock += 1;
        estimatedTotal += row.price;
      } else {
        missing.push(name);
        if (row?.etaHours != null) eta = eta == null ? row.etaHours : Math.max(eta, row.etaHours);
      }
    }
    return {
      pharmacyId: p.id,
      name: p.name,
      area: p.area,
      address: p.address,
      phone: p.phone,
      hours: p.hours,
      pickupHint: p.pickupHint,
      inStock,
      total: uniqueNeeded.length,
      missing,
      etaHours: eta,
      estimatedTotal,
    };
  }).sort((a, b) => b.inStock - a.inStock || a.estimatedTotal - b.estimatedTotal);

  const ids = new Set(uniqueNeeded);
  const interactions = INTERACTIONS.filter((i) => ids.has(i.a) && ids.has(i.b)).map((i) => ({
    level: i.level,
    medicines: [
      MEDICINES.find((m) => m.id === i.a)?.brand ?? i.a,
      MEDICINES.find((m) => m.id === i.b)?.brand ?? i.b,
    ],
    note: i.note,
  }));

  const questions =
    ai.questionsForDoctor && ai.questionsForDoctor.length > 0
      ? ai.questionsForDoctor
      : [
          "Can any of these be switched to a Jan Aushadhi generic of the same salt?",
          "Which medicines must not be skipped, and which are only if needed?",
          "When should blood pressure / sugar be rechecked before the next visit?",
        ];

  const reasoning =
    ai.reasoning && ai.reasoning.length
      ? ai.reasoning
      : [
          "Read the prescription line by line for drug name, strength, and frequency (e.g. 1-0-0).",
          "Mapped each name to a known salt and common Indian brands.",
          "Built a morning / afternoon / night schedule from frequency codes.",
          "Looked up generic and Jan Aushadhi price bands from the demo catalog.",
          "Checked a local demo of Mangalore pharmacy stock — not live inventory.",
        ];

  return {
    source,
    patientName: ai.patientName ?? null,
    age: ai.age ?? null,
    diagnosis: ai.diagnosis ?? null,
    followUp: ai.followUp ?? null,
    medicines,
    schedule,
    questions,
    generics,
    pharmacies,
    interactions,
    reasoning,
    warnings: ai.warnings ?? [],
    monthlySave,
    analyzedAt: new Date().toISOString(),
  };
}

/** Offline / fallback parser for common Indian Rx lines. */
export function localExtract(text: string): AiExtract {
  const medicines: NonNullable<AiExtract["medicines"]> = [];
  const lines = text.split(/\n+/);
  for (const line of lines) {
    const cleaned = line.replace(/^\s*\d+[.)]\s*/, "").trim();
    if (!/(tab|cap|syp|inj|tablet|dolo|telma|glycomet|pan |atorva|azithral)/i.test(cleaned)) {
      continue;
    }
    const freq = cleaned.match(/(\d\s*[-/]\s*\d\s*[-/]\s*\d)/)?.[1] ?? "";
    const dose = cleaned.match(/(\d+\s*(mg|mcg|ml))/i)?.[1] ?? "";
    const duration = cleaned.match(/x\s*(\d+\s*(day|days|week|weeks))/i)?.[0] ?? "";
    const sos = /\bsos\b/i.test(cleaned);
    let timing = "";
    if (/before breakfast/i.test(cleaned)) timing = "before breakfast";
    else if (/after breakfast/i.test(cleaned)) timing = "after breakfast";
    else if (/after food/i.test(cleaned)) timing = "after food";
    else if (/at night|hs\b/i.test(cleaned)) timing = "at night";
    const nameMatch = cleaned.match(
      /(?:tab(?:let)?|cap(?:sule)?|syp|inj)?\.?\s*([A-Za-z][A-Za-z0-9+\- ]{2,40}?)(?:\s+\d)/i,
    );
    const rawName = (nameMatch?.[1] ?? cleaned).trim();
    const hit = findMedicine(rawName);
    medicines.push({
      rawName: hit?.brand ?? rawName,
      dose: dose || hit?.strength,
      frequency: freq,
      timing,
      duration,
      sos,
      purpose: hit?.typicalUse,
      confidence: hit ? 0.8 : 0.4,
    });
  }

  const patient =
    text.match(/patient:\s*([A-Za-z. ]+?)(?:,|\n)/i)?.[1]?.trim() ??
    text.match(/rx for\s+([A-Za-z. ]+)/i)?.[1]?.trim() ??
    null;
  const age = text.match(/(\d+)\s*yrs?/i)?.[1] ?? null;
  const diagnosis = text.match(/diagnosis:\s*(.+)/i)?.[1]?.trim() ?? null;
  const followUp = text.match(/follow up[^.]+/i)?.[0] ?? null;

  return {
    patientName: patient,
    age,
    diagnosis,
    followUp,
    medicines,
    reasoning: [
      "AI was unavailable or returned incomplete JSON, so a local Indian-Rx parser ran.",
      "Lines with Tab/Cap/Syp and a 1-0-1 style frequency were treated as medicines.",
      "Names were matched against the demo catalog of common Indian brands.",
    ],
    warnings: medicines.length
      ? []
      : ["Could not find medicine lines. Try a clearer photo or paste the text."],
  };
}
