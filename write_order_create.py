with open("src/app/api/orders/create/route.ts", "w") as f:
    f.write('''import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const ADMIN_WA = process.env.ADMIN_WHATSAPP || "6285190311230";

export async function POST(request: Request) {
  const body = await request.json();
  const {
    items, name, phone, email, address, city, province,
    postalCode, courier, courierName, shippingCost, subtotal, total,
  } = body;

  const orderId = "ORD-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6).toUpperCase();

  const { error } = await supabase.from("retail_orders").insert({
    id: orderId,
    items: items,
    customer: { name, phone, email, address, city, province, postalCode },
    courier,
    courier_name: courierName,
    shipping_cost: shippingCost,
    subtotal,
    total,
    status: "pending_payment",
  });

  if (error) {
    console.error("Order error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Kirim notifikasi WA ke admin via Fonnte
  try {
    const itemsList = items.map((i: any) => `${i.productName} ${i.sizeMl}ml x${i.quantity}`).join("\\n");
    const msg = `ORDER BARU MASUK!

Order ID: ${orderId}
Nama: ${name}
WA: ${phone}
Kota: ${city}

Produk:
${itemsList}

Ongkir: Rp ${Number(shippingCost).toLocaleString("id-ID")}
Total: Rp ${Number(total).toLocaleString("id-ID")}

Cek di: henimaofficial.com/admin/orders`;

    const res = await fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: {
        "Authorization": process.env.FONNTE_TOKEN || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        target: ADMIN_WA,
        message: msg,
      }),
    });
    const result = await res.json();
    console.log("Fonnte response:", result);
  } catch (e) {
    console.error("WA notif error:", e);
  }

  return NextResponse.json({ orderId });
}
''')
print("Done!")
