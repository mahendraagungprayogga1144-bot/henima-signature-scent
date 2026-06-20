'use client'
import { useState, useRef, useEffect } from 'react'

type Message = { role: 'user' | 'assistant'; content: string }

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Halo! Selamat datang di Henima Signature Scent. Ada yang bisa saya bantu seputar produk, pesanan, atau pengiriman?' }
  ])
  const [input, setInput] = useState('')
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

    const newMessages: Message[] = [...messages, { role: 'user', content: text }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      })
      const data = await res.json()
      setMessages([...newMessages, { role: 'assistant', content: data.reply || 'Maaf, terjadi kesalahan.' }])
    } catch {
      setMessages([...newMessages, { role: 'assistant', content: 'Maaf, terjadi kesalahan. Silakan hubungi WhatsApp 085190311230.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            position: 'fixed', bottom: '24px', right: '24px', zIndex: 50,
            width: '56px', height: '56px', borderRadius: '50%',
            background: '#1C1917', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
          }}
          aria-label="Buka chat"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F0EBE3" strokeWidth="1.8">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div
          style={{
            position: 'fixed', bottom: '24px', right: '24px', zIndex: 50,
            width: '360px', maxWidth: 'calc(100vw - 32px)', height: '520px', maxHeight: 'calc(100vh - 100px)',
            background: '#FAF8F4', border: '1px solid rgba(28,25,23,0.1)',
            display: 'flex', flexDirection: 'column',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          }}
        >
          {/* Header */}
          <div style={{
            background: '#1C1917', padding: '16px 20px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div>
              <p style={{ fontFamily: 'Georgia,serif', fontSize: '15px', letterSpacing: '2px', color: '#F0EBE3', margin: 0 }}>HENIMA</p>
              <p style={{ fontSize: '10px', letterSpacing: '1px', color: 'rgba(200,184,154,0.7)', margin: 0, marginTop: '2px' }}>Customer Service</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#F0EBE3', fontSize: '20px', padding: '4px 8px' }}
              aria-label="Tutup chat"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  background: m.role === 'user' ? '#1C1917' : 'rgba(28,25,23,0.06)',
                  color: m.role === 'user' ? '#F0EBE3' : '#1C1917',
                  padding: '10px 14px',
                  fontSize: '13px',
                  lineHeight: 1.6,
                  borderRadius: '4px',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div style={{ alignSelf: 'flex-start', fontSize: '12px', color: '#9A8F82', padding: '6px 14px' }}>
                Sedang mengetik...
              </div>
            )}
          </div>

          {/* Input */}
          <div style={{ borderTop: '1px solid rgba(28,25,23,0.1)', padding: '12px 16px', display: 'flex', gap: '8px' }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') sendMessage() }}
              placeholder="Tulis pesan..."
              disabled={loading}
              style={{
                flex: 1, border: '1px solid rgba(28,25,23,0.15)', padding: '10px 12px',
                fontSize: '16px', outline: 'none', background: '#fff',
              }}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              style={{
                background: '#1C1917', border: 'none', color: '#F0EBE3',
                padding: '10px 16px', cursor: 'pointer', fontSize: '13px',
                opacity: loading || !input.trim() ? 0.5 : 1,
              }}
            >
              Kirim
            </button>
          </div>
        </div>
      )}
    </>
  )
}
