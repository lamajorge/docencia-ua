# DERE-A0004 · Introducción a la Economía

Curso de primer año de Derecho en Universidad Autónoma de Chile. Dos artefactos paralelos con audiencias distintas:

1. **Guías del profesor** (Notion) — narrativas detalladas para Jorge en clase.
2. **Presentaciones web** (este repo) — landing pages editoriales proyectables en aula e imprimibles como PDF.

---

## Identidad del curso

| | |
|---|---|
| Asignatura | **DERE-A0004** — Introducción a la Economía |
| Código SCT antiguo | DSCT104 (no usar) |
| Carrera | Derecho |
| Audiencia | Primer año, sin formación previa en economía ni matemática formal |
| Horario | Miércoles y jueves, 08:00–09:20 (80 min c/u) |
| Duración | 18 semanas · 72 hrs pedagógicas presenciales + 96 cronológicas autónomas · 5 créditos SCT |
| Régimen | Semestral, otoño, diurno regular, presencial |
| Asistencia mínima | 70% |
| Profesor | Jorge Lama · MA International Political Economy (University of York) — perspectiva crítica e históricamente situada |

**Bibliografía:**
- Primaria: Samuelson & Nordhaus, *Economía*, 18ª ed.
- Secundaria: Case & Fair, *Principios de Microeconomía*, 10ª ed.
- Complementaria: Mankiw, Krugman, Varian, Hazlitt, Larraín & Sachs.

---

## Reglas por área — leer antes de trabajar

Los archivos en [`.claude/rules/`](.claude/rules/) no se cargan automáticamente. Abrilos cuando el trabajo entre en su dominio.

| Cuándo lo leés | Archivo |
|---|---|
| Antes de redactar cualquier contenido conceptual (guía o presentación) | [`.claude/rules/pedagogia.md`](.claude/rules/pedagogia.md) |
| Antes de crear o modificar una guía en Notion | [`.claude/rules/produccion-guias.md`](.claude/rules/produccion-guias.md) |
| Antes de crear o modificar una presentación (Marp) | [`.claude/rules/produccion-presentaciones.md`](.claude/rules/produccion-presentaciones.md) y [`marp/README.md`](marp/README.md) |
| Antes de tocar CSS, tema, tipografía | [`.claude/rules/identidad-visual.md`](.claude/rules/identidad-visual.md) |
| Ante cualquier decisión sobre asistencia, notas, eliminación, interrupción | [`.claude/rules/normativa-pregrado.md`](.claude/rules/normativa-pregrado.md) |
| Antes de diseñar, imprimir, corregir o retroalimentar una evaluación | [`.claude/rules/evaluaciones.md`](.claude/rules/evaluaciones.md) |
| Antes de ejecutar algo que pudo haber fallado antes | [`.claude/rules/errores-no-repetir.md`](.claude/rules/errores-no-repetir.md) |

---

## Arquitectura (resumen)

**Modelo vigente desde 2026-04-29: Marp para presentaciones.**

- **Presentaciones (vigente):** [`marp/`](marp/). Una clase = un `.md` Marp + theme `theme-ua.css`. `npm run build clase-NN.md` → PDF. Sin React, sin bugs de print, exportable a PowerPoint. Ver [`marp/README.md`](marp/README.md).
- **Sitio web (legacy):** `docencia-ua.vercel.app`. Rutas `/clases` (grid índice) y `/clases/[n]` (landing). Sirve como índice público; las presentaciones proyectables son los PDFs de Marp.
- **Sistema legacy de presentaciones:** `content/presentaciones/clase-N.md` con sintaxis `:::` + React renderer en [`app/clases/[id]/page.tsx`](app/clases/[id]/page.tsx). **No producir clases nuevas acá.** Las viejas se migran a Marp cuando necesiten cambios.
- **Bibliografía (`content/manuales/`):** fuente interna, no pública (copyright).
- **Guías (Notion):** narrativas detalladas para Jorge en clase. No se exponen en el sitio.

---

## Documentos normativos en el repo

| Documento | Uso |
|---|---|
| [`RES-RECTORIA-No-009-2024-Modifica-Reglamento-General-del-Estudiante-de-Pregrado.pdf`](RES-RECTORIA-No-009-2024-Modifica-Reglamento-General-del-Estudiante-de-Pregrado.pdf) | Reglamento vigente. Indexado en [`normativa-pregrado.md`](.claude/rules/normativa-pregrado.md). |
| [`Formato 2025 Syllabus Diurno Regular Intro Economía (1).pdf`](<Formato 2025 Syllabus Diurno Regular Intro Economía (1).pdf>) | Syllabus corporativo vigente marzo 2026. |
| [`04. INTRODUCCION A LA ECONOMÍA - PROGRAMA SCT - DERECHO.pdf`](<04. INTRODUCCION A LA ECONOMÍA - PROGRAMA SCT - DERECHO.pdf>) | Programa SCT base. Superado por syllabus donde difieran. |

---

## Estado del curso (al 2026-04-23)

- **Guías en Notion:** Clases 1–14 completas · Clase 15 = Evaluación Regular 1 · Clase 16 producida · Clase 17 (PIB) existe en Notion.
- **Presentaciones web:** Clases 1–17 en formato landing.
  - Clase 15 = revisión de pauta (con respuestas).
  - Clase 16 = revisión Regular 1 + instrucción 10% + transición micro→macro.
  - Clase 17 = PIB y objetivos macro (contenido que era la clase 16 anterior).
- **Regular 1:** aplicada miércoles 22 de abril · 20 pts · cubre Clases 1–13 · 40%.
- **Regular 2:** 2/3 junio 2026 · acumulativa Unidades I, II y III · 50%.
- **Examen de repetición:** 8 julio 2026.
- **10% — Ensayo + presentación oral:**
  - ~750 palabras · estructura: intro + 3 párrafos PEEL + conclusión + referencias.
  - PEEL = **Punto, Evidencia, Explicación, Enlace** (siglas inglesas entre paréntesis como referencia).
  - Bibliografía libre; alumno envía correo con tema y recibe sugerencias de fuentes.
  - Presentación oral: 6 min ante el curso; el profesor asigna 1–2 slots por clase según disponibilidad.
  - Bonificación: entrega antes del 20 mayo → +2 pts base; 21 mayo–17 junio → +1 pt base.
  - Correo de entrega y contacto: **jorge.lama@cloud.uautonoma.cl**
  - 10% = mejor nota entre Regular 1 y Regular 2 (no Canvas).
- **Escala de notas:** 60% = 4.0 (Art. 26). Para prueba de 20 pts → 12 pts = 4.0.
- **Programa macroeconomía Unidad III (verificado contra Notion 2026-04-29):**
  - **17** (mié 29 abr) Bienvenida a la macroeconomía — 4 objetivos + coyuntura
  - **18** (jue 30 abr) El PIB — qué mide, qué cuenta, qué no
  - **19** (mié 6 may) PIB nominal, PIB real y bienestar económico — deflactor, per cápita
  - **20** (jue 7 may) Desplazamientos del modelo DA-OA — shocks
  - **21** (mié 13 may) Limitaciones del PIB y crecimiento económico — IDH, ciclos
  - **22** (jue 14 may) Debate: Crecimiento vs. Desarrollo Humano (Sen)
  - **23** (mié 20 may) La inflación — causas, efectos, medición, IPC
  - **24** (mié 27 may) El desempleo y la Curva de Phillips
  - **25** (jue 28 may) Política Fiscal — gasto, impuestos, multiplicador
  - **26** (mié 3 jun) ⚠️ EVALUACIÓN REGULAR 2 — acumulativa Unidades I-II-III
  - **27** (mié 10 jun) Política Monetaria — dinero, BCCh, TPM, encaje
  - **28** (jue 11 jun) Macroeconomía y Ética — inconsistencia temporal, autonomía BCCh, Rosende ← **Bretton Woods aquí**
  - **29** (mié 17 jun) Síntesis: Macroeconomía y entorno político-social actual — reflexión Eco-Derecho
  - **30** (jue 18 jun) Repaso final y síntesis del semestre
  - **31** (mié 24 jun) Presentaciones orales — Ensayo 10% (clase dedicada)
  - **32** (jue 8 jul) EXAMEN DE REPETICIÓN
  - *(Clase 33 en Notion = Revisión Regular 1 del jue 23 abr — numeración no cronológica en la DB)*
- **Reservado para Clase 28 (Macroeconomía y Ética — inconsistencia temporal + autonomía BCCh):** contar **Bretton Woods** con detalle como contexto histórico de la autonomía del Banco Central. Quiénes: Keynes (UK) y Harry Dexter White (EE.UU.); cuándo: julio 1944, antes de terminar la Segunda Guerra; qué se decidió: FMI, Banco Mundial, tipos de cambio fijos al dólar y dólar al oro; hasta cuándo duró: 1971 (Nixon termina convertibilidad); influencia hasta hoy: el modelo de bancos centrales autónomos chileno (1989) viene del consenso macro post-BW.

---

## Emails semanales a estudiantes

- Se envían los **lunes**.
- Adjuntan el PDF/PPT de la clase del **jueves anterior**.
- Previsualizan las clases del miércoles y jueves de esa semana.
- Lecturas organizadas por día, Samuelson primario + Case & Fair alternativo.
- Referencias a nivel de capítulo, no página.
