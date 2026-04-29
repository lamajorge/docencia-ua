import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const path = req.nextUrl.searchParams.get('path') || '/clases'
  const secret = req.nextUrl.searchParams.get('secret')

  // Si REVALIDATE_SECRET está configurado, exigir match. Si no, dejar libre.
  const expected = process.env.REVALIDATE_SECRET
  if (expected && secret !== expected) {
    return NextResponse.json({ ok: false, error: 'Invalid secret' }, { status: 401 })
  }

  try {
    revalidatePath(path)
    return NextResponse.json({ ok: true, path, revalidated: true, now: new Date().toISOString() })
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: 'Revalidation failed', details: String(err) },
      { status: 500 }
    )
  }
}
