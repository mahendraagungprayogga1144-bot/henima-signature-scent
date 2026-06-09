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

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <title>Invoice {order.id} — Henima</title>
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; background: #fff; color: #1C1917; }
          .page { max-width: 600px; margin: 0 auto; padding: 60px 40px; }
          .header { text-align: center; margin-bottom: 48px; padding-bottom: 32px; border-bottom: 2px solid #1C1917; }
          .brand { font-size: 28px; letter-spacing: 8px; text-transform: uppercase; font-weight: 300; margin-bottom: 4px; }
          .tagline { font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: #9A8F82; }
          .invoice-meta { display: flex; justify-content: space-between; margin-bottom: 40px; }
          .meta-left h2 { font-size: 20px; font-weight: 600; margin-bottom: 8px; }
          .meta-left p { font-size: 12px; color: #9A8F82; }
          .meta-right { text-align: right; }
          .meta-right p { font-size: 12px; color: #6B6560; margin-bottom: 4px; }
          .meta-right strong { color: #1C1917; }
          .section-title { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #9A8F82; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid rgba(28,25,23,0.1); }
          .customer-box { background: #FAF8F4; padding: 20px; margin-bottom: 32px; }
          .customer-box p { font-size: 13px; color: #4A4440; line-height: 1.8; }
          .items-table { width: 100%; border-collapse: collapse; margin-bottom: 32px; }
          .items-table th { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #9A8F82; padding: 8px 0; border-bottom: 1px solid rgba(28,25,23,0.15); text-align: left; }
          .items-table th:last-child { text-align: right; }
          .items-table td { padding: 14px 0; border-bottom: 1px solid rgba(28,25,23,0.06); font-size: 13px; vertical-align: top; }
          .items-table td:last-child { text-align: right; font-weight: 500; }
          .totals { margin-left: auto; width: 280px; }
          .totals-row { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 8px; }
          .totals-row span:first-child { color: #9A8F82; }
          .totals-divider { height: 1px; background: rgba(28,25,23,0.1); margin: 12px 0; }
          .totals-total { display: flex; justify-content: space-between; font-size: 16px; font-weight: 700; }
          .status-badge { display: inline-block; background: #1C1917; color: #FAF8F4; font-size: 9px; letter-spacing: 2px; text-transform: uppercase; padding: 4px 12px; margin-bottom: 32px; }
          .footer { margin-top: 48px; padding-top: 32px; border-top: 1px solid rgba(28,25,23,0.1); text-align: center; }
          .footer p { font-size: 11px; color: #9A8F82; line-height: 1.8; }
          .footer .website { font-size: 12px; font-weight: 600; color: #1C1917; letter-spacing: 1px; margin-bottom: 4px; }
          .print-btn { position: fixed; bottom: 24px; right: 24px; background: #1C1917; color: #fff; border: none; padding: 12px 24px; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; cursor: pointer; }
          @media print { .print-btn { display: none; } body { padding: 0; } }
        `}</style>
      </head>
      <body>
        <div className="page">
          {/* HEADER */}
          <div className="header">
            <div className="brand">Henima</div>
            <div className="tagline">Signature Scent · Made in Indonesia</div>
          </div>

          {/* INVOICE META */}
          <div className="invoice-meta">
            <div className="meta-left">
              <h2>Invoice</h2>
              <p>{order.id}</p>
            </div>
            <div className="meta-right">
              <p>Tanggal: <strong>{date}</strong></p>
              <p>Status: <strong>{order.status === "pending_payment" ? "Menunggu Pembayaran" : "Lunas"}</strong></p>
            </div>
          </div>

          {/* CUSTOMER */}
          <div style={{marginBottom:"32px"}}>
            <div className="section-title">Dikirim Kepada</div>
            <div className="customer-box">
              <p><strong>{order.customer?.name}</strong></p>
              <p>{order.customer?.phone}</p>
              {order.customer?.email && <p>{order.customer?.email}</p>}
              <p style={{marginTop:"8px"}}>{order.customer?.address}</p>
              <p>{order.customer?.city}, {order.customer?.province} {order.customer?.postalCode}</p>
            </div>
          </div>

          {/* ITEMS */}
          <div style={{marginBottom:"32px"}}>
            <div className="section-title">Detail Pesanan</div>
            <table className="items-table">
              <thead>
                <tr>
                  <th>Produk</th>
                  <th style={{textAlign:"center"}}>Qty</th>
                  <th style={{textAlign:"right"}}>Harga</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items?.map((item: any, i: number) => (
                  <tr key={i}>
                    <td>
                      <div style={{fontWeight:500}}>{item.productName}</div>
                      <div style={{fontSize:"11px", color:"#9A8F82"}}>{item.sizeMl}ml · Extrait de Parfum</div>
                    </td>
                    <td style={{textAlign:"center"}}>{item.quantity}</td>
                    <td style={{textAlign:"right"}}>Rp {item.price?.toLocaleString("id-ID")}</td>
                    <td>Rp {(item.price * item.quantity)?.toLocaleString("id-ID")}</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={3} style={{textAlign:"right", color:"#9A8F82", fontSize:"12px"}}>Ongkos Kirim ({order.courier})</td>
                  <td>Rp {order.shipping_cost?.toLocaleString("id-ID")}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* TOTALS */}
          <div className="totals">
            <div className="totals-row">
              <span>Subtotal</span>
              <span>Rp {order.subtotal?.toLocaleString("id-ID")}</span>
            </div>
            <div className="totals-row">
              <span>Ongkir</span>
              <span>Rp {order.shipping_cost?.toLocaleString("id-ID")}</span>
            </div>
            <div className="totals-divider" />
            <div className="totals-total">
              <span>Total</span>
              <span>Rp {order.total?.toLocaleString("id-ID")}</span>
            </div>
          </div>

          {/* PAYMENT INFO */}
          <div style={{marginTop:"40px", background:"#1C1917", padding:"24px", color:"#F0EBE3"}}>
            <p style={{fontSize:"10px", letterSpacing:"2px", textTransform:"uppercase", color:"rgba(200,184,154,0.6)", marginBottom:"12px"}}>Informasi Pembayaran</p>
            <p style={{fontSize:"13px", lineHeight:1.8, fontWeight:300}}>
              Silakan lakukan pembayaran dan konfirmasi via WhatsApp ke <strong style={{color:"#C8B89A"}}>+62 851-9031-1230</strong> dengan menyertakan Order ID di atas.
            </p>
          </div>

          {/* FOOTER */}
          <div className="footer">
            <p className="website">henimaofficial.com</p>
            <p>Terima kasih telah berbelanja di Henima Signature Scent.</p>
            <p>Setiap parfum kami dibuat dengan penuh cinta, untuk meninggalkan kesan yang tak terlupakan.</p>
          </div>
        </div>

        <button className="print-btn" onClick={() => window.print()}>
          🖨 Print / Save PDF
        </button>
      </body>
    </html>
  );
}
