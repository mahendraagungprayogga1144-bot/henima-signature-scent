import Image from "next/image";
import { getDatabase } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";

export const dynamic = "force-dynamic";

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const db = await getDatabase();
  const company = db.settings.company;
  const products = db.products.filter((p) => p.active);
  const product = products.find((p) => toSlug(p.name) === slug);
  if (!product) notFound();

  const variants = product.variants.filter((v) => v.active);
  const waNumber = company.whatsappNumber || "6285190311230";
  const waText = encodeURIComponent("Halo Henima, saya ingin membeli " + product.name + ". Boleh info ketersediaan dan cara ordernya?");
  const waLink = "https://wa.me/" + waNumber + "?text=" + waText;

  return (
    <div style={{background:"#FAF8F4", minHeight:"100vh", color:"#1C1917", fontFamily:"var(--font-jost)"}}>

      {/* BREADCRUMB */}
      <div style={{padding:"20px 8vw", borderBottom:"1px solid rgba(28,25,23,0.06)", display:"flex", gap:"8px", alignItems:"center"}}>
        <Link href="/shop" style={{fontSize:"12px", color:"#9A8F82", textDecoration:"none"}}>Shop</Link>
        <span style={{fontSize:"12px", color:"#C8B89A"}}>→</span>
        <span style={{fontSize:"12px", color:"#1C1917"}}>{product.name}</span>
      </div>

      {/* MAIN */}
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0", minHeight:"80vh"}} className="product-detail-grid">

        {/* LEFT — Image */}
        <div style={{position:"relative", background:"#F0EBE3", minHeight:"600px", overflow:"hidden"}}>
          {product.photo ? (
            <Image src={product.photo} alt={product.name} fill className="object-cover object-center" priority />
          ) : (
            <div style={{position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center"}}>
              <span style={{fontFamily:"var(--font-cormorant)", fontSize:"48px", fontStyle:"italic", color:"rgba(107,90,74,0.2)"}}>{product.name}</span>
            </div>
          )}
          {(product as any).comingSoon && (
            <div style={{position:"absolute", top:"24px", left:"24px", background:"#1C1917", color:"#FAF8F4", fontSize:"9px", letterSpacing:"2px", textTransform:"uppercase", padding:"6px 14px"}}>
              Coming Soon
            </div>
          )}
        </div>

        {/* RIGHT — Info */}
        <div style={{padding:"64px 8vw", display:"flex", flexDirection:"column", justifyContent:"center", background:"#FAF8F4"}}>
          {(product as any).scentFamily && (
            <p style={{fontSize:"10px", letterSpacing:"3px", textTransform:"uppercase", color:"#C8B89A", marginBottom:"16px"}}>
              {(product as any).scentFamily}
            </p>
          )}
          <h1 style={{fontFamily:"var(--font-cormorant)", fontSize:"clamp(40px,5vw,64px)", fontWeight:300, fontStyle:"italic", color:"#1C1917", marginBottom:"8px", lineHeight:1}}>
            {product.name}
          </h1>
          <p style={{fontSize:"12px", color:"#9A8F82", marginBottom:"24px"}}>Extrait de Parfum</p>
          <div style={{width:"40px", height:"1px", background:"rgba(200,184,154,0.5)", marginBottom:"24px"}} />
          {(product as any).inspiration && (
            <p style={{fontSize:"14px", color:"#4A4440", lineHeight:1.9, marginBottom:"28px", fontWeight:300}}>
              {(product as any).inspiration}
            </p>
          )}
          {product.description && (
            <p style={{fontSize:"13px", color:"#9A8F82", lineHeight:1.8, marginBottom:"32px", fontWeight:300}}>
              {product.description}
            </p>
          )}

          {/* Notes */}
          {((product as any).topNotes || (product as any).middleNotes || (product as any).baseNotes) && (
            <div style={{marginBottom:"32px", display:"flex", flexDirection:"column", gap:"10px", padding:"20px 0", borderTop:"1px solid rgba(28,25,23,0.08)", borderBottom:"1px solid rgba(28,25,23,0.08)"}}>
              {(product as any).topNotes && (
                <p style={{fontSize:"13px", color:"#6B6560"}}>
                  <span style={{fontWeight:500, color:"#1C1917"}}>Top</span> · {(product as any).topNotes}
                </p>
              )}
              {(product as any).middleNotes && (
                <p style={{fontSize:"13px", color:"#6B6560"}}>
                  <span style={{fontWeight:500, color:"#1C1917"}}>Heart</span> · {(product as any).middleNotes}
                </p>
              )}
              {(product as any).baseNotes && (
                <p style={{fontSize:"13px", color:"#6B6560"}}>
                  <span style={{fontWeight:500, color:"#1C1917"}}>Base</span> · {(product as any).baseNotes}
                </p>
              )}
            </div>
          )}

          {/* Add to Cart */}
          {(product as any).comingSoon ? (
            <div style={{border:"1px solid rgba(28,25,23,0.15)", padding:"16px", textAlign:"center"}}>
              <p style={{fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase", color:"#9A8F82"}}>Coming Soon</p>
            </div>
          ) : (
            <AddToCartButton
              productId={product.id}
              productName={product.name}
              productPhoto={product.photo || ""}
              variants={variants.map(v => ({ id: v.id, sizeMl: v.sizeMl, originalPrice: v.originalPrice, active: v.active }))}
            />
          )}

          {/* Sillage Projection Longevity */}
          {((product as any).sillage || (product as any).projection || (product as any).longevity) && (
            <div style={{marginTop:"32px", padding:"20px 0", borderTop:"1px solid rgba(28,25,23,0.08)", display:"flex", gap:"32px", flexWrap:"wrap"}}>
              {(product as any).sillage && (
                <div>
                  <p style={{fontSize:"9px", letterSpacing:"2px", textTransform:"uppercase", color:"#C8B89A", marginBottom:"4px"}}>Sillage</p>
                  <p style={{fontSize:"13px", color:"#1C1917", fontWeight:300}}>{(product as any).sillage}</p>
                </div>
              )}
              {(product as any).projection && (
                <div>
                  <p style={{fontSize:"9px", letterSpacing:"2px", textTransform:"uppercase", color:"#C8B89A", marginBottom:"4px"}}>Projection</p>
                  <p style={{fontSize:"13px", color:"#1C1917", fontWeight:300}}>{(product as any).projection}</p>
                </div>
              )}
              {(product as any).longevity && (
                <div>
                  <p style={{fontSize:"9px", letterSpacing:"2px", textTransform:"uppercase", color:"#C8B89A", marginBottom:"4px"}}>Longevity</p>
                  <p style={{fontSize:"13px", color:"#1C1917", fontWeight:300}}>{(product as any).longevity}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* OTHER PRODUCTS */}
      <div style={{padding:"80px 8vw", borderTop:"1px solid rgba(28,25,23,0.06)"}}>
        <p style={{fontSize:"10px", letterSpacing:"3px", textTransform:"uppercase", color:"#9A8F82", marginBottom:"40px"}}>You May Also Like</p>
        <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:"16px"}}>
          {products.filter(p => p.id !== product.id).map((p) => (
            <Link key={p.id} href={"/shop/" + toSlug(p.name)} style={{textDecoration:"none", color:"#1C1917", display:"block"}}>
              <div style={{background:"#F0EBE3", overflow:"hidden"}}>
                <div style={{position:"relative", aspectRatio:"1/1", background:"#E8E0D4"}}>
                  {p.photo && <Image src={p.photo} alt={p.name} fill className="object-cover" />}
                </div>
                <div style={{padding:"16px"}}>
                  <p style={{fontSize:"9px", letterSpacing:"2px", textTransform:"uppercase", color:"#C8B89A", marginBottom:"4px"}}>Extrait de Parfum</p>
                  <p style={{fontFamily:"var(--font-cormorant)", fontSize:"20px", fontWeight:400, color:"#1C1917"}}>{p.name}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .product-detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
