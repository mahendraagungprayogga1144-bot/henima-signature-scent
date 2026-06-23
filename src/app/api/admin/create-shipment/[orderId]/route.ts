import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/session";
import { Resend } from "resend";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params;
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { data: order, error: orderError } = await supabase
    .from("retail_orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (orderError || !order) return NextResponse.json({ error: "Order tidak ditemukan" }, { status: 404 });

  const customer = typeof order.customer === "string" ? JSON.parse(order.customer) : order.customer;

  const biteshipPayload = {
    shipper_contact_name: "Henima",
    shipper_contact_phone: "085190311230",
    origin_contact_name: "Henima",
    origin_contact_phone: "085190311230",
    origin_address: "Santosa Taman Residence Blok G No 1, Taman, Sidoarjo",
    origin_coordinate: { latitude: -7.4088, longitude: 112.6604 },
    destination_contact_name: customer?.name || "Customer",
    destination_contact_phone: customer?.phone || "081234567890",
    destination_address: `${customer?.address}, ${customer?.city}, ${customer?.province}`,
    destination_postal_code: parseInt(customer?.postalCode) || 60000,
    destination_coordinate: { latitude: -7.0, longitude: 112.7 },
    courier_company: order.courier_code?.split("-")[0] || "jne",
    courier_type: order.courier_code?.split("-")[1] || "reg",
    delivery_type: "now",
    reference_id: orderId,
    items: order.items?.map((item: any) => ({
      name: item.productName || item.name,
      value: item.price || 0,
      length: 10,
      width: 10,
      height: 10,
      weight: 380,
      quantity: item.quantity || item.qty || 1,
    })) || [{ name: "Parfum Henima", value: order.total || 0, length: 10, width: 10, height: 10, weight: 380, quantity: 1 }],
  };

  const biteshipRes = await fetch("https://api.biteship.com/v1/orders", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.BITESHIP_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(biteshipPayload),
  });

  const biteshipData = await biteshipRes.json();

  if (!biteshipData.success) {
    return NextResponse.json({ error: biteshipData.error || "Gagal membuat pengiriman di Biteship" }, { status: 500 });
  }

  const resi = biteshipData.courier?.waybill_id || biteshipData.id;
  const biteshipOrderId = biteshipData.id;

  await supabase
    .from("retail_orders")
    .update({
      status: "shipped",
      resi,
      biteship_order_id: biteshipOrderId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId);

  try {
    const customerEmail = order.email || customer?.email;
    const customerName = order.name || customer?.name || "Pelanggan";
    if (customerEmail) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "Henima Signature Scent <noreply@henimaofficial.com>",
        to: customerEmail,
        subject: `Pesanan Kamu Sedang Dikirim - ${orderId}`,
        html: `<!DOCTYPE html><html><body style="font-family:Georgia,serif;background:#FAF8F4;margin:0;padding:0;"><div style="max-width:560px;margin:0 auto;padding:40px 24px;"><div style="text-align:center;margin-bottom:40px;"><h1 style="font-family:Georgia,serif;font-size:28px;font-weight:300;letter-spacing:8px;color:#1C1917;margin:0;">HENIMA</h1><p style="font-size:10px;letter-spacing:3px;color:#9A8F82;text-transform:uppercase;margin-top:4px;">Signature Scent</p></div><div style="border-top:1px solid #E8E0D5;border-bottom:1px solid #E8E0D5;padding:32px 0;margin-bottom:32px;text-align:center;"><p style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#B5935A;margin-bottom:8px;">Sedang Dikirim</p><h2 style="font-size:22px;font-weight:300;color:#1C1917;margin:0;">${orderId}</h2></div><p style="font-size:14px;color:#6B5E52;line-height:1.8;margin-bottom:32px;">Halo <strong>${customerName}</strong>, pesanan kamu sudah dalam perjalanan!</p><div style="background:#1C1917;padding:24px;margin-bottom:32px;color:#F0EBE3;text-align:center;"><p style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#C8B89A;margin-bottom:8px;">Nomor Resi</p><p style="font-size:22px;font-weight:300;letter-spacing:4px;">${resi}</p></div><div style="text-align:center;margin-bottom:32px;"><a href="https://henimaofficial.com/tracking?orderId=${orderId}" style="display:inline-block;background:#1C1917;color:#FAF8F4;padding:14px 32px;font-size:10px;letter-spacing:3px;text-transform:uppercase;text-decoration:none;">Track Order</a></div><p style="font-size:11px;color:#9A8F82;text-align:center;">Ada pertanyaan? <a href="https://wa.me/6285190311230" style="color:#B5935A;">085190311230</a></p></div></body></html>`,
      });
    }
  } catch (e) {
    console.error("Email error:", e);
  }

  return NextResponse.json({ ok: true, resi, biteshipOrderId });
}
