"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { addToCart } from "@/lib/cart";

function Countdown({ endAt }: { endAt: string }) {
  const [time, setTime] = useState({ h: "00", m: "00", s: "00" });

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, Math.floor((new Date(endAt).getTime() - Date.now()) / 1000));
      const h = Math.floor(diff / 3600);
      const m = Math.floor((diff % 3600) / 60);
      const s = diff % 60;
      const pad = (n: number) => String(n).padStart(2, "0");
      setTime({ h: pad(h), m: pad(m), s: pad(s) });
    };
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, [endAt]);

  const box = (val: string, label: string) => (
    <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: "6px", padding: "4px 10px", textAlign: "center", minWidth: "40px" }}>
      <p style={{ fontSize: "18px", fontWeight: 600, color: "#F0EBE3", margin: 0, fontFamily: "monospace" }}>{val}</p>
      <p style={{ fontSize: "9px", color: "rgba(200,184,154,0.5)", margin: 0, letterSpacing: "1px", textTransform: "uppercase" }}>{label}</p>
    </div>
  );

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      {box(time.h, "Jam")}
      <span style={{ color: "rgba(200,184,154,0.4)", fontSize: "18px" }}>:</span>
      {box(time.m, "Menit")}
      <span style={{ color: "rgba(200,184,154,0.4)", fontSize: "18px" }}>:</span>
      {box(time.s, "Detik")}
    </div>
  );
}

export default function FlashSaleSection() {
  const [sales, setSales] = useState<any[]>([]);
  const router = useRouter();

  function buyNow(sale: any) {
    addToCart({
      productId: sale.product_id,
      productName: sale.product_name,
      productPhoto: "",
      variantId: sale.product_id + "-50ml",
      sizeMl: 50,
      price: sale.flash_price,
      quantity: 1,
      isFlashSale: true,
      originalPrice: sale.original_price,
    });
    window.dispatchEvent(new Event("cart-updated"));
    setTimeout(() => router.push("/checkout"), 100);
  }

  useEffect(() => {
    fetch("/api/flash-sale")
      .then(r => r.json())
      .then(setSales)
      .catch(() => {});
  }, []);

  if (sales.length === 0) return null;

  const endAt = sales[0]?.end_at;

  return (
    <section style={{ background: "#1C1917", padding: "48px 8vw", fontFamily: "var(--font-jost)" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#E53935" stroke="none">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
          </svg>
          <div>
            <p style={{ fontSize: "10px", letterSpacing: "3px", color: "#B5935A", margin: 0, textTransform: "uppercase" }}>Flash Sale</p>
            <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: "28px", fontWeight: 300, fontStyle: "italic", color: "#F0EBE3", margin: 0 }}>
              {sales[0]?.name || "Flash Sale Spesial"}
            </h2>
          </div>
        </div>
        {endAt && (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <p style={{ fontSize: "11px", color: "rgba(200,184,154,0.5)", margin: 0 }}>Berakhir dalam</p>
            <Countdown endAt={endAt} />
          </div>
        )}
      </div>

      {/* Products */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 200px))", gap: "2px", background: "rgba(200,184,154,0.08)", justifyContent: "start" }}>
        {sales.map(sale => {
          const progress = sale.stock_limit > 0 ? Math.min(100, Math.round(sale.sold_count / sale.stock_limit * 100)) : 0;
          const remaining = sale.stock_limit - sale.sold_count;
          return (
            <div key={sale.id} onClick={() => buyNow(sale)} style={{ textDecoration: "none", background: "#1C1917", display: "block", transition: "background 0.2s", cursor: "pointer" }}>
              <div style={{ padding: "20px" }}>
                {/* Badge */}
                <div style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "#E53935", color: "#fff", fontSize: "10px", fontWeight: 600, padding: "3px 10px", borderRadius: "20px", marginBottom: "12px" }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="#fff"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                  {sale.discount_type === "percent" ? `-${sale.discount_value}%` : `Hemat Rp ${sale.discount_value?.toLocaleString("id-ID")}`}
                </div>

                <p style={{ fontSize: "14px", fontWeight: 500, color: "#F0EBE3", margin: "0 0 6px" }}>{sale.product_name}</p>

                <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "12px" }}>
                  <span style={{ fontSize: "18px", fontWeight: 600, color: "#E53935" }}>Rp {sale.flash_price?.toLocaleString("id-ID")}</span>
                  <span style={{ fontSize: "12px", color: "rgba(200,184,154,0.4)", textDecoration: "line-through" }}>Rp {sale.original_price?.toLocaleString("id-ID")}</span>
                </div>

                {/* Progress */}
                <div style={{ marginBottom: "6px" }}>
                  <div style={{ height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "2px", overflow: "hidden" }}>
                    <div style={{ width: progress + "%", height: "100%", background: progress > 70 ? "#E53935" : "#B5935A", borderRadius: "2px", transition: "width 0.5s" }}></div>
                  </div>
                </div>
                <p style={{ fontSize: "11px", color: "rgba(200,184,154,0.5)", margin: 0 }}>
                  {remaining > 0 ? `Sisa ${remaining} lagi` : "Habis"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
