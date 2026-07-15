import Link from "next/link";
import { redirect } from "next/navigation";
import { getDatabase } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import MemberManager from "@/components/admin/MemberManager";
import ResellerManager from "@/components/admin/ResellerManager";

export const dynamic = "force-dynamic";

export default async function AdminResellerPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/masuk");
  if (user.role !== "admin") redirect("/");

  const db = await getDatabase();
  const allUsers = db.users.filter((u) => u.role !== "admin");
  const members = allUsers.filter((u) => u.role === "member");
  const resellers = allUsers.filter((u) => u.role === "reseller");
  const approved = resellers.filter((u) => u.reseller?.approved).length;

  return (
    <div
      style={{
        maxWidth: 1000,
        margin: "0 auto",
        padding: "40px 24px",
        fontFamily: "var(--font-jost, sans-serif)",
      }}
    >
      <Link href="/admin" style={{ fontSize: 12, color: "#888", textDecoration: "none", letterSpacing: 1 }}>
        ← Dashboard
      </Link>

      <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1a1a1a", marginTop: 16, marginBottom: 4 }}>
        Reseller & Member
      </h1>
      <p style={{ fontSize: 13, color: "#888", marginBottom: 40 }}>
        Approve reseller, atur tier & komisi · kelola member Circle
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 16,
          marginBottom: 48,
        }}
      >
        {[
          { label: "Total User", value: allUsers.length },
          { label: "Member Circle", value: members.length },
          { label: "Reseller", value: resellers.length },
          { label: "Reseller Aktif", value: approved },
        ].map((s) => (
          <div key={s.label} style={{ border: "1px solid #e5e5e5", padding: 20, background: "#fff" }}>
            <p
              style={{
                fontSize: 11,
                color: "#aaa",
                letterSpacing: 1,
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              {s.label}
            </p>
            <p style={{ fontSize: 28, fontWeight: 700, color: "#1a1a1a", margin: 0 }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 48 }}>
        <h2
          style={{
            fontSize: 14,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "#888",
            marginBottom: 16,
            fontWeight: 600,
          }}
        >
          Reseller
        </h2>
        {resellers.length === 0 ? (
          <div style={{ border: "1px solid #e5e5e5", padding: 40, textAlign: "center", color: "#aaa", fontSize: 14 }}>
            Belum ada akun reseller
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {resellers.map((r) => (
              <ResellerManager key={r.id} reseller={r} />
            ))}
          </div>
        )}
      </div>

      <div>
        <h2
          style={{
            fontSize: 14,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "#888",
            marginBottom: 16,
            fontWeight: 600,
          }}
        >
          Henima Circle Members
        </h2>
        {members.length === 0 ? (
          <div style={{ border: "1px solid #e5e5e5", padding: 40, textAlign: "center", color: "#aaa", fontSize: 14 }}>
            Belum ada member terdaftar
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {members.map((m) => (
              <MemberManager key={m.id} member={m} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
