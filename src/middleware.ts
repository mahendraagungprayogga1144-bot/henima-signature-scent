import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { parseSessionToken } from "@/lib/auth";

export const runtime = "nodejs";

const RESELLER_PREFIXES = ["/katalog", "/pesan", "/pembayaran", "/pesanan"];
const ADMIN_PREFIXES = ["/admin"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("toko_session")?.value;
  const session = parseSessionToken(token);

  const needsAuth =
    RESELLER_PREFIXES.some((p) => pathname.startsWith(p)) ||
    ADMIN_PREFIXES.some((p) => pathname.startsWith(p));

  if (!needsAuth) return NextResponse.next();

  if (!session) {
    return NextResponse.redirect(new URL("/masuk", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/katalog/:path*",
    "/pesan/:path*",
    "/pembayaran/:path*",
    "/pesanan/:path*",
    "/admin/:path*",
  ],
};
