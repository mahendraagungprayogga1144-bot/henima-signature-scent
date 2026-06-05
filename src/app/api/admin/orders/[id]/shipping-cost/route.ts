import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { updateDatabase } from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { shippingCost } = await req.json();
  await updateDatabase((db) => {
    const order = db.orders.find((o) => o.id === id);
    if (order) {
      (order as any).shippingCost = Number(shippingCost) || 0;
      order.updatedAt = new Date().toISOString();
    }
  });
  return NextResponse.json({ ok: true });
}
