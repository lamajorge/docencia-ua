# Producción de presentaciones web (landing-por-clase)

**Cuándo leer este archivo:** antes de crear o modificar un archivo en [`content/presentaciones/`](../../content/presentaciones/). Guías (Notion) y presentaciones (repo) son **tareas separadas**: la guía primero, la presentación solo cuando Jorge la pida.

---

## Filosofía

Cada clase es una **landing page editorial**, no un deck genérico. Layouts distintos por rol semántico de la sección: números protagonistas en 85mm para datos clave, manifesto tipográfico para preguntas diagnósticas, grilla 2×2 para taxonomías, split con contraste claro/oscuro para dualidades. El markdown declara **qué tipo** de sección es; el renderer React le da el layout rico.

**Referencia completa del formato:** [`content/presentaciones/TEMPLATE.md`](../../content/presentaciones/TEMPLATE.md). Leer antes de producir una clase nueva.

---

## Flujo de producción

1. Leer la guía de la clase en Notion como **única fuente de contenido**.
2. Crear `content/presentaciones/clase-NN.md` con frontmatter + secciones `:::`.
3. Cada sección abre con `::: tipo [props...]` y cierra con `:::`. Dentro, slots `::nombre` declaran sub-bloques. El contenido dentro de cada slot es markdown libre.
4. Tipos de sección disponibles: `hero`, `intro`, `roadmap`, `manifesto`, `station` (part=a/b), `mecanismo`, `stat-hero`, `stat-duo`, `stat-split`, `grid-fallas` (con `::nota` opcional), `exercise-intro`, `exercise-d`, `evaluacion`, `close`, `referencia`, `diagrama` (con `::d{n}-leyenda`), `revision` (para revisión de prueba — ver abajo). Cada uno tiene su componente React con layout único en [`app/clases/[id]/page.tsx`](../../app/clases/[id]/page.tsx).
5. **Consolidar:** ~18 secciones por clase, no 30+. Si una idea no necesita slide propio, colapsarla en una `station` o `stat`. Regla: **1 sección = 1 concepto**; ejemplos del mismo concepto van juntos.
6. El contenido sale **exclusivamente** de la guía — no se inventan ejemplos.
7. Validar en pantalla (scroll de landing) **y** en vista impresa (`window.print()` del navegador). Cada sección debe caber en una A4 apaisada (297×210mm) cuando se imprime.

---

## Tipo `revision` — revisión de prueba

Misma estructura visual que `station` pero con labels configurables. Usar para clases de revisión de evaluación (tipo Clase 15).

```markdown
::: revision num=01 clases="Clases 1–3"
::titulo
Tema — Preguntas N a M

::respuestas
- **P1 → D.** *"Enunciado abreviado."* Explicación de la respuesta correcta.
- **P2 → C.** ...

::concepto
**Pregunta conceptual central.**

Explicación completa con cadena causal.

::trampa
**"Distractor común."** Por qué está mal.

::regla
Regla de oro aplicable.
:::
```

Props opcionales: `labelLeft="PREGUNTA Y RÚBRICA"` y `labelRight="RESPUESTA MODELO"` para secciones de desarrollo (override del default "RESPUESTAS CORRECTAS" / "CONCEPTO CLAVE").

**No usar `station` para revisiones** — tiene "QUÉ DEBEN DOMINAR" hardcodeado, que no aplica.

---

## Alcance público del sitio

- Rutas públicas: solo `/clases` (grid) y `/clases/[n]` (landing).
- **No hay `/print` separado** — el mismo URL imprime vía `@media print` cuando se presiona "Imprimir / Guardar PDF" en la toolbar.
- La bibliografía (`content/manuales/`) es **fuente de datos interna** por copyright, no contenido público.
- El cuerpo de las guías (Notion) tampoco se expone en la landing — solo metadata + botón a la presentación.

---

## Cómo agregar un tipo de sección nuevo

Cuando una clase pide un layout que no existe (ej. una timeline, una grilla 3×3):

1. Agregar el caso en `SectionRenderer` en [`app/clases/[id]/page.tsx`](../../app/clases/[id]/page.tsx).
2. Escribir la función React para el layout (ver los existentes como modelo).
3. Añadir CSS para screen (landing scroll) y override en `@media print` para que encaje en A4 apaisada.
4. Documentarlo en `TEMPLATE.md` con ejemplo de sintaxis.

---

## Diagramas

- Los diagramas basados en tabla numérica **deben** llevar marcas en los ejes con los valores reales de la tabla.
- Toda abreviación (P, Q, D, O, EC, EP, etc.) debe estar definida en el slot `::d{n}-leyenda` antes de usarse en el texto de la sección.
- Si un diagrama no existe en Samuelson ni Case & Fair, no se construye — se explica verbalmente.

---

## Errores ya cometidos — no repetir

- El modelo "deck de slides" (un molde de título + body + footer por slide) produce láminas genéricas y vacías. Cada sección necesita layout propio según qué comunica.
- Tipografía Playfair como body se ve editorial/libro, no presentación. Para UI y cuerpo: **Inter** (sans-serif). Para display grande y serif editorial: **Fraunces**.
- `react-markdown` sin `remark-gfm` **no renderiza tablas** — salen como texto crudo con `|`. Siempre pasar `remarkPlugins={[remarkGfm]}`.
- El CSS con `display: block` sobre `<strong>` quiebra palabras en líneas sueltas. Si se quiere dar énfasis tipográfico a un fragmento, splitear el contenido en JS (`splitQuestion`) en vez de depender de selectores CSS frágiles.
- El bug de zero-pad en [`lib/presentaciones.ts`](../../lib/presentaciones.ts): los archivos se llaman `clase-N.md` (sin cero), no `clase-NN.md`. Ya corregido.
- Refactor "por longitud de texto" sobre-divide secciones. Consolidar por concepto, no por densidad.
