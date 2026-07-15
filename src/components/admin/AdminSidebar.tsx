"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MENUS = [
  { group: "UTAMA", items: [
    { href: "/admin", icon: "grid", label: "Dashboard", exact: true },
  ]},
  { group: "OPERASIONAL", items: [
    { href: "/admin/orders", icon: "bag", label: "Retail Orders" },
    { href: "/admin/stok", icon: "package", label: "Stok Management" },
    { href: "/admin/ulasan", icon: "star", label: "Ulasan Produk" },
  ]},
  { group: "KEUANGAN", items: [
    { href: "/admin/keuangan", icon: "wallet", label: "Buku Kas" },
    { href: "/admin/hpp-calculator", icon: "calc", label: "Kalkulator HPP" },
  ]},
  { group: "KONTEN", items: [
    { href: "/admin/produk", icon: "box", label: "Produk" },
    { href: "/admin/katalog", icon: "list", label: "Katalog Digital" },
    { href: "/admin/galeri", icon: "image", label: "Galeri" },
    { href: "/admin/blog", icon: "edit", label: "Blog / Journal" },
    { href: "/admin/stories", icon: "heart", label: "Love Stories" },
  ]},
  { group: "MARKETING", items: [
    { href: "/admin/broadcast", icon: "send", label: "Broadcast" },
    { href: "/admin/subscribers", icon: "users", label: "Subscribers" },
    { href: "/admin/voucher", icon: "tag", label: "Voucher & Promo" },
    { href: "/admin/flash-sale", icon: "bolt", label: "Flash Sale" },
    { href: "/admin/reseller", icon: "users", label: "Reseller" },
  ]},
  { group: "SISTEM", items: [
    { href: "/admin/pengaturan", icon: "settings", label: "Pengaturan" },
    { href: "/admin/ganti-password", icon: "lock", label: "Ganti Password" },
  ]},
];

const Icon = ({ name }: { name: string }) => {
  const icons: Record<string, JSX.Element> = {
    grid: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
    bag: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>,
    star: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    box: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>,
    list: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
    image: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
    edit: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    heart: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
    send: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
    users: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
    settings: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
    lock: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
    package: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
    bolt: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    tag: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
    wallet: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M16 12h.01"/><path d="M2 10h20"/></svg>,
    calc: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="8.01" y2="10"/><line x1="12" y1="10" x2="12.01" y2="10"/><line x1="16" y1="10" x2="16.01" y2="10"/><line x1="8" y1="14" x2="8.01" y2="14"/><line x1="12" y1="14" x2="12.01" y2="14"/><line x1="16" y1="14" x2="16.01" y2="14"/><line x1="8" y1="18" x2="8.01" y2="18"/><line x1="12" y1="18" x2="12.01" y2="18"/><line x1="16" y1="18" x2="16.01" y2="18"/></svg>,
  };
  return icons[name] || null;
};

export default function AdminSidebar({ user }: { user: any }) {
  const pathname = usePathname();

  return (
    <aside style={{
      position: "fixed",
      left: 0, top: 0, bottom: 0,
      width: "240px",
      background: "#0A0C10",
      borderRight: "1px solid rgba(255,255,255,0.06)",
      display: "flex",
      flexDirection: "column",
      zIndex: 100,
    }}>
      <style>{`
        .menu-item { transition: all 0.15s; }
        .menu-item:hover { background: rgba(255,255,255,0.04) !important; }
        .admin-scroll::-webkit-scrollbar { width: 3px; }
        .admin-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }
      `}</style>

      {/* Logo */}
      <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <p style={{ fontFamily: "var(--font-cormorant)", fontSize: "18px", letterSpacing: "4px", color: "#F0EBE3", margin: 0 }}>HENIMA</p>
          <p style={{ fontSize: "9px", letterSpacing: "2px", color: "#B5935A", margin: "2px 0 0", textTransform: "uppercase" }}>Admin Panel</p>
        </Link>
      </div>

      {/* User */}
      <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "32px", height: "32px", borderRadius: "50%",
            background: "linear-gradient(135deg, #B5935A, #8B6914)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "12px", fontWeight: 600, color: "#fff", flexShrink: 0,
          }}>
            {user?.name?.[0]?.toUpperCase() || "A"}
          </div>
          <div>
            <p style={{ fontSize: "12px", color: "#F0EBE3", margin: 0, fontWeight: 500 }}>{user?.name || "Admin"}</p>
            <p style={{ fontSize: "10px", color: "#555", margin: 0 }}>Administrator</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="admin-scroll" style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
        {MENUS.map(group => (
          <div key={group.group} style={{ marginBottom: "4px" }}>
            <p style={{
              fontSize: "9px", letterSpacing: "2px", color: "#333",
              textTransform: "uppercase", padding: "10px 20px 4px",
              margin: 0, fontWeight: 600,
            }}>{group.group}</p>
            {group.items.map(item => {
              const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
              return (
                <Link key={item.href} href={item.href} style={{ textDecoration: "none" }}>
                  <div className="menu-item" style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    padding: "9px 20px",
                    background: isActive ? "rgba(181,147,90,0.1)" : "transparent",
                    borderLeft: isActive ? "2px solid #B5935A" : "2px solid transparent",
                    cursor: "pointer",
                    color: isActive ? "#B5935A" : "#666",
                  }}>
                    <Icon name={item.icon} />
                    <span style={{
                      fontSize: "12px",
                      color: isActive ? "#B5935A" : "#777",
                      fontWeight: isActive ? 600 : 400,
                      letterSpacing: "0.3px",
                    }}>{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: "12px 20px", borderTop: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
        <form action="/api/auth/logout" method="POST">
          <button type="submit" style={{
            width: "100%", padding: "10px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            color: "#555", fontSize: "11px",
            letterSpacing: "1.5px", textTransform: "uppercase",
            cursor: "pointer", fontFamily: "var(--font-jost)",
            borderRadius: "4px",
          }}>Keluar</button>
        </form>
      </div>
    </aside>
  );
}
