"use client";

import { useEffect } from "react";

interface Props {
  url: string;
  orderId: string;
}

export default function WhatsAppNotifyBanner({ url, orderId }: Props) {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.open(url, "_blank", "noopener,noreferrer");
    }, 500);
    return () => clearTimeout(timer);
  }, [url]);

  return (
    <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
      <p className="font-medium text-green-900">
        Status pesanan {orderId} diperbarui
      </p>
      <p className="mt-1 text-sm text-green-800">
        Tab WhatsApp akan terbuka untuk mengirim notifikasi ke reseller. Jika tidak
        terbuka, klik tombol di bawah.
      </p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary mt-3 inline-flex bg-green-600 hover:bg-green-700"
      >
        Kirim via WhatsApp
      </a>
    </div>
  );
}
