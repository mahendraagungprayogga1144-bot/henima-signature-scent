import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://henimaofficial.com", lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: "https://henimaofficial.com/blog", lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: "https://henimaofficial.com/katalog-digital", lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: "https://henimaofficial.com/galeri", lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: "https://henimaofficial.com/masuk", lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: "https://henimaofficial.com/daftar", lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 },
  ];
}
