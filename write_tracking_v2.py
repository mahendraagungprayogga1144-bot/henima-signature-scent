with open("src/app/tracking/page.tsx", "w") as f:
    f.write('''"use client";
import { useState } from "react";
import Link from "next/link";

const STATUS_STEPS = ["pending_payment","paid","processing","shipped","delivered"];
const STATUS_LABELS: Record<string,string> = {
  pending_payment:"Menunggu Bayar",paid:"Sudah Bayar",
  processing:"Dikemas",shipped:"Dikirim",delivered:"Selesai",
};
const STATUS_COLORS: Record<string,string> = {
  pending_payment:"#C8B89A",paid:"#B5935A",processing:"#DAA520",shipped:"#4CAF50",delivered:"#2E7D32",
};

export default function TrackingPage() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<any>(null);
  const [tracking, setTracking] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [notifSent, setNotifSent] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);

  async function search() {
    if (!orderId.trim()) return;
    setLoading(true);
    setError("");
    setOrder(null);
    setTracking(null);
    setReviewSubmitted(false);
    try {
      const res = await fetch("/api/orders/" + orderId.trim());
      if (!res.ok) { setError("Order tidak ditemukan. Pastikan Order ID benar."); return; }
      const data = await res.json();
      setOrder(data);
      if (data.resi) {
        const tr = await fetch("/api/tracking?resi=" + data.resi + (data.courier_code || data.courier ? "&courier=" + (data.courier_code || data.courier) : ""));
        if (tr.ok) setTracking(await tr.json());
      }
    } catch { setError("Terjadi kesalahan. Coba lagi."); }
    finally { setLoading(false); }
  }

  function copyResi() {
    if (order?.resi) {
      navigator.clipboard.writeText(order.resi);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  async function submitReview() {
    if (!reviewRating || !reviewText.trim()) return;
    setReviewLoading(true);
    try {
      await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: order.id,
          customer_name: order.customer?.name,
          customer_email: order.customer?.email,
          rating: reviewRating,
          review: reviewText,
          product_id: order.items?.[0]?.productId || "",
          product_name: order.items?.[0]?.productName || "",
        }),
      });
      setReviewSubmitted(true);
    } catch {}
    finally { setReviewLoading(false); }
  }

  const currentIndex = order ? STATUS_STEPS.indexOf(order.status) : -1;

  // Hitung ETA (estimasi +3 hari dari tanggal order)
  const etaDate = order?.created_at ? new Date(new Date(order.created_at).getTime() + 3 * 24 * 60 * 60 * 1000) : null;
  const daysLeft = etaDate ? Math.max(0, Math.ceil((etaDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : null;

  return (
    <div style={{minHeight:"100vh",background:"#FAF8F4",fontFamily:"var(--font-jost,sans-serif)",color:"#1C1917"}}>

      {/* HERO */}
      <div style={{padding:"80px 8vw 60px",borderBottom:"1px solid rgba(28,25,23,0.08)",textAlign:"center"}}>
        <p style={{fontSize:"10px",letterSpacing:"4px",textTransform:"uppercase",color:"#9A8F82",marginBottom:"16px"}}>Henima Signature Scent</p>
        <h1 style={{fontFamily:"var(--font-cormorant,serif)",fontSize:"clamp(36px,6vw,64px)",fontWeight:300,fontStyle:"italic",color:"#1C1917",marginBottom:"16px"}}>Track Your Order</h1>
        <p style={{fontSize:"14px",color:"#9A8F82",maxWidth:"400px",margin:"0 auto"}}>Masukkan Order ID untuk melacak perjalanan pesananmu.</p>
      </div>

      <div style={{maxWidth:"640px",margin:"0 auto",padding:"64px 24px 80px"}}>

        {/* SEARCH */}
        <div style={{display:"flex",marginBottom:"40px"}}>
          <input type="text" value={orderId} onChange={e=>setOrderId(e.target.value)} onKeyDown={e=>e.key==="Enter"&&search()}
            placeholder="Order ID (contoh: ORD-1234567890-ABCD)"
            style={{flex:1,border:"1px solid #D5CFC8",borderRight:"none",padding:"14px 16px",fontSize:"13px",color:"#1C1917",background:"#fff",outline:"none",fontFamily:"var(--font-jost)"}}/>
          <button onClick={search} disabled={loading}
            style={{background:"#1C1917",color:"#FAF8F4",border:"none",padding:"14px 28px",fontSize:"11px",letterSpacing:"2px",textTransform:"uppercase",cursor:"pointer",fontFamily:"var(--font-jost)",whiteSpace:"nowrap"}}>
            {loading?"...":"Track"}
          </button>
        </div>

        {error && <div style={{background:"#fff5f5",border:"1px solid #ffc5c5",padding:"16px",fontSize:"13px",color:"#cc0000",marginBottom:"24px"}}>{error}</div>}

        {order && (
          <div>

            {/* ETA BANNER */}
            {order.status === "shipped" && etaDate && (
              <div style={{background:"#1C1917",padding:"24px 28px",marginBottom:"28px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"16px"}}>
                <div>
                  <p style={{fontSize:"10px",letterSpacing:"3px",textTransform:"uppercase",color:"rgba(200,184,154,0.6)",marginBottom:"6px"}}>Estimasi Tiba</p>
                  <p style={{fontSize:"20px",fontWeight:300,color:"#F0EBE3",letterSpacing:"1px"}}>{etaDate.toLocaleDateString("id-ID",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</p>
                  <p style={{fontSize:"11px",color:"rgba(200,184,154,0.5)",marginTop:"4px"}}>{order.courier_name}</p>
                </div>
                {daysLeft !== null && (
                  <div style={{background:"rgba(200,184,154,0.15)",border:"1px solid rgba(200,184,154,0.3)",padding:"12px 20px",textAlign:"center"}}>
                    <p style={{fontSize:"28px",fontWeight:300,color:"#C8B89A",lineHeight:1}}>{daysLeft}</p>
                    <p style={{fontSize:"9px",letterSpacing:"2px",textTransform:"uppercase",color:"rgba(200,184,154,0.5)",marginTop:"4px"}}>Hari lagi</p>
                  </div>
                )}
              </div>
            )}

            {/* ORDER HEADER */}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"20px",flexWrap:"wrap",gap:"12px"}}>
              <div>
                <p style={{fontSize:"10px",color:"#9A8F82",letterSpacing:"1px",marginBottom:"4px"}}>Order ID</p>
                <p style={{fontSize:"15px",fontWeight:600,color:"#1C1917"}}>{order.id}</p>
              </div>
              <div style={{background:STATUS_COLORS[order.status]||"#C8B89A",color:"#fff",padding:"6px 16px",fontSize:"10px",letterSpacing:"2px",textTransform:"uppercase",fontWeight:600}}>
                {STATUS_LABELS[order.status]||order.status}
              </div>
            </div>

            {/* COURIER + RESI */}
            {order.resi && (
              <div style={{background:"#F0EBE3",padding:"16px 20px",marginBottom:"28px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"12px"}}>
                <div>
                  <p style={{fontSize:"14px",fontWeight:600,color:"#1C1917",marginBottom:"2px"}}>{order.courier_name}</p>
                  <p style={{fontSize:"11px",color:"#9A8F82"}}>Dikirim dari Sidoarjo, Jawa Timur</p>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                  <div>
                    <p style={{fontSize:"10px",letterSpacing:"1px",textTransform:"uppercase",color:"#9A8F82",marginBottom:"3px"}}>Nomor Resi</p>
                    <p style={{fontSize:"16px",fontWeight:700,color:"#1C1917",letterSpacing:"2px"}}>{order.resi}</p>
                  </div>
                  <button onClick={copyResi}
                    style={{background:"#1C1917",color:"#F0EBE3",border:"none",padding:"8px 14px",fontSize:"9px",letterSpacing:"1px",textTransform:"uppercase",cursor:"pointer"}}>
                    {copied?"✓ Disalin":"Salin"}
                  </button>
                </div>
              </div>
            )}

            {/* PROGRESS STEPS */}
            <div style={{marginBottom:"36px"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",position:"relative"}}>
                <div style={{position:"absolute",top:"14px",left:"10%",right:"10%",height:"2px",background:"#E8E0D5",zIndex:0}}/>
                <div style={{position:"absolute",top:"14px",left:"10%",width:currentIndex>=0?`${(currentIndex/4)*80}%`:"0%",height:"2px",background:"#1C1917",zIndex:1,transition:"width 0.5s ease"}}/>
                {STATUS_STEPS.map((step,i)=>{
                  const isPast = i <= currentIndex;
                  return (
                    <div key={step} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"8px",zIndex:2}}>
                      <div style={{width:"28px",height:"28px",borderRadius:"50%",background:isPast?"#1C1917":"#E8E0D5",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.3s"}}>
                        {isPast && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#FAF8F4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      </div>
                      <p style={{fontSize:"9px",letterSpacing:"0.5px",textTransform:"uppercase",color:isPast?"#1C1917":"#C8B89A",textAlign:"center",maxWidth:"56px",lineHeight:1.3,fontWeight:isPast?600:400}}>{STATUS_LABELS[step]}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* PETA RUTE */}
            {tracking?.history && tracking.history.length > 0 && (
              <div style={{marginBottom:"32px"}}>
                <p style={{fontSize:"10px",letterSpacing:"3px",textTransform:"uppercase",color:"#B5935A",marginBottom:"16px",fontWeight:600}}>Rute Pengiriman</p>
                <div style={{background:"#F0EBE3",padding:"20px",overflowX:"auto"}}>
                  <div style={{display:"flex",alignItems:"center",minWidth:"360px"}}>
                    {Array.from(new Set(tracking.history.map((h:any) => h.location).filter(Boolean).reverse())).map((loc:any, i:number, arr:any[]) => (
                      <div key={i} style={{display:"flex",alignItems:"center",flex:1}}>
                        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"6px"}}>
                          <div style={{width:"12px",height:"12px",borderRadius:"50%",background: i===arr.length-1?"#B5935A":"#1C1917",boxShadow: i===arr.length-1?"0 0 0 4px rgba(181,147,90,0.25)":""}}/>
                          <p style={{fontSize:"9px",letterSpacing:"0.5px",textTransform:"uppercase",color:i===arr.length-1?"#B5935A":"#1C1917",textAlign:"center",maxWidth:"60px",lineHeight:1.4,fontWeight:600}}>{loc}</p>
                        </div>
                        {i < arr.length - 1 && <div style={{flex:1,height:"2px",background:"#1C1917",margin:"0 4px",marginBottom:"18px"}}/>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TIMELINE PERJALANAN */}
            {tracking?.history && tracking.history.length > 0 && (
              <div style={{marginBottom:"32px"}}>
                <p style={{fontSize:"10px",letterSpacing:"3px",textTransform:"uppercase",color:"#B5935A",marginBottom:"20px",fontWeight:600}}>Perjalanan Paket</p>
                <div style={{position:"relative",paddingLeft:"24px"}}>
                  <div style={{position:"absolute",left:"6px",top:"8px",bottom:"8px",width:"1px",background:"#E8E0D5"}}/>
                  {tracking.history.map((h:any,i:number)=>(
                    <div key={i} style={{position:"relative",marginBottom:"24px"}}>
                      <div style={{position:"absolute",left:"-22px",top:"6px",width:i===0?"12px":"10px",height:i===0?"12px":"10px",borderRadius:"50%",background:i===0?"#1C1917":"#E8E0D5",border:"2px solid #FAF8F4",marginLeft:i===0?"-1px":"0"}}/>
                      <p style={{fontSize:"11px",color:i===0?"#1C1917":"#9A8F82",marginBottom:"3px",fontWeight:i===0?600:400}}>
                        {h.updated_at ? new Date(h.updated_at).toLocaleString("id-ID",{day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"}) : ""}
                      </p>
                      <p style={{fontSize:"13px",color:i===0?"#1C1917":"#6B5E52",lineHeight:1.6,fontWeight:i===0?500:400}}>{h.note||h.status}</p>
                      {h.location && <p style={{fontSize:"11px",color:"#B5935A",marginTop:"3px"}}>📍 {h.location}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* NOTIFIKASI WA */}
            {order.status === "shipped" && (
              <div style={{border:"1px solid rgba(28,25,23,0.1)",padding:"20px 24px",marginBottom:"28px",display:"flex",alignItems:"center",gap:"16px",flexWrap:"wrap"}}>
                <div style={{fontSize:"22px"}}>🔔</div>
                <div style={{flex:1}}>
                  <p style={{fontSize:"14px",fontWeight:600,color:"#1C1917",marginBottom:"3px"}}>Mau dapat update otomatis?</p>
                  <p style={{fontSize:"12px",color:"#9A8F82"}}>Kami kirim notifikasi WA tiap kali paket bergerak.</p>
                </div>
                <a href={"https://wa.me/6285190311230?text=" + encodeURIComponent("Halo Henima, saya ingin mengaktifkan notifikasi tracking untuk pesanan " + order.id)}
                  target="_blank" rel="noopener noreferrer"
                  onClick={()=>setNotifSent(true)}
                  style={{background:"#1C1917",color:"#FAF8F4",border:"none",padding:"10px 20px",fontSize:"10px",letterSpacing:"2px",textTransform:"uppercase",cursor:"pointer",textDecoration:"none",whiteSpace:"nowrap"}}>
                  {notifSent?"✓ Terkirim":"Aktifkan via WA"}
                </a>
              </div>
            )}

            {/* DIKIRIM KE */}
            <p style={{fontSize:"10px",letterSpacing:"3px",textTransform:"uppercase",color:"#B5935A",marginBottom:"16px",fontWeight:600}}>Dikirim ke</p>
            <div style={{background:"#F0EBE3",padding:"20px 24px",marginBottom:"28px"}}>
              <p style={{fontSize:"14px",fontWeight:600,color:"#1C1917",marginBottom:"4px"}}>{order.customer?.name}</p>
              <p style={{fontSize:"13px",color:"#6B5E52",lineHeight:1.7}}>{order.customer?.address}, {order.customer?.city}, {order.customer?.province} {order.customer?.postalCode}</p>
              <p style={{fontSize:"12px",color:"#9A8F82",marginTop:"6px"}}>{order.customer?.phone}</p>
            </div>

            {/* RINCIAN PESANAN */}
            <p style={{fontSize:"10px",letterSpacing:"3px",textTransform:"uppercase",color:"#B5935A",marginBottom:"16px",fontWeight:600}}>Rincian Pesanan</p>
            <div style={{background:"#fff",border:"1px solid #E8E0D5",marginBottom:"28px"}}>
              {order.items?.map((item:any,i:number)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"14px 20px",borderBottom:"1px solid #F0EBE3",fontSize:"13px"}}>
                  <span style={{color:"#1C1917"}}>{item.productName} {item.sizeMl}ml × {item.quantity}</span>
                  <span style={{fontWeight:500}}>Rp {(item.price*item.quantity).toLocaleString("id-ID")}</span>
                </div>
              ))}
              <div style={{display:"flex",justifyContent:"space-between",padding:"14px 20px",borderBottom:"1px solid #F0EBE3",fontSize:"13px"}}>
                <span style={{color:"#9A8F82"}}>Ongkir ({order.courier_name})</span>
                <span>Rp {order.shipping_cost?.toLocaleString("id-ID")}</span>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",padding:"14px 20px",background:"#F0EBE3",fontSize:"15px",fontWeight:700}}>
                <span>Total</span>
                <span>Rp {order.total?.toLocaleString("id-ID")}</span>
              </div>
            </div>

            {/* ULASAN PRODUK */}
            {order.status === "delivered" && (
              <div style={{marginBottom:"28px"}}>
                <p style={{fontSize:"10px",letterSpacing:"3px",textTransform:"uppercase",color:"#B5935A",marginBottom:"16px",fontWeight:600}}>Ulasan Produk</p>
                {reviewSubmitted ? (
                  <div style={{background:"#F0EBE3",padding:"28px",textAlign:"center"}}>
                    <p style={{fontSize:"20px",marginBottom:"8px"}}>✨</p>
                    <p style={{fontSize:"15px",fontWeight:500,color:"#1C1917",marginBottom:"4px"}}>Terima kasih atas ulasanmu!</p>
                    <p style={{fontSize:"13px",color:"#9A8F82"}}>Ulasanmu sangat berarti bagi kami dan pelanggan lain.</p>
                  </div>
                ) : (
                  <div style={{border:"1px solid rgba(28,25,23,0.1)",padding:"28px",textAlign:"center"}}>
                    <p style={{fontFamily:"var(--font-cormorant,serif)",fontSize:"22px",fontWeight:300,fontStyle:"italic",color:"#1C1917",marginBottom:"6px"}}>Bagaimana pengalamanmu?</p>
                    <p style={{fontSize:"13px",color:"#9A8F82",marginBottom:"20px"}}>Bantu pelanggan lain dengan ulasan jujurmu.</p>
                    <div style={{display:"flex",justifyContent:"center",gap:"10px",marginBottom:"20px"}}>
                      {[1,2,3,4,5].map(n=>(
                        <span key={n} onClick={()=>setReviewRating(n)}
                          style={{fontSize:"32px",cursor:"pointer",color:n<=reviewRating?"#C8B89A":"#E8E0D5",transition:"color 0.2s"}}>★</span>
                      ))}
                    </div>
                    <textarea value={reviewText} onChange={e=>setReviewText(e.target.value)}
                      placeholder="Ceritakan pengalamanmu dengan produk ini..."
                      rows={3}
                      style={{width:"100%",border:"1px solid #E8E0D5",padding:"12px 14px",fontSize:"13px",outline:"none",resize:"vertical",marginBottom:"16px",fontFamily:"var(--font-jost)",boxSizing:"border-box" as const}}/>
                    <button onClick={submitReview} disabled={reviewLoading||!reviewRating||!reviewText.trim()}
                      style={{background:"#1C1917",color:"#FAF8F4",border:"none",padding:"12px 32px",fontSize:"10px",letterSpacing:"2px",textTransform:"uppercase",cursor:"pointer",fontFamily:"var(--font-jost)",opacity:reviewRating&&reviewText.trim()?1:0.5}}>
                      {reviewLoading?"Mengirim...":"Kirim Ulasan"}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* CTA WA */}
            <div style={{background:"#1C1917",padding:"28px",textAlign:"center"}}>
              <p style={{fontSize:"12px",color:"rgba(200,184,154,0.6)",marginBottom:"12px"}}>Ada pertanyaan tentang pesananmu?</p>
              <a href={"https://wa.me/6285190311230?text=" + encodeURIComponent("Halo Henima, saya ingin menanyakan pesanan " + order.id)}
                target="_blank" rel="noopener noreferrer"
                style={{display:"inline-block",color:"#F0EBE3",border:"1px solid rgba(200,184,154,0.3)",padding:"12px 28px",fontSize:"10px",letterSpacing:"2px",textTransform:"uppercase",textDecoration:"none"}}>
                Chat WhatsApp
              </a>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
''')
print("Done!")
