import re

# ── OUR STORY ──
content = open("src/app/our-story/page.tsx").read()
content = content.replace(
    '<section style={{ maxWidth: "720px", margin: "0 auto", padding: "100px 32px" }}>',
    '<section data-reveal="up" style={{ maxWidth: "720px", margin: "0 auto", padding: "100px 32px" }}>'
).replace(
    '<div style={{ maxWidth: "720px", margin: "0 auto", padding: "64px 24px" }}>',
    '<div data-reveal="up" style={{ maxWidth: "720px", margin: "0 auto", padding: "64px 24px" }}>'
).replace(
    '<section style={{ background: "#1C1917", padding: "100px 32px", textAlign: "center" }}>',
    '<section data-reveal="fade" style={{ background: "#1C1917", padding: "100px 32px", textAlign: "center" }}>'
)
open("src/app/our-story/page.tsx", "w").write(content)
print("Our Story Done!")

# ── BLOG PAGE ──
content = open("src/app/blog/page.tsx").read()
content = content.replace(
    '<div key={post.id} style={{ display: "flex", flexDirection: "column" }}>',
    '<div key={post.id} data-reveal="up" style={{ display: "flex", flexDirection: "column" }}>'
)
open("src/app/blog/page.tsx", "w").write(content)
print("Blog Done!")

# ── PROFIL PAGE ──
content = open("src/app/profil/page.tsx").read()
content = content.replace(
    '<div style={{ maxWidth: "900px", margin: "0 auto", padding: "64px 24px 48px"',
    '<div data-reveal="up" style={{ maxWidth: "900px", margin: "0 auto", padding: "64px 24px 48px"'
).replace(
    '<div style={{ background: "#faf8f5", padding: "64px 24px" }}>',
    '<div data-reveal="fade" style={{ background: "#faf8f5", padding: "64px 24px" }}>'
).replace(
    '<div style={{ maxWidth: "700px", margin: "0 auto", padding: "64px 24px" }}>',
    '<div data-reveal="up" style={{ maxWidth: "700px", margin: "0 auto", padding: "64px 24px" }}>'
)
open("src/app/profil/page.tsx", "w").write(content)
print("Profil Done!")

# ── MASUK PAGE ──
content = open("src/app/masuk/page.tsx").read()
content = content.replace(
    '<div\n      style={{\n        width: "100%",\n        maxWidth: "440px",',
    '<div\n      data-reveal="up"\n      style={{\n        width: "100%",\n        maxWidth: "440px",'
)
open("src/app/masuk/page.tsx", "w").write(content)
print("Masuk Done!")

# ── DAFTAR PAGE ──
content = open("src/app/daftar/page.tsx").read()
content = content.replace(
    '<div\n      style={{\n        width: "100%",\n        maxWidth: "440px",',
    '<div\n      data-reveal="up"\n      style={{\n        width: "100%",\n        maxWidth: "440px",'
)
open("src/app/daftar/page.tsx", "w").write(content)
print("Daftar Done!")

print("\nAll Done!")
