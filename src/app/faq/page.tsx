import Reveal from "@/components/Reveal";
import Link from "next/link";
import { getSettings } from "@/lib/db";
import { getSiteContent } from "@/lib/site-content";

export const revalidate = 300;

const DEFAULT_FAQS = [
  {
    category: "Orders & Payment",
    items: [
      { q: "How do I place an order?", a: "You can order directly through our website by clicking Shop Now, or contact us via WhatsApp for a more personal experience." },
      { q: "What payment methods do you accept?", a: "We accept bank transfer (BCA, Mandiri, BRI) and QRIS. Payment details will be provided after your order is confirmed." },
      { q: "How long does order processing take?", a: "Orders are processed within 1-2 business days after payment is confirmed." },
    ]
  },
  {
    category: "Shipping & Delivery",
    items: [
      { q: "Do you ship nationwide?", a: "Yes, we ship to all regions across Indonesia using trusted couriers including JNE, J&T, and SiCepat." },
      { q: "Is there free shipping?", a: "Free shipping is available for orders above Rp 150.000. Terms and conditions apply." },
      { q: "How long does delivery take?", a: "Delivery typically takes 2-5 business days depending on your location. Remote areas may take longer." },
    ]
  },
  {
    category: "Products",
    items: [
      { q: "What is Extrait de Parfum?", a: "Extrait de Parfum is the highest concentration of fragrance, typically 20-40% perfume oil. It lasts longer and projects more powerfully than Eau de Parfum or Eau de Toilette." },
      { q: "How long does the fragrance last?", a: "Our Extrait de Parfum typically lasts 8-12 hours on skin, and even longer on fabric. Longevity varies based on skin type and application." },
      { q: "Are Henima fragrances safe for sensitive skin?", a: "Our fragrances are crafted with quality ingredients. We recommend doing a patch test on your wrist before full application if you have sensitive skin." },
    ]
  },
  {
    category: "Returns & Refunds",
    items: [
      { q: "Can I return a product?", a: "We accept returns within 3 days of receiving your order if the product is damaged or defective. Please contact us via WhatsApp with photo evidence." },
      { q: "What if my package arrives damaged?", a: "Please document the damage immediately and contact us within 24 hours of receiving the package. We will arrange a replacement as soon as possible." },
    ]
  },
  {
    category: "The Intimate — Membership",
    items: [
      { q: "What is The Intimate?", a: "The Intimate is Henima exclusive membership community. Every purchase brings you closer to higher tiers with more exclusive benefits." },
      { q: "How do I level up?", a: "Your tier is automatically updated based on your cumulative purchase amount. No registration needed — just keep shopping." },
      { q: "How do I claim my benefits?", a: "Once you reach a new tier, contact us via WhatsApp to claim your benefits. Our team will process your request within 1x24 hours." },
    ]
  },
];

export default async function FAQPage() {
  const settings = await getSettings();
  const site = getSiteContent(settings.company as any);
  const wa =
    (settings.company.whatsappNumber || "").replace(/\D/g, "") || "6285190311230";

  const cmsItems = site.faq.items.filter((x) => x.q.trim() && x.a.trim());
  const sections =
    cmsItems.length > 0
      ? [{ category: "FAQ", items: cmsItems }]
      : DEFAULT_FAQS;

  return (
    <div style={{ minHeight: "100vh", background: "#FFFFFF", fontFamily: "var(--font-jost, sans-serif)", color: "#111111" }}>

      <div style={{ padding: "80px 8vw 60px", borderBottom: "1px solid rgba(28,25,23,0.08)" }}>
        <p style={{ fontSize: "10px", letterSpacing: "4px", textTransform: "uppercase", color: "#A3A3A3", marginBottom: "16px", fontWeight: 300 }}>Help Center</p>
        <h1 style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "clamp(40px,7vw,80px)", fontWeight: 300, color: "#111111", lineHeight: 1, fontStyle: "italic", marginBottom: "20px" }}>
          Frequently Asked Questions
        </h1>
        <div style={{ width: "40px", height: "1px", background: "#A3A3A3" }} />
      </div>

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "64px 8vw 100px" }}>
        {sections.map((section, si) => (
          <Reveal key={si} direction="up" delay={si * 80}>
            <div style={{ marginBottom: "64px" }}>
              <p style={{ fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: "#737373", fontWeight: 600, marginBottom: "32px" }}>
                {section.category}
              </p>
              {section.items.map((faq, i) => (
                <details key={i} style={{ borderTop: "1px solid rgba(28,25,23,0.1)" }}>
                  <summary style={{ padding: "22px 0", fontSize: "15px", fontWeight: 500, color: "#111111", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", listStyle: "none" }}>
                    {faq.q}
                    <span style={{ fontSize: "20px", color: "#737373", fontWeight: 300, flexShrink: 0, marginLeft: "16px" }}>+</span>
                  </summary>
                  <p style={{ fontSize: "14px", color: "#737373", lineHeight: 1.9, paddingBottom: "24px", margin: 0 }}>
                    {faq.a}
                  </p>
                </details>
              ))}
              <div style={{ borderTop: "1px solid rgba(28,25,23,0.1)" }} />
            </div>
          </Reveal>
        ))}

        <Reveal direction="up" delay={200}>
          <div style={{ textAlign: "center", padding: "48px", background: "#fff", border: "1px solid rgba(28,25,23,0.08)", marginTop: "40px" }}>
            <p style={{ fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: "#737373", marginBottom: "16px" }}>Still have questions?</p>
            <h3 style={{ fontFamily: "var(--font-cormorant, serif)", fontSize: "28px", fontWeight: 300, fontStyle: "italic", color: "#111111", marginBottom: "24px" }}>
              {site.faq.waNote || "We are here to help."}
            </h3>
            <Link
              href={`https://wa.me/${wa}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "inline-block", background: "#111111", color: "#FFFFFF", padding: "14px 40px", fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", textDecoration: "none", fontWeight: 500 }}
            >
              Chat WhatsApp
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
