# Update SettingsForm.tsx - tambah galleryImages state dan fd.set
content = open("src/components/admin/SettingsForm.tsx").read()

# Tambah state galleryImages setelah heroImages state
content = content.replace(
    "const [heroImages, setHeroImages] = useState<string[]>((settings.company as any).heroImages || (settings.company.heroImage ? [settings.company.heroImage] : []));",
    "const [heroImages, setHeroImages] = useState<string[]>((settings.company as any).heroImages || (settings.company.heroImage ? [settings.company.heroImage] : []));\n  const [galleryImages, setGalleryImages] = useState<string[]>((settings.company as any).galleryImages || []);"
)

# Tambah fd.set galleryImages setelah heroImages
content = content.replace(
    'fd.set("heroImages", JSON.stringify(heroImages.length > 0 ? heroImages : heroUrl ? [heroUrl] : []));',
    'fd.set("heroImages", JSON.stringify(heroImages.length > 0 ? heroImages : heroUrl ? [heroUrl] : []));\n      fd.set("galleryImages", JSON.stringify(galleryImages));'
)

open("src/components/admin/SettingsForm.tsx", "w").write(content)
print("SettingsForm Done!")

# Update settings API route - tambah galleryImages
content2 = open("src/app/api/admin/settings/route.ts").read()

content2 = content2.replace(
    "if (heroImages.length > 0) (db.settings.company as any).heroImages = heroImages;\n    else if (heroPath) (db.settings.company as any).heroImages = [heroPath];",
    "if (heroImages.length > 0) (db.settings.company as any).heroImages = heroImages;\n    else if (heroPath) (db.settings.company as any).heroImages = [heroPath];\n    const galleryImagesRaw = String(form.get(\"galleryImages\") || \"\").trim();\n    let galleryImages: string[] = [];\n    if (galleryImagesRaw) { try { galleryImages = JSON.parse(galleryImagesRaw); } catch {} }\n    (db.settings.company as any).galleryImages = galleryImages;"
)

open("src/app/api/admin/settings/route.ts", "w").write(content2)
print("API Done!")
