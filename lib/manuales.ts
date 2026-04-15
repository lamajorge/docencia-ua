import fs from 'fs'
import path from 'path'

const MANUALES_DIR = path.join(process.cwd(), 'content/manuales')

export interface ChapterMeta {
  book: 'samuelson' | 'casefair'
  authors: string
  edition: string
  chapter: number
  title: string
  chars: number
}

export interface Chapter extends ChapterMeta {
  content: string // markdown body (without frontmatter)
}

export interface BookIndex {
  title: string
  edition: string
  authors: string
  chapters: { num: number; title: string; chars: number }[]
}

export interface ManualesIndex {
  samuelson: BookIndex
  casefair: BookIndex
}

// ── Index ─────────────────────────────────────────────────────────────────────

export function getManualesIndex(): ManualesIndex {
  const raw = fs.readFileSync(path.join(MANUALES_DIR, 'index.json'), 'utf-8')
  return JSON.parse(raw)
}

// ── Individual chapter ────────────────────────────────────────────────────────

export function getChapter(
  book: 'samuelson' | 'casefair',
  num: number
): Chapter | null {
  const fname = `${book}-cap${String(num).padStart(2, '0')}.md`
  const fpath = path.join(MANUALES_DIR, book, fname)
  if (!fs.existsSync(fpath)) return null

  const raw = fs.readFileSync(fpath, 'utf-8')
  const { meta, body } = parseFrontmatter(raw)

  return {
    book: meta.book as 'samuelson' | 'casefair',
    authors: meta.authors ?? '',
    edition: meta.edition ?? '',
    chapter: Number(meta.chapter),
    title: meta.title ?? '',
    chars: Number(meta.chars ?? 0),
    content: body,
  }
}

// ── All chapters for a book ───────────────────────────────────────────────────

export function getAllChapters(book: 'samuelson' | 'casefair'): ChapterMeta[] {
  const index = getManualesIndex()
  return index[book].chapters.map((c) => ({
    book,
    authors: index[book].authors,
    edition: index[book].edition,
    chapter: c.num,
    title: c.title,
    chars: c.chars,
  }))
}

// ── Frontmatter parser (no external dep) ─────────────────────────────────────

function parseFrontmatter(raw: string): { meta: Record<string, string>; body: string } {
  if (!raw.startsWith('---')) return { meta: {}, body: raw }
  const end = raw.indexOf('\n---\n', 4)
  if (end === -1) return { meta: {}, body: raw }

  const fmLines = raw.slice(4, end).split('\n')
  const meta: Record<string, string> = {}
  for (const line of fmLines) {
    const colon = line.indexOf(':')
    if (colon === -1) continue
    const key = line.slice(0, colon).trim()
    const val = line.slice(colon + 1).trim().replace(/^"|"$/g, '')
    meta[key] = val
  }
  return { meta, body: raw.slice(end + 5).trim() }
}

// ── Search (simple keyword match across chapters) ────────────────────────────

export interface SearchResult {
  book: 'samuelson' | 'casefair'
  chapter: number
  title: string
  excerpt: string
  score: number
}

export function searchManuales(query: string, maxResults = 10): SearchResult[] {
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 2)

  if (terms.length === 0) return []

  const index = getManualesIndex()
  const results: SearchResult[] = []

  for (const book of ['samuelson', 'casefair'] as const) {
    const dir = path.join(MANUALES_DIR, book)
    for (const ch of index[book].chapters) {
      const fname = `${book}-cap${String(ch.num).padStart(2, '0')}.md`
      const fpath = path.join(dir, fname)
      if (!fs.existsSync(fpath)) continue

      const raw = fs.readFileSync(fpath, 'utf-8').toLowerCase()
      let score = 0
      let firstMatch = -1

      for (const term of terms) {
        const idx = raw.indexOf(term)
        if (idx !== -1) {
          score += (raw.split(term).length - 1) // frequency
          if (firstMatch === -1 || idx < firstMatch) firstMatch = idx
        }
      }

      if (score > 0) {
        // Extract a snippet around the first match
        const start = Math.max(0, firstMatch - 100)
        const end = Math.min(raw.length, firstMatch + 300)
        const excerpt = raw.slice(start, end).replace(/\n+/g, ' ').trim()

        results.push({
          book,
          chapter: ch.num,
          title: ch.title,
          excerpt: '…' + excerpt + '…',
          score,
        })
      }
    }
  }

  return results.sort((a, b) => b.score - a.score).slice(0, maxResults)
}
