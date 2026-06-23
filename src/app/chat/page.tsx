"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

type Message = { role: "user" | "assistant"; content: string }

function formatMessage(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\n/g, "<br/>")
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Halo! Saya Aldo, Customer Service Henima Signature Scent.\n\nAda yang bisa saya bantu seputar produk, pesanan, atau pengiriman?" }
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, loading])

  async function sendMessage() {
    const text = input.trim()
    if (!text || loading) return
    const newMessages: Message[] = [...messages, { role: "user", content: text }]
    setMessages(newMessages)
    setInput("")
    setLoading(true)
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      })
      const data = await res.json()
      setMessages([...newMessages, { role: "assistant", content: data.reply || "Maaf, terjadi kesalahan." }])
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Maaf, terjadi kesalahan. Silakan hubungi WhatsApp 085190311230." }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      height: "100dvh", display: "flex", flexDirection: "column",
      background: "#FAF8F4", fontFamily: "var(--font-jost)",
    }}>
      <style>{`
        @keyframes floatIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes typingPulse {
          0%, 100% { opacity: 0.4; } 50% { opacity: 1; }
        }
        .chat-msg { animation: floatIn 0.25s ease both; }
        .chat-scroll::-webkit-scrollbar { width: 3px; }
        .chat-scroll::-webkit-scrollbar-thumb { background: rgba(28,25,23,0.1); border-radius: 2px; }
        .chat-input:focus { border-color: rgba(28,25,23,0.4) !important; outline: none; }
      `}</style>

      {/* Header */}
      <div style={{
        background: "#1C1917",
        padding: "0 20px",
        height: "64px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexShrink: 0,
        borderBottom: "1px solid rgba(200,184,154,0.15)",
      }}>
        <Link href="/" style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          width: "36px", height: "36px", borderRadius: "50%",
          background: "rgba(255,255,255,0.08)", textDecoration: "none",
          color: "#C8B89A", fontSize: "18px",
        }}>←</Link>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "38px", height: "38px", borderRadius: "50%",
            background: "#2C2420", border: "1.5px solid rgba(200,184,154,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" fill="#C8B89A"/>
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill="#C8B89A"/>
            </svg>
          </div>
          <div>
            <p style={{ fontSize: "14px", fontWeight: 500, color: "#F0EBE3", margin: 0, letterSpacing: "1px" }}>Aldo</p>
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#4CAF50" }}></div>
              <p style={{ fontSize: "10px", color: "rgba(200,184,154,0.6)", margin: 0, letterSpacing: "0.5px" }}>Customer Service Henima · Online</p>
            </div>
          </div>
        </div>

        <a href="https://wa.me/6285190311230" target="_blank" rel="noopener noreferrer" style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          width: "36px", height: "36px", borderRadius: "50%",
          background: "rgba(255,255,255,0.08)", textDecoration: "none",
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#4CAF50">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="chat-scroll" style={{
        flex: 1, overflowY: "auto", padding: "20px 16px",
        display: "flex", flexDirection: "column", gap: "12px",
      }}>
        {messages.map((m, i) => (
          <div key={i} className="chat-msg" style={{
            alignSelf: m.role === "user" ? "flex-end" : "flex-start",
            maxWidth: "80%", display: "flex", flexDirection: "column", gap: "3px",
          }}>
            {m.role === "assistant" && (
              <span style={{ fontSize: "10px", letterSpacing: "1.5px", color: "#B5935A", marginLeft: "2px" }}>ALDO</span>
            )}
            <div style={{
              background: m.role === "user" ? "#1C1917" : "#fff",
              color: m.role === "user" ? "#F0EBE3" : "#1C1917",
              padding: "10px 14px",
              fontSize: "14px", lineHeight: 1.7,
              borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "4px 16px 16px 16px",
              border: m.role === "user" ? "none" : "0.5px solid rgba(28,25,23,0.08)",
              boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
            }} dangerouslySetInnerHTML={{ __html: formatMessage(m.content) }} />
          </div>
        ))}
        {loading && (
          <div className="chat-msg" style={{ alignSelf: "flex-start", maxWidth: "80%" }}>
            <span style={{ fontSize: "10px", letterSpacing: "1.5px", color: "#B5935A", marginLeft: "2px" }}>ALDO</span>
            <div style={{
              background: "#fff", padding: "12px 16px",
              borderRadius: "4px 16px 16px 16px",
              border: "0.5px solid rgba(28,25,23,0.08)",
              fontSize: "13px", color: "#9A8F82", fontStyle: "italic",
            }}>
              Aldo sedang mengetik...
            </div>
          </div>
        )}
      </div>

      {/* Quick replies */}
      {messages.length === 1 && (
        <div style={{ padding: "0 16px 12px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {["Rekomendasi parfum", "Cek status pesanan", "Info pengiriman", "Harga produk"].map(q => (
            <button key={q} onClick={() => { setInput(q); setTimeout(() => document.getElementById("chat-input")?.focus(), 100); }} style={{
              fontSize: "12px", padding: "6px 12px", borderRadius: "20px",
              border: "0.5px solid rgba(181,147,90,0.4)", background: "transparent",
              color: "#B5935A", cursor: "pointer", fontFamily: "var(--font-jost)",
            }}>{q}</button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{
        padding: "12px 16px", background: "#fff",
        borderTop: "0.5px solid rgba(28,25,23,0.08)",
        display: "flex", gap: "10px", alignItems: "center",
        flexShrink: 0,
      }}>
        <input
          id="chat-input"
          className="chat-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") sendMessage() }}
          placeholder="Tulis pesan..."
          disabled={loading}
          style={{
            flex: 1, border: "0.5px solid rgba(28,25,23,0.15)",
            padding: "12px 16px", fontSize: "14px",
            background: "#FAF8F4", fontFamily: "var(--font-jost)",
            color: "#1C1917", borderRadius: "24px",
          }}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          style={{
            width: "44px", height: "44px", borderRadius: "50%",
            background: loading || !input.trim() ? "rgba(28,25,23,0.2)" : "#1C1917",
            border: "none", cursor: loading || !input.trim() ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, transition: "background 0.2s",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FAF8F4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
