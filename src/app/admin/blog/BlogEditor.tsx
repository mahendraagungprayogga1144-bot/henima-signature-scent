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

  function generateSlug(t: string) {
    return t.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");
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
    setSaving(true); setMsg("");
    try {
      const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
      const data = { title, slug, excerpt, content, cover_image: coverImage, published, updated_at: new Date().toISOString() };
      if (post?.id) await sb.from("blog_posts").update(data).eq("id", post.id);
      else await sb.from("blog_posts").insert({ ...data, id: Date.now().toString() });
      setMsg("Artikel berhasil disimpan!");
      setTimeout(() => router.push("/admin/blog"), 1000);
    } catch(e: any) { setMsg("Gagal: " + e.message); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!post?.id || !confirm("Hapus artikel ini?")) return;
    const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    await sb.from("blog_posts").delete().eq("id", post.id);
    router.push("/admin/blog");
  }

  const s = {
    wrap: { fontFamily:"var(--font-jost,sans-serif)", color:"#1C1917", maxWidth:"800px" } as React.CSSProperties,
    label: { display:"block", fontSize:"10px", letterSpacing:"2.5px", textTransform:"uppercase" as const, color:"#9A8F82", marginBottom:"8px", fontWeight:400 },
    input: { width:"100%", border:"none", borderBottom:"1px solid rgba(28,25,23,0.15)", padding:"10px 0", fontSize:"15px", color:"#1C1917", background:"transparent", outline:"none", fontFamily:"var(--font-jost,sans-serif)", boxSizing:"border-box" as const, transition:"border-color .2s" },
    textarea: { width:"100%", border:"1px solid rgba(28,25,23,0.1)", padding:"16px", fontSize:"14px", color:"#1C1917", background:"#fff", outline:"none", fontFamily:"var(--font-jost,sans-serif)", resize:"vertical" as const, lineHeight:1.8, boxSizing:"border-box" as const },
    field: { marginBottom:"32px" },
    hint: { fontSize:"11px", color:"#9A8F82", marginTop:"6px", letterSpacing:"0.5px" },
    divider: { border:"none", borderTop:"1px solid rgba(28,25,23,0.08)", margin:"8px 0 32px" },
    btnPrimary: { background:"#1C1917", color:"#FAF8F4", border:"none", padding:"14px 40px", fontSize:"10px", letterSpacing:"2.5px", textTransform:"uppercase" as const, cursor:"pointer", fontFamily:"var(--font-jost,sans-serif)", transition:"opacity .2s" },
    btnSecondary: { background:"transparent", color:"#cc0000", border:"1px solid rgba(204,0,0,0.3)", padding:"14px 24px", fontSize:"10px", letterSpacing:"2px", textTransform:"uppercase" as const, cursor:"pointer", fontFamily:"var(--font-jost,sans-serif)" },
    toggle: { display:"flex", alignItems:"center", gap:"12px", cursor:"pointer" },
    track: (on: boolean) => ({ width:"44px", height:"24px", borderRadius:"12px", background:on?"#1C1917":"rgba(28,25,23,0.12)", position:"relative" as const, transition:"background .3s", cursor:"pointer", flexShrink:0 }),
    thumb: (on: boolean) => ({ position:"absolute" as const, top:"3px", left:on?"23px":"3px", width:"18px", height:"18px", borderRadius:"50%", background:"#fff", transition:"left .3s", boxShadow:"0 1px 4px rgba(0,0,0,.2)" }),
  };

  return (
    <div style={s.wrap}>
      <div style={s.field}>
        <label style={s.label}>Judul Artikel</label>
        <input style={{...s.input, fontSize:"22px", fontFamily:"var(--font-cormorant,serif)", fontWeight:400}}
          value={title} onChange={e=>{ setTitle(e.target.value); if(!post) setSlug(generateSlug(e.target.value)); }}
          placeholder="Tulis judul artikel..."/>
      </div>

      <div style={s.field}>
        <label style={s.label}>Slug (URL)</label>
        <input style={s.input} value={slug} onChange={e=>setSlug(e.target.value)} placeholder="judul-artikel"/>
        <p style={s.hint}>henimaofficial.com/blog/{slug||"judul-artikel"}</p>
      </div>

      <div style={s.field}>
        <label style={s.label}>Excerpt (ringkasan singkat)</label>
        <textarea style={{...s.textarea, height:"80px"}} value={excerpt} onChange={e=>setExcerpt(e.target.value)} placeholder="Ringkasan singkat artikel yang muncul di halaman blog..."/>
      </div>

      <div style={s.field}>
        <label style={s.label}>Cover Image</label>
        {coverImage && <img src={coverImage} alt="cover" style={{width:"100%", height:"200px", objectFit:"cover", marginBottom:"12px", border:"1px solid rgba(28,25,23,0.08)"}}/>}
        <label style={{display:"inline-flex", alignItems:"center", gap:"8px", border:"1px solid rgba(28,25,23,0.2)", padding:"10px 20px", cursor:"pointer", fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase" as const, color:"#1C1917", fontFamily:"var(--font-jost,sans-serif)"}}>
          {uploading ? "Mengupload..." : coverImage ? "Ganti Gambar" : "Upload Cover"}
          <input type="file" accept="image/*" style={{display:"none"}} onChange={handleCoverUpload} disabled={uploading}/>
        </label>
      </div>

      <hr style={s.divider}/>

      <div style={s.field}>
        <label style={s.label}>Isi Artikel</label>
        <p style={{...s.hint, marginBottom:"10px"}}>Tulis artikel dengan paragraf biasa. Enter untuk baris baru.</p>
        <textarea style={{...s.textarea, height:"400px", fontSize:"15px", lineHeight:1.9}} value={content} onChange={e=>setContent(e.target.value)} placeholder="Tulis isi artikel di sini...&#10;&#10;Setiap aroma punya cerita. Dan setiap cerita layak untuk diceritakan..."/>
      </div>

      <hr style={s.divider}/>

      <div style={{...s.field, display:"flex", alignItems:"center", justifyContent:"space-between"}}>
        <div>
          <p style={{...s.label, marginBottom:"4px"}}>Status Publikasi</p>
          <p style={{fontSize:"13px", color:published?"#2E7D32":"#9A8F82"}}>{published?"Artikel akan tampil di blog publik":"Draft — hanya terlihat oleh admin"}</p>
        </div>
        <div style={s.track(published)} onClick={()=>setPublished(!published)}>
          <div style={s.thumb(published)}/>
        </div>
      </div>

      {msg && <p style={{fontSize:"13px", color:msg.includes("berhasil")?"#2E7D32":"#cc0000", marginBottom:"20px", letterSpacing:"0.5px"}}>{msg}</p>}

      <div style={{display:"flex", gap:"12px"}}>
        <button onClick={handleSave} disabled={saving} style={{...s.btnPrimary, opacity:saving?.5:1}}>
          {saving?"Menyimpan...":"Simpan Artikel"}
        </button>
        {post?.id && <button onClick={handleDelete} style={s.btnSecondary}>Hapus Artikel</button>}
      </div>
    </div>
  );
}
