// Genera docs/evaluaciones/regular-1.docx con la Evaluación Regular 1 (Unidades I y II).
// Uso: `node scripts/generate-eval-regular-1.mjs`
//
// Entrega: archivo Word carta vertical, texto estándar Times, diagrama SVG embebido como PNG.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, ImageRun, PageOrientation, Table, TableRow, TableCell, WidthType, BorderStyle } from 'docx'
import { Resvg } from '@resvg/resvg-js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, '..', 'docs', 'evaluaciones', 'regular-1.docx')

// ── Diagrama: equilibrio de mercado genérico (D, O, P*, Q*) ──
const SVG_EQUILIBRIO = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 360" width="400" height="360">
  <rect width="400" height="360" fill="#ffffff"/>
  <!-- Ejes -->
  <line x1="60" y1="30" x2="60" y2="310" stroke="#000" stroke-width="2"/>
  <line x1="60" y1="310" x2="380" y2="310" stroke="#000" stroke-width="2"/>
  <polygon points="60,24 54,36 66,36" fill="#000"/>
  <polygon points="386,310 374,304 374,316" fill="#000"/>
  <text x="70" y="36" font-family="Times,serif" font-size="16" fill="#000" font-style="italic">Precio (P)</text>
  <text x="280" y="335" font-family="Times,serif" font-size="16" fill="#000" font-style="italic">Cantidad (Q)</text>
  <!-- Demanda -->
  <line x1="90" y1="70" x2="360" y2="280" stroke="#000" stroke-width="3"/>
  <text x="355" y="262" font-family="Times,serif" font-size="22" font-weight="700" fill="#000">D</text>
  <!-- Oferta -->
  <line x1="90" y1="280" x2="360" y2="70" stroke="#000" stroke-width="3"/>
  <text x="355" y="85" font-family="Times,serif" font-size="22" font-weight="700" fill="#000">O</text>
  <!-- Punto de equilibrio -->
  <circle cx="225" cy="175" r="5" fill="#000"/>
  <line x1="60" y1="175" x2="225" y2="175" stroke="#000" stroke-width="1" stroke-dasharray="4,3"/>
  <line x1="225" y1="175" x2="225" y2="310" stroke="#000" stroke-width="1" stroke-dasharray="4,3"/>
  <text x="30" y="180" font-family="Times,serif" font-size="18" font-weight="700" fill="#000">P*</text>
  <text x="218" y="332" font-family="Times,serif" font-size="18" font-weight="700" fill="#000">Q*</text>
  <text x="235" y="170" font-family="Times,serif" font-size="16" font-style="italic" fill="#000">E</text>
</svg>
`.trim()

function svgToPngBuffer(svg, width = 600) {
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: width },
    background: 'rgba(255,255,255,1)',
  })
  return resvg.render().asPng()
}

// ── Helpers tipográficos ──
const FONT_SERIF = 'Times New Roman'
const FONT_SANS = 'Arial'

const p = (text, opts = {}) => new Paragraph({
  spacing: { after: opts.after ?? 120, before: opts.before ?? 0, line: opts.line ?? 260 },
  alignment: opts.alignment ?? AlignmentType.LEFT,
  indent: opts.indent,
  children: Array.isArray(text)
    ? text
    : [new TextRun({ text, font: opts.font ?? FONT_SERIF, size: opts.size ?? 22, bold: opts.bold, italics: opts.italics, color: opts.color })],
})

const pRuns = (runs, opts = {}) => new Paragraph({
  spacing: { after: opts.after ?? 120, before: opts.before ?? 0, line: opts.line ?? 260 },
  alignment: opts.alignment ?? AlignmentType.LEFT,
  indent: opts.indent,
  children: runs,
})

const r = (text, opts = {}) => new TextRun({
  text,
  font: opts.font ?? FONT_SERIF,
  size: opts.size ?? 22,
  bold: opts.bold,
  italics: opts.italics,
  color: opts.color,
  break: opts.break,
})

const alt = (letra, texto) => new Paragraph({
  spacing: { after: 80, line: 260 },
  indent: { left: 720 },
  children: [r(`${letra}) `, { bold: true }), r(texto)],
})

const sep = () => new Paragraph({ spacing: { after: 120, before: 120 }, children: [] })

const lineaManuscrita = (n = 6) => {
  const out = []
  for (let i = 0; i < n; i++) {
    out.push(new Paragraph({
      spacing: { after: 320, line: 480 },
      border: { bottom: { color: '999999', size: 4, style: BorderStyle.SINGLE, space: 1 } },
      children: [r('\u00A0')],
    }))
  }
  return out
}

// ── Construcción del documento ──
async function main() {
  const pngBuffer = svgToPngBuffer(SVG_EQUILIBRIO, 520)

  // Tabla de cabecera: Nombre / Sección / Fecha en la misma fila
  const tablaIdentificacion = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 55, type: WidthType.PERCENTAGE },
            borders: { bottom: { style: BorderStyle.SINGLE, size: 8, color: '000000' } },
            children: [p([r('Nombre: ', { bold: true, size: 20, font: FONT_SANS })], { after: 80 })],
          }),
          new TableCell({
            width: { size: 20, type: WidthType.PERCENTAGE },
            borders: { bottom: { style: BorderStyle.SINGLE, size: 8, color: '000000' } },
            children: [p([r('Sección: ', { bold: true, size: 20, font: FONT_SANS })], { after: 80 })],
          }),
          new TableCell({
            width: { size: 25, type: WidthType.PERCENTAGE },
            borders: { bottom: { style: BorderStyle.SINGLE, size: 8, color: '000000' } },
            children: [p([r('Fecha: ', { bold: true, size: 20, font: FONT_SANS })], { after: 80 })],
          }),
        ],
      }),
    ],
  })

  const doc = new Document({
    creator: 'Jorge Lama',
    title: 'Evaluación Regular 1 — DERE-A0004',
    styles: {
      default: {
        document: { run: { font: FONT_SERIF, size: 22 } },
      },
    },
    sections: [{
      properties: {
        page: {
          size: { orientation: PageOrientation.PORTRAIT, width: 12240, height: 15840 }, // Letter 8.5×11"
          margin: { top: 794, right: 1134, bottom: 794, left: 1134 }, // ~14mm top/bot, 20mm L/R
        },
      },
      children: [
        // ── ENCABEZADO ──
        pRuns([
          r('Universidad Autónoma de Chile', { font: FONT_SANS, size: 18 }),
          r('     '),
          r('Facultad de Ciencias Jurídicas y Sociales', { font: FONT_SANS, size: 18, italics: true }),
        ], { alignment: AlignmentType.CENTER, after: 60 }),
        pRuns([
          r('DERE-A0004 · Introducción a la Economía', { font: FONT_SANS, size: 18, bold: true }),
        ], { alignment: AlignmentType.CENTER, after: 240 }),

        // ── TÍTULO ──
        p('Evaluación Regular 1 — Unidades I y II', {
          alignment: AlignmentType.CENTER, bold: true, size: 32, after: 100,
        }),
        p('Semana 7 · Miércoles 22 de abril · Duración 90 minutos · Puntaje total 20 puntos · Cobertura Clases 1 a 13', {
          alignment: AlignmentType.CENTER, italics: true, size: 20, after: 280,
        }),

        // ── IDENTIFICACIÓN (tabla) ──
        tablaIdentificacion,
        p('', { after: 200 }),

        // ── INSTRUCCIONES ──
        pRuns([
          r('Instrucciones. ', { bold: true }),
          r('En la Sección I, '),
          r('encierra en un círculo', { bold: true }),
          r(' la letra de la alternativa correcta. En la Sección II se evalúa precisión conceptual y claridad, no extensión. '),
          r('No se descuenta', { bold: true }),
          r(' por error en la selección múltiple. El uso de copia, fraude o materiales no autorizados implica nota 1,0 (Art. 28 Reglamento de Pregrado).'),
        ], { after: 280 }),

        // ── SECCIÓN I ──
        p('Sección I — Selección múltiple (10 puntos)', {
          bold: true, size: 26, after: 80,
          border: { bottom: { color: '000000', size: 8, style: BorderStyle.SINGLE, space: 4 } },
        }),
        p('10 preguntas · 1 punto cada una.', { italics: true, size: 20, after: 240 }),

        // Pregunta 1 — correcta D ("recursos limitados")
        pRuns([r('1.', { bold: true }), r('  ¿Cuál de las siguientes afirmaciones describe correctamente el concepto de escasez en economía?')], { after: 80 }),
        alt('a', 'La escasez es un problema exclusivo de los países pobres.'),
        alt('b', 'La escasez ocurre solo cuando hay desabastecimiento en los supermercados.'),
        alt('c', 'La escasez desaparece cuando una economía crece lo suficiente.'),
        alt('d', 'La escasez significa que los recursos son limitados en relación a los deseos, que son ilimitados.'),
        p('', { after: 120 }),

        // Pregunta 2 — correcta c
        pRuns([r('2.', { bold: true }), r('  Una economía que opera '), r('bajo', { bold: true }), r(' su Frontera de Posibilidades de Producción (FPP):')], { after: 80 }),
        alt('a', 'Está usando todos sus recursos eficientemente.'),
        alt('b', 'Ha alcanzado su máximo nivel de producción posible.'),
        alt('c', 'Tiene recursos desaprovechados: hay ineficiencia.'),
        alt('d', 'Está produciendo más de lo que sus recursos permiten.'),
        p('', { after: 120 }),

        // Pregunta 3 — correcta d
        pRuns([r('3.', { bold: true }), r('  Respecto de la distinción entre economía positiva y economía normativa, ¿cuál afirmación es correcta?')], { after: 80 }),
        alt('a', 'La economía positiva describe lo que es; la normativa prescribe lo que debería ser.'),
        alt('b', '“El IVA recauda aproximadamente un tercio de los ingresos fiscales” es economía positiva.'),
        alt('c', '“El salario mínimo debería aumentarse” es economía normativa.'),
        alt('d', 'Todas las anteriores.'),
        p('', { after: 120 }),

        // Pregunta 4 — correcta c
        pRuns([r('4.', { bold: true }), r('  Según la '), r('ley de la demanda', { bold: true }), r(', si sube el precio de un bien, manteniendo todo lo demás constante:')], { after: 80 }),
        alt('a', 'La cantidad demandada sube porque los consumidores anticipan más alzas.'),
        alt('b', 'La cantidad demandada no cambia porque las necesidades son fijas.'),
        alt('c', 'La cantidad demandada cae.'),
        alt('d', 'La demanda se desplaza hacia la izquierda.'),
        p('', { after: 120 }),

        // Pregunta 5 — correcta d (a y b)
        pRuns([r('5.', { bold: true }), r('  ¿Cuál de los siguientes eventos desplaza la curva de oferta de manzanas hacia la '), r('derecha', { bold: true }), r('?')], { after: 80 }),
        alt('a', 'Una nueva tecnología agrícola que reduce los costos de producción.'),
        alt('b', 'La entrada de nuevas empresas productoras al mercado.'),
        alt('c', 'Un aumento en el precio de las manzanas.'),
        alt('d', 'Las alternativas a) y b).'),
        p('', { after: 120 }),

        // Pregunta 6 — correcta b
        pRuns([r('6.', { bold: true }), r('  En un mercado competitivo, cuando el precio está por '), r('debajo', { bold: true }), r(' del precio de equilibrio:')], { after: 80 }),
        alt('a', 'Hay excedente: la cantidad ofrecida supera a la demandada.'),
        alt('b', 'Hay escasez: la cantidad demandada supera a la ofrecida y el precio tiende a subir.'),
        alt('c', 'El mercado permanece estable porque los consumidores están satisfechos.'),
        alt('d', 'La curva de demanda se desplaza hacia la izquierda.'),
        p('', { after: 120 }),

        // Pregunta 7 — Impuesto (antes P8) — correcta c
        pRuns([r('7.', { bold: true }), r('  Cuando el gobierno aplica un impuesto sobre las ventas de un bien, ¿quién soporta la carga tributaria?')], { after: 80 }),
        alt('a', 'Siempre el vendedor, porque es quien paga el impuesto formalmente.'),
        alt('b', 'Siempre el comprador, porque es quien consume el bien.'),
        alt('c', 'La carga se distribuye entre ambos según sus elasticidades, sin importar a quién se cobre formalmente.'),
        alt('d', 'El gobierno, porque es quien recauda el impuesto.'),
        p('', { after: 120 }),

        // Pregunta 8 — Peso muerto (antes P9) — correcta c
        pRuns([r('8.', { bold: true }), r('  El '), r('peso muerto', { bold: true }), r(' de un impuesto es:')], { after: 80 }),
        alt('a', 'El ingreso total que recauda el gobierno.'),
        alt('b', 'La reducción del excedente del consumidor que pasa al gobierno como recaudación.'),
        alt('c', 'La pérdida de bienestar que no captura ningún agente: ni compradores, ni vendedores, ni el gobierno.'),
        alt('d', 'El costo administrativo de recaudar el impuesto.'),
        p('', { after: 120 }),

        // Pregunta 9 — Externalidad negativa (antes P10) — correcta b
        pRuns([r('9.', { bold: true }), r('  ¿Cuál de las siguientes situaciones es un ejemplo de '), r('externalidad negativa', { bold: true }), r('?')], { after: 80 }),
        alt('a', 'Una vacuna que protege a quienes rodean al vacunado.'),
        alt('b', 'Una fábrica que contamina el río con sus desechos industriales, perjudicando a los vecinos.'),
        alt('c', 'Un subsidio estatal al transporte público.'),
        alt('d', 'Todas las anteriores son externalidades.'),
        p('', { after: 120 }),

        // Pregunta 10 — Precio máximo (antes P7) — correcta c
        pRuns([r('10.', { bold: true }), r('  Un precio máximo genera escasez cuando se fija:')], { after: 80 }),
        alt('a', 'Por encima del precio de equilibrio.'),
        alt('b', 'Exactamente en el precio de equilibrio.'),
        alt('c', 'Por debajo del precio de equilibrio.'),
        alt('d', 'Ninguna de las anteriores: un precio máximo nunca genera escasez.'),

        // ── SECCIÓN II — Pregunta 1 (nueva página) ──
        p('Sección II — Desarrollo (10 puntos)', {
          bold: true, size: 26, before: 400, after: 80,
          border: { bottom: { color: '000000', size: 8, style: BorderStyle.SINGLE, space: 4 } },
          alignment: AlignmentType.LEFT,
        }),
        p('Responde en el espacio provisto. Se evalúa precisión conceptual y claridad, no extensión.', { italics: true, size: 20, after: 240 }),
        pRuns([r('Pregunta 1 — Conceptual (5 pts). ', { bold: true }), r('Explica qué es el '), r('costo de oportunidad', { bold: true }), r(' y por qué es relevante para la toma de decisiones económicas. Usa un '), r('ejemplo concreto', { bold: true }), r(' para ilustrar tu respuesta.')], { after: 240 }),
        ...lineaManuscrita(8),

        // ── SECCIÓN II — Pregunta 2 (ejercicio, nueva página) ──
        p('Pregunta 2 — Ejercicio aplicado: cambios en el equilibrio (5 pts)', {
          bold: true, size: 24, before: 400, after: 120,
          border: { bottom: { color: '000000', size: 6, style: BorderStyle.SINGLE, space: 4 } },
        }),
        pRuns([r('El mercado del '), r('pan', { bold: true }), r(' en Chile está inicialmente en equilibrio, con precio '), r('P*', { italics: true }), r(' y cantidad '), r('Q*', { italics: true }), r('. El diagrama muestra ese equilibrio inicial. Para cada situación, indica:')], { after: 80 }),
        pRuns([r('    (i) '), r('qué determinante', { bold: true }), r(' está cambiando;')], { after: 40 }),
        pRuns([r('    (ii) '), r('cómo se desplaza', { bold: true }), r(' la curva (demanda u oferta, izquierda o derecha);')], { after: 40 }),
        pRuns([r('    (iii) '), r('qué ocurre con ', { bold: false }), r('P*', { bold: true, italics: true }), r(' y con '), r('Q*', { bold: true, italics: true }), r(' (sube, baja, o se mantiene).')], { after: 200 }),

        // Diagrama centrado
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 240 },
          children: [
            new ImageRun({
              data: pngBuffer,
              type: 'png',
              transformation: { width: 320, height: 288 },
            }),
          ],
        }),

        // Sub-preguntas (solo a y b, 2,5 pts c/u)
        pRuns([r('(a) (2,5 pts). ', { bold: true }), r('Sube fuertemente el precio del '), r('trigo', { bold: true }), r(', insumo clave para producir pan.')], { after: 160 }),
        ...lineaManuscrita(4),

        pRuns([r('(b) (2,5 pts). ', { bold: true }), r('El '), r('Ministerio de Salud Pública', { bold: true }), r(' publica un estudio sobre los riesgos del consumo excesivo de harinas blancas y los consumidores '), r('reducen su preferencia', { bold: true }), r(' por el pan tradicional.')], { after: 160 }),
        ...lineaManuscrita(4),

        // ── CIERRE ──
        p('— Fin de la evaluación —', {
          alignment: AlignmentType.CENTER, italics: true, size: 20, before: 200, color: '666666',
        }),
      ],
    }],
  })

  const buffer = await Packer.toBuffer(doc)
  fs.writeFileSync(OUT, buffer)
  console.log(`✓ Generado: ${OUT}`)
  console.log(`  ${(buffer.length / 1024).toFixed(1)} KB`)
}

main().catch((err) => { console.error(err); process.exit(1) })
