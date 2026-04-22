import { Client } from '@notionhq/client'
import { NotionToMarkdown } from 'notion-to-md'
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import { getPresentacion, listPresentacionesDisponibles } from './presentaciones'

export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

const n2m = new NotionToMarkdown({ notionClient: notion })

function isNotionConfigured(): boolean {
  return !!process.env.NOTION_TOKEN && !!process.env.NOTION_DATABASE_ID
}

// Genera una entrada a partir del frontmatter de una presentación local.
// Se usa como fallback cuando Notion no está configurado (dev local) o falla.
function entryFromPresentacion(numero: number): ClaseEntry | null {
  const pres = getPresentacion(numero)
  if (!pres) return null
  const f = pres.frontmatter
  return {
    id: String(numero).padStart(2, '0'),
    numero,
    titulo: f.titulo || `Clase ${numero}`,
    fecha: f.fecha || null,
    semana: null,
    unidad: f.unidad || null,
    dia: null,
    estado: null,
    contenidosClave: null,
    notionPageId: '',
  }
}

export interface ClaseEntry {
  id: string
  numero: number
  titulo: string
  fecha: string | null
  semana: number | null
  unidad: string | null
  dia: string | null
  estado: string | null
  contenidosClave: string | null
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

// Busca una propiedad por cualquiera de los nombres candidatos (tolerante a espacios/acentos).
function findProp(props: Record<string, any>, ...candidates: string[]): any {
  const keys = Object.keys(props)
  for (const c of candidates) {
    const target = c.toLowerCase().trim()
    const key = keys.find((k) => k.toLowerCase().trim() === target)
    if (key) return props[key]
  }
  return null
}

function getText(prop: any): string {
  if (!prop) return ''
  if (prop.type === 'title') return prop.title.map((t: any) => t.plain_text).join('')
  if (prop.type === 'rich_text') return prop.rich_text.map((t: any) => t.plain_text).join('')
  if (prop.type === 'select') return prop.select?.name ?? ''
  if (prop.type === 'status') return prop.status?.name ?? ''
  if (prop.type === 'multi_select') return prop.multi_select.map((s: any) => s.name).join(', ')
  if (prop.type === 'number') return prop.number != null ? String(prop.number) : ''
  if (prop.type === 'date') return prop.date?.start ?? ''
  return ''
}

function getNumber(prop: any): number | null {
  if (!prop) return null
  if (prop.type === 'number') return prop.number ?? null
  if (prop.type === 'title') {
    const s = prop.title.map((t: any) => t.plain_text).join('').trim()
    const n = parseInt(s, 10)
    return isNaN(n) ? null : n
  }
  if (prop.type === 'rich_text') {
    const s = prop.rich_text.map((t: any) => t.plain_text).join('').trim()
    const n = parseInt(s, 10)
    return isNaN(n) ? null : n
  }
  return null
}

function localClases(): ClaseEntry[] {
  return listPresentacionesDisponibles()
    .map((n) => entryFromPresentacion(n))
    .filter((c): c is ClaseEntry => c !== null)
}

export async function getClases(): Promise<ClaseEntry[]> {
  if (!isNotionConfigured()) return localClases()

  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID!,
      page_size: 100,
    })

    const clases: ClaseEntry[] = response.results
      .filter((r): r is PageObjectResponse => r.object === 'page' && 'properties' in r)
      .map((page) => {
        const props = page.properties as Record<string, any>

        const numero =
          getNumber(findProp(props, 'Clase', 'Número', 'Numero', 'N°')) ?? 0

        const titulo =
          getText(findProp(props, 'Título de la clase', 'Titulo de la clase', 'Título', 'Titulo', 'Name')) ||
          'Sin título'

        return {
          id: String(numero).padStart(2, '0'),
          numero,
          titulo,
          fecha: getText(findProp(props, 'Fecha', 'Date')) || null,
          semana: getNumber(findProp(props, 'Semana')),
          unidad: getText(findProp(props, 'Unidad')) || null,
          dia: getText(findProp(props, 'Día', 'Dia')) || null,
          estado: getText(findProp(props, 'Estado', 'Status')) || null,
          contenidosClave: getText(findProp(props, 'Contenidos clave')) || null,
          notionPageId: page.id,
        }
      })
      .filter((c) => c.numero > 0)

    clases.sort((a, b) => a.numero - b.numero)

    // Si Notion respondió pero no hay entradas válidas, usar archivos locales.
    return clases.length > 0 ? clases : localClases()
  } catch {
    return localClases()
  }
}

export async function getClaseByNumero(numero: number): Promise<ClaseDetalle | null> {
  // Fallback: si Notion no está configurado, construir stub desde presentación local.
  if (!isNotionConfigured()) {
    const entrada = entryFromPresentacion(numero)
    if (!entrada) return null
    return { ...entrada, markdown: '', bloques: [] }
  }

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
