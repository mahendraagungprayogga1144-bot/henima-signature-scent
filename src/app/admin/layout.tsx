import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/masuk");
  if (user.role !== "admin") redirect("/");

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      background: "#0F1117",
      fontFamily: "var(--font-jost)",
    }}>
      <AdminSidebar user={user} />
      <main style={{
        flex: 1,
        marginLeft: "240px",
        minHeight: "100vh",
        background: "#0F1117",
        overflowX: "hidden",
      }}>
        {children}
      </main>
    </div>
  );
}
