const BASE = "https://api.biteship.com/v1";
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
      origin_area_id: process.env.BITESHIP_ORIGIN_ID || "IDNP11IDNC402IDND4881IDZ61257",
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
