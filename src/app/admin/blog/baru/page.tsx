import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import BlogEditor from "../BlogEditor";

export default async function BlogBaruPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/masuk");
  if (user.role !== "admin") redirect("/katalog");

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/admin/blog" className="text-sm text-gold-300 hover:underline">← Kelola Blog</Link>
      <h1 className="mt-4 text-2xl font-bold">Artikel Baru</h1>
      <div className="mt-8">
        <BlogEditor post={null} />
      </div>
    </div>
  );
}
