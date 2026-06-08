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
    <div style={{background:"#FAF8F4", color:"#1C1917", marginTop:"-40px"}}>

      {/* ── HERO FULL WIDTH ── */}
      <section style={{display:"grid", gridTemplateColumns:"1fr 1fr", minHeight:"92vh", width:"100vw", marginLeft:"calc(-50vw + 50%)"}}>
        {/* Left */}
        <div style={{background:"#F0EBE3", display:"flex", flexDirection:"column", justifyContent:"center", padding:"80px 72px 80px 10vw"}}>
          <p style={{fontSize:"10px", letterSpacing:"3.5px", textTransform:"uppercase", color:"#9A8F82", marginBottom:"32px", fontWeight:400}}>
            {company.name}
          </p>
          <h1 style={{fontFamily:"var(--font-cormorant)", fontSize:"clamp(60px,7.5vw,100px)", fontWeight:300, lineHeight:0.9, color:"#1C1917", marginBottom:"32px", letterSpacing:"-1px", fontStyle:"italic"}}>
            Worn.<br />Not<br /><em style={{color:"#7A6553"}}>Forgotten.</em>
          </h1>
          <div style={{width:"40px", height:"1px", background:"rgba(200,184,154,0.5)", marginBottom:"32px"}} />
          <p style={{fontSize:"14px", color:"#9A8F82", lineHeight:2, maxWidth:"300px", marginBottom:"52px", fontWeight:300, letterSpacing:"0.3px"}}>
            {company.tagline || "Setiap tetes adalah cerita. Setiap aroma adalah kenangan yang layak diingat."}
          </p>
          <div style={{display:"flex", gap:"12px", alignItems:"center"}}>
            <Link href="/shop" style={{display:"inline-block", background:"#1C1917", color:"#F0EBE3", padding:"15px 44px", fontSize:"10px", letterSpacing:"3px", textTransform:"uppercase", textDecoration:"none", fontFamily:"var(--font-jost)", fontWeight:400, border:"1px solid #1C1917"}}>
              Explore Collection
            </Link>
            <Link href="/shop" style={{display:"inline-block", background:"transparent", color:"#1C1917", padding:"14px 28px", fontSize:"10px", letterSpacing:"2px", textTransform:"uppercase", textDecoration:"none", fontFamily:"var(--font-jost)", fontWeight:400, border:"1px solid rgba(28,25,23,0.25)"}}>
              Shop Now
            </Link>
          </div>
          <div style={{display:"flex", gap:"40px", marginTop:"72px", fontSize:"9px", color:"rgba(200,184,154,0.7)", letterSpacing:"3px", textTransform:"uppercase"}}>
            <span>Est. {(company as any).foundingYear || "2024"}</span>
            <span>·</span>
            <span>Indonesia</span>
            <span>·</span>
            <span>Extrait de Parfum</span>
          </div>
        </div>
        {/* Right - Product Image */}
        <div style={{position:"relative", background:"#2A2420", overflow:"hidden"}}>
          {products.length > 0 && products[0].photo ? (
            <>
              <Image src={products[0].photo} alt={products[0].name} fill className="object-cover object-center" priority style={{opacity:0.9}} />
              <div style={{position:"absolute", inset:0, background:"linear-gradient(to top, rgba(20,16,12,0.75) 0%, rgba(20,16,12,0.1) 50%, transparent 100%)"}} />
              <div style={{position:"absolute", bottom:"48px", left:"48px"}}>
                <p style={{fontFamily:"var(--font-cormorant)", fontSize:"11px", fontStyle:"normal", letterSpacing:"4px", textTransform:"uppercase", color:"rgba(200,184,154,0.6)", marginBottom:"8px"}}>New Arrival</p>
                <p style={{fontFamily:"var(--font-cormorant)", fontSize:"32px", fontWeight:300, fontStyle:"italic", color:"rgba(240,235,227,0.9)", lineHeight:1}}>{products[0].name}</p>
              </div>
            </>
          ) : (
            <div style={{position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", background:"linear-gradient(160deg,#2C2420,#1A1210)"}}>
              <span style={{fontFamily:"var(--font-cormorant)", fontSize:"120px", fontWeight:300, fontStyle:"italic", color:"rgba(200,184,154,0.06)"}}>H</span>
            </div>
          )}
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

      {/* ── STORY SPLIT ── */}
      <section style={{display:"grid", gridTemplateColumns:"1fr 1fr", width:"100vw", marginLeft:"calc(-50vw + 50%)", minHeight:"520px"}}>
        <div style={{position:"relative", background:"#E8E0D6", minHeight:"520px", overflow:"hidden"}}>
          {company.heroImage ? (
            <Image src={company.heroImage} alt="Henima Story" fill className="object-cover" />
          ) : (
            <div style={{width:"100%", height:"100%", minHeight:"520px", background:"linear-gradient(135deg,#D8CFC4 0%,#C4B8A8 100%)", display:"flex", alignItems:"center", justifyContent:"center"}}>
              <span style={{fontFamily:"var(--font-cormorant)", fontSize:"80px", fontWeight:300, fontStyle:"italic", color:"rgba(255,255,255,0.25)"}}>Scent</span>
            </div>
          )}
        </div>
        <div style={{background:"#FAF8F4", display:"flex", flexDirection:"column", justifyContent:"center", padding:"80px 10vw 80px 72px"}}>
          <p style={{fontSize:"10px", letterSpacing:"3px", textTransform:"uppercase", color:"#9A8F82", marginBottom:"20px", fontWeight:400}}>Our Story</p>
          <h2 style={{fontFamily:"var(--font-cormorant)", fontSize:"clamp(32px,4vw,52px)", fontWeight:400, lineHeight:1.1, color:"#1C1917", marginBottom:"28px"}}>
            Fragrance is more<br />than <em style={{color:"#7A6553"}}>scent.</em>
          </h2>
          <div style={{width:"40px", height:"1px", background:"rgba(200,184,154,0.5)", marginBottom:"28px"}} />
          <p style={{fontSize:"14px", color:"#9A8F82", lineHeight:1.95, maxWidth:"380px", marginBottom:"44px", fontWeight:300}}>
            {company.brandStory || "Setiap botol Henima dirancang untuk mengabadikan momen yang layak diingat — kehangatan sore hari, rindu yang tak terucap."}
          </p>
          <Link href="/shop" style={{display:"inline-flex", alignItems:"center", gap:"12px", fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase", color:"#1C1917", textDecoration:"none", borderBottom:"1px solid rgba(28,25,23,0.2)", paddingBottom:"4px", width:"fit-content", fontFamily:"var(--font-jost)"}}>
            Discover More &rarr;
          </Link>
        </div>
      </section>

      {/* ── PRODUCTS ── */}
      {products.length > 0 && (
        <section style={{padding:"100px 8vw"}}>
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:"64px"}}>
            <div>
              <p style={{fontSize:"10px", letterSpacing:"3px", textTransform:"uppercase", color:"#9A8F82", marginBottom:"12px", fontWeight:400}}>Featured Collection</p>
              <h2 style={{fontFamily:"var(--font-cormorant)", fontSize:"clamp(32px,4vw,48px)", fontWeight:400, color:"#1C1917", lineHeight:1}}>Our Scents</h2>
            </div>
            <Link href="/shop" style={{fontSize:"10px", letterSpacing:"2px", textTransform:"uppercase", color:"#9A8F82", textDecoration:"none", borderBottom:"1px solid rgba(154,143,130,0.4)", paddingBottom:"3px", fontFamily:"var(--font-jost)"}}>
              View All &rarr;
            </Link>
          </div>
          <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:"24px"}}>
            {products.map((product, idx) => {
              const variants = product.variants.filter((v) => v.active);
              const minPrice = variants.length > 0 ? Math.min(...variants.map((v) => v.discountPrice)) : product.discountPrice;
              return (
                <div key={product.id} style={{background:"#F0EBE3"}}>
                  <div style={{position:"relative", aspectRatio:"3/4", background:"linear-gradient(160deg,#E4DDD4,#CFC5B8)", overflow:"hidden"}}>
                    {product.photo ? (
                      <Image src={product.photo} alt={product.name} fill className="object-cover" />
                    ) : (
                      <div style={{position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center"}}>
                        <span style={{fontFamily:"var(--font-cormorant)", fontSize:"28px", fontStyle:"italic", color:"rgba(107,90,74,0.3)"}}>{product.name}</span>
                      </div>
                    )}
                    <div style={{position:"absolute", inset:0, background:"linear-gradient(to top, rgba(28,25,23,0.35) 0%, transparent 50%)"}} />
                  </div>
                  <div style={{padding:"24px 28px 32px"}}>
                    <p style={{fontSize:"9px", letterSpacing:"2.5px", textTransform:"uppercase", color:"#C8B89A", marginBottom:"8px"}}>Extrait de Parfum</p>
                    <h3 style={{fontFamily:"var(--font-cormorant)", fontSize:"26px", fontWeight:400, color:"#1C1917", marginBottom:"8px"}}>{product.name}</h3>
                    <p style={{fontSize:"12px", color:"#9A8F82", lineHeight:1.8, marginBottom:"20px", fontWeight:300}}>{product.description}</p>
                    <div style={{display:"flex", flexWrap:"wrap", gap:"6px", marginBottom:"24px"}}>
                      {variants.map((v) => (
                        <span key={v.id} style={{border:"1px solid rgba(138,127,114,0.3)", padding:"4px 12px", fontSize:"10px", color:"#9A8F82", letterSpacing:"0.5px"}}>{v.sizeMl}ml</span>
                      ))}
                    </div>
                    <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", borderTop:"1px solid rgba(200,184,154,0.25)", paddingTop:"20px"}}>
                      <div>
                        {(product as any).comingSoon ? (
                          <span style={{fontSize:"10px", letterSpacing:"2px", textTransform:"uppercase", color:"#9A8F82"}}>Coming Soon</span>
                        ) : (
                          <p style={{fontFamily:"var(--font-cormorant)", fontSize:"22px", fontWeight:400, color:"#1C1917"}}>Rp {minPrice.toLocaleString("id-ID")}</p>
                        )}
                      </div>
                      <Link href="/shop" style={{fontSize:"9px", letterSpacing:"2px", textTransform:"uppercase", color:"#1C1917", background:"transparent", border:"1px solid rgba(28,25,23,0.3)", padding:"9px 18px", textDecoration:"none", fontFamily:"var(--font-jost)"}}>
                        Shop Now
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
      <div style={{width:"100vw", marginLeft:"calc(-50vw + 50%)", background:"#1C1917", padding:"72px 8vw", display:"flex", justifyContent:"space-between", alignItems:"center", gap:"40px", flexWrap:"wrap"}}>
        <div>
          <p style={{fontSize:"10px", letterSpacing:"3px", textTransform:"uppercase", color:"rgba(200,184,154,0.5)", marginBottom:"12px"}}>Partner Program</p>
          <h3 style={{fontFamily:"var(--font-cormorant)", fontSize:"32px", fontWeight:300, fontStyle:"italic", color:"#F0EBE3", marginBottom:"8px"}}>Become a Henima Partner</h3>
          <p style={{fontSize:"13px", color:"rgba(200,184,154,0.6)", fontWeight:300}}>Bergabung sebagai mitra reseller eksklusif. Margin terbaik, support penuh.</p>
        </div>
        <Link href="/daftar" style={{display:"inline-block", background:"transparent", color:"#F0EBE3", padding:"14px 40px", fontSize:"10px", letterSpacing:"3px", textTransform:"uppercase", textDecoration:"none", border:"1px solid rgba(200,184,154,0.35)", fontFamily:"var(--font-jost)", whiteSpace:"nowrap"}}>
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
