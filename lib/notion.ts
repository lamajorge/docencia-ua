import { Client } from '@notionhq/client'
import { NotionToMarkdown } from 'notion-to-md'

export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

const n2m = new NotionToMarkdown({ notionClient: notion })

export interface ClaseEntry {
  id: string
  numero: number
  titulo: string
  fecha: string | null
  semana: number | null
  unidad: string | null
  notionPageId: string
}

export interface ClaseDetalle extends ClaseEntry {
  markdown: string
  bloques: BloqueTematico[]
}

export interface BloqueTematico {
  titulo: string
  contenido: string
}

// Extrae "numero" y "titulo limpio" desde el título de la subpágina.
// Acepta: "Clase 1: Intro", "Clase 01 — Intro", "01. Intro", "1 - Intro", etc.
function parseTituloSubpagina(raw: string): { numero: number; titulo: string } {
  const trimmed = raw.trim()
  const match = trimmed.match(/^(?:clase\s*)?(\d+)\s*[:.\-–—]?\s*(.*)$/i)
  if (!match) return { numero: 0, titulo: trimmed }
  const numero = parseInt(match[1], 10)
  const titulo = match[2].trim() || trimmed
  return { numero, titulo }
}

// Recupera el título de una subpágina (el bloque child_page trae solo el title).
async function getSubpageTitle(blockId: string, fallback: string): Promise<string> {
  try {
    const page = await notion.pages.retrieve({ page_id: blockId })
    const props = (page as any).properties
    if (props) {
      for (const key of Object.keys(props)) {
        const p = props[key]
        if (p?.type === 'title') {
          return p.title.map((t: any) => t.plain_text).join('') || fallback
        }
      }
    }
  } catch {}
  return fallback
}

// Lista las subpáginas (clases) de la página padre.
export async function getClases(): Promise<ClaseEntry[]> {
  const pageId = process.env.NOTION_PAGE_ID
  if (!pageId) throw new Error('NOTION_PAGE_ID no configurado')

  const children = await notion.blocks.children.list({
    block_id: pageId,
    page_size: 100,
  })

  const clases: ClaseEntry[] = []
  for (const block of children.results) {
    if ((block as any).type !== 'child_page') continue
    const b: any = block
    const rawTitle: string = b.child_page?.title ?? ''
    const fullTitle = await getSubpageTitle(b.id, rawTitle)
    const { numero, titulo } = parseTituloSubpagina(fullTitle)
    if (numero <= 0) continue
    clases.push({
      id: String(numero).padStart(2, '0'),
      numero,
      titulo,
      fecha: null,
      semana: null,
      unidad: null,
      notionPageId: b.id,
    })
  }

  clases.sort((a, b) => a.numero - b.numero)
  return clases
}

export async function getClaseByNumero(numero: number): Promise<ClaseDetalle | null> {
  const clases = await getClases()
  const entrada = clases.find((c) => c.numero === numero)
  if (!entrada) return null

  const mdBlocks = await n2m.pageToMarkdown(entrada.notionPageId)
  const markdown = n2m.toMarkdownString(mdBlocks).parent ?? ''

  const bloques = parseBloques(markdown)

  return { ...entrada, markdown, bloques }
}

function parseBloques(markdown: string): BloqueTematico[] {
  const lines = markdown.split('\n')
  const bloques: BloqueTematico[] = []
  let current: BloqueTematico | null = null

  for (const line of lines) {
    if (line.startsWith('## ')) {
      if (current) bloques.push(current)
      current = { titulo: line.replace('## ', '').trim(), contenido: '' }
    } else if (line.startsWith('# ')) {
      continue
    } else if (current) {
      current.contenido += line + '\n'
    }
  }
  if (current) bloques.push(current)
  return bloques
}

export const REVALIDATE_SECONDS = 60 * 30
