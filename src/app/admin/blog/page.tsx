import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { supabase } from "@/lib/supabase";

export default async function AdminBlogPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/masuk");
  if (user.role !== "admin") redirect("/katalog");

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/admin" className="text-sm text-gold-300 hover:underline">← Dashboard</Link>
      <div className="mt-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Kelola Blog</h1>
          <p className="mt-1 text-ink-300">Tulis dan kelola artikel blog.</p>
        </div>
        <Link href="/admin/blog/baru" className="btn-primary">+ Artikel Baru</Link>
      </div>

      <div className="mt-8 space-y-4">
        {posts && posts.length > 0 ? posts.map((post) => (
          <div key={post.id} className="card flex items-center justify-between gap-4">
            <div className="flex-1">
              <p className="font-semibold text-ink-50">{post.title}</p>
              <p className="text-xs text-ink-400 mt-1">
                {new Date(post.created_at).toLocaleDateString("id-ID")} •{" "}
                <span className={post.published ? "text-green-400" : "text-yellow-400"}>
                  {post.published ? "Published" : "Draft"}
                </span>
              </p>
            </div>
            <div className="flex gap-2">
              <Link href={"/admin/blog/" + post.id} className="btn-secondary !py-1 !px-3 text-sm">Edit</Link>
              <Link href={"/blog/" + post.slug} target="_blank" className="btn-secondary !py-1 !px-3 text-sm">Preview</Link>
            </div>
          </div>
        )) : (
          <div className="card text-center py-12">
            <p className="text-ink-400">Belum ada artikel. Klik "+ Artikel Baru".</p>
          </div>
        )}
      </div>
    </div>
  );
}
