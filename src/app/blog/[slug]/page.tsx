import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", params.slug)
    .eq("published", true)
    .single();

  if (!post) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <Link href="/blog" className="text-sm text-gold-300 hover:underline">← Kembali ke Blog</Link>

      {post.cover_image && (
        <div className="relative h-64 sm:h-96 overflow-hidden rounded-3xl border border-ink-800">
          <Image src={post.cover_image} alt={post.title} fill className="object-cover" />
        </div>
      )}

      <div>
        <p className="text-xs text-ink-500">{new Date(post.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
        <h1 className="mt-3 text-3xl sm:text-4xl font-semibold text-ink-50">{post.title}</h1>
        {post.excerpt && <p className="mt-3 text-lg text-ink-400 italic">{post.excerpt}</p>}
      </div>

      <div className="prose prose-invert max-w-none">
        {post.content && post.content.split("\n").map((para: string, i: number) => (
          para.trim() ? <p key={i} className="text-ink-300 leading-relaxed mb-4">{para}</p> : null
        ))}
      </div>
    </div>
  );
}
