"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatRupiah } from "@/lib/format";

export default function ShippingCostInput({
  orderId,
  currentShippingCost,
  courierName,
}: {
  orderId: string;
  currentShippingCost: number;
  courierName?: string;
}) {
  const router = useRouter();
  const [cost, setCost] = useState(currentShippingCost || 0);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await fetch(`/api/admin/orders/${orderId}/shipping-cost`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shippingCost: cost }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-2xl border border-ink-800 bg-ink-950/30 p-4 space-y-2">
      <p className="text-sm font-semibold text-ink-50">Ongkos Kirim</p>
      {courierName && (
        <p className="text-xs text-ink-300">Kurir: {courierName}</p>
      )}
      <div className="flex gap-2 items-center">
        <span className="text-sm text-ink-300">Rp</span>
        <input
          type="number"
          value={cost}
          onChange={(e) => setCost(Number(e.target.value))}
          className="input-field flex-1"
          placeholder="0"
          min={0}
        />
      </div>
      <button
        onClick={handleSave}
        disabled={saving}
        className="btn-primary w-full"
      >
        {saving ? "Menyimpan..." : saved ? "✓ Tersimpan!" : "Simpan Ongkir"}
      </button>
    </div>
  );
}
