import Link from 'next/link'
import { getManualesIndex } from '@/lib/manuales'

export const metadata = {
  title: 'Manuales · DERE-A0004',
}

const BOOK_SLUGS = {
  samuelson: 'samuelson',
  casefair: 'casefair',
} as const

export default function ManualesPage() {
  const index = getManualesIndex()

  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: '3rem 2rem' }}>
      <p style={{
        fontFamily: 'var(--font-display)', fontSize: '0.7rem',
        letterSpacing: '0.15em', textTransform: 'uppercase',
        color: 'var(--ua-red)', fontWeight: 700, marginBottom: '0.5rem',
      }}>
        Bibliografía del curso
      </p>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '0.5rem' }}>
        Manuales
      </h1>
      <p style={{ color: 'var(--ua-gray)', fontSize: '0.9rem', marginBottom: '3rem' }}>
        Bibliografía primaria y secundaria indexada por capítulo.{' '}
        <Link href="/buscar" style={{ color: 'var(--ua-red)' }}>Buscar en ambos manuales →</Link>
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {(['samuelson', 'casefair'] as const).map((book) => {
          const b = index[book]
          return (
            <div key={book} style={{
              background: 'var(--ua-white)',
              borderTop: '3px solid var(--ua-red)',
              border: '1px solid var(--ua-light)',
              borderTop: '3px solid var(--ua-red)',
            }}>
              <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--ua-light)' }}>
                <p style={{
                  fontSize: '0.65rem', letterSpacing: '0.12em',
                  textTransform: 'uppercase', color: 'var(--ua-red)',
                  fontWeight: 700, marginBottom: '0.4rem',
                }}>
                  {b.edition}
                </p>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', marginBottom: '0.3rem' }}>
                  {b.title}
                </h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--ua-gray)' }}>{b.authors}</p>
              </div>

              <div style={{ padding: '0.5rem 0' }}>
                {b.chapters.map((ch) => (
                  <Link
                    key={ch.num}
                    href={`/manuales/${book}/${ch.num}`}
                    style={{
                      display: 'flex', alignItems: 'baseline', gap: '0.75rem',
                      padding: '0.5rem 1.5rem', textDecoration: 'none',
                      color: 'var(--ua-black)', fontSize: '0.82rem',
                      borderBottom: '1px solid var(--ua-sand)',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--ua-sand)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <span style={{
                      fontSize: '0.65rem', color: 'var(--ua-red)',
                      fontWeight: 700, minWidth: '2rem', flexShrink: 0,
                    }}>
                      {ch.num}
                    </span>
                    <span style={{ lineHeight: 1.35 }}>{ch.title}</span>
                    <span style={{
                      marginLeft: 'auto', fontSize: '0.6rem',
                      color: 'var(--ua-gray)', flexShrink: 0,
                    }}>
                      {Math.round(ch.chars / 1000)}k
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </main>
  )
}
