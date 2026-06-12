'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
type Story = {id:string;name:string;city:string;story:string;perfume:string;status:string;created_at:string;admin_reply?:string}
export default function AdminStoriesPage() {
  const [stories, setStories] = useState<Story[]>([])
  const [filter, setFilter] = useState<'all'|'pending'|'approved'|'rejected'>('pending')
  const [loading, setLoading] = useState(true)
  const [reply, setReply] = useState<{[k:string]:string}>({})
  const fetch = async () => {
    setLoading(true)
    let q = supabase.from('love_stories').select('*').order('created_at',{ascending:false})
    if(filter!=='all') q=q.eq('status',filter)
    const {data}=await q
    setStories(data||[]);setLoading(false)
  }
  useEffect(()=>{fetch()},[filter])
  const updateStatus=async(id:string,status:string)=>{await supabase.from('love_stories').update({status}).eq('id',id);fetch()}
  const sendReply=async(id:string)=>{
    if(!reply[id]) return
    await supabase.from('love_stories').update({admin_reply:reply[id],replied_at:new Date().toISOString(),status:'approved'}).eq('id',id)
    setReply(r=>({...r,[id]:''}));fetch()
  }
  const fmt=(d:string)=>new Date(d).toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'})
  const sc:any={pending:'#B5874A',approved:'#27ae60',rejected:'#c0392b'}
  return(<><style>{`.adm{--bg:#F7F4EF;--bg2:#EFEBE3;--black:#1A1714;--ink:#2E2A25;--muted:#7A736A;--gold:#B5874A;--border:rgba(181,135,74,.18);--serif:var(--font-cormorant),Georgia,serif;--sans:var(--font-jost),system-ui,sans-serif;background:var(--bg2);min-height:100vh;font-family:var(--sans);font-weight:300;color:var(--ink);padding:40px 4vw}.adm-h1{font-family:var(--serif);font-size:28px;font-weight:400;color:var(--black);margin-bottom:4px}.adm-sub{font-size:13px;color:var(--muted);margin-bottom:32px}.adm-tabs{display:flex;gap:8px;margin-bottom:28px;flex-wrap:wrap}.adm-tab{padding:8px 18px;font-size:11px;letter-spacing:.12em;text-transform:uppercase;border:1px solid var(--border);background:transparent;cursor:pointer;color:var(--muted);transition:all .2s;font-family:var(--sans)}.adm-tab.on{background:var(--black);color:var(--bg);border-color:var(--black)}.adm-card{background:var(--bg);border:1px solid var(--border);padding:28px;margin-bottom:16px}.adm-top{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:16px;flex-wrap:wrap}.adm-name{font-family:var(--serif);font-size:18px;font-weight:400;color:var(--black);margin-bottom:4px}.adm-date{font-size:12px;color:var(--muted)}.adm-badge{font-size:10px;letter-spacing:.12em;text-transform:uppercase;padding:4px 12px;border-radius:2px;flex-shrink:0}.adm-story{font-family:var(--serif);font-style:italic;font-size:15px;line-height:1.75;color:var(--ink);margin-bottom:20px;padding:16px 20px;background:var(--bg2);border-left:2px solid var(--border)}.adm-actions{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:16px}.adm-btn{padding:8px 20px;font-size:11px;letter-spacing:.12em;text-transform:uppercase;border:1px solid;cursor:pointer;font-family:var(--sans);transition:all .2s;background:transparent}.adm-ok{border-color:#27ae60;color:#27ae60}.adm-ok:hover{background:#27ae60;color:white}.adm-no{border-color:#c0392b;color:#c0392b}.adm-no:hover{background:#c0392b;color:white}.adm-rep{border-top:1px solid var(--border);padding-top:16px}.adm-rlabel{font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--gold);margin-bottom:8px}.adm-rexist{font-size:13px;color:var(--muted);font-style:italic;margin-bottom:12px}.adm-rrow{display:flex;gap:10px}.adm-rinput{flex:1;padding:10px 14px;border:1px solid var(--border);background:var(--bg2);font-family:var(--sans);font-size:13px;color:var(--ink);outline:none}.adm-rinput:focus{border-color:var(--gold)}.adm-rsend{padding:10px 20px;background:var(--black);color:var(--bg);border:none;cursor:pointer;font-size:11px;letter-spacing:.12em;text-transform:uppercase;font-family:var(--sans);white-space:nowrap;transition:background .2s}.adm-rsend:hover{background:var(--gold)}.adm-empty{text-align:center;padding:60px;color:var(--muted);font-size:14px}.adm-count{font-size:12px;color:var(--muted);margin-bottom:20px}`}</style>
  <div className="adm">
    <h1 className="adm-h1">Love Stories 💛</h1>
    <p className="adm-sub">Kelola cerita cinta dari pelanggan Henima</p>
    <div className="adm-tabs">
      {(['pending','approved','rejected','all'] as const).map(f=>(
        <button key={f} className={`adm-tab ${filter===f?'on':''}`} onClick={()=>setFilter(f)}>
          {f==='all'?'Semua':f==='pending'?'Menunggu':f==='approved'?'Disetujui':'Ditolak'}
        </button>
      ))}
    </div>
    {loading?(<p className="adm-empty">Memuat...</p>):stories.length===0?(<p className="adm-empty">Tidak ada cerita.</p>):(<>
      <p className="adm-count">{stories.length} cerita</p>
      {stories.map(s=>(
        <div key={s.id} className="adm-card">
          <div className="adm-top">
            <div><p className="adm-name">{s.name} — {s.city}</p><p className="adm-date">{fmt(s.created_at)}{s.perfume?` · ${s.perfume}`:''}</p></div>
            <span className="adm-badge" style={{background:sc[s.status]+'18',color:sc[s.status],border:`1px solid ${sc[s.status]}40`}}>
              {s.status==='pending'?'Menunggu':s.status==='approved'?'Disetujui':'Ditolak'}
            </span>
          </div>
          <div className="adm-story">&ldquo;{s.story}&rdquo;</div>
          {s.status!=='approved'&&(
            <div className="adm-actions">
              <button className="adm-btn adm-ok" onClick={()=>updateStatus(s.id,'approved')}>✓ Setujui & Tampilkan</button>
              <button className="adm-btn adm-no" onClick={()=>updateStatus(s.id,'rejected')}>✕ Tolak</button>
            </div>
          )}
          <div className="adm-rep">
            <p className="adm-rlabel">Pesan dari Henima</p>
            {s.admin_reply&&<p className="adm-rexist">&ldquo;{s.admin_reply}&rdquo;</p>}
            <div className="adm-rrow">
              <input className="adm-rinput" placeholder="Tulis pesan hangat untuk mereka..." value={reply[s.id]||''} onChange={e=>setReply(r=>({...r,[s.id]:e.target.value}))} onKeyDown={e=>{if(e.key==='Enter')sendReply(s.id)}}/>
              <button className="adm-rsend" onClick={()=>sendReply(s.id)}>Kirim 💛</button>
            </div>
          </div>
        </div>
      ))}
    </>)}
  </div></>)
}
