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
    <div style={{background:"#FAF8F4", minHeight:"100vh", color:"#1C1917"}}>

      {/* HEADER */}
      <div style={{padding:"80px 8vw 64px", borderBottom:"1px solid rgba(28,25,23,0.08)"}}>
        <p style={{fontSize:"10px", letterSpacing:"3px", textTransform:"uppercase", color:"#9A8F82", marginBottom:"12px", fontFamily:"var(--font-jost)"}}>
          {company.name}
        </p>
        <h1 style={{fontFamily:"var(--font-cormorant)", fontSize:"clamp(40px,6vw,72px)", fontWeight:300, color:"#1C1917", lineHeight:1, fontStyle:"italic", marginBottom:"20px"}}>
          Catalog
        </h1>
        <p style={{fontSize:"14px", color:"#9A8F82", maxWidth:"480px", lineHeight:1.9, fontWeight:300, fontFamily:"var(--font-jost)", marginBottom:"40px"}}>
          Koleksi parfum premium Henima. Setiap botol dirancang untuk meninggalkan kesan yang tak terlupakan.
        </p>
        <div style={{display:"flex", gap:"12px", flexWrap:"wrap"}}>
          <a href={"https://wa.me/" + waNumber} target="_blank" rel="noreferrer"
            style={{display:"inline-block", background:"#1C1917", color:"#FAF8F4", padding:"12px 28px", fontSize:"10px", letterSpacing:"2px", textTransform:"uppercase", textDecoration:"none", fontFamily:"var(--font-jost)"}}>
            Order via WhatsApp
          </a>
          <Link href="/daftar"
            style={{display:"inline-block", background:"transparent", color:"#1C1917", padding:"11px 28px", fontSize:"10px", letterSpacing:"2px", textTransform:"uppercase", textDecoration:"none", fontFamily:"var(--font-jost)", border:"1px solid rgba(28,25,23,0.25)"}}>
            Jadi Reseller
          </Link>
        </div>
      </div>

      {/* PRODUCTS — HMNS style */}
      {products.map((product, idx) => {
        const variants = product.variants.filter((v) => v.active);
        const minPrice = variants.length > 0 ? Math.min(...variants.map((v) => v.originalPrice)) : product.originalPrice;
        const isEven = idx % 2 === 0;
        return (
          <div key={product.id} style={{display:"grid", gridTemplateColumns:"1fr 1fr", minHeight:"85vh", borderBottom:"1px solid rgba(28,25,23,0.06)"}} className="katalog-row">
            {/* Image */}
            <div style={{order: isEven ? 0 : 1, position:"relative", background:"#F0EBE3", overflow:"hidden", minHeight:"500px"}}>
              {product.photo ? (
                <Image src={product.photo} alt={product.name} fill className="object-cover object-center" />
              ) : (
                <div style={{position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center"}}>
                  <span style={{fontFamily:"var(--font-cormorant)", fontSize:"48px", fontStyle:"italic", color:"rgba(107,90,74,0.2)"}}>{product.name}</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div style={{order: isEven ? 1 : 0, display:"flex", flexDirection:"column", justifyContent:"center", padding:"64px 8vw", background:"#FAF8F4"}}>
              {(product as any).scentFamily && (
                <p style={{fontSize:"10px", letterSpacing:"3px", textTransform:"uppercase", color:"#C8B89A", marginBottom:"16px", fontFamily:"var(--font-jost)"}}>{(product as any).scentFamily}</p>
              )}
              <h2 style={{fontFamily:"var(--font-cormorant)", fontSize:"clamp(40px,5vw,64px)", fontWeight:300, fontStyle:"italic", color:"#1C1917", marginBottom:"8px", lineHeight:1}}>{product.name}</h2>
              <p style={{fontSize:"12px", color:"#9A8F82", fontFamily:"var(--font-jost)", marginBottom:"24px", fontWeight:300}}>
                Extrait de Parfum · {variants.map(v => v.sizeMl + "ml").join(" · ")}
                {!((product as any).comingSoon) && ` · Rp ${minPrice.toLocaleString("id-ID")}`}
              </p>
              <div style={{width:"40px", height:"1px", background:"rgba(200,184,154,0.5)", marginBottom:"24px"}} />

              {(product as any).inspiration && (
                <p style={{fontSize:"14px", color:"#4A4440", lineHeight:1.9, maxWidth:"400px", marginBottom:"28px", fontWeight:300, fontFamily:"var(--font-jost)"}}>
                  {(product as any).inspiration}
                </p>
              )}

              {/* Notes */}
              {((product as any).topNotes || (product as any).middleNotes || (product as any).baseNotes) && (
                <div style={{marginBottom:"28px", display:"flex", flexDirection:"column", gap:"8px"}}>
                  {(product as any).topNotes && (
                    <p style={{fontSize:"13px", fontFamily:"var(--font-jost)", color:"#6B6560"}}>
                      <span style={{fontWeight:500, color:"#1C1917"}}>Mind Notes</span> &nbsp;{(product as any).topNotes}
                    </p>
                  )}
                  {(product as any).middleNotes && (
                    <p style={{fontSize:"13px", fontFamily:"var(--font-jost)", color:"#6B6560"}}>
                      <span style={{fontWeight:500, color:"#1C1917"}}>Heart Notes</span> &nbsp;{(product as any).middleNotes}
                    </p>
                  )}
                  {(product as any).baseNotes && (
                    <p style={{fontSize:"13px", fontFamily:"var(--font-jost)", color:"#6B6560"}}>
                      <span style={{fontWeight:500, color:"#1C1917"}}>Soul Notes</span> &nbsp;{(product as any).baseNotes}
                    </p>
                  )}
                </div>
              )}

              {/* Sillage / Projection / Longevity */}
              {((product as any).sillage || (product as any).projection || (product as any).longevity) && (
                <div style={{borderTop:"1px solid rgba(28,25,23,0.08)", paddingTop:"20px", display:"flex", gap:"24px", flexWrap:"wrap"}}>
                  {(product as any).sillage && (
                    <div>
                      <p style={{fontSize:"9px", letterSpacing:"2px", textTransform:"uppercase", color:"#C8B89A", fontFamily:"var(--font-jost)", marginBottom:"4px"}}>Sillage</p>
                      <p style={{fontSize:"13px", color:"#1C1917", fontFamily:"var(--font-jost)", fontWeight:300}}>{(product as any).sillage}</p>
                    </div>
                  )}
                  {(product as any).projection && (
                    <div>
                      <p style={{fontSize:"9px", letterSpacing:"2px", textTransform:"uppercase", color:"#C8B89A", fontFamily:"var(--font-jost)", marginBottom:"4px"}}>Projection</p>
                      <p style={{fontSize:"13px", color:"#1C1917", fontFamily:"var(--font-jost)", fontWeight:300}}>{(product as any).projection}</p>
                    </div>
                  )}
                  {(product as any).longevity && (
                    <div>
                      <p style={{fontSize:"9px", letterSpacing:"2px", textTransform:"uppercase", color:"#C8B89A", fontFamily:"var(--font-jost)", marginBottom:"4px"}}>Longevity</p>
                      <p style={{fontSize:"13px", color:"#1C1917", fontFamily:"var(--font-jost)", fontWeight:300}}>{(product as any).longevity}</p>
                    </div>
                  )}
                </div>
              )}

              {(product as any).comingSoon && (
                <div style={{marginTop:"24px"}}>
                  <span style={{fontSize:"10px", letterSpacing:"2px", textTransform:"uppercase", color:"#9A8F82", border:"1px solid rgba(28,25,23,0.2)", padding:"8px 16px", fontFamily:"var(--font-jost)"}}>Coming Soon</span>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* CTA */}
      <div style={{background:"#1C1917", padding:"72px 8vw", display:"flex", justifyContent:"space-between", alignItems:"center", gap:"32px", flexWrap:"wrap"}}>
        <div>
          <p style={{fontSize:"10px", letterSpacing:"3px", textTransform:"uppercase", color:"rgba(200,184,154,0.5)", marginBottom:"12px", fontFamily:"var(--font-jost)"}}>Order Now</p>
          <h3 style={{fontFamily:"var(--font-cormorant)", fontSize:"clamp(24px,3vw,36px)", fontWeight:300, fontStyle:"italic", color:"#F0EBE3", marginBottom:"8px"}}>Tertarik dengan koleksi kami?</h3>
          <p style={{fontSize:"13px", color:"rgba(200,184,154,0.5)", fontWeight:300, fontFamily:"var(--font-jost)"}}>Hubungi kami langsung via WhatsApp untuk pemesanan.</p>
        </div>
        <a href={"https://wa.me/" + waNumber} target="_blank" rel="noreferrer"
          style={{display:"inline-block", background:"transparent", color:"#F0EBE3", padding:"14px 36px", fontSize:"10px", letterSpacing:"3px", textTransform:"uppercase", textDecoration:"none", border:"1px solid rgba(200,184,154,0.35)", fontFamily:"var(--font-jost)", whiteSpace:"nowrap"}}>
          Order via WhatsApp
        </a>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .katalog-row { grid-template-columns: 1fr !important; min-height: auto !important; }
          .katalog-row > div { order: unset !important; }
        }
      `}</style>
    </div>
  );
}
