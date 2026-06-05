"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

export default function GalleryManager({ gallery }: { gallery: any }) {
  const router = useRouter();
  const [images, setImages] = useState<{url: string; caption: string}[]>(
    (gallery.images || []).map((img: any) => typeof img === "string" ? {url: img, caption: ""} : img)
  );
  const [title, setTitle] = useState(gallery.title || "Galeri");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [unsaved, setUnsaved] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    setMsg("");
    try {
      const sb = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      for (const file of files) {
        const ext = file.name.split(".").pop() || "jpg";
        const filename = `gallery-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error } = await sb.storage.from("gallery").upload(filename, file, { contentType: file.type, upsert: true });
        if (error) { setMsg("Error: " + error.message); continue; }
        const { data: urlData } = sb.storage.from("gallery").getPublicUrl(filename);
        setImages((prev) => { setUnsaved(true); return [...prev, { url: urlData.publicUrl, caption: "" }]; });
      }
      setMsg(files.length + " foto berhasil diupload!");
    } catch(e: any) { setMsg("Gagal: " + e.message); }
    finally { setUploading(false); }
  }

  async function handleSave() {
    setSaving(true);
    setMsg("");
    try {
      const fd = new FormData();
      fd.set("action", "save-gallery");
      fd.set("images", JSON.stringify(images));
      fd.set("title", title);
      const res = await fetch("/api/admin/gallery", { method: "POST", body: fd });
      if (!res.ok) { setMsg("Gagal menyimpan"); return; }
      setMsg("Galeri berhasil disimpan! ✅"); setUnsaved(false);
      router.refresh();
    } catch { setMsg("Gagal menyimpan."); }
    finally { setSaving(false); }
  }

  function removeImage(idx: number) {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  }

  function updateCaption(idx: number, caption: string) {
    setImages((prev) => prev.map((img, i) => i === idx ? { ...img, caption } : img));
  }

  return (
    <div className="space-y-6">
      <div className="card space-y-4">
        <h2 className="font-semibold text-ink-50">Info Galeri</h2>
        <div>
          <label className="label">Judul Galeri</label>
          <input className="input-field" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
      </div>

      <div className="card space-y-4">
        <h2 className="font-semibold text-ink-50">Upload Foto</h2>
        <p className="text-sm text-ink-400">Pilih banyak foto sekaligus (JPG/PNG).</p>
        <input type="file" accept="image/*" multiple onChange={handleUpload} disabled={uploading}
          className="block w-full text-sm text-ink-300 file:mr-4 file:rounded-lg file:border-0 file:bg-ink-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-ink-50" />
        {uploading && <p className="text-sm text-gold-300">Mengupload...</p>}
      </div>

      {images.length > 0 && (
        <div className="card space-y-4">
          <h2 className="font-semibold text-ink-50">Foto Galeri ({images.length} foto)</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((img, i) => (
              <div key={i} className="overflow-hidden rounded-2xl border border-ink-800 bg-ink-900">
                <div className="relative h-48">
                  <Image src={img.url} alt={img.caption || "Galeri"} fill className="object-cover" />
                </div>
                <div className="p-2 space-y-1">
                  <input
                    className="input-field text-xs"
                    placeholder="Caption (opsional)"
                    value={img.caption}
                    onChange={(e) => updateCaption(i, e.target.value)}
                  />
                  <button onClick={() => removeImage(i)} className="w-full rounded px-2 py-1 text-xs bg-red-900/50 text-red-300">✕ Hapus</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {unsaved && <p className="rounded-lg bg-yellow-950/50 border border-yellow-700/30 px-3 py-2 text-sm text-yellow-300">⚠️ Ada foto yang belum disimpan! Klik Simpan Galeri.</p>}
      {msg && <p className="text-sm text-gold-300">{msg}</p>}
      <button onClick={handleSave} disabled={saving} className="btn-primary w-full">
        {saving ? "Menyimpan..." : "Simpan Galeri"}
      </button>
      <a href="/galeri" target="_blank" rel="noreferrer" className="btn-secondary w-full text-center block mt-2">
        👁 Preview Galeri
      </a>
    </div>
  );
}
