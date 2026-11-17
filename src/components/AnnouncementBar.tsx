export default function AnnouncementBar({ items }: { items?: string[] }) {
  const marqueeItems =
    items && items.length > 0
      ? items
      : ["Afternoon", "The Distance", "Extrait de Parfum", "Made in Indonesia", "Crafted to be Remembered"];

  return (
    <div style={{ overflow: "hidden", background: "#111111", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "12px 0" }}>
      <div style={{ display: "flex", whiteSpace: "nowrap" }}>
        <div style={{ display: "flex", alignItems: "center", flexShrink: 0, animation: "marquee 22s linear infinite" }}>
          {marqueeItems.map((text, i) => (
            <span
              key={i}
              style={{
                margin: "0 32px",
                fontSize: "10px",
                fontWeight: 300,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.5)",
                fontFamily: "var(--font-jakarta)",
              }}
            >
              {text}
            </span>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", flexShrink: 0, animation: "marquee 22s linear infinite" }} aria-hidden>
          {marqueeItems.map((text, i) => (
            <span
              key={i}
              style={{
                margin: "0 32px",
                fontSize: "10px",
                fontWeight: 300,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.5)",
                fontFamily: "var(--font-jakarta)",
              }}
            >
              {text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
