import Link from 'next/link'
import { getClases, REVALIDATE_SECONDS } from '@/lib/notion'

export const revalidate = REVALIDATE_SECONDS

export default async function ClasesPage() {
  let clases: Awaited<ReturnType<typeof getClases>> = []
  try {
    clases = await getClases()
  } catch {
    clases = []
  }

  return (
    <main>
      <div style={{ padding: '2.5rem 2rem 0', maxWidth: 1200, margin: '0 auto' }}>
        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: '0.7rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'var(--ua-red)',
          fontWeight: 700,
          marginBottom: '0.5rem',
        }}>
          Introducción a la Economía
        </p>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '2rem',
          marginBottom: '0.5rem',
        }}>
          Guías de Clase
        </h1>
        <p style={{ color: 'var(--ua-gray)', fontSize: '0.9rem' }}>
          {clases.length} clases disponibles · Haz clic en una clase para verla o imprimirla como presentación
        </p>
      </div>

      <div className="clases-grid">
        {clases.map((clase) => (
          <Link
            key={clase.id}
            href={`/clases/${clase.numero}`}
            className="clase-card"
          >
            <span className="numero">Clase {clase.numero}</span>
            <span className="titulo">{clase.titulo}</span>
            <span className="meta">
              {clase.unidad && <>{clase.unidad} · </>}
              {clase.fecha ?? 'Fecha por confirmar'}
            </span>
          </Link>
        ))}
      </div>
    </main>
  )
}
