import { NextResponse } from "next/server";
import { getSessionUserId, sanitizeUser } from "./auth";
import { getUserById } from "./db";
import type { User } from "./types";

export async function getCurrentUser(): Promise<User | null> {
  const userId = await getSessionUserId();
  if (!userId) return null;
  return getUserById(userId);
}

export async function getCurrentUserSafe() {
  const user = await getCurrentUser();
  return user ? sanitizeUser(user) : null;
}

/** Shared admin gate for API routes. */
export async function requireAdmin(): Promise<
  { user: User; error?: undefined } | { user?: undefined; error: NextResponse }
> {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return {
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }
  return { user };
}
