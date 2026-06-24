import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { supabase } from "@/lib/supabase";
import SubscribersClient from "./SubscribersClient";

export const dynamic = "force-dynamic";

export default async function SubscribersPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/masuk");
  if (user.role !== "admin") redirect("/");

  const { data: subscribers } = await supabase
    .from("subscribers")
    .select("*")
    .order("created_at", { ascending: false });

  return <SubscribersClient subscribers={subscribers || []} />;
}
