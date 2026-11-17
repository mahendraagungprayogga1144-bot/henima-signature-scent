import Link from "next/link";
import Image from "next/image";
import { getDatabase } from "@/lib/db";
import AuthFormClient from "@/components/AuthFormClient";
import { AUTH_STYLES } from "@/lib/auth-styles";

export const dynamic = "force-dynamic";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; ref?: string }>;
}) {
  const { error, ref } = await searchParams;
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
    "/layout/chapter-distance.jpg";

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
            Join the
            <br />
            circle.
          </h2>
        </div>
      </div>

      <div className="auth-panel">
        <div className="auth-panel-inner">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/henima-logo-tight.png" alt="Henima" className="auth-logo" />
          <p className="auth-eyebrow">Daftar</p>
          <h1 className="auth-title">Create account</h1>
          <p className="auth-subtitle">
            Daftar dan nikmati akses member, poin, serta early access koleksi baru
            Henima.
          </p>

          <ul className="auth-benefits">
            <li>Poin dari setiap belanja yang sudah sampai</li>
            <li>Naik level Signature → Intimate → Soulscent → Beloved</li>
            <li>Diskon member hingga 10% + gratis ongkir di tier tertinggi</li>
          </ul>

          {error && <div className="auth-error">{decodeURIComponent(error)}</div>}

          <AuthFormClient mode="register" defaultReferral={ref || ""} />

          <p className="auth-footer-link">
            Sudah punya akun? <Link href="/masuk">Masuk di sini</Link>
          </p>
          <Link href="/" className="auth-home">
            ← Kembali ke beranda
          </Link>
        </div>
      </div>

      <style>{AUTH_STYLES}</style>
      <style>{`
        .auth-benefits {
          list-style: none;
          padding: 0;
          margin: 0 0 28px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .auth-benefits li {
          font-size: 13px;
          color: #495057;
          line-height: 1.5;
          padding-left: 16px;
          position: relative;
        }
        .auth-benefits li::before {
          content: "";
          position: absolute;
          left: 0;
          top: 8px;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #A30116;
        }
        .auth-panel { align-items: flex-start; padding-top: 56px; padding-bottom: 64px; }
        @media (max-width: 900px) {
          .auth-panel { padding-top: 36px; }
        }
      `}</style>
    </div>
  );
}
