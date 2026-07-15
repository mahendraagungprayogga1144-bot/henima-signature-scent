export const HPP_FIELD_IDS = [
  "totalStok",
  "batch1Qty",
  "batch2Qty",
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
  seller_channel?: string;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export const HPP_DEFAULTS: HppInputs = {
  totalStok: 2000,
  batch1Qty: 540,
  batch2Qty: 1460,
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

/** Channel penjualan — set komisi otomatis (kecuali Custom). */
export const SELLER_CHANNELS = [
  { id: "retail", label: "Retail / Web (tanpa komisi)", komisiPct: 0 },
  { id: "afiliator", label: "Afiliator", komisiPct: 25 },
  { id: "reseller", label: "Reseller", komisiPct: 30 },
  { id: "custom", label: "Custom (isi komisi manual)", komisiPct: null as number | null },
] as const;

export type SellerChannelId = (typeof SELLER_CHANNELS)[number]["id"];

export function normalizeInputs(raw: unknown): HppInputs {
  const src = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const out = { ...HPP_DEFAULTS };
  for (const id of HPP_FIELD_IDS) {
    if (id === "batch2Qty") continue;
    const v = src[id];
    const n = typeof v === "number" ? v : Number(v);
    out[id] = Number.isFinite(n) ? n : HPP_DEFAULTS[id];
  }

  // batch2: pakai nilai tersimpan, atau turun dari total − batch1 (data lama)
  if (src.batch2Qty !== undefined && src.batch2Qty !== null && src.batch2Qty !== "") {
    const n = typeof src.batch2Qty === "number" ? src.batch2Qty : Number(src.batch2Qty);
    out.batch2Qty = Number.isFinite(n) ? n : Math.max(out.totalStok - out.batch1Qty, 0);
  } else {
    out.batch2Qty = Math.max(out.totalStok - out.batch1Qty, 0);
  }

  return out;
}

export function normalizeSellerChannel(raw: unknown, komisiPct: number): SellerChannelId {
  if (typeof raw === "string") {
    const hit = SELLER_CHANNELS.find((c) => c.id === raw);
    if (hit) return hit.id;
  }
  const byKomisi = SELLER_CHANNELS.find((c) => c.komisiPct === komisiPct && c.id !== "custom");
  return byKomisi?.id || "custom";
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

export interface HppWarning {
  level: "error" | "warn" | "ok";
  text: string;
}

export function getHppWarnings(inputs: HppInputs): HppWarning[] {
  const w: HppWarning[] = [];
  const { totalStok, batch1Qty, batch2Qty } = inputs;
  const produksi = batch1Qty + batch2Qty;

  if (!totalStok) {
    w.push({
      level: "error",
      text: "Total stok botol & box masih kosong — Sablon & BPOM jadi Rp0, HPP tidak akurat.",
    });
  }
  if (!batch1Qty) {
    w.push({ level: "error", text: "Jumlah Batch 1 masih kosong — isi berapa botol produksi pertama." });
  }
  if (batch2Qty <= 0 && totalStok > 0) {
    w.push({
      level: "warn",
      text: "Batch 2 = 0. Isi berapa pcs yang akan dicetak/produksi setelah Batch 1 habis.",
    });
  }
  if (totalStok > 0 && produksi > totalStok) {
    w.push({
      level: "error",
      text: `Batch 1+2 (${produksi.toLocaleString("id-ID")}) melebihi total stok (${totalStok.toLocaleString("id-ID")}).`,
    });
  }
  if (totalStok > 0 && produksi > 0 && produksi < totalStok) {
    w.push({
      level: "warn",
      text: `Sisa stok belum dialokasi: ${(totalStok - produksi).toLocaleString("id-ID")} pcs (total − Batch 1 − Batch 2).`,
    });
  }
  if (totalStok > 0 && batch1Qty > 0 && batch2Qty > 0 && produksi === totalStok) {
    w.push({
      level: "ok",
      text: `Alokasi lengkap: Batch 1 ${batch1Qty.toLocaleString("id-ID")} + Batch 2 ${batch2Qty.toLocaleString("id-ID")} = total stok.`,
    });
  }
  return w;
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
  profitB2: number;
  komisiRpB1: number;
  komisiRpB2: number;
  marginBersihB1: number;
  marginBersihB2: number;
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
  const batch2Qty = inputs.batch2Qty || 0;

  const sablonPerPcs = totalStok > 0 ? inputs.cSablonTotal / totalStok : 0;
  const bpomPerPcs = totalStok > 0 ? inputs.cBpomTotal / totalStok : 0;
  const botolBoxPerPcs = inputs.cBotol + inputs.cBox;

  // Batch 1: bibit dialokasi dari total beli bibit / qty batch 1 (sesuai alat HTML)
  const bibitPerPcsBatch1 =
    inputs.bibitHarga > 0 && batch1Qty > 0 ? inputs.bibitHarga / batch1Qty : 0;
  const hargaBibitPerGram = inputs.bibitGram > 0 ? inputs.bibitHarga / inputs.bibitGram : 0;
  // Batch 2: bibit per botol = harga/gram × pemakaian ml (beli bibit baru)
  const bibitPerPcsBatch2 = hargaBibitPerGram * inputs.bibitPerBotol;

  // Batch 1 pikul botol+box+sablon+BPOM (basis total stok) + PPN + bibit batch 1
  const hppBatch1 =
    botolBoxPerPcs + sablonPerPcs + bpomPerPcs + inputs.cPpn + bibitPerPcsBatch1;
  // Batch 2: botol/box/sablon/BPOM sudah dialokasi di batch 1 — hanya bibit baru + PPN
  const hppBatch2 = bibitPerPcsBatch2 + inputs.cPpn;

  const profitB1 = inputs.hargaB1 - hppBatch1;
  const profitB2 = inputs.hargaB2 - hppBatch2;
  const komisiRpB1 = inputs.hargaB1 * (inputs.komisiPct / 100);
  const komisiRpB2 = inputs.hargaB2 * (inputs.komisiPct / 100);
  const marginBersihB1 = profitB1 - komisiRpB1;
  const marginBersihB2 = profitB2 - komisiRpB2;

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
    profitB2,
    komisiRpB1,
    komisiRpB2,
    marginBersihB1,
    marginBersihB2,
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
