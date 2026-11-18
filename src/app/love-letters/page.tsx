import { getSettings } from '@/lib/db'
import { getSiteContent } from '@/lib/site-content'
import LoveWallClient from './LoveWallClient'

export const revalidate = 300

export default async function LoveLettersPage() {
  const settings = await getSettings()
  const site = getSiteContent(settings.company as any)
  return <LoveWallClient chrome={site.loveLetters} />
}
