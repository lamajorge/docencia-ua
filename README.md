# Economía · UA — DERE-A0004

Web de materiales de clase para **Introducción a la Economía**, Universidad Autónoma de Chile, Carrera de Derecho.

---

## Stack

- **Next.js 14** (App Router, ISR + SSG)
- **Notion API** como fuente de verdad para guías de clase
- **Manuales indexados localmente** (Samuelson 18a ed. + Case & Fair 10a ed.)
- **Vercel** para deploy automático
- CSS puro con variables UA · Playfair Display + Source Serif 4

---

## Rutas

| Ruta | Descripción |
|------|-------------|
| `/clases` | Grid de todas las clases (desde Notion) |
| `/clases/[n]` | Vista web de una clase |
| `/clases/[n]/print` | Vista presentación A4 — imprimible a PDF |
| `/manuales` | Índice de ambos libros |
| `/manuales/samuelson` | 34 capítulos de Samuelson & Nordhaus |
| `/manuales/casefair` | 21 capítulos de Case & Fair |
| `/manuales/[libro]/[n]` | Capítulo completo |
| `/buscar` | Búsqueda full-text en ambos manuales |

---

## Setup local

### 1. Clonar e instalar

```bash
git clone <tu-repo>
cd economia-derecho-ua
npm install
```

### 2. Variables de entorno

```bash
cp .env.local.example .env.local
# Editar con NOTION_TOKEN y NOTION_DATABASE_ID
```

**Obtener el token:** [notion.so/my-integrations](https://www.notion.so/my-integrations) → Nueva integración → copiar token.  
**Importante:** Compartir la base de datos "Programación de Clases" con la integración desde Notion. `NOTION_DATABASE_ID` es el hash de la database (no de la página padre).

### 3. Correr en desarrollo

```bash
npm run dev
# → http://localhost:3000
```

---

## Imprimir clases a PDF

1. Abrir `/clases/[n]/print`
2. Clic en **"Imprimir / Guardar PDF"**
3. Configurar: Destino → Guardar como PDF · Orientación Horizontal · Márgenes Ninguno

---

## Deploy en Vercel

1. Crear repo en GitHub y hacer push
2. [vercel.com](https://vercel.com) → Import → seleccionar repo
3. Agregar variables: `NOTION_TOKEN`, `NOTION_DATABASE_ID`
4. Deploy automático en cada `git push main`

---

## Regenerar capítulos de manuales

Si actualizas los PDFs, colocarlos en `pdfs/` y ejecutar:

```bash
python3 scripts/extract_chapters.py \
  --samuelson pdfs/samuelson.pdf \
  --casefair  pdfs/casefair.pdf
```

Esto regenera todos los `.md` en `content/manuales/` y actualiza `index.json`.

---

## Claude Code

Este proyecto incluye configuración completa para Claude Code en `.claude/`:

```
.claude/
  CLAUDE.md              # Contexto completo del proyecto
  settings.json          # Permisos de herramientas
  commands/
    nueva-guia.md        # /nueva-guia — genera guía desde cero
    buscar-manual.md     # /buscar-manual — busca en bibliografía
    email-semanal.md     # /email-semanal — redacta correo semanal
    nuevo-slide.md       # /nuevo-slide — agrega slide especial
```

Abrir el proyecto en Claude Code y los comandos estarán disponibles como `/nueva-guia`, etc.

---

## Estructura del proyecto

```
app/                     Next.js App Router
  clases/                Páginas de clases (Notion)
  manuales/              Páginas de bibliografía (local)
  buscar/                Búsqueda full-text
  api/buscar/            API route de búsqueda
lib/
  notion.ts              Cliente Notion + helpers
  manuales.ts            Lector MD + buscador local
content/manuales/
  samuelson/             34 capítulos como .md
  casefair/              21 capítulos como .md
  index.json             Índice de ambos libros
components/
  PrintButton.tsx        Botón window.print()
scripts/
  extract_chapters.py    Re-extrae capítulos desde PDFs
styles/
  globals.css            Variables UA + slides + print
.claude/
  CLAUDE.md              Contexto para Claude Code
  commands/              Slash commands personalizados
  settings.json          Permisos
```
