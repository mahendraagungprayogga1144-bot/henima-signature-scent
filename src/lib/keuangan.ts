import { supabase } from "@/lib/supabase";

export type KasJenis = "masuk" | "keluar";

export interface KasTransaction {
  id: string;
  jenis: KasJenis;
  tanggal: string;
  kategori: string;
  catatan: string;
  nominal: number;
  purchase_id: string | null;
  order_id: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Purchase {
  id: string;
  tanggal: string;
  nama: string;
  qty: number;
  satuan: string;
  harga_satuan: number;
  total: number;
  supplier: string;
  kas_transaction_id: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface HppComponent {
  name: string;
  cost: number;
}

export interface HppProduct {
  id: string;
  name: string;
  bottles: number;
  components: HppComponent[];
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface FinanceCategories {
  masuk: string[];
  keluar: string[];
}

export const DEFAULT_CATEGORIES: FinanceCategories = {
  masuk: [
    "Penjualan Web",
    "Penjualan Offline",
    "Reseller",
    "Pesanan B2B/Grosir",
    "Modal Masuk",
    "Investor",
    "Lainnya",
  ],
  keluar: [
    "Pembelian Pabrik",
    "Belanja Bahan",
    "Kemasan",
    "Legalitas & Perizinan",
    "Biaya Persyuratan",
    "Ongkir",
    "Iklan/Marketing",
    "Operasional",
    "Sewa/Utilitas",
    "Gaji/Komisi",
    "Pajak",
    "Lainnya",
  ],
};

export function fmt(n: number): string {
  return "Rp " + (Number(n) || 0).toLocaleString("id-ID");
}

export function fmtN(n: number): string {
  return (Number(n) || 0).toLocaleString("id-ID");
}

export function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export function monthKey(d: string): string {
  return (d || "").slice(0, 7);
}

const MONTH_NAMES = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

export function monthLabel(mk: string): string {
  if (!mk) return "";
  const [y, m] = mk.split("-");
  return `${MONTH_NAMES[parseInt(m, 10) - 1]} ${y}`;
}

export function parseNum(v: string | number): number {
  if (typeof v === "number") return Number.isFinite(v) ? Math.trunc(v) : 0;
  const digits = String(v ?? "").replace(/[^\d]/g, "");
  if (!digits) return 0;
  const n = Number(digits);
  return Number.isFinite(n) ? n : 0;
}

/** Format angka ribuan saat mengetik (id-ID). */
export function formatMoneyInput(v: string | number): string {
  const n = parseNum(v);
  return n ? n.toLocaleString("id-ID") : "";
}

export function toCSV(rows: (string | number)[][]): string {
  return rows
    .map((r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(","))
    .join("\n");
}

export function downloadCSV(filename: string, content: string): void {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

export function calcSaldoAwal(kas: KasTransaction[], filterMonth: string): number {
  const sorted = [...kas].sort((a, b) => (a.tanggal + a.id).localeCompare(b.tanggal + b.id));
  return sorted
    .filter((t) => monthKey(t.tanggal) < filterMonth)
    .reduce((s, t) => s + (t.jenis === "masuk" ? t.nominal : -t.nominal), 0);
}

export function calcRunningSaldo(
  kas: KasTransaction[],
  filterMonth: string
): { rows: KasTransaction[]; saldoAwal: number; runningMap: Map<string, number> } {
  const sorted = [...kas].sort((a, b) => (a.tanggal + a.id).localeCompare(b.tanggal + b.id));
  const saldoAwal = calcSaldoAwal(kas, filterMonth);
  const rows = sorted.filter((t) => monthKey(t.tanggal) === filterMonth);
  let running = saldoAwal;
  const runningMap = new Map<string, number>();
  for (const t of rows) {
    running += t.jenis === "masuk" ? t.nominal : -t.nominal;
    runningMap.set(t.id, running);
  }
  return { rows, saldoAwal, runningMap };
}

export async function getFinanceCategories(): Promise<FinanceCategories> {
  const { data } = await supabase.from("settings").select("finance_categories").eq("id", 1).single();
  const cats = data?.finance_categories as FinanceCategories | null;
  if (cats?.masuk && cats?.keluar) return cats;
  return DEFAULT_CATEGORIES;
}

export async function saveFinanceCategories(categories: FinanceCategories): Promise<void> {
  await supabase.from("settings").update({ finance_categories: categories }).eq("id", 1);
}

/** Catat pemasukan otomatis saat order delivered (idempotent via order_id unique) */
export async function recordDeliveredOrderIncome(order: {
  id: string;
  total: number;
  updated_at?: string;
}): Promise<void> {
  const { data: existing } = await supabase
    .from("kas_transactions")
    .select("id")
    .eq("order_id", order.id)
    .maybeSingle();

  if (existing) return;

  const tanggal = order.updated_at?.slice(0, 10) || todayStr();

  const { error } = await supabase.from("kas_transactions").insert({
    jenis: "masuk",
    tanggal,
    kategori: "Penjualan Web",
    catatan: `Order ${order.id} (otomatis)`,
    nominal: order.total || 0,
    order_id: order.id,
  });

  if (error && !error.message.includes("duplicate")) {
    console.error("recordDeliveredOrderIncome:", error.message);
  }
}
