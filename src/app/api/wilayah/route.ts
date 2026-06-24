import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

const BASE = "https://emsifa.github.io/api-wilayah-indonesia/api";

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get("type");
  const id = req.nextUrl.searchParams.get("id");

  try {
    let url = "";
    if (type === "provinces") url = `${BASE}/provinces.json`;
    else if (type === "regencies" && id) url = `${BASE}/regencies/${id}.json`;
    else if (type === "districts" && id) url = `${BASE}/districts/${id}.json`;
    else if (type === "villages" && id) url = `${BASE}/villages/${id}.json`;
    else return NextResponse.json([], { status: 400 });

    const res = await fetch(url, { next: { revalidate: 86400 } });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json([]);
  }
}
