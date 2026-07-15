"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import {
  HPP_DEFAULTS,
  SELLER_CHANNELS,
  calcHpp,
  fmtRp,
  getHppWarnings,
  normalizeInputs,
  normalizeSellerChannel,
  type HppCalculatorProduct,
  type HppFieldId,
  type HppInputs,
  type HppResult,
  type SellerChannelId,
} from "@/lib/hpp-calculator";

const FIELD_META: { id: HppFieldId; label: string; hint?: string }[] = [
  { id: "totalStok", label: "Total stok botol & box dibeli (pcs)", hint: "wajib diisi — basis alokasi sablon & BPOM" },
  { id: "batch1Qty", label: "Produksi Batch 1 (pcs)", hint: "cetak pertama — biasanya dibatasi kekuatan bibit" },
  { id: "batch2Qty", label: "Produksi Batch 2 (pcs)", hint: "cetak berikutnya setelah Batch 1 habis terjual" },
  { id: "cBotol", label: "Botol (per pcs)" },
  { id: "cBox", label: "Box (per pcs)" },
  { id: "cSablonTotal", label: "Sablon (total beli)", hint: "dibagi total stok" },
  { id: "cBpomTotal", label: "BPOM/Halal (total, berlaku 4 thn)", hint: "dibagi total stok" },
  { id: "cPpn", label: "PPN + jasa pabrik (per pcs)" },
  { id: "bibitHarga", label: "Bibit — total beli (Rp)" },
  { id: "bibitGram", label: "Bibit — total gram/ml dibeli" },
  { id: "bibitPerBotol", label: "Pemakaian bibit per botol (ml)" },
  { id: "hargaB1", label: "Harga jual Batch 1 (Rp)" },
  { id: "hargaB2", label: "Harga jual Batch 2 (Rp)" },
  { id: "komisiPct", label: "Komisi channel (%)" },
];

const STOCK_IDS: HppFieldId[] = ["totalStok", "batch1Qty", "batch2Qty"];
const UNIT_IDS: HppFieldId[] = ["cBotol", "cBox", "cSablonTotal", "cBpomTotal", "cPpn"];
const BIBIT_IDS: HppFieldId[] = ["bibitHarga", "bibitGram", "bibitPerBotol"];
const PRICE_IDS: HppFieldId[] = ["hargaB1", "hargaB2"];
const KOMISI_IDS: HppFieldId[] = ["komisiPct"];

function parseField(raw: string): number {
  const cleaned = raw.trim().replace(/,/g, ".");
  if (!cleaned) return 0;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

function sellerFromProduct(p: HppCalculatorProduct | null | undefined): SellerChannelId {
  if (!p) return "afiliator";
  const raw = p.inputs as unknown as Record<string, unknown>;
  return normalizeSellerChannel(
    p.seller_channel || raw?.sellerChannel,
    normalizeInputs(p.inputs).komisiPct
  );
}

const FieldRow = memo(function FieldRow({
  id,
  label,
  hint,
  defaultValue,
  onChange,
  warn,
}: {
  id: HppFieldId;
  label: string;
  hint?: string;
  defaultValue: string;
  onChange: (id: HppFieldId, raw: string) => void;
  warn?: boolean;
}) {
  return (
    <div style={styles.fieldRow}>
      <label style={styles.fieldLabel}>
        {label}
        {hint ? <span style={styles.hint}>{hint}</span> : null}
      </label>
      <input
        type="text"
        inputMode="decimal"
        defaultValue={defaultValue}
        onChange={(e) => onChange(id, e.target.value)}
        style={{
          ...styles.input,
          ...(warn ? { borderColor: "#c07061" } : {}),
        }}
        autoComplete="off"
        spellCheck={false}
      />
    </div>
  );
});

const WarningsBanner = memo(function WarningsBanner({
  warnings,
}: {
  warnings: ReturnType<typeof getHppWarnings>;
}) {
  if (!warnings.length) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 16 }}>
      {warnings.map((w) => (
        <div
          key={w.text}
          style={{
            padding: "10px 12px",
            fontSize: 12,
            lineHeight: 1.45,
            border: `1px solid ${
              w.level === "error" ? "#c07061" : w.level === "ok" ? "#7ea08a" : "#8f7a4a"
            }`,
            background:
              w.level === "error"
                ? "rgba(192,112,97,0.12)"
                : w.level === "ok"
                  ? "rgba(126,160,138,0.12)"
                  : "rgba(143,122,74,0.12)",
            color: "#e9e6de",
          }}
        >
          {w.level === "error" ? "⚠ " : w.level === "ok" ? "✓ " : "• "}
          {w.text}
        </div>
      ))}
    </div>
  );
});

const InputsPanel = memo(function InputsPanel({
  formKey,
  seed,
  sellerChannel,
  onChange,
  onSellerChange,
  onFillBatch2,
}: {
  formKey: string;
  seed: HppInputs;
  sellerChannel: SellerChannelId;
  onChange: (id: HppFieldId, raw: string) => void;
  onSellerChange: (id: SellerChannelId) => void;
  onFillBatch2: () => void;
}) {
  function group(ids: HppFieldId[], legend: string, last = false) {
    return (
      <fieldset style={{ ...styles.fieldset, ...(last ? { marginBottom: 0 } : {}) }}>
        <legend style={styles.legend}>{legend}</legend>
        {FIELD_META.filter((f) => ids.includes(f.id)).map((f) => (
          <FieldRow
            key={`${formKey}-${f.id}`}
            id={f.id}
            label={f.label}
            hint={f.hint}
            defaultValue={String(seed[f.id] ?? "")}
            onChange={onChange}
            warn={
              (f.id === "totalStok" && !seed.totalStok) ||
              (f.id === "batch1Qty" && !seed.batch1Qty)
            }
          />
        ))}
      </fieldset>
    );
  }

  return (
    <div style={styles.card}>
      <div style={styles.sectionTitle}>
        <span>Data Masukan</span>
        <span style={{ color: "#c8a45e" }}>01</span>
      </div>

      {group(STOCK_IDS, "Stok & produksi Batch 1 / 2")}
      <button type="button" onClick={onFillBatch2} style={{ ...styles.btnGhost, marginBottom: 18 }}>
        Isi Batch 2 = Total stok − Batch 1
      </button>

      {group(UNIT_IDS, "Biaya per unit — basis total stok")}
      {group(BIBIT_IDS, "Bibit")}

      <fieldset style={{ ...styles.fieldset, marginBottom: 12 }}>
        <legend style={styles.legend}>Channel penjualan (seller)</legend>
        <p style={{ fontSize: 12, color: "#9a998f", margin: "0 0 10px", lineHeight: 1.45 }}>
          Pilih channel — komisi menyesuaikan otomatis. Custom = isi % manual di bawah.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
          {SELLER_CHANNELS.map((ch) => (
            <button
              key={ch.id}
              type="button"
              onClick={() => onSellerChange(ch.id)}
              style={{
                ...styles.pbtn,
                ...(sellerChannel === ch.id
                  ? { borderColor: "#c8a45e", color: "#c8a45e", background: "#1a1710" }
                  : {}),
              }}
            >
              {ch.label}
              {ch.komisiPct !== null ? ` · ${ch.komisiPct}%` : ""}
            </button>
          ))}
        </div>
      </fieldset>

      {group(PRICE_IDS, "Harga jual")}
      {sellerChannel === "custom" ? group(KOMISI_IDS, "Komisi custom", true) : (
        <p style={{ fontSize: 12, color: "#9a998f", margin: 0 }}>
          Komisi channel aktif:{" "}
          <b style={{ color: "#c8a45e" }}>
            {SELLER_CHANNELS.find((c) => c.id === sellerChannel)?.komisiPct ?? 0}%
          </b>
          {" "}— ganti ke Custom untuk isi manual.
        </p>
      )}
    </div>
  );
});

const ResultsPanel = memo(function ResultsPanel({
  result,
  warnings,
  sellerLabel,
}: {
  result: HppResult;
  warnings: ReturnType<typeof getHppWarnings>;
  sellerLabel: string;
}) {
  return (
    <div>
      <WarningsBanner warnings={warnings} />

      <div style={{ ...styles.card, marginTop: warnings.length ? 16 : 0 }}>
        <div style={styles.sectionTitle}>
          <span>HPP Batch 1 (produksi awal)</span>
          <span style={{ color: "#c8a45e" }}>02</span>
        </div>
        <div style={styles.hppHero}>
          <div style={styles.hppNum}>{fmtRp(result.hppBatch1)}</div>
          <div style={styles.hppCap}>
            per botol · {result.batch1Qty.toLocaleString("id-ID")} pcs
          </div>
        </div>
        <div style={styles.stat}>
          <span style={styles.lbl}>Botol + box (alokasi stok)</span>
          <span style={styles.val}>{fmtRp(result.botolBoxPerPcs)}</span>
        </div>
        <div style={styles.stat}>
          <span style={styles.lbl}>Sablon (÷ total stok)</span>
          <span style={styles.val}>{fmtRp(result.sablonPerPcs)}</span>
        </div>
        <div style={styles.stat}>
          <span style={styles.lbl}>BPOM/halal (÷ total stok)</span>
          <span style={styles.val}>{fmtRp(result.bpomPerPcs)}</span>
        </div>
        <div style={styles.stat}>
          <span style={styles.lbl}>PPN + jasa pabrik</span>
          <span style={styles.val}>{fmtRp(result.cPpn)}</span>
        </div>
        <div style={styles.stat}>
          <span style={styles.lbl}>Bibit (total beli ÷ Batch 1)</span>
          <span style={styles.val}>{fmtRp(result.bibitPerPcsBatch1)}</span>
        </div>
        <div style={styles.komisiBox}>
          <div style={styles.stat}>
            <span style={styles.lbl}>Channel: {sellerLabel}</span>
            <span style={styles.val}>{result.komisiPct}%</span>
          </div>
          <div style={styles.stat}>
            <span style={styles.lbl}>Harga jual B1</span>
            <span style={styles.val}>{fmtRp(result.hargaB1)}</span>
          </div>
          <div style={styles.stat}>
            <span style={styles.lbl}>Komisi / botol</span>
            <span style={styles.val}>{fmtRp(result.komisiRpB1)}</span>
          </div>
          <div style={{ ...styles.stat, ...styles.statBig }}>
            <span style={styles.lblBig}>Margin bersih B1</span>
            <span style={styles.valBig}>{fmtRp(result.marginBersihB1)}</span>
          </div>
        </div>
      </div>

      <div style={{ ...styles.card, marginTop: 24 }}>
        <div style={styles.sectionTitle}>
          <span>HPP Batch 2 (cetak ulang)</span>
          <span style={{ color: "#c8a45e" }}>03</span>
        </div>
        <div style={styles.hppHero}>
          <div style={styles.hppNum}>{fmtRp(result.hppBatch2)}</div>
          <div style={styles.hppCap}>
            per botol · {result.batch2Qty.toLocaleString("id-ID")} pcs
          </div>
        </div>
        <div style={styles.stat}>
          <span style={styles.lbl}>Botol/box/sablon/BPOM</span>
          <span style={styles.val}>Rp0 (sudah di Batch 1)</span>
        </div>
        <div style={styles.stat}>
          <span style={styles.lbl}>Bibit baru (harga/ml × pakai)</span>
          <span style={styles.val}>{fmtRp(result.bibitPerPcsBatch2)}</span>
        </div>
        <div style={styles.stat}>
          <span style={styles.lbl}>PPN + jasa pabrik</span>
          <span style={styles.val}>{fmtRp(result.cPpn)}</span>
        </div>
        <div style={styles.komisiBox}>
          <div style={styles.stat}>
            <span style={styles.lbl}>Harga jual B2</span>
            <span style={styles.val}>{fmtRp(result.hargaB2)}</span>
          </div>
          <div style={styles.stat}>
            <span style={styles.lbl}>Komisi / botol</span>
            <span style={styles.val}>{fmtRp(result.komisiRpB2)}</span>
          </div>
          <div style={{ ...styles.stat, ...styles.statBig }}>
            <span style={styles.lblBig}>Margin bersih B2</span>
            <span style={styles.valBig}>{fmtRp(result.marginBersihB2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
});

const ProjectionPanel = memo(function ProjectionPanel({ result }: { result: HppResult }) {
  const produksi = result.batch1Qty + result.batch2Qty;
  return (
    <div style={{ ...styles.card, marginTop: 28 }}>
      <div style={styles.sectionTitle}>
        <span>Proyeksi Total — Batch 1 + Batch 2</span>
        <span style={{ color: "#c8a45e" }}>04</span>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={styles.table}>
          <thead>
            <tr>
              {["Batch", "Pcs", "HPP/botol", "Harga jual", "Omzet", "Modal", "Profit kotor"].map(
                (h, i) => (
                  <th key={h} style={{ ...styles.th, textAlign: i === 0 ? "left" : "right" }}>
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ ...styles.td, textAlign: "left", fontFamily: "var(--font-jost)" }}>
                Batch 1 · produksi awal
              </td>
              <td style={styles.td}>{result.batch1Qty.toLocaleString("id-ID")}</td>
              <td style={styles.td}>{fmtRp(result.hppBatch1)}</td>
              <td style={styles.td}>{fmtRp(result.hargaB1)}</td>
              <td style={styles.td}>{fmtRp(result.omzetB1)}</td>
              <td style={styles.td}>{fmtRp(result.modalB1)}</td>
              <td style={styles.td}>{fmtRp(result.profitTotalB1)}</td>
            </tr>
            <tr>
              <td style={{ ...styles.td, textAlign: "left", fontFamily: "var(--font-jost)" }}>
                Batch 2 · cetak ulang
              </td>
              <td style={styles.td}>{result.batch2Qty.toLocaleString("id-ID")}</td>
              <td style={styles.td}>{fmtRp(result.hppBatch2)}</td>
              <td style={styles.td}>{fmtRp(result.hargaB2)}</td>
              <td style={styles.td}>{fmtRp(result.omzetB2)}</td>
              <td style={styles.td}>{fmtRp(result.modalB2)}</td>
              <td style={styles.td}>{fmtRp(result.profitTotalB2)}</td>
            </tr>
            <tr>
              <td style={{ ...styles.tdTotal, textAlign: "left" }}>
                Total produksi {produksi.toLocaleString("id-ID")} pcs
                {result.totalStok
                  ? ` · stok beli ${result.totalStok.toLocaleString("id-ID")}`
                  : ""}
              </td>
              <td style={styles.tdTotal} />
              <td style={styles.tdTotal} />
              <td style={styles.tdTotal} />
              <td style={styles.tdTotal}>{fmtRp(result.totalOmzet)}</td>
              <td style={styles.tdTotal}>{fmtRp(result.totalModal)}</td>
              <td style={styles.tdTotal}>{fmtRp(result.totalProfit)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div style={styles.note}>
        <b style={{ color: "#8f7a4a" }}>Skema produksi:</b> Batch 1 = cetakan pertama (pikul botol/box/sablon/BPOM
        + bibit). Habis terjual → isi <b>Batch 2</b> berapa pcs yang akan dicetak ulang (hanya bibit baru + PPN).
        <br />
        <br />
        <b style={{ color: "#8f7a4a" }}>Internal PT Henima Collection</b> — cross-check bendahara sebelum keputusan
        besar.
      </div>
    </div>
  );
});

interface Props {
  initialProducts: HppCalculatorProduct[];
}

export default function HppProfitCalculator({ initialProducts }: Props) {
  const [products, setProducts] = useState(initialProducts);
  const [selectedId, setSelectedId] = useState(initialProducts[0]?.id || "");
  const [formKey, setFormKey] = useState(initialProducts[0]?.id || "empty");
  const [seed, setSeed] = useState<HppInputs>(
    initialProducts[0] ? normalizeInputs(initialProducts[0].inputs) : { ...HPP_DEFAULTS }
  );
  const [sellerChannel, setSellerChannel] = useState<SellerChannelId>(
    sellerFromProduct(initialProducts[0])
  );
  const [result, setResult] = useState<HppResult>(() =>
    calcHpp(initialProducts[0] ? normalizeInputs(initialProducts[0].inputs) : HPP_DEFAULTS)
  );
  const [status, setStatus] = useState("Tersimpan");
  const [saving, setSaving] = useState(false);
  const [newName, setNewName] = useState("");
  const [renameValue, setRenameValue] = useState(initialProducts[0]?.name || "");

  const draftRef = useRef<HppInputs>({ ...seed });
  const sellerRef = useRef<SellerChannelId>(sellerChannel);
  const selectedIdRef = useRef(selectedId);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  selectedIdRef.current = selectedId;
  sellerRef.current = sellerChannel;

  const product = products.find((p) => p.id === selectedId) || null;
  const displayWarnings = getHppWarnings(draftRef.current);

  const sellerLabel =
    SELLER_CHANNELS.find((c) => c.id === sellerChannel)?.label.split(" (")[0] || "Custom";

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  const flushSave = useCallback(async (override?: HppInputs) => {
    const id = selectedIdRef.current;
    if (!id) return;
    const payload = normalizeInputs(override || draftRef.current);
    draftRef.current = payload;
    setSaving(true);
    setStatus("Menyimpan…");
    try {
      const res = await fetch(`/api/admin/hpp-calculator/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inputs: payload,
          sellerChannel: sellerRef.current,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus(data.error || "Gagal menyimpan");
        return;
      }
      setProducts((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                inputs: payload,
                seller_channel: sellerRef.current,
                updated_at: data.product?.updated_at,
              }
            : p
        )
      );
      setStatus("Tersimpan");
    } catch {
      setStatus("Gagal menyimpan — angka tetap di layar");
    } finally {
      setSaving(false);
    }
  }, []);

  const scheduleSave = useCallback(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      void flushSave();
    }, 900);
  }, [flushSave]);

  const refreshCalc = useCallback(() => {
    setResult(calcHpp(draftRef.current));
    scheduleSave();
  }, [scheduleSave]);

  const onFieldChange = useCallback(
    (id: HppFieldId, raw: string) => {
      draftRef.current = { ...draftRef.current, [id]: parseField(raw) };
      refreshCalc();
    },
    [refreshCalc]
  );

  const onSellerChange = useCallback(
    (id: SellerChannelId) => {
      setSellerChannel(id);
      sellerRef.current = id;
      const ch = SELLER_CHANNELS.find((c) => c.id === id);
      if (ch && ch.komisiPct !== null) {
        draftRef.current = { ...draftRef.current, komisiPct: ch.komisiPct };
      }
      // remount hanya jika buka/tutup field custom komisi
      setSeed({ ...draftRef.current });
      setFormKey(`${selectedIdRef.current}-ch-${id}-${Date.now()}`);
      setResult(calcHpp(draftRef.current));
      scheduleSave();
    },
    [scheduleSave]
  );

  const onFillBatch2 = useCallback(() => {
    const total = draftRef.current.totalStok || 0;
    const b1 = draftRef.current.batch1Qty || 0;
    const b2 = Math.max(total - b1, 0);
    draftRef.current = { ...draftRef.current, batch2Qty: b2 };
    setSeed({ ...draftRef.current });
    setFormKey((k) => `${selectedIdRef.current}-${Date.now()}`);
    refreshCalc();
  }, [refreshCalc]);

  function loadIntoForm(id: string, next: HppInputs, channel: SellerChannelId) {
    const normalized = normalizeInputs(next);
    draftRef.current = { ...normalized };
    sellerRef.current = channel;
    setSeed(normalized);
    setSellerChannel(channel);
    setResult(calcHpp(normalized));
    setFormKey(`${id}-${Date.now()}`);
  }

  function selectProduct(p: HppCalculatorProduct) {
    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
      void flushSave();
    }
    setSelectedId(p.id);
    setRenameValue(p.name);
    setStatus("Tersimpan");
    loadIntoForm(p.id, p.inputs, sellerFromProduct(p));
  }

  async function addProduct() {
    const name = newName.trim();
    if (!name) return;
    const res = await fetch("/api/admin/hpp-calculator", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, inputs: HPP_DEFAULTS, sellerChannel: "afiliator" }),
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Gagal menambah produk");
      return;
    }
    const p = data.product as HppCalculatorProduct;
    setProducts((prev) => [...prev, p]);
    setNewName("");
    selectProduct(p);
  }

  async function renameProduct() {
    if (!product) return;
    const name = renameValue.trim();
    if (!name || name === product.name) return;
    const res = await fetch(`/api/admin/hpp-calculator/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Gagal mengubah nama");
      setRenameValue(product.name);
      return;
    }
    setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, name } : p)));
    setStatus("Nama disimpan");
  }

  async function deleteProduct() {
    if (!product) return;
    if (!confirm(`Hapus produk "${product.name}"?\nData angka ikut terhapus.`)) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    const id = product.id;
    const res = await fetch(`/api/admin/hpp-calculator/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "Gagal menghapus");
      return;
    }
    const next = products.filter((p) => p.id !== id);
    setProducts(next);
    if (next[0]) selectProduct(next[0]);
    else {
      setSelectedId("");
      setRenameValue("");
      loadIntoForm("empty", HPP_DEFAULTS, "afiliator");
    }
  }

  async function resetDefaults() {
    if (!confirm("Reset angka produk ini ke default Henima?")) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    loadIntoForm(selectedId || "reset", HPP_DEFAULTS, "afiliator");
    await flushSave({ ...HPP_DEFAULTS });
  }

  return (
    <div style={styles.page}>
      <style>{`
        .hpp-pbtn:hover { border-color: #8f7a4a !important; color: #e9e6de !important; }
        .hpp-calc-grid { display: grid; grid-template-columns: 1.15fr 1fr; gap: 28px; margin-top: 24px; }
        @media (max-width: 880px) { .hpp-calc-grid { grid-template-columns: 1fr; } }
        @keyframes hppPulse { 0%,100%{opacity:1} 50%{opacity:.3} }
      `}</style>

      <div style={styles.topbar}>
        <div>
          <div style={styles.eyebrow}>
            <span style={styles.eyebrowLine} />
            Henima Signature Scent — Alat Internal PT
          </div>
          <h1 style={styles.h1}>
            Kalkulator HPP &amp; <em style={{ color: "#c8a45e", fontStyle: "italic" }}>Profit</em> per Produk
          </h1>
          <p style={styles.sub}>
            Rencana Batch 1 (produksi awal) → Batch 2 (cetak ulang). Pilih channel seller, angka tersimpan per produk.
          </p>
        </div>
      </div>

      <div style={styles.wrap}>
        <div style={styles.productRow}>
          {products.map((p) => (
            <button
              key={p.id}
              type="button"
              className="hpp-pbtn"
              onClick={() => selectProduct(p)}
              style={{
                ...styles.pbtn,
                ...(p.id === selectedId
                  ? { borderColor: "#c8a45e", color: "#c8a45e", background: "#1a1710" }
                  : {}),
              }}
            >
              {p.name}
            </button>
          ))}
        </div>

        <div style={styles.addRow}>
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Nama produk baru…"
            style={{ ...styles.input, textAlign: "left", maxWidth: 260 }}
            onKeyDown={(e) => {
              if (e.key === "Enter") void addProduct();
            }}
          />
          <button type="button" onClick={() => void addProduct()} style={styles.btnGhost}>
            + Tambah Produk
          </button>
        </div>

        <div style={styles.statusLine}>
          <span
            style={{
              ...styles.dot,
              background: saving ? "#c8a45e" : "#7ea08a",
              animation: saving ? "hppPulse 1s infinite" : undefined,
            }}
          />
          <span>{status}</span>
          {product && (
            <>
              <button type="button" onClick={() => void resetDefaults()} style={styles.btnReset}>
                Reset ke default
              </button>
              <button type="button" onClick={() => void deleteProduct()} style={{ ...styles.btnReset, marginLeft: 8 }}>
                Hapus produk
              </button>
            </>
          )}
        </div>

        {!product && (
          <div style={{ ...styles.card, marginTop: 24 }}>
            <p style={{ color: "#9a998f", margin: 0 }}>Belum ada produk. Tambahkan produk pertama di atas.</p>
          </div>
        )}

        {product && (
          <>
            <div style={{ ...styles.card, marginTop: 18, padding: "16px 20px" }}>
              <div style={styles.sectionTitle}>
                <span>Nama produk</span>
                <span style={{ color: "#c8a45e" }}>EDIT</span>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <input
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  onBlur={() => void renameProduct()}
                  style={{ ...styles.input, textAlign: "left", maxWidth: 360 }}
                />
                <button type="button" onClick={() => void renameProduct()} style={styles.btnGhost}>
                  Simpan Nama
                </button>
              </div>
            </div>

            <div className="hpp-calc-grid">
              <InputsPanel
                formKey={formKey}
                seed={seed}
                sellerChannel={sellerChannel}
                onChange={onFieldChange}
                onSellerChange={onSellerChange}
                onFillBatch2={onFillBatch2}
              />
              <ResultsPanel result={result} warnings={displayWarnings} sellerLabel={sellerLabel} />
            </div>

            <ProjectionPanel result={result} />
          </>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    background:
      "radial-gradient(1200px 600px at 10% -10%, #1a2119 0%, transparent 60%), radial-gradient(900px 500px at 100% 0%, #201a14 0%, transparent 55%), #0f1210",
    color: "#e9e6de",
    minHeight: "100vh",
    paddingBottom: 80,
  },
  topbar: {
    padding: "40px 24px 24px",
    maxWidth: 1100,
    margin: "0 auto",
    borderBottom: "1px solid #2c322c",
  },
  eyebrow: {
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
    fontSize: 11,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "#c8a45e",
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  eyebrowLine: { width: 16, height: 1, background: "#c8a45e", display: "inline-block" },
  h1: {
    fontFamily: "var(--font-cormorant), Georgia, serif",
    fontWeight: 500,
    fontSize: "clamp(26px, 4vw, 42px)",
    lineHeight: 1.05,
    margin: "14px 0 8px",
    letterSpacing: "-0.01em",
  },
  sub: { color: "#9a998f", fontSize: 14, maxWidth: 640, lineHeight: 1.5, margin: 0 },
  wrap: { maxWidth: 1100, margin: "0 auto", padding: "0 24px" },
  productRow: { display: "flex", gap: 8, flexWrap: "wrap", marginTop: 20 },
  pbtn: {
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
    fontSize: 11.5,
    letterSpacing: "0.03em",
    padding: "9px 14px",
    background: "#0d100e",
    border: "1px solid #2c322c",
    color: "#9a998f",
    cursor: "pointer",
    borderRadius: 2,
  },
  addRow: { display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14, alignItems: "center" },
  btnGhost: {
    background: "transparent",
    color: "#e9e6de",
    border: "1px solid #2c322c",
    padding: "9px 14px",
    fontSize: 11,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  statusLine: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginTop: 18,
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
    fontSize: 11,
    color: "#9a998f",
    flexWrap: "wrap",
  },
  dot: { width: 6, height: 6, borderRadius: "50%", flexShrink: 0 },
  btnReset: {
    marginLeft: "auto",
    background: "none",
    border: "1px solid #2c322c",
    color: "#c07061",
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
    fontSize: 10.5,
    padding: "6px 10px",
    cursor: "pointer",
    borderRadius: 2,
  },
  card: {
    background: "linear-gradient(180deg, #161a17, #1d221e)",
    border: "1px solid #2c322c",
    borderRadius: 2,
    padding: "26px 26px 28px",
    position: "relative",
    boxShadow: "inset 0 2px 0 #c8a45e",
  },
  sectionTitle: {
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
    fontSize: 10.5,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "#9a998f",
    margin: "0 0 18px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  fieldset: { border: "none", padding: 0, margin: "0 0 22px" },
  legend: {
    fontFamily: "var(--font-cormorant), Georgia, serif",
    fontSize: 17,
    color: "#e9e6de",
    marginBottom: 12,
    padding: 0,
  },
  fieldRow: {
    display: "grid",
    gridTemplateColumns: "1fr 130px",
    gap: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  fieldLabel: { fontSize: 13, color: "#9a998f" },
  hint: { fontSize: 11, color: "#8f7a4a", display: "block", marginTop: 2 },
  input: {
    width: "100%",
    background: "#0d100e",
    border: "1px solid #2c322c",
    color: "#e9e6de",
    padding: "9px 10px",
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
    fontSize: 13.5,
    borderRadius: 2,
    textAlign: "right",
  },
  hppHero: { textAlign: "center", padding: "26px 10px 8px" },
  hppNum: {
    fontFamily: "var(--font-cormorant), Georgia, serif",
    fontSize: "clamp(34px, 6vw, 52px)",
    color: "#c8a45e",
    lineHeight: 1,
  },
  hppCap: {
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
    fontSize: 10.5,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "#9a998f",
    marginTop: 10,
  },
  stat: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    padding: "10px 0",
    borderBottom: "1px dashed #2c322c",
    fontSize: 13.5,
  },
  lbl: { color: "#9a998f" },
  val: { fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontWeight: 500 },
  komisiBox: {
    background: "#0d100e",
    border: "1px solid #2c322c",
    borderRadius: 2,
    padding: 16,
    marginTop: 14,
  },
  statBig: {
    padding: "18px 0 0",
    marginTop: 6,
    borderTop: "1px solid #8f7a4a",
    borderBottom: "none",
  },
  lblBig: {
    fontFamily: "var(--font-cormorant), Georgia, serif",
    fontSize: 16,
    color: "#e9e6de",
    fontStyle: "italic",
  },
  valBig: {
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
    fontSize: 26,
    color: "#c8a45e",
    fontWeight: 500,
  },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 13, marginTop: 6, minWidth: 720 },
  th: {
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
    fontSize: 10,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#9a998f",
    padding: "8px 6px",
    borderBottom: "1px solid #2c322c",
    fontWeight: 500,
  },
  td: {
    textAlign: "right",
    padding: "9px 6px",
    borderBottom: "1px dashed #2c322c",
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
  },
  tdTotal: {
    textAlign: "right",
    padding: "12px 6px 9px",
    borderTop: "1px solid #8f7a4a",
    color: "#c8a45e",
    fontWeight: 600,
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
  },
  note: {
    fontSize: 12,
    color: "#9a998f",
    lineHeight: 1.6,
    marginTop: 16,
    paddingTop: 14,
    borderTop: "1px solid #2c322c",
  },
};
