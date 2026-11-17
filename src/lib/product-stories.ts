/**
 * Curated Kenzo-style Discover storytelling per product slug.
 * Merges with CMS/product DB fields when present.
 */

export type ProductStory = {
  /** Small line above big title — e.g. "Extrait de Parfum" */
  variantLabel: string;
  /** Big category title — e.g. AFTERNOON */
  headline: string;
  /** Long narrative paragraphs */
  paragraphs: string[];
  topNotes?: string;
  middleNotes?: string;
  baseNotes?: string;
  /** Extra gallery / story images (lifestyle) */
  gallery: string[];
  storyBandTitle: string;
  storyBandExtra?: string;
};

const AFTERNOON: ProductStory = {
  headline: "AFTERNOON",
  variantLabel: "Extrait de Parfum",
  paragraphs: [
    "AFTERNOON, an enveloping floral-woody extrait inspired by the golden hour — when the day softens, and every memory feels closer.",
    "From the first spray, bright citrus and crisp green apple open like late sunlight through leaves. At the heart, lavender and jasmine bloom with a quiet warmth, never loud, always present. The base settles into vanilla, pepper, and soft woods — a trail that stays with you long after the afternoon fades.",
    "Crafted as an extrait de parfum for lasting intimacy. AFTERNOON is not just a scent for a time of day — it is the feeling of arriving somewhere you belong.",
  ],
  topNotes: "Citrus, Green Apple",
  middleNotes: "Lavender, Jasmine",
  baseNotes: "Vanilla, Pepper, Patchouli",
  gallery: [
    "/layout/product-1.jpg",
    "/products/afternoon/lifestyle-car.jpg",
    "/products/afternoon/lifestyle-light.jpg",
  ],
  storyBandTitle: "THE STORY BEHIND AFTERNOON",
  storyBandExtra:
    "Henima created AFTERNOON for the moments between departure and return — the quiet drive, the warm light, the hand that holds what matters. Every bottle carries that hour of belonging.",
};

const STORIES: Record<string, ProductStory> = {
  afternoon: AFTERNOON,
  "the-distance": {
    headline: "THE DISTANCE",
    variantLabel: "Extrait de Parfum",
    paragraphs: [
      "THE DISTANCE, a warm and intimate extrait that turns miles into a promise.",
      "Built for longing that never cools — soft woods and skin-close warmth that feel like a message sent across the night.",
    ],
    topNotes: "Bergamot, Soft Spice",
    middleNotes: "Rose, Warm Woods",
    baseNotes: "Amber, Musk",
    gallery: ["/layout/product-2.jpg"],
    storyBandTitle: "THE STORY BEHIND THE DISTANCE",
  },
};

export function getProductStory(slug: string): ProductStory | null {
  return STORIES[slug] || null;
}

export function mergeProductGallery(
  slug: string,
  photos: string[],
  story: ProductStory | null
): string[] {
  const curated = story?.gallery || [];
  const merged = [...curated, ...photos];
  const seen = new Set<string>();
  return merged.filter((url) => {
    if (!url || seen.has(url)) return false;
    seen.add(url);
    return true;
  });
}
