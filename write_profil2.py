code = '''import Link from "next/link";
import { redirect } from "next/navigation";
import { getDatabase } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

const TIERS = [
  { key: "signature", label: "SIGNATURE", min: 0, max: 499999, desc: "Pembelian kurang dari Rp 500.000", color: "#8B7355", bg: "#F5F0E8", benefits: ["Akses konten eksklusif Henima"] },
  { key: "intimate", label: "INTIMATE", min: 500000, max: 1499999, desc: "Rp 500.000 - Rp 1.499.999", color: "#C9A96E", bg: "#FBF6ED", benefits: ["Voucher Rp 50K untuk pembelian berikutnya", "Early access info produk baru"] },
  { key: "soulscent", label: "SOULSCENT", min: 1500000, max: 2999999, desc: "Rp 1.500.000 - Rp 2.999.999", color: "#B8860B", bg: "#FDF8EC", benefits: ["Semua keuntungan Intimate", "Voucher Rp 100K", "WhatsApp Insider update produk", "Early adopter akses produk terbaru", "Aksesoris spesial Henima"] },
  { key: "beloved", label: "BELOVED", min: 3000000, max: Infinity, desc: "Pembelian lebih dari Rp 3.000.000", color: "#DAA520", bg: "#FFFBF0", benefits: ["Semua keuntungan Soulscent", "Henima Gold Member Card", "Pandora Box hadiah kejutan eksklusif", "Exclusive panel dan sample produk baru", "Henima Exclusive Merch"] },
];

function getTier(total: number) {
  return TIERS.find((t) => total >= t.min && total <= t.max) ?? TIERS[0];
}

const TIER_ICONS: Record<string, string> = {
  signature: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="40" cy="28" r="14" stroke="currentColor" stroke-width="2.5"/><path d="M16 68c0-13.255 10.745-24 24-24s24 10.745 24 24" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>`,
  intimate: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="28" cy="28" r="11" stroke="currentColor" stroke-width="2.5"/><circle cx="52" cy="28" r="11" stroke="currentColor" stroke-width="2.5"/><path d="M8 68c0-11.046 8.954-20 20-20h4M72 68c0-11.046-8.954-20-20-20h-4" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><path d="M28 48h24" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>`,
  soulscent: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="28" cy="30" r="11" stroke="currentColor" stroke-width="2.5"/><circle cx="52" cy="30" r="11" stroke="currentColor" stroke-width="2.5"/><path d="M8 70c0-11.046 8.954-20 20-20h24c11.046 0 20 8.954 20 20" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><path d="M40 12c2-4 8-4 8 0s-8 8-8 8-8-4-8-8 6-4 8 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  beloved: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="28" cy="30" r="11" stroke="currentColor" stroke-width="2.5"/><circle cx="52" cy="30" r="11" stroke="currentColor" stroke-width="2.5"/><path d="M8 70c0-11.046 8.954-20 20-20h24c11.046 0 20 8.954 20 20" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><path d="M40 8c3-6 12-5 12 3 0 5-5 9-12 15C33 20 28 16 28 11c0-8 9-9 12-3z" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="2"/></svg>`,
};

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
    <div style={{ minHeight: "100vh", background: "#F9F6F1", fontFamily: "var(--font-jost, sans-serif)" }}>

      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.6} }
        @keyframes shimmer { 0%{background-position:-200px 0} 100%{background-position:200px 0} }
        .tier-icon-active { animation: float 3s ease-in-out infinite; }
        .tier-icon-inactive { opacity: 0.35; }
        details summary::-webkit-details-marker { display: none; }
      `}</style>

      {/* GREETING */}
      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "80px 32px 60px", display: "flex", alignItems: "flex-start", gap: "48px", flexWrap: "wrap" }}>
        <div style={{ width: "120px", height: "120px", borderRadius: "50%", background: "#EDE8E0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "3px solid #D5CFC8" }}>
          <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#B5935A" strokeWidth="1.2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </div>
        <div style={{ flex: 1, minWidth: "280px" }}>
          <p style={{ fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: "#B5935A", marginBottom: "12px", fontWeight: 600 }}>Henima Circle</p>
          <h1 style={{ fontSize: "clamp(24px,3.5vw,38px)", fontWeight: 400, color: "#1C1917", marginBottom: "16px", lineHeight: 1.2 }}>
            Holla, selamat datang <strong style={{ fontWeight: 700 }}>{firstName}</strong>
          </h1>
          <p style={{ fontSize: "14px", color: "#6B5E52", lineHeight: 1.9, maxWidth: "580px", marginBottom: "20px" }}>
            Selamat datang di Henima Circle — cara baru untuk merayakan setiap momen yang kamu jalin bersama Henima.
            Tiap kali kamu berbelanja, kamu bisa naik level. Semakin dekat kita, semakin banyak keistimewaan yang bisa kamu nikmatin.
          </p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", background: "#fff", padding: "10px 20px", border: "1px solid " + currentTier.color, borderRadius: "2px" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: currentTier.color }} />
            <span style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: currentTier.color, fontWeight: 700 }}>{currentTier.label}</span>
          </div>
        </div>
      </div>

      {/* PROGRESS */}
      {nextTier && (
        <div style={{ maxWidth: "960px", margin: "0 auto", padding: "0 32px 56px" }}>
          <div style={{ background: "#fff", padding: "28px 32px", border: "1px solid #E8E0D5" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <span style={{ fontSize: "11px", color: "#9E8E7E", letterSpacing: "1.5px", textTransform: "uppercase" }}>Progress ke {nextTier.label}</span>
              <span style={{ fontSize: "13px", color: currentTier.color, fontWeight: 700 }}>{progressPct}%</span>
            </div>
            <div style={{ height: "4px", background: "#EDE8E0", borderRadius: "2px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: progressPct + "%", background: "linear-gradient(90deg, " + currentTier.color + ", " + nextTier.color + ")", borderRadius: "2px", transition: "width 1.5s ease" }} />
            </div>
            <p style={{ fontSize: "12px", color: "#B5A898", marginTop: "10px" }}>
              Butuh Rp {Math.max(0, nextTier.min - totalSpend).toLocaleString("id-ID")} lagi untuk naik ke {nextTier.label}
            </p>
          </div>
        </div>
      )}

      {/* KEUNTUNGAN TIAP LEVEL */}
      <div style={{ background: "#fff", padding: "80px 32px" }}>
        <div style={{ textAlign: "center", marginBottom: "64px", maxWidth: "700px", margin: "0 auto 64px" }}>
          <h2 style={{ fontSize: "clamp(28px,4vw,42px)", fontWeight: 700, color: "#1C1917", marginBottom: "12px" }}>Keuntungan Tiap Level</h2>
          <p style={{ fontSize: "14px", color: "#9E8E7E", fontStyle: "italic", marginBottom: "20px" }}>"Every scent tells a story, and we are here to celebrate yours."</p>
          <p style={{ fontSize: "14px", color: "#6B5E52", lineHeight: 1.9 }}>
            Setiap pembelian membawamu lebih dekat ke pengalaman Henima yang lebih personal.
            Kita bukan sekadar parfum — kita adalah bagian dari momenmu.
          </p>
        </div>

        {/* TIER STEPS */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexWrap: "wrap", marginBottom: "64px", gap: "0" }}>
          {TIERS.map((tier, i) => (
            <div key={tier.key} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ textAlign: "center", padding: "0 24px" }}>
                <div
                  className={currentTier.key === tier.key ? "tier-icon-active" : "tier-icon-inactive"}
                  style={{ width: "72px", height: "72px", margin: "0 auto 14px", color: currentTier.key === tier.key ? tier.color : "#C5B9AC" }}
                  dangerouslySetInnerHTML={{ __html: TIER_ICONS[tier.key] }}
                />
                <p style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: currentTier.key === tier.key ? tier.color : "#C5B9AC", fontWeight: 700, marginBottom: "4px" }}>{tier.label}</p>
                <p style={{ fontSize: "10px", color: "#C5B9AC", lineHeight: 1.4, maxWidth: "80px", margin: "0 auto" }}>{tier.desc.split("-")[0]}</p>
              </div>
              {i < TIERS.length - 1 && <div style={{ width: "40px", height: "1px", background: "#E8E0D5", flexShrink: 0 }} />}
            </div>
          ))}
        </div>

        {/* BENEFIT CARDS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px", maxWidth: "1000px", margin: "0 auto" }}>
          {TIERS.slice(1).map((tier) => (
            <div key={tier.key} style={{ border: "1px solid " + (currentTier.key === tier.key ? tier.color : "#E8E0D5"), borderTop: "3px solid " + tier.color, padding: "32px 28px", background: currentTier.key === tier.key ? tier.bg : "#fff" }}>
              <h3 style={{ fontSize: "12px", letterSpacing: "2.5px", textTransform: "uppercase", color: tier.color, fontWeight: 700, marginBottom: "24px" }}>{tier.label}</h3>
              {tier.benefits.map((b, i) => (
                <div key={i}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "14px 0" }}>
                    <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: tier.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px" }}>
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <p style={{ fontSize: "13px", color: "#4A3F35", lineHeight: 1.6 }}>{b}</p>
                  </div>
                  {i < tier.benefits.length - 1 && <div style={{ height: "1px", background: "#F0EAE2" }} />}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "80px 32px" }}>
        <h2 style={{ fontSize: "28px", fontWeight: 700, color: "#1C1917", marginBottom: "40px" }}>Pertanyaan yang sering diajukan</h2>
        {[
          { q: "Bagaimana cara naik level?", a: "Lakukan pembelian produk Henima. Total pembelian kamu akan terakumulasi otomatis dan levelmu akan naik sesuai threshold tier." },
          { q: "Apakah level bisa hangus?", a: "Selama kamu aktif berbelanja minimal sekali dalam 12 bulan, level kamu tetap terjaga. Kami tidak ingin kamu kehilangan keistimewaan yang sudah kamu raih." },
          { q: "Bagaimana cara klaim benefit?", a: "Setelah mencapai tier tertentu, hubungi kami via WhatsApp untuk klaim benefit. Tim Henima akan memproses dalam 1x24 jam." },
          { q: "Apakah level bisa turun?", a: "Level tidak akan turun selama periode aktif berlangsung. Kami percaya setiap perjalanan bersamamu layak untuk dirayakan." },
        ].map((faq, i) => (
          <details key={i} style={{ borderTop: "1px solid #E8E0D5" }}>
            <summary style={{ padding: "22px 0", fontSize: "16px", fontWeight: 700, color: "#1C1917", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", listStyle: "none" }}>
              {faq.q}
              <span style={{ fontSize: "22px", color: "#B5935A", fontWeight: 300, flexShrink: 0, marginLeft: "16px" }}>+</span>
            </summary>
            <p style={{ fontSize: "14px", color: "#6B5E52", lineHeight: 1.9, paddingBottom: "22px", margin: 0 }}>{faq.a}</p>
          </details>
        ))}
        <div style={{ borderTop: "1px solid #E8E0D5" }} />
      </div>

      {/* UBAH PROFILE */}
      <div style={{ background: "#fff", padding: "64px 32px 80px" }}>
        <div style={{ maxWidth: "960px", margin: "0 auto", display: "flex", alignItems: "center", gap: "48px", flexWrap: "wrap" }}>
          <div style={{ width: "100px", height: "100px", borderRadius: "50%", background: "#EDE8E0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "2px solid #D5CFC8" }}>
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#B5935A" strokeWidth="1.2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <div style={{ flex: 1, minWidth: "240px" }}>
            <p style={{ fontSize: "14px", color: "#6B5E52", lineHeight: 1.9, maxWidth: "560px", marginBottom: "24px" }}>
              {firstName}, kita pengen banget kenal kamu lebih dekat. Bukan cuma kenal nama aja, tapi benar-benar tahu apa yang kamu suka,
              biar kita bisa kasih pengalaman yang pas banget buat kamu.
            </p>
            <Link href="/ganti-password" style={{ display: "inline-block", background: "#1C1917", color: "#fff", padding: "14px 36px", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", textDecoration: "none", fontWeight: 500 }}>
              Ubah Profile
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}'''

with open("src/app/profil/page.tsx", "w") as f:
    f.write(code)
print("Done!")
