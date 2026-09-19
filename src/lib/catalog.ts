export type Medicine = {
  id: string;
  brand: string;
  salt: string;
  strength: string;
  form: string;
  typicalUse: string;
  rarity: "common" | "uncommon" | "rare";
  mrp: number;
  genericMrp: number;
  janAushadhiMrp: number;
  barcode: string;
  aliases: string[];
};

export type PharmacyStock = {
  medicineId: string;
  qty: number;
  etaHours: number | null;
  price: number;
};

export type Pharmacy = {
  id: string;
  name: string;
  area: string;
  address: string;
  phone: string;
  hours: string;
  pickupHint: string;
  stock: PharmacyStock[];
};

export type Interaction = {
  a: string;
  b: string;
  level: "caution" | "serious";
  note: string;
};

export const MEDICINES: Medicine[] = [
  {
    id: "telmisartan-40",
    brand: "Telma 40",
    salt: "Telmisartan",
    strength: "40 mg",
    form: "Tablet",
    typicalUse: "Blood pressure (hypertension)",
    rarity: "common",
    mrp: 118,
    genericMrp: 42,
    janAushadhiMrp: 18,
    barcode: "8901101000401",
    aliases: ["telma", "telvas", "telsartan", "telmisartan", "tazloc"],
  },
  {
    id: "metformin-500",
    brand: "Glycomet 500",
    salt: "Metformin",
    strength: "500 mg",
    form: "Tablet",
    typicalUse: "Type 2 diabetes — helps lower blood sugar",
    rarity: "common",
    mrp: 38,
    genericMrp: 16,
    janAushadhiMrp: 8,
    barcode: "8901101000502",
    aliases: ["glycomet", "glycipage", "metformin", "obimet", "gluformin"],
  },
  {
    id: "atorvastatin-10",
    brand: "Atorva 10",
    salt: "Atorvastatin",
    strength: "10 mg",
    form: "Tablet",
    typicalUse: "Cholesterol (dyslipidemia)",
    rarity: "common",
    mrp: 96,
    genericMrp: 28,
    janAushadhiMrp: 12,
    barcode: "8901101000103",
    aliases: ["atorva", "atorvastatin", "storvas", "lipikind", "atonext"],
  },
  {
    id: "pantoprazole-40",
    brand: "Pan 40",
    salt: "Pantoprazole",
    strength: "40 mg",
    form: "Tablet",
    typicalUse: "Acidity / gastritis — reduces stomach acid",
    rarity: "common",
    mrp: 128,
    genericMrp: 34,
    janAushadhiMrp: 14,
    barcode: "8901101000404",
    aliases: ["pan", "pantoprazole", "pantocid", "pantodac", "pansec"],
  },
  {
    id: "paracetamol-650",
    brand: "Dolo 650",
    salt: "Paracetamol",
    strength: "650 mg",
    form: "Tablet",
    typicalUse: "Fever and pain relief",
    rarity: "common",
    mrp: 32,
    genericMrp: 14,
    janAushadhiMrp: 6,
    barcode: "8901101000650",
    aliases: ["dolo", "paracetamol", "crocin", "calpol", "dolopar", "pcm"],
  },
  {
    id: "amox-clav-625",
    brand: "Augmentin 625",
    salt: "Amoxicillin + Clavulanate",
    strength: "625 mg",
    form: "Tablet",
    typicalUse: "Bacterial infection (antibiotic)",
    rarity: "common",
    mrp: 198,
    genericMrp: 86,
    janAushadhiMrp: 42,
    barcode: "8901101000625",
    aliases: ["augmentin", "clavam", "moxclav", "amoxicillin", "amoxyclav"],
  },
  {
    id: "azithromycin-500",
    brand: "Azithral 500",
    salt: "Azithromycin",
    strength: "500 mg",
    form: "Tablet",
    typicalUse: "Bacterial infection (antibiotic)",
    rarity: "common",
    mrp: 119,
    genericMrp: 48,
    janAushadhiMrp: 22,
    barcode: "8901101000500",
    aliases: ["azithral", "azithro", "azithromycin", "azee", "zithrox"],
  },
  {
    id: "aspirin-75",
    brand: "Ecosprin 75",
    salt: "Aspirin (acetylsalicylic acid)",
    strength: "75 mg",
    form: "Tablet",
    typicalUse: "Blood thinning — heart protection (as prescribed)",
    rarity: "common",
    mrp: 12,
    genericMrp: 6,
    janAushadhiMrp: 3,
    barcode: "8901101000075",
    aliases: ["ecosprin", "aspirin", "disprin", "loprin", "asasantin"],
  },
  {
    id: "amlodipine-5",
    brand: "Amlong 5",
    salt: "Amlodipine",
    strength: "5 mg",
    form: "Tablet",
    typicalUse: "Blood pressure",
    rarity: "common",
    mrp: 42,
    genericMrp: 14,
    janAushadhiMrp: 6,
    barcode: "8901101000005",
    aliases: ["amlong", "amlodipine", "amlovas", "stamlo", "amtas"],
  },
  {
    id: "cetirizine-10",
    brand: "Cetzine 10",
    salt: "Cetirizine",
    strength: "10 mg",
    form: "Tablet",
    typicalUse: "Allergy, itching, runny nose",
    rarity: "common",
    mrp: 22,
    genericMrp: 8,
    janAushadhiMrp: 3,
    barcode: "8901101000010",
    aliases: ["cetzine", "cetirizine", "okacet", "alerid", "zyrtec"],
  },
  {
    id: "montelukast-levocet",
    brand: "Montair LC",
    salt: "Montelukast + Levocetirizine",
    strength: "10/5 mg",
    form: "Tablet",
    typicalUse: "Allergic rhinitis and asthma-related allergy",
    rarity: "uncommon",
    mrp: 186,
    genericMrp: 72,
    janAushadhiMrp: 38,
    barcode: "8901101000110",
    aliases: ["montair", "montelukast", "levocet", "montek lc", "telekast l"],
  },
  {
    id: "thyroxine-50",
    brand: "Thyronorm 50",
    salt: "Levothyroxine",
    strength: "50 mcg",
    form: "Tablet",
    typicalUse: "Underactive thyroid (hypothyroidism)",
    rarity: "common",
    mrp: 128,
    genericMrp: 54,
    janAushadhiMrp: 24,
    barcode: "8901101000050",
    aliases: ["thyronorm", "eltroxin", "thyroxine", "levothyroxine", "thyrox"],
  },
  {
    id: "omeprazole-20",
    brand: "Omez 20",
    salt: "Omeprazole",
    strength: "20 mg",
    form: "Capsule",
    typicalUse: "Acidity / reflux",
    rarity: "common",
    mrp: 68,
    genericMrp: 18,
    janAushadhiMrp: 8,
    barcode: "8901101000020",
    aliases: ["omez", "omeprazole", "ocid", "omefol"],
  },
  {
    id: "losartan-50",
    brand: "Losar 50",
    salt: "Losartan",
    strength: "50 mg",
    form: "Tablet",
    typicalUse: "Blood pressure",
    rarity: "common",
    mrp: 86,
    genericMrp: 26,
    janAushadhiMrp: 11,
    barcode: "8901101000051",
    aliases: ["losar", "losartan", "repace", "covance"],
  },
  {
    id: "glimepiride-1",
    brand: "Amaryl 1",
    salt: "Glimepiride",
    strength: "1 mg",
    form: "Tablet",
    typicalUse: "Type 2 diabetes",
    rarity: "common",
    mrp: 74,
    genericMrp: 22,
    janAushadhiMrp: 9,
    barcode: "8901101000001",
    aliases: ["amaryl", "glimepiride", "gp 1", "glimestar", "euglim"],
  },
];

export const PHARMACIES: Pharmacy[] = [
  {
    id: "jan-pumpwell",
    name: "Jan Aushadhi Kendra",
    area: "Pumpwell, Mangalore",
    address: "Near Pumpwell Circle, Mangaluru",
    phone: "0824-2401100",
    hours: "9:00 – 20:00",
    pickupHint: "Quietest 10:00–12:00 on weekdays. Carry Aadhaar for scheme rates.",
    stock: [
      { medicineId: "telmisartan-40", qty: 48, etaHours: null, price: 18 },
      { medicineId: "metformin-500", qty: 120, etaHours: null, price: 8 },
      { medicineId: "atorvastatin-10", qty: 36, etaHours: null, price: 12 },
      { medicineId: "pantoprazole-40", qty: 0, etaHours: 24, price: 14 },
      { medicineId: "paracetamol-650", qty: 80, etaHours: null, price: 6 },
      { medicineId: "aspirin-75", qty: 90, etaHours: null, price: 3 },
      { medicineId: "amlodipine-5", qty: 40, etaHours: null, price: 6 },
      { medicineId: "azithromycin-500", qty: 12, etaHours: null, price: 22 },
    ],
  },
  {
    id: "apollo-hampankatta",
    name: "Apollo Pharmacy",
    area: "Hampankatta, Mangalore",
    address: "Balmatta Road, Hampankatta",
    phone: "0824-2441888",
    hours: "8:00 – 22:00",
    pickupHint: "Best after 19:00 — evening staffed, shorter queue than lunch hour.",
    stock: [
      { medicineId: "telmisartan-40", qty: 18, etaHours: null, price: 118 },
      { medicineId: "metformin-500", qty: 40, etaHours: null, price: 38 },
      { medicineId: "atorvastatin-10", qty: 8, etaHours: null, price: 96 },
      { medicineId: "pantoprazole-40", qty: 22, etaHours: null, price: 128 },
      { medicineId: "paracetamol-650", qty: 60, etaHours: null, price: 32 },
      { medicineId: "amox-clav-625", qty: 6, etaHours: null, price: 198 },
      { medicineId: "azithromycin-500", qty: 0, etaHours: 6, price: 119 },
      { medicineId: "aspirin-75", qty: 30, etaHours: null, price: 12 },
      { medicineId: "thyroxine-50", qty: 14, etaHours: null, price: 128 },
    ],
  },
  {
    id: "medplus-kankanady",
    name: "MedPlus",
    area: "Kankanady, Mangalore",
    address: "Kankanady Main Road",
    phone: "0824-2432211",
    hours: "8:30 – 21:30",
    pickupHint: "Open through lunch. Ask for store-brand generic at the counter.",
    stock: [
      { medicineId: "telmisartan-40", qty: 10, etaHours: null, price: 96 },
      { medicineId: "metformin-500", qty: 28, etaHours: null, price: 24 },
      { medicineId: "atorvastatin-10", qty: 0, etaHours: 12, price: 72 },
      { medicineId: "pantoprazole-40", qty: 16, etaHours: null, price: 88 },
      { medicineId: "paracetamol-650", qty: 44, etaHours: null, price: 22 },
      { medicineId: "amox-clav-625", qty: 9, etaHours: null, price: 164 },
      { medicineId: "cetirizine-10", qty: 50, etaHours: null, price: 18 },
      { medicineId: "losartan-50", qty: 11, etaHours: null, price: 64 },
    ],
  },
  {
    id: "city-balmatta",
    name: "City Medicals",
    area: "Balmatta, Mangalore",
    address: "Opposite Jyothi Circle",
    phone: "0824-2420099",
    hours: "8:00 – 21:00",
    pickupHint: "Independent store — call ahead for unusual strengths.",
    stock: [
      { medicineId: "telmisartan-40", qty: 4, etaHours: null, price: 110 },
      { medicineId: "metformin-500", qty: 16, etaHours: null, price: 32 },
      { medicineId: "pantoprazole-40", qty: 8, etaHours: null, price: 118 },
      { medicineId: "paracetamol-650", qty: 20, etaHours: null, price: 30 },
      { medicineId: "aspirin-75", qty: 0, etaHours: 8, price: 12 },
      { medicineId: "glimepiride-1", qty: 7, etaHours: null, price: 70 },
      { medicineId: "omeprazole-20", qty: 19, etaHours: null, price: 58 },
    ],
  },
  {
    id: "wellness-falnir",
    name: "Wellness Forever",
    area: "Falnir, Mangalore",
    address: "Falnir Road, near Unity Hospital",
    phone: "0824-2226700",
    hours: "7:00 – 23:00",
    pickupHint: "Closest late-night option. Best pickup 7:30–9:00 before OPD rush.",
    stock: [
      { medicineId: "telmisartan-40", qty: 22, etaHours: null, price: 118 },
      { medicineId: "metformin-500", qty: 35, etaHours: null, price: 38 },
      { medicineId: "atorvastatin-10", qty: 19, etaHours: null, price: 96 },
      { medicineId: "pantoprazole-40", qty: 14, etaHours: null, price: 128 },
      { medicineId: "paracetamol-650", qty: 70, etaHours: null, price: 32 },
      { medicineId: "amox-clav-625", qty: 11, etaHours: null, price: 198 },
      { medicineId: "azithromycin-500", qty: 8, etaHours: null, price: 119 },
      { medicineId: "thyroxine-50", qty: 6, etaHours: null, price: 128 },
      { medicineId: "montelukast-levocet", qty: 5, etaHours: null, price: 186 },
    ],
  },
];

export const INTERACTIONS: Interaction[] = [
  {
    a: "telmisartan-40",
    b: "aspirin-75",
    level: "caution",
    note: "Telmisartan with aspirin can affect kidney function and potassium. Usually prescribed together — ask if kidney tests are due.",
  },
  {
    a: "metformin-500",
    b: "glimepiride-1",
    level: "caution",
    note: "Both lower blood sugar. Watch for dizziness or sweating; keep a glucose snack nearby.",
  },
  {
    a: "atorvastatin-10",
    b: "azithromycin-500",
    level: "caution",
    note: "Some antibiotics can raise statin levels. Report unexplained muscle pain to your doctor.",
  },
  {
    a: "amox-clav-625",
    b: "pantoprazole-40",
    level: "caution",
    note: "Usually safe together. Take the antibiotic after food if it upsets the stomach.",
  },
];

export const SAMPLE_DISCHARGE = `St. Joseph Medical Centre — Discharge Summary
Patient: Mrs. Kamala Rao, 68 yrs    Date: 18 Sep 2026
Diagnosis: Type 2 Diabetes Mellitus, Hypertension, Dyslipidemia, Acute gastritis

Advice / Rx:
1. Tab Telma 40mg 1-0-0 after breakfast x 30 days
2. Tab Glycomet 500mg 1-0-1 after food x 30 days
3. Tab Atorva 10mg 0-0-1 at night x 30 days
4. Tab Pan 40mg 1-0-0 before breakfast x 14 days
5. Tab Dolo 650mg SOS for fever/pain, max 3 per day x 5 days

Follow up in Medicine OPD after 2 weeks. Monitor BP and fasting sugar at home.
Avoid spicy food for 1 week. Continue diabetic diet.`;

export const SAMPLE_INFECTION = `Dr. D'Souza Clinic, Mangalore
Rx for Master Arjun, 9 yrs

Tab Azithral 500mg 1-0-0 after food x 3 days
Tab Cetzine 10mg 0-0-1 at night x 5 days
Syp / Tab Dolo 650mg SOS for fever

Plenty of fluids. Review if fever persists beyond 48 hours.`;

export function normalizeToken(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\b(tab|tablet|cap|capsule|syp|syrup|inj|injection|mg|mcg|iu)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function findMedicine(query: string): Medicine | undefined {
  const n = normalizeToken(query);
  if (!n) return undefined;
  return (
    MEDICINES.find((m) => normalizeToken(m.brand) === n) ||
    MEDICINES.find((m) => m.aliases.some((a) => n === a || n.includes(a))) ||
    MEDICINES.find((m) => n.includes(normalizeToken(m.salt.split("+")[0] ?? ""))) ||
    MEDICINES.find((m) => m.barcode === query.trim())
  );
}

export function findByBarcode(code: string): Medicine | undefined {
  const c = code.replace(/\s+/g, "");
  return MEDICINES.find((m) => m.barcode === c);
}
