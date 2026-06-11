content = open("src/app/globals.css").read()

# Hapus semua premium scroll animations
idx = content.find("/* ── PREMIUM SCROLL ANIMATIONS ── */")
if idx != -1:
    content = content[:idx]

content += """
/* ── PREMIUM SCROLL ANIMATIONS ── */
@keyframes revealUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes revealFade {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes revealScale {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

/* Apply animation ke semua section saat load */
section, .reveal-section {
  animation: revealUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) both;
}

/* Stagger untuk children */
section:nth-child(1) { animation-delay: 0s; }
section:nth-child(2) { animation-delay: 0.15s; }
section:nth-child(3) { animation-delay: 0.3s; }
section:nth-child(4) { animation-delay: 0.45s; }
section:nth-child(5) { animation-delay: 0.6s; }

/* Hero section tidak perlu delay */
section:first-of-type { animation-delay: 0s; }
"""

open("src/app/globals.css", "w").write(content)
print("Done!")
