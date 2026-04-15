import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getManualesIndex, getAllChapters } from '@/lib/manuales'

const VALID_BOOKS = ['samuelson', 'casefair'] as const
type Book = typeof VALID_BOOKS[number]

const BOOK_COLOR: Record<Book, string> = {
  samuelson: 'var(--ua-red)',
  casefair: '#1a5276',
}

export async function generateStaticParams() {
  return VALID_BOOKS.map((libro) => ({ libro }))
}

export async function generateMetadata({ params }: { params: { libro: string } }) {
  const index = getManualesIndex()
  const book = params.libro as Book
  if (!VALID_BOOKS.includes(book)) return {}
  return { title: `${index[book].title} · Manuales` }
}

export default function BookPage({ params }: { params: { libro: string } }) {
  const book = params.libro as Book
  if (!VALID_BOOKS.includes(book)) notFound()

  const index = getManualesIndex()
  const b = index[book]
  const chapters = getAllChapters(book)

  return (
    <main style={{ maxWidth: 800, margin: '0 auto', padding: '3rem 2rem' }}>
      <Link href="/manuales" style={{ fontSize: '0.8rem', color: 'var(--ua-gray)', textDecoration: 'none' }}>
        ← Manuales
      </Link>

      <div style={{ marginTop: '1.5rem', marginBottom: '2.5rem', borderLeft: `4px solid ${BOOK_COLOR[book]}`, paddingLeft: '1.25rem' }}>
        <p style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: BOOK_COLOR[book], fontWeight: 700, marginBottom: '0.35rem' }}>
          {b.edition}
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '0.3rem' }}>{b.title}</h1>
        <p style={{ color: 'var(--ua-gray)', fontSize: '0.85rem' }}>{b.authors} · {chapters.length} capítulos</p>
      </div>

      <div style={{ background: 'var(--ua-white)', border: '1px solid var(--ua-light)' }}>
        {chapters.map((ch, i) => (
          <Link
            key={ch.chapter}
            href={`/manuales/${book}/${ch.chapter}`}
            style={{
              display: 'flex', alignItems: 'baseline', gap: '1rem',
              padding: '0.85rem 1.5rem', textDecoration: 'none', color: 'var(--ua-black)',
              borderBottom: i < chapters.length - 1 ? '1px solid var(--ua-sand)' : 'none',
            }}
          >
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: BOOK_COLOR[book], minWidth: '3rem' }}>
              Cap. {ch.chapter}
            </span>
            <span style={{ fontSize: '0.9rem', lineHeight: 1.4, flex: 1 }}>{ch.title}</span>
            <span style={{ fontSize: '0.65rem', color: 'var(--ua-gray)' }}>
              {Math.round(ch.chars / 1000)}k chars
            </span>
          </Link>
        ))}
      </div>
    </main>
  )
}
