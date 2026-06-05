import { NextResponse } from "next/server";
import { getDatabase, updateDatabase } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import type { BankCode, PaymentMethod } from "@/lib/types";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await request.formData();
  const paymentMethod = form.get("paymentMethod") as PaymentMethod;
  const paymentBank = form.get("paymentBank") as BankCode | null;
  const file = form.get("proof") as File | null;

  if (!paymentMethod || !["bank_transfer", "qris"].includes(paymentMethod)) {
    return NextResponse.redirect(new URL(`/pembayaran/${id}?error=Metode pembayaran tidak valid`, request.url));
  }

  const db = await getDatabase();
  const order = db.orders.find((o) => o.id === id);
  if (!order) return NextResponse.json({ error: "Pesanan tidak ditemukan" }, { status: 404 });
  if (user.role === "reseller" && order.resellerId !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  let paymentProof: string | undefined;
  if (file && file.size > 0) {
    try {
      const { supabase } = await import("@/lib/supabase");
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext = file.name.split(".").pop() || "jpg";
      const filename = `${id}-${Date.now()}.${ext}`;
      const { data, error } = await supabase.storage
        .from("payment-proofs")
        .upload(filename, buffer, { contentType: file.type || "image/jpeg" });
      if (!error && data) {
        const { data: urlData } = supabase.storage.from("payment-proofs").getPublicUrl(filename);
        paymentProof = urlData.publicUrl;
      }
    } catch { /* skip */ }
  }

  await updateDatabase((data) => {
    const o = data.orders.find((x) => x.id === id);
    if (o) {
      o.paymentMethod = paymentMethod;
      if (paymentMethod === "bank_transfer") {
        if (paymentBank && ["bca", "mandiri", "bri"].includes(paymentBank)) o.paymentBank = paymentBank;
      } else { o.paymentBank = undefined; }
      if (paymentProof) o.paymentProof = paymentProof;
      if (o.status === "pending_payment") {
        o.status = "pending_confirmation";
        o.statusHistory.push({ status: "pending_confirmation", at: new Date().toISOString() });
      }
      o.updatedAt = new Date().toISOString();
    }
  });

  return NextResponse.redirect(new URL(`/pesanan/${id}`, request.url));
}
