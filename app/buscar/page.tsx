'use client'

import { useState } from 'react'
import Link from 'next/link'

interface SearchResult {
  book: string
  chapter: number
  title: string
  excerpt: string
  score: number
}

const BOOK_LABELS: Record<string, string> = {
  samuelson: 'Samuelson & Nordhaus',
  casefair: 'Case & Fair',
}

export default function BuscarPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    setSearched(true)
    try {
      const res = await fetch(`/api/buscar?q=${encodeURIComponent(query)}`)
      const data = await res.json()
      setResults(data.results || [])
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ maxWidth: 800, margin: '0 auto', padding: '3rem 2rem' }}>
      <p style={{
        fontFamily: 'var(--font-display)', fontSize: '0.7rem',
        letterSpacing: '0.15em', textTransform: 'uppercase',
        color: 'var(--ua-red)', fontWeight: 700, marginBottom: '0.5rem',
      }}>
        Búsqueda bibliográfica
      </p>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '0.3rem' }}>
        Buscar en manuales
      </h1>
      <p style={{ color: 'var(--ua-gray)', fontSize: '0.85rem', marginBottom: '2rem' }}>
        Busca conceptos, términos o temas en Samuelson (18a ed.) y Case & Fair (10a ed.)
      </p>

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ej: elasticidad, mercado de trabajo, externalidades..."
          style={{
            flex: 1, padding: '0.7rem 1rem',
            border: '2px solid var(--ua-light)', fontSize: '0.95rem',
            fontFamily: 'var(--font-body)', outline: 'none',
            background: 'var(--ua-white)',
          }}
          onFocus={(e) => (e.target.style.borderColor = 'var(--ua-red)')}
          onBlur={(e) => (e.target.style.borderColor = 'var(--ua-light)')}
        />
        <button
          type="submit"
          style={{
            background: 'var(--ua-red)', color: 'var(--ua-white)',
            border: 'none', padding: '0.7rem 1.5rem',
            fontFamily: 'var(--font-body)', fontSize: '0.85rem',
            cursor: 'pointer', letterSpacing: '0.05em',
          }}
        >
          {loading ? 'Buscando…' : 'Buscar'}
        </button>
      </form>

      {searched && !loading && results.length === 0 && (
        <p style={{ color: 'var(--ua-gray)', fontSize: '0.9rem' }}>
          No se encontraron resultados para <strong>"{query}"</strong>.
        </p>
      )}

      {results.length > 0 && (
        <div>
          <p style={{ fontSize: '0.8rem', color: 'var(--ua-gray)', marginBottom: '1rem' }}>
            {results.length} resultado{results.length !== 1 ? 's' : ''} para <strong>"{query}"</strong>
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {results.map((r, i) => (
              <Link
                key={i}
                href={`/manuales/${r.book}/${r.chapter}`}
                style={{
                  display: 'block', padding: '1.25rem 1.5rem',
                  background: 'var(--ua-white)', border: '1px solid var(--ua-light)',
                  borderLeft: '3px solid var(--ua-red)', textDecoration: 'none',
                  color: 'var(--ua-black)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.65rem', color: 'var(--ua-red)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    {BOOK_LABELS[r.book]} · Cap. {r.chapter}
                  </span>
                </div>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', marginBottom: '0.5rem' }}>
                  {r.title}
                </p>
                <p style={{ fontSize: '0.78rem', color: 'var(--ua-gray)', lineHeight: 1.6 }}>
                  {r.excerpt}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  )
}
