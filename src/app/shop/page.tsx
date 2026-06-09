import Image from "next/image";
import Link from "next/link";
import { getDatabase } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const db = await getDatabase();
  const company = db.settings.company;
  const products = db.products.filter((p) => p.active);
  const waNumber = company.whatsappNumber || "6285190311230";

  const allSizes = Array.from(new Set(
    products.flatMap((p) => p.variants.filter((v) => v.active).map((v) => v.sizeMl))
  )).sort((a, b) => a - b);

  return (
    <div style={{background:"#FAF8F4", minHeight:"100vh", color:"#1C1917"}}>

      {/* HEADER */}
      <div style={{padding:"56px 8vw 40px", borderBottom:"1px solid rgba(200,184,154,0.2)"}}>
        <p style={{fontSize:"10px", letterSpacing:"3px", textTransform:"uppercase", color:"#9A8F82", marginBottom:"12px", fontWeight:400}}>Henima Signature Scent</p>
        <h1 style={{fontFamily:"var(--font-cormorant)", fontSize:"clamp(36px,6vw,64px)", fontWeight:300, color:"#1C1917", lineHeight:1, fontStyle:"italic"}}>
          Our Scents
        </h1>
      </div>

      {/* BODY */}
      <div style={{padding:"40px 8vw 80px"}}>
        <div style={{display:"grid", gridTemplateColumns:"220px 1fr", gap:"48px", alignItems:"start"}} className="shop-layout">

          {/* SIDEBAR */}
          <aside style={{position:"sticky", top:"80px"}} className="shop-sidebar">
            <p style={{fontSize:"12px", color:"#9A8F82", fontWeight:300, marginBottom:"32px"}}>
              Showing {products.length} {products.length === 1 ? "product" : "products"}
            </p>

            {allSizes.length > 0 && (
              <div style={{marginBottom:"28px"}}>
                <div style={{display:"flex", justifyContent:"space-between", marginBottom:"16px"}}>
                  <p style={{fontSize:"11px", letterSpacing:"2.5px", textTransform:"uppercase", color:"#1C1917", fontWeight:500}}>Size</p>
                  <span style={{color:"#9A8F82"}}>−</span>
                </div>
                {allSizes.map((size) => (
                  <label key={size} style={{display:"flex", alignItems:"center", gap:"10px", marginBottom:"10px", cursor:"pointer"}}>
                    <span style={{width:"14px", height:"14px", border:"1px solid rgba(200,184,154,0.5)", display:"inline-block", flexShrink:0}} />
                    <span style={{fontSize:"13px", color:"#9A8F82", fontWeight:300}}>{size}ml</span>
                  </label>
                ))}
                <div style={{height:"1px", background:"rgba(200,184,154,0.2)", margin:"24px 0"}} />
              </div>
            )}

            <div style={{marginBottom:"28px"}}>
              <div style={{display:"flex", justifyContent:"space-between", marginBottom:"16px"}}>
                <p style={{fontSize:"11px", letterSpacing:"2.5px", textTransform:"uppercase", color:"#1C1917", fontWeight:500}}>Availability</p>
                <span style={{color:"#9A8F82"}}>−</span>
              </div>
              {["Available Now","Coming Soon"].map((s) => (
                <label key={s} style={{display:"flex", alignItems:"center", gap:"10px", marginBottom:"10px", cursor:"pointer"}}>
                  <span style={{width:"14px", height:"14px", border:"1px solid rgba(200,184,154,0.5)", display:"inline-block", flexShrink:0}} />
                  <span style={{fontSize:"13px", color:"#9A8F82", fontWeight:300}}>{s}</span>
                </label>
              ))}
            </div>
          </aside>

          {/* PRODUCT GRID */}
          <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:"16px"}}>
            {products.map((product) => {
              const variants = product.variants.filter((v) => v.active);
              const minPrice = variants.length > 0 ? Math.min(...variants.map((v) => v.originalPrice)) : product.originalPrice;
              const waText = encodeURIComponent("Halo Henima, saya ingin membeli " + product.name + ". Boleh info ketersediaan dan cara ordernya?");
              return (
                <div key={product.id} style={{background:"#F0EBE3"}}>
                  <div style={{position:"relative", aspectRatio:"1/1", background:"linear-gradient(160deg,#E4DDD4,#CFC5B8)", overflow:"hidden"}}>
                    {product.photo ? (
                      <Image src={product.photo} alt={product.name} fill className="object-cover" />
                    ) : (
                      <div style={{position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center"}}>
                        <span style={{fontFamily:"var(--font-cormorant)", fontSize:"22px", fontStyle:"italic", color:"rgba(107,90,74,0.3)"}}>{product.name}</span>
                      </div>
                    )}
                    {(product as any).comingSoon && (
                      <div style={{position:"absolute", top:"14px", left:"14px", background:"#1C1917", color:"#F0EBE3", fontSize:"8px", letterSpacing:"2px", textTransform:"uppercase", padding:"4px 10px", fontFamily:"var(--font-jost)"}}>
                        Coming Soon
                      </div>
                    )}
                  </div>
                  <div style={{padding:"18px 18px 22px"}}>
                    <p style={{fontSize:"9px", letterSpacing:"2px", textTransform:"uppercase", color:"#C8B89A", marginBottom:"5px"}}>Extrait de Parfum</p>
                    <h2 style={{fontFamily:"var(--font-cormorant)", fontSize:"22px", fontWeight:400, color:"#1C1917", marginBottom:"4px"}}>{product.name}</h2>
                    {product.description && <p style={{fontSize:"12px", color:"#9A8F82", lineHeight:1.7, marginBottom:"10px", fontWeight:300}}>{product.description}</p>}
                    {((product as any).topNotes || (product as any).middleNotes || (product as any).baseNotes) && (
                      <div style={{marginBottom:"10px"}}>
                        {(product as any).topNotes && <p style={{fontSize:"10px", color:"#9A8F82", marginBottom:"2px"}}><span style={{color:"#1C1917"}}>Top</span> · {(product as any).topNotes}</p>}
                        {(product as any).middleNotes && <p style={{fontSize:"10px", color:"#9A8F82", marginBottom:"2px"}}><span style={{color:"#1C1917"}}>Heart</span> · {(product as any).middleNotes}</p>}
                        {(product as any).baseNotes && <p style={{fontSize:"10px", color:"#9A8F82"}}><span style={{color:"#1C1917"}}>Base</span> · {(product as any).baseNotes}</p>}
                      </div>
                    )}
                    <div style={{display:"flex", flexWrap:"wrap", gap:"4px", marginBottom:"14px"}}>
                      {variants.map((v) => <span key={v.id} style={{border:"1px solid rgba(138,127,114,0.3)", padding:"3px 10px", fontSize:"10px", color:"#9A8F82"}}>{v.sizeMl}ml</span>)}
                    </div>
                    <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", borderTop:"1px solid rgba(200,184,154,0.25)", paddingTop:"14px"}}>
                      {(product as any).comingSoon ? (
                        <span style={{fontSize:"10px", color:"#9A8F82"}}>Coming Soon</span>
                      ) : (
                        <p style={{fontFamily:"var(--font-cormorant)", fontSize:"20px", fontWeight:400, color:"#1C1917"}}>Rp {minPrice.toLocaleString("id-ID")}</p>
                      )}
                      <a href={"https://wa.me/" + waNumber + "?text=" + waText} target="_blank" rel="noreferrer"
                        style={{fontSize:"9px", letterSpacing:"2px", textTransform:"uppercase", color:"#1C1917", border:"1px solid rgba(28,25,23,0.3)", padding:"8px 14px", textDecoration:"none", fontFamily:"var(--font-jost)"}}>
                        Beli
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* RESELLER BAND */}
      <div style={{background:"#1C1917", padding:"56px 8vw", display:"flex", justifyContent:"space-between", alignItems:"center", gap:"32px", flexWrap:"wrap"}}>
        <div>
          <p style={{fontSize:"10px", letterSpacing:"3px", textTransform:"uppercase", color:"rgba(200,184,154,0.5)", marginBottom:"10px"}}>Partner Program</p>
          <h3 style={{fontFamily:"var(--font-cormorant)", fontSize:"clamp(22px,3vw,28px)", fontWeight:300, fontStyle:"italic", color:"#F0EBE3", marginBottom:"6px"}}>Become a Henima Partner</h3>
          <p style={{fontSize:"13px", color:"rgba(200,184,154,0.5)", fontWeight:300}}>Bergabung sebagai mitra reseller eksklusif.</p>
        </div>
        <Link href="/daftar" style={{display:"inline-block", background:"transparent", color:"#F0EBE3", padding:"13px 32px", fontSize:"10px", letterSpacing:"3px", textTransform:"uppercase", textDecoration:"none", border:"1px solid rgba(200,184,154,0.35)", fontFamily:"var(--font-jost)", whiteSpace:"nowrap"}}>
          Apply as Reseller
        </Link>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .shop-layout { grid-template-columns: 1fr !important; }
          .shop-sidebar { position: static !important; }
        }
      `}</style>
    </div>
  );
}
