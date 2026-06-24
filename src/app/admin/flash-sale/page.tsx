import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { supabase } from "@/lib/supabase";
import { getDatabase } from "@/lib/db";
import FlashSaleClient from "./FlashSaleClient";

export const dynamic = "force-dynamic";

export default async function FlashSalePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/masuk");
  if (user.role !== "admin") redirect("/");

  const { data: flashSales } = await supabase
    .from("flash_sales")
    .select("*")
    .order("created_at", { ascending: false });

  const db = await getDatabase();
  const products = db.products.filter(p => p.active);

  return <FlashSaleClient flashSales={flashSales || []} products={products} />;
}
