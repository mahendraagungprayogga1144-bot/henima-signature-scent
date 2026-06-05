import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import ChangePasswordForm from "./ChangePasswordForm";

export default async function GantiPasswordPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/masuk");
  if (user.role !== "admin") redirect("/katalog");

  return (
    <div className="mx-auto max-w-md">
      <Link href="/admin" className="text-sm text-gold-300 hover:underline">← Dashboard</Link>
      <h1 className="mt-4 text-2xl font-bold">Ganti Password</h1>
      <p className="mt-1 text-ink-300">Update password akun admin kamu.</p>
      <div className="mt-8">
        <ChangePasswordForm />
      </div>
    </div>
  );
}
