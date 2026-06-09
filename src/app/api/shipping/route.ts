import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { destination, weight } = await request.json();
  const apiKey = process.env.KOMERCE_SHIPPING_KEY || "";
  const origin = process.env.RAJAONGKIR_ORIGIN_ID || "444";

  try {
    const res = await fetch("https://rajaongkir.komerce.id/api/v1/calculate/domestic-cost", {
      method: "POST",
      headers: {
        "key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        origin: origin,
        destination: destination,
        weight: weight || 500,
        courier: "jne:jnt:sicepat:anteraja",
      }),
    });

    const data = await res.json();
    console.log("Shipping response:", JSON.stringify(data).slice(0, 300));

    const results: any[] = [];
    const rawResults = data?.data || data?.rajaongkir?.results || [];

    if (Array.isArray(rawResults)) {
      rawResults.forEach((courier: any) => {
        const costs = courier?.costs || courier?.cost || [];
        costs.forEach((cost: any) => {
          results.push({
            service: (courier.code || courier.name || "").toUpperCase() + " " + (cost.service || ""),
            description: cost.description || "",
            cost: [{ value: cost.cost?.[0]?.value || cost.value || 0, etd: cost.cost?.[0]?.etd || cost.etd || "-" }],
          });
        });
      });
    }

    return NextResponse.json({ results, raw: data });
  } catch (err: any) {
    return NextResponse.json({ results: [], error: err.message });
  }
}
