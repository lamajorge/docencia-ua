import { Client } from '@notionhq/client'
import { NotionToMarkdown } from 'notion-to-md'
import type {
  PageObjectResponse,
  DatabaseObjectResponse,
} from '@notionhq/client/build/src/api-endpoints'

// ─── Cliente singleton ────────────────────────────────────────────────────────

export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

const n2m = new NotionToMarkdown({ notionClient: notion })

// ─── Tipos ────────────────────────────────────────────────────────────────────

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

// ─── Helpers para extraer propiedades de Notion ───────────────────────────────

function getText(prop: any): string {
  if (!prop) return ''
  if (prop.type === 'title') return prop.title.map((t: any) => t.plain_text).join('')
  if (prop.type === 'rich_text') return prop.rich_text.map((t: any) => t.plain_text).join('')
  if (prop.type === 'number') return String(prop.number ?? '')
  if (prop.type === 'select') return prop.select?.name ?? ''
  if (prop.type === 'date') return prop.date?.start ?? ''
  return ''
}

function getNumber(prop: any): number | null {
  if (!prop || prop.type !== 'number') return null
  return prop.number ?? null
}

// ─── Obtener todas las clases desde la database ───────────────────────────────

export async function getClases(): Promise<ClaseEntry[]> {
  const dbId = process.env.NOTION_DATABASE_ID!
  const response = await notion.databases.query({
    database_id: dbId,
    sorts: [{ property: 'Número', direction: 'ascending' }],
  })

  return response.results
    .filter((r): r is PageObjectResponse => r.object === 'page')
    .map((page) => {
      const props = page.properties as any
      // Intentamos varios nombres de propiedad comunes en Notion
      const numero =
        getNumber(props['Número']) ??
        getNumber(props['Numero']) ??
        getNumber(props['N°']) ??
        0
      const titulo =
        getText(props['Título']) ||
        getText(props['Titulo']) ||
        getText(props['Name']) ||
        getText(props['title']) ||
        'Sin título'
      return {
        id: String(numero).padStart(2, '0'),
        numero,
        titulo,
        fecha: getText(props['Fecha']) || null,
        semana: getNumber(props['Semana']) ?? null,
        unidad: getText(props['Unidad']) || null,
        notionPageId: page.id,
      }
    })
    .filter((c) => c.numero > 0)
}

// ─── Obtener detalle de una clase por su número ───────────────────────────────

export async function getClaseByNumero(numero: number): Promise<ClaseDetalle | null> {
  const clases = await getClases()
  const entrada = clases.find((c) => c.numero === numero)
  if (!entrada) return null

  // Convertir el contenido de Notion a Markdown
  const mdBlocks = await n2m.pageToMarkdown(entrada.notionPageId)
  const markdown = n2m.toMarkdownString(mdBlocks).parent

  // Parsear bloques temáticos separados por ## headings
  const bloques = parseBloques(markdown)

  return { ...entrada, markdown, bloques }
}

// ─── Parsear bloques desde el markdown de la guía ────────────────────────────

function parseBloques(markdown: string): BloqueTematico[] {
  const lines = markdown.split('\n')
  const bloques: BloqueTematico[] = []
  let current: BloqueTematico | null = null

  for (const line of lines) {
    // Detectamos encabezados ## como separadores de bloques
    if (line.startsWith('## ')) {
      if (current) bloques.push(current)
      current = { titulo: line.replace('## ', '').trim(), contenido: '' }
    } else if (line.startsWith('# ')) {
      // h1 = título de la clase, lo saltamos (ya lo tenemos)
      continue
    } else if (current) {
      current.contenido += line + '\n'
    }
  }
  if (current) bloques.push(current)
  return bloques
}

// ─── Revalidación: cuántos segundos cachear en Vercel ────────────────────────
// Con ISR, Next.js regenerará la página en background cada X segundos
export const REVALIDATE_SECONDS = 60 * 30 // 30 minutos
