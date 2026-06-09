"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar({ user }: { user?: any }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header style={{
        position:"sticky", top:0, zIndex:50,
        background:"rgba(250,248,244,0.95)",
        backdropFilter:"blur(12px)", WebkitBackdropFilter:"blur(12px)",
        borderBottom:"1px solid rgba(28,25,23,0.08)",
      }}>
        <div style={{
          display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"0 24px", height:"60px", position:"relative",
        }}>

          {/* LEFT — desktop nav only */}
          <nav className="nav-desktop" style={{display:"flex", alignItems:"center", gap:"28px"}}>
            {!user && (
              <>
                <Link href="/shop" style={{fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase", color:"#2C2825", textDecoration:"none", fontFamily:"var(--font-jost)", fontWeight:400}}>Shop</Link>
                <Link href="/katalog-digital" style={{fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase", color:"#2C2825", textDecoration:"none", fontFamily:"var(--font-jost)", fontWeight:400}}>Collection</Link>
                <Link href="/galeri" style={{fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase", color:"#2C2825", textDecoration:"none", fontFamily:"var(--font-jost)", fontWeight:400}}>Gallery</Link>
              </>
            )}
            {user?.role === "reseller" && (
              <>
                <Link href="/katalog" style={{fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase", color:"#2C2825", textDecoration:"none", fontFamily:"var(--font-jost)"}}>Katalog</Link>
                <Link href="/pesanan" style={{fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase", color:"#2C2825", textDecoration:"none", fontFamily:"var(--font-jost)"}}>Pesanan</Link>
              </>
            )}
            {user?.role === "admin" && (
              <Link href="/admin" style={{fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase", color:"#2C2825", textDecoration:"none", fontFamily:"var(--font-jost)"}}>Dashboard</Link>
            )}
          </nav>

          {/* CENTER — logo */}
          <Link href="/" style={{
            fontFamily:"var(--font-cormorant)", fontSize:"19px", fontWeight:400,
            letterSpacing:"6px", textTransform:"uppercase", color:"#1C1917",
            textDecoration:"none", position:"absolute", left:"50%", transform:"translateX(-50%)",
          }}>
            Henima
          </Link>

          {/* RIGHT — desktop auth + hamburger */}
          <div style={{display:"flex", alignItems:"center", gap:"20px"}}>
            {!user ? (
              <>
                <Link href="/masuk" className="nav-desktop" style={{fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase", color:"#8A7F72", textDecoration:"none", fontFamily:"var(--font-jost)"}}>Masuk</Link>
                <Link href="/daftar" className="nav-desktop" style={{fontSize:"10px", letterSpacing:"2px", textTransform:"uppercase", color:"#1C1917", textDecoration:"none", border:"1px solid #1C1917", padding:"9px 18px", fontFamily:"var(--font-jost)"}}>Daftar</Link>
              </>
            ) : (
              <>
                <span className="nav-desktop" style={{fontSize:"11px", color:"#8A7F72", fontFamily:"var(--font-jost)"}}>{user.name}</span>
                <form action="/api/auth/logout" method="POST" className="nav-desktop">
                  <button type="submit" style={{fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase", color:"#8A7F72", background:"none", border:"none", cursor:"pointer", fontFamily:"var(--font-jost)"}}>Keluar</button>
                </form>
              </>
            )}
            {/* Hamburger — always visible */}
            <button onClick={() => setOpen(true)} style={{background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", gap:"5px", padding:"4px"}}>
              <span style={{display:"block", width:"22px", height:"1.5px", background:"#1C1917"}} />
              <span style={{display:"block", width:"22px", height:"1.5px", background:"#1C1917"}} />
              <span style={{display:"block", width:"14px", height:"1.5px", background:"#1C1917"}} />
            </button>
          </div>
        </div>
      </header>

      {/* FULLSCREEN MENU */}
      {open && (
        <div style={{
          position:"fixed", inset:0, zIndex:100,
          background:"#1C1917",
          display:"flex", flexDirection:"column",
          padding:"0 40px 48px",
          overflowY:"auto",
        }}>
          {/* Top bar */}
          <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", height:"60px", borderBottom:"1px solid rgba(255,255,255,0.06)", flexShrink:0}}>
            <Link href="/" onClick={() => setOpen(false)} style={{
              fontFamily:"var(--font-cormorant)", fontSize:"19px", fontWeight:400,
              letterSpacing:"6px", textTransform:"uppercase", color:"#F0EBE3", textDecoration:"none",
            }}>
              Henima
            </Link>
            <button onClick={() => setOpen(false)} style={{background:"none", border:"none", cursor:"pointer", color:"#F0EBE3", fontSize:"28px", lineHeight:1, fontWeight:200}}>×</button>
          </div>

          {/* Nav links */}
          <nav style={{flex:1, display:"flex", flexDirection:"column", justifyContent:"center", gap:"4px", padding:"32px 0"}}>
            {!user ? (
              <>
                {[
                  ["/shop","Shop"],
                  ["/katalog-digital","Collection"],
                  ["/galeri","Gallery"],
                  ["/blog","Journal"],
                ].map(([href, label]) => (
                  <Link key={href} href={href} onClick={() => setOpen(false)} style={{
                    fontFamily:"var(--font-jost)", fontSize:"clamp(28px,7vw,42px)",
                    fontWeight:300, color:"rgba(240,235,227,0.9)", textDecoration:"none",
                    lineHeight:1.4, letterSpacing:"2px", textTransform:"uppercase",
                    borderBottom:"1px solid rgba(255,255,255,0.06)", paddingBottom:"14px", marginBottom:"4px",
                  }}>
                    {label}
                  </Link>
                ))}
                <div style={{marginTop:"24px", display:"flex", gap:"16px"}}>
                  <Link href="/masuk" onClick={() => setOpen(false)} style={{
                    fontFamily:"var(--font-jost)", fontSize:"13px", fontWeight:300,
                    color:"rgba(200,184,154,0.6)", textDecoration:"none", letterSpacing:"1px",
                  }}>
                    Masuk
                  </Link>
                  <span style={{color:"rgba(200,184,154,0.3)"}}>·</span>
                  <Link href="/daftar" onClick={() => setOpen(false)} style={{
                    fontFamily:"var(--font-jost)", fontSize:"13px", fontWeight:300,
                    color:"rgba(200,184,154,0.6)", textDecoration:"none", letterSpacing:"1px",
                  }}>
                    Daftar
                  </Link>
                </div>
              </>
            ) : (
              <>
                {user.role === "reseller" && [
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
                ))}
                {user.role === "admin" && (
                  <Link href="/admin" onClick={() => setOpen(false)} style={{
                    fontFamily:"var(--font-jost)", fontSize:"clamp(28px,7vw,42px)",
                    fontWeight:300, color:"rgba(240,235,227,0.9)", textDecoration:"none",
                    lineHeight:1.4, letterSpacing:"2px", textTransform:"uppercase",
                  }}>
                    Dashboard
                  </Link>
                )}
                <form action="/api/auth/logout" method="POST" style={{marginTop:"20px"}}>
                  <button type="submit" style={{
                    fontFamily:"var(--font-jost)", fontSize:"13px", fontWeight:300,
                    color:"rgba(200,184,154,0.4)", background:"none", border:"none",
                    cursor:"pointer", letterSpacing:"1px", padding:0,
                  }}>
                    Keluar
                  </button>
                </form>
              </>
            )}
          </nav>

          {/* Bottom — subscribe */}
          <div style={{borderTop:"1px solid rgba(255,255,255,0.06)", paddingTop:"28px", flexShrink:0}}>
            <p style={{fontSize:"16px", fontWeight:400, color:"#F0EBE3", marginBottom:"8px", fontFamily:"var(--font-jost)"}}>
              Get exclusive benefits!
            </p>
            <p style={{fontSize:"13px", color:"rgba(200,184,154,0.5)", fontWeight:300, marginBottom:"20px", fontFamily:"var(--font-jost)", lineHeight:1.6}}>
              Subscribe to our list and get exclusive promos and new product launches!
            </p>
            <div style={{display:"flex"}}>
              <input type="email" placeholder="Email address" style={{
                flex:1, background:"transparent",
                border:"1px solid rgba(255,255,255,0.15)", borderRight:"none",
                padding:"13px 16px", fontSize:"13px", color:"#F0EBE3",
                fontFamily:"var(--font-jost)", outline:"none",
              }} />
              <button style={{
                background:"#F0EBE3", border:"1px solid #F0EBE3",
                color:"#1C1917", padding:"13px 20px", fontSize:"11px",
                letterSpacing:"1px", textTransform:"uppercase",
                fontFamily:"var(--font-jost)", cursor:"pointer", fontWeight:500,
              }}>
                Subscribe
              </button>
            </div>
            <p style={{fontSize:"11px", color:"rgba(200,184,154,0.25)", marginTop:"24px", fontFamily:"var(--font-jost)", textAlign:"center"}}>
              ©️ {new Date().getFullYear()} Henima Signature Scent. All rights reserved.
            </p>
          </div>
        </div>
      )}

      <style>{`
        .nav-desktop { display: flex !important; }
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
        }
      `}</style>
    </>
  );
}
