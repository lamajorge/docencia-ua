import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
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
  if (/^\*[^*\n]+\*\s*$/.test(c)) return 'divider'
  if (/^(pregunta|diagnóstico)/i.test(titulo)) return 'question'
  if (/^trampa/i.test(titulo)) return 'warning'
  if (c.includes('```')) return 'code'
  if (/^\|.+\|/m.test(c) && c.includes('---')) return 'table'
  if ((c.match(/^[-*] \*\*/gm) || []).length >= 3) return 'cards'
  return 'default'
}

// Para layout question: separa la pregunta (primer bloque **bold**) del resto.
function splitQuestion(contenido: string): { pregunta: string; respuesta: string } {
  const c = contenido.trim()
  const m = c.match(/^\*\*([\s\S]+?)\*\*\s*\n\n?([\s\S]*)$/)
  if (m) return { pregunta: m[1].trim(), respuesta: m[2].trim() }
  return { pregunta: '', respuesta: c }
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
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700;900&family=JetBrains+Mono:wght@400;500&display=swap"
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
                <div className="portada-unidad">
                  {clase.unidad ? clase.unidad.toUpperCase() : 'DERE-A0004'}
                </div>
                <div className="portada-inner">
                  <p className="portada-eyebrow">Clase {String(numero).padStart(2, '0')}</p>
                  <h1 className="portada-title">{clase.titulo}</h1>
                  <p className="portada-meta">
                    DERE-A0004 · Introducción a la Economía<br />
                    Universidad Autónoma de Chile
                  </p>
                </div>
                <div className="ua-badge ua-badge-light">UA</div>
              </div>

              {/* Contenido */}
              {presentacion.slides.map((slide, i) => {
                const layout = detectLayout(slide.titulo, slide.contenido)
                const slideNum = i + 2
                const total = presentacion.slides.length + 2

                if (layout === 'divider') {
                  return (
                    <div key={i} className="slide slide-divider">
                      <div className="portada-stripe" />
                      <div className="divider-watermark">{String(slideNum).padStart(2, '0')}</div>
                      <div className="divider-inner">
                        <p className="divider-eyebrow">BLOQUE {String(slideNum).padStart(2, '0')}</p>
                        <h2 className="divider-title">{slide.titulo}</h2>
                        <div className="divider-sub">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{slide.contenido}</ReactMarkdown>
                        </div>
                      </div>
                      <div className="slide-footer divider-footer">
                        <span>Universidad Autónoma de Chile · Introducción a la Economía · Clase {numero}</span>
                        <span>DERE-A0004</span>
                      </div>
                    </div>
                  )
                }

                if (layout === 'question') {
                  const { pregunta, respuesta } = splitQuestion(slide.contenido)
                  return (
                    <div key={i} className="slide slide-content slide-question">
                      <div className="slide-header">
                        <span className="slide-titulo">{slide.titulo}</span>
                        <span className="slide-num">{slideNum}/{total}</span>
                      </div>
                      <div className="slide-body question-body">
                        <div className="question-left">
                          <div className="question-mark">?</div>
                          <div className="question-label">PREGUNTA<br />AL CURSO</div>
                        </div>
                        <div className="question-right">
                          {pregunta && <div className="pregunta-texto">{pregunta}</div>}
                          {respuesta && (
                            <div className="respuesta-texto">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>{respuesta}</ReactMarkdown>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="slide-footer">
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
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{slide.contenido}</ReactMarkdown>
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
                  <div className="cierre-rule" />
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
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F4F2', fontFamily: 'Inter, sans-serif', padding: '3rem' }}>
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
  --red-dark: #A00D25;
  --red-soft: #fdecef;
  --black: #1A1A1A;
  --sand:  #F5F4F2;
  --white: #FFFFFF;
  --gray:  #6B6B6B;
  --light: #ECECEA;
  --text:  #1E1E1E;
  --sans:  'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, sans-serif;
  --disp:  'Playfair Display', Georgia, serif;
  --mono:  'JetBrains Mono', 'Fira Code', 'Consolas', 'Courier New', monospace;
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: var(--sans); background: #666; -webkit-font-smoothing: antialiased; }

/* ── Print controls ─────────────────────────────── */
.print-controls {
  position: fixed; top: 0; left: 0; right: 0; z-index: 999;
  background: var(--black); color: var(--white);
  padding: 0.55rem 1.5rem;
  display: flex; align-items: center; gap: 1.5rem;
  font-family: var(--sans); font-size: 0.78rem;
}
.ctrl-title { flex: 1; }
.ctrl-count { opacity: 0.5; font-size: 0.7rem; }
.print-controls button {
  background: var(--red); color: var(--white); border: none;
  padding: 0.35rem 1.1rem; font-family: var(--sans); font-size: 0.72rem;
  font-weight: 600; cursor: pointer; letter-spacing: 0.08em; text-transform: uppercase;
}

/* ── Slides container ──────────────────────────── */
.slides-container {
  display: flex; flex-direction: column; align-items: center;
  gap: 2rem; padding: 4rem 2rem 3rem;
}

/* ── Base slide ────────────────────────────────── */
.slide {
  width: 297mm; height: 210mm;
  position: relative; overflow: hidden;
  flex-shrink: 0;
  display: flex; flex-direction: column;
  box-shadow: 0 8px 40px rgba(0,0,0,0.5);
  page-break-after: always; break-after: page;
  background: var(--white);
}

/* ── UA Badge (top right) ──────────────────────── */
.ua-badge {
  position: absolute;
  top: 5mm; right: 7mm;
  background: var(--red);
  color: var(--white);
  font-family: var(--sans);
  font-weight: 800;
  font-size: 3.8mm;
  letter-spacing: 0.08em;
  padding: 1.8mm 3.5mm;
  z-index: 5;
}
.ua-badge-light { background: var(--red); }

/* ── Slide footer ──────────────────────────────── */
.slide-footer {
  flex-shrink: 0;
  padding: 0 10mm;
  height: 8mm;
  display: flex; align-items: center; justify-content: space-between;
  border-top: 0.3mm solid var(--light);
}
.slide-footer span {
  font-size: 2.8mm;
  color: var(--gray);
  font-family: var(--sans);
  letter-spacing: 0.02em;
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
  z-index: 2;
}
.portada-unidad {
  position: absolute;
  top: 18mm; left: 24mm;
  font-family: var(--sans);
  font-size: 3mm;
  letter-spacing: 0.25em;
  color: rgba(255,255,255,0.5);
  font-weight: 600;
}
.portada-inner {
  flex: 1;
  padding: 45mm 20mm 20mm 24mm;
  display: flex; flex-direction: column; justify-content: center;
}
.portada-eyebrow {
  font-family: var(--sans);
  font-size: 3.2mm;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--red);
  font-weight: 800;
  margin-bottom: 8mm;
}
.portada-title {
  font-family: var(--disp);
  font-size: 24mm;
  font-weight: 900;
  line-height: 1;
  color: var(--white);
  max-width: 85%;
  margin-bottom: 12mm;
  letter-spacing: -0.015em;
}
.portada-meta {
  font-family: var(--sans);
  font-size: 3.5mm;
  color: rgba(255,255,255,0.45);
  line-height: 1.8;
  letter-spacing: 0.04em;
  font-weight: 400;
}

/* ═══════════════════════════════════════════════
   DIVISOR
═══════════════════════════════════════════════ */
.slide-divider {
  background: var(--black);
  color: var(--white);
  justify-content: center;
}
.slide-divider .portada-stripe { z-index: 1; }
.divider-watermark {
  position: absolute;
  right: 14mm; top: 50%;
  transform: translateY(-45%);
  font-family: var(--disp);
  font-size: 90mm;
  font-weight: 900;
  color: rgba(255,255,255,0.05);
  line-height: 1;
  user-select: none;
  pointer-events: none;
}
.divider-inner {
  flex: 1;
  padding: 0 20mm 0 24mm;
  display: flex; flex-direction: column; justify-content: center;
  position: relative;
  z-index: 2;
}
.divider-eyebrow {
  font-family: var(--sans);
  font-size: 3mm;
  letter-spacing: 0.3em;
  color: var(--red);
  font-weight: 800;
  margin-bottom: 6mm;
}
.divider-title {
  font-family: var(--disp);
  font-size: 18mm;
  font-weight: 900;
  color: var(--white);
  line-height: 1.05;
  margin-bottom: 6mm;
  letter-spacing: -0.015em;
  max-width: 85%;
}
.divider-sub {
  font-family: var(--sans);
  font-size: 4.5mm;
  color: rgba(255,255,255,0.55);
  font-weight: 400;
  line-height: 1.5;
  max-width: 80%;
}
.divider-sub em, .divider-sub p em { font-style: italic; }
.divider-sub p { margin: 0; }
.divider-footer {
  border-top: 0.3mm solid rgba(255,255,255,0.08) !important;
}
.divider-footer span { color: rgba(255,255,255,0.35) !important; }

/* ═══════════════════════════════════════════════
   SLIDE HEADER (content slides)  — rojo UA
═══════════════════════════════════════════════ */
.slide-header {
  flex-shrink: 0;
  height: 16mm;
  background: var(--red);
  padding: 0 10mm;
  display: flex; align-items: center; gap: 4mm;
  position: relative;
}
.slide-titulo {
  font-family: var(--sans);
  font-size: 6.5mm;
  color: var(--white);
  font-weight: 700;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: -0.005em;
}
.slide-num {
  font-family: var(--sans);
  font-size: 3.2mm;
  color: rgba(255,255,255,0.75);
  letter-spacing: 0.12em;
  font-weight: 600;
  flex-shrink: 0;
}

/* ── Body base ──────────────────────────────────── */
.slide-body {
  flex: 1;
  padding: 9mm 12mm 6mm;
  overflow: hidden;
  background: var(--white);
  font-family: var(--sans);
}

/* ═══════════════════════════════════════════════
   DEFAULT layout
═══════════════════════════════════════════════ */
.slide-default .slide-body h1,
.slide-default .slide-body h2 {
  font-family: var(--sans);
  font-size: 7mm;
  font-weight: 800;
  color: var(--black);
  border-left: 2mm solid var(--red);
  padding-left: 4mm;
  margin-bottom: 5mm;
  line-height: 1.2;
  letter-spacing: -0.01em;
}
.slide-default .slide-body h3 {
  font-family: var(--sans);
  font-size: 5mm;
  font-weight: 700;
  color: var(--black);
  margin: 4mm 0 2.5mm;
}
.slide-default .slide-body p {
  font-size: 4.8mm;
  line-height: 1.6;
  color: var(--text);
  margin-bottom: 3mm;
  font-weight: 400;
}
.slide-default .slide-body ul,
.slide-default .slide-body ol {
  padding-left: 6mm;
  margin: 2mm 0;
}
.slide-default .slide-body li {
  font-size: 4.8mm;
  line-height: 1.55;
  color: var(--text);
  margin-bottom: 2mm;
}
.slide-default .slide-body li::marker { color: var(--red); font-weight: 700; }
.slide-default .slide-body strong { color: var(--red); font-weight: 700; }
.slide-default .slide-body em { font-style: italic; }
.slide-default .slide-body blockquote {
  border-left: 2mm solid var(--red);
  padding: 4mm 6mm;
  margin: 4mm 0;
  background: var(--sand);
  font-size: 4.5mm;
  color: var(--text);
  line-height: 1.55;
  font-style: normal;
}
.slide-default .slide-body blockquote p { margin-bottom: 0; }
.slide-default .slide-body blockquote strong { color: var(--black); }

/* ═══════════════════════════════════════════════
   CARDS layout  (Qué deben dominar)
═══════════════════════════════════════════════ */
.slide-cards .slide-body {
  padding: 8mm 10mm;
  background: var(--sand);
  display: flex;
  flex-direction: column;
  gap: 3mm;
}
.slide-cards .slide-body > ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 3.5mm;
}
.slide-cards .slide-body > ul > li {
  background: var(--white);
  border-left: 3mm solid var(--red);
  padding: 5mm 7mm;
  font-size: 4.8mm;
  line-height: 1.55;
  color: var(--text);
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
}
.slide-cards .slide-body > ul > li::marker { content: ''; }
.slide-cards .slide-body > ul > li strong {
  display: inline;
  color: var(--black);
  font-weight: 800;
  font-size: 5mm;
}
.slide-cards .slide-body > p {
  font-size: 4.5mm;
  color: var(--gray);
  font-weight: 400;
  padding: 1mm 0 2mm;
}
.slide-cards .slide-body strong { color: var(--black); font-weight: 700; }

/* ═══════════════════════════════════════════════
   QUESTION layout — círculo rojo + card a la derecha
═══════════════════════════════════════════════ */
.slide-question .question-body {
  padding: 0;
  display: grid;
  grid-template-columns: 78mm 1fr;
  gap: 0;
  overflow: hidden;
}
.question-left {
  background: var(--black);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8mm;
  position: relative;
}
.question-left::before {
  content: '';
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 4mm;
  background: var(--red);
}
.question-mark {
  width: 48mm;
  height: 48mm;
  border-radius: 50%;
  background: var(--red);
  color: var(--white);
  font-family: var(--disp);
  font-size: 32mm;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  padding-bottom: 4mm;
}
.question-label {
  font-family: var(--sans);
  font-size: 3mm;
  font-weight: 800;
  letter-spacing: 0.25em;
  color: var(--white);
  text-align: center;
  line-height: 1.6;
}
.question-right {
  padding: 10mm 12mm 8mm;
  background: var(--white);
  display: flex;
  flex-direction: column;
  gap: 6mm;
  overflow: hidden;
}
.pregunta-texto {
  font-family: var(--sans);
  font-size: 6.5mm;
  font-weight: 700;
  color: var(--black);
  line-height: 1.3;
  padding-bottom: 5mm;
  border-bottom: 0.4mm solid var(--light);
  letter-spacing: -0.01em;
}
.respuesta-texto {
  font-family: var(--sans);
  font-size: 4.6mm;
  line-height: 1.6;
  color: var(--text);
}
.respuesta-texto p { margin-bottom: 2.5mm; }
.respuesta-texto p:last-child { margin-bottom: 0; }
.respuesta-texto strong { color: var(--red); font-weight: 700; }
.respuesta-texto em { font-style: italic; color: var(--gray); }
.respuesta-texto blockquote {
  border-left: 1.5mm solid var(--light);
  padding: 1mm 4mm;
  margin: 2mm 0;
  font-style: italic;
  color: var(--gray);
  font-size: 4.2mm;
}

/* ═══════════════════════════════════════════════
   WARNING layout (Trampa común)
═══════════════════════════════════════════════ */
.slide-warning .slide-header {
  background: var(--white);
  border-bottom: 2.5mm solid var(--red);
  height: 14mm;
}
.slide-warning .slide-header .slide-titulo {
  color: var(--red);
  font-weight: 800;
}
.slide-warning .slide-header .slide-titulo::before {
  content: '⚠ ';
  margin-right: 2mm;
}
.slide-warning .slide-header .slide-num {
  color: var(--gray);
}
.slide-warning .slide-body {
  background: var(--white);
  padding: 10mm 12mm;
  display: flex;
  flex-direction: column;
  gap: 5mm;
}
.slide-warning .slide-body > p:first-child,
.slide-warning .slide-body > h2:first-child + p,
.slide-warning .slide-body p:first-of-type {
  font-size: 7mm;
  font-weight: 700;
  color: var(--black);
  line-height: 1.3;
  padding: 4mm 6mm 4mm 8mm;
  background: var(--red-soft);
  border-left: 3mm solid var(--red);
  margin-bottom: 0;
}
.slide-warning .slide-body > p:first-child strong,
.slide-warning .slide-body p:first-of-type strong {
  color: var(--red);
  font-weight: 800;
}
.slide-warning .slide-body p {
  font-size: 4.8mm;
  line-height: 1.6;
  color: var(--text);
  margin-bottom: 0;
}
.slide-warning .slide-body strong { color: var(--red); font-weight: 700; }
.slide-warning .slide-body blockquote {
  margin-top: 4mm;
  border-left: 2mm solid var(--red);
  background: var(--sand);
  padding: 4mm 6mm;
  font-size: 4.5mm;
  color: var(--text);
  line-height: 1.55;
}
.slide-warning .slide-body blockquote p:first-child {
  font-size: 4.5mm;
  font-weight: 400;
  background: none;
  border: none;
  padding: 0;
  color: var(--text);
}
.slide-warning .slide-body blockquote strong { color: var(--black); font-weight: 700; }

/* ═══════════════════════════════════════════════
   CODE layout — bloque oscuro
═══════════════════════════════════════════════ */
.slide-code .slide-body {
  padding: 8mm 10mm;
  display: flex;
  flex-direction: column;
  gap: 4mm;
}
.slide-code .slide-body p {
  font-size: 4.8mm;
  color: var(--text);
  line-height: 1.55;
}
.slide-code .slide-body p strong { color: var(--red); font-weight: 700; }
.slide-code .slide-body pre {
  flex: 1;
  background: #0f0f0f;
  padding: 7mm 8mm;
  overflow: hidden;
  border-left: 3mm solid var(--red);
}
.slide-code .slide-body code {
  font-family: var(--mono);
  font-size: 4.2mm;
  line-height: 1.7;
  color: #e8e8e8;
  white-space: pre;
  font-weight: 500;
}

/* ═══════════════════════════════════════════════
   TABLE layout
═══════════════════════════════════════════════ */
.slide-table .slide-body {
  padding: 9mm 12mm;
  display: flex;
  flex-direction: column;
  gap: 3mm;
}
.slide-table .slide-body p {
  font-size: 4.5mm;
  color: var(--gray);
  font-style: italic;
  line-height: 1.5;
}
.slide-table .slide-body p strong { color: var(--black); font-weight: 700; font-style: normal; }
.slide-table .slide-body table {
  width: 100%;
  border-collapse: collapse;
  font-size: 4.4mm;
}
.slide-table .slide-body th {
  background: var(--black);
  color: var(--white);
  padding: 3.5mm 5mm;
  text-align: left;
  font-weight: 700;
  font-family: var(--sans);
  font-size: 4mm;
  letter-spacing: 0.02em;
}
.slide-table .slide-body td {
  padding: 3.5mm 5mm;
  border-bottom: 0.3mm solid var(--light);
  color: var(--text);
  line-height: 1.45;
  vertical-align: top;
  font-family: var(--sans);
}
.slide-table .slide-body tr:nth-child(even) td { background: var(--sand); }
.slide-table .slide-body td strong { color: var(--red); font-weight: 700; }
.slide-table .slide-body blockquote {
  border-left: 2mm solid var(--red);
  background: var(--sand);
  padding: 3mm 5mm;
  margin: 2mm 0 0;
  font-size: 4.2mm;
  color: var(--text);
  font-style: italic;
  line-height: 1.5;
}
.slide-table .slide-body blockquote strong { color: var(--black); font-style: normal; }

/* Default: también habilitar tablas (para el overview) */
.slide-default .slide-body table {
  width: 100%;
  border-collapse: collapse;
  font-size: 4.4mm;
  margin: 4mm 0;
}
.slide-default .slide-body th {
  background: var(--black);
  color: var(--white);
  padding: 3.5mm 5mm;
  text-align: left;
  font-weight: 700;
  font-size: 4mm;
}
.slide-default .slide-body td {
  padding: 3.5mm 5mm;
  border-bottom: 0.3mm solid var(--light);
  color: var(--text);
  line-height: 1.45;
  vertical-align: top;
}
.slide-default .slide-body tr:nth-child(even) td { background: var(--sand); }
.slide-default .slide-body td strong { color: var(--red); font-weight: 700; }

/* Code inline */
.slide-body :not(pre) > code {
  font-family: var(--mono);
  background: var(--sand);
  padding: 0.5mm 1.5mm;
  font-size: 0.9em;
  color: var(--red);
  border-radius: 1mm;
}

/* ═══════════════════════════════════════════════
   CIERRE
═══════════════════════════════════════════════ */
.slide-cierre {
  background: var(--black);
  color: var(--white);
  justify-content: center;
  align-items: center;
  position: relative;
}
.slide-cierre::before {
  content: '';
  position: absolute; left: 0; top: 0; bottom: 0;
  width: 8mm;
  background: var(--red);
}
.cierre-inner {
  text-align: center;
  padding: 12mm 20mm;
  max-width: 200mm;
}
.cierre-eyebrow {
  font-family: var(--sans);
  font-size: 3.2mm;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--red);
  font-weight: 800;
  margin-bottom: 6mm;
}
.cierre-title {
  font-family: var(--disp);
  font-size: 14mm;
  font-weight: 900;
  color: var(--white);
  line-height: 1.1;
  margin-bottom: 7mm;
  letter-spacing: -0.015em;
}
.cierre-rule {
  width: 40mm;
  height: 1mm;
  background: var(--red);
  margin: 0 auto 7mm;
}
.cierre-meta {
  font-family: var(--sans);
  font-size: 3.4mm;
  color: rgba(255,255,255,0.4);
  line-height: 1.8;
  letter-spacing: 0.06em;
  font-weight: 400;
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
