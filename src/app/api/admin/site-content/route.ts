import { NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { getCurrentUser } from '@/lib/session'
import { updateDatabase } from '@/lib/db'
import { DEFAULT_SITE_CONTENT, type SiteContent } from '@/lib/site-content'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  let body: { siteContent?: SiteContent }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON tidak valid' }, { status: 400 })
  }

  const incoming = body.siteContent
  if (!incoming || typeof incoming !== 'object') {
    return NextResponse.json({ error: 'siteContent wajib' }, { status: 400 })
  }

  const siteContent: SiteContent = {
    ...DEFAULT_SITE_CONTENT,
    ...incoming,
    discover: Array.isArray(incoming.discover) ? incoming.discover : DEFAULT_SITE_CONTENT.discover,
    universe: { ...DEFAULT_SITE_CONTENT.universe, ...(incoming.universe || {}) },
    stores: { ...DEFAULT_SITE_CONTENT.stores, ...(incoming.stores || {}) },
    happenings: { ...DEFAULT_SITE_CONTENT.happenings, ...(incoming.happenings || {}) },
    newsletter: { ...DEFAULT_SITE_CONTENT.newsletter, ...(incoming.newsletter || {}) },
    loveLetters: { ...DEFAULT_SITE_CONTENT.loveLetters, ...(incoming.loveLetters || {}) },
    faq: {
      items: Array.isArray(incoming.faq?.items) ? incoming.faq.items : [],
      waNote: String(incoming.faq?.waNote || ''),
    },
    footer: { ...DEFAULT_SITE_CONTENT.footer, ...(incoming.footer || {}) },
  }

  await updateDatabase((db) => {
    db.settings.company.siteContent = siteContent
  })

  try {
    revalidateTag('settings')
    revalidateTag('products')
  } catch {
    /* ignore in local */
  }

  return NextResponse.json({ ok: true })
}
