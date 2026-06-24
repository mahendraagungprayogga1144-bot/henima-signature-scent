import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { supabase } from "@/lib/supabase";
import StokClient from "./StokClient";

export const dynamic = "force-dynamic";

export default async function StokPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/masuk");
  if (user.role !== "admin") redirect("/");

  const { data: products } = await supabase
    .from("products")
    .select("id, name, stock, photo, active")
    .order("name");

  return <StokClient products={products || []} />;
}
