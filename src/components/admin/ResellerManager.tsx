"use client";

import { useState } from "react";
import type { User } from "@/lib/types";

export default function ResellerManager({ reseller }: { reseller: User }) {
  const [approved, setApproved] = useState(reseller.reseller?.approved ?? true);
  const [tier, setTier] = useState<"Bronze" | "Silver" | "Gold">(
    reseller.reseller?.tier ?? "Bronze"
  );
  const [commissionPct, setCommissionPct] = useState<number>(
    reseller.reseller?.commissionPct ?? 0
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
        const text = await res.text();
        setMsg(text || "Gagal menyimpan");
        return;
      }
      setMsg("Tersimpan.");
    } catch {
      setMsg("Terjadi kesalahan jaringan.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="card">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-lg font-semibold text-ink-50">{reseller.name}</p>
          <p className="text-sm text-ink-300">{reseller.storeName}</p>
          <p className="mt-2 text-sm text-ink-300">{reseller.email}</p>
          <p className="text-sm text-ink-300">{reseller.phone}</p>
        </div>

        <div className="w-full max-w-sm space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="label">Approval</label>
              <select
                className="input-field"
                value={approved ? "true" : "false"}
                onChange={(e) => setApproved(e.target.value === "true")}
              >
                <option value="true">Approved</option>
                <option value="false">Rejected</option>
              </select>
            </div>
            <div>
              <label className="label">Tier</label>
              <select className="input-field" value={tier} onChange={(e) => setTier(e.target.value as any)}>
                <option value="Bronze">Bronze</option>
                <option value="Silver">Silver</option>
                <option value="Gold">Gold</option>
              </select>
            </div>
          </div>
          <div>
            <label className="label">Komisi (%)</label>
            <input
              type="number"
              min={0}
              max={100}
              step={0.5}
              className="input-field"
              value={commissionPct}
              onChange={(e) => setCommissionPct(Number(e.target.value) || 0)}
            />
          </div>

          <button type="button" className="btn-primary w-full" onClick={save} disabled={saving}>
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
          {msg && <p className="text-xs text-ink-300">{msg}</p>}
        </div>
      </div>
    </div>
  );
}

