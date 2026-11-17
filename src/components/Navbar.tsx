"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const FUTURA =
  "var(--font-futura-nav), FuturaBT-Medium, Futura, Century Gothic, sans-serif";

/** Kenzo: NEW / WOMAN / MAN / KENZO UNIVERSE → Henima */
const CATEGORIES = [
  { href: "/shop", label: "New" },
  { href: "/shop", label: "Shop", match: "/shop" },
  { href: "/our-story", label: "Story" },
  { href: "/quiz", label: "Henima Universe" },
];

export default function Navbar({ user }: { user?: any }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  /** Compact Kenzo header only on /shop — homepage keeps original spacing */
  const isShop = pathname.startsWith("/shop");
  /** Auth screens are full-bleed — no double nav/spacer */
  const isAuth =
    pathname.startsWith("/masuk") ||
    pathname.startsWith("/daftar") ||
    pathname.startsWith("/lupa-sandi") ||
    pathname.startsWith("/reset-sandi");

  const [open, setOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  /** 0 = fully transparent (home hero), 1 = solid white — fades with scroll */
  const [scrollFade, setScrollFade] = useState(0);
  const headerRef = useRef<HTMLElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);

  const fade = open ? 1 : isHome ? scrollFade : 1;
  const transparent = fade < 0.55;
  const ink = transparent ? "#FFFFFF" : "#000000";
  const logoLight = isShop ? "/henima-logo-white-tight.png" : "/henima-logo-white.png";
  const logoDark = isShop ? "/henima-logo-tight.png" : "/henima-logo.png";
  const logoWidth = isShop ? 230 : fade < 0.2 ? 188 : 168;
  const logoIntrinsic = isShop
    ? { width: 720, height: 114 }
    : { width: 180, height: 127 };

  useEffect(() => {
    if (isAuth) return;
    const updateCart = () => {
      try {
        const cart = JSON.parse(localStorage.getItem("henima-cart") || "[]");
        setCartCount(cart.reduce((s: number, i: any) => s + i.quantity, 0));
      } catch {}
    };
    updateCart();
    window.addEventListener("cart-updated", updateCart);
    return () => window.removeEventListener("cart-updated", updateCart);
  }, [isAuth]);

  useEffect(() => {
    if (isAuth) return;
    if (!isHome) {
      setScrollFade(1);
      return;
    }
    const FADE_RANGE = 140; /* px — makin besar = makin pelan */
    const onScroll = () => {
      const t = Math.min(1, Math.max(0, window.scrollY / FADE_RANGE));
      setScrollFade(t);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname, isAuth, isHome]);

  useEffect(() => {
    if (isAuth) return;
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, isAuth]);

  /** Keep spacer = exact fixed header height so shop red bar never covers NEW/SHOP/… */
  useEffect(() => {
    if (isHome || isAuth) return;
    const header = headerRef.current;
    const spacer = spacerRef.current;
    if (!header || !spacer) return;
    const sync = () => {
      const h = Math.ceil(header.getBoundingClientRect().height);
      if (h > 0) spacer.style.height = `${h}px`;
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(header);
    window.addEventListener("resize", sync);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", sync);
    };
  }, [isHome, isShop, isAuth, transparent, logoWidth, fade]);

  if (isAuth) return null;

  return (
    <>
      <header
        ref={headerRef}
        data-shop={isShop ? "1" : undefined}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: `rgba(255,255,255,${fade})`,
          backdropFilter: fade > 0.08 ? `blur(${Math.min(12, fade * 14)}px)` : "none",
          WebkitBackdropFilter: fade > 0.08 ? `blur(${Math.min(12, fade * 14)}px)` : "none",
          boxShadow: fade > 0.85 ? "0 1px 0 rgba(0,0,0,0.06)" : "none",
          transition: "box-shadow 0.35s ease, padding-top 0.45s ease",
          paddingTop: isShop ? 8 : fade < 0.35 ? 22 : 8,
        }}
      >
        {/* Row 1 — logo | icons (All products hanya di menu / desktop text) */}
        <div
          className="nav-row1"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            alignItems: "center",
            padding: "0 36px",
            minHeight: isShop ? 44 : 48,
          }}
        >
          <div className="nav-left" style={{ justifySelf: "start", display: "flex", alignItems: "center" }}>
            {/* Desktop only — grid + All products (HP: pakai menu Kenzo) */}
            <Link
              href="/shop"
              className="nav-desktop nav-all-products"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                textDecoration: "none",
                color: ink,
                fontSize: 13,
                fontFamily: FUTURA,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                lineHeight: 1,
                transition: "color 0.45s ease",
              }}
            >
              <span
                aria-hidden
                style={{
                  width: 18,
                  height: 18,
                  display: "grid",
                  gridTemplateColumns: "repeat(3,1fr)",
                  gap: 2.5,
                  flexShrink: 0,
                }}
              >
                {Array.from({ length: 9 }).map((_, i) => (
                  <span
                    key={i}
                    style={{
                      background: ink,
                      display: "block",
                      width: "100%",
                      height: "100%",
                      transition: "background 0.45s ease",
                    }}
                  />
                ))}
              </span>
              All products
            </Link>
          </div>

          <Link
            href="/"
            aria-label="Henima home"
            className="nav-logo-link"
            style={{
              justifySelf: "center",
              display: "flex",
              alignItems: "center",
              lineHeight: 0,
              position: "relative",
              width: logoWidth,
            }}
          >
            {/* Crossfade white → dark logo saat scroll */}
            <Image
              src={logoLight}
              alt=""
              width={logoIntrinsic.width}
              height={logoIntrinsic.height}
              priority
              className="nav-logo"
              aria-hidden
              style={{
                width: logoWidth,
                height: "auto",
                display: "block",
                opacity: transparent ? 1 : 0,
                transition: "opacity 0.45s ease",
              }}
            />
            <Image
              src={logoDark}
              alt="Henima"
              width={logoIntrinsic.width}
              height={logoIntrinsic.height}
              priority
              className="nav-logo"
              style={{
                width: logoWidth,
                height: "auto",
                display: "block",
                position: "absolute",
                left: 0,
                top: "50%",
                transform: "translateY(-50%)",
                opacity: transparent ? 0 : 1,
                transition: "opacity 0.45s ease",
              }}
            />
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: 18, justifySelf: "end" }}>
            {/* Account — existing Henima auth: /masuk · /profil · /admin */}
            {user?.role === "admin" ? (
              <Link href="/admin" aria-label="Admin" className="nav-desktop" style={{ color: ink, display: "flex", transition: "color 0.45s ease" }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </Link>
            ) : (
              <Link
                href={user ? "/profil" : "/masuk"}
                aria-label={user ? "Profil" : "Masuk"}
                style={{ color: ink, display: "flex", transition: "color 0.45s ease" }}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="8" r="3.25" />
                  <path d="M5.5 19.5c.8-3.2 3.2-5 6.5-5s5.7 1.8 6.5 5" />
                </svg>
              </Link>
            )}

            <Link href="/tracking" aria-label="Track Order" className="nav-desktop" style={{ color: ink, display: "flex", transition: "color 0.45s ease" }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </Link>

            <Link href="/cart" aria-label="Cart" style={{ position: "relative", color: ink, display: "flex", transition: "color 0.45s ease" }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {cartCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: -5,
                    right: -6,
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    background: ink,
                    color: transparent ? "#000" : "#fff",
                    fontSize: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                  }}
                >
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setOpen(true)}
              aria-label="Menu"
              className="nav-mobile-only"
              style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "none", flexDirection: "column", gap: 4 }}
            >
              <span style={{ width: 18, height: 1.5, background: ink, display: "block", transition: "background 0.45s ease" }} />
              <span style={{ width: 18, height: 1.5, background: ink, display: "block", transition: "background 0.45s ease" }} />
            </button>
          </div>
        </div>

        {/* Row 2 — NEW / SHOP / STORY / UNIVERSE */}
        <nav
          className="nav-cats"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: isShop ? 28 : 22,
            marginTop: isShop ? 16 : transparent ? 18 : 12,
            /* Extra bottom pad so red filter bar never clips menu text */
            paddingBottom: isShop ? 18 : transparent ? 20 : 14,
          }}
        >
          {CATEGORIES.map((c) => {
            const active = c.match ? pathname.startsWith(c.match) : pathname === c.href;
            return (
              <Link
                key={c.label}
                href={c.href}
                style={{
                  /* Kenzo header nav: FuturaBT-Medium 14.4 / 400 / ls 1px */
                  fontSize: 14.4,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  color: ink,
                  textDecoration: "none",
                  fontFamily: FUTURA,
                  fontWeight: 400,
                  lineHeight: "21.6px",
                  transition: "color 0.45s ease",
                }}
              >
                {c.label === "Henima Universe" ? "Universe" : c.label}
              </Link>
            );
          })}
        </nav>
      </header>

      {/* Spacer synced to fixed header height (see ResizeObserver above) */}
      {!isHome && <div ref={spacerRef} style={{ height: isShop ? 108 : 144 }} aria-hidden />}

      {/* Kenzo-style full-screen mobile menu */}
      {open && (
        <div className="kz-menu" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="kz-menu-top">
            <button type="button" className="kz-menu-close" onClick={() => setOpen(false)} aria-label="Tutup menu">
              ×
            </button>
            <Link href="/" onClick={() => setOpen(false)} className="kz-menu-logo" aria-label="Henima home">
              <Image
                src="/henima-logo-tight.png"
                alt="Henima"
                width={200}
                height={32}
                style={{ width: 140, height: "auto" }}
              />
            </Link>
            <span className="kz-menu-top-spacer" aria-hidden />
          </div>

          <nav className="kz-menu-nav">
            {CATEGORIES.map((c) => (
              <Link key={c.label} href={c.href} onClick={() => setOpen(false)} className="kz-menu-link">
                {c.label}
              </Link>
            ))}
          </nav>

          <div className="kz-menu-secondary">
            {!user ? (
              <>
                <Link href="/masuk" onClick={() => setOpen(false)}>Masuk</Link>
                <Link href="/daftar" onClick={() => setOpen(false)}>Daftar</Link>
              </>
            ) : user.role === "admin" ? (
              <Link href="/admin" onClick={() => setOpen(false)}>Admin</Link>
            ) : (
              <Link href="/profil" onClick={() => setOpen(false)}>Profil</Link>
            )}
            {user?.role === "reseller" && (
              <Link href="/grosir" onClick={() => setOpen(false)}>Grosir</Link>
            )}
            <Link href="/tracking" onClick={() => setOpen(false)}>Track Order</Link>
            <Link href="/cart" onClick={() => setOpen(false)}>
              Cart{cartCount > 0 ? ` (${cartCount})` : ""}
            </Link>
          </div>

          <div className="kz-menu-bottom">
            <Link href="/shop" onClick={() => setOpen(false)} className="kz-menu-all">
              <span className="kz-menu-all-left">
                <span className="kz-menu-grid" aria-hidden>
                  {Array.from({ length: 9 }).map((_, i) => (
                    <span key={i} />
                  ))}
                </span>
                All products
              </span>
              <span aria-hidden>›</span>
            </Link>
          </div>
        </div>
      )}

      <style>{`
        .nav-mobile-only { display: none !important; }

        .kz-menu {
          position: fixed;
          inset: 0;
          z-index: 100;
          display: flex;
          flex-direction: column;
          background: #1a1a1a;
          font-family: ${FUTURA};
          color: #fff;
        }
        .kz-menu-top {
          flex-shrink: 0;
          height: 56px;
          display: grid;
          grid-template-columns: 48px 1fr 48px;
          align-items: center;
          background: #fff;
          padding: 0 12px;
        }
        .kz-menu-close {
          justify-self: start;
          background: none;
          border: none;
          font-size: 28px;
          line-height: 1;
          color: #868e96;
          cursor: pointer;
          padding: 4px 8px;
          font-family: inherit;
        }
        .kz-menu-logo {
          justify-self: center;
          display: flex;
          align-items: center;
          line-height: 0;
        }
        .kz-menu-top-spacer { justify-self: end; }

        .kz-menu-nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 24px 20px;
          overflow-y: auto;
        }
        .kz-menu-link {
          display: block;
          color: #fff;
          text-decoration: none;
          text-transform: uppercase;
          font-size: clamp(22px, 6.5vw, 32px);
          font-weight: 400;
          letter-spacing: 0.14em;
          line-height: 1.35;
          text-align: center;
          padding: 10px 12px;
        }

        .kz-menu-secondary {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 8px 20px;
          padding: 0 20px 20px;
        }
        .kz-menu-secondary a {
          color: rgba(255,255,255,0.55);
          text-decoration: none;
          text-transform: uppercase;
          font-size: 11px;
          letter-spacing: 0.14em;
          font-weight: 400;
        }

        .kz-menu-bottom {
          flex-shrink: 0;
          background: #111;
          border-top: 1px solid rgba(255,255,255,0.08);
        }
        .kz-menu-all {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 22px;
          color: #fff;
          text-decoration: none;
          text-transform: uppercase;
          font-size: 13px;
          letter-spacing: 0.1em;
          font-weight: 400;
        }
        .kz-menu-all-left {
          display: inline-flex;
          align-items: center;
          gap: 12px;
        }
        .kz-menu-grid {
          width: 16px;
          height: 16px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2px;
        }
        .kz-menu-grid span {
          background: #fff;
          display: block;
          width: 100%;
          height: 100%;
        }

        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-only { display: flex !important; }
          .nav-row1 {
            padding: 6px 16px 0 !important;
            grid-template-columns: 1fr auto 1fr !important;
          }
          .nav-cats {
            padding-bottom: 14px !important;
          }
          .nav-all-products { display: none !important; }
          /* Lebar kiri = ikon kanan (~akun+cart+menu) biar logo benar di tengah */
          .nav-left { min-width: 100px; width: 100px; }
          .nav-logo-link {
            justify-self: center !important;
            transform: translateX(6px); /* sedikit ke kanan */
          }
          .nav-row1 > div:last-child {
            justify-self: end !important;
            min-width: 100px;
          }
          .nav-cats { gap: 14px !important; }
          header[data-shop="1"] .nav-cats { margin-top: 14px !important; }
          header[data-shop="1"] .nav-logo { width: 188px !important; }
          header:not([data-shop="1"]) .nav-logo { width: 138px !important; }
        }
      `}</style>
    </>
  );
}
