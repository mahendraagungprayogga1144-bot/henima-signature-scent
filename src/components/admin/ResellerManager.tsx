"use client";

import { useState } from "react";
import type { User, ResellerTier } from "@/lib/types";
import { formatRupiah } from "@/lib/format";

const TIER_DEFAULT_KOMISI: Record<ResellerTier, number> = {
  Bronze: 20,
  Silver: 25,
  Gold: 30,
};

export default function ResellerManager({ reseller }: { reseller: User }) {
  const [approved, setApproved] = useState(reseller.reseller?.approved ?? false);
  const [tier, setTier] = useState<ResellerTier>(reseller.reseller?.tier ?? "Bronze");
  const [commissionPct, setCommissionPct] = useState<number>(
    reseller.reseller?.commissionPct ?? TIER_DEFAULT_KOMISI.Bronze
  );
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  async function save() {
    setSaving(true);
    setMsg("");
    try {
      const fd = new FormData();
      fd.set("approved", String(approved));
      fd.set("tier", tier);
      fd.set("commissionPct", String(commissionPct));
      const res = await fetch(`/api/admin/resellers/${reseller.id}`, { method: "POST", body: fd });
      if (!res.ok) {
        setMsg((await res.text()) || "Gagal menyimpan");
        return;
      }
      setMsg("Tersimpan.");
    } catch {
      setMsg("Terjadi kesalahan jaringan.");
    } finally {
      setSaving(false);
    }
  }

  function applyTier(next: ResellerTier) {
    setTier(next);
    setCommissionPct(TIER_DEFAULT_KOMISI[next]);
  }

  const earned = reseller.reseller?.commissionEarned || 0;

  return (
    <div
      style={{
        border: "1px solid #e5e5e5",
        background: "#fff",
        padding: "20px",
        display: "grid",
        gap: 16,
        gridTemplateColumns: "1fr minmax(240px, 320px)",
      }}
    >
      <div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <p style={{ fontSize: 16, fontWeight: 600, margin: 0, color: "#1a1a1a" }}>{reseller.name}</p>
          <span
            style={{
              fontSize: 10,
              letterSpacing: 1,
              textTransform: "uppercase",
              padding: "3px 8px",
              background: approved ? "rgba(46,125,50,0.1)" : "rgba(179,38,30,0.1)",
              color: approved ? "#2E7D32" : "#B3261E",
            }}
          >
            {approved ? "Approved" : "Pending / Rejected"}
          </span>
        </div>
        <p style={{ fontSize: 13, color: "#666", margin: "6px 0 0" }}>
          {reseller.storeName || "Tanpa nama toko"}
        </p>
        <p style={{ fontSize: 12, color: "#888", margin: "8px 0 0" }}>{reseller.email}</p>
        <p style={{ fontSize: 12, color: "#888", margin: "2px 0 0" }}>{reseller.phone || "—"}</p>
        <p style={{ fontSize: 12, color: "#B5935A", margin: "12px 0 0" }}>
          Komisi terkumpul: <strong>{formatRupiah(earned)}</strong>
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <label style={{ fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: "#999" }}>
          Approval
          <select
            value={approved ? "true" : "false"}
            onChange={(e) => setApproved(e.target.value === "true")}
            style={{ display: "block", width: "100%", marginTop: 6, border: "1px solid #ddd", padding: "9px 10px", fontSize: 13 }}
          >
            <option value="true">Approved — boleh order grosir</option>
            <option value="false">Rejected / Pending</option>
          </select>
        </label>
        <label style={{ fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: "#999" }}>
          Tier
          <select
            value={tier}
            onChange={(e) => applyTier(e.target.value as ResellerTier)}
            style={{ display: "block", width: "100%", marginTop: 6, border: "1px solid #ddd", padding: "9px 10px", fontSize: 13 }}
          >
            <option value="Bronze">Bronze (default 20%)</option>
            <option value="Silver">Silver (default 25%)</option>
            <option value="Gold">Gold (default 30%)</option>
          </select>
        </label>
        <label style={{ fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: "#999" }}>
          Komisi (%)
          <input
            type="number"
            min={0}
            max={100}
            step={0.5}
            value={commissionPct}
            onChange={(e) => setCommissionPct(Number(e.target.value) || 0)}
            style={{ display: "block", width: "100%", marginTop: 6, border: "1px solid #ddd", padding: "9px 10px", fontSize: 13 }}
          />
        </label>
        <button
          type="button"
          onClick={save}
          disabled={saving}
          style={{
            background: "#1C1917",
            color: "#FAF8F4",
            border: "none",
            padding: "11px 16px",
            fontSize: 11,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            cursor: "pointer",
            marginTop: 4,
          }}
        >
          {saving ? "Menyimpan…" : "Simpan Reseller"}
        </button>
        {msg && <p style={{ fontSize: 11, color: "#888", margin: 0 }}>{msg}</p>}
      </div>
    </div>
  );
}
