import Link from "next/link";
import Image from "next/image";
import { getDatabase } from "@/lib/db";
import { supabase } from "@/lib/supabase";

export default async function BlogPage() {
  const db = await getDatabase();
  const company = db.settings.company;

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <div className="text-center">
        <p className="text-xs font-semibold tracking-[0.2em] text-gold-400 uppercase">{company.name}</p>
        <h1 className="mt-2 text-4xl font-semibold text-ink-50">Blog</h1>
        <p className="mt-3 text-ink-400">Tips, cerita, dan inspirasi dari Henima.</p>
      </div>

      {posts && posts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.id} href={"/blog/" + post.slug} className="group card overflow-hidden p-0 hover:border-gold-400/40 transition-all">
              {post.cover_image && (
                <div className="relative h-48 overflow-hidden bg-ink-900">
                  <Image src={post.cover_image} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
              )}
              <div className="p-5">
                <p className="text-xs text-ink-500">{new Date(post.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
                <h2 className="mt-2 text-lg font-semibold text-ink-50 group-hover:text-gold-300 transition-colors">{post.title}</h2>
                {post.excerpt && <p className="mt-2 text-sm text-ink-400 line-clamp-3">{post.excerpt}</p>}
                <p className="mt-3 text-sm font-semibold text-gold-300">Baca selengkapnya →</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-ink-800 bg-ink-950/30 p-16 text-center">
          <p className="text-4xl">📝</p>
          <p className="mt-4 text-lg font-semibold text-ink-50">Blog segera hadir</p>
          <p className="mt-2 text-ink-400">Admin sedang mempersiapkan konten blog.</p>
        </div>
      )}
    </div>
  );
}
