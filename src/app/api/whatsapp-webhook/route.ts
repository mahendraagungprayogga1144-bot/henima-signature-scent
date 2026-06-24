import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { supabase } from "@/lib/supabase";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `Kamu adalah Aldo, CS Henima Signature Scent (henimaofficial.com). Brand parfum lokal premium Indonesia lahir dari kisah cinta jarak jauh Jakarta-Surabaya.

PRODUK:
1. AFTERNOON (Best Seller)
   - Extrait de Parfum | Floral Woody | Maskulin dan elegan
   - Top: Apple, Bergamot | Middle: Violet, Cardamom | Base: Sandalwood, Musk, Vanilla
   - Longevity: 24 jam | Cocok: kantor, formal, nongkrong | Rating: 5.0/5.0

2. THE DISTANCE
   - Extrait de Parfum | Sweet Warm Oriental | Unisex
   - Longevity: 24 jam | Cocok: malam hari, acara spesial | Rating: 5.0/5.0

3. BRAVE MAN INTENSE
   - Extrait de Parfum | Maskulin kuat dan intens
   - Cocok: pria berkarakter kuat dan percaya diri

HARGA (sebut HANYA jika customer tanya):
- Semua produk: Rp 185.000 / 50ml

PEMESANAN & PEMBAYARAN:
- Order di henimaofficial.com/shop
- Pembayaran: transfer bank manual (konfirmasi via WA)
- Proses: 1-2 hari kerja setelah pembayaran dikonfirmasi

PENGIRIMAN:
- Ke seluruh Indonesia: JNE, J&T, SiCepat
- Estimasi: 2-5 hari kerja
- Tracking di henimaofficial.com/tracking

RETUR:
- 3 hari setelah diterima, hanya produk rusak/cacat
- Hubungi WA 085190311230 dengan foto bukti

ATURAN:
1. Jawab HANYA seputar Henima
2. Bahasa Indonesia ramah dan natural seperti chat WA beneran
3. Jawaban singkat maksimal 3-4 kalimat per pesan
4. Pakai emoji secukupnya
5. JANGAN sebut harga kecuali customer bertanya
6. Jika customer sebut Order ID (format ORD-xxx), informasikan bahwa kamu sedang cek pesanannya
7. Jika tidak tahu arahkan ke WA admin: 085190311230
8. Perkenalkan diri sebagai Aldo jika ditanya`;

const STATUS_LABELS: Record<string, string> = {
  pending_payment: "Menunggu Pembayaran",
  paid: "Sudah Dibayar",
  processing: "Sedang Diproses",
  shipped: "Sedang Dikirim",
  delivered: "Sudah Diterima",
  cancelled: "Dibatalkan",
};

async function checkOrder(orderId: string) {
  const { data } = await supabase
    .from("retail_orders")
    .select("id, status, resi, courier_name, customer, items, total, created_at")
    .eq("id", orderId)
    .single();
  return data;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const message = body.message || body.text || "";
    const sender = body.sender || body.from || "";
    const device = body.device || "";

    if (!message || !sender) {
      return NextResponse.json({ status: "ignored" });
    }

    if (sender === "085190311230" || sender === "6285190311230") {
      return NextResponse.json({ status: "ignored" });
    }

    // Filter keyword — Aldo hanya balas pesan yang relevan dengan Henima
    const keywords = [
      "parfum", "wangi", "harga", "beli", "order", "pesanan", "produk",
      "henima", "afternoon", "distance", "brave", "ongkir", "kirim",
      "bayar", "transfer", "cod", "resi", "tracking", "refund", "retur",
      "tanya", "info", "mau", "minta", "tolong", "halo", "hai", "hi",
      "hello", "min", "kak", "gan", "boss", "aldo", "cs", "admin"
    ];
    
    const messageLower = message.toLowerCase();
    const isRelevant = keywords.some(kw => messageLower.includes(kw));
    
    if (!isRelevant) {
      console.log("Pesan tidak relevan, skip:", message);
      return NextResponse.json({ status: "ignored - not relevant" });
    }

    // Cek apakah ada Order ID di pesan
    const orderIdMatch = message.match(/ORD-[A-Z0-9\-]+/i);
    let orderContext = "";
    
    if (orderIdMatch) {
      const orderId = orderIdMatch[0].toUpperCase();
      const order = await checkOrder(orderId);
      
      if (order) {
        const customer = typeof order.customer === "string" ? JSON.parse(order.customer) : order.customer;
        const statusLabel = STATUS_LABELS[order.status] || order.status;
        orderContext = `\n\nDATA PESANAN YANG DITEMUKAN:
- Order ID: ${order.id}
- Status: ${statusLabel}
- Kurir: ${order.courier_name || "belum ditentukan"}
- Nomor Resi: ${order.resi || "belum ada"}
- Total: Rp ${order.total?.toLocaleString("id-ID")}
- Nama: ${customer?.name || ""}
Gunakan data ini untuk menjawab customer tentang pesanannya.`;
      } else {
        orderContext = `\n\nOrder ID ${orderIdMatch[0]} tidak ditemukan di sistem. Minta customer cek kembali Order ID-nya.`;
      }
    }

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 500,
      system: SYSTEM_PROMPT + orderContext,
      messages: [{ role: "user", content: message }],
    });

    const reply = response.content[0].type === "text" 
      ? response.content[0].text 
      : "Maaf, terjadi kesalahan. Hubungi kami di 085190311230";

    await fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: {
        "Authorization": process.env.FONNTE_TOKEN || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        target: sender,
        message: reply,
        device: device,
      }),
    });

    return NextResponse.json({ status: "ok", reply });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ status: "error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: "Aldo WA webhook aktif" });
}
