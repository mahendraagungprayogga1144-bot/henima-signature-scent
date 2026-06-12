import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/shop", "/blog", "/our-story", "/galeri", "/quiz", "/love-letters", "/share-story", "/tracking", "/wishlist"],
        disallow: ["/admin", "/api", "/profil", "/edit-profil", "/checkout", "/pembayaran", "/cart"],
      }
    ],
    sitemap: "https://henimaofficial.com/sitemap.xml",
  };
}
