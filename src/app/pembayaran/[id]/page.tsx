import Image from "next/image";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { getDatabase } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { formatRupiah } from "@/lib/format";
import { PAYMENT_METHOD_LABELS } from "@/lib/types";

export default async function PaymentPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
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
      {error && (
        <p className="mt-4 rounded-lg border border-red-900/30 bg-red-950/30 px-3 py-2 text-sm text-red-200">
          {decodeURIComponent(error)}
        </p>
      )}

      <form
        action={`/api/orders/${id}/payment`}
        method="POST"
        encType="multipart/form-data"
        className="mt-8 space-y-6"
      >
        <div className="card space-y-4">
          <h2 className="font-semibold">Pilih Metode Pembayaran</h2>
          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-ink-800 bg-ink-950/30 p-4 has-[:checked]:border-gold-400 has-[:checked]:bg-ink-950/60">
            <input
              type="radio"
              name="paymentMethod"
              value="bank_transfer"
              required
              className="mt-1"
              defaultChecked
            />
            <div className="flex-1">
              <p className="font-medium">{PAYMENT_METHOD_LABELS.bank_transfer}</p>
              {defaultBank ? (
                <>
                  <p className="mt-1 text-sm text-ink-300">
                    {defaultBank.bankName} — {defaultBank.accountNumber}
                  </p>
                  <p className="text-sm text-ink-300">a.n. {defaultBank.accountName}</p>
                </>
              ) : (
                <p className="mt-1 text-sm text-ink-300">Belum ada rekening bank aktif.</p>
              )}
              <div className="mt-3">
                <label className="label">Pilih Bank</label>
                <select
                  name="paymentBank"
                  defaultValue={defaultBank?.code}
                  className="input-field"
                >
                  {activeBanks.map((b) => (
                    <option key={b.code} value={b.code}>
                      {b.bankName} — {b.accountNumber}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </label>

          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-ink-800 bg-ink-950/30 p-4 has-[:checked]:border-gold-400 has-[:checked]:bg-ink-950/60">
            <input type="radio" name="paymentMethod" value="qris" required className="mt-1" />
            <div className="flex-1">
              <p className="font-medium">{PAYMENT_METHOD_LABELS.qris}</p>
              <div className="relative mt-3 mx-auto h-48 w-48">
                <Image
                  src={settings.payment.qrisImage}
                  alt="QRIS"
                  fill
                  className="object-contain"
                />
              </div>
              <p className="mt-2 text-center text-xs text-ink-400">
                Scan QRIS untuk membayar {formatRupiah(order.total)}
              </p>
            </div>
          </label>
        </div>

        <div className="card">
          <label htmlFor="proof" className="label">
            Unggah Bukti Pembayaran
          </label>
          <input
            id="proof"
            name="proof"
            type="file"
            accept="image/*,.pdf"
            className="block w-full text-sm text-ink-300 file:mr-4 file:rounded-lg file:border-0 file:bg-ink-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-ink-50"
          />
          <p className="mt-2 text-xs text-ink-400">
            Format: JPG, PNG, atau PDF. Maks. 4MB.
          </p>
        </div>

        <button type="submit" className="btn-primary w-full">
          Kirim Bukti & Lacak Pesanan
        </button>
      </form>

      <p className="mt-4 text-center text-sm">
        <Link href={`/pesanan/${id}`} className="text-gold-300 hover:text-gold-200 hover:underline">
          Lewati — lihat status pesanan
        </Link>
      </p>
    </div>
  );
}
