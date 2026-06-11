content = open("src/app/our-story/page.tsx").read()

# Tambah import Reveal
content = content.replace(
    'import Link from "next/link";',
    'import Link from "next/link";\nimport Reveal from "@/components/Reveal";'
)

# Wrap setiap section
content = content.replace(
    '<section style={{ maxWidth: "720px", margin: "0 auto", padding: "100px 32px" }}>',
    '<Reveal direction="up"><section style={{ maxWidth: "720px", margin: "0 auto", padding: "100px 32px" }}>'
).replace(
    '</section>\n\n      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "0 32px" }}><div style={{ height: "1px"',
    '</section></Reveal>\n\n      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "0 32px" }}><div style={{ height: "1px"'
)

# Wrap CTA section
content = content.replace(
    '<section data-reveal="fade" style={{ background: "#1C1917"',
    '<Reveal direction="fade"><section style={{ background: "#1C1917"'
).replace(
    '</section>\n\n    </div>',
    '</section></Reveal>\n\n    </div>'
)

open("src/app/our-story/page.tsx", "w").write(content)
print("Done!")
