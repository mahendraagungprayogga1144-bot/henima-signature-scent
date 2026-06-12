import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { supabase } from "@/lib/supabase";

export default async function AdminBlogPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/masuk");
  if (!user || user.role !== "admin") redirect("/katalog");

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  const s = {
    page: { background:"#FAF8F4", minHeight:"100vh", padding:"48px 6vw", fontFamily:"var(--font-jost,sans-serif)", color:"#1C1917" },
    back: { fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase" as const, color:"#9A8F82", textDecoration:"none", display:"inline-flex", alignItems:"center", gap:"8px", marginBottom:"40px" },
    header: { display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:"48px", flexWrap:"wrap" as const, gap:"16px" },
    title: { fontFamily:"var(--font-cormorant,serif)", fontSize:"36px", fontWeight:400, color:"#1C1917", marginBottom:"4px" },
    sub: { fontSize:"13px", color:"#9A8F82" },
    newBtn: { background:"#1C1917", color:"#FAF8F4", padding:"12px 28px", fontSize:"10px", letterSpacing:"2.5px", textTransform:"uppercase" as const, textDecoration:"none", fontFamily:"var(--font-jost,sans-serif)", display:"inline-block" },
    empty: { textAlign:"center" as const, padding:"80px 20px", border:"1px solid rgba(28,25,23,0.08)" },
    emptyTitle: { fontFamily:"var(--font-cormorant,serif)", fontSize:"24px", fontWeight:400, color:"#1C1917", marginBottom:"8px" },
    emptyText: { fontSize:"13px", color:"#9A8F82" },
    postCard: { border:"1px solid rgba(28,25,23,0.08)", background:"#fff", padding:"28px 32px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:"16px", marginBottom:"1px", transition:"background .2s" },
    postTitle: { fontFamily:"var(--font-cormorant,serif)", fontSize:"20px", fontWeight:400, color:"#1C1917", marginBottom:"4px" },
    postMeta: { fontSize:"11px", color:"#9A8F82", letterSpacing:"1px" },
    badge: (pub: boolean) => ({ fontSize:"9px", letterSpacing:"2px", textTransform:"uppercase" as const, padding:"3px 10px", background:pub?"rgba(46,125,50,0.08)":"rgba(28,25,23,0.05)", color:pub?"#2E7D32":"#9A8F82", border:`1px solid ${pub?"rgba(46,125,50,0.2)":"rgba(28,25,23,0.1)"}`, marginLeft:"12px" }),
    editBtn: { fontSize:"10px", letterSpacing:"1.5px", textTransform:"uppercase" as const, color:"#1C1917", textDecoration:"none", borderBottom:"1px solid rgba(28,25,23,0.2)", paddingBottom:"2px", fontFamily:"var(--font-jost,sans-serif)", whiteSpace:"nowrap" as const },
  };

  return (
    <div style={s.page}>
      <Link href="/admin" style={s.back}>← Dashboard</Link>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Journal & Blog</h1>
          <p style={s.sub}>Tulis artikel, tips parfum, dan cerita brand Henima.</p>
        </div>
        <Link href="/admin/blog/baru" style={s.newBtn}>+ Artikel Baru</Link>
      </div>

      {!posts || posts.length === 0 ? (
        <div style={s.empty}>
          <p style={s.emptyTitle}>Belum ada artikel.</p>
          <p style={s.emptyText}>Mulai tulis artikel pertama Henima — tips parfum, behind the scenes, atau cerita brand.</p>
        </div>
      ) : (
        <div>
          {posts.map((post: any) => (
            <div key={post.id} style={s.postCard}>
              <div style={{flex:1, minWidth:0}}>
                <div style={{display:"flex", alignItems:"center", flexWrap:"wrap" as const, gap:"4px"}}>
                  <p style={s.postTitle}>{post.title}</p>
                  <span style={s.badge(post.published)}>{post.published?"Published":"Draft"}</span>
                </div>
                <p style={s.postMeta}>
                  {new Date(post.created_at).toLocaleDateString("id-ID",{day:"numeric",month:"long",year:"numeric"})}
                  {post.excerpt && ` · ${post.excerpt.slice(0,60)}...`}
                </p>
              </div>
              <Link href={`/admin/blog/${post.id}`} style={s.editBtn}>Edit</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
