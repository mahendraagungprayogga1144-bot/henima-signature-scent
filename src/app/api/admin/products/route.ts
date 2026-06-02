import { NextResponse } from "next/server";
import { updateDatabase } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { generateId } from "@/lib/auth";
import type { ProductVariant } from "@/lib/types";
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const form = await request.formData();
  const name = String(form.get("name") || "").trim();
  const description = String(form.get("description") || "").trim();
  const originalPrice = Number(form.get("originalPrice") || 0);
  const discountPrice = Number(form.get("discountPrice") || 0);
  const photo = form.get("photo") as File | null;

  if (!name) return new NextResponse("Nama produk wajib diisi", { status: 400 });
  if (originalPrice < 0 || discountPrice < 0) {
    return new NextResponse("Harga tidak valid", { status: 400 });
  }

  const id = generateId("prod");

  let photoPath = "/products/placeholder.svg";
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

  const variants: ProductVariant[] = ([30, 50, 100] as const).map((sizeMl) => ({
    id: `${id}-${sizeMl}`,
    sizeMl,
    stock: 0,
    originalPrice,
    discountPrice,
    active: true,
  }));

  await updateDatabase((db) => {
    db.products.push({
      id,
      name,
      description,
      photo: photoPath,
      originalPrice,
      discountPrice,
      active: true,
      variants,
    });
  });

  return NextResponse.json({ ok: true, id });
}

