"use client";
import { useState, useEffect } from "react";

interface Review {
  id: string;
  customer_name: string;
  rating: number;
  comment: string;
  created_at: string;
  reply?: string;
}

export default function ProductReviews({ reviews, productName }: { reviews: Review[]; productName: string }) {
  const [filter, setFilter] = useState<number | "all">("all");
  const [visible, setVisible] = useState<boolean[]>([]);

  const filtered = reviews.filter(r => filter === "all" ? true : filter === 2 ? r.rating <= 2 : r.rating === filter);

  const avg = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "0.0";

  const dist = [5,4,3,2,1].map(s => ({
    star: s,
    count: reviews.filter(r => r.rating === s).length,
    pct: reviews.length > 0 ? Math.round(reviews.filter(r => r.rating === s).length / reviews.length * 100) : 0
  }));

  useEffect(() => {
    setVisible([]);
    const timers = filtered.map((_, i) => setTimeout(() => setVisible(prev => { const next = [...prev]; next[i] = true; return next; }), i * 80));
    return () => timers.forEach(clearTimeout);
  }, [filter, reviews.length]);

  const stars = (n: number, size = 12) => Array.from({length: 5}, (_, i) => (
    `<span style="color:${i < n ? "#B5935A" : "rgba(181,147,90,0.2)"}; font-size:${size}px;">★</span>`
  )).join("");

  if (reviews.length === 0) return (
    <div style={{padding:"60px 0", textAlign:"center", borderTop:"1px solid rgba(28,25,23,0.08)"}}>
      <p style={{fontFamily:"var(--font-mono, monospace)", fontSize:"11px", color:"#9A8F82", letterSpacing:"2px"}}>// no signals yet</p>
      <p style={{fontSize:"13px", color:"#9A8F82", marginTop:"8px"}}>Jadilah yang pertama mengulas {productName}</p>
    </div>
  );

  return (
    <div style={{padding:"64px 0", borderTop:"1px solid rgba(28,25,23,0.08)"}}>
      <style>{`
        @keyframes floatIn {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseDot {
          0% { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes scanMove {
          0% { top: 0%; } 100% { top: 100%; }
        }
        .review-card-henima {
          border: 0.5px solid rgba(181,147,90,0.2);
          border-radius: 10px;
          padding: 1.1rem 1.25rem;
          background: #FAF8F4;
          position: relative;
          overflow: hidden;
          transition: border-color 0.25s;
        }
        .review-card-henima::before {
          content: "";
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #B5935A55, transparent);
        }
        .review-card-henima:hover { border-color: rgba(181,147,90,0.5); }
        .chip-henima {
          font-size: 11px;
          padding: 5px 13px;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.2s;
          border: 0.5px solid rgba(181,147,90,0.3);
          background: transparent;
          color: #9A8F82;
          font-family: inherit;
        }
        .chip-henima.active {
          background: #B5935A;
          color: #fff;
          border-color: #B5935A;
        }
      `}</style>

      {/* Header */}
      <div style={{display:"flex", alignItems:"center", gap:"8px", marginBottom:"24px"}}>
        <div style={{position:"relative", width:"8px", height:"8px"}}>
          <div style={{width:"8px", height:"8px", borderRadius:"50%", background:"#B5935A", position:"relative", zIndex:1}}></div>
          <div style={{position:"absolute", inset:0, borderRadius:"50%", background:"#B5935A", animation:"pulseDot 1.5s ease-out infinite"}}></div>
        </div>
        <span style={{fontFamily:"monospace", fontSize:"11px", color:"#9A8F82", letterSpacing:"1.5px"}}>CUSTOMER_SIGNAL.live</span>
      </div>

      {/* Stats */}
      <div style={{display:"grid", gridTemplateColumns:"auto 1fr", gap:"24px", alignItems:"center", marginBottom:"28px"}}>
        <div>
          <p style={{fontSize:"40px", fontWeight:500, color:"#1C1917", margin:0, lineHeight:1}}>{avg}</p>
          <div style={{display:"flex", gap:"2px", margin:"6px 0 4px"}} dangerouslySetInnerHTML={{__html: stars(Math.round(parseFloat(avg)), 14)}}></div>
          <p style={{fontFamily:"monospace", fontSize:"11px", color:"#9A8F82"}}>{reviews.length} verified signals</p>
        </div>
        <div style={{display:"flex", flexDirection:"column", gap:"5px"}}>
          {dist.map(d => (
            <div key={d.star} style={{display:"flex", alignItems:"center", gap:"8px"}}>
              <span style={{fontFamily:"monospace", fontSize:"11px", color:"#9A8F82", minWidth:"8px"}}>{d.star}</span>
              <span style={{color:"#B5935A", fontSize:"10px"}}>★</span>
              <div style={{flex:1, height:"4px", background:"rgba(181,147,90,0.1)", borderRadius:"2px", overflow:"hidden"}}>
                <div style={{width:`${d.pct}%`, height:"100%", background:"#B5935A", borderRadius:"2px", transition:"width 0.8s ease"}}></div>
              </div>
              <span style={{fontFamily:"monospace", fontSize:"10px", color:"#C8B89A", minWidth:"24px"}}>{d.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filter chips */}
      <div style={{display:"flex", gap:"6px", flexWrap:"wrap", marginBottom:"24px"}}>
        {([["all","Semua"], [5,`5 ★ (${dist[0].count})`], [4,`4 ★ (${dist[1].count})`], [3,`3 ★ (${dist[2].count})`], [2,`1-2 ★ (${dist[3].count + dist[4].count})`]] as [number|"all", string][]).map(([val, label]) => (
          <button key={val} className={`chip-henima${filter === val ? " active" : ""}`} onClick={() => setFilter(val)}>{label}</button>
        ))}
      </div>

      {/* Reviews */}
      <div style={{position:"relative"}}>
        <div style={{position:"absolute", left:0, right:0, height:"50px", background:"linear-gradient(180deg,transparent,rgba(181,147,90,0.04),transparent)", animation:"scanMove 4s linear infinite", pointerEvents:"none"}}></div>
        <div style={{display:"flex", flexDirection:"column", gap:"10px"}}>
          {filtered.length === 0 ? (
            <p style={{fontFamily:"monospace", fontSize:"12px", color:"#9A8F82", padding:"24px 0", textAlign:"center"}}>// no signals for this filter</p>
          ) : filtered.map((r, i) => (
            <div key={r.id} className="review-card-henima" style={{animation: visible[i] ? `floatIn 0.35s ease both` : "none", opacity: visible[i] ? 1 : 0}}>
              <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"10px"}}>
                <div style={{display:"flex", alignItems:"center", gap:"10px"}}>
                  <div style={{width:"34px", height:"34px", borderRadius:"50%", border:"1px solid rgba(181,147,90,0.35)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"11px", fontWeight:500, color:"#B5935A", background:"rgba(181,147,90,0.07)", flexShrink:0}}>
                    {r.customer_name.split(" ").map((n:string) => n[0]).join("").slice(0,2).toUpperCase()}
                  </div>
                  <div>
                    <p style={{fontSize:"13px", fontWeight:500, color:"#1C1917", margin:0}}>{r.customer_name}</p>
                    <div dangerouslySetInnerHTML={{__html: stars(r.rating)}}></div>
                  </div>
                </div>
                <div style={{display:"flex", alignItems:"center", gap:"8px", flexShrink:0}}>
                  <span style={{fontFamily:"monospace", fontSize:"10px", padding:"2px 8px", borderRadius:"20px", border:"0.5px solid rgba(181,147,90,0.4)", color:"#B5935A"}}>verified</span>
                  <span style={{fontFamily:"monospace", fontSize:"11px", color:"#9A8F82"}}>{new Date(r.created_at).toLocaleDateString("id-ID", {day:"2-digit", month:"2-digit", year:"2-digit"})}</span>
                </div>
              </div>
              <p style={{fontSize:"14px", color:"#4A4440", lineHeight:1.75, margin:0, fontWeight:300}}>{r.review}</p>
              {r.reply && (
                <div style={{marginTop:"12px", borderLeft:"1.5px solid #B5935A", padding:"8px 12px", background:"rgba(181,147,90,0.05)", borderRadius:"0 6px 6px 0"}}>
                  <p style={{fontFamily:"monospace", fontSize:"11px", color:"#B5935A", margin:"0 0 3px"}}>// henima.reply</p>
                  <p style={{fontSize:"13px", color:"#4A4440", margin:0, lineHeight:1.7, fontWeight:300}}>{r.reply}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
