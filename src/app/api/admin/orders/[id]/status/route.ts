import { NextResponse } from "next/server";
import { getDatabase, updateDatabase } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { getWhatsAppNotifyUrl } from "@/lib/whatsapp";
import type { OrderStatus } from "@/lib/types";
import { ORDER_STATUS_FLOW } from "@/lib/types";
import { notifyResellerOrderStatus } from "@/lib/notifications";

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
  const status = form.get("status") as OrderStatus;
  const resi = form.get("resi") ? String(form.get("resi")).trim() : undefined;
  const note = form.get("note") ? String(form.get("note")) : undefined;

  if (!ORDER_STATUS_FLOW.includes(status)) {
    return NextResponse.redirect(
      new URL(`/admin/pesanan?error=Status tidak valid`, request.url)
    );
  }

  const db = await getDatabase();
  const order = db.orders.find((o) => o.id === id);
  if (!order) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const now = new Date().toISOString();
  await updateDatabase((data) => {
    const o = data.orders.find((x) => x.id === id);
    if (o) {
      o.status = status;
      if (resi) o.resi = resi;
      o.statusHistory.push({ status, note, at: now });
      o.updatedAt = now;
    }
  });

  const latest = await getDatabase();
  const updated = latest.orders.find((o) => o.id === id)!;

  // Attempt automatic WhatsApp + email backup, but keep wa.me fallback link.
  await notifyResellerOrderStatus({
    db: latest,
    order: updated,
    newStatus: status,
    note,
  });
  const whatsappUrl = getWhatsAppNotifyUrl(updated, status, note);

  return NextResponse.redirect(
    new URL(
      `/admin/pesanan?updated=${id}&wa=${encodeURIComponent(whatsappUrl)}`,
      request.url
    )
  );
}
