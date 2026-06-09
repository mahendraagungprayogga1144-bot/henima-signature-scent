"use client";
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

export default function ShopClient({ products, waNumber }: { products: Product[]; waNumber: string }) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<number[]>([]);
  const [selectedAvail, setSelectedAvail] = useState<string[]>([]);

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
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"14px"}}>
            <p style={{fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase", color:"#1C1917", fontFamily:"var(--font-jost)", fontWeight:500}}>Size</p>
            <span style={{color:"#9A8F82", fontSize:"16px"}}>−</span>
          </div>
          {allSizes.map((size) => (
            <label key={size} onClick={() => toggleSize(size)} style={{display:"flex", alignItems:"center", gap:"10px", marginBottom:"10px", cursor:"pointer"}}>
              <span style={{width:"16px", height:"16px", border:"1px solid rgba(28,25,23,0.25)", display:"inline-block", flexShrink:0, background: selectedSizes.includes(size) ? "#1C1917" : "transparent", transition:"background 0.2s"}} />
              <span style={{fontSize:"13px", color:"#6B6560", fontFamily:"var(--font-jost)", fontWeight:300}}>{size}ml</span>
            </label>
          ))}
          <div style={{height:"1px", background:"rgba(28,25,23,0.08)", margin:"20px 0"}} />
        </div>
      )}
      <div>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"14px"}}>
          <p style={{fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase", color:"#1C1917", fontFamily:"var(--font-jost)", fontWeight:500}}>Availability</p>
          <span style={{color:"#9A8F82", fontSize:"16px"}}>−</span>
        </div>
        {["Available Now","Coming Soon"].map((s) => (
          <label key={s} onClick={() => toggleAvail(s)} style={{display:"flex", alignItems:"center", gap:"10px", marginBottom:"10px", cursor:"pointer"}}>
            <span style={{width:"16px", height:"16px", border:"1px solid rgba(28,25,23,0.25)", display:"inline-block", flexShrink:0, background: selectedAvail.includes(s) ? "#1C1917" : "transparent", transition:"background 0.2s"}} />
            <span style={{fontSize:"13px", color:"#6B6560", fontFamily:"var(--font-jost)", fontWeight:300}}>{s}</span>
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
      <div style={{padding:"48px 6vw 32px", borderBottom:"1px solid rgba(28,25,23,0.08)"}}>
        <p style={{fontSize:"11px", letterSpacing:"3px", textTransform:"uppercase", color:"#9A8F82", marginBottom:"10px", fontFamily:"var(--font-jost)", fontWeight:300}}>
          Henima Signature Scent
        </p>
        <h1 style={{fontFamily:"var(--font-cormorant)", fontSize:"clamp(32px,5vw,56px)", fontWeight:300, color:"#1C1917", lineHeight:1, fontStyle:"italic"}}>
          Our Scents
        </h1>
      </div>

      {/* MOBILE FILTER BAR */}
      <div className="mobile-filter-bar" style={{display:"none", padding:"14px 6vw", borderBottom:"1px solid rgba(28,25,23,0.08)", justifyContent:"space-between", alignItems:"center"}}>
        <p style={{fontSize:"12px", color:"#9A8F82", fontFamily:"var(--font-jost)", fontWeight:300}}>
          Showing {filtered.length} products
        </p>
        <button onClick={() => setFilterOpen(true)} style={{display:"flex", alignItems:"center", gap:"8px", background:"none", border:"1px solid rgba(28,25,23,0.2)", padding:"8px 16px", cursor:"pointer", fontFamily:"var(--font-jost)", fontSize:"11px", letterSpacing:"1.5px", textTransform:"uppercase", color:"#1C1917"}}>
          {activeFilters > 0 && <span style={{background:"#1C1917", color:"#FAF8F4", borderRadius:"50%", width:"16px", height:"16px", fontSize:"9px", display:"inline-flex", alignItems:"center", justifyContent:"center"}}>{activeFilters}</span>}
          Filter
          <svg width="14" height="10" viewBox="0 0 14 10" fill="none"><path d="M0 1h14M3 5h8M6 9h2" stroke="#1C1917" strokeWidth="1.2" strokeLinecap="round"/></svg>
        </button>
      </div>

      {/* FILTER OVERLAY (mobile) */}
      {filterOpen && (
        <div style={{position:"fixed", inset:0, zIndex:200, background:"#FAF8F4", padding:"0 6vw 40px", overflowY:"auto"}}>
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", height:"60px", borderBottom:"1px solid rgba(28,25,23,0.08)", marginBottom:"28px"}}>
            <p style={{fontSize:"13px", letterSpacing:"2px", textTransform:"uppercase", fontFamily:"var(--font-jost)", fontWeight:500, color:"#1C1917"}}>Filter</p>
            <button onClick={() => setFilterOpen(false)} style={{background:"none", border:"none", cursor:"pointer", fontSize:"22px", color:"#1C1917", lineHeight:1}}>×</button>
          </div>
          {sidebarContent}
          <button onClick={() => setFilterOpen(false)} style={{marginTop:"32px", width:"100%", background:"#1C1917", color:"#FAF8F4", border:"none", padding:"14px", fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase", cursor:"pointer", fontFamily:"var(--font-jost)"}}>
            Show {filtered.length} Results
          </button>
        </div>
      )}

      {/* BODY */}
      <div style={{display:"flex", padding:"32px 6vw 80px", alignItems:"start", gap:"0"}}>

        {/* SIDEBAR desktop */}
        <aside className="shop-sidebar" style={{width:"200px", flexShrink:0, paddingRight:"40px", borderRight:"1px solid rgba(28,25,23,0.08)"}}>
          <p style={{fontSize:"12px", color:"#9A8F82", fontFamily:"var(--font-jost)", fontWeight:300, marginBottom:"28px"}}>
            Showing {filtered.length} products
          </p>
          {sidebarContent}
        </aside>

        {/* GRID */}
        <div style={{flex:1, paddingLeft:"40px"}} className="shop-grid-wrap">
          <div style={{display:"grid", gridTemplateColumns:"repeat(2, 1fr)", gap:"1px", background:"rgba(28,25,23,0.06)"}}>
            {filtered.map((product) => {
              const variants = product.variants.filter((v) => v.active);
              const minPrice = variants.length > 0 ? Math.min(...variants.map((v) => v.originalPrice)) : product.originalPrice;
              const waText = encodeURIComponent("Halo Henima, saya ingin membeli " + product.name + ". Boleh info ketersediaan dan cara ordernya?");
              return (
                <div key={product.id} style={{background:"#FAF8F4", cursor:"pointer"}}>
                  <div style={{position:"relative", aspectRatio:"1/1", background:"#F0EBE3", overflow:"hidden"}}>
                    {product.photo ? (
                      <Image src={product.photo} alt={product.name} fill className="object-cover" />
                    ) : (
                      <div style={{position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center"}}>
                        <span style={{fontFamily:"var(--font-cormorant)", fontSize:"18px", fontStyle:"italic", color:"rgba(107,90,74,0.3)"}}>{product.name}</span>
                      </div>
                    )}
                    {(product as any).comingSoon && (
                      <div style={{position:"absolute", top:"10px", left:"10px", background:"#1C1917", color:"#FAF8F4", fontSize:"8px", letterSpacing:"1.5px", textTransform:"uppercase", padding:"3px 8px", fontFamily:"var(--font-jost)"}}>
                        Coming Soon
                      </div>
                    )}
                  </div>
                  <div style={{padding:"12px 14px 16px", background:"#FAF8F4"}}>
                    <h2 style={{fontFamily:"var(--font-cormorant)", fontSize:"17px", fontWeight:400, color:"#1C1917", marginBottom:"3px", lineHeight:1.2}}>{product.name}</h2>
                    <p style={{fontSize:"11px", color:"#9A8F82", fontFamily:"var(--font-jost)", fontWeight:300, marginBottom:"10px", lineHeight:1.5, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden"}}>{product.description}</p>
                    <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                      {(product as any).comingSoon ? (
                        <span style={{fontSize:"10px", color:"#9A8F82", fontFamily:"var(--font-jost)"}}>Coming Soon</span>
                      ) : (
                        <p style={{fontFamily:"var(--font-jost)", fontSize:"13px", fontWeight:400, color:"#1C1917"}}>Rp {minPrice.toLocaleString("id-ID")}</p>
                      )}
                      <a href={"https://wa.me/" + waNumber + "?text=" + waText} target="_blank" rel="noreferrer"
                        style={{fontSize:"9px", letterSpacing:"1.5px", textTransform:"uppercase", color:"#1C1917", border:"1px solid rgba(28,25,23,0.2)", padding:"5px 10px", textDecoration:"none", fontFamily:"var(--font-jost)"}}>
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
