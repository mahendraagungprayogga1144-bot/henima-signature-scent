import { NextResponse } from "next/server";
import { getDatabase, updateDatabase } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { generateInvoicePdf } from "@/lib/invoice";
import { notifyResellerOrderStatus } from "@/lib/notifications";

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

  const db = await getDatabase();
  const order = db.orders.find((o) => o.id === id);
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (!order.paymentProof) {
    return NextResponse.json(
      { error: "Bukti pembayaran belum diunggah" },
      { status: 400 }
    );
  }

  const now = new Date().toISOString();
  const { publicPath } = await generateInvoicePdf({ order: { ...order, paymentConfirmedAt: now }, settings: db.settings });

  await updateDatabase((data) => {
    const o = data.orders.find((x) => x.id === id);
    if (!o) return;
    o.paymentConfirmedAt = now;
    o.invoicePdf = publicPath;
    if (o.status === "pending_confirmation" || o.status === "pending_payment") {
      o.status = "confirmed";
      o.statusHistory.push({ status: "confirmed", at: now, note: "Pembayaran dikonfirmasi" });
    }
    o.updatedAt = now;
  });

  try {
    const latest = await getDatabase();
    const updated = latest.orders.find((o) => o.id === id);
    if (updated) {
      await notifyResellerOrderStatus({
        db: latest,
        order: updated,
        newStatus: "confirmed",
        note: "Pembayaran dikonfirmasi",
      });
    }
  } catch {
    // ignore
  }

  return NextResponse.redirect(new URL(`/admin/pesanan?updated=${id}`, request.url));
}

