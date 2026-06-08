import Image from "next/image";
import Link from "next/link";
import { getDatabase } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const db = await getDatabase();
  const company = db.settings.company;
  const products = db.products.filter((p) => p.active);
  const waNumber = company.whatsappNumber || "6285190311230";

  return (
    <div style={{background:'#FAF8F4', minHeight:'100vh', color:'#1C1917', margin:'-40px', padding:'0'}}>

      <div style={{textAlign:'center', padding:'80px 40px 60px', borderBottom:'1px solid rgba(200,184,154,0.2)'}}>
        <p style={{fontSize:'10px', letterSpacing:'3px', textTransform:'uppercase', color:'#8A7F72', marginBottom:'16px', fontWeight:400}}>Collection</p>
        <h1 style={{fontFamily:'var(--font-cormorant)', fontSize:'clamp(40px,6vw,72px)', fontWeight:300, color:'#1C1917', lineHeight:1, fontStyle:'italic', marginBottom:'20px'}}>
          Our Scents
        </h1>
        <p style={{fontSize:'14px', color:'#8A7F72', maxWidth:'480px', margin:'0 auto', lineHeight:1.9, fontWeight:300}}>
          Temukan parfum signature pilihan kamu. Setiap botol dirancang untuk meninggalkan kesan.
        </p>
      </div>

      <div style={{padding:'64px 80px', display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:'2px'}}>
        {products.map((product) => {
          const variants = product.variants.filter((v) => v.active);
          const minPrice = variants.length > 0
            ? Math.min(...variants.map((v) => v.originalPrice))
            : product.originalPrice;
          const waText = encodeURIComponent(
            "Halo Henima, saya ingin membeli " + product.name + ". Boleh info ketersediaan dan cara ordernya?"
          );
          return (
            <div key={product.id} style={{background:'#F5F0E8', overflow:'hidden', cursor:'pointer'}}>
              <div style={{position:'relative', aspectRatio:'3/4', background:'linear-gradient(160deg,#E8E0D4,#D0C4B4)', overflow:'hidden'}}>
                {product.photo ? (
                  <Image src={product.photo} alt={product.name} fill className="object-cover" style={{transition:'transform 0.6s ease'}} />
                ) : (
                  <div style={{position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center'}}>
                    <span style={{fontFamily:'var(--font-cormorant)', fontSize:'32px', fontWeight:300, fontStyle:'italic', color:'rgba(107,90,74,0.4)'}}>{product.name}</span>
                  </div>
                )}
                <div style={{position:'absolute', inset:0, background:'linear-gradient(to top, rgba(28,25,23,0.4) 0%, transparent 50%)', pointerEvents:'none'}} />
              </div>

              <div style={{padding:'24px 28px 32px', background:'#F5F0E8'}}>
                <p style={{fontSize:'9px', letterSpacing:'2.5px', textTransform:'uppercase', color:'#C8B89A', marginBottom:'8px'}}>Extrait de Parfum</p>
                <h2 style={{fontFamily:'var(--font-cormorant)', fontSize:'28px', fontWeight:400, color:'#1C1917', marginBottom:'8px'}}>{product.name}</h2>
                {product.description && (
                  <p style={{fontSize:'13px', color:'#8A7F72', lineHeight:1.8, marginBottom:'16px', fontWeight:300}}>{product.description}</p>
                )}
                {((product as any).topNotes || (product as any).middleNotes || (product as any).baseNotes) && (
                  <div style={{borderTop:'1px solid rgba(200,184,154,0.3)', paddingTop:'16px', marginBottom:'16px', display:'flex', flexDirection:'column', gap:'4px'}}>
                    {(product as any).topNotes && (
                      <p style={{fontSize:'11px', color:'#8A7F72'}}><span style={{color:'#1C1917', fontWeight:400}}>Top</span> · {(product as any).topNotes}</p>
                    )}
                    {(product as any).middleNotes && (
                      <p style={{fontSize:'11px', color:'#8A7F72'}}><span style={{color:'#1C1917', fontWeight:400}}>Heart</span> · {(product as any).middleNotes}</p>
                    )}
                    {(product as any).baseNotes && (
                      <p style={{fontSize:'11px', color:'#8A7F72'}}><span style={{color:'#1C1917', fontWeight:400}}>Base</span> · {(product as any).baseNotes}</p>
                    )}
                  </div>
                )}
                <div style={{display:'flex', flexWrap:'wrap', gap:'6px', marginBottom:'24px'}}>
                  {variants.map((v) => (
                    <span key={v.id} style={{border:'1px solid rgba(138,127,114,0.35)', padding:'4px 12px', fontSize:'11px', color:'#8A7F72', letterSpacing:'0.5px'}}>
                      {v.sizeMl}ml
                    </span>
                  ))}
                </div>
                <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', borderTop:'1px solid rgba(200,184,154,0.3)', paddingTop:'20px'}}>
                  <div>
                    <p style={{fontSize:'10px', letterSpacing:'1.5px', textTransform:'uppercase', color:'#C8B89A', marginBottom:'4px'}}>Mulai dari</p>
                    {(product as any).comingSoon ? (
                      <span style={{fontSize:'12px', letterSpacing:'2px', textTransform:'uppercase', color:'#8A7F72', border:'1px solid rgba(138,127,114,0.3)', padding:'4px 12px'}}>Coming Soon</span>
                    ) : (
                      <p style={{fontFamily:'var(--font-cormorant)', fontSize:'22px', fontWeight:400, color:'#1C1917'}}>Rp {minPrice.toLocaleString("id-ID")}</p>
                    )}
                  </div>
                  <a href={"https://wa.me/" + waNumber + "?text=" + waText} target="_blank" rel="noreferrer" style={{display:'inline-block', background:'#1C1917', color:'#F5F0E8', padding:'12px 24px', fontSize:'10px', letterSpacing:'2px', textTransform:'uppercase', textDecoration:'none', fontFamily:'var(--font-jost)', border:'1px solid #1C1917'}}>
                    Beli Sekarang
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{margin:'0 80px 80px', borderTop:'1px solid rgba(200,184,154,0.3)', padding:'48px 0', display:'flex', justifyContent:'space-between', alignItems:'center', gap:'40px', flexWrap:'wrap'}}>
        <div>
          <h3 style={{fontFamily:'var(--font-cormorant)', fontSize:'26px', fontWeight:400, color:'#1C1917', marginBottom:'6px'}}>Become a Henima Partner</h3>
          <p style={{fontSize:'13px', color:'#8A7F72', fontWeight:300}}>Bergabung sebagai mitra reseller eksklusif. Margin terbaik, support penuh.</p>
        </div>
        <Link href="/daftar" style={{display:'inline-block', background:'transparent', color:'#1C1917', padding:'13px 36px', fontSize:'10px', letterSpacing:'3px', textTransform:'uppercase', textDecoration:'none', border:'1px solid #1C1917', fontFamily:'var(--font-jost)', whiteSpace:'nowrap'}}>
          Apply as Reseller
        </Link>
      </div>

    </div>
  );
}
