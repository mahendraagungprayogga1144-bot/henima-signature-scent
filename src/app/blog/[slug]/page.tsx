import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", params.slug)
    .eq("published", true)
    .single();

  if (!post) notFound();

  const paragraphs = post.content ? post.content.split("\n").filter((p: string) => p.trim()) : [];

  return (
    <div style={{background:"#0E0D0B",minHeight:"100vh",fontFamily:"var(--font-jost,sans-serif)",color:"#F0EBE3"}}>

      {/* HERO IMAGE */}
      <div style={{position:"relative",height:"clamp(300px,55vw,620px)",overflow:"hidden"}}>
        {post.cover_image
          ? <Image src={post.cover_image} alt={post.title} fill style={{objectFit:"cover",filter:"brightness(.65)"}}/>
          : <div style={{width:"100%",height:"100%",background:"#1A1714"}}/>
        }
        <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom, transparent 30%, rgba(14,13,11,.95) 100%)"}}/>
        <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"clamp(24px,6vw,80px)"}}>
          <Link href="/blog" style={{fontSize:"10px",letterSpacing:"2.5px",textTransform:"uppercase",color:"rgba(200,184,154,.6)",textDecoration:"none",display:"inline-flex",alignItems:"center",gap:"8px",marginBottom:"20px"}}>← Journal</Link>
          <p style={{fontSize:"10px",letterSpacing:"3px",textTransform:"uppercase",color:"rgba(200,184,154,.5)",marginBottom:"16px"}}>
            {new Date(post.created_at).toLocaleDateString("id-ID",{day:"numeric",month:"long",year:"numeric"})} · {post.author||"Henima"}
          </p>
          <h1 style={{fontFamily:"var(--font-cormorant,serif)",fontSize:"clamp(28px,5vw,64px)",fontWeight:400,lineHeight:1.1,color:"#F0EBE3",maxWidth:"800px",margin:"0 0 16px"}}>{post.title}</h1>
          {post.excerpt && <p style={{fontSize:"clamp(14px,1.5vw,18px)",color:"rgba(240,235,227,.55)",maxWidth:"600px",lineHeight:1.8,fontStyle:"italic",fontFamily:"var(--font-cormorant,serif)"}}>{post.excerpt}</p>}
        </div>
      </div>

      {/* CONTENT */}
      <div style={{maxWidth:"720px",margin:"0 auto",padding:"clamp(40px,6vw,80px) clamp(20px,6vw,40px)"}}>
        <div style={{borderTop:"1px solid rgba(200,184,154,.15)",paddingTop:"48px"}}>
          {paragraphs.map((para: string, i: number) => (
            <p key={i} style={{
              fontSize:"clamp(15px,1.5vw,18px)",
              lineHeight:1.95,
              color: i===0 ? "rgba(240,235,227,.9)" : "rgba(240,235,227,.65)",
              marginBottom:"28px",
              fontFamily: i===0 ? "var(--font-cormorant,serif)" : "var(--font-jost,sans-serif)",
              fontStyle: i===0 ? "italic" : "normal",
              fontSize: i===0 ? "clamp(18px,2vw,24px)" : "clamp(15px,1.5vw,17px)",
              fontWeight: 300,
            }}>{para}</p>
          ))}
        </div>

        {/* CTA */}
        <div style={{borderTop:"1px solid rgba(200,184,154,.15)",marginTop:"48px",paddingTop:"48px",textAlign:"center"}}>
          <p style={{fontSize:"10px",letterSpacing:"3px",textTransform:"uppercase",color:"rgba(200,184,154,.4)",marginBottom:"20px"}}>Henima Signature Scent</p>
          <Link href="/shop" style={{display:"inline-block",padding:"14px 48px",border:"1px solid rgba(200,184,154,.3)",color:"#F0EBE3",fontSize:"10px",letterSpacing:"2.5px",textTransform:"uppercase",textDecoration:"none",fontFamily:"var(--font-jost,sans-serif)",transition:"all .2s"}}>Jelajahi Koleksi</Link>
        </div>

        <div style={{marginTop:"48px",paddingTop:"32px",borderTop:"1px solid rgba(200,184,154,.1)"}}>
          <Link href="/blog" style={{fontSize:"11px",letterSpacing:"2px",textTransform:"uppercase",color:"rgba(200,184,154,.45)",textDecoration:"none"}}>← Kembali ke Journal</Link>
        </div>
      </div>
    </div>
  );
}
