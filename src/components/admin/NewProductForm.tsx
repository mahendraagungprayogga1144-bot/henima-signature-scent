"use client";

import { useState } from "react";

export default function NewProductForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [originalPrice, setOriginalPrice] = useState(0);
  const [discountPrice, setDiscountPrice] = useState(0);
  const [photo, setPhoto] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const fd = new FormData();
      fd.set("name", name);
      fd.set("description", description);
      fd.set("originalPrice", String(originalPrice));
      fd.set("discountPrice", String(discountPrice));
      if (photo) fd.set("photo", photo);

      const res = await fetch("/api/admin/products", { method: "POST", body: fd });
      if (!res.ok) {
        const text = await res.text();
        setMessage(text || "Gagal menambah produk");
        return;
      }
      setMessage("Produk berhasil ditambahkan.");
      setName("");
      setDescription("");
      setOriginalPrice(0);
      setDiscountPrice(0);
      setPhoto(null);
      window.location.reload();
    } catch {
      setMessage("Terjadi kesalahan jaringan.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <h2 className="text-lg font-semibold text-ink-50">Tambah Produk</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="label">Nama produk</label>
          <input className="input-field" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label className="label">Harga coret (Rp)</label>
          <input type="number" min={0} step={1000} className="input-field" value={originalPrice} onChange={(e) => setOriginalPrice(Number(e.target.value) || 0)} required />
        </div>
        <div>
          <label className="label">Harga diskon (Rp)</label>
          <input type="number" min={0} step={1000} className="input-field" value={discountPrice} onChange={(e) => setDiscountPrice(Number(e.target.value) || 0)} required />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Deskripsi</label>
          <textarea className="input-field" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Foto produk</label>
          <input
            type="file"
            accept="image/*"
            className="block w-full text-sm text-ink-300 file:mr-4 file:rounded-lg file:border-0 file:bg-ink-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-ink-50"
            onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
          />
        </div>
      </div>

      {message && <p className="text-sm text-ink-200">{message}</p>}

      <button className="btn-primary" type="submit" disabled={saving}>
        {saving ? "Menyimpan..." : "Simpan Produk"}
      </button>
    </form>
  );
}

