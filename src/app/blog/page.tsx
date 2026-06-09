import Link from "next/link";
import Image from "next/image";
import { getDatabase } from "@/lib/db";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const db = await getDatabase();
  const company = db.settings.company;

  let query = supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (searchParams.q) {
    query = query.ilike("title", `%${searchParams.q}%`);
  }

  const { data: posts } = await query;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fff",
        fontFamily: "var(--font-jost, sans-serif)",
      }}
    >
      {/* Header */}
      <div
        style={{
          textAlign: "center",
          padding: "64px 24px 40px",
          borderBottom: "1px solid #e5e5e5",
        }}
      >
        <p
          style={{
            fontSize: "11px",
            letterSpacing: "3px",
            textTransform: "uppercase",
            color: "#1a1a1a",
            fontWeight: 600,
            marginBottom: "0",
          }}
        >
          {company.name}
        </p>
      </div>

      {/* Search Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          padding: "32px 24px",
          borderBottom: "1px solid #e5e5e5",
        }}
      >
        <form
          method="GET"
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          <label
            style={{
              fontSize: "13px",
              color: "#1a1a1a",
              fontWeight: 400,
              letterSpacing: "0.5px",
            }}
          >
            Search
          </label>
          <div style={{ position: "relative" }}>
            <input
              name="q"
              defaultValue={searchParams.q || ""}
              type="text"
              style={{
                border: "1px solid #1a1a1a",
                borderRadius: "0",
                padding: "8px 40px 8px 12px",
                fontSize: "13px",
                width: "280px",
                outline: "none",
                background: "#fff",
                color: "#1a1a1a",
              }}
            />
            <button
              type="submit"
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0",
                display: "flex",
                alignItems: "center",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>
          </div>
        </form>
      </div>

      {/* Grid */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "48px 24px 80px",
        }}
      >
        {posts && posts.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "40px 32px",
            }}
          >
            {posts.map((post) => (
              <div key={post.id} style={{ display: "flex", flexDirection: "column" }}>
                {/* Image */}
                <Link href={"/blog/" + post.slug} style={{ textDecoration: "none", display: "block" }}>
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      aspectRatio: "4/3",
                      overflow: "hidden",
                      background: "#f0f0f0",
                      marginBottom: "20px",
                    }}
                  >
                    {post.cover_image ? (
                      <Image
                        src={post.cover_image}
                        alt={post.title}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          background: "#e8e4df",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span style={{ fontSize: "32px", opacity: 0.3 }}>✦</span>
                      </div>
                    )}
                  </div>
                </Link>

                {/* Title */}
                <Link href={"/blog/" + post.slug} style={{ textDecoration: "none" }}>
                  <h2
                    style={{
                      fontSize: "20px",
                      fontWeight: 700,
                      color: "#1a1a1a",
                      lineHeight: 1.3,
                      marginBottom: "12px",
                      fontFamily: "var(--font-jost, sans-serif)",
                    }}
                  >
                    {post.title}
                  </h2>
                </Link>

                {/* Author & Date */}
                <p
                  style={{
                    fontSize: "12px",
                    color: "#888",
                    marginBottom: "12px",
                    fontWeight: 400,
                  }}
                >
                  by Henima &nbsp;&nbsp;
                  {new Date(post.created_at).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>

                {/* Excerpt */}
                {post.excerpt && (
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#555",
                      lineHeight: 1.7,
                      marginBottom: "20px",
                      flex: 1,
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {post.excerpt}
                  </p>
                )}

                {/* READ MORE */}
                <Link
                  href={"/blog/" + post.slug}
                  style={{
                    display: "inline-block",
                    border: "1px solid #1a1a1a",
                    padding: "10px 20px",
                    fontSize: "11px",
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    color: "#1a1a1a",
                    textDecoration: "none",
                    fontWeight: 500,
                    alignSelf: "flex-start",
                    marginTop: "auto",
                  }}
                >
                  Read More
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "80px 24px",
              color: "#888",
            }}
          >
            <p style={{ fontSize: "32px", marginBottom: "16px" }}>📝</p>
            <p style={{ fontSize: "16px", fontWeight: 600, color: "#1a1a1a" }}>
              {searchParams.q ? `Tidak ada artikel untuk "${searchParams.q}"` : "Blog segera hadir"}
            </p>
            <p style={{ fontSize: "13px", marginTop: "8px" }}>
              {searchParams.q ? "Coba kata kunci lain." : "Admin sedang mempersiapkan konten."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
