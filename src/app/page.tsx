import Link from "next/link";
import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";
import { getCurrentUserSafe } from "@/lib/session";
import { redirect } from "next/navigation";
import { getDatabase } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await getCurrentUserSafe();
  if (user?.role === "admin") redirect("/admin");
  if (user?.role === "reseller") redirect("/katalog");

  const db = await getDatabase();
  const company = db.settings.company;
  const products = db.products.filter((p) => p.active);

  return (
    <div className="min-h-screen" style={{background: '#FAF8F4', color: '#1C1917'}}>

      {/* HERO */}
      <section style={{display:'grid', gridTemplateColumns:'1fr 1fr', minHeight:'90vh', overflow:'hidden', margin:'-40px -40px 0'}}>
        <div style={{background:'#F5F0E8', display:'flex', flexDirection:'column', justifyContent:'center', padding:'80px 64px 80px 80px', position:'relative'}}>
          <p style={{fontSize:'10px', letterSpacing:'3px', textTransform:'uppercase', color:'#8A7F72', marginBottom:'24px', fontWeight:400}}>
            {company.name}
          </p>
          <h1 style={{fontFamily:'var(--font-cormorant)', fontSize:'clamp(56px,7vw,96px)', fontWeight:300, lineHeight:0.92, color:'#1C1917', marginBottom:'28px', letterSpacing:'-1px', fontStyle:'italic'}}>
            Worn.<br />Not<br /><span style={{color:'#6B5A4A'}}>Forgotten.</span>
          </h1>
          <p style={{fontSize:'14px', color:'#8A7F72', lineHeight:1.9, maxWidth:'320px', marginBottom:'48px', fontWeight:300}}>
            {company.tagline || "Setiap tetes adalah cerita. Setiap aroma adalah kenangan yang tidak terlupakan."}
          </p>
          <Link href="/shop" style={{display:'inline-block', background:'#1C1917', color:'#F5F0E8', padding:'14px 40px', fontSize:'10px', letterSpacing:'3px', textTransform:'uppercase', textDecoration:'none', fontFamily:'var(--font-jost)', fontWeight:400, width:'fit-content', border:'1px solid #1C1917', transition:'all 0.3s'}}>
            Explore Koleksi
          </Link>
          <div style={{display:'flex', gap:'32px', marginTop:'64px', fontSize:'10px', color:'#C8B89A', letterSpacing:'3px', textTransform:'uppercase'}}>
            <span>Est. {(company as any).foundingYear || "2024"}</span>
            <span>Indonesia</span>
            <span>Signature Scent</span>
          </div>
        </div>
        <div style={{position:'relative', background:'#2C2825', overflow:'hidden', minHeight:'500px'}}>
          {products.length > 0 && products[0].photo ? (
            <>
              <Image src={products[0].photo} alt={products[0].name} fill className="object-cover object-center" priority style={{opacity:0.85}} />
              <div style={{position:'absolute', inset:0, background:'linear-gradient(to top, rgba(28,25,23,0.7) 0%, transparent 60%)'}} />
              <div style={{position:'absolute', bottom:'40px', right:'40px', textAlign:'right'}}>
                <span style={{display:'block', fontFamily:'var(--font-cormorant)', fontSize:'13px', fontStyle:'italic', color:'rgba(245,240,232,0.7)', letterSpacing:'1px'}}>{products[0].name}</span>
                <span style={{display:'block', fontSize:'11px', letterSpacing:'2px', textTransform:'uppercase', color:'rgba(200,184,154,0.5)', marginTop:'4px'}}>Extrait de Parfum</span>
              </div>
            </>
          ) : (
            <div style={{position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center'}}>
              <span style={{fontFamily:'var(--font-cormorant)', fontSize:'120px', fontWeight:300, fontStyle:'italic', color:'rgba(200,184,154,0.08)'}}>H</span>
            </div>
          )}
        </div>
      </section>

      {/* MARQUEE */}
      <div style={{background:'#1C1917', padding:'18px 0', overflow:'hidden', whiteSpace:'nowrap'}}>
        <div style={{display:'inline-flex', animation:'marquee 22s linear infinite'}}>
          {['Afternoon','Distance','Extrait de Parfum','Made in Indonesia','Crafted to be Remembered','Afternoon','Distance','Extrait de Parfum','Made in Indonesia','Crafted to be Remembered'].map((item, i) => (
            <span key={i} style={{fontFamily:'var(--font-cormorant)', fontSize:'14px', fontStyle:'italic', color:'rgba(200,184,154,0.6)', letterSpacing:'2px', padding:'0 36px'}}>{item}</span>
          ))}
        </div>
      </div>

      {/* STORY */}
      <ScrollReveal>
        <section style={{display:'grid', gridTemplateColumns:'1fr 1fr', minHeight:'500px', margin:'0 -40px'}}>
          <div style={{background:'linear-gradient(135deg,#D4C9B8,#BFB0A0)', minHeight:'500px', display:'flex', alignItems:'center', justifyContent:'center'}}>
            {company.heroImage ? (
              <div style={{position:'relative', width:'100%', height:'100%', minHeight:'500px'}}>
                <Image src={company.heroImage} alt="Henima" fill className="object-cover" />
              </div>
            ) : (
              <span style={{fontFamily:'var(--font-cormorant)', fontSize:'64px', fontWeight:300, fontStyle:'italic', color:'rgba(255,255,255,0.3)', letterSpacing:'4px'}}>Henima</span>
            )}
          </div>
          <div style={{background:'#F5F0E8', display:'flex', flexDirection:'column', justifyContent:'center', padding:'80px 80px 80px 64px'}}>
            <p style={{fontSize:'10px', letterSpacing:'3px', textTransform:'uppercase', color:'#8A7F72', marginBottom:'20px'}}>Our Story</p>
            <h2 style={{fontFamily:'var(--font-cormorant)', fontSize:'clamp(32px,4vw,48px)', fontWeight:400, lineHeight:1.15, color:'#1C1917', marginBottom:'24px'}}>
              Fragrance is more<br />than <em style={{color:'#6B5A4A'}}>scent.</em>
            </h2>
            <p style={{fontSize:'14px', color:'#8A7F72', lineHeight:1.9, maxWidth:'400px', marginBottom:'40px', fontWeight:300}}>
              {company.brandStory || "Setiap botol Henima dirancang untuk mengabadikan momen yang layak untuk diingat — kehangatan sore hari, rindu yang tak terucap."}
            </p>
            <Link href="/shop" style={{display:'inline-flex', alignItems:'center', gap:'12px', fontSize:'11px', letterSpacing:'2px', textTransform:'uppercase', color:'#1C1917', textDecoration:'none', borderBottom:'1px solid rgba(28,25,23,0.25)', paddingBottom:'2px', width:'fit-content'}}>
              Explore Collection →
            </Link>
          </div>
        </section>
      </ScrollReveal>

      {/* PRODUCTS */}
      {products.length > 0 && (
        <ScrollReveal>
          <section style={{padding:'100px 0'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'56px'}}>
              <div>
                <p style={{fontSize:'10px', letterSpacing:'3px', textTransform:'uppercase', color:'#8A7F72', marginBottom:'10px'}}>Featured Collection</p>
                <h2 style={{fontFamily:'var(--font-cormorant)', fontSize:'38px', fontWeight:400, color:'#1C1917'}}>Our Scents</h2>
              </div>
              <Link href="/shop" style={{fontSize:'11px', letterSpacing:'2px', textTransform:'uppercase', color:'#1C1917', textDecoration:'none', borderBottom:'1px solid rgba(28,25,23,0.25)', paddingBottom:'2px'}}>
                View All →
              </Link>
            </div>
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'2px'}}>
              {products.map((product, idx) => {
                const variants = product.variants.filter((v) => v.active);
                const minPrice = variants.length > 0 ? Math.min(...variants.map((v) => v.discountPrice)) : product.discountPrice;
                return (
                  <ScrollReveal key={product.id} delay={idx * 120} direction="up">
                    <div style={{background:'#F5F0E8', overflow:'hidden', cursor:'pointer'}}>
                      <div style={{position:'relative', aspectRatio:'3/4', background:'linear-gradient(160deg,#E8E0D4,#D0C4B4)', overflow:'hidden'}}>
                        {product.photo ? (
                          <Image src={product.photo} alt={product.name} fill className="object-cover" style={{transition:'transform 0.6s ease'}} />
                        ) : (
                          <div style={{position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center'}}>
                            <span style={{fontFamily:'var(--font-cormorant)', fontSize:'32px', fontWeight:300, fontStyle:'italic', color:'rgba(107,90,74,0.4)'}}>{product.name}</span>
                          </div>
                        )}
                      </div>
                      <div style={{padding:'20px 24px 28px'}}>
                        <p style={{fontSize:'9px', letterSpacing:'2.5px', textTransform:'uppercase', color:'#C8B89A', marginBottom:'6px'}}>Extrait de Parfum</p>
                        <h3 style={{fontFamily:'var(--font-cormorant)', fontSize:'24px', fontWeight:400, color:'#1C1917', marginBottom:'4px'}}>{product.name}</h3>
                        <p style={{fontSize:'12px', color:'#8A7F72', lineHeight:1.7, marginBottom:'16px', fontWeight:300}}>{product.description}</p>
                        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                          <span style={{fontSize:'14px', fontWeight:400, color:'#1C1917'}}>
                            {(product as any).comingSoon ? 'Coming Soon' : `Rp ${minPrice.toLocaleString('id-ID')}`}
                          </span>
                          <Link href="/shop" style={{fontSize:'9px', letterSpacing:'2px', textTransform:'uppercase', color:'#8A7F72', background:'none', border:'1px solid rgba(138,127,114,0.4)', padding:'8px 16px', textDecoration:'none', fontFamily:'var(--font-jost)'}}>
                            Shop Now
                          </Link>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </section>
        </ScrollReveal>
      )}

      {/* RESELLER BAND — subtle */}
      <div style={{borderTop:'1px solid rgba(200,184,154,0.3)', borderBottom:'1px solid rgba(200,184,154,0.3)', padding:'48px 0', display:'flex', justifyContent:'space-between', alignItems:'center', gap:'40px', flexWrap:'wrap'}}>
        <div>
          <h3 style={{fontFamily:'var(--font-cormorant)', fontSize:'26px', fontWeight:400, color:'#1C1917', marginBottom:'6px'}}>Become a Henima Partner</h3>
          <p style={{fontSize:'13px', color:'#8A7F72', fontWeight:300}}>Bergabung sebagai mitra reseller eksklusif. Margin terbaik, support penuh.</p>
        </div>
        <Link href="/daftar" style={{display:'inline-block', background:'transparent', color:'#1C1917', padding:'13px 36px', fontSize:'10px', letterSpacing:'3px', textTransform:'uppercase', textDecoration:'none', border:'1px solid #1C1917', fontFamily:'var(--font-jost)', whiteSpace:'nowrap'}}>
          Apply as Reseller
        </Link>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

    </div>
  );
}
