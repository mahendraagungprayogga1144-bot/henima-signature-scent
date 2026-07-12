import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import {
  INTIMATE_TIERS,
  getOrCreateMemberProfile,
  getTierMeta,
  nextTierInfo,
  type IntimateTier,
} from "@/lib/membership";

export const dynamic = "force-dynamic";

const TIER_ICONS: Record<IntimateTier, string> = {
  signature: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="40" cy="28" r="14" stroke="currentColor" stroke-width="2.5"/><path d="M16 68c0-13.255 10.745-24 24-24s24 10.745 24 24" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>`,
  intimate: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="28" cy="28" r="11" stroke="currentColor" stroke-width="2.5"/><circle cx="52" cy="28" r="11" stroke="currentColor" stroke-width="2.5"/><path d="M8 68c0-11.046 8.954-20 20-20h4M72 68c0-11.046-8.954-20-20-20h-4" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><path d="M28 48h24" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>`,
  soulscent: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="28" cy="30" r="11" stroke="currentColor" stroke-width="2.5"/><circle cx="52" cy="30" r="11" stroke="currentColor" stroke-width="2.5"/><path d="M8 70c0-11.046 8.954-20 20-20h24c11.046 0 20 8.954 20 20" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><path d="M40 12c2-4 8-4 8 0s-8 8-8 8-8-4-8-8 6-4 8 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  beloved: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="28" cy="30" r="11" stroke="currentColor" stroke-width="2.5"/><circle cx="52" cy="30" r="11" stroke="currentColor" stroke-width="2.5"/><path d="M8 70c0-11.046 8.954-20 20-20h24c11.046 0 20 8.954 20 20" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><path d="M40 8c3-6 12-5 12 3 0 5-5 9-12 15C33 20 28 16 28 11c0-8 9-9 12-3z" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="2"/></svg>`,
};

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/masuk");
  if (user.role === "admin") redirect("/admin");

  const profile = await getOrCreateMemberProfile(user.id);
  const currentTier = getTierMeta(profile.tier);
  const progress = nextTierInfo(profile.totalPoints);
  const firstName = user.name.split(" ")[0];

  return (
    <div style={{ minHeight: "100vh", background: "#F9F6F1", fontFamily: "var(--font-jost, sans-serif)" }}>
      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
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
          <p style={{ fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: "#B5935A", marginBottom: "12px", fontWeight: 600 }}>The Intimate</p>
          <h1 style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(28px,3.5vw,42px)", fontWeight: 400, color: "#1C1917", marginBottom: "16px", lineHeight: 1.2 }}>
            Holla, selamat datang <strong style={{ fontWeight: 600 }}>{firstName}</strong>
          </h1>
          <p style={{ fontSize: "14px", color: "#6B5E52", lineHeight: 1.9, maxWidth: "580px", marginBottom: "20px" }}>
            Selamat datang di The Intimate — setiap belanja yang sudah sampai menambah poinmu.
            Rp 10.000 = 1 poin. Semakin dekat kita, semakin banyak keistimewaan yang bisa kamu nikmati.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", background: "#fff", padding: "10px 20px", border: "1px solid " + currentTier.color, borderRadius: "2px" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: currentTier.color }} />
              <span style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: currentTier.color, fontWeight: 700 }}>{currentTier.label}</span>
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: currentTier.bg, padding: "10px 18px", border: "1px solid " + currentTier.color + "55" }}>
              <span style={{ fontSize: "11px", letterSpacing: "1.5px", textTransform: "uppercase", color: "#9E8E7E" }}>Poin</span>
              <span style={{ fontSize: "16px", fontWeight: 700, color: currentTier.color }}>{profile.totalPoints.toLocaleString("id-ID")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* PROGRESS */}
      {progress.next && (
        <div style={{ maxWidth: "960px", margin: "0 auto", padding: "0 32px 56px" }}>
          <div style={{ background: "#fff", padding: "28px 32px", border: "1px solid #E8E0D5" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <span style={{ fontSize: "11px", color: "#9E8E7E", letterSpacing: "1.5px", textTransform: "uppercase" }}>
                Progress ke {progress.next.label}
              </span>
              <span style={{ fontSize: "13px", color: currentTier.color, fontWeight: 700 }}>{progress.progressPct}%</span>
            </div>
            <div style={{ height: "4px", background: "#EDE8E0", borderRadius: "2px", overflow: "hidden" }}>
              <div
                style={{
                  height: "100%",
                  width: progress.progressPct + "%",
                  background: "linear-gradient(90deg, " + currentTier.color + ", " + progress.next.color + ")",
                  borderRadius: "2px",
                  transition: "width 1.5s ease",
                }}
              />
            </div>
            <p style={{ fontSize: "12px", color: "#B5A898", marginTop: "10px" }}>
              Butuh {progress.pointsNeeded.toLocaleString("id-ID")} poin lagi untuk naik ke {progress.next.label}
            </p>
          </div>
        </div>
      )}

      {/* CURRENT BENEFITS */}
      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "0 32px 56px" }}>
        <div style={{ background: currentTier.bg, border: "1px solid " + currentTier.color + "44", padding: "32px" }}>
          <p style={{ fontSize: "11px", letterSpacing: "2.5px", textTransform: "uppercase", color: currentTier.color, fontWeight: 700, marginBottom: "20px" }}>
            Benefit {currentTier.label} saat ini
          </p>
          <div style={{ display: "grid", gap: "12px" }}>
            {currentTier.benefits.map((b) => (
              <div key={b} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: currentTier.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "2px" }}>
                  <svg width="9" height="9" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <p style={{ fontSize: "14px", color: "#4A3F35", lineHeight: 1.6, margin: 0 }}>{b}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* KEUNTUNGAN TIAP LEVEL */}
      <div style={{ background: "#fff", padding: "80px 32px" }}>
        <div style={{ textAlign: "center", marginBottom: "64px", maxWidth: "700px", margin: "0 auto 64px" }}>
          <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: "clamp(28px,4vw,42px)", fontWeight: 500, color: "#1C1917", marginBottom: "12px" }}>
            Keuntungan Tiap Level
          </h2>
          <p style={{ fontSize: "14px", color: "#9E8E7E", fontStyle: "italic", marginBottom: "20px" }}>
            &quot;Every distance has a scent, and every scent tells your story.&quot;
          </p>
          <p style={{ fontSize: "14px", color: "#6B5E52", lineHeight: 1.9 }}>
            Poin dihitung dari total order yang statusnya sudah <strong>delivered</strong> (sampai).
            Rp 10.000 belanja = 1 poin. Tier naik otomatis saat poin mencapai threshold.
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexWrap: "wrap", marginBottom: "64px", gap: "0" }}>
          {INTIMATE_TIERS.map((tier, i) => (
            <div key={tier.key} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ textAlign: "center", padding: "0 24px" }}>
                <div
                  className={currentTier.key === tier.key ? "tier-icon-active" : "tier-icon-inactive"}
                  style={{ width: "72px", height: "72px", margin: "0 auto 14px", color: currentTier.key === tier.key ? tier.color : "#C5B9AC" }}
                  dangerouslySetInnerHTML={{ __html: TIER_ICONS[tier.key] }}
                />
                <p style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: currentTier.key === tier.key ? tier.color : "#C5B9AC", fontWeight: 700, marginBottom: "4px" }}>
                  {tier.label}
                </p>
                <p style={{ fontSize: "10px", color: "#C5B9AC", lineHeight: 1.4, maxWidth: "90px", margin: "0 auto" }}>
                  {tier.desc}
                </p>
              </div>
              {i < INTIMATE_TIERS.length - 1 && <div style={{ width: "40px", height: "1px", background: "#E8E0D5", flexShrink: 0 }} />}
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px", maxWidth: "1000px", margin: "0 auto" }}>
          {INTIMATE_TIERS.slice(1).map((tier) => (
            <div
              key={tier.key}
              style={{
                border: "1px solid " + (currentTier.key === tier.key ? tier.color : "#E8E0D5"),
                borderTop: "3px solid " + tier.color,
                padding: "32px 28px",
                background: currentTier.key === tier.key ? tier.bg : "#fff",
              }}
            >
              <h3 style={{ fontSize: "12px", letterSpacing: "2.5px", textTransform: "uppercase", color: tier.color, fontWeight: 700, marginBottom: "8px" }}>
                {tier.label}
              </h3>
              <p style={{ fontSize: "12px", color: "#9E8E7E", marginBottom: "20px" }}>{tier.desc}</p>
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
        <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: "28px", fontWeight: 500, color: "#1C1917", marginBottom: "40px" }}>
          Pertanyaan yang sering diajukan
        </h2>
        {[
          { q: "Bagaimana cara mendapat poin?", a: "Poin ditambahkan otomatis saat status pesanan menjadi delivered (sudah diterima). Rp 10.000 dari total order = 1 poin. Checkout sebagai guest tidak mendapat poin." },
          { q: "Bagaimana cara naik level?", a: "Tier naik otomatis saat total poin mencapai threshold: Intimate 50, Soulscent 150, Beloved 300." },
          { q: "Diskon member berlaku di mana?", a: "Diskon otomatis diterapkan di checkout saat kamu login. Intimate 5%, Soulscent & Beloved 10%. Beloved juga mendapat gratis ongkir." },
          { q: "Apakah level bisa turun?", a: "Level tidak turun. Poin terus terakumulasi dari setiap order yang berhasil sampai." },
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
            <Link href="/edit-profil" style={{ display: "inline-block", background: "#1C1917", color: "#fff", padding: "14px 36px", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", textDecoration: "none", fontWeight: 500 }}>
              Ubah Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
