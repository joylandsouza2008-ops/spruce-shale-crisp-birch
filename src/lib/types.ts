export type ExtractedMedicine = {
  rawName: string;
  dose: string;
  frequency: string;
  timing: string;
  duration: string;
  sos: boolean;
  purpose: string;
  confidence: number;
  medicineId: string | null;
};

export type DaySlot = {
  when: "morning" | "afternoon" | "night" | "sos";
  label: string;
  items: { name: string; how: string; purpose: string }[];
};

export type GenericOption = {
  medicineId: string;
  prescribed: string;
  salt: string;
  brandMrp: number;
  genericMrp: number;
  janAushadhiMrp: number;
  saveVsBrand: number;
  savePct: number;
};

export type PharmacyMatch = {
  pharmacyId: string;
  name: string;
  area: string;
  address: string;
  phone: string;
  hours: string;
  pickupHint: string;
  inStock: number;
  total: number;
  missing: string[];
  etaHours: number | null;
  estimatedTotal: number;
};

export type FlaggedInteraction = {
  level: "caution" | "serious";
  medicines: string[];
  note: string;
};

export type AnalysisResult = {
  source: "ai" | "local";
  patientName: string | null;
  age: string | null;
  diagnosis: string | null;
  followUp: string | null;
  medicines: ExtractedMedicine[];
  schedule: DaySlot[];
  questions: string[];
  generics: GenericOption[];
  pharmacies: PharmacyMatch[];
  interactions: FlaggedInteraction[];
  reasoning: string[];
  warnings: string[];
  monthlySave: number;
  analyzedAt: string;
};
