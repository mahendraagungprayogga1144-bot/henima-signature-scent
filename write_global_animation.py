# Update globals.css dengan premium animations
css_addition = """
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
}
[data-reveal="up"] { transform: translateY(48px); }
[data-reveal="left"] { transform: translateX(-48px); }
[data-reveal="right"] { transform: translateX(48px); }
[data-reveal="scale"] { transform: scale(0.94); }
[data-reveal="fade"] { opacity: 0; }

[data-reveal].is-visible {
  animation-duration: 1.2s;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  animation-fill-mode: both;
  opacity: 1;
  transform: none;
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

content = open("src/app/globals.css").read()
content += css_addition
open("src/app/globals.css", "w").write(content)
print("CSS Done!")

# Buat global ScrollObserver component
with open("src/components/ScrollObserver.tsx", "w") as f:
    f.write('''"use client";
import { useEffect } from "react";

export default function ScrollObserver() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -80px 0px" }
    );

    const elements = document.querySelectorAll("[data-reveal]");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return null;
}
''')
print("ScrollObserver Done!")
