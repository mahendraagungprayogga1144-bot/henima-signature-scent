content = open("src/components/Navbar.tsx").read()

# Hapus menu reseller dari desktop nav
content = content.replace(
    '''            {user?.role === "reseller" && (
              <>
                <Link href="/katalog" style={{fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase", color:"#2C2825", textDecoration:"none", fontFamily:"var(--font-jost)"}}>Katalog</Link>
                <Link href="/pesanan" style={{fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase", color:"#2C2825", textDecoration:"none", fontFamily:"var(--font-jost)"}}>Pesanan</Link>
              </>
            )}''',
    ''
)

# Hapus menu reseller dari hamburger
content = content.replace(
    '''                {user.role === "reseller" && [
                  ["/katalog","Katalog"],
                  ["/pesanan","Pesanan"],
                  ["/profil","Profil"],
                  ["/leaderboard","Leaderboard"],
                ].map(([href, label]) => (
                  <Link key={href} href={href} onClick={() => setOpen(false)} style={{
                    fontFamily:"var(--font-jost)", fontSize:"clamp(28px,7vw,42px)",
                    fontWeight:300, color:"rgba(240,235,227,0.9)", textDecoration:"none",
                    lineHeight:1.4, letterSpacing:"2px", textTransform:"uppercase",
                    borderBottom:"1px solid rgba(255,255,255,0.06)", paddingBottom:"14px", marginBottom:"4px",
                  }}>
                    {label}
                  </Link>
                ))}''',
    '''                {user.role !== "admin" && (
                  <Link href="/profil" onClick={() => setOpen(false)} style={{
                    fontFamily:"var(--font-jost)", fontSize:"clamp(28px,7vw,42px)",
                    fontWeight:300, color:"rgba(240,235,227,0.9)", textDecoration:"none",
                    lineHeight:1.4, letterSpacing:"2px", textTransform:"uppercase",
                    borderBottom:"1px solid rgba(255,255,255,0.06)", paddingBottom:"14px", marginBottom:"4px",
                  }}>
                    The Intimate
                  </Link>
                )}'''
)

open("src/components/Navbar.tsx", "w").write(content)
print("Done!")
