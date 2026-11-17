import Link from "next/link";
import Image from "next/image";
import { getDatabase } from "@/lib/db";
import AuthFormClient from "@/components/AuthFormClient";
import { AUTH_STYLES } from "@/lib/auth-styles";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const db = await getDatabase();
  const company = db.settings.company;
  const products = db.products.filter((p) => p.active);
  /** Jangan pakai SVG produk sebagai hero auth — bentrok dengan teks brand */
  const productPhoto = products
    .map((p) => p.photo)
    .find((src) => src && !src.endsWith(".svg") && !src.includes("/products/"));
  const sideImage =
    company.heroImage ||
    (company as { heroImages?: string[] }).heroImages?.[0] ||
    productPhoto ||
    "/layout/chapter-afternoon.jpg";

  return (
    <div className="auth-page">
      <div className="auth-visual">
        <Image
          src={sideImage}
          alt=""
          fill
          className="object-cover object-center"
          priority
          sizes="50vw"
        />
        <div className="auth-visual-overlay" />
        <div className="auth-visual-copy">
          <p className="auth-eyebrow" style={{ color: "rgba(255,255,255,0.7)" }}>
            Henima Signature Scent
          </p>
          <h2 className="auth-visual-title">
            Worn.
            <br />
            Not Forgotten.
          </h2>
        </div>
      </div>

      <div className="auth-panel">
        <div className="auth-panel-inner">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/henima-logo-tight.png" alt="Henima" className="auth-logo" />
          <p className="auth-eyebrow">Masuk</p>
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">
            Masuk ke akun Henima dan lanjutkan perjalanan wewangianmu.
          </p>

          {error && <div className="auth-error">{decodeURIComponent(error)}</div>}

          <AuthFormClient mode="login" />

          <p className="auth-footer-link">
            Belum punya akun? <Link href="/daftar">Daftar sekarang</Link>
          </p>
          <Link href="/" className="auth-home">
            ← Kembali ke beranda
          </Link>
        </div>
      </div>

      <style>{AUTH_STYLES}</style>
    </div>
  );
}
