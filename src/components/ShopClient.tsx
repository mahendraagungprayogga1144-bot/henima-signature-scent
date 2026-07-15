"use client";
import WishlistButton from "@/components/WishlistButton";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface Product {
  id: string;
  name: string;
  description: string;
  photo: string;
  active: boolean;
  originalPrice: number;
  discountPrice: number;
  variants: { id: string; sizeMl: number; active: boolean; originalPrice: number; discountPrice: number }[];
  comingSoon?: boolean;
  topNotes?: string;
  middleNotes?: string;
  baseNotes?: string;
}

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function ShopClient({ products, waNumber }: { products: Product[]; waNumber: string }) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<number[]>([]);
  const [selectedAvail, setSelectedAvail] = useState<string[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const allSizes = Array.from(new Set(
    products.flatMap((p) => p.variants.filter((v) => v.active).map((v) => v.sizeMl))
  )).sort((a, b) => a - b);

  const filtered = products.filter((p) => {
    const variants = p.variants.filter((v) => v.active);
    if (selectedSizes.length > 0 && !variants.some((v) => selectedSizes.includes(v.sizeMl))) return false;
    if (selectedAvail.length > 0) {
      const isComingSoon = !!(p as any).comingSoon;
      if (selectedAvail.includes("Available Now") && isComingSoon) return false;
      if (selectedAvail.includes("Coming Soon") && !isComingSoon) return false;
    }
    return true;
  });

  const toggleSize = (s: number) => setSelectedSizes((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  const toggleAvail = (a: string) => setSelectedAvail((prev) => prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]);
  const activeFilters = selectedSizes.length + selectedAvail.length;

  const sidebarContent = (
    <>
      {allSizes.length > 0 && (
        <div style={{marginBottom:"24px"}}>
          <p style={{fontSize:"10px", letterSpacing:"2px", textTransform:"uppercase", color:"#1C1917", fontFamily:"var(--font-jost)", fontWeight:500, marginBottom:"16px"}}>Size</p>
          {allSizes.map((size) => (
            <label key={size} onClick={() => toggleSize(size)} style={{display:"flex", alignItems:"center", gap:"10px", marginBottom:"12px", cursor:"pointer"}}>
              <span style={{width:"14px", height:"14px", border:"1px solid rgba(28,25,23,0.3)", display:"inline-block", flexShrink:0, background: selectedSizes.includes(size) ? "#1C1917" : "transparent", transition:"background 0.2s"}} />
              <span style={{fontSize:"12px", color:"#6B6560", fontFamily:"var(--font-jost)", fontWeight:300}}>{size}ml</span>
            </label>
          ))}
          <div style={{height:"1px", background:"rgba(28,25,23,0.08)", margin:"20px 0"}} />
        </div>
      )}
      <div>
        <p style={{fontSize:"10px", letterSpacing:"2px", textTransform:"uppercase", color:"#1C1917", fontFamily:"var(--font-jost)", fontWeight:500, marginBottom:"16px"}}>Availability</p>
        {["Available Now","Coming Soon"].map((s) => (
          <label key={s} onClick={() => toggleAvail(s)} style={{display:"flex", alignItems:"center", gap:"10px", marginBottom:"12px", cursor:"pointer"}}>
            <span style={{width:"14px", height:"14px", border:"1px solid rgba(28,25,23,0.3)", display:"inline-block", flexShrink:0, background: selectedAvail.includes(s) ? "#1C1917" : "transparent", transition:"background 0.2s"}} />
            <span style={{fontSize:"12px", color:"#6B6560", fontFamily:"var(--font-jost)", fontWeight:300}}>{s}</span>
          </label>
        ))}
      </div>
      {activeFilters > 0 && (
        <button onClick={() => { setSelectedSizes([]); setSelectedAvail([]); }} style={{marginTop:"24px", fontSize:"10px", letterSpacing:"2px", textTransform:"uppercase", color:"#9A8F82", background:"none", border:"1px solid rgba(28,25,23,0.15)", padding:"8px 16px", cursor:"pointer", fontFamily:"var(--font-jost)", width:"100%"}}>
          Clear All ({activeFilters})
        </button>
      )}
    </>
  );

  return (
    <div style={{background:"#FAF8F4", minHeight:"100vh", color:"#1C1917"}}>

      {/* HEADER */}
      <div style={{padding:"64px 6vw 40px", borderBottom:"1px solid rgba(28,25,23,0.08)"}}>
        <p style={{fontSize:"10px", letterSpacing:"4px", textTransform:"uppercase", color:"#9A8F82", marginBottom:"12px", fontFamily:"var(--font-jost)", fontWeight:300}}>
          Henima Signature Scent
        </p>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-end", flexWrap:"wrap", gap:"16px"}}>
          <h1 style={{fontFamily:"var(--font-cormorant)", fontSize:"clamp(36px,6vw,64px)", fontWeight:300, color:"#1C1917", lineHeight:1, fontStyle:"italic", margin:0}}>
            Our Scents
          </h1>
          <p style={{fontSize:"12px", color:"#9A8F82", fontFamily:"var(--font-jost)", fontWeight:300, margin:0}}>
            {filtered.length} fragrance{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* MOBILE FILTER BAR */}
      <div className="mobile-filter-bar" style={{display:"none", padding:"14px 6vw", borderBottom:"1px solid rgba(28,25,23,0.08)", justifyContent:"space-between", alignItems:"center"}}>
        <button onClick={() => setFilterOpen(true)} style={{display:"flex", alignItems:"center", gap:"8px", background:"none", border:"1px solid rgba(28,25,23,0.2)", padding:"8px 16px", cursor:"pointer", fontFamily:"var(--font-jost)", fontSize:"10px", letterSpacing:"1.5px", textTransform:"uppercase", color:"#1C1917"}}>
          {activeFilters > 0 && <span style={{background:"#1C1917", color:"#FAF8F4", borderRadius:"50%", width:"16px", height:"16px", fontSize:"9px", display:"inline-flex", alignItems:"center", justifyContent:"center"}}>{activeFilters}</span>}
          Filter
        </button>
      </div>

      {/* FILTER OVERLAY mobile */}
      {filterOpen && (
        <div style={{position:"fixed", inset:0, zIndex:200, background:"#FAF8F4", padding:"0 6vw 40px", overflowY:"auto"}}>
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", height:"60px", borderBottom:"1px solid rgba(28,25,23,0.08)", marginBottom:"28px"}}>
            <p style={{fontSize:"12px", letterSpacing:"2px", textTransform:"uppercase", fontFamily:"var(--font-jost)", fontWeight:500, color:"#1C1917"}}>Filter</p>
            <button onClick={() => setFilterOpen(false)} style={{background:"none", border:"none", cursor:"pointer", fontSize:"22px", color:"#1C1917"}}>×</button>
          </div>
          {sidebarContent}
          <button onClick={() => setFilterOpen(false)} style={{marginTop:"32px", width:"100%", background:"#1C1917", color:"#FAF8F4", border:"none", padding:"14px", fontSize:"10px", letterSpacing:"2px", textTransform:"uppercase", cursor:"pointer", fontFamily:"var(--font-jost)"}}>
            Show {filtered.length} Results
          </button>
        </div>
      )}

      {/* BODY */}
      <div style={{display:"flex", padding:"40px 6vw 80px", alignItems:"start", gap:"0"}}>

        {/* SIDEBAR desktop */}
        <aside className="shop-sidebar" style={{width:"180px", flexShrink:0, paddingRight:"40px", position:"sticky", top:"80px"}}>
          {sidebarContent}
        </aside>

        {/* GRID */}
        <div style={{flex:1, paddingLeft:"40px"}} className="shop-grid-wrap">
          <div style={{display:"grid", gridTemplateColumns:"repeat(2, 1fr)", gap:"2px", background:"rgba(28,25,23,0.06)"}}>
            {filtered.map((product) => {
              const variants = product.variants.filter((v) => v.active);
              const minPrice = variants.length > 0 ? Math.min(...variants.map((v) => v.originalPrice)) : product.originalPrice;
              const isHovered = hoveredId === product.id;
              return (
                <Link
                  key={product.id}
                  href={"/shop/" + toSlug(product.name)}
                  style={{background:"#FAF8F4", cursor:"pointer", textDecoration:"none", color:"#1C1917", display:"block", position:"relative"}}
                  onMouseEnter={() => setHoveredId(product.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <div style={{position:"relative", aspectRatio:"3/4", background:"#F0EBE3", overflow:"hidden"}}>
                    <WishlistButton productId={product.id} />
                    {product.photo ? (
                      product.photo.startsWith("/") ? (
                      <Image
                        src={product.photo}
                        alt={product.name}
                        fill
                        style={{
                          objectFit:"cover",
                          transform: isHovered ? "scale(1.04)" : "scale(1)",
                          transition: "transform 0.8s cubic-bezier(0.16,1,0.3,1)",
                        }}
                      />
                      ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.photo}
                        alt={product.name}
                        style={{
                          width:"100%",
                          height:"100%",
                          objectFit:"cover",
                          transform: isHovered ? "scale(1.04)" : "scale(1)",
                          transition: "transform 0.8s cubic-bezier(0.16,1,0.3,1)",
                        }}
                      />
                      )
                    ) : (
                      <div style={{position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center"}}>
                        <span style={{fontFamily:"var(--font-cormorant)", fontSize:"18px", fontStyle:"italic", color:"rgba(107,90,74,0.3)"}}>{product.name}</span>
                      </div>
                    )}
                    {(product as any).comingSoon && (
                      <div style={{position:"absolute", top:"14px", left:"14px", background:"#1C1917", color:"#FAF8F4", fontSize:"8px", letterSpacing:"2px", textTransform:"uppercase", padding:"4px 10px", fontFamily:"var(--font-jost)"}}>
                        Coming Soon
                      </div>
                    )}
                    {(product as any).isGiftSet && !(product as any).comingSoon && (
                      <div style={{position:"absolute", top:"14px", left:"14px", background:"#C8B89A", color:"#1C1917", fontSize:"8px", letterSpacing:"2px", textTransform:"uppercase", padding:"4px 10px", fontFamily:"var(--font-jost)"}}>
                        Gift Set
                      </div>
                    )}
                    {/* Overlay on hover */}
                    <div style={{
                      position:"absolute", inset:0,
                      background:"rgba(28,25,23,0.12)",
                      opacity: isHovered ? 1 : 0,
                      transition:"opacity 0.4s ease",
                      display:"flex", alignItems:"flex-end", justifyContent:"center",
                      paddingBottom:"24px",
                    }}>
                      <span style={{fontSize:"10px", letterSpacing:"2px", textTransform:"uppercase", color:"#FAF8F4", fontFamily:"var(--font-jost)", borderBottom:"1px solid rgba(250,248,244,0.5)", paddingBottom:"2px"}}>
                        View Details
                      </span>
                    </div>
                  </div>
                  <div style={{padding:"16px 18px 20px", background:"#FAF8F4"}}>
                    <p style={{fontSize:"9px", letterSpacing:"2px", textTransform:"uppercase", color:"#C8B89A", fontFamily:"var(--font-jost)", marginBottom:"6px"}}>
                      {(product as any).isGiftSet ? "Gift Set / Bundling" : "Extrait de Parfum"}
                    </p>
                    <h2 style={{fontFamily:"var(--font-cormorant)", fontSize:"22px", fontWeight:400, color:"#1C1917", marginBottom:"6px", lineHeight:1.2}}>{product.name}</h2>
                    <p style={{fontSize:"11px", color:"#9A8F82", fontFamily:"var(--font-jost)", fontWeight:300, marginBottom:"14px", lineHeight:1.6, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden"}}>{product.description}</p>
                    {(product as any).comingSoon ? (
                      <span style={{fontSize:"10px", color:"#9A8F82", fontFamily:"var(--font-jost)", letterSpacing:"1px"}}>Coming Soon</span>
                    ) : (
                      <p style={{fontFamily:"var(--font-jost)", fontSize:"15px", fontWeight:400, color:"#1C1917"}}>
                        Rp {minPrice.toLocaleString("id-ID")}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .shop-sidebar { display: none !important; }
          .shop-grid-wrap { padding-left: 0 !important; }
          .mobile-filter-bar { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
