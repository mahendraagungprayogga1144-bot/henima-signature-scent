with open("src/components/ProductGallery.tsx", "w") as f:
    f.write('''"use client";
import Image from "next/image";
import { useState } from "react";

export default function ProductGallery({ photos, productName, comingSoon }: {
  photos: string[];
  productName: string;
  comingSoon?: boolean;
}) {
  const [active, setActive] = useState(0);

  if (photos.length === 0) {
    return (
      <div style={{background:"#F0EBE3", minHeight:"600px", display:"flex", alignItems:"center", justifyContent:"center"}}>
        <span style={{fontFamily:"var(--font-cormorant)", fontSize:"48px", fontStyle:"italic", color:"rgba(107,90,74,0.2)"}}>{productName}</span>
      </div>
    );
  }

  return (
    <div style={{display:"flex", flexDirection:"column", background:"#F0EBE3"}} className="product-gallery">
      {/* Main Image */}
      <div style={{position:"relative", flex:1, minHeight:"500px", overflow:"hidden"}}>
        <Image
          src={photos[active]}
          alt={productName}
          fill
          style={{objectFit:"cover", objectPosition:"center"}}
          priority
        />
        {comingSoon && (
          <div style={{position:"absolute", top:"24px", left:"24px", background:"#1C1917", color:"#FAF8F4", fontSize:"9px", letterSpacing:"2px", textTransform:"uppercase", padding:"6px 14px"}}>
            Coming Soon
          </div>
        )}
        {/* Arrow navigation */}
        {photos.length > 1 && (
          <>
            <button onClick={() => setActive(a => (a - 1 + photos.length) % photos.length)}
              style={{position:"absolute", left:"16px", top:"50%", transform:"translateY(-50%)", background:"rgba(250,248,244,0.8)", border:"none", width:"36px", height:"36px", cursor:"pointer", fontSize:"18px", display:"flex", alignItems:"center", justifyContent:"center"}}>
              ‹
            </button>
            <button onClick={() => setActive(a => (a + 1) % photos.length)}
              style={{position:"absolute", right:"16px", top:"50%", transform:"translateY(-50%)", background:"rgba(250,248,244,0.8)", border:"none", width:"36px", height:"36px", cursor:"pointer", fontSize:"18px", display:"flex", alignItems:"center", justifyContent:"center"}}>
              ›
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {photos.length > 1 && (
        <div style={{display:"flex", gap:"4px", padding:"8px", background:"#E8E0D4"}}>
          {photos.map((photo, i) => (
            <div key={i} onClick={() => setActive(i)}
              style={{position:"relative", width:"64px", height:"64px", flexShrink:0, cursor:"pointer", opacity: active === i ? 1 : 0.5, border: active === i ? "2px solid #1C1917" : "2px solid transparent", transition:"all 0.2s", overflow:"hidden"}}>
              <Image src={photo} alt={productName + " " + (i+1)} fill style={{objectFit:"cover"}} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
''')
print("Gallery Done!")
