'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export default function WishlistButton({ productId }: { productId: string }) {
  const [saved, setSaved] = useState(false)
  const [userId, setUserId] = useState<string|null>(null)

  useEffect(()=>{
    sb.auth.getUser().then(({data})=>{
      const uid = data.user?.id || null
      setUserId(uid)
      if(uid){
        sb.from('wishlists').select('id').eq('user_id', uid).eq('product_id', productId).single()
          .then(({data})=> setSaved(!!data))
      } else {
        const w = JSON.parse(localStorage.getItem('henima-wishlist') || '[]')
        setSaved(w.includes(productId))
      }
    })
  },[productId])

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if(userId){
      if(saved){
        await sb.from('wishlists').delete().eq('user_id', userId).eq('product_id', productId)
        setSaved(false)
      } else {
        await sb.from('wishlists').insert({user_id: userId, product_id: productId})
        setSaved(true)
      }
    } else {
      const w: string[] = JSON.parse(localStorage.getItem('henima-wishlist') || '[]')
      const next = w.includes(productId) ? w.filter(x=>x!==productId) : [...w, productId]
      localStorage.setItem('henima-wishlist', JSON.stringify(next))
      setSaved(next.includes(productId))
    }
  }

  return (
    <button onClick={toggle} title={saved?'Hapus dari wishlist':'Simpan ke wishlist'} style={{
      position:'absolute', top:'12px', right:'12px', zIndex:10,
      width:'36px', height:'36px', borderRadius:'50%',
      background:'rgba(250,248,244,0.92)', border:'1px solid rgba(28,25,23,0.1)',
      display:'flex', alignItems:'center', justifyContent:'center',
      cursor:'pointer', transition:'transform .2s',
      backdropFilter:'blur(4px)'
    }}
    onMouseEnter={e=>(e.currentTarget.style.transform='scale(1.1)')}
    onMouseLeave={e=>(e.currentTarget.style.transform='scale(1)')}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill={saved?'#1C1917':'none'} stroke="#1C1917" strokeWidth="1.5">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    </button>
  )
}
