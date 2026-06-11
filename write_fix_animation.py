# Fix ScrollObserver - pakai MutationObserver biar detect elemen baru
with open("src/components/ScrollObserver.tsx", "w") as f:
    f.write('''"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const initObserver = () => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.05, rootMargin: "0px 0px -60px 0px" }
      );

      const elements = document.querySelectorAll("[data-reveal]");
      elements.forEach((el) => {
        el.classList.remove("is-visible");
        observer.observe(el);
      });

      return observer;
    };

    const observer = initObserver();

    // Re-init setelah page transition
    const timeout = setTimeout(() => {
      observer.disconnect();
      initObserver();
    }, 100);

    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
''')
print("ScrollObserver Done!")

# Fix globals.css - hapus duplikasi, rewrite clean
content = open("src/app/globals.css").read()

# Hapus semua data-reveal CSS yang ada (duplikat)
import re
# Hapus dari /* ── PREMIUM SCROLL ANIMATIONS ── */ pertama sampai akhir
idx = content.find("/* ── PREMIUM SCROLL ANIMATIONS ── */")
if idx != -1:
    content = content[:idx]

# Tambah CSS yang benar
content += """
/* ── PREMIUM SCROLL ANIMATIONS ── */
@keyframes revealUp {
  from { opacity: 0; transform: translateY(48px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes revealLeft {
  from { opacity: 0; transform: translateX(-48px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes revealRight {
  from { opacity: 0; transform: translateX(48px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes revealScale {
  from { opacity: 0; transform: scale(0.94); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes revealFade {
  from { opacity: 0; }
  to { opacity: 1; }
}

[data-reveal] {
  opacity: 0;
  transform: translateY(48px);
}
[data-reveal="left"] { transform: translateX(-48px); }
[data-reveal="right"] { transform: translateX(48px); }
[data-reveal="scale"] { transform: scale(0.94); }
[data-reveal="fade"] { opacity: 0; transform: none; }

[data-reveal].is-visible {
  opacity: 1 !important;
  transform: none !important;
  animation-duration: 1.2s;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  animation-fill-mode: both;
}
[data-reveal="up"].is-visible { animation-name: revealUp; }
[data-reveal="left"].is-visible { animation-name: revealLeft; }
[data-reveal="right"].is-visible { animation-name: revealRight; }
[data-reveal="scale"].is-visible { animation-name: revealScale; }
[data-reveal="fade"].is-visible { animation-name: revealFade; }

[data-delay="100"].is-visible { animation-delay: 0.1s; }
[data-delay="200"].is-visible { animation-delay: 0.2s; }
[data-delay="300"].is-visible { animation-delay: 0.3s; }
[data-delay="400"].is-visible { animation-delay: 0.4s; }
[data-delay="500"].is-visible { animation-delay: 0.5s; }
"""

open("src/app/globals.css", "w").write(content)
print("CSS Done!")
