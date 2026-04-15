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
    padding: 14mm 18mm;
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

  .intro-titulo { font-size: 13mm; }
  .intro-body { font-size: 4.5mm; }

  .mani-titulo { font-size: 12mm; margin-bottom: 10mm; }
  .mani-num { font-size: 13mm; }
  .mani-list p { font-size: 6mm; }

  .st-num { font-size: 40mm; }
  .st-titulo { font-size: 10mm; }
  .st-dominar-body li { font-size: 4.1mm; padding: 2mm 0; }
  .st-pregunta-texto { font-size: 5mm; }
  .st-respuesta { font-size: 3.9mm; }
  .st-trampa-body, .st-regla-body { font-size: 3.8mm; }

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
}

@page { size: A4 landscape; margin: 0; }
`
