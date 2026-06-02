"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { Settings, BankAccount, BankCode } from "@/lib/types";

function ensureBank(code: BankCode, existing?: BankAccount): BankAccount {
  return (
    existing ?? {
      code,
      bankName: code.toUpperCase(),
      accountNumber: "0000000000",
      accountName: "Henima Signature Scent",
      active: code === "bca",
    }
  );
}

export default function SettingsForm({ settings }: { settings: Settings }) {
  const [companyName, setCompanyName] = useState(settings.company.name);
  const [whatsapp, setWhatsapp] = useState(settings.company.whatsappNumber || "");
  const [address, setAddress] = useState(settings.company.address || "");
  const [tagline, setTagline] = useState(settings.company.tagline || "");
  const [vision, setVision] = useState(settings.company.vision || "");
  const [mission, setMission] = useState(settings.company.mission || "");
  const [brandStory, setBrandStory] = useState(settings.company.brandStory || "");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [qrisFile, setQrisFile] = useState<File | null>(null);
  const [banks, setBanks] = useState<BankAccount[]>(() => {
    const byCode = new Map(settings.payment.bankAccounts.map((b) => [b.code, b]));
    return [
      ensureBank("bca", byCode.get("bca")),
      ensureBank("mandiri", byCode.get("mandiri")),
      ensureBank("bri", byCode.get("bri")),
    ];
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const qrisPreview = useMemo(() => (qrisFile ? URL.createObjectURL(qrisFile) : null), [qrisFile]);
  const logoPreview = useMemo(() => (logoFile ? URL.createObjectURL(logoFile) : null), [logoFile]);
  const heroPreview = useMemo(() => (heroFile ? URL.createObjectURL(heroFile) : null), [heroFile]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const fd = new FormData();
      fd.set("companyName", companyName);
      fd.set("whatsappNumber", whatsapp);
      fd.set("address", address);
      fd.set("tagline", tagline);
      fd.set("vision", vision);
      fd.set("mission", mission);
      fd.set("brandStory", brandStory);
      fd.set("bankAccounts", JSON.stringify(banks));
      if (logoFile) fd.set("logo", logoFile);
      if (heroFile) fd.set("heroImage", heroFile);
      if (qrisFile) fd.set("qrisImage", qrisFile);

      const res = await fetch("/api/admin/settings", { method: "POST", body: fd });
      if (!res.ok) {
        const text = await res.text();
        setMessage(text || "Gagal menyimpan pengaturan");
        return;
      }
      setMessage("Pengaturan berhasil disimpan.");
    } catch {
      setMessage("Terjadi kesalahan jaringan.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="card space-y-4">
        <h2 className="text-lg font-semibold text-ink-50">Brand settings</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="label">Nama Perusahaan</label>
            <input className="input-field" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Tagline</label>
            <input className="input-field" value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="Luxury scent, crafted for your signature." />
          </div>
          <div>
            <label className="label">WhatsApp (Admin)</label>
            <input className="input-field" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="62812xxxxxxx" />
          </div>
          <div>
            <label className="label">Alamat (opsional)</label>
            <input className="input-field" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Vision</label>
            <textarea className="input-field" rows={2} value={vision} onChange={(e) => setVision(e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Mission</label>
            <textarea className="input-field" rows={2} value={mission} onChange={(e) => setMission(e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Brand story</label>
            <textarea className="input-field" rows={4} value={brandStory} onChange={(e) => setBrandStory(e.target.value)} />
          </div>

          <div className="sm:col-span-2 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-ink-800 bg-ink-950/20 p-4">
              <p className="text-sm font-semibold text-ink-100">Logo</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-[120px_1fr]">
                <div className="relative h-24 w-24 overflow-hidden rounded-2xl border border-ink-800 bg-ink-950/40">
                  <Image src={logoPreview || settings.company.logo || "/products/placeholder.svg"} alt="Logo" fill className="object-contain p-3" />
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    className="block w-full text-sm text-ink-300 file:mr-4 file:rounded-lg file:border-0 file:bg-ink-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-ink-50"
                    onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)}
                  />
                  <p className="mt-2 text-xs text-ink-400">Disimpan ke `public/uploads/brand`.</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-ink-800 bg-ink-950/20 p-4">
              <p className="text-sm font-semibold text-ink-100">Hero image</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-[120px_1fr]">
                <div className="relative h-24 w-24 overflow-hidden rounded-2xl border border-ink-800 bg-ink-950/40">
                  <Image src={heroPreview || settings.company.heroImage || "/products/placeholder.svg"} alt="Hero image" fill className="object-cover" />
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    className="block w-full text-sm text-ink-300 file:mr-4 file:rounded-lg file:border-0 file:bg-ink-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-ink-50"
                    onChange={(e) => setHeroFile(e.target.files?.[0] ?? null)}
                  />
                  <p className="mt-2 text-xs text-ink-400">Disimpan ke `public/uploads/brand`.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card space-y-4">
        <h2 className="text-lg font-semibold text-ink-50">QRIS</h2>
        <div className="grid gap-4 sm:grid-cols-[180px_1fr]">
          <div className="relative h-44 w-44 overflow-hidden rounded-2xl border border-ink-800 bg-ink-950/40">
            <Image
              src={qrisPreview || settings.payment.qrisImage}
              alt="QRIS"
              fill
              className="object-contain p-3"
            />
          </div>
          <div>
            <label className="label">Upload QRIS image</label>
            <input
              type="file"
              accept="image/*"
              className="block w-full text-sm text-ink-300 file:mr-4 file:rounded-lg file:border-0 file:bg-ink-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-ink-50"
              onChange={(e) => setQrisFile(e.target.files?.[0] ?? null)}
            />
            <p className="mt-2 text-xs text-ink-400">Disimpan ke `public/uploads/qris`.</p>
          </div>
        </div>
      </div>

      <div className="card space-y-4">
        <h2 className="text-lg font-semibold text-ink-50">Rekening Bank</h2>
        <div className="space-y-4">
          {banks.map((b, idx) => (
            <div key={b.code} className="rounded-2xl border border-ink-800 bg-ink-950/20 p-4">
              <div className="flex items-center justify-between gap-4">
                <p className="font-semibold text-ink-50">{b.bankName}</p>
                <label className="flex items-center gap-2 text-sm text-ink-200">
                  <input
                    type="checkbox"
                    checked={b.active}
                    onChange={(e) =>
                      setBanks((prev) =>
                        prev.map((x, i) => (i === idx ? { ...x, active: e.target.checked } : x))
                      )
                    }
                  />
                  Aktif
                </label>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="label">Nama Bank</label>
                  <input
                    className="input-field"
                    value={b.bankName}
                    onChange={(e) =>
                      setBanks((prev) =>
                        prev.map((x, i) => (i === idx ? { ...x, bankName: e.target.value } : x))
                      )
                    }
                  />
                </div>
                <div>
                  <label className="label">No Rekening</label>
                  <input
                    className="input-field"
                    value={b.accountNumber}
                    onChange={(e) =>
                      setBanks((prev) =>
                        prev.map((x, i) =>
                          i === idx ? { ...x, accountNumber: e.target.value } : x
                        )
                      )
                    }
                  />
                </div>
                <div>
                  <label className="label">Atas Nama</label>
                  <input
                    className="input-field"
                    value={b.accountName}
                    onChange={(e) =>
                      setBanks((prev) =>
                        prev.map((x, i) => (i === idx ? { ...x, accountName: e.target.value } : x))
                      )
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {message && <p className="text-sm text-ink-200">{message}</p>}

      <button type="submit" className="btn-primary" disabled={saving}>
        {saving ? "Menyimpan..." : "Simpan Pengaturan"}
      </button>
    </form>
  );
}

