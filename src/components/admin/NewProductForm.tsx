"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

export default function NewProductForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [originalPrice, setOriginalPrice] = useState(0);
  const [discountPrice, setDiscountPrice] = useState(0);
  const [photoUrl, setPhotoUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
      const ext = file.name.split(".").pop() || "jpg";
      const filename = `prod-new-${Date.now()}.${ext}`;
      const { error } = await sb.storage.from("product-images").upload(filename, file, { contentType: file.type, upsert: true });
      if (error) { setMessage("Gagal upload foto: " + error.message); return; }
      const { data } = sb.storage.from("product-images").getPublicUrl(filename);
      setPhotoUrl(data.publicUrl);
      setMessage("Foto berhasil diupload! ✅");
    } catch(e: any) { setMessage("Error: " + e.message); }
    finally { setUploading(false); }
  }

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
      fd.set("photoUrl", photoUrl);

      const res = await fetch("/api/admin/products", { method: "POST", body: fd });
      if (!res.ok) { const text = await res.text(); setMessage(text || "Gagal menambah produk"); return; }
      setMessage("Produk berhasil ditambahkan! ✅");
      window.location.reload();
    } catch { setMessage("Terjadi kesalahan jaringan."); }
    finally { setSaving(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <h2 className="text-lg font-semibold text-ink-50">Tambah Produk Baru</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="label">Nama Produk</label>
          <input className="input-field" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Nama parfum..." />
        </div>
        <div>
          <label className="label">Harga Coret (Rp)</label>
          <input type="number" min={0} step={1000} className="input-field" value={originalPrice} onChange={(e) => setOriginalPrice(Number(e.target.value) || 0)} required />
        </div>
        <div>
          <label className="label">Harga Diskon (Rp)</label>
          <input type="number" min={0} step={1000} className="input-field" value={discountPrice} onChange={(e) => setDiscountPrice(Number(e.target.value) || 0)} required />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Deskripsi</label>
          <textarea className="input-field" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Foto Produk</label>
          <input type="file" accept="image/*" onChange={handlePhotoUpload} disabled={uploading}
            className="block w-full text-sm text-ink-300 file:mr-4 file:rounded-lg file:border-0 file:bg-ink-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-ink-50" />
          {uploading && <p className="text-xs text-gold-300 mt-1">Mengupload...</p>}
          {photoUrl && <p className="text-xs text-green-400 mt-1">✅ Foto siap</p>}
          <p className="mt-1 text-xs text-ink-400">Upload langsung ke Supabase Storage.</p>
        </div>
      </div>
      {message && <p className="text-sm text-ink-200">{message}</p>}
      <button className="btn-primary w-full" type="submit" disabled={saving || uploading}>
        {saving ? "Menyimpan..." : "Tambah Produk"}
      </button>
    </form>
  );
}
