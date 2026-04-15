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

### Presentaciones web (este repo) — nuevo flujo reemplazando pptxgenjs
1. Leer la guía de la clase en Notion como **única fuente de contenido**.
2. Crear `content/presentaciones/clase-NN.md` siguiendo `content/presentaciones/TEMPLATE.md`.
3. Slides separados por `---` en línea propia; primera línea `#` o `##` = título del slide.
4. Estructura fija del deck (heredada del flujo PPT, sigue vigente):
   - **Portada oscura** — fondo negro, barra roja izquierda, título grande (auto desde Notion).
   - **Estructura de la clase** — los 6 bloques con número, título y descripción (sin duraciones).
   - **Repaso** — 3 preguntas sobre la clase inmediatamente anterior, con círculos rojos.
   - Por cada bloque: **divisor oscuro** + slides de contenido.
   - **Cierre + Tarea** — columna izquierda preguntas de resumen, columna derecha tarea y próxima clase.
   - **Slide final oscuro** — "Nos vemos el [día]." (auto).
5. Las duraciones de bloque **nunca** aparecen en los slides.
6. El contenido sale **exclusivamente** de la guía — no se inventan ejemplos ni se agrega material externo.
7. Validar que cada slide quepa en A4 horizontal (297×210mm). Partir si no cabe.
8. Guías y presentaciones son **tareas separadas**. Entregar la guía primero; empezar la presentación solo cuando Jorge lo pida explícitamente.

### Taxonomía de tipos de slide (referencia al construir el MD)
| Tipo | Cuándo usarlo |
|------|---------------|
| Dos columnas (claro/oscuro) | Comparaciones (macro vs micro, definición vs aplicación) |
| Cards con acento rojo izquierdo | Listas de ítems, condiciones, pasos |
| Pregunta + respuesta (izq/der) | Preguntas al curso con respuesta esperada |
| Tabla real | Datos numéricos (ej. tablas de Samuelson) |
| Grilla 2×2 | 4 supuestos o clasificaciones |
| 5 círculos numerados en fila | Exactamente 5 condiciones o pasos |
| Divisor oscuro | Cambio de bloque |
| Callout oscuro al pie | Cita bibliográfica o conclusión clave |

Las citas bibliográficas van al pie, gris claro, cursiva. Footer de cada slide: "Universidad Autónoma de Chile · Introducción a la Economía · Clase N".

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

## Estado actual (según Protocolo de Producción en Notion al 2026-04-15)

- **Guías completas:** Clases 1–14.
  - Clase 13: monopolio (profundidad), monopsonio/oligopolio/competencia monopolística (definiciones), fallas de mercado. Cierre de micro.
  - Clase 14: repaso + evaluación (40 pts, 90 min, pauta como subpágina). Evaluación ~22 abril.
- **PPTs antiguos (pptxgenjs) pendientes:** Clases 6, 13, 14. Todos los demás están hechos.
- **Presentaciones web pendientes:** todas — flujo recién arranca.
- **Pendiente estructural:** Clase 27 no existe en Notion, hay que crearla.
- **Discrepancia sin resolver:** Evaluación Regular 2 → Notion dice Semana 14, syllabus dice Semana 12.
- **Macro arranca en Clase 15.** Clase 30 planificada: "Síntesis: Macroeconomía y entorno político-social actual" (jueves 11 de junio).

## Emails semanales a estudiantes

- Se envían el **lunes**.
- Adjuntan el PDF/PPT de la clase del **jueves anterior**.
- Previsualizan las clases del miércoles y jueves de esa semana.
- Lecturas organizadas por día (Samuelson primario, Case & Fair alternativa).
- Referencias a nivel de capítulo, no página.
