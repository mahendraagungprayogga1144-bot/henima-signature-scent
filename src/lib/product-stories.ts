/**
 * Curated Kenzo-style Discover storytelling per product slug.
 */

export type ProductStory = {
  variantLabel: string;
  headline: string;
  description: string;
  topNotes?: string;
  middleNotes?: string;
  baseNotes?: string;
  /** Left-column scroll stack (Kenzo primary-images) */
  gallery: string[];
  /** Grey commitment band (image + copy) */
  commitment?: {
    title: string;
    body: string;
    image: string;
    footnote?: string;
  };
  /** OUR STORES-style dual tiles */
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
  /* Stack scrolls on the left while buy panel stays sticky */
  gallery: [
    "/products/afternoon/bottle.png",
    "/products/afternoon/lifestyle-car.jpg",
    "/products/afternoon/lifestyle-light.jpg",
    "/products/afternoon/bottle-duo.png",
  ],
  commitment: {
    title: "THE STORY BEHIND AFTERNOON",
    body:
      "Henima created AFTERNOON for the moments between departure and return — the quiet drive, the warm light, the hand that holds what matters. Every bottle carries that hour of belonging.",
    image: "/products/afternoon/bottle.png",
    footnote: "Extrait de parfum · lasting intimacy.",
  },
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
