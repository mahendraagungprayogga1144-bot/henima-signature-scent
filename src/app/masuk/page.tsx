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
          <p className="auth-eyebrow">Masuk</p>
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">
            Masuk ke akun The Intimate dan lanjutkan perjalanan wewangianmu.
          </p>

          {error && (
            <div className="auth-error">{decodeURIComponent(error)}</div>
          )}

          <AuthFormClient mode="login" />

          <p className="auth-footer-link">
            Belum punya akun?{" "}
            <Link href="/daftar">Daftar sekarang</Link>
          </p>
        </div>
      </div>

      <style>{AUTH_STYLES}</style>
    </div>
  );
}
