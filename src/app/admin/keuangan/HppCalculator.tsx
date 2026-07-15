"use client";

import { useEffect, useRef, useState } from "react";
import type { HppComponent, HppProduct } from "@/lib/keuangan";
import { fmt, fmtN, parseNum } from "@/lib/keuangan";

const C = {
  dark: "#1C1917",
  gold: "#C8B89A",
  goldD: "#B5935A",
  muted: "#9A8F82",
  line: "rgba(28,25,23,0.12)",
  panel: "#F0EBE3",
  red: "#B3261E",
  white: "#fff",
  rowAlt: "#FBF9F5",
  bg: "#FAF8F4",
};

/**
 * Sama seperti henima-buku-kas-v2.html:
 * - input tidak di-control React saat mengetik (tidak setState tiap huruf)
 * - hanya summary di-update lewat DOM
 * - simpan ke server di-debounce di background
 */
interface Props {
  products: HppProduct[];
  onChange: React.Dispatch<React.SetStateAction<HppProduct[]>>;
}

type Draft = {
  bottles: number;
  comps: HppComponent[];
};

export default function HppCalculator({ products, onChange }: Props) {
  const [selected, setSelected] = useState(0);
  const [newName, setNewName] = useState("");
  const [status, setStatus] = useState("");
  /** Naikkan supaya form me-mount ulang (ganti produk / tambah-hapus baris). */
  const [formKey, setFormKey] = useState(0);

  const product = products[selected] || null;
  const productId = product?.id ?? null;

  const draftRef = useRef<Draft>({ bottles: 50, comps: [{ name: "", cost: 0 }] });
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const productIdRef = useRef<string | null>(null);
  productIdRef.current = productId;

  const totalRowRef = useRef<HTMLTableCellElement>(null);
  const totalRef = useRef<HTMLParagraphElement>(null);
  const perRef = useRef<HTMLParagraphElement>(null);
  const bottlesLabelRef = useRef<HTMLSpanElement>(null);
  const tipRef = useRef<HTMLParagraphElement>(null);

  function loadDraft(p: HppProduct) {
    draftRef.current = {
      bottles: p.bottles || 50,
      comps: (p.components?.length ? p.components : [{ name: "", cost: 0 }]).map((c) => ({
        name: c.name || "",
        cost: Number(c.cost) || 0,
      })),
    };
  }

  function paintSummary() {
    const { bottles, comps } = draftRef.current;
    const total = comps.reduce((s, c) => s + (Number(c.cost) || 0), 0);
    const b = bottles > 0 ? bottles : 1;
    const per = Math.round(total / b);
    if (totalRowRef.current) totalRowRef.current.textContent = fmtN(total);
    if (totalRef.current) totalRef.current.textContent = fmt(total);
    if (perRef.current) perRef.current.textContent = fmt(per);
    if (bottlesLabelRef.current) bottlesLabelRef.current.textContent = `HPP per Botol (${b} botol)`;
    if (tipRef.current) {
      tipRef.current.textContent =
        `Tips: harga jual sehat 2.5–4× HPP → untuk HPP ${fmt(per)}, harga wajar ± ${fmt(per * 3)}. ` +
        "Masukkan juga biaya persyuratan (BPOM, halal), listrik, tenaga kerja, dan penyusutan alat sebagai komponen.";
    }
  }

  function scheduleSave() {
    const id = productIdRef.current;
    if (!id) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    // Jangan setState di sini — biar ketikan 0 re-render (seperti HTML lokal)
    saveTimer.current = setTimeout(async () => {
      const { bottles, comps } = draftRef.current;
      setStatus("Menyimpan…");
      try {
        const res = await fetch(`/api/admin/keuangan/hpp/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bottles: bottles || 1,
            components: comps.map((c) => ({
              name: (c.name || "").trim(),
              cost: Number(c.cost) || 0,
            })),
          }),
        });
        const data = await res.json();
        if (res.ok && data.product) {
          onChange((prev) => prev.map((p) => (p.id === id ? data.product : p)));
          setStatus("Tersimpan");
          setTimeout(() => setStatus(""), 1200);
        } else {
          setStatus(data.error || "Gagal menyimpan");
        }
      } catch {
        setStatus("Gagal menyimpan");
      }
    }, 600);
  }

  // Load draft + remount form hanya saat ganti produk (bukan tiap save)
  useEffect(() => {
    if (!product) return;
    loadDraft(product);
    setFormKey((k) => k + 1);
    // paint setelah mount
    requestAnimationFrame(() => paintSummary());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  async function addProduct() {
    if (!newName.trim()) return;
    const res = await fetch("/api/admin/keuangan/hpp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName.trim() }),
    });
    const data = await res.json();
    if (res.ok) {
      const idx = products.length;
      onChange((prev) => [...prev, data.product]);
      setSelected(idx);
      setNewName("");
    } else {
      alert(data.error || "Gagal menambah produk");
    }
  }

  async function removeProduct() {
    if (!product) return;
    if (!confirm(`Hapus produk "${product.name}" dari kalkulator HPP?`)) return;
    const id = product.id;
    const res = await fetch(`/api/admin/keuangan/hpp/${id}`, { method: "DELETE" });
    if (res.ok) {
      onChange((prev) => prev.filter((p) => p.id !== id));
      setSelected(0);
    }
  }

  function remountFromDraft() {
    setFormKey((k) => k + 1);
    requestAnimationFrame(() => paintSummary());
  }

  const labelStyle: React.CSSProperties = {
    fontSize: 10,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: C.muted,
    marginBottom: 6,
    display: "block",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    border: `1px solid ${C.line}`,
    background: C.white,
    padding: "10px 12px",
    fontSize: 14,
    outline: "none",
    color: C.dark,
    fontFamily: "inherit",
  };

  const btnGhost: React.CSSProperties = {
    background: "transparent",
    color: C.dark,
    border: `1px solid ${C.line}`,
    padding: "8px 16px",
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    cursor: "pointer",
    fontFamily: "inherit",
  };

  const cellInput: React.CSSProperties = {
    border: "none",
    padding: "6px 4px",
    width: "100%",
    fontSize: 13,
    outline: "none",
    fontFamily: "inherit",
    background: "transparent",
  };

  const draft = draftRef.current;

  return (
    <>
      <p style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: C.goldD, fontWeight: 600, marginBottom: 16 }}>
        Kalkulator HPP per Batch
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {products.map((p, i) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setSelected(i)}
            style={{ ...btnGhost, ...(i === selected ? { background: C.dark, color: C.bg } : {}) }}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Nama produk baru"
          style={{ ...inputStyle, maxWidth: 240 }}
        />
        <button type="button" onClick={addProduct} style={btnGhost}>
          + Tambah Produk
        </button>
      </div>

      {product && (
        <div style={{ background: C.white, border: `1px solid ${C.line}`, padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
            <p style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontSize: 22, margin: 0 }}>{product.name}</p>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {status && (
                <span style={{ fontSize: 11, color: status === "Tersimpan" ? "#2E7D32" : C.muted }}>{status}</span>
              )}
              <button type="button" onClick={removeProduct} style={{ ...btnGhost, color: C.red, borderColor: "rgba(179,38,30,0.3)" }}>
                Hapus Produk
              </button>
            </div>
          </div>

          {/* formKey remount hanya saat ganti produk / ubah jumlah baris */}
          <div key={`${productId}-${formKey}`}>
            <div style={{ marginBottom: 20, maxWidth: 220 }}>
              <span style={labelStyle}>Jumlah Botol per Batch</span>
              <input
                inputMode="numeric"
                defaultValue={draft.bottles || 50}
                onChange={(e) => {
                  draftRef.current.bottles = parseNum(e.target.value) || 1;
                  paintSummary();
                  scheduleSave();
                }}
                style={inputStyle}
              />
            </div>

            <span style={labelStyle}>Komponen Biaya per Batch</span>
            <div style={{ overflowX: "auto", border: `1px solid ${C.line}`, marginBottom: 12 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 420 }}>
                <thead>
                  <tr>
                    {["No", "Komponen", "Biaya (Rp)", ""].map((h, i) => (
                      <th
                        key={h || "act"}
                        style={{
                          padding: "10px 12px",
                          fontSize: 10,
                          letterSpacing: 1.5,
                          textTransform: "uppercase",
                          color: C.panel,
                          background: C.dark,
                          textAlign: i === 2 ? "right" : "left",
                          fontWeight: 500,
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {draft.comps.map((c, i) => (
                    <tr key={i} style={{ background: i % 2 === 1 ? C.rowAlt : undefined }}>
                      <td style={{ padding: "9px 12px", color: C.muted, fontSize: 13 }}>{i + 1}</td>
                      <td style={{ padding: "4px 8px" }}>
                        <input
                          defaultValue={c.name}
                          placeholder="bibit, botol, BPOM, listrik…"
                          onInput={(e) => {
                            draftRef.current.comps[i].name = (e.target as HTMLInputElement).value;
                            scheduleSave();
                          }}
                          style={cellInput}
                        />
                      </td>
                      <td style={{ padding: "4px 8px" }}>
                        <input
                          inputMode="numeric"
                          defaultValue={c.cost ? String(c.cost) : ""}
                          placeholder="0"
                          onInput={(e) => {
                            draftRef.current.comps[i].cost = parseNum((e.target as HTMLInputElement).value);
                            paintSummary();
                            scheduleSave();
                          }}
                          style={{ ...cellInput, textAlign: "right" }}
                        />
                      </td>
                      <td style={{ padding: "9px 12px" }}>
                        <button
                          type="button"
                          onClick={() => {
                            draftRef.current.comps = draftRef.current.comps.filter((_, j) => j !== i);
                            if (!draftRef.current.comps.length) {
                              draftRef.current.comps = [{ name: "", cost: 0 }];
                            }
                            remountFromDraft();
                            scheduleSave();
                          }}
                          style={{ ...btnGhost, padding: "3px 9px", fontSize: 9, color: C.red, borderColor: "rgba(179,38,30,0.3)" }}
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  ))}
                  <tr style={{ background: C.panel, fontWeight: 600 }}>
                    <td style={{ padding: "9px 12px" }} />
                    <td style={{ padding: "9px 12px", fontWeight: 700 }}>TOTAL</td>
                    <td
                      ref={totalRowRef}
                      style={{ padding: "9px 12px", textAlign: "right", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}
                    >
                      {fmtN(draft.comps.reduce((s, x) => s + (Number(x.cost) || 0), 0))}
                    </td>
                    <td />
                  </tr>
                </tbody>
              </table>
            </div>

            <button
              type="button"
              onClick={() => {
                draftRef.current.comps.push({ name: "", cost: 0 });
                remountFromDraft();
                scheduleSave();
              }}
              style={{ ...btnGhost, marginBottom: 16 }}
            >
              + Tambah Komponen
            </button>

            <div style={{ marginTop: 24, background: C.dark, padding: 24, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
              <div>
                <span style={{ ...labelStyle, color: C.gold }}>Total Modal per Batch</span>
                <p ref={totalRef} style={{ fontSize: 20, fontWeight: 300, color: C.panel, margin: 0 }}>
                  {fmt(draft.comps.reduce((s, x) => s + (Number(x.cost) || 0), 0))}
                </p>
              </div>
              <div>
                <span ref={bottlesLabelRef} style={{ ...labelStyle, color: C.gold }}>
                  HPP per Botol ({draft.bottles || 1} botol)
                </span>
                <p ref={perRef} style={{ fontSize: 26, color: C.gold, margin: 0 }}>
                  {fmt(
                    Math.round(
                      draft.comps.reduce((s, x) => s + (Number(x.cost) || 0), 0) / (draft.bottles || 1)
                    )
                  )}
                </p>
              </div>
            </div>
            <p ref={tipRef} style={{ fontSize: 11, color: C.muted, marginTop: 10 }} />
          </div>
        </div>
      )}
    </>
  );
}
