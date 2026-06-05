"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

export default function BlogEditor({ post }: { post: any }) {
  const router = useRouter();
  const [title, setTitle] = useState(post?.title || "");
  const [slug, setSlug] = useState(post?.slug || "");
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [content, setContent] = useState(post?.content || "");
  const [coverImage, setCoverImage] = useState(post?.cover_image || "");
  const [published, setPublished] = useState(post?.published || false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  function generateSlug(title: string) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
      const ext = file.name.split(".").pop() || "jpg";
      const filename = `blog-${Date.now()}.${ext}`;
      const { error } = await sb.storage.from("brand-assets").upload(`blog/${filename}`, file, { contentType: file.type, upsert: true });
      if (error) { setMsg("Error: " + error.message); return; }
      const { data } = sb.storage.from("brand-assets").getPublicUrl(`blog/${filename}`);
      setCoverImage(data.publicUrl);
    } catch(e: any) { setMsg("Gagal upload: " + e.message); }
    finally { setUploading(false); }
  }

  async function handleSave() {
    if (!title) { setMsg("Judul wajib diisi"); return; }
    if (!slug) { setMsg("Slug wajib diisi"); return; }
    setSaving(true);
    setMsg("");
    try {
      const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
      const data = { title, slug, excerpt, content, cover_image: coverImage, published, updated_at: new Date().toISOString() };
      if (post?.id) {
        await sb.from("blog_posts").update(data).eq("id", post.id);
      } else {
        await sb.from("blog_posts").insert({ ...data, id: Date.now().toString() });
      }
      setMsg("Artikel berhasil disimpan! ✅");
      setTimeout(() => router.push("/admin/blog"), 1000);
    } catch(e: any) { setMsg("Gagal: " + e.message); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!post?.id) return;
    if (!confirm("Hapus artikel ini?")) return;
    const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    await sb.from("blog_posts").delete().eq("id", post.id);
    router.push("/admin/blog");
  }

  return (
    <div className="space-y-6">
      <div className="card space-y-4">
        <div>
          <label className="label">Judul Artikel</label>
          <input className="input-field" value={title} onChange={(e) => { setTitle(e.target.value); if (!post) setSlug(generateSlug(e.target.value)); }} placeholder="Judul artikel..." />
        </div>
        <div>
          <label className="label">Slug (URL)</label>
          <input className="input-field" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="judul-artikel" />
          <p className="mt-1 text-xs text-ink-400">henimaofficial.com/blog/{slug || "judul-artikel"}</p>
        </div>
        <div>
          <label className="label">Excerpt (ringkasan singkat)</label>
          <textarea className="input-field" rows={2} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Ringkasan artikel..." />
        </div>
        <div>
          <label className="label">Cover Image</label>
          <input type="file" accept="image/*" onChange={handleCoverUpload} disabled={uploading}
            className="block w-full text-sm text-ink-300 file:mr-4 file:rounded-lg file:border-0 file:bg-ink-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-ink-50" />
          {uploading && <p className="text-xs text-gold-300 mt-1">Mengupload...</p>}
          {coverImage && <p className="text-xs text-green-400 mt-1">✅ Cover terpasang</p>}
        </div>
        <div>
          <label className="label">Isi Artikel</label>
          <textarea className="input-field font-mono text-sm" rows={15} value={content} onChange={(e) => setContent(e.target.value)} placeholder="Tulis isi artikel di sini... (tekan Enter untuk paragraf baru)" />
        </div>
        <label className="flex items-center gap-2 text-sm text-ink-200">
          <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
          Publish (tampilkan di blog publik)
        </label>
      </div>

      {msg && <p className="text-sm text-gold-300">{msg}</p>}

      <div className="flex gap-3">
        <button onClick={handleSave} disabled={saving} className="btn-primary flex-1">
          {saving ? "Menyimpan..." : "Simpan Artikel"}
        </button>
        {post?.id && (
          <button onClick={handleDelete} className="btn-secondary !text-red-400 !border-red-900">Hapus</button>
        )}
      </div>
    </div>
  );
}
