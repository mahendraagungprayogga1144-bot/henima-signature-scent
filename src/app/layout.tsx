import SplashScreen from "@/components/SplashScreen";
import ChatWidget from "@/components/ChatWidget";
import ScrollObserver from "@/components/ScrollObserver";
import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import localFont from "next/font/local";
import NavbarWrapper from "@/components/NavbarWrapper";
import FooterSubscribe from "@/components/FooterSubscribe";
import { getSettings } from "@/lib/db";
import { assertEnv } from "@/lib/env";
import { getCurrentUserSafe } from "@/lib/session";
import "./globals.css";

export const dynamic = "force-dynamic";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-jakarta",
});

/** Kenzo header nav — FuturaBT-Medium for NEW / SHOP / STORY / UNIVERSE */
const futuraNav = localFont({
  src: "../fonts/FuturaBT-Medium.ttf",
  variable: "--font-futura-nav",
  weight: "400",
  display: "swap",
  fallback: ["Futura", "Futura BT", "Century Gothic", "sans-serif"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Henima Signature Scent",
  description: "Henima Signature Scent — wewangian luxury buatan Indonesia. Lahir dari kisah cinta nyata, setiap tetes menyimpan cerita. Extrait de Parfum.",
  keywords: ["parfum lokal indonesia", "henima signature scent", "parfum luxury indonesia", "extrait de parfum"],
  openGraph: { title: "Henima Signature Scent", description: "Wewangian luxury buatan Indonesia, lahir dari kisah cinta nyata.", url: "https://henimaofficial.com" },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  assertEnv();
  const settings = await getSettings();
  const socialLinks = (settings.company as { socialLinks?: Record<string, string> }).socialLinks || {};
  const user = await getCurrentUserSafe();

  return (
    <html lang="id">
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-SGW9TFDQTX"></script>
        <script dangerouslySetInnerHTML={{__html: `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag("js", new Date()); gtag("config", "G-SGW9TFDQTX");`}}/>
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Henima Signature Scent',
          url: 'https://henimaofficial.com',
          logo: 'https://henimaofficial.com/favicon.png',
          description: 'Wewangian luxury buatan Indonesia, lahir dari kisah cinta nyata.',
          sameAs: ['https://www.instagram.com/henima.id'],
          contactPoint: { '@type': 'ContactPoint', telephone: '+6285190311230', contactType: 'customer service' }
        })}}/>
      </head>
      <body className={`min-h-screen font-sans antialiased ${jakarta.variable} ${futuraNav.variable}`} style={{background:"#FFFFFF", color:"#111111", overflowX:"hidden", fontFamily:"var(--font-jakarta), system-ui, sans-serif"}}>
        <SplashScreen />
        <ScrollObserver />
        <NavbarWrapper />
        <main style={{width:"100%", overflow:"hidden"}}>{children}</main>
        <footer style={{background:"#212121", padding:"64px 0 80px", marginTop:0}}>
          <div style={{maxWidth:1120, margin:"0 auto", padding:"0 24px", boxSizing:"border-box"}}>
            <div
              className="footer-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr",
                gap: "40px 32px",
                marginBottom: "48px",
                alignItems: "start",
              }}
            >
              <div>
                <a href="/" style={{display:"inline-block", marginBottom:"28px", lineHeight:0}} aria-label="Henima">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/henima-logo-white.png" alt="Henima" style={{width:120, height:"auto", display:"block"}} />
                </a>
                {!user && <FooterSubscribe />}
                <p style={{margin:"28px 0 0", fontSize:"11px", color:"rgba(255,255,255,0.35)"}}>
                  © {new Date().getFullYear()} HENIMA SIGNATURE SCENT
                </p>
              </div>
              <div>
                <h4 style={{fontSize:"15px", color:"#FFFFFF", fontWeight:600, margin:"0 0 20px"}}>The Brand</h4>
                <ul style={{listStyle:"none", padding:0, margin:0, display:"flex", flexDirection:"column", gap:"12px"}}>
                  {[["Henima Universe","/our-story"],["Women's Fragrance","/shop"],["Men's Fragrance","/shop"],["Contact","/faq"],["Journal","/blog"]].map(([label,href]) => (
                    <li key={label}><a href={href} style={{fontSize:"13px", color:"rgba(255,255,255,0.7)", textDecoration:"none", fontWeight:300}}>{label}</a></li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 style={{fontSize:"15px", color:"#FFFFFF", fontWeight:600, margin:"0 0 20px"}}>Our lines</h4>
                <ul style={{listStyle:"none", padding:0, margin:0, display:"flex", flexDirection:"column", gap:"12px"}}>
                  {[["Afternoon","/shop"],["The Distance","/shop"],["Signature","/shop"],["Intimate","/shop"],["Gift Sets","/shop"]].map(([label,href]) => (
                    <li key={label}><a href={href} style={{fontSize:"12px", color:"rgba(255,255,255,0.7)", textDecoration:"none", fontWeight:300, textTransform:"uppercase", letterSpacing:"0.05em"}}>{label}</a></li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 style={{fontSize:"15px", color:"#FFFFFF", fontWeight:600, margin:"0 0 20px"}}>Social</h4>
                <ul style={{listStyle:"none", padding:0, margin:0, display:"flex", flexDirection:"column", gap:"14px"}}>
                  {[
                    { label: "Instagram", href: socialLinks.instagram || "https://www.instagram.com/henima.id", icon: "ig" },
                    { label: "Facebook", href: socialLinks.facebook || "https://www.facebook.com", icon: "fb" },
                    { label: "LinkedIn", href: socialLinks.linkedin || "https://www.linkedin.com", icon: "in" },
                    { label: "Youtube", href: socialLinks.youtube || "https://www.youtube.com", icon: "yt" },
                  ].map((s) => (
                    <li key={s.label}>
                      <a href={s.href} target="_blank" rel="noopener noreferrer" style={{fontSize:"13px", color:"rgba(255,255,255,0.75)", textDecoration:"none", display:"inline-flex", alignItems:"center", gap:10, fontWeight:300}}>
                        <span aria-hidden style={{width:16, height:16, display:"inline-flex", alignItems:"center", justifyContent:"center", flexShrink:0}}>
                          {s.icon === "ig" && (
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
                          )}
                          {s.icon === "fb" && (
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H9v3h2v7h3v-7h2.5l.5-3H14V9z"/></svg>
                          )}
                          {s.icon === "in" && (
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M6.5 9H3.7v11.3h2.8V9zM5.1 3.6A1.6 1.6 0 1 0 5.1 6.8 1.6 1.6 0 0 0 5.1 3.6zM20.3 13.1c0-3.2-1.7-4.7-4-4.7-1.8 0-2.6 1-3.1 1.7V9H10.5c0 .8 0 11.3 0 11.3h2.8v-6.3c0-.3 0-.7.1-1 .3-.7.9-1.5 2-1.5 1.4 0 2 1.1 2 2.6v6.2h2.8v-6.4z"/></svg>
                          )}
                          {s.icon === "yt" && (
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M23 12.2s0-3.2-.4-4.7c-.2-.9-.9-1.6-1.8-1.8C19.3 5.3 12 5.3 12 5.3s-7.3 0-8.8.4c-.9.2-1.6.9-1.8 1.8C1 9 1 12.2 1 12.2s0 3.2.4 4.7c.2.9.9 1.6 1.8 1.8 1.5.4 8.8.4 8.8.4s7.3 0 8.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.5.4-4.7.4-4.7zM9.8 15.5v-6.6l6 3.3-6 3.3z"/></svg>
                          )}
                        </span>
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 style={{fontSize:"15px", color:"#FFFFFF", fontWeight:600, margin:"0 0 20px"}}>Legal</h4>
                <ul style={{listStyle:"none", padding:0, margin:0, display:"flex", flexDirection:"column", gap:"12px"}}>
                  <li><a href="/syarat-ketentuan" style={{fontSize:"13px", color:"rgba(255,255,255,0.7)", textDecoration:"none"}}>Legal Notice</a></li>
                  <li><a href="/kebijakan-pengembalian" style={{fontSize:"13px", color:"rgba(255,255,255,0.7)", textDecoration:"none"}}>Personal Data</a></li>
                  <li><a href="/syarat-ketentuan" style={{fontSize:"13px", color:"rgba(255,255,255,0.7)", textDecoration:"none"}}>Cookie Policy</a></li>
                </ul>
              </div>
            </div>
          </div>
          <style>{`
            @media (max-width: 1000px) {
              .footer-grid { grid-template-columns: 1fr 1fr !important; }
            }
            @media (max-width: 560px) {
              .footer-grid { grid-template-columns: 1fr !important; }
            }
          `}</style>
        </footer>
        <ChatWidget />
      </body>
    </html>
  );
}
