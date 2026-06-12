'use client'
import { useState, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
const PERFUMES = ['Belum punya Henima','Henima No.1','Henima No.2','Henima No.3','Lainnya']
export default function ShareStoryPage() {
  const [form, setForm] = useState({name:'',city:'',perfume:'',story:''})
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle')
  const [char, setChar] = useState(0)
  const [avatar, setAvatar] = useState<File|null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string|null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const pickFile=(e:React.ChangeEvent<HTMLInputElement>)=>{
    const f=e.target.files?.[0]
    if(!f) return
    setAvatar(f)
    setAvatarPreview(URL.createObjectURL(f))
  }
  const submit=async()=>{
    if(!form.name||!form.city||!form.story) return
    setStatus('loading')
    let avatar_url=null
    if(avatar){
      const ext=avatar.name.split('.').pop()
      const path=`${Date.now()}.${ext}`
      const {error:upErr}=await supabase.storage.from('avatars').upload(path,avatar,{contentType:avatar.type})
      if(!upErr){
        const {data}=supabase.storage.from('avatars').getPublicUrl(path)
        avatar_url=data.publicUrl
      }
    }
    const {error}=await supabase.from('love_stories').insert([{...form,status:'pending',avatar_url}])
    setStatus(error?'error':'success')
  }
  return(<><style>{`
    .ss{--bg:#F7F4EF;--bg2:#EFEBE3;--black:#1A1714;--ink:#2E2A25;--muted:#7A736A;--gold:#B5874A;--border:rgba(181,135,74,.18);--serif:var(--font-cormorant),Georgia,serif;--sans:var(--font-jost),system-ui,sans-serif;background:var(--bg);min-height:100vh;font-family:var(--sans);font-weight:300;color:var(--ink)}
    .ss-hero{background:var(--black);padding:120px 6vw 80px;text-align:center;position:relative;overflow:hidden}
    .ss-hero h1{font-family:var(--serif);font-size:clamp(2.2rem,5vw,4.5rem);font-weight:400;line-height:1.15;color:#F0EBE3;margin-bottom:20px}
    .ss-hero h1 em{font-style:italic;color:#C8B89A}
    .ss-hero p{font-size:15px;color:rgba(240,235,227,.45);max-width:480px;margin:0 auto;line-height:1.85}
    .ss-label{font-size:10px;letter-spacing:.26em;text-transform:uppercase;color:rgba(200,184,154,.6);margin-bottom:20px;display:block}
    .ss-form{max-width:640px;margin:0 auto;padding:80px 6vw}
    .ss-field{margin-bottom:28px}
    .ss-flabel{display:block;font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:#9A8F82;margin-bottom:10px;font-family:var(--sans)}
    .ss-input,.ss-select,.ss-textarea{width:100%;background:transparent;border:none;border-bottom:1px solid rgba(28,25,23,0.15);padding:10px 0;font-family:var(--sans);font-size:15px;color:var(--ink);font-weight:300;outline:none;transition:border-color .2s;-webkit-appearance:none;border-radius:0}
    .ss-input:focus,.ss-select:focus,.ss-textarea:focus{border-bottom-color:var(--ink)}
    .ss-textarea{resize:none;height:140px;line-height:1.7}
    .ss-char{text-align:right;font-size:11px;color:rgba(122,115,106,.4);margin-top:6px}
    .ss-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px}
    .ss-avatar-wrap{display:flex;align-items:center;gap:20px;margin-bottom:28px}
    .ss-avatar-img{width:72px;height:72px;border-radius:50%;object-fit:cover;border:1px solid rgba(28,25,23,0.1)}
    .ss-avatar-placeholder{width:72px;height:72px;border-radius:50%;background:rgba(28,25,23,0.05);border:1px solid rgba(28,25,23,0.1);display:flex;align-items:center;justify-content:center;flex-shrink:0}
    .ss-avatar-placeholder svg{width:24px;height:24px;opacity:.3}
    .ss-avatar-btn{font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:var(--ink);border:1px solid rgba(28,25,23,0.2);padding:8px 20px;cursor:pointer;background:transparent;font-family:var(--sans);transition:background .2s,color .2s}
    .ss-avatar-btn:hover{background:var(--ink);color:var(--bg)}
    .ss-avatar-note{font-size:11px;color:rgba(122,115,106,.5);margin-top:4px}
    .ss-btn{width:100%;padding:18px;background:var(--black);color:var(--bg);font-size:10px;letter-spacing:.2em;text-transform:uppercase;font-family:var(--sans);border:none;cursor:pointer;position:relative;overflow:hidden;transition:color .35s,transform .2s;margin-top:8px}
    .ss-btn::before{content:'';position:absolute;inset:0;background:#4A4440;transform:scaleX(0);transform-origin:left;transition:transform .4s ease}
    .ss-btn:hover{transform:translateY(-1px)}
    .ss-btn:hover::before{transform:scaleX(1)}
    .ss-btn span{position:relative;z-index:1}
    .ss-btn:disabled{opacity:.4;cursor:not-allowed}
    .ss-success{text-align:center;padding:60px 32px;background:var(--bg2);border:1px solid rgba(28,25,23,0.08)}
    .ss-note{font-size:12px;color:var(--muted);text-align:center;line-height:1.7;margin-top:24px;font-family:var(--sans)}
    @media(max-width:600px){.ss-grid{grid-template-columns:1fr}}
  `}</style>
  <div className="ss">
    <div className="ss-hero">
      <span className="ss-label">Share Your Story</span>
      <h1>Kisahmu layak<br/><em>untuk dikenang.</em></h1>
      <p>Henima lahir dari sebuah cerita cinta. Dan kami percaya, kamu pun punya ceritamu sendiri.</p>
    </div>
    <div className="ss-form">
      {status==='success'?(
        <div className="ss-success">
          <h3 style={{fontFamily:"var(--font-cormorant)",fontSize:28,fontWeight:400,color:"var(--black)",marginBottom:12}}>Terima kasih sudah berbagi.</h3>
          <p style={{fontSize:14,color:"var(--muted)",lineHeight:1.85}}>Ceritamu sedang kami baca dengan sepenuh hati.<br/>Jika terpilih, kisahmu akan hadir di Love Letters Henima.</p>
        </div>
      ):(
        <>
          {/* AVATAR UPLOAD */}
          <div className="ss-field">
            <label className="ss-flabel">Foto kamu (opsional)</label>
            <div className="ss-avatar-wrap">
              {avatarPreview
                ? <img src={avatarPreview} alt="preview" className="ss-avatar-img"/>
                : <div className="ss-avatar-placeholder">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </div>
              }
              <div>
                <button className="ss-avatar-btn" onClick={()=>fileRef.current?.click()}>
                  {avatarPreview ? 'Ganti Foto' : 'Upload Foto'}
                </button>
                <p className="ss-avatar-note">JPG atau PNG, maks 2MB</p>
              </div>
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={pickFile}/>
          </div>

          <div className="ss-grid">
            <div className="ss-field"><label className="ss-flabel">Nama kamu</label><input className="ss-input" placeholder="Siapa namamu?" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div>
            <div className="ss-field"><label className="ss-flabel">Kota</label><input className="ss-input" placeholder="Kamu dari mana?" value={form.city} onChange={e=>setForm({...form,city:e.target.value})}/></div>
          </div>
          <div className="ss-field"><label className="ss-flabel">Parfum Henima yang menemanimu</label><select className="ss-select" value={form.perfume} onChange={e=>setForm({...form,perfume:e.target.value})}><option value="">Pilih parfum...</option>{PERFUMES.map(p=><option key={p} value={p}>{p}</option>)}</select></div>
          <div className="ss-field"><label className="ss-flabel">Ceritamu</label><textarea className="ss-textarea" placeholder="Ceritakan kisah cintamu..." value={form.story} onChange={e=>{setForm({...form,story:e.target.value});setChar(e.target.value.length)}} maxLength={500}/><p className="ss-char">{char}/500</p></div>
          <button className="ss-btn" onClick={submit} disabled={status==='loading'||!form.name||!form.city||!form.story}><span>{status==='loading'?'Mengirim...':'Kirim Ceritaku'}</span></button>
          {status==='error'&&<p style={{color:'#c0392b',fontSize:13,marginTop:12,textAlign:'center'}}>Gagal mengirim, coba lagi ya.</p>}
          <p className="ss-note">Ceritamu akan direview tim Henima sebelum ditampilkan.</p>
        </>
      )}
    </div>
  </div></>)
}
