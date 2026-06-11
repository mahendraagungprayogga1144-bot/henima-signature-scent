import { NextRequest, NextResponse } from "next/server";
import { getRates } from "@/lib/biteship";

export async function POST(req: NextRequest) {
  const { destinationAreaId, weightGrams } = await req.json();
  if (!destinationAreaId || !weightGrams) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }
  const rates = await getRates(destinationAreaId, Number(weightGrams));
  return NextResponse.json(rates);
}
