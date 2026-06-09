import { redirect } from "next/navigation";
import { getCurrentUserSafe } from "@/lib/session";

export default async function PartnerPage() {
  const user = await getCurrentUserSafe();
  if (user?.role === "reseller") redirect("/katalog");
  if (user?.role === "admin") redirect("/admin");
  redirect("/masuk");
}
