"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import type { Settings, BankAccount, BankCode, TeamMember, Advantage } from "@/lib/types";

function ensureBank(code: BankCode, existing?: BankAccount): BankAccount {
  return existing ?? { code, bankName: code.toUpperCase(), accountNumber: "0000000000", accountName: "Henima Signature Scent", active: code === "bca" };
}

export default function SettingsForm({ settings }: { settings: Settings }) {
  const [companyName, setCompanyName] = useState(settings.company.name);
  const [whatsapp, setWhatsapp] = useState(settings.company.whatsappNumber || "");
  const [address, setAddress] = useState(settings.company.address || "");
  const [tagline, setTagline] = useState(settings.company.tagline || "");
  const [vision, setVision] = useState(settings.company.vision || "");
  const [mission, setMission] = useState(settings.company.mission || "");
  const [brandStory, setBrandStory] = useState(settings.company.brandStory || "");
  const [foundingYear, setFoundingYear] = useState((settings.company as any).foundingYear || "");
  const [team, setTeam] = useState<TeamMember[]>(settings.company.team || []);
  const [advantages, setAdvantages] = useState<Advantage[]>(settings.company.advantages || [
    { id: "1", title: "Bahan Baku Premium", desc: "Bahan pilihan berkualitas tinggi", icon: "🌿" },
    { id: "2", title: "Tahan Seharian", desc: "Aroma bertahan 8-12 jam", icon: "⏰" },
    { id: "3", title: "Ramah di Kulit", desc: "Aman untuk semua jenis kulit", icon: "💚" },
  ]);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [heroImages, setHeroImages] = useState<string[]>((settings.company as any).heroImages || (settings.company.heroImage ? [settings.company.heroImage] : []));
  const [galleryImages, setGalleryImages] = useState<string[]>((settings.company as any).galleryImages || []);
  const [marqueeItems, setMarqueeItems] = useState<string[]>((settings.company as any).marqueeItems || ["Afternoon","The Distance","Extrait de Parfum","Made in Indonesia","Crafted to be Remembered"]);
  const [newMarqueeItem, setNewMarqueeItem] = useState("");
  const [heroUploading, setHeroUploading] = useState(false);
  const [qrisFile, setQrisFile] = useState<File | null>(null);
  const [banks, setBanks] = useState<BankAccount[]>(() => {
    const byCode = new Map(settings.payment.bankAccounts.map((b) => [b.code, b]));
    return [ensureBank("bca", byCode.get("bca")), ensureBank("mandiri", byCode.get("mandiri")), ensureBank("bri", byCode.get("bri"))];
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const qrisPreview = useMemo(() => (qrisFile ? URL.createObjectURL(qrisFile) : null), [qrisFile]);
  const logoPreview = useMemo(() => (logoFile ? URL.createObjectURL(logoFile) : null), [logoFile]);
  const heroPreview = useMemo(() => (heroFile ? URL.createObjectURL(heroFile) : null), [heroFile]);

  async function addHeroImage(file: File) {
    setHeroUploading(true);
    try {
      const url = await uploadToSupabase(file, "hero");
      setHeroImages((prev) => [...prev, url]);
    } catch (err: any) { alert("Upload gagal: " + err.message); }
    finally { setHeroUploading(false); }
  }

  function removeHeroImage(idx: number) {
    setHeroImages((prev) => prev.filter((_, i) => i !== idx));
  }

  async function uploadToSupabase(file: File, prefix: string): Promise<string> {
    const ext = file.name.split(".").pop() || "jpg";
    const filename = `${prefix}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("brand-assets").upload(filename, file, { contentType: file.type, upsert: true });
    if (error) throw new Error(error.message);
    const { data } = supabase.storage.from("brand-assets").getPublicUrl(filename);
    return data.publicUrl;
  }

  async function uploadTeamPhoto(file: File): Promise<string> {
    return uploadToSupabase(file, "team");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      let logoUrl = settings.company.logo || "";
      let heroUrl = settings.company.heroImage || "";
      let qrisUrl = settings.payment.qrisImage || "";

      if (logoFile) logoUrl = await uploadToSupabase(logoFile, "logo");
      if (heroFile) heroUrl = await uploadToSupabase(heroFile, "hero");
      if (qrisFile) qrisUrl = await uploadToSupabase(qrisFile, "qris");

      const fd = new FormData();
      fd.set("companyName", companyName);
      fd.set("whatsappNumber", whatsapp);
      fd.set("address", address);
      fd.set("tagline", tagline);
      fd.set("vision", vision);
      fd.set("mission", mission);
      fd.set("brandStory", brandStory);
      fd.set("foundingYear", foundingYear);
      fd.set("team", JSON.stringify(team));
      fd.set("advantages", JSON.stringify(advantages));
      fd.set("bankAccounts", JSON.stringify(banks));
      fd.set("logoUrl", logoUrl);
      fd.set("heroUrl", heroUrl);
      fd.set("heroImages", JSON.stringify(heroImages.length > 0 ? heroImages : heroUrl ? [heroUrl] : []));
      fd.set("galleryImages", JSON.stringify(galleryImages));
      fd.set("marqueeItems", JSON.stringify(marqueeItems));
      fd.set("heroVideo", heroVideoUrl);
      fd.set("qrisUrl", qrisUrl);

      const res = await fetch("/api/admin/settings", { method: "POST", body: fd });
      if (!res.ok) { const text = await res.text(); setMessage(text || "Gagal menyimpan"); return; }
      setMessage("Pengaturan berhasil disimpan! ✅");
    } catch (err: any) { setMessage("Error: " + err.message); }
    finally { setSaving(false); }
  }

  function addTeamMember() {
    setTeam((prev) => [...prev, { id: Date.now().toString(), name: "", role: "", photo: "", bio: "" }]);
  }

  function updateTeam(idx: number, field: keyof TeamMember, value: string) {
    setTeam((prev) => prev.map((m, i) => i === idx ? { ...m, [field]: value } : m));
  }

  async function handleTeamPhoto(idx: number, file: File) {
    try {
      const url = await uploadTeamPhoto(file);
      updateTeam(idx, "photo", url);
    } catch (err: any) { setMessage("Gagal upload foto: " + err.message); }
  }

  function removeTeam(idx: number) {
    setTeam((prev) => prev.filter((_, i) => i !== idx));
  }

  function addAdvantage() {
    setAdvantages((prev) => [...prev, { id: Date.now().toString(), title: "", desc: "", icon: "✨" }]);
  }

  function updateAdvantage(idx: number, field: keyof Advantage, value: string) {
    setAdvantages((prev) => prev.map((a, i) => i === idx ? { ...a, [field]: value } : a));
  }

  function removeAdvantage(idx: number) {
    setAdvantages((prev) => prev.filter((_, i) => i !== idx));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Brand Settings */}
      <div className="card space-y-4">
        <h2 className="text-lg font-semibold text-ink-50">Brand Settings</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="label">Nama Perusahaan</label>
            <input className="input-field" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Tagline</label>
            <input className="input-field" value={tagline} onChange={(e) => setTagline(e.target.value)} />
          </div>
          <div>
            <label className="label">WhatsApp Admin</label>
            <input className="input-field" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="62812xxxxxxx" />
          </div>
          <div>
            <label className="label">Tahun Berdiri</label>
            <input className="input-field" value={foundingYear} onChange={(e) => setFoundingYear(e.target.value)} placeholder="2023" />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Alamat</label>
            <input className="input-field" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Visi</label>
            <textarea className="input-field" rows={2} value={vision} onChange={(e) => setVision(e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Misi</label>
            <textarea className="input-field" rows={2} value={mission} onChange={(e) => setMission(e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Brand Story</label>
            <textarea className="input-field" rows={4} value={brandStory} onChange={(e) => setBrandStory(e.target.value)} />
          </div>
          <div className="sm:col-span-2 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-ink-800 bg-ink-950/20 p-4">
              <p className="text-sm font-semibold text-ink-100">Logo</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-[120px_1fr]">
                <div className="relative h-24 w-24 overflow-hidden rounded-2xl border border-ink-800 bg-ink-950/40">
                  <Image src={logoPreview || settings.company.logo || "/products/placeholder.svg"} alt="Logo" fill className="object-contain p-3" />
                </div>
                <input type="file" accept="image/*" className="block w-full text-sm text-ink-300 file:mr-4 file:rounded-lg file:border-0 file:bg-ink-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-ink-50"
                  onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)} />
              </div>
            </div>
            <div className="rounded-2xl border border-ink-800 bg-ink-950/20 p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-ink-100">Hero Images (Carousel)</p>
                <span className="text-xs text-ink-400">{heroImages.length}/4 foto</span>
              </div>
              <p className="text-xs text-ink-400 mb-3">Upload 3-4 foto untuk slideshow di homepage. Foto pertama tampil paling awal.</p>
              <div className="grid grid-cols-2 gap-2 mb-3 sm:grid-cols-4">
                {heroImages.map((url, idx) => (
                  <div key={idx} className="relative group">
                    <div className="relative h-24 overflow-hidden rounded-lg border border-ink-700 bg-ink-950/40">
                      <Image src={url} alt={"Hero " + (idx+1)} fill className="object-cover" />
                    </div>
                    <button type="button" onClick={() => removeHeroImage(idx)}
                      className="absolute top-1 right-1 bg-red-500/80 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      ×
                    </button>
                    <p className="text-xs text-ink-400 text-center mt-1">Foto {idx+1}</p>
                  </div>
                ))}
                {heroImages.length < 4 && (
                  <label className="relative h-24 rounded-lg border-2 border-dashed border-ink-700 bg-ink-950/20 flex flex-col items-center justify-center cursor-pointer hover:border-gold-400/50 transition-colors">
                    {heroUploading ? (
                      <span className="text-xs text-ink-400">Uploading...</span>
                    ) : (
                      <>
                        <span className="text-2xl text-ink-500">+</span>
                        <span className="text-xs text-ink-400 mt-1">Tambah foto</span>
                      </>
                    )}
                    <input type="file" accept="image/*" className="hidden"
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) addHeroImage(f); }}
                      disabled={heroUploading} />
                  </label>
                )}
              </div>
              {heroImages.length === 0 {heroImages.length === 0 {heroImages.length === 0 && ({heroImages.length === 0 && ( ({heroImages.length === 0 {heroImages.length === 0 && ({heroImages.length === 0 && ( ( (
                <p className="text-xs text-amber-400">⚠ Belum ada foto hero. Tambah minimal 1 foto.</p>
              )}
            </div>
          </div>
            <div className="rounded-2xl border border-ink-800 bg-ink-950/20 p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-ink-100">Gallery Images (Homepage Carousel)</p>
                <span className="text-xs text-ink-400">{galleryImages.length} foto</span>
              </div>
              <p className="text-xs text-ink-400 mb-3">Foto yang tampil di carousel homepage. Bisa digeser kanan-kiri.</p>
              <div className="grid grid-cols-2 gap-2 mb-3 sm:grid-cols-4">
                {galleryImages.map((url, idx) => (
                  <div key={idx} className="relative group">
                    <div className="relative h-24 overflow-hidden rounded-lg border border-ink-700 bg-ink-950/40">
                      <Image src={url} alt={"Gallery " + (idx+1)} fill className="object-cover" />
                    </div>
                    <button type="button" onClick={() => setGalleryImages(galleryImages.filter((_,i) => i !== idx))}
                      className="absolute top-1 right-1 bg-red-500/80 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      x
                    </button>
                    <p className="text-xs text-ink-400 text-center mt-1">Foto {idx+1}</p>
                  </div>
                ))}
                <label className="relative h-24 rounded-lg border-2 border-dashed border-ink-700 bg-ink-950/20 flex flex-col items-center justify-center cursor-pointer hover:border-gold-400/50 transition-colors">
                  {heroUploading ? (
                    <span className="text-xs text-ink-400">Uploading...</span>
                  ) : (
                    <>
                      <span className="text-2xl text-ink-500">+</span>
                      <span className="text-xs text-ink-400 mt-1">Tambah foto</span>
                    </>
                  )}
                  <input type="file" accept="image/*" className="hidden"
                    onChange={async (e) => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      setHeroUploading(true);
                      try {
                        const url = await uploadToSupabase(f, "gallery");
                        setGalleryImages(prev => [...prev, url]);
                      } finally { setHeroUploading(false); }
                    }}
                    disabled={heroUploading} />
                </label>
              </div>
            </div>
        </div>
      </div>

      {/* Team */}
      <div className="card space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink-50">Tim Kami</h2>
          <button type="button" onClick={addTeamMember} className="btn-secondary !py-2">+ Tambah Anggota</button>
        </div>
        {team.length === 0 && <p className="text-sm text-ink-400">Belum ada anggota tim. Klik "Tambah Anggota".</p>}
        {team.map((member, idx) => (
          <div key={member.id} className="rounded-2xl border border-ink-800 bg-ink-950/20 p-4 space-y-3">
            <div className="flex items-start gap-4">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border border-ink-700 bg-ink-900">
                {member.photo && <Image src={member.photo} alt={member.name} fill className="object-cover" />}
                {!member.photo && <div className="flex h-full w-full items-center justify-center text-2xl">👤</div>}
              </div>
              <div className="flex-1">
                <input type="file" accept="image/*" className="block w-full text-xs text-ink-300 file:mr-2 file:rounded-lg file:border-0 file:bg-ink-900 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-ink-50"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleTeamPhoto(idx, f); }} />
              </div>
              <button type="button" onClick={() => removeTeam(idx)} className="text-red-400 hover:text-red-300 text-sm">✕</button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="label">Nama</label>
                <input className="input-field" value={member.name} onChange={(e) => updateTeam(idx, "name", e.target.value)} placeholder="Nama lengkap" />
              </div>
              <div>
                <label className="label">Jabatan / Role</label>
                <input className="input-field" value={member.role} onChange={(e) => updateTeam(idx, "role", e.target.value)} placeholder="Co-founder, CEO..." />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Bio Singkat</label>
                <textarea className="input-field" rows={2} value={member.bio || ""} onChange={(e) => updateTeam(idx, "bio", e.target.value)} placeholder="Cerita singkat tentang anggota tim..." />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Keunggulan */}
      <div className="card space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink-50">Keunggulan Produk</h2>
          <button type="button" onClick={addAdvantage} className="btn-secondary !py-2">+ Tambah</button>
        </div>
        {advantages.map((adv, idx) => (
          <div key={adv.id} className="rounded-2xl border border-ink-800 bg-ink-950/20 p-4">
            <div className="grid gap-3 sm:grid-cols-[60px_1fr_1fr_auto]">
              <div>
                <label className="label">Icon</label>
                <input className="input-field text-center text-lg" value={adv.icon || "✨"} onChange={(e) => updateAdvantage(idx, "icon", e.target.value)} />
              </div>
              <div>
                <label className="label">Judul</label>
                <input className="input-field" value={adv.title} onChange={(e) => updateAdvantage(idx, "title", e.target.value)} placeholder="Bahan Premium..." />
              </div>
              <div>
                <label className="label">Deskripsi</label>
                <input className="input-field" value={adv.desc} onChange={(e) => updateAdvantage(idx, "desc", e.target.value)} placeholder="Penjelasan singkat..." />
              </div>
              <div className="flex items-end">
                <button type="button" onClick={() => removeAdvantage(idx)} className="btn-secondary !py-2 text-red-400">✕</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* QRIS */}
      <div className="card space-y-4">
        <h2 className="text-lg font-semibold text-ink-50">QRIS</h2>
        <div className="grid gap-4 sm:grid-cols-[180px_1fr]">
          <div className="relative h-44 w-44 overflow-hidden rounded-2xl border border-ink-800 bg-ink-950/40">
            <Image src={qrisPreview || settings.payment.qrisImage} alt="QRIS" fill className="object-contain p-3" />
          </div>
          <div>
            <label className="label">Upload QRIS image</label>
            <input type="file" accept="image/*" className="block w-full text-sm text-ink-300 file:mr-4 file:rounded-lg file:border-0 file:bg-ink-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-ink-50"
              onChange={(e) => setQrisFile(e.target.files?.[0] ?? null)} />
          </div>
            <div className="rounded-2xl border border-ink-800 bg-ink-950/20 p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-ink-100">Gallery Images (Homepage Carousel)</p>
                <span className="text-xs text-ink-400">{galleryImages.length} foto</span>
              </div>
              <p className="text-xs text-ink-400 mb-3">Foto yang tampil di carousel homepage. Bisa digeser kanan-kiri.</p>
              <div className="grid grid-cols-2 gap-2 mb-3 sm:grid-cols-4">
                {galleryImages.map((url, idx) => (
                  <div key={idx} className="relative group">
                    <div className="relative h-24 overflow-hidden rounded-lg border border-ink-700 bg-ink-950/40">
                      <Image src={url} alt={"Gallery " + (idx+1)} fill className="object-cover" />
                    </div>
                    <button type="button" onClick={() => setGalleryImages(galleryImages.filter((_,i) => i !== idx))}
                      className="absolute top-1 right-1 bg-red-500/80 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      x
                    </button>
                    <p className="text-xs text-ink-400 text-center mt-1">Foto {idx+1}</p>
                  </div>
                ))}
                <label className="relative h-24 rounded-lg border-2 border-dashed border-ink-700 bg-ink-950/20 flex flex-col items-center justify-center cursor-pointer hover:border-gold-400/50 transition-colors">
                  {heroUploading ? (
                    <span className="text-xs text-ink-400">Uploading...</span>
                  ) : (
                    <>
                      <span className="text-2xl text-ink-500">+</span>
                      <span className="text-xs text-ink-400 mt-1">Tambah foto</span>
                    </>
                  )}
                  <input type="file" accept="image/*" className="hidden"
                    onChange={async (e) => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      setHeroUploading(true);
                      try {
                        const url = await uploadToSupabase(f, "gallery");
                        setGalleryImages(prev => [...prev, url]);
                      } finally { setHeroUploading(false); }
                    }}
                    disabled={heroUploading} />
                </label>
              </div>
            </div>
        </div>
      </div>

      {/* Marquee */}
      <div className="card space-y-4">
        <h2 className="text-lg font-semibold text-ink-50">Running Text (Marquee)</h2>
        <p className="text-xs text-ink-400">Teks yang berjalan di bawah navbar. Tambah, edit, atau hapus item.</p>
        <div className="space-y-2">
          {marqueeItems.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="text"
                value={item}
                onChange={(e) => setMarqueeItems(prev => prev.map((x, i) => i === idx ? e.target.value : x))}
                className="input-field flex-1"
              />
              <button type="button" onClick={() => setMarqueeItems(prev => prev.filter((_, i) => i !== idx))}
                className="text-red-400 hover:text-red-300 text-lg px-2">×</button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Tambah item baru..."
            value={newMarqueeItem}
            onChange={(e) => setNewMarqueeItem(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && newMarqueeItem.trim()) { setMarqueeItems(prev => [...prev, newMarqueeItem.trim()]); setNewMarqueeItem(""); }}}
            className="input-field flex-1"
          />
          <button type="button" onClick={() => { if (newMarqueeItem.trim()) { setMarqueeItems(prev => [...prev, newMarqueeItem.trim()]); setNewMarqueeItem(""); }}}
            className="btn-secondary px-4">+ Tambah</button>
        </div>
      </div>

      {/* Bank Accounts */}
      <div className="card space-y-4">
        <h2 className="text-lg font-semibold text-ink-50">Rekening Bank</h2>
        <div className="space-y-4">
          {banks.map((b, idx) => (
            <div key={b.code} className="rounded-2xl border border-ink-800 bg-ink-950/20 p-4">
              <div className="flex items-center justify-between gap-4">
                <p className="font-semibold text-ink-50">{b.bankName}</p>
                <label className="flex items-center gap-2 text-sm text-ink-200">
                  <input type="checkbox" checked={b.active} onChange={(e) => setBanks((prev) => prev.map((x, i) => i === idx ? { ...x, active: e.target.checked } : x))} />
                  Aktif
                </label>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="label">Nama Bank</label>
                  <input className="input-field" value={b.bankName} onChange={(e) => setBanks((prev) => prev.map((x, i) => i === idx ? { ...x, bankName: e.target.value } : x))} />
                </div>
                <div>
                  <label className="label">No Rekening</label>
                  <input className="input-field" value={b.accountNumber} onChange={(e) => setBanks((prev) => prev.map((x, i) => i === idx ? { ...x, accountNumber: e.target.value } : x))} />
                </div>
                <div>
                  <label className="label">Atas Nama</label>
                  <input className="input-field" value={b.accountName} onChange={(e) => setBanks((prev) => prev.map((x, i) => i === idx ? { ...x, accountName: e.target.value } : x))} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {message && <p className="text-sm text-ink-200">{message}</p>}
      <button type="submit" className="btn-primary" disabled={saving}>{saving ? "Menyimpan..." : "Simpan Pengaturan"}</button>
    </form>
  );
}
