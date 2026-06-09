with open("src/app/our-story/page.tsx", "w") as f:
    f.write('''import Link from "next/link";

export default function OurStoryPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#FAF8F4", fontFamily: "var(--font-jost, sans-serif)", color: "#1C1917" }}>

      <section style={{ background: "#1C1917", padding: "120px 32px 100px", textAlign: "center" }}>
        <p style={{ fontSize: "10px", letterSpacing: "4px", textTransform: "uppercase", color: "rgba(200,184,154,0.7)", marginBottom: "24px", fontWeight: 300 }}>Henima Signature Scent</p>
        <h1 style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "clamp(48px,8vw,96px)", fontWeight: 300, color: "#F5F0E8", lineHeight: 0.95, fontStyle: "italic", marginBottom: "32px", letterSpacing: "-1px" }}>Our Story</h1>
        <div style={{ width: "48px", height: "1px", background: "rgba(200,184,154,0.4)", margin: "0 auto 32px" }} />
        <p style={{ fontSize: "15px", color: "rgba(240,235,227,0.6)", lineHeight: 1.9, maxWidth: "480px", margin: "0 auto", fontWeight: 300 }}>A love story from two cities. A fragrance born from courage.</p>
      </section>

      <section style={{ maxWidth: "720px", margin: "0 auto", padding: "100px 32px" }}>
        <p style={{ fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: "#B5935A", marginBottom: "24px", fontWeight: 600 }}>The Beginning</p>
        <h2 style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "clamp(32px,5vw,52px)", fontWeight: 300, color: "#1C1917", lineHeight: 1.15, fontStyle: "italic", marginBottom: "40px" }}>Jakarta. Surabaya.<br />One love story.</h2>
        <div style={{ width: "40px", height: "1px", background: "#B5935A", marginBottom: "40px" }} />
        <p style={{ fontSize: "15px", color: "#6B5E52", lineHeight: 2, marginBottom: "24px" }}>Henima was born from a long-distance love story — two young souls, one in Jakarta and one in Surabaya, who proved that love is real and everlasting.</p>
        <p style={{ fontSize: "15px", color: "#6B5E52", lineHeight: 2, marginBottom: "24px" }}>Starting with no knowledge of fragrance at all, a long journey filled with courage, risk, and unwavering belief led them to found Henima Signature Scent. Many wonderful people came along the way — supporting, encouraging, and helping them reach where they are today.</p>
        <p style={{ fontSize: "15px", color: "#6B5E52", lineHeight: 2, marginBottom: "24px" }}>Every Henima variant name is born from their real story — because we believe fragrance is more than just a scent. It is identity, a reminder of beautiful moments, and a celebration of love that transcends distance.</p>
        <p style={{ fontSize: "16px", color: "#B5935A", lineHeight: 2, fontStyle: "italic", marginBottom: "40px", fontFamily: "var(--font-cormorant, serif)" }}>Welcome to Henima — Signature of Your Story. Because love is real.</p>
        <Link href="/shop" style={{ display: "inline-block", background: "#1C1917", color: "#F5F0E8", padding: "14px 40px", fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", textDecoration: "none", fontWeight: 500 }}>Discover More</Link>
      </section>

      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "0 32px" }}><div style={{ height: "1px", background: "#E8E0D5" }} /></div>

      <section style={{ maxWidth: "720px", margin: "0 auto", padding: "100px 32px" }}>
        <p style={{ fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: "#B5935A", marginBottom: "24px", fontWeight: 600 }}>Values</p>
        <h2 style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "clamp(32px,5vw,52px)", fontWeight: 300, color: "#1C1917", lineHeight: 1.15, fontStyle: "italic", marginBottom: "60px" }}>What we stand for.</h2>

        <div style={{ marginBottom: "56px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
            <div style={{ width: "32px", height: "1px", background: "#B5935A" }} />
            <p style={{ fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: "#B5935A", fontWeight: 600, margin: 0 }}>Vision</p>
          </div>
          <p style={{ fontSize: "15px", color: "#6B5E52", lineHeight: 2 }}>To become Indonesia&#39;s most beloved local fragrance brand — known not only for its quality, but for the emotional meaning and stories behind every drop. Henima is here to represent true love stories and prove that local products can touch the hearts of millions.</p>
        </div>

        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
            <div style={{ width: "32px", height: "1px", background: "#B5935A" }} />
            <p style={{ fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: "#B5935A", fontWeight: 600, margin: 0 }}>Mission</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            {["To craft high-quality fragrances of international standard — distinctive in scent, exceptional in longevity.", "To build a creative industry ecosystem — opening opportunities in sales, production, and local fragrance development.", "To educate the market that fragrance is not merely style, but a part of identity and emotional expression.", "To grow Henima into a collection brand with strong aesthetics and storytelling — recognized not only in Indonesia, but internationally.", "To empower people — our team, partners, and customers — to grow and find inspiration through every Henima fragrance."].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>
                <span style={{ fontSize: "11px", letterSpacing: "2px", color: "#B5935A", fontWeight: 700, flexShrink: 0, paddingTop: "4px" }}>0{i+1}</span>
                <p style={{ fontSize: "15px", color: "#6B5E52", lineHeight: 2, margin: 0 }}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: "#1C1917", padding: "100px 32px", textAlign: "center" }}>
        <p style={{ fontSize: "10px", letterSpacing: "4px", textTransform: "uppercase", color: "rgba(200,184,154,0.6)", marginBottom: "24px" }}>Henima Signature Scent</p>
        <h2 style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "clamp(36px,6vw,64px)", fontWeight: 300, color: "#F5F0E8", fontStyle: "italic", lineHeight: 1.1, marginBottom: "32px" }}>Every fragrance<br />carries a memory.</h2>
        <div style={{ width: "40px", height: "1px", background: "rgba(200,184,154,0.4)", margin: "0 auto 40px" }} />
        <p style={{ fontSize: "14px", color: "rgba(240,235,227,0.6)", marginBottom: "40px", lineHeight: 1.8 }}>Crafted with care in Indonesia.<br />Made to be remembered.</p>
        <Link href="/shop" style={{ display: "inline-block", background: "rgba(240,235,227,0.95)", color: "#1C1917", padding: "15px 48px", fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", textDecoration: "none", fontWeight: 500 }}>Explore Collection</Link>
      </section>

    </div>
  );
}
''')
print("Done!")
