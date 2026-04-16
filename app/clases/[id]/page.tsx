import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Link from 'next/link'
import { getClaseByNumero, getClases, REVALIDATE_SECONDS } from '@/lib/notion'
import { getPresentacion, Section } from '@/lib/presentaciones'
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

export async function generateMetadata({ params }: { params: { id: string } }) {
  const numero = parseInt(params.id)
  const clase = await getClaseByNumero(numero)
  if (!clase) return { title: 'Clase no encontrada' }
  return { title: `Clase ${clase.numero}: ${clase.titulo} · DERE-A0004` }
}

export default async function ClasePage({ params }: { params: { id: string } }) {
  const numero = parseInt(params.id)
  if (isNaN(numero)) notFound()

  const clase = await getClaseByNumero(numero)
  if (!clase) notFound()

  const pres = getPresentacion(numero)

  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{`Clase ${clase.numero}: ${clase.titulo}`}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Fraunces:opsz,wght@9..144,400;9..144,700;9..144,900&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <style dangerouslySetInnerHTML={{ __html: styles }} />
      </head>
      <body>
        {!pres ? (
          <Placeholder numero={clase.numero} titulo={clase.titulo} />
        ) : (
          <>
            <div className="toolbar">
              <Link href="/clases" className="toolbar-back">← Todas las clases</Link>
              <div className="toolbar-center">
                <span className="toolbar-clase">Clase {clase.numero}</span>
                <span className="toolbar-titulo">{clase.titulo}</span>
              </div>
              <PrintButton />
            </div>
            <main className="deck">
              {pres.sections.map((s, i) => (
                <SectionRenderer key={i} section={s} numero={clase.numero} />
              ))}
            </main>
          </>
        )}
      </body>
    </html>
  )
}

function SectionRenderer({ section, numero }: { section: Section; numero: number }) {
  switch (section.type) {
    case 'hero':
      return <Hero s={section} />
    case 'intro':
      return <Intro s={section} />
    case 'roadmap':
      return <Roadmap s={section} />
    case 'manifesto':
      return <Manifesto s={section} />
    case 'station':
      return <Station s={section} numero={numero} />
    case 'mecanismo':
      return <Mecanismo s={section} />
    case 'stat-hero':
      return <StatHero s={section} />
    case 'stat-duo':
      return <StatDuo s={section} />
    case 'stat-split':
      return <StatSplit s={section} />
    case 'grid-fallas':
      return <GridFallas s={section} />
    case 'exercise-intro':
      return <ExerciseIntro s={section} />
    case 'exercise-d':
      return <ExerciseD s={section} />
    case 'evaluacion':
      return <Evaluacion s={section} />
    case 'close':
      return <Close s={section} />
    case 'referencia':
      return <Referencia s={section} />
    case 'diagrama':
      return <Diagrama s={section} />
    default:
      return (
        <section className="slide slide-generic">
          <h2>{section.type}</h2>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{section.body}</ReactMarkdown>
        </section>
      )
  }
}

const MD = ({ children }: { children?: string }) =>
  children ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown> : null

// ── HERO ──────────────────────────────────────────
function Hero({ s }: { s: Section }) {
  return (
    <section className="slide slide-hero">
      <div className="hero-stripe" />
      <div className="hero-inner">
        <p className="hero-eyebrow">{s.slots.eyebrow}</p>
        <h1 className="hero-titulo">{s.slots.titulo}</h1>
        <p className="hero-subtitulo">{s.slots.subtitulo}</p>
      </div>
      <p className="hero-meta">{s.slots.meta}</p>
    </section>
  )
}

// ── INTRO ─────────────────────────────────────────
function Intro({ s }: { s: Section }) {
  return (
    <section className="slide slide-intro">
      <p className="intro-kicker">{s.slots.kicker}</p>
      <h2 className="intro-titulo">{s.slots.titulo}</h2>
      <div className="intro-body"><MD>{s.slots.body}</MD></div>
    </section>
  )
}

// ── ROADMAP (índice visual de la clase) ──────────
function Roadmap({ s }: { s: Section }) {
  const paradas = Array.from({ length: 12 }, (_, i) => i + 1)
    .map((n) => ({
      n,
      titulo: s.slots[`p${n}-titulo`],
      body: s.slots[`p${n}-body`],
    }))
    .filter((p) => p.titulo)
  return (
    <section className="slide slide-roadmap">
      <header className="rm-head">
        <p className="rm-kicker">{s.slots.kicker || 'EL MAPA DE HOY'}</p>
        <h2 className="rm-titulo">{s.slots.titulo}</h2>
      </header>
      <div className="rm-grid" data-count={paradas.length}>
        {paradas.map((p) => (
          <div key={p.n} className="rm-cell">
            <p className="rm-n">{String(p.n).padStart(2, '0')}</p>
            <h3 className="rm-sub">{p.titulo}</h3>
            {p.body && <p className="rm-body">{p.body}</p>}
          </div>
        ))}
      </div>
    </section>
  )
}

// ── MANIFESTO (tres preguntas) ───────────────────
function Manifesto({ s }: { s: Section }) {
  return (
    <section className="slide slide-manifesto">
      <h2 className="mani-titulo">{s.slots.titulo}</h2>
      <ol className="mani-list">
        <li><span className="mani-num">01</span><p>{s.slots.q1}</p></li>
        <li><span className="mani-num">02</span><p>{s.slots.q2}</p></li>
        <li><span className="mani-num">03</span><p>{s.slots.q3}</p></li>
      </ol>
      <p className="mani-footer">{s.slots.footer}</p>
    </section>
  )
}

// ── STATION ──────────────────────────────────────
function Station({ s, numero }: { s: Section; numero: number }) {
  return (
    <section className="slide slide-station">
      <header className="st-header">
        <div className="st-num">{s.props.num}</div>
        <div className="st-titles">
          <p className="st-eyebrow">{s.props.clases}</p>
          <h2 className="st-titulo">{s.slots.titulo}</h2>
        </div>
      </header>
      <div className="st-grid">
        <div className="st-dominar">
          <p className="st-label">QUÉ DEBEN DOMINAR</p>
          <div className="st-dominar-body"><MD>{s.slots.dominar}</MD></div>
        </div>
        <div className="st-pregunta">
          <p className="st-label">PREGUNTA AL CURSO</p>
          <p className="st-pregunta-texto">{s.slots.pregunta}</p>
          <div className="st-respuesta"><MD>{s.slots.respuesta}</MD></div>
        </div>
      </div>
      <div className="st-footer">
        <div className="st-trampa">
          <p className="st-mini-label">⚠ TRAMPA COMÚN</p>
          <div className="st-trampa-body"><MD>{s.slots.trampa}</MD></div>
        </div>
        <div className="st-regla">
          <p className="st-mini-label">REGLA DE ORO</p>
          <div className="st-regla-body"><MD>{s.slots.regla}</MD></div>
        </div>
      </div>
    </section>
  )
}

// ── MECANISMO (cuatro pasos) ─────────────────────
function Mecanismo({ s }: { s: Section }) {
  return (
    <section className="slide slide-mecanismo">
      <div className="mec-head">
        <p className="mec-kicker">MECANISMO DE AJUSTE</p>
        <h2 className="mec-titulo">{s.slots.titulo}</h2>
        <p className="mec-sub">{s.slots.subtitulo}</p>
      </div>
      <ol className="mec-pasos">
        <li><span className="mec-n">1</span><div><MD>{s.slots.paso1}</MD></div></li>
        <li className="mec-arrow">↓</li>
        <li><span className="mec-n">2</span><div><MD>{s.slots.paso2}</MD></div></li>
        <li className="mec-arrow">↓</li>
        <li><span className="mec-n">3</span><div><MD>{s.slots.paso3}</MD></div></li>
        <li className="mec-arrow">↓</li>
        <li className="mec-final"><span className="mec-n mec-n-final">✓</span><div><MD>{s.slots.paso4}</MD></div></li>
      </ol>
      <p className="mec-nota"><MD>{s.slots.nota}</MD></p>
    </section>
  )
}

// ── STAT HERO (dato gigante solo) ────────────────
function StatHero({ s }: { s: Section }) {
  return (
    <section className="slide slide-stat-hero">
      <div className="sh-numero">{s.slots.numero}</div>
      <div className="sh-side">
        <p className="sh-label">{s.slots.label}</p>
        <div className="sh-texto"><MD>{s.slots.texto}</MD></div>
        {s.slots.subtexto && (
          <div className="sh-subtexto"><MD>{s.slots.subtexto}</MD></div>
        )}
      </div>
    </section>
  )
}

// ── STAT DUO (un número + fórmula) ──────────────
function StatDuo({ s }: { s: Section }) {
  return (
    <section className="slide slide-stat-duo">
      <p className="sd-kicker">{s.slots.kicker}</p>
      <div className="sd-body">
        <div className="sd-left">
          <div className="sd-numero">{s.slots.numero}</div>
          <p className="sd-formula">{s.slots.formula}</p>
        </div>
        <div className="sd-right">
          <MD>{s.slots.texto}</MD>
        </div>
      </div>
    </section>
  )
}

// ── STAT SPLIT (dos números en paralelo) ────────
function StatSplit({ s }: { s: Section }) {
  return (
    <section className="slide slide-stat-split">
      <p className="ss-kicker">{s.slots.kicker}</p>
      <div className="ss-grid">
        <div className="ss-cell ss-left">
          <p className="ss-label">{s.slots.leftlabel}</p>
          <div className="ss-num">{s.slots.leftnum}</div>
          <p className="ss-pct">{s.slots.leftpct}</p>
          <p className="ss-formula">{s.slots.leftformula}</p>
        </div>
        <div className="ss-cell ss-right">
          <p className="ss-label">{s.slots.rightlabel}</p>
          <div className="ss-num">{s.slots.rightnum}</div>
          <p className="ss-pct">{s.slots.rightpct}</p>
          <p className="ss-formula">{s.slots.rightformula}</p>
        </div>
      </div>
      <div className="ss-insight"><MD>{s.slots.insight}</MD></div>
    </section>
  )
}

// ── GRID FALLAS ────────────────────────────────
function GridFallas({ s }: { s: Section }) {
  return (
    <section className="slide slide-grid-fallas">
      <header className="gf-head">
        <p className="gf-kicker">FALLAS DE MERCADO</p>
        <h2 className="gf-titulo">{s.slots.titulo}</h2>
      </header>
      <div className="gf-grid">
        {['1', '2', '3', '4'].map((n) => (
          <div key={n} className={`gf-cell gf-${n}`}>
            <p className="gf-n">0{n}</p>
            <h3 className="gf-sub">{s.slots[`f${n}-titulo`]}</h3>
            <div className="gf-body"><MD>{s.slots[`f${n}-body`]}</MD></div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ── EXERCISE INTRO ─────────────────────────────
function ExerciseIntro({ s }: { s: Section }) {
  return (
    <section className="slide slide-exercise-intro">
      <p className="ei-kicker">{s.slots.kicker}</p>
      <h2 className="ei-titulo">{s.slots.titulo}</h2>
      <div className="ei-datos">{s.slots.datos}</div>
      <p className="ei-nota">{s.slots.nota}</p>
    </section>
  )
}

// ── EXERCISE D (justificación externalidad) ─────
function ExerciseD({ s }: { s: Section }) {
  return (
    <section className="slide slide-exercise-d">
      <p className="ed-kicker">{s.slots.kicker}</p>
      <h2 className="ed-titulo">{s.slots.titulo}</h2>
      <div className="ed-body"><MD>{s.slots.body}</MD></div>
      <div className="ed-twist">
        <p className="ed-twist-label">EL GIRO</p>
        <div className="ed-twist-body"><MD>{s.slots.twist}</MD></div>
      </div>
    </section>
  )
}

// ── EVALUACIÓN ──────────────────────────────────
function Evaluacion({ s }: { s: Section }) {
  return (
    <section className="slide slide-evaluacion">
      <header className="ev-head">
        <p className="ev-kicker">EVALUACIÓN REGULAR 1</p>
        <h2 className="ev-titulo">{s.slots.titulo}</h2>
        <p className="ev-sub">{s.slots.sub}</p>
      </header>
      <div className="ev-grid">
        {[1, 2, 3].map((n) => (
          <div key={n} className="ev-cell">
            <p className="ev-sec">{s.slots[`sec${n}-label`]}</p>
            <p className="ev-pts">{s.slots[`sec${n}-pts`]}</p>
            <p className="ev-body">{s.slots[`sec${n}-body`]}</p>
          </div>
        ))}
      </div>
      <div className="ev-criterio"><MD>{s.slots.criterio}</MD></div>
      <div className="ev-claves"><MD>{s.slots.claves}</MD></div>
    </section>
  )
}

// ── CLOSE ────────────────────────────────────────
function Close({ s }: { s: Section }) {
  return (
    <section className="slide slide-close">
      <div className="cl-stripe" />
      <div className="cl-inner">
        <p className="cl-eyebrow">{s.slots.eyebrow}</p>
        <h2 className="cl-titulo">{s.slots.titulo}</h2>
        <div className="cl-body"><MD>{s.slots.body}</MD></div>
        <div className="cl-reglas">
          <p className="cl-reglas-label">REGLAS DE ORO QUE ENTRAN</p>
          <p className="cl-reglas-text">{s.slots.reglas}</p>
        </div>
        <p className="cl-meta">{s.slots.meta}</p>
      </div>
    </section>
  )
}

// ── REFERENCIA (bibliografía por tema) ──────────
function Referencia({ s }: { s: Section }) {
  const items = Array.from({ length: 10 }, (_, i) => i + 1)
    .map((n) => ({
      n,
      tema: s.slots[`r${n}-tema`],
      sam: s.slots[`r${n}-sam`],
      cf: s.slots[`r${n}-cf`],
    }))
    .filter((r) => r.tema)
  return (
    <section className="slide slide-referencia">
      <header className="ref-head">
        <p className="ref-kicker">{s.slots.kicker}</p>
        <h2 className="ref-titulo">{s.slots.titulo}</h2>
      </header>
      <div className="ref-tabla">
        <div className="ref-row ref-header-row">
          <span>TEMA</span>
          <span>SAMUELSON 18ª ED.</span>
          <span>CASE &amp; FAIR 10ª ED.</span>
        </div>
        {items.map((r) => (
          <div key={r.n} className="ref-row">
            <span className="ref-tema">{r.tema}</span>
            <span className="ref-cap">{r.sam}</span>
            <span className="ref-cap">{r.cf}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

// ── DIAGRAMA (SVG inline + explicación) ─────────
function DiagramFPP() {
  return (
    <svg viewBox="0 0 240 210" className="diag-svg" aria-label="Frontera de Posibilidades de Producción">
      <line x1="35" y1="10" x2="35" y2="185" stroke="#151515" strokeWidth="1.5" />
      <line x1="35" y1="185" x2="225" y2="185" stroke="#151515" strokeWidth="1.5" />
      <polygon points="35,7 32,14 38,14" fill="#151515" />
      <polygon points="228,185 221,182 221,188" fill="#151515" />
      <text x="40" y="15" fontSize="9" fill="#6B6B6B">Bien A</text>
      <text x="210" y="197" fontSize="9" fill="#6B6B6B">Bien B</text>
      {/* FPP curve */}
      <path d="M 35 22 C 90 25, 210 100, 215 185" stroke="#C8102E" strokeWidth="2.5" fill="none" />
      {/* Point ON curve (~t=0.5 → ~143, 74) */}
      <circle cx="143" cy="74" r="5" fill="#C8102E" />
      <line x1="35" y1="74" x2="143" y2="74" stroke="#C8102E" strokeWidth="0.8" strokeDasharray="3,3" />
      <line x1="143" y1="74" x2="143" y2="185" stroke="#C8102E" strokeWidth="0.8" strokeDasharray="3,3" />
      <text x="148" y="66" fontSize="9" fill="#C8102E" fontWeight="bold">Eficiencia</text>
      {/* Point INSIDE curve */}
      <circle cx="95" cy="135" r="4" fill="#6B6B6B" />
      <text x="100" y="132" fontSize="8.5" fill="#6B6B6B">Ineficiencia</text>
      {/* Point OUTSIDE curve */}
      <circle cx="175" cy="55" r="4" fill="#6B6B6B" />
      <text x="180" y="53" fontSize="8.5" fill="#6B6B6B">Inalcanzable</text>
    </svg>
  )
}

function DiagramEquilibrio() {
  return (
    <svg viewBox="0 0 220 200" className="diag-svg" aria-label="Punto de equilibrio de mercado">
      <line x1="30" y1="10" x2="30" y2="178" stroke="#151515" strokeWidth="1.5" />
      <line x1="30" y1="178" x2="210" y2="178" stroke="#151515" strokeWidth="1.5" />
      <polygon points="30,7 27,14 33,14" fill="#151515" />
      <polygon points="213,178 206,175 206,181" fill="#151515" />
      <text x="33" y="16" fontSize="9" fill="#6B6B6B">Precio</text>
      <text x="200" y="190" fontSize="9" fill="#6B6B6B">Cantidad</text>
      {/* Demand: (45,22) → (200,165) */}
      <line x1="45" y1="22" x2="200" y2="165" stroke="#C8102E" strokeWidth="2" />
      <text x="193" y="175" fontSize="10" fill="#C8102E" fontWeight="bold">D</text>
      {/* Supply: (45,165) → (200,22) */}
      <line x1="45" y1="165" x2="200" y2="22" stroke="#151515" strokeWidth="2" />
      <text x="193" y="19" fontSize="10" fill="#151515" fontWeight="bold">O</text>
      {/* Intersection at (122, 94) */}
      <circle cx="122" cy="94" r="5" fill="#C8102E" />
      <line x1="30" y1="94" x2="122" y2="94" stroke="#C8102E" strokeWidth="0.8" strokeDasharray="3,3" />
      <line x1="122" y1="94" x2="122" y2="178" stroke="#C8102E" strokeWidth="0.8" strokeDasharray="3,3" />
      <text x="8" y="97" fontSize="9" fill="#C8102E" fontWeight="bold">Pe</text>
      <text x="115" y="191" fontSize="9" fill="#C8102E" fontWeight="bold">Qe</text>
      <text x="127" y="89" fontSize="9" fill="#C8102E" fontWeight="bold">E</text>
    </svg>
  )
}

function DiagramCuña() {
  // Original equilibrium: (122, 94) — same as DiagramEquilibrio
  // After tax: Pc = y59 (consumer), Pv = y128 (producer), Qt = x85
  return (
    <svg viewBox="0 0 220 200" className="diag-svg" aria-label="Cuña impositiva">
      <line x1="30" y1="10" x2="30" y2="178" stroke="#151515" strokeWidth="1.5" />
      <line x1="30" y1="178" x2="210" y2="178" stroke="#151515" strokeWidth="1.5" />
      <polygon points="30,7 27,14 33,14" fill="#151515" />
      <polygon points="213,178 206,175 206,181" fill="#151515" />
      <text x="33" y="16" fontSize="9" fill="#6B6B6B">Precio</text>
      <text x="200" y="190" fontSize="9" fill="#6B6B6B">Cantidad</text>
      {/* Tax revenue rectangle */}
      <rect x="30" y="59" width="55" height="69" fill="#C8102E" opacity="0.12" />
      {/* Deadweight loss triangle */}
      <polygon points="85,59 85,128 122,94" fill="#C8102E" opacity="0.3" />
      {/* Demand line */}
      <line x1="45" y1="22" x2="200" y2="165" stroke="#C8102E" strokeWidth="2" />
      <text x="193" y="175" fontSize="10" fill="#C8102E" fontWeight="bold">D</text>
      {/* Supply line */}
      <line x1="45" y1="165" x2="200" y2="22" stroke="#151515" strokeWidth="2" />
      <text x="193" y="19" fontSize="10" fill="#151515" fontWeight="bold">O</text>
      {/* Dashed price levels */}
      <line x1="30" y1="59" x2="85" y2="59" stroke="#C8102E" strokeWidth="0.9" strokeDasharray="3,2" />
      <line x1="30" y1="94" x2="122" y2="94" stroke="#6B6B6B" strokeWidth="0.8" strokeDasharray="3,2" />
      <line x1="30" y1="128" x2="85" y2="128" stroke="#C8102E" strokeWidth="0.9" strokeDasharray="3,2" />
      {/* Dashed quantity levels */}
      <line x1="85" y1="59" x2="85" y2="178" stroke="#C8102E" strokeWidth="0.9" strokeDasharray="3,2" />
      <line x1="122" y1="94" x2="122" y2="178" stroke="#6B6B6B" strokeWidth="0.8" strokeDasharray="3,2" />
      {/* Tax bracket */}
      <line x1="21" y1="59" x2="21" y2="128" stroke="#C8102E" strokeWidth="1.5" />
      <line x1="21" y1="59" x2="27" y2="59" stroke="#C8102E" strokeWidth="1.5" />
      <line x1="21" y1="128" x2="27" y2="128" stroke="#C8102E" strokeWidth="1.5" />
      <text x="3" y="97" fontSize="9" fill="#C8102E" fontWeight="bold">T</text>
      {/* Price labels */}
      <text x="5" y="62" fontSize="8.5" fill="#C8102E" fontWeight="bold">Pc</text>
      <text x="7" y="97" fontSize="8.5" fill="#6B6B6B">Pe</text>
      <text x="5" y="131" fontSize="8.5" fill="#C8102E" fontWeight="bold">Pv</text>
      {/* Quantity labels */}
      <text x="79" y="191" fontSize="8.5" fill="#C8102E" fontWeight="bold">Qt</text>
      <text x="115" y="191" fontSize="8.5" fill="#6B6B6B">Qe</text>
      {/* Area labels */}
      <text x="38" y="89" fontSize="7.5" fill="#8A0B1F">Recauda-</text>
      <text x="38" y="100" fontSize="7.5" fill="#8A0B1F">ción</text>
      <text x="89" y="91" fontSize="7.5" fill="#8A0B1F">Peso</text>
      <text x="89" y="101" fontSize="7.5" fill="#8A0B1F">muerto</text>
    </svg>
  )
}

function Diagrama({ s }: { s: Section }) {
  const diagramas = ['1', '2', '3']
    .map((n) => ({
      tipo: s.slots[`d${n}-tipo`],
      titulo: s.slots[`d${n}-titulo`],
      texto: s.slots[`d${n}-texto`],
    }))
    .filter((d) => d.tipo)

  const renderSVG = (tipo: string) => {
    switch (tipo) {
      case 'fpp': return <DiagramFPP />
      case 'equilibrio': return <DiagramEquilibrio />
      case 'cuña': return <DiagramCuña />
      default: return null
    }
  }

  return (
    <section className="slide slide-diagrama">
      <p className="dg-kicker">{s.slots.kicker}</p>
      <div className="dg-grid" data-count={diagramas.length}>
        {diagramas.map((d, i) => (
          <div key={i} className="dg-panel">
            <div className="dg-svg-wrap">{renderSVG(d.tipo)}</div>
            <h3 className="dg-titulo">{d.titulo}</h3>
            <div className="dg-texto"><MD>{d.texto}</MD></div>
          </div>
        ))}
      </div>
    </section>
  )
}

function Placeholder({ numero, titulo }: { numero: number; titulo: string }) {
  return (
    <div className="placeholder">
      <div>
        <p className="ph-eyebrow">Clase {String(numero).padStart(2, '0')} · {titulo}</p>
        <h1>Presentación en preparación</h1>
        <p>Esta clase aún no tiene presentación web publicada.</p>
        <Link href="/clases" className="ph-back">← Volver a todas las clases</Link>
      </div>
    </div>
  )
}

const styles = `
:root {
  --red:   #C8102E;
  --red-dark: #8A0B1F;
  --red-soft: #FBE8EB;
  --black: #0D0D0D;
  --sand:  #F5F3EF;
  --white: #FFFFFF;
  --gray:  #6B6B6B;
  --light: #E8E6E1;
  --text:  #151515;
  --sans:  'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, sans-serif;
  --disp:  'Fraunces', Georgia, serif;
  --mono:  'JetBrains Mono', 'Consolas', monospace;
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body { font-family: var(--sans); background: var(--sand); color: var(--text); -webkit-font-smoothing: antialiased; }
a { color: inherit; text-decoration: none; }

/* ════════════════════════════════════════════
   TOOLBAR (solo pantalla)
════════════════════════════════════════════ */
.toolbar {
  position: fixed; top: 0; left: 0; right: 0; z-index: 999;
  background: var(--black); color: var(--white);
  padding: 0.7rem 1.5rem;
  display: flex; align-items: center; gap: 1.5rem;
  font-size: 0.8rem;
  font-weight: 500;
}
.toolbar-back { opacity: 0.6; transition: opacity 0.15s; }
.toolbar-back:hover { opacity: 1; }
.toolbar-center { flex: 1; display: flex; gap: 0.7rem; align-items: baseline; }
.toolbar-clase { color: var(--red); font-weight: 700; letter-spacing: 0.1em; font-size: 0.72rem; text-transform: uppercase; }
.toolbar-titulo { opacity: 0.85; }
.toolbar button {
  background: var(--red); color: var(--white); border: none;
  padding: 0.45rem 1.2rem; font-family: var(--sans); font-size: 0.72rem;
  font-weight: 700; cursor: pointer; letter-spacing: 0.1em; text-transform: uppercase;
  transition: background 0.15s;
}
.toolbar button:hover { background: var(--red-dark); }

/* ════════════════════════════════════════════
   DECK — screen layout (landing)
════════════════════════════════════════════ */
.deck {
  padding-top: 52px;
  display: flex;
  flex-direction: column;
}
.slide {
  position: relative;
  width: 100%;
  min-height: 100vh;
  padding: 8vh 10vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  border-bottom: 1px solid var(--light);
  break-after: page;
  page-break-after: always;
}

/* ════════════════════════════════════════════
   HERO
════════════════════════════════════════════ */
.slide-hero { background: var(--black); color: var(--white); padding: 0; }
.hero-stripe { position: absolute; left: 0; top: 0; bottom: 0; width: 12px; background: var(--red); }
.hero-inner {
  flex: 1; padding: 14vh 10vw 6vh 10vw;
  display: flex; flex-direction: column; justify-content: center;
}
.hero-eyebrow {
  font-size: clamp(0.7rem, 0.8vw, 0.85rem);
  letter-spacing: 0.4em; font-weight: 800; color: var(--red);
  margin-bottom: 3vh;
}
.hero-titulo {
  font-family: var(--disp);
  font-size: clamp(3.5rem, 9vw, 8rem);
  font-weight: 900; line-height: 0.95;
  letter-spacing: -0.02em;
  max-width: 14ch;
  margin-bottom: 3vh;
}
.hero-subtitulo {
  font-size: clamp(1.3rem, 2.2vw, 2rem);
  font-weight: 400;
  color: rgba(255,255,255,0.6);
  font-family: var(--disp);
  font-style: italic;
  letter-spacing: -0.005em;
}
.hero-meta {
  position: absolute; bottom: 6vh; left: 10vw; right: 10vw;
  font-size: clamp(0.7rem, 0.85vw, 0.9rem);
  color: rgba(255,255,255,0.35);
  letter-spacing: 0.05em;
}

/* ════════════════════════════════════════════
   INTRO
════════════════════════════════════════════ */
.slide-intro { background: var(--sand); }
.intro-kicker {
  font-size: 0.85rem; letter-spacing: 0.3em; font-weight: 800;
  color: var(--red); margin-bottom: 4vh;
}
.intro-titulo {
  font-family: var(--disp);
  font-size: clamp(2.2rem, 5vw, 4.5rem);
  font-weight: 700; line-height: 1.05;
  max-width: 18ch; margin-bottom: 5vh;
  letter-spacing: -0.015em;
}
.intro-body {
  max-width: 60ch;
  font-size: clamp(1.05rem, 1.3vw, 1.3rem);
  line-height: 1.7;
  color: #333;
}
.intro-body strong { color: var(--red); font-weight: 700; }
.intro-body p { margin-bottom: 1.2em; }

/* ════════════════════════════════════════════
   ROADMAP — índice visual
════════════════════════════════════════════ */
.slide-roadmap { background: var(--sand); padding: 6vh 7vw; gap: 4vh; }
.rm-head { padding-bottom: 3vh; border-bottom: 3px solid var(--red); }
.rm-kicker { font-size: 0.78rem; letter-spacing: 0.3em; font-weight: 800; color: var(--red); margin-bottom: 1vh; }
.rm-titulo {
  font-family: var(--disp);
  font-size: clamp(2rem, 4vw, 3.3rem);
  font-weight: 800;
  letter-spacing: -0.015em;
}
.rm-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2vh 2vw;
  flex: 1;
}
.rm-grid[data-count="6"] { grid-template-columns: repeat(3, 1fr); }
.rm-grid[data-count="3"] { grid-template-columns: repeat(3, 1fr); }
.rm-grid[data-count="5"] { grid-template-columns: repeat(5, 1fr); }
.rm-cell {
  background: var(--white);
  padding: 3vh 1.8vw;
  display: flex; flex-direction: column; gap: 1vh;
  border-left: 4px solid var(--red);
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
}
.rm-n {
  font-family: var(--disp);
  font-size: clamp(1.8rem, 3vw, 2.6rem);
  font-weight: 900;
  color: var(--red);
  line-height: 0.9;
  letter-spacing: -0.03em;
}
.rm-sub {
  font-family: var(--sans);
  font-size: clamp(1rem, 1.3vw, 1.2rem);
  font-weight: 700;
  color: var(--black);
  line-height: 1.2;
  letter-spacing: -0.005em;
}
.rm-body {
  font-size: clamp(0.82rem, 1vw, 0.95rem);
  line-height: 1.5;
  color: var(--gray);
}

/* ════════════════════════════════════════════
   MANIFESTO
════════════════════════════════════════════ */
.slide-manifesto { background: var(--white); }
.mani-titulo {
  font-family: var(--disp);
  font-size: clamp(2rem, 4vw, 3.5rem);
  font-weight: 700;
  margin-bottom: 6vh;
  max-width: 20ch;
  letter-spacing: -0.015em;
}
.mani-list { list-style: none; margin-bottom: 6vh; }
.mani-list li {
  display: flex; align-items: flex-start; gap: 3vw;
  padding: 3vh 0;
  border-top: 1px solid var(--light);
}
.mani-list li:last-child { border-bottom: 1px solid var(--light); }
.mani-num {
  font-family: var(--disp);
  font-size: clamp(2rem, 4vw, 3.5rem);
  font-weight: 900;
  color: var(--red);
  min-width: 2.5ch;
  letter-spacing: -0.02em;
}
.mani-list p {
  font-size: clamp(1.3rem, 2vw, 1.9rem);
  font-weight: 500;
  line-height: 1.35;
  font-family: var(--disp);
  font-style: italic;
  color: var(--black);
  letter-spacing: -0.01em;
}
.mani-footer {
  font-size: 0.95rem; color: var(--gray); font-style: italic;
  max-width: 55ch;
}

/* ════════════════════════════════════════════
   STATION — 5 estaciones consolidadas
════════════════════════════════════════════ */
.slide-station {
  background: var(--white);
  padding: 5vh 7vw;
  justify-content: flex-start;
  gap: 3vh;
}
.st-header { display: flex; align-items: center; gap: 4vw; padding-bottom: 3vh; border-bottom: 3px solid var(--red); }
.st-num {
  font-family: var(--disp);
  font-size: clamp(5rem, 11vw, 10rem);
  font-weight: 900;
  color: var(--red);
  line-height: 0.9;
  letter-spacing: -0.03em;
}
.st-titles { flex: 1; }
.st-eyebrow {
  font-size: 0.8rem; letter-spacing: 0.25em;
  font-weight: 700; color: var(--gray); text-transform: uppercase;
  margin-bottom: 1vh;
}
.st-titulo {
  font-family: var(--disp);
  font-size: clamp(2rem, 4vw, 3.3rem);
  font-weight: 800; line-height: 1.05;
  letter-spacing: -0.015em;
}
.st-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3vw;
  flex: 1;
}
.st-label {
  font-size: 0.72rem; letter-spacing: 0.2em; font-weight: 800;
  color: var(--red); margin-bottom: 2vh;
}
.st-mini-label {
  font-size: 0.68rem; letter-spacing: 0.18em; font-weight: 800;
  margin-bottom: 1vh;
}
.st-dominar-body ul { list-style: none; padding: 0; }
.st-dominar-body li {
  font-size: clamp(0.9rem, 1.15vw, 1.05rem);
  line-height: 1.55;
  padding: 1.2vh 0;
  border-bottom: 1px solid var(--light);
  color: var(--text);
}
.st-dominar-body li:last-child { border-bottom: 0; }
.st-dominar-body strong { color: var(--black); font-weight: 800; }
.st-pregunta { background: var(--sand); padding: 3vh 2.5vw; border-left: 4px solid var(--red); }
.st-pregunta-texto {
  font-family: var(--disp);
  font-size: clamp(1.1rem, 1.5vw, 1.4rem);
  font-weight: 700;
  line-height: 1.3;
  color: var(--black);
  margin-bottom: 2vh;
  padding-bottom: 2vh;
  border-bottom: 1px solid var(--light);
  letter-spacing: -0.01em;
}
.st-respuesta {
  font-size: clamp(0.88rem, 1.1vw, 1rem);
  line-height: 1.55;
  color: var(--text);
}
.st-respuesta strong { color: var(--red); font-weight: 700; }
.st-respuesta p { margin-bottom: 0.5em; }
.st-footer {
  display: grid; grid-template-columns: 1.3fr 1fr; gap: 3vw;
  padding-top: 2vh; border-top: 1px solid var(--light);
}
.st-trampa .st-mini-label { color: var(--red); }
.st-regla .st-mini-label { color: var(--black); }
.st-trampa-body, .st-regla-body {
  font-size: clamp(0.85rem, 1.05vw, 1rem);
  line-height: 1.5;
  color: var(--text);
}
.st-trampa-body strong { color: var(--red); font-weight: 700; }
.st-regla-body strong { color: var(--black); font-weight: 700; }

/* ════════════════════════════════════════════
   MECANISMO
════════════════════════════════════════════ */
.slide-mecanismo { background: var(--black); color: var(--white); padding: 6vh 10vw; }
.mec-head { margin-bottom: 4vh; }
.mec-kicker { font-size: 0.78rem; letter-spacing: 0.3em; color: var(--red); font-weight: 800; margin-bottom: 2vh; }
.mec-titulo {
  font-family: var(--disp);
  font-size: clamp(2rem, 4vw, 3.3rem);
  font-weight: 800;
  letter-spacing: -0.015em;
  margin-bottom: 1vh;
}
.mec-sub { color: rgba(255,255,255,0.55); font-size: 1.05rem; font-style: italic; font-family: var(--disp); }
.mec-pasos { list-style: none; display: flex; flex-direction: column; gap: 0.8vh; max-width: 75ch; }
.mec-pasos > li {
  display: flex; align-items: center; gap: 2vw;
  font-size: clamp(0.95rem, 1.15vw, 1.1rem);
}
.mec-pasos > li > div p { margin: 0; }
.mec-n {
  width: 44px; height: 44px; border-radius: 50%;
  background: var(--red); color: var(--white);
  display: flex; align-items: center; justify-content: center;
  font-family: var(--disp); font-weight: 900; font-size: 1.3rem;
  flex-shrink: 0;
}
.mec-n-final { background: var(--white); color: var(--red); }
.mec-arrow { padding-left: 18px; color: rgba(255,255,255,0.3); font-size: 1.2rem; }
.mec-pasos strong { color: var(--red); font-weight: 700; }
.mec-final strong { color: var(--white); }
.mec-nota {
  margin-top: 4vh;
  font-size: 0.95rem;
  color: rgba(255,255,255,0.5);
  font-style: italic;
  max-width: 60ch;
  border-left: 2px solid var(--red);
  padding-left: 1.2rem;
}
.mec-nota strong { color: var(--white); }
.mec-nota p { margin: 0; }

/* ════════════════════════════════════════════
   STAT HERO
════════════════════════════════════════════ */
.slide-stat-hero {
  background: var(--red); color: var(--white); padding: 0;
  flex-direction: row; align-items: stretch;
}
.sh-numero {
  flex: 0 0 55%;
  font-family: var(--disp);
  font-size: clamp(10rem, 22vw, 22rem);
  font-weight: 900;
  line-height: 0.85;
  letter-spacing: -0.06em;
  display: flex; align-items: center; justify-content: center;
  color: var(--white);
  padding: 4vh 2vw;
}
.sh-side {
  flex: 1;
  background: var(--black);
  padding: 10vh 5vw;
  display: flex; flex-direction: column; justify-content: center;
  gap: 3vh;
}
.sh-label {
  font-size: 0.85rem;
  letter-spacing: 0.3em;
  font-weight: 800;
  color: var(--red);
}
.sh-texto {
  font-family: var(--disp);
  font-size: clamp(1.3rem, 1.8vw, 1.8rem);
  line-height: 1.35;
  font-weight: 500;
  letter-spacing: -0.005em;
}
.sh-texto strong { color: var(--red); font-weight: 800; }
.sh-texto p { margin: 0; }
.sh-subtexto {
  font-size: 0.95rem;
  color: rgba(255,255,255,0.55);
  line-height: 1.5;
  border-top: 1px solid rgba(255,255,255,0.15);
  padding-top: 2vh;
}
.sh-subtexto strong { color: var(--white); }
.sh-subtexto p { margin: 0; }

/* ════════════════════════════════════════════
   STAT DUO
════════════════════════════════════════════ */
.slide-stat-duo { background: var(--white); padding: 6vh 8vw; }
.sd-kicker {
  font-size: 0.8rem; letter-spacing: 0.3em; font-weight: 800;
  color: var(--red); margin-bottom: 4vh;
}
.sd-body { display: grid; grid-template-columns: 1fr 1fr; gap: 5vw; align-items: center; flex: 1; }
.sd-left { border-right: 3px solid var(--red); padding-right: 3vw; }
.sd-numero {
  font-family: var(--disp);
  font-size: clamp(7rem, 16vw, 14rem);
  font-weight: 900;
  color: var(--red);
  line-height: 0.9;
  letter-spacing: -0.04em;
  margin-bottom: 2vh;
}
.sd-formula {
  font-family: var(--mono);
  font-size: clamp(1rem, 1.3vw, 1.2rem);
  color: var(--gray);
  letter-spacing: 0.02em;
}
.sd-right {
  font-family: var(--disp);
  font-size: clamp(1.15rem, 1.6vw, 1.6rem);
  line-height: 1.4;
  max-width: 30ch;
  letter-spacing: -0.005em;
}
.sd-right strong { color: var(--red); font-weight: 800; }

/* ════════════════════════════════════════════
   STAT SPLIT (dos partes)
════════════════════════════════════════════ */
.slide-stat-split { background: var(--sand); padding: 6vh 8vw; gap: 4vh; }
.ss-kicker {
  font-size: 0.8rem; letter-spacing: 0.3em; font-weight: 800;
  color: var(--red); margin-bottom: 2vh;
}
.ss-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0; background: var(--white); }
.ss-cell {
  padding: 5vh 3vw;
  display: flex; flex-direction: column;
  align-items: center; text-align: center;
  gap: 1.5vh;
}
.ss-left { border-right: 2px solid var(--light); }
.ss-left { background: var(--black); color: var(--white); }
.ss-right { background: var(--white); }
.ss-label {
  font-size: 0.7rem; letter-spacing: 0.25em; font-weight: 800;
  color: var(--red);
}
.ss-num {
  font-family: var(--disp);
  font-size: clamp(4rem, 9vw, 7rem);
  font-weight: 900;
  line-height: 0.9;
  letter-spacing: -0.03em;
}
.ss-left .ss-num { color: var(--white); }
.ss-right .ss-num { color: var(--red); }
.ss-pct {
  font-family: var(--disp);
  font-size: clamp(1.5rem, 2.4vw, 2.2rem);
  font-weight: 700;
  opacity: 0.7;
  letter-spacing: -0.01em;
}
.ss-formula {
  font-family: var(--mono);
  font-size: 0.95rem;
  opacity: 0.55;
}
.ss-insight {
  font-family: var(--disp);
  font-size: clamp(1.05rem, 1.3vw, 1.3rem);
  line-height: 1.4;
  max-width: 75ch;
  padding: 3vh 3vw;
  background: var(--white);
  border-left: 4px solid var(--red);
  letter-spacing: -0.005em;
}
.ss-insight strong { color: var(--red); font-weight: 800; }
.ss-insight p { margin: 0; }

/* ════════════════════════════════════════════
   GRID FALLAS (4 fallas de mercado)
════════════════════════════════════════════ */
.slide-grid-fallas { background: var(--white); padding: 5vh 7vw; gap: 3vh; }
.gf-head { padding-bottom: 2vh; border-bottom: 3px solid var(--red); }
.gf-kicker { font-size: 0.78rem; letter-spacing: 0.3em; font-weight: 800; color: var(--red); margin-bottom: 1vh; }
.gf-titulo {
  font-family: var(--disp);
  font-size: clamp(2rem, 4vw, 3.3rem);
  font-weight: 800;
  letter-spacing: -0.015em;
}
.gf-grid { display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 2vh 2vw; flex: 1; }
.gf-cell {
  background: var(--sand);
  padding: 3vh 2.5vw;
  display: flex; flex-direction: column; gap: 1.5vh;
  border-left: 4px solid var(--red);
}
.gf-2, .gf-3 { background: var(--black); color: var(--white); }
.gf-2 .gf-body, .gf-3 .gf-body { color: rgba(255,255,255,0.75); }
.gf-n {
  font-family: var(--disp);
  font-size: clamp(2rem, 3.5vw, 3rem);
  font-weight: 900;
  color: var(--red);
  line-height: 0.9;
  letter-spacing: -0.03em;
}
.gf-sub {
  font-family: var(--disp);
  font-size: clamp(1.2rem, 1.7vw, 1.6rem);
  font-weight: 800;
  letter-spacing: -0.01em;
}
.gf-body {
  font-size: clamp(0.88rem, 1.05vw, 1rem);
  line-height: 1.55;
}
.gf-body strong { color: var(--red); font-weight: 700; }
.gf-2 .gf-body strong, .gf-3 .gf-body strong { color: var(--white); }
.gf-body p { margin: 0; }

/* ════════════════════════════════════════════
   EXERCISE INTRO
════════════════════════════════════════════ */
.slide-exercise-intro { background: var(--black); color: var(--white); padding: 10vh 10vw; }
.ei-kicker { font-size: 0.82rem; letter-spacing: 0.35em; font-weight: 800; color: var(--red); margin-bottom: 4vh; }
.ei-titulo {
  font-family: var(--disp);
  font-size: clamp(3rem, 7vw, 6rem);
  font-weight: 900;
  letter-spacing: -0.02em;
  line-height: 1;
  margin-bottom: 5vh;
  max-width: 16ch;
}
.ei-datos {
  font-family: var(--mono);
  font-size: clamp(0.9rem, 1.15vw, 1.05rem);
  color: rgba(255,255,255,0.7);
  padding: 3vh 2vw;
  border-left: 4px solid var(--red);
  background: rgba(255,255,255,0.03);
  margin-bottom: 4vh;
  line-height: 1.8;
  letter-spacing: 0.02em;
}
.ei-nota { font-size: 0.95rem; color: rgba(255,255,255,0.5); font-style: italic; max-width: 60ch; }

/* ════════════════════════════════════════════
   EXERCISE D
════════════════════════════════════════════ */
.slide-exercise-d { background: var(--white); padding: 7vh 9vw; gap: 3vh; }
.ed-kicker { font-size: 0.8rem; letter-spacing: 0.3em; font-weight: 800; color: var(--red); }
.ed-titulo {
  font-family: var(--disp);
  font-size: clamp(3rem, 6.5vw, 5.5rem);
  font-weight: 900;
  color: var(--red);
  letter-spacing: -0.02em;
  line-height: 1;
  max-width: 12ch;
}
.ed-body {
  font-size: clamp(1.05rem, 1.35vw, 1.3rem);
  line-height: 1.6;
  max-width: 65ch;
  color: var(--text);
}
.ed-body strong { color: var(--black); font-weight: 700; }
.ed-body p { margin: 0 0 0.8em; }
.ed-twist {
  background: var(--black); color: var(--white);
  padding: 4vh 3vw;
  margin-top: 2vh;
}
.ed-twist-label {
  font-size: 0.72rem; letter-spacing: 0.3em; font-weight: 800;
  color: var(--red); margin-bottom: 1.5vh;
}
.ed-twist-body {
  font-family: var(--disp);
  font-size: clamp(1.1rem, 1.5vw, 1.5rem);
  line-height: 1.4;
  letter-spacing: -0.005em;
  max-width: 70ch;
}
.ed-twist-body strong { color: var(--red); font-weight: 800; }
.ed-twist-body p { margin: 0; }

/* ════════════════════════════════════════════
   EVALUACIÓN
════════════════════════════════════════════ */
.slide-evaluacion { background: var(--white); padding: 6vh 7vw; gap: 3vh; }
.ev-head { padding-bottom: 3vh; border-bottom: 3px solid var(--red); }
.ev-kicker { font-size: 0.78rem; letter-spacing: 0.3em; font-weight: 800; color: var(--red); margin-bottom: 1vh; }
.ev-titulo {
  font-family: var(--disp);
  font-size: clamp(2rem, 4vw, 3.2rem);
  font-weight: 800;
  letter-spacing: -0.015em;
  margin-bottom: 0.5vh;
}
.ev-sub { font-size: clamp(0.95rem, 1.1vw, 1.05rem); color: var(--gray); font-style: italic; }
.ev-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 2vw; }
.ev-cell {
  background: var(--sand);
  padding: 3vh 2vw;
  border-top: 3px solid var(--red);
  display: flex; flex-direction: column; gap: 1vh;
}
.ev-sec { font-size: 0.75rem; letter-spacing: 0.2em; font-weight: 800; color: var(--gray); }
.ev-pts {
  font-family: var(--disp);
  font-size: clamp(2.2rem, 4vw, 3.2rem);
  font-weight: 900;
  color: var(--red);
  line-height: 1;
  letter-spacing: -0.02em;
}
.ev-body { font-size: clamp(0.88rem, 1.05vw, 1rem); line-height: 1.5; color: var(--text); }
.ev-criterio {
  font-family: var(--disp);
  font-size: clamp(1.05rem, 1.3vw, 1.25rem);
  line-height: 1.45;
  padding: 2vh 2vw;
  background: var(--black);
  color: var(--white);
  letter-spacing: -0.005em;
}
.ev-criterio strong { color: var(--red); font-weight: 800; }
.ev-criterio p { margin: 0; }
.ev-claves {
  font-size: clamp(0.88rem, 1.05vw, 1rem);
  line-height: 1.7;
}
.ev-claves ul { list-style: none; padding: 0; }
.ev-claves li {
  padding: 1vh 0 1vh 2ch;
  border-bottom: 1px solid var(--light);
  position: relative;
}
.ev-claves li:last-child { border-bottom: 0; }
.ev-claves li::before {
  content: '→';
  position: absolute; left: 0; color: var(--red); font-weight: 800;
}
.ev-claves strong { color: var(--red); font-weight: 700; }

/* ════════════════════════════════════════════
   CLOSE
════════════════════════════════════════════ */
.slide-close { background: var(--black); color: var(--white); padding: 0; }
.cl-stripe { position: absolute; left: 0; top: 0; bottom: 0; width: 12px; background: var(--red); }
.cl-inner { flex: 1; padding: 10vh 10vw; display: flex; flex-direction: column; justify-content: center; gap: 4vh; }
.cl-eyebrow { font-size: 0.82rem; letter-spacing: 0.3em; font-weight: 800; color: var(--red); }
.cl-titulo {
  font-family: var(--disp);
  font-size: clamp(3rem, 7vw, 6.5rem);
  font-weight: 900;
  letter-spacing: -0.02em;
  line-height: 0.95;
  max-width: 15ch;
}
.cl-body {
  font-size: clamp(1.05rem, 1.35vw, 1.3rem);
  line-height: 1.6;
  max-width: 60ch;
  color: rgba(255,255,255,0.8);
}
.cl-body strong { color: var(--white); font-weight: 700; }
.cl-body p { margin: 0 0 0.8em; }
.cl-reglas {
  border-top: 2px solid var(--red);
  padding-top: 2vh;
}
.cl-reglas-label { font-size: 0.72rem; letter-spacing: 0.3em; font-weight: 800; color: var(--red); margin-bottom: 1vh; }
.cl-reglas-text {
  font-family: var(--disp);
  font-size: clamp(1.05rem, 1.35vw, 1.3rem);
  font-style: italic;
  color: rgba(255,255,255,0.75);
  line-height: 1.5;
  letter-spacing: -0.005em;
}
.cl-meta {
  font-size: 0.82rem;
  color: rgba(255,255,255,0.35);
  letter-spacing: 0.05em;
  margin-top: auto;
}

/* ════════════════════════════════════════════
   PLACEHOLDER (no hay presentación)
════════════════════════════════════════════ */
.placeholder { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 3rem; background: var(--sand); }
.placeholder > div { max-width: 560px; text-align: center; }
.ph-eyebrow { font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--red); font-weight: 800; margin-bottom: 1rem; }
.placeholder h1 { font-family: var(--disp); font-size: 2rem; margin-bottom: 1rem; font-weight: 700; letter-spacing: -0.015em; }
.placeholder p { color: var(--gray); margin-bottom: 1.5rem; }
.ph-back { color: var(--red); font-weight: 600; }

/* ════════════════════════════════════════════
   REFERENCIA (tabla bibliografía por tema)
════════════════════════════════════════════ */
.slide-referencia { background: var(--black); color: var(--white); padding: 5vh 7vw; gap: 3vh; }
.ref-head { padding-bottom: 2.5vh; border-bottom: 2px solid var(--red); }
.ref-kicker { font-size: 0.78rem; letter-spacing: 0.3em; font-weight: 800; color: var(--red); margin-bottom: 1vh; }
.ref-titulo {
  font-family: var(--disp);
  font-size: clamp(2rem, 4vw, 3.2rem);
  font-weight: 800;
  letter-spacing: -0.015em;
}
.ref-tabla { display: flex; flex-direction: column; flex: 1; gap: 0; overflow: hidden; }
.ref-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 2vw;
  padding: 1.4vh 0;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  align-items: baseline;
}
.ref-header-row {
  font-size: 0.68rem;
  letter-spacing: 0.22em;
  font-weight: 800;
  color: var(--red);
  border-bottom: 1px solid var(--red) !important;
  padding-bottom: 1.5vh;
}
.ref-tema {
  font-size: clamp(0.88rem, 1.1vw, 1.05rem);
  line-height: 1.3;
  color: var(--white);
}
.ref-cap {
  font-family: var(--mono);
  font-size: clamp(0.82rem, 1vw, 0.95rem);
  color: rgba(255,255,255,0.55);
}

/* ════════════════════════════════════════════
   DIAGRAMA (FPP + equilibrio + cuña)
════════════════════════════════════════════ */
.slide-diagrama { background: var(--sand); padding: 5vh 5vw; gap: 3vh; }
.dg-kicker {
  font-size: 0.78rem; letter-spacing: 0.3em; font-weight: 800;
  color: var(--red);
}
.dg-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3vw;
  flex: 1;
  align-items: start;
}
.dg-grid[data-count="2"] { grid-template-columns: repeat(2, 1fr); }
.dg-panel {
  background: var(--white);
  padding: 2.5vh 2vw;
  display: flex; flex-direction: column; gap: 1.5vh;
}
.dg-svg-wrap {
  width: 100%;
  aspect-ratio: 1.15 / 1;
  overflow: hidden;
}
.diag-svg { width: 100%; height: 100%; display: block; }
.dg-titulo {
  font-family: var(--sans);
  font-size: clamp(0.88rem, 1.1vw, 1rem);
  font-weight: 800;
  color: var(--black);
  padding-bottom: 1vh;
  border-bottom: 2px solid var(--red);
}
.dg-texto {
  font-size: clamp(0.78rem, 0.95vw, 0.9rem);
  line-height: 1.55;
  color: var(--text);
}
.dg-texto strong { color: var(--red); font-weight: 700; }
.dg-texto p { margin: 0 0 0.5em; }

/* ════════════════════════════════════════════
   PRINT — convierte landing en slides A4
════════════════════════════════════════════ */
@media print {
  * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  html, body { background: var(--white); }
  .toolbar { display: none !important; }
  .deck { padding-top: 0; }
  .slide {
    width: 297mm; height: 210mm;
    min-height: 210mm; max-height: 210mm;
    padding: 12mm 18mm 22mm;
    border-bottom: 0;
    break-after: page; page-break-after: always;
    overflow: hidden;
  }
  /* Ajustes específicos por tipo en print */
  .slide-hero, .slide-close, .slide-mecanismo, .slide-exercise-intro { padding: 0; }
  .slide-hero .hero-inner, .slide-close .cl-inner { padding: 22mm 22mm 18mm; }
  .slide-mecanismo, .slide-exercise-intro { padding: 20mm 22mm; }
  .slide-stat-hero { padding: 0; }
  .slide-stat-hero .sh-side { padding: 14mm 10mm; }

  .hero-titulo { font-size: 24mm; }
  .hero-subtitulo { font-size: 6mm; }
  .hero-meta { bottom: 12mm; left: 22mm; right: 22mm; }

  .intro-titulo { font-size: 12mm; }
  .intro-body { font-size: 4.2mm; }

  .rm-titulo { font-size: 9mm; }
  .rm-n { font-size: 7mm; }
  .rm-sub { font-size: 4mm; }
  .rm-body { font-size: 3.2mm; }

  .mani-titulo { font-size: 12mm; margin-bottom: 10mm; }
  .mani-num { font-size: 13mm; }
  .mani-list p { font-size: 6mm; }

  .st-num { font-size: 40mm; }
  .st-titulo { font-size: 9.5mm; }
  .st-dominar-body li { font-size: 3.8mm; padding: 1.2mm 0; }
  .st-pregunta-texto { font-size: 4.8mm; }
  .st-respuesta { font-size: 3.7mm; }
  .st-trampa-body, .st-regla-body { font-size: 3.6mm; }

  .mec-titulo { font-size: 10mm; }
  .mec-pasos > li { font-size: 4.4mm; }
  .mec-n { width: 10mm; height: 10mm; font-size: 5mm; }

  .sh-numero { font-size: 85mm; }
  .sh-texto { font-size: 6mm; }
  .sh-subtexto { font-size: 3.8mm; }

  .sd-numero { font-size: 55mm; }
  .sd-right { font-size: 6mm; }

  .ss-num { font-size: 28mm; }
  .ss-pct { font-size: 8mm; }
  .ss-insight { font-size: 5mm; }

  .gf-titulo { font-size: 10mm; }
  .gf-n { font-size: 10mm; }
  .gf-sub { font-size: 5.5mm; }
  .gf-body { font-size: 3.9mm; }

  .ei-titulo { font-size: 18mm; }
  .ei-datos { font-size: 4.2mm; }

  .ed-titulo { font-size: 18mm; }
  .ed-body { font-size: 5mm; }
  .ed-twist-body { font-size: 5.2mm; }

  .ev-titulo { font-size: 10mm; }
  .ev-pts { font-size: 12mm; }
  .ev-body { font-size: 3.9mm; }
  .ev-criterio { font-size: 4.5mm; }
  .ev-claves li { font-size: 3.9mm; padding: 1.5mm 0 1.5mm 3mm; }

  .cl-titulo { font-size: 22mm; }
  .cl-body { font-size: 4.8mm; }
  .cl-reglas-text { font-size: 4.5mm; }

  /* referencia print */
  .ref-titulo { font-size: 9mm; }
  .ref-tema { font-size: 3.8mm; }
  .ref-cap { font-size: 3.5mm; }
  .ref-row { padding: 1.8mm 0; }

  /* diagrama print */
  .dg-titulo { font-size: 3.5mm; padding-bottom: 1.5mm; }
  .dg-texto { font-size: 3mm; }
  .dg-panel { padding: 3mm 2mm; gap: 2mm; }
  .dg-grid { gap: 5mm; }
}

@page { size: A4 landscape; margin: 0; }
`
