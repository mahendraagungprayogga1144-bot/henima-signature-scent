export const dynamic = "force-dynamic";
import { MetadataRoute } from "next";
import { getDatabase } from "@/lib/db";
import { supabase } from "@/lib/supabase";

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const db = await getDatabase();
  const products = db.products.filter(p => p.active);

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("slug, updated_at")
    .eq("published", true);

  const staticPages = [
    { url: "https://henimaofficial.com", priority: 1.0, changeFrequency: "daily" as const },
    { url: "https://henimaofficial.com/shop", priority: 0.9, changeFrequency: "weekly" as const },
    { url: "https://henimaofficial.com/our-story", priority: 0.8, changeFrequency: "monthly" as const },
    { url: "https://henimaofficial.com/blog", priority: 0.8, changeFrequency: "weekly" as const },
    { url: "https://henimaofficial.com/quiz", priority: 0.7, changeFrequency: "monthly" as const },
    { url: "https://henimaofficial.com/galeri", priority: 0.7, changeFrequency: "monthly" as const },
    { url: "https://henimaofficial.com/love-letters", priority: 0.6, changeFrequency: "weekly" as const },
    { url: "https://henimaofficial.com/share-story", priority: 0.6, changeFrequency: "monthly" as const },
    { url: "https://henimaofficial.com/tracking", priority: 0.5, changeFrequency: "monthly" as const },
    { url: "https://henimaofficial.com/wishlist", priority: 0.5, changeFrequency: "monthly" as const },
    { url: "https://henimaofficial.com/daftar", priority: 0.4, changeFrequency: "yearly" as const },
    { url: "https://henimaofficial.com/masuk", priority: 0.3, changeFrequency: "yearly" as const },
  ].map(p => ({ ...p, lastModified: new Date() }));

  const productPages = products.map(p => ({
    url: `https://henimaofficial.com/shop/${toSlug(p.name)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  const blogPages = (posts || []).map(p => ({
    url: `https://henimaofficial.com/blog/${p.slug}`,
    lastModified: new Date(p.updated_at || new Date()),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...productPages, ...blogPages];
}
