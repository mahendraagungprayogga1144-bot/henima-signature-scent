import { NextResponse } from "next/server";
import { updateDatabase } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

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

  await updateDatabase((db) => {
    db.products = db.products.filter((p) => p.id !== id);
  });

  return NextResponse.json({ ok: true });
}

