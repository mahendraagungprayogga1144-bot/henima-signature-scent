"use client";

import { useState } from "react";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";

export default function NewProductForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [originalPrice, setOriginalPrice] = useState(0);
  const [discountPrice, setDiscountPrice] = useState(0);
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function uploadOne(file: File): Promise<string> {
    const sb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const ext = file.name.split(".").pop() || "jpg";
    const filename = `prod-new-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
    const { error } = await sb.storage
      .from("product-images")
      .upload(filename, file, { contentType: file.type, upsert: true });
    if (error) throw new Error(error.message);
    const { data } = sb.storage.from("product-images").getPublicUrl(filename);
    return data.publicUrl;
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    setMessage("");
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        urls.push(await uploadOne(file));
      }
      setPhotos((prev) => [...prev, ...urls]);
      setMessage(`${urls.length} foto berhasil diupload.`);
    } catch (err: any) {
      setMessage("Gagal upload foto: " + (err?.message || String(err)));
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function replacePhoto(index: number, file: File | null) {
    if (!file) return;
    setUploading(true);
    setMessage("");
    try {
      const url = await uploadOne(file);
      setPhotos((prev) => prev.map((p, i) => (i === index ? url : p)));
      setMessage("Foto diganti. Siap disimpan.");
    } catch (err: any) {
      setMessage("Gagal ganti foto: " + (err?.message || String(err)));
    } finally {
      setUploading(false);
    }
  }

  function removePhoto(index: number) {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  }

  function movePhoto(index: number, dir: -1 | 1) {
    setPhotos((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
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
      fd.set("photos", JSON.stringify(photos));
      if (photos[0]) fd.set("photoUrl", photos[0]);

      const res = await fetch("/api/admin/products", { method: "POST", body: fd });
      if (!res.ok) {
        const text = await res.text();
        setMessage(text || "Gagal menambah produk");
        return;
      }
      setMessage("Produk berhasil ditambahkan.");
      window.location.reload();
    } catch {
      setMessage("Terjadi kesalahan jaringan.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <h2 className="text-lg font-semibold text-ink-50">Tambah Produk Baru</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="label">Nama Produk</label>
          <input
            className="input-field"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Nama parfum..."
          />
        </div>
        <div>
          <label className="label">Harga Coret (Rp)</label>
          <input
            type="number"
            min={0}
            step={1000}
            className="input-field"
            value={originalPrice}
            onChange={(e) => setOriginalPrice(Number(e.target.value) || 0)}
            required
          />
        </div>
        <div>
          <label className="label">Harga Diskon (Rp)</label>
          <input
            type="number"
            min={0}
            step={1000}
            className="input-field"
            value={discountPrice}
            onChange={(e) => setDiscountPrice(Number(e.target.value) || 0)}
            required
          />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Deskripsi</label>
          <textarea
            className="input-field"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="sm:col-span-2 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <label className="label !mb-0">Foto Produk</label>
            <span className="text-xs text-ink-400">{photos.length} foto</span>
          </div>

          {photos.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {photos.map((url, idx) => (
                <div key={url + idx} className="w-[7.5rem]">
                  <div className="relative h-28 w-28 overflow-hidden rounded-xl border border-ink-800 bg-ink-950/40">
                    <Image src={url} alt={`Foto ${idx + 1}`} fill className="object-cover" />
                    {idx === 0 && (
                      <span className="absolute bottom-0 left-0 right-0 bg-black/65 text-[9px] text-center text-gold-200 py-0.5">
                        Utama
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1 justify-center">
                    <button
                      type="button"
                      className="text-[10px] text-ink-400 hover:text-ink-100"
                      onClick={() => movePhoto(idx, -1)}
                      disabled={idx === 0 || uploading}
                    >
                      ←
                    </button>
                    <label className="text-[10px] text-gold-300 hover:text-gold-100 cursor-pointer">
                      Ganti
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploading || saving}
                        onChange={(e) => {
                          replacePhoto(idx, e.target.files?.[0] ?? null);
                          e.target.value = "";
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      className="text-[10px] text-red-300 hover:text-red-100"
                      onClick={() => removePhoto(idx)}
                      disabled={uploading || saving}
                    >
                      Hapus
                    </button>
                    <button
                      type="button"
                      className="text-[10px] text-ink-400 hover:text-ink-100"
                      onClick={() => movePhoto(idx, 1)}
                      disabled={idx === photos.length - 1 || uploading}
                    >
                      →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotoUpload}
            disabled={uploading || saving}
            className="block w-full text-sm text-ink-300 file:mr-4 file:rounded-lg file:border-0 file:bg-ink-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-ink-50"
          />
          <p className="text-xs text-ink-400">
            {uploading
              ? "Mengupload..."
              : "Bisa banyak foto. Foto pertama = thumbnail utama. Bisa ganti / hapus sebelum simpan."}
          </p>
        </div>
      </div>
      {message && <p className="text-sm text-ink-200">{message}</p>}
      <button className="btn-primary w-full" type="submit" disabled={saving || uploading}>
        {saving ? "Menyimpan..." : "Tambah Produk"}
      </button>
    </form>
  );
}
