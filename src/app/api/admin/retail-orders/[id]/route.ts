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

  const { status, resi, note } = await request.json();

  const { error } = await supabase
    .from("retail_orders")
    .update({ status, resi, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Kirim email ke pelanggan
  try {
    const { data: order } = await supabase
      .from("retail_orders")
      .select("*")
      .eq("id", id)
      .single();

    if (order && order.email && STATUS_MESSAGES[status]) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const label = STATUS_LABELS[status] || status;
      const message = STATUS_MESSAGES[status];

      await resend.emails.send({
        from: "Henima Signature Scent <noreply@henimaofficial.com>",
        to: order.email,
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
