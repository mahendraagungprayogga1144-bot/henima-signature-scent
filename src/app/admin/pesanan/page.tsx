import { redirect } from "next/navigation";

/** Legacy reseller order UI — redirect to unified retail orders hub. */
export default function AdminPesananRedirect() {
  redirect("/admin/orders?tab=reseller");
}
