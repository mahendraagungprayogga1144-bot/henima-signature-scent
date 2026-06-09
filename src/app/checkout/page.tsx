"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCart, cartTotal, type CartItem } from "@/lib/cart";
import Image from "next/image";
import Link from "next/link";

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [courier, setCourier] = useState("");
  const [shippingOptions, setShippingOptions] = useState<any[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<any>(null);
  const [loadingShipping, setLoadingShipping] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const cart = getCart();
    if (cart.length === 0) router.push("/shop");
    setItems(cart);
  }, [router]);

  const subtotal = cartTotal(items);
  const shippingCost = selectedShipping?.cost?.[0]?.value || 0;
  const total = subtotal + shippingCost;

  async function checkShipping() {
    if (!city || !postalCode) return;
    setLoadingShipping(true);
    try {
      const res = await fetch("/api/shipping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destination: city, weight: items.length * 200 }),
      });
      const data = await res.json();
      setShippingOptions(data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingShipping(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedShipping) { alert("Pilih kurir terlebih dahulu"); return; }
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items, name, phone, email, address, city, province, postalCode,
          courier: selectedShipping.service,
          courierName: selectedShipping.description,
          shippingCost, subtotal, total,
        }),
      });
      const data = await res.json();
      if (data.orderId) {
        localStorage.removeItem("henima_cart");
        window.dispatchEvent(new Event("cart-updated"));
        router.push("/order/" + data.orderId);
      }
    } catch (err) {
      alert("Terjadi kesalahan, coba lagi");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{background:"#FAF8F4", minHeight:"100vh", color:"#1C1917", fontFamily:"var(--font-jost)"}}>
      <div style={{padding:"20px 8vw", borderBottom:"1px solid rgba(28,25,23,0.08)"}}>
        <div style={{display:"flex", alignItems:"center", gap:"8px", fontSize:"12px", color:"#9A8F82"}}>
          <Link href="/cart" style={{color:"#9A8F82", textDecoration:"none"}}>Cart</Link>
          <span>→</span>
          <span style={{color:"#1C1917"}}>Checkout</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{display:"grid", gridTemplateColumns:"1fr 380px", gap:"48px", padding:"48px 8vw", alignItems:"start"}} className="checkout-grid">

          {/* LEFT - Form */}
          <div style={{display:"flex", flexDirection:"column", gap:"32px"}}>

            {/* Contact */}
            <div>
              <h2 style={{fontSize:"16px", fontWeight:600, marginBottom:"20px", letterSpacing:"0.5px"}}>Informasi Kontak</h2>
              <div style={{display:"flex", flexDirection:"column", gap:"12px"}}>
                <input required value={name} onChange={e => setName(e.target.value)}
                  placeholder="Nama Lengkap" style={inputStyle} />
                <input required value={phone} onChange={e => setPhone(e.target.value)}
                  placeholder="Nomor HP (contoh: 08123456789)" style={inputStyle} />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="Email (opsional)" style={inputStyle} />
              </div>
            </div>

            {/* Shipping Address */}
            <div>
              <h2 style={{fontSize:"16px", fontWeight:600, marginBottom:"20px", letterSpacing:"0.5px"}}>Alamat Pengiriman</h2>
              <div style={{display:"flex", flexDirection:"column", gap:"12px"}}>
                <textarea required value={address} onChange={e => setAddress(e.target.value)}
                  placeholder="Alamat lengkap (jalan, nomor, RT/RW, kelurahan, kecamatan)"
                  rows={3} style={{...inputStyle, resize:"none"}} />
                <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px"}}>
                  <input required value={city} onChange={e => setCity(e.target.value)}
                    placeholder="Kota/Kabupaten" style={inputStyle} />
                  <input required value={province} onChange={e => setProvince(e.target.value)}
                    placeholder="Provinsi" style={inputStyle} />
                </div>
                <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px"}}>
                  <input required value={postalCode} onChange={e => setPostalCode(e.target.value)}
                    placeholder="Kode Pos" style={inputStyle} />
                  <button type="button" onClick={checkShipping} disabled={loadingShipping || !city || !postalCode}
                    style={{background:"#1C1917", color:"#FAF8F4", border:"none", cursor:"pointer", fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase", fontFamily:"var(--font-jost)", opacity: (!city || !postalCode) ? 0.5 : 1}}>
                    {loadingShipping ? "Mengecek..." : "Cek Ongkir"}
                  </button>
                </div>
              </div>
            </div>

            {/* Shipping Options */}
            {shippingOptions.length > 0 && (
              <div>
                <h2 style={{fontSize:"16px", fontWeight:600, marginBottom:"20px", letterSpacing:"0.5px"}}>Pilih Kurir</h2>
                <div style={{display:"flex", flexDirection:"column", gap:"8px"}}>
                  {shippingOptions.map((opt: any) => (
                    <label key={opt.service} onClick={() => setSelectedShipping(opt)}
                      style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px", border: selectedShipping?.service === opt.service ? "2px solid #1C1917" : "1px solid rgba(28,25,23,0.15)", cursor:"pointer", background: selectedShipping?.service === opt.service ? "#F0EBE3" : "#FAF8F4"}}>
                      <div>
                        <p style={{fontSize:"14px", fontWeight:500, color:"#1C1917"}}>{opt.service}</p>
                        <p style={{fontSize:"12px", color:"#9A8F82"}}>{opt.description} · {opt.cost?.[0]?.etd} hari</p>
                      </div>
                      <p style={{fontSize:"14px", fontWeight:600, color:"#1C1917"}}>
                        Rp {opt.cost?.[0]?.value?.toLocaleString("id-ID")}
                      </p>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT - Order Summary */}
          <div style={{background:"#F0EBE3", padding:"28px", position:"sticky", top:"80px"}}>
            <h2 style={{fontSize:"16px", fontWeight:600, marginBottom:"20px"}}>Order Summary</h2>

            {items.map((item) => (
              <div key={item.productId + item.variantId} style={{display:"flex", gap:"12px", marginBottom:"16px", alignItems:"center"}}>
                <div style={{position:"relative", width:"56px", height:"56px", background:"#E8E0D4", flexShrink:0}}>
                  {item.productPhoto && <Image src={item.productPhoto} alt={item.productName} fill className="object-cover" />}
                </div>
                <div style={{flex:1}}>
                  <p style={{fontSize:"13px", fontWeight:500, color:"#1C1917"}}>{item.productName}</p>
                  <p style={{fontSize:"11px", color:"#9A8F82"}}>{item.sizeMl}ml × {item.quantity}</p>
                </div>
                <p style={{fontSize:"13px", fontWeight:500}}>Rp {(item.price * item.quantity).toLocaleString("id-ID")}</p>
              </div>
            ))}

            <div style={{height:"1px", background:"rgba(28,25,23,0.1)", margin:"16px 0"}} />

            <div style={{display:"flex", justifyContent:"space-between", marginBottom:"8px"}}>
              <span style={{fontSize:"13px", color:"#9A8F82"}}>Subtotal</span>
              <span style={{fontSize:"13px"}}>Rp {subtotal.toLocaleString("id-ID")}</span>
            </div>
            <div style={{display:"flex", justifyContent:"space-between", marginBottom:"16px"}}>
              <span style={{fontSize:"13px", color:"#9A8F82"}}>Ongkir</span>
              <span style={{fontSize:"13px"}}>{shippingCost > 0 ? "Rp " + shippingCost.toLocaleString("id-ID") : "Pilih kurir"}</span>
            </div>

            <div style={{height:"1px", background:"rgba(28,25,23,0.1)", marginBottom:"16px"}} />

            <div style={{display:"flex", justifyContent:"space-between", marginBottom:"24px"}}>
              <span style={{fontSize:"15px", fontWeight:600}}>Total</span>
              <span style={{fontSize:"15px", fontWeight:600}}>Rp {total.toLocaleString("id-ID")}</span>
            </div>

            <button type="submit" disabled={submitting || !selectedShipping}
              style={{display:"block", width:"100%", background: (!selectedShipping || submitting) ? "#9A8F82" : "#1C1917", color:"#FAF8F4", padding:"16px", fontSize:"11px", letterSpacing:"3px", textTransform:"uppercase", border:"none", cursor: (!selectedShipping || submitting) ? "not-allowed" : "pointer", fontFamily:"var(--font-jost)", fontWeight:500}}>
              {submitting ? "Memproses..." : "Buat Pesanan"}
            </button>
          </div>
        </div>
      </form>

      <style>{`
        @media (max-width: 768px) {
          .checkout-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width:"100%", padding:"12px 16px", background:"#fff",
  border:"1px solid rgba(28,25,23,0.15)", fontSize:"14px",
  color:"#1C1917", fontFamily:"var(--font-jost)", outline:"none",
  boxSizing:"border-box",
};
