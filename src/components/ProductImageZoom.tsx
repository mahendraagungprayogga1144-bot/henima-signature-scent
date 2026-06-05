"use client";
import { useState } from "react";
import Image from "next/image";

export default function ProductImageZoom({ src, alt }: { src: string; alt: string }) {
  const [zoom, setZoom] = useState(false);

  return (
    <>
      <div
        className="relative h-full w-full cursor-zoom-in"
        onClick={() => setZoom(true)}
      >
        <Image src={src} alt={alt} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
      </div>
      {zoom && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
          onClick={() => setZoom(false)}
        >
          <div className="relative h-[90vw] w-[90vw] max-h-[600px] max-w-[600px]">
            <Image src={src} alt={alt} fill className="object-contain" />
          </div>
          <p className="absolute bottom-8 text-sm text-ink-400">Tap untuk menutup</p>
        </div>
      )}
    </>
  );
}
