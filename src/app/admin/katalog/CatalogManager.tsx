"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CatalogManager({ catalog }: { catalog: any }) {
  const router = useRouter();
  const [images, setImages] = useState<string[]>(catalog.images || []);
  const [pdfUrl, setPdfUrl] = useState(catalog.pdfUrl || "");
  const [title, setTitle] = useState(catalog.title || "Katalog Produk");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    setMsg("");
    try {
      for (const file of files) {
        const fd = new FormData();
        fd.set("action", "upload");
        fd.set("file", file);
        const res = await fetch("/api/admin/catalog", { method: "POST", body: fd });
        const data = await res.json();
        if (data.url) setImages((prev) => [...prev, data.url]);
        else setMsg('Error: ' + (data.error || 'Unknown'));
      }
      setMsg(files.length + " gambar berhasil diupload!");
    } catch { setMsg("Gagal upload."); }
    finally { setUploading(false); }
  }

  async function handleSave() {
    setSaving(true);
    setMsg("");
    try {
      const fd = new FormData();
      fd.set("action", "save");
      fd.set("images", JSON.stringify(images));
      fd.set("pdfUrl", pdfUrl);
      fd.set("title", title);
      await fetch("/api/admin/catalog", { method: "POST", body: fd });
      setMsg("Katalog berhasil disimpan!");
      router.refresh();
    } catch { setMsg("Gagal menyimpan."); }
    finally { setSaving(false); }
  }

  function removeImage(url: string) {
    setImages((prev) => prev.filter((img) => img !== url));
  }

  function moveUp(idx: number) {
    if (idx === 0) return;
    const next = [...images];
    [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
    setImages(next);
  }

  function moveDown(idx: number) {
    if (idx === images.length - 1) return;
    const next = [...images];
    [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
    setImages(next);
  }

  return (
    <div className="space-y-6">
      <div className="card space-y-4">
        <h2 className="font-semibold text-ink-50">Info Katalog</h2>
        <div>
          <label className="label">Judul Katalog</label>
          <input className="input-field" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label className="label">Link Download PDF (opsional)</label>
          <input className="input-field" value={pdfUrl} onChange={(e) => setPdfUrl(e.target.value)} placeholder="https://..." />
          <p className="mt-1 text-xs text-ink-400">Upload PDF ke Google Drive lalu paste link-nya.</p>
        </div>
      </div>
      <div className="card space-y-4">
        <h2 className="font-semibold text-ink-50">Upload Halaman Katalog</h2>
        <p className="text-sm text-ink-400">Upload gambar per halaman (JPG/PNG). Bisa pilih banyak sekaligus.</p>
        <input type="file" accept="image/*" multiple onChange={handleUpload} disabled={uploading}
          className="block w-full text-sm text-ink-300 file:mr-4 file:rounded-lg file:border-0 file:bg-ink-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-ink-50" />
        {uploading && <p className="text-sm text-gold-300">Mengupload...</p>}
      </div>
      {images.length > 0 && (
        <div className="card space-y-4">
          <h2 className="font-semibold text-ink-50">Halaman Katalog ({images.length} halaman)</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((img, i) => (
              <div key={img} className="relative overflow-hidden rounded-2xl border border-ink-800 bg-ink-900">
                <div className="relative h-48">
                  <Image src={img} alt={"Halaman " + (i + 1)} fill className="object-cover" />
                </div>
                <div className="p-2 flex items-center justify-between gap-1">
                  <span className="text-xs text-ink-400">Hal. {i + 1}</span>
                  <div className="flex gap-1">
                    <button onClick={() => moveUp(i)} className="rounded px-2 py-1 text-xs bg-ink-800 text-ink-200">↑</button>
                    <button onClick={() => moveDown(i)} className="rounded px-2 py-1 text-xs bg-ink-800 text-ink-200">↓</button>
                    <button onClick={() => removeImage(img)} className="rounded px-2 py-1 text-xs bg-red-900/50 text-red-300">✕</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {msg && <p className="text-sm text-gold-300">{msg}</p>}
      <button onClick={handleSave} disabled={saving} className="btn-primary w-full">
        {saving ? "Menyimpan..." : "Simpan Katalog"}
      </button>
      <a href="/katalog-digital" target="_blank" rel="noreferrer" className="btn-secondary w-full text-center block mt-2">
        👁 Preview Katalog Digital
      </a>
    </div>
  );
}
