import { supabase } from "./supabase";

export type IntimateTier = "signature" | "intimate" | "soulscent" | "beloved";

export type MemberProfile = {
  userId: string;
  tier: IntimateTier;
  totalPoints: number;
  createdAt: string;
};

export const INTIMATE_TIERS: Array<{
  key: IntimateTier;
  label: string;
  minPoints: number;
  color: string;
  bg: string;
  discountPct: number;
  freeShipping: boolean;
  benefits: string[];
  desc: string;
}> = [
  {
    key: "signature",
    label: "SIGNATURE",
    minPoints: 0,
    color: "#8B7355",
    bg: "#F5F0E8",
    discountPct: 0,
    freeShipping: false,
    desc: "0 poin",
    benefits: ["Akses konten eksklusif Henima"],
  },
  {
    key: "intimate",
    label: "INTIMATE",
    minPoints: 50,
    color: "#C9A96E",
    bg: "#FBF6ED",
    discountPct: 5,
    freeShipping: false,
    desc: "50+ poin",
    benefits: [
      "Diskon 5% di setiap belanja",
      "Voucher Rp 50K untuk pembelian berikutnya",
      "Early access info produk baru",
    ],
  },
  {
    key: "soulscent",
    label: "SOULSCENT",
    minPoints: 150,
    color: "#B8860B",
    bg: "#FDF8EC",
    discountPct: 10,
    freeShipping: false,
    desc: "150+ poin",
    benefits: [
      "Diskon 10% di setiap belanja",
      "Semua keuntungan Intimate",
      "Voucher Rp 100K",
      "WhatsApp Insider update produk",
      "Early adopter akses produk terbaru",
      "Aksesoris spesial Henima",
    ],
  },
  {
    key: "beloved",
    label: "BELOVED",
    minPoints: 300,
    color: "#DAA520",
    bg: "#FFFBF0",
    discountPct: 10,
    freeShipping: true,
    desc: "300+ poin",
    benefits: [
      "Diskon 10% + gratis ongkir",
      "Semua keuntungan Soulscent",
      "Henima Gold Member Card",
      "Pandora Box hadiah kejutan eksklusif",
      "Exclusive panel dan sample produk baru",
      "Henima Exclusive Merch",
    ],
  },
];

/** Rp 10.000 belanja = 1 poin (dari total order) */
export function pointsFromOrderTotal(total: number): number {
  if (!total || total <= 0) return 0;
  return Math.floor(total / 10000);
}

export function tierFromPoints(points: number): IntimateTier {
  let current: IntimateTier = "signature";
  for (const t of INTIMATE_TIERS) {
    if (points >= t.minPoints) current = t.key;
  }
  return current;
}

export function getTierMeta(tier: IntimateTier) {
  return INTIMATE_TIERS.find((t) => t.key === tier) ?? INTIMATE_TIERS[0];
}

export function nextTierInfo(points: number) {
  const current = tierFromPoints(points);
  const idx = INTIMATE_TIERS.findIndex((t) => t.key === current);
  const next = INTIMATE_TIERS[idx + 1];
  if (!next) {
    return { current, next: null as null, progressPct: 100, pointsNeeded: 0 };
  }
  const prevMin = INTIMATE_TIERS[idx].minPoints;
  const span = next.minPoints - prevMin;
  const progressPct = Math.min(
    100,
    Math.round(((points - prevMin) / span) * 100)
  );
  return {
    current,
    next,
    progressPct,
    pointsNeeded: Math.max(0, next.minPoints - points),
  };
}

export function memberDiscountForSubtotal(
  tier: IntimateTier,
  subtotal: number
): number {
  const meta = getTierMeta(tier);
  if (!meta.discountPct || subtotal <= 0) return 0;
  return Math.floor((subtotal * meta.discountPct) / 100);
}

export function effectiveShippingCost(
  tier: IntimateTier,
  shippingCost: number
): number {
  const meta = getTierMeta(tier);
  if (meta.freeShipping) return 0;
  return shippingCost;
}

function rowToProfile(row: Record<string, unknown>): MemberProfile {
  return {
    userId: row.user_id as string,
    tier: (row.tier as IntimateTier) || "signature",
    totalPoints: (row.total_points as number) || 0,
    createdAt: (row.created_at as string) || new Date().toISOString(),
  };
}

export async function getOrCreateMemberProfile(
  userId: string
): Promise<MemberProfile> {
  const { data, error } = await supabase
    .from("member_profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (data && !error) return rowToProfile(data as Record<string, unknown>);

  const { data: created, error: insertErr } = await supabase
    .from("member_profiles")
    .upsert({
      user_id: userId,
      tier: "signature",
      total_points: 0,
    })
    .select("*")
    .single();

  if (insertErr || !created) {
    // Table may not exist yet — return soft default
    console.error("member_profiles upsert failed:", insertErr?.message);
    return {
      userId,
      tier: "signature",
      totalPoints: 0,
      createdAt: new Date().toISOString(),
    };
  }

  return rowToProfile(created as Record<string, unknown>);
}

type DeliveredOrderLike = {
  id: string;
  user_id?: string | null;
  total?: number | null;
  points_earned?: number | null;
};

export async function addMemberPoints(
  userId: string,
  points: number
): Promise<{ totalPoints: number; tier: IntimateTier } | null> {
  if (!userId || !points || points <= 0) return null;
  const profile = await getOrCreateMemberProfile(userId);
  const newTotal = profile.totalPoints + points;
  const newTier = tierFromPoints(newTotal);

  const { error } = await supabase
    .from("member_profiles")
    .update({ total_points: newTotal, tier: newTier })
    .eq("user_id", userId);

  if (error) {
    console.error("addMemberPoints failed:", error.message);
    return null;
  }
  return { totalPoints: newTotal, tier: newTier };
}

export function referralCodeForUserId(userId: string): string {
  return `HENIMA-${String(userId).slice(0, 6).toUpperCase()}`;
}

/** Parse HENIMA-XXXXXX or bare XXXXXX */
export function normalizeReferralCode(raw: string): string | null {
  const cleaned = String(raw || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "");
  if (!cleaned) return null;
  const withPrefix = cleaned.match(/^HENIMA-([A-Z0-9]{4,12})$/);
  if (withPrefix) return withPrefix[1];
  const bare = cleaned.match(/^([A-Z0-9]{4,12})$/);
  return bare ? bare[1] : null;
}

export async function findUserIdByReferralCode(
  code: string
): Promise<string | null> {
  const prefix = normalizeReferralCode(code);
  if (!prefix) return null;

  const { getDatabase } = await import("./db");
  const db = await getDatabase();
  const user = (db.users || []).find(
    (u: { id: string }) =>
      String(u.id).slice(0, prefix.length).toUpperCase() === prefix
  );
  return user?.id ?? null;
}

export async function setReferredBy(
  userId: string,
  referrerId: string
): Promise<void> {
  if (!userId || !referrerId || userId === referrerId) return;
  await getOrCreateMemberProfile(userId);
  const { error } = await supabase
    .from("member_profiles")
    .update({ referred_by: referrerId })
    .eq("user_id", userId)
    .is("referred_by", null);
  if (error) console.error("setReferredBy failed:", error.message);
}

export async function getReferredBy(userId: string): Promise<string | null> {
  const { data } = await supabase
    .from("member_profiles")
    .select("referred_by")
    .eq("user_id", userId)
    .maybeSingle();
  return (data?.referred_by as string) || null;
}

/** Poin bonus saat daftar pakai kode referral */
export const REFERRAL_SIGNUP_NEWBIE = 15;
export const REFERRAL_SIGNUP_REFERRER = 25;

/**
 * Apply referral on register. Awards points to both sides.
 * Returns referrer id if applied.
 */
export async function applyReferralOnSignup(
  newUserId: string,
  referralCode: string
): Promise<{ referrerId: string } | null> {
  const referrerId = await findUserIdByReferralCode(referralCode);
  if (!referrerId || referrerId === newUserId) return null;

  await setReferredBy(newUserId, referrerId);
  await addMemberPoints(newUserId, REFERRAL_SIGNUP_NEWBIE);
  await addMemberPoints(referrerId, REFERRAL_SIGNUP_REFERRER);
  return { referrerId };
}

/**
 * Award points when an order becomes delivered.
 * Idempotent: skips if points_earned already set or no user_id.
 * Also awards referral bonus to referrer if member was referred.
 */
export async function awardPointsForDeliveredOrder(
  order: DeliveredOrderLike
): Promise<{ awarded: number } | null> {
  if (!order?.id) return null;
  if (!order.user_id) return null;
  if (order.points_earned != null && order.points_earned > 0) return null;

  const points = pointsFromOrderTotal(Number(order.total) || 0);
  if (points <= 0) {
    await supabase
      .from("retail_orders")
      .update({ points_earned: 0 })
      .eq("id", order.id)
      .is("points_earned", null);
    return { awarded: 0 };
  }

  const { error: orderErr } = await supabase
    .from("retail_orders")
    .update({ points_earned: points })
    .eq("id", order.id)
    .is("points_earned", null);

  if (orderErr) {
    console.error("Failed to set points_earned:", orderErr.message);
    return null;
  }

  await addMemberPoints(order.user_id, points);

  // Bonus referrer: 20% poin order (min 5) sekali per order delivered
  try {
    const referrerId = await getReferredBy(order.user_id);
    if (referrerId) {
      const bonus = Math.max(5, Math.floor(points * 0.2));
      await addMemberPoints(referrerId, bonus);
    }
  } catch (e) {
    console.error("referral order bonus failed:", e);
  }

  return { awarded: points };
}
