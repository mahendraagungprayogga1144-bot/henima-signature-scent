"use client"
import { useState, useRef, useEffect } from "react"

type Message = { role: "user" | "assistant"; content: string }

function formatMessage(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\n/g, "<br/>")
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Halo! Selamat datang di Henima Signature Scent.\n\nAda yang bisa saya bantu seputar produk, pesanan, atau pengiriman?" }
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
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes typingDot {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
        .henima-chat-btn {
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .henima-chat-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 24px rgba(0,0,0,0.35) !important;
        }
        .henima-msg {
          animation: fadeUp 0.25s ease both;
        }
        .henima-input:focus {
          border-color: rgba(28,25,23,0.4) !important;
        }
        .henima-scroll::-webkit-scrollbar { width: 4px; }
        .henima-scroll::-webkit-scrollbar-track { background: transparent; }
        .henima-scroll::-webkit-scrollbar-thumb { background: rgba(28,25,23,0.1); border-radius: 2px; }
        .typing-dot {
          display: inline-block;
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #9A8F82;
          animation: typingDot 1.2s infinite ease-in-out;
        }
      `}</style>

      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="henima-chat-btn"
          style={{
            position: "fixed", bottom: "24px", right: "24px", zIndex: 9999,
            width: "56px", height: "56px", borderRadius: "50%",
            background: "#1C1917", border: "1.5px solid rgba(200,184,154,0.3)",
            cursor: "pointer", display: "flex", alignItems: "center",
            justifyContent: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          }}
          aria-label="Buka chat"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C8B89A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div style={{
          position: "fixed", bottom: "24px", right: "24px", zIndex: 9999,
          width: "360px", maxWidth: "calc(100vw - 32px)",
          height: "540px", maxHeight: "calc(100vh - 100px)",
          background: "#FAF8F4",
          border: "0.5px solid rgba(28,25,23,0.12)",
          display: "flex", flexDirection: "column",
          boxShadow: "0 12px 48px rgba(0,0,0,0.2), 0 2px 8px rgba(0,0,0,0.1)",
          fontFamily: "var(--font-jost)",
          animation: "fadeUp 0.25s ease both",
          overflow: "hidden",
        }}>

          {/* Header */}
          <div style={{
            background: "#1C1917",
            padding: "14px 18px",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            borderBottom: "1px solid rgba(200,184,154,0.15)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{
                width: "36px", height: "36px", borderRadius: "50%",
                background: "#2C2420",
                border: "1.5px solid rgba(200,184,154,0.4)",
                display: "flex", alignItems: "center", justifyContent: "center",
                overflow: "hidden", flexShrink: 0,
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="4" fill="#C8B89A"/>
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill="#C8B89A"/>
                </svg>
              </div>
              <div>
                <p style={{ fontFamily: "Georgia,serif", fontSize: "13px", letterSpacing: "3px", color: "#F0EBE3", margin: 0, fontWeight: 400 }}>Aldo</p>
                <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "1px" }}>
                  <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#4CAF50" }}></div>
                  <p style={{ fontSize: "10px", letterSpacing: "1px", color: "rgba(200,184,154,0.6)", margin: 0 }}>Customer Service Henima · Online</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: "rgba(255,255,255,0.08)", border: "none", cursor: "pointer",
                color: "#C8B89A", width: "28px", height: "28px", borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "16px", transition: "background 0.2s",
              }}
              aria-label="Tutup chat"
            >×</button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="henima-scroll" style={{
            flex: 1, overflowY: "auto", padding: "16px",
            display: "flex", flexDirection: "column", gap: "10px",
            background: "#FAF8F4",
          }}>
            {messages.map((m, i) => (
              <div key={i} className="henima-msg" style={{
                alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "82%",
                display: "flex", flexDirection: "column", gap: "3px",
              }}>
                {m.role === "assistant" && (
                  <span style={{ fontSize: "10px", letterSpacing: "1.5px", color: "#C8B89A", marginLeft: "2px" }}>Aldo</span>
                )}
                <div style={{
                  background: m.role === "user" ? "#1C1917" : "#fff",
                  color: m.role === "user" ? "#F0EBE3" : "#1C1917",
                  padding: "10px 14px",
                  fontSize: "13px", lineHeight: 1.7,
                  borderRadius: m.role === "user" ? "12px 12px 2px 12px" : "2px 12px 12px 12px",
                  border: m.role === "user" ? "none" : "0.5px solid rgba(28,25,23,0.08)",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                }} dangerouslySetInnerHTML={{ __html: formatMessage(m.content) }} />
              </div>
            ))}
            {loading && (
              <div className="henima-msg" style={{ alignSelf: "flex-start", maxWidth: "82%" }}>
                <span style={{ fontSize: "10px", letterSpacing: "1.5px", color: "#C8B89A", marginLeft: "2px" }}>Aldo</span>
                <div style={{
                  background: "#fff", padding: "10px 14px",
                  borderRadius: "2px 12px 12px 12px",
                  border: "0.5px solid rgba(28,25,23,0.08)",
                  fontSize: "12px", color: "#9A8F82", fontStyle: "italic",
                }}>
                  Aldo sedang mengetik...
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div style={{
            borderTop: "0.5px solid rgba(28,25,23,0.08)",
            padding: "12px 14px",
            display: "flex", gap: "8px",
            background: "#fff",
          }}>
            <input
              className="henima-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") sendMessage() }}
              placeholder="Tulis pesan..."
              disabled={loading}
              style={{
                flex: 1,
                border: "0.5px solid rgba(28,25,23,0.15)",
                padding: "10px 14px",
                fontSize: "13px",
                outline: "none",
                background: "#FAF8F4",
                fontFamily: "var(--font-jost)",
                color: "#1C1917",
                borderRadius: "4px",
                transition: "border-color 0.2s",
              }}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              style={{
                background: loading || !input.trim() ? "rgba(28,25,23,0.3)" : "#1C1917",
                border: "none", color: "#F0EBE3",
                padding: "10px 16px", cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                fontSize: "11px", letterSpacing: "1.5px",
                fontFamily: "var(--font-jost)",
                borderRadius: "4px",
                transition: "background 0.2s",
              }}
            >
              KIRIM
            </button>
          </div>

        </div>
      )}
    </>
  )
}
