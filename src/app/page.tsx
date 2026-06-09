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

      {/* ── OUR STORY — HMNS dark style ── */}
      <section style={{background:"#FAF8F4", padding:"100px 8vw", borderTop:"1px solid rgba(28,25,23,0.06)"}}>
        <div style={{maxWidth:"800px"}}>
          <p style={{fontSize:"10px", letterSpacing:"3px", textTransform:"uppercase", color:"#9A8F82", marginBottom:"32px", fontFamily:"var(--font-jost)"}}>Our Story</p>
          <p style={{fontFamily:"var(--font-jost)", fontSize:"clamp(16px,2vw,22px)", fontWeight:300, lineHeight:1.9, color:"#4A4440", marginBottom:"48px"}}>
            {company.brandStory || "Henima lahir dari kisah cinta jarak jauh — dua anak muda yang membuktikan bahwa parfum bukan sekadar aroma, melainkan identitas diri dan pengingat momen yang tak terlupakan."}
          </p>
          <Link href="/shop" style={{display:"inline-flex", alignItems:"center", gap:"12px", fontSize:"10px", letterSpacing:"2.5px", textTransform:"uppercase", color:"#1C1917", textDecoration:"none", borderBottom:"1px solid rgba(28,25,23,0.2)", paddingBottom:"4px", fontFamily:"var(--font-jost)"}}>
            Discover More →
          </Link>
        </div>
      </section>

      {/* ── VISI MISI ── */}
      {(company.vision || company.mission) && (
        <section style={{background:"#FAF8F4", padding:"80px 8vw", borderTop:"1px solid rgba(28,25,23,0.08)"}}>
          <div style={{maxWidth:"960px", margin:"0 auto"}}>
            <p style={{fontSize:"10px", letterSpacing:"3px", textTransform:"uppercase", color:"#9A8F82", marginBottom:"56px", fontFamily:"var(--font-jost)", fontWeight:400}}>Values</p>
            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"64px"}} className="visi-grid">
              {company.vision && (
                <div>
                  <p style={{fontSize:"10px", letterSpacing:"3px", textTransform:"uppercase", color:"#C8B89A", marginBottom:"24px", fontFamily:"var(--font-jost)", fontWeight:400}}>Visi</p>
                  <div style={{width:"32px", height:"1px", background:"rgba(200,184,154,0.6)", marginBottom:"24px"}} />
                  <p style={{fontSize:"15px", color:"#4A4440", lineHeight:1.85, fontWeight:300, fontFamily:"var(--font-jost)"}}>{company.vision}</p>
                </div>
              )}
              {company.mission && (
                <div>
                  <p style={{fontSize:"10px", letterSpacing:"3px", textTransform:"uppercase", color:"#C8B89A", marginBottom:"24px", fontFamily:"var(--font-jost)", fontWeight:400}}>Misi</p>
                  <div style={{width:"32px", height:"1px", background:"rgba(200,184,154,0.6)", marginBottom:"24px"}} />
                  <p style={{fontSize:"15px", color:"#4A4440", lineHeight:1.85, fontWeight:300, fontFamily:"var(--font-jost)"}}>{company.mission}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── PRODUCTS HMNS STYLE ── */}
      {products.length > 0 && (
        <section style={{background:"#FAF8F4", borderTop:"1px solid rgba(28,25,23,0.06)"}}>
          <div style={{padding:"64px 8vw 24px"}}>
            <p style={{fontSize:"10px", letterSpacing:"3px", textTransform:"uppercase", color:"#9A8F82", fontFamily:"var(--font-jost)"}}>Collection</p>
          </div>
          {products.map((product, idx) => {
            const variants = product.variants.filter((v) => v.active);
            const minPrice = variants.length > 0 ? Math.min(...variants.map((v) => v.discountPrice)) : product.discountPrice;
            const isEven = idx % 2 === 0;
            return (
              <div key={product.id} style={{display:"grid", gridTemplateColumns:"1fr 1fr", minHeight:"80vh", borderTop:"1px solid rgba(28,25,23,0.06)"}} className="product-hmns-row">
                {/* Image */}
                <div style={{order: isEven ? 0 : 1, position:"relative", background:"#F0EBE3", overflow:"hidden", minHeight:"500px"}}>
                  {product.photo ? (
                    <Image src={product.photo} alt={product.name} fill className="object-cover object-center" />
                  ) : (
                    <div style={{position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center"}}>
                      <span style={{fontFamily:"var(--font-cormorant)", fontSize:"48px", fontStyle:"italic", color:"rgba(107,90,74,0.2)"}}>{product.name}</span>
                    </div>
                  )}
                  {(product as any).comingSoon && (
                    <div style={{position:"absolute", top:"24px", left:"24px", background:"#1C1917", color:"#FAF8F4", fontSize:"8px", letterSpacing:"2px", textTransform:"uppercase", padding:"5px 12px", fontFamily:"var(--font-jost)"}}>
                      Coming Soon
                    </div>
                  )}
                </div>
                {/* Text */}
                <div style={{order: isEven ? 1 : 0, display:"flex", flexDirection:"column", justifyContent:"center", padding:"64px 8vw", background:"#FAF8F4"}}>
                  <p style={{fontSize:"9px", letterSpacing:"3px", textTransform:"uppercase", color:"#C8B89A", marginBottom:"20px", fontFamily:"var(--font-jost)"}}>Extrait de Parfum</p>
                  <h2 style={{fontFamily:"var(--font-cormorant)", fontSize:"clamp(40px,5vw,64px)", fontWeight:300, fontStyle:"italic", color:"#1C1917", marginBottom:"24px", lineHeight:1}}>{product.name}</h2>
                  <div style={{width:"40px", height:"1px", background:"rgba(200,184,154,0.5)", marginBottom:"28px"}} />
                  <p style={{fontSize:"14px", color:"#6B6560", lineHeight:1.9, maxWidth:"360px", marginBottom:"16px", fontWeight:300, fontFamily:"var(--font-jost)"}}>{product.description}</p>
                  {((product as any).topNotes || (product as any).middleNotes || (product as any).baseNotes) && (
                    <div style={{marginBottom:"32px", display:"flex", flexDirection:"column", gap:"6px"}}>
                      {(product as any).topNotes && <p style={{fontSize:"12px", color:"#9A8F82", fontFamily:"var(--font-jost)", fontWeight:300}}><span style={{color:"#1C1917", fontWeight:400}}>Top</span> · {(product as any).topNotes}</p>}
                      {(product as any).middleNotes && <p style={{fontSize:"12px", color:"#9A8F82", fontFamily:"var(--font-jost)", fontWeight:300}}><span style={{color:"#1C1917", fontWeight:400}}>Heart</span> · {(product as any).middleNotes}</p>}
                      {(product as any).baseNotes && <p style={{fontSize:"12px", color:"#9A8F82", fontFamily:"var(--font-jost)", fontWeight:300}}><span style={{color:"#1C1917", fontWeight:400}}>Base</span> · {(product as any).baseNotes}</p>}
                    </div>
                  )}
                  <div style={{display:"flex", gap:"12px", alignItems:"center", flexWrap:"wrap", marginBottom:"32px"}}>
                    {variants.map((v) => (
                      <span key={v.id} style={{border:"1px solid rgba(28,25,23,0.15)", padding:"5px 14px", fontSize:"11px", color:"#9A8F82", fontFamily:"var(--font-jost)"}}>{v.sizeMl}ml</span>
                    ))}
                  </div>
                  <div style={{display:"flex", gap:"12px", alignItems:"center"}}>
                    {(product as any).comingSoon ? (
                      <span style={{fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase", color:"#9A8F82", fontFamily:"var(--font-jost)"}}>Coming Soon</span>
                    ) : (
                      <p style={{fontFamily:"var(--font-jost)", fontSize:"16px", fontWeight:400, color:"#1C1917"}}>Rp {minPrice.toLocaleString("id-ID")}</p>
                    )}
                    <Link href="/shop" style={{display:"inline-block", background:"#1C1917", color:"#FAF8F4", padding:"12px 28px", fontSize:"10px", letterSpacing:"2px", textTransform:"uppercase", textDecoration:"none", fontFamily:"var(--font-jost)"}}>
                      Shop Now
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
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
