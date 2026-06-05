import Link from "next/link";
import { redirect } from "next/navigation";
import WhatsAppNotifyBanner from "@/components/WhatsAppNotifyBanner";
import { getDatabase } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { formatRupiah, formatDate } from "@/lib/format";
import type { OrderStatus } from "@/lib/types";
import { ORDER_STATUS_FLOW, ORDER_STATUS_LABELS } from "@/lib/types";
import ShippingCostInput from "./AdminOrderCard";

function getNextStatus(current: OrderStatus): OrderStatus | null {
  const idx = ORDER_STATUS_FLOW.indexOf(current);
  if (idx < 0) return null;
  return ORDER_STATUS_FLOW[Math.min(idx + 1, ORDER_STATUS_FLOW.length - 1)] || null;
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ updated?: string; wa?: string; error?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/masuk");
  if (user.role !== "admin") redirect("/katalog");

  const { updated, wa, error } = await searchParams;
  const db = await getDatabase();
  const orders = db.orders
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div>
      <Link href="/admin" className="text-sm text-brand-700 hover:underline">
        ← Dashboard
      </Link>
      <h1 className="mt-4 text-2xl font-bold">Kelola Pesanan</h1>

      {updated && wa && (
        <div className="mt-6">
          <WhatsAppNotifyBanner url={decodeURIComponent(wa)} orderId={updated} />
        </div>
      )}
      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {decodeURIComponent(error)}
        </p>
      )}

      {orders.length === 0 ? (
        <p className="mt-8 text-stone-600">Belum ada pesanan.</p>
      ) : (
        <div className="mt-8 space-y-6">
          {orders.map((order) => {
            const shippingCost = (order as any).shippingCost ?? 0;
            const courierInfo = typeof (order as any).courier === "object"
              ? `${(order as any).courier?.name ?? ""} ${(order as any).courier?.service ?? ""}`.trim()
              : String((order as any).courier ?? "");
            const grandTotal = order.total + shippingCost;

            return (
              <article key={order.id} className="card">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <Link
                      href={`/pesanan/${order.id}`}
                      className="font-mono font-medium text-brand-700 hover:underline"
                    >
                      {order.id}
                    </Link>
                    <p className="mt-1 text-sm text-stone-600">
                      {order.resellerName} — {order.storeName}
                    </p>
                    <p className="text-sm text-stone-500">{formatDate(order.createdAt)}</p>
                    <p className="mt-2 text-sm text-ink-300">Subtotal produk: {formatRupiah(order.total)}</p>
                    {shippingCost > 0 && (
                      <p className="text-sm text-ink-300">Ongkir: {formatRupiah(shippingCost)}</p>
                    )}
                    <p className="font-semibold text-gold-200">
                      Total: {formatRupiah(grandTotal)}
                    </p>
                    <p className="text-sm">
                      Status:{" "}
                      <span className="font-medium">{ORDER_STATUS_LABELS[order.status]}</span>
                    </p>
                    {courierInfo && (
                      <p className="text-sm text-ink-300">Kurir: {courierInfo}</p>
                    )}
                    {order.shipping && (
                      <p className="text-sm text-ink-300">
                        Tujuan: {(order.shipping as any).city}, {(order.shipping as any).province}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-3 sm:min-w-[280px]">
                    <ShippingCostInput
                      orderId={order.id}
                      currentShippingCost={shippingCost}
                      courierName={courierInfo}
                    />

                    {order.status === "pending_confirmation" && order.paymentProof && (
                      <form
                        action={`/api/admin/orders/${order.id}/confirm-payment`}
                        method="POST"
                        className="rounded-2xl border border-ink-800 bg-ink-950/30 p-4"
                      >
                        <p className="text-sm font-semibold text-ink-50">Pembayaran</p>
                        <p className="mt-1 text-xs text-ink-300">
                          Bukti bayar sudah diunggah.
                        </p>
                        <a href={order.paymentProof} target="_blank" rel="noreferrer" className="mt-2 inline-block rounded-lg border border-gold-400/30 bg-gold-400/10 px-3 py-1 text-xs font-semibold text-gold-300 hover:bg-gold-400/20">
                          👁 Lihat Bukti Pembayaran
                        </a>
                        <button type="submit" className="btn-primary mt-3 w-full">
                          Konfirmasi Pembayaran
                        </button>
                      </form>
                    )}

                    <form
                      action={`/api/admin/orders/${order.id}/status`}
                      method="POST"
                      className="flex flex-col gap-2"
                    >
                      <label className="label">Update status</label>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {ORDER_STATUS_FLOW.map((s) => (
                          <button
                            key={s}
                            name="status"
                            value={s}
                            type="submit"
                            className={s === order.status ? "btn-secondary" : "btn-primary"}
                          >
                            {ORDER_STATUS_LABELS[s]}
                          </button>
                        ))}
                      </div>
                      <input name="resi" placeholder="Resi (opsional)" className="input-field" defaultValue={order.resi || ""} />
                      <input name="note" placeholder="Catatan (opsional)" className="input-field" />
                      {getNextStatus(order.status) && (
                        <button
                          type="submit"
                          name="status"
                          value={getNextStatus(order.status) as OrderStatus}
                          className="btn-primary"
                        >
                          Next: {ORDER_STATUS_LABELS[getNextStatus(order.status)!]}
                        </button>
                      )}
                    </form>
                  </div>
                </div>
                <ul className="mt-4 border-t border-stone-100 pt-3 text-sm text-stone-600">
                  {order.items.map((item) => (
                    <li key={item.productId}>
                      {item.productName} × {item.quantity}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
