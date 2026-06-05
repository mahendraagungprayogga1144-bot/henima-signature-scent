"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/types";
import { formatRupiah } from "@/lib/format";
import { COURIERS, PROVINCES, calculateShipping } from "@/lib/shipping";

interface Props {
  products: Product[];
  defaultShipping: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    province: string;
    postalCode: string;
  };
  preselectId?: string;
}

export default function OrderForm({ products, defaultShipping, preselectId }: Props) {
  const router = useRouter();
  const [orderType, setOrderType] = useState<"reseller" | "satuan">("reseller");
  const [courierCode, setCourierCode] = useState("jne");
  const [shipping, setShipping] = useState(defaultShipping);
  const [selections, setSelections] = useState
    Record<string, { variantId: string; sizeMl: 30 | 50 | 100; quantity: number }>
  >(() => {
    const init: Record<string, { variantId: string; sizeMl: 30 | 50 | 100; quantity: number }> = {};
    products.forEach((p) => {
      const preferred =
        p.variants.find((v) => v.active && v.sizeMl === 50) ||
        p.variants.find((v) => v.active) ||
        p.variants[0];
      if (!preferred) return;
      init[p.id] = { variantId: preferred.id, sizeMl: preferred.sizeMl, quantity: p.id === preselectId ? 1 : 0 };
    });
    return init;
  });
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const total = products.reduce((sum, p) => {
    const sel = selections[p.id];
    if (!sel || sel.quantity <= 0) return sum;
    const v = p.variants.find((x) => x.id === sel.variantId);
    if (!v) return sum;
    const unit = orderType === "reseller" ? v.discountPrice : v.originalPrice;
    return sum + unit * sel.quantity;
  }, 0);

  const totalItems = products.reduce((s, p) => s + (selections[p.id]?.quantity || 0), 0);

  const shippingCost = useMemo(() => {
    if (!shipping.province || totalItems === 0) return 0;
    return calculateShipping(shipping.province, courierCode, totalItems);
  }, [shipping.province, courierCode, totalItems]);

  const grandTotal = total + shippingCost;
  const selectedCourier = COURIERS.find((c) => c.code === courierCode);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const items = products.map((p) => {
      const sel = selections[p.id];
      if (!sel || sel.quantity <= 0) return null;
      return { productId: p.id, variantId: sel.variantId, sizeMl: sel.sizeMl, quantity: sel.quantity };
    }).filter(Boolean) as { productId: string; variantId: string; sizeMl: 30 | 50 | 100; quantity: number }[];

    if (items.length === 0) return setError("Pilih minimal satu produk");
    if (orderType === "reseller" && totalItems < 3) return setError("Minimal 3 pcs untuk pesanan reseller");
    if (!shipping.fullName.trim()) return setError("Nama lengkap wajib diisi");
    if (!shipping.phone.trim()) return setError("Nomor HP wajib diisi");
    if (!shipping.address.trim()) return setError("Alamat lengkap wajib diisi");
    if (!shipping.province) return setError("Pilih provinsi tujuan");
    if (!shipping.city.trim()) return setError("Kota wajib diisi");

    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderType,
          courier: { code: courierCode, name: selectedCourier?.name ?? courierCode },
          shipping,
          items,
          notes,
          shippingCost,
        }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error || "Gagal membuat pesanan");
      router.push(`/pembayaran/${data.orderId}`);
    } catch { setError("Terjadi kesalahan jaringan"); }
    finally { setLoading(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="card space-y-4">
        <h2 className="font-semibold">Tipe Pesanan</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {(["reseller", "satuan"] as const).map((type) => (
            <label key={type} className="flex cursor-pointer items-start gap-3 rounded-2xl border border-ink-800 bg-ink-950/30 p-4 has-[:checked]:border-gold-400 has-[:checked]:bg-ink-950/60">
              <input type="radio" name="orderType" value={type} className="mt-1" checked={orderType === type} onChange={() => setOrderType(type)} />
              <div>
                <p className="font-semibold text-ink-50">{type === "reseller" ? "Reseller (Grosir)" : "Satuan (Retail)"}</p>
                <p className="mt-1 text-sm text-ink-300">{type === "reseller" ? "Min. 3 pcs, harga khusus." : "Harga normal (tanpa minimum)."}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="card space-y-4">
        <h2 className="font-semibold">Pilih Produk & Varian</h2>
        {products.map((product) => {
          const sel = selections[product.id];
          const activeVariants = product.variants.filter((v) => v.active);
          const current = product.variants.find((v) => v.id === sel?.variantId);
          const unit = current ? (orderType === "reseller" ? current.discountPrice : current.originalPrice) : 0;
          const stock = (current as any)?.stock ?? 0;
          return (
            <div key={product.id} className="grid gap-3 rounded-2xl border border-ink-800 bg-ink-950/20 p-4 sm:grid-cols-[1fr_180px_120px]">
              <div>
                <p className="font-semibold text-ink-50">{product.name}</p>
                <p className="mt-1 text-sm text-ink-300">
                  {formatRupiah(unit)} / unit <span className="text-ink-400">•</span>{" "}
                  <span className={stock <= 0 ? "text-red-300" : "text-ink-300"}>tersisa {stock} item</span>
                </p>
              </div>
              <div>
                <label className="label">Varian</label>
                <select className="input-field" value={sel?.variantId} onChange={(e) => {
                  const v = product.variants.find((x) => x.id === e.target.value);
                  if (!v) return;
                  setSelections((prev) => ({ ...prev, [product.id]: { variantId: v.id, sizeMl: v.sizeMl, quantity: prev[product.id]?.quantity || 0 } }));
                }}>
                  {activeVariants.map((v) => <option key={v.id} value={v.id}>{v.sizeMl}ml</option>)}
                </select>
              </div>
              <div>
                <label className="label">Qty</label>
                <input type="number" min={0} max={stock <= 0 ? 0 : stock} value={sel?.quantity || 0}
                  disabled={stock <= 0}
                  onChange={(e) => setSelections((prev) => ({
                    ...prev,
                    [product.id]: {
                      variantId: prev[product.id]?.variantId || activeVariants[0]?.id || "",
                      sizeMl: prev[product.id]?.sizeMl || (activeVariants[0]?.sizeMl ?? 50),
                      quantity: Math.min(stock, Math.max(0, parseInt(e.target.value, 10) || 0)),
                    },
                  }))} className="input-field text-center" />
              </div>
            </div>
          );
        })}
        <div className="flex items-center justify-between border-t border-ink-800 pt-4">
          <p className="text-sm text-ink-300">Total item: <span className="font-semibold text-ink-50">{totalItems}</span></p>
          <p className="text-right font-bold text-gold-200">Subtotal: {formatRupiah(total)}</p>
        </div>
      </div>

      <div className="card space-y-4">
        <div>
          <h2 className="font-semibold">Pengiriman</h2>
          <p className="mt-1 text-sm text-ink-300">Lengkapi data pengiriman untuk proses packing & resi.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Nama Lengkap</label>
            <input className="input-field" value={shipping.fullName} onChange={(e) => setShipping((s) => ({ ...s, fullName: e.target.value }))} required />
          </div>
          <div>
            <label className="label">Nomor HP</label>
            <input className="input-field" value={shipping.phone} onChange={(e) => setShipping((s) => ({ ...s, phone: e.target.value }))} required />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Alamat Lengkap (Jalan, No. RT/RW)</label>
            <textarea className="input-field" rows={3} value={shipping.address} onChange={(e) => setShipping((s) => ({ ...s, address: e.target.value }))} required />
          </div>
          <div>
            <label className="label">Provinsi Tujuan</label>
            <select className="input-field" value={shipping.province} onChange={(e) => setShipping((s) => ({ ...s, province: e.target.value }))} required>
              <option value="">-- Pilih Provinsi --</option>
              {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Kota / Kabupaten</label>
            <input className="input-field" value={shipping.city} onChange={(e) => setShipping((s) => ({ ...s, city: e.target.value }))} required />
          </div>
          <div>
            <label className="label">Kode Pos</label>
            <input className="input-field" value={shipping.postalCode} onChange={(e) => setShipping((s) => ({ ...s, postalCode: e.target.value }))} />
          </div>
          <div>
            <label className="label">Kurir</label>
            <select className="input-field" value={courierCode} onChange={(e) => setCourierCode(e.target.value)}>
              {COURIERS.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="label">Catatan (opsional)</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="input-field" />
        </div>
      </div>

      {shipping.province && totalItems > 0 && (
        <div className="card space-y-2">
          <h2 className="font-semibold">Ringkasan Biaya</h2>
          <div className="flex justify-between text-sm text-ink-300">
            <span>Subtotal produk ({totalItems} item)</span>
            <span>{formatRupiah(total)}</span>
          </div>
          <div className="flex justify-between text-sm text-ink-300">
            <span>Ongkir {selectedCourier?.name} ke {shipping.province}</span>
            <span>{formatRupiah(shippingCost)}</span>
          </div>
          <div className="flex justify-between border-t border-ink-800 pt-2 text-lg font-bold text-gold-200">
            <span>Total</span>
            <span>{formatRupiah(grandTotal)}</span>
          </div>
        </div>
      )}

      <button type="submit" disabled={loading || total === 0 || !shipping.province} className="btn-primary w-full">
        {loading ? "Memproses..." : "Lanjut ke Pembayaran"}
      </button>
    </form>
  );
}
