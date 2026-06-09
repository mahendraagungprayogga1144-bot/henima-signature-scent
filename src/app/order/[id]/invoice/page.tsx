import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: order } = await supabase
    .from("retail_orders")
    .select("*")
    .eq("id", id)
    .single();

  if (!order) notFound();

  const date = new Date(order.created_at).toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric"
  });

  const html = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Invoice ${order.id} — Henima</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; background: #fff; color: #1C1917; }
.page { max-width: 600px; margin: 0 auto; padding: 60px 40px; }
.header { text-align: center; margin-bottom: 48px; padding-bottom: 32px; border-bottom: 2px solid #1C1917; }
.brand { font-size: 28px; letter-spacing: 8px; text-transform: uppercase; font-weight: 300; margin-bottom: 4px; }
.tagline { font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: #9A8F82; }
.section-title { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #9A8F82; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid rgba(28,25,23,0.1); }
.box { background: #FAF8F4; padding: 20px; margin-bottom: 32px; }
table { width: 100%; border-collapse: collapse; margin-bottom: 32px; }
th { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #9A8F82; padding: 8px 0; border-bottom: 1px solid rgba(28,25,23,0.15); text-align: left; }
td { padding: 14px 0; border-bottom: 1px solid rgba(28,25,23,0.06); font-size: 13px; }
.totals { margin-left: auto; width: 280px; }
.row { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 8px; }
.total-row { display: flex; justify-content: space-between; font-size: 16px; font-weight: 700; margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(28,25,23,0.15); }
.payment-box { margin-top: 40px; background: #1C1917; padding: 24px; color: #F0EBE3; }
.footer { margin-top: 48px; padding-top: 32px; border-top: 1px solid rgba(28,25,23,0.1); text-align: center; }
.print-btn { position: fixed; bottom: 24px; right: 24px; background: #1C1917; color: #fff; border: none; padding: 12px 24px; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; cursor: pointer; }
@media print { .print-btn { display: none !important; } }
</style>
</head>
<body>
<div class="page">
  <div class="header">
    <div class="brand">Henima</div>
    <div class="tagline">Signature Scent · Made in Indonesia</div>
  </div>
  <div style="display:flex;justify-content:space-between;margin-bottom:40px">
    <div>
      <h2 style="font-size:20px;font-weight:600;margin-bottom:8px">Invoice</h2>
      <p style="font-size:12px;color:#9A8F82">${order.id}</p>
    </div>
    <div style="text-align:right">
      <p style="font-size:12px;color:#6B6560;margin-bottom:4px">Tanggal: <strong>${date}</strong></p>
      <p style="font-size:12px;color:#6B6560">Status: <strong>${order.status === "pending_payment" ? "Menunggu Pembayaran" : "Lunas"}</strong></p>
    </div>
  </div>
  <div style="margin-bottom:32px">
    <div class="section-title">Dikirim Kepada</div>
    <div class="box">
      <p style="font-weight:500;margin-bottom:4px">${order.customer?.name || ""}</p>
      <p style="font-size:13px;color:#6B6560">${order.customer?.phone || ""}</p>
      ${order.customer?.email ? `<p style="font-size:13px;color:#6B6560">${order.customer.email}</p>` : ""}
      <p style="font-size:13px;color:#6B6560;margin-top:8px">${order.customer?.address || ""}</p>
      <p style="font-size:13px;color:#6B6560">${order.customer?.city || ""}, ${order.customer?.province || ""} ${order.customer?.postalCode || ""}</p>
    </div>
  </div>
  <div style="margin-bottom:32px">
    <div class="section-title">Detail Pesanan</div>
    <table>
      <thead><tr><th>Produk</th><th style="text-align:center">Qty</th><th style="text-align:right">Harga</th><th style="text-align:right">Total</th></tr></thead>
      <tbody>
        ${(order.items || []).map((item: any) => `
        <tr>
          <td><div style="font-weight:500">${item.productName}</div><div style="font-size:11px;color:#9A8F82">${item.sizeMl}ml · Extrait de Parfum</div></td>
          <td style="text-align:center">${item.quantity}</td>
          <td style="text-align:right">Rp ${item.price?.toLocaleString("id-ID")}</td>
          <td style="text-align:right;font-weight:500">Rp ${(item.price * item.quantity)?.toLocaleString("id-ID")}</td>
        </tr>`).join("")}
      </tbody>
    </table>
  </div>
  <div class="totals">
    <div class="row"><span style="color:#9A8F82">Subtotal</span><span>Rp ${order.subtotal?.toLocaleString("id-ID")}</span></div>
    <div class="row"><span style="color:#9A8F82">Ongkir (${order.courier})</span><span>Rp ${order.shipping_cost?.toLocaleString("id-ID")}</span></div>
    <div class="total-row"><span>Total</span><span>Rp ${order.total?.toLocaleString("id-ID")}</span></div>
  </div>
  <div class="payment-box">
    <p style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:rgba(200,184,154,0.6);margin-bottom:12px">Informasi Pembayaran</p>
    <p style="font-size:13px;line-height:1.8;font-weight:300">Silakan konfirmasi pembayaran via WhatsApp ke <strong style="color:#C8B89A">+62 851-9031-1230</strong> dengan menyertakan Order ID di atas.</p>
  </div>
  <div class="footer">
    <p style="font-weight:600;color:#1C1917;margin-bottom:4px">henimaofficial.com</p>
    <p style="font-size:11px;color:#9A8F82">Terima kasih telah berbelanja di Henima Signature Scent.</p>
    <p style="font-size:11px;color:#9A8F82">Setiap parfum dibuat dengan cinta untuk meninggalkan kesan yang tak terlupakan.</p>
  </div>
</div>
<button class="print-btn" onclick="window.print()">Print / Save PDF</button>
</body>
</html>`;

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
