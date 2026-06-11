import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  const { email, name, phone } = await request.json();
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Email tidak valid" }, { status: 400 });
  }

  const { error } = await supabase.from("subscribers").upsert(
    { email, name: name || null, phone: phone || null },
    { onConflict: "email", ignoreDuplicates: false }
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
