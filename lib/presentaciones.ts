import fs from 'fs'
import path from 'path'

const PRESENTACIONES_DIR = path.join(process.cwd(), 'content/presentaciones')

export interface Slide {
  titulo: string
  contenido: string
}

export interface Presentacion {
  numero: number
  slides: Slide[]
}

export function getPresentacion(numero: number): Presentacion | null {
  const fname = `clase-${String(numero).padStart(2, '0')}.md`
  const fpath = path.join(PRESENTACIONES_DIR, fname)
  if (!fs.existsSync(fpath)) return null

  const raw = fs.readFileSync(fpath, 'utf-8')
  const body = stripFrontmatter(raw)
  const slides = parseSlides(body)
  if (slides.length === 0) return null

  return { numero, slides }
}

export function hasPresentacion(numero: number): boolean {
  const fname = `clase-${String(numero).padStart(2, '0')}.md`
  const fpath = path.join(PRESENTACIONES_DIR, fname)
  return fs.existsSync(fpath)
}

export function listPresentacionesDisponibles(): number[] {
  if (!fs.existsSync(PRESENTACIONES_DIR)) return []
  const files = fs.readdirSync(PRESENTACIONES_DIR)
  const nums: number[] = []
  for (const f of files) {
    const m = f.match(/^clase-(\d+)\.md$/)
    if (m) nums.push(parseInt(m[1], 10))
  }
  return nums.sort((a, b) => a - b)
}

function stripFrontmatter(raw: string): string {
  if (!raw.startsWith('---')) return raw
  const end = raw.indexOf('\n---\n', 4)
  if (end === -1) return raw
  return raw.slice(end + 5).trimStart()
}

// Separa slides por líneas que sean exactamente '---' (thematic break markdown).
// Requiere `\n---\n` para distinguir de uso inline.
function parseSlides(body: string): Slide[] {
  const chunks = body.split(/\n---\n/)
  const slides: Slide[] = []

  for (const chunk of chunks) {
    const trimmed = chunk.trim()
    if (!trimmed) continue

    const lines = trimmed.split('\n')
    let titulo = ''
    let contenido = trimmed

    if (/^#{1,2}\s/.test(lines[0])) {
      titulo = lines[0].replace(/^#+\s*/, '').trim()
      contenido = lines.slice(1).join('\n').trim()
    }

    slides.push({ titulo, contenido })
  }

  return slides
}
