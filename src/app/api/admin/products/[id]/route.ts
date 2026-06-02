import { NextResponse } from "next/server";
import { updateDatabase } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import type { ProductVariant } from "@/lib/types";
import { promises as fs } from "fs";
import path from "path";

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
  const originalPrice =
    Number(form.get("originalPrice")) || Number(form.get("price")) || 0;
  const discountPrice =
    Number(form.get("discountPrice")) ||
    Number(form.get("price")) ||
    originalPrice;
  const description = String(form.get("description") || "").trim();
  const active = form.get("active") === "on";
  const variantsRaw = form.get("variants");
  const photo = form.get("photo") as File | null;

  if (originalPrice < 0 || discountPrice < 0) {
    return NextResponse.redirect(
      new URL("/admin/produk?error=Harga tidak valid", request.url)
    );
  }

  let photoPath: string | undefined;
  if (photo && photo.size > 0) {
    const bytes = await photo.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = photo.name.split(".").pop() || "jpg";
    const filename = `${id}-${Date.now()}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", "products");
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(path.join(uploadDir, filename), buffer);
    photoPath = `/uploads/products/${filename}`;
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

  await updateDatabase((db) => {
    const product = db.products.find((p) => p.id === id);
    if (product) {
      if (name) product.name = name;
      product.originalPrice = originalPrice;
      product.discountPrice = discountPrice;
      product.description = description || product.description;
      product.active = active;
      if (photoPath) product.photo = photoPath;
      if (variants) product.variants = variants;
    }
  });

  return NextResponse.json({ ok: true });
}
