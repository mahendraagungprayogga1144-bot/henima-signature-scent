import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { supabase } from "@/lib/supabase";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `Kamu adalah asisten customer service untuk Henima Signature Scent, brand parfum lokal premium asal Indonesia (henimaofficial.com).

INFORMASI BISNIS:
- Henima menjual parfum Extrait de Parfum berkualitas tinggi
- Produk: Afternoon, The Distance, Discovery Set, dan varian lainnya (cek halaman /shop untuk daftar lengkap dan harga terkini)
- Pengiriman: ke seluruh Indonesia menggunakan kurir (JNE, J&T, SiCepat, dll), ongkir dihitung otomatis berdasarkan lokasi saat checkout
- Pembayaran: transfer bank dan metode lain yang tersedia di halaman checkout
- Kebijakan retur/refund: ada di halaman /kebijakan-pengembalian, intinya bisa retur jika produk rusak/cacat dalam 3 hari kalender sejak diterima, produk yang sudah dibuka segelnya tidak bisa diretur kecuali cacat produksi
- Kontak manusia: WhatsApp 085190311230 untuk hal yang tidak bisa kamu bantu

ATURAN PENTING:
1. Jawab HANYA seputar produk Henima, pemesanan, pengiriman, pembayaran, dan kebijakan toko
2. Jika ditanya di luar topik itu (politik, hal pribadi, topik umum lain), tolak dengan sopan dan arahkan kembali ke topik Henima
3. Jika customer kasih nomor pesanan (format ORD-xxx), gunakan tool cek_status_pesanan untuk melihat statusnya
4. Gunakan bahasa Indonesia yang ramah, hangat, dan sopan, sesuai nuansa brand premium tapi tetap personal
5. Jika tidak yakin jawabannya, arahkan ke WhatsApp 085190311230 daripada menjawab asal
6. Jangan pernah mengarang nomor resi, harga pasti, atau stok — jika tidak tahu, bilang akan dicek lebih lanjut oleh tim`;

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
