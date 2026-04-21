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

---

## Normativa y evaluaciones

- **Escala de notas con 4.0 a 50% violaba Art. 26.** Corregido 2026-04-21: el piso de 4.0 está en 60% (= 24 pts de 40). Nunca asumir escala — revisar contra reglamento antes de imprimir.
- Subpáginas "Evaluación Regular" y "Pauta de Corrección" estaban colgadas de Clase 14 (repaso) en vez de Clase 15 (la evaluación). Movidas 2026-04-21.
- Código DSCT104 del programa SCT antiguo no coincide con DERE-A0004 del syllabus vigente. Usar siempre el del syllabus corporativo.

---

## Sitio y build

- Ruta `/print` separada es innecesaria — el mismo URL imprime vía `@media print` desde la toolbar.
- `content/manuales/` es fuente interna por copyright — no exponer en rutas públicas.
