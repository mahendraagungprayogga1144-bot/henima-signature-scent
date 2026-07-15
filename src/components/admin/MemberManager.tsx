"use client";

import { useState } from "react";
import type { User } from "@/lib/types";

export default function MemberManager({ member }: { member: User }) {
  const [role, setRole] = useState<User["role"]>(member.role);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  async function save() {
    setSaving(true);
    setMsg("");
    try {
      const fd = new FormData();
      fd.set("action", "update");
      fd.set("role", role);
      fd.set("approved", "true");
      const res = await fetch(`/api/admin/members/${member.id}`, { method: "POST", body: fd });
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

  async function remove() {
    if (!confirm(`Hapus akun "${member.name}"?`)) return;
    setSaving(true);
    try {
      const fd = new FormData();
      fd.set("action", "delete");
      const res = await fetch(`/api/admin/members/${member.id}`, { method: "POST", body: fd });
      if (!res.ok) {
        setMsg((await res.text()) || "Gagal menghapus");
        return;
      }
      window.location.reload();
    } catch {
      setMsg("Terjadi kesalahan jaringan.");
      setSaving(false);
    }
  }

  return (
    <div
      style={{
        border: "1px solid #e5e5e5",
        background: "#fff",
        padding: "18px 20px",
        display: "flex",
        flexWrap: "wrap",
        gap: 16,
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <p style={{ fontSize: 15, fontWeight: 600, margin: 0, color: "#1a1a1a" }}>{member.name}</p>
        <p style={{ fontSize: 12, color: "#888", margin: "4px 0 0" }}>{member.email}</p>
        <p style={{ fontSize: 12, color: "#888", margin: "2px 0 0" }}>{member.phone || "—"}</p>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as User["role"])}
          style={{
            border: "1px solid #ddd",
            padding: "8px 10px",
            fontSize: 13,
            background: "#fff",
            minWidth: 120,
          }}
        >
          <option value="member">Member</option>
          <option value="reseller">Reseller</option>
        </select>
        <button
          type="button"
          onClick={save}
          disabled={saving}
          style={{
            background: "#1C1917",
            color: "#FAF8F4",
            border: "none",
            padding: "8px 14px",
            fontSize: 11,
            letterSpacing: 1,
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          {saving ? "…" : "Simpan"}
        </button>
        <button
          type="button"
          onClick={remove}
          disabled={saving}
          style={{
            background: "transparent",
            color: "#B3261E",
            border: "1px solid rgba(179,38,30,0.35)",
            padding: "8px 14px",
            fontSize: 11,
            letterSpacing: 1,
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          Hapus
        </button>
        {msg && <span style={{ fontSize: 11, color: "#888" }}>{msg}</span>}
      </div>
    </div>
  );
}
