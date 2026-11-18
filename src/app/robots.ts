import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/api",
          "/profil",
          "/edit-profil",
          "/checkout",
          "/pembayaran",
          "/cart",
          "/order",
        ],
      },
    ],
    host: "https://henimaofficial.com",
    sitemap: "https://henimaofficial.com/sitemap.xml",
  };
}
