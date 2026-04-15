# DERE-A0004 · Introducción a la Economía — Contexto para Claude Code

## Identidad del curso

- **Asignatura:** DERE-A0004, Introducción a la Economía
- **Programa:** Derecho, Universidad Autónoma de Chile
- **Audiencia:** estudiantes de primer año, sin formación previa en economía ni matemática formal
- **Horario:** miércoles y jueves, 08:00–09:20 (80 min cada sesión)
- **Duración:** 18 semanas
- **Profesor:** Jorge Lama. MA International Political Economy (University of York) — perspectiva crítica e históricamente situada.

## Bibliografía

- **Primaria:** Samuelson & Nordhaus, *Economía*, 18ª ed.
- **Secundaria:** Case & Fair, *Principios de Microeconomía*, 10ª ed.
- **Complementaria:** Mankiw, Krugman, Varian, Hazlitt.

## Arquitectura del sitio

Dos artefactos separados con audiencias y formatos distintos:

1. **Guías del profesor (en Notion)** — fuente narrativa detallada para Jorge: qué decir, cuándo, preguntas, ejemplos, tiempos. No se editan desde este repo.
2. **Presentaciones web (en este repo)** — **una landing page editorial por clase** proyectable en aula + imprimible como PDF (1 A4 apaisada por sección). Viven en `content/presentaciones/clase-NN.md`.

**Rutas públicas del sitio:** solo `/clases` (grid) y `/clases/[n]` (landing). No hay `/print` separado — el mismo URL imprime vía `@media print` cuando se presiona el botón "Imprimir / Guardar PDF" en la toolbar. La bibliografía (`content/manuales/`) es **fuente de datos interna** por copyright, no contenido público. El cuerpo de las guías (Notion) tampoco se expone en la landing — solo metadata + botón a la presentación.

## Principios pedagógicos (no negociables)

- **Palabras primero.** Fórmula solo si agrega precisión que las palabras no entregan. Diagrama como apoyo visual, nunca sustituto verbal. Criterio: utilidad pedagógica para estudiantes de Derecho sin matemática formal.
- **"Reglas de oro" activadas explícitamente en cada clase nueva:** ley de la demanda, ley de la oferta, mecanismo de ajuste, equilibrio. Nunca asumir que los estudiantes hacen la conexión solos.
- **Diagramas verificados contra manuales antes de construirlos.** Si un diagrama no existe ni en Samuelson ni en Case & Fair, reemplazar por explicación verbal anclada a una figura que sí exista.
- **Conexiones con Derecho orgánicas, nunca forzadas.** Prohibido el framing "como futuros abogados…". Ejemplos naturales sí (salario mínimo → ley de la demanda, tasa de interés → mercado de arriendo).
- **Ejercicios grupales después del bloque teórico correspondiente**, nunca antes (los alumnos necesitan la teoría de incidencia antes de resolver ejercicios de impuestos, por ejemplo).

## Protocolos de producción

### Guías (Notion) — obligatorio
1. Leer el **Protocolo de Producción** en Notion (`3267612d194d8109a73cd5e63f81e343`). Es documento vivo — releer antes de cada guía nueva.
2. Leer la guía de la clase inmediatamente anterior (modelo de formato y tono).
3. **Buscar la página existente** de la clase con `notion-search` o query a la database antes de crear nada. Nunca duplicar entradas.
4. Hacer preguntas pedagógicas estructuradas antes de generar.
5. Buscar en fuentes indexadas (Samuelson 18ed, Case & Fair 10ed, programa SCT, syllabus) tablas/ejemplos/definiciones — no parafrasear de memoria.
6. Generar siguiendo el formato no-negociable (abajo).
7. Subir a la página existente con `replace_content` (reemplazo total) o `update_content` con `old_str`/`new_str` anclado a headings distintivos (ediciones quirúrgicas).

### Formato no-negociable de guías
Exactamente estas 7 secciones en este orden:

1. **Bibliografía** — tabla Texto / Qué usar / Dónde.
2. **Antes de entrar a la sala** — checklist.
3. **Estructura de la clase** — tabla Bloque / Duración / Qué pasa. Duraciones no se repiten en el cuerpo.
4. **Bloques de contenido** — diálogo del profesor en *cursiva* + comillas. Preguntas al curso marcadas. Respuestas esperadas entre paréntesis. Instrucciones estructurales en texto normal — **nunca** mezclar voz del profesor con instrucciones estructurales en el mismo párrafo.
5. **Esquemas de pizarra** — en bloques de código `plain text`. No omitir.
6. **Preguntas difíciles** — con respuestas sugeridas en voz del profesor.
7. **Notas post-clase** — preguntas de reflexión.

### Errores ya cometidos — no repetir
- El repaso es de la clase **inmediatamente anterior**, no de cualquier anterior. (Clase 7 repasó Clase 5 en vez de 6.)
- Verificar título **real** de la clase siguiente en Notion antes de anticiparla en el cierre. (Clase 7 anticipó "Teoría de la Empresa" cuando la 8 era "Oferta de mercado".)
- Buscar la página existente antes de crear. (Clase 7 se creó duplicada.)
- Becker es contexto, no se desarrolla en clase.
- Teoría del consumidor (Clase 5) se detiene en utilidad y preferencias; la curva de demanda se construye en Clase 6.

### Presentaciones web — modelo landing-por-clase (vigente desde abril 2026)

**Filosofía.** Cada clase es una landing page editorial, no un deck genérico. Layouts distintos por rol semántico de la sección: números protagonistas en 85mm para datos clave, manifesto tipográfico para preguntas diagnósticas, grilla 2×2 para taxonomías, split con contraste claro/oscuro para dualidades. El markdown declara **qué tipo** de sección es; el renderer React le da el layout rico.

**Referencia completa del formato:** [`content/presentaciones/TEMPLATE.md`](content/presentaciones/TEMPLATE.md). Leer antes de producir una clase nueva.

**Flujo:**
1. Leer la guía de la clase en Notion como **única fuente de contenido**.
2. Crear `content/presentaciones/clase-NN.md` con frontmatter + secciones `:::`.
3. Cada sección abre con `::: tipo [props...]` y cierra con `:::`. Dentro, slots `::nombre` declaran sub-bloques. El contenido dentro de cada slot es markdown libre.
4. Tipos de sección disponibles (13): `hero`, `intro`, `manifesto`, `station`, `mecanismo`, `stat-hero`, `stat-duo`, `stat-split`, `grid-fallas`, `exercise-intro`, `exercise-d`, `evaluacion`, `close`. Cada uno tiene su componente React con layout único en [`app/clases/[id]/page.tsx`](app/clases/[id]/page.tsx).
5. Consolidar: **~18 secciones por clase**, no 30+. Si una idea no necesita slide propio, colapsarla en una `station` o `stat`. El peor síntoma del deck viejo era 4 bullets esparcidos en 4 slides; aquí todo va en 1.
6. El contenido sale **exclusivamente** de la guía — no se inventan ejemplos.
7. Validar en pantalla (scroll de landing) **y** en vista impresa (`window.print()` del navegador). Cada sección debe caber en una A4 apaisada (297×210mm) cuando se imprime.
8. Guías (Notion) y presentaciones (repo) son **tareas separadas**. La guía primero; la presentación solo cuando Jorge la pida.

**Cómo agregar un tipo de sección nuevo.** Cuando una clase pide un layout que no existe (ej. una timeline, una grilla 3×3):
1. Agregar el caso en `SectionRenderer` en [`app/clases/[id]/page.tsx`](app/clases/[id]/page.tsx).
2. Escribir la función React para el layout (ver los existentes como modelo).
3. Añadir CSS para screen (landing scroll) y override en `@media print` para que encaje en A4 apaisada.
4. Documentarlo en `TEMPLATE.md` con ejemplo de sintaxis.

**Errores ya cometidos en presentaciones — no repetir:**
- El modelo "deck de slides" (un molde de título + body + footer por slide) produce láminas genéricas y vacías. Cada sección necesita layout propio según qué comunica.
- Tipografía Playfair como body se ve editorial/libro, no presentación. Para UI y cuerpo: **Inter** (sans-serif). Para display grande y serif editorial: **Fraunces**.
- `react-markdown` sin `remark-gfm` **no renderiza tablas** — salen como texto crudo con `|`. Siempre pasar `remarkPlugins={[remarkGfm]}`.
- El CSS con `display: block` sobre `<strong>` quiebra palabras en líneas sueltas. Si se quiere dar énfasis tipográfico a un fragmento, splitear el contenido en JS (`splitQuestion`) en vez de depender de selectores CSS frágiles.

## Identidad visual UA

- Rojo: `#C8102E` (rojo UA) · `#8A0B1F` (dark) · `#FBE8EB` (soft)
- Negro: `#0D0D0D` (fondo) · `#151515` (texto)
- Arena: `#F5F3EF`
- Blanco: `#FFFFFF`
- Gris: `#6B6B6B`
- Claro: `#E8E6E1`

**Tipografía:**
- **Display (Fraunces):** portadas, títulos grandes, números protagonistas, manifesto.
- **Body (Inter):** UI, cards, navegación, texto corrido, pregunta/respuesta.
- **Mono (JetBrains Mono):** fórmulas, datos técnicos del ejercicio resuelto.

Las variables CSS están inline en [`app/clases/[id]/page.tsx`](app/clases/[id]/page.tsx) (`:root`). No se usa `styles/globals.css` para el sistema de presentaciones.

## IDs de Notion en uso

| Recurso | ID |
|---------|-----|
| Protocolo de Producción | `3267612d194d8109a73cd5e63f81e343` |
| Database de clases (data source) | `collection://1017612d-194d-832e-9f51-87597dd50997` |
| Database de clases (page) | `7377612d194d8322ac2b0153d4d4c962` |
| Página padre "Programación de Clases" | `4787612d194d83dc89f801d948db5a5e` |

## Estado actual (al 2026-04-15)

- **Guías completas en Notion:** Clases 1–14.
  - Clase 13: monopolio, oligopolio/competencia monopolística/monopsonio, fallas de mercado. Cierre de micro.
  - Clase 14: repaso formato temático (5 estaciones). Evaluación (40 pts, 90 min, pauta como subpágina) el miércoles 22 abril = **Clase 15**.
- **Presentaciones web:** Clase 14 hecha (~18 secciones, modelo landing). Clases 1–13 pendientes.
- **PPTs antiguos (pptxgenjs):** quedaron como referencia de contenido. No se producen más. Clases 6, 13 y 14 nunca tuvieron PPT y ya no lo tendrán (pasaron directo al modelo web).
- **Pendiente estructural:** Clase 27 no existe en Notion. Discrepancia Evaluación Regular 2 → Notion Semana 14, syllabus Semana 12.
- **Macro arranca en Clase 16** (Clase 15 es la evaluación). Clase 30: "Síntesis: Macroeconomía y entorno político-social actual", jueves 11 de junio.

## Emails semanales a estudiantes

- Se envían el **lunes**.
- Adjuntan el PDF/PPT de la clase del **jueves anterior**.
- Previsualizan las clases del miércoles y jueves de esa semana.
- Lecturas organizadas por día (Samuelson primario, Case & Fair alternativa).
- Referencias a nivel de capítulo, no página.
