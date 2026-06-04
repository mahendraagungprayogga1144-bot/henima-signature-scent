const BASE = 'https://rajaongkir.komerce.id/api/v1';
const KEY = process.env.RAJAONGKIR_API_KEY ?? '';
export const ORIGIN_ID = Number(process.env.RAJAONGKIR_ORIGIN_ID ?? '71128');

export interface RJDestination {
  id: number;
  label: string;
  province_name: string;
  city_name: string;
  district_name: string;
  subdistrict_name: string;
  zip_code: string;
}

export interface RJCourierOption {
  courier_code: string;
  courier_name: string;
  service: string;
  description: string;
  cost: number;
  etd: string;
}

export async function searchDestination(q: string, limit = 10): Promise<RJDestination[]> {
  const url = `${BASE}/destination/domestic-destination?search=${encodeURIComponent(q)}&limit=${limit}&offset=0`;
  const res = await fetch(url, { headers: { key: KEY }, cache: 'no-store' });
  if (!res.ok) return [];
  const json = await res.json();
  return json.data ?? [];
}

export async function getCourierCosts(
  destinationId: number,
  weightGrams: number
): Promise<RJCourierOption[]> {
  const body = new URLSearchParams({
    origin: String(ORIGIN_ID),
    destination: String(destinationId),
    weight: String(weightGrams),
    courier: 'jne:sicepat:jnt:anteraja:pos:wahana',
    price: 'lowest',
  });

  const res = await fetch(`${BASE}/calculate/district/domestic-cost`, {
    method: 'POST',
    headers: { key: KEY, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
    cache: 'no-store',
  });

  if (!res.ok) return [];
  const json = await res.json();
  if (!json.data) return [];

  const options: RJCourierOption[] = [];
  for (const courier of json.data) {
    for (const svc of courier.costs ?? []) {
      for (const c of svc.cost ?? []) {
        options.push({
          courier_code: courier.code,
          courier_name: courier.name,
          service: svc.service,
          description: svc.description,
          cost: c.value,
          etd: c.etd ?? '',
        });
      }
    }
  }
  return options;
}
