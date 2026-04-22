# TEMPLATE — presentaciones web (landing por clase)

Referencia de sintaxis para producir `content/presentaciones/clase-NN.md`. Cada archivo define **una landing page editorial** que se publica en `/clases/NN` y se imprime a PDF A4 apaisada desde el botón "Imprimir / Guardar PDF" en la toolbar.

No hay ruta `/print` separada. La misma URL imprime vía `@media print`.

---

## 1. Estructura general

```markdown
---
clase: NN
titulo: Título de la clase
unidad: Unidad II
fecha: Jueves XX de MES
---

::: tipo-de-seccion [props opcionales]
::slot-uno
Contenido markdown del slot uno.

::slot-dos
Contenido markdown del slot dos.
:::

::: otro-tipo
...
:::
```

**Reglas del parser:**
- Frontmatter YAML-ligero en `---`/`---` (clase, titulo, unidad, fecha).
- Cada sección: `::: tipo [props]` abre, `:::` cierra.
- Los slots dentro de una sección se declaran con `::nombre-del-slot` en su propia línea. Todo lo que sigue hasta el próximo `::slot` (o el cierre `:::`) es el contenido de ese slot, como markdown libre.
- Props en la línea de apertura: `num=01 titulo="Con espacios" clases="Clases 1 y 2"`. Usar comillas si hay espacios.

**Consolidar.** ~18 secciones por clase. Si una idea no necesita sección propia, va dentro de un `station` o un `stat`. Evitar explotar el deck en 30+ slides.

---

## 2. Tipos de sección disponibles

Cada tipo tiene un layout único. El renderer está en `app/clases/[id]/page.tsx`.

### `hero` — portada
Fondo negro, banda roja izquierda, título Fraunces masivo.

```markdown
::: hero
::eyebrow
CLASE NN · UNIDAD II

::titulo
Título grande de la clase

::subtitulo
Bajada opcional en cursiva

::meta
DERE-A0004 · Introducción a la Economía · Universidad Autónoma de Chile
:::
```

### `intro` — encuadre
Fondo arena, tipografía editorial, columna única a la izquierda.

```markdown
::: intro
::kicker
EL MAPA DE HOY

::titulo
Frase de apertura, máximo 2 líneas.

::body
Párrafo de contexto. Puede tener **bold** y *italic*.

Otro párrafo si hace falta.
:::
```

### `roadmap` — índice visual de la clase
Grilla de cards numeradas (hasta 12). Cada una con número rojo grande + título + subtítulo corto. Usar como "mapa de la clase" después del `hero`/`intro`.

```markdown
::: roadmap
::kicker
LAS SIETE PARADAS

::titulo
Título declarativo del arco de la clase.

::p1-titulo
Nombre del bloque 1
::p1-body
Subtítulo de una línea.

::p2-titulo
Nombre del bloque 2
::p2-body
Subtítulo.

::p3-titulo
...
:::
```

El grid se ajusta automáticamente según cuántos `p{n}-titulo` se detecten (3, 4, 5, 6 o más). Para 6 o 3 bloques usa 3 columnas; para el resto, 4.

### `manifesto` — preguntas diagnósticas
Tres preguntas numeradas en cursiva grande, estilo declaración.

```markdown
::: manifesto
::titulo
Tres preguntas para arrancar.

::q1
¿Primera pregunta?

::q2
¿Segunda pregunta?

::q3
¿Tercera pregunta?

::footer
Indicación o disclaimer en gris pequeño.
:::
```

### `station` — estación temática (la pieza más densa)
Número 40mm rojo + cabecera con tema + grid "qué dominar" | "pregunta + respuesta" + footer "trampa común" | "regla de oro". Hecha para consolidar una clase completa o una unidad temática en una sola sección.

```markdown
::: station num=01 clases="Clases 1 y 2"
::titulo
Fundamentos

::dominar
- **Concepto 1.** Explicación breve.
- **Concepto 2.** Explicación breve.
- **Concepto 3.** Explicación breve.

::pregunta
¿La pregunta que se le hace al curso?

::respuesta
**Respuesta esperada.** Explicación completa con **énfasis** donde haga falta.

::trampa
**"Frase errada."** La corrección y el porqué.

::regla
La regla de oro del curso que aplica aquí.
:::
```

### `mecanismo` — secuencia de pasos
Lista numerada con círculos rojos y flechas verticales. Fondo negro. Hecha para explicar procesos con orden fijo (ajuste de mercado, cadena causal).

```markdown
::: mecanismo
::titulo
Título del mecanismo

::subtitulo
Condición bajo la que opera

::paso1
**Primer paso**
Explicación corta.

::paso2
**Segundo paso**
Explicación corta.

::paso3
**Tercer paso**
Explicación corta.

::paso4
**Resultado final**
Explicación corta.

::nota
Variante o caveat opcional.
:::
```

### `stat-hero` — un dato gigante
Número de 85mm ocupando el 55% izquierdo (fondo rojo), panel derecho negro con contexto. Usar para el dato central de un ejercicio o concepto.

```markdown
::: stat-hero
::numero
$200

::label
ETIQUETA EN SMALL CAPS

::texto
Explicación editorial del dato. Puede tener **bold**.

::subtexto
Pie de página opcional con contexto adicional.
:::
```

### `stat-duo` — número + fórmula + explicación
Split 50/50. Izquierda: número rojo grande + fórmula en mono. Derecha: interpretación editorial. Usar para cálculos del ejercicio resuelto.

```markdown
::: stat-duo
::kicker
(A) CUÑA IMPOSITIVA

::numero
$200

::formula
Pc − Pv = $940 − $740

::texto
**Coincide con el impuesto.** Siempre. Por definición.
:::
```

### `stat-split` — dos datos en paralelo
Grilla de dos cells contrastantes (oscura / clara) con números gigantes a ambos lados + insight abajo. Usar para comparar dos valores del mismo fenómeno (70% / 30%, antes / después).

```markdown
::: stat-split
::kicker
(B) DISTRIBUCIÓN DE LA CARGA

::leftlabel
CONSUMIDORES ABSORBEN
::leftnum
$140
::leftpct
70%
::leftformula
Pc − Pe = $940 − $800

::rightlabel
PRODUCTORES ABSORBEN
::rightnum
$60
::rightpct
30%
::rightformula
Pe − Pv = $800 − $740

::insight
**Interpretación.** Lo que nos dice la distribución sobre las elasticidades.
:::
```

### `grid-fallas` — grilla 2×2
Cuatro items en grilla 2×2 con fondos alternados (claro/oscuro/oscuro/claro). Usar para taxonomías de cuatro categorías.

```markdown
::: grid-fallas
::titulo
Título de la taxonomía

::f1-titulo
Categoría 1
::f1-body
Descripción. Puede tener **bold**.

::f2-titulo
Categoría 2
::f2-body
Descripción.

::f3-titulo
Categoría 3
::f3-body
Descripción.

::f4-titulo
Categoría 4
::f4-body
Descripción.
:::
```

### `exercise-intro` — apertura de ejercicio resuelto
Portada de ejercicio en fondo negro. Título grande + banda con datos en monospace.

```markdown
::: exercise-intro
::kicker
EJERCICIO TIPO EVALUACIÓN

::titulo
Nombre del ejercicio

::datos
Pe = $800 · Impuesto = $200 · Pc = $940 · Pv = $740

::nota
Por qué se resuelve este.
:::
```

### `exercise-d` — cierre narrativo del ejercicio
Título enorme rojo + cuerpo editorial + panel negro con el "giro" o insight final. Usar para el último paso del ejercicio cuando tiene una reflexión conceptual.

```markdown
::: exercise-d
::kicker
(D) JUSTIFICACIÓN

::titulo
Externalidad negativa.

::body
Párrafo explicativo con **énfasis**. Máximo 3-4 líneas.

::twist
El giro final. Qué cambia la interpretación.
:::
```

### `evaluacion` — formato de la evaluación
Tres cells con puntajes gigantes rojos + criterio oscuro destacado + claves con flechas.

```markdown
::: evaluacion
::titulo
Cómo viene la evaluación

::sub
40 puntos · 90 minutos · miércoles XX de MES

::sec1-label
Sección I
::sec1-pts
10 pts
::sec1-body
Descripción de la sección.

::sec2-label
Sección II
::sec2-pts
15 pts
::sec2-body
Descripción.

::sec3-label
Sección III
::sec3-pts
15 pts
::sec3-body
Descripción.

::criterio
**Criterio clave** en una frase contundente.

::claves
- **Punto 1:** consejo práctico.
- **Punto 2:** consejo práctico.
:::
```

### `revision` — revisión de prueba

Misma estructura visual que `station` (número + cabecera + grid 50/50 + footer trampa/regla), pero con labels configurables. Usar para clases de revisión de evaluación. **No usar `station`** — tiene "QUÉ DEBEN DOMINAR" hardcodeado.

Props: `num`, `clases`, `labelLeft` (default: `RESPUESTAS CORRECTAS`), `labelRight` (default: `CONCEPTO CLAVE`).

```markdown
::: revision num=01 clases="Clases 1–3"
::titulo
Fundamentos — Preguntas 1 a 3

::respuestas
- **P1 → D.** *"¿Cuál describe correctamente la escasez?"* La escasez significa que los recursos son limitados frente a deseos ilimitados.
- **P2 → C.** *"Una economía bajo su FPP:"* Tiene recursos desaprovechados — ineficiencia.

::concepto
**Pregunta conceptual central al curso.**

Explicación con cadena causal completa.

::trampa
**"Frase errada."** Corrección y porqué.

::regla
La regla de oro del curso que aplica.
:::
```

Para secciones de desarrollo (rúbrica + respuesta modelo), usar `labelLeft` y `labelRight`:

```markdown
::: revision num=04 clases="Clases 1–2" labelLeft="PREGUNTA Y RÚBRICA" labelRight="RESPUESTA MODELO"
::titulo
Sección II — Pregunta 1: Costo de oportunidad (5 pts)

::respuestas
**Pregunta:** ...

- Definición correcta (2 pts): ...
- Relevancia (1,5 pts): ...
- Ejemplo concreto (1,5 pts): ver panel de la derecha.

::concepto
**Respuesta modelo completa.**
:::
```

### `close` — cierre + tarea + fecha
Fondo negro, título enorme con la fecha, tarea abajo, reglas de oro en banda.

```markdown
::: close
::eyebrow
TAREA · MIÉRCOLES XX DE MES

::titulo
Nos vemos a las 08:00.

::body
Instrucción de tarea con **énfasis**.

::reglas
lista · separada · con · puntos

::meta
DERE-A0004 · Introducción a la Economía · Universidad Autónoma de Chile
:::
```

### `referencia` — tabla bibliografía por tema
Fondo negro, tabla de tres columnas: Tema · Samuelson · Case & Fair. Usar para una lámina de "dónde estudiar cada tema" en clases de repaso.

```markdown
::: referencia
::kicker
DÓNDE ESTÁ LA MATERIA

::titulo
Cada tema tiene su capítulo

::r1-tema
Escasez, costo de oportunidad y FPP
::r1-sam
Cap. 1
::r1-cf
Cap. 1

::r2-tema
Demanda, oferta y sus determinantes
::r2-sam
Cap. 3
::r2-cf
Cap. 3

::r3-tema
Impuestos, subsidios, incidencia y peso muerto
::r3-sam
Cap. 4
::r3-cf
Cap. 4

::r7-tema
Externalidades, bienes públicos, información asimétrica
::r7-sam
Cap. 18
::r7-cf
Cap. 16
:::
```

Acepta hasta 10 filas (`r1` … `r10`). Cada fila necesita `r{n}-tema`, `r{n}-sam`, `r{n}-cf`. Las filas sin `r{n}-tema` se omiten.

### `diagrama` — tres SVG con explicación
Fondo arena, tres paneles en grilla (1 a 3 diagramas). Cada panel: SVG preconstruido arriba + título + explicación textual. Los SVGs disponibles se identifican con `::d{n}-tipo`: `fpp`, `equilibrio`, `cuña`.

```markdown
::: diagrama
::kicker
DIAGRAMAS CLAVE — CÓMO LEERLOS

::d1-tipo
fpp

::d1-titulo
Frontera de Posibilidades de Producción

::d1-texto
**Sobre la curva** = eficiencia. **Bajo la curva** = ineficiencia. **Fuera** = inalcanzable. La pendiente es el **costo de oportunidad**.

::d2-tipo
equilibrio

::d2-titulo
El Punto de Equilibrio

::d2-texto
Donde D y O se cruzan: **Pe** y **Qe**. Si P > Pe hay excedente. Si P < Pe hay escasez.

::d3-tipo
cuña

::d3-titulo
La Cuña Impositiva

::d3-texto
**Pc** = precio consumidor. **Pv** = precio vendedor. Pc − Pv = T (impuesto). Rectángulo = recaudación. Triángulo = **peso muerto**.
:::
```

Para agregar un diagrama nuevo: crear la función SVG (ej. `DiagramNuevo`) y añadir el caso `'nuevo'` en el switch de `renderSVG` dentro de la función `Diagrama`.

---

## 3. Cómo agregar un tipo de sección nuevo

Cuando una clase necesita un layout que no existe (timeline, grilla 3×3, split vertical, lo que sea):

1. Agregar el caso en `SectionRenderer` en `app/clases/[id]/page.tsx`.
2. Escribir la función React con los slots que vayas a usar. Usar los existentes como referencia (`Station`, `StatHero`, etc.).
3. CSS en el template literal al final del mismo archivo: una sección para screen (responsive clamp, aprovechar el viewport) y un override dentro de `@media print` para que la sección quepa en A4 apaisada (297×210mm) con tamaños en `mm`.
4. Añadir el ejemplo aquí en `TEMPLATE.md`.
5. Usarlo en el MD de la clase.

No hackear un tipo existente para que haga otra cosa.

---

## 4. Tipografía y colores

- **Display (Fraunces):** portadas, títulos grandes, números protagonistas, manifesto.
- **Body (Inter):** UI, cards, navegación, texto corrido, pregunta/respuesta.
- **Mono (JetBrains Mono):** fórmulas, datos técnicos.

- Rojo UA: `#C8102E`
- Negro: `#0D0D0D`
- Arena: `#F5F3EF`

Las variables están definidas en `:root` dentro de `app/clases/[id]/page.tsx`.

---

## 5. Validación antes de publicar

- **Screen:** abrir `/clases/NN` y hacer scroll. Cada sección debe verse completa en viewport sin que el contenido quede apretado ni con aire muerto.
- **Print:** `Cmd+P` en el navegador → vista previa. Cada sección = una A4 apaisada. Si algo se desborda o deja espacio grande, ajustar tamaños dentro de `@media print`.
- **Contenido:** debe salir **exclusivamente de la guía de la clase en Notion**. No inventar ejemplos ni inflar el material.
