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
      <div style={{minHeight:"55vh", display:"flex", flexDirection:"column", justifyContent:"center", padding:"80px 8vw", borderBottom:"2px solid #1C1917"}}>
        <p style={{fontSize:"11px", letterSpacing:"4px", textTransform:"uppercase", color:"#9A8F82", marginBottom:"20px"}}>{company.name}</p>
        <h1 style={{fontFamily:"var(--font-jost)", fontSize:"clamp(48px,8vw,96px)", fontWeight:700, color:"#1C1917", lineHeight:1, marginBottom:"32px", letterSpacing:"-2px"}}>
          Catalog of<br />Henima
        </h1>
        <p style={{fontSize:"15px", color:"#6B6560", maxWidth:"480px", lineHeight:1.8, marginBottom:"48px", fontWeight:300}}>
          Made for those who believe fragrance is more than scent — it is memory, emotion, and identity.
        </p>
        <div style={{display:"flex", gap:"12px", flexWrap:"wrap"}}>
          <Link href="/shop"
            style={{display:"inline-block", background:"#1C1917", color:"#fff", padding:"14px 32px", fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase", textDecoration:"none", fontWeight:500}}>
            Shop Now
          </Link>
        </div>
      </div>

      {/* PRODUCTS */}
      {products.map((product) => {
        const variants = product.variants.filter((v) => v.active);
        const minPrice = variants.length > 0 ? Math.min(...variants.map((v) => v.originalPrice)) : product.originalPrice;
        return (
          <div key={product.id} style={{padding:"64px 8vw", borderBottom:"1px solid rgba(28,25,23,0.1)"}}>

            {/* Name + subtitle */}
            <h2 style={{fontFamily:"var(--font-jost)", fontSize:"clamp(32px,5vw,56px)", fontWeight:700, color:"#1C1917", lineHeight:1, marginBottom:"10px", letterSpacing:"-1px"}}>
              {product.name}
            </h2>
            <p style={{fontSize:"13px", color:"#6B6560", marginBottom:"4px"}}>
              Extrait de Parfum · {variants.map(v => v.sizeMl + "ml").join(" · ")}
              {(product as any).scentFamily ? " · " + (product as any).scentFamily : ""}
            </p>
            {!(product as any).comingSoon && (
              <p style={{fontSize:"15px", fontWeight:600, color:"#1C1917", marginBottom:"32px"}}>
                Rp {minPrice.toLocaleString("id-ID")},-
              </p>
            )}
            {(product as any).comingSoon && (
              <p style={{fontSize:"13px", color:"#9A8F82", marginBottom:"32px"}}>Coming Soon</p>
            )}

            {/* Photo + Notes side by side */}
            <div style={{display:"grid", gridTemplateColumns:"1fr 2fr", gap:"40px", alignItems:"start"}}>
              {/* Image */}
              <div style={{position:"relative", aspectRatio:"2/3", background:"#F5F5F5", overflow:"hidden"}}>
                {product.photo ? (
                  <Image src={product.photo} alt={product.name} fill className="object-cover object-center" />
                ) : (
                  <div style={{position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", background:"#F0F0F0"}}>
                    <span style={{fontSize:"14px", color:"#ccc"}}>{product.name}</span>
                  </div>
                )}
              </div>

              {/* Notes */}
              <div>
                {(product as any).inspiration && (
                  <p style={{fontSize:"14px", color:"#4A4440", lineHeight:1.8, fontWeight:300, marginBottom:"24px"}}>
                    {(product as any).inspiration}
                  </p>
                )}
                {(product as any).topNotes && (
                  <div style={{marginBottom:"14px"}}>
                    <p style={{fontSize:"12px", fontWeight:700, color:"#1C1917", marginBottom:"3px"}}>Mind Notes</p>
                    <p style={{fontSize:"13px", color:"#6B6560", fontWeight:300}}>{(product as any).topNotes}</p>
                  </div>
                )}
                {(product as any).middleNotes && (
                  <div style={{marginBottom:"14px"}}>
                    <p style={{fontSize:"12px", fontWeight:700, color:"#1C1917", marginBottom:"3px"}}>Heart Notes</p>
                    <p style={{fontSize:"13px", color:"#6B6560", fontWeight:300}}>{(product as any).middleNotes}</p>
                  </div>
                )}
                {(product as any).baseNotes && (
                  <div style={{marginBottom:"14px"}}>
                    <p style={{fontSize:"12px", fontWeight:700, color:"#1C1917", marginBottom:"3px"}}>Soul Notes</p>
                    <p style={{fontSize:"13px", color:"#6B6560", fontWeight:300}}>{(product as any).baseNotes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sillage / Projection / Longevity */}
            {((product as any).sillage || (product as any).projection || (product as any).longevity) && (
              <div style={{borderTop:"1px solid rgba(28,25,23,0.1)", marginTop:"32px", paddingTop:"20px"}}>
                <p style={{fontSize:"13px", color:"#1C1917", lineHeight:1.8}}>
                  {(product as any).sillage && <><span style={{fontWeight:700}}>Sillage</span> {(product as any).sillage}</>}
                  {(product as any).projection && <> · <span style={{fontWeight:700}}>Projection</span> {(product as any).projection}</>}
                  {(product as any).longevity && <> · <span style={{fontWeight:700}}>Longevity</span> {(product as any).longevity}</>}
                </p>
              </div>
            )}
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

    </div>
  );
}
