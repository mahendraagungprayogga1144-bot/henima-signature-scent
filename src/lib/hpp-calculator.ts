export const HPP_FIELD_IDS = [
  "totalStok",
  "batch1Qty",
  "cBotol",
  "cBox",
  "cSablonTotal",
  "cBpomTotal",
  "cPpn",
  "bibitHarga",
  "bibitGram",
  "bibitPerBotol",
  "hargaB1",
  "hargaB2",
  "komisiPct",
] as const;

export type HppFieldId = (typeof HPP_FIELD_IDS)[number];

export type HppInputs = Record<HppFieldId, number>;

export interface HppCalculatorProduct {
  id: string;
  slug: string;
  name: string;
  inputs: HppInputs;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export const HPP_DEFAULTS: HppInputs = {
  totalStok: 2000,
  batch1Qty: 540,
  cBotol: 7500,
  cBox: 9000,
  cSablonTotal: 1400000,
  cBpomTotal: 6500000,
  cPpn: 7777,
  bibitHarga: 19540000,
  bibitGram: 14000,
  bibitPerBotol: 25,
  hargaB1: 150000,
  hargaB2: 140000,
  komisiPct: 25,
};

export function normalizeInputs(raw: unknown): HppInputs {
  const src = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const out = { ...HPP_DEFAULTS };
  for (const id of HPP_FIELD_IDS) {
    const v = src[id];
    const n = typeof v === "number" ? v : Number(v);
    out[id] = Number.isFinite(n) ? n : HPP_DEFAULTS[id];
  }
  return out;
}

export function fmtRp(n: number): string {
  return "Rp" + Math.round(n || 0).toLocaleString("id-ID");
}

export function slugifyName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60) || `produk-${Date.now()}`;
}

export interface HppResult {
  batch1Qty: number;
  batch2Qty: number;
  totalStok: number;
  botolBoxPerPcs: number;
  sablonPerPcs: number;
  bpomPerPcs: number;
  cPpn: number;
  bibitPerPcsBatch1: number;
  bibitPerPcsBatch2: number;
  hppBatch1: number;
  hppBatch2: number;
  hargaB1: number;
  hargaB2: number;
  komisiPct: number;
  profitB1: number;
  komisiRp: number;
  marginBersih: number;
  omzetB1: number;
  modalB1: number;
  profitTotalB1: number;
  omzetB2: number;
  modalB2: number;
  profitTotalB2: number;
  totalOmzet: number;
  totalModal: number;
  totalProfit: number;
}

export function calcHpp(inputs: HppInputs): HppResult {
  const totalStok = inputs.totalStok || 0;
  const batch1Qty = inputs.batch1Qty || 0;
  const batch2Qty = Math.max(totalStok - batch1Qty, 0);

  const sablonPerPcs = totalStok > 0 ? inputs.cSablonTotal / totalStok : 0;
  const bpomPerPcs = totalStok > 0 ? inputs.cBpomTotal / totalStok : 0;
  const botolBoxPerPcs = inputs.cBotol + inputs.cBox;
  const bibitPerPcsBatch1 =
    inputs.bibitHarga > 0 && batch1Qty > 0 ? inputs.bibitHarga / batch1Qty : 0;
  const hargaBibitPerGram = inputs.bibitGram > 0 ? inputs.bibitHarga / inputs.bibitGram : 0;
  const bibitPerPcsBatch2 = hargaBibitPerGram * inputs.bibitPerBotol;

  const hppBatch1 =
    botolBoxPerPcs + sablonPerPcs + bpomPerPcs + inputs.cPpn + bibitPerPcsBatch1;
  const hppBatch2 = bibitPerPcsBatch2 + inputs.cPpn;

  const profitB1 = inputs.hargaB1 - hppBatch1;
  const komisiRp = inputs.hargaB1 * (inputs.komisiPct / 100);
  const marginBersih = profitB1 - komisiRp;

  const omzetB1 = batch1Qty * inputs.hargaB1;
  const modalB1 = batch1Qty * hppBatch1;
  const profitTotalB1 = omzetB1 - modalB1;

  const omzetB2 = batch2Qty * inputs.hargaB2;
  const modalB2 = batch2Qty * hppBatch2;
  const profitTotalB2 = omzetB2 - modalB2;

  return {
    batch1Qty,
    batch2Qty,
    totalStok,
    botolBoxPerPcs,
    sablonPerPcs,
    bpomPerPcs,
    cPpn: inputs.cPpn,
    bibitPerPcsBatch1,
    bibitPerPcsBatch2,
    hppBatch1,
    hppBatch2,
    hargaB1: inputs.hargaB1,
    hargaB2: inputs.hargaB2,
    komisiPct: inputs.komisiPct,
    profitB1,
    komisiRp,
    marginBersih,
    omzetB1,
    modalB1,
    profitTotalB1,
    omzetB2,
    modalB2,
    profitTotalB2,
    totalOmzet: omzetB1 + omzetB2,
    totalModal: modalB1 + modalB2,
    totalProfit: profitTotalB1 + profitTotalB2,
  };
}
