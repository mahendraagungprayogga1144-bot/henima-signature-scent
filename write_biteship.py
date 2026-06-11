# Buat lib/biteship.ts
with open("src/lib/biteship.ts", "w") as f:
    f.write('''const BASE = "https://api.biteship.com/v1";
const KEY = process.env.BITESHIP_API_KEY ?? "";

export interface BiteshipRate {
  courier_code: string;
  courier_name: string;
  courier_service_code: string;
  courier_service_name: string;
  type: string;
  price: number;
  min_day: number;
  max_day: number;
}

export async function searchLocation(query: string) {
  const res = await fetch(
    `${BASE}/maps/areas?countries=ID&input=${encodeURIComponent(query)}&type=single`,
    { headers: { Authorization: KEY }, cache: "no-store" }
  );
  if (!res.ok) return [];
  const json = await res.json();
  return json.areas ?? [];
}

export async function getRates(
  destinationAreaId: string,
  weightGrams: number
): Promise<BiteshipRate[]> {
  const res = await fetch(`${BASE}/rates/couriers`, {
    method: "POST",
    headers: { Authorization: KEY, "Content-Type": "application/json" },
    body: JSON.stringify({
      origin_area_id: process.env.BITESHIP_ORIGIN_ID || "IDNP11IDNC159IDND1463IDNS1463001",
      destination_area_id: destinationAreaId,
      couriers: "jne,jnt,sicepat,anteraja,ide,tiki",
      items: [{ name: "Parfum", value: 185000, weight: weightGrams, quantity: 1 }],
    }),
    cache: "no-store",
  });
  if (!res.ok) return [];
  const json = await res.json();
  return json.pricing ?? [];
}
''')
print("biteship.ts Done!")

# Buat API route search location
import os
os.makedirs("src/app/api/biteship/locations", exist_ok=True)
with open("src/app/api/biteship/locations/route.ts", "w") as f:
    f.write('''import { NextRequest, NextResponse } from "next/server";
import { searchLocation } from "@/lib/biteship";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") || "";
  if (q.length < 3) return NextResponse.json([]);
  const areas = await searchLocation(q);
  return NextResponse.json(areas);
}
''')
print("locations route Done!")

# Buat API route rates
os.makedirs("src/app/api/biteship/rates", exist_ok=True)
with open("src/app/api/biteship/rates/route.ts", "w") as f:
    f.write('''import { NextRequest, NextResponse } from "next/server";
import { getRates } from "@/lib/biteship";

export async function POST(req: NextRequest) {
  const { destinationAreaId, weightGrams } = await req.json();
  if (!destinationAreaId || !weightGrams) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }
  const rates = await getRates(destinationAreaId, Number(weightGrams));
  return NextResponse.json(rates);
}
''')
print("rates route Done!")
print("All Done!")
