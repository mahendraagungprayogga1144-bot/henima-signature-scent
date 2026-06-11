with open("src/components/AnnouncementBar.tsx", "w") as f:
    f.write('''export default function AnnouncementBar({ items }: { items?: string[] }) {
  const marqueeItems = items && items.length > 0
    ? items
    : ["Afternoon", "The Distance", "Extrait de Parfum", "Made in Indonesia", "Crafted to be Remembered"];

  return (
    <div style={{overflow:"hidden", background:"#1C1917", borderBottom:"1px solid rgba(200,184,154,0.1)", padding:"10px 0"}}>
      <div style={{display:"flex", whiteSpace:"nowrap"}}>
        <div style={{display:"flex", alignItems:"center", flexShrink:0, animation:"marquee 22s linear infinite"}}>
          {marqueeItems.map((text, i) => (
            <span key={i} style={{margin:"0 32px", fontSize:"10px", fontWeight:300, letterSpacing:"2.5px", textTransform:"uppercase", color:"rgba(200,184,154,0.6)", fontFamily:"var(--font-jost)"}}>
              {text}
            </span>
          ))}
        </div>
        <div style={{display:"flex", alignItems:"center", flexShrink:0, animation:"marquee 22s linear infinite"}} aria-hidden>
          {marqueeItems.map((text, i) => (
            <span key={i} style={{margin:"0 32px", fontSize:"10px", fontWeight:300, letterSpacing:"2.5px", textTransform:"uppercase", color:"rgba(200,184,154,0.6)", fontFamily:"var(--font-jost)"}}>
              {text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
''')
print("Done!")
