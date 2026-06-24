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
  const [cities, setCities] = useState<any[]>([]);
  const [citySearch, setCitySearch] = useState("");
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [selectedCityId, setSelectedCityId] = useState("");
  const [shippingOptions, setShippingOptions] = useState<any[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<any>(null);
  const [loadingShipping, setLoadingShipping] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [voucherCode, setVoucherCode] = useState("");
  const [voucher, setVoucher] = useState<any>(null);
  const [voucherMsg, setVoucherMsg] = useState("");
  const [voucherLoading, setVoucherLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const cart = getCart();
    if (cart.length === 0) router.push("/shop");
    setItems(cart);

  }, [router]);

  const subtotal = cartTotal(items);
  const shippingCost = selectedShipping?.price || selectedShipping?.shipping_fee || 0;
  const voucherDiscount = voucher ? (
    voucher.type === "discount_percent" ? Math.floor(subtotal * voucher.value / 100) :
    voucher.type === "discount_fixed" ? voucher.value :
    voucher.type === "free_shipping" ? shippingCost : 0
  ) : 0;
  const total = subtotal + shippingCost - voucherDiscount;

  async function applyVoucher() {
    if (!voucherCode.trim()) return;
    setVoucherLoading(true);
    setVoucherMsg("");
    try {
      const res = await fetch("/api/voucher/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: voucherCode.toUpperCase(), subtotal }),
      });
      const data = await res.json();
      if (res.ok && data.voucher) {
        setVoucher(data.voucher);
        setVoucherMsg("Voucher berhasil dipakai!");
      } else {
        setVoucher(null);
        setVoucherMsg(data.error || "Voucher tidak valid");
      }
    } catch { setVoucherMsg("Gagal memvalidasi voucher"); }
    finally { setVoucherLoading(false); }
  }

  async function searchCities(q: string) {
    setCitySearch(q);
    setSelectedCityId("");
    setCity("");
    if (q.length < 3) { setCities([]); setShowCityDropdown(false); return; }
    try {
      const res = await fetch("/api/biteship/locations?q=" + encodeURIComponent(q));
      const list = await res.json();
      setCities(list);
      setShowCityDropdown(list.length > 0);
    } catch (e) {
      console.error("City search error:", e);
    }
  }

  async function checkShipping() {
    if (!selectedCityId) return;
    setLoadingShipping(true);
    try {
      const res = await fetch("/api/biteship/rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destinationAreaId: selectedCityId, weightGrams: items.reduce((s, i) => s + i.quantity * 380, 0) }),
      });
      const data = await res.json();
      setShippingOptions(Array.isArray(data) ? data : (data.pricing || data.results || []));
    } catch {}
    finally { setLoadingShipping(false); }
  }

  async function checkShippingById(cityId: string) {
    if (!cityId) return;
    setLoadingShipping(true);
    setShippingOptions([]);
    setSelectedShipping(null);
    try {
      const weight = items.reduce((s, i) => s + i.quantity * 380, 0);
      const res = await fetch("/api/biteship/rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destinationAreaId: cityId, weightGrams: weight }),
      });
      const data = await res.json();
      setShippingOptions(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
    finally { setLoadingShipping(false); }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedShipping) { alert("Pilih metode pengiriman terlebih dahulu"); return; }
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items, name, phone, email, address, city, province, postalCode,
          courier: selectedShipping.service,
          courierName: selectedShipping.description,
          shippingCost, subtotal, total, voucher_code: voucher?.code, voucher_discount: voucherDiscount,
        }),
      });
      const data = await res.json();
      if (data.orderId) {
        localStorage.removeItem("henima_cart");
        window.dispatchEvent(new Event("cart-updated"));
        router.push("/order/" + data.orderId);
      }
    } catch { alert("Terjadi kesalahan, coba lagi"); }
    finally { setSubmitting(false); }
  }

  const inp: React.CSSProperties = {
    width:"100%", padding:"14px 0", background:"transparent",
    border:"none", borderBottom:"1px solid rgba(28,25,23,0.15)",
    fontSize:"14px", color:"#1C1917", fontFamily:"var(--font-jost)",
    outline:"none", boxSizing:"border-box",
  };

  return (
    <div style={{background:"#FAF8F4", minHeight:"100vh", color:"#1C1917", fontFamily:"var(--font-jost)"}}>

      {/* BREADCRUMB */}
      <div style={{padding:"16px 8vw", borderBottom:"1px solid rgba(28,25,23,0.06)"}}>
        <div style={{display:"flex", alignItems:"center", justifyContent:"center", gap:"12px", fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase"}}>
          <Link href="/cart" style={{color:"#9A8F82", textDecoration:"none"}}>Cart</Link>
          <span style={{color:"#C8B89A"}}>›</span>
          <span style={{color:"#1C1917", fontWeight:500}}>Information</span>
          <span style={{color:"#C8B89A"}}>›</span>
          <span style={{color:"#C8B89A"}}>Shipping</span>
          <span style={{color:"#C8B89A"}}>›</span>
          <span style={{color:"#C8B89A"}}>Payment</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{display:"grid", gridTemplateColumns:"1fr 380px", gap:"64px", padding:"48px 8vw", alignItems:"start"}} className="checkout-grid">

          {/* LEFT */}
          <div>

            {/* CONTACT */}
            <div style={{marginBottom:"40px"}}>
              <h2 style={{fontSize:"18px", fontWeight:600, color:"#1C1917", marginBottom:"20px"}}>Contact</h2>
              <div style={{display:"flex", flexDirection:"column", gap:"0"}}>
                <input required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="Email" style={inp} type="email" />
                <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px"}} className="name-grid">
                  <input required value={name} onChange={e => setName(e.target.value)}
                    placeholder="First name" style={inp} />
                  <input value={""} placeholder="Last name" style={inp} readOnly />
                </div>
                <input required value={phone} onChange={e => setPhone(e.target.value)}
                  placeholder="Phone number" style={inp} type="tel" />
              </div>
              <label style={{display:"flex", alignItems:"center", gap:"10px", marginTop:"16px", fontSize:"13px", color:"#6B6560", cursor:"pointer"}}>
                <input type="checkbox" style={{width:"14px", height:"14px"}} />
                Email me with news and offers
              </label>
            </div>

            {/* SHIPPING ADDRESS */}
            <div style={{marginBottom:"40px"}}>
              <h2 style={{fontSize:"18px", fontWeight:600, color:"#1C1917", marginBottom:"20px"}}>Shipping Address</h2>
              <div style={{display:"flex", flexDirection:"column", gap:"0"}}>
                <textarea required value={address} onChange={e => setAddress(e.target.value)}
                  placeholder="Alamat lengkap (jalan, RT/RW, nama rumah/patokan)"
                  rows={3}
                  style={{...inp, resize:"none", paddingTop:"14px"}} />
                <div style={{position:"relative"}}>
                  <input
                    value={citySearch}
                    onChange={e => searchCities(e.target.value)}
                    onFocus={() => citySearch.length >= 2 && setShowCityDropdown(true)}
                    placeholder="Cari kecamatan (contoh: Taman, Nganjuk, Gubeng...)"
                    style={inp}
                    autoComplete="off"
                  />
                  {showCityDropdown && cities.length > 0 && (
                    <div style={{position:"absolute", top:"100%", left:0, right:0, background:"#fff", border:"1px solid rgba(28,25,23,0.15)", zIndex:100, maxHeight:"220px", overflowY:"auto", boxShadow:"0 4px 12px rgba(0,0,0,0.08)"}}>
                      {cities.map((c:any) => (
                        <div key={c.id}
                          onClick={() => {
                            setSelectedCityId(c.id);
                            setCity(c.administrative_division_level_3_name || c.administrative_division_level_2_name || "");
                            setProvince(c.administrative_division_level_1_name || "");
                            setPostalCode(String(c.postal_code || ""));
                            setCitySearch(c.name);
                            setShowCityDropdown(false);
                            setTimeout(() => checkShippingById(c.id), 100);
                          }}
                          style={{padding:"12px 16px", cursor:"pointer", fontSize:"13px", color:"#1C1917", borderBottom:"1px solid rgba(28,25,23,0.06)"}}>
                          <p style={{margin:0, fontWeight:500}}>{c.administrative_division_level_3_name || c.name}</p>
                          <p style={{margin:"2px 0 0", fontSize:"11px", color:"#9A8F82"}}>{c.administrative_division_level_2_name}, {c.administrative_division_level_1_name} {c.postal_code}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"12px"}} className="name-grid">
                  <input readOnly value={city}
                    placeholder="Kota/Kab (otomatis)"
                    style={{...inp, background: city ? "#F0EBE3" : "transparent", color: city ? "#1C1917" : "#9A8F82"}} />
                  <input readOnly value={province}
                    placeholder="Provinsi (otomatis)"
                    style={{...inp, background: province ? "#F0EBE3" : "transparent", color: province ? "#1C1917" : "#9A8F82"}} />
                  <input readOnly value={postalCode}
                    placeholder="Kode Pos (otomatis)"
                    style={{...inp, background: postalCode ? "#F0EBE3" : "transparent", color: postalCode ? "#1C1917" : "#9A8F82"}} />
                </div>
                <input value={phone} readOnly placeholder="Phone" style={{...inp, color:"#9A8F82"}} />
              </div>
              <label style={{display:"flex", alignItems:"center", gap:"10px", marginTop:"16px", fontSize:"13px", color:"#6B6560", cursor:"pointer"}}>
                <input type="checkbox" style={{width:"14px", height:"14px"}} />
                Save this information for next time
              </label>
            </div>

            {/* SHIPPING METHOD */}
            <div style={{marginBottom:"40px"}}>
              <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"20px"}}>
                <h2 style={{fontSize:"18px", fontWeight:600, color:"#1C1917"}}>Shipping Method</h2>
                <button type="button" onClick={checkShipping} disabled={loadingShipping || !selectedCityId}
                  style={{fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase", background:"none", border:"1px solid rgba(28,25,23,0.3)", padding:"8px 16px", cursor:"pointer", color:"#1C1917", fontFamily:"var(--font-jost)", opacity:!selectedCityId?0.4:1}}>
                  {loadingShipping ? "Checking..." : "Check Shipping"}
                </button>
              </div>
              {shippingOptions.length === 0 ? (
                <div style={{padding:"20px", border:"1px solid rgba(28,25,23,0.1)", background:"#F0EBE3"}}>
                  <p style={{fontSize:"13px", color:"#9A8F82", textAlign:"center"}}>Fill city and postal code, then click Check Shipping</p>
                </div>
              ) : (
                <div style={{display:"flex", flexDirection:"column", gap:"8px"}}>
                  {shippingOptions.map((opt: any) => (
                    <label key={opt.courier_service_code} onClick={() => setSelectedShipping(opt)}
                      style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 20px", border: selectedShipping?.courier_service_code === opt.courier_service_code ? "1px solid #1C1917" : "1px solid rgba(28,25,23,0.12)", cursor:"pointer", background: selectedShipping?.courier_service_code === opt.courier_service_code ? "#F0EBE3" : "#FAF8F4"}}>
                      <div style={{display:"flex", alignItems:"center", gap:"12px"}}>
                        <div style={{width:"16px", height:"16px", borderRadius:"50%", border: selectedShipping?.courier_service_code === opt.courier_service_code ? "5px solid #1C1917" : "1px solid rgba(28,25,23,0.3)", flexShrink:0}} />
                        <div>
                          <p style={{fontSize:"14px", color:"#1C1917", fontWeight:500}}>{opt.courier_service_name?.includes(opt.courier_name) ? opt.courier_service_name : `${opt.courier_name} ${opt.courier_service_name}`}</p>
                          <p style={{fontSize:"12px", color:"#9A8F82"}}>{opt.duration || "Estimasi tidak tersedia"}</p>
                        </div>
                      </div>
                      <p style={{fontSize:"14px", fontWeight:600, color:"#1C1917"}}>
                        Rp {opt.price?.toLocaleString("id-ID")}
                      </p>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* PAYMENT INFO */}
            <div style={{marginBottom:"32px", background:"#F0EBE3", padding:"24px", border:"1px solid rgba(28,25,23,0.08)"}}>
              <h2 style={{fontSize:"14px", fontWeight:600, color:"#1C1917", marginBottom:"16px", letterSpacing:"0.5px"}}>Informasi Pembayaran</h2>
              <p style={{fontSize:"13px", color:"#6B5E52", lineHeight:1.8, marginBottom:"16px"}}>
                Setelah order dikonfirmasi, lakukan transfer ke rekening berikut:
              </p>
              <div style={{display:"flex", flexDirection:"column", gap:"10px"}}>
                <div style={{display:"flex", justifyContent:"space-between", fontSize:"13px"}}>
                  <span style={{color:"#9A8F82"}}>Bank</span>
                  <span style={{fontWeight:600, color:"#1C1917"}}>BCA</span>
                </div>
                <div style={{display:"flex", justifyContent:"space-between", fontSize:"13px"}}>
                  <span style={{color:"#9A8F82"}}>No. Rekening</span>
                  <span style={{fontWeight:600, color:"#1C1917"}}>2712008173</span>
                </div>
                <div style={{display:"flex", justifyContent:"space-between", fontSize:"13px"}}>
                  <span style={{color:"#9A8F82"}}>Atas Nama</span>
                  <span style={{fontWeight:600, color:"#1C1917"}}>PT Henima Collection Indo</span>
                </div>
              </div>
              <div style={{height:"1px", background:"rgba(28,25,23,0.1)", margin:"16px 0"}} />
              <p style={{fontSize:"12px", color:"#9A8F82", lineHeight:1.7}}>
                Tim Henima akan mengkonfirmasi pembayaran dan mengirimkan pesanan dalam 1x24 jam setelah transfer diterima.
              </p>
            </div>

            {/* SUBMIT MOBILE */}
            <button type="submit" disabled={submitting || !selectedShipping} className="submit-mobile"
              style={{display:"none", width:"100%", background: (!selectedShipping||submitting) ? "#9A8F82" : "#1C1917", color:"#FAF8F4", padding:"16px", fontSize:"11px", letterSpacing:"3px", textTransform:"uppercase", border:"none", cursor:"pointer", fontFamily:"var(--font-jost)", fontWeight:500, marginBottom:"40px"}}>
              {submitting ? "Processing..." : "Continue to Payment"}
            </button>

            <Link href="/cart" style={{fontSize:"12px", color:"#9A8F82", textDecoration:"none", display:"flex", alignItems:"center", gap:"8px"}}>
              ‹ Return to cart
            </Link>
          </div>

          {/* RIGHT - ORDER SUMMARY */}
          <div style={{position:"sticky", top:"80px"}}>
            {items.map((item) => (
              <div key={item.productId + item.variantId} style={{display:"flex", gap:"16px", marginBottom:"20px", alignItems:"center"}}>
                <div style={{position:"relative", width:"64px", height:"64px", background:"#F0EBE3", flexShrink:0, overflow:"hidden", border:"1px solid rgba(28,25,23,0.08)"}}>
                  {item.productPhoto && <Image src={item.productPhoto} alt={item.productName} fill className="object-cover" />}
                  <span style={{position:"absolute", top:"-8px", right:"-8px", background:"#9A8F82", color:"#fff", borderRadius:"50%", width:"18px", height:"18px", fontSize:"10px", display:"flex", alignItems:"center", justifyContent:"center"}}>{item.quantity}</span>
                </div>
                <div style={{flex:1}}>
                  <p style={{fontSize:"14px", fontWeight:500, color:"#1C1917"}}>{item.productName}</p>
                  <p style={{fontSize:"12px", color:"#9A8F82"}}>{item.sizeMl}ml</p>
                </div>
                <p style={{fontSize:"14px", fontWeight:500}}>Rp {(item.price * item.quantity).toLocaleString("id-ID")}</p>
              </div>
            ))}

            <div style={{height:"1px", background:"rgba(28,25,23,0.08)", margin:"16px 0"}} />

            {/* Voucher */}
            <div style={{marginBottom:"16px"}}>
              <div style={{display:"flex", gap:"0"}}>
                <input
                  value={voucherCode}
                  onChange={e => { setVoucherCode(e.target.value.toUpperCase()); setVoucher(null); setVoucherMsg(""); }}
                  placeholder="Kode voucher"
                  style={{flex:1, padding:"12px 16px", border:"1px solid rgba(28,25,23,0.15)", background:"transparent", fontSize:"13px", color:"#1C1917", fontFamily:"var(--font-jost)", outline:"none"}}
                />
                <button type="button" onClick={applyVoucher} disabled={voucherLoading}
                  style={{padding:"12px 20px", background:"#1C1917", color:"#FAF8F4", border:"none", fontSize:"12px", letterSpacing:"1px", textTransform:"uppercase", cursor:"pointer", fontFamily:"var(--font-jost)"}}>
                  {voucherLoading ? "..." : "Apply"}
                </button>
              </div>
              {voucherMsg && (
                <p style={{fontSize:"12px", color: voucher ? "#2E7D32" : "#cc0000", marginTop:"6px"}}>{voucherMsg}</p>
              )}
            </div>

            <div style={{height:"1px", background:"rgba(28,25,23,0.08)", margin:"16px 0"}} />

            <div style={{display:"flex", justifyContent:"space-between", marginBottom:"8px"}}>
              <span style={{fontSize:"13px", color:"#6B6560"}}>Subtotal</span>
              <span style={{fontSize:"13px", color:"#1C1917"}}>Rp {subtotal.toLocaleString("id-ID")}</span>
            </div>
            <div style={{display:"flex", justifyContent:"space-between", marginBottom:"8px"}}>
              <span style={{fontSize:"13px", color:"#6B6560"}}>Shipping</span>
              <span style={{fontSize:"13px", color: shippingCost > 0 ? "#1C1917" : "#9A8F82"}}>
                {shippingCost > 0 ? "Rp " + shippingCost.toLocaleString("id-ID") : "Calculated at next step"}
              </span>
            </div>
            {voucherDiscount > 0 && (
              <div style={{display:"flex", justifyContent:"space-between", marginBottom:"8px"}}>
                <span style={{fontSize:"13px", color:"#2E7D32"}}>Diskon ({voucherCode})</span>
                <span style={{fontSize:"13px", color:"#2E7D32"}}>- Rp {voucherDiscount.toLocaleString("id-ID")}</span>
              </div>
            )}

            <div style={{height:"1px", background:"rgba(28,25,23,0.08)", marginBottom:"20px"}} />

            <div style={{display:"flex", justifyContent:"space-between", marginBottom:"28px", alignItems:"baseline"}}>
              <span style={{fontSize:"15px", fontWeight:600, color:"#1C1917"}}>Total</span>
              <div style={{textAlign:"right"}}>
                <span style={{fontSize:"11px", color:"#9A8F82", letterSpacing:"1px", marginRight:"8px"}}>IDR</span>
                <span style={{fontSize:"20px", fontWeight:600, color:"#1C1917"}}>Rp {total.toLocaleString("id-ID")}</span>
              </div>
            </div>

            <button type="submit" disabled={submitting || !selectedShipping}
              style={{display:"block", width:"100%", background: (!selectedShipping||submitting) ? "#9A8F82" : "#1C1917", color:"#FAF8F4", padding:"16px", fontSize:"11px", letterSpacing:"3px", textTransform:"uppercase", border:"none", cursor: (!selectedShipping||submitting) ? "not-allowed" : "pointer", fontFamily:"var(--font-jost)", fontWeight:500}}>
              {submitting ? "Processing..." : "Continue to Payment"}
            </button>
          </div>
        </div>
      </form>

      <style>{`
        @media (max-width: 768px) {
          .checkout-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
          .submit-mobile { display: block !important; }
        }
        input::placeholder, textarea::placeholder { color: #9A8F82; }
        input:focus, textarea:focus, select:focus { border-bottom-color: #1C1917 !important; }
      `}</style>
    </div>
  );
}
