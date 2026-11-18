'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import type { SiteContent } from '@/lib/site-content'

async function uploadBrand(file: File, prefix: string) {
  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const ext = file.name.split('.').pop() || 'jpg'
  const filename = `${prefix}-${Date.now()}.${ext}`
  const { error } = await sb.storage
    .from('brand-assets')
    .upload(filename, file, { contentType: file.type, upsert: true })
  if (error) throw new Error(error.message)
  const { data } = sb.storage.from('brand-assets').getPublicUrl(filename)
  return data.publicUrl
}

function Field({
  label,
  value,
  onChange,
  multiline,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  multiline?: boolean
}) {
  return (
    <div>
      <label className="label">{label}</label>
      {multiline ? (
        <textarea
          className="input-field"
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input className="input-field" value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  )
}

function PhotoField({
  label,
  url,
  onUploaded,
  prefix,
}: {
  label: string
  url: string
  onUploaded: (url: string) => void
  prefix: string
}) {
  const [busy, setBusy] = useState(false)
  return (
    <div className="space-y-2">
      <label className="label">{label}</label>
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt=""
          className="h-28 w-full max-w-xs object-cover rounded-xl border border-ink-800"
        />
      ) : (
        <div className="h-28 max-w-xs rounded-xl border border-dashed border-ink-700 flex items-center justify-center text-xs text-ink-500">
          Belum ada foto
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        disabled={busy}
        className="block w-full text-sm text-ink-300 file:mr-3 file:rounded-lg file:border-0 file:bg-ink-900 file:px-3 file:py-2 file:text-xs file:text-ink-50"
        onChange={async (e) => {
          const f = e.target.files?.[0]
          if (!f) return
          setBusy(true)
          try {
            onUploaded(await uploadBrand(f, prefix))
          } catch (err: any) {
            alert(err.message || 'Upload gagal')
          } finally {
            setBusy(false)
            e.target.value = ''
          }
        }}
      />
      {busy ? <p className="text-xs text-gold-300">Mengupload…</p> : null}
    </div>
  )
}

export default function SiteContentManager({ initial }: { initial: SiteContent }) {
  const [content, setContent] = useState<SiteContent>(initial)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  async function save() {
    setSaving(true)
    setMsg('')
    try {
      const res = await fetch('/api/admin/site-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteContent: content }),
      })
      if (!res.ok) {
        const t = await res.text()
        setMsg(t || 'Gagal menyimpan')
        return
      }
      setMsg('Konten situs tersimpan. Homepage & halaman terkait akan update (cache ±5 menit).')
    } catch {
      setMsg('Kesalahan jaringan')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-ink-50">Konten Situs</h1>
          <p className="text-sm text-ink-400 mt-1">
            Edit foto & tulisan homepage, Love Letters, FAQ, newsletter. Perubahan langsung ke web publik.
          </p>
        </div>
        <button type="button" className="btn-primary" disabled={saving} onClick={save}>
          {saving ? 'Menyimpan…' : 'Simpan Semua'}
        </button>
      </div>
      {msg ? <p className="text-sm text-ink-200">{msg}</p> : null}

      <section className="card space-y-4">
        <h2 className="text-lg font-semibold text-ink-50">Discover (4 tile homepage)</h2>
        {content.discover.map((d, i) => (
          <div key={i} className="rounded-xl border border-ink-800 p-4 grid gap-3 sm:grid-cols-2">
            <PhotoField
              label={`Foto tile ${i + 1}`}
              url={d.image}
              prefix={`discover-${i}`}
              onUploaded={(image) =>
                setContent((c) => {
                  const discover = [...c.discover]
                  discover[i] = { ...discover[i], image }
                  return { ...c, discover }
                })
              }
            />
            <div className="space-y-3">
              <Field
                label="Nama"
                value={d.name}
                onChange={(name) =>
                  setContent((c) => {
                    const discover = [...c.discover]
                    discover[i] = { ...discover[i], name }
                    return { ...c, discover }
                  })
                }
              />
              <Field
                label="Link (href)"
                value={d.href}
                onChange={(href) =>
                  setContent((c) => {
                    const discover = [...c.discover]
                    discover[i] = { ...discover[i], href }
                    return { ...c, discover }
                  })
                }
              />
            </div>
          </div>
        ))}
      </section>

      <section className="card space-y-4">
        <h2 className="text-lg font-semibold text-ink-50">Universe band</h2>
        <PhotoField
          label="Foto background"
          url={content.universe.image}
          prefix="universe"
          onUploaded={(image) => setContent((c) => ({ ...c, universe: { ...c.universe, image } }))}
        />
        <Field
          label="Judul"
          value={content.universe.title}
          onChange={(title) => setContent((c) => ({ ...c, universe: { ...c.universe, title } }))}
        />
        <Field
          label="Teks CTA"
          value={content.universe.ctaLabel}
          onChange={(ctaLabel) =>
            setContent((c) => ({ ...c, universe: { ...c.universe, ctaLabel } }))
          }
        />
        <Field
          label="Link CTA"
          value={content.universe.ctaHref}
          onChange={(ctaHref) =>
            setContent((c) => ({ ...c, universe: { ...c.universe, ctaHref } }))
          }
        />
      </section>

      <section className="card space-y-4">
        <h2 className="text-lg font-semibold text-ink-50">Our Stores</h2>
        <PhotoField
          label="Foto"
          url={content.stores.image}
          prefix="stores"
          onUploaded={(image) => setContent((c) => ({ ...c, stores: { ...c.stores, image } }))}
        />
        <Field
          label="Judul"
          value={content.stores.name}
          onChange={(name) => setContent((c) => ({ ...c, stores: { ...c.stores, name } }))}
        />
        <Field
          label="CTA"
          value={content.stores.cta}
          onChange={(cta) => setContent((c) => ({ ...c, stores: { ...c.stores, cta } }))}
        />
        <Field
          label="Link"
          value={content.stores.href}
          onChange={(href) => setContent((c) => ({ ...c, stores: { ...c.stores, href } }))}
        />
      </section>

      <section className="card space-y-4">
        <h2 className="text-lg font-semibold text-ink-50">Happenings</h2>
        <PhotoField
          label="Foto"
          url={content.happenings.image}
          prefix="happenings"
          onUploaded={(image) =>
            setContent((c) => ({ ...c, happenings: { ...c.happenings, image } }))
          }
        />
        <Field
          label="Judul"
          value={content.happenings.name}
          onChange={(name) =>
            setContent((c) => ({ ...c, happenings: { ...c.happenings, name } }))
          }
        />
        <Field
          label="CTA"
          value={content.happenings.cta}
          onChange={(cta) =>
            setContent((c) => ({ ...c, happenings: { ...c.happenings, cta } }))
          }
        />
        <Field
          label="Link"
          value={content.happenings.href}
          onChange={(href) =>
            setContent((c) => ({ ...c, happenings: { ...c.happenings, href } }))
          }
        />
      </section>

      <section className="card space-y-4">
        <h2 className="text-lg font-semibold text-ink-50">Newsletter</h2>
        <Field
          label="Judul"
          value={content.newsletter.title}
          onChange={(title) =>
            setContent((c) => ({ ...c, newsletter: { ...c.newsletter, title } }))
          }
        />
        <Field
          label="Teks"
          multiline
          value={content.newsletter.body}
          onChange={(body) =>
            setContent((c) => ({ ...c, newsletter: { ...c.newsletter, body } }))
          }
        />
      </section>

      <section className="card space-y-4">
        <h2 className="text-lg font-semibold text-ink-50">Love Letters (chrome halaman)</h2>
        <PhotoField
          label="Hero foto"
          url={content.loveLetters.heroImage}
          prefix="love-letters-hero"
          onUploaded={(heroImage) =>
            setContent((c) => ({ ...c, loveLetters: { ...c.loveLetters, heroImage } }))
          }
        />
        <Field
          label="Kicker"
          value={content.loveLetters.kicker}
          onChange={(kicker) =>
            setContent((c) => ({ ...c, loveLetters: { ...c.loveLetters, kicker } }))
          }
        />
        <Field
          label="Judul baris 1"
          value={content.loveLetters.title}
          onChange={(title) =>
            setContent((c) => ({ ...c, loveLetters: { ...c.loveLetters, title } }))
          }
        />
        <Field
          label="Judul baris 2"
          value={content.loveLetters.titleEm}
          onChange={(titleEm) =>
            setContent((c) => ({ ...c, loveLetters: { ...c.loveLetters, titleEm } }))
          }
        />
        <Field
          label="Intro"
          multiline
          value={content.loveLetters.intro}
          onChange={(intro) =>
            setContent((c) => ({ ...c, loveLetters: { ...c.loveLetters, intro } }))
          }
        />
        <Field
          label="Teks tombol bagikan"
          value={content.loveLetters.ctaLabel}
          onChange={(ctaLabel) =>
            setContent((c) => ({ ...c, loveLetters: { ...c.loveLetters, ctaLabel } }))
          }
        />
      </section>

      <section className="card space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-ink-50">FAQ</h2>
          <button
            type="button"
            className="btn-secondary !py-2"
            onClick={() =>
              setContent((c) => ({
                ...c,
                faq: { ...c.faq, items: [...c.faq.items, { q: '', a: '' }] },
              }))
            }
          >
            + Tambah FAQ
          </button>
        </div>
        <Field
          label="Catatan WA / kontak (opsional)"
          value={content.faq.waNote}
          onChange={(waNote) => setContent((c) => ({ ...c, faq: { ...c.faq, waNote } }))}
        />
        {content.faq.items.map((item, i) => (
          <div key={i} className="rounded-xl border border-ink-800 p-4 space-y-3">
            <Field
              label={`Pertanyaan ${i + 1}`}
              value={item.q}
              onChange={(q) =>
                setContent((c) => {
                  const items = [...c.faq.items]
                  items[i] = { ...items[i], q }
                  return { ...c, faq: { ...c.faq, items } }
                })
              }
            />
            <Field
              label="Jawaban"
              multiline
              value={item.a}
              onChange={(a) =>
                setContent((c) => {
                  const items = [...c.faq.items]
                  items[i] = { ...items[i], a }
                  return { ...c, faq: { ...c.faq, items } }
                })
              }
            />
            <button
              type="button"
              className="text-xs text-red-300"
              onClick={() =>
                setContent((c) => ({
                  ...c,
                  faq: { ...c.faq, items: c.faq.items.filter((_, j) => j !== i) },
                }))
              }
            >
              Hapus FAQ ini
            </button>
          </div>
        ))}
        {!content.faq.items.length ? (
          <p className="text-sm text-ink-400">
            Kosong = halaman FAQ pakai daftar bawaan kode. Tambah item di sini untuk override.
          </p>
        ) : null}
      </section>

      <section className="card space-y-4">
        <h2 className="text-lg font-semibold text-ink-50">Footer</h2>
        <Field
          label="Teks copyright (kosong = otomatis tahun + HENIMA SIGNATURE SCENT)"
          value={content.footer.copyright}
          onChange={(copyright) =>
            setContent((c) => ({ ...c, footer: { ...c.footer, copyright } }))
          }
        />
      </section>

      <button type="button" className="btn-primary w-full sm:w-auto" disabled={saving} onClick={save}>
        {saving ? 'Menyimpan…' : 'Simpan Semua'}
      </button>
    </div>
  )
}
