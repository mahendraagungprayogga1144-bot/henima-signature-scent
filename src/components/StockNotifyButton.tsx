'use client'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export default function StockNotifyButton({ productId, productName }: { productId: string; productName: string }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle'|'open'|'loading'|'success'|'error'>('idle')

  const submit = async () => {
    if (!email || !email.includes('@')) return
    setStatus('loading')
    const { error } = await sb.from('stock_notifications').upsert({
      email, product_id: productId, product_name: productName, notified: false
    }, { onConflict: 'email,product_id' })
    setStatus(error ? 'error' : 'success')
  }

  if (status === 'success') return (
    <div style={{textAlign:'center',padding:'12px',background:'rgba(28,25,23,0.04)',border:'1px solid rgba(28,25,23,0.1)'}}>
      <p style={{fontSize:'12px',color:'#2E7D32',letterSpacing:'1px'}}>✓ Kami akan beritahu kamu via email!</p>
    </div>
  )

  return (
    <div>
      {status === 'idle' && (
        <button onClick={()=>setStatus('open')} style={{
          width:'100%',padding:'14px',background:'transparent',
          border:'1px solid rgba(28,25,23,0.2)',color:'#1C1917',
          fontSize:'10px',letterSpacing:'2px',textTransform:'uppercase',
          cursor:'pointer',fontFamily:'var(--font-jost,sans-serif)',transition:'background .2s'
        }}>
          Beritahu Saya Saat Tersedia
        </button>
      )}
      {status === 'open' && (
        <div style={{display:'flex',gap:'0'}}>
          <input
            type="email" value={email} onChange={e=>setEmail(e.target.value)}
            placeholder="Email kamu..."
            style={{flex:1,border:'1px solid rgba(28,25,23,0.2)',borderRight:'none',padding:'12px 14px',fontSize:'13px',color:'#1C1917',background:'#fff',outline:'none',fontFamily:'var(--font-jost,sans-serif)'}}
          />
          <button onClick={submit} style={{
            background:'#1C1917',color:'#FAF8F4',border:'none',padding:'12px 20px',
            fontSize:'10px',letterSpacing:'2px',textTransform:'uppercase',
            cursor:'pointer',fontFamily:'var(--font-jost,sans-serif)',whiteSpace:'nowrap'
          }}>
            {status === 'loading' ? '...' : 'Kirim'}
          </button>
        </div>
      )}
      {status === 'error' && <p style={{fontSize:'12px',color:'#cc0000',marginTop:'8px'}}>Gagal, coba lagi.</p>}
    </div>
  )
}
