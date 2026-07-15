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
  const sideImage =
    company.heroImage ||
    (company as { heroImages?: string[] }).heroImages?.[0] ||
    products[0]?.photo ||
    null;

  return (
    <div className="auth-page">
      <div className="auth-visual">
        {sideImage ? (
          <Image
            src={sideImage}
            alt="Henima"
            fill
            className="object-cover object-center"
            priority
            sizes="50vw"
          />
        ) : (
          <div className="auth-visual-fallback">
            <p>Henima</p>
          </div>
        )}
        <div className="auth-visual-overlay" />
        <div className="auth-visual-copy">
          <p className="auth-eyebrow" style={{ color: "rgba(200,184,154,0.85)" }}>
            The Intimate
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
          <p className="auth-eyebrow">Daftar</p>
          <h1 className="auth-title">Create account</h1>
          <p className="auth-subtitle">
            Daftar dan nikmati akses eksklusif, diskon member, dan early access
            koleksi baru bersama The Intimate.
          </p>

          <ul className="auth-benefits">
            <li>Poin dari setiap belanja yang sudah sampai</li>
            <li>Naik level Signature → Intimate → Soulscent → Beloved</li>
            <li>Diskon member hingga 10% + gratis ongkir di tier tertinggi</li>
          </ul>

          {error && (
            <div className="auth-error">{decodeURIComponent(error)}</div>
          )}

          <AuthFormClient mode="register" defaultReferral={ref || ""} />

          <p className="auth-footer-link">
            Sudah punya akun?{" "}
            <Link href="/masuk">Masuk di sini</Link>
          </p>
        </div>
      </div>

      <style>{AUTH_STYLES}</style>
      <style>{`
        .auth-benefits {
          list-style: none;
          padding: 0;
          margin: 0 0 32px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .auth-benefits li {
          font-size: 13px;
          color: #6B5E52;
          line-height: 1.5;
          padding-left: 18px;
          position: relative;
        }
        .auth-benefits li::before {
          content: "";
          position: absolute;
          left: 0;
          top: 7px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #B5935A;
        }
        .auth-panel { align-items: flex-start; padding-top: 64px; padding-bottom: 64px; }
        @media (max-width: 900px) {
          .auth-panel { padding-top: 40px; }
        }
      `}</style>
    </div>
  );
}
