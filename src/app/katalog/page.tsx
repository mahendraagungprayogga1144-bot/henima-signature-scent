import Link from "next/link";
import { redirect } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { getDatabase } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export default async function CatalogPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/masuk");
  if (user.role !== "reseller") redirect("/admin");

  const db = await getDatabase();
  const products = db.products.filter((p) => p.active);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Katalog Produk</h1>
          <p className="text-stone-600">Harga dalam Rupiah (IDR)</p>
        </div>
        <Link href="/pesan" className="btn-primary">
          Buat Pesanan
        </Link>
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {products.map((product) => (
          <ProductCard key={product.id} product={product}>
            <Link href={`/pesan?produk=${product.id}`} className="btn-secondary w-full">
              Pesan Produk Ini
            </Link>
          </ProductCard>
        ))}
      </div>
    </div>
  );
}
