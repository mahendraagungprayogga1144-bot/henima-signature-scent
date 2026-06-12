import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function BlogPage({ searchParams }: { searchParams: { q?: string } }) {
  let query = supabase.from("blog_posts").select("*").eq("published", true).order("created_at", { ascending: false });
  if (searchParams.q) query = query.ilike("title", `%${searchParams.q}%`);
  const { data: posts } = await query;

  return (
    <div style={{background:"#FAF8F4",minHeight:"100vh",fontFamily:"var(--font-jost,sans-serif)",color:"#1C1917"}}>
      <div style={{padding:"clamp(80px,10vw,140px) clamp(20px,8vw,80px) clamp(40px,6vw,80px)",borderBottom:"1px solid rgba(28,25,23,0.08)"}}>
        <p style={{fontSize:"10px",letterSpacing:"4px",textTransform:"uppercase",color:"#9A8F82",marginBottom:"20px"}}>Henima Signature Scent</p>
        <h1 style={{fontFamily:"var(--font-cormorant,serif)",fontSize:"clamp(36px,6vw,80px)",fontWeight:400,fontStyle:"italic",color:"#1C1917",lineHeight:1.1,marginBottom:"20px"}}>Journal</h1>
        <p style={{fontSize:"clamp(13px,1.4vw,16px)",color:"#9A8F82",maxWidth:"400px",lineHeight:1.8}}>Cerita, tips, dan inspirasi dari dunia wewangian Henima.</p>
      </div>
      <div style={{padding:"0 clamp(20px,8vw,80px)",borderBottom:"1px solid rgba(28,25,23,0.08)"}}>
        <form style={{display:"flex",alignItems:"center",gap:"0",maxWidth:"480px",padding:"20px 0"}}>
          <span style={{fontSize:"11px",letterSpacing:"2px",textTransform:"uppercase",color:"#9A8F82",marginRight:"16px",whiteSpace:"nowrap"}}>Search</span>
          <input name="q" defaultValue={searchParams.q||""} placeholder="Cari artikel..." style={{flex:1,border:"none",borderBottom:"1px solid rgba(28,25,23,0.15)",padding:"8px 0",fontSize:"14px",color:"#1C1917",background:"transparent",outline:"none",fontFamily:"var(--font-jost,sans-serif)"}}/>
          <button type="submit" style={{background:"none",border:"none",cursor:"pointer",padding:"8px",color:"#9A8F82",fontSize:"16px"}}>→</button>
        </form>
      </div>
      <div style={{maxWidth:"1080px",margin:"0 auto",padding:"clamp(40px,6vw,80px) clamp(20px,6vw,40px)"}}>
        {!posts || posts.length === 0 ? (
          <div style={{textAlign:"center",padding:"80px 20px"}}>
            <p style={{fontFamily:"var(--font-cormorant,serif)",fontSize:"28px",fontWeight:400,color:"#9A8F82",fontStyle:"italic"}}>Belum ada artikel.</p>
          </div>
        ) : (
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:"1px",background:"rgba(28,25,23,0.06)"}}>
            {posts.map((post: any) => (
              <Link key={post.id} href={`/blog/${post.slug}`} style={{textDecoration:"none",display:"block",background:"#FAF8F4",overflow:"hidden"}}>
                <div style={{position:"relative",aspectRatio:"16/9",background:"#F0EDE6",overflow:"hidden"}}>
                  {post.cover_image
                    ? <Image src={post.cover_image} alt={post.title} fill style={{objectFit:"cover",filter:"brightness(.95)"}}/>
                    : <div style={{width:"100%",height:"100%",background:"linear-gradient(135deg,#1A1714,#2A2420)",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontFamily:"var(--font-cormorant,serif)",fontSize:"32px",fontStyle:"italic",color:"rgba(200,184,154,.2)"}}>H</span></div>
                  }
                </div>
                <div style={{padding:"28px 24px"}}>
                  <p style={{fontSize:"10px",letterSpacing:"2px",textTransform:"uppercase",color:"#9A8F82",marginBottom:"12px"}}>{new Date(post.created_at).toLocaleDateString("id-ID",{day:"numeric",month:"long",year:"numeric"})}</p>
                  <h2 style={{fontFamily:"var(--font-cormorant,serif)",fontSize:"clamp(18px,2vw,24px)",fontWeight:400,color:"#1C1917",lineHeight:1.3,marginBottom:"12px"}}>{post.title}</h2>
                  {post.excerpt && <p style={{fontSize:"13px",color:"#9A8F82",lineHeight:1.7,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical" as const,overflow:"hidden"}}>{post.excerpt}</p>}
                  <p style={{fontSize:"10px",letterSpacing:"2px",textTransform:"uppercase",color:"#9A8F82",marginTop:"20px"}}>Baca Selengkapnya →</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
