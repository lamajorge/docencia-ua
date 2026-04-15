import { notFound } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { getClaseByNumero, getClases, REVALIDATE_SECONDS } from '@/lib/notion'

export const revalidate = REVALIDATE_SECONDS

export async function generateStaticParams() {
  const clases = await getClases()
  return clases.map((c) => ({ id: String(c.numero) }))
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const numero = parseInt(params.id)
  const clase = await getClaseByNumero(numero)
  if (!clase) return { title: 'Clase no encontrada' }
  return {
    title: `Clase ${clase.numero}: ${clase.titulo} · DERE-A0004`,
  }
}

export default async function ClasePage({ params }: { params: { id: string } }) {
  const numero = parseInt(params.id)
  if (isNaN(numero)) notFound()

  const clase = await getClaseByNumero(numero)
  if (!clase) notFound()

  return (
    <main>
      {/* Barra de acciones */}
      <div style={{
        background: 'var(--ua-white)',
        borderBottom: '1px solid var(--ua-light)',
        padding: '0.75rem 2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
      }}>
        <Link href="/clases" style={{
          fontSize: '0.8rem',
          color: 'var(--ua-gray)',
          textDecoration: 'none',
        }}>
          ← Todas las clases
        </Link>
        <div style={{ flex: 1 }} />
        <Link
          href={`/clases/${numero}/print`}
          target="_blank"
          style={{
            background: 'var(--ua-red)',
            color: 'var(--ua-white)',
            padding: '0.4rem 1.2rem',
            fontSize: '0.78rem',
            textDecoration: 'none',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          🖨 Vista presentación / PDF
        </Link>
      </div>

      {/* Contenido */}
      <article className="clase-web">
        <header className="clase-header">
          <p className="clase-numero">Clase {clase.numero}</p>
          <h1>{clase.titulo}</h1>
          {(clase.fecha || clase.unidad) && (
            <p style={{ marginTop: '0.75rem', color: 'var(--ua-gray)', fontSize: '0.85rem' }}>
              {clase.unidad && <span>{clase.unidad}</span>}
              {clase.unidad && clase.fecha && <span> · </span>}
              {clase.fecha && <span>{clase.fecha}</span>}
            </p>
          )}
        </header>

        {clase.bloques.length > 0 ? (
          clase.bloques.map((bloque, i) => (
            <section key={i} className="bloque">
              <h2>{bloque.titulo}</h2>
              <ReactMarkdown>{bloque.contenido}</ReactMarkdown>
            </section>
          ))
        ) : (
          <div className="bloque">
            <ReactMarkdown>{clase.markdown}</ReactMarkdown>
          </div>
        )}
      </article>
    </main>
  )
}
