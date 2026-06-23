import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { supabase } from "@/lib/supabase";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `Kamu adalah Aldo, asisten customer service untuk Henima Signature Scent (henimaofficial.com). Brand parfum lokal premium Indonesia yang lahir dari kisah cinta jarak jauh Jakarta-Surabaya.

PRODUK:
1. AFTERNOON (Best Seller)
   - Extrait de Parfum | Floral Woody | Maskulin & elegan
   - Top: Apple, Bergamot | Middle: Violet, Cardamom | Base: Sandalwood, Musk, Vanilla
   - Sillage: Medium-strong | Projection: ±2m | Longevity: 24 jam
   - Harga: 50ml = Rp 185.000
   - Cocok: kantor, formal, nongkrong | Rating: 5.0/5.0 (13 ulasan)

2. THE DISTANCE
   - Extrait de Parfum | Sweet Warm Oriental | Unisex
   - Longevity: 24 jam | Cocok: malam hari, acara spesial
   - Harga: 50ml = Rp 185.000 | Rating: 5.0/5.0 (25 ulasan)

3. BRAVE MAN INTENSE
   - Extrait de Parfum | Maskulin kuat dan intens
   - Cocok: pria berkarakter kuat dan percaya diri

PEMESANAN & PEMBAYARAN:
- Order di henimaofficial.com/shop
- Pembayaran: transfer bank (BCA, Mandiri, BRI) dan QRIS
- Proses: 1-2 hari kerja setelah pembayaran dikonfirmasi
- Gratis ongkir untuk order di atas Rp 150.000

PENGIRIMAN:
- Ke seluruh Indonesia: JNE, J&T, SiCepat
- Estimasi: 2-5 hari kerja (daerah terpencil lebih lama)
- Berat per botol: 380gr
- Tracking di henimaofficial.com/tracking dengan Order ID

PRODUK:
- Extrait de Parfum = konsentrasi tertinggi (20-40% perfume oil)
- Tahan 8-12 jam di kulit, lebih lama di kain
- Untuk kulit sensitif: patch test di pergelangan tangan dulu

RETUR & REFUND:
- Retur dalam 3 hari setelah diterima
- Hanya untuk produk rusak/cacat produksi
- Produk sudah dibuka segel: tidak bisa retur kecuali cacat
- Jika paket rusak: dokumentasi dan hubungi dalam 24 jam
- Proses via WhatsApp 085190311230 dengan foto bukti

THE INTIMATE — MEMBERSHIP:
- Program membership eksklusif Henima
- Tier otomatis naik berdasarkan total pembelian
- Tidak perlu registrasi, otomatis dari riwayat belanja
- Claim benefit via WhatsApp setelah naik tier
- Tim proses dalam 1x24 jam

KONTAK:
- WhatsApp: 085190311230
- Website: henimaofficial.com
- FAQ lengkap: henimaofficial.com/faq

ATURAN ALDO:
1. Jawab HANYA seputar Henima — produk, pesanan, pengiriman, pembayaran, kebijakan, membership
2. Jika di luar topik, tolak sopan dan arahkan ke topik Henima
3. Jika customer kasih Order ID (format ORD-xxx), gunakan tool cek_status_pesanan
4. Bahasa Indonesia yang ramah, hangat, personal — sesuai nuansa brand premium
5. Jika tidak yakin, arahkan ke WhatsApp 085190311230
6. Jangan mengarang nomor resi, harga pasti, atau stok
7. Selalu sebut produk dengan huruf kapital: AFTERNOON, THE DISTANCE, BRAVE MAN INTENSE
8. Jika tanya rekomendasi: tanya dulu untuk acara apa, siang/malam, suka wangi seperti apa
9. Perkenalkan diri sebagai Aldo jika ditanya siapa kamu`;

const tools: Anthropic.Tool[] = [
  {
    name: "cek_status_pesanan",
    description: "Mengecek status pesanan customer berdasarkan ID order (format ORD-xxx)",
    input_schema: {
      type: "object",
      properties: {
        order_id: { type: "string", description: "ID pesanan, contoh: ORD-1781922238828-REJ5" },
      },
      required: ["order_id"],
    },
  },
];

async function cekStatusPesanan(orderId: string) {
  const { data, error } = await supabase
    .from("retail_orders")
    .select("id, status, resi, courier_name, total, created_at")
    .eq("id", orderId.trim())
    .single();

  if (error || !data) {
    return { found: false, message: "Pesanan tidak ditemukan. Pastikan ID pesanan benar." };
  }

  const statusLabels: Record<string, string> = {
    pending_payment: "Menunggu Pembayaran",
    paid: "Sudah Bayar",
    processing: "Sedang Diproses",
    shipped: "Sedang Dikirim",
    delivered: "Sudah Diterima",
    cancelled: "Dibatalkan",
  };

  return {
    found: true,
    order_id: data.id,
    status: statusLabels[data.status] || data.status,
    resi: data.resi || "Belum ada resi",
    courier: data.courier_name || "-",
    total: `Rp ${(data.total || 0).toLocaleString("id-ID")}`,
  };
}

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
    }

    let conversationMessages = messages;
    let finalResponse = "";

    // Loop untuk handle tool use
    for (let i = 0; i < 3; i++) {
      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-5",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        tools: tools,
        messages: conversationMessages,
      });

      const toolUseBlock = response.content.find((b) => b.type === "tool_use");

      if (toolUseBlock && toolUseBlock.type === "tool_use") {
        const toolResult = await cekStatusPesanan((toolUseBlock.input as any).order_id);

        conversationMessages = [
          ...conversationMessages,
          { role: "assistant", content: response.content },
          {
            role: "user",
            content: [
              {
                type: "tool_result",
                tool_use_id: toolUseBlock.id,
                content: JSON.stringify(toolResult),
              },
            ],
          },
        ];
        continue;
      }

      const textBlock = response.content.find((b) => b.type === "text");
      finalResponse = textBlock && textBlock.type === "text" ? textBlock.text : "Maaf, terjadi kesalahan. Silakan hubungi WhatsApp 085190311230.";
      break;
    }

    return NextResponse.json({ reply: finalResponse });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { reply: "Maaf, terjadi kesalahan. Silakan hubungi kami via WhatsApp di 085190311230." },
      { status: 200 }
    );
  }
}
