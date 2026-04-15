import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
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

type SlideLayout = 'divider' | 'cards' | 'question' | 'warning' | 'code' | 'table' | 'default'

function detectLayout(titulo: string, contenido: string): SlideLayout {
  const c = contenido.trim()
  // Divider: contenido es solo texto en cursiva (una línea)
  if (/^\*[^*\n]+\*\s*$/.test(c)) return 'divider'
  // Pregunta / Diagnóstico
  if (/^(pregunta|diagnóstico)/i.test(titulo)) return 'question'
  // Trampa común
  if (/^trampa/i.test(titulo)) return 'warning'
  // Bloque de código
  if (c.includes('```')) return 'code'
  // Tabla markdown
  if (/^\|.+\|/m.test(c) && c.includes('---')) return 'table'
  // Cards: 3+ bullets con bold
  if ((c.match(/^[-*] \*\*/gm) || []).length >= 3) return 'cards'
  return 'default'
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
        <title>{`Clase ${clase.numero}: ${clase.titulo}`}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,600;1,8..60,300;1,8..60,400&display=swap"
          rel="stylesheet"
        />
        <style dangerouslySetInnerHTML={{ __html: printStyles }} />
      </head>
      <body>
        {!presentacion ? (
          <NoPresentacionYet numero={clase.numero} titulo={clase.titulo} />
        ) : (
          <>
            <div className="print-controls">
              <span className="ctrl-title">Clase {clase.numero} · {clase.titulo}</span>
              <span className="ctrl-count">{presentacion.slides.length + 2} slides</span>
              <PrintButton />
            </div>
            <div className="slides-container">
              {/* Portada */}
              <div className="slide slide-portada">
                <div className="portada-stripe" />
                <div className="portada-inner">
                  <p className="portada-eyebrow">Clase {String(numero).padStart(2, '0')}</p>
                  <h1 className="portada-title">{clase.titulo}</h1>
                  <p className="portada-meta">
                    {clase.unidad && <>{clase.unidad} · </>}
                    DERE-A0004 · Introducción a la Economía
                  </p>
                </div>
                <div className="portada-ua">Universidad Autónoma de Chile</div>
              </div>

              {/* Slides de contenido */}
              {presentacion.slides.map((slide, i) => {
                const layout = detectLayout(slide.titulo, slide.contenido)
                const slideNum = i + 2
                const total = presentacion.slides.length + 2

                if (layout === 'divider') {
                  return (
                    <div key={i} className="slide slide-divider">
                      <div className="divider-watermark">{String(slideNum).padStart(2, '0')}</div>
                      <div className="divider-inner">
                        <h2 className="divider-title">{slide.titulo}</h2>
                        <div className="divider-sub">
                          <ReactMarkdown>{slide.contenido}</ReactMarkdown>
                        </div>
                      </div>
                      <div className="slide-footer divider-footer">
                        <span>Universidad Autónoma de Chile · Introducción a la Economía · Clase {numero}</span>
                        <span>DERE-A0004</span>
                      </div>
                    </div>
                  )
                }

                return (
                  <div key={i} className={`slide slide-content slide-${layout}`}>
                    <div className="slide-header">
                      <span className="slide-titulo">{slide.titulo}</span>
                      <span className="slide-num">{slideNum}/{total}</span>
                    </div>
                    <div className="slide-body">
                      <ReactMarkdown>{slide.contenido}</ReactMarkdown>
                    </div>
                    <div className="slide-footer">
                      <span>Universidad Autónoma de Chile · Introducción a la Economía · Clase {numero}</span>
                      <span>DERE-A0004</span>
                    </div>
                  </div>
                )
              })}

              {/* Cierre */}
              <div className="slide slide-cierre">
                <div className="cierre-inner">
                  <p className="cierre-eyebrow">Clase {String(numero).padStart(2, '0')}</p>
                  <h2 className="cierre-title">{clase.titulo}</h2>
                  <p className="cierre-meta">DERE-A0004 · Introducción a la Economía<br />Universidad Autónoma de Chile</p>
                </div>
              </div>
            </div>
          </>
        )}
      </body>
    </html>
  )
}

function NoPresentacionYet({ numero, titulo }: { numero: number; titulo: string }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F4F2', fontFamily: 'Georgia, serif', padding: '3rem' }}>
      <div style={{ maxWidth: 540, textAlign: 'center' }}>
        <p style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C8102E', fontWeight: 700, marginBottom: '1rem' }}>Clase {String(numero).padStart(2, '0')} · {titulo}</p>
        <h1 style={{ fontSize: '1.8rem', lineHeight: 1.2, marginBottom: '1rem' }}>Presentación no disponible</h1>
        <p style={{ color: '#6B6B6B', fontSize: '0.9rem' }}>Crear <code>content/presentaciones/clase-{String(numero).padStart(2, '0')}.md</code></p>
      </div>
    </div>
  )
}

const printStyles = `
:root {
  --red:   #C8102E;
  --black: #1A1A1A;
  --sand:  #F5F4F2;
  --white: #FFFFFF;
  --gray:  #6B6B6B;
  --light: #ECECEA;
  --disp: 'Playfair Display', Georgia, serif;
  --body: 'Source Serif 4', Georgia, serif;
  --mono: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Courier New', monospace;
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: var(--body); background: #666; -webkit-font-smoothing: antialiased; }

/* ── Controls ───────────────────────────────────── */
.print-controls {
  position: fixed; top: 0; left: 0; right: 0; z-index: 999;
  background: var(--black); color: var(--white);
  padding: 0.55rem 1.5rem;
  display: flex; align-items: center; gap: 1.5rem;
  font-family: var(--body); font-size: 0.78rem;
}
.ctrl-title { flex: 1; }
.ctrl-count { opacity: 0.5; font-size: 0.7rem; }
.print-controls button {
  background: var(--red); color: var(--white); border: none;
  padding: 0.3rem 1rem; font-family: var(--body); font-size: 0.72rem;
  cursor: pointer; letter-spacing: 0.08em; text-transform: uppercase;
}

/* ── Slide container ────────────────────────────── */
.slides-container {
  display: flex; flex-direction: column; align-items: center;
  gap: 2rem; padding: 4rem 2rem 3rem;
}

/* ── Base slide ─────────────────────────────────── */
.slide {
  width: 297mm; height: 210mm;
  position: relative; overflow: hidden;
  flex-shrink: 0;
  display: flex; flex-direction: column;
  box-shadow: 0 8px 40px rgba(0,0,0,0.5);
  page-break-after: always; break-after: page;
}

/* ── Footer (shared) ───────────────────────────── */
.slide-footer {
  flex-shrink: 0;
  padding: 0 8mm;
  height: 8mm;
  display: flex; align-items: center; justify-content: space-between;
  border-top: 0.3mm solid var(--light);
}
.slide-footer span {
  font-size: 2.6mm;
  color: var(--gray);
  letter-spacing: 0.04em;
}

/* ═══════════════════════════════════════════════
   PORTADA
═══════════════════════════════════════════════ */
.slide-portada {
  background: var(--black);
  color: var(--white);
}
.portada-stripe {
  position: absolute; left: 0; top: 0; bottom: 0;
  width: 8mm; background: var(--red);
}
.portada-inner {
  flex: 1;
  padding: 18mm 16mm 12mm 24mm;
  display: flex; flex-direction: column; justify-content: center;
}
.portada-eyebrow {
  font-size: 3mm;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--red);
  font-weight: 700;
  margin-bottom: 5mm;
}
.portada-title {
  font-family: var(--disp);
  font-size: 15mm;
  line-height: 1.05;
  color: var(--white);
  max-width: 75%;
  margin-bottom: 8mm;
}
.portada-meta {
  font-size: 3.2mm;
  color: rgba(255,255,255,0.4);
  letter-spacing: 0.06em;
}
.portada-ua {
  position: absolute; bottom: 8mm; right: 10mm;
  font-family: var(--disp);
  font-size: 3.5mm;
  color: rgba(255,255,255,0.25);
  letter-spacing: 0.06em;
}

/* ═══════════════════════════════════════════════
   DIVISOR
═══════════════════════════════════════════════ */
.slide-divider {
  background: var(--black);
  color: var(--white);
  justify-content: center;
}
.divider-watermark {
  position: absolute;
  right: 8mm; top: 50%;
  transform: translateY(-50%);
  font-family: var(--disp);
  font-size: 60mm;
  font-weight: 900;
  color: rgba(255,255,255,0.04);
  line-height: 1;
  user-select: none;
  pointer-events: none;
}
.divider-inner {
  flex: 1;
  padding: 0 16mm;
  display: flex; flex-direction: column; justify-content: center;
  border-left: 8mm solid var(--red);
  margin-left: 16mm;
}
.divider-title {
  font-family: var(--disp);
  font-size: 12mm;
  font-weight: 700;
  color: var(--white);
  line-height: 1.15;
  margin-bottom: 4mm;
}
.divider-sub {
  font-size: 4.2mm;
  color: rgba(255,255,255,0.5);
  font-style: italic;
}
.divider-sub em { font-style: italic; }
.divider-footer {
  border-top: 0.3mm solid rgba(255,255,255,0.1) !important;
}
.divider-footer span { color: rgba(255,255,255,0.3) !important; }

/* ═══════════════════════════════════════════════
   SLIDE HEADER (content slides)
═══════════════════════════════════════════════ */
.slide-header {
  flex-shrink: 0;
  height: 14mm;
  background: var(--black);
  padding: 0 8mm;
  display: flex; align-items: center; gap: 4mm;
}
.slide-titulo {
  font-family: var(--disp);
  font-size: 5.2mm;
  color: var(--white);
  font-weight: 700;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.slide-num {
  font-size: 2.8mm;
  color: var(--red);
  letter-spacing: 0.12em;
  font-weight: 700;
  flex-shrink: 0;
}

/* ── Body base ──────────────────────────────────── */
.slide-body {
  flex: 1;
  padding: 7mm 10mm 5mm;
  overflow: hidden;
  background: var(--white);
}

/* ═══════════════════════════════════════════════
   DEFAULT layout
═══════════════════════════════════════════════ */
.slide-default .slide-body h1,
.slide-default .slide-body h2 {
  font-family: var(--disp);
  font-size: 6.5mm;
  color: var(--black);
  border-left: 1.5mm solid var(--red);
  padding-left: 3mm;
  margin-bottom: 4mm;
  line-height: 1.2;
}
.slide-default .slide-body h3 {
  font-family: var(--disp);
  font-size: 4.8mm;
  color: var(--black);
  margin: 3mm 0 2mm;
}
.slide-default .slide-body p {
  font-size: 4.5mm;
  line-height: 1.6;
  color: #1e1e1e;
  margin-bottom: 2.5mm;
}
.slide-default .slide-body ul,
.slide-default .slide-body ol {
  padding-left: 5mm;
  margin: 1.5mm 0;
}
.slide-default .slide-body li {
  font-size: 4.5mm;
  line-height: 1.55;
  color: #1e1e1e;
  margin-bottom: 1.5mm;
}
.slide-default .slide-body strong { color: var(--red); font-weight: 600; }
.slide-default .slide-body em { font-style: italic; }
.slide-default .slide-body blockquote {
  border-left: 1.5mm solid var(--red);
  padding: 2mm 4mm;
  margin: 3mm 0;
  background: var(--sand);
  font-style: italic;
  font-size: 4.2mm;
  color: #333;
  line-height: 1.5;
}
.slide-default .slide-body blockquote strong { color: var(--black); }
.slide-default .slide-body pre {
  background: var(--sand);
  border-left: 1.5mm solid var(--red);
  padding: 4mm 5mm;
  margin: 2mm 0;
  overflow: hidden;
}
.slide-default .slide-body code {
  font-family: var(--mono);
  font-size: 3.8mm;
  line-height: 1.55;
  color: var(--black);
}

/* ═══════════════════════════════════════════════
   CARDS layout  (Qué deben dominar)
═══════════════════════════════════════════════ */
.slide-cards .slide-header { background: #2d2d2d; }
.slide-cards .slide-body {
  padding: 5mm 8mm;
  display: flex;
  flex-direction: column;
  gap: 2mm;
  background: var(--sand);
}
.slide-cards .slide-body ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 2.5mm;
}
.slide-cards .slide-body li {
  background: var(--white);
  border-left: 3mm solid var(--red);
  padding: 3mm 5mm;
  font-size: 4.3mm;
  line-height: 1.5;
  color: #1e1e1e;
}
.slide-cards .slide-body li strong {
  color: var(--black);
  font-weight: 700;
}
.slide-cards .slide-body p {
  font-size: 4.2mm;
  color: var(--gray);
  padding: 1mm 0;
}

/* ═══════════════════════════════════════════════
   QUESTION layout  (Pregunta, Diagnóstico)
═══════════════════════════════════════════════ */
.slide-question .slide-header { background: #1a1a1a; }
.slide-question .slide-body {
  display: flex;
  flex-direction: column;
  padding: 6mm 10mm;
  gap: 3mm;
  background: var(--white);
  border-left: 8mm solid var(--black);
  overflow: hidden;
}
.slide-question .slide-body p:first-child strong,
.slide-question .slide-body > p strong {
  font-size: 6mm;
  color: var(--black);
  font-weight: 700;
  display: block;
  line-height: 1.35;
}
.slide-question .slide-body p {
  font-size: 4.5mm;
  line-height: 1.55;
  color: #1e1e1e;
}
.slide-question .slide-body blockquote {
  border-left: 1.5mm solid var(--light);
  padding: 1.5mm 4mm;
  font-style: italic;
  font-size: 4mm;
  color: var(--gray);
  background: none;
  margin: 1mm 0;
}
.slide-question .slide-body strong { color: var(--black); font-weight: 600; }
.slide-question .slide-body em { font-style: italic; color: var(--gray); }

/* ═══════════════════════════════════════════════
   WARNING layout  (Trampa común)
═══════════════════════════════════════════════ */
.slide-warning .slide-header {
  background: var(--white);
  border-bottom: 0.3mm solid var(--light);
}
.slide-warning .slide-header .slide-titulo {
  color: var(--red);
}
.slide-warning .slide-header .slide-num {
  color: var(--gray);
}
.slide-warning .slide-body {
  background: var(--white);
  padding: 6mm 10mm;
  border-top: 2mm solid var(--red);
}
.slide-warning .slide-body p:first-child {
  font-size: 6mm;
  font-weight: 700;
  color: var(--black);
  line-height: 1.3;
  margin-bottom: 4mm;
  padding-bottom: 3mm;
  border-bottom: 0.3mm solid var(--light);
}
.slide-warning .slide-body p:first-child strong {
  color: var(--red);
}
.slide-warning .slide-body p {
  font-size: 4.5mm;
  line-height: 1.6;
  color: #1e1e1e;
  margin-bottom: 2.5mm;
}
.slide-warning .slide-body blockquote {
  margin-top: 3mm;
  border-left: 1.5mm solid var(--red);
  background: #fef2f4;
  padding: 2.5mm 5mm;
  font-size: 4mm;
  color: #333;
  line-height: 1.5;
}
.slide-warning .slide-body blockquote strong { color: var(--black); }
.slide-warning .slide-body strong { color: var(--red); font-weight: 700; }

/* ═══════════════════════════════════════════════
   CODE layout
═══════════════════════════════════════════════ */
.slide-code .slide-body {
  padding: 5mm 8mm;
  display: flex;
  flex-direction: column;
  gap: 3mm;
  background: var(--white);
}
.slide-code .slide-body p {
  font-size: 4.3mm;
  color: #333;
  line-height: 1.5;
}
.slide-code .slide-body p strong { color: var(--red); font-weight: 600; }
.slide-code .slide-body pre {
  flex: 1;
  background: #0f0f0f;
  border-radius: 0;
  padding: 5mm 6mm;
  overflow: hidden;
}
.slide-code .slide-body code {
  font-family: var(--mono);
  font-size: 3.6mm;
  line-height: 1.65;
  color: #e8e8e8;
  white-space: pre;
}

/* ═══════════════════════════════════════════════
   TABLE layout
═══════════════════════════════════════════════ */
.slide-table .slide-body {
  padding: 5mm 8mm;
  background: var(--white);
  display: flex;
  flex-direction: column;
  gap: 2mm;
}
.slide-table .slide-body p {
  font-size: 4mm;
  color: var(--gray);
  font-style: italic;
}
.slide-table .slide-body table {
  width: 100%;
  border-collapse: collapse;
  font-size: 4mm;
}
.slide-table .slide-body th {
  background: var(--black);
  color: var(--white);
  padding: 2.5mm 4mm;
  text-align: left;
  font-weight: 600;
  font-family: var(--body);
  font-size: 3.8mm;
  letter-spacing: 0.02em;
}
.slide-table .slide-body td {
  padding: 2.5mm 4mm;
  border-bottom: 0.3mm solid var(--light);
  color: #1e1e1e;
  line-height: 1.45;
  vertical-align: top;
}
.slide-table .slide-body tr:nth-child(even) td { background: var(--sand); }
.slide-table .slide-body td strong { color: var(--red); font-weight: 600; }
.slide-table .slide-body blockquote {
  border-left: 1.5mm solid var(--red);
  padding: 2mm 4mm;
  margin: 2mm 0 0;
  font-size: 3.8mm;
  color: var(--gray);
  font-style: italic;
  background: var(--sand);
}

/* ═══════════════════════════════════════════════
   CIERRE
═══════════════════════════════════════════════ */
.slide-cierre {
  background: var(--black);
  color: var(--white);
  justify-content: center;
  align-items: center;
}
.cierre-inner {
  text-align: center;
  padding: 8mm 16mm;
}
.cierre-eyebrow {
  font-size: 3mm;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--red);
  font-weight: 700;
  margin-bottom: 4mm;
}
.cierre-title {
  font-family: var(--disp);
  font-size: 10mm;
  color: var(--white);
  line-height: 1.2;
  margin-bottom: 6mm;
}
.cierre-meta {
  font-size: 3.2mm;
  color: rgba(255,255,255,0.3);
  line-height: 1.8;
  letter-spacing: 0.04em;
}

/* ═══════════════════════════════════════════════
   PRINT
═══════════════════════════════════════════════ */
@media print {
  * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  body { background: white; }
  .print-controls { display: none !important; }
  .slides-container { gap: 0; padding: 0; align-items: stretch; background: none; }
  .slide { width: 100%; height: 100vh; box-shadow: none; break-after: page; }
}
@page { size: A4 landscape; margin: 0; }
`
