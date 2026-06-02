import { createHash, randomBytes } from "crypto";
import { cookies } from "next/headers";
import type { User, UserRole } from "./types";

const SESSION_COOKIE = "toko_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 hari

export function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

export function createSessionToken(userId: string): string {
  const payload = Buffer.from(
    JSON.stringify({ userId, exp: Date.now() + SESSION_MAX_AGE * 1000 })
  ).toString("base64url");
  const sig = createHash("sha256")
    .update(payload + (process.env.SESSION_SECRET || "toko-dev-secret"))
    .digest("hex")
    .slice(0, 16);
  return `${payload}.${sig}`;
}

export function parseSessionToken(
  token: string | undefined
): { userId: string } | null {
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = createHash("sha256")
    .update(payload + (process.env.SESSION_SECRET || "toko-dev-secret"))
    .digest("hex")
    .slice(0, 16);
  if (sig !== expected) return null;
  try {
    const data = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    ) as { userId: string; exp: number };
    if (data.exp < Date.now()) return null;
    return { userId: data.userId };
  } catch {
    return null;
  }
}

export async function setSessionCookie(userId: string) {
  const token = createSessionToken(userId);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
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
