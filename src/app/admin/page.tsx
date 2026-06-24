import Link from "next/link";
import { redirect } from "next/navigation";
import { getDatabase } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { formatRupiah } from "@/lib/format";
import AdminCharts from "@/components/admin/AdminCharts";

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/masuk");
  if (user.role !== "admin") redirect("/katalog");

  const db = await getDatabase();
  const pendingOrders = db.orders.filter((o) => o.status === "pending_confirmation").length;
  const totalOrders = db.orders.length;
  const resellers = db.users.filter((u) => u.role === "reseller").length;
  const revenueTotal = db.orders.filter((o) => o.status === "delivered").reduce((s, o) => s + o.total, 0);
  const todayKey = new Date().toISOString().slice(0, 10);
  const ordersToday = db.orders.filter((o) => o.createdAt.startsWith(todayKey)).length;
  const revenueToday = db.orders.filter((o) => (o.paymentConfirmedAt || "").startsWith(todayKey)).reduce((s, o) => s + o.total, 0);
  const activeProducts = db.products.filter((p) => p.active).length;

  const ordersByStatus = Object.entries(
    db.orders.reduce((acc, o) => { acc[o.status] = (acc[o.status] || 0) + 1; return acc; }, {} as Record<string, number>)
  ).map(([status, count]) => ({ status, count }));

  const now = Date.now();
  const dayMs = 1000 * 60 * 60 * 24;
  const last30 = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(now - (29 - i) * dayMs);
    const key = d.toISOString().slice(0, 10);
    return { key, label: d.toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit" }) };
  });
  const revenueByDay = last30.map(({ key, label }) => ({
    day: label,
    revenue: db.orders.filter((o) => o.status === "delivered" && o.updatedAt?.startsWith(key)).reduce((s, o) => s + o.total, 0),
  }));

  const delivered = db.orders.filter((o) => o.status === "delivered");
  const resellerRevenue = delivered.reduce((acc, o) => { acc[o.resellerId] = (acc[o.resellerId] || 0) + o.total; return acc; }, {} as Record<string, number>);
  const topResellers = Object.entries(resellerRevenue)
    .map(([id, rev]) => { const u = db.users.find((x) => x.id === id); return { name: (u?.storeName || u?.name || id).slice(0, 12), revenue: rev }; })
    .sort((a, b) => b.revenue - a.revenue).slice(0, 8);

  const recentOrders = db.orders.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  const s: Record<string, React.CSSProperties> = {
    page: { background: "#FAF8F4", minHeight: "100vh", padding: "40px", fontFamily: "var(--font-jost)", color: "#1C1917" },
    label: { fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase" as const, color: "#8A7F72", fontWeight: 400, marginBottom: "6px" },
    heading: { fontFamily: "var(--font-cormorant)", fontSize: "36px", fontWeight: 300, color: "#1C1917", marginBottom: "4px" },
    sub: { fontSize: "13px", color: "#8A7F72", fontWeight: 300 },
    statGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: "2px", marginTop: "32px" },
    statCard: { background: "#F5F0E8", padding: "24px", textDecoration: "none", display: "block", borderBottom: "2px solid transparent", transition: "all 0.2s" },
    statLabel: { fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase" as const, color: "#8A7F72", fontWeight: 400, marginBottom: "10px" },
    statValue: { fontFamily: "var(--font-cormorant)", fontSize: "32px", fontWeight: 400, color: "#1C1917" },
    sectionTitle: { fontFamily: "var(--font-cormorant)", fontSize: "22px", fontWeight: 400, color: "#1C1917", marginBottom: "16px", marginTop: "48px", paddingBottom: "10px", borderBottom: "1px solid rgba(200,184,154,0.3)" },
    menuGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: "2px" },
    menuCard: { background: "#F5F0E8", padding: "24px 28px", textDecoration: "none", display: "flex", flexDirection: "column" as const, gap: "8px", transition: "background 0.2s" },
    menuIcon: { fontSize: "20px", marginBottom: "4px" },
    menuLabel: { fontSize: "13px", fontWeight: 500, color: "#1C1917", letterSpacing: "0.3px" },
    menuDesc: { fontSize: "11px", color: "#8A7F72", fontWeight: 300, lineHeight: 1.5 },
    badge: { display: "inline-block", background: "#1C1917", color: "#FAF8F4", fontSize: "9px", letterSpacing: "1px", padding: "2px 8px", fontWeight: 400 },
    badgeWarn: { display: "inline-block", background: "#C8B89A", color: "#1C1917", fontSize: "9px", letterSpacing: "1px", padding: "2px 8px", fontWeight: 400 },
    tableRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid rgba(200,184,154,0.2)", fontSize: "13px", gap: "16px" },
    divider: { height: "1px", background: "rgba(200,184,154,0.25)", margin: "40px 0" },
  };

  return (
    <div style={s.page}>

      {/* HEADER */}
      <div>
        <p style={s.label}>Admin Panel</p>
        <h1 style={s.heading}>Control Center</h1>
        <p style={s.sub}>Selamat datang, {user.name} · Semua kontrol website Henima ada di sini.</p>
      </div>

      {/* STATS */}
      <div style={s.statGrid}>
        {[
          { label: "Total Revenue", value: formatRupiah(revenueTotal), href: "/admin/orders" },
          { label: "Produk Aktif", value: activeProducts, href: "/admin/produk" },
        ].map((stat) => (
          <Link key={stat.label} href={stat.href} style={s.statCard}>
            <p style={s.statLabel}>{stat.label}</p>
            <p style={{...s.statValue, color: stat.warn ? "#8B4513" : "#1C1917"}}>{stat.value}</p>
            {stat.warn && <span style={s.badgeWarn}>Perlu Aksi</span>}
          </Link>
        ))}
      </div>

      <div style={s.divider} />

      {/* MENU UTAMA */}
      <p style={s.sectionTitle}>Operasional</p>
      <div style={s.menuGrid}>
        {[
          { href: "/admin/orders", icon: "🛍️", label: "Retail Orders", desc: "Kelola order dari web shop, update status, input resi pengiriman" },
          { href: "/admin/produk", icon: "🧴", label: "Kelola Produk", desc: "Tambah produk, edit harga, kelola varian ukuran dan stok" },
          { href: "/admin/katalog", icon: "📋", label: "Katalog Digital", desc: "Update katalog yang bisa diakses reseller dan publik" },
        ].map((m) => (
          <Link key={m.href} href={m.href} style={s.menuCard}>
            <span style={s.menuIcon}>{m.icon}</span>
            <span style={s.menuLabel}>{m.label}</span>
            <span style={s.menuDesc}>{m.desc}</span>
          </Link>
        ))}
      </div>

      {/* KONTEN WEBSITE */}
      <p style={s.sectionTitle}>Konten Website</p>
      <div style={s.menuGrid}>
        {[
          { href: "/admin/pengaturan", icon: "⚙️", label: "Pengaturan Brand", desc: "Edit nama brand, tagline, brand story, hero image, kontak WhatsApp" },
          { href: "/admin/broadcast", icon: "📣", label: "Broadcast Email", desc: "Kirim email promo atau info terbaru ke semua subscriber" },
          { href: "/admin/blog", icon: "✍️", label: "Blog / Journal", desc: "Tulis artikel, tips parfum, cerita brand untuk halaman journal" },
          { href: "/admin/galeri", icon: "🖼️", label: "Galeri Foto", desc: "Upload dan kelola foto produk untuk halaman galeri publik" },
          { href: "/admin/stories", icon: "💛", label: "Love Stories", desc: "Kelola cerita cinta pelanggan, approve, balas, dan tampilkan di homepage" },
          { href: "/admin/ulasan", icon: "⭐", label: "Ulasan Produk", desc: "Kelola ulasan customer, approve, balas ulasan, dan tampilkan di halaman produk" },
          { href: "/admin/ganti-password", icon: "🔒", label: "Ganti Password", desc: "Update password akun admin" },
        ].map((m) => (
          <Link key={m.href} href={m.href} style={s.menuCard}>
            <span style={s.menuIcon}>{m.icon}</span>
            <span style={s.menuLabel}>{m.label}</span>
            <span style={s.menuDesc}>{m.desc}</span>
          </Link>
        ))}
      </div>

      {/* LINK CEPAT */}
      <p style={s.sectionTitle}>Lihat Website Publik</p>
      <div style={{display:"flex", gap:"2px", flexWrap:"wrap" as const}}>
        {[
          { href: "/", label: "Homepage" },
          { href: "/shop", label: "Shop" },
          { href: "/blog", label: "Blog" },
          { href: "/galeri", label: "Galeri" },
          { href: "/katalog-digital", label: "Katalog Digital" },
        ].map((l) => (
          <Link key={l.href} href={l.href} target="_blank" style={{background:"#F5F0E8", padding:"12px 20px", textDecoration:"none", fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase" as const, color:"#8A7F72", fontWeight:400, transition:"all 0.2s"}}>
            {l.label} ↗
          </Link>
        ))}
      </div>

      <div style={s.divider} />

      {/* CHARTS */}
      {db.orders.length > 0 && (
        <div>
          <p style={s.sectionTitle}>Analitik</p>
          <AdminCharts ordersByStatus={ordersByStatus} revenueByDay={revenueByDay} topResellers={topResellers} />
        </div>
      )}

      {/* RECENT ORDERS */}
      {recentOrders.length > 0 && (
        <div style={{marginTop:"48px"}}>
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"16px"}}>
            <p style={s.sectionTitle}>Pesanan Terbaru</p>
            <Link href="/admin/pesanan" style={{fontSize:"10px", letterSpacing:"2px", textTransform:"uppercase" as const, color:"#8A7F72", textDecoration:"none", borderBottom:"1px solid rgba(138,127,114,0.3)", paddingBottom:"2px"}}>Lihat Semua →</Link>
          </div>
          <div style={{background:"#F5F0E8", padding:"0 24px"}}>
            {recentOrders.map((order) => (
              <div key={order.id} style={s.tableRow}>
                <Link href={"/pesanan/" + order.id} style={{fontFamily:"monospace", fontSize:"12px", color:"#1C1917", textDecoration:"none", flex:1}}>{order.id.slice(0,16)}...</Link>
                <span style={{fontSize:"11px", color:"#8A7F72", letterSpacing:"0.5px"}}>{order.status.replace(/_/g," ")}</span>
                <span style={{fontSize:"13px", fontFamily:"var(--font-cormorant)", color:"#1C1917"}}>{formatRupiah(order.total)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
