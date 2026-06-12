'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
type Story = {id:string;name:string;city:string;story:string;perfume:string;created_at:string;admin_reply?:string}
export default function LoveWallPage() {
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(()=>{
    supabase.from('love_stories').select('id,name,city,story,perfume,created_at,admin_reply').eq('status','approved').order('created_at',{ascending:false}).then(({data})=>{setStories(data||[]);setLoading(false)})
  },[])
  const fmt=(d:string)=>new Date(d).toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'})
  return(<><style>{`.lw{--bg:#F7F4EF;--bg2:#EFEBE3;--black:#1A1714;--ink:#2E2A25;--muted:#7A736A;--gold:#B5874A;--gold2:#D4A96A;--border:rgba(181,135,74,.18);--serif:var(--font-cormorant),Georgia,serif;--sans:var(--font-jost),system-ui,sans-serif;background:var(--bg);min-height:100vh;font-family:var(--sans);font-weight:300;color:var(--ink)}.lw-hero{background:var(--black);padding:120px 6vw 80px;text-align:center;position:relative;overflow:hidden}.lw-hero h1{font-family:var(--serif);font-size:clamp(2.2rem,5vw,4.5rem);font-weight:400;line-height:1.15;color:#F7F4EF;margin-bottom:20px}.lw-hero h1 em{font-style:italic;color:var(--gold)}.lw-hero p{font-size:15px;color:rgba(245,240,232,.55);max-width:480px;margin:0 auto;line-height:1.85}.lw-label{font-size:10px;letter-spacing:.26em;text-transform:uppercase;color:var(--gold2);margin-bottom:20px;display:block}.lw-share{display:inline-block;margin-top:36px;padding:14px 40px;border:1px solid rgba(181,135,74,.4);color:var(--gold);font-size:11px;letter-spacing:.18em;text-transform:uppercase;text-decoration:none;font-family:var(--sans);transition:background .2s,color .2s}.lw-share:hover{background:var(--gold);color:var(--black)}.lw-section{padding:80px 6vw}.lw-inner{max-width:1080px;margin:0 auto}.lw-count{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin-bottom:40px}.lw-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:24px}.lw-card{background:var(--bg);border:1px solid var(--border);padding:32px 28px;transition:background .2s,transform .2s,box-shadow .2s}.lw-card:hover{background:var(--bg2);transform:translateY(-2px);box-shadow:0 8px 32px rgba(181,135,74,.08)}.lw-head{display:flex;align-items:center;gap:12px;margin-bottom:20px}.lw-avatar{width:40px;height:40px;border-radius:50%;background:rgba(181,135,74,.1);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-family:var(--serif);font-size:16px;color:var(--gold);flex-shrink:0}.lw-name{font-family:var(--serif);font-size:16px;font-weight:400;color:var(--black);margin-bottom:2px}.lw-meta{font-size:11px;color:var(--muted);letter-spacing:.06em}.lw-story{font-family:var(--serif);font-style:italic;font-size:15px;line-height:1.8;color:var(--ink);margin-bottom:20px}.lw-perf{font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);padding:6px 14px;border:1px solid var(--border);display:inline-block}.lw-reply{margin-top:20px;padding-top:16px;border-top:1px solid var(--border)}.lw-reply-label{font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);margin-bottom:8px}.lw-reply-text{font-size:13px;color:var(--muted);line-height:1.7;font-style:italic}.lw-empty{text-align:center;padding:80px 20px}.lw-loading{text-align:center;padding:80px 20px;color:var(--muted);font-size:14px}@media(max-width:600px){.lw-hero{padding:100px 5vw 60px}.lw-section{padding:60px 5vw}}`}</style>
  <div className="lw">
    <div className="lw-hero">
      <span className="lw-label">Love Letters Wall</span>
      <h1>Kisah nyata,<br/><em>dari hati ke hati.</em></h1>
      <p>Setiap cerita di sini adalah bukti bahwa cinta selalu punya cara untuk bertahan.</p>
      <a href="/share-story" className="lw-share">Bagikan Kisahmu 💛</a>
    </div>
    <div className="lw-section"><div className="lw-inner">
      {loading?(<p className="lw-loading">Memuat kisah-kisah cinta... 💛</p>):stories.length===0?(<div className="lw-empty"><p style={{fontFamily:'var(--serif)',fontSize:20,color:'var(--muted)'}}>Belum ada cerita. Jadilah yang pertama berbagi! 💛</p></div>):(<>
        <p className="lw-count">{stories.length} kisah cinta telah diabadikan</p>
        <div className="lw-grid">{stories.map(s=>(
          <div key={s.id} className="lw-card">
            <div className="lw-head">
              <div className="lw-avatar">{s.name.charAt(0).toUpperCase()}</div>
              <div><p className="lw-name">{s.name}</p><p className="lw-meta">{s.city} · {fmt(s.created_at)}</p></div>
            </div>
            <p className="lw-story">&ldquo;{s.story}&rdquo;</p>
            {s.perfume&&s.perfume!=='Belum punya Henima'&&<span className="lw-perf">{s.perfume}</span>}
            {s.admin_reply&&<div className="lw-reply"><p className="lw-reply-label">Pesan dari Henima 💛</p><p className="lw-reply-text">{s.admin_reply}</p></div>}
          </div>
        ))}</div>
      </>)}
    </div></div>
  </div></>)
}
