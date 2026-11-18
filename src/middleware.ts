import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { parseSessionToken } from "@/lib/auth";

export const runtime = "nodejs";

const RESELLER_PREFIXES = ["/katalog", "/pesan", "/pembayaran", "/pesanan"];
const ADMIN_PREFIXES = ["/admin"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /* Chrome sometimes reloads with POST → static pages return 405 Method Not Allowed */
  if (request.method === "POST" && !pathname.startsWith("/api")) {
    const url = request.nextUrl.clone();
    return NextResponse.redirect(url, 303);
  }

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
    "/",
    "/shop/:path*",
    "/our-story",
    "/blog/:path*",
    "/faq",
    "/quiz",
    "/galeri",
    "/love-letters",
    "/katalog/:path*",
    "/pesan/:path*",
    "/pembayaran/:path*",
    "/pesanan/:path*",
    "/admin/:path*",
  ],
};
