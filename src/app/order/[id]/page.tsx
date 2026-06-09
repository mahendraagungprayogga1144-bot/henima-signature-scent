import { supabase } from "@/lib/supabase";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const { data: order } = await supabase
    .from("retail_orders")
    .select("*")
    .eq("id", id)
    .single();

  if (!order) return (
    <div style={{background:"#FAF8F4", minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--font-jost)"}}>
      <div style={{textAlign:"center"}}>
        <p style={{fontSize:"48px", marginBottom:"16px"}}>❌</p>
        <p style={{fontSize:"18px", color:"#9A8F82"}}>Order tidak ditemukan</p>
        <Link href="/shop" style={{display:"inline-block", marginTop:"24px", background:"#1C1917", color:"#FAF8F4", padding:"12px 24px", fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase", textDecoration:"none"}}>Back to Shop</Link>
      </div>
    </div>
  );

  const waNumber = "6285190311230";
  const waText = encodeURIComponent("Halo Henima, saya baru saja membuat pesanan dengan ID: " + order.id + ". Mohon konfirmasi pembayaran.");

  return (
    <div style={{background:"#FAF8F4", minHeight:"100vh", fontFamily:"var(--font-jost)", color:"#1C1917"}}>
      <div style={{maxWidth:"600px", margin:"0 auto", padding:"80px 24px", textAlign:"center"}}>
        <p style={{fontSize:"56px", marginBottom:"24px"}}>✅</p>
        <h1 style={{fontFamily:"var(--font-cormorant)", fontSize:"36px", fontWeight:300, fontStyle:"italic", color:"#1C1917", marginBottom:"12px"}}>
          Pesanan Diterima!
        </h1>
        <p style={{fontSize:"14px", color:"#9A8F82", marginBottom:"8px", lineHeight:1.8}}>
          Terima kasih {order.customer?.name}. Pesanan kamu telah kami terima.
        </p>
        <p style={{fontSize:"13px", color:"#C8B89A", marginBottom:"40px", letterSpacing:"1px"}}>
          Order ID: {order.id}
        </p>

        <div style={{background:"#F0EBE3", padding:"28px", textAlign:"left", marginBottom:"32px"}}>
          <h3 style={{fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase", color:"#9A8F82", marginBottom:"20px"}}>Detail Pesanan</h3>
          {order.items?.map((item: any) => (
            <div key={item.productId + item.variantId} style={{display:"flex", justifyContent:"space-between", marginBottom:"10px", fontSize:"14px"}}>
              <span>{item.productName} {item.sizeMl}ml × {item.quantity}</span>
              <span style={{fontWeight:500}}>Rp {(item.price * item.quantity).toLocaleString("id-ID")}</span>
            </div>
          ))}
          <div style={{height:"1px", background:"rgba(28,25,23,0.1)", margin:"16px 0"}} />
          <div style={{display:"flex", justifyContent:"space-between", fontSize:"13px", marginBottom:"6px"}}>
            <span style={{color:"#9A8F82"}}>Subtotal</span>
            <span>Rp {order.subtotal?.toLocaleString("id-ID")}</span>
          </div>
          <div style={{display:"flex", justifyContent:"space-between", fontSize:"13px", marginBottom:"16px"}}>
            <span style={{color:"#9A8F82"}}>Ongkir ({order.courier})</span>
            <span>Rp {order.shipping_cost?.toLocaleString("id-ID")}</span>
          </div>
          <div style={{display:"flex", justifyContent:"space-between", fontSize:"15px", fontWeight:600}}>
            <span>Total</span>
            <span>Rp {order.total?.toLocaleString("id-ID")}</span>
          </div>
        </div>

        <div style={{background:"#1C1917", padding:"24px", textAlign:"left", marginBottom:"32px", color:"#F0EBE3"}}>
          <p style={{fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase", color:"rgba(200,184,154,0.6)", marginBottom:"12px"}}>Langkah Selanjutnya</p>
          <p style={{fontSize:"14px", lineHeight:1.8, fontWeight:300}}>
            Tim Henima akan menghubungi kamu via WhatsApp ke nomor <strong>{order.customer?.phone}</strong> untuk konfirmasi pembayaran.
          </p>
        </div>

        <div style={{display:"flex", gap:"12px", justifyContent:"center", flexWrap:"wrap"}}>
          <a href={"https://wa.me/" + waNumber + "?text=" + waText}
            target="_blank" rel="noreferrer"
            style={{display:"inline-block", background:"#1C1917", color:"#FAF8F4", padding:"14px 28px", fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase", textDecoration:"none"}}>
            Konfirmasi via WhatsApp
          </a>
          <Link href="/shop"
            style={{display:"inline-block", background:"transparent", color:"#1C1917", padding:"13px 28px", fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase", textDecoration:"none", border:"1px solid rgba(28,25,23,0.25)"}}>
            Lanjut Belanja
          </Link>
        </div>
      </div>
    </div>
  );
}
