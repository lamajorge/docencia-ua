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
  const isEval = pres?.frontmatter?.tipo === 'evaluacion'

  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{`Clase ${clase.numero}: ${clase.titulo}`}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Fraunces:opsz,wght@9..144,400;9..144,700;9..144,900&family=JetBrains+Mono:wght@400;500&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&display=swap"
          rel="stylesheet"
        />
        <style dangerouslySetInnerHTML={{ __html: styles + (isEval ? evalStyles : '') }} />
      </head>
      <body className={isEval ? 'eval-mode' : ''}>
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
    case 'eval-cabecera':
      return <EvalCabecera s={section} />
    case 'eval-encabezado':
      return <EvalEncabezado s={section} />
    case 'eval-instrucciones':
      return <EvalInstrucciones s={section} />
    case 'eval-seccion':
      return <EvalSeccion s={section} />
    case 'eval-ejercicio':
      return <EvalEjercicio s={section} />
    case 'eval-cierre':
      return <EvalCierre s={section} />
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
  const qs = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6']
    .map((k) => s.slots[k])
    .filter((q) => q && q.trim())
  return (
    <section className="slide slide-manifesto">
      <h2 className="mani-titulo">{s.slots.titulo}</h2>
      <ol className="mani-list">
        {qs.map((q, i) => (
          <li key={i}>
            <span className="mani-num">{String(i + 1).padStart(2, '0')}</span>
            <p>{q}</p>
          </li>
        ))}
      </ol>
      {s.slots.footer && <p className="mani-footer">{s.slots.footer}</p>}
    </section>
  )
}

// ── STATION ──────────────────────────────────────
function Station({ s, numero }: { s: Section; numero: number }) {
  const StHeader = () => (
    <header className="st-header">
      <div className="st-num">{s.props.num}</div>
      <div className="st-titles">
        <p className="st-eyebrow">{s.props.clases}</p>
        <h2 className="st-titulo">{s.slots.titulo}</h2>
      </div>
    </header>
  )

  if (s.props.part === 'a') {
    return (
      <section className="slide slide-station slide-station-a">
        <StHeader />
        <div className="st-dominar-full">
          <p className="st-label">QUÉ DEBEN DOMINAR</p>
          <div className="st-dominar-body st-dominar-cols"><MD>{s.slots.dominar}</MD></div>
        </div>
      </section>
    )
  }

  if (s.props.part === 'b') {
    return (
      <section className="slide slide-station slide-station-b">
        <StHeader />
        <div className="st-b-body">
          <div className="st-pregunta">
            <p className="st-label">PREGUNTA AL CURSO</p>
            <p className="st-pregunta-texto">{s.slots.pregunta}</p>
            <div className="st-respuesta"><MD>{s.slots.respuesta}</MD></div>
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
        </div>
      </section>
    )
  }

  return (
    <section className="slide slide-station">
      <StHeader />
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
  const cells = ['1', '2', '3', '4'].filter((n) => s.slots[`f${n}-titulo`])
  const layoutClass = cells.length === 2 ? 'gf-grid gf-grid-2' : 'gf-grid'
  return (
    <section className="slide slide-grid-fallas">
      <header className="gf-head">
        <p className="gf-kicker">FALLAS DE MERCADO</p>
        <h2 className="gf-titulo">{s.slots.titulo}</h2>
      </header>
      <div className={layoutClass}>
        {cells.map((n) => (
          <div key={n} className={`gf-cell gf-${n}`}>
            <p className="gf-n">0{n}</p>
            <h3 className="gf-sub">{s.slots[`f${n}-titulo`]}</h3>
            <div className="gf-body"><MD>{s.slots[`f${n}-body`]}</MD></div>
          </div>
        ))}
      </div>
      {s.slots.nota && (
        <div className="gf-nota"><MD>{s.slots.nota}</MD></div>
      )}
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
      <div className="ei-nota"><MD>{s.slots.nota}</MD></div>
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
function DiagramFPPTabla() {
  // Tabla 2.1 Case & Fair: A(0,700) B(200,650) C(380,510) D(500,400) E(550,0)
  // viewBox 240x210. X axis: Consumo 0→600 mapeado a 35→220 (185 unidades / 600 = 0.308)
  // Y axis: Capital 0→700 mapeado a 185→15 (170 unidades / 700 = 0.243)
  const fx = (consumo: number) => 35 + consumo * 0.308
  const fy = (capital: number) => 185 - capital * 0.243
  const A = { x: fx(0),   y: fy(700), label: 'A' }
  const B = { x: fx(200), y: fy(650), label: 'B' }
  const C = { x: fx(380), y: fy(510), label: 'C' }
  const D = { x: fx(500), y: fy(400), label: 'D' }
  const E = { x: fx(550), y: fy(0),   label: 'E' }
  // Punto interior (G) e inalcanzable (H)
  const G = { x: fx(280), y: fy(280), label: 'G' }
  const H = { x: fx(500), y: fy(620), label: 'H' }
  const pointsData = [
    { ...A, cap: 700, con: 0 }, { ...B, cap: 650, con: 200 },
    { ...C, cap: 510, con: 380 }, { ...D, cap: 400, con: 500 },
    { ...E, cap: 0, con: 550 },
  ]
  return (
    <svg viewBox="0 0 240 210" className="diag-svg" aria-label="FPP — Tabla 2.1 Case & Fair">
      {/* Ejes */}
      <line x1="35" y1="10" x2="35" y2="185" stroke="#151515" strokeWidth="1.5" />
      <line x1="35" y1="185" x2="225" y2="185" stroke="#151515" strokeWidth="1.5" />
      <polygon points="35,7 32,14 38,14" fill="#151515" />
      <polygon points="228,185 221,182 221,188" fill="#151515" />
      <text x="38" y="14" fontSize="8" fill="#6B6B6B">Capital</text>
      <text x="195" y="197" fontSize="8" fill="#6B6B6B">Consumo</text>
      {/* Tick marks Y (Capital) */}
      {[0, 200, 400, 510, 650, 700].map((v) => (
        <g key={`y${v}`}>
          <line x1="32" y1={fy(v)} x2="35" y2={fy(v)} stroke="#6B6B6B" strokeWidth="0.8" />
          <text x="8" y={fy(v) + 3} fontSize="6" fill="#6B6B6B" textAnchor="end">{v}</text>
        </g>
      ))}
      {/* Tick marks X (Consumo) */}
      {[0, 200, 380, 500, 550].map((v) => (
        <g key={`x${v}`}>
          <line x1={fx(v)} y1="185" x2={fx(v)} y2="188" stroke="#6B6B6B" strokeWidth="0.8" />
          <text x={fx(v)} y="196" fontSize="5.5" fill="#6B6B6B" textAnchor="middle">{v}</text>
        </g>
      ))}
      {/* Curva FPP suave a través de los 5 puntos */}
      <path
        d={`M ${A.x} ${A.y} C ${B.x} ${B.y - 5}, ${C.x - 30} ${C.y - 8}, ${C.x} ${C.y} S ${D.x + 10} ${D.y + 5}, ${E.x} ${E.y}`}
        stroke="#C8102E" strokeWidth="2.2" fill="none"
      />
      {/* Puntos eficientes A-E con dashed lines a ejes */}
      {pointsData.map((p, i) => (
        <g key={i}>
          <line x1="35" y1={p.y} x2={p.x} y2={p.y} stroke="#C8102E" strokeWidth="0.5" strokeDasharray="2,2" opacity="0.4" />
          <line x1={p.x} y1={p.y} x2={p.x} y2="185" stroke="#C8102E" strokeWidth="0.5" strokeDasharray="2,2" opacity="0.4" />
          <circle cx={p.x} cy={p.y} r="3.5" fill="#C8102E" />
          <text x={p.x + 5} y={p.y - 4} fontSize="8" fill="#C8102E" fontWeight="bold">{p.label}</text>
        </g>
      ))}
      {/* Punto G - ineficiente (interior) */}
      <circle cx={G.x} cy={G.y} r="3" fill="#6B6B6B" />
      <text x={G.x + 5} y={G.y - 3} fontSize="8" fill="#6B6B6B" fontWeight="bold">G</text>
      <text x={G.x - 2} y={G.y + 12} fontSize="6.5" fill="#6B6B6B">ineficiente</text>
      {/* Punto H - inalcanzable (exterior) */}
      <circle cx={H.x} cy={H.y} r="3" fill="#6B6B6B" />
      <text x={H.x + 5} y={H.y - 3} fontSize="8" fill="#6B6B6B" fontWeight="bold">H</text>
      <text x={H.x - 4} y={H.y + 11} fontSize="6.5" fill="#6B6B6B">inalcanzable</text>
    </svg>
  )
}

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
    <svg viewBox="0 -6 220 212" className="diag-svg" aria-label="Punto de equilibrio de mercado">
      <line x1="30" y1="10" x2="30" y2="178" stroke="#151515" strokeWidth="1.5" />
      <line x1="30" y1="178" x2="210" y2="178" stroke="#151515" strokeWidth="1.5" />
      <polygon points="30,7 27,14 33,14" fill="#151515" />
      <polygon points="213,178 206,175 206,181" fill="#151515" />
      <text x="33" y="16" fontSize="9" fill="#6B6B6B">Precio</text>
      <text x="200" y="190" fontSize="9" fill="#6B6B6B">Cantidad</text>
      {/* Demand: (45,22) → (200,165) */}
      <line x1="45" y1="22" x2="200" y2="165" stroke="#C8102E" strokeWidth="2" />
      <text x="191" y="172" fontSize="10" fill="#C8102E" fontWeight="bold">D</text>
      <text x="182" y="182" fontSize="6.5" fill="#C8102E">(Demanda)</text>
      {/* Supply: (45,165) → (200,22) */}
      <line x1="45" y1="165" x2="200" y2="22" stroke="#151515" strokeWidth="2" />
      <text x="192" y="18" fontSize="10" fill="#151515" fontWeight="bold">O</text>
      <text x="184" y="8" fontSize="6.5" fill="#6B6B6B">(Oferta)</text>
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
    <svg viewBox="0 0 220 208" className="diag-svg" aria-label="Cuña impositiva">
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
      <text x="1" y="89" fontSize="8" fill="#C8102E" fontWeight="bold">T</text>
      <text x="0" y="99" fontSize="6" fill="#C8102E">(impuesto)</text>
      {/* Price labels */}
      <text x="5" y="56" fontSize="7.5" fill="#C8102E" fontWeight="bold">Pc</text>
      <text x="1" y="64" fontSize="5.5" fill="#C8102E">(consumidor)</text>
      <text x="7" y="97" fontSize="7" fill="#6B6B6B">Pe (equilibrio</text>
      <text x="7" y="104" fontSize="7" fill="#6B6B6B">sin impuesto)</text>
      <text x="5" y="125" fontSize="7.5" fill="#C8102E" fontWeight="bold">Pv</text>
      <text x="1" y="133" fontSize="5.5" fill="#C8102E">(vendedor)</text>
      {/* Quantity labels */}
      <text x="74" y="191" fontSize="7.5" fill="#C8102E" fontWeight="bold">Qt</text>
      <text x="65" y="199" fontSize="5.5" fill="#C8102E">(con impuesto)</text>
      <text x="112" y="191" fontSize="7.5" fill="#6B6B6B">Qe</text>
      <text x="105" y="199" fontSize="5.5" fill="#6B6B6B">(sin impuesto)</text>
      {/* Area labels */}
      <text x="38" y="89" fontSize="7.5" fill="#8A0B1F">Recauda-</text>
      <text x="38" y="100" fontSize="7.5" fill="#8A0B1F">ción</text>
      <text x="89" y="91" fontSize="7.5" fill="#8A0B1F">Peso</text>
      <text x="89" y="101" fontSize="7.5" fill="#8A0B1F">muerto</text>
    </svg>
  )
}

// Demanda Ana — gasolina (Case & Fair Cap. 3)
// Datos: $1→20, $2→14, $3→10, $4→7, $5→5, $6→3, $7→2, $8→0
function DiagramDemandaAna() {
  const fx = (q: number) => 30 + q * 8.5
  const fy = (p: number) => 178 - p * 20.5
  const data: [number,number][] = [[1,20],[2,14],[3,10],[4,7],[5,5],[6,3],[7,2],[8,0]]
  return (
    <svg viewBox="0 0 220 200" className="diag-svg" aria-label="Demanda individual de Ana — gasolina">
      <line x1="30" y1="10" x2="30" y2="178" stroke="#151515" strokeWidth="1.5" />
      <line x1="30" y1="178" x2="210" y2="178" stroke="#151515" strokeWidth="1.5" />
      <polygon points="30,7 27,14 33,14" fill="#151515" />
      <polygon points="213,178 206,175 206,181" fill="#151515" />
      <text x="34" y="14" fontSize="8" fill="#6B6B6B">Precio ($)</text>
      <text x="180" y="190" fontSize="8" fill="#6B6B6B">Galones/sem</text>
      {/* Y-axis ticks (precios) */}
      {[1,2,3,4,5,6,7,8].map((p) => (
        <g key={`y${p}`}>
          <line x1="27" y1={fy(p)} x2="30" y2={fy(p)} stroke="#6B6B6B" strokeWidth="0.8" />
          <text x="13" y={fy(p) + 3} fontSize="6" fill="#6B6B6B" textAnchor="end">${p}</text>
        </g>
      ))}
      {/* X-axis ticks (cantidades) */}
      {[0,5,10,15,20].map((q) => (
        <g key={`x${q}`}>
          <line x1={fx(q)} y1="178" x2={fx(q)} y2="181" stroke="#6B6B6B" strokeWidth="0.8" />
          <text x={fx(q)} y="189" fontSize="5.5" fill="#6B6B6B" textAnchor="middle">{q}</text>
        </g>
      ))}
      <path
        d={`M ${fx(data[0][1])} ${fy(data[0][0])} ` + data.slice(1).map(([p, q]) => `L ${fx(q)} ${fy(p)}`).join(' ')}
        stroke="#C8102E" strokeWidth="2" fill="none"
      />
      {data.map(([p, q], i) => (
        <circle key={i} cx={fx(q)} cy={fy(p)} r="2.5" fill="#C8102E" />
      ))}
      <text x={fx(0) + 4} y={fy(8) - 2} fontSize="9" fill="#C8102E" fontWeight="bold">D</text>
    </svg>
  )
}

// Oferta Hojuelas — Samuelson Tabla 3-3
// Datos: $1→0, $2→7, $3→12, $4→16, $5→18
function DiagramOfertaHojuelas() {
  const fx = (q: number) => 30 + q * 9
  const fy = (p: number) => 178 - p * 32
  const data: [number,number][] = [[1,0],[2,7],[3,12],[4,16],[5,18]]
  return (
    <svg viewBox="0 0 220 200" className="diag-svg" aria-label="Oferta — hojuelas de maíz Samuelson">
      <line x1="30" y1="10" x2="30" y2="178" stroke="#151515" strokeWidth="1.5" />
      <line x1="30" y1="178" x2="210" y2="178" stroke="#151515" strokeWidth="1.5" />
      <polygon points="30,7 27,14 33,14" fill="#151515" />
      <polygon points="213,178 206,175 206,181" fill="#151515" />
      <text x="34" y="14" fontSize="8" fill="#6B6B6B">Precio ($/caja)</text>
      <text x="170" y="190" fontSize="8" fill="#6B6B6B">Cantidad (mill.)</text>
      {[1,2,3,4,5].map((p) => (
        <g key={`y${p}`}>
          <line x1="27" y1={fy(p)} x2="30" y2={fy(p)} stroke="#6B6B6B" strokeWidth="0.8" />
          <text x="13" y={fy(p) + 3} fontSize="6" fill="#6B6B6B" textAnchor="end">${p}</text>
        </g>
      ))}
      {[0,5,10,15,18].map((q) => (
        <g key={`x${q}`}>
          <line x1={fx(q)} y1="178" x2={fx(q)} y2="181" stroke="#6B6B6B" strokeWidth="0.8" />
          <text x={fx(q)} y="189" fontSize="5.5" fill="#6B6B6B" textAnchor="middle">{q}</text>
        </g>
      ))}
      <path
        d={`M ${fx(data[0][1])} ${fy(data[0][0])} ` + data.slice(1).map(([p, q]) => `L ${fx(q)} ${fy(p)}`).join(' ')}
        stroke="#151515" strokeWidth="2" fill="none"
      />
      {data.map(([p, q], i) => (
        <circle key={i} cx={fx(q)} cy={fy(p)} r="2.5" fill="#151515" />
      ))}
      <text x={fx(18) - 12} y={fy(5) - 2} fontSize="9" fill="#151515" fontWeight="bold">O</text>
    </svg>
  )
}

// Costos panadería — CMg crece con rendimientos decrecientes
// Datos CM: $500, $500, $550, $650, $900
function DiagramCostoPanaderia() {
  const fx = (q: number) => 30 + q * 32    // 0-6 → 30-222
  const fy = (cm: number) => 178 - cm * 0.16 // 0-1000 → 178-18
  const data = [[1,500],[2,500],[3,550],[4,650],[5,900]]
  return (
    <svg viewBox="0 0 240 200" className="diag-svg" aria-label="Costo Marginal — panadería">
      <line x1="30" y1="10" x2="30" y2="178" stroke="#151515" strokeWidth="1.5" />
      <line x1="30" y1="178" x2="230" y2="178" stroke="#151515" strokeWidth="1.5" />
      <polygon points="30,7 27,14 33,14" fill="#151515" />
      <polygon points="233,178 226,175 226,181" fill="#151515" />
      <text x="34" y="14" fontSize="8" fill="#6B6B6B">CMg ($)</text>
      <text x="190" y="190" fontSize="8" fill="#6B6B6B">Unidades</text>
      <path
        d={`M ${fx(data[0][0])} ${fy(data[0][1])} ` + data.slice(1).map(([q, cm]) => `L ${fx(q)} ${fy(cm)}`).join(' ')}
        stroke="#C8102E" strokeWidth="2" fill="none"
      />
      {data.map(([q, cm], i) => (
        <g key={i}>
          <circle cx={fx(q)} cy={fy(cm)} r="2.8" fill="#C8102E" />
          <text x={fx(q) + 4} y={fy(cm) - 4} fontSize="7" fill="#C8102E">${cm}</text>
        </g>
      ))}
      <text x={fx(5) - 14} y={fy(900) - 8} fontSize="9" fill="#C8102E" fontWeight="bold">CMg</text>
    </svg>
  )
}

// Equilibrio Soya — Case & Fair Cap. 3
// $1.75: Qd=50k Qs=25k · $2.50: Qd=Qs=35k · $3.00: Qd=20k Qs=40k
function DiagramEquilibrioSoya() {
  // Eje X: cantidad 0-55k → 30-210
  // Eje Y: precio $1-$3.5 → 178-18
  const fx = (q: number) => 30 + (q / 55) * 180
  const fy = (p: number) => 178 - ((p - 1) / 2.5) * 160
  return (
    <svg viewBox="0 0 220 200" className="diag-svg" aria-label="Equilibrio mercado de soya">
      <line x1="30" y1="10" x2="30" y2="178" stroke="#151515" strokeWidth="1.5" />
      <line x1="30" y1="178" x2="210" y2="178" stroke="#151515" strokeWidth="1.5" />
      <polygon points="30,7 27,14 33,14" fill="#151515" />
      <polygon points="213,178 206,175 206,181" fill="#151515" />
      <text x="34" y="14" fontSize="8" fill="#6B6B6B">$/fanega</text>
      <text x="170" y="190" fontSize="8" fill="#6B6B6B">Miles fanegas</text>
      {/* Demand line: through (50,1.75), (35,2.50), (20,3.00) */}
      <line x1={fx(55)} y1={fy(1.55)} x2={fx(15)} y2={fy(3.2)} stroke="#C8102E" strokeWidth="2" />
      <text x={fx(53)} y={fy(1.55) + 2} fontSize="9" fill="#C8102E" fontWeight="bold">D</text>
      {/* Supply line: through (25,1.75), (35,2.50), (40,3.00) */}
      <line x1={fx(15)} y1={fy(1.2)} x2={fx(50)} y2={fy(3.4)} stroke="#151515" strokeWidth="2" />
      <text x={fx(50) - 4} y={fy(3.4) - 2} fontSize="9" fill="#151515" fontWeight="bold">O</text>
      {/* Equilibrium point */}
      <circle cx={fx(35)} cy={fy(2.5)} r="3.5" fill="#C8102E" />
      <line x1="30" y1={fy(2.5)} x2={fx(35)} y2={fy(2.5)} stroke="#C8102E" strokeWidth="0.8" strokeDasharray="3,2" />
      <line x1={fx(35)} y1={fy(2.5)} x2={fx(35)} y2="178" stroke="#C8102E" strokeWidth="0.8" strokeDasharray="3,2" />
      <text x="6" y={fy(2.5) + 3} fontSize="8" fill="#C8102E" fontWeight="bold">$2.50</text>
      <text x={fx(35) - 6} y="190" fontSize="8" fill="#C8102E" fontWeight="bold">35k</text>
      {/* Excess at $1.75 */}
      <line x1={fx(25)} y1={fy(1.75)} x2={fx(50)} y2={fy(1.75)} stroke="#6B6B6B" strokeWidth="0.6" strokeDasharray="2,2" />
      <text x="6" y={fy(1.75) + 3} fontSize="7" fill="#6B6B6B">$1.75</text>
      <text x={fx(40)} y={fy(1.75) - 2} fontSize="6" fill="#6B6B6B">escasez</text>
      {/* Excess at $3.00 */}
      <line x1={fx(20)} y1={fy(3)} x2={fx(40)} y2={fy(3)} stroke="#6B6B6B" strokeWidth="0.6" strokeDasharray="2,2" />
      <text x="6" y={fy(3) + 3} fontSize="7" fill="#6B6B6B">$3.00</text>
      <text x={fx(28)} y={fy(3) - 2} fontSize="6" fill="#6B6B6B">superávit</text>
    </svg>
  )
}

// Equilibrio genérico con escala numérica sugerida (para clase-14)
function DiagramEquilibrioNum() {
  // Pe=$800, Qe=12M (datos del ejercicio clase-14)
  const fx = (q: number) => 30 + (q / 16) * 180
  const fy = (p: number) => 178 - ((p - 400) / 800) * 160
  return (
    <svg viewBox="0 -6 220 212" className="diag-svg" aria-label="Equilibrio de mercado — ejercicio">
      <line x1="30" y1="10" x2="30" y2="178" stroke="#151515" strokeWidth="1.5" />
      <line x1="30" y1="178" x2="210" y2="178" stroke="#151515" strokeWidth="1.5" />
      <polygon points="30,7 27,14 33,14" fill="#151515" />
      <polygon points="213,178 206,175 206,181" fill="#151515" />
      <text x="33" y="16" fontSize="8" fill="#6B6B6B">Precio ($)</text>
      <text x="175" y="190" fontSize="8" fill="#6B6B6B">Cantidad (mill.)</text>
      {/* Ticks Y */}
      {[400,600,800,1000,1200].map((p) => (
        <g key={`y${p}`}>
          <line x1="27" y1={fy(p)} x2="30" y2={fy(p)} stroke="#6B6B6B" strokeWidth="0.6" />
          <text x="8" y={fy(p) + 3} fontSize="5.5" fill="#6B6B6B" textAnchor="end">${p}</text>
        </g>
      ))}
      {/* Ticks X */}
      {[0,3,6,9,12,15].map((q) => (
        <g key={`x${q}`}>
          <line x1={fx(q)} y1="178" x2={fx(q)} y2="181" stroke="#6B6B6B" strokeWidth="0.6" />
          <text x={fx(q)} y="189" fontSize="5.5" fill="#6B6B6B" textAnchor="middle">{q}</text>
        </g>
      ))}
      {/* D */}
      <line x1={fx(2)} y1={fy(1150)} x2={fx(15)} y2={fy(500)} stroke="#C8102E" strokeWidth="2" />
      <text x={fx(15) - 4} y={fy(500) + 8} fontSize="9" fill="#C8102E" fontWeight="bold">D</text>
      <text x={fx(14)} y={fy(500) + 16} fontSize="6" fill="#C8102E">(Demanda)</text>
      {/* O */}
      <line x1={fx(2)} y1={fy(500)} x2={fx(15)} y2={fy(1150)} stroke="#151515" strokeWidth="2" />
      <text x={fx(15) - 4} y={fy(1150) - 2} fontSize="9" fill="#151515" fontWeight="bold">O</text>
      <text x={fx(14)} y={fy(1150) - 10} fontSize="6" fill="#6B6B6B">(Oferta)</text>
      {/* Equilibrium */}
      <circle cx={fx(12)} cy={fy(800)} r="4" fill="#C8102E" />
      <line x1="30" y1={fy(800)} x2={fx(12)} y2={fy(800)} stroke="#C8102E" strokeWidth="0.8" strokeDasharray="3,2" />
      <line x1={fx(12)} y1={fy(800)} x2={fx(12)} y2="178" stroke="#C8102E" strokeWidth="0.8" strokeDasharray="3,2" />
      <text x="4" y={fy(800) + 3} fontSize="7" fill="#C8102E" fontWeight="bold">$800</text>
      <text x={fx(12) - 6} y="196" fontSize="7" fill="#C8102E" fontWeight="bold">12M</text>
      <text x={fx(12) + 5} y={fy(800) - 3} fontSize="7" fill="#C8102E" fontWeight="bold">E</text>
    </svg>
  )
}

// Cuña del ejercicio clase-14: T=$200, Pe=$800, Pc=$940, Pv=$740, Qe=12M, Qt=9M
function DiagramCunaEjercicio() {
  const fx = (q: number) => 30 + (q / 16) * 180
  const fy = (p: number) => 178 - ((p - 400) / 800) * 160
  return (
    <svg viewBox="0 0 220 208" className="diag-svg" aria-label="Cuña impositiva — ejercicio bebidas azucaradas">
      <line x1="30" y1="10" x2="30" y2="178" stroke="#151515" strokeWidth="1.5" />
      <line x1="30" y1="178" x2="210" y2="178" stroke="#151515" strokeWidth="1.5" />
      <polygon points="30,7 27,14 33,14" fill="#151515" />
      <polygon points="213,178 206,175 206,181" fill="#151515" />
      <text x="33" y="16" fontSize="8" fill="#6B6B6B">Precio ($)</text>
      <text x="175" y="190" fontSize="8" fill="#6B6B6B">Cantidad (mill.)</text>
      {/* Ticks Y */}
      {[400,600,740,800,940,1200].map((p) => (
        <g key={`y${p}`}>
          <line x1="27" y1={fy(p)} x2="30" y2={fy(p)} stroke="#6B6B6B" strokeWidth="0.5" />
        </g>
      ))}
      {/* Ticks X */}
      {[0,3,6,9,12].map((q) => (
        <g key={`x${q}`}>
          <line x1={fx(q)} y1="178" x2={fx(q)} y2="181" stroke="#6B6B6B" strokeWidth="0.5" />
          <text x={fx(q)} y="189" fontSize="5" fill="#6B6B6B" textAnchor="middle">{q}</text>
        </g>
      ))}
      {/* Recaudación */}
      <rect x="30" y={fy(940)} width={fx(9) - 30} height={fy(740) - fy(940)} fill="#C8102E" opacity="0.12" />
      {/* Peso muerto */}
      <polygon points={`${fx(9)},${fy(940)} ${fx(9)},${fy(740)} ${fx(12)},${fy(800)}`} fill="#C8102E" opacity="0.3" />
      {/* D */}
      <line x1={fx(2)} y1={fy(1150)} x2={fx(15)} y2={fy(500)} stroke="#C8102E" strokeWidth="2" />
      <text x={fx(15) - 4} y={fy(500) + 8} fontSize="9" fill="#C8102E" fontWeight="bold">D</text>
      {/* O */}
      <line x1={fx(2)} y1={fy(500)} x2={fx(15)} y2={fy(1150)} stroke="#151515" strokeWidth="2" />
      <text x={fx(15) - 4} y={fy(1150) - 2} fontSize="9" fill="#151515" fontWeight="bold">O</text>
      {/* Dashed price levels */}
      <line x1="30" y1={fy(940)} x2={fx(9)} y2={fy(940)} stroke="#C8102E" strokeWidth="0.8" strokeDasharray="3,2" />
      <line x1="30" y1={fy(800)} x2={fx(12)} y2={fy(800)} stroke="#6B6B6B" strokeWidth="0.6" strokeDasharray="2,2" />
      <line x1="30" y1={fy(740)} x2={fx(9)} y2={fy(740)} stroke="#C8102E" strokeWidth="0.8" strokeDasharray="3,2" />
      <line x1={fx(9)} y1={fy(940)} x2={fx(9)} y2="178" stroke="#C8102E" strokeWidth="0.8" strokeDasharray="3,2" />
      <line x1={fx(12)} y1={fy(800)} x2={fx(12)} y2="178" stroke="#6B6B6B" strokeWidth="0.6" strokeDasharray="2,2" />
      {/* Tax bracket */}
      <line x1="21" y1={fy(940)} x2="21" y2={fy(740)} stroke="#C8102E" strokeWidth="1.5" />
      <line x1="21" y1={fy(940)} x2="27" y2={fy(940)} stroke="#C8102E" strokeWidth="1.5" />
      <line x1="21" y1={fy(740)} x2="27" y2={fy(740)} stroke="#C8102E" strokeWidth="1.5" />
      <text x="2" y={fy(840)} fontSize="7" fill="#C8102E" fontWeight="bold">T</text>
      <text x="0" y={fy(840) + 8} fontSize="5" fill="#C8102E">($200)</text>
      {/* Price labels */}
      <text x="4" y={fy(940) + 3} fontSize="6" fill="#C8102E" fontWeight="bold">$940 Pc</text>
      <text x="4" y={fy(800) + 3} fontSize="6" fill="#6B6B6B">$800 Pe</text>
      <text x="4" y={fy(740) + 3} fontSize="6" fill="#C8102E" fontWeight="bold">$740 Pv</text>
      {/* Quantity labels */}
      <text x={fx(9) - 4} y="200" fontSize="6" fill="#C8102E" fontWeight="bold">9M</text>
      <text x={fx(12) - 5} y="200" fontSize="6" fill="#6B6B6B">12M</text>
      {/* Area labels */}
      <text x={fx(4)} y={fy(840)} fontSize="6" fill="#8A0B1F">recaudación</text>
      <text x={fx(9.5)} y={fy(840)} fontSize="6" fill="#8A0B1F">peso</text>
      <text x={fx(9.5)} y={fy(840) + 8} fontSize="6" fill="#8A0B1F">muerto</text>
    </svg>
  )
}

// Tope precio gasolina EE.UU. 1973 — $1.50 equilibrio, $0.57 tope
function DiagramTopeGasolina() {
  // Eje X: cantidad 0-100 → 30-210
  // Eje Y: precio $0-$2 → 178-18
  const fx = (q: number) => 30 + (q / 100) * 180
  const fy = (p: number) => 178 - (p / 2) * 160
  return (
    <svg viewBox="0 0 220 200" className="diag-svg" aria-label="Precio máximo — gasolina EE.UU. 1973">
      <line x1="30" y1="10" x2="30" y2="178" stroke="#151515" strokeWidth="1.5" />
      <line x1="30" y1="178" x2="210" y2="178" stroke="#151515" strokeWidth="1.5" />
      <polygon points="30,7 27,14 33,14" fill="#151515" />
      <polygon points="213,178 206,175 206,181" fill="#151515" />
      <text x="34" y="14" fontSize="8" fill="#6B6B6B">Precio ($/gal)</text>
      <text x="170" y="190" fontSize="8" fill="#6B6B6B">Galones</text>
      {/* Shortage band at ceiling */}
      <rect x={fx(20)} y={fy(0.57) - 1} width={fx(85) - fx(20)} height="2" fill="#C8102E" opacity="0.3" />
      {/* Demand */}
      <line x1={fx(10)} y1={fy(1.95)} x2={fx(95)} y2={fy(0.2)} stroke="#C8102E" strokeWidth="2" />
      <text x={fx(95) - 8} y={fy(0.2) + 8} fontSize="9" fill="#C8102E" fontWeight="bold">D</text>
      {/* Supply */}
      <line x1={fx(15)} y1={fy(0.2)} x2={fx(95)} y2={fy(1.95)} stroke="#151515" strokeWidth="2" />
      <text x={fx(95) - 4} y={fy(1.95) - 2} fontSize="9" fill="#151515" fontWeight="bold">O</text>
      {/* Equilibrium $1.50 */}
      <circle cx={fx(53)} cy={fy(1.5)} r="3" fill="#6B6B6B" />
      <line x1="30" y1={fy(1.5)} x2={fx(53)} y2={fy(1.5)} stroke="#6B6B6B" strokeWidth="0.6" strokeDasharray="2,2" />
      <text x="6" y={fy(1.5) + 3} fontSize="7" fill="#6B6B6B">$1.50</text>
      <text x={fx(53) + 4} y={fy(1.5) - 3} fontSize="7" fill="#6B6B6B">Pe</text>
      {/* Ceiling line $0.57 */}
      <line x1="30" y1={fy(0.57)} x2={fx(95)} y2={fy(0.57)} stroke="#C8102E" strokeWidth="1.5" strokeDasharray="4,2" />
      <text x="6" y={fy(0.57) + 3} fontSize="7" fill="#C8102E" fontWeight="bold">$0.57</text>
      <text x={fx(95) + 2} y={fy(0.57) + 3} fontSize="7" fill="#C8102E" fontWeight="bold">Pmáx</text>
      {/* Qs and Qd at ceiling */}
      <line x1={fx(20)} y1={fy(0.57)} x2={fx(20)} y2="178" stroke="#6B6B6B" strokeWidth="0.6" strokeDasharray="2,2" />
      <line x1={fx(85)} y1={fy(0.57)} x2={fx(85)} y2="178" stroke="#6B6B6B" strokeWidth="0.6" strokeDasharray="2,2" />
      <text x={fx(20) - 5} y="190" fontSize="7" fill="#6B6B6B">Qs</text>
      <text x={fx(85) - 5} y="190" fontSize="7" fill="#6B6B6B">Qd</text>
      <text x={fx(45)} y={fy(0.57) - 5} fontSize="7" fill="#C8102E" fontWeight="bold">escasez</text>
    </svg>
  )
}

// Cuña tabaco — Pe=$1.500 Q=10M / Pc=$1.800 Pv=$1.300 Q=7M / T=$500
function DiagramCunaTabaco() {
  // Eje X: cantidad 0-12M → 30-210
  // Eje Y: precio $1000-$2000 → 178-18
  const fx = (q: number) => 30 + (q / 12) * 180
  const fy = (p: number) => 178 - ((p - 1000) / 1000) * 160
  return (
    <svg viewBox="0 0 220 200" className="diag-svg" aria-label="Cuña impositiva tabaco $500">
      <line x1="30" y1="10" x2="30" y2="178" stroke="#151515" strokeWidth="1.5" />
      <line x1="30" y1="178" x2="210" y2="178" stroke="#151515" strokeWidth="1.5" />
      <polygon points="30,7 27,14 33,14" fill="#151515" />
      <polygon points="213,178 206,175 206,181" fill="#151515" />
      <text x="34" y="14" fontSize="8" fill="#6B6B6B">$/cajetilla</text>
      <text x="170" y="190" fontSize="8" fill="#6B6B6B">Mill. cajetillas</text>
      {/* Recaudación */}
      <rect x="30" y={fy(1800)} width={fx(7) - 30} height={fy(1300) - fy(1800)} fill="#C8102E" opacity="0.12" />
      {/* Peso muerto */}
      <polygon
        points={`${fx(7)},${fy(1800)} ${fx(7)},${fy(1300)} ${fx(10)},${fy(1500)}`}
        fill="#C8102E" opacity="0.3"
      />
      {/* Demanda */}
      <line x1={fx(2)} y1={fy(1950)} x2={fx(11)} y2={fy(1100)} stroke="#C8102E" strokeWidth="2" />
      <text x={fx(11) - 4} y={fy(1100) + 8} fontSize="9" fill="#C8102E" fontWeight="bold">D</text>
      {/* Oferta */}
      <line x1={fx(2)} y1={fy(1100)} x2={fx(11)} y2={fy(1950)} stroke="#151515" strokeWidth="2" />
      <text x={fx(11) - 4} y={fy(1950) - 2} fontSize="9" fill="#151515" fontWeight="bold">O</text>
      {/* Equilibrio Pe=1500 Q=10 */}
      <circle cx={fx(10)} cy={fy(1500)} r="2.5" fill="#6B6B6B" />
      <line x1="30" y1={fy(1500)} x2={fx(10)} y2={fy(1500)} stroke="#6B6B6B" strokeWidth="0.6" strokeDasharray="2,2" />
      <text x="3" y={fy(1500) + 3} fontSize="7" fill="#6B6B6B">$1.500</text>
      {/* Pc = 1800 */}
      <line x1="30" y1={fy(1800)} x2={fx(7)} y2={fy(1800)} stroke="#C8102E" strokeWidth="0.8" strokeDasharray="3,2" />
      <text x="3" y={fy(1800) + 3} fontSize="7" fill="#C8102E" fontWeight="bold">$1.800</text>
      <text x={fx(7) + 2} y={fy(1800) + 3} fontSize="7" fill="#C8102E" fontWeight="bold">Pc</text>
      {/* Pv = 1300 */}
      <line x1="30" y1={fy(1300)} x2={fx(7)} y2={fy(1300)} stroke="#C8102E" strokeWidth="0.8" strokeDasharray="3,2" />
      <text x="3" y={fy(1300) + 3} fontSize="7" fill="#C8102E" fontWeight="bold">$1.300</text>
      <text x={fx(7) + 2} y={fy(1300) + 3} fontSize="7" fill="#C8102E" fontWeight="bold">Pv</text>
      {/* Cantidades */}
      <line x1={fx(7)} y1={fy(1300)} x2={fx(7)} y2="178" stroke="#C8102E" strokeWidth="0.8" strokeDasharray="3,2" />
      <line x1={fx(10)} y1={fy(1500)} x2={fx(10)} y2="178" stroke="#6B6B6B" strokeWidth="0.6" strokeDasharray="2,2" />
      <text x={fx(7) - 4} y="190" fontSize="7" fill="#C8102E" fontWeight="bold">7M</text>
      <text x={fx(10) - 4} y="190" fontSize="7" fill="#6B6B6B">10M</text>
      {/* T label */}
      <text x={fx(3)} y={fy(1550) + 3} fontSize="7" fill="#8A0B1F" fontWeight="bold">recaudación</text>
      <text x={fx(7.5)} y={fy(1550) + 3} fontSize="7" fill="#8A0B1F" fontWeight="bold">peso muerto</text>
    </svg>
  )
}

// Subsidio transporte — Pe=$900 Q=4M / Pc=$640 Pv=$1040 Q=5.2M / Subsidio=$400
function DiagramSubsidioTransporte() {
  // Eje X: cantidad 0-7M → 30-210
  // Eje Y: precio $400-$1200 → 178-18
  const fx = (q: number) => 30 + (q / 7) * 180
  const fy = (p: number) => 178 - ((p - 400) / 800) * 160
  return (
    <svg viewBox="0 0 220 200" className="diag-svg" aria-label="Subsidio transporte $400">
      <line x1="30" y1="10" x2="30" y2="178" stroke="#151515" strokeWidth="1.5" />
      <line x1="30" y1="178" x2="210" y2="178" stroke="#151515" strokeWidth="1.5" />
      <polygon points="30,7 27,14 33,14" fill="#151515" />
      <polygon points="213,178 206,175 206,181" fill="#151515" />
      <text x="34" y="14" fontSize="8" fill="#6B6B6B">$/viaje</text>
      <text x="170" y="190" fontSize="8" fill="#6B6B6B">Mill. viajes/día</text>
      {/* Costo fiscal */}
      <rect x="30" y={fy(1040)} width={fx(5.2) - 30} height={fy(640) - fy(1040)} fill="#151515" opacity="0.1" />
      {/* Peso muerto */}
      <polygon
        points={`${fx(4)},${fy(900)} ${fx(5.2)},${fy(1040)} ${fx(5.2)},${fy(640)}`}
        fill="#C8102E" opacity="0.3"
      />
      {/* Demanda */}
      <line x1={fx(1)} y1={fy(1180)} x2={fx(6.5)} y2={fy(450)} stroke="#C8102E" strokeWidth="2" />
      <text x={fx(6.5) - 4} y={fy(450) + 8} fontSize="9" fill="#C8102E" fontWeight="bold">D</text>
      {/* Oferta */}
      <line x1={fx(1)} y1={fy(450)} x2={fx(6.5)} y2={fy(1180)} stroke="#151515" strokeWidth="2" />
      <text x={fx(6.5) - 4} y={fy(1180) - 2} fontSize="9" fill="#151515" fontWeight="bold">O</text>
      {/* Equilibrio Pe=900 Q=4 */}
      <circle cx={fx(4)} cy={fy(900)} r="2.5" fill="#6B6B6B" />
      <line x1="30" y1={fy(900)} x2={fx(4)} y2={fy(900)} stroke="#6B6B6B" strokeWidth="0.6" strokeDasharray="2,2" />
      <text x="6" y={fy(900) + 3} fontSize="7" fill="#6B6B6B">$900</text>
      {/* Pv = 1040 (vendedor recibe más) */}
      <line x1="30" y1={fy(1040)} x2={fx(5.2)} y2={fy(1040)} stroke="#151515" strokeWidth="0.8" strokeDasharray="3,2" />
      <text x="3" y={fy(1040) + 3} fontSize="7" fill="#151515" fontWeight="bold">$1.040</text>
      <text x={fx(5.2) + 2} y={fy(1040) + 3} fontSize="7" fill="#151515" fontWeight="bold">Pv</text>
      {/* Pc = 640 (consumidor paga menos) */}
      <line x1="30" y1={fy(640)} x2={fx(5.2)} y2={fy(640)} stroke="#C8102E" strokeWidth="0.8" strokeDasharray="3,2" />
      <text x="6" y={fy(640) + 3} fontSize="7" fill="#C8102E" fontWeight="bold">$640</text>
      <text x={fx(5.2) + 2} y={fy(640) + 3} fontSize="7" fill="#C8102E" fontWeight="bold">Pc</text>
      {/* Cantidades */}
      <line x1={fx(5.2)} y1={fy(640)} x2={fx(5.2)} y2="178" stroke="#C8102E" strokeWidth="0.8" strokeDasharray="3,2" />
      <line x1={fx(4)} y1={fy(900)} x2={fx(4)} y2="178" stroke="#6B6B6B" strokeWidth="0.6" strokeDasharray="2,2" />
      <text x={fx(4) - 6} y="190" fontSize="7" fill="#6B6B6B">4M</text>
      <text x={fx(5.2) - 8} y="190" fontSize="7" fill="#C8102E" fontWeight="bold">5,2M</text>
    </svg>
  )
}

function Diagrama({ s }: { s: Section }) {
  const diagramas = ['1', '2', '3']
    .map((n) => ({
      tipo: s.slots[`d${n}-tipo`],
      titulo: s.slots[`d${n}-titulo`],
      texto: s.slots[`d${n}-texto`],
      leyenda: s.slots[`d${n}-leyenda`],
    }))
    .filter((d) => d.tipo)

  const renderSVG = (tipo: string) => {
    switch (tipo) {
      case 'fpp': return <DiagramFPP />
      case 'fpp-tabla': return <DiagramFPPTabla />
      case 'equilibrio': return <DiagramEquilibrio />
      case 'equilibrio-num': return <DiagramEquilibrioNum />
      case 'cuña': return <DiagramCuña />
      case 'cuna-ejercicio': return <DiagramCunaEjercicio />
      case 'demanda-ana': return <DiagramDemandaAna />
      case 'oferta-hojuelas': return <DiagramOfertaHojuelas />
      case 'costo-panaderia': return <DiagramCostoPanaderia />
      case 'equilibrio-soya': return <DiagramEquilibrioSoya />
      case 'tope-gasolina': return <DiagramTopeGasolina />
      case 'cuna-tabaco': return <DiagramCunaTabaco />
      case 'subsidio-transporte': return <DiagramSubsidioTransporte />
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
            {d.leyenda && (
              <div className="dg-leyenda"><MD>{d.leyenda}</MD></div>
            )}
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

// ── EVALUACIÓN ─────────────────────────────────────
// Tipos eval-* renderizan en modo "prueba impresa": carta vertical, B&N, Source Serif.

// Cabecera compacta unificada (va arriba de la primera página, no ocupa hoja propia).
function EvalCabecera({ s }: { s: Section }) {
  return (
    <section className="slide eval-slide eval-cabecera">
      <div className="ec-top">
        <p className="ec-sede">{s.slots.sede}</p>
        <p className="ec-curso">{s.slots.curso}</p>
      </div>
      <h1 className="ec-titulo">{s.slots.titulo}</h1>
      <p className="ec-datos">{s.slots.datos}</p>
      <div className="ec-identificacion">
        <div className="ec-campo ec-campo-nombre"><span>Nombre</span><span className="ec-line" /></div>
        <div className="ec-campo"><span>Sección</span><span className="ec-line" /></div>
        <div className="ec-campo"><span>Fecha</span><span className="ec-line" /></div>
      </div>
      {s.slots.instrucciones && (
        <div className="ec-instrucciones"><MD>{s.slots.instrucciones}</MD></div>
      )}
    </section>
  )
}

function EvalEncabezado({ s }: { s: Section }) {
  return (
    <section className="slide eval-slide eval-encabezado">
      <div className="eh-institucional">
        <p className="eh-sede">{s.slots.sede}</p>
        <p className="eh-curso">{s.slots.curso}</p>
      </div>
      <div className="eh-titulo-bloque">
        <h1 className="eh-titulo">{s.slots.titulo}</h1>
        <p className="eh-cobertura">{s.slots.cobertura}</p>
      </div>
      <p className="eh-datos">{s.slots.datos}</p>
      <div className="eh-identificacion">
        <div className="eh-campo"><span>Nombre completo</span><span className="eh-line" /></div>
        <div className="eh-campo eh-campo-corto"><span>Sección</span><span className="eh-line" /></div>
        <div className="eh-campo eh-campo-corto"><span>Fecha</span><span className="eh-line" /></div>
      </div>
    </section>
  )
}

function EvalInstrucciones({ s }: { s: Section }) {
  return (
    <section className="slide eval-slide eval-instrucciones">
      <div className="ei-caja"><MD>{s.slots.body || s.body}</MD></div>
    </section>
  )
}

function EvalSeccion({ s }: { s: Section }) {
  const paginaNueva = s.props.pagina === 'nueva'
  const tieneCabecera = !!(s.slots['cabecera-sede'] || s.slots['cabecera-titulo'])
  return (
    <section className={`slide eval-slide eval-hoja eval-seccion${paginaNueva ? ' eval-pagina-nueva' : ''}`}>
      {tieneCabecera && (
        <div className="eh-bloque">
          <div className="eh-top">
            <p className="eh-sede">{s.slots['cabecera-sede']}</p>
            <p className="eh-curso">{s.slots['cabecera-curso']}</p>
          </div>
          <h1 className="eh-titulo">{s.slots['cabecera-titulo']}</h1>
          <p className="eh-datos">{s.slots['cabecera-datos']}</p>
          <div className="eh-identificacion">
            <div className="eh-campo eh-campo-nombre"><span>Nombre</span><span className="eh-line" /></div>
            <div className="eh-campo"><span>Sección</span><span className="eh-line" /></div>
            <div className="eh-campo"><span>Fecha</span><span className="eh-line" /></div>
          </div>
          {s.slots['cabecera-instrucciones'] && (
            <div className="eh-instrucciones"><MD>{s.slots['cabecera-instrucciones']}</MD></div>
          )}
        </div>
      )}
      <header className="es-head">
        <h2 className="es-titulo">{s.slots.titulo}</h2>
        {s.slots.instrucciones && (
          <div className="es-instrucciones"><MD>{s.slots.instrucciones}</MD></div>
        )}
      </header>
      <div className="es-preguntas"><MD>{s.slots.preguntas || s.body}</MD></div>
    </section>
  )
}

function EvalEjercicio({ s }: { s: Section }) {
  const diag = (s.slots.diagrama || '').trim()
  const paginaNueva = s.props.pagina === 'nueva'
  return (
    <section className={`slide eval-slide eval-hoja eval-ejercicio${paginaNueva ? ' eval-pagina-nueva' : ''}`}>
      <header className="eej-head">
        <h2 className="eej-titulo">{s.slots.titulo}</h2>
      </header>
      <div className="eej-body">
        <div className="eej-contexto"><MD>{s.slots.contexto}</MD></div>
        {diag === 'cuna-tabaco-bn' && (
          <div className="eej-diagrama"><DiagramCunaTabacoBW /></div>
        )}
        {diag === 'equilibrio-ref-bn' && (
          <div className="eej-diagrama"><DiagramEquilibrioRefBW /></div>
        )}
      </div>
      <div className="eej-subpartes"><MD>{s.slots.subpartes}</MD></div>
    </section>
  )
}

// Diagrama de referencia genérico: un mercado en equilibrio con D y O cruzándose.
// Sin números, pensado para que el estudiante razone sobre desplazamientos.
function DiagramEquilibrioRefBW() {
  return (
    <svg viewBox="0 0 200 180" className="diag-bw" aria-label="Equilibrio de mercado">
      {/* Ejes */}
      <line x1="30" y1="15" x2="30" y2="155" stroke="#000" strokeWidth="1" />
      <line x1="30" y1="155" x2="190" y2="155" stroke="#000" strokeWidth="1" />
      <polygon points="30,12 27,19 33,19" fill="#000" />
      <polygon points="193,155 186,152 186,158" fill="#000" />
      <text x="35" y="19" fontSize="8" fill="#000" fontFamily="'Source Serif 4', serif" fontStyle="italic">Precio (P)</text>
      <text x="146" y="170" fontSize="8" fill="#000" fontFamily="'Source Serif 4', serif" fontStyle="italic">Cantidad (Q)</text>
      {/* Demanda: pendiente negativa */}
      <line x1="45" y1="35" x2="180" y2="140" stroke="#000" strokeWidth="1.6" />
      <text x="178" y="132" fontSize="10" fill="#000" fontWeight="700" fontFamily="'Source Serif 4', serif">D</text>
      {/* Oferta: pendiente positiva */}
      <line x1="45" y1="140" x2="180" y2="35" stroke="#000" strokeWidth="1.6" />
      <text x="178" y="45" fontSize="10" fill="#000" fontWeight="700" fontFamily="'Source Serif 4', serif">O</text>
      {/* Equilibrio en el centro (cruce a 112, 87) */}
      <circle cx="112" cy="87" r="2.5" fill="#000" />
      {/* Líneas punteadas hacia ejes */}
      <line x1="30" y1="87" x2="112" y2="87" stroke="#000" strokeWidth="0.6" strokeDasharray="2,2" />
      <line x1="112" y1="87" x2="112" y2="155" stroke="#000" strokeWidth="0.6" strokeDasharray="2,2" />
      {/* Etiquetas P* y Q* */}
      <text x="14" y="90" fontSize="9" fill="#000" fontWeight="700" fontFamily="'Source Serif 4', serif">P*</text>
      <text x="108" y="168" fontSize="9" fill="#000" fontWeight="700" fontFamily="'Source Serif 4', serif">Q*</text>
      {/* Label "E" junto al punto */}
      <text x="117" y="84" fontSize="8" fill="#000" fontStyle="italic" fontFamily="'Source Serif 4', serif">E</text>
    </svg>
  )
}

function EvalCierre({ s }: { s: Section }) {
  return (
    <section className="slide eval-slide eval-cierre">
      <div className="ec-linea" />
      <p className="ec-texto">{s.slots.body || s.body || '— Fin de la evaluación —'}</p>
    </section>
  )
}

// Cuña impositiva tabaco — versión B&N para la prueba impresa
// Pe=$1500, T=$500, Pc=$1800, Pv=$1300, Q antes=10M, Q después=7M.
function DiagramCunaTabacoBW() {
  const fx = (q: number) => 40 + (q / 12) * 230
  const fy = (p: number) => 180 - ((p - 1000) / 1100) * 150
  return (
    <svg viewBox="0 0 290 210" className="diag-bw" aria-label="Cuña impositiva tabaco">
      {/* Ejes */}
      <line x1="40" y1="20" x2="40" y2="180" stroke="#000" strokeWidth="1" />
      <line x1="40" y1="180" x2="280" y2="180" stroke="#000" strokeWidth="1" />
      <polygon points="40,17 37,24 43,24" fill="#000" />
      <polygon points="283,180 276,177 276,183" fill="#000" />
      <text x="45" y="24" fontSize="7" fill="#000" fontFamily="'Source Serif 4', serif">$/cajetilla</text>
      <text x="232" y="192" fontSize="7" fill="#000" fontFamily="'Source Serif 4', serif">Millones de cajetillas</text>
      {/* Hatching patterns */}
      <defs>
        <pattern id="hatchRec" patternUnits="userSpaceOnUse" width="4" height="4" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="4" stroke="#000" strokeWidth="0.6" />
        </pattern>
        <pattern id="hatchPM" patternUnits="userSpaceOnUse" width="3" height="3" patternTransform="rotate(-45)">
          <line x1="0" y1="0" x2="0" y2="3" stroke="#000" strokeWidth="0.8" />
        </pattern>
      </defs>
      {/* Recaudación: rectángulo con hatch */}
      <rect x={fx(0) + 0.5} y={fy(1800)} width={fx(7) - fx(0) - 0.5} height={fy(1300) - fy(1800)} fill="url(#hatchRec)" stroke="#000" strokeWidth="0.6" />
      {/* Peso muerto: triángulo entre 7M y 10M */}
      <polygon points={`${fx(7)},${fy(1800)} ${fx(7)},${fy(1300)} ${fx(10)},${fy(1500)}`} fill="url(#hatchPM)" stroke="#000" strokeWidth="0.6" />
      {/* Curva demanda */}
      <line x1={fx(2)} y1={fy(1950)} x2={fx(11.5)} y2={fy(1100)} stroke="#000" strokeWidth="1.6" />
      <text x={fx(11.5) - 3} y={fy(1100) + 9} fontSize="9" fill="#000" fontWeight="700" fontFamily="'Source Serif 4', serif">D</text>
      {/* Curva oferta */}
      <line x1={fx(2)} y1={fy(1100)} x2={fx(11.5)} y2={fy(1950)} stroke="#000" strokeWidth="1.6" />
      <text x={fx(11.5) - 3} y={fy(1950) - 2} fontSize="9" fill="#000" fontWeight="700" fontFamily="'Source Serif 4', serif">O</text>
      {/* Equilibrio sin impuesto Pe=1500 Q=10 */}
      <circle cx={fx(10)} cy={fy(1500)} r="2" fill="#000" />
      <line x1="40" y1={fy(1500)} x2={fx(10)} y2={fy(1500)} stroke="#000" strokeWidth="0.5" strokeDasharray="2,2" />
      <line x1={fx(10)} y1={fy(1500)} x2={fx(10)} y2="180" stroke="#000" strokeWidth="0.5" strokeDasharray="2,2" />
      <text x="10" y={fy(1500) + 3} fontSize="7" fill="#000" fontFamily="'Source Serif 4', serif">$1.500</text>
      <text x="3" y={fy(1500) - 4} fontSize="6" fill="#000" fontFamily="'Source Serif 4', serif">Pe</text>
      <text x={fx(10) - 3} y="192" fontSize="7" fill="#000" fontFamily="'Source Serif 4', serif">10</text>
      <text x={fx(10) - 6} y="200" fontSize="6" fill="#000" fontFamily="'Source Serif 4', serif" fontStyle="italic">Qe</text>
      {/* Pc = 1800 */}
      <circle cx={fx(7)} cy={fy(1800)} r="2" fill="#000" />
      <line x1="40" y1={fy(1800)} x2={fx(7)} y2={fy(1800)} stroke="#000" strokeWidth="0.8" />
      <text x="10" y={fy(1800) + 3} fontSize="7" fill="#000" fontWeight="700" fontFamily="'Source Serif 4', serif">$1.800</text>
      <text x="3" y={fy(1800) - 4} fontSize="6" fill="#000" fontWeight="700" fontFamily="'Source Serif 4', serif">Pc</text>
      {/* Pv = 1300 */}
      <circle cx={fx(7)} cy={fy(1300)} r="2" fill="#000" />
      <line x1="40" y1={fy(1300)} x2={fx(7)} y2={fy(1300)} stroke="#000" strokeWidth="0.8" />
      <text x="10" y={fy(1300) + 3} fontSize="7" fill="#000" fontWeight="700" fontFamily="'Source Serif 4', serif">$1.300</text>
      <text x="3" y={fy(1300) - 4} fontSize="6" fill="#000" fontWeight="700" fontFamily="'Source Serif 4', serif">Pv</text>
      {/* Cantidad 7M */}
      <line x1={fx(7)} y1={fy(1300)} x2={fx(7)} y2="180" stroke="#000" strokeWidth="0.8" />
      <text x={fx(7) - 3} y="192" fontSize="7" fill="#000" fontWeight="700" fontFamily="'Source Serif 4', serif">7</text>
      <text x={fx(7) - 6} y="200" fontSize="6" fill="#000" fontWeight="700" fontFamily="'Source Serif 4', serif" fontStyle="italic">Q'</text>
      {/* Cuña T label (entre Pc y Pv a la altura del Q') */}
      <line x1={fx(7) + 14} y1={fy(1800)} x2={fx(7) + 14} y2={fy(1300)} stroke="#000" strokeWidth="0.5" />
      <line x1={fx(7) + 12} y1={fy(1800)} x2={fx(7) + 16} y2={fy(1800)} stroke="#000" strokeWidth="0.5" />
      <line x1={fx(7) + 12} y1={fy(1300)} x2={fx(7) + 16} y2={fy(1300)} stroke="#000" strokeWidth="0.5" />
      <text x={fx(7) + 18} y={fy(1550) + 2} fontSize="8" fill="#000" fontWeight="700" fontFamily="'Source Serif 4', serif">T</text>
    </svg>
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
.intro-body em { color: var(--gray); font-style: italic; }
.intro-body ul, .intro-body ol { margin: 0.8em 0 1.2em 0; padding-left: 1.4em; }
.intro-body li { margin-bottom: 0.5em; line-height: 1.55; }
.intro-body table {
  width: 100%; max-width: 70ch;
  border-collapse: collapse; margin: 1em 0 1.5em 0;
  background: #fff;
  font-size: 0.95em;
}
.intro-body table th {
  background: var(--black); color: var(--white);
  padding: 0.6em 0.9em; text-align: left;
  font-weight: 700; font-size: 0.85em;
  letter-spacing: 0.04em;
  border: 1px solid var(--black);
}
.intro-body table td {
  padding: 0.55em 0.9em;
  border: 1px solid var(--light);
  color: var(--text);
}
.intro-body table tr:nth-child(even) td { background: rgba(0,0,0,0.02); }
.intro-body table strong { color: var(--black); }

/* When intro body is dense, allow it to use the full slide */
.slide-intro { padding: 6vh 7vw; }
.slide-intro .intro-body { max-width: 80ch; }

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

/* Station Part A — dominar full-width, 2 columns */
.slide-station-a { gap: 2vh; }
.st-dominar-full { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
.st-dominar-cols ul { columns: 2; column-gap: 4vw; padding: 0; }
.st-dominar-cols li { break-inside: avoid; page-break-inside: avoid; }

/* Station Part B — pregunta/respuesta + trampa/regla, full slide */
.slide-station-b { gap: 2vh; }
.st-b-body { flex: 1; display: flex; flex-direction: column; gap: 2vh; min-height: 0; }
.slide-station-b .st-pregunta { flex: 1; min-height: 0; overflow: auto; }
.slide-station-b .st-footer { padding-top: 2vh; flex-shrink: 0; }

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
.gf-grid-2 { grid-template-columns: 1fr 1fr; grid-template-rows: 1fr; }
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
.gf-nota {
  margin-top: 2vh;
  padding: 1.8vh 2vw;
  background: var(--sand);
  border-left: 4px solid var(--red);
  font-size: clamp(0.88rem, 1.05vw, 1rem);
  line-height: 1.55;
}
.gf-nota strong { color: var(--red); font-weight: 700; }
.gf-nota p { margin: 0; }
.gf-nota ul { margin: 0; padding-left: 1.2em; }
.gf-nota li { margin: 0; }

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
.ei-nota { font-size: clamp(1rem, 1.25vw, 1.15rem); color: rgba(255,255,255,0.85); max-width: 72ch; line-height: 1.6; }
.ei-nota ul { list-style: none; padding: 0; }
.ei-nota li { padding: 0.5vh 0; border-bottom: 1px solid rgba(255,255,255,0.08); }
.ei-nota li:last-child { border-bottom: 0; }
.ei-nota strong { color: var(--red); font-weight: 700; }

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
.dg-leyenda {
  background: var(--black); color: var(--white);
  padding: 1.2vh 1vw; border-left: 3px solid var(--red);
  font-size: 0.78rem; line-height: 1.5;
  font-family: var(--mono); letter-spacing: 0.01em;
  margin: 0 0 0.6vh 0;
}
.dg-leyenda strong { color: var(--red); font-weight: 700; }
.dg-leyenda p { margin: 0; }

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

  .intro-titulo { font-size: 11mm; }
  .intro-body { font-size: 3.9mm; line-height: 1.55; }
  .intro-body p { margin-bottom: 2.5mm; }
  .intro-body li { margin-bottom: 1.2mm; font-size: 3.7mm; }
  .intro-body table { font-size: 3.4mm; }
  .intro-body table th { padding: 1.5mm 2mm; font-size: 3mm; }
  .intro-body table td { padding: 1.3mm 2mm; }

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

  /* Station part A print — 2-column dominar */
  .slide-station-a { padding: 12mm 18mm 18mm; }
  .st-dominar-cols ul { columns: 2; column-gap: 8mm; }
  .st-dominar-cols li { font-size: 3.7mm; padding: 1.1mm 0; break-inside: avoid; }

  /* Station part B print — drill slide, more breathing room */
  .slide-station-b { padding: 12mm 18mm 18mm; }
  .slide-station-b .st-pregunta-texto { font-size: 5.5mm; }
  .slide-station-b .st-respuesta { font-size: 4.2mm; }
  .slide-station-b .st-trampa-body,
  .slide-station-b .st-regla-body { font-size: 4mm; }

  /* exercise-intro nota */
  .ei-nota { font-size: 4.5mm; }
  .ei-nota li { padding: 1.2mm 0; }

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
  .gf-nota { font-size: 3.7mm; padding: 3mm 5mm; margin-top: 3mm; }

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
  .dg-leyenda { font-size: 2.6mm; padding: 1.5mm 2mm; }
  .dg-panel { padding: 3mm 2mm; gap: 2mm; }
  .dg-grid { gap: 5mm; }
}

@page { size: A4 landscape; margin: 0; }
`

// ── ESTILOS MODO EVALUACIÓN ───────────────────────
// Cada sección .eval-hoja es UNA hoja carta vertical independiente.
// El prop `pagina=nueva` fuerza salto de página en print y separación visual en screen.
// Override del .slide base para aislar de los estilos del modo clase.
const evalStyles = `
body.eval-mode {
  background: #e8e6e1;
  font-family: 'Source Serif 4', Georgia, serif;
  color: #000;
}
body.eval-mode .toolbar {
  background: #fff;
  color: #151515;
  border-bottom: 1px solid #d6d3cc;
}
body.eval-mode .toolbar-back,
body.eval-mode .toolbar-titulo,
body.eval-mode .toolbar-clase {
  color: #151515;
}
body.eval-mode .toolbar-print {
  background: #000;
  color: #fff;
  border: 1px solid #000;
}
body.eval-mode .deck {
  background: transparent;
  padding: 28px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
}

/* Reset del .slide base del modo clase cuando es eval-slide */
body.eval-mode .slide.eval-slide {
  display: block;
  position: static;
  width: auto;
  min-height: 0;
  max-height: none;
  padding: 0;
  margin: 0;
  background: transparent;
  color: #000;
  box-shadow: none;
  border: none;
  overflow: visible;
  font-family: 'Source Serif 4', Georgia, serif;
  line-height: 1.5;
  flex: 0 0 auto;
  break-after: auto;
  page-break-after: auto;
  break-before: auto;
  page-break-before: auto;
  break-inside: auto;
  box-sizing: border-box;
  justify-content: flex-start;
  text-align: left;
}

body.eval-mode .slide.eval-slide p,
body.eval-mode .slide.eval-slide li {
  font-family: 'Source Serif 4', Georgia, serif;
  font-size: 11pt;
}
body.eval-mode .slide.eval-slide strong { font-weight: 700; }
body.eval-mode .slide.eval-slide em { font-style: italic; }

/* ── HOJA (carta vertical 216×279mm) ──
   Cada .eval-hoja es una página completa. En screen se ve como papel con sombra
   y margen externo; en print se imprime edge-to-edge (el @page define márgenes). */
body.eval-mode .eval-hoja {
  width: 216mm;
  min-height: 279mm;
  padding: 16mm 18mm 14mm 18mm;
  background: #fff !important;
  color: #000 !important;
  box-shadow: 0 1px 0 rgba(0,0,0,0.06), 0 6px 22px rgba(0,0,0,0.10);
  border: 1px solid #d6d3cc;
  box-sizing: border-box;
}
body.eval-mode .eval-pagina-nueva {
  break-before: page;
  page-break-before: always;
}

/* ── CABECERA (bloque inline al tope de la primera hoja) ── */
.eh-bloque { margin-bottom: 7mm; }
.eh-top { display: flex; justify-content: space-between; align-items: baseline; padding-bottom: 2mm; border-bottom: 2px solid #000; font-family: 'Inter', sans-serif; font-size: 8.5pt; text-transform: uppercase; letter-spacing: 0.08em; }
.eh-sede { margin: 0; }
.eh-curso { margin: 0; font-weight: 600; }
.eh-titulo { font-family: 'Source Serif 4', Georgia, serif; font-size: 18pt; font-weight: 700; margin: 4mm 0 2mm; letter-spacing: -0.005em; line-height: 1.2; }
.eh-datos { font-family: 'Inter', sans-serif; font-size: 9.5pt; letter-spacing: 0.02em; margin: 0 0 5mm; padding: 1.5mm 0; border-top: 0.5px solid #000; border-bottom: 0.5px solid #000; }
.eh-identificacion { display: flex; gap: 5mm; margin-bottom: 4mm; }
.eh-campo { display: flex; align-items: flex-end; gap: 2.5mm; font-family: 'Inter', sans-serif; font-size: 9.5pt; flex: 0 1 auto; }
.eh-campo-nombre { flex: 2 1 auto; }
.eh-campo > span:first-child { white-space: nowrap; }
.eh-line { flex: 1; min-width: 24mm; border-bottom: 0.8px solid #000; height: 5mm; }
.eh-instrucciones { font-size: 10pt; line-height: 1.45; border-left: 3px solid #000; padding: 2mm 4mm; background: #fafaf7; }
.eh-instrucciones p { margin: 0; }

/* Legacy: eval-encabezado y eval-instrucciones ya no se usan */
.eval-encabezado, .eval-instrucciones { display: none; }

/* ── Sección (SM o desarrollo) ── */
.es-head { border-bottom: 1px solid #000; padding-bottom: 2mm; margin-bottom: 4mm; }
.es-titulo { font-family: 'Source Serif 4', Georgia, serif; font-size: 13pt; font-weight: 700; margin: 0 0 1.5mm; }
.es-instrucciones { font-family: 'Inter', sans-serif; font-size: 9.5pt; color: #333; font-style: italic; }
.es-instrucciones p { margin: 0; }
.es-preguntas p { margin: 0 0 2mm; font-size: 10.5pt; line-height: 1.45; }
.es-preguntas p + ul { margin-top: 0; margin-bottom: 4mm; }
.es-preguntas ul { list-style: none; padding-left: 5mm; margin: 0 0 5mm; }
.es-preguntas li { padding: 0; font-size: 10pt; line-height: 1.4; margin-bottom: 0.5mm; }
.es-preguntas li::before { content: none; }  /* sin caja: el estudiante marca con círculo a mano */
.es-preguntas li::marker { content: ''; }
.es-preguntas strong { font-weight: 700; }
.es-preguntas hr { border: none; border-top: 1px dashed #999; margin: 5mm 0; }

/* ── Ejercicio aplicado (con diagrama al lado derecho) ── */
.eej-head { border-bottom: 1px solid #000; padding-bottom: 2mm; margin-bottom: 4mm; }
.eej-titulo { font-family: 'Source Serif 4', Georgia, serif; font-size: 13pt; font-weight: 700; margin: 0; }
.eej-body { display: grid; grid-template-columns: 1fr 72mm; gap: 6mm; align-items: start; margin-bottom: 6mm; }
.eej-contexto { font-size: 10.5pt; line-height: 1.5; }
.eej-contexto p { margin: 0 0 2mm; }
.eej-contexto ol { padding-left: 5mm; margin: 2mm 0; }
.eej-contexto ol li { font-size: 10.5pt; margin-bottom: 1mm; }
.eej-contexto strong { font-weight: 700; }
.eej-diagrama { display: flex; justify-content: center; align-items: flex-start; padding: 2mm; border: 0.5px solid #000; background: #fff; }
.eej-diagrama svg { width: 100%; height: auto; max-width: 68mm; }
.eej-subpartes { font-size: 10.5pt; line-height: 1.5; margin-top: 2mm; }
.eej-subpartes p { margin: 0 0 4mm; }
.eej-subpartes p:has(strong:first-child) { margin-top: 14mm; }
.eej-subpartes p:first-child:has(strong:first-child) { margin-top: 0; }
.eej-subpartes hr { border: none; border-top: 1px dashed #ccc; margin: 0; }

/* ── Cierre ── */
.eval-cierre { text-align: center; padding: 0 !important; min-height: 0 !important; background: transparent !important; border: none !important; box-shadow: none !important; }
.ec-linea { width: 30%; margin: 0 auto 2mm; border-top: 0.5px solid #000; }
.ec-texto { font-family: 'Source Serif 4', Georgia, serif; font-style: italic; font-size: 9.5pt; margin: 0; color: #444; }

/* Diagrama B&N */
.diag-bw { font-family: 'Source Serif 4', Georgia, serif; width: 100%; height: auto; }

/* Impresión: hojas ocupan página completa, sin sombras ni bordes, edge-to-edge */
@media print {
  body.eval-mode, body.eval-mode .deck {
    background: #fff !important;
    color: #000 !important;
    padding: 0 !important;
    gap: 0 !important;
  }
  body.eval-mode .toolbar { display: none !important; }
  body.eval-mode .eval-hoja {
    width: 100% !important;
    min-height: 0 !important;
    padding: 0 !important;
    margin: 0 !important;
    box-shadow: none !important;
    border: none !important;
  }
  body.eval-mode .eej-diagrama { border: 0.5px solid #000 !important; }
}

/* @page: carta vertical con márgenes 14mm verticales / 18mm horizontales.
   Va al final del bundle styles+evalStyles para ganarle al @page del modo clase. */
@page { size: letter portrait; margin: 14mm 18mm; }
`

