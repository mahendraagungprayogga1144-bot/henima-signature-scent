"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar({ user }: { user?: any }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navStyle: React.CSSProperties = {
    position: "sticky",
    top: 0,
    zIndex: 40,
    background: scrolled ? "rgba(250,248,244,0.95)" : "rgba(250,248,244,0.92)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    borderBottom: "1px solid rgba(200,184,154,0.25)",
    transition: "all 0.3s ease",
  };

  const linkStyle: React.CSSProperties = {
    fontSize: "11px",
    letterSpacing: "2px",
    textTransform: "uppercase",
    color: "#2C2825",
    textDecoration: "none",
    fontWeight: 400,
    padding: "8px 4px",
    fontFamily: "var(--font-jost)",
    transition: "color 0.3s",
  };

  const logoStyle: React.CSSProperties = {
    fontFamily: "var(--font-cormorant)",
    fontSize: "20px",
    fontWeight: 400,
    letterSpacing: "6px",
    textTransform: "uppercase",
    color: "#1C1917",
    textDecoration: "none",
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
  };

  return (
    <header style={navStyle}>
      <div style={{maxWidth:"1400px", margin:"0 auto", padding:"0 48px", display:"flex", alignItems:"center", justifyContent:"space-between", height:"64px", position:"relative"}}>

        {/* LEFT NAV */}
        {!user && (
          <nav style={{display:"flex", alignItems:"center", gap:"32px"}} className="hidden-mobile">
            <Link href="/shop" style={linkStyle}>Shop</Link>
            <Link href="/katalog-digital" style={linkStyle}>Collection</Link>
            <Link href="/galeri" style={linkStyle}>Gallery</Link>
          </nav>
        )}
        {user && (
          <nav style={{display:"flex", alignItems:"center", gap:"24px"}} className="hidden-mobile">
            {user.role === "reseller" && (
              <>
                <Link href="/katalog" style={linkStyle}>Katalog</Link>
                <Link href="/pesanan" style={linkStyle}>Pesanan</Link>
                <Link href="/leaderboard" style={linkStyle}>Leaderboard</Link>
              </>
            )}
            {user.role === "admin" && (
              <Link href="/admin" style={linkStyle}>Dashboard</Link>
            )}
          </nav>
        )}

        {/* LOGO CENTER */}
        <Link href="/" style={logoStyle}>Henima</Link>

        {/* RIGHT NAV */}
        <div style={{display:"flex", alignItems:"center", gap:"24px"}}>
          {!user ? (
            <>
              <div className="hidden-mobile" style={{display:"flex", alignItems:"center", gap:"24px"}}>
                <Link href="/blog" style={linkStyle}>Journal</Link>
                <Link href="/masuk" style={{...linkStyle, color:"#8A7F72"}}>Masuk</Link>
                <Link href="/daftar" style={{fontSize:"10px", letterSpacing:"2.5px", textTransform:"uppercase", color:"#1C1917", textDecoration:"none", border:"1px solid #1C1917", padding:"10px 20px", fontFamily:"var(--font-jost)", fontWeight:400, transition:"all 0.3s", background:"transparent"}}>
                  Daftar
                </Link>
              </div>
              {/* Mobile hamburger */}
              <button
                onClick={() => setOpen(!open)}
                style={{background:"none", border:"1px solid rgba(200,184,154,0.4)", padding:"8px", cursor:"pointer", color:"#1C1917", display:"flex", alignItems:"center", justifyContent:"center"}}
                className="show-mobile"
              >
                {open ? (
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12"/></svg>
                ) : (
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16"/></svg>
                )}
              </button>
            </>
          ) : (
            <>
              <span style={{...linkStyle, color:"#8A7F72"}} className="hidden-mobile">{user.name}</span>
              <form action="/api/auth/logout" method="POST" className="hidden-mobile">
                <button type="submit" style={{...linkStyle, background:"none", border:"none", cursor:"pointer", color:"#8A7F72"}}>Keluar</button>
              </form>
              <button
                onClick={() => setOpen(!open)}
                style={{background:"none", border:"1px solid rgba(200,184,154,0.4)", padding:"8px", cursor:"pointer", color:"#1C1917", display:"flex", alignItems:"center", justifyContent:"center"}}
                className="show-mobile"
              >
                {open ? (
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12"/></svg>
                ) : (
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16"/></svg>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div style={{background:"#FAF8F4", borderTop:"1px solid rgba(200,184,154,0.25)", padding:"24px 48px 32px"}}>
          <nav style={{display:"flex", flexDirection:"column", gap:"4px"}}>
            {!user ? (
              <>
                <Link href="/shop" onClick={() => setOpen(false)} style={{...linkStyle, padding:"12px 0", borderBottom:"1px solid rgba(200,184,154,0.15)"}}>Shop</Link>
                <Link href="/katalog-digital" onClick={() => setOpen(false)} style={{...linkStyle, padding:"12px 0", borderBottom:"1px solid rgba(200,184,154,0.15)"}}>Collection</Link>
                <Link href="/galeri" onClick={() => setOpen(false)} style={{...linkStyle, padding:"12px 0", borderBottom:"1px solid rgba(200,184,154,0.15)"}}>Gallery</Link>
                <Link href="/blog" onClick={() => setOpen(false)} style={{...linkStyle, padding:"12px 0", borderBottom:"1px solid rgba(200,184,154,0.15)"}}>Journal</Link>
                <Link href="/masuk" onClick={() => setOpen(false)} style={{...linkStyle, padding:"12px 0", borderBottom:"1px solid rgba(200,184,154,0.15)", color:"#8A7F72"}}>Masuk</Link>
                <Link href="/daftar" onClick={() => setOpen(false)} style={{...linkStyle, padding:"12px 0", color:"#8A7F72"}}>Daftar</Link>
              </>
            ) : (
              <>
                {user.role === "reseller" && (
                  <>
                    <Link href="/katalog" onClick={() => setOpen(false)} style={{...linkStyle, padding:"12px 0", borderBottom:"1px solid rgba(200,184,154,0.15)"}}>Katalog</Link>
                    <Link href="/pesanan" onClick={() => setOpen(false)} style={{...linkStyle, padding:"12px 0", borderBottom:"1px solid rgba(200,184,154,0.15)"}}>Pesanan</Link>
                    <Link href="/profil" onClick={() => setOpen(false)} style={{...linkStyle, padding:"12px 0", borderBottom:"1px solid rgba(200,184,154,0.15)"}}>Profil</Link>
                    <Link href="/leaderboard" onClick={() => setOpen(false)} style={{...linkStyle, padding:"12px 0", borderBottom:"1px solid rgba(200,184,154,0.15)"}}>Leaderboard</Link>
                  </>
                )}
                {user.role === "admin" && (
                  <Link href="/admin" onClick={() => setOpen(false)} style={{...linkStyle, padding:"12px 0", borderBottom:"1px solid rgba(200,184,154,0.15)"}}>Dashboard</Link>
                )}
                <span style={{...linkStyle, padding:"12px 0", color:"#8A7F72", display:"block"}}>{user.name}</span>
                <form action="/api/auth/logout" method="POST">
                  <button type="submit" style={{...linkStyle, background:"none", border:"none", cursor:"pointer", color:"#8A7F72", padding:"12px 0"}}>Keluar</button>
                </form>
              </>
            )}
          </nav>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .hidden-mobile { display: flex !important; }
          .show-mobile { display: none !important; }
        }
        @media (max-width: 767px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
