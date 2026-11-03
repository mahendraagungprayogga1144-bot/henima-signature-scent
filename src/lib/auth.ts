import { createHash, createHmac, randomBytes, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import type { User, UserRole } from "./types";

const SESSION_COOKIE = "toko_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 hari
const SESSION_MAX_AGE_REMEMBER = 60 * 60 * 24 * 30; // 30 hari

function sessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("SESSION_SECRET is required in production");
    }
    return "toko-dev-secret";
  }
  return secret;
}

/** Legacy SHA256 (unsalted) — kept for migrating existing accounts. */
function hashPasswordSha256(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export function verifyPassword(password: string, hash: string): boolean {
  if (!hash) return false;
  // bcrypt hashes start with $2a$ / $2b$ / $2y$
  if (hash.startsWith("$2")) {
    return bcrypt.compareSync(password, hash);
  }
  // Legacy SHA256 hex
  const legacy = hashPasswordSha256(password);
  try {
    const a = Buffer.from(legacy);
    const b = Buffer.from(hash);
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/** True if hash should be upgraded to bcrypt on next successful login. */
export function needsPasswordRehash(hash: string): boolean {
  return !hash.startsWith("$2");
}

export function createSessionToken(userId: string, maxAgeSeconds = SESSION_MAX_AGE): string {
  const payload = Buffer.from(
    JSON.stringify({ userId, exp: Date.now() + maxAgeSeconds * 1000 })
  ).toString("base64url");
  const sig = createHmac("sha256", sessionSecret())
    .update(payload)
    .digest("hex")
    .slice(0, 32);
  return `${payload}.${sig}`;
}

export function parseSessionToken(
  token: string | undefined
): { userId: string } | null {
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = createHmac("sha256", sessionSecret())
    .update(payload)
    .digest("hex")
    .slice(0, 32);
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
    const data = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    ) as { userId: string; exp: number };
    if (data.exp < Date.now()) return null;
    return { userId: data.userId };
  } catch {
    return null;
  }
}

export async function setSessionCookie(userId: string, remember = false) {
  const maxAge = remember ? SESSION_MAX_AGE_REMEMBER : SESSION_MAX_AGE;
  const token = createSessionToken(userId, maxAge);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge,
    path: "/",
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSessionUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const session = parseSessionToken(token);
  return session?.userId ?? null;
}

export function sanitizeUser(user: User) {
  const { passwordHash: _, ...safe } = user;
  return safe;
}

export function requireRole(user: User, roles: UserRole[]) {
  if (!roles.includes(user.role)) {
    throw new Error("Akses ditolak");
  }
}

export function generateId(prefix: string) {
  return `${prefix}-${randomBytes(6).toString("hex")}`;
}
