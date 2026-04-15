import { NextRequest, NextResponse } from 'next/server'
import { searchManuales } from '@/lib/manuales'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') ?? ''
  if (!q.trim()) {
    return NextResponse.json({ results: [] })
  }
  const results = searchManuales(q, 15)
  return NextResponse.json({ results })
}
