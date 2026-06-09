content = open("src/components/admin/SettingsForm.tsx").read()

gallery_ui = '''            <div className="rounded-2xl border border-ink-800 bg-ink-950/20 p-4">
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
            </div>'''

content = content.replace(
    '          </div>\n        </div>\n      </div>\n\n',
    '          </div>\n' + gallery_ui + '\n        </div>\n      </div>\n\n'
)

open("src/components/admin/SettingsForm.tsx", "w").write(content)
print("Done!")
