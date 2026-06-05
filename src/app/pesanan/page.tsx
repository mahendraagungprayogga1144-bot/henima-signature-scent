import Link from "next/link";
import { redirect } from "next/navigation";
import { getDatabase } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { formatRupiah, formatDate } from "@/lib/format";
import { ORDER_STATUS_LABELS } from "@/lib/types";

export default async function OrdersListPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/masuk");
  if (user.role !== "reseller") redirect("/admin");

  const db = await getDatabase();
  const orders = db.orders
    .filter((o) => o.resellerId === user.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Pesanan Saya</h1>
        <Link href="/pesan" className="btn-primary">Pesanan Baru</Link>
      </div>
      {orders.length === 0 ? (
        <p className="mt-8 text-ink-300">Belum ada pesanan.</p>
      ) : (
        <ul className="mt-6 space-y-4">
          {orders.map((order, idx) => {
            const productNames = order.items
              .map((item) => `${item.productName} ${item.sizeMl}ml × ${item.quantity}`)
              .join(", ");
            const shippingCost = (order as any).shippingCost ?? 0;
            const grandTotal = order.total + shippingCost;
            const shortId = order.id.slice(0, 10);
            return (
              <li key={order.id}>
                <Link
                  href={`/pesanan/${order.id}`}
                  className="card block transition hover:border-gold-400/40 hover:shadow-md"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-bold text-ink-50">Pesanan #{orders.length - idx}</p>
                      <p className="text-sm font-medium text-gold-300">{order.resellerName} — {order.storeName}</p>
                      <p className="mt-1 text-sm text-ink-300">{productNames}</p>
                      <p className="mt-1 text-xs text-ink-400">
                        📅 {formatDate(order.createdAt)} • <span className="font-mono">#{shortId}</span>
                      </p>
                    </div>
                    <span className="rounded-full border border-ink-800 bg-ink-950/40 px-3 py-1 text-xs font-semibold text-ink-100">
                      {ORDER_STATUS_LABELS[order.status]}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-ink-800 pt-3">
                    <p className="font-bold text-gold-200">{formatRupiah(grandTotal)}</p>
                    {order.invoicePdf && (
                      <span className="text-xs font-semibold text-gold-300">Invoice ready</span>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
