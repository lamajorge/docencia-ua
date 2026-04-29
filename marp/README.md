# Presentaciones DERE-A0004 · Marp + theme UA

Sistema de producción de presentaciones para **Introducción a la Economía**. Reemplaza el sistema React legacy en `content/presentaciones/` + `app/clases/[id]/page.tsx` (que tenía bugs persistentes de print y mantenimiento alto).

## Por qué Marp

- **Markdown puro** → HTML / **PDF** / **PPTX** nativo. Sin bugs de CSS print.
- **Theme custom CSS** con identidad UA (rojo, Fraunces, Inter, layouts editoriales).
- **VS Code preview en vivo** con la extensión oficial de Marp.
- **Export real a PowerPoint** para enviar a alumnos.
- El motor está mantenido por miles de usuarios — no lo mantenemos nosotros.

## Estructura

```
marp/
├── theme-ua.css        # theme único (paleta UA, layouts, tipografía)
├── clase-template.md   # plantilla con todos los layouts disponibles
├── clase-NN.md         # cada clase (a producir según se dicta)
├── out/                # PDFs generados (gitignored)
└── package.json        # scripts npm
```

## Uso rápido

### Generar PDF de una clase

```bash
cd marp
npm run build clase-17.md
# → out/clase-17.pdf
```

O usando npx directamente sin instalar:

```bash
cd marp
npx -y @marp-team/marp-cli@latest clase-17.md --theme theme-ua.css --pdf --allow-local-files --output out/clase-17.pdf
```

### Generar todas las clases

```bash
cd marp
npm run build-all
```

### Generar PowerPoint editable

```bash
cd marp
npm run pptx clase-17.md
# → clase-17.pptx
```

### Preview con auto-recarga (modo desarrollo)

```bash
cd marp
npm run watch clase-17.md
```

### VS Code (recomendado)

Instalar la extensión **"Marp for VS Code"** y abrir cualquier `.md`. El preview lateral se actualiza al guardar.

Para que use el theme UA en la preview, agregar a settings.json del workspace:

```json
{
  "markdown.marp.themes": ["./marp/theme-ua.css"]
}
```

## Estructura de cada `.md`

Cada presentación empieza con frontmatter:

```yaml
---
marp: true
theme: ua
paginate: false
size: 16:9
title: Título de la clase
---
```

Después, cada lámina se separa con `---` (tres guiones). Una clase típica tiene 10–15 láminas.

## Layouts disponibles (clases CSS)

Se aplican con un comentario `<!-- _class: NOMBRE -->` al inicio de la lámina.

| Layout | Uso | Cómo se invoca |
|---|---|---|
| **default** | Lámina estándar texto + título | sin clase (es el default) |
| **hero** | Portada de la clase, fondo negro, franja roja | `<!-- _class: hero -->` |
| **close** | Cierre / próxima clase, igual al hero | `<!-- _class: close -->` |
| **roadmap** | Estructura de la clase, 5 columnas con número | `<!-- _class: roadmap -->` + `<div class="grid">…</div>` |
| **manifesto** | Lista numerada grande, fondo blanco | `<!-- _class: manifesto -->` + `<ol>` |
| **grid-2** | Grilla 1×2 (dos celdas lado a lado) | `<!-- _class: grid-2 -->` + `<div class="grid">…</div>` |
| **grid-4** | Grilla 2×2 (cuatro celdas), claras y oscuras alternadas | `<!-- _class: grid-4 -->` + `<div class="grid">…</div>` |
| **stat** | Número grande lado izq + texto lado der | `<!-- _class: stat -->` + dos divs |
| **quote** | Cita destacada en fondo negro | `<!-- _class: quote -->` |

Ver [`clase-template.md`](./clase-template.md) para ejemplos completos de cada layout.

## Convenciones de contenido

1. **Encabezado de cada lámina:** `#### BLOQUE N · ETIQUETA` (kicker) seguido de `# Título grande.`
2. **Negritas (`**texto**`)** se renderizan en rojo UA — usalas para palabras clave, no como decoración.
3. **Cursivas (`*texto*`)** quedan grises — para citas, anotaciones.
4. **Tablas** tienen header negro automático.
5. **Blockquote (`>`)** queda como caja blanca con borde rojo a la izquierda — perfecta para "Por qué importa", notas laterales.
6. **Símbolo `$`:** dentro de HTML directo (`<p>`, `<div>`) escribir `$` sin escape. En markdown puro también `$` directo (Marp no tiene math habilitado por default).

## Generar PDF de la clase a dictar

Workflow típico:

1. Editar `clase-NN.md` (con preview en VS Code).
2. `npm run build clase-NN.md`.
3. Abrir `out/clase-NN.pdf` en pantalla completa para proyectar.
4. Si quiero exportar a PowerPoint: `npm run pptx clase-NN.md`.

## Sistema legacy (referencia)

El sistema anterior basado en `content/presentaciones/clase-N.md` con sintaxis `:::` y renderer React en `app/clases/[id]/page.tsx` queda como **legacy**. No se borra todavía pero ya no se mantiene activamente. Las presentaciones nuevas se hacen en este directorio (`marp/`).

Migración del contenido legacy: opcional, según se vaya necesitando. Cuando una clase legacy se actualice por contenido (no solo estética), conviene reescribirla en formato Marp y descartar la versión `:::`.
