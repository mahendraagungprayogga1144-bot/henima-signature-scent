'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Story = {
  id: string
  name: string
  city: string
  story: string
  perfume: string
  created_at: string
  admin_reply?: string
  avatar_url?: string
}

export default function LoveWallPage() {
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('love_stories')
      .select('id,name,city,story,perfume,created_at,admin_reply,avatar_url')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setStories(data || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (loading) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )
    document.querySelectorAll('.ll-reveal').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [loading, stories])

  const fmt = (d: string) =>
    new Date(d).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })

  return (
    <>
      <style>{`
        .ll {
          --ink: #111111;
          --muted: rgba(17,17,17,0.48);
          --line: rgba(17,17,17,0.12);
          --bg: #FFFFFF;
          --bg-soft: #F5F5F5;
          background: var(--bg);
          min-height: 100vh;
          color: var(--ink);
          font-family: var(--font-jakarta), system-ui, sans-serif;
          font-weight: 300;
        }
        .ll-hero {
          position: relative;
          min-height: min(92vh, 980px);
          width: 100%;
          overflow: hidden;
          display: flex;
          align-items: flex-end;
          background: #D8D8D8;
        }
        .ll-hero-media {
          position: absolute;
          inset: 0;
          z-index: 0;
        }
        .ll-hero-media img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 38%;
          display: block;
          filter: contrast(1.08) brightness(0.96);
          transform: scale(1.03);
          animation: ll-hero-in 1.4s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .ll-hero-shade {
          position: absolute;
          inset: 0;
          z-index: 1;
          background:
            linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.02) 35%, rgba(255,255,255,0.35) 68%, rgba(255,255,255,0.92) 88%, #FFFFFF 100%);
          pointer-events: none;
        }
        .ll-hero-copy {
          position: relative;
          z-index: 2;
          width: 100%;
          padding: 0 6vw 48px;
          text-align: left;
          max-width: 920px;
        }
        .ll-kicker {
          font-family: var(--font-futura-nav), Futura, Century Gothic, sans-serif;
          font-size: 11px;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 18px;
        }
        .ll-hero h1 {
          font-family: var(--font-futura-display), var(--font-futura-nav), Futura, Century Gothic, sans-serif;
          font-size: clamp(2.8rem, 8vw, 6.2rem);
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 0.95;
          margin: 0 0 18px;
          color: var(--ink);
          text-transform: none;
        }
        .ll-hero h1 em {
          font-style: normal;
          font-family: var(--font-futura-nav), Futura, Century Gothic, sans-serif;
          font-weight: 400;
        }
        .ll-hero p {
          max-width: 420px;
          margin: 0;
          font-size: 15px;
          line-height: 1.75;
          color: var(--muted);
        }
        @keyframes ll-hero-in {
          from { opacity: 0; transform: scale(1.06); }
          to { opacity: 1; transform: scale(1.02); }
        }
        .ll-strip {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 24px;
          padding: 28px 6vw;
          border-top: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
        }
        .ll-strip span {
          font-family: var(--font-futura-nav), Futura, Century Gothic, sans-serif;
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--muted);
        }
        .ll-strip a {
          font-family: var(--font-futura-nav), Futura, Century Gothic, sans-serif;
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--ink);
          text-decoration: none;
          border-bottom: 1px solid var(--ink);
          padding-bottom: 2px;
        }
        .ll-list { padding: 0; }
        .ll-row {
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          min-height: min(78vh, 720px);
          border-bottom: 1px solid var(--line);
        }
        .ll-row.reverse { grid-template-columns: 0.95fr 1.05fr; }
        .ll-row.reverse .ll-media { order: 2; }
        .ll-row.reverse .ll-copy { order: 1; }
        .ll-media {
          position: relative;
          background: var(--bg-soft);
          overflow: hidden;
          min-height: 360px;
        }
        .ll-media img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transform: scale(1.02);
          transition: transform 1.1s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .ll-row:hover .ll-media img { transform: scale(1.06); }
        .ll-media-empty {
          width: 100%;
          height: 100%;
          min-height: 360px;
          display: flex;
          align-items: center;
          justify-content: center;
          background:
            linear-gradient(135deg, #111 0%, #2a2a2a 100%);
          color: rgba(255,255,255,0.35);
          font-family: var(--font-jakarta), system-ui, sans-serif;
          font-size: clamp(4rem, 12vw, 8rem);
          font-weight: 300;
          letter-spacing: -0.04em;
        }
        .ll-copy {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: clamp(40px, 6vw, 88px) clamp(28px, 5vw, 72px);
          background: #FFFFFF;
        }
        .ll-meta {
          font-family: var(--font-futura-nav), Futura, Century Gothic, sans-serif;
          font-size: 10px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 28px;
        }
        .ll-quote {
          font-family: var(--font-futura-nav), Futura, Century Gothic, sans-serif;
          font-size: clamp(1.25rem, 2.2vw, 1.85rem);
          font-weight: 400;
          font-style: normal;
          line-height: 1.45;
          letter-spacing: -0.01em;
          color: var(--ink);
          margin: 0 0 36px;
        }
        .ll-name {
          font-family: var(--font-futura-nav), Futura, Century Gothic, sans-serif;
          font-size: 12px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--ink);
          margin: 0 0 6px;
        }
        .ll-city {
          font-size: 13px;
          color: var(--muted);
          margin: 0;
        }
        .ll-perfume {
          margin-top: 28px;
          font-family: var(--font-futura-nav), Futura, Century Gothic, sans-serif;
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--muted);
        }
        .ll-reply {
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid var(--line);
        }
        .ll-reply-label {
          font-family: var(--font-futura-nav), Futura, Century Gothic, sans-serif;
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 10px;
        }
        .ll-reply-text {
          font-size: 14px;
          line-height: 1.7;
          color: rgba(17,17,17,0.62);
          font-style: italic;
          margin: 0;
        }
        .ll-cta {
          padding: 120px 6vw;
          text-align: center;
          background: #111111;
          color: #FFFFFF;
        }
        .ll-cta h2 {
          font-family: var(--font-futura-display), var(--font-futura-nav), Futura, Century Gothic, sans-serif;
          font-size: clamp(2rem, 5vw, 3.6rem);
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 1.05;
          margin: 0 0 20px;
        }
        .ll-cta p {
          max-width: 400px;
          margin: 0 auto 40px;
          font-size: 15px;
          line-height: 1.75;
          color: rgba(255,255,255,0.5);
        }
        .ll-cta a {
          display: inline-block;
          padding: 16px 44px;
          border: 1px solid rgba(255,255,255,0.35);
          color: #FFFFFF;
          text-decoration: none;
          font-family: var(--font-futura-nav), Futura, Century Gothic, sans-serif;
          font-size: 11px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          transition: background 0.25s, color 0.25s;
        }
        .ll-cta a:hover {
          background: #FFFFFF;
          color: #111111;
        }
        .ll-state {
          padding: 100px 6vw;
          text-align: center;
          color: var(--muted);
          font-size: 14px;
        }
        .ll-reveal {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1), transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .ll-reveal.is-in {
          opacity: 1;
          transform: translateY(0);
        }
        .ll-reveal.d1 { transition-delay: 0.08s; }
        .ll-reveal.d2 { transition-delay: 0.16s; }
        @media (max-width: 900px) {
          .ll-hero { min-height: 72vh; }
          .ll-hero-copy { padding: 0 5vw 40px; }
          .ll-row,
          .ll-row.reverse { grid-template-columns: 1fr; min-height: 0; }
          .ll-row.reverse .ll-media,
          .ll-row .ll-media { order: 1; }
          .ll-row.reverse .ll-copy,
          .ll-row .ll-copy { order: 2; }
          .ll-media, .ll-media-empty { min-height: 280px; height: 52vw; max-height: 420px; }
          .ll-strip { flex-direction: column; align-items: flex-start; gap: 14px; }
        }
      `}</style>

      <div className="ll">
        <section className="ll-hero">
          <div className="ll-hero-media" aria-hidden>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/layout/love-letters-hero.jpg"
              alt=""
              fetchPriority="high"
            />
          </div>
          <div className="ll-hero-shade" aria-hidden />
          <div className="ll-hero-copy">
            <p className="ll-kicker ll-reveal">Henima Universe</p>
            <h1 className="ll-reveal d1">
              Love
              <br />
              <em>Letters.</em>
            </h1>
            <p className="ll-reveal d2">
              Kisah nyata dari orang-orang yang memakai Henima — ditulis dari hati, diabadikan di sini.
            </p>
          </div>
        </section>

        <div className="ll-strip">
          <span>
            {loading
              ? 'Memuat…'
              : `${stories.length} kisah diabadikan`}
          </span>
          <a href="/share-story">Bagikan kisahmu</a>
        </div>

        {loading ? (
          <p className="ll-state">Memuat kisah…</p>
        ) : stories.length === 0 ? (
          <p className="ll-state">Belum ada kisah. Jadilah yang pertama.</p>
        ) : (
          <div className="ll-list">
            {stories.map((s, i) => {
              const reverse = i % 2 === 1
              return (
                <article
                  key={s.id}
                  className={`ll-row${reverse ? ' reverse' : ''} ll-reveal`}
                >
                  <div className="ll-media">
                    {s.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={s.avatar_url} alt={s.name} />
                    ) : (
                      <div className="ll-media-empty" aria-hidden>
                        {s.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="ll-copy">
                    <p className="ll-meta">{fmt(s.created_at)}</p>
                    <blockquote className="ll-quote">
                      &ldquo;{s.story}&rdquo;
                    </blockquote>
                    <p className="ll-name">{s.name}</p>
                    <p className="ll-city">{s.city}</p>
                    {s.perfume && s.perfume !== 'Belum punya Henima' ? (
                      <p className="ll-perfume">{s.perfume}</p>
                    ) : null}
                    {s.admin_reply ? (
                      <div className="ll-reply">
                        <p className="ll-reply-label">Henima</p>
                        <p className="ll-reply-text">&ldquo;{s.admin_reply}&rdquo;</p>
                      </div>
                    ) : null}
                  </div>
                </article>
              )
            })}
          </div>
        )}

        <section className="ll-cta">
          <h2 className="ll-reveal">
            Kisahmu
            <br />
            layak dikenang.
          </h2>
          <p className="ll-reveal d1">
            Bagikan cerita dan fotomu. Tim Henima akan membaca setiap kisah dengan sepenuh hati.
          </p>
          <a className="ll-reveal d2" href="/share-story">
            Bagikan Kisahmu
          </a>
        </section>
      </div>
    </>
  )
}
