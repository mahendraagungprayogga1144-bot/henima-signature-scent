'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { formatRupiah } from '@/lib/format'

type Product = { id:string; name:string; description:string; photo:string; discountPrice:number; originalPrice:number; active:boolean }

export default function WishlistPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [wishlist, setWishlist] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    const w = JSON.parse(localStorage.getItem('henima-wishlist') || '[]')
    setWishlist(w)
    fetch('/api/products-public').then(r=>r.json()).then((data:any)=>{
      if(Array.isArray(data)) setProducts(data)
      setLoading(false)
    })
  },[])

  const remove = (id:string) => {
    const next = wishlist.filter(x=>x!==id)
    localStorage.setItem('henima-wishlist', JSON.stringify(next))
    setWishlist(next)
  }

  const saved = products.filter(p=>wishlist.includes(p.id))

  return(<><style>{`
    .wl{--bg:#FAF8F4;--bg2:#F0EDE6;--black:#1C1917;--ink:#2E2A25;--muted:#7A736A;--border:rgba(28,25,23,0.1);--serif:var(--font-cormorant),Georgia,serif;--sans:var(--font-jost),system-ui,sans-serif;background:var(--bg);min-height:100vh;font-family:var(--sans);font-weight:300;color:var(--ink)}
    .wl-hero{background:var(--black);padding:120px 6vw 80px;text-align:center;position:relative;overflow:hidden}
    .wl-hero-bg{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-family:var(--serif);font-size:clamp(80px,18vw,200px);font-weight:400;font-style:italic;color:rgba(200,184,154,.04);white-space:nowrap;pointer-events:none}
    .wl-hero h1{font-family:var(--serif);font-size:clamp(2rem,4vw,3.5rem);font-weight:400;line-height:1.15;color:#F0EBE3;margin-bottom:16px;position:relative}
    .wl-hero h1 em{font-style:italic;color:#C8B89A}
    .wl-hero p{font-size:14px;color:rgba(240,235,227,.4);position:relative}
    .wl-label{font-size:10px;letter-spacing:.26em;text-transform:uppercase;color:rgba(200,184,154,.6);margin-bottom:20px;display:block;position:relative}
    .wl-body{max-width:1080px;margin:0 auto;padding:80px 6vw}
    .wl-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:24px}
    .wl-card{background:var(--bg);border:1px solid var(--border);position:relative;transition:transform .2s,box-shadow .2s}
    .wl-card:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(28,25,23,0.08)}
    .wl-img{position:relative;aspect-ratio:4/3;background:var(--bg2);overflow:hidden}
    .wl-remove{position:absolute;top:12px;right:12px;width:32px;height:32px;border-radius:50%;background:rgba(250,248,244,.92);border:1px solid rgba(28,25,23,.1);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:16px;transition:background .2s;z-index:10}
    .wl-remove:hover{background:#1C1917;color:#FAF8F4}
    .wl-info{padding:20px}
    .wl-name{font-family:var(--serif);font-size:19px;font-weight:400;color:var(--black);margin-bottom:6px}
    .wl-desc{font-size:13px;color:var(--muted);line-height:1.7;margin-bottom:16px}
    .wl-price{font-size:15px;color:var(--black);margin-bottom:16px}
    .wl-price s{font-size:12px;color:var(--muted);margin-right:8px}
    .wl-btn{display:block;text-align:center;padding:12px;background:var(--black);color:#FAF8F4;font-size:10px;letter-spacing:.2em;text-transform:uppercase;text-decoration:none;font-family:var(--sans);transition:opacity .2s}
    .wl-btn:hover{opacity:.8}
    .wl-empty{text-align:center;padding:80px 20px}
    .wl-empty h2{font-family:var(--serif);font-size:28px;font-weight:400;color:var(--black);margin-bottom:12px}
    .wl-empty p{font-size:14px;color:var(--muted);margin-bottom:32px}
    .wl-shop-btn{display:inline-block;padding:14px 40px;background:var(--black);color:#FAF8F4;font-size:10px;letter-spacing:.2em;text-transform:uppercase;text-decoration:none;font-family:var(--sans)}
    .wl-count{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin-bottom:32px}
    @media(max-width:600px){.wl-body{padding:60px 5vw}}
  `}</style>
  <div className="wl">
    <div className="wl-hero">
      <div className="wl-hero-bg">Wishlist</div>
      <span className="wl-label">My Wishlist</span>
      <h1>Produk yang kamu<br/><em>simpan untuk nanti.</em></h1>
      <p>{saved.length > 0 ? `${saved.length} produk tersimpan` : 'Belum ada produk yang disimpan'}</p>
    </div>
    <div className="wl-body">
      {loading ? (
        <p style={{textAlign:'center',color:'var(--muted)',fontSize:14}}>Memuat...</p>
      ) : saved.length === 0 ? (
        <div className="wl-empty">
          <h2>Wishlist kamu masih kosong.</h2>
          <p>Temukan parfum yang cocok untukmu dan simpan untuk dibeli nanti.</p>
          <Link href="/shop" className="wl-shop-btn">Jelajahi Koleksi</Link>
        </div>
      ) : (
        <>
          <p className="wl-count">{saved.length} produk tersimpan</p>
          <div className="wl-grid">
            {saved.map(p=>(
              <div key={p.id} className="wl-card">
                <div className="wl-img">
                  <Image src={p.photo} alt={p.name} fill style={{objectFit:'cover'}}/>
                  <button className="wl-remove" onClick={()=>remove(p.id)} title="Hapus dari wishlist">×</button>
                </div>
                <div className="wl-info">
                  <p className="wl-name">{p.name}</p>
                  <p className="wl-desc">{p.description}</p>
                  <p className="wl-price"><s>{formatRupiah(p.originalPrice)}</s>{formatRupiah(p.discountPrice)}</p>
                  <Link href={`/shop/${p.id}`} className="wl-btn">Lihat Produk</Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  </div></>)
}
