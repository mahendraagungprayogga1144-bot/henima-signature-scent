import SplashScreen from "@/components/SplashScreen";
import ScrollObserver from "@/components/ScrollObserver";
import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import NavbarWrapper from "@/components/NavbarWrapper";
import { getDatabase } from "@/lib/db";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-jost",
});

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
  const db = await getDatabase();
  const socialLinks = (db.settings.company as any).socialLinks || {};

  return (
    <html lang="id">
      <SplashScreen />
      <ScrollObserver />
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
      <body className={`min-h-screen font-sans antialiased ${jost.variable} ${cormorant.variable}`} style={{background:"#FAF8F4", color:"#1C1917", overflowX:"hidden"}}>
        <NavbarWrapper />
        <main style={{width:"100%", overflow:"hidden"}}>{children}</main>
        <footer style={{background:"#1C1917", padding:"80px 8vw 40px"}}>
          <div style={{display:"grid", gridTemplateColumns:"1.4fr 1fr 1fr 1fr", gap:"48px", marginBottom:"64px", paddingBottom:"48px", borderBottom:"1px solid rgba(200,184,154,0.12)"}} className="footer-grid">
            <div>
              <a href="/" style={{fontFamily:"var(--font-cormorant)", fontSize:"22px", fontWeight:400, letterSpacing:"6px", textTransform:"uppercase", color:"#F0EBE3", textDecoration:"none", display:"block", marginBottom:"18px"}}>Henima</a>
              <p style={{fontSize:"13px", color:"rgba(200,184,154,0.5)", fontWeight:300, lineHeight:1.8, maxWidth:"220px", marginBottom:"28px"}}>Every fragrance carries a memory. Crafted with care in Indonesia.</p>
              <div style={{display:"flex", gap:"14px", flexWrap:"wrap"}}>
                {socialLinks.instagram && (
                  <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" style={{width:"34px", height:"34px", borderRadius:"50%", border:"1px solid rgba(200,184,154,0.3)", display:"flex", alignItems:"center", justifyContent:"center", color:"rgba(200,184,154,0.7)", transition:"all 0.2s"}}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>
                  </a>
                )}
                {socialLinks.tiktok && (
                  <a href={socialLinks.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok" style={{width:"34px", height:"34px", borderRadius:"50%", border:"1px solid rgba(200,184,154,0.3)", display:"flex", alignItems:"center", justifyContent:"center", color:"rgba(200,184,154,0.7)", transition:"all 0.2s"}}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 0 1 15.54 3h-3.09v12.4a2.592 2.592 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48Z"/></svg>
                  </a>
                )}
                {socialLinks.whatsapp && (
                  <a href={socialLinks.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" style={{width:"34px", height:"34px", borderRadius:"50%", border:"1px solid rgba(200,184,154,0.3)", display:"flex", alignItems:"center", justifyContent:"center", color:"rgba(200,184,154,0.7)", transition:"all 0.2s"}}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21h.004c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm5.8 14.01c-.24.68-1.4 1.3-1.93 1.38-.49.08-1.12.11-1.81-.11-.42-.13-.95-.3-1.64-.59-2.88-1.24-4.76-4.14-4.91-4.33-.14-.19-1.17-1.56-1.17-2.98 0-1.42.74-2.11 1.01-2.4.26-.29.57-.36.76-.36.19 0 .38 0 .54.01.18.01.41-.07.64.49.24.58.81 2 .88 2.14.07.14.12.31.02.5-.1.19-.15.31-.29.48-.14.17-.3.37-.43.5-.14.14-.29.29-.12.58.17.29.76 1.25 1.63 2.03 1.12 1 2.06 1.31 2.36 1.46.29.14.46.12.63-.07.17-.19.74-.86.94-1.16.19-.29.39-.24.65-.14.27.1 1.69.8 1.98.94.29.14.49.22.56.34.07.12.07.71-.17 1.39z"/></svg>
                  </a>
                )}
                {socialLinks.youtube && (
                  <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" style={{width:"34px", height:"34px", borderRadius:"50%", border:"1px solid rgba(200,184,154,0.3)", display:"flex", alignItems:"center", justifyContent:"center", color:"rgba(200,184,154,0.7)", transition:"all 0.2s"}}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.51 3.5 12 3.5 12 3.5s-7.51 0-9.38.56A3.02 3.02 0 0 0 .5 6.2 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.8 3.02 3.02 0 0 0 2.12 2.14c1.87.56 9.38.56 9.38.56s7.51 0 9.38-.56a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.8zM9.6 15.6V8.4l6.4 3.6-6.4 3.6z"/></svg>
                  </a>
                )}
                {socialLinks.facebook && (
                  <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" style={{width:"34px", height:"34px", borderRadius:"50%", border:"1px solid rgba(200,184,154,0.3)", display:"flex", alignItems:"center", justifyContent:"center", color:"rgba(200,184,154,0.7)", transition:"all 0.2s"}}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/></svg>
                  </a>
                )}
              </div>
            </div>
            <div>
              <h4 style={{fontSize:"10px", letterSpacing:"2.5px", textTransform:"uppercase", color:"rgba(200,184,154,0.4)", fontWeight:500, marginBottom:"22px"}}>Shop</h4>
              <ul style={{listStyle:"none", padding:0, margin:0, display:"flex", flexDirection:"column", gap:"13px"}}>
                {[["All Products","/shop"],["Afternoon","/shop"],["The Distance","/shop"],["Discovery Set","/shop"]].map(([label,href]) => (
                  <li key={label}><a href={href} style={{fontSize:"13px", color:"rgba(240,235,227,0.55)", textDecoration:"none", fontWeight:300, transition:"color 0.2s"}}>{label}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 style={{fontSize:"10px", letterSpacing:"2.5px", textTransform:"uppercase", color:"rgba(200,184,154,0.4)", fontWeight:500, marginBottom:"22px"}}>Info</h4>
              <ul style={{listStyle:"none", padding:0, margin:0, display:"flex", flexDirection:"column", gap:"13px"}}>
                {[["Our Story","/our-story"],["Journal","/blog"],["Gallery","/galeri"],["FAQ","/faq"]].map(([label,href]) => (
                  <li key={label}><a href={href} style={{fontSize:"13px", color:"rgba(240,235,227,0.55)", textDecoration:"none", fontWeight:300, transition:"color 0.2s"}}>{label}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 style={{fontSize:"10px", letterSpacing:"2.5px", textTransform:"uppercase", color:"rgba(200,184,154,0.4)", fontWeight:500, marginBottom:"22px"}}>Legal</h4>
              <ul style={{listStyle:"none", padding:0, margin:0, display:"flex", flexDirection:"column", gap:"13px"}}>
                {[["Syarat & Ketentuan","/syarat-ketentuan"],["Kebijakan Pengembalian","/kebijakan-pengembalian"]].map(([label,href]) => (
                  <li key={label}><a href={href} style={{fontSize:"13px", color:"rgba(240,235,227,0.55)", textDecoration:"none", fontWeight:300, transition:"color 0.2s"}}>{label}</a></li>
                ))}
              </ul>
            </div>
          </div>
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", fontSize:"11px", color:"rgba(200,184,154,0.3)", fontWeight:300, letterSpacing:"0.5px", flexWrap:"wrap", gap:"12px"}}>
            <span>© {new Date().getFullYear()} Henima Signature Scent. All rights reserved.</span>
            <span style={{display:"flex", gap:"8px"}}><a href="/syarat-ketentuan" style={{color:"inherit", textDecoration:"none"}}>Privacy Policy</a><span>·</span><a href="/syarat-ketentuan" style={{color:"inherit", textDecoration:"none"}}>Terms of Service</a></span>
          </div>
        </footer>
      </body>
    </html>
  );
}
