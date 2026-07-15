"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type {
  KasTransaction,
  Purchase,
  HppProduct,
  HppComponent,
  FinanceCategories,
  KasJenis,
} from "@/lib/keuangan";
import {
  fmt,
  fmtN,
  todayStr,
  monthKey,
  monthLabel,
  parseNum,
  formatMoneyInput,
  toCSV,
  downloadCSV,
  calcRunningSaldo,
} from "@/lib/keuangan";

const C = {
  bg: "#FAF8F4",
  dark: "#1C1917",
  gold: "#C8B89A",
  goldD: "#B5935A",
  muted: "#9A8F82",
  line: "rgba(28,25,23,0.12)",
  panel: "#F0EBE3",
  green: "#2E7D32",
  red: "#B3261E",
  white: "#fff",
  rowAlt: "#FBF9F5",
};

const SATUAN_OPTS = ["pcs", "botol", "ml", "liter", "kg", "gram", "pack", "lusin", "dus/karton", "batch"];
const TABS = ["dashboard", "kas", "belanja", "hpp"] as const;
type TabId = (typeof TABS)[number];

interface Props {
  initialKas: KasTransaction[];
  initialPurchases: Purchase[];
  initialHpp: HppProduct[];
  initialCategories: FinanceCategories;
}

export default function KeuanganClient({
  initialKas,
  initialPurchases,
  initialHpp,
  initialCategories,
}: Props) {
  const [tab, setTab] = useState<TabId>("dashboard");
  const [kas, setKas] = useState(initialKas);
  const [purchases, setPurchases] = useState(initialPurchases);
  const [hpp, setHpp] = useState(initialHpp);
  const [kategori, setKategori] = useState(initialCategories);

  // Kas form
  const [kasEditId, setKasEditId] = useState<string | null>(null);
  const [kasJenis, setKasJenis] = useState<KasJenis>("keluar");
  const [kasTanggal, setKasTanggal] = useState(todayStr());
  const [kasKategori, setKasKategori] = useState(kategori.keluar[0] || "");
  const [kasNominal, setKasNominal] = useState("");
  const [kasCatatan, setKasCatatan] = useState("");
  const [filterMonth, setFilterMonth] = useState(monthKey(todayStr()));
  const [katNewMasuk, setKatNewMasuk] = useState("");
  const [katNewKeluar, setKatNewKeluar] = useState("");

  // Belanja form
  const [belanjaEditId, setBelanjaEditId] = useState<string | null>(null);
  const [bTanggal, setBTanggal] = useState(todayStr());
  const [bNama, setBNama] = useState("");
  const [bQty, setBQty] = useState("");
  const [bSatuan, setBSatuan] = useState("pcs");
  const [bHarga, setBHarga] = useState("");
  const [bSupplier, setBSupplier] = useState("");
  const [bMasukKas, setBMasukKas] = useState(true);
  const [bKategoriKas, setBKategoriKas] = useState("Pembelian Pabrik");

  // HPP
  const [hppSelected, setHppSelected] = useState(0);
  const [hppNewName, setHppNewName] = useState("");
  const [hppSaving, setHppSaving] = useState(false);
  const hppSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hppRef = useRef(hpp);
  hppRef.current = hpp;

  useEffect(() => {
    return () => {
      if (hppSaveTimer.current) clearTimeout(hppSaveTimer.current);
    };
  }, []);

  const resetKasForm = useCallback(() => {
    setKasEditId(null);
    setKasJenis("keluar");
    setKasTanggal(todayStr());
    setKasKategori(kategori.keluar[0] || "");
    setKasNominal("");
    setKasCatatan("");
  }, [kategori]);

  const switchKasJenis = (j: KasJenis) => {
    setKasJenis(j);
    setKasKategori(kategori[j][0] || "");
  };

  async function saveKas() {
    const nominal = parseNum(kasNominal);
    if (!nominal || !kasTanggal) return alert("Isi tanggal dan nominal dulu.");

    const payload = { jenis: kasJenis, tanggal: kasTanggal, kategori: kasKategori, catatan: kasCatatan, nominal };

    if (kasEditId) {
      const res = await fetch(`/api/admin/keuangan/kas/${kasEditId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        setKas((prev) => prev.map((t) => (t.id === kasEditId ? data.transaction : t)));
        resetKasForm();
      } else alert(data.error);
    } else {
      const res = await fetch("/api/admin/keuangan/kas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        setKas((prev) => [...prev, data.transaction]);
        resetKasForm();
      } else alert(data.error);
    }
  }

  function editKas(id: string) {
    const t = kas.find((x) => x.id === id);
    if (!t) return;
    setKasEditId(id);
    setKasJenis(t.jenis);
    setKasTanggal(t.tanggal);
    setKasKategori(t.kategori);
    setKasNominal(fmtN(t.nominal));
    setKasCatatan(t.catatan || "");
    setTab("kas");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function removeKas(id: string) {
    if (!confirm("Hapus transaksi ini? Tidak bisa dibatalkan.")) return;
    const res = await fetch(`/api/admin/keuangan/kas/${id}`, { method: "DELETE" });
    if (res.ok) {
      setKas((prev) => prev.filter((t) => t.id !== id));
      if (kasEditId === id) resetKasForm();
    }
  }

  async function katAdd(jenis: "masuk" | "keluar", name: string) {
    if (!name.trim()) return;
    const res = await fetch("/api/admin/keuangan/categories", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "add", jenis, name: name.trim() }),
    });
    const data = await res.json();
    if (res.ok) {
      setKategori(data.categories);
      if (jenis === "masuk") setKatNewMasuk("");
      else setKatNewKeluar("");
    } else alert(data.error);
  }

  async function katRemove(jenis: "masuk" | "keluar", name: string) {
    const dipakai = kas.some((t) => t.jenis === jenis && t.kategori === name);
    const msg = dipakai
      ? `Kategori "${name}" sudah dipakai di beberapa transaksi. Transaksi lama tetap menyimpan nama ini. Hapus dari daftar?`
      : `Hapus kategori "${name}"?`;
    if (!confirm(msg)) return;
    const res = await fetch("/api/admin/keuangan/categories", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "remove", jenis, name }),
    });
    const data = await res.json();
    if (res.ok) setKategori(data.categories);
  }

  async function katReset() {
    if (!confirm("Kembalikan kategori ke bawaan? Kategori tambahan kamu akan hilang (transaksi lama tetap aman).")) return;
    const res = await fetch("/api/admin/keuangan/categories", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reset" }),
    });
    const data = await res.json();
    if (res.ok) setKategori(data.categories);
  }

  function kasExportCSV() {
    const { rows, saldoAwal, runningMap } = calcRunningSaldo(kas, filterMonth);
    const r: (string | number)[][] = [["No", "Tanggal", "Kategori", "Keterangan", "Debit (Masuk)", "Kredit (Keluar)", "Saldo"]];
    r.push(["", "", "", `SALDO AWAL ${monthLabel(filterMonth).toUpperCase()}`, "", "", saldoAwal]);
    rows.forEach((t, i) => {
      r.push([
        i + 1,
        t.tanggal,
        t.kategori,
        t.catatan || "",
        t.jenis === "masuk" ? t.nominal : "",
        t.jenis === "keluar" ? t.nominal : "",
        runningMap.get(t.id) || 0,
      ]);
    });
    const tMasuk = rows.filter((t) => t.jenis === "masuk").reduce((s, t) => s + t.nominal, 0);
    const tKeluar = rows.filter((t) => t.jenis === "keluar").reduce((s, t) => s + t.nominal, 0);
    r.push(["", "", "", "JUMLAH", tMasuk, tKeluar, saldoAwal + tMasuk - tKeluar]);
    downloadCSV(`buku-kas-henima-${filterMonth}.csv`, toCSV(r));
  }

  async function saveBelanja() {
    const qty = parseNum(bQty);
    const harga = parseNum(bHarga);
    if (!bNama.trim()) return alert("Isi nama barang dulu.");
    if (!bTanggal) return alert("Isi tanggal dulu.");
    if (!qty) return alert("Qty harus lebih dari 0. Contoh: 1 atau 500");
    if (!harga) return alert("Harga satuan harus diisi. Contoh: 6500000 (akan jadi 6.500.000)");
    const total = qty * harga;

    const payload = {
      tanggal: bTanggal,
      nama: bNama.trim(),
      qty,
      satuan: bSatuan,
      harga_satuan: harga,
      supplier: bSupplier,
      masuk_kas: belanjaEditId ? undefined : bMasukKas,
      kategori_kas: bKategoriKas,
    };

    if (belanjaEditId) {
      const res = await fetch(`/api/admin/keuangan/purchases/${belanjaEditId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        setPurchases((prev) => prev.map((b) => (b.id === belanjaEditId ? data.purchase : b)));
        if (data.kasTransaction) {
          setKas((prev) => prev.map((t) => (t.id === data.kasTransaction.id ? data.kasTransaction : t)));
        }
        resetBelanjaForm();
        alert("Pembelian berhasil diupdate.");
      } else alert(data.error || "Gagal menyimpan pembelian");
    } else {
      const res = await fetch("/api/admin/keuangan/purchases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        setPurchases((prev) => [data.purchase, ...prev]);
        if (data.kasTransaction) setKas((prev) => [...prev, data.kasTransaction]);
        resetBelanjaForm();
        alert(`Pembelian tersimpan. Total ${fmt(total)}${bMasukKas ? " · sudah masuk Buku Kas" : ""}`);
      } else alert(data.error || "Gagal menyimpan pembelian");
    }
  }

  function resetBelanjaForm() {
    setBelanjaEditId(null);
    setBTanggal(todayStr());
    setBNama("");
    setBQty("");
    setBSatuan("pcs");
    setBHarga("");
    setBSupplier("");
    setBMasukKas(true);
  }

  function editBelanja(id: string) {
    const b = purchases.find((x) => x.id === id);
    if (!b) return;
    setBelanjaEditId(id);
    setBTanggal(b.tanggal);
    setBNama(b.nama);
    setBQty(fmtN(b.qty));
    setBSatuan(b.satuan);
    setBHarga(fmtN(b.harga_satuan));
    setBSupplier(b.supplier || "");
    setTab("belanja");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function removeBelanja(id: string) {
    const b = purchases.find((x) => x.id === id);
    if (!b) return;
    if (!confirm(`Hapus pembelian "${b.nama}"?${b.kas_transaction_id ? " Catatan kas terkait juga akan dihapus." : ""}`)) return;
    const res = await fetch(`/api/admin/keuangan/purchases/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (res.ok) {
      setPurchases((prev) => prev.filter((x) => x.id !== id));
      if (data.deletedKasId) setKas((prev) => prev.filter((t) => t.id !== data.deletedKasId));
      if (belanjaEditId === id) resetBelanjaForm();
    }
  }

  function belanjaExportCSV() {
    const sorted = [...purchases].sort((a, b) => a.tanggal.localeCompare(b.tanggal));
    const r: (string | number)[][] = [["No", "Tanggal", "Nama Barang", "Qty", "Satuan", "Harga Satuan", "Total", "Supplier"]];
    sorted.forEach((b, i) => r.push([i + 1, b.tanggal, b.nama, b.qty, b.satuan, b.harga_satuan, b.total, b.supplier || ""]));
    downloadCSV(`belanja-henima-${todayStr()}.csv`, toCSV(r));
  }

  async function hppAddProduct() {
    if (!hppNewName.trim()) return;
    const res = await fetch("/api/admin/keuangan/hpp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: hppNewName.trim() }),
    });
    const data = await res.json();
    if (res.ok) {
      setHpp((prev) => [...prev, data.product]);
      setHppSelected(hpp.length);
      setHppNewName("");
    }
  }

  async function hppRemoveProduct() {
    const p = hpp[hppSelected];
    if (!p) return;
    if (!confirm(`Hapus produk "${p.name}" dari kalkulator HPP?`)) return;
    const res = await fetch(`/api/admin/keuangan/hpp/${p.id}`, { method: "DELETE" });
    if (res.ok) {
      setHpp((prev) => prev.filter((_, i) => i !== hppSelected));
      setHppSelected(0);
    }
  }

  /** Update lokal langsung (lancar), simpan ke server setelah berhenti mengetik. */
  function scheduleHppSave(id: string) {
    if (hppSaveTimer.current) clearTimeout(hppSaveTimer.current);
    setHppSaving(true);
    hppSaveTimer.current = setTimeout(async () => {
      const product = hppRef.current.find((p) => p.id === id);
      if (!product) {
        setHppSaving(false);
        return;
      }
      try {
        const res = await fetch(`/api/admin/keuangan/hpp/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bottles: product.bottles,
            components: product.components,
            name: product.name,
          }),
        });
        const data = await res.json();
        if (res.ok && data.product) {
          setHpp((prev) => prev.map((p) => (p.id === id ? data.product : p)));
        }
      } finally {
        setHppSaving(false);
      }
    }, 500);
  }

  function hppSetBottles(bottles: number) {
    const id = hpp[hppSelected]?.id;
    if (!id) return;
    setHpp((prev) =>
      prev.map((p, idx) => (idx === hppSelected ? { ...p, bottles: bottles || 1 } : p))
    );
    scheduleHppSave(id);
  }

  function hppSetComp(i: number, patch: Partial<HppComponent>) {
    const id = hpp[hppSelected]?.id;
    if (!id) return;
    setHpp((prev) =>
      prev.map((p, idx) => {
        if (idx !== hppSelected) return p;
        const components = p.components.map((c, ci) => (ci === i ? { ...c, ...patch } : c));
        return { ...p, components };
      })
    );
    scheduleHppSave(id);
  }

  function hppAddComp() {
    const id = hpp[hppSelected]?.id;
    if (!id) return;
    setHpp((prev) =>
      prev.map((p, idx) =>
        idx === hppSelected ? { ...p, components: [...p.components, { name: "", cost: 0 }] } : p
      )
    );
    scheduleHppSave(id);
  }

  function hppRemoveComp(i: number) {
    const id = hpp[hppSelected]?.id;
    if (!id) return;
    setHpp((prev) =>
      prev.map((p, idx) =>
        idx === hppSelected ? { ...p, components: p.components.filter((_, j) => j !== i) } : p
      )
    );
    scheduleHppSave(id);
  }

  // Derived data
  const saldo = kas.reduce((s, t) => s + (t.jenis === "masuk" ? t.nominal : -t.nominal), 0);
  const tm = monthKey(todayStr());
  const masukBulan = kas.filter((t) => t.jenis === "masuk" && monthKey(t.tanggal) === tm).reduce((s, t) => s + t.nominal, 0);
  const keluarBulan = kas.filter((t) => t.jenis === "keluar" && monthKey(t.tanggal) === tm).reduce((s, t) => s + t.nominal, 0);
  const laba = masukBulan - keluarBulan;

  const months = [...new Set(kas.map((t) => monthKey(t.tanggal)))].sort().reverse();
  if (!months.includes(tm)) months.unshift(tm);
  const activeMonth = months.includes(filterMonth) ? filterMonth : months[0] || tm;

  const { rows: kasRows, saldoAwal, runningMap } = calcRunningSaldo(kas, activeMonth);
  const tMasuk = kasRows.filter((t) => t.jenis === "masuk").reduce((s, t) => s + t.nominal, 0);
  const tKeluar = kasRows.filter((t) => t.jenis === "keluar").reduce((s, t) => s + t.nominal, 0);
  const saldoAkhir = saldoAwal + tMasuk - tKeluar;

  const perKat: Record<string, number> = {};
  kas.filter((t) => t.jenis === "keluar" && monthKey(t.tanggal) === tm).forEach((t) => {
    perKat[t.kategori] = (perKat[t.kategori] || 0) + t.nominal;
  });

  const recent = [...kas].sort((a, b) => (b.tanggal + b.id).localeCompare(a.tanggal + a.id)).slice(0, 6);
  const belanjaSorted = [...purchases].sort((a, b) => (b.tanggal + b.id).localeCompare(a.tanggal + a.id));
  const totalBelanja = purchases.reduce((s, b) => s + b.total, 0);
  const bTotal = parseNum(bQty) * parseNum(bHarga);

  const hppProduct = hpp[hppSelected];
  const hppTotal = hppProduct?.components.reduce((s, c) => s + (Number(c.cost) || 0), 0) || 0;
  const hppPer = hppProduct && hppProduct.bottles > 0 ? Math.round(hppTotal / hppProduct.bottles) : 0;

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

  const btnStyle: React.CSSProperties = {
    background: C.dark,
    color: C.bg,
    border: "none",
    padding: "12px 24px",
    fontSize: 11,
    letterSpacing: 2,
    textTransform: "uppercase",
    cursor: "pointer",
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

  const secTitle: React.CSSProperties = {
    fontSize: 10,
    letterSpacing: 3,
    textTransform: "uppercase",
    color: C.goldD,
    fontWeight: 600,
    marginBottom: 16,
  };

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "var(--font-jost)", color: C.dark, margin: "-0px" }}>
      {/* Header */}
      <div style={{ background: C.dark, padding: "28px 24px 0" }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
            <div>
              <p style={{ fontFamily: "var(--font-cormorant)", fontSize: 22, letterSpacing: 8, textTransform: "uppercase", color: C.panel, fontWeight: 300, margin: 0 }}>Henima</p>
              <p style={{ fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: C.gold, marginTop: 2 }}>PT Henima Collection Indonesia · Buku Kas</p>
            </div>
          </div>
          <div style={{ display: "flex", overflowX: "auto", marginTop: 16 }}>
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  padding: "12px 20px",
                  fontSize: 11,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  color: tab === t ? C.panel : "rgba(200,184,154,0.5)",
                  borderBottom: tab === t ? `2px solid ${C.gold}` : "2px solid transparent",
                  whiteSpace: "nowrap",
                }}
              >
                {t === "dashboard" ? "Dashboard" : t === "kas" ? "Buku Kas" : t === "belanja" ? "Belanja" : "HPP"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 980, margin: "0 auto", padding: "32px 24px 80px" }}>
        {/* DASHBOARD */}
        {tab === "dashboard" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 16, marginBottom: 32 }}>
              <div style={{ background: C.dark, border: "none", padding: 20 }}>
                <span style={{ ...labelStyle, color: C.gold }}>Saldo Kas</span>
                <p style={{ fontSize: 24, fontWeight: 300, color: C.panel, margin: 0 }}>{fmt(saldo)}</p>
              </div>
              <div style={{ background: C.white, border: `1px solid ${C.line}`, padding: 20 }}>
                <span style={labelStyle}>Masuk Bulan Ini</span>
                <p style={{ fontSize: 20, color: C.green, margin: 0 }}>{fmt(masukBulan)}</p>
              </div>
              <div style={{ background: C.white, border: `1px solid ${C.line}`, padding: 20 }}>
                <span style={labelStyle}>Keluar Bulan Ini</span>
                <p style={{ fontSize: 20, color: C.red, margin: 0 }}>{fmt(keluarBulan)}</p>
              </div>
              <div style={{ background: C.white, border: `1px solid ${C.line}`, padding: 20 }}>
                <span style={labelStyle}>Laba Bulan Ini</span>
                <p style={{ fontSize: 20, color: laba >= 0 ? C.green : C.red, margin: 0 }}>{fmt(laba)}</p>
              </div>
            </div>

            <p style={secTitle}>Pengeluaran per Kategori — {monthLabel(tm)}</p>
            <div style={{ background: C.white, border: `1px solid ${C.line}`, padding: 0, marginBottom: 32 }}>
              {Object.entries(perKat).sort((a, b) => b[1] - a[1]).map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 20px", borderBottom: `1px solid ${C.panel}`, fontSize: 13 }}>
                  <span>{k}</span>
                  <span style={{ fontWeight: 500, color: C.red }}>{fmt(v)}</span>
                </div>
              ))}
              {Object.keys(perKat).length === 0 && (
                <p style={{ padding: "16px 20px", fontSize: 13, color: C.muted, margin: 0 }}>Belum ada pengeluaran bulan ini.</p>
              )}
            </div>

            <p style={secTitle}>HPP per Botol</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
              {hpp.map((p) => {
                const total = p.components.reduce((s, c) => s + (Number(c.cost) || 0), 0);
                const per = p.bottles > 0 ? Math.round(total / p.bottles) : 0;
                return (
                  <div key={p.id} style={{ background: C.white, border: `1px solid ${C.line}`, padding: 20 }}>
                    <p style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontSize: 17, marginBottom: 6 }}>{p.name}</p>
                    <p style={{ fontSize: 20, fontWeight: 500, margin: 0 }}>
                      {fmt(per)}
                      <span style={{ fontSize: 11, color: C.muted, fontWeight: 300 }}> /botol</span>
                    </p>
                    <p style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>{p.bottles} botol/batch · modal {fmt(total)}</p>
                  </div>
                );
              })}
              {hpp.length === 0 && <p style={{ fontSize: 13, color: C.muted }}>Belum ada produk. Tambahkan di tab HPP.</p>}
            </div>

            <p style={secTitle}>Transaksi Terakhir</p>
            <div style={{ background: C.white, border: `1px solid ${C.line}`, padding: 0 }}>
              {recent.map((t) => (
                <div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 20px", borderBottom: `1px solid ${C.panel}` }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 500, margin: 0 }}>{t.kategori}{t.catatan ? ` — ${t.catatan}` : ""}</p>
                    <p style={{ fontSize: 11, color: C.muted, margin: 0 }}>{t.tanggal}</p>
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 500, color: t.jenis === "masuk" ? C.green : C.red, margin: 0 }}>
                    {t.jenis === "masuk" ? "+" : "−"} {fmt(t.nominal)}
                  </p>
                </div>
              ))}
              {recent.length === 0 && <p style={{ padding: 20, fontSize: 13, color: C.muted, margin: 0 }}>Belum ada transaksi. Mulai catat di tab Buku Kas.</p>}
            </div>
          </>
        )}

        {/* BUKU KAS */}
        {tab === "kas" && (
          <>
            <p style={secTitle}>{kasEditId ? "Edit Transaksi" : "Catat Transaksi"}</p>
            <div style={{ background: C.white, border: `1px solid ${kasEditId ? C.goldD : C.line}`, padding: 20, marginBottom: 20 }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                {(["keluar", "masuk"] as const).map((j) => (
                  <button
                    key={j}
                    onClick={() => switchKasJenis(j)}
                    style={{
                      ...btnGhost,
                      flex: 1,
                      ...(kasJenis === j ? { background: C.dark, color: C.bg } : {}),
                    }}
                  >
                    {j === "keluar" ? "Keluar (Kredit)" : "Masuk (Debit)"}
                  </button>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 12 }}>
                <div>
                  <span style={labelStyle}>Tanggal</span>
                  <input type="date" value={kasTanggal} onChange={(e) => setKasTanggal(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <span style={labelStyle}>Kategori</span>
                  <select value={kasKategori} onChange={(e) => setKasKategori(e.target.value)} style={inputStyle}>
                    {kategori[kasJenis].map((k) => (
                      <option key={k} value={k}>{k}</option>
                    ))}
                    {!kategori[kasJenis].includes(kasKategori) && kasKategori && (
                      <option value={kasKategori}>{kasKategori}</option>
                    )}
                  </select>
                </div>
                <div>
                  <span style={labelStyle}>Nominal (Rp)</span>
                  <input
                    inputMode="numeric"
                    value={kasNominal}
                    onChange={(e) => setKasNominal(formatMoneyInput(e.target.value))}
                    placeholder="15.000.000"
                    style={inputStyle}
                  />
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <span style={labelStyle}>Keterangan</span>
                <input value={kasCatatan} onChange={(e) => setKasCatatan(e.target.value)} placeholder="misal: DP produksi 500 botol ke pabrik" style={inputStyle} />
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={saveKas} style={btnStyle}>{kasEditId ? "Simpan Perubahan" : "Simpan Transaksi"}</button>
                {kasEditId && <button onClick={resetKasForm} style={btnGhost}>Batal Edit</button>}
              </div>
            </div>

            <details style={{ border: `1px solid ${C.line}`, background: C.white, marginBottom: 32 }}>
              <summary style={{ padding: "14px 20px", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", cursor: "pointer", color: C.goldD, fontWeight: 600 }}>
                ⚙ Kelola Kategori (tambah / hapus sendiri)
              </summary>
              <div style={{ padding: "0 20px 20px" }}>
                <p style={{ ...labelStyle, marginTop: 8 }}>Kategori Pengeluaran (Kredit)</p>
                <div style={{ marginBottom: 10 }}>
                  {kategori.keluar.map((k) => (
                    <span key={k} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: C.panel, padding: "6px 8px 6px 14px", fontSize: 12, margin: "0 6px 8px 0" }}>
                      {k}
                      <button onClick={() => katRemove("keluar", k)} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 14, padding: "0 4px" }} title="Hapus">×</button>
                    </span>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 8, marginBottom: 20, maxWidth: 420 }}>
                  <input value={katNewKeluar} onChange={(e) => setKatNewKeluar(e.target.value)} placeholder="misal: Riset & Sampel, Asuransi…" style={inputStyle} />
                  <button onClick={() => katAdd("keluar", katNewKeluar)} style={{ ...btnGhost, whiteSpace: "nowrap" }}>+ Tambah</button>
                </div>
                <p style={labelStyle}>Kategori Pemasukan (Debit)</p>
                <div style={{ marginBottom: 10 }}>
                  {kategori.masuk.map((k) => (
                    <span key={k} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: C.panel, padding: "6px 8px 6px 14px", fontSize: 12, margin: "0 6px 8px 0" }}>
                      {k}
                      <button onClick={() => katRemove("masuk", k)} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 14, padding: "0 4px" }} title="Hapus">×</button>
                    </span>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 8, marginBottom: 16, maxWidth: 420 }}>
                  <input value={katNewMasuk} onChange={(e) => setKatNewMasuk(e.target.value)} placeholder="misal: Hibah, Penjualan Event…" style={inputStyle} />
                  <button onClick={() => katAdd("masuk", katNewMasuk)} style={{ ...btnGhost, whiteSpace: "nowrap" }}>+ Tambah</button>
                </div>
                <button onClick={katReset} style={{ ...btnGhost, color: C.muted }}>Reset ke Bawaan</button>
                <p style={{ fontSize: 11, color: C.muted, marginTop: 10 }}>Menghapus kategori tidak menghapus transaksi lama — transaksi lama tetap menyimpan nama kategorinya.</p>
              </div>
            </details>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
              <p style={{ ...secTitle, marginBottom: 0 }}>Buku Kas — {monthLabel(activeMonth)}</p>
              <div style={{ display: "flex", gap: 8 }}>
                <select value={activeMonth} onChange={(e) => setFilterMonth(e.target.value)} style={{ ...inputStyle, width: "auto" }}>
                  {months.map((m) => (
                    <option key={m} value={m}>{monthLabel(m)}</option>
                  ))}
                </select>
                <button onClick={kasExportCSV} style={btnGhost}>Export CSV</button>
              </div>
            </div>

            <div style={{ overflowX: "auto", border: `1px solid ${C.line}`, background: C.white }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 720 }}>
                <thead>
                  <tr>
                    {["No", "Tanggal", "Kategori", "Keterangan", "Debit (Masuk)", "Kredit (Keluar)", "Saldo", "Aksi"].map((h, i) => (
                      <th key={h} style={{
                        padding: "10px 12px", fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase",
                        color: C.panel, background: C.dark, textAlign: i >= 4 && i <= 6 ? "right" : "left",
                        whiteSpace: "nowrap", fontWeight: 500,
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ background: C.panel, fontWeight: 600 }}>
                    <td style={{ padding: "9px 12px", borderBottom: `1px solid ${C.panel}` }} />
                    <td colSpan={3} style={{ padding: "9px 12px", borderBottom: `1px solid ${C.panel}` }}>Saldo Awal {monthLabel(activeMonth)}</td>
                    <td style={{ padding: "9px 12px", borderBottom: `1px solid ${C.panel}`, textAlign: "right" }} />
                    <td style={{ padding: "9px 12px", borderBottom: `1px solid ${C.panel}`, textAlign: "right" }} />
                    <td style={{ padding: "9px 12px", borderBottom: `1px solid ${C.panel}`, textAlign: "right", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{fmtN(saldoAwal)}</td>
                    <td style={{ padding: "9px 12px", borderBottom: `1px solid ${C.panel}` }} />
                  </tr>
                  {kasRows.map((t, i) => (
                    <tr key={t.id} style={{ background: i % 2 === 1 ? C.rowAlt : undefined }}>
                      <td style={{ padding: "9px 12px", fontSize: 13, borderBottom: `1px solid ${C.panel}`, color: C.muted }}>{i + 1}</td>
                      <td style={{ padding: "9px 12px", fontSize: 13, borderBottom: `1px solid ${C.panel}`, whiteSpace: "nowrap" }}>{t.tanggal}</td>
                      <td style={{ padding: "9px 12px", fontSize: 13, borderBottom: `1px solid ${C.panel}`, whiteSpace: "nowrap" }}>
                        {t.kategori}{t.purchase_id ? " 🔗" : ""}{t.order_id ? " 📦" : ""}
                      </td>
                      <td style={{ padding: "9px 12px", fontSize: 13, borderBottom: `1px solid ${C.panel}`, whiteSpace: "normal", minWidth: 160 }}>{t.catatan || "—"}</td>
                      <td style={{ padding: "9px 12px", fontSize: 13, borderBottom: `1px solid ${C.panel}`, textAlign: "right", color: C.green, fontWeight: t.jenis === "masuk" ? 600 : 400, fontVariantNumeric: "tabular-nums" }}>
                        {t.jenis === "masuk" ? fmtN(t.nominal) : ""}
                      </td>
                      <td style={{ padding: "9px 12px", fontSize: 13, borderBottom: `1px solid ${C.panel}`, textAlign: "right", color: C.red, fontWeight: t.jenis === "keluar" ? 600 : 400, fontVariantNumeric: "tabular-nums" }}>
                        {t.jenis === "keluar" ? fmtN(t.nominal) : ""}
                      </td>
                      <td style={{ padding: "9px 12px", fontSize: 13, borderBottom: `1px solid ${C.panel}`, textAlign: "right", fontWeight: 500, fontVariantNumeric: "tabular-nums" }}>
                        {fmtN(runningMap.get(t.id) || 0)}
                      </td>
                      <td style={{ padding: "9px 12px", fontSize: 13, borderBottom: `1px solid ${C.panel}`, whiteSpace: "nowrap" }}>
                        <button onClick={() => editKas(t.id)} style={{ ...btnGhost, padding: "3px 9px", fontSize: 9, letterSpacing: 1, marginRight: 4 }}>Edit</button>
                        <button onClick={() => removeKas(t.id)} style={{ ...btnGhost, padding: "3px 9px", fontSize: 9, letterSpacing: 1, color: C.red, borderColor: "rgba(179,38,30,0.3)" }}>×</button>
                      </td>
                    </tr>
                  ))}
                  {kasRows.length === 0 && (
                    <tr><td colSpan={8} style={{ textAlign: "center", color: C.muted, padding: 24 }}>Belum ada transaksi di bulan ini.</td></tr>
                  )}
                  <tr style={{ background: C.dark }}>
                    <td style={{ padding: "9px 12px", color: C.panel, fontWeight: 700, borderBottom: "none" }} />
                    <td colSpan={3} style={{ padding: "9px 12px", color: C.panel, fontWeight: 700, borderBottom: "none" }}>JUMLAH</td>
                    <td style={{ padding: "9px 12px", color: "#8FD694", fontWeight: 700, textAlign: "right", borderBottom: "none", fontVariantNumeric: "tabular-nums" }}>{fmtN(tMasuk)}</td>
                    <td style={{ padding: "9px 12px", color: "#F2B8B5", fontWeight: 700, textAlign: "right", borderBottom: "none", fontVariantNumeric: "tabular-nums" }}>{fmtN(tKeluar)}</td>
                    <td style={{ padding: "9px 12px", color: C.gold, fontWeight: 700, textAlign: "right", borderBottom: "none", fontVariantNumeric: "tabular-nums" }}>{fmtN(saldoAkhir)}</td>
                    <td style={{ borderBottom: "none" }} />
                  </tr>
                </tbody>
              </table>
            </div>
            <p style={{ fontSize: 11, color: C.muted, marginTop: 10 }}>
              Saldo Akhir {monthLabel(activeMonth)}: <strong style={{ color: C.dark }}>{fmt(saldoAkhir)}</strong>
              {" · "}ikon 🔗 = tercatat otomatis dari tab Belanja · 📦 = dari order delivered
            </p>
          </>
        )}

        {/* BELANJA */}
        {tab === "belanja" && (
          <>
            <p style={secTitle}>{belanjaEditId ? "Edit Pembelian" : "Catat Pembelian Barang / Order Pabrik"}</p>
            <p style={{ fontSize: 12, color: C.muted, marginTop: -8, marginBottom: 16 }}>
              Tab ini untuk beli barang/bahan (misal fragrance, botol). Untuk biaya seperti <strong>Biaya Persyuratan / Notaris / Sewa</strong>, pakai tab <strong>Buku Kas</strong> → Keluar.
            </p>
            <div style={{ background: C.white, border: `1px solid ${belanjaEditId ? C.goldD : C.line}`, padding: 20, marginBottom: 32 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 12 }}>
                <div>
                  <span style={labelStyle}>Tanggal</span>
                  <input type="date" value={bTanggal} onChange={(e) => setBTanggal(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <span style={labelStyle}>Nama Barang</span>
                  <input
                    value={bNama}
                    onChange={(e) => {
                      const name = e.target.value;
                      setBNama(name);
                      const lower = name.toLowerCase();
                      if (/pers(y)?uratan|notaris|legalitas|izin/.test(lower)) {
                        const match = kategori.keluar.find((k) => /pers(y)?uratan|legalitas/i.test(k));
                        if (match) setBKategoriKas(match);
                      }
                    }}
                    placeholder="misal: Fragrance oil / Botol 50ml"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <span style={labelStyle}>Supplier / Pabrik</span>
                  <input value={bSupplier} onChange={(e) => setBSupplier(e.target.value)} placeholder="PT Pabrik Parfum Surabaya" style={inputStyle} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 12, marginBottom: 12 }}>
                <div>
                  <span style={labelStyle}>Qty</span>
                  <input
                    inputMode="numeric"
                    value={bQty}
                    onChange={(e) => setBQty(formatMoneyInput(e.target.value))}
                    placeholder="500"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <span style={labelStyle}>Satuan</span>
                  <select value={bSatuan} onChange={(e) => setBSatuan(e.target.value)} style={inputStyle}>
                    {SATUAN_OPTS.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <span style={labelStyle}>Harga Satuan</span>
                  <input
                    inputMode="numeric"
                    value={bHarga}
                    onChange={(e) => setBHarga(formatMoneyInput(e.target.value))}
                    placeholder="6.500.000"
                    style={inputStyle}
                  />
                </div>
                <div>
                  <span style={labelStyle}>Total</span>
                  <div style={{ border: `1px solid ${C.line}`, background: C.panel, padding: "10px 12px", fontSize: 14, fontWeight: 500 }}>
                    {fmt(bTotal)}
                  </div>
                  <p style={{ fontSize: 10, color: C.muted, marginTop: 4 }}>
                    {parseNum(bQty) || 0} × {fmtN(parseNum(bHarga))}
                  </p>
                </div>
              </div>
              {!belanjaEditId && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, alignItems: "end" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer" }}>
                    <input type="checkbox" checked={bMasukKas} onChange={(e) => setBMasukKas(e.target.checked)} style={{ width: "auto" }} />
                    Catat otomatis ke Buku Kas
                  </label>
                  <div>
                    <span style={labelStyle}>Sebagai Kategori</span>
                    <select value={bKategoriKas} onChange={(e) => setBKategoriKas(e.target.value)} style={inputStyle}>
                      {kategori.keluar.map((k) => <option key={k}>{k}</option>)}
                    </select>
                  </div>
                </div>
              )}
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button onClick={saveBelanja} style={btnStyle}>{belanjaEditId ? "Simpan Perubahan" : "Simpan Pembelian"}</button>
                {belanjaEditId && <button onClick={resetBelanjaForm} style={btnGhost}>Batal Edit</button>}
              </div>
              {belanjaEditId && <p style={{ fontSize: 11, color: C.muted, marginTop: 10 }}>Catatan kas yang terhubung ikut diperbarui otomatis.</p>}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
              <p style={{ ...secTitle, marginBottom: 0 }}>
                Riwayat Belanja <span style={{ color: C.muted, fontWeight: 400 }}>· total {fmt(totalBelanja)}</span>
              </p>
              <button onClick={belanjaExportCSV} style={btnGhost}>Export CSV</button>
            </div>

            <div style={{ overflowX: "auto", border: `1px solid ${C.line}`, background: C.white }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 720 }}>
                <thead>
                  <tr>
                    {["No", "Tanggal", "Nama Barang", "Qty", "Satuan", "Harga Satuan", "Total", "Supplier", "Aksi"].map((h, i) => (
                      <th key={h} style={{
                        padding: "10px 12px", fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase",
                        color: C.panel, background: C.dark, textAlign: [3, 5, 6].includes(i) ? "right" : "left",
                        whiteSpace: "nowrap", fontWeight: 500,
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {belanjaSorted.map((b, i) => (
                    <tr key={b.id} style={{ background: i % 2 === 1 ? C.rowAlt : undefined }}>
                      <td style={{ padding: "9px 12px", fontSize: 13, borderBottom: `1px solid ${C.panel}`, color: C.muted }}>{i + 1}</td>
                      <td style={{ padding: "9px 12px", fontSize: 13, borderBottom: `1px solid ${C.panel}`, whiteSpace: "nowrap" }}>{b.tanggal}</td>
                      <td style={{ padding: "9px 12px", fontSize: 13, borderBottom: `1px solid ${C.panel}`, whiteSpace: "normal", minWidth: 140 }}>
                        {b.nama}{b.kas_transaction_id ? " 🔗" : ""}
                      </td>
                      <td style={{ padding: "9px 12px", fontSize: 13, borderBottom: `1px solid ${C.panel}`, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{fmtN(b.qty)}</td>
                      <td style={{ padding: "9px 12px", fontSize: 13, borderBottom: `1px solid ${C.panel}` }}>{b.satuan}</td>
                      <td style={{ padding: "9px 12px", fontSize: 13, borderBottom: `1px solid ${C.panel}`, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{fmtN(b.harga_satuan)}</td>
                      <td style={{ padding: "9px 12px", fontSize: 13, borderBottom: `1px solid ${C.panel}`, textAlign: "right", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{fmtN(b.total)}</td>
                      <td style={{ padding: "9px 12px", fontSize: 13, borderBottom: `1px solid ${C.panel}` }}>{b.supplier || "—"}</td>
                      <td style={{ padding: "9px 12px", fontSize: 13, borderBottom: `1px solid ${C.panel}`, whiteSpace: "nowrap" }}>
                        <button onClick={() => editBelanja(b.id)} style={{ ...btnGhost, padding: "3px 9px", fontSize: 9, letterSpacing: 1, marginRight: 4 }}>Edit</button>
                        <button onClick={() => removeBelanja(b.id)} style={{ ...btnGhost, padding: "3px 9px", fontSize: 9, letterSpacing: 1, color: C.red, borderColor: "rgba(179,38,30,0.3)" }}>×</button>
                      </td>
                    </tr>
                  ))}
                  {belanjaSorted.length === 0 && (
                    <tr><td colSpan={9} style={{ textAlign: "center", color: C.muted, padding: 24 }}>Belum ada pembelian tercatat.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* HPP */}
        {tab === "hpp" && (
          <>
            <p style={secTitle}>Kalkulator HPP per Batch</p>
            <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
              {hpp.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => setHppSelected(i)}
                  style={{ ...btnGhost, ...(i === hppSelected ? { background: C.dark, color: C.bg } : {}) }}
                >
                  {p.name}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
              <input value={hppNewName} onChange={(e) => setHppNewName(e.target.value)} placeholder="Nama produk baru" style={{ ...inputStyle, maxWidth: 240 }} />
              <button onClick={hppAddProduct} style={btnGhost}>+ Tambah Produk</button>
            </div>

            {hppProduct && (
              <div style={{ background: C.white, border: `1px solid ${C.line}`, padding: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
                  <p style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontSize: 22, margin: 0 }}>{hppProduct.name}</p>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    {hppSaving && <span style={{ fontSize: 11, color: C.muted }}>Menyimpan…</span>}
                    <button type="button" onClick={hppRemoveProduct} style={{ ...btnGhost, color: C.red, borderColor: "rgba(179,38,30,0.3)" }}>Hapus Produk</button>
                  </div>
                </div>
                <div style={{ marginBottom: 20, maxWidth: 220 }}>
                  <span style={labelStyle}>Jumlah Botol per Batch</span>
                  <input
                    inputMode="numeric"
                    value={hppProduct.bottles || ""}
                    onChange={(e) => hppSetBottles(parseNum(e.target.value))}
                    style={inputStyle}
                  />
                </div>
                <span style={labelStyle}>Komponen Biaya per Batch</span>
                <div style={{ overflowX: "auto", border: `1px solid ${C.line}`, marginBottom: 12 }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 420 }}>
                    <thead>
                      <tr>
                        {["No", "Komponen", "Biaya (Rp)", ""].map((h, i) => (
                          <th key={h || "act"} style={{
                            padding: "10px 12px", fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase",
                            color: C.panel, background: C.dark, textAlign: i === 2 ? "right" : "left", fontWeight: 500,
                          }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {hppProduct.components.map((c, i) => (
                        <tr key={i} style={{ background: i % 2 === 1 ? C.rowAlt : undefined }}>
                          <td style={{ padding: "9px 12px", color: C.muted, fontSize: 13 }}>{i + 1}</td>
                          <td style={{ padding: "4px 8px" }}>
                            <input
                              value={c.name}
                              placeholder="bibit, botol, BPOM, listrik…"
                              onChange={(e) => hppSetComp(i, { name: e.target.value })}
                              style={{ border: "none", padding: "6px 4px", width: "100%", fontSize: 13, outline: "none", fontFamily: "inherit", background: "transparent" }}
                            />
                          </td>
                          <td style={{ padding: "4px 8px" }}>
                            <input
                              inputMode="numeric"
                              value={c.cost ? formatMoneyInput(c.cost) : ""}
                              onChange={(e) => hppSetComp(i, { cost: parseNum(e.target.value) })}
                              placeholder="0"
                              style={{ border: "none", padding: "6px 4px", width: "100%", fontSize: 13, textAlign: "right", outline: "none", fontFamily: "inherit", background: "transparent" }}
                            />
                          </td>
                          <td style={{ padding: "9px 12px" }}>
                            <button
                              type="button"
                              onClick={() => hppRemoveComp(i)}
                              style={{ ...btnGhost, padding: "3px 9px", fontSize: 9, color: C.red, borderColor: "rgba(179,38,30,0.3)" }}
                            >×</button>
                          </td>
                        </tr>
                      ))}
                      <tr style={{ background: C.panel, fontWeight: 600 }}>
                        <td style={{ padding: "9px 12px" }} />
                        <td style={{ padding: "9px 12px", fontWeight: 700 }}>TOTAL</td>
                        <td style={{ padding: "9px 12px", textAlign: "right", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{fmtN(hppTotal)}</td>
                        <td />
                      </tr>
                    </tbody>
                  </table>
                </div>
                <button
                  type="button"
                  onClick={hppAddComp}
                  style={{ ...btnGhost, marginBottom: 16 }}
                >+ Tambah Komponen</button>
                <div style={{ marginTop: 24, background: C.dark, padding: 24, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
                  <div>
                    <span style={{ ...labelStyle, color: C.gold }}>Total Modal per Batch</span>
                    <p style={{ fontSize: 20, fontWeight: 300, color: C.panel, margin: 0 }}>{fmt(hppTotal)}</p>
                  </div>
                  <div>
                    <span style={{ ...labelStyle, color: C.gold }}>HPP per Botol ({hppProduct.bottles} botol)</span>
                    <p style={{ fontSize: 26, color: C.gold, margin: 0 }}>{fmt(hppPer)}</p>
                  </div>
                </div>
                <p style={{ fontSize: 11, color: C.muted, marginTop: 10 }}>
                  Tips: harga jual sehat 2.5–4× HPP → untuk HPP {fmt(hppPer)}, harga wajar ± {fmt(hppPer * 3)}.
                  Masukkan juga biaya persyuratan (BPOM, halal), listrik, tenaga kerja, dan penyusutan alat sebagai komponen.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
