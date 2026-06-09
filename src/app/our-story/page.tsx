import Link from "next/link";

export default function OurStoryPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#FAF8F4", fontFamily: "var(--font-jost, sans-serif)", color: "#1C1917" }}>

      {/* HERO */}
      <section style={{ background: "#1C1917", padding: "120px 32px 100px", textAlign: "center" }}>
        <p style={{ fontSize: "10px", letterSpacing: "4px", textTransform: "uppercase", color: "rgba(200,184,154,0.7)", marginBottom: "24px", fontWeight: 300 }}>
          Henima Signature Scent
        </p>
        <h1 style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "clamp(48px,8vw,96px)", fontWeight: 300, color: "#F5F0E8", lineHeight: 0.95, fontStyle: "italic", marginBottom: "32px", letterSpacing: "-1px" }}>
          Our Story
        </h1>
        <div style={{ width: "48px", height: "1px", background: "rgba(200,184,154,0.4)", margin: "0 auto 32px" }} />
        <p style={{ fontSize: "15px", color: "rgba(240,235,227,0.6)", lineHeight: 1.9, maxWidth: "480px", margin: "0 auto", fontWeight: 300 }}>
          A fragrance born from distance. A love story bottled in scent.
        </p>
      </section>

      {/* THE BEGINNING */}
      <section style={{ maxWidth: "720px", margin: "0 auto", padding: "100px 32px" }}>
        <p style={{ fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: "#B5935A", marginBottom: "24px", fontWeight: 600 }}>The Beginning</p>
        <h2 style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "clamp(32px,5vw,52px)", fontWeight: 300, color: "#1C1917", lineHeight: 1.15, fontStyle: "italic", marginBottom: "40px" }}>
          Two cities.<br />One longing.
        </h2>
        <div style={{ width: "40px", height: "1px", background: "#B5935A", marginBottom: "40px" }} />
        <p style={{ fontSize: "15px", color: "#6B5E52", lineHeight: 2, marginBottom: "24px" }}>
          Henima was never meant to be a brand. It was meant to be a bridge — between Jakarta and Surabaya, between two people who refused to let distance define them.
        </p>
        <p style={{ fontSize: "15px", color: "#6B5E52", lineHeight: 2, marginBottom: "24px" }}>
          It started simply: a scent worn on a jacket left behind. A fragrance that lingered long after the train had gone. A reminder that even when someone is far, they can still be felt — in the air, on the skin, in quiet moments alone.
        </p>
        <p style={{ fontSize: "15px", color: "#6B5E52", lineHeight: 2 }}>
          That is how Henima was born. Not from a laboratory, but from longing. Not from a boardroom, but from love.
        </p>
      </section>

      {/* DIVIDER */}
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "0 32px" }}>
        <div style={{ height: "1px", background: "#E8E0D5" }} />
      </div>

      {/* THE NAME */}
      <section style={{ maxWidth: "720px", margin: "0 auto", padding: "100px 32px" }}>
        <p style={{ fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: "#B5935A", marginBottom: "24px", fontWeight: 600 }}>The Name</p>
        <h2 style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "clamp(32px,5vw,52px)", fontWeight: 300, color: "#1C1917", lineHeight: 1.15, fontStyle: "italic", marginBottom: "40px" }}>
          What is Henima?
        </h2>
        <div style={{ width: "40px", height: "1px", background: "#B5935A", marginBottom: "40px" }} />
        <p style={{ fontSize: "15px", color: "#6B5E52", lineHeight: 2, marginBottom: "24px" }}>
          Henima is not a word you will find in any dictionary. It is a name created from two people — a quiet merging of identities, a proof that two stories can become one.
        </p>
        <p style={{ fontSize: "15px", color: "#6B5E52", lineHeight: 2 }}>
          We chose a name that belongs to no language because love, too, belongs to no single language. It simply exists — felt, not explained.
        </p>
      </section>

      {/* DIVIDER */}
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "0 32px" }}>
        <div style={{ height: "1px", background: "#E8E0D5" }} />
      </div>

      {/* VISION */}
      <section style={{ maxWidth: "720px", margin: "0 auto", padding: "100px 32px" }}>
        <p style={{ fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: "#B5935A", marginBottom: "24px", fontWeight: 600 }}>Our Vision</p>
        <h2 style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "clamp(32px,5vw,52px)", fontWeight: 300, color: "#1C1917", lineHeight: 1.15, fontStyle: "italic", marginBottom: "40px" }}>
          To be the scent<br />of your most<br />cherished moments.
        </h2>
        <div style={{ width: "40px", height: "1px", background: "#B5935A", marginBottom: "40px" }} />
        <p style={{ fontSize: "15px", color: "#6B5E52", lineHeight: 2 }}>
          We believe fragrance is not decoration. It is memory. It is emotion. It is the invisible thread that connects you to the people, places, and moments that matter most. Our vision is to craft scents that become part of your most intimate stories — worn not just on skin, but carried in the heart.
        </p>
      </section>

      {/* DIVIDER */}
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "0 32px" }}>
        <div style={{ height: "1px", background: "#E8E0D5" }} />
      </div>

      {/* MISSION */}
      <section style={{ maxWidth: "720px", margin: "0 auto", padding: "100px 32px" }}>
        <p style={{ fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: "#B5935A", marginBottom: "24px", fontWeight: 600 }}>Our Mission</p>
        <h2 style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "clamp(32px,5vw,52px)", fontWeight: 300, color: "#1C1917", lineHeight: 1.15, fontStyle: "italic", marginBottom: "40px" }}>
          Crafted with care.<br />Made to be remembered.
        </h2>
        <div style={{ width: "40px", height: "1px", background: "#B5935A", marginBottom: "40px" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          {[
            { num: "01", text: "To create Extrait de Parfum of the highest quality — accessible to everyone in Indonesia, without compromise." },
            { num: "02", text: "To build a community of people who believe that scent is personal, powerful, and deeply human." },
            { num: "03", text: "To prove that Indonesian fragrance can stand proudly alongside the world's finest — because our stories deserve to be told." },
          ].map((item) => (
            <div key={item.num} style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>
              <span style={{ fontSize: "11px", letterSpacing: "2px", color: "#B5935A", fontWeight: 700, flexShrink: 0, paddingTop: "4px" }}>{item.num}</span>
              <p style={{ fontSize: "15px", color: "#6B5E52", lineHeight: 2, margin: 0 }}>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "#1C1917", padding: "100px 32px", textAlign: "center" }}>
        <p style={{ fontSize: "10px", letterSpacing: "4px", textTransform: "uppercase", color: "rgba(200,184,154,0.6)", marginBottom: "24px" }}>Henima Signature Scent</p>
        <h2 style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "clamp(36px,6vw,64px)", fontWeight: 300, color: "#F5F0E8", fontStyle: "italic", lineHeight: 1.1, marginBottom: "32px" }}>
          Every fragrance<br />carries a memory.
        </h2>
        <div style={{ width: "40px", height: "1px", background: "rgba(200,184,154,0.4)", margin: "0 auto 40px" }} />
        <p style={{ fontSize: "14px", color: "rgba(240,235,227,0.6)", marginBottom: "40px", lineHeight: 1.8 }}>
          Crafted with care in Indonesia.<br />Made to be remembered.
        </p>
        <Link href="/shop" style={{ display: "inline-block", background: "rgba(240,235,227,0.95)", color: "#1C1917", padding: "15px 48px", fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", textDecoration: "none", fontWeight: 500 }}>
          Explore Collection
        </Link>
      </section>

    </div>
  );
}
