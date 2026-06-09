import Link from "next/link";
import { redirect } from "next/navigation";
import { getDatabase } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

const TIERS = [
  { key: "signature", label: "SIGNATURE", min: 0, max: 499999, desc: "Pembelian kurang dari Rp 500.000", color: "#8B7355", benefits: ["Akses konten eksklusif Henima"] },
  { key: "intimate", label: "INTIMATE", min: 500000, max: 1499999, desc: "Pembelian Rp 500.000 - Rp 1.499.999", color: "#C9A96E", benefits: ["Voucher Rp 50K untuk pembelian berikutnya", "Early access info produk baru"] },
  { key: "soulscent", label: "SOULSCENT", min: 1500000, max: 2999999, desc: "Pembelian Rp 1.500.000 - Rp 2.999.999", color: "#B8860B", benefits: ["Semua keuntungan Intimate", "Voucher Rp 100K", "WhatsApp Insider", "Early adopter akses produk terbaru", "Aksesoris spesial Henima"] },
  { key: "beloved", label: "BELOVED", min: 3000000, max: Infinity, desc: "Pembelian lebih dari Rp 3.000.000", color: "#DAA520", benefits: ["Semua keuntungan Soulscent", "Henima Gold Member Card", "Pandora Box hadiah kejutan eksklusif", "Exclusive panel dan sample produk baru", "Henima Exclusive Merch"] },
];

function getTier(total: number) {
  return TIERS.find((t) => total >= t.min && total <= t.max) ?? TIERS[0];
}

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/masuk");
  if (user.role === "admin") redirect("/admin");

  const db = await getDatabase();
  const orders = db.orders.filter((o: any) => o.resellerId === user.id || o.userId === user.id);
  const delivered = orders.filter((o: any) => o.status === "delivered");
  const totalSpend = delivered.reduce((s: number, o: any) => s + o.total, 0);
  const currentTier = getTier(totalSpend);
  const nextTier = TIERS[TIERS.indexOf(currentTier) + 1];
  const progressPct = nextTier ? Math.min(100, Math.round(((totalSpend - currentTier.min) / (nextTier.min - currentTier.min)) * 100)) : 100;
  const firstName = user.name.split(" ")[0];

  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: "var(--font-jost, sans-serif)" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "64px 24px 48px", display: "flex", alignItems: "center", gap: "40px", flexWrap: "wrap" }}>
        <div style={{ width: "100px", height: "100px", borderRadius: "50%", background: "#e8e4df", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "2px solid #d5cfc8" }}>
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </div>
        <div>
          <h1 style={{ fontSize: "clamp(22px,3vw,32px)", fontWeight: 400, color: "#1a1a1a", marginBottom: "10px" }}>Holla, selamat datang <strong>{firstName}</strong></h1>
          <p style={{ fontSize: "14px", color: "#666", lineHeight: 1.8, maxWidth: "560px" }}>Selamat datang di <strong>Henima Circle</strong> — komunitas penikmat aroma terbaik Indonesia.</p>
          <div style={{ marginTop: "16px", display: "inline-flex", alignItems: "center", gap: "8px", background: "#f8f5f0", padding: "8px 16px", border: "1px solid " + currentTier.color }}>
            <span style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: currentTier.color, fontWeight: 600 }}>{currentTier.label}</span>
          </div>
        </div>
      </div>

      {nextTier && (
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 24px 48px" }}>
          <div style={{ background: "#f5f0ea", padding: "24px 28px", border: "1px solid #e8e0d4" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
              <span style={{ fontSize: "11px", color: "#888", letterSpacing: "1px", textTransform: "uppercase" }}>Progress ke {nextTier.label}</span>
              <span style={{ fontSize: "11px", color: currentTier.color, fontWeight: 600 }}>{progressPct}%</span>
            </div>
            <div style={{ height: "3px", background: "#e0d8ce", borderRadius: "2px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: progressPct + "%", background: currentTier.color, borderRadius: "2px" }} />
            </div>
            <p style={{ fontSize: "12px", color: "#aaa", marginTop: "10px" }}>Butuh Rp {Math.max(0, nextTier.min - totalSpend).toLocaleString("id-ID")} lagi untuk naik ke {nextTier.label}</p>
          </div>
        </div>
      )}

      <div style={{ background: "#faf8f5", padding: "64px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <h2 style={{ fontSize: "clamp(24px,4vw,36px)", fontWeight: 700, color: "#1a1a1a", marginBottom: "8px" }}>Keuntungan Tiap Level</h2>
          <p style={{ fontSize: "13px", color: "#888", fontStyle: "italic", marginBottom: "16px" }}>"Every scent tells a story, and we are here to celebrate yours."</p>
        </div>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexWrap: "wrap", marginBottom: "56px" }}>
          {TIERS.map((tier, i) => (
            <div key={tier.key} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ textAlign: "center", padding: "0 20px" }}>
                <div style={{ width: "64px", height: "64px", borderRadius: "50%", margin: "0 auto 12px", background: currentTier.key === tier.key ? tier.color : "#e8e4df", border: "2px solid " + (currentTier.key === tier.key ? tier.color : "#d5cfc8"), display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={currentTier.key === tier.key ? "#fff" : "#aaa"} strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                <p style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: currentTier.key === tier.key ? tier.color : "#aaa", fontWeight: 600 }}>{tier.label}</p>
              </div>
              {i < TIERS.length - 1 && <div style={{ width: "32px", height: "1px", background: "#d5cfc8", flexShrink: 0 }} />}
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", maxWidth: "960px", margin: "0 auto" }}>
          {TIERS.slice(1).map((tier) => (
            <div key={tier.key} style={{ border: "1px solid " + (currentTier.key === tier.key ? tier.color : "#e0d8d0"), padding: "28px 24px", background: "#fff" }}>
              <h3 style={{ fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", color: tier.color, fontWeight: 700, marginBottom: "20px" }}>{tier.label}</h3>
              {tier.benefits.map((b, i) => (
                <div key={i}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "12px 0" }}>
                    <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: tier.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <svg width="9" height="9" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <p style={{ fontSize: "13px", color: "#444", lineHeight: 1.5 }}>{b}</p>
                  </div>
                  {i < tier.benefits.length - 1 && <div style={{ height: "1px", background: "#f0ece6" }} />}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: "700px", margin: "0 auto", padding: "64px 24px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#1a1a1a", marginBottom: "32px" }}>Pertanyaan yang sering diajukan</h2>
        {[
          { q: "Bagaimana cara naik level?", a: "Lakukan pembelian produk Henima. Total pembelian kamu akan terakumulasi otomatis." },
          { q: "Apakah level bisa hangus?", a: "Selama kamu aktif berbelanja minimal sekali dalam 12 bulan, level kamu tetap terjaga." },
          { q: "Bagaimana cara klaim benefit?", a: "Setelah mencapai tier tertentu, hubungi kami via WhatsApp untuk klaim benefit." },
          { q: "Apakah level bisa turun?", a: "Level tidak akan turun selama periode aktif berlangsung." },
        ].map((faq, i) => (
          <details key={i} style={{ borderTop: "1px solid #e5e5e5" }}>
            <summary style={{ padding: "20px 0", fontSize: "15px", fontWeight: 600, color: "#1a1a1a", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", listStyle: "none" }}>
              {faq.q}<span style={{ fontSize: "18px", color: "#888", fontWeight: 300, flexShrink: 0 }}>+</span>
            </summary>
            <p style={{ fontSize: "14px", color: "#666", lineHeight: 1.8, paddingBottom: "20px", margin: 0 }}>{faq.a}</p>
          </details>
        ))}
        <div style={{ borderTop: "1px solid #e5e5e5" }} />
      </div>

      <div style={{ textAlign: "center", padding: "48px 24px 80px" }}>
        <p style={{ fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: "#aaa", marginBottom: "16px" }}>Henima Circle</p>
        <h3 style={{ fontSize: "22px", fontWeight: 700, color: "#1a1a1a", marginBottom: "24px" }}>Mulai perjalananmu bersama Henima</h3>
        <Link href="/shop" style={{ display: "inline-block", background: "#2c2c2c", color: "#fff", padding: "14px 40px", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", textDecoration: "none", fontWeight: 500 }}>Shop Now</Link>
      </div>
    </div>
  );
}