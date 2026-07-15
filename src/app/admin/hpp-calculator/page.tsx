import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { supabase } from "@/lib/supabase";
import { normalizeInputs, type HppCalculatorProduct } from "@/lib/hpp-calculator";
import HppProfitCalculator from "./HppProfitCalculator";

export const dynamic = "force-dynamic";

export default async function HppCalculatorPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/masuk");
  if (user.role !== "admin") redirect("/");

  const { data, error } = await supabase
    .from("hpp_calculator_products")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  const products: HppCalculatorProduct[] = (data || []).map((row) => {
    const raw = row.inputs;
    const seller =
      raw && typeof raw === "object" && "sellerChannel" in raw
        ? String((raw as { sellerChannel?: string }).sellerChannel || "")
        : "";
    return {
      id: row.id,
      slug: row.slug,
      name: row.name,
      inputs: normalizeInputs(raw),
      seller_channel: seller || undefined,
      sort_order: row.sort_order ?? 0,
      created_at: row.created_at,
      updated_at: row.updated_at,
    };
  });

  return (
    <>
      {error && (
        <div
          style={{
            margin: "16px 24px",
            padding: "14px 16px",
            background: "#2a1512",
            border: "1px solid #c07061",
            color: "#e9e6de",
            fontSize: 13,
            lineHeight: 1.5,
          }}
        >
          <strong style={{ color: "#c07061" }}>Tabel belum siap.</strong> Jalankan SQL migrasi{" "}
          <code>supabase/migrations/005_hpp_calculator.sql</code> di Supabase SQL Editor, lalu refresh
          halaman. ({error.message})
        </div>
      )}
      <HppProfitCalculator initialProducts={products} />
    </>
  );
}
