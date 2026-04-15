import { notFound } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { getChapter, getManualesIndex } from '@/lib/manuales'

const VALID_BOOKS = ['samuelson', 'casefair'] as const
type Book = typeof VALID_BOOKS[number]

export function generateStaticParams() {
  const index = getManualesIndex()
  const params = []
  for (const book of VALID_BOOKS) {
    for (const ch of index[book].chapters) {
      params.push({ libro: book, capitulo: String(ch.num) })
    }
  }
  return params
}

export function generateMetadata({ params }: { params: { libro: string; capitulo: string } }) {
  const book = params.libro as Book
  if (!VALID_BOOKS.includes(book)) return {}
  const ch = getChapter(book, parseInt(params.capitulo))
  if (!ch) return {}
  return { title: `Cap. ${ch.chapter}: ${ch.title} · ${ch.authors}` }
}

export default function ChapterPage({ params }: { params: { libro: string; capitulo: string } }) {
  const book = params.libro as Book
  if (!VALID_BOOKS.includes(book)) notFound()

  const num = parseInt(params.capitulo)
  const chapter = getChapter(book, num)
  if (!chapter) notFound()

  const index = getManualesIndex()
  const allChapters = index[book].chapters
  const idx = allChapters.findIndex((c) => c.num === num)
  const prev = idx > 0 ? allChapters[idx - 1] : null
  const next = idx < allChapters.length - 1 ? allChapters[idx + 1] : null

  return (
    <main>
      {/* Toolbar */}
      <div style={{
        background: 'var(--ua-white)', borderBottom: '1px solid var(--ua-light)',
        padding: '0.75rem 2rem', display: 'flex', alignItems: 'center', gap: '1rem',
        position: 'sticky', top: '49px', zIndex: 50,
      }}>
        <Link href={`/manuales/${book}`} style={{ fontSize: '0.8rem', color: 'var(--ua-gray)', textDecoration: 'none' }}>
          ← {chapter.authors}
        </Link>
        <div style={{ flex: 1 }} />
        {prev && (
          <Link href={`/manuales/${book}/${prev.num}`} style={{ fontSize: '0.75rem', color: 'var(--ua-gray)', textDecoration: 'none' }}>
            ‹ Cap. {prev.num}
          </Link>
        )}
        {next && (
          <Link href={`/manuales/${book}/${next.num}`} style={{ fontSize: '0.75rem', color: 'var(--ua-red)', textDecoration: 'none' }}>
            Cap. {next.num} ›
          </Link>
        )}
      </div>

      {/* Content */}
      <article className="clase-web" style={{ maxWidth: 860 }}>
        <header className="clase-header">
          <p className="clase-numero">{chapter.authors} · {chapter.edition}</p>
          <h1>Cap. {chapter.chapter}: {chapter.title}</h1>
        </header>

        <div className="bloque">
          <ReactMarkdown>{chapter.content}</ReactMarkdown>
        </div>

        {/* Bottom nav */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          marginTop: '3rem', paddingTop: '1.5rem',
          borderTop: '1px solid var(--ua-light)',
        }}>
          {prev ? (
            <Link href={`/manuales/${book}/${prev.num}`} style={{ fontSize: '0.85rem', color: 'var(--ua-red)', textDecoration: 'none' }}>
              ← Cap. {prev.num}: {prev.title}
            </Link>
          ) : <span />}
          {next ? (
            <Link href={`/manuales/${book}/${next.num}`} style={{ fontSize: '0.85rem', color: 'var(--ua-red)', textDecoration: 'none' }}>
              Cap. {next.num}: {next.title} →
            </Link>
          ) : <span />}
        </div>
      </article>
    </main>
  )
}
