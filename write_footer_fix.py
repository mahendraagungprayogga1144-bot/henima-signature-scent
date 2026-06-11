content = open("src/app/layout.tsx").read()

# Ganti grid 4 kolom jadi 3 kolom dan hapus Partner section
old_grid = '''<div style={{display:"grid", gridTemplateColumns:"1.5fr 1fr 1fr 1fr", gap:"48px", marginBottom:"64px", paddingBottom:"48px", borderBottom:"1px solid rgba(200,184,154,0.12)"}}>'''
new_grid = '''<div style={{display:"grid", gridTemplateColumns:"1.5fr 1fr 1fr", gap:"48px", marginBottom:"64px", paddingBottom:"48px", borderBottom:"1px solid rgba(200,184,154,0.12)"}}>'''
content = content.replace(old_grid, new_grid)

# Hapus kolom Partner
old_partner = '''            <div>
              <h4 style={{fontSize:"10px", letterSpacing:"2.5px", textTransform:"uppercase", color:"rgba(200,184,154,0.4)", fontWeight:400, marginBottom:"20px"}}>Partner</h4>
              <ul style={{listStyle:"none", padding:0, margin:0, display:"flex", flexDirection:"column", gap:"10px"}}>
                {[["Katalog","/katalog-digital"]].map(([label,href]) => (
                  <li key={label}><a href={href} style={{fontSize:"13px", color:"rgba(240,235,227,0.6)", textDecoration:"none", fontWeight:300}}>{label}</a></li>
                ))}
              </ul>
            </div>'''
content = content.replace(old_partner, '')

open("src/app/layout.tsx", "w").write(content)
print("Done!")
