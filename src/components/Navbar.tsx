import Link from "next/link";
import { getCurrentUserSafe } from "@/lib/session";

export default async function Navbar() {
  const user = await getCurrentUserSafe();

  return (
    <header className="sticky top-0 z-40 border-b border-ink-200 bg-white/80 backdrop-blur">
      <div className="container-page flex items-center justify-between py-4">
        <Link href="/" className="text-base font-semibold tracking-wide sm:text-lg">
          <span className="text-gold-600">Henima</span>{" "}
          <span className="text-ink-700">Signature</span>{" "}
          <span className="text-ink-500">Scent</span>
        </Link>
        <nav className="flex items-center gap-3 text-sm font-medium">
          {user ? (
            <>
              {user.role === "reseller" && (
                <>
                  <Link href="/katalog" className="rounded-lg px-2 py-1 text-ink-600 hover:bg-ink-100 hover:text-ink-900">Katalog</Link>
                  <Link href="/pesanan" className="rounded-lg px-2 py-1 text-ink-600 hover:bg-ink-100 hover:text-ink-900">Pesanan Saya</Link>
                  <Link href="/profil" className="rounded-lg px-2 py-1 text-ink-600 hover:bg-ink-100 hover:text-ink-900">Profil</Link>
                  <Link href="/leaderboard" className="rounded-lg px-2 py-1 text-ink-600 hover:bg-ink-100 hover:text-ink-900">Leaderboard</Link>
                </>
              )}
              {user.role === "admin" && (
                <Link href="/admin" className="rounded-lg px-2 py-1 text-ink-600 hover:bg-ink-100 hover:text-ink-900">Dashboard Admin</Link>
              )}
              <span className="hidden text-ink-400 sm:inline">{user.name}</span>
              <form action="/api/auth/logout" method="POST">
                <button type="submit" className="rounded-lg px-2 py-1 text-ink-600 hover:bg-ink-100 hover:text-red-600">Keluar</button>
              </form>
            </>
          ) : (
            <>
              <Link href="/katalog-digital" className="rounded-lg px-2 py-1 text-ink-600 hover:bg-ink-100 hover:text-ink-900">Katalog</Link>
              <Link href="/galeri" className="rounded-lg px-2 py-1 text-ink-600 hover:bg-ink-100 hover:text-ink-900">Galeri</Link>
              <Link href="/blog" className="rounded-lg px-2 py-1 text-ink-600 hover:bg-ink-100 hover:text-ink-900">Blog</Link>
              <Link href="/masuk" className="rounded-lg px-2 py-1 text-ink-600 hover:bg-ink-100 hover:text-ink-900">Masuk</Link>
              <Link href="/daftar" className="btn-primary !py-2 !px-3">Daftar</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
