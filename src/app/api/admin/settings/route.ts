import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { supabase } from "@/lib/supabase";
import { updateDatabase } from "@/lib/db";
import type { BankAccount, BankCode } from "@/lib/types";

export const runtime = "nodejs";

function isBankCode(x: any): x is BankCode {
  return x === "bca" || x === "mandiri" || x === "bri";
}

async function uploadBrandAsset(file: File, prefix: string): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const filename = `${prefix}-${Date.now()}.${ext}`;
  const bytes = await file.arrayBuffer();
  const { error } = await supabase.storage
    .from("brand-assets")
    .upload(filename, bytes, { contentType: file.type, upsert: true });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from("brand-assets").getPublicUrl(filename);
  return data.publicUrl;
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const form = await request.formData();
  const companyName = String(form.get("companyName") || "").trim();
  const whatsappNumber = String(form.get("whatsappNumber") || "").trim();
  const address = String(form.get("address") || "").trim();
  const tagline = String(form.get("tagline") || "").trim();
  const vision = String(form.get("vision") || "").trim();
  const mission = String(form.get("mission") || "").trim();
  const brandStory = String(form.get("brandStory") || "").trim();
  const foundingYear = String(form.get("foundingYear") || "").trim();
  const bankAccountsRaw = String(form.get("bankAccounts") || "").trim();
  const teamRaw = String(form.get("team") || "").trim();
  const advantagesRaw = String(form.get("advantages") || "").trim();
  const qrisUrlExisting = form.get("qrisUrl") as string | null;
  const logoUrlExisting = form.get("logoUrl") as string | null;
  const heroUrlExisting = form.get("heroUrl") as string | null;
  const heroImagesRaw = String(form.get("heroImages") || "").trim();
  let heroImages: string[] = [];
  if (heroImagesRaw) { try { heroImages = JSON.parse(heroImagesRaw); } catch {} }
  const qrisFile = form.get("qrisImage") as File | null;
  const logoFile = form.get("logo") as File | null;
  const heroFile = form.get("heroImage") as File | null;

  if (!companyName) {
    return new NextResponse("Nama perusahaan wajib diisi", { status: 400 });
  }

  let bankAccounts: BankAccount[] | null = null;
  if (bankAccountsRaw) {
    try {
      const parsed = JSON.parse(bankAccountsRaw) as BankAccount[];
      if (!Array.isArray(parsed)) throw new Error("invalid");
      bankAccounts = parsed
        .filter((b) => b && isBankCode((b as any).code))
        .map((b) => ({
          code: b.code,
          bankName: String(b.bankName || b.code.toUpperCase()),
          accountNumber: String(b.accountNumber || "0000000000"),
          accountName: String(b.accountName || companyName),
          active: Boolean(b.active),
        }));
    } catch {
      return new NextResponse("Bank accounts JSON tidak valid", { status: 400 });
    }
  }

  let team = null;
  if (teamRaw) { try { team = JSON.parse(teamRaw); } catch {} }
  let advantages = null;
  if (advantagesRaw) { try { advantages = JSON.parse(advantagesRaw); } catch {} }

  let qrisPath = qrisUrlExisting || undefined;
  if (qrisFile && qrisFile.size > 0) {
    try { qrisPath = await uploadBrandAsset(qrisFile, "qris"); } catch {}
  }
  let logoPath = logoUrlExisting || undefined;
  if (logoFile && logoFile.size > 0) {
    try { logoPath = await uploadBrandAsset(logoFile, "logo"); } catch {}
  }
  let heroPath = heroUrlExisting || undefined;
  if (heroFile && heroFile.size > 0) {
    try { heroPath = await uploadBrandAsset(heroFile, "hero"); } catch {}
  }

  await updateDatabase((db) => {
    db.settings.company.name = companyName;
    db.settings.company.whatsappNumber = whatsappNumber || undefined;
    db.settings.company.address = address || undefined;
    db.settings.company.tagline = tagline || undefined;
    db.settings.company.vision = vision || undefined;
    db.settings.company.mission = mission || undefined;
    db.settings.company.brandStory = brandStory || undefined;
    (db.settings.company as any).foundingYear = foundingYear || undefined;
    if (logoPath) db.settings.company.logo = logoPath;
    if (heroPath) db.settings.company.heroImage = heroPath;
    if (heroImages.length > 0) (db.settings.company as any).heroImages = heroImages;
    else if (heroPath) (db.settings.company as any).heroImages = [heroPath];
    const marqueeRaw = String(form.get("marqueeItems") || "").trim();
    let marqueeItems: string[] = [];
    if (marqueeRaw) { try { marqueeItems = JSON.parse(marqueeRaw); } catch {} }
    if (marqueeItems.length > 0) (db.settings.company as any).marqueeItems = marqueeItems;
    const galleryImagesRaw = String(form.get("galleryImages") || "").trim();
    let galleryImages: string[] = [];
    if (galleryImagesRaw) { try { galleryImages = JSON.parse(galleryImagesRaw); } catch {} }
    (db.settings.company as any).galleryImages = galleryImages;
    if (team) db.settings.company.team = team;
    if (advantages) db.settings.company.advantages = advantages;
    if (bankAccounts) db.settings.payment.bankAccounts = bankAccounts;
    if (qrisPath) db.settings.payment.qrisImage = qrisPath;
  });

  return NextResponse.json({ ok: true });
}
