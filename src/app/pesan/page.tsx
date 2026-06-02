import { redirect } from "next/navigation";
import OrderForm from "@/components/OrderForm";
import { getDatabase } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export default async function OrderPage({
  searchParams,
}: {
  searchParams: Promise<{ produk?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/masuk");
  if (user.role !== "reseller") redirect("/admin");

  const { produk } = await searchParams;
  const db = await getDatabase();
  const products = db.products.filter((p) => p.active);

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-bold">Form Pemesanan</h1>
      <p className="mt-1 text-ink-300">
        Pilih varian & jumlah, lengkapi pengiriman, lalu lanjutkan pembayaran.
      </p>
      <div className="mt-8">
        <OrderForm
          products={products}
          defaultShipping={{
            fullName: user.name || "",
            phone: user.phone || "",
            address: user.address || "",
            city: "",
            province: "",
            postalCode: "",
          }}
          preselectId={produk}
        />
      </div>
    </div>
  );
}
