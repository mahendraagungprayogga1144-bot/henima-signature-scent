import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { destination, weight } = body;
  const apiKey = process.env.KOMERCE_SHIPPING_KEY || "";
  const origin = "31";

  const payload = {
    origin: origin,
    destination: String(destination),
    weight: Number(weight) || 500,
    courier: "jne",
  };

  console.log("Payload:", JSON.stringify(payload));
  console.log("API Key exists:", apiKey.length > 0);

  try {
    const formData = new URLSearchParams();
    formData.append("origin", payload.origin);
    formData.append("destination", payload.destination);
    formData.append("weight", String(payload.weight));
    formData.append("courier", payload.courier);

    const res = await fetch("https://rajaongkir.komerce.id/api/v1/calculate/domestic-cost", {
      method: "POST",
      headers: {
        "key": apiKey,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    const text = await res.text();
    console.log("Raw response:", text.slice(0, 300));
    
    let data;
    try { data = JSON.parse(text); } catch { data = { error: text }; }

    const results: any[] = [];
    const rawResults = data?.data || [];

    if (Array.isArray(rawResults)) {
      rawResults.forEach((courier: any) => {
        (courier?.costs || []).forEach((cost: any) => {
          results.push({
            service: (courier.courier_code || "").toUpperCase() + " " + (cost.service || ""),
            description: cost.description || "",
            cost: [{ value: cost.cost?.[0]?.value || 0, etd: cost.cost?.[0]?.etd || "-" }],
          });
        });
      });
    }

    return NextResponse.json({ results, raw: data, payload });
  } catch (err: any) {
    return NextResponse.json({ results: [], error: err.message, payload });
  }
}
