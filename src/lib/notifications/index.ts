import type { Database, Order, OrderStatus } from "@/lib/types";
import { notifyResellerStatusChange, sendWhatsAppMessage } from "./whatsapp";
import { sendEmail } from "./email";

export async function notifyAdminNewOrder(params: {
  db: Database;
  order: Order;
}) {
  const toPhone =
    params.db.settings.company.whatsappNumber || process.env.ADMIN_WHATSAPP_NUMBER;
  if (!toPhone) return;

  const message = [
    `New order: *${params.order.id.toUpperCase()}*`,
    `Reseller: ${params.order.resellerName} (${params.order.storeName})`,
    `Total: Rp ${params.order.total.toLocaleString("id-ID")}`,
    `Status: ${params.order.status}`,
  ].join("\n");

  await sendWhatsAppMessage({ toPhone, message });
}

export async function notifyResellerOrderStatus(params: {
  db: Database;
  order: Order;
  newStatus: OrderStatus;
  note?: string;
}) {
  const wa = await notifyResellerStatusChange({
    order: params.order,
    newStatus: params.newStatus,
    note: params.note,
  });

  // Email backup (best-effort): send to reseller email if present.
  const reseller = params.db.users.find((u) => u.id === params.order.resellerId);
  if (reseller?.email) {
    const subject = `Update pesanan ${params.order.id}`;
    const text = `Status pesanan Anda: ${params.newStatus}\n\nOrder: ${params.order.id}\nTotal: Rp ${params.order.total.toLocaleString(
      "id-ID"
    )}\n\nCatatan: ${params.note || "-"}`;
    await sendEmail({ to: reseller.email, subject, text });
  }

  return wa;
}

