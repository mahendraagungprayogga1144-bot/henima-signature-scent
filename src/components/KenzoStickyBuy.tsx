"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

/**
 * Kenzo PDP: pin buy panel while left image stack scrolls (4 images).
 * Fixed positioning — survives html/body overflow that kills CSS sticky.
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

    const update = () => {
      const root = rootRef.current;
      const panel = panelRef.current;
      if (!root || !panel) return;

      if (mq.matches) {
        setSpacerH(0);
        setPanelStyle({ position: "relative", width: "100%", maxWidth: "none" });
        return;
      }

      const col = root.parentElement;
      if (!col) return;

      const panelH = panel.offsetHeight;
      const colRect = col.getBoundingClientRect();
      const rootTop = root.getBoundingClientRect().top;
      const cs = getComputedStyle(col);
      const padL = parseFloat(cs.paddingLeft) || 0;
      const padR = parseFloat(cs.paddingRight) || 0;
      const width = Math.max(180, Math.min(420, colRect.width - padL - padR));

      /* Before pin zone */
      if (rootTop > top) {
        setSpacerH(0);
        setPanelStyle({ position: "relative", width: "100%", maxWidth: 420 });
        return;
      }

      /* Release at end of left image stack */
      if (colRect.bottom - panelH <= top) {
        setSpacerH(panelH);
        setPanelStyle({
          position: "absolute",
          left: 0,
          bottom: 0,
          width: "100%",
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

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    mq.addEventListener("change", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      mq.removeEventListener("change", update);
    };
  }, [top]);

  return (
    <div ref={rootRef} style={{ position: "relative", height: "100%", minHeight: "100%" }}>
      {spacerH > 0 ? <div aria-hidden style={{ height: spacerH, pointerEvents: "none" }} /> : null}
      <div ref={panelRef} style={panelStyle}>
        {children}
      </div>
    </div>
  );
}
