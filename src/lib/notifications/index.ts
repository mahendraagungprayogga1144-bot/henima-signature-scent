import type { Database, Order, OrderStatus } from "@/lib/types";
import { sendWhatsAppMessage } from "./whatsapp";
import { Resend } from "resend";

const STATUS_LABELS: Record<string, string> = {
  pending_payment: "Menunggu Pembayaran",
  paid: "Pembayaran Dikonfirmasi",
  processing: "Sedang Diproses",
  shipped: "Sedang Dikirim",
  delivered: "Pesanan Diterima",
  cancelled: "Dibatalkan",
};

const STATUS_MESSAGES: Record<string, string> = {
  paid: "Pembayaran kamu telah kami konfirmasi. Pesanan sedang kami siapkan.",
  processing: "Pesanan kamu sedang kami kemas dengan penuh perhatian.",
  shipped: "Pesanan kamu sudah dalam perjalanan menuju kamu!",
  delivered: "Pesanan kamu telah sampai. Semoga wewangian ini membawa kenangan indah.",
  cancelled: "Pesanan kamu telah dibatalkan. Hubungi kami jika ada pertanyaan.",
};

export async function notifyAdminNewOrder(params: {
  db: Database;
  order: Order;
}) {
  const toPhone = params.db.settings.company.whatsappNumber || process.env.ADMIN_WHATSAPP_NUMBER;
  if (!toPhone) return;
  const message = [
    `New order: *${params.order.id.toUpperCase()}*`,
    `Customer: ${params.order.customerName || params.order.resellerName}`,
    `Total: Rp ${params.order.total.toLocaleString("id-ID")}`,
    `Status: ${params.order.status}`,
  ].join("\n");
  await sendWhatsAppMessage({ toPhone, message });
}

export async function notifyCustomerOrderStatus(params: {
  db: Database;
  order: Order;
  newStatus: OrderStatus;
  note?: string;
}) {
  const customerEmail = (params.order as any).email || (params.order as any).customerEmail;
  const customerName = (params.order as any).customerName || (params.order as any).resellerName || "Pelanggan";
  if (!customerEmail) return { ok: false };

  const label = STATUS_LABELS[params.newStatus] || params.newStatus;
  const message = STATUS_MESSAGES[params.newStatus] || "Status pesanan kamu telah diperbarui.";
  const resi = (params.order as any).resi;

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "Henima Signature Scent <noreply@henimaofficial.com>",
      to: customerEmail,
      subject: `${label} - ${params.order.id}`,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="font-family:Georgia,serif;background:#FAF8F4;margin:0;padding:0;">
          <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
            
            <div style="text-align:center;margin-bottom:40px;">
              <h1 style="font-family:Georgia,serif;font-size:28px;font-weight:300;letter-spacing:8px;color:#1C1917;margin:0;">HENIMA</h1>
              <p style="font-size:10px;letter-spacing:3px;color:#9A8F82;text-transform:uppercase;margin-top:4px;">Signature Scent</p>
            </div>

            <div style="border-top:1px solid #E8E0D5;border-bottom:1px solid #E8E0D5;padding:32px 0;margin-bottom:32px;text-align:center;">
              <p style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#B5935A;margin-bottom:8px;">${label}</p>
              <h2 style="font-size:22px;font-weight:300;color:#1C1917;margin:0;">${params.order.id}</h2>
            </div>

            <p style="font-size:14px;color:#6B5E52;line-height:1.8;margin-bottom:32px;">
              Halo <strong>${customerName}</strong>, ${message}
            </p>

            ${resi && params.newStatus === 'shipped' ? `
            <div style="background:#1C1917;padding:24px;margin-bottom:32px;color:#F0EBE3;text-align:center;">
              <p style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#C8B89A;margin-bottom:8px;">Nomor Resi</p>
              <p style="font-size:22px;font-weight:300;letter-spacing:4px;">${resi}</p>
            </div>
            ` : ''}

            ${params.note ? `
            <div style="background:#F0EBE3;padding:20px;margin-bottom:32px;">
              <p style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#9A8F82;margin-bottom:8px;">Catatan</p>
              <p style="font-size:13px;color:#1C1917;line-height:1.8;">${params.note}</p>
            </div>
            ` : ''}

            <div style="text-align:center;margin-bottom:32px;">
              <a href="https://henimaofficial.com/tracking" style="display:inline-block;background:#1C1917;color:#FAF8F4;padding:14px 32px;font-size:10px;letter-spacing:3px;text-transform:uppercase;text-decoration:none;">Track Order</a>
            </div>

            <p style="font-size:11px;color:#9A8F82;text-align:center;line-height:1.8;">
              Ada pertanyaan? Hubungi kami via WhatsApp<br>
              <a href="https://wa.me/6285190311230" style="color:#B5935A;">085190311230</a>
            </p>

            <div style="border-top:1px solid #E8E0D5;margin-top:32px;padding-top:24px;text-align:center;">
              <p style="font-size:10px;color:#C8B89A;letter-spacing:2px;">HENIMA SIGNATURE SCENT · MADE IN INDONESIA</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
    return { ok: true };
  } catch(e) {
    console.error('Email error:', e);
    return { ok: false };
  }
}

// Keep backward compat
export const notifyResellerOrderStatus = notifyCustomerOrderStatus;
