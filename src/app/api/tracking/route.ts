import { NextResponse } from 'next/server'
import { trackOrder } from '@/lib/biteship'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const resi = searchParams.get('resi')
  const courier = searchParams.get('courier') || undefined

  if (!resi) return NextResponse.json({ error: 'Resi required' }, { status: 400 })

  const data = await trackOrder(resi, courier)
  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json(data)
}
