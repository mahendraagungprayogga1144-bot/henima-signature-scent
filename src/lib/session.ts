import { getSessionUserId } from "./auth";
import { getUserById } from "./db";
import { sanitizeUser } from "./auth";
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
