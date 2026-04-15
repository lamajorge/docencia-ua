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
2. **Presentaciones web (en este repo)** — slides proyectables en aula + exportables a PDF (1 lámina A4 horizontal por hoja). Viven en `content/presentaciones/clase-NN.md`.

**Rutas públicas del sitio:** solo `/clases` (grid) y `/clases/[n]` (detalle + `/print`). El resto no se expone — la bibliografía (`content/manuales/`) es **fuente de datos interna** por copyright, no contenido público.

## Principios pedagógicos (no negociables)

- **Palabras primero.** Fórmula solo si agrega precisión que las palabras no entregan. Diagrama como apoyo visual, nunca sustituto verbal. Criterio: utilidad pedagógica para estudiantes de Derecho sin matemática formal.
- **"Reglas de oro" activadas explícitamente en cada clase nueva:** ley de la demanda, ley de la oferta, mecanismo de ajuste, equilibrio. Nunca asumir que los estudiantes hacen la conexión solos.
- **Diagramas verificados contra manuales antes de construirlos.** Si un diagrama no existe ni en Samuelson ni en Case & Fair, reemplazar por explicación verbal anclada a una figura que sí exista.
- **Conexiones con Derecho orgánicas, nunca forzadas.** Prohibido el framing "como futuros abogados…". Ejemplos naturales sí (salario mínimo → ley de la demanda, tasa de interés → mercado de arriendo).
- **Ejercicios grupales después del bloque teórico correspondiente**, nunca antes (los alumnos necesitan la teoría de incidencia antes de resolver ejercicios de impuestos, por ejemplo).

## Protocolos de producción

### Guías (Notion) — obligatorio
1. Leer **Protocolo de Producción** en Notion (`3267612d194d8109a73cd5e63f81e343`).
2. Leer la guía de la clase inmediatamente anterior (modelo de formato y tono).
3. Hacer preguntas pedagógicas estructuradas antes de generar.
4. Generar.
5. Subir a la **página existente** de la clase en Notion. Nunca crear una entrada nueva.

### Presentaciones web (este repo) — nuevo flujo reemplazando pptxgenjs
1. Leer la guía de la clase en Notion como **única fuente de contenido**.
2. Crear `content/presentaciones/clase-NN.md` siguiendo `content/presentaciones/TEMPLATE.md`.
3. Slides separados por `---` en línea propia; primera línea `#` o `##` = título del slide.
4. Estructura fija del deck (heredada del flujo PPT, sigue vigente):
   - Portada oscura (auto, desde metadatos Notion)
   - Overview de 6 bloques
   - Repaso (3 preguntas)
   - Por cada bloque: slide divider + slides de contenido
   - Cierre + tarea
   - Slide de cierre (auto)
5. Las duraciones de bloque **nunca** aparecen en los slides.
6. Validar que cada slide quepa en A4 horizontal (297×210mm). Partir si no cabe.
7. Guías y presentaciones son **tareas separadas**. Entregar la guía primero; empezar la presentación solo cuando Jorge lo pida explícitamente.

## Identidad visual UA

- Rojo: `#C8102E`
- Negro: `#1A1A1A`
- Arena: `#F5F4F2`
- Blanco: `#FFFFFF`
- Gris: `#6B6B6B`
- Claro: `#ECECEA`
- Display: Playfair Display
- Body: Source Serif 4

Definidas como variables en [styles/globals.css](styles/globals.css).

## IDs de Notion en uso

| Recurso | ID |
|---------|-----|
| Protocolo de Producción | `3267612d194d8109a73cd5e63f81e343` |
| Database de clases (data source) | `collection://1017612d-194d-832e-9f51-87597dd50997` |
| Database de clases (page) | `7377612d194d8322ac2b0153d4d4c962` |
| Página padre "Programación de Clases" | `4787612d194d83dc89f801d948db5a5e` |

## Estado actual (actualizar manualmente cuando cambie)

- **Guías completas:** Clases 1–13 (Clase 13 cubre monopolio + fallas de mercado, cierre de micro).
- **Clase 14:** repaso + evaluación. Evaluación completa (40 pts, 90 min) y pauta existen como subpáginas.
- **Pendiente guías:** Clase 27 (no existe aún).
- **Pendiente presentaciones web:** todas — se está migrando desde PPTs.
- **Discrepancia sin resolver:** Evaluación Regular 2 — Notion dice Semana 14, syllabus dice Semana 12.
- **Macro arranca en Clase 15.** Clase 30 planificada: "Síntesis: Macroeconomía y entorno político-social actual" (jueves 11 de junio).

## Emails semanales a estudiantes

- Se envían el **lunes**.
- Adjuntan el PDF/PPT de la clase del **jueves anterior**.
- Previsualizan las clases del miércoles y jueves de esa semana.
- Lecturas organizadas por día (Samuelson primario, Case & Fair alternativa).
- Referencias a nivel de capítulo, no página.
