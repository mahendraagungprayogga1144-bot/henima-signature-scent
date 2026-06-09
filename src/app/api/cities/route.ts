import { NextResponse } from "next/server";

// Data kota Indonesia - RajaOngkir city IDs
const CITIES = [
  {city_id:"1",city_name:"Bangkalan",type:"Kabupaten",province:"Jawa Timur",postal_code:"69101"},
  {city_id:"2",city_name:"Banyuwangi",type:"Kabupaten",province:"Jawa Timur",postal_code:"68401"},
  {city_id:"3",city_name:"Blitar",type:"Kabupaten",province:"Jawa Timur",postal_code:"66101"},
  {city_id:"4",city_name:"Blitar",type:"Kota",province:"Jawa Timur",postal_code:"66101"},
  {city_id:"5",city_name:"Bojonegoro",type:"Kabupaten",province:"Jawa Timur",postal_code:"62001"},
  {city_id:"6",city_name:"Bondowoso",type:"Kabupaten",province:"Jawa Timur",postal_code:"68201"},
  {city_id:"7",city_name:"Gresik",type:"Kabupaten",province:"Jawa Timur",postal_code:"61101"},
  {city_id:"8",city_name:"Jember",type:"Kabupaten",province:"Jawa Timur",postal_code:"68101"},
  {city_id:"9",city_name:"Jombang",type:"Kabupaten",province:"Jawa Timur",postal_code:"61401"},
  {city_id:"10",city_name:"Kediri",type:"Kabupaten",province:"Jawa Timur",postal_code:"64101"},
  {city_id:"11",city_name:"Kediri",type:"Kota",province:"Jawa Timur",postal_code:"64101"},
  {city_id:"12",city_name:"Lamongan",type:"Kabupaten",province:"Jawa Timur",postal_code:"62201"},
  {city_id:"13",city_name:"Lumajang",type:"Kabupaten",province:"Jawa Timur",postal_code:"67301"},
  {city_id:"14",city_name:"Madiun",type:"Kabupaten",province:"Jawa Timur",postal_code:"63101"},
  {city_id:"15",city_name:"Madiun",type:"Kota",province:"Jawa Timur",postal_code:"63101"},
  {city_id:"16",city_name:"Magetan",type:"Kabupaten",province:"Jawa Timur",postal_code:"63301"},
  {city_id:"17",city_name:"Malang",type:"Kabupaten",province:"Jawa Timur",postal_code:"65101"},
  {city_id:"18",city_name:"Malang",type:"Kota",province:"Jawa Timur",postal_code:"65101"},
  {city_id:"19",city_name:"Mojokerto",type:"Kabupaten",province:"Jawa Timur",postal_code:"61301"},
  {city_id:"20",city_name:"Mojokerto",type:"Kota",province:"Jawa Timur",postal_code:"61301"},
  {city_id:"21",city_name:"Nganjuk",type:"Kabupaten",province:"Jawa Timur",postal_code:"64401"},
  {city_id:"22",city_name:"Ngawi",type:"Kabupaten",province:"Jawa Timur",postal_code:"63201"},
  {city_id:"23",city_name:"Pacitan",type:"Kabupaten",province:"Jawa Timur",postal_code:"63501"},
  {city_id:"24",city_name:"Pamekasan",type:"Kabupaten",province:"Jawa Timur",postal_code:"69301"},
  {city_id:"25",city_name:"Pasuruan",type:"Kabupaten",province:"Jawa Timur",postal_code:"67101"},
  {city_id:"26",city_name:"Pasuruan",type:"Kota",province:"Jawa Timur",postal_code:"67101"},
  {city_id:"27",city_name:"Ponorogo",type:"Kabupaten",province:"Jawa Timur",postal_code:"63401"},
  {city_id:"28",city_name:"Probolinggo",type:"Kabupaten",province:"Jawa Timur",postal_code:"67201"},
  {city_id:"29",city_name:"Probolinggo",type:"Kota",province:"Jawa Timur",postal_code:"67201"},
  {city_id:"30",city_name:"Sampang",type:"Kabupaten",province:"Jawa Timur",postal_code:"69201"},
  {city_id:"31",city_name:"Sidoarjo",type:"Kabupaten",province:"Jawa Timur",postal_code:"61201"},
  {city_id:"32",city_name:"Situbondo",type:"Kabupaten",province:"Jawa Timur",postal_code:"68301"},
  {city_id:"33",city_name:"Sumenep",type:"Kabupaten",province:"Jawa Timur",postal_code:"69401"},
  {city_id:"34",city_name:"Surabaya",type:"Kota",province:"Jawa Timur",postal_code:"60101"},
  {city_id:"35",city_name:"Trenggalek",type:"Kabupaten",province:"Jawa Timur",postal_code:"66301"},
  {city_id:"36",city_name:"Tuban",type:"Kabupaten",province:"Jawa Timur",postal_code:"62301"},
  {city_id:"37",city_name:"Tulungagung",type:"Kabupaten",province:"Jawa Timur",postal_code:"66201"},
  {city_id:"38",city_name:"Batu",type:"Kota",province:"Jawa Timur",postal_code:"65301"},
  {city_id:"39",city_name:"Jakarta Barat",type:"Kota",province:"DKI Jakarta",postal_code:"11001"},
  {city_id:"40",city_name:"Jakarta Pusat",type:"Kota",province:"DKI Jakarta",postal_code:"10001"},
  {city_id:"41",city_name:"Jakarta Selatan",type:"Kota",province:"DKI Jakarta",postal_code:"12001"},
  {city_id:"42",city_name:"Jakarta Timur",type:"Kota",province:"DKI Jakarta",postal_code:"13001"},
  {city_id:"43",city_name:"Jakarta Utara",type:"Kota",province:"DKI Jakarta",postal_code:"14001"},
  {city_id:"44",city_name:"Kepulauan Seribu",type:"Kabupaten",province:"DKI Jakarta",postal_code:"14001"},
  {city_id:"45",city_name:"Bandung",type:"Kota",province:"Jawa Barat",postal_code:"40111"},
  {city_id:"46",city_name:"Bandung",type:"Kabupaten",province:"Jawa Barat",postal_code:"40311"},
  {city_id:"47",city_name:"Bekasi",type:"Kota",province:"Jawa Barat",postal_code:"17121"},
  {city_id:"48",city_name:"Bekasi",type:"Kabupaten",province:"Jawa Barat",postal_code:"17510"},
  {city_id:"49",city_name:"Bogor",type:"Kota",province:"Jawa Barat",postal_code:"16111"},
  {city_id:"50",city_name:"Bogor",type:"Kabupaten",province:"Jawa Barat",postal_code:"16911"},
  {city_id:"51",city_name:"Cimahi",type:"Kota",province:"Jawa Barat",postal_code:"40511"},
  {city_id:"52",city_name:"Cirebon",type:"Kota",province:"Jawa Barat",postal_code:"45111"},
  {city_id:"53",city_name:"Cirebon",type:"Kabupaten",province:"Jawa Barat",postal_code:"45611"},
  {city_id:"54",city_name:"Depok",type:"Kota",province:"Jawa Barat",postal_code:"16411"},
  {city_id:"55",city_name:"Garut",type:"Kabupaten",province:"Jawa Barat",postal_code:"44111"},
  {city_id:"56",city_name:"Indramayu",type:"Kabupaten",province:"Jawa Barat",postal_code:"45211"},
  {city_id:"57",city_name:"Karawang",type:"Kabupaten",province:"Jawa Barat",postal_code:"41311"},
  {city_id:"58",city_name:"Kuningan",type:"Kabupaten",province:"Jawa Barat",postal_code:"45511"},
  {city_id:"59",city_name:"Majalengka",type:"Kabupaten",province:"Jawa Barat",postal_code:"45411"},
  {city_id:"60",city_name:"Purwakarta",type:"Kabupaten",province:"Jawa Barat",postal_code:"41111"},
  {city_id:"61",city_name:"Subang",type:"Kabupaten",province:"Jawa Barat",postal_code:"41211"},
  {city_id:"62",city_name:"Sukabumi",type:"Kota",province:"Jawa Barat",postal_code:"43111"},
  {city_id:"63",city_name:"Sukabumi",type:"Kabupaten",province:"Jawa Barat",postal_code:"43311"},
  {city_id:"64",city_name:"Sumedang",type:"Kabupaten",province:"Jawa Barat",postal_code:"45311"},
  {city_id:"65",city_name:"Tasikmalaya",type:"Kota",province:"Jawa Barat",postal_code:"46111"},
  {city_id:"66",city_name:"Tasikmalaya",type:"Kabupaten",province:"Jawa Barat",postal_code:"46411"},
  {city_id:"67",city_name:"Tangerang",type:"Kota",province:"Banten",postal_code:"15111"},
  {city_id:"68",city_name:"Tangerang",type:"Kabupaten",province:"Banten",postal_code:"15110"},
  {city_id:"69",city_name:"Tangerang Selatan",type:"Kota",province:"Banten",postal_code:"15310"},
  {city_id:"70",city_name:"Serang",type:"Kota",province:"Banten",postal_code:"42111"},
  {city_id:"71",city_name:"Serang",type:"Kabupaten",province:"Banten",postal_code:"42151"},
  {city_id:"72",city_name:"Cilegon",type:"Kota",province:"Banten",postal_code:"42411"},
  {city_id:"73",city_name:"Semarang",type:"Kota",province:"Jawa Tengah",postal_code:"50111"},
  {city_id:"74",city_name:"Semarang",type:"Kabupaten",province:"Jawa Tengah",postal_code:"50511"},
  {city_id:"75",city_name:"Solo",type:"Kota",province:"Jawa Tengah",postal_code:"57111"},
  {city_id:"76",city_name:"Yogyakarta",type:"Kota",province:"DI Yogyakarta",postal_code:"55111"},
  {city_id:"77",city_name:"Sleman",type:"Kabupaten",province:"DI Yogyakarta",postal_code:"55511"},
  {city_id:"78",city_name:"Bantul",type:"Kabupaten",province:"DI Yogyakarta",postal_code:"55701"},
  {city_id:"79",city_name:"Medan",type:"Kota",province:"Sumatera Utara",postal_code:"20111"},
  {city_id:"80",city_name:"Deli Serdang",type:"Kabupaten",province:"Sumatera Utara",postal_code:"20511"},
  {city_id:"81",city_name:"Makassar",type:"Kota",province:"Sulawesi Selatan",postal_code:"90111"},
  {city_id:"82",city_name:"Denpasar",type:"Kota",province:"Bali",postal_code:"80111"},
  {city_id:"83",city_name:"Badung",type:"Kabupaten",province:"Bali",postal_code:"80351"},
  {city_id:"84",city_name:"Palembang",type:"Kota",province:"Sumatera Selatan",postal_code:"30111"},
  {city_id:"85",city_name:"Pekanbaru",type:"Kota",province:"Riau",postal_code:"28111"},
  {city_id:"86",city_name:"Banjarmasin",type:"Kota",province:"Kalimantan Selatan",postal_code:"70111"},
  {city_id:"87",city_name:"Samarinda",type:"Kota",province:"Kalimantan Timur",postal_code:"75111"},
  {city_id:"88",city_name:"Balikpapan",type:"Kota",province:"Kalimantan Timur",postal_code:"76111"},
  {city_id:"89",city_name:"Pontianak",type:"Kota",province:"Kalimantan Barat",postal_code:"78111"},
  {city_id:"90",city_name:"Manado",type:"Kota",province:"Sulawesi Utara",postal_code:"95111"},
  {city_id:"91",city_name:"Padang",type:"Kota",province:"Sumatera Barat",postal_code:"25111"},
  {city_id:"92",city_name:"Aceh Besar",type:"Kabupaten",province:"Aceh",postal_code:"23951"},
  {city_id:"93",city_name:"Banda Aceh",type:"Kota",province:"Aceh",postal_code:"23111"},
  {city_id:"94",city_name:"Kupang",type:"Kota",province:"Nusa Tenggara Timur",postal_code:"85111"},
  {city_id:"95",city_name:"Mataram",type:"Kota",province:"Nusa Tenggara Barat",postal_code:"83111"},
  {city_id:"96",city_name:"Jayapura",type:"Kota",province:"Papua",postal_code:"99111"},
  {city_id:"97",city_name:"Ambon",type:"Kota",province:"Maluku",postal_code:"97111"},
  {city_id:"98",city_name:"Kendari",type:"Kota",province:"Sulawesi Tenggara",postal_code:"93111"},
  {city_id:"99",city_name:"Palu",type:"Kota",province:"Sulawesi Tengah",postal_code:"94111"},
  {city_id:"100",city_name:"Batam",type:"Kota",province:"Kepulauan Riau",postal_code:"29411"},
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.toLowerCase() || "";
  
  // Try RajaOngkir API first
  const apiKey = process.env.RAJAONGKIR_API_KEY || "";
  try {
    const res = await fetch("https://api.rajaongkir.com/starter/city", {
      headers: { "key": apiKey },
      next: { revalidate: 86400 },
    });
    const data = await res.json();
    const cities = data?.rajaongkir?.results || [];
    if (cities.length > 0) {
      const filtered = q ? cities.filter((c: any) => 
        c.city_name.toLowerCase().includes(q) || c.province.toLowerCase().includes(q)
      ) : cities;
      return NextResponse.json({ cities: filtered.slice(0, 100) });
    }
  } catch {}
  
  // Fallback to local data
  const filtered = q ? CITIES.filter(c => 
    c.city_name.toLowerCase().includes(q) || c.province.toLowerCase().includes(q)
  ) : CITIES;
  return NextResponse.json({ cities: filtered });
}
