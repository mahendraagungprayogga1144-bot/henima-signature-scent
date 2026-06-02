import { getSessionUserId } from "./auth";
import { getDatabase } from "./db";
import { sanitizeUser } from "./auth";
import type { User } from "./types";

export async function getCurrentUser(): Promise<User | null> {
  const userId = await getSessionUserId();
  if (!userId) return null;
  const db = await getDatabase();
  const user = db.users.find((u) => u.id === userId);
  return user ?? null;
}

export async function getCurrentUserSafe() {
  const user = await getCurrentUser();
  return user ? sanitizeUser(user) : null;
}
