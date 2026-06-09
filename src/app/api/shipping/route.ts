import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { destination, weight } = await request.json();
  
  const apiKey = process.env.KOMERCE_SHIPPING_KEY || process.env.RAJAONGKIR_API_KEY || "";
  const origin = process.env.RAJAONGKIR_ORIGIN_ID || "444";

  try {
    const res = await fetch("https://api.rajaongkir.com/starter/cost", {
      method: "POST",
      headers: {
        "key": apiKey,
        "content-type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        origin: origin,
        destination: destination,
        weight: String(weight || 500),
        courier: "jne",
      }).toString(),
    });

    const data = await res.json();
    const results = data?.rajaongkir?.results || [];
    
    const options: any[] = [];
    results.forEach((courier: any) => {
      courier.costs.forEach((cost: any) => {
        options.push({
          courier: courier.code,
          service: courier.code.toUpperCase() + " " + cost.service,
          description: cost.description,
          cost: cost.cost,
        });
      });
    });

    return NextResponse.json({ results: options });
  } catch (err) {
    return NextResponse.json({ results: [], error: "Gagal mengambil data ongkir" });
  }
}
