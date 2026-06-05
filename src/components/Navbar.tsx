import Link from "next/link";
import { getCurrentUserSafe } from "@/lib/session";

export default async function Navbar() {
  const user = await getCurrentUserSafe();

  return (
    <header className="sticky top-0 z-40 border-b border-ink-800 bg-ink-950/70 backdrop-blur">
      <div className="container-page flex items-center justify-between py-4">
        <Link href="/" className="text-base font-semibold tracking-wide text-ink-50 sm:text-lg">
          <span className="text-gold-400">Henima</span>{" "}
          <span className="text-ink-100">Signature</span>{" "}
          <span className="text-ink-200">Scent</span>
        </Link>
        <nav className="flex items-center gap-3 text-sm font-medium">
          {user ? (
            <>
              {user.role === "reseller" && (
                <>
                  <Link href="/katalog" className="rounded-lg px-2 py-1 text-ink-200 hover:bg-ink-900/60 hover:text-ink-50">Katalog</Link>
                  <Link href="/pesanan" className="rounded-lg px-2 py-1 text-ink-200 hover:bg-ink-900/60 hover:text-ink-50">Pesanan Saya</Link>
                  <Link href="/profil" className="rounded-lg px-2 py-1 text-ink-200 hover:bg-ink-900/60 hover:text-ink-50">Profil</Link>
                  <Link href="/leaderboard" className="rounded-lg px-2 py-1 text-ink-200 hover:bg-ink-900/60 hover:text-ink-50">Leaderboard</Link>
                </>
              )}
              {user.role === "admin" && (
                <Link href="/admin" className="rounded-lg px-2 py-1 text-ink-200 hover:bg-ink-900/60 hover:text-ink-50">Dashboard Admin</Link>
              )}
              <span className="hidden text-ink-400 sm:inline">{user.name}</span>
              <form action="/api/auth/logout" method="POST">
                <button type="submit" className="rounded-lg px-2 py-1 text-ink-200 hover:bg-ink-900/60 hover:text-red-300">Keluar</button>
              </form>
            </>
          ) : (
            <>
              <Link href="/katalog-digital" className="rounded-lg px-2 py-1 text-ink-200 hover:bg-ink-900/60 hover:text-ink-50">Katalog</Link>
              <Link href="/galeri" className="rounded-lg px-2 py-1 text-ink-200 hover:bg-ink-900/60 hover:text-ink-50">Galeri</Link>
              <Link href="/blog" className="rounded-lg px-2 py-1 text-ink-200 hover:bg-ink-900/60 hover:text-ink-50">Blog</Link>
              <Link href="/masuk" className="rounded-lg px-2 py-1 text-ink-200 hover:bg-ink-900/60 hover:text-ink-50">Masuk</Link>
              <Link href="/daftar" className="btn-primary !py-2 !px-3">Daftar</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
