import type { Order, OrderStatus } from "./types";
import { ORDER_STATUS_LABELS } from "./types";

export function formatOrderStatusMessage(
  order: Order,
  newStatus: OrderStatus,
  note?: string
): string {
  const statusLabel = ORDER_STATUS_LABELS[newStatus];
  const lines = [
    `Halo ${order.resellerName},`,
    "",
    `Status pesanan *${order.id.toUpperCase()}* telah diperbarui:`,
    `📦 *${statusLabel}*`,
    "",
    `Toko: ${order.storeName}`,
    `Total: Rp ${order.total.toLocaleString("id-ID")}`,
  ];
  if (note) {
    lines.push("", `Catatan: ${note}`);
  }
  lines.push("", "Terima kasih telah berbelanja!");
  return lines.join("\n");
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  const normalized = phone.replace(/\D/g, "");
  const withCountry =
    normalized.startsWith("0")
      ? `62${normalized.slice(1)}`
      : normalized.startsWith("62")
        ? normalized
        : `62${normalized}`;
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${withCountry}?text=${encoded}`;
}

export function getWhatsAppNotifyUrl(
  order: Order,
  newStatus: OrderStatus,
  note?: string
): string {
  const message = formatOrderStatusMessage(order, newStatus, note);
  return buildWhatsAppUrl(order.resellerPhone, message);
}
