import SplashScreen from "@/components/SplashScreen";
import ScrollObserver from "@/components/ScrollObserver";
import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import NavbarWrapper from "@/components/NavbarWrapper";
import AnnouncementBar from "@/components/AnnouncementBar";
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
  description: "Luxury fragrance crafted in Indonesia. Extrait de Parfum.",
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
      <SplashScreen />
      <ScrollObserver />
      <body className={`min-h-screen font-sans antialiased ${jost.variable} ${cormorant.variable}`} style={{background:"#FAF8F4", color:"#1C1917", overflowX:"hidden"}}>
        <NavbarWrapper />
        <AnnouncementBar />
        <main style={{width:"100%", overflow:"hidden"}}><div style={{paddingTop:"60px"}}>{children}</div></main>
        <footer style={{background:"#1C1917", padding:"72px 8vw 40px"}}>
          <div style={{display:"grid", gridTemplateColumns:"1.5fr 1fr 1fr 1fr", gap:"48px", marginBottom:"64px", paddingBottom:"48px", borderBottom:"1px solid rgba(200,184,154,0.12)"}}>
            <div>
              <a href="/" style={{fontFamily:"var(--font-cormorant)", fontSize:"20px", fontWeight:400, letterSpacing:"6px", textTransform:"uppercase", color:"#F0EBE3", textDecoration:"none", display:"block", marginBottom:"16px"}}>Henima</a>
              <p style={{fontSize:"12px", color:"rgba(200,184,154,0.45)", fontWeight:300, lineHeight:1.8, maxWidth:"200px"}}>Every fragrance carries a memory. Crafted with care in Indonesia.</p>
              <div style={{display:"flex", gap:"20px", marginTop:"24px"}}>
                {["IG","TT","WA"].map((s) => (
                  <a key={s} href="#" style={{fontSize:"10px", letterSpacing:"1.5px", textTransform:"uppercase", color:"rgba(200,184,154,0.4)", textDecoration:"none"}}>{s}</a>
                ))}
              </div>
            </div>
            <div>
              <h4 style={{fontSize:"10px", letterSpacing:"2.5px", textTransform:"uppercase", color:"rgba(200,184,154,0.4)", fontWeight:400, marginBottom:"20px"}}>Shop</h4>
              <ul style={{listStyle:"none", padding:0, margin:0, display:"flex", flexDirection:"column", gap:"10px"}}>
                {[["All Products","/shop"],["Afternoon","/shop"],["The Distance","/shop"],["Discovery Set","/shop"]].map(([label,href]) => (
                  <li key={label}><a href={href} style={{fontSize:"13px", color:"rgba(240,235,227,0.6)", textDecoration:"none", fontWeight:300}}>{label}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 style={{fontSize:"10px", letterSpacing:"2.5px", textTransform:"uppercase", color:"rgba(200,184,154,0.4)", fontWeight:400, marginBottom:"20px"}}>Info</h4>
              <ul style={{listStyle:"none", padding:0, margin:0, display:"flex", flexDirection:"column", gap:"10px"}}>
                {[["Our Story","/our-story"],["Journal","/blog"],["Gallery","/galeri"],["FAQ","/"]].map(([label,href]) => (
                  <li key={label}><a href={href} style={{fontSize:"13px", color:"rgba(240,235,227,0.6)", textDecoration:"none", fontWeight:300}}>{label}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 style={{fontSize:"10px", letterSpacing:"2.5px", textTransform:"uppercase", color:"rgba(200,184,154,0.4)", fontWeight:400, marginBottom:"20px"}}>Partner</h4>
              <ul style={{listStyle:"none", padding:0, margin:0, display:"flex", flexDirection:"column", gap:"10px"}}>
                {[["Partner Program","/partner"],["Katalog","/katalog-digital"]].map(([label,href]) => (
                  <li key={label}><a href={href} style={{fontSize:"13px", color:"rgba(240,235,227,0.6)", textDecoration:"none", fontWeight:300}}>{label}</a></li>
                ))}
              </ul>
            </div>
          </div>
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", fontSize:"11px", color:"rgba(200,184,154,0.25)", fontWeight:300, letterSpacing:"0.5px", flexWrap:"wrap", gap:"12px"}}>
            <span>© {new Date().getFullYear()} Henima Signature Scent. All rights reserved.</span>
            <span>Privacy Policy · Terms of Service</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
