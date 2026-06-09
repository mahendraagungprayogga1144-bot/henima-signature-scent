import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { destination, weight, originId } = await request.json();
  
  const apiKey = process.env.KOMERCE_SHIPPING_KEY || "";

  try {
    const res = await fetch("https://api.komerce.id/api/v1/calculate-cost", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        origin_id: process.env.RAJAONGKIR_ORIGIN_ID || "444",
        destination_id: destination,
        weight: weight || 500,
        courier: "jne,j&t,sicepat",
      }),
    });

    const data = await res.json();
    console.log("Komerce response:", JSON.stringify(data).slice(0, 200));
    
    const results: any[] = [];
    
    if (data?.data) {
      Object.values(data.data).forEach((courier: any) => {
        if (courier?.costs) {
          courier.costs.forEach((cost: any) => {
            results.push({
              courier: courier.code,
              service: (courier.code || "").toUpperCase() + " " + cost.service,
              description: cost.description,
              cost: [{ value: cost.cost?.[0]?.value || 0, etd: cost.cost?.[0]?.etd || "-" }],
            });
          });
        }
      });
    }

    return NextResponse.json({ results });
  } catch (err: any) {
    console.error("Shipping error:", err.message);
    return NextResponse.json({ results: [], error: err.message });
  }
}
