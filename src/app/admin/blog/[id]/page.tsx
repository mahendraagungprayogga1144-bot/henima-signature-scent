import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { supabase } from "@/lib/supabase";
import BlogEditor from "../BlogEditor";

export default async function BlogEditPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect("/masuk");
  if (user.role !== "admin") redirect("/katalog");

  const { data: post } = await supabase.from("blog_posts").select("*").eq("id", params.id).single();

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/admin/blog" className="text-sm text-gold-300 hover:underline">← Kelola Blog</Link>
      <h1 className="mt-4 text-2xl font-bold">Edit Artikel</h1>
      <div className="mt-8">
        <BlogEditor post={post} />
      </div>
    </div>
  );
}
