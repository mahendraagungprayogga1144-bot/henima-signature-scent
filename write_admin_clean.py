content = open("src/app/admin/page.tsx").read()

# Hapus menu Kelola Pesanan dan Kelola Reseller
content = content.replace(
    '          { href: "/admin/pesanan", icon: "📦", label: "Kelola Pesanan", desc: "Konfirmasi pembayaran, update status pengiriman, lihat detail order" },\n',
    ''
)
content = content.replace(
    '          { href: "/admin/reseller", icon: "👥", label: "Kelola Reseller", desc: "Approve pendaftaran, lihat performa, kelola akun reseller" },\n',
    ''
)

# Hapus stat cards reseller
content = content.replace(
    '          { label: "Total Reseller", value: resellers, href: "/admin/reseller" },\n',
    ''
)
content = content.replace(
    '          { label: "Pesanan Hari Ini", value: ordersToday, href: "/admin/pesanan" },\n',
    ''
)
content = content.replace(
    '          { label: "Pending Konfirmasi", value: pendingOrders, href: "/admin/pesanan", warn: pendingOrders > 0 },\n',
    ''
)
content = content.replace(
    '          { label: "Total Pesanan", value: totalOrders, href: "/admin/pesanan" },\n',
    ''
)
content = content.replace(
    '          { label: "Revenue Hari Ini", value: formatRupiah(revenueToday), href: "/admin/pesanan" },\n',
    ''
)
content = content.replace(
    '          { label: "Total Revenue", value: formatRupiah(revenueTotal), href: "/admin/pesanan" },\n',
    '          { label: "Total Revenue", value: formatRupiah(revenueTotal), href: "/admin/orders" },\n'
)

open("src/app/admin/page.tsx", "w").write(content)
print("Done!")
