import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.toLowerCase() || "";
  
  if (q.length < 2) return NextResponse.json({ cities: [] });

  const apiKey = process.env.KOMERCE_SHIPPING_KEY || "";

  try {
    const res = await fetch(
      "https://rajaongkir.komerce.id/api/v1/destination/domestic-destination?search=" + encodeURIComponent(q),
      {
        headers: { "key": apiKey },
        cache: "no-store",
      }
    );
    const data = await res.json();
    const raw = data?.data || [];
    
    if (raw.length > 0) {
      const cities = raw.slice(0, 30).map((c: any) => ({
        city_id: String(c.id || c.city_id || ""),
        city_name: c.label || c.city_name || c.name || "",
        type: c.type || "",
        province: c.province || c.province_name || "",
        postal_code: c.postal_code || c.zip_code || "",
      }));
      return NextResponse.json({ cities });
    }
  } catch (err) {
    console.error("Cities API error:", err);
  }

  // Fallback - local data filter
  const LOCAL = [
    {city_id:"21",city_name:"Nganjuk",type:"Kabupaten",province:"Jawa Timur",postal_code:"64401"},
    {city_id:"31",city_name:"Sidoarjo",type:"Kabupaten",province:"Jawa Timur",postal_code:"61201"},
    {city_id:"34",city_name:"Surabaya",type:"Kota",province:"Jawa Timur",postal_code:"60101"},
    {city_id:"17",city_name:"Malang",type:"Kabupaten",province:"Jawa Timur",postal_code:"65101"},
    {city_id:"18",city_name:"Malang",type:"Kota",province:"Jawa Timur",postal_code:"65101"},
    {city_id:"45",city_name:"Bandung",type:"Kota",province:"Jawa Barat",postal_code:"40111"},
    {city_id:"39",city_name:"Jakarta Barat",type:"Kota",province:"DKI Jakarta",postal_code:"11001"},
    {city_id:"40",city_name:"Jakarta Pusat",type:"Kota",province:"DKI Jakarta",postal_code:"10001"},
    {city_id:"41",city_name:"Jakarta Selatan",type:"Kota",province:"DKI Jakarta",postal_code:"12001"},
    {city_id:"42",city_name:"Jakarta Timur",type:"Kota",province:"DKI Jakarta",postal_code:"13001"},
    {city_id:"43",city_name:"Jakarta Utara",type:"Kota",province:"DKI Jakarta",postal_code:"14001"},
    {city_id:"47",city_name:"Bekasi",type:"Kota",province:"Jawa Barat",postal_code:"17121"},
    {city_id:"49",city_name:"Bogor",type:"Kota",province:"Jawa Barat",postal_code:"16111"},
    {city_id:"54",city_name:"Depok",type:"Kota",province:"Jawa Barat",postal_code:"16411"},
    {city_id:"67",city_name:"Tangerang",type:"Kota",province:"Banten",postal_code:"15111"},
    {city_id:"69",city_name:"Tangerang Selatan",type:"Kota",province:"Banten",postal_code:"15310"},
    {city_id:"73",city_name:"Semarang",type:"Kota",province:"Jawa Tengah",postal_code:"50111"},
    {city_id:"75",city_name:"Solo",type:"Kota",province:"Jawa Tengah",postal_code:"57111"},
    {city_id:"76",city_name:"Yogyakarta",type:"Kota",province:"DI Yogyakarta",postal_code:"55111"},
    {city_id:"79",city_name:"Medan",type:"Kota",province:"Sumatera Utara",postal_code:"20111"},
    {city_id:"81",city_name:"Makassar",type:"Kota",province:"Sulawesi Selatan",postal_code:"90111"},
    {city_id:"82",city_name:"Denpasar",type:"Kota",province:"Bali",postal_code:"80111"},
  ];

  const filtered = LOCAL.filter(c => 
    c.city_name.toLowerCase().includes(q) || c.province.toLowerCase().includes(q)
  );
  return NextResponse.json({ cities: filtered });
}
