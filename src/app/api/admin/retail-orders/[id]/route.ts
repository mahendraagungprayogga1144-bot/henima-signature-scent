import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/session";
import { Resend } from "resend";

const STATUS_LABELS: Record<string, string> = {
  pending_payment: "Menunggu Pembayaran",
  pending_confirmation: "Menunggu Konfirmasi",
  confirmed: "Pembayaran Dikonfirmasi",
  packed: "Sedang Dikemas",
  shipped: "Sedang Dikirim",
  delivered: "Pesanan Diterima",
  cancelled: "Dibatalkan",
};

const STATUS_MESSAGES: Record<string, string> = {
  paid: "Pembayaran kamu telah kami terima. Pesanan sedang kami siapkan.",
  processing: "Pesanan kamu sedang kami kemas dengan penuh perhatian.",
  confirmed: "Pembayaran kamu telah kami konfirmasi. Pesanan sedang kami siapkan.",
  packed: "Pesanan kamu sedang kami kemas dengan penuh perhatian.",
  shipped: "Pesanan kamu sudah dalam perjalanan menuju kamu!",
  delivered: "Pesanan kamu telah sampai. Semoga wewangian ini membawa kenangan indah.",
  cancelled: "Pesanan kamu telah dibatalkan. Hubungi kami jika ada pertanyaan.",
};

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { status, resi, note, courier_code } = await request.json();

  const { error } = await supabase
    .from("retail_orders")
    .update({ status, resi, courier_code, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Kirim email ke pelanggan
  try {
    const { data: order } = await supabase
      .from("retail_orders")
      .select("*")
      .eq("id", id)
      .single();

    const customerEmail = order.email || order.customer?.email || (typeof order.customer === 'string' ? JSON.parse(order.customer)?.email : order.customer?.email);
    const customerName = order.name || order.customer?.name || (typeof order.customer === 'string' ? JSON.parse(order.customer)?.name : order.customer?.name) || 'Pelanggan';
    if (order && customerEmail && STATUS_MESSAGES[status]) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const label = STATUS_LABELS[status] || status;
      const message = STATUS_MESSAGES[status];

      await resend.emails.send({
        from: "Henima Signature Scent <noreply@henimaofficial.com>",
        to: customerEmail,
        subject: `${label} - ${id}`,
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
                <h2 style="font-size:22px;font-weight:300;color:#1C1917;margin:0;">${id}</h2>
              </div>
              <p style="font-size:14px;color:#6B5E52;line-height:1.8;margin-bottom:32px;">
                Halo <strong>${order.name || 'Pelanggan'}</strong>, ${message}
              </p>
              ${order.items && order.items.length > 0 ? `
              <div style="margin-bottom:32px;">
                <p style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#9A8F82;margin-bottom:12px;">Rincian Pesanan</p>
                <table style="width:100%;border-collapse:collapse;">
                  ${order.items.map((item: any) => `
                  <tr>
                    <td style="padding:8px 0;border-bottom:1px solid #E8E0D5;font-size:13px;color:#1C1917;">${item.name || item.productName} ${item.size ? '(' + item.size + ')' : ''} x${item.qty || item.quantity || 1}</td>
                    <td style="padding:8px 0;border-bottom:1px solid #E8E0D5;font-size:13px;color:#1C1917;text-align:right;">Rp ${((item.price || 0) * (item.qty || item.quantity || 1)).toLocaleString('id-ID')}</td>
                  </tr>
                  `).join('')}
                  <tr>
                    <td style="padding:8px 0;font-size:13px;color:#6B5E52;">Subtotal</td>
                    <td style="padding:8px 0;font-size:13px;color:#6B5E52;text-align:right;">Rp ${(order.subtotal || 0).toLocaleString('id-ID')}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;font-size:13px;color:#6B5E52;">Ongkos Kirim</td>
                    <td style="padding:8px 0;font-size:13px;color:#6B5E52;text-align:right;">Rp ${(order.shipping_cost || 0).toLocaleString('id-ID')}</td>
                  </tr>
                  <tr>
                    <td style="padding:12px 0 0;font-size:15px;color:#1C1917;font-weight:bold;border-top:2px solid #1C1917;">Total</td>
                    <td style="padding:12px 0 0;font-size:15px;color:#1C1917;font-weight:bold;text-align:right;border-top:2px solid #1C1917;">Rp ${(order.total || 0).toLocaleString('id-ID')}</td>
                  </tr>
                </table>
              </div>
              ` : ''}
              ${resi && status === 'shipped' ? `
              <div style="background:#1C1917;padding:24px;margin-bottom:32px;color:#F0EBE3;text-align:center;">
                <p style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#C8B89A;margin-bottom:8px;">Nomor Resi</p>
                <p style="font-size:22px;font-weight:300;letter-spacing:4px;">${resi}</p>
              </div>
              ` : ''}
              ${note ? `
              <div style="background:#F0EBE3;padding:20px;margin-bottom:32px;">
                <p style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#9A8F82;margin-bottom:8px;">Catatan</p>
                <p style="font-size:13px;color:#1C1917;line-height:1.8;">${note}</p>
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
    }
  } catch(e) {
    console.error('Email error:', e);
  }

  return NextResponse.json({ ok: true });
}
