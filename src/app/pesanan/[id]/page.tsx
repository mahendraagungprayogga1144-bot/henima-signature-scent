import Image from "next/image";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import OrderStatusTracker from "@/components/OrderStatusTracker";
import { getDatabase } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { formatRupiah, formatDate } from "@/lib/format";
import {
  ORDER_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
} from "@/lib/types";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/masuk");

  const db = await getDatabase();
  const order = db.orders.find((o) => o.id === id);
  if (!order) notFound();
  if (user.role === "reseller" && order.resellerId !== user.id) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <Link href={user.role === "admin" ? "/admin/pesanan" : "/pesanan"} className="text-sm text-brand-700 hover:underline">
        ← Kembali
      </Link>
      <h1 className="mt-4 text-2xl font-bold">Detail Pesanan</h1>
      <p className="font-mono text-stone-600">{order.id}</p>

      <div className="card mt-6">
        <h2 className="mb-6 font-semibold">Status Pesanan</h2>
        <OrderStatusTracker current={order.status} />
      </div>

      <div className="card mt-6 space-y-3">
        <h2 className="font-semibold">Ringkasan</h2>
        <p>
          <span className="text-ink-400">Status saat ini:</span>{" "}
          <strong>{ORDER_STATUS_LABELS[order.status]}</strong>
        </p>
        <p>
          <span className="text-ink-400">Dibuat:</span> {formatDate(order.createdAt)}
        </p>
        <p>
          <span className="text-ink-400">Alamat:</span> {order.shipping.address}
        </p>
        {order.resi && (
          <p>
            <span className="text-ink-400">Resi:</span>{" "}
            <span className="font-mono">{order.resi}</span>
          </p>
        )}
        <ul className="divide-y divide-ink-800 border-t border-ink-800 pt-3">
          {order.items.map((item) => (
            <li
              key={`${item.productId}:${item.variantId}`}
              className="flex justify-between py-2 text-sm"
            >
              <span>
                {item.productName} {item.sizeMl}ml × {item.quantity}
              </span>
              <span>{formatRupiah(item.subtotal)}</span>
            </li>
          ))}
        </ul>
        <p className="border-t border-ink-800 pt-3 text-right text-sm text-ink-300">Subtotal: {formatRupiah(order.total)}</p>
        {(order as any).shippingCost > 0 && <p className="text-right text-sm text-ink-300">Ongkir: {formatRupiah((order as any).shippingCost)}</p>}
        <p className="border-t border-ink-800 pt-3 text-right text-lg font-bold">
          Total: {formatRupiah(order.total + ((order as any).shippingCost ?? 0))}
        </p>
      </div>

      {(order.paymentMethod || order.paymentProof) && (
        <div className="card mt-6">
          <h2 className="font-semibold">Pembayaran</h2>
          {order.paymentMethod && (
            <p className="mt-2 text-sm">
              Metode: {PAYMENT_METHOD_LABELS[order.paymentMethod]}
            </p>
          )}
          {order.invoicePdf && (
            <p className="mt-2 text-sm">
              <a
                href={order.invoicePdf}
                className="text-gold-300 hover:text-gold-200 hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                Download invoice (PDF)
              </a>
            </p>
          )}
          {order.paymentProof && (
            <div className="relative mt-4 h-64 w-full">
              <Image
                src={order.paymentProof}
                alt="Bukti pembayaran"
                fill
                className="rounded-lg object-contain"
              />
            </div>
          )}
        </div>
      )}

      {!order.paymentProof && user.role === "reseller" && (
        <Link href={`/pembayaran/${order.id}`} className="btn-primary mt-6 inline-block">
          Lengkapi Pembayaran
        </Link>
      )}

      {order.statusHistory.length > 0 && (
        <div className="card mt-6">
          <h2 className="font-semibold">Riwayat Status</h2>
          <ul className="mt-4 space-y-3">
            {[...order.statusHistory].reverse().map((entry, i) => (
              <li key={i} className="text-sm">
                <span className="font-medium">
                  {ORDER_STATUS_LABELS[entry.status]}
                </span>
                <span className="text-stone-500"> — {formatDate(entry.at)}</span>
                {entry.note && (
                  <p className="text-stone-600">{entry.note}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
