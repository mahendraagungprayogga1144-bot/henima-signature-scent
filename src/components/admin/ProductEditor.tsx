"use client";

import { useState } from "react";
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

export default function ProductEditor({
  product,
  allProducts = [],
  onSaved,
}: {
  product: Product;
  allProducts?: Product[];
  onSaved?: () => void;
}) {
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [active, setActive] = useState(product.active);
  const [originalPrice, setOriginalPrice] = useState(product.originalPrice);
  const [discountPrice, setDiscountPrice] = useState(product.discountPrice);
  const [variants, setVariants] = useState<VariantDraft[]>(sortVariants(product.variants));
  const [notifSending, setNotifSending] = useState(false);
  const [notifMsg, setNotifMsg] = useState("");
  const initialPhotos = product.photos?.length ? product.photos : product.photo ? [product.photo] : [];
  const [photos, setPhotos] = useState<string[]>(initialPhotos);
  const [video, setVideo] = useState(product.video || "");
  const [photoUploading, setPhotoUploading] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);
  const [topNotes, setTopNotes] = useState((product as any).topNotes || "");
  const [comingSoon, setComingSoon] = useState((product as any).comingSoon || false);
  const [isGiftSet, setIsGiftSet] = useState(Boolean(product.isGiftSet));
  const [bundleIds, setBundleIds] = useState<string[]>(
    (product.bundleItems || []).map((b) => b.productId).filter(Boolean)
  );
  const [middleNotes, setMiddleNotes] = useState((product as any).middleNotes || "");
  const [baseNotes, setBaseNotes] = useState((product as any).baseNotes || "");
  const [inspiration, setInspiration] = useState((product as any).inspiration || "");
  const [sillage, setSillage] = useState((product as any).sillage || "");
  const [projection, setProjection] = useState((product as any).projection || "");
  const [longevity, setLongevity] = useState((product as any).longevity || "");
  const [scentFamily, setScentFamily] = useState((product as any).scentFamily || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploadMsg, setUploadMsg] = useState("");

  const previewPhoto = photos[0] || product.photo;

  async function uploadFile(file: File, prefix: string): Promise<string> {
    const ext = file.name.split(".").pop() || "jpg";
    const filename = `${product.id}-${prefix}-${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filename, file, { upsert: true, contentType: file.type });
    if (uploadError) throw new Error(uploadError.message);
    const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(filename);
    return urlData.publicUrl;
  }

  async function addPhotos(files: FileList | null) {
    if (!files?.length) return;
    setPhotoUploading(true);
    setError("");
    setSuccess("");
    setUploadMsg("");
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        urls.push(await uploadFile(file, "photo"));
      }
      setPhotos((prev) => [...prev, ...urls]);
      setUploadMsg(`${urls.length} foto berhasil diupload. Klik "Simpan Produk" untuk menyimpan.`);
    } catch (e: any) {
      setError("Gagal upload foto: " + e.message);
    } finally {
      setPhotoUploading(false);
    }
  }

  async function addVideo(file: File | null) {
    if (!file) return;
    setVideoUploading(true);
    setError("");
    setSuccess("");
    setUploadMsg("");
    try {
      const url = await uploadFile(file, "video");
      setVideo(url);
      setUploadMsg("Video berhasil diupload. Klik \"Simpan Produk\" untuk menyimpan.");
    } catch (e: any) {
      setError("Gagal upload video: " + e.message);
    } finally {
      setVideoUploading(false);
    }
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
    setError("");
    setSuccess("");
    setUploadMsg("");
    setSaving(true);
    try {
      const fd = new FormData();
      fd.set("name", name);
      fd.set("description", description);
      fd.set("active", active ? "on" : "off");
      fd.set("originalPrice", String(originalPrice));
      fd.set("discountPrice", String(discountPrice));
      fd.set("variants", JSON.stringify(variants));
      fd.set("topNotes", topNotes);
      fd.set("comingSoon", String(comingSoon));
      fd.set("isGiftSet", String(isGiftSet));
      fd.set(
        "bundleItems",
        JSON.stringify(
          bundleIds.map((id) => {
            const p = allProducts.find((x) => x.id === id);
            return { productId: id, label: p?.name };
          })
        )
      );
      fd.set("middleNotes", middleNotes);
      fd.set("baseNotes", baseNotes);
      fd.set("inspiration", inspiration);
      fd.set("sillage", sillage);
      fd.set("projection", projection);
      fd.set("longevity", longevity);
      fd.set("scentFamily", scentFamily);
      fd.set("photos", JSON.stringify(photos));
      fd.set("video", video);
      if (photos[0]) fd.set("photoUrl", photos[0]);

      const res = await fetch(`/api/admin/products/${product.id}`, { method: "POST", body: fd });
      if (!res.ok) {
        let msg = "Gagal menyimpan produk";
        try {
          const data = await res.json();
          msg = data.error || msg;
        } catch {
          const text = await res.text();
          if (text) msg = text;
        }
        setError(msg);
        return;
      }

      setSuccess(`Produk "${name}" berhasil disimpan.`);
      onSaved?.();
      window.location.href = `/admin/produk?saved=1#${product.id}`;
      
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

  async function sendStockNotif() {
    setNotifSending(true); setNotifMsg("");
    try {
      const res = await fetch("/api/admin/stock-notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, productName: product.name })
      });
      const data = await res.json();
      setNotifMsg(data.sent > 0 ? data.sent + " email terkirim!" : "Tidak ada yang mendaftar notifikasi.");
    } catch(e) { setNotifMsg("Gagal kirim notifikasi."); }
    finally { setNotifSending(false); }
  }

  return (
    <form id={product.id} onSubmit={handleSubmit} className="card space-y-6 scroll-mt-24">
      <div className="flex flex-col gap-6 sm:flex-row">
        <div className="space-y-4 sm:w-56 shrink-0">
          <div className="relative h-32 w-full overflow-hidden rounded-2xl border border-ink-800 bg-ink-950/40">
            {previewPhoto ? (
              <Image src={previewPhoto} alt={product.name} fill className="object-contain p-4" />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-ink-500">Belum ada foto</div>
            )}
          </div>
          {video && (
            <div className="rounded-2xl border border-ink-800 bg-ink-950/40 p-3">
              <p className="text-[10px] uppercase tracking-widest text-ink-400 mb-2">Video Produk</p>
              <video src={video} className="w-full rounded-lg" muted playsInline controls />
            </div>
          )}
        </div>
        <div className="flex-1 space-y-4">
          <div>
            <label className="label">Nama Produk</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="input-field" required />
          </div>

          <div className="rounded-2xl border border-ink-800 bg-ink-950/20 p-4 space-y-4">
            <div>
              <div className="flex items-center justify-between gap-3 mb-3">
                <label className="label !mb-0">Galeri Foto (bisa digeser di halaman produk)</label>
                <span className="text-xs text-ink-400">{photos.length} foto</span>
              </div>
              {photos.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-3">
                  {photos.map((url, idx) => (
                    <div key={url + idx} className="relative group">
                      <div className="relative h-20 w-20 overflow-hidden rounded-xl border border-ink-800">
                        <Image src={url} alt={`Foto ${idx + 1}`} fill className="object-cover" />
                        {idx === 0 && (
                          <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-[9px] text-center text-gold-200 py-0.5">Utama</span>
                        )}
                      </div>
                      <div className="mt-1 flex gap-1 justify-center">
                        <button type="button" className="text-[10px] text-ink-400 hover:text-ink-100" onClick={() => movePhoto(idx, -1)} disabled={idx === 0}>←</button>
                        <button type="button" className="text-[10px] text-red-300 hover:text-red-100" onClick={() => setPhotos((p) => p.filter((_, i) => i !== idx))}>×</button>
                        <button type="button" className="text-[10px] text-ink-400 hover:text-ink-100" onClick={() => movePhoto(idx, 1)} disabled={idx === photos.length - 1}>→</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                multiple
                disabled={photoUploading || saving}
                className="block w-full text-sm text-ink-300 file:mr-4 file:rounded-lg file:border-0 file:bg-ink-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-ink-50"
                onChange={(e) => { addPhotos(e.target.files); e.target.value = ""; }}
              />
              <p className="mt-1 text-xs text-ink-400">
                {photoUploading ? "Mengupload foto..." : "Pilih satu atau banyak foto sekaligus. Foto pertama = thumbnail utama."}
              </p>
              {uploadMsg && <p className="mt-2 text-xs text-green-400">{uploadMsg}</p>}
            </div>

            <div className="border-t border-ink-800 pt-4">
              <label className="label">Video Produk (opsional)</label>
              {video ? (
                <div className="flex items-center gap-3">
                  <span className="text-xs text-green-400 flex-1 truncate">✅ Video siap</span>
                  <button type="button" className="btn-secondary !py-1 !px-3 text-xs" onClick={() => setVideo("")}>Hapus video</button>
                </div>
              ) : null}
              <input
                type="file"
                accept="video/mp4,video/webm,video/*"
                disabled={videoUploading || saving}
                className="mt-2 block w-full text-sm text-ink-300 file:mr-4 file:rounded-lg file:border-0 file:bg-ink-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-ink-50"
                onChange={(e) => { addVideo(e.target.files?.[0] ?? null); e.target.value = ""; }}
              />
              <p className="mt-1 text-xs text-ink-400">
                {videoUploading ? "Mengupload video..." : "MP4/WebM. Video tampil di slider halaman produk (slide pertama)."}
              </p>
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
          <label className="flex items-center gap-2 text-sm text-ink-200">
            <input type="checkbox" checked={isGiftSet} onChange={(e) => setIsGiftSet(e.target.checked)} />
            Gift Set / Bundling
          </label>
          {isGiftSet && (
            <div className="rounded border border-ink-700/40 bg-ink-900/20 p-3 sm:col-span-2">
              <p className="label mb-2">Isi bundel (centang produk yang termasuk)</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {allProducts
                  .filter((p) => p.id !== product.id)
                  .map((p) => {
                    const checked = bundleIds.includes(p.id);
                    return (
                      <label key={p.id} className="flex items-center gap-2 text-sm text-ink-200">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            setBundleIds((prev) =>
                              e.target.checked
                                ? [...prev, p.id]
                                : prev.filter((id) => id !== p.id)
                            );
                          }}
                        />
                        {p.name}
                      </label>
                    );
                  })}
              </div>
            </div>
          )}
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
            <div className="mt-4">
              <p className="text-xs font-medium tracking-widest uppercase text-ink-400 mb-3">Scent Profile</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="label">Scent Family</label>
                  <input className="input-field" value={scentFamily} onChange={(e) => setScentFamily(e.target.value)} placeholder="Woody, Floral, Oriental..." />
                </div>
                <div>
                  <label className="label">Sillage</label>
                  <input className="input-field" value={sillage} onChange={(e) => setSillage(e.target.value)} placeholder="Medium, Medium-strong..." />
                </div>
                <div>
                  <label className="label">Projection</label>
                  <input className="input-field" value={projection} onChange={(e) => setProjection(e.target.value)} placeholder="±2 m, 1.5-2 m..." />
                </div>
                <div>
                  <label className="label">Longevity</label>
                  <input className="input-field" value={longevity} onChange={(e) => setLongevity(e.target.value)} placeholder="6-8 hours, ±6 hours..." />
                </div>
              </div>
            </div>
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
      {success && <p className="text-sm text-green-300">{success}</p>}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? "Menyimpan..." : "Simpan Produk"}</button>
        <button type="button" className="btn-secondary" disabled={saving} onClick={handleDelete}>Hapus Produk</button>
        <button type="button" className="btn-secondary" disabled={notifSending} onClick={sendStockNotif}>{notifSending ? "Mengirim..." : "Kirim Notif Restock"}</button>
        {notifMsg && <p className="text-sm text-gold-300 mt-2">{notifMsg}</p>}
      </div>
    </form>
  );
}
