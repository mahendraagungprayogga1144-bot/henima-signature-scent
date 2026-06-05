import Link from "next/link";
import { redirect } from "next/navigation";
import { getDatabase } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import ProductEditor from "@/components/admin/ProductEditor";
import NewProductForm from "@/components/admin/NewProductForm";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/masuk");
  if (user.role !== "admin") redirect("/katalog");

  const { saved, error } = await searchParams;
  const db = await getDatabase();

  return (
    <div>
      <Link href="/admin" className="text-sm text-gold-300 hover:text-gold-200 hover:underline">
        ← Dashboard
      </Link>
      <h1 className="mt-4 text-2xl font-bold">Kelola Produk</h1>
      {saved && (
        <p className="mt-4 rounded-lg border border-green-900/30 bg-green-950/30 px-3 py-2 text-sm text-green-200">
          Produk berhasil disimpan.
        </p>
      )}
      {error && (
        <p className="mt-4 rounded-lg border border-red-900/30 bg-red-950/30 px-3 py-2 text-sm text-red-200">
          {decodeURIComponent(error)}
        </p>
      )}

      <div className="mt-8">
        <NewProductForm />
      </div>

      <div className="mt-8 space-y-8">
        {db.products.map((product) => (
          <ProductEditor key={product.id} product={product} onSaved={() => window.location.reload()} />
        ))}
      </div>
    </div>
  );
}
