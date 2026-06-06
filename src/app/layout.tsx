import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-playfair",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Henima Signature Scent",
  description:
    "Luxury fragrance reseller portal — katalog, pesanan, pembayaran, dan pelacakan untuk Henima Signature Scent.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
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
        <footer className="border-t border-ink-200 mt-10 py-6 bg-white">
          <div className="container-page text-center text-sm text-ink-500">
            © {new Date().getFullYear()} Henima Signature Scent. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
