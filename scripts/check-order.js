#!/usr/bin/env node
// Uso: npm run order [clase-NN]
// Sin argumento muestra todas las clases disponibles.
// Con argumento: npm run order clase-14

const fs = require('fs')
const path = require('path')

const DIR = path.join(__dirname, '../content/presentaciones')
const target = process.argv[2]

function parseOrder(file) {
  const content = fs.readFileSync(file, 'utf8')
  const lines = content.split('\n')
  const sections = []
  let n = 0
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (line.startsWith('::: ')) {
      n++
      const type = line.slice(4).split(' ')[0]
      const props = line.slice(4 + type.length).trim()
      sections.push({ n, type, props, line: i + 1 })
    }
  }
  return sections
}

function printOrder(file) {
  const name = path.basename(file, '.md')
  const sections = parseOrder(file)
  console.log(`\n── ${name} (${sections.length} secciones) ──`)
  for (const s of sections) {
    const num = String(s.n).padStart(2, ' ')
    const type = s.type.padEnd(16)
    const props = s.props ? `  ${s.props}` : ''
    console.log(`  ${num}. ${type}${props}  [L${s.line}]`)
  }
}

const files = fs.readdirSync(DIR)
  .filter(f => f.endsWith('.md') && f !== 'TEMPLATE.md')
  .filter(f => !target || f.startsWith(target))
  .map(f => path.join(DIR, f))
  .sort()

if (files.length === 0) {
  console.error(`No se encontró "${target}" en content/presentaciones/`)
  process.exit(1)
}

for (const file of files) printOrder(file)
console.log()
