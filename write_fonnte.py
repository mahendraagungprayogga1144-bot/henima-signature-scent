content = open("src/app/api/orders/create/route.ts").read()

new_content = content.replace(
    '''  // Kirim notifikasi WA ke admin
  try {
    const items = body.items.map((i: any) => `${i.productName} ${i.sizeMl}ml x${i.quantity}`).join(", ");
    const msg = encodeURIComponent(
      `🛍️ *ORDER BARU MASUK!*\\n\\n` +
      `Order ID: ${orderId}\\n` +
      `Nama: ${body.name}\\n` +
      `WA: ${body.phone}\\n` +
      `Kota: ${body.city}\\n\\n` +
      `Produk: ${items}\\n` +
      `Ongkir: Rp ${body.shippingCost?.toLocaleString("id-ID")}\\n` +
      `*Total: Rp ${body.total?.toLocaleString("id-ID")}*\\n\\n` +
      `Cek di: henimaofficial.com/admin/orders`
    );
    // Log WA link (bisa dipakai untuk webhook atau manual)
    console.log("WA Admin:", `https://wa.me/${ADMIN_WA}?text=${msg}`);
  } catch (e) {
    console.error("WA notif error:", e);
  }''',
    '''  // Kirim notifikasi WA ke admin via Fonnte
  try {
    const itemsList = body.items.map((i: any) => `${i.productName} ${i.sizeMl}ml x${i.quantity}`).join("\\n");
    const msg = `🛍️ *ORDER BARU MASUK!*

Order ID: ${orderId}
Nama: ${body.name}
WA: ${body.phone}
Kota: ${body.city}

Produk:
${itemsList}

Ongkir: Rp ${Number(body.shippingCost).toLocaleString("id-ID")}
*Total: Rp ${Number(body.total).toLocaleString("id-ID")}*

Cek di: henimaofficial.com/admin/orders`;

    await fetch("https://api.fonnte.com/send", {
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
  } catch (e) {
    console.error("WA notif error:", e);
  }'''
)

open("src/app/api/orders/create/route.ts", "w").write(new_content)
print("Done!")
