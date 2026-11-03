import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { verifyOrderAccessToken } from "@/lib/order-access";

export const dynamic = "force-dynamic";

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ t?: string; token?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const token = sp.t || sp.token || "";

  const { data: order } = await supabase
    .from("retail_orders")
    .select("*")
    .eq("id", id)
    .single();

  if (!order) {
    return (
      <div style={{background:"#FAF8F4", minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--font-jakarta)"}}>
        <div style={{textAlign:"center"}}>
          <p style={{fontSize:"18px", color:"#9A8F82"}}>Order tidak ditemukan</p>
          <Link href="/shop" style={{display:"inline-block", marginTop:"24px", background:"#1C1917", color:"#FAF8F4", padding:"12px 24px", fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase", textDecoration:"none"}}>Back to Shop</Link>
        </div>
      </div>
    );
  }

  const user = await getCurrentUser();
  const isAdmin = user?.role === "admin";
  const isOwner = !!(user && order.user_id && user.id === order.user_id);
  const tokenOk = verifyOrderAccessToken(token, id);

  if (!isAdmin && !isOwner && !tokenOk) {
    return (
      <div style={{background:"#FAF8F4", minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--font-jakarta)", padding:"40px 24px"}}>
        <div style={{textAlign:"center", maxWidth:420}}>
          <h1 style={{fontSize:"28px", fontWeight:400, marginBottom:12}}>Akses terbatas</h1>
          <p style={{fontSize:"14px", color:"#9A8F82", lineHeight:1.7, marginBottom:24}}>
            Buka tautan dari email konfirmasi, atau lacak pesanan di halaman Tracking dengan Order ID + nomor WhatsApp.
          </p>
          <div style={{display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap"}}>
            <Link href={`/tracking?order=${encodeURIComponent(id)}`} style={{background:"#1C1917", color:"#FAF8F4", padding:"12px 24px", fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase", textDecoration:"none"}}>Lacak Pesanan</Link>
            <Link href="/shop" style={{border:"1px solid rgba(28,25,23,0.25)", color:"#1C1917", padding:"12px 24px", fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase", textDecoration:"none"}}>Back to Shop</Link>
          </div>
        </div>
      </div>
    );
  }

  const customer = typeof order.customer === "string" ? JSON.parse(order.customer) : order.customer;
  const waNumber = "6285190311230";
  const waText = encodeURIComponent("Halo Henima, saya baru saja membuat pesanan dengan ID: " + order.id + ". Mohon konfirmasi pembayaran.");
  const tokenQs = token ? `?t=${encodeURIComponent(token)}` : "";

  return (
    <div style={{background:"#FAF8F4", minHeight:"100vh", fontFamily:"var(--font-jakarta)", color:"#1C1917"}}>
      <div style={{maxWidth:"600px", margin:"0 auto", padding:"80px 24px", textAlign:"center"}}>
        <h1 style={{fontFamily:"var(--font-jakarta)", fontSize:"36px", fontWeight:300, fontStyle:"italic", color:"#1C1917", marginBottom:"12px"}}>
          Pesanan Diterima!
        </h1>
        <p style={{fontSize:"14px", color:"#9A8F82", marginBottom:"8px", lineHeight:1.8}}>
          Terima kasih {customer?.name}. Pesanan kamu telah kami terima.
        </p>
        <p style={{fontSize:"13px", color:"#C8B89A", marginBottom:"40px", letterSpacing:"1px"}}>
          Order ID: {order.id}
        </p>

        <div style={{background:"#F0EBE3", padding:"28px", textAlign:"left", marginBottom:"32px"}}>
          <h3 style={{fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase", color:"#9A8F82", marginBottom:"20px"}}>Detail Pesanan</h3>
          {order.items?.map((item: { productId: string; variantId: string; productName: string; sizeMl: number; quantity: number; price: number }) => (
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
          {(order.voucher_discount > 0 || order.member_discount > 0) && (
            <>
              {order.member_discount > 0 && (
                <div style={{display:"flex", justifyContent:"space-between", fontSize:"13px", marginBottom:"6px", color:"#2E7D32"}}>
                  <span>Diskon Member</span>
                  <span>- Rp {order.member_discount.toLocaleString("id-ID")}</span>
                </div>
              )}
              {order.voucher_discount > 0 && (
                <div style={{display:"flex", justifyContent:"space-between", fontSize:"13px", marginBottom:"6px", color:"#2E7D32"}}>
                  <span>Voucher</span>
                  <span>- Rp {order.voucher_discount.toLocaleString("id-ID")}</span>
                </div>
              )}
            </>
          )}
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
            Tim Henima akan menghubungi kamu via WhatsApp ke nomor <strong>{customer?.phone}</strong> untuk konfirmasi pembayaran.
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
          <Link href={"/order/" + order.id + "/invoice" + tokenQs}
            target="_blank"
            style={{display:"inline-block", background:"transparent", color:"#1C1917", padding:"13px 28px", fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase", textDecoration:"none", border:"1px solid rgba(28,25,23,0.25)"}}>
            Lihat Invoice
          </Link>
        </div>
      </div>
    </div>
  );
}
