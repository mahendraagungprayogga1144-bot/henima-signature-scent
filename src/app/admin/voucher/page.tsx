import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { supabase } from "@/lib/supabase";
import VoucherClient from "./VoucherClient";

export const dynamic = "force-dynamic";

export default async function VoucherPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/masuk");
  if (user.role !== "admin") redirect("/");

  const { data: vouchers } = await supabase
    .from("vouchers")
    .select("*")
    .order("created_at", { ascending: false });

  return <VoucherClient vouchers={vouchers || []} />;
}
