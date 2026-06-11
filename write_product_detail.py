with open("src/app/shop/[slug]/page.tsx", "w") as f:
    f.write('''import Image from "next/image";
import { getDatabase } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";
import ProductGallery from "@/components/ProductGallery";

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
  const photos = (product as any).photos?.length > 0 ? (product as any).photos : product.photo ? [product.photo] : [];

  return (
    <div style={{background:"#FAF8F4", minHeight:"100vh", color:"#1C1917", fontFamily:"var(--font-jost)"}}>

      {/* BREADCRUMB */}
      <div style={{padding:"16px 8vw", borderBottom:"1px solid rgba(28,25,23,0.06)", display:"flex", gap:"8px", alignItems:"center"}}>
        <Link href="/shop" style={{fontSize:"11px", color:"#9A8F82", textDecoration:"none", letterSpacing:"1px"}}>Shop</Link>
        <span style={{fontSize:"11px", color:"#C8B89A"}}>›</span>
        <span style={{fontSize:"11px", color:"#1C1917"}}>{product.name}</span>
      </div>

      {/* MAIN */}
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0", minHeight:"85vh"}} className="product-detail-grid">

        {/* LEFT — Gallery */}
        <ProductGallery photos={photos} productName={product.name} comingSoon={(product as any).comingSoon} />

        {/* RIGHT — Info */}
        <div style={{padding:"64px 8vw 64px", display:"flex", flexDirection:"column", background:"#FAF8F4", overflowY:"auto"}} className="product-detail-right">
          
          {(product as any).scentFamily && (
            <p style={{fontSize:"10px", letterSpacing:"3px", textTransform:"uppercase", color:"#C8B89A", marginBottom:"16px"}}>
              {(product as any).scentFamily}
            </p>
          )}
          
          <h1 style={{fontFamily:"var(--font-cormorant)", fontSize:"clamp(36px,4vw,56px)", fontWeight:300, fontStyle:"italic", color:"#1C1917", marginBottom:"6px", lineHeight:1.1}}>
            {product.name}
          </h1>
          <p style={{fontSize:"11px", color:"#9A8F82", marginBottom:"24px", letterSpacing:"1px"}}>Extrait de Parfum · Made in Indonesia</p>
          
          <div style={{width:"32px", height:"1px", background:"rgba(200,184,154,0.5)", marginBottom:"28px"}} />

          {/* Price */}
          <div style={{marginBottom:"32px"}}>
            {variants.length > 0 && (
              <p style={{fontFamily:"var(--font-cormorant)", fontSize:"32px", fontWeight:300, color:"#1C1917"}}>
                Rp {Math.min(...variants.map(v => v.originalPrice)).toLocaleString("id-ID")}
              </p>
            )}
          </div>

          {/* Add to Cart */}
          {(product as any).comingSoon ? (
            <div style={{border:"1px solid rgba(28,25,23,0.15)", padding:"16px", textAlign:"center", marginBottom:"32px"}}>
              <p style={{fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase", color:"#9A8F82"}}>Coming Soon</p>
            </div>
          ) : (
            <div style={{marginBottom:"40px"}}>
              <AddToCartButton
                productId={product.id}
                productName={product.name}
                productPhoto={product.photo || ""}
                variants={variants.map(v => ({ id: v.id, sizeMl: v.sizeMl, originalPrice: v.originalPrice, active: v.active }))}
              />
            </div>
          )}

          {/* Accordion */}
          <div style={{borderTop:"1px solid rgba(28,25,23,0.1)"}}>
            
            {/* Story Behind */}
            {((product as any).inspiration || product.description) && (
              <details style={{borderBottom:"1px solid rgba(28,25,23,0.1)"}}>
                <summary style={{padding:"18px 0", fontSize:"12px", letterSpacing:"2px", textTransform:"uppercase", color:"#1C1917", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center", listStyle:"none", userSelect:"none"}}>
                  Story Behind
                  <span style={{fontSize:"18px", color:"#C8B89A", fontWeight:300}}>+</span>
                </summary>
                <div style={{paddingBottom:"20px"}}>
                  {(product as any).inspiration && (
                    <p style={{fontSize:"14px", color:"#4A4440", lineHeight:1.9, marginBottom:"12px", fontWeight:300}}>{(product as any).inspiration}</p>
                  )}
                  {product.description && (
                    <p style={{fontSize:"13px", color:"#9A8F82", lineHeight:1.8, fontWeight:300}}>{product.description}</p>
                  )}
                </div>
              </details>
            )}

            {/* Notes */}
            {((product as any).topNotes || (product as any).middleNotes || (product as any).baseNotes) && (
              <details style={{borderBottom:"1px solid rgba(28,25,23,0.1)"}}>
                <summary style={{padding:"18px 0", fontSize:"12px", letterSpacing:"2px", textTransform:"uppercase", color:"#1C1917", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center", listStyle:"none", userSelect:"none"}}>
                  Notes Description
                  <span style={{fontSize:"18px", color:"#C8B89A", fontWeight:300}}>+</span>
                </summary>
                <div style={{paddingBottom:"20px", display:"flex", flexDirection:"column", gap:"12px"}}>
                  {(product as any).topNotes && (
                    <div>
                      <p style={{fontSize:"9px", letterSpacing:"2px", textTransform:"uppercase", color:"#C8B89A", marginBottom:"4px"}}>Top Notes</p>
                      <p style={{fontSize:"13px", color:"#4A4440", fontWeight:300}}>{(product as any).topNotes}</p>
                    </div>
                  )}
                  {(product as any).middleNotes && (
                    <div>
                      <p style={{fontSize:"9px", letterSpacing:"2px", textTransform:"uppercase", color:"#C8B89A", marginBottom:"4px"}}>Heart Notes</p>
                      <p style={{fontSize:"13px", color:"#4A4440", fontWeight:300}}>{(product as any).middleNotes}</p>
                    </div>
                  )}
                  {(product as any).baseNotes && (
                    <div>
                      <p style={{fontSize:"9px", letterSpacing:"2px", textTransform:"uppercase", color:"#C8B89A", marginBottom:"4px"}}>Base Notes</p>
                      <p style={{fontSize:"13px", color:"#4A4440", fontWeight:300}}>{(product as any).baseNotes}</p>
                    </div>
                  )}
                </div>
              </details>
            )}

            {/* Performance */}
            {((product as any).sillage || (product as any).projection || (product as any).longevity) && (
              <details style={{borderBottom:"1px solid rgba(28,25,23,0.1)"}}>
                <summary style={{padding:"18px 0", fontSize:"12px", letterSpacing:"2px", textTransform:"uppercase", color:"#1C1917", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center", listStyle:"none", userSelect:"none"}}>
                  Product Performance
                  <span style={{fontSize:"18px", color:"#C8B89A", fontWeight:300}}>+</span>
                </summary>
                <div style={{paddingBottom:"20px", display:"flex", gap:"32px", flexWrap:"wrap"}}>
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
              </details>
            )}

            {/* Shipping */}
            <details style={{borderBottom:"1px solid rgba(28,25,23,0.1)"}}>
              <summary style={{padding:"18px 0", fontSize:"12px", letterSpacing:"2px", textTransform:"uppercase", color:"#1C1917", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center", listStyle:"none", userSelect:"none"}}>
                Shipping Information
                <span style={{fontSize:"18px", color:"#C8B89A", fontWeight:300}}>+</span>
              </summary>
              <div style={{paddingBottom:"20px"}}>
                <p style={{fontSize:"13px", color:"#6B5E52", lineHeight:1.9, fontWeight:300}}>
                  Free shipping for orders above Rp 150.000. Orders are processed within 1-2 business days. Delivery takes 2-5 business days depending on your location.
                </p>
              </div>
            </details>

          </div>
        </div>
      </div>

      {/* YOU MAY ALSO LIKE */}
      <div style={{padding:"80px 8vw", borderTop:"1px solid rgba(28,25,23,0.06)"}}>
        <p style={{fontSize:"10px", letterSpacing:"3px", textTransform:"uppercase", color:"#9A8F82", marginBottom:"40px"}}>You May Also Like</p>
        <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:"2px", background:"rgba(28,25,23,0.06)"}}>
          {products.filter(p => p.id !== product.id).slice(0,4).map((p) => (
            <Link key={p.id} href={"/shop/" + toSlug(p.name)} style={{textDecoration:"none", color:"#1C1917", display:"block", background:"#FAF8F4"}}>
              <div style={{position:"relative", aspectRatio:"3/4", background:"#F0EBE3", overflow:"hidden"}}>
                {p.photo && <Image src={p.photo} alt={p.name} fill style={{objectFit:"cover"}} />}
              </div>
              <div style={{padding:"16px 18px 20px"}}>
                <p style={{fontSize:"9px", letterSpacing:"2px", textTransform:"uppercase", color:"#C8B89A", marginBottom:"4px"}}>Extrait de Parfum</p>
                <p style={{fontFamily:"var(--font-cormorant)", fontSize:"20px", fontWeight:400, color:"#1C1917"}}>{p.name}</p>
                <p style={{fontSize:"13px", color:"#9A8F82", marginTop:"4px"}}>Rp {Math.min(...p.variants.filter(v=>v.active).map(v=>v.originalPrice)).toLocaleString("id-ID")}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style>{\`
        @media (max-width: 768px) {
          .product-detail-grid { grid-template-columns: 1fr !important; }
          .product-detail-right { padding: 32px 6vw !important; }
        }
      \`}</style>
    </div>
  );
}
''')
print("Page Done!")
