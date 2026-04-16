import fs from 'fs'
import path from 'path'

const PRESENTACIONES_DIR = path.join(process.cwd(), 'content/presentaciones')

export interface Section {
  type: string
  props: Record<string, string>
  body: string
  slots: Record<string, string>
}

export interface Presentacion {
  numero: number
  frontmatter: Record<string, string>
  sections: Section[]
}

export function hasPresentacion(numero: number): boolean {
  const fname = `clase-${numero}.md`
  return fs.existsSync(path.join(PRESENTACIONES_DIR, fname))
}

export function listPresentacionesDisponibles(): number[] {
  if (!fs.existsSync(PRESENTACIONES_DIR)) return []
  return fs
    .readdirSync(PRESENTACIONES_DIR)
    .map((f) => f.match(/^clase-(\d+)\.md$/))
    .filter((m): m is RegExpMatchArray => !!m)
    .map((m) => parseInt(m[1], 10))
    .sort((a, b) => a - b)
}

export function getPresentacion(numero: number): Presentacion | null {
  const fname = `clase-${numero}.md`
  const fpath = path.join(PRESENTACIONES_DIR, fname)
  if (!fs.existsSync(fpath)) return null

  const raw = fs.readFileSync(fpath, 'utf-8')
  const { frontmatter, body } = parseFrontmatter(raw)
  const sections = parseSections(body)
  if (sections.length === 0) return null

  return { numero, frontmatter, sections }
}

function parseFrontmatter(raw: string): { frontmatter: Record<string, string>; body: string } {
  if (!raw.startsWith('---')) return { frontmatter: {}, body: raw }
  const end = raw.indexOf('\n---', 4)
  if (end === -1) return { frontmatter: {}, body: raw }
  const header = raw.slice(4, end).trim()
  const body = raw.slice(end + 4).replace(/^\n+/, '')
  const frontmatter: Record<string, string> = {}
  for (const line of header.split('\n')) {
    const m = line.match(/^([a-zA-Z_][\w-]*):\s*(.*)$/)
    if (m) frontmatter[m[1]] = m[2].trim()
  }
  return { frontmatter, body }
}

// Parsea bloques ::: tipo ... :::
// Dentro, ::slot activa un "slot nombrado"; todo lo anterior al primer slot es body libre.
function parseSections(body: string): Section[] {
  const lines = body.split('\n')
  const sections: Section[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    const open = line.match(/^:::\s+([a-zA-Z][\w-]*)(.*)$/)
    if (!open) {
      i++
      continue
    }
    const type = open[1]
    const propsStr = open[2].trim()
    const props = parseProps(propsStr)

    // Busca cierre
    i++
    const contentLines: string[] = []
    while (i < lines.length && !/^:::\s*$/.test(lines[i])) {
      contentLines.push(lines[i])
      i++
    }
    i++ // salta el :::

    // Separa body libre y slots
    const { body: secBody, slots } = parseSlots(contentLines.join('\n'))
    sections.push({ type, props, body: secBody, slots })
  }

  return sections
}

// Props en línea de apertura: num=01 titulo="Con espacios" clases="Clases 1 y 2"
function parseProps(str: string): Record<string, string> {
  const props: Record<string, string> = {}
  if (!str) return props
  const re = /([a-zA-Z][\w-]*)=(?:"([^"]*)"|([^\s"]+))/g
  let m: RegExpExecArray | null
  while ((m = re.exec(str)) !== null) {
    props[m[1]] = m[2] ?? m[3] ?? ''
  }
  return props
}

// Slots: líneas que empiezan con ::nombre inician un slot. El contenido hasta el siguiente ::X o EOF es el slot.
function parseSlots(content: string): { body: string; slots: Record<string, string> } {
  const lines = content.split('\n')
  const slots: Record<string, string> = {}
  let currentSlot: string | null = null
  let buffer: string[] = []
  const bodyLines: string[] = []

  const commit = () => {
    if (currentSlot !== null) {
      slots[currentSlot] = buffer.join('\n').trim()
    } else {
      bodyLines.push(...buffer)
    }
    buffer = []
  }

  for (const line of lines) {
    const m = line.match(/^::([a-zA-Z][\w-]*)\s*$/)
    if (m) {
      commit()
      currentSlot = m[1]
    } else {
      buffer.push(line)
    }
  }
  commit()

  return { body: bodyLines.join('\n').trim(), slots }
}
