content = open("src/components/admin/SettingsForm.tsx").read()

# Tambah state marqueeItems
content = content.replace(
    "  const [galleryImages, setGalleryImages] = useState<string[]>((settings.company as any).galleryImages || []);",
    "  const [galleryImages, setGalleryImages] = useState<string[]>((settings.company as any).galleryImages || []);\n  const [marqueeItems, setMarqueeItems] = useState<string[]>((settings.company as any).marqueeItems || [\"Afternoon\",\"The Distance\",\"Extrait de Parfum\",\"Made in Indonesia\",\"Crafted to be Remembered\"]);\n  const [newMarqueeItem, setNewMarqueeItem] = useState(\"\");"
)

# Tambah fd.set marqueeItems
content = content.replace(
    'fd.set("galleryImages", JSON.stringify(galleryImages));',
    'fd.set("galleryImages", JSON.stringify(galleryImages));\n      fd.set("marqueeItems", JSON.stringify(marqueeItems));'
)

# Tambah UI marquee sebelum Bank Accounts
content = content.replace(
    '      {/* Bank Accounts */}',
    '''      {/* Marquee */}
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

      {/* Bank Accounts */}'''
)

open("src/components/admin/SettingsForm.tsx", "w").write(content)
print("Done!")
