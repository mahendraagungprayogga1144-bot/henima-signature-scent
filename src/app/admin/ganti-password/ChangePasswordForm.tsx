"use client";
import { useState } from "react";

export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(""); setError("");
    if (newPassword !== confirmPassword) {
      setError("Password baru dan konfirmasi tidak cocok");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password baru minimal 6 karakter");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Gagal ganti password"); return; }
      setMsg("Password berhasil diganti! ✅");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch { setError("Terjadi kesalahan jaringan"); }
    finally { setLoading(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      {error && <p className="rounded-lg bg-red-950/30 px-3 py-2 text-sm text-red-300">{error}</p>}
      {msg && <p className="rounded-lg bg-green-950/30 px-3 py-2 text-sm text-green-300">{msg}</p>}
      <div>
        <label className="label">Password Lama</label>
        <input type="password" className="input-field" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
      </div>
      <div>
        <label className="label">Password Baru</label>
        <input type="password" className="input-field" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} />
        <p className="mt-1 text-xs text-ink-400">Minimal 6 karakter</p>
      </div>
      <div>
        <label className="label">Konfirmasi Password Baru</label>
        <input type="password" className="input-field" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
      </div>
      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? "Menyimpan..." : "Ganti Password"}
      </button>
    </form>
  );
}
