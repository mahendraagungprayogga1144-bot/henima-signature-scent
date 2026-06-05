import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { getDatabase } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { formatRupiah } from "@/lib/format";
import PaymentForm from "./PaymentForm";

export default async function PaymentPage({
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

  const { settings } = db;
  const activeBanks = settings.payment.bankAccounts.filter((b) => b.active);
  const defaultBank = activeBanks[0] ?? settings.payment.bankAccounts[0];

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-bold">Pembayaran</h1>
      <p className="mt-1 text-ink-300">
        Pesanan <span className="font-mono font-medium">{id}</span> — Total{" "}
        <strong>{formatRupiah(order.total)}</strong>
      </p>
      <PaymentForm
        orderId={id}
        total={order.total}
        activeBanks={activeBanks}
        defaultBankCode={defaultBank?.code}
        qrisImage={settings.payment.qrisImage}
      />
      <p className="mt-4 text-center text-sm">
        <Link href={`/pesanan/${id}`} className="text-gold-300 hover:text-gold-200 hover:underline">
          Lewati — lihat status pesanan
        </Link>
      </p>
    </div>
  );
}
