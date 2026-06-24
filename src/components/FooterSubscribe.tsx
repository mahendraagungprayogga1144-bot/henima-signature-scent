"use client";
import { useState } from "react";

export default function FooterSubscribe() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle"|"loading"|"success"|"error">("idle");

  async function subscribe() {
    if (!email.trim() || !name.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });
      if (res.ok) {
        setStatus("success");
        setName(""); setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <div style={{textAlign:"center", marginBottom:"56px", paddingBottom:"56px", borderBottom:"1px solid rgba(200,184,154,0.12)"}}>
      <p style={{fontSize:"10px", letterSpacing:"4px", textTransform:"uppercase", color:"rgba(200,184,154,0.4)", marginBottom:"12px", fontWeight:500}}>Exclusive</p>
      <h3 style={{fontFamily:"var(--font-cormorant)", fontSize:"clamp(24px,4vw,36px)", fontWeight:300, fontStyle:"italic", color:"#F0EBE3", marginBottom:"8px"}}>
        Dapatkan info promo eksklusif Henima
      </h3>
      <p style={{fontSize:"13px", color:"rgba(200,184,154,0.4)", fontWeight:300, marginBottom:"28px"}}>
        Jadilah yang pertama tahu koleksi terbaru, promo spesial, dan cerita di balik setiap wewangian.
      </p>
      {status === "success" ? (
        <p style={{fontSize:"14px", color:"#B5935A", fontStyle:"italic"}}>Terima kasih! Kamu sudah terdaftar. ✨</p>
      ) : (
        <>
          <div style={{display:"flex", gap:"10px", justifyContent:"center", flexWrap:"wrap", maxWidth:"520px", margin:"0 auto"}}>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Nama kamu"
              style={{flex:1, minWidth:"130px", background:"transparent", border:"1px solid rgba(200,184,154,0.2)", padding:"12px 16px", fontSize:"13px", color:"#F0EBE3", fontFamily:"var(--font-jost)", outline:"none"}}
            />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Alamat email"
              onKeyDown={e => e.key === "Enter" && subscribe()}
              style={{flex:2, minWidth:"180px", background:"transparent", border:"1px solid rgba(200,184,154,0.2)", padding:"12px 16px", fontSize:"13px", color:"#F0EBE3", fontFamily:"var(--font-jost)", outline:"none"}}
            />
            <button
              onClick={subscribe}
              disabled={status === "loading" || !email.trim() || !name.trim()}
              style={{background:"#B5935A", border:"none", color:"#1C1917", padding:"12px 24px", fontSize:"10px", letterSpacing:"2px", textTransform:"uppercase", cursor:"pointer", fontFamily:"var(--font-jost)", fontWeight:600, whiteSpace:"nowrap", opacity: !email.trim() || !name.trim() ? 0.5 : 1}}
            >
              {status === "loading" ? "..." : "Subscribe"}
            </button>
          </div>
          {status === "error" && <p style={{fontSize:"12px", color:"rgba(200,100,100,0.7)", marginTop:"10px"}}>Terjadi kesalahan. Coba lagi.</p>}
        </>
      )}
    </div>
  );
}
