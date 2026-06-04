import { NextRequest, NextResponse } from 'next/server';
import { getCourierCosts } from '@/lib/rajaongkir';

export async function POST(req: NextRequest) {
  const { destinationId, weightGrams } = await req.json();
  if (!destinationId || !weightGrams) {
    return NextResponse.json({ error: 'Missing params' }, { status: 400 });
  }
  const costs = await getCourierCosts(Number(destinationId), Number(weightGrams));
  return NextResponse.json(costs);
}
