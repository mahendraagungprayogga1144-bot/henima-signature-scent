"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { formatRupiah } from "@/lib/format";

export default function PaymentForm({
  orderId,
  total,
  activeBanks,
  defaultBankCode,
  qrisImage,
}: {
  orderId: string;
  total: number;
  activeBanks: { code: string; bankName: string; accountNumber: string; accountName: string }[];
  defaultBankCode?: string;
  qrisImage: string;
}) {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
  const [paymentBank, setPaymentBank] = useState(defaultBankCode || "");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [qrisZoom, setQrisZoom] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("paymentMethod", paymentMethod);
      if (paymentBank) form.append("paymentBank", paymentBank);
      if (file) form.append("proof", file);
      const res = await fetch(`/api/orders/${orderId}/payment`, {
        method: "POST",
        body: form,
      });
      if (res.redirected) {
        router.push(new URL(res.url).pathname);
        return;
      }
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Gagal memproses pembayaran");
        return;
      }
      router.push(`/pesanan/${orderId}`);
    } catch {
      setError("Terjadi kesalahan jaringan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      {error && <p className="rounded-lg bg-red-950/30 px-3 py-2 text-sm text-red-200">{error}</p>}
      <div className="card space-y-4">
        <h2 className="font-semibold">Pilih Metode Pembayaran</h2>
        <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-ink-800 bg-ink-950/30 p-4 has-[:checked]:border-gold-400 has-[:checked]:bg-ink-950/60">
          <input type="radio" name="paymentMethod" value="bank_transfer" className="mt-1"
            checked={paymentMethod === "bank_transfer"} onChange={() => setPaymentMethod("bank_transfer")} />
          <div className="flex-1">
            <p className="font-medium">Transfer Bank</p>
            <div className="mt-3">
              <label className="label">Pilih Bank</label>
              <select name="paymentBank" value={paymentBank} onChange={(e) => setPaymentBank(e.target.value)} className="input-field">
                {activeBanks.map((b) => (
                  <option key={b.code} value={b.code}>{b.bankName} — {b.accountNumber} a.n. {b.accountName}</option>
                ))}
              </select>
            </div>
          </div>
        </label>
        <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-ink-800 bg-ink-950/30 p-4 has-[:checked]:border-gold-400 has-[:checked]:bg-ink-950/60">
          <input type="radio" name="paymentMethod" value="qris" className="mt-1"
            checked={paymentMethod === "qris"} onChange={() => setPaymentMethod("qris")} />
          <div className="flex-1">
            <p className="font-medium">QRIS</p>
            <div className="mt-3 text-center">
              <button type="button" onClick={() => setQrisZoom(true)} className="relative mx-auto block h-48 w-48 cursor-zoom-in overflow-hidden rounded-2xl border border-ink-700 hover:border-gold-400 transition-all">
                <Image src={qrisImage} alt="QRIS" fill className="object-contain p-2" />
              </button>
              <p className="mt-2 text-xs text-ink-400">Tap untuk perbesar • Scan QRIS untuk membayar {formatRupiah(total)}</p>
            </div>
            {qrisZoom && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" onClick={() => setQrisZoom(false)}>
                <div className="relative h-[80vw] w-[80vw] max-h-[500px] max-w-[500px]">
                  <Image src={qrisImage} alt="QRIS" fill className="object-contain" />
                </div>
                <p className="absolute bottom-8 text-sm text-ink-400">Tap untuk menutup</p>
              </div>
            )}
          </div>
        </label>
      </div>
      <div className="card">
        <label className="label">Unggah Bukti Pembayaran</label>
        <input type="file" accept="image/*,.pdf" onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="block w-full text-sm text-ink-300 file:mr-4 file:rounded-lg file:border-0 file:bg-ink-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-ink-50" />
        <p className="mt-2 text-xs text-ink-400">Format: JPG, PNG, atau PDF. Maks. 4MB.</p>
      </div>
      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? "Memproses..." : "Kirim Bukti & Lacak Pesanan"}
      </button>
    </form>
  );
}
