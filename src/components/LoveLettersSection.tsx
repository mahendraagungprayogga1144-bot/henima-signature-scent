'use client'
import { useEffect, useState, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
type Story = {id:string;name:string;city:string;story:string;perfume:string;admin_reply?:string;avatar_url?:string}
export default function LoveLettersSection() {
  const [stories, setStories] = useState<Story[]>([])
  const trackRef = useRef<HTMLDivElement>(null)
  useEffect(()=>{
    supabase.from('love_stories').select('id,name,city,story,perfume,admin_reply,avatar_url').eq('status','approved').eq('show_on_homepage',true).order('created_at',{ascending:false}).limit(10).then(({data})=>setStories(data||[]))
  },[])
  const scroll=(dir:number)=>{
    if(trackRef.current) trackRef.current.scrollBy({left:dir*340,behavior:'smooth'})
  }
  if(!stories.length) return null
  return(
    <section style={{background:"#111009",padding:"100px 0",borderTop:"1px solid rgba(255,255,255,0.06)"}}>
      <div style={{padding:"0 8vw",marginBottom:"48px",display:"flex",alignItems:"flex-end",justifyContent:"space-between",flexWrap:"wrap",gap:"16px"}}>
        <div>
          <p style={{fontSize:"10px",letterSpacing:"4px",textTransform:"uppercase",color:"rgba(255,255,255,0.35)",marginBottom:"16px",fontFamily:"var(--font-jost)",fontWeight:400}}>Love Letters</p>
          <h2 style={{fontFamily:"var(--font-cormorant)",fontSize:"clamp(2.2rem,4vw,3.5rem)",fontWeight:400,color:"#F0EBE3",lineHeight:1.1,letterSpacing:"-0.01em"}}>Mereka sudah<br/>merasakannya.</h2>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
          <button onClick={()=>scroll(-1)} style={{width:"44px",height:"44px",borderRadius:"50%",border:"1px solid rgba(255,255,255,0.15)",background:"transparent",color:"#F0EBE3",fontSize:"18px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"border-color .2s"}} onMouseEnter={e=>(e.currentTarget.style.borderColor="rgba(255,255,255,0.4)")} onMouseLeave={e=>(e.currentTarget.style.borderColor="rgba(255,255,255,0.15)")}>&#8592;</button>
          <button onClick={()=>scroll(1)} style={{width:"44px",height:"44px",borderRadius:"50%",border:"1px solid rgba(255,255,255,0.15)",background:"transparent",color:"#F0EBE3",fontSize:"18px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"border-color .2s"}} onMouseEnter={e=>(e.currentTarget.style.borderColor="rgba(255,255,255,0.4)")} onMouseLeave={e=>(e.currentTarget.style.borderColor="rgba(255,255,255,0.15)")}>&#8594;</button>
          <a href="/love-letters" style={{fontSize:"10px",letterSpacing:"2.5px",textTransform:"uppercase",color:"rgba(255,255,255,0.4)",textDecoration:"none",fontFamily:"var(--font-jost)",fontWeight:400,marginLeft:"8px",borderBottom:"1px solid rgba(255,255,255,0.15)",paddingBottom:"2px",transition:"color .2s"}} onMouseEnter={e=>(e.currentTarget.style.color="rgba(255,255,255,0.8)")} onMouseLeave={e=>(e.currentTarget.style.color="rgba(255,255,255,0.4)")}>Lihat Semua</a>
        </div>
      </div>
      <div ref={trackRef} style={{display:"flex",gap:"1px",overflowX:"auto",scrollbarWidth:"none",paddingLeft:"8vw",paddingRight:"8vw",scrollSnapType:"x mandatory"}} className="ll-track">
        {stories.map(s=>(
          <div key={s.id} style={{flexShrink:0,width:"320px",background:"#1A1814",padding:"36px 32px",scrollSnapAlign:"start",borderRight:"1px solid rgba(255,255,255,0.05)"}}>
            <div style={{display:"flex",gap:"2px",marginBottom:"20px"}}>
              {[1,2,3,4,5].map(i=><span key={i} style={{color:"#C8B89A",fontSize:"12px"}}>★</span>)}
            </div>
            <p style={{fontFamily:"var(--font-cormorant)",fontStyle:"italic",fontSize:"17px",lineHeight:1.8,color:"#F0EBE3",fontWeight:300,marginBottom:"28px",minHeight:"120px"}}>&#8220;{s.story}&#8221;</p>
            <div style={{borderTop:"1px solid rgba(255,255,255,0.08)",paddingTop:"20px",display:"flex",alignItems:"center",gap:"12px"}}>
              {(s as any).avatar_url ? <img src={(s as any).avatar_url} alt={s.name} style={{width:"34px",height:"34px",borderRadius:"50%",objectFit:"cover",flexShrink:0}}/> : <div style={{width:"34px",height:"34px",borderRadius:"50%",background:"rgba(255,255,255,0.06)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--font-cormorant)",fontSize:"14px",color:"rgba(255,255,255,0.5)",flexShrink:0}}>{s.name.charAt(0).toUpperCase()}</div>}
              <div>
                <p style={{fontFamily:"var(--font-cormorant)",fontSize:"14px",fontWeight:400,color:"rgba(255,255,255,0.8)",marginBottom:"2px"}}>{s.name}</p>
                <p style={{fontSize:"10px",color:"rgba(255,255,255,0.3)",letterSpacing:"2px",textTransform:"uppercase",fontFamily:"var(--font-jost)",fontWeight:300}}>{s.city}{s.perfume&&s.perfume!=="Belum punya Henima"?` — ${s.perfume}`:""}</p>
              </div>
            </div>
            {s.admin_reply&&(
              <div style={{marginTop:"20px",paddingTop:"16px",borderTop:"1px solid rgba(255,255,255,0.06)"}}>
                <p style={{fontSize:"10px",letterSpacing:"2px",textTransform:"uppercase",color:"rgba(200,184,154,0.5)",marginBottom:"6px",fontFamily:"var(--font-jost)"}}>Henima</p>
                <p style={{fontSize:"13px",color:"rgba(255,255,255,0.4)",lineHeight:1.7,fontStyle:"italic",fontFamily:"var(--font-cormorant)"}}>&#8220;{s.admin_reply}&#8221;</p>
              </div>
            )}
          </div>
        ))}
      </div>
      <div style={{padding:"0 8vw",marginTop:"56px",textAlign:"center"}}>
        <a href="/share-story" style={{display:"inline-block",padding:"14px 48px",border:"1px solid rgba(255,255,255,0.2)",color:"#F0EBE3",fontSize:"10px",letterSpacing:"3px",textTransform:"uppercase",textDecoration:"none",fontFamily:"var(--font-jost)",fontWeight:400,transition:"background .2s,color .2s"}} onMouseEnter={e=>{(e.currentTarget as HTMLAnchorElement).style.background="#F0EBE3";(e.currentTarget as HTMLAnchorElement).style.color="#111009"}} onMouseLeave={e=>{(e.currentTarget as HTMLAnchorElement).style.background="transparent";(e.currentTarget as HTMLAnchorElement).style.color="#F0EBE3"}}>Bagikan Kisahmu</a>
      </div>
      <style>{`.ll-track::-webkit-scrollbar{display:none}`}</style>
    </section>
  )
}
