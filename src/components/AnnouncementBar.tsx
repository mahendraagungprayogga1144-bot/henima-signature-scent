export default function AnnouncementBar() {
  const items = ["Free Shipping above Rp 150.000", "Afternoon", "The Distance", "Extrait de Parfum", "Made in Indonesia", "Crafted to be Remembered"];

  return (
    <div style={{overflow:"hidden", background:"#1C1917", borderBottom:"1px solid rgba(200,184,154,0.1)", padding:"10px 0"}}>
      <div style={{display:"flex", whiteSpace:"nowrap"}}>
        <div style={{display:"flex", alignItems:"center", flexShrink:0, animation:"marquee 22s linear infinite"}}>
          {items.map((text, i) => (
            <span key={i} style={{margin:"0 32px", fontSize:"10px", fontWeight:300, letterSpacing:"2.5px", textTransform:"uppercase", color:"rgba(200,184,154,0.6)", fontFamily:"var(--font-jost)"}}>
              {text}
              {i < items.length - 1 && <span style={{marginLeft:"32px", color:"rgba(200,184,154,0.25)"}}>·</span>}
            </span>
          ))}
        </div>
        <div style={{display:"flex", alignItems:"center", flexShrink:0, animation:"marquee 22s linear infinite"}} aria-hidden>
          {items.map((text, i) => (
            <span key={i} style={{margin:"0 32px", fontSize:"10px", fontWeight:300, letterSpacing:"2.5px", textTransform:"uppercase", color:"rgba(200,184,154,0.6)", fontFamily:"var(--font-jost)"}}>
              {text}
              {i < items.length - 1 && <span style={{marginLeft:"32px", color:"rgba(200,184,154,0.25)"}}>·</span>}
            </span>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
}
