/** Editable marketing photos + copy. Stored in settings.company.siteContent */

export type DiscoverTileContent = {
  name: string
  image: string
  href: string
}

export type DualBandContent = {
  name: string
  image: string
  href: string
  cta: string
}

export type SiteContent = {
  discover: DiscoverTileContent[]
  universe: {
    image: string
    title: string
    ctaLabel: string
    ctaHref: string
  }
  stores: DualBandContent
  happenings: DualBandContent
  newsletter: {
    title: string
    body: string
  }
  loveLetters: {
    heroImage: string
    kicker: string
    title: string
    titleEm: string
    intro: string
    ctaLabel: string
  }
  faq: {
    items: Array<{ q: string; a: string }>
    waNote: string
  }
  footer: {
    copyright: string
  }
}

export const DEFAULT_SITE_CONTENT: SiteContent = {
  discover: [
    { name: 'Afternoon', image: '/products/afternoon/lifestyle-car.jpg', href: '/shop/afternoon' },
    { name: 'The Distance', image: '/layout/discover-2.jpg?v=6', href: '/shop' },
    { name: 'Signature', image: '/layout/discover-3.jpg?v=8', href: '/shop' },
    { name: 'Intimate', image: '/layout/discover-4.jpg?v=7', href: '/shop' },
  ],
  universe: {
    image: '/layout/universe.jpg?v=9',
    title: 'For a more beautiful world',
    ctaLabel: 'The world by Henima ›',
    ctaHref: '/our-story',
  },
  stores: {
    name: 'Our Stores',
    image: '/layout/stores.jpg?v=7',
    href: '/faq',
    cta: 'Find our points of sale ›',
  },
  happenings: {
    name: 'Henima Happenings',
    image: '/layout/happenings.jpg?v=7',
    href: '/blog',
    cta: 'Find out more ›',
  },
  newsletter: {
    title: 'Create a connection',
    body: 'Subscribe to our newsletter, share the good news, and create a more beautiful world together.',
  },
  loveLetters: {
    heroImage: '/layout/love-letters-hero.jpg',
    kicker: 'Henima Universe',
    title: 'Love',
    titleEm: 'Letters.',
    intro:
      'Kisah nyata dari orang-orang yang memakai Henima — ditulis dari hati, diabadikan di sini.',
    ctaLabel: 'Bagikan kisahmu',
  },
  faq: {
    items: [],
    waNote: '',
  },
  footer: {
    copyright: '',
  },
}

export function getSiteContent(company: Record<string, unknown> | null | undefined): SiteContent {
  const raw = (company as { siteContent?: Partial<SiteContent> } | null | undefined)?.siteContent
  if (!raw || typeof raw !== 'object') return DEFAULT_SITE_CONTENT

  return {
    discover:
      Array.isArray(raw.discover) && raw.discover.length
        ? raw.discover.map((d, i) => ({
            name: String(d?.name || DEFAULT_SITE_CONTENT.discover[i]?.name || `Chapter ${i + 1}`),
            image: String(d?.image || DEFAULT_SITE_CONTENT.discover[i]?.image || ''),
            href: String(d?.href || DEFAULT_SITE_CONTENT.discover[i]?.href || '/shop'),
          }))
        : DEFAULT_SITE_CONTENT.discover,
    universe: {
      ...DEFAULT_SITE_CONTENT.universe,
      ...(raw.universe || {}),
    },
    stores: {
      ...DEFAULT_SITE_CONTENT.stores,
      ...(raw.stores || {}),
    },
    happenings: {
      ...DEFAULT_SITE_CONTENT.happenings,
      ...(raw.happenings || {}),
    },
    newsletter: {
      ...DEFAULT_SITE_CONTENT.newsletter,
      ...(raw.newsletter || {}),
    },
    loveLetters: {
      ...DEFAULT_SITE_CONTENT.loveLetters,
      ...(raw.loveLetters || {}),
    },
    faq: {
      items: Array.isArray(raw.faq?.items) ? raw.faq.items : DEFAULT_SITE_CONTENT.faq.items,
      waNote: String(raw.faq?.waNote ?? DEFAULT_SITE_CONTENT.faq.waNote),
    },
    footer: {
      ...DEFAULT_SITE_CONTENT.footer,
      ...(raw.footer || {}),
    },
  }
}
