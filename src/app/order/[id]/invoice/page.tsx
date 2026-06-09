import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import PrintButton from "./PrintButton";

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
          .section-title { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #9A8F82; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid rgba(28,25,23,0.1); }
          .customer-box { background: #FAF8F4; padding: 20px; margin-bottom: 32px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 32px; }
          th { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #9A8F82; padding: 8px 0; border-bottom: 1px solid rgba(28,25,23,0.15); text-align: left; }
          td { padding: 14px 0; border-bottom: 1px solid rgba(28,25,23,0.06); font-size: 13px; }
          .totals { margin-left: auto; width: 280px; }
          .totals-row { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 8px; }
          .totals-total { display: flex; justify-content: space-between; font-size: 16px; font-weight: 700; margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(28,25,23,0.15); }
          .footer { margin-top: 48px; padding-top: 32px; border-top: 1px solid rgba(28,25,23,0.1); text-align: center; }
          .footer p { font-size: 11px; color: #9A8F82; line-height: 1.8; }
          @media print { button { display: none !important; } }
        `}</style>
      </head>
      <body>
        <div className="page">
          <div className="header">
            <div className="brand">Henima</div>
            <div className="tagline">Signature Scent · Made in Indonesia</div>
          </div>

          <div style={{display:"flex", justifyContent:"space-between", marginBottom:"40px"}}>
            <div>
              <h2 style={{fontSize:"20px", fontWeight:600, marginBottom:"8px"}}>Invoice</h2>
              <p style={{fontSize:"12px", color:"#9A8F82"}}>{order.id}</p>
            </div>
            <div style={{textAlign:"right"}}>
              <p style={{fontSize:"12px", color:"#6B6560", marginBottom:"4px"}}>Tanggal: <strong style={{color:"#1C1917"}}>{date}</strong></p>
              <p style={{fontSize:"12px", color:"#6B6560"}}>Status: <strong style={{color:"#1C1917"}}>{order.status === "pending_payment" ? "Menunggu Pembayaran" : "Lunas"}</strong></p>
            </div>
          </div>

          <div style={{marginBottom:"32px"}}>
            <div className="section-title">Dikirim Kepada</div>
            <div className="customer-box">
              <p style={{fontWeight:500, marginBottom:"4px"}}>{order.customer?.name}</p>
              <p style={{fontSize:"13px", color:"#6B6560"}}>{order.customer?.phone}</p>
              {order.customer?.email && <p style={{fontSize:"13px", color:"#6B6560"}}>{order.customer?.email}</p>}
              <p style={{fontSize:"13px", color:"#6B6560", marginTop:"8px"}}>{order.customer?.address}</p>
              <p style={{fontSize:"13px", color:"#6B6560"}}>{order.customer?.city}, {order.customer?.province} {order.customer?.postalCode}</p>
            </div>
          </div>

          <div style={{marginBottom:"32px"}}>
            <div className="section-title">Detail Pesanan</div>
            <table>
              <thead>
                <tr>
                  <th>Produk</th>
                  <th style={{textAlign:"center"}}>Qty</th>
                  <th style={{textAlign:"right"}}>Harga</th>
                  <th style={{textAlign:"right"}}>Total</th>
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
                    <td style={{textAlign:"right", fontWeight:500}}>Rp {(item.price * item.quantity)?.toLocaleString("id-ID")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="totals">
            <div className="totals-row">
              <span style={{color:"#9A8F82"}}>Subtotal</span>
              <span>Rp {order.subtotal?.toLocaleString("id-ID")}</span>
            </div>
            <div className="totals-row">
              <span style={{color:"#9A8F82"}}>Ongkir ({order.courier})</span>
              <span>Rp {order.shipping_cost?.toLocaleString("id-ID")}</span>
            </div>
            <div className="totals-total">
              <span>Total</span>
              <span>Rp {order.total?.toLocaleString("id-ID")}</span>
            </div>
          </div>

          <div style={{marginTop:"40px", background:"#1C1917", padding:"24px", color:"#F0EBE3"}}>
            <p style={{fontSize:"10px", letterSpacing:"2px", textTransform:"uppercase", color:"rgba(200,184,154,0.6)", marginBottom:"12px"}}>Informasi Pembayaran</p>
            <p style={{fontSize:"13px", lineHeight:1.8, fontWeight:300}}>
              Silakan konfirmasi pembayaran via WhatsApp ke <strong style={{color:"#C8B89A"}}>+62 851-9031-1230</strong> dengan menyertakan Order ID di atas.
            </p>
          </div>

          <div className="footer">
            <p style={{fontWeight:600, color:"#1C1917", marginBottom:"4px"}}>henimaofficial.com</p>
            <p>Terima kasih telah berbelanja di Henima Signature Scent.</p>
            <p>Setiap parfum dibuat dengan cinta untuk meninggalkan kesan yang tak terlupakan.</p>
          </div>
        </div>

        <PrintButton />
      </body>
    </html>
  );
}
