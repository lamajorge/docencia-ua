import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getClaseByNumero, getClases, REVALIDATE_SECONDS } from '@/lib/notion'
import { hasPresentacion } from '@/lib/presentaciones'

export const revalidate = REVALIDATE_SECONDS

export async function generateStaticParams() {
  try {
    const clases = await getClases()
    return clases.map((c) => ({ id: String(c.numero) }))
  } catch {
    return []
  }
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

  const tienePresentacion = hasPresentacion(numero)

  return (
    <main>
      <div style={{
        background: 'var(--ua-white)',
        borderBottom: '1px solid var(--ua-light)',
        padding: '0.75rem 2rem',
      }}>
        <Link href="/clases" style={{
          fontSize: '0.8rem',
          color: 'var(--ua-gray)',
          textDecoration: 'none',
        }}>
          ← Todas las clases
        </Link>
      </div>

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

        <div style={{
          padding: '2.5rem 0',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          alignItems: 'flex-start',
        }}>
          {tienePresentacion ? (
            <Link
              href={`/clases/${numero}/print`}
              target="_blank"
              style={{
                background: 'var(--ua-red)',
                color: 'var(--ua-white)',
                padding: '0.9rem 1.8rem',
                fontSize: '0.85rem',
                textDecoration: 'none',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              Abrir presentación
            </Link>
          ) : (
            <p style={{ color: 'var(--ua-gray)', fontSize: '0.9rem', fontStyle: 'italic' }}>
              La presentación de esta clase aún no está publicada.
            </p>
          )}
          <p style={{ color: 'var(--ua-gray)', fontSize: '0.8rem' }}>
            La presentación se abre en ventana nueva. Desde ahí puedes imprimirla como PDF (1 lámina por hoja A4 apaisada).
          </p>
        </div>
      </article>
    </main>
  )
}
