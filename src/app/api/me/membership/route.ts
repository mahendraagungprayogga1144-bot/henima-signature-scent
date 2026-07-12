import { NextResponse } from "next/server";
import { getCurrentUserSafe } from "@/lib/session";
import {
  getOrCreateMemberProfile,
  getTierMeta,
  nextTierInfo,
} from "@/lib/membership";

export async function GET() {
  const user = await getCurrentUserSafe();
  if (!user) {
    return NextResponse.json({ loggedIn: false });
  }

  const profile = await getOrCreateMemberProfile(user.id);
  const meta = getTierMeta(profile.tier);
  const progress = nextTierInfo(profile.totalPoints);

  return NextResponse.json({
    loggedIn: true,
    userId: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    tier: profile.tier,
    tierLabel: meta.label,
    tierColor: meta.color,
    totalPoints: profile.totalPoints,
    discountPct: meta.discountPct,
    freeShipping: meta.freeShipping,
    nextTier: progress.next
      ? {
          key: progress.next.key,
          label: progress.next.label,
          minPoints: progress.next.minPoints,
        }
      : null,
    pointsNeeded: progress.pointsNeeded,
    progressPct: progress.progressPct,
  });
}
