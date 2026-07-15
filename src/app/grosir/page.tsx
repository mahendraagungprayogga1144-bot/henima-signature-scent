import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { getDatabase } from "@/lib/db";
import OrderForm from "@/components/OrderForm";

export const dynamic = "force-dynamic";

export default async function GrosirPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/masuk?next=/grosir");
  if (user.role !== "reseller") redirect("/shop");
  if (!user.reseller?.approved) {
    return (
      <div style={{ maxWidth: 640, margin: "80px auto", padding: "0 24px", textAlign: "center" }}>
        <h1 style={{ fontFamily: "var(--font-cormorant)", fontSize: 32, marginBottom: 12 }}>
          Menunggu Persetujuan
        </h1>
        <p style={{ color: "#666", lineHeight: 1.6 }}>
          Akun reseller kamu belum di-approve admin. Setelah disetujui, kamu bisa order grosir di sini
          (min. 3 pcs, harga reseller).
        </p>
      </div>
    );
  }

  const db = await getDatabase();
  const products = db.products.filter((p) => p.active);

  const defaultShipping = {
    fullName: user.name || "",
    phone: user.phone || "",
    address: user.address || "",
    city: "",
    province: "",
    postalCode: "",
  };

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px 80px" }}>
      <p
        style={{
          fontSize: 10,
          letterSpacing: 3,
          textTransform: "uppercase",
          color: "#B5935A",
          marginBottom: 8,
        }}
      >
        Reseller · {user.reseller.tier} · Komisi {user.reseller.commissionPct}%
      </p>
      <h1 style={{ fontFamily: "var(--font-cormorant)", fontSize: 36, margin: "0 0 8px" }}>
        Order Grosir
      </h1>
      <p style={{ color: "#666", marginBottom: 32, fontSize: 14 }}>
        Toko: {user.storeName || user.name}. Minimal 3 pcs untuk harga grosir.
      </p>
      <OrderForm products={products} defaultShipping={defaultShipping} />
    </div>
  );
}
