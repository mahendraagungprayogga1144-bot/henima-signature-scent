"use client";
import { useEffect, useRef, useState } from "react";

export default function AdminNotifier() {
  const [newOrders, setNewOrders] = useState<any[]>([]);
  const [show, setShow] = useState(false);
  const lastCheckRef = useRef<string>(new Date().toISOString());
  const audioRef = useRef<AudioContext | null>(null);

  function playSound() {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      oscillator.frequency.setValueAtTime(880, ctx.currentTime);
      oscillator.frequency.setValueAtTime(660, ctx.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(880, ctx.currentTime + 0.2);
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.5);
    } catch {}
  }

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch("/api/admin/new-orders?since=" + lastCheckRef.current);
        if (!res.ok) return;
        const data = await res.json();
        if (data.orders?.length > 0) {
          setNewOrders(data.orders);
          setShow(true);
          playSound();
          lastCheckRef.current = new Date().toISOString();
        }
      } catch {}
    };

    const interval = setInterval(check, 30000);
    return () => clearInterval(interval);
  }, []);

  function testNotif() {
    playSound();
    setNewOrders([{ id: "ORD-TEST-001", total: 185000, customer: JSON.stringify({ name: "Test Customer" }) }]);
    setShow(true);
  }

  return (
    <>
      <button onClick={testNotif} style={{
        position: "fixed", bottom: "20px", left: "260px", zIndex: 9999,
        background: "rgba(181,147,90,0.15)", border: "1px solid rgba(181,147,90,0.3)",
        color: "#B5935A", fontSize: "10px", letterSpacing: "1px",
        padding: "6px 12px", borderRadius: "20px", cursor: "pointer",
        fontFamily: "var(--font-jost)",
      }}>🔔 Test Notif</button>
      {show && newOrders.length > 0 && (

  return (
    <div style={{
      position: "fixed", top: "20px", right: "20px", zIndex: 99999,
      background: "#1a1a2e", border: "1px solid #B5935A",
      borderRadius: "12px", padding: "16px 20px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      maxWidth: "320px", animation: "slideIn 0.3s ease",
    }}>
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(100px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22C55E", animation: "pulse 1s infinite" }}></div>
          <p style={{ fontSize: "12px", fontWeight: 700, color: "#B5935A", margin: 0, letterSpacing: "1px" }}>ORDER BARU MASUK!</p>
        </div>
        <button onClick={() => setShow(false)} style={{ background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: "18px", padding: 0 }}>×</button>
      </div>
      {newOrders.map((o: any, i: number) => {
        const customer = typeof o.customer === "string" ? JSON.parse(o.customer) : o.customer;
        return (
          <div key={i} style={{ marginBottom: "8px", padding: "10px", background: "rgba(181,147,90,0.1)", borderRadius: "6px" }}>
            <p style={{ fontSize: "12px", color: "#F0EBE3", margin: "0 0 3px", fontWeight: 600 }}>{customer?.name}</p>
            <p style={{ fontSize: "11px", color: "#888", margin: "0 0 3px" }}>{o.id}</p>
            <p style={{ fontSize: "12px", color: "#B5935A", margin: 0, fontWeight: 600 }}>Rp {o.total?.toLocaleString("id-ID")}</p>
          </div>
        );
      })}
      <a href="/admin/orders" style={{
        display: "block", textAlign: "center",
        background: "#B5935A", color: "#fff",
        padding: "8px", borderRadius: "6px",
        fontSize: "11px", letterSpacing: "1px",
        textDecoration: "none", marginTop: "8px",
        fontWeight: 600,
      }}>Lihat Orders →</a>
    </div>
      )}
    </>
  );
}
