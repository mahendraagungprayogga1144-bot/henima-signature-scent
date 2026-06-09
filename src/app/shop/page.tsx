import { getDatabase } from "@/lib/db";
import ShopClient from "@/components/ShopClient";

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const db = await getDatabase();
  const company = db.settings.company;
  const products = db.products.filter((p) => p.active);
  const waNumber = company.whatsappNumber || "6285190311230";
  return <ShopClient products={products as any} waNumber={waNumber} />;
}
