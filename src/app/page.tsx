import Link from "next/link";
import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";
import AnnouncementBar from "@/components/AnnouncementBar";
import dynamic from "next/dynamic";
const PhotoCarousel = dynamic(() => import("@/components/PhotoCarousel"), { ssr: false });
import HeroCarousel from "@/components/HeroCarousel";
import { getCurrentUserSafe } from "@/lib/session";
import { redirect } from "next/navigation";
import { getDatabase } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await getCurrentUserSafe();
  if (user?.role === "admin") redirect("/admin");
  if (user?.role === "reseller") redirect("/shop");

  const db = await getDatabase();
  const company = db.settings.company;
  const products = db.products.filter((p) => p.active);

  return (
    <div style={{background:"#FAF8F4", color:"#1C1917"}}>

      {/* ── HERO FULL SCREEN ── */}
      <section style={{position:"relative", width:"100%", minHeight:"calc(95vh)", overflow:"hidden", display:"flex", alignItems:"center"}}>
        <div style={{position:"absolute", inset:0, zIndex:0}}>
          <HeroCarousel
            images={(company as any).heroImages?.length ? (company as any).heroImages : products.length > 0 && products[0].photo ? [products[0].photo] : []} heroVideo={(company as any).heroVideo}
            productName={products.length > 0 ? products[0].name : undefined}
          />
        </div>
        <div style={{position:"absolute", inset:0, background:"linear-gradient(to right, rgba(10,8,6,0.78) 0%, rgba(10,8,6,0.35) 60%, rgba(10,8,6,0.1) 100%)", zIndex:1}} />
        <div style={{position:"relative", zIndex:2, padding:"80px 8vw", maxWidth:"680px"}}>
          <p style={{fontSize:"10px", letterSpacing:"3.5px", textTransform:"uppercase", color:"rgba(200,184,154,0.7)", marginBottom:"28px", fontWeight:300, fontFamily:"var(--font-jost)"}}>
            {company.name}
          </p>
          <h1 style={{fontFamily:"var(--font-cormorant)", fontSize:"clamp(56px,9vw,110px)", fontWeight:300, lineHeight:0.9, color:"#F5F0E8", marginBottom:"28px", letterSpacing:"-1px", fontStyle:"italic"}}>
            Worn.<br />Not<br /><em style={{color:"rgba(200,184,154,0.9)"}}>Forgotten.</em>
          </h1>
          <div style={{width:"48px", height:"1px", background:"rgba(200,184,154,0.4)", marginBottom:"28px"}} />
          <p style={{fontSize:"15px", color:"rgba(240,235,227,0.7)", lineHeight:1.9, maxWidth:"360px", marginBottom:"52px", fontWeight:300, fontFamily:"var(--font-jost)"}}>
            {company.tagline || "Setiap tetes adalah cerita. Setiap aroma adalah kenangan yang layak diingat."}
          </p>
          <div style={{display:"flex", gap:"12px", flexWrap:"wrap"}}>
            <Link href="/our-story" style={{display:"inline-block", background:"rgba(240,235,227,0.95)", color:"#1C1917", padding:"15px 44px", fontSize:"10px", letterSpacing:"3px", textTransform:"uppercase", textDecoration:"none", fontFamily:"var(--font-jost)", fontWeight:500}}>
              Explore Collection
            </Link>
            <Link href="/shop" style={{display:"inline-block", background:"transparent", color:"rgba(240,235,227,0.9)", padding:"14px 32px", fontSize:"10px", letterSpacing:"2px", textTransform:"uppercase", textDecoration:"none", fontFamily:"var(--font-jost)", border:"1px solid rgba(240,235,227,0.35)"}}>
              Shop Now
            </Link>
          </div>
          <div style={{display:"flex", gap:"32px", marginTop:"72px", fontSize:"9px", color:"rgba(200,184,154,0.4)", letterSpacing:"3px", textTransform:"uppercase", flexWrap:"wrap"}}>
            <span>Est. {(company as any).foundingYear || "2024"}</span>
            <span>·</span><span>Indonesia</span>
            <span>·</span><span>Extrait de Parfum</span>
          </div>
        </div>
      </section>

      <AnnouncementBar items={(company as any).marqueeItems || []} />

      {/* ── OUR STORY — HMNS dark style ── */}
      <ScrollReveal direction="up" delay={0}>
      <section style={{background:"#FAF8F4", padding:"100px 8vw", borderTop:"1px solid rgba(28,25,23,0.06)"}}>
        <div style={{maxWidth:"800px"}}>
          <p style={{fontSize:"10px", letterSpacing:"3px", textTransform:"uppercase", color:"#9A8F82", marginBottom:"32px", fontFamily:"var(--font-jost)"}}>Our Story</p>
          <p style={{fontFamily:"var(--font-jost)", fontSize:"clamp(16px,2vw,22px)", fontWeight:300, lineHeight:1.9, color:"#4A4440", marginBottom:"48px"}}>
            {company.brandStory || "Henima was born from a long-distance love story — two young souls who proved that fragrance is more than just a scent. It is identity, memory, and a celebration of love that transcends distance."}
          </p>
          <Link href="/our-story" style={{display:"inline-flex", alignItems:"center", gap:"12px", fontSize:"10px", letterSpacing:"2.5px", textTransform:"uppercase", color:"#1C1917", textDecoration:"none", borderBottom:"1px solid rgba(28,25,23,0.2)", paddingBottom:"4px", fontFamily:"var(--font-jost)"}}>
            Discover More →
          </Link>
        </div>
      </section>
      </ScrollReveal>

      {/* ── VISI MISI ── */}
      {(company.vision || company.mission) && (
      <ScrollReveal direction="up" delay={100}>
        <section style={{background:"#FAF8F4", padding:"80px 8vw", borderTop:"1px solid rgba(28,25,23,0.08)"}}>
          <div style={{maxWidth:"960px", margin:"0 auto"}}>
            <p style={{fontSize:"10px", letterSpacing:"3px", textTransform:"uppercase", color:"#9A8F82", marginBottom:"56px", fontFamily:"var(--font-jost)", fontWeight:400}}>Values</p>
            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"64px"}} className="visi-grid">
              {company.vision && (
                <div>
                  <p style={{fontSize:"10px", letterSpacing:"3px", textTransform:"uppercase", color:"#C8B89A", marginBottom:"24px", fontFamily:"var(--font-jost)", fontWeight:400}}>Vision</p>
                  <div style={{width:"32px", height:"1px", background:"rgba(200,184,154,0.6)", marginBottom:"24px"}} />
                  <p style={{fontSize:"15px", color:"#4A4440", lineHeight:1.85, fontWeight:300, fontFamily:"var(--font-jost)"}}>{company.vision}</p>
                </div>
              )}
              {company.mission && (
                <div>
                  <p style={{fontSize:"10px", letterSpacing:"3px", textTransform:"uppercase", color:"#C8B89A", marginBottom:"24px", fontFamily:"var(--font-jost)", fontWeight:400}}>Mission</p>
                  <div style={{width:"32px", height:"1px", background:"rgba(200,184,154,0.6)", marginBottom:"24px"}} />
                  <p style={{fontSize:"15px", color:"#4A4440", lineHeight:1.85, fontWeight:300, fontFamily:"var(--font-jost)"}}>{company.mission}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </ScrollReveal>
      )}

      {/* ── LOVE LETTERS ── */}
      {/* LoveLettersSection disabled */}

      {/* ── PHOTO CAROUSEL ── */}
      <PhotoCarousel images={(company as any).galleryImages || []} />

    </div>
  );
}