import { getPublicCatalog } from "@/lib/db";
import ShopClient from "@/components/ShopClient";
import localFont from "next/font/local";

export const dynamic = "force-dynamic";

/** Catalog-only Futura (Kenzo FuturaBT-Medium reference). Does not affect other pages. */
const futuraCatalog = localFont({
  src: [
    { path: "../../fonts/FuturaBT-Medium.ttf", weight: "400", style: "normal" },
    { path: "../../fonts/FuturaBT-Medium.ttf", weight: "500", style: "normal" },
    { path: "../../fonts/Futura-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-futura-catalog",
  display: "swap",
  fallback: ["Futura", "Futura BT", "Century Gothic", "sans-serif"],
});

export default async function ShopPage() {
  const { products: allProducts, settings } = await getPublicCatalog();
  const company = settings.company;
  const products = allProducts.filter((p) => p.active);
  const waNumber = company.whatsappNumber || "6285190311230";
  return (
    <div className={futuraCatalog.variable} style={{ fontFamily: "var(--font-futura-catalog), Futura, sans-serif" }}>
      <ShopClient products={products as any} waNumber={waNumber} />
    </div>
  );
}
