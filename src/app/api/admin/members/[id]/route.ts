import { NextResponse } from "next/server";
import { updateDatabase } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

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
  const action = String(form.get("action") || "");

  if (action === "delete") {
    await updateDatabase((db: any) => {
      db.users = db.users.filter((u: any) => u.id !== id);
    });
    return NextResponse.json({ ok: true });
  }

  if (action === "update") {
    const role = String(form.get("role") || "member");
    const circleTier = String(form.get("circleTier") || "signature");
    const approved = form.get("approved") === "true";

    await updateDatabase((db: any) => {
      const u = db.users.find((u: any) => u.id === id);
      if (!u) return;
      u.role = role;
      u.circleTier = circleTier;
      if (role === "reseller") {
        u.reseller = u.reseller || { approved: true, tier: "Bronze", commissionPct: 0, commissionEarned: 0 };
        u.reseller.approved = approved;
      }
    });
    return NextResponse.json({ ok: true });
  }

  return new NextResponse("Action tidak valid", { status: 400 });
}
