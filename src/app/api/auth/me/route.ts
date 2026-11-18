import { NextResponse } from "next/server";
import { getCurrentUserSafe } from "@/lib/session";

export const dynamic = "force-dynamic";

/** Client navbar/session probe — keeps marketing HTML cacheable for Googlebot. */
export async function GET() {
  try {
    const user = await getCurrentUserSafe();
    return NextResponse.json({ user }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("[api/auth/me]", err);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
