# 1. Update homepage - ambil marquee dari database
content = open("src/app/page.tsx").read()
content = content.replace(
    '          {["Free Shipping above Rp 150.000","Afternoon","The Distance","Extrait de Parfum","Made in Indonesia","Crafted to be Remembered","Afternoon","The Distance","Extrait de Parfum","Made in Indonesia","Crafted to be Remembered"].map((item, i) => (',
    '          {([...(company as any).marqueeItems || ["Afternoon","The Distance","Extrait de Parfum","Made in Indonesia","Crafted to be Remembered"], ...(company as any).marqueeItems || ["Afternoon","The Distance","Extrait de Parfum","Made in Indonesia","Crafted to be Remembered"]]).map((item: string, i: number) => ('
)
open("src/app/page.tsx", "w").write(content)
print("Homepage Done!")

# 2. Update db.ts settings mapper
content2 = open("src/lib/db.ts").read()
content2 = content2.replace(
    "      catalog: settingsData.catalog as any,\n        gallery: settingsData.gallery as any,",
    "      catalog: settingsData.catalog as any,\n        gallery: settingsData.gallery as any,\n        marqueeItems: settingsData.marquee_items as any,"
)
open("src/lib/db.ts", "w").write(content2)
print("DB Done!")

# 3. Update settings API
content3 = open("src/app/api/admin/settings/route.ts").read()
content3 = content3.replace(
    "    const galleryImagesRaw = String(form.get(\"galleryImages\") || \"\").trim();",
    """    const marqueeRaw = String(form.get("marqueeItems") || "").trim();
    let marqueeItems: string[] = [];
    if (marqueeRaw) { try { marqueeItems = JSON.parse(marqueeRaw); } catch {} }
    if (marqueeItems.length > 0) (db.settings as any).marqueeItems = marqueeItems;
    await supabase.from("settings").update({ marquee_items: marqueeItems.length > 0 ? marqueeItems : undefined }).eq("id", 1);
    const galleryImagesRaw = String(form.get("galleryImages") || "").trim();"""
)
open("src/app/api/admin/settings/route.ts", "w").write(content3)
print("API Done!")
print("All Done!")
