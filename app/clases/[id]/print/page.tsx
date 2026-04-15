import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import Link from 'next/link'
import { getClaseByNumero, getClases, REVALIDATE_SECONDS } from '@/lib/notion'
import { getPresentacion } from '@/lib/presentaciones'
import PrintButton from '@/components/PrintButton'

export const revalidate = REVALIDATE_SECONDS

export async function generateStaticParams() {
  try {
    const clases = await getClases()
    return clases.map((c) => ({ id: String(c.numero) }))
  } catch {
    return []
  }
}

export default async function PrintPage({ params }: { params: { id: string } }) {
  const numero = parseInt(params.id)
  if (isNaN(numero)) notFound()

  const clase = await getClaseByNumero(numero)
  if (!clase) notFound()

  const presentacion = getPresentacion(numero)

  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Clase {clase.numero}: {clase.titulo}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,600;1,8..60,300&display=swap"
          rel="stylesheet"
        />
        <style dangerouslySetInnerHTML={{ __html: printStyles }} />
      </head>
      <body>
        {!presentacion ? (
          <NoPresentacionYet numero={clase.numero} titulo={clase.titulo} />
        ) : (
          <Slides
            numero={clase.numero}
            titulo={clase.titulo}
            unidad={clase.unidad}
            slides={presentacion.slides}
          />
        )}
      </body>
    </html>
  )
}

function Slides({
  numero,
  titulo,
  unidad,
  slides,
}: {
  numero: number
  titulo: string
  unidad: string | null
  slides: { titulo: string; contenido: string }[]
}) {
  const totalSlides = 1 + slides.length + 1

  return (
    <>
      <div className="print-controls">
        <span>Clase {numero} · {titulo}</span>
        <span>{totalSlides} slides</span>
        <PrintButton />
      </div>

      <div className="slides-container">
        <div className="slide portada">
          <div className="slide-stripe" />
          <div className="slide-body">
            <p className="clase-label">Clase {String(numero).padStart(2, '0')}</p>
            <h1>{titulo}</h1>
            <p className="meta-line">
              {unidad && <>{unidad} · </>}
              DERE-A0004 · Introducción a la Economía
            </p>
          </div>
          <div className="ua-logo-area">
            <p className="ua-logo-text">Universidad Autónoma de Chile</p>
          </div>
        </div>

        {slides.map((slide, i) => (
          <div key={i} className="slide contenido">
            <div className="slide-header">
              <span className="slide-titulo">{slide.titulo || `Slide ${i + 2}`}</span>
              <span className="slide-numero">{i + 2}/{totalSlides}</span>
            </div>
            <div className="slide-body">
              <ReactMarkdown>{slide.contenido}</ReactMarkdown>
            </div>
            <div className="slide-footer">
              <span>Clase {numero} · {titulo}</span>
              <span>DERE-A0004</span>
            </div>
          </div>
        ))}

        <div className="slide cierre">
          <div className="cierre-body">
            <h2>Fin de la Clase {numero}</h2>
            <p>{titulo}</p>
            <p style={{ marginTop: '1rem', fontSize: '0.75rem', opacity: 0.7 }}>
              DERE-A0004 · Introducción a la Economía<br />
              Universidad Autónoma de Chile
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

function NoPresentacionYet({ numero, titulo }: { numero: number; titulo: string }) {
  return (
    <div className="placeholder">
      <div>
        <p className="placeholder-eyebrow">Clase {String(numero).padStart(2, '0')} · {titulo}</p>
        <h1>Presentación no disponible todavía</h1>
        <p className="placeholder-help">
          Crear <code>content/presentaciones/clase-{String(numero).padStart(2, '0')}.md</code>{' '}
          siguiendo el template en <code>content/presentaciones/TEMPLATE.md</code>.
        </p>
        <Link href={`/clases/${numero}`} className="placeholder-back">← Volver a la guía de la clase</Link>
      </div>
    </div>
  )
}

const printStyles = `
  :root {
    --ua-red:   #C8102E;
    --ua-black: #1A1A1A;
    --ua-sand:  #F5F4F2;
    --ua-white: #FFFFFF;
    --ua-gray:  #6B6B6B;
    --ua-light: #ECECEA;
    --font-display: 'Playfair Display', Georgia, serif;
    --font-body:    'Source Serif 4', Georgia, serif;
  }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: var(--font-body); background: #888; -webkit-font-smoothing: antialiased; }

  .print-controls {
    position: fixed; top: 0; left: 0; right: 0; z-index: 999;
    background: var(--ua-black); color: var(--ua-white);
    padding: 0.6rem 1.5rem; display: flex; align-items: center; gap: 1rem;
    font-size: 0.8rem; font-family: var(--font-body);
  }
  .print-controls span:first-child { flex: 1; }
  .print-controls button {
    background: var(--ua-red); color: var(--ua-white); border: none;
    padding: 0.35rem 1rem; font-family: var(--font-body); font-size: 0.75rem;
    cursor: pointer; letter-spacing: 0.06em; text-transform: uppercase;
  }

  .slides-container {
    display: flex; flex-direction: column; align-items: center;
    gap: 1.5rem; padding: 4rem 2rem 3rem;
  }

  .slide {
    width: 297mm; height: 210mm;
    position: relative; overflow: hidden;
    display: flex; flex-direction: column;
    box-shadow: 0 4px 30px rgba(0,0,0,0.4);
    page-break-after: always; break-after: page;
    background: var(--ua-white);
  }

  .slide.portada { background: var(--ua-black); color: var(--ua-white); }
  .slide-stripe { position: absolute; left: 0; top: 0; bottom: 0; width: 8px; background: var(--ua-red); }
  .slide.portada .slide-body { padding: 3rem 3.5rem 3rem 4rem; display: flex; flex-direction: column; height: 100%; justify-content: center; }
  .clase-label { font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--ua-red); margin-bottom: 1rem; font-weight: 700; }
  .slide.portada h1 { font-family: var(--font-display); font-size: 2.8rem; line-height: 1.1; color: var(--ua-white); max-width: 70%; margin-bottom: 2rem; }
  .meta-line { font-size: 0.75rem; color: rgba(255,255,255,0.5); letter-spacing: 0.08em; }
  .ua-logo-area { position: absolute; bottom: 2.5rem; right: 3rem; text-align: right; }
  .ua-logo-text { font-family: var(--font-display); font-size: 0.9rem; color: rgba(255,255,255,0.4); letter-spacing: 0.05em; }

  .slide.contenido .slide-header { background: var(--ua-black); padding: 0.9rem 2rem; display: flex; align-items: center; gap: 1rem; flex-shrink: 0; }
  .slide-titulo { font-family: var(--font-display); font-size: 1rem; color: var(--ua-white); font-weight: 700; }
  .slide-numero { font-size: 0.65rem; color: var(--ua-red); letter-spacing: 0.15em; text-transform: uppercase; font-weight: 700; margin-left: auto; }
  .slide.contenido .slide-body { padding: 1.8rem 2.5rem; flex: 1; overflow: hidden; }
  .slide.contenido .slide-body h2 { font-family: var(--font-display); font-size: 1.35rem; margin-bottom: 1rem; color: var(--ua-black); border-left: 4px solid var(--ua-red); padding-left: 0.75rem; line-height: 1.2; }
  .slide.contenido .slide-body h3 { font-family: var(--font-display); font-size: 1rem; margin: 0.75rem 0 0.5rem; color: var(--ua-black); }
  .slide.contenido .slide-body p, .slide.contenido .slide-body li { font-size: 0.82rem; line-height: 1.65; color: #2a2a2a; }
  .slide.contenido .slide-body ul, .slide.contenido .slide-body ol { padding-left: 1.2rem; margin: 0.5rem 0; }
  .slide.contenido .slide-body strong { color: var(--ua-red); font-weight: 600; }
  .slide.contenido .slide-body blockquote { border-left: 3px solid var(--ua-red); padding-left: 0.75rem; margin: 0.5rem 0; color: #444; font-style: italic; }
  .slide.contenido .slide-body table { width: 100%; border-collapse: collapse; font-size: 0.75rem; margin: 0.75rem 0; }
  .slide.contenido .slide-body th { background: var(--ua-black); color: var(--ua-white); padding: 0.4rem 0.6rem; text-align: left; }
  .slide.contenido .slide-body td { padding: 0.35rem 0.6rem; border-bottom: 1px solid var(--ua-light); }
  .slide.contenido .slide-body tr:nth-child(even) td { background: var(--ua-sand); }
  .slide-footer { padding: 0.5rem 2rem; border-top: 1px solid var(--ua-light); display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; }
  .slide-footer span { font-size: 0.6rem; color: var(--ua-gray); letter-spacing: 0.08em; }

  .slide.cierre { background: var(--ua-red); color: var(--ua-white); justify-content: center; align-items: center; }
  .cierre-body { text-align: center; padding: 2rem; }
  .slide.cierre h2 { font-family: var(--font-display); font-size: 2rem; margin-bottom: 1rem; }
  .slide.cierre p { font-size: 0.9rem; opacity: 0.85; }

  .placeholder { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--ua-sand); color: var(--ua-black); padding: 3rem; }
  .placeholder > div { max-width: 560px; text-align: center; }
  .placeholder-eyebrow { font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--ua-red); font-weight: 700; margin-bottom: 1rem; }
  .placeholder h1 { font-family: var(--font-display); font-size: 1.8rem; line-height: 1.2; margin-bottom: 1rem; }
  .placeholder-help { font-size: 0.9rem; color: var(--ua-gray); line-height: 1.5; margin-bottom: 1.5rem; }
  .placeholder-help code { background: var(--ua-white); border: 1px solid var(--ua-light); padding: 0.1rem 0.4rem; font-size: 0.82rem; }
  .placeholder-back { color: var(--ua-red); font-size: 0.85rem; text-decoration: none; }
  .placeholder-back:hover { text-decoration: underline; }

  @media print {
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    body { background: white; }
    .print-controls { display: none !important; }
    .slides-container { background: none; gap: 0; padding: 0; }
    .slide { width: 100%; height: 100vh; box-shadow: none; }
  }
  @page { size: A4 landscape; margin: 0; }
`
