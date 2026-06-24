import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { code, subtotal } = await request.json();

    if (!code) return NextResponse.json({ error: "Kode voucher wajib diisi" }, { status: 400 });

    const { data: voucher } = await supabase
      .from("vouchers")
      .select("*")
      .eq("code", code.toUpperCase())
      .eq("active", true)
      .single();

    if (!voucher) return NextResponse.json({ error: "Voucher tidak ditemukan" }, { status: 404 });

    // Cek expired
    if (voucher.expires_at && new Date(voucher.expires_at) < new Date()) {
      return NextResponse.json({ error: "Voucher sudah kadaluarsa" }, { status: 400 });
    }

    // Cek max uses
    if (voucher.used_count >= voucher.max_uses) {
      return NextResponse.json({ error: "Voucher sudah habis digunakan" }, { status: 400 });
    }

    // Cek min order
    if (subtotal < voucher.min_order) {
      return NextResponse.json({ 
        error: `Minimum order Rp ${voucher.min_order.toLocaleString("id-ID")} untuk voucher ini` 
      }, { status: 400 });
    }

    return NextResponse.json({ ok: true, voucher });
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
