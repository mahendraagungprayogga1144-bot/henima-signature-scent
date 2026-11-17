/**
 * Curated Kenzo-style Discover storytelling per product slug.
 */

export type ProductStory = {
  /** Small grey line — e.g. "AFTERNOON EXTRAIT DE PARFUM" */
  variantLabel: string;
  /** Big title — e.g. AFTERNOON */
  headline: string;
  /** One short paragraph like Kenzo product-desc */
  description: string;
  topNotes?: string;
  middleNotes?: string;
  baseNotes?: string;
  /** Primary PDP gallery (bottle shots only — Kenzo style) */
  gallery: string[];
  /** Lifestyle dual band under the PDP */
  lifestyle: { src: string; title: string; cta: string }[];
  lineTitle: string;
};

const AFTERNOON: ProductStory = {
  headline: "AFTERNOON",
  variantLabel: "AFTERNOON EXTRAIT DE PARFUM",
  description:
    "AFTERNOON, a floral woody extrait inspired by the golden hour. Bright citrus and green apple open like late sunlight; lavender and jasmine bloom at the heart; vanilla, pepper and soft woods linger long after the afternoon fades.",
  topNotes: "Citrus, Green Apple",
  middleNotes: "Lavender, Jasmine",
  baseNotes: "Vanilla, Pepper, Patchouli",
  gallery: [
    "/products/afternoon/bottle.png",
    "/products/afternoon/bottle-duo.png",
  ],
  lifestyle: [
    {
      src: "/products/afternoon/lifestyle-car.jpg",
      title: "THE GOLDEN HOUR",
      cta: "Discover Afternoon ›",
    },
    {
      src: "/products/afternoon/lifestyle-light.jpg",
      title: "AFTERNOON",
      cta: "The story behind ›",
    },
  ],
  lineTitle: "THE AFTERNOON LINE",
};

const STORIES: Record<string, ProductStory> = {
  afternoon: AFTERNOON,
};

export function getProductStory(slug: string): ProductStory | null {
  return STORIES[slug] || null;
}

/** When a curated story exists, use its gallery only (ignore broken CMS remote sets). */
export function mergeProductGallery(
  slug: string,
  photos: string[],
  story: ProductStory | null
): string[] {
  if (story?.gallery?.length) return [...story.gallery];
  const seen = new Set<string>();
  return photos.filter((url) => {
    if (!url || seen.has(url)) return false;
    seen.add(url);
    return true;
  });
}
