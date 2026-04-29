# Producción de presentaciones — Marp + theme UA

**Cuándo leer este archivo:** antes de crear o modificar una presentación de clase.

---

## Modelo vigente: Marp

Desde el **29 de abril de 2026**, las presentaciones se producen con **Marp** + un theme CSS custom (`marp/theme-ua.css`). Antes el sistema era markdown con sintaxis `:::` parseado por React en `app/clases/[id]/page.tsx`. Ese sistema queda como **legacy** y se está deprecando: bugs persistentes de print, mantenimiento alto, cada cambio visual requería editar código.

**Fuente única de presentaciones nuevas:** `marp/clase-NN.md`. Una clase = un archivo `.md`.

**Generar PDF:** `cd marp && npm run build clase-NN.md` → `out/clase-NN.pdf`. Sin bugs de CSS print, sin React, sin Vercel.

Ver [`marp/README.md`](../../marp/README.md) para guía completa de uso, layouts y convenciones.

---

## Estructura de cada presentación

```yaml
---
marp: true
theme: ua
paginate: false
size: 16:9
title: Título de la clase
---
```

Después, cada lámina se separa con `---` (tres guiones).

Cada lámina puede aplicar un layout custom con `<!-- _class: NOMBRE -->` al inicio. Layouts disponibles: `hero`, `close`, `roadmap`, `manifesto`, `grid-2`, `grid-4`, `stat`, `quote`. Ver [`marp/clase-template.md`](../../marp/clase-template.md) para ejemplos.

---

## Flujo de producción

1. Leer la guía de la clase en Notion como única fuente de contenido.
2. Crear `marp/clase-NN.md` (copiar de `clase-template.md` para arrancar con todos los layouts disponibles).
3. **~12–15 láminas por clase.** Cada lámina = 1 concepto. Si un concepto pide más, dividir en dos láminas.
4. Editar con preview en vivo: VS Code + extensión "Marp for VS Code".
5. Generar PDF: `npm run build clase-NN.md`.
6. Validar visualmente el PDF (cada lámina cabe en 1280×720 sin cortes).
7. Commit del `.md` (NO del PDF generado — `out/` está en `.gitignore`).

---

## Convenciones de contenido

- **Cada lámina arranca con kicker:** `#### BLOQUE N · ETIQUETA` (mayúsculas, en rojo UA por CSS).
- **Título grande:** `# Título de la lámina.` (Fraunces, fondo claro o blanco según layout).
- **Negritas (`**texto**`):** se renderizan en rojo UA. Usar para palabras clave, NO como decoración general.
- **Cursivas (`*texto*`):** grises. Para citas o anotaciones.
- **Blockquote (`> texto`):** caja blanca con borde rojo a la izquierda. Para "Por qué importa", notas laterales.
- **Listas (`-` o `1.`):** estilizadas con marker rojo. Espacio vertical entre items.
- **Tablas:** header negro automático, zebra rows. No requieren CSS adicional.
- **Símbolo `$`:** sin escape. Marp no tiene math habilitado por default.

---

## Identidad visual (theme UA)

Todo en `marp/theme-ua.css`. No editar arquitectura del theme sin coordinarlo — los layouts dependen del CSS.

- **Paleta:** rojo `#C8102E` (principal), `#8A0B1F` (oscuro), `#FBE8EB` (soft); negro `#0D0D0D`; arena `#F5F3EF`; blanco; gris `#6B6B6B`.
- **Tipografía:** Fraunces (display, títulos), Inter (body, UI), JetBrains Mono (datos técnicos).
- **Tamaño:** 1280×720 (16:9). Una lámina = una página A4 apaisada cuando se exporta a PDF.

---

## Errores ya cometidos en el sistema legacy — no repetir

- **Sistema React custom de markdown→render→CSS print:** mantenimiento alto, bugs por slot, cortes de contenido en print. Reemplazado por Marp.
- **`overflow: hidden` + `justify-content: center` + `min-height: 100vh`:** rompía contenido en pantalla. Marp evita esto: cada lámina es un container fijo de 1280×720.
- **Slots con nombres custom (`::eyebrow`, `::descripcion`):** cada componente esperaba slots distintos. En Marp todo es markdown estándar.
- **Kicker hardcodeado "FALLAS DE MERCADO" en `GridFallas`:** bug del renderer legacy. En Marp el kicker se escribe explícito en cada lámina.
- **`\$` literal renderizado por componentes que no procesan markdown:** en Marp, `$` se escribe directo sin escape.

---

## Sistema legacy (`content/presentaciones/` + `app/clases/[id]/page.tsx`)

Queda como referencia hasta que se migren las clases viejas. **NO producir clases nuevas en formato legacy.** Cuando una clase legacy necesite cambios significativos, reescribirla en Marp y eliminar el archivo `:::`.

El sitio web `docencia-ua.vercel.app` con el listado de clases puede mantenerse como índice, pero las presentaciones proyectables son los PDFs de Marp.
