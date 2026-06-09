import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function EditProfilPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/masuk");
  if (user.role === "admin") redirect("/admin");

  const { error, success } = await searchParams;

  return (
    <div style={{ minHeight: "100vh", background: "#F9F6F1", fontFamily: "var(--font-jost, sans-serif)", padding: "64px 24px" }}>
      <div style={{ maxWidth: "560px", margin: "0 auto" }}>
        <Link href="/profil" style={{ fontSize: "11px", color: "#9E8E7E", textDecoration: "none", letterSpacing: "1px", textTransform: "uppercase" }}>
          ← Kembali ke Profil
        </Link>
        <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#1C1917", margin: "20px 0 8px" }}>Ubah Profile</h1>
        <p style={{ fontSize: "13px", color: "#9E8E7E", marginBottom: "40px" }}>Update informasi akun kamu</p>

        {success && (
          <div style={{ background: "#f0fdf4", border: "1px solid #86efac", padding: "12px 16px", fontSize: "13px", color: "#166534", marginBottom: "24px" }}>
            Profil berhasil diupdate!
          </div>
        )}
        {error && (
          <div style={{ background: "#fff5f5", border: "1px solid #ffc5c5", padding: "12px 16px", fontSize: "13px", color: "#cc0000", marginBottom: "24px" }}>
            {decodeURIComponent(error)}
          </div>
        )}

        <div style={{ background: "#fff", border: "1px solid #E8E0D5", padding: "40px" }}>
          <form action="/api/auth/update-profil" method="POST">
            <div style={{ marginBottom: "28px" }}>
              <label style={{ fontSize: "11px", letterSpacing: "1.5px", textTransform: "uppercase", color: "#9E8E7E", display: "block", marginBottom: "8px" }}>Nama Lengkap</label>
              <input name="name" type="text" defaultValue={user.name} required style={{ width: "100%", border: "none", borderBottom: "1px solid #D5CFC8", padding: "10px 0", fontSize: "14px", color: "#1C1917", outline: "none", background: "transparent", boxSizing: "border-box" }} />
            </div>
            <div style={{ marginBottom: "28px" }}>
              <label style={{ fontSize: "11px", letterSpacing: "1.5px", textTransform: "uppercase", color: "#9E8E7E", display: "block", marginBottom: "8px" }}>WhatsApp</label>
              <input name="phone" type="text" defaultValue={user.phone} style={{ width: "100%", border: "none", borderBottom: "1px solid #D5CFC8", padding: "10px 0", fontSize: "14px", color: "#1C1917", outline: "none", background: "transparent", boxSizing: "border-box" }} />
            </div>
            <div style={{ marginBottom: "28px" }}>
              <label style={{ fontSize: "11px", letterSpacing: "1.5px", textTransform: "uppercase", color: "#9E8E7E", display: "block", marginBottom: "8px" }}>Email</label>
              <input name="email" type="email" defaultValue={user.email} required style={{ width: "100%", border: "none", borderBottom: "1px solid #D5CFC8", padding: "10px 0", fontSize: "14px", color: "#1C1917", outline: "none", background: "transparent", boxSizing: "border-box" }} />
            </div>
            <div style={{ marginBottom: "36px" }}>
              <label style={{ fontSize: "11px", letterSpacing: "1.5px", textTransform: "uppercase", color: "#9E8E7E", display: "block", marginBottom: "8px" }}>Password Baru (kosongkan jika tidak ingin ganti)</label>
              <input name="password" type="password" minLength={6} placeholder="Min. 6 karakter" style={{ width: "100%", border: "none", borderBottom: "1px solid #D5CFC8", padding: "10px 0", fontSize: "14px", color: "#1C1917", outline: "none", background: "transparent", boxSizing: "border-box" }} />
            </div>
            <button type="submit" style={{ width: "100%", background: "#1C1917", color: "#fff", border: "none", padding: "15px", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer", fontWeight: 500 }}>
              Simpan Perubahan
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
