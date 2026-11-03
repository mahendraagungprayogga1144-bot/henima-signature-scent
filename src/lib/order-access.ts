import { createHmac, timingSafeEqual } from "crypto";

function secret(): string {
  return process.env.SESSION_SECRET || process.env.ORDER_ACCESS_SECRET || "toko-dev-secret";
}

/** Signed opaque access token for a retail order (HMAC). */
export function createOrderAccessToken(orderId: string, phone: string): string {
  const phoneNorm = normalizePhone(phone);
  const payload = Buffer.from(
    JSON.stringify({ orderId, phone: phoneNorm, exp: Date.now() + 1000 * 60 * 60 * 24 * 90 })
  ).toString("base64url");
  const sig = createHmac("sha256", secret()).update(payload).digest("base64url").slice(0, 32);
  return `${payload}.${sig}`;
}

export function verifyOrderAccessToken(
  token: string | null | undefined,
  orderId: string
): boolean {
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expected = createHmac("sha256", secret()).update(payload).digest("base64url").slice(0, 32);
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      orderId: string;
      exp: number;
    };
    if (data.orderId !== orderId) return false;
    if (data.exp < Date.now()) return false;
    return true;
  } catch {
    return false;
  }
}

export function normalizePhone(phone: string): string {
  return String(phone || "").replace(/\D/g, "").replace(/^0/, "62");
}

export function phonesMatch(a: string, b: string): boolean {
  const na = normalizePhone(a);
  const nb = normalizePhone(b);
  if (!na || !nb) return false;
  return na === nb || na.endsWith(nb.slice(-10)) || nb.endsWith(na.slice(-10));
}

/** Redact PII for unauthenticated responses. */
export function redactOrder(order: Record<string, unknown>) {
  const customer = (order.customer || {}) as Record<string, unknown>;
  return {
    id: order.id,
    status: order.status,
    items: order.items,
    subtotal: order.subtotal,
    shipping_cost: order.shipping_cost,
    member_discount: order.member_discount,
    voucher_discount: order.voucher_discount,
    total: order.total,
    courier: order.courier,
    courier_name: order.courier_name,
    courier_code: order.courier_code,
    resi: order.resi,
    created_at: order.created_at,
    updated_at: order.updated_at,
    customer: {
      name: customer.name ? String(customer.name).charAt(0) + "***" : undefined,
    },
  };
}
