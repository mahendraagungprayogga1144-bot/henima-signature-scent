import { NextResponse } from "next/server";
import { updateDatabase } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import type { ProductVariant } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const form = await request.formData();
  const name = String(form.get("name") || "").trim();
  const originalPrice = Number(form.get("originalPrice")) || 0;
  const discountPrice = Number(form.get("discountPrice")) || originalPrice;
  const description = String(form.get("description") || "").trim();
  const active = form.get("active") === "on";
  const variantsRaw = form.get("variants");
  const photoUrl = form.get("photoUrl") as string | null;
  const photosRaw = form.get("photos");
  const video = form.get("video") as string | null;
  const topNotes = form.get("topNotes") as string || null;
  const comingSoon = form.get("comingSoon") === "true";
  const middleNotes = form.get("middleNotes") as string || null;
  const baseNotes = form.get("baseNotes") as string || null;
  const inspiration = form.get("inspiration") as string || null;
  const sillage = form.get("sillage") as string || null;
  const projection = form.get("projection") as string || null;
  const longevity = form.get("longevity") as string || null;
  const scentFamily = form.get("scentFamily") as string || null;

  if (originalPrice < 0 || discountPrice < 0) {
    return NextResponse.json({ error: "Harga tidak valid" }, { status: 400 });
  }

  let variants: ProductVariant[] | undefined;
  if (typeof variantsRaw === "string" && variantsRaw.trim()) {
    try {
      const parsed = JSON.parse(variantsRaw) as ProductVariant[];
      if (Array.isArray(parsed)) {
        variants = parsed.map((v) => ({
          id: String(v.id),
          sizeMl: v.sizeMl === 30 || v.sizeMl === 50 || v.sizeMl === 100 ? v.sizeMl : 50,
          sku: typeof v.sku === "string" ? v.sku : undefined,
          stock: Math.max(0, Number(v.stock) || 0),
          originalPrice: Math.max(0, Number(v.originalPrice) || 0),
          discountPrice: Math.max(0, Number(v.discountPrice) || 0),
          active: Boolean(v.active),
        }));
      }
    } catch {
      return new NextResponse("Variants JSON tidak valid", { status: 400 });
    }
  }

  let photos: string[] | undefined;
  if (typeof photosRaw === "string" && photosRaw.trim()) {
    try {
      const parsed = JSON.parse(photosRaw);
      if (Array.isArray(parsed)) photos = parsed.filter((u) => typeof u === "string" && u.startsWith("http"));
    } catch {
      return new NextResponse("Photos JSON tidak valid", { status: 400 });
    }
  }

  await updateDatabase((db) => {
    const product = db.products.find((p) => p.id === id);
    if (product) {
      if (name) product.name = name;
      product.originalPrice = originalPrice;
      product.discountPrice = discountPrice;
      product.description = description || product.description;
      product.active = active;
      if (photos !== undefined) {
        product.photos = photos;
        if (photos.length > 0) product.photo = photos[0];
      } else if (photoUrl && photoUrl.startsWith("http")) {
        product.photo = photoUrl;
        product.photos = [photoUrl];
      }
      if (video !== null) product.video = video || undefined;
      if (topNotes !== null) (product as any).topNotes = topNotes;
      (product as any).comingSoon = comingSoon;
      if (middleNotes !== null) (product as any).middleNotes = middleNotes;
      if (baseNotes !== null) (product as any).baseNotes = baseNotes;
      if (inspiration !== null) (product as any).inspiration = inspiration;
      if (sillage !== null) (product as any).sillage = sillage;
      if (projection !== null) (product as any).projection = projection;
      if (longevity !== null) (product as any).longevity = longevity;
      if (scentFamily !== null) (product as any).scentFamily = scentFamily;
      if (variants) product.variants = variants;
    }
  });

  return NextResponse.json({ ok: true });
}
