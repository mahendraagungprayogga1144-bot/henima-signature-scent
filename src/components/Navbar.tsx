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
    <header className="sticky top-0 z-40 border-b border-ink-200 bg-white/90 backdrop-blur">
      <div className="container-page flex items-center justify-between py-4">
        <Link href="/" className="text-base font-semibold tracking-wide text-ink-50 sm:text-lg">
          <span className="text-ink-900 font-semibold">Henima</span>{" "}
          <span className="text-ink-600">Signature</span>{" "}
          <span className="text-ink-400">Scent</span>
        </Link>

        {user ? (
          <>
            {/* Logged in - desktop */}
            <nav className="hidden md:flex items-center gap-2 text-sm font-medium">
              {user.role === "reseller" && (
                <>
                  <Link href="/katalog" className="rounded-lg px-3 py-2 text-ink-600 hover:bg-ink-100 hover:text-ink-900">Katalog</Link>
                  <Link href="/pesanan" className="rounded-lg px-3 py-2 text-ink-600 hover:bg-ink-100 hover:text-ink-900">Pesanan</Link>
                  <Link href="/profil" className="rounded-lg px-3 py-2 text-ink-600 hover:bg-ink-100 hover:text-ink-900">Profil</Link>
                  <Link href="/leaderboard" className="rounded-lg px-3 py-2 text-ink-600 hover:bg-ink-100 hover:text-ink-900">Leaderboard</Link>
                </>
              )}
              {user.role === "admin" && (
                <Link href="/admin" className="rounded-lg px-3 py-2 text-ink-600 hover:bg-ink-100 hover:text-ink-900">Dashboard Admin</Link>
              )}
              <span className="px-2 text-ink-400 text-sm">{user.name}</span>
              <form action="/api/auth/logout" method="POST">
                <button type="submit" className="rounded-lg px-3 py-2 text-ink-600 hover:bg-ink-100 hover:text-red-600">Keluar</button>
              </form>
            </nav>
            {/* Logged in - mobile hamburger */}
            <button
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg border border-ink-300 bg-white text-ink-600"
              onClick={() => setOpen(!open)}
            >
              {open ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </>
        ) : (
          <>
            {/* Not logged in - hamburger for Katalog/Galeri/Blog + Masuk/Daftar always visible */}
            <nav className="flex items-center gap-2 text-sm font-medium">
              {/* Katalog Galeri Blog - hidden on mobile, show on desktop */}
              <div className="hidden md:flex items-center gap-1">
                <Link href="/shop" className="rounded-lg px-3 py-2 text-ink-600 hover:bg-ink-100 hover:text-ink-900">Shop</Link>
                <Link href="/katalog-digital" className="rounded-lg px-3 py-2 text-ink-600 hover:bg-ink-100 hover:text-ink-900">Katalog</Link>
                <Link href="/galeri" className="rounded-lg px-3 py-2 text-ink-600 hover:bg-ink-100 hover:text-ink-900">Galeri</Link>
                <Link href="/blog" className="rounded-lg px-3 py-2 text-ink-600 hover:bg-ink-100 hover:text-ink-900">Blog</Link>
              </div>
              {/* Hamburger for mobile - only Katalog/Galeri/Blog */}
              <button
                className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg border border-ink-300 bg-white text-ink-600"
                onClick={() => setOpen(!open)}
              >
                {open ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
              {/* Masuk & Daftar - always visible */}
              <Link href="/masuk" className="rounded-lg px-3 py-2 text-ink-600 hover:bg-ink-100 hover:text-ink-900">Masuk</Link>
              <Link href="/daftar" className="btn-primary !py-2 !px-3 text-xs sm:text-sm">Daftar</Link>
            </nav>
          </>
        )}
      </div>

      {/* Mobile dropdown menu */}
      {open && (
        <div className="md:hidden border-t border-ink-200 bg-white px-4 py-3">
          <nav className="flex flex-col gap-1 text-sm font-medium">
            {user ? (
              <>
                {user.role === "reseller" && (
                  <>
                    <Link href="/katalog" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-ink-700 hover:bg-ink-100">Katalog</Link>
                    <Link href="/pesanan" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-ink-700 hover:bg-ink-100">Pesanan</Link>
                    <Link href="/profil" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-ink-700 hover:bg-ink-100">Profil</Link>
                    <Link href="/leaderboard" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-ink-700 hover:bg-ink-100">Leaderboard</Link>
                  </>
                )}
                {user.role === "admin" && (
                  <Link href="/admin" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-ink-700 hover:bg-ink-100">Dashboard Admin</Link>
                )}
                <div className="border-t border-ink-800 mt-2 pt-2">
                  <span className="px-3 py-2 text-ink-400 text-xs block">{user.name}</span>
                  <form action="/api/auth/logout" method="POST">
                    <button type="submit" className="w-full text-left rounded-lg px-3 py-2.5 text-red-300 hover:bg-ink-900/60">Keluar</button>
                  </form>
                </div>
              </>
            ) : (
              <>
                <Link href="/katalog-digital" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-ink-700 hover:bg-ink-100">Katalog</Link>
                <Link href="/galeri" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-ink-700 hover:bg-ink-100">Galeri</Link>
                <Link href="/blog" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-ink-700 hover:bg-ink-100">Blog</Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
