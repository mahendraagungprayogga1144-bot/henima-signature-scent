import { getSettings } from '@/lib/db'
import { getSiteContent } from '@/lib/site-content'
import SiteContentManager from './SiteContentManager'

export const dynamic = 'force-dynamic'

export default async function AdminKontenPage() {
  const settings = await getSettings()
  const initial = getSiteContent(settings.company as any)
  return <SiteContentManager initial={initial} />
}
