"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  HPP_DEFAULTS,
  calcHpp,
  fmtRp,
  normalizeInputs,
  type HppCalculatorProduct,
  type HppFieldId,
  type HppInputs,
} from "@/lib/hpp-calculator";

const FIELD_META: { id: HppFieldId; label: string; hint?: string; step?: string }[] = [
  { id: "totalStok", label: "Total stok botol & box dibeli (pcs)", hint: "basis alokasi biaya stok besar" },
  { id: "batch1Qty", label: "Jumlah botol batch pertama (pcs)", hint: "terbatas oleh kekuatan bibit" },
  { id: "cBotol", label: "Botol (per pcs)" },
  { id: "cBox", label: "Box (per pcs)" },
  { id: "cSablonTotal", label: "Sablon (total beli)", hint: "dibagi total stok" },
  { id: "cBpomTotal", label: "BPOM/Halal (total, berlaku 4 thn)", hint: "dibagi total stok" },
  { id: "cPpn", label: "PPN + jasa pabrik (per pcs)" },
  { id: "bibitHarga", label: "Bibit — total beli (Rp)" },
  { id: "bibitGram", label: "Bibit — total gram/ml dibeli" },
  { id: "bibitPerBotol", label: "Pemakaian bibit per botol (ml)", step: "0.1" },
  { id: "hargaB1", label: "Harga jual batch 1 (Rp)" },
  { id: "hargaB2", label: "Harga jual batch 2 (Rp)" },
  { id: "komisiPct", label: "Komisi afiliator (%)" },
];

interface Props {
  initialProducts: HppCalculatorProduct[];
}

export default function HppProfitCalculator({ initialProducts }: Props) {
  const [products, setProducts] = useState(initialProducts);
  const [selectedId, setSelectedId] = useState(initialProducts[0]?.id || "");
  const [inputs, setInputs] = useState<HppInputs>(
    initialProducts[0] ? normalizeInputs(initialProducts[0].inputs) : { ...HPP_DEFAULTS }
  );
  const [status, setStatus] = useState("Tersimpan");
  const [saving, setSaving] = useState(false);
  const [newName, setNewName] = useState("");
  const [renameValue, setRenameValue] = useState(initialProducts[0]?.name || "");

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const selectedIdRef = useRef(selectedId);
  const inputsRef = useRef(inputs);
  selectedIdRef.current = selectedId;
  inputsRef.current = inputs;

  const product = products.find((p) => p.id === selectedId) || null;
  const result = useMemo(() => calcHpp(inputs), [inputs]);

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  function selectProduct(p: HppCalculatorProduct) {
    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
      void flushSave();
    }
    setSelectedId(p.id);
    setInputs(normalizeInputs(p.inputs));
    setRenameValue(p.name);
    setStatus("Tersimpan");
  }

  async function flushSave(override?: HppInputs) {
    const id = selectedIdRef.current;
    if (!id) return;
    const payload = override || inputsRef.current;
    setSaving(true);
    setStatus("Menyimpan…");
    try {
      const res = await fetch(`/api/admin/hpp-calculator/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputs: payload }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus(data.error || "Gagal menyimpan");
        return;
      }
      setProducts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, inputs: normalizeInputs(payload), updated_at: data.product?.updated_at } : p
        )
      );
      setStatus("Tersimpan");
    } catch {
      setStatus("Gagal menyimpan — angka tetap dipakai di layar ini");
    } finally {
      setSaving(false);
    }
  }

  function scheduleSave() {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setStatus("Mengetik…");
    setSaving(true);
    saveTimer.current = setTimeout(() => {
      void flushSave();
    }, 700);
  }

  function setField(id: HppFieldId, raw: string) {
    const n = raw === "" ? 0 : Number(raw);
    const next = { ...inputsRef.current, [id]: Number.isFinite(n) ? n : 0 };
    setInputs(next);
    scheduleSave();
  }

  async function addProduct() {
    const name = newName.trim();
    if (!name) return;
    const res = await fetch("/api/admin/hpp-calculator", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, inputs: HPP_DEFAULTS }),
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
    if (!confirm(`Hapus produk "${product.name}" dari kalkulator HPP?\nData angka produk ini ikut terhapus.`)) {
      return;
    }
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
      setInputs({ ...HPP_DEFAULTS });
      setRenameValue("");
    }
  }

  async function resetDefaults() {
    if (!confirm("Reset angka produk ini ke default Henima?")) return;
    setInputs({ ...HPP_DEFAULTS });
    if (saveTimer.current) clearTimeout(saveTimer.current);
    await flushSave({ ...HPP_DEFAULTS });
  }

  const stockFields = FIELD_META.filter((f) => f.id === "totalStok" || f.id === "batch1Qty");
  const unitFields = FIELD_META.filter((f) =>
    ["cBotol", "cBox", "cSablonTotal", "cBpomTotal", "cPpn"].includes(f.id)
  );
  const bibitFields = FIELD_META.filter((f) =>
    ["bibitHarga", "bibitGram", "bibitPerBotol"].includes(f.id)
  );
  const sellFields = FIELD_META.filter((f) =>
    ["hargaB1", "hargaB2", "komisiPct"].includes(f.id)
  );

  function Field({ id, label, hint, step }: (typeof FIELD_META)[number]) {
    return (
      <div style={styles.fieldRow}>
        <label style={styles.fieldLabel}>
          {label}
          {hint ? <span style={styles.hint}>{hint}</span> : null}
        </label>
        <input
          type="number"
          step={step || "1"}
          value={Number.isFinite(inputs[id]) ? inputs[id] : 0}
          onChange={(e) => setField(id, e.target.value)}
          style={styles.input}
        />
      </div>
    );
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
            Data tersimpan otomatis per produk. Tambah / hapus / rename produk bebas — khusus internal Henima Collection.
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
            <p style={{ color: "#9a998f", margin: 0 }}>
              Belum ada produk. Tambahkan produk pertama di atas untuk mulai menghitung HPP & profit.
            </p>
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
              <div style={styles.card}>
                <div style={styles.sectionTitle}>
                  <span>Data Masukan</span>
                  <span style={{ color: "#c8a45e" }}>01</span>
                </div>

                <fieldset style={styles.fieldset}>
                  <legend style={styles.legend}>Stok &amp; produksi</legend>
                  {stockFields.map((f) => (
                    <Field key={f.id} {...f} />
                  ))}
                </fieldset>

                <fieldset style={styles.fieldset}>
                  <legend style={styles.legend}>Biaya per unit — basis total stok</legend>
                  {unitFields.map((f) => (
                    <Field key={f.id} {...f} />
                  ))}
                </fieldset>

                <fieldset style={styles.fieldset}>
                  <legend style={styles.legend}>Bibit</legend>
                  {bibitFields.map((f) => (
                    <Field key={f.id} {...f} />
                  ))}
                </fieldset>

                <fieldset style={{ ...styles.fieldset, marginBottom: 0 }}>
                  <legend style={styles.legend}>Harga jual &amp; komisi</legend>
                  {sellFields.map((f) => (
                    <Field key={f.id} {...f} />
                  ))}
                </fieldset>
              </div>

              <div>
                <div style={styles.card}>
                  <div style={styles.sectionTitle}>
                    <span>HPP Batch 1</span>
                    <span style={{ color: "#c8a45e" }}>02</span>
                  </div>
                  <div style={styles.hppHero}>
                    <div style={styles.hppNum}>{fmtRp(result.hppBatch1)}</div>
                    <div style={styles.hppCap}>
                      per botol · {result.batch1Qty.toLocaleString("id-ID")} pcs
                    </div>
                  </div>
                  <div style={styles.stat}>
                    <span style={styles.lbl}>Botol + box (basis stok)</span>
                    <span style={styles.val}>{fmtRp(result.botolBoxPerPcs)}</span>
                  </div>
                  <div style={styles.stat}>
                    <span style={styles.lbl}>Sablon (basis stok)</span>
                    <span style={styles.val}>{fmtRp(result.sablonPerPcs)}</span>
                  </div>
                  <div style={styles.stat}>
                    <span style={styles.lbl}>BPOM/halal (basis stok)</span>
                    <span style={styles.val}>{fmtRp(result.bpomPerPcs)}</span>
                  </div>
                  <div style={styles.stat}>
                    <span style={styles.lbl}>PPN + jasa pabrik</span>
                    <span style={styles.val}>{fmtRp(result.cPpn)}</span>
                  </div>
                  <div style={styles.stat}>
                    <span style={styles.lbl}>Bibit (basis batch 1)</span>
                    <span style={styles.val}>{fmtRp(result.bibitPerPcsBatch1)}</span>
                  </div>
                </div>

                <div style={{ ...styles.card, marginTop: 24 }}>
                  <div style={styles.sectionTitle}>
                    <span>Margin per Botol</span>
                    <span style={{ color: "#c8a45e" }}>03</span>
                  </div>
                  <div style={styles.stat}>
                    <span style={styles.lbl}>Harga jual batch 1</span>
                    <span style={styles.val}>{fmtRp(result.hargaB1)}</span>
                  </div>
                  <div style={styles.stat}>
                    <span style={styles.lbl}>Profit kotor / botol</span>
                    <span style={styles.val}>{fmtRp(result.profitB1)}</span>
                  </div>
                  <div style={styles.komisiBox}>
                    <div style={styles.stat}>
                      <span style={styles.lbl}>Komisi afiliator ({result.komisiPct}%)</span>
                      <span style={styles.val}>{fmtRp(result.komisiRp)}</span>
                    </div>
                    <div style={{ ...styles.stat, ...styles.statBig }}>
                      <span style={styles.lblBig}>Margin bersih / botol</span>
                      <span style={styles.valBig}>{fmtRp(result.marginBersih)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ ...styles.card, marginTop: 28 }}>
              <div style={styles.sectionTitle}>
                <span>Proyeksi Total — Dua Batch</span>
                <span style={{ color: "#c8a45e" }}>04</span>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      {["Batch", "Pcs", "Harga jual", "Omzet", "Modal", "Profit kotor"].map((h, i) => (
                        <th key={h} style={{ ...styles.th, textAlign: i === 0 ? "left" : "right" }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ ...styles.td, textAlign: "left", fontFamily: "var(--font-jost)" }}>Batch 1</td>
                      <td style={styles.td}>{result.batch1Qty.toLocaleString("id-ID")}</td>
                      <td style={styles.td}>{fmtRp(result.hargaB1)}</td>
                      <td style={styles.td}>{fmtRp(result.omzetB1)}</td>
                      <td style={styles.td}>{fmtRp(result.modalB1)}</td>
                      <td style={styles.td}>{fmtRp(result.profitTotalB1)}</td>
                    </tr>
                    <tr>
                      <td style={{ ...styles.td, textAlign: "left", fontFamily: "var(--font-jost)" }}>Batch 2</td>
                      <td style={styles.td}>{result.batch2Qty.toLocaleString("id-ID")}</td>
                      <td style={styles.td}>{fmtRp(result.hargaB2)}</td>
                      <td style={styles.td}>{fmtRp(result.omzetB2)}</td>
                      <td style={styles.td}>{fmtRp(result.modalB2)}</td>
                      <td style={styles.td}>{fmtRp(result.profitTotalB2)}</td>
                    </tr>
                    <tr>
                      <td style={{ ...styles.tdTotal, textAlign: "left" }}>
                        Total ({result.totalStok.toLocaleString("id-ID")} pcs)
                      </td>
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
                <b style={{ color: "#8f7a4a" }}>Cara baca:</b> Batch 1 memikul biaya botol/box/sablon/BPOM (basis
                total stok) + bibit (basis batch 1 saja). Batch 2 hanya menanggung bibit baru + PPN/jasa pabrik —
                botol, box, sablon, dan BPOM sudah dialokasikan di batch 1.
                <br />
                <br />
                <b style={{ color: "#8f7a4a" }}>Internal:</b> Alat hitung operasional PT Henima Collection —
                bukan pembukuan resmi. Cross-check dengan bendahara sebelum keputusan besar.
              </div>
            </div>
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
    margin: "-0px",
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
  sub: { color: "#9a998f", fontSize: 14, maxWidth: 560, lineHeight: 1.5, margin: 0 },
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
  grid: {
    display: "grid",
    gridTemplateColumns: "1.15fr 1fr",
    gap: 28,
    marginTop: 24,
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
  table: { width: "100%", borderCollapse: "collapse", fontSize: 13, marginTop: 6, minWidth: 640 },
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
