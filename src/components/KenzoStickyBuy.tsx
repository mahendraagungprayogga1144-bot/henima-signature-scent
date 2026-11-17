"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

/**
 * Kenzo PDP: pin buy panel while left image stack (4) scrolls past.
 * Uses position:fixed so it works even when ancestors have overflow that kill CSS sticky.
 */
export default function KenzoStickyBuy({
  children,
  top = 140,
}: {
  children: ReactNode;
  top?: number;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [panelStyle, setPanelStyle] = useState<CSSProperties>({
    position: "relative",
    width: "100%",
    maxWidth: 420,
  });
  const [spacerH, setSpacerH] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768.98px)");
    let raf = 0;

    const update = () => {
      const root = rootRef.current;
      const panel = panelRef.current;
      if (!root || !panel) return;

      if (mq.matches) {
        setSpacerH(0);
        setPanelStyle({ position: "relative", width: "100%", maxWidth: "none" });
        return;
      }

      /* Track left image column — release when its bottom clears the panel */
      const left =
        root.closest(".kz-product-container")?.querySelector(".kz-primary-col") ??
        root.parentElement;
      const col = root.parentElement;
      if (!left || !col) return;

      const panelH = panel.offsetHeight || 1;
      const leftRect = left.getBoundingClientRect();
      const colRect = col.getBoundingClientRect();
      const cs = getComputedStyle(col);
      const padL = parseFloat(cs.paddingLeft) || 0;
      const padR = parseFloat(cs.paddingRight) || 0;
      const width = Math.max(180, Math.min(420, colRect.width - padL - padR));

      /* Before pin: left column still below pin line */
      if (leftRect.top > top) {
        setSpacerH(0);
        setPanelStyle({ position: "relative", width: "100%", maxWidth: 420 });
        return;
      }

      /* After all 4 images: dock to bottom of sidebar column */
      if (leftRect.bottom - panelH <= top) {
        setSpacerH(panelH);
        setPanelStyle({
          position: "absolute",
          left: padL,
          bottom: 0,
          width,
          maxWidth: 420,
        });
        return;
      }

      /* Fixed while scrolling through images 1→4 */
      setSpacerH(panelH);
      setPanelStyle({
        position: "fixed",
        top,
        left: colRect.left + padL,
        width,
        maxWidth: 420,
        zIndex: 30,
      });
    };

    const onScrollOrResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScrollOrResize, { passive: true, capture: true });
    window.addEventListener("resize", onScrollOrResize);
    document.addEventListener("scroll", onScrollOrResize, { passive: true, capture: true });
    mq.addEventListener("change", onScrollOrResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
      document.removeEventListener("scroll", onScrollOrResize, true);
      mq.removeEventListener("change", onScrollOrResize);
    };
  }, [top]);

  return (
    <div
      ref={rootRef}
      data-kz-sticky-buy
      style={{ position: "relative", height: "100%", minHeight: "100%" }}
    >
      {spacerH > 0 ? <div aria-hidden style={{ height: spacerH, pointerEvents: "none" }} /> : null}
      <div ref={panelRef} style={panelStyle}>
        {children}
      </div>
    </div>
  );
}
