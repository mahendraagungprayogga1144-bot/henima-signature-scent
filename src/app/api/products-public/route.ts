import { getDatabase } from '@/lib/db'
import { NextResponse } from 'next/server'
export async function GET() {
  const db = await getDatabase()
  const products = db.products.filter((p:any) => p.active).map((p:any) => ({ id: p.id, name: p.name, photo: p.photo, description: p.description, originalPrice: p.originalPrice, discountPrice: p.discountPrice }))
  return NextResponse.json(products)
}
