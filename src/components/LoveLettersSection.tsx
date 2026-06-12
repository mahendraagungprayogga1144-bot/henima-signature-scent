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
    <section style={{background:"#FAF8F4",padding:"100px 8vw",borderTop:"1px solid rgba(28,25,23,0.06)"}}>
      <div style={{maxWidth:"1080px",margin:"0 auto"}}>
        <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:"64px",flexWrap:"wrap",gap:"16px"}}>
          <div>
            <p style={{fontSize:"10px",letterSpacing:"3px",textTransform:"uppercase",color:"#9A8F82",marginBottom:"16px",fontFamily:"var(--font-jost)",fontWeight:400}}>Love Letters</p>
            <h2 style={{fontFamily:"var(--font-cormorant)",fontSize:"clamp(2rem,3.5vw,3rem)",fontWeight:400,color:"#1C1917",lineHeight:1.2}}>Kisah nyata,<br/><em style={{fontStyle:"italic"}}>dari hati pelanggan kami.</em></h2>
          </div>
          <a href="/love-letters" style={{fontSize:"10px",letterSpacing:"2.5px",textTransform:"uppercase",color:"#1C1917",textDecoration:"none",borderBottom:"1px solid rgba(28,25,23,0.3)",paddingBottom:"3px",fontFamily:"var(--font-jost)",fontWeight:400,whiteSpace:"nowrap",transition:"opacity .2s"}} onMouseEnter={e=>(e.currentTarget as HTMLAnchorElement).style.opacity=".5"} onMouseLeave={e=>(e.currentTarget as HTMLAnchorElement).style.opacity="1"}>Lihat Semua</a>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:"1px",background:"rgba(28,25,23,0.08)"}}>
          {stories.map(s=>(
            <div key={s.id} style={{background:"#FAF8F4",padding:"40px 32px",transition:"background .2s"}} onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.background="#F0EDE6"} onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.background="#FAF8F4"}>
              <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"24px"}}>
                <div style={{width:"36px",height:"36px",borderRadius:"50%",background:"rgba(28,25,23,0.06)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--font-cormorant)",fontSize:"15px",color:"#1C1917",flexShrink:0,fontWeight:400}}>{s.name.charAt(0).toUpperCase()}</div>
                <div>
                  <p style={{fontFamily:"var(--font-cormorant)",fontSize:"15px",fontWeight:400,color:"#1C1917",marginBottom:"2px",letterSpacing:"0.02em"}}>{s.name}</p>
                  <p style={{fontSize:"10px",color:"#9A8F82",letterSpacing:"2px",textTransform:"uppercase",fontFamily:"var(--font-jost)",fontWeight:300}}>{s.city}{s.perfume&&s.perfume!=="Belum punya Henima"?` — ${s.perfume}`:""}</p>
                </div>
              </div>
              <p style={{fontFamily:"var(--font-cormorant)",fontStyle:"italic",fontSize:"17px",lineHeight:1.75,color:"#1C1917",fontWeight:300}}>&#8220;{s.story}&#8221;</p>
              {s.admin_reply&&(
                <div style={{marginTop:"24px",paddingTop:"20px",borderTop:"1px solid rgba(28,25,23,0.08)"}}>
                  <p style={{fontSize:"10px",letterSpacing:"2.5px",textTransform:"uppercase",color:"#9A8F82",marginBottom:"8px",fontFamily:"var(--font-jost)",fontWeight:400}}>Henima</p>
                  <p style={{fontSize:"14px",color:"#4A4440",lineHeight:1.75,fontStyle:"italic",fontFamily:"var(--font-cormorant)",fontWeight:300}}>{s.admin_reply}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        <div style={{textAlign:"center",marginTop:"56px"}}>
          <a href="/share-story" style={{display:"inline-block",padding:"14px 48px",border:"1px solid rgba(28,25,23,0.2)",color:"#1C1917",fontSize:"10px",letterSpacing:"2.5px",textTransform:"uppercase",textDecoration:"none",fontFamily:"var(--font-jost)",fontWeight:400,transition:"background .2s,color .2s"}} onMouseEnter={e=>{(e.currentTarget as HTMLAnchorElement).style.background="#1C1917";(e.currentTarget as HTMLAnchorElement).style.color="#FAF8F4"}} onMouseLeave={e=>{(e.currentTarget as HTMLAnchorElement).style.background="transparent";(e.currentTarget as HTMLAnchorElement).style.color="#1C1917"}}>Bagikan Kisahmu</a>
        </div>
      </div>
    </section>
  )
}
