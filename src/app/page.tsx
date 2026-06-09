import Link from "next/link";
import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";
import HeroCarousel from "@/components/HeroCarousel";
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
    <div style={{background:"#FAF8F4", color:"#1C1917"}}>

      {/* ── HERO FULL SCREEN ── */}
      <section style={{position:"relative", width:"100%", minHeight:"95vh", overflow:"hidden", display:"flex", alignItems:"center"}}>
        <div style={{position:"absolute", inset:0, zIndex:0}}>
          <HeroCarousel
            images={(company as any).heroImages?.length ? (company as any).heroImages : products.length > 0 && products[0].photo ? [products[0].photo] : []}
            productName={products.length > 0 ? products[0].name : undefined}
          />
        </div>
        <div style={{position:"absolute", inset:0, background:"linear-gradient(to right, rgba(10,8,6,0.78) 0%, rgba(10,8,6,0.35) 60%, rgba(10,8,6,0.1) 100%)", zIndex:1}} />
        <div style={{position:"relative", zIndex:2, padding:"80px 8vw", maxWidth:"680px"}}>
          <p style={{fontSize:"10px", letterSpacing:"3.5px", textTransform:"uppercase", color:"rgba(200,184,154,0.7)", marginBottom:"28px", fontWeight:300, fontFamily:"var(--font-jost)"}}>
            {company.name}
          </p>
          <h1 style={{fontFamily:"var(--font-cormorant)", fontSize:"clamp(56px,9vw,110px)", fontWeight:300, lineHeight:0.9, color:"#F5F0E8", marginBottom:"28px", letterSpacing:"-1px", fontStyle:"italic"}}>
            Worn.<br />Not<br /><em style={{color:"rgba(200,184,154,0.9)"}}>Forgotten.</em>
          </h1>
          <div style={{width:"48px", height:"1px", background:"rgba(200,184,154,0.4)", marginBottom:"28px"}} />
          <p style={{fontSize:"15px", color:"rgba(240,235,227,0.7)", lineHeight:1.9, maxWidth:"360px", marginBottom:"52px", fontWeight:300, fontFamily:"var(--font-jost)"}}>
            {company.tagline || "Setiap tetes adalah cerita. Setiap aroma adalah kenangan yang layak diingat."}
          </p>
          <div style={{display:"flex", gap:"12px", flexWrap:"wrap"}}>
            <Link href="/shop" style={{display:"inline-block", background:"rgba(240,235,227,0.95)", color:"#1C1917", padding:"15px 44px", fontSize:"10px", letterSpacing:"3px", textTransform:"uppercase", textDecoration:"none", fontFamily:"var(--font-jost)", fontWeight:500}}>
              Explore Collection
            </Link>
            <Link href="/shop" style={{display:"inline-block", background:"transparent", color:"rgba(240,235,227,0.9)", padding:"14px 32px", fontSize:"10px", letterSpacing:"2px", textTransform:"uppercase", textDecoration:"none", fontFamily:"var(--font-jost)", border:"1px solid rgba(240,235,227,0.35)"}}>
              Shop Now
            </Link>
          </div>
          <div style={{display:"flex", gap:"32px", marginTop:"72px", fontSize:"9px", color:"rgba(200,184,154,0.4)", letterSpacing:"3px", textTransform:"uppercase", flexWrap:"wrap"}}>
            <span>Est. {(company as any).foundingYear || "2024"}</span>
            <span>·</span><span>Indonesia</span>
            <span>·</span><span>Extrait de Parfum</span>
          </div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div style={{background:"#1C1917", padding:"16px 0", overflow:"hidden", whiteSpace:"nowrap"}}>
        <div style={{display:"inline-flex", animation:"marquee 25s linear infinite"}}>
          {["Free Shipping above Rp 150.000","Afternoon","The Distance","Extrait de Parfum","Made in Indonesia","Crafted to be Remembered","Afternoon","The Distance","Extrait de Parfum","Made in Indonesia","Crafted to be Remembered"].map((item, i) => (
            <span key={i} style={{fontFamily:"var(--font-cormorant)", fontSize:"13px", fontStyle:"italic", color:"rgba(200,184,154,0.5)", letterSpacing:"2px", padding:"0 40px"}}>{item}</span>
          ))}
        </div>
      </div>

      {/* ── OUR STORY ── */}
      <section style={{padding:"100px 8vw", maxWidth:"900px", margin:"0 auto"}}>
        <p style={{fontSize:"10px", letterSpacing:"3px", textTransform:"uppercase", color:"#9A8F82", marginBottom:"20px", fontFamily:"var(--font-jost)"}}>Our Story</p>
        <h2 style={{fontFamily:"var(--font-cormorant)", fontSize:"clamp(32px,5vw,60px)", fontWeight:400, lineHeight:1.05, color:"#1C1917", marginBottom:"32px"}}>
          Fragrance is more<br />than <em style={{color:"#7A6553"}}>scent.</em>
        </h2>
        <div style={{width:"48px", height:"1px", background:"rgba(200,184,154,0.5)", marginBottom:"32px"}} />
        <p style={{fontSize:"16px", color:"#6B6560", lineHeight:2, maxWidth:"680px", marginBottom:"24px", fontWeight:300, fontFamily:"var(--font-jost)"}}>
          {company.brandStory || "Setiap botol Henima dirancang untuk mengabadikan momen yang layak diingat — kehangatan sore hari, rindu yang tak terucap."}
        </p>
        <Link href="/shop" style={{display:"inline-flex", alignItems:"center", gap:"12px", fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase", color:"#1C1917", textDecoration:"none", borderBottom:"1px solid rgba(28,25,23,0.2)", paddingBottom:"4px", width:"fit-content", fontFamily:"var(--font-jost)", marginTop:"16px"}}>
          Discover More →
        </Link>
      </section>

      {/* ── VISI MISI ── */}
      {(company.vision || company.mission) && (
        <section style={{background:"#F0EBE3", padding:"80px 8vw"}}>
          <p style={{fontSize:"10px", letterSpacing:"3px", textTransform:"uppercase", color:"#9A8F82", marginBottom:"48px", fontFamily:"var(--font-jost)", textAlign:"center"}}>Values</p>
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"2px", maxWidth:"900px", margin:"0 auto"}} className="visi-grid">
            {company.vision && (
              <div style={{background:"#FAF8F4", padding:"48px 40px", borderLeft:"3px solid #C8B89A"}}>
                <p style={{fontSize:"10px", letterSpacing:"3px", textTransform:"uppercase", color:"#C8B89A", marginBottom:"20px", fontFamily:"var(--font-jost)"}}>Visi</p>
                <p style={{fontFamily:"var(--font-cormorant)", fontSize:"22px", fontWeight:400, color:"#1C1917", lineHeight:1.5}}>{company.vision}</p>
              </div>
            )}
            {company.mission && (
              <div style={{background:"#FAF8F4", padding:"48px 40px", borderLeft:"3px solid #C8B89A"}}>
                <p style={{fontSize:"10px", letterSpacing:"3px", textTransform:"uppercase", color:"#C8B89A", marginBottom:"20px", fontFamily:"var(--font-jost)"}}>Misi</p>
                <p style={{fontFamily:"var(--font-cormorant)", fontSize:"22px", fontWeight:400, color:"#1C1917", lineHeight:1.5}}>{company.mission}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── PRODUCTS ── */}
      {products.length > 0 && (
        <section style={{padding:"100px 8vw"}}>
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:"56px", flexWrap:"wrap", gap:"16px"}}>
            <div>
              <p style={{fontSize:"10px", letterSpacing:"3px", textTransform:"uppercase", color:"#9A8F82", marginBottom:"12px", fontFamily:"var(--font-jost)"}}>Featured Collection</p>
              <h2 style={{fontFamily:"var(--font-cormorant)", fontSize:"clamp(28px,4vw,44px)", fontWeight:400, color:"#1C1917"}}>Our Scents</h2>
            </div>
            <Link href="/shop" style={{fontSize:"10px", letterSpacing:"2px", textTransform:"uppercase", color:"#9A8F82", textDecoration:"none", borderBottom:"1px solid rgba(154,143,130,0.4)", paddingBottom:"3px", fontFamily:"var(--font-jost)"}}>
              View All →
            </Link>
          </div>
          <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:"16px"}}>
            {products.map((product) => {
              const variants = product.variants.filter((v) => v.active);
              const minPrice = variants.length > 0 ? Math.min(...variants.map((v) => v.discountPrice)) : product.discountPrice;
              return (
                <div key={product.id} style={{background:"#F0EBE3"}}>
                  <div style={{position:"relative", aspectRatio:"1/1", background:"linear-gradient(160deg,#E4DDD4,#CFC5B8)", overflow:"hidden"}}>
                    {product.photo ? (
                      <Image src={product.photo} alt={product.name} fill className="object-cover" />
                    ) : (
                      <div style={{position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center"}}>
                        <span style={{fontFamily:"var(--font-cormorant)", fontSize:"24px", fontStyle:"italic", color:"rgba(107,90,74,0.3)"}}>{product.name}</span>
                      </div>
                    )}
                    {(product as any).comingSoon && (
                      <div style={{position:"absolute", top:"14px", left:"14px", background:"#1C1917", color:"#F0EBE3", fontSize:"8px", letterSpacing:"2px", textTransform:"uppercase", padding:"4px 10px", fontFamily:"var(--font-jost)"}}>
                        Coming Soon
                      </div>
                    )}
                  </div>
                  <div style={{padding:"20px 20px 24px"}}>
                    <p style={{fontSize:"9px", letterSpacing:"2px", textTransform:"uppercase", color:"#C8B89A", marginBottom:"6px", fontFamily:"var(--font-jost)"}}>Extrait de Parfum</p>
                    <h3 style={{fontFamily:"var(--font-cormorant)", fontSize:"22px", fontWeight:400, color:"#1C1917", marginBottom:"6px"}}>{product.name}</h3>
                    <p style={{fontSize:"12px", color:"#9A8F82", lineHeight:1.7, marginBottom:"16px", fontWeight:300, fontFamily:"var(--font-jost)"}}>{product.description}</p>
                    <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", borderTop:"1px solid rgba(200,184,154,0.25)", paddingTop:"16px"}}>
                      {(product as any).comingSoon ? (
                        <span style={{fontSize:"10px", letterSpacing:"2px", textTransform:"uppercase", color:"#9A8F82", fontFamily:"var(--font-jost)"}}>Coming Soon</span>
                      ) : (
                        <p style={{fontFamily:"var(--font-cormorant)", fontSize:"20px", fontWeight:400, color:"#1C1917"}}>Rp {minPrice.toLocaleString("id-ID")}</p>
                      )}
                      <Link href="/shop" style={{fontSize:"9px", letterSpacing:"2px", textTransform:"uppercase", color:"#1C1917", border:"1px solid rgba(28,25,23,0.3)", padding:"8px 16px", textDecoration:"none", fontFamily:"var(--font-jost)"}}>
                        Shop
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── RESELLER BAND ── */}
      <div style={{background:"#1C1917", padding:"72px 8vw", display:"flex", justifyContent:"space-between", alignItems:"center", gap:"32px", flexWrap:"wrap"}}>
        <div>
          <p style={{fontSize:"10px", letterSpacing:"3px", textTransform:"uppercase", color:"rgba(200,184,154,0.5)", marginBottom:"12px", fontFamily:"var(--font-jost)"}}>Partner Program</p>
          <h3 style={{fontFamily:"var(--font-cormorant)", fontSize:"clamp(22px,3vw,32px)", fontWeight:300, fontStyle:"italic", color:"#F0EBE3", marginBottom:"8px"}}>Become a Henima Partner</h3>
          <p style={{fontSize:"13px", color:"rgba(200,184,154,0.5)", fontWeight:300, fontFamily:"var(--font-jost)"}}>Bergabung sebagai mitra reseller eksklusif. Margin terbaik, support penuh.</p>
        </div>
        <Link href="/daftar" style={{display:"inline-block", background:"transparent", color:"#F0EBE3", padding:"14px 36px", fontSize:"10px", letterSpacing:"3px", textTransform:"uppercase", textDecoration:"none", border:"1px solid rgba(200,184,154,0.35)", fontFamily:"var(--font-jost)", whiteSpace:"nowrap"}}>
          Apply as Reseller
        </Link>
      </div>

      <style>{`
        @keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @media (max-width: 768px) {
          .visi-grid { grid-template-columns: 1fr !important; }
          .story-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
