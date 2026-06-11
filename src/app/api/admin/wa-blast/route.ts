import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/session";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { body } = await request.json();
  if (!body) return NextResponse.json({ error: "Missing message" }, { status: 400 });

  const { data: subscribers } = await supabase
    .from("subscribers")
    .select("phone, name")
    .not("phone", "is", null);

  if (!subscribers || subscribers.length === 0) return NextResponse.json({ error: "No WA subscribers" }, { status: 400 });

  let sent = 0;
  for (const sub of subscribers) {
    try {
      const phone = sub.phone.replace(/\D/g, "").replace(/^0/, "62");
      const res = await fetch("https://api.fonnte.com/send", {
        method: "POST",
        headers: {
          "Authorization": process.env.FONNTE_TOKEN || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          target: phone,
          message: body,
        }),
      });
      if (res.ok) sent++;
    } catch (e) {
      console.error("WA blast error:", sub.phone, e);
    }
  }

  return NextResponse.json({ ok: true, sent });
}
