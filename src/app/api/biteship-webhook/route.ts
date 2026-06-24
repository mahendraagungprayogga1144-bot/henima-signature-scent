import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const STATUS_LABELS: Record<string, string> = {
  pending: "Menunggu",
  confirmed: "Dikonfirmasi",
  allocated: "Kurir Dialokasikan",
  picking_up: "Kurir Menuju Pickup",
  picked: "Barang Diambil",
  dropping_off: "Dalam Pengiriman",
  delivered: "Paket Diterima",
  cancelled: "Dibatalkan",
  on_hold: "Ditahan",
  returned: "Dikembalikan",
};

const ORDER_STATUS_MAP: Record<string, string> = {
  delivered: "delivered",
  cancelled: "cancelled",
  returned: "returned",
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { order_id, status, waybill_id, courier } = body;

    if (!order_id || !status) {
      return NextResponse.json({ status: "ignored" });
    }

    // Cari order berdasarkan biteship_order_id atau resi
    const { data: order } = await supabase
      .from("retail_orders")
      .select("*")
      .or(`biteship_order_id.eq.${order_id},resi.eq.${waybill_id}`)
      .single();

    if (!order) {
      return NextResponse.json({ status: "order not found" });
    }

    // Update status order kalau perlu
    const newStatus = ORDER_STATUS_MAP[status];
    if (newStatus) {
      await supabase
        .from("retail_orders")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", order.id);
    }

    // Kirim notif WA ke admin
    const statusLabel = STATUS_LABELS[status] || status;
    const customer = typeof order.customer === "string" ? JSON.parse(order.customer) : order.customer;
    const adminMsg = `🚚 *Update Pengiriman*

Order: ${order.id}
Customer: ${customer?.name || "-"}
Resi: ${waybill_id || order.resi || "-"}
Status: *${statusLabel}*
${status === "delivered" ? "\n✅ Paket sudah diterima customer!" : ""}
${status === "cancelled" ? "\n❌ Pengiriman dibatalkan!" : ""}`;

    await fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: {
        "Authorization": process.env.FONNTE_TOKEN || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        target: process.env.ADMIN_WHATSAPP || "6285190311230",
        message: adminMsg,
      }),
    });

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Biteship webhook error:", error);
    return NextResponse.json({ status: "error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: "Biteship webhook aktif" });
}
