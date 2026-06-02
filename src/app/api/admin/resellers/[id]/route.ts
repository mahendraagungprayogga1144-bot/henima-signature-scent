import { NextResponse } from "next/server";
import { updateDatabase } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import type { ResellerTier } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const form = await request.formData();
  const approved = form.get("approved") === "true";
  const tier = String(form.get("tier") || "Bronze") as ResellerTier;
  const commissionPct = Number(form.get("commissionPct") || 0);

  if (!["Bronze", "Silver", "Gold"].includes(tier)) {
    return new NextResponse("Tier tidak valid", { status: 400 });
  }
  if (commissionPct < 0 || commissionPct > 100) {
    return new NextResponse("Komisi harus 0-100", { status: 400 });
  }

  await updateDatabase((db) => {
    const r = db.users.find((u) => u.id === id && u.role === "reseller");
    if (!r) return;
    r.reseller = r.reseller || {
      approved: true,
      tier: "Bronze",
      commissionPct: 0,
      commissionEarned: 0,
    };
    r.reseller.approved = approved;
    r.reseller.tier = tier;
    r.reseller.commissionPct = commissionPct;
  });

  return NextResponse.json({ ok: true });
}

