import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminNotifier from "@/components/admin/AdminNotifier";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/masuk");
  if (user.role !== "admin") redirect("/");

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      background: "#F8F8F8",
      fontFamily: "var(--font-jost)",
    }}>
      <style>{`
        header, footer, .henima-chat-btn { display: none !important; }
        body { background: #F8F8F8 !important; overflow-x: hidden; }
      `}</style>
      <AdminSidebar user={user} />
      <AdminNotifier />
      <main style={{
        flex: 1,
        marginLeft: "240px",
        minHeight: "100vh",
        background: "#F8F8F8",
        overflowX: "hidden",
      }}>
        {children}
      </main>
    </div>
  );
}
