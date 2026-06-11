"use client";
import { useState } from "react";

export default function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle"|"loading"|"success"|"error">("idle");
  const [msg, setMsg] = useState("");

  async function subscribe() {
    if (!email.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMsg("Thank you for subscribing!");
        setEmail("");
      } else {
        setStatus("error");
        setMsg(data.error || "Terjadi kesalahan");
      }
    } catch {
      setStatus("error");
      setMsg("Terjadi kesalahan");
    }
  }

  if (status === "success") {
    return (
      <p style={{fontSize:"13px", color:"rgba(200,184,154,0.8)", fontFamily:"var(--font-jost)", fontWeight:300, padding:"13px 0"}}>
        {msg}
      </p>
    );
  }

  return (
    <div>
      <div style={{display:"flex"}}>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === "Enter" && subscribe()}
          placeholder="Email address"
          style={{
            flex:1, background:"transparent",
            border:"1px solid rgba(255,255,255,0.15)", borderRight:"none",
            padding:"13px 16px", fontSize:"13px", color:"#F0EBE3",
            fontFamily:"var(--font-jost)", outline:"none",
          }}
        />
        <button
          onClick={subscribe}
          disabled={status === "loading"}
          style={{
            background:"#F0EBE3", border:"1px solid #F0EBE3",
            color:"#1C1917", padding:"13px 20px", fontSize:"11px",
            letterSpacing:"1px", textTransform:"uppercase",
            fontFamily:"var(--font-jost)", cursor:"pointer", fontWeight:500,
          }}>
          {status === "loading" ? "..." : "Subscribe"}
        </button>
      </div>
      {status === "error" && (
        <p style={{fontSize:"11px", color:"rgba(200,100,100,0.8)", marginTop:"8px", fontFamily:"var(--font-jost)"}}>{msg}</p>
      )}
    </div>
  );
}
