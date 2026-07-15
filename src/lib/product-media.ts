export function normalizeProductPhotos(value: unknown, fallbackPhoto?: string): string[] {
  const urls: string[] = [];

  if (Array.isArray(value)) {
    for (const item of value) {
      if (typeof item === "string" && item.trim()) urls.push(item.trim());
    }
  } else if (typeof value === "string" && value.trim()) {
    const trimmed = value.trim();
    if (trimmed.startsWith("[")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) return normalizeProductPhotos(parsed, fallbackPhoto);
      } catch {
        /* ignore malformed JSON */
      }
    }
    if (trimmed.startsWith("http") || trimmed.startsWith("/")) urls.push(trimmed);
  }

  if (urls.length > 0) return urls;

  const fallback = typeof fallbackPhoto === "string" ? fallbackPhoto.trim() : "";
  return fallback ? [fallback] : [];
}

export function getProductPhotoList(product: { photo?: string; photos?: unknown }): string[] {
  return normalizeProductPhotos(product.photos, product.photo);
}

export function isValidMediaUrl(url: string): boolean {
  return typeof url === "string" && (url.startsWith("http") || url.startsWith("/"));
}

export type GalleryMedia =
  | { type: "image"; url: string }
  | { type: "video"; url: string };

export function buildProductMedia(photos: string[], video?: string): GalleryMedia[] {
  const media: GalleryMedia[] = [];
  if (video && isValidMediaUrl(video)) media.push({ type: "video", url: video });
  for (const url of photos) {
    if (isValidMediaUrl(url) && (!video || url !== video)) media.push({ type: "image", url });
  }
  return media;
}
