"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { HppProduct } from "@/lib/keuangan";
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

type Row = { key: string; name: string; cost: string };

function rowsFromProduct(p: HppProduct): Row[] {
  const comps = p.components?.length ? p.components : [{ name: "", cost: 0 }];
  return comps.map((c) => ({
    key: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    name: c.name || "",
    cost: c.cost ? String(c.cost) : "",
  }));
}

interface Props {
  products: HppProduct[];
  onChange: React.Dispatch<React.SetStateAction<HppProduct[]>>;
}

export default function HppCalculator({ products, onChange }: Props) {
  const [selected, setSelected] = useState(0);
  const [newName, setNewName] = useState("");
  const [status, setStatus] = useState("");
  const [bottles, setBottles] = useState("50");
  const [rows, setRows] = useState<Row[]>([]);

  /** Produk yang sedang di-edit di form lokal — jangan overwrite dari props setelah sync save. */
  const editingIdRef = useRef<string | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestRef = useRef({ bottles: "50", rows: [] as Row[], id: null as string | null });

  const product = products[selected] || null;

  function hydrate(p: HppProduct) {
    editingIdRef.current = p.id;
    const nextRows = rowsFromProduct(p);
    const nextBottles = String(p.bottles || 50);
    setBottles(nextBottles);
    setRows(nextRows);
    latestRef.current = { bottles: nextBottles, rows: nextRows, id: p.id };
  }

  // Load form HANYA saat user pilih produk berbeda (bukan setelah tiap save)
  useEffect(() => {
    if (!product) {
      editingIdRef.current = null;
      return;
    }
    if (editingIdRef.current === product.id) return;
    hydrate(product);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id, selected]);

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  latestRef.current = { bottles, rows, id: product?.id ?? null };

  const total = useMemo(
    () => rows.reduce((s, r) => s + parseNum(r.cost), 0),
    [rows]
  );
  const bottleN = parseNum(bottles) || 1;
  const per = Math.round(total / bottleN);

  function persist(immediate = false) {
    const id = latestRef.current.id;
    if (!id) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);

    const run = async () => {
      const { bottles: bText, rows: r } = latestRef.current;
      setStatus("Menyimpan…");
      try {
        const payload = {
          bottles: parseNum(bText) || 1,
          components: r.map((x) => ({
            name: x.name.trim(),
            cost: parseNum(x.cost),
          })),
        };
        const res = await fetch(`/api/admin/keuangan/hpp/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) {
          setStatus(data.error || "Gagal menyimpan");
          return;
        }
        // Update parent tanpa mereset form lokal
        onChange((prev) =>
          prev.map((p) =>
            p.id === id
              ? {
                  ...p,
                  ...(data.product || {}),
                  bottles: payload.bottles,
                  components: payload.components,
                }
              : p
          )
        );
        setStatus("Tersimpan");
        window.setTimeout(() => setStatus(""), 1500);
      } catch {
        setStatus("Gagal menyimpan");
      }
    };

    if (immediate) void run();
    else saveTimer.current = setTimeout(run, 800);
  }

  function selectProduct(i: number) {
    // Flush save produk lama dulu
    if (editingIdRef.current && saveTimer.current) {
      clearTimeout(saveTimer.current);
      persist(true);
    }
    editingIdRef.current = null; // force hydrate produk baru
    setSelected(i);
  }

  async function addProduct() {
    if (!newName.trim()) return;
    const res = await fetch("/api/admin/keuangan/hpp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName.trim() }),
    });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Gagal menambah produk");
      return;
    }
    onChange((prev) => [...prev, data.product]);
    setNewName("");
    editingIdRef.current = null;
    setSelected(products.length);
  }

  async function removeProduct() {
    if (!product) return;
    if (!confirm(`Hapus produk "${product.name}" dari kalkulator HPP?`)) return;
    const id = product.id;
    const res = await fetch(`/api/admin/keuangan/hpp/${id}`, { method: "DELETE" });
    if (!res.ok) return;
    editingIdRef.current = null;
    onChange((prev) => prev.filter((p) => p.id !== id));
    setSelected(0);
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
            onClick={() => selectProduct(i)}
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
              <button
                type="button"
                onClick={() => persist(true)}
                style={{ ...btnGhost, background: C.dark, color: C.bg, borderColor: C.dark }}
              >
                Simpan
              </button>
              <button type="button" onClick={removeProduct} style={{ ...btnGhost, color: C.red, borderColor: "rgba(179,38,30,0.3)" }}>
                Hapus Produk
              </button>
            </div>
          </div>

          <div style={{ marginBottom: 20, maxWidth: 220 }}>
            <span style={labelStyle}>Jumlah Botol per Batch</span>
            <input
              inputMode="numeric"
              value={bottles}
              onChange={(e) => setBottles(e.target.value.replace(/[^\d]/g, ""))}
              onBlur={() => persist()}
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
                {rows.map((r, i) => (
                  <tr key={r.key} style={{ background: i % 2 === 1 ? C.rowAlt : undefined }}>
                    <td style={{ padding: "9px 12px", color: C.muted, fontSize: 13 }}>{i + 1}</td>
                    <td style={{ padding: "4px 8px" }}>
                      <input
                        value={r.name}
                        placeholder="bibit, botol, BPOM, listrik…"
                        onChange={(e) => {
                          const v = e.target.value;
                          setRows((prev) => prev.map((x) => (x.key === r.key ? { ...x, name: v } : x)));
                        }}
                        onBlur={() => persist()}
                        style={cellInput}
                      />
                    </td>
                    <td style={{ padding: "4px 8px" }}>
                      <input
                        inputMode="numeric"
                        value={r.cost}
                        placeholder="0"
                        onChange={(e) => {
                          const v = e.target.value.replace(/[^\d]/g, "");
                          setRows((prev) => prev.map((x) => (x.key === r.key ? { ...x, cost: v } : x)));
                        }}
                        onBlur={() => persist()}
                        style={{ ...cellInput, textAlign: "right" }}
                      />
                    </td>
                    <td style={{ padding: "9px 12px" }}>
                      <button
                        type="button"
                        onClick={() => {
                          setRows((prev) => {
                            const next = prev.filter((x) => x.key !== r.key);
                            const final = next.length
                              ? next
                              : [
                                  {
                                    key:
                                      typeof crypto !== "undefined" && crypto.randomUUID
                                        ? crypto.randomUUID()
                                        : `${Date.now()}`,
                                    name: "",
                                    cost: "",
                                  },
                                ];
                            latestRef.current = { ...latestRef.current, rows: final };
                            return final;
                          });
                          setTimeout(() => persist(true), 0);
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
                  <td style={{ padding: "9px 12px", textAlign: "right", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                    {fmtN(total)}
                  </td>
                  <td />
                </tr>
              </tbody>
            </table>
          </div>

          <button
            type="button"
            onClick={() =>
              setRows((prev) => [
                ...prev,
                {
                  key: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`,
                  name: "",
                  cost: "",
                },
              ])
            }
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
              <span style={{ ...labelStyle, color: C.gold }}>HPP per Botol ({bottleN} botol)</span>
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
