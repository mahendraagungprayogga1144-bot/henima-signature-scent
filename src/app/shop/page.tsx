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
      <div style={{padding:"64px 8vw 48px", borderBottom:"1px solid rgba(200,184,154,0.2)"}}>
        <p style={{fontSize:"10px", letterSpacing:"3px", textTransform:"uppercase", color:"#9A8F82", marginBottom:"12px", fontWeight:400}}>Henima Signature Scent</p>
        <h1 style={{fontFamily:"var(--font-cormorant)", fontSize:"clamp(36px,5vw,64px)", fontWeight:300, color:"#1C1917", lineHeight:1, fontStyle:"italic"}}>
          Our Scents
        </h1>
      </div>

      {/* BODY — sidebar + grid */}
      <div style={{display:"grid", gridTemplateColumns:"260px 1fr", gap:"0", padding:"0 8vw 80px", marginTop:"48px"}}>

        {/* SIDEBAR */}
        <aside style={{paddingRight:"48px", borderRight:"1px solid rgba(200,184,154,0.2)"}}>

          {/* Showing */}
          <p style={{fontSize:"12px", color:"#9A8F82", fontWeight:300, marginBottom:"40px", letterSpacing:"0.3px"}}>
            Showing {products.length} {products.length === 1 ? "product" : "products"}
          </p>

          {/* Size Filter */}
          {allSizes.length > 0 && (
            <div style={{marginBottom:"36px"}}>
              <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"20px"}}>
                <p style={{fontSize:"11px", letterSpacing:"2.5px", textTransform:"uppercase", color:"#1C1917", fontWeight:500}}>Size</p>
                <span style={{fontSize:"18px", color:"#9A8F82", lineHeight:1}}>−</span>
              </div>
              <div style={{display:"flex", flexDirection:"column", gap:"10px"}}>
                {allSizes.map((size) => (
                  <label key={size} style={{display:"flex", alignItems:"center", gap:"12px", cursor:"pointer"}}>
                    <span style={{width:"16px", height:"16px", border:"1px solid rgba(200,184,154,0.5)", display:"inline-block", flexShrink:0}} />
                    <span style={{fontSize:"13px", color:"#9A8F82", fontWeight:300}}>{size}ml</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div style={{height:"1px", background:"rgba(200,184,154,0.2)", marginBottom:"36px"}} />

          {/* Scent Type */}
          <div style={{marginBottom:"36px"}}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"20px"}}>
              <p style={{fontSize:"11px", letterSpacing:"2.5px", textTransform:"uppercase", color:"#1C1917", fontWeight:500}}>Type</p>
              <span style={{fontSize:"18px", color:"#9A8F82", lineHeight:1}}>−</span>
            </div>
            <div style={{display:"flex", flexDirection:"column", gap:"10px"}}>
              {["Extrait de Parfum","Eau de Parfum"].map((type) => (
                <label key={type} style={{display:"flex", alignItems:"center", gap:"12px", cursor:"pointer"}}>
                  <span style={{width:"16px", height:"16px", border:"1px solid rgba(200,184,154,0.5)", display:"inline-block", flexShrink:0}} />
                  <span style={{fontSize:"13px", color:"#9A8F82", fontWeight:300}}>{type}</span>
                </label>
              ))}
            </div>
          </div>

          <div style={{height:"1px", background:"rgba(200,184,154,0.2)", marginBottom:"36px"}} />

          {/* Availability */}
          <div>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"20px"}}>
              <p style={{fontSize:"11px", letterSpacing:"2.5px", textTransform:"uppercase", color:"#1C1917", fontWeight:500}}>Availability</p>
              <span style={{fontSize:"18px", color:"#9A8F82", lineHeight:1}}>−</span>
            </div>
            <div style={{display:"flex", flexDirection:"column", gap:"10px"}}>
              {["Available Now","Coming Soon"].map((status) => (
                <label key={status} style={{display:"flex", alignItems:"center", gap:"12px", cursor:"pointer"}}>
                  <span style={{width:"16px", height:"16px", border:"1px solid rgba(200,184,154,0.5)", display:"inline-block", flexShrink:0}} />
                  <span style={{fontSize:"13px", color:"#9A8F82", fontWeight:300}}>{status}</span>
                </label>
              ))}
            </div>
          </div>

        </aside>

        {/* PRODUCT GRID */}
        <div style={{paddingLeft:"48px"}}>
          <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:"24px"}}>
            {products.map((product) => {
              const variants = product.variants.filter((v) => v.active);
              const minPrice = variants.length > 0
                ? Math.min(...variants.map((v) => v.originalPrice))
                : product.originalPrice;
              const waText = encodeURIComponent(
                "Halo Henima, saya ingin membeli " + product.name + ". Boleh info ketersediaan dan cara ordernya?"
              );
              return (
                <div key={product.id} style={{background:"#F0EBE3", cursor:"pointer"}}>
                  {/* Image */}
                  <div style={{position:"relative", aspectRatio:"1/1", background:"linear-gradient(160deg,#E4DDD4,#CFC5B8)", overflow:"hidden"}}>
                    {product.photo ? (
                      <Image src={product.photo} alt={product.name} fill className="object-cover" />
                    ) : (
                      <div style={{position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center"}}>
                        <span style={{fontFamily:"var(--font-cormorant)", fontSize:"24px", fontStyle:"italic", color:"rgba(107,90,74,0.3)"}}>{product.name}</span>
                      </div>
                    )}
                    {(product as any).comingSoon && (
                      <div style={{position:"absolute", top:"16px", left:"16px", background:"#1C1917", color:"#F0EBE3", fontSize:"9px", letterSpacing:"2px", textTransform:"uppercase", padding:"4px 10px", fontFamily:"var(--font-jost)"}}>
                        Coming Soon
                      </div>
                    )}
                  </div>
                  {/* Info */}
                  <div style={{padding:"20px 20px 24px"}}>
                    <p style={{fontSize:"9px", letterSpacing:"2px", textTransform:"uppercase", color:"#C8B89A", marginBottom:"6px"}}>Extrait de Parfum</p>
                    <h2 style={{fontFamily:"var(--font-cormorant)", fontSize:"22px", fontWeight:400, color:"#1C1917", marginBottom:"4px"}}>{product.name}</h2>
                    {product.description && (
                      <p style={{fontSize:"12px", color:"#9A8F82", lineHeight:1.7, marginBottom:"12px", fontWeight:300}}>{product.description}</p>
                    )}
                    {/* Notes */}
                    {((product as any).topNotes || (product as any).middleNotes || (product as any).baseNotes) && (
                      <div style={{marginBottom:"12px", display:"flex", flexDirection:"column", gap:"3px"}}>
                        {(product as any).topNotes && <p style={{fontSize:"10px", color:"#9A8F82"}}><span style={{color:"#1C1917"}}>Top</span> · {(product as any).topNotes}</p>}
                        {(product as any).middleNotes && <p style={{fontSize:"10px", color:"#9A8F82"}}><span style={{color:"#1C1917"}}>Heart</span> · {(product as any).middleNotes}</p>}
                        {(product as any).baseNotes && <p style={{fontSize:"10px", color:"#9A8F82"}}><span style={{color:"#1C1917"}}>Base</span> · {(product as any).baseNotes}</p>}
                      </div>
                    )}
                    {/* Sizes */}
                    <div style={{display:"flex", flexWrap:"wrap", gap:"4px", marginBottom:"16px"}}>
                      {variants.map((v) => (
                        <span key={v.id} style={{border:"1px solid rgba(138,127,114,0.3)", padding:"3px 10px", fontSize:"10px", color:"#9A8F82"}}>{v.sizeMl}ml</span>
                      ))}
                    </div>
                    {/* Price + CTA */}
                    <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", borderTop:"1px solid rgba(200,184,154,0.25)", paddingTop:"16px"}}>
                      {(product as any).comingSoon ? (
                        <span style={{fontSize:"11px", color:"#9A8F82", letterSpacing:"1px"}}>Coming Soon</span>
                      ) : (
                        <p style={{fontFamily:"var(--font-cormorant)", fontSize:"20px", fontWeight:400, color:"#1C1917"}}>Rp {minPrice.toLocaleString("id-ID")}</p>
                      )}
                      <a href={"https://wa.me/" + waNumber + "?text=" + waText} target="_blank" rel="noreferrer"
                        style={{fontSize:"9px", letterSpacing:"2px", textTransform:"uppercase", color:"#1C1917", background:"transparent", border:"1px solid rgba(28,25,23,0.3)", padding:"8px 16px", textDecoration:"none", fontFamily:"var(--font-jost)"}}>
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
      <div style={{background:"#1C1917", padding:"64px 8vw", display:"flex", justifyContent:"space-between", alignItems:"center", gap:"40px", flexWrap:"wrap"}}>
        <div>
          <p style={{fontSize:"10px", letterSpacing:"3px", textTransform:"uppercase", color:"rgba(200,184,154,0.5)", marginBottom:"12px"}}>Partner Program</p>
          <h3 style={{fontFamily:"var(--font-cormorant)", fontSize:"28px", fontWeight:300, fontStyle:"italic", color:"#F0EBE3", marginBottom:"8px"}}>Become a Henima Partner</h3>
          <p style={{fontSize:"13px", color:"rgba(200,184,154,0.5)", fontWeight:300}}>Bergabung sebagai mitra reseller eksklusif. Margin terbaik, support penuh.</p>
        </div>
        <Link href="/daftar" style={{display:"inline-block", background:"transparent", color:"#F0EBE3", padding:"14px 40px", fontSize:"10px", letterSpacing:"3px", textTransform:"uppercase", textDecoration:"none", border:"1px solid rgba(200,184,154,0.35)", fontFamily:"var(--font-jost)", whiteSpace:"nowrap"}}>
          Apply as Reseller
        </Link>
      </div>

    </div>
  );
}
