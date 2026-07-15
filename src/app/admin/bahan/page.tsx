import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { supabase } from "@/lib/supabase";
import BahanClient from "./BahanClient";

export const dynamic = "force-dynamic";

export default async function BahanPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/masuk");
  if (user.role !== "admin") redirect("/");

  const { data, error } = await supabase
    .from("material_stocks")
    .select("*")
    .order("name", { ascending: true });

  return (
    <>
      {error && (
        <div style={{ margin: "16px 24px", padding: 14, background: "#fff5f5", border: "1px solid #f5c2c2", fontSize: 13 }}>
          Tabel belum siap — jalankan <code>supabase/migrations/006_material_stocks.sql</code> di Supabase. ({error.message})
        </div>
      )}
      <BahanClient initial={data || []} />
    </>
  );
}
