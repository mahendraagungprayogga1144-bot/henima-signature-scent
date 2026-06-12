import Image from "next/image";
import { getDatabase } from "@/lib/db";

export default async function GaleriPage() {
  const db = await getDatabase();
  const gallery = (db.settings as any).gallery ?? { images: [], title: "Galeri" };
  const company = db.settings.company;
  const images = (gallery.images || []);
  const galleryImages = (db.settings.company as any).galleryImages || [];
  const allImages = [...images, ...galleryImages].filter(Boolean);

  return (
    <div style={{background:"#0A0907",minHeight:"100vh",fontFamily:"var(--font-jost,sans-serif)"}}>

      {/* HERO */}
      <div style={{padding:"clamp(80px,10vw,140px) clamp(20px,8vw,80px) clamp(40px,6vw,60px)",borderBottom:"1px solid rgba(200,184,154,.08)"}}>
        <p style={{fontSize:"10px",letterSpacing:"4px",textTransform:"uppercase",color:"rgba(200,184,154,.35)",marginBottom:"20px"}}>{company.name}</p>
        <h1 style={{fontFamily:"var(--font-cormorant,serif)",fontSize:"clamp(40px,7vw,90px)",fontWeight:400,fontStyle:"italic",color:"#F0EBE3",lineHeight:1,marginBottom:"20px"}}>Gallery</h1>
        <p style={{fontSize:"clamp(13px,1.4vw,16px)",color:"rgba(240,235,227,.3)",maxWidth:"360px",lineHeight:1.8}}>Momen, produk, dan cerita di balik {company.name}.</p>
      </div>

      {/* MASONRY GRID */}
      {allImages.length > 0 ? (
        <div style={{padding:"clamp(24px,4vw,48px) clamp(16px,4vw,48px)"}}>
          {/* First row — hero image full width */}
          {allImages[0] && (
            <div style={{position:"relative",width:"100%",height:"clamp(240px,45vw,520px)",marginBottom:"2px",overflow:"hidden"}}>
              <Image
                src={typeof allImages[0]==="string"?allImages[0]:allImages[0].url}
                alt="Gallery"
                fill
                style={{objectFit:"cover",filter:"brightness(.85)",transition:"transform .6s ease"}}
              />
              <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(10,9,7,.4) 0%,transparent 50%)"}}/>
            </div>
          )}

          {/* Rest — masonry 2-3 col */}
          <div style={{
            display:"grid",
            gridTemplateColumns:"repeat(auto-fill,minmax(clamp(150px,28vw,320px),1fr))",
            gap:"2px",
            marginTop:"2px"
          }}>
            {allImages.slice(1).map((img: any, i: number) => (
              <div key={i} style={{
                position:"relative",
                aspectRatio: i%5===0 ? "1/1.3" : i%3===0 ? "4/3" : "1/1",
                overflow:"hidden",
                background:"#1A1714"
              }}>
                <Image
                  src={typeof img==="string"?img:img.url}
                  alt={typeof img==="object"&&img.caption?img.caption:"Gallery"}
                  fill
                  style={{objectFit:"cover",filter:"brightness(.85)",transition:"transform .6s ease, filter .3s"}}
                />
                <div style={{position:"absolute",inset:0,background:"rgba(10,9,7,0)",transition:"background .3s"}}/>
                {typeof img==="object"&&img.caption&&(
                  <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"16px",background:"linear-gradient(to top,rgba(10,9,7,.8),transparent)"}}>
                    <p style={{fontSize:"11px",color:"rgba(240,235,227,.7)",letterSpacing:"1px"}}>{img.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{textAlign:"center",padding:"120px 20px"}}>
          <p style={{fontFamily:"var(--font-cormorant,serif)",fontSize:"28px",fontWeight:400,color:"rgba(240,235,227,.2)",fontStyle:"italic"}}>Belum ada foto.</p>
          <p style={{fontSize:"12px",color:"rgba(240,235,227,.15)",marginTop:"8px",letterSpacing:"2px",textTransform:"uppercase"}}>Upload foto di Admin → Pengaturan → Gallery</p>
        </div>
      )}

      {/* FOOTER SPACE */}
      <div style={{height:"clamp(40px,6vw,80px)"}}/>
    </div>
  );
}
