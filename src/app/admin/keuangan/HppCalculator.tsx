"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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

type DraftComp = { name: string; costText: string };

function toDraft(components: HppComponent[]): DraftComp[] {
  return (components?.length ? components : [{ name: "", cost: 0 }]).map((c) => ({
    name: c.name || "",
    costText: c.cost ? String(c.cost) : "",
  }));
}

function toPayload(draft: DraftComp[]): HppComponent[] {
  return draft.map((c) => ({
    name: c.name.trim(),
    cost: parseNum(c.costText),
  }));
}

interface Props {
  products: HppProduct[];
  onChange: React.Dispatch<React.SetStateAction<HppProduct[]>>;
}

export default function HppCalculator({ products, onChange }: Props) {
  const [selected, setSelected] = useState(0);
  const [newName, setNewName] = useState("");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  const product = products[selected] || null;

  const [bottlesText, setBottlesText] = useState(product ? String(product.bottles || 50) : "50");
  const [comps, setComps] = useState<DraftComp[]>(product ? toDraft(product.components) : []);

  const productId = product?.id;
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const draftRef = useRef({ bottlesText, comps, productId });
  draftRef.current = { bottlesText, comps, productId };

  // Saat ganti produk, load draft lokalnya (tidak rewrite saat mengetik)
  useEffect(() => {
    if (!product) return;
    setBottlesText(String(product.bottles || 50));
    setComps(toDraft(product.components));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  const total = useMemo(
    () => comps.reduce((s, c) => s + parseNum(c.costText), 0),
    [comps]
  );
  const bottles = parseNum(bottlesText) || 1;
  const per = bottles > 0 ? Math.round(total / bottles) : 0;

  function persistNow(id: string, bottlesVal: number, components: HppComponent[]) {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setSaving(true);
    setStatus("Menyimpan…");
    saveTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/admin/keuangan/hpp/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bottles: bottlesVal, components }),
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
      } finally {
        setSaving(false);
      }
    }, 450);
  }

  function queueSave() {
    const id = draftRef.current.productId;
    if (!id) return;
    const bottlesVal = parseNum(draftRef.current.bottlesText) || 1;
    const components = toPayload(draftRef.current.comps);
    persistNow(id, bottlesVal, components);
  }

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
        <button type="button" onClick={addProduct} style={btnGhost}>+ Tambah Produk</button>
      </div>

      {product && (
        <div style={{ background: C.white, border: `1px solid ${C.line}`, padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
            <p style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontSize: 22, margin: 0 }}>{product.name}</p>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {(saving || status) && (
                <span style={{ fontSize: 11, color: status === "Tersimpan" ? "#2E7D32" : C.muted }}>
                  {status || (saving ? "Menyimpan…" : "")}
                </span>
              )}
              <button type="button" onClick={removeProduct} style={{ ...btnGhost, color: C.red, borderColor: "rgba(179,38,30,0.3)" }}>
                Hapus Produk
              </button>
            </div>
          </div>

          <div style={{ marginBottom: 20, maxWidth: 220 }}>
            <span style={labelStyle}>Jumlah Botol per Batch</span>
            <input
              inputMode="numeric"
              value={bottlesText}
              onChange={(e) => setBottlesText(e.target.value.replace(/[^\d]/g, ""))}
              onBlur={queueSave}
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
                {comps.map((c, i) => (
                  <tr key={i} style={{ background: i % 2 === 1 ? C.rowAlt : undefined }}>
                    <td style={{ padding: "9px 12px", color: C.muted, fontSize: 13 }}>{i + 1}</td>
                    <td style={{ padding: "4px 8px" }}>
                      <input
                        value={c.name}
                        placeholder="bibit, botol, BPOM, listrik…"
                        onChange={(e) => {
                          const next = [...comps];
                          next[i] = { ...next[i], name: e.target.value };
                          setComps(next);
                        }}
                        onBlur={queueSave}
                        style={{ border: "none", padding: "6px 4px", width: "100%", fontSize: 13, outline: "none", fontFamily: "inherit", background: "transparent" }}
                      />
                    </td>
                    <td style={{ padding: "4px 8px" }}>
                      <input
                        inputMode="numeric"
                        value={c.costText}
                        placeholder="0"
                        onChange={(e) => {
                          const next = [...comps];
                          next[i] = { ...next[i], costText: e.target.value.replace(/[^\d]/g, "") };
                          setComps(next);
                        }}
                        onBlur={queueSave}
                        style={{ border: "none", padding: "6px 4px", width: "100%", fontSize: 13, textAlign: "right", outline: "none", fontFamily: "inherit", background: "transparent" }}
                      />
                    </td>
                    <td style={{ padding: "9px 12px" }}>
                      <button
                        type="button"
                        onClick={() => {
                          const next = comps.filter((_, j) => j !== i);
                          const final = next.length ? next : [{ name: "", costText: "" }];
                          setComps(final);
                          draftRef.current = { ...draftRef.current, comps: final };
                          queueSave();
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
                  <td style={{ padding: "9px 12px", textAlign: "right", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{fmtN(total)}</td>
                  <td />
                </tr>
              </tbody>
            </table>
          </div>

          <button
            type="button"
            onClick={() => {
              setComps((prev) => [...prev, { name: "", costText: "" }]);
            }}
            style={{ ...btnGhost, marginBottom: 16 }}
          >
            + Tambah Komponen
          </button>

          <div style={{ marginTop: 24, background: C.dark, padding: 24, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <span style={{ ...labelStyle, color: C.gold }}>Total Modal per Batch</span>
              <p style={{ fontSize: 20, fontWeight: 300, color: C.panel, margin: 0 }}>{fmt(total)}</p>
            </div>
            <div>
              <span style={{ ...labelStyle, color: C.gold }}>HPP per Botol ({bottles} botol)</span>
              <p style={{ fontSize: 26, color: C.gold, margin: 0 }}>{fmt(per)}</p>
            </div>
          </div>
          <p style={{ fontSize: 11, color: C.muted, marginTop: 10 }}>
            Tips: harga jual sehat 2.5–4× HPP → untuk HPP {fmt(per)}, harga wajar ± {fmt(per * 3)}.
            Masukkan juga biaya persyuratan (BPOM, halal), listrik, tenaga kerja, dan penyusutan alat sebagai komponen.
          </p>
        </div>
      )}
    </>
  );
}
