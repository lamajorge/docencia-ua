import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { Marp } from '@marp-team/marp-core'
import { getMarpMarkdownFromNotion, REVALIDATE_SECONDS } from '@/lib/notion'

export const revalidate = REVALIDATE_SECONDS

let cachedTheme: string | null = null
function loadTheme(): string {
  if (cachedTheme) return cachedTheme
  try {
    cachedTheme = fs.readFileSync(path.join(process.cwd(), 'marp', 'theme-ua.css'), 'utf-8')
    return cachedTheme
  } catch {
    return ''
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const numero = parseInt(params.id)
  if (isNaN(numero)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  }

  // Fuente: Notion. Fallback: archivo local marp/clase-N.md
  let marpMarkdown = await getMarpMarkdownFromNotion(numero)
  if (!marpMarkdown) {
    try {
      marpMarkdown = fs.readFileSync(
        path.join(process.cwd(), 'marp', `clase-${numero}.md`),
        'utf-8'
      )
    } catch {
      return new Response('No Marp content for this class', { status: 404 })
    }
  }

  const marp = new Marp({ html: true, math: false })
  const themeCSS = loadTheme()
  if (themeCSS) {
    try { marp.themeSet.add(themeCSS) } catch {}
  }

  const { html, css } = marp.render(marpMarkdown)

  const fullHtml = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Clase ${numero}</title>
<style>
${css}
html, body { margin: 0; padding: 0; background: #0D0D0D; min-height: 100%; }
.marpit { padding: 24px 16px; display: flex; flex-direction: column; align-items: center; gap: 24px; }
.marpit > svg[data-marpit-svg] {
  display: block;
  width: min(1280px, 100%);
  height: auto;
  aspect-ratio: 16 / 9;
  background: var(--sand, #F5F3EF);
  box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  border-radius: 4px;
}
@media print {
  html, body { background: #fff; }
  .marpit { padding: 0; gap: 0; }
  .marpit > svg[data-marpit-svg] { box-shadow: none; border-radius: 0; width: 100%; max-width: none; page-break-after: always; break-after: page; }
}
</style>
</head>
<body>
${html}
</body>
</html>`

  return new Response(fullHtml, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': `public, max-age=0, s-maxage=${REVALIDATE_SECONDS}, stale-while-revalidate=86400`,
    },
  })
}
