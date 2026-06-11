import { NextRequest, NextResponse } from "next/server";
import { searchLocation } from "@/lib/biteship";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") || "";
  if (q.length < 3) return NextResponse.json([]);
  const areas = await searchLocation(q);
  return NextResponse.json(areas);
}
