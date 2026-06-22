import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { order_id, customer_name, customer_email, rating, review, product_id, product_name } = body;

    if (!rating || !review?.trim()) {
      return NextResponse.json({ error: "Rating dan ulasan wajib diisi" }, { status: 400 });
    }

    const { error } = await supabase.from("product_reviews").insert({
      order_id,
      customer_name,
      customer_email,
      rating,
      review,
      product_id,
      product_name,
      approved: false,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
