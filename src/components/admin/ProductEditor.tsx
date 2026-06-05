"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { Product, ProductVariant } from "@/lib/types";
import { formatRupiah } from "@/lib/format";
import { supabase } from "@/lib/supabase";

type VariantDraft = ProductVariant;

function sortVariants(vs: VariantDraft[]) {
  return [...vs].sort((a, b) => a.sizeMl - b.sizeMl);
}

function newVariant(productId: string, sizeMl: 30 | 50 | 100): VariantDraft {
  return { id: `${productId}-${sizeMl}`, sizeMl, stock: 0, originalPrice: 0, discountPrice: 0, active: true };
}

export default function ProductEditor({ product, onSaved }: { product: Product; onSaved?: () => void }) {
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [active, setActive] = useState(product.active);
  const [originalPrice, setOriginalPrice] = useState(product.originalPrice);
  const [discountPrice, setDiscountPrice] = useState(product.discountPrice);
  const [variants, setVariants] = useState<VariantDraft[]>(sortVariants(product.variants));
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [topNotes, setTopNotes] = useState((product as any).topNotes || "");
  const [comingSoon, setComingSoon] = useState((product as any).comingSoon || false);
  const [middleNotes, setMiddleNotes] = useState((product as any).middleNotes || "");
  const [baseNotes, setBaseNotes] = useState((product as any).baseNotes || "");
  const [inspiration, setInspiration] = useState((product as any).inspiration || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const previewUrl = useMemo(() => {
    if (!photoFile) return null;
    return URL.createObjectURL(photoFile);
  }, [photoFile]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      let photoUrl = product.photo;

      if (photoFile) {
        const ext = photoFile.name.split(".").pop() || "jpg";
        const filename = `${product.id}-${Date.now()}.${ext}`;
        const { data, error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(filename, photoFile, { upsert: true, contentType: photoFile.type });
        if (uploadError) { setError("Gagal upload foto: " + uploadError.message); return; }
        const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(filename);
        photoUrl = urlData.publicUrl;
      }

      const fd = new FormData();
      fd.set("name", name);
      fd.set("description", description);
      fd.set("active", active ? "on" : "off");
      fd.set("originalPrice", String(originalPrice));
      fd.set("discountPrice", String(discountPrice));
      fd.set("variants", JSON.stringify(variants));
      fd.set("topNotes", topNotes);
      fd.set("comingSoon", String(comingSoon));
      fd.set("middleNotes", middleNotes);
      fd.set("baseNotes", baseNotes);
      fd.set("inspiration", inspiration);
      fd.set("photoUrl", photoUrl);

      const res = await fetch(`/api/admin/products/${product.id}`, { method: "POST", body: fd });
      if (!res.ok) { const text = await res.text(); setError(text || "Gagal menyimpan produk"); return; }
      window.location.reload();
      
    } catch { setError("Terjadi kesalahan jaringan"); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!confirm(`Hapus produk: ${product.name}?`)) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/products/${product.id}/delete`, { method: "POST" });
      if (!res.ok) { const text = await res.text(); setError(text || "Gagal menghapus produk"); return; }
      
    } catch { setError("Terjadi kesalahan jaringan"); }
    finally { setSaving(false); }
  }

  function upsertVariant(next: VariantDraft) {
    setVariants((prev) => sortVariants(prev.map((v) => (v.id === next.id ? next : v))));
  }

  function toggleVariantActive(id: string) {
    setVariants((prev) => sortVariants(prev.map((v) => (v.id === id ? { ...v, active: !v.active } : v))));
  }

  function addMissingSizes() {
    setVariants((prev) => {
      const sizes = new Set(prev.map((v) => v.sizeMl));
      const next = [...prev];
      ([30, 50, 100] as const).forEach((s) => { if (!sizes.has(s)) next.push(newVariant(product.id, s)); });
      return sortVariants(next);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-6">
      <div className="flex flex-col gap-6 sm:flex-row">
        <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-2xl border border-ink-800 bg-ink-950/40">
          <Image src={previewUrl || product.photo} alt={product.name} fill className="object-contain p-4" />
        </div>
        <div className="flex-1 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Nama Produk</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="input-field" required />
            </div>
            <div>
              <label className="label">Foto Produk</label>
              <input type="file" accept="image/*" className="block w-full text-sm text-ink-300 file:mr-4 file:rounded-lg file:border-0 file:bg-ink-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-ink-50"
                onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)} />
              <p className="mt-1 text-xs text-ink-400">Upload ke Supabase Storage (tanpa batas ukuran).</p>
            </div>
          </div>
          <div>
            <label className="label">Deskripsi</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="input-field" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Harga Coret (Rp)</label>
              <input type="number" min={0} step={1000} value={originalPrice} onChange={(e) => setOriginalPrice(Number(e.target.value))} className="input-field" required />
              <p className="mt-1 text-xs text-ink-400">{formatRupiah(originalPrice)}</p>
            </div>
            <div>
              <label className="label">Harga Diskon (Rp)</label>
              <input type="number" min={0} step={1000} value={discountPrice} onChange={(e) => setDiscountPrice(Number(e.target.value))} className="input-field" required />
              <p className="mt-1 text-xs text-ink-400">{formatRupiah(discountPrice)}</p>
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-ink-200">
            <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
            Aktif di katalog
          </label>
          <label className="flex items-center gap-2 text-sm text-ink-200">
            <input type="checkbox" checked={comingSoon} onChange={(e) => setComingSoon(e.target.checked)} />
            Coming Soon (sembunyikan harga)
          </label>
          <div className="grid gap-4 sm:grid-cols-3 sm:col-span-2">
            <div>
              <label className="label">Top Notes</label>
              <input className="input-field" value={topNotes} onChange={(e) => setTopNotes(e.target.value)} placeholder="Citrus, Bergamot..." />
            </div>
            <div>
              <label className="label">Middle Notes</label>
              <input className="input-field" value={middleNotes} onChange={(e) => setMiddleNotes(e.target.value)} placeholder="Rose, Jasmine..." />
            </div>
            <div>
              <label className="label">Base Notes</label>
              <input className="input-field" value={baseNotes} onChange={(e) => setBaseNotes(e.target.value)} placeholder="Vanilla, Musk..." />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label className="label">Kisah / Inspirasi Produk</label>
            <textarea className="input-field" rows={3} value={inspiration} onChange={(e) => setInspiration(e.target.value)} placeholder="Cerita di balik nama dan konsep parfum ini..." />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-ink-100">Varian & Stock</h3>
          <button type="button" className="btn-secondary !py-2" onClick={addMissingSizes} disabled={saving}>
            Tambah varian 30/50/100ml
          </button>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-ink-800">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-ink-950/40">
              <tr className="text-ink-300">
                <th className="px-4 py-3 font-medium">Size</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium">Harga Coret</th>
                <th className="px-4 py-3 font-medium">Harga Diskon</th>
                <th className="px-4 py-3 font-medium">Aktif</th>
              </tr>
            </thead>
            <tbody>
              {variants.map((v) => (
                <tr key={v.id} className="border-t border-ink-800">
                  <td className="px-4 py-3 text-ink-100">{v.sizeMl}ml</td>
                  <td className="px-4 py-3">
                    <input type="number" min={0} value={v.stock} onChange={(e) => upsertVariant({ ...v, stock: Number(e.target.value) || 0 })} className="input-field w-28" />
                  </td>
                  <td className="px-4 py-3">
                    <input type="number" min={0} step={1000} value={v.originalPrice} onChange={(e) => upsertVariant({ ...v, originalPrice: Number(e.target.value) || 0 })} className="input-field w-40" />
                  </td>
                  <td className="px-4 py-3">
                    <input type="number" min={0} step={1000} value={v.discountPrice} onChange={(e) => upsertVariant({ ...v, discountPrice: Number(e.target.value) || 0 })} className="input-field w-40" />
                  </td>
                  <td className="px-4 py-3">
                    <button type="button" className={v.active ? "badge border-gold-400/30 bg-gold-400/10 text-gold-200" : "badge"} onClick={() => toggleVariantActive(v.id)} disabled={saving}>
                      {v.active ? "Aktif" : "Nonaktif"}
                    </button>
                  </td>
                </tr>
              ))}
              {variants.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-6 text-ink-400">Belum ada varian. Klik "Tambah varian 30/50/100ml".</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {error && <p className="text-sm text-red-200">{error}</p>}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? "Menyimpan..." : "Simpan Produk"}</button>
        <button type="button" className="btn-secondary" disabled={saving} onClick={handleDelete}>Hapus Produk</button>
      </div>
    </form>
  );
}
