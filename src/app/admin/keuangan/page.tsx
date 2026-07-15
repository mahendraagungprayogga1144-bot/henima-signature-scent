import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { supabase } from "@/lib/supabase";
import { DEFAULT_CATEGORIES, type FinanceCategories } from "@/lib/keuangan";
import KeuanganClient from "./KeuanganClient";

export const dynamic = "force-dynamic";

export default async function KeuanganPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/masuk");
  if (user.role !== "admin") redirect("/");

  const [
    { data: kas },
    { data: purchases },
    { data: hpp },
    { data: settings },
  ] = await Promise.all([
    supabase.from("kas_transactions").select("*").order("tanggal", { ascending: true }),
    supabase.from("purchases").select("*").order("tanggal", { ascending: false }),
    supabase.from("hpp_products").select("*").order("sort_order", { ascending: true }),
    supabase.from("settings").select("finance_categories").eq("id", 1).single(),
  ]);

  const categories: FinanceCategories =
    (settings?.finance_categories as FinanceCategories) || DEFAULT_CATEGORIES;

  return (
    <KeuanganClient
      initialKas={kas || []}
      initialPurchases={purchases || []}
      initialHpp={hpp || []}
      initialCategories={categories}
    />
  );
}
