import Link from "next/link";
import Image from "next/image";
import { getDatabase } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function KatalogDigitalPage() {
  const db = await getDatabase();
  const company = db.settings.company;
  const products = db.products.filter((p) => p.active);
  const waNumber = company.whatsappNumber || "6285190311230";

  return (
    <div style={{background:"#ffffff", minHeight:"100vh", color:"#1C1917", fontFamily:"var(--font-jost)"}}>

      {/* COVER */}
      <div style={{minHeight:"60vh", display:"flex", flexDirection:"column", justifyContent:"center", padding:"80px 8vw", borderBottom:"1px solid rgba(28,25,23,0.1)"}}>
        <p style={{fontSize:"11px", letterSpacing:"4px", textTransform:"uppercase", color:"#9A8F82", marginBottom:"24px"}}>{company.name}</p>
        <h1 style={{fontFamily:"var(--font-jost)", fontSize:"clamp(48px,8vw,96px)", fontWeight:700, color:"#1C1917", lineHeight:1, marginBottom:"32px", letterSpacing:"-2px"}}>
          Catalog of<br />Henima
        </h1>
        <p style={{fontSize:"15px", color:"#6B6560", maxWidth:"480px", lineHeight:1.8, marginBottom:"48px", fontWeight:300}}>
          Made for those who believe fragrance is more than scent — it is memory, emotion, and identity.
        </p>
        <div style={{display:"flex", gap:"12px", flexWrap:"wrap"}}>
          <a href={"https://wa.me/" + waNumber} target="_blank" rel="noreferrer"
            style={{display:"inline-block", background:"#1C1917", color:"#fff", padding:"14px 32px", fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase", textDecoration:"none", fontWeight:500}}>
            Order via WhatsApp
          </a>
          <Link href="/daftar"
            style={{display:"inline-block", background:"transparent", color:"#1C1917", padding:"13px 32px", fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase", textDecoration:"none", border:"1px solid rgba(28,25,23,0.3)", fontWeight:400}}>
            Jadi Reseller
          </Link>
        </div>
      </div>

      {/* PRODUCTS */}
      {products.map((product, idx) => {
        const variants = product.variants.filter((v) => v.active);
        const minPrice = variants.length > 0 ? Math.min(...variants.map((v) => v.originalPrice)) : product.originalPrice;
        return (
          <div key={product.id} style={{borderBottom:"1px solid rgba(28,25,23,0.08)", padding:"80px 8vw"}}>
            
            {/* Product header */}
            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"48px", alignItems:"start", marginBottom:"48px"}} className="katalog-header">
              <div>
                <p style={{fontSize:"10px", letterSpacing:"3px", textTransform:"uppercase", color:"#9A8F82", marginBottom:"16px"}}>
                  {(product as any).scentFamily || "Extrait de Parfum"}
                </p>
                <h2 style={{fontFamily:"var(--font-jost)", fontSize:"clamp(32px,5vw,64px)", fontWeight:700, color:"#1C1917", lineHeight:1, marginBottom:"12px", letterSpacing:"-1px"}}>
                  {product.name}
                </h2>
                <p style={{fontSize:"13px", color:"#9A8F82", marginBottom:"4px"}}>
                  Extrait de Parfum · {variants.map(v => v.sizeMl + "ml").join(" · ")}
                </p>
                {!(product as any).comingSoon && (
                  <p style={{fontSize:"16px", fontWeight:600, color:"#1C1917", marginTop:"8px"}}>
                    Rp {minPrice.toLocaleString("id-ID")},-
                  </p>
                )}
              </div>
              {(product as any).inspiration && (
                <div style={{paddingTop:"8px"}}>
                  <p style={{fontSize:"15px", color:"#4A4440", lineHeight:1.85, fontWeight:300, fontStyle:"normal"}}>
                    {(product as any).inspiration}
                  </p>
                </div>
              )}
            </div>

            {/* Product image + notes */}
            <div style={{display:"grid", gridTemplateColumns:"1fr 2fr", gap:"64px", alignItems:"center"}} className="katalog-body">
              {/* Image */}
              <div style={{position:"relative", aspectRatio:"3/4", background:"#F5F5F5", overflow:"hidden"}}>
                {product.photo ? (
                  <Image src={product.photo} alt={product.name} fill className="object-cover object-center" />
                ) : (
                  <div style={{position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center"}}>
                    <span style={{fontFamily:"var(--font-cormorant)", fontSize:"32px", fontStyle:"italic", color:"rgba(0,0,0,0.15)"}}>{product.name}</span>
                  </div>
                )}
                {(product as any).comingSoon && (
                  <div style={{position:"absolute", top:"16px", left:"16px", background:"#1C1917", color:"#fff", fontSize:"9px", letterSpacing:"2px", textTransform:"uppercase", padding:"5px 12px"}}>
                    Coming Soon
                  </div>
                )}
              </div>

              {/* Notes + specs */}
              <div>
                {((product as any).topNotes || (product as any).middleNotes || (product as any).baseNotes) && (
                  <div style={{marginBottom:"40px", display:"flex", flexDirection:"column", gap:"16px"}}>
                    {(product as any).topNotes && (
                      <div>
                        <p style={{fontSize:"11px", fontWeight:600, color:"#1C1917", marginBottom:"4px"}}>Mind Notes</p>
                        <p style={{fontSize:"14px", color:"#6B6560", fontWeight:300}}>{(product as any).topNotes}</p>
                      </div>
                    )}
                    {(product as any).middleNotes && (
                      <div>
                        <p style={{fontSize:"11px", fontWeight:600, color:"#1C1917", marginBottom:"4px"}}>Heart Notes</p>
                        <p style={{fontSize:"14px", color:"#6B6560", fontWeight:300}}>{(product as any).middleNotes}</p>
                      </div>
                    )}
                    {(product as any).baseNotes && (
                      <div>
                        <p style={{fontSize:"11px", fontWeight:600, color:"#1C1917", marginBottom:"4px"}}>Soul Notes</p>
                        <p style={{fontSize:"14px", color:"#6B6560", fontWeight:300}}>{(product as any).baseNotes}</p>
                      </div>
                    )}
                  </div>
                )}

                {((product as any).sillage || (product as any).projection || (product as any).longevity) && (
                  <div style={{borderTop:"1px solid rgba(28,25,23,0.1)", paddingTop:"24px"}}>
                    <p style={{fontSize:"11px", fontWeight:600, color:"#1C1917", marginBottom:"16px"}}>
                      {(product as any).sillage && `Sillage ${(product as any).sillage}`}
                      {(product as any).projection && ` · Projection ${(product as any).projection}`}
                      {(product as any).longevity && ` · Longevity ${(product as any).longevity}`}
                    </p>
                  </div>
                )}

                {product.description && (
                  <p style={{fontSize:"13px", color:"#9A8F82", lineHeight:1.8, fontWeight:300, marginTop:"16px"}}>
                    {product.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* FOOTER CTA */}
      <div style={{background:"#1C1917", padding:"80px 8vw", display:"flex", justifyContent:"space-between", alignItems:"center", gap:"32px", flexWrap:"wrap"}}>
        <div>
          <h3 style={{fontFamily:"var(--font-jost)", fontSize:"clamp(24px,3vw,36px)", fontWeight:700, color:"#fff", marginBottom:"8px"}}>Tertarik dengan koleksi kami?</h3>
          <p style={{fontSize:"13px", color:"rgba(255,255,255,0.5)", fontWeight:300}}>Hubungi kami langsung via WhatsApp untuk pemesanan.</p>
        </div>
        <a href={"https://wa.me/" + waNumber} target="_blank" rel="noreferrer"
          style={{display:"inline-block", background:"transparent", color:"#fff", padding:"14px 36px", fontSize:"10px", letterSpacing:"3px", textTransform:"uppercase", textDecoration:"none", border:"1px solid rgba(255,255,255,0.3)", whiteSpace:"nowrap"}}>
          Order via WhatsApp
        </a>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .katalog-header { grid-template-columns: 1fr !important; gap: 24px !important; }
          .katalog-body { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
      `}</style>
    </div>
  );
}
