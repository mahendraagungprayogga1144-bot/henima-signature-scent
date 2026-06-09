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
    courier: "jne:jnt:sicepat:anteraja:ninja",
  };

  console.log("Payload:", JSON.stringify(payload));
  console.log("API Key exists:", apiKey.length > 0);

  try {
    const formData = new URLSearchParams();
    formData.append("origin", payload.origin);
    formData.append("destination", payload.destination);
    formData.append("weight", String(payload.weight));
    formData.append("courier", "jne:jnt:sicepat:anteraja:ninja");

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
      rawResults.forEach((item: any) => {
        // Filter hanya layanan reguler yang relevan
        const regularServices = ["REG", "YES", "CTC", "CTCYES", "REGULAR", "ECO", "OKE", "BEST", "SIUNT", "GOKIL"];
        const service = item.service || "";
        const isRegular = regularServices.some(s => service.toUpperCase().includes(s)) || 
                         (!service.includes("JTR") && !service.includes(">") && !service.includes("<"));
        
        if (isRegular && item.cost <= 100000) {
          results.push({
            service: (item.code || "").toUpperCase() + " " + service,
            description: item.description || "",
            cost: [{ value: item.cost || 0, etd: item.etd || "-" }],
          });
        }
      });
    }

    if (results.length === 0) {
      // Fallback flat rate
      return NextResponse.json({ results: [
        { service: "JNE REG", description: "Reguler (2-3 hari)", cost: [{ value: 15000, etd: "2-3" }] },
        { service: "JNE YES", description: "Yakin Esok Sampai", cost: [{ value: 25000, etd: "1" }] },
        { service: "J&T REG", description: "Reguler (2-3 hari)", cost: [{ value: 14000, etd: "2-3" }] },
        { service: "SICEPAT REG", description: "Reguler (2-3 hari)", cost: [{ value: 13000, etd: "2-3" }] },
      ], raw: data, payload });
    }
    return NextResponse.json({ results, raw: data, payload });
  } catch (err: any) {
    return NextResponse.json({ results: [], error: err.message, payload });
  }
}
