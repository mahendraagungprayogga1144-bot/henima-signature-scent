import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.RAJAONGKIR_API_KEY || "";
  try {
    const res = await fetch("https://api.rajaongkir.com/starter/city", {
      headers: { "key": apiKey },
      cache: "force-cache",
    });
    const data = await res.json();
    const cities = data?.rajaongkir?.results || [];
    return NextResponse.json({ cities });
  } catch {
    return NextResponse.json({ cities: [] });
  }
}
