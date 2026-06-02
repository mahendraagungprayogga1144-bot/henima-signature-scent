import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { updateDatabase } from "@/lib/db";
import type { BankAccount, BankCode } from "@/lib/types";
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";

function isBankCode(x: any): x is BankCode {
  return x === "bca" || x === "mandiri" || x === "bri";
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
  const bankAccountsRaw = String(form.get("bankAccounts") || "").trim();
  const qrisImage = form.get("qrisImage") as File | null;
  const logo = form.get("logo") as File | null;
  const heroImage = form.get("heroImage") as File | null;

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

  let qrisPath: string | undefined;
  if (qrisImage && qrisImage.size > 0) {
    const bytes = await qrisImage.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = qrisImage.name.split(".").pop() || "png";
    const filename = `qris-${Date.now()}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", "qris");
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(path.join(uploadDir, filename), buffer);
    qrisPath = `/uploads/qris/${filename}`;
  }

  async function storeBrandFile(file: File, prefix: string) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = file.name.split(".").pop() || "png";
    const filename = `${prefix}-${Date.now()}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", "brand");
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(path.join(uploadDir, filename), buffer);
    return `/uploads/brand/${filename}`;
  }

  let logoPath: string | undefined;
  if (logo && logo.size > 0) {
    logoPath = await storeBrandFile(logo, "logo");
  }

  let heroPath: string | undefined;
  if (heroImage && heroImage.size > 0) {
    heroPath = await storeBrandFile(heroImage, "hero");
  }

  await updateDatabase((db) => {
    db.settings.company.name = companyName;
    db.settings.company.whatsappNumber = whatsappNumber || undefined;
    db.settings.company.address = address || undefined;
    db.settings.company.tagline = tagline || undefined;
    db.settings.company.vision = vision || undefined;
    db.settings.company.mission = mission || undefined;
    db.settings.company.brandStory = brandStory || undefined;
    if (logoPath) db.settings.company.logo = logoPath;
    if (heroPath) db.settings.company.heroImage = heroPath;
    if (bankAccounts) db.settings.payment.bankAccounts = bankAccounts;
    if (qrisPath) db.settings.payment.qrisImage = qrisPath;
  });

  return NextResponse.json({ ok: true });
}

