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
  /* No dual lifestyle tiles — same photos already in left gallery stack */
  lifestyle: [],
  lineTitle: "THE AFTERNOON LINE",
}

const STORIES: Record<string, ProductStory> = {
  afternoon: AFTERNOON,
};

export function getProductStory(slug: string): ProductStory | null {
  return STORIES[slug] || null;
}

function isUsableGalleryUrl(url: string) {
  return (
    !!url &&
    !url.includes("placeholder") &&
    !url.endsWith(".svg") &&
    (url.startsWith("http") || url.startsWith("/"))
  );
}

/**
 * Prefer admin-uploaded product photos. Fall back to curated story gallery
 * only when the product has no usable CMS photos yet.
 */
export function mergeProductGallery(
  _slug: string,
  photos: string[],
  story: ProductStory | null
): string[] {
  const seen = new Set<string>();
  const fromAdmin = photos.filter((url) => {
    if (!isUsableGalleryUrl(url) || seen.has(url)) return false;
    seen.add(url);
    return true;
  });
  if (fromAdmin.length > 0) return fromAdmin;

  const fromStory = (story?.gallery || []).filter((url) => {
    if (!isUsableGalleryUrl(url) || seen.has(url)) return false;
    seen.add(url);
    return true;
  });
  return fromStory;
}
