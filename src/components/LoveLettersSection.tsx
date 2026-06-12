'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
type Story = {id:string;name:string;city:string;story:string;perfume:string;admin_reply?:string}
export default function LoveLettersSection() {
  const [stories, setStories] = useState<Story[]>([])
  useEffect(()=>{
    supabase.from('love_stories').select('id,name,city,story,perfume,admin_reply').eq('status','approved').eq('show_on_homepage',true).order('created_at',{ascending:false}).limit(6).then(({data})=>setStories(data||[]))
  },[])
  if(!stories.length) return null
  return(
    <section style={{background:"#F7F4EF",padding:"100px 8vw",borderTop:"1px solid rgba(28,25,23,0.06)"}}>
      <div style={{maxWidth:"1080px",margin:"0 auto"}}>
        <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:"56px",flexWrap:"wrap",gap:"16px"}}>
          <div>
            <p style={{fontSize:"10px",letterSpacing:"3px",textTransform:"uppercase",color:"#9A8F82",marginBottom:"12px",fontFamily:"var(--font-jost)",fontWeight:400}}>Love Letters</p>
            <h2 style={{fontFamily:"var(--font-cormorant)",fontSize:"clamp(2rem,3.5vw,3rem)",fontWeight:400,color:"#1C1917",lineHeight:1.2}}>Kisah nyata,<br/><em style={{color:"#B5874A"}}>dari hati pelanggan kami.</em></h2>
          </div>
          <a href="/love-letters" style={{fontSize:"11px",letterSpacing:"2px",textTransform:"uppercase",color:"#B5874A",textDecoration:"none",borderBottom:"1px solid rgba(181,135,74,.3)",paddingBottom:"2px",fontFamily:"var(--font-jost)",whiteSpace:"nowrap"}}>Lihat Semua →</a>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:"24px"}}>
          {stories.map(s=>(
            <div key={s.id} style={{background:"#FAF8F4",border:"1px solid rgba(28,25,23,0.08)",padding:"32px 28px",transition:"transform .2s,box-shadow .2s"}} onMouseEnter={e=>{(e.currentTarget as HTMLDivElement).style.transform="translateY(-2px)";(e.currentTarget as HTMLDivElement).style.boxShadow="0 8px 32px rgba(181,135,74,.08)"}} onMouseLeave={e=>{(e.currentTarget as HTMLDivElement).style.transform="none";(e.currentTarget as HTMLDivElement).style.boxShadow="none"}}>
              <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"20px"}}>
                <div style={{width:"40px",height:"40px",borderRadius:"50%",background:"rgba(181,135,74,.1)",border:"1px solid rgba(181,135,74,.2)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--font-cormorant)",fontSize:"16px",color:"#B5874A",flexShrink:0}}>{s.name.charAt(0).toUpperCase()}</div>
                <div>
                  <p style={{fontFamily:"var(--font-cormorant)",fontSize:"16px",fontWeight:400,color:"#1C1917",marginBottom:"2px"}}>{s.name}</p>
                  <p style={{fontSize:"11px",color:"#9A8F82",letterSpacing:"0.06em"}}>{s.city}{s.perfume&&s.perfume!=="Belum punya Henima"?` · ${s.perfume}`:""}</p>
                </div>
              </div>
              <p style={{fontFamily:"var(--font-cormorant)",fontStyle:"italic",fontSize:"15px",lineHeight:1.8,color:"#2E2A25",marginBottom:s.admin_reply?"20px":"0"}}>&#8220;{s.story}&#8221;</p>
              {s.admin_reply&&(
                <div style={{borderTop:"1px solid rgba(181,135,74,.15)",paddingTop:"16px"}}>
                  <p style={{fontSize:"10px",letterSpacing:"2px",textTransform:"uppercase",color:"#B5874A",marginBottom:"6px",fontFamily:"var(--font-jost)"}}>Dari Henima 💛</p>
                  <p style={{fontSize:"13px",color:"#7A736A",lineHeight:1.7,fontStyle:"italic",fontFamily:"var(--font-cormorant)"}}>{s.admin_reply}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        <div style={{textAlign:"center",marginTop:"48px"}}>
          <a href="/share-story" style={{display:"inline-block",padding:"14px 40px",border:"1px solid rgba(181,135,74,.4)",color:"#B5874A",fontSize:"11px",letterSpacing:"2px",textTransform:"uppercase",textDecoration:"none",fontFamily:"var(--font-jost)",transition:"background .2s,color .2s"}} onMouseEnter={e=>{(e.currentTarget as HTMLAnchorElement).style.background="#B5874A";(e.currentTarget as HTMLAnchorElement).style.color="#FAF8F4"}} onMouseLeave={e=>{(e.currentTarget as HTMLAnchorElement).style.background="transparent";(e.currentTarget as HTMLAnchorElement).style.color="#B5874A"}}>Bagikan Kisahmu 💛</a>
        </div>
      </div>
    </section>
  )
}
