'use client'

import { useState, useRef, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function ShareStoryPage() {
  const [form, setForm] = useState({ name: '', city: '', perfume: '', story: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [char, setChar] = useState(0)
  const [avatar, setAvatar] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [products, setProducts] = useState<string[]>([])
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/products-public')
      .then((r) => r.json())
      .then((data: any) => {
        if (Array.isArray(data)) setProducts(data.map((p: any) => p.name))
      })
      .catch(() => setProducts([]))
  }, [])

  const pickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (f.size > 2 * 1024 * 1024) {
      alert('Ukuran foto maksimal 2MB')
      return
    }
    setAvatar(f)
    setAvatarPreview(URL.createObjectURL(f))
  }

  const clearPhoto = () => {
    setAvatar(null)
    if (avatarPreview) URL.revokeObjectURL(avatarPreview)
    setAvatarPreview(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  const submit = async () => {
    if (!form.name || !form.city || !form.story) return
    setStatus('loading')
    let avatar_url = null
    if (avatar) {
      const ext = avatar.name.split('.').pop() || 'jpg'
      const path = `story-${Date.now()}.${ext}`
      const { error: upErr } = await supabase.storage
        .from('avatars')
        .upload(path, avatar, { contentType: avatar.type, upsert: false })
      if (upErr) {
        console.error('[share-story] upload failed', upErr.message)
        setStatus('error')
        return
      }
      const { data } = supabase.storage.from('avatars').getPublicUrl(path)
      avatar_url = data.publicUrl
    }
    const { error } = await supabase
      .from('love_stories')
      .insert([{ ...form, status: 'pending', avatar_url }])
    setStatus(error ? 'error' : 'success')
  }

  return (
    <>
      <style>{`
        .ss {
          --ink: #111111;
          --muted: rgba(17,17,17,0.48);
          --line: rgba(17,17,17,0.12);
          --bg: #FFFFFF;
          --soft: #F5F5F5;
          background: var(--bg);
          min-height: 100vh;
          color: var(--ink);
          font-family: var(--font-jakarta), system-ui, sans-serif;
          font-weight: 300;
        }
        .ss-hero {
          padding: 132px 6vw 56px;
          text-align: center;
          border-bottom: 1px solid var(--line);
        }
        .ss-kicker {
          font-family: var(--font-futura-nav), Futura, Century Gothic, sans-serif;
          font-size: 11px;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 22px;
        }
        .ss-hero h1 {
          font-family: var(--font-futura-display), var(--font-futura-nav), Futura, Century Gothic, sans-serif;
          font-size: clamp(2.4rem, 6.5vw, 5rem);
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 0.98;
          margin: 0 0 20px;
        }
        .ss-hero h1 em {
          font-style: normal;
          font-family: var(--font-futura-nav), Futura, Century Gothic, sans-serif;
          font-weight: 400;
        }
        .ss-hero p {
          max-width: 420px;
          margin: 0 auto;
          font-size: 15px;
          line-height: 1.75;
          color: var(--muted);
        }
        .ss-strip {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 20px;
          padding: 22px 6vw;
          border-bottom: 1px solid var(--line);
        }
        .ss-strip a,
        .ss-strip span {
          font-family: var(--font-futura-nav), Futura, Century Gothic, sans-serif;
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          text-decoration: none;
          color: var(--ink);
        }
        .ss-strip span { color: var(--muted); }
        .ss-strip a { border-bottom: 1px solid var(--ink); padding-bottom: 2px; }
        .ss-shell {
          max-width: 1120px;
          margin: 0 auto;
          padding: 56px 6vw 100px;
        }
        .ss-layout {
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          gap: 48px;
          align-items: start;
        }
        .ss-photo-block { position: sticky; top: 110px; }
        .ss-flabel {
          display: block;
          font-family: var(--font-futura-nav), Futura, Century Gothic, sans-serif;
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 14px;
        }
        .ss-photo-drop {
          width: 100%;
          aspect-ratio: 4 / 5;
          min-height: 420px;
          background: var(--soft);
          border: 1px solid var(--line);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          cursor: pointer;
          padding: 32px 24px;
          text-align: center;
          overflow: hidden;
          transition: border-color 0.25s, background 0.25s;
        }
        .ss-photo-drop:hover { border-color: rgba(17,17,17,0.35); background: #EFEFEF; }
        .ss-photo-drop.has-file { padding: 0; border-color: var(--ink); }
        .ss-photo-preview {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .ss-photo-cta {
          font-family: var(--font-futura-nav), Futura, Century Gothic, sans-serif;
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--ink);
          border: 1px solid rgba(17,17,17,0.35);
          padding: 12px 26px;
          background: #FFFFFF;
          cursor: pointer;
        }
        .ss-photo-note {
          font-size: 13px;
          line-height: 1.55;
          color: var(--muted);
          max-width: 260px;
          margin: 0;
        }
        .ss-photo-actions {
          display: flex;
          gap: 10px;
          margin-top: 14px;
          flex-wrap: wrap;
        }
        .ss-fields { padding-top: 4px; }
        .ss-field { margin-bottom: 28px; }
        .ss-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        .ss-input,
        .ss-select,
        .ss-textarea {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid var(--line);
          padding: 12px 0;
          font-family: var(--font-jakarta), system-ui, sans-serif;
          font-size: 16px;
          color: var(--ink);
          font-weight: 300;
          outline: none;
          border-radius: 0;
          -webkit-appearance: none;
          transition: border-color 0.2s;
        }
        .ss-input:focus,
        .ss-select:focus,
        .ss-textarea:focus { border-bottom-color: var(--ink); }
        .ss-textarea {
          resize: none;
          height: 160px;
          line-height: 1.7;
        }
        .ss-char {
          text-align: right;
          font-size: 11px;
          letter-spacing: 0.08em;
          color: rgba(17,17,17,0.35);
          margin-top: 8px;
        }
        .ss-btn {
          width: 100%;
          padding: 18px;
          margin-top: 8px;
          background: #111111;
          color: #FFFFFF;
          border: none;
          cursor: pointer;
          font-family: var(--font-futura-nav), Futura, Century Gothic, sans-serif;
          font-size: 11px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          transition: opacity 0.2s, transform 0.2s;
        }
        .ss-btn:hover { opacity: 0.88; transform: translateY(-1px); }
        .ss-btn:disabled { opacity: 0.35; cursor: not-allowed; transform: none; }
        .ss-note {
          font-size: 12px;
          color: var(--muted);
          text-align: center;
          line-height: 1.7;
          margin-top: 22px;
        }
        .ss-error {
          color: #b42318;
          font-size: 13px;
          margin-top: 14px;
          text-align: center;
        }
        .ss-success {
          max-width: 560px;
          margin: 80px auto;
          text-align: center;
          padding: 0 6vw 100px;
        }
        .ss-success h3 {
          font-family: var(--font-futura-display), var(--font-futura-nav), Futura, Century Gothic, sans-serif;
          font-size: clamp(1.8rem, 4vw, 2.6rem);
          font-weight: 700;
          letter-spacing: -0.02em;
          margin: 0 0 16px;
        }
        .ss-success p {
          font-size: 15px;
          line-height: 1.8;
          color: var(--muted);
          margin: 0 0 36px;
        }
        .ss-success a {
          display: inline-block;
          padding: 14px 36px;
          border: 1px solid rgba(17,17,17,0.35);
          color: var(--ink);
          text-decoration: none;
          font-family: var(--font-futura-nav), Futura, Century Gothic, sans-serif;
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }
        @media (max-width: 900px) {
          .ss-layout { grid-template-columns: 1fr; gap: 36px; }
          .ss-photo-block { position: static; }
          .ss-photo-drop { min-height: 300px; aspect-ratio: 1; }
          .ss-hero { padding: 120px 5vw 48px; }
          .ss-shell { padding: 40px 5vw 80px; }
        }
        @media (max-width: 600px) {
          .ss-grid { grid-template-columns: 1fr; }
          .ss-strip { flex-direction: column; align-items: flex-start; gap: 12px; }
        }
      `}</style>

      <div className="ss">
        <section className="ss-hero">
          <p className="ss-kicker">Share Your Story</p>
          <h1>
            Bagikan
            <br />
            <em>kisahmu.</em>
          </h1>
          <p>
            Henima lahir dari sebuah cerita cinta. Tulis kisahmu — dengan foto — dan biarkan ia dikenang.
          </p>
        </section>

        <div className="ss-strip">
          <a href="/love-letters">Kembali ke Love Letters</a>
          <span>Foto + cerita</span>
        </div>

        {status === 'success' ? (
          <div className="ss-success">
            <h3>Terima kasih sudah berbagi.</h3>
            <p>
              Ceritamu sedang kami baca dengan sepenuh hati.
              <br />
              Jika terpilih, kisahmu akan hadir di Love Letters Henima.
            </p>
            <a href="/love-letters">Lihat Love Letters</a>
          </div>
        ) : (
          <div className="ss-shell">
            <div className="ss-layout">
              <div className="ss-photo-block">
                <label className="ss-flabel">Foto cerita / ulasan</label>
                <div
                  className={`ss-photo-drop${avatarPreview ? ' has-file' : ''}`}
                  onClick={() => !avatarPreview && fileRef.current?.click()}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') fileRef.current?.click()
                  }}
                >
                  {avatarPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={avatarPreview}
                      alt="Preview foto cerita"
                      className="ss-photo-preview"
                    />
                  ) : (
                    <>
                      <svg
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        style={{ opacity: 0.35 }}
                      >
                        <rect x="3" y="3" width="18" height="18" rx="0" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="M21 15l-5-5L5 21" />
                      </svg>
                      <span className="ss-photo-cta">Pilih foto</span>
                      <p className="ss-photo-note">
                        Selfie, couple, atau bersama botol Henima. JPG/PNG, maks 2MB.
                      </p>
                    </>
                  )}
                </div>
                {avatarPreview ? (
                  <div className="ss-photo-actions">
                    <button
                      type="button"
                      className="ss-photo-cta"
                      onClick={() => fileRef.current?.click()}
                    >
                      Ganti foto
                    </button>
                    <button type="button" className="ss-photo-cta" onClick={clearPhoto}>
                      Hapus
                    </button>
                  </div>
                ) : null}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  style={{ display: 'none' }}
                  onChange={pickFile}
                />
              </div>

              <div className="ss-fields">
                <div className="ss-grid">
                  <div className="ss-field">
                    <label className="ss-flabel">Nama kamu</label>
                    <input
                      className="ss-input"
                      placeholder="Siapa namamu?"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div className="ss-field">
                    <label className="ss-flabel">Kota</label>
                    <input
                      className="ss-input"
                      placeholder="Kamu dari mana?"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                    />
                  </div>
                </div>

                <div className="ss-field">
                  <label className="ss-flabel">Parfum Henima yang menemanimu</label>
                  <select
                    className="ss-select"
                    value={form.perfume}
                    onChange={(e) => setForm({ ...form, perfume: e.target.value })}
                  >
                    <option value="">Pilih parfum...</option>
                    <option value="Belum punya Henima">Belum punya Henima</option>
                    {products.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="ss-field">
                  <label className="ss-flabel">Ceritamu</label>
                  <textarea
                    className="ss-textarea"
                    placeholder="Ceritakan kisahmu..."
                    value={form.story}
                    onChange={(e) => {
                      setForm({ ...form, story: e.target.value })
                      setChar(e.target.value.length)
                    }}
                    maxLength={500}
                  />
                  <p className="ss-char">{char}/500</p>
                </div>

                <button
                  className="ss-btn"
                  onClick={submit}
                  disabled={status === 'loading' || !form.name || !form.city || !form.story}
                >
                  {status === 'loading' ? 'Mengirim...' : 'Kirim Ceritaku'}
                </button>
                {status === 'error' ? (
                  <p className="ss-error">Gagal mengirim, coba lagi ya.</p>
                ) : null}
                <p className="ss-note">
                  Ceritamu akan direview tim Henima sebelum ditampilkan di Love Letters.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
