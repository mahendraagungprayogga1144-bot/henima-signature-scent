content = open("src/app/cart/page.tsx").read()

# Fix style tag
old_style = '''      <style>{`
        @media (max-width: 768px) {
          .cart-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>'''

new_style = '''      <style>{`
        @media (max-width: 768px) {
          .cart-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
          .cart-header { display: none !important; }
          .cart-item { grid-template-columns: 1fr !important; gap: 12px !important; }
          .cart-item-info { flex-direction: column !important; }
        }
      `}</style>'''

content = content.replace(old_style, new_style)

# Tambah className ke header row
content = content.replace(
    'style={{display:"grid", gridTemplateColumns:"1fr auto auto auto", gap:"16px", padding:"0 0 16px", borderBottom:"2px solid #1C1917", marginBottom:"0"}}',
    'className="cart-header" style={{display:"grid", gridTemplateColumns:"1fr auto auto auto", gap:"16px", padding:"0 0 16px", borderBottom:"2px solid #1C1917", marginBottom:"0"}}'
)

# Tambah className ke item row
content = content.replace(
    'style={{display:"grid", gridTemplateColumns:"1fr auto auto auto", gap:"16px", alignItems:"center", padding:"20px 0", borderBottom:"1px solid rgba(28,25,23,0.08)"}}',
    'className="cart-item" style={{display:"grid", gridTemplateColumns:"1fr auto auto auto", gap:"16px", alignItems:"center", padding:"20px 0", borderBottom:"1px solid rgba(28,25,23,0.08)"}}'
)

# Fix padding di mobile
content = content.replace(
    'style={{padding:"48px 8vw"}}',
    'style={{padding:"32px 5vw"}}'
)

open("src/app/cart/page.tsx", "w").write(content)
print("Done!")
