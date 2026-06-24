import Link from "next/link";
import { redirect } from "next/navigation";
import { getDatabase } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import MemberManager from "@/components/admin/MemberManager";

export const dynamic = "force-dynamic";

export default async function AdminMembersPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/masuk");
  if (user.role !== "admin") redirect("/");

  const db = await getDatabase();
  const allUsers = db.users.filter((u: any) => u.role !== "admin");

  const members = allUsers.filter((u: any) => u.role === "member");
  const resellers = allUsers.filter((u: any) => u.role === "reseller");

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "40px 24px",
        fontFamily: "var(--font-jost, sans-serif)",
      }}
    >
      <Link
        href="/admin"
        style={{ fontSize: "12px", color: "#888", textDecoration: "none", letterSpacing: "1px" }}
      >
      </Link>

      <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#1a1a1a", marginTop: "16px", marginBottom: "4px" }}>
        Kelola Member
      </h1>
      <p style={{ fontSize: "13px", color: "#888", marginBottom: "40px" }}>
        {members.length} member &nbsp;·&nbsp; {resellers.length} reseller
      </p>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "16px", marginBottom: "48px" }}>
        {[
          { label: "Total User", value: allUsers.length },
          { label: "Member Circle", value: members.length },
          { label: "Reseller", value: resellers.length },
          { label: "Reseller Aktif", value: resellers.filter((u: any) => u.reseller?.approved).length },
        ].map((s) => (
          <div key={s.label} style={{ border: "1px solid #e5e5e5", padding: "20px", background: "#fff" }}>
            <p style={{ fontSize: "11px", color: "#aaa", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>{s.label}</p>
            <p style={{ fontSize: "28px", fontWeight: 700, color: "#1a1a1a" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Reseller section */}
      {resellers.length > 0 && (
        <div style={{ marginBottom: "48px" }}>
          <h2 style={{ fontSize: "14px", letterSpacing: "2px", textTransform: "uppercase", color: "#888", marginBottom: "16px", fontWeight: 600 }}>
            Reseller
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {resellers.map((r: any) => (
              <MemberManager key={r.id} member={r} />
            ))}
          </div>
        </div>
      )}

      {/* Member section */}
      <div>
        <h2 style={{ fontSize: "14px", letterSpacing: "2px", textTransform: "uppercase", color: "#888", marginBottom: "16px", fontWeight: 600 }}>
          Henima Circle Members
        </h2>
        {members.length === 0 ? (
          <div style={{ border: "1px solid #e5e5e5", padding: "40px", textAlign: "center", color: "#aaa", fontSize: "14px" }}>
            Belum ada member terdaftar
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {members.map((m: any) => (
              <MemberManager key={m.id} member={m} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
