import { getDatabase } from '@/lib/db'
import { NextResponse } from 'next/server'
export async function GET() {
  const db = await getDatabase()
  const products = db.products.filter((p:any) => p.active).map((p:any) => ({ id: p.id, name: p.name }))
  return NextResponse.json(products)
}
