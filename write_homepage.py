content = open("src/app/page.tsx").read()

# Hapus section PRODUCTS HMNS STYLE sampai akhir closing div
old = content[content.index("      {/* ── PRODUCTS HMNS STYLE ── */}"):]
# Ambil hanya sampai sebelum closing tag terakhir
new_section = '''      {/* ── PHOTO CAROUSEL ── */}
      <PhotoCarousel images={(company as any).galleryImages || []} />

    </div>
  );
}'''

new_content = content[:content.index("      {/* ── PRODUCTS HMNS STYLE ── */}")] + new_section

open("src/app/page.tsx", "w").write(new_content)
print("Done!")
