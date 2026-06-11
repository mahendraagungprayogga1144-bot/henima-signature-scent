content = open("src/app/api/orders/create/route.ts").read()

# Tambah import Resend
new_content = content.replace(
    'import { NextResponse } from "next/server";\nimport { supabase } from "@/lib/supabase";',
    'import { NextResponse } from "next/server";\nimport { supabase } from "@/lib/supabase";\nimport { Resend } from "resend";'
)

# Tambah kirim email setelah WA notifikasi
new_content = new_content.replace(
    '  return NextResponse.json({ orderId });',
    '''  // Kirim email invoice ke customer
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const itemsHtml = items.map((i: any) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;">${i.productName} ${i.sizeMl}ml</td>
        <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;text-align:center;">${i.quantity}</td>
        <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;text-align:right;">Rp ${(i.price * i.quantity).toLocaleString("id-ID")}</td>
      </tr>`).join("");

    await resend.emails.send({
      from: "Henima Signature Scent <noreply@henimaofficial.com>",
      to: email,
      subject: `Order Confirmed - ${orderId}`,
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
              <p style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#B5935A;margin-bottom:8px;">Order Confirmed</p>
              <h2 style="font-size:22px;font-weight:300;color:#1C1917;margin:0;">${orderId}</h2>
            </div>

            <p style="font-size:14px;color:#6B5E52;line-height:1.8;margin-bottom:32px;">
              Halo <strong>${name}</strong>, terima kasih telah berbelanja di Henima Signature Scent. Pesanan kamu telah kami terima dan sedang menunggu konfirmasi pembayaran.
            </p>

            <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
              <thead>
                <tr>
                  <th style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#9A8F82;text-align:left;padding-bottom:12px;border-bottom:2px solid #1C1917;">Produk</th>
                  <th style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#9A8F82;text-align:center;padding-bottom:12px;border-bottom:2px solid #1C1917;">Qty</th>
                  <th style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#9A8F82;text-align:right;padding-bottom:12px;border-bottom:2px solid #1C1917;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <div style="background:#F0EBE3;padding:20px;margin-bottom:32px;">
              <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
                <span style="font-size:13px;color:#9A8F82;">Subtotal</span>
                <span style="font-size:13px;color:#1C1917;">Rp ${Number(subtotal).toLocaleString("id-ID")}</span>
              </div>
              <div style="display:flex;justify-content:space-between;margin-bottom:16px;">
                <span style="font-size:13px;color:#9A8F82;">Ongkir (${courierName})</span>
                <span style="font-size:13px;color:#1C1917;">Rp ${Number(shippingCost).toLocaleString("id-ID")}</span>
              </div>
              <div style="display:flex;justify-content:space-between;">
                <span style="font-size:15px;font-weight:600;color:#1C1917;">Total</span>
                <span style="font-size:15px;font-weight:600;color:#1C1917;">Rp ${Number(total).toLocaleString("id-ID")}</span>
              </div>
            </div>

            <div style="background:#1C1917;padding:24px;margin-bottom:32px;color:#F0EBE3;">
              <p style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#C8B89A;margin-bottom:12px;">Informasi Pembayaran</p>
              <p style="font-size:13px;line-height:1.8;font-weight:300;">
                Bank BCA · No. Rek: 2712008173<br>
                Atas Nama: PT Henima Collection Indo<br>
                Jumlah: <strong>Rp ${Number(total).toLocaleString("id-ID")}</strong>
              </p>
            </div>

            <div style="background:#F0EBE3;padding:20px;margin-bottom:32px;">
              <p style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#9A8F82;margin-bottom:10px;">Alamat Pengiriman</p>
              <p style="font-size:13px;color:#1C1917;line-height:1.8;">${address}<br>${city}, ${province} ${postalCode}</p>
            </div>

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
    console.log("Email invoice sent to:", email);
  } catch (e) {
    console.error("Email error:", e);
  }

  return NextResponse.json({ orderId });'''
)

open("src/app/api/orders/create/route.ts", "w").write(new_content)
print("Done!")
