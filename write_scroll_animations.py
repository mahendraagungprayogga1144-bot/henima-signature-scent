# Homepage - wrap sections dengan ScrollReveal
content = open("src/app/page.tsx").read()

# Wrap brand story section
content = content.replace(
    '      <section style={{background:"#FAF8F4", padding:"100px 8vw", borderTop:"1px solid rgba(28,25,23,0.06)"}}>',
    '      <ScrollReveal direction="up" delay={0}>\n      <section style={{background:"#FAF8F4", padding:"100px 8vw", borderTop:"1px solid rgba(28,25,23,0.06)"}}>'
).replace(
    '      </section>\n\n      {/* ── VISI MISI',
    '      </section>\n      </ScrollReveal>\n\n      {/* ── VISI MISI'
)

# Wrap visi misi section
content = content.replace(
    '        <section style={{background:"#FAF8F4", padding:"80px 8vw", borderTop:"1px solid rgba(28,25,23,0.08)"}}>',
    '      <ScrollReveal direction="up" delay={100}>\n        <section style={{background:"#FAF8F4", padding:"80px 8vw", borderTop:"1px solid rgba(28,25,23,0.08)"}}>'
).replace(
    '        </section>\n      )}\n\n      {/* ── PHOTO CAROUSEL',
    '        </section>\n      </ScrollReveal>\n      )}\n\n      {/* ── PHOTO CAROUSEL'
)

open("src/app/page.tsx", "w").write(content)
print("Homepage Done!")

# Our Story - tambah CSS animation
content2 = open("src/app/our-story/page.tsx").read()
content2 = content2.replace(
    '<div style={{ minHeight: "100vh", background: "#FAF8F4"',
    '<div style={{ minHeight: "100vh", background: "#FAF8F4"'
)

# Tambah style animasi di our-story
old_style = "      <style>{`\n        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }\n      `}</style>\n\n"
if old_style not in content2:
    content2 = content2.replace(
        '<div style={{ minHeight: "100vh", background: "#FAF8F4", fontFamily: "var(--font-jost, sans-serif)", color: "#1C1917" }}>',
        '<div style={{ minHeight: "100vh", background: "#FAF8F4", fontFamily: "var(--font-jost, sans-serif)", color: "#1C1917" }}>\n\n      <style>{`\n        @keyframes fadeUp { from { opacity: 0; transform: translateY(32px); } to { opacity: 1; transform: translateY(0); } }\n        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }\n        .animate-section { animation: fadeUp 1.1s cubic-bezier(0.22,1,0.36,1) both; }\n        .animate-hero { animation: fadeIn 1.4s cubic-bezier(0.22,1,0.36,1) both; }\n      `}</style>'
    )

open("src/app/our-story/page.tsx", "w").write(content2)
print("Our Story Done!")
print("All Done!")
