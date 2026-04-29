# Errores ya cometidos — changelog de correcciones

**Cuándo leer este archivo:** cuando estés por hacer algo que pudo haber fallado antes. Si un patrón aquí coincide con lo que vas a ejecutar, reconsiderar.

---

## Producción de guías (Notion)

- El repaso es de la clase **inmediatamente anterior**, no de cualquier anterior. *Incidente Clase 7: repasó Clase 5 en vez de 6.*
- Verificar título **real** de la clase siguiente en Notion antes de anticiparla en el cierre. *Incidente Clase 7: anticipó "Teoría de la Empresa" cuando la Clase 8 era "Oferta de mercado".*
- Buscar la página existente antes de crear. *Incidente Clase 7: se creó duplicada.*
- Teoría del consumidor (Clase 5) se detiene en utilidad y preferencias — la curva de demanda se construye en Clase 6. No adelantar.
- Becker es contexto histórico, no se desarrolla como bloque de clase.
- La frase **"cierren cuadernos"** se eliminó de todas las guías y presentaciones. No reintroducirla.
- Referencias a **Canvas como tarea entregable** se eliminaron (~9 ocurrencias en 7 clases). Jorge no usa Canvas operativamente — ver cláusula alternativa en [`evaluaciones.md`](evaluaciones.md).

---

## Presentaciones web

- El modelo "deck de slides" (molde único de título + body + footer) produce láminas genéricas. Cada sección necesita layout propio por rol semántico.
- Tipografía Playfair como body se ve como libro, no presentación. Usar **Inter** para body/UI y **Fraunces** para display serif.
- `react-markdown` sin `remark-gfm` no renderiza tablas. Siempre pasar `remarkPlugins={[remarkGfm]}`.
- `display: block` sobre `<strong>` quiebra palabras en líneas sueltas. Si querés énfasis tipográfico de un fragmento, splitear el contenido en JS (`splitQuestion`), no depender de CSS.
- Bug de zero-pad en [`lib/presentaciones.ts`](../../lib/presentaciones.ts): los archivos se llaman `clase-N.md` (sin cero). Corregido removiendo `padStart(2, '0')`.
- Manifesto con slots vacíos renderizaba "01/02/03" sin pregunta → filtrar `q1..q6` por `q && q.trim()` antes de mapear.
- Tablas en secciones `intro` no tenían bordes → agregar CSS completo (th con fondo negro, td con bordes, zebra rows).
- Refactor "por longitud de texto" sobre-divide secciones. Consolidar por concepto, no por densidad.
- Diagramas numéricos sin marcas en los ejes → siempre plotear con valores reales de la tabla origen.
- Leyendas de abreviaturas faltantes → toda D/O/P/Q/EC/EP/T debe definirse en el slot `::d{n}-leyenda` antes de usarse.
- **Print CSS en A4 landscape (297×210mm) cortaba contenido.** Las láminas se diseñan en pantalla con proporción 16:9 (vh-based). Corregido 2026-04-23: `@page { size: 297mm 167mm; margin: 0 }` y `.slide { height: 167mm }`. Todos los tamaños tipográficos escalados por factor ≈0.795. No volver a usar `size: A4 landscape` ni `height: 210mm`.
- **`evaluacion` — slot `sec${n}-body` renderizaba asteriscos en texto crudo.** Estaba en un `<p>` sin pasar por `<MD>` (ReactMarkdown). Corregido a `<div className="ev-body"><MD>...</MD></div>`. Cualquier slot de contenido libre que pueda tener markdown (negritas, listas, cursivas) debe pasar por `<MD>`.
- **`::trampa` y `::regla` en secciones `station` de clases de revisión/organización.** Esos slots tienen sentido en clases de contenido nuevo. En clases que solo revisan o presentan estructura del curso, eliminar ambos slots — son ruido para el estudiante.

---

## Normativa y evaluaciones

- **Escala de notas con 4.0 a 50% violaba Art. 26.** Corregido 2026-04-21: el piso de 4.0 está en 60% (= 24 pts de 40). Nunca asumir escala — revisar contra reglamento antes de imprimir.
- Subpáginas "Evaluación Regular" y "Pauta de Corrección" estaban colgadas de Clase 14 (repaso) en vez de Clase 15 (la evaluación). Movidas 2026-04-21.
- Código DSCT104 del programa SCT antiguo no coincide con DERE-A0004 del syllabus vigente. Usar siempre el del syllabus corporativo.

---

## Sitio y build

- Ruta `/print` separada es innecesaria — el mismo URL imprime vía `@media print` desde la toolbar.
- `content/manuales/` es fuente interna por copyright — no exponer en rutas públicas.
- **Vercel build tiempo:** deploy normal ~1m25s. Deploy de ~26s = build fallido — Vercel revierte al deploy anterior. Si el grid muestra 0 clases después de un deploy, verificar el tiempo del build en Vercel.
- **Notion + grid 0 clases:** si `getClases()` lanza error (token inválido, red, database ID incorrecto), el try-catch de `app/clases/page.tsx` silenciosamente devuelve `[]`. El fallback está dentro de `getClases()` en `lib/notion.ts` — si Notion falla o retorna vacío, usa `localClases()` (archivos locales). No remover ese fallback.
- **`station` tiene "QUÉ DEBEN DOMINAR" hardcodeado.** Para clases de revisión de evaluación, usar el tipo `revision` (labels configurables). Ver [`produccion-presentaciones.md`](produccion-presentaciones.md).

---

## Presentaciones — evaluaciones y porcentajes

- **El % suelto se lee como ponderación.** Mostrar "60%" sin contexto en una prueba que pondera 40% confunde al estudiante — lo interpreta como el peso en la nota final. Siempre acompañar el umbral de aprobación con la frase del Art. 26: "la nota 4,0 se obtiene con el 60% del puntaje" + el equivalente en puntos concretos.

---

## Registro y lenguaje (Clase 17, abril 2026)

Ver regla completa en [`pedagogia.md` § Registro y lenguaje](pedagogia.md). Acá quedan los ejemplos concretos que ya se corrigieron — no volver a producirlos:

| Frase descartada | Reemplazo |
|---|---|
| "La macro entra por la coyuntura." | "Empecemos por lo que pasó este mes." |
| "Hoy le ponemos nombre y marco." | "Hoy aprendemos a nombrarla." |
| "La macroeconomía vive en lo que ya enfrentan." | "La macroeconomía aparece en lo cotidiano." |
| "Hoy hacemos zoom en una pieza." | "Hoy nos enfocamos en una pieza." |
| "CASOS QUE TENSIONAN LA DEFINICIÓN" | "CASOS QUE PONEN A PRUEBA LA DEFINICIÓN" |
| "para que existan en su cabeza" | "para que les queden registrados" |
| "pedazos de este proyecto" | "varias de sus medidas" |
| "el marco donde viven las normas" | "el contexto en que se aplican las normas" |
| "contratos atados al IPC, normas atadas a la UF, fallos atados al tipo de cambio, leyes atadas a la regla fiscal" | "normas, contratos y sentencias donde aparecen conceptos como IPC, UF, tipo de cambio o regla fiscal" |
| Manifesto: "¿Cuándo enfrentaron macroeconomía esta semana?" + ejemplos centrados en el alumno (almuerzo cerca de la U, matrícula, beca, CAE) | Enunciado impersonal ("¿Dónde aparece la macroeconomía en lo cotidiano?") + ejemplos universales (bencina, crédito, dólar, noticia en celular). **Si Jorge valida el contenido de los ejemplos, conservarlos LITERAL — no reescribirlos.** |
