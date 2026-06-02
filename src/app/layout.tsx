import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Henima Signature Scent",
  description:
    "Luxury fragrance reseller portal — katalog, pesanan, pembayaran, dan pelacakan untuk Henima Signature Scent.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="min-h-screen font-sans antialiased selection:bg-gold-400/30 selection:text-ink-50">
        <Navbar />
        <main className="container-page py-10">{children}</main>
      </body>
    </html>
  );
}
