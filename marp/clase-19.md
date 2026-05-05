---
marp: true
theme: ua
paginate: false
size: 16:9
title: Clase 19 — PIB nominal, PIB real y bienestar
---

<!-- _class: hero -->

#### CLASE 19 · UNIDAD III · MACROECONOMÍA

# PIB nominal, PIB real y bienestar.

## Cómo distinguir crecimiento de inflación con la misma cifra.

<p class="meta">DERE-A0004 · Introducción a la Economía · Universidad Autónoma de Chile · Miércoles 6 de mayo 2026</p>

---

<!-- _class: roadmap -->

#### ESTRUCTURA DE LA CLASE

# Cinco bloques: del problema al dato chileno.

<div class="grid">
<div>
<p class="num">01</p>
<h3>Repaso Clase 18</h3>
<p>Componentes del PIB. Casos propios.</p>
</div>
<div>
<p class="num">02</p>
<h3>El problema</h3>
<p>Si el PIB sube 10%, ¿produjimos más o subieron los precios?</p>
</div>
<div>
<p class="num">03</p>
<h3>Nominal vs. Real</h3>
<p>Definición + ejemplo numérico de dos bienes a la Samuelson.</p>
</div>
<div>
<p class="num">04</p>
<h3>Deflactor + per cápita</h3>
<p>Índice de precios implícito. Datos chilenos vigentes.</p>
</div>
<div>
<p class="num">05</p>
<h3>Casos + cierre</h3>
<p>Argentina con inflación. Chile 1990–2026. Anticipo Clase 20.</p>
</div>
</div>

---

#### BLOQUE 1 · REPASO CLASE 18

# Los cuatro componentes del PIB.

Ayer (Clase 18) cerramos la **definición** del PIB con la cita de Samuelson y los **cuatro componentes** que la estructuran: **valor de mercado**, **bienes y servicios finales**, **producidos dentro del país**, **durante un período**.

Hoy avanzamos un paso: ya sabemos qué entra al PIB. Ahora aprendemos a **interpretar la cifra cuando la comparamos en el tiempo**.

> **Pregunta abierta.** Tres voluntarios: el caso propio que trajeron, ¿entra o no al PIB chileno 2026? Una frase de justificación.

---

#### BLOQUE 2 · EL PROBLEMA

# Si el PIB sube 10%, ¿produjimos más?

Imaginen que el PIB de Chile en 2025 fue **100** y en 2026 fue **110**. La intuición dice: la economía creció **10%**.

Pero — ¿y si entre 2025 y 2026 todos los **precios** subieron 10%, y las **cantidades** producidas no se movieron? La cifra subiría a 110 igual. Y no habría habido crecimiento — solo inflación.

> **El PIB es precio × cantidad.** Cuando la cifra sube, no sabemos si sube porque se produjo más, porque los precios subieron, o por una mezcla. Y son cosas distintas: producir más es **crecimiento**; precios más altos es **inflación**.

Para separarlas, se inventan **dos versiones** de la misma cifra: **PIB nominal** y **PIB real**.

---

<!-- _class: grid-2 -->

#### BLOQUE 3 · DEFINICIONES

# Dos versiones de la misma cifra.

<div class="grid">
<div>
<p class="num">01</p>
<h3>PIB nominal</h3>
<p>Calculado a <strong>precios corrientes</strong> del propio año. Mezcla los dos efectos — más cantidad y más precio. Es lo que aparece en pesos del año.</p>
</div>
<div class="dark">
<p class="num">02</p>
<h3>PIB real</h3>
<p>Calculado a <strong>precios constantes</strong> de un año base. Aísla las cantidades de las variaciones de precio. Es la medida correcta para evaluar <strong>crecimiento</strong>.</p>
</div>
</div>

<p class="footer-note"><strong>Año base.</strong> Año fijo cuyos precios se usan para calcular el PIB real. Chile usa <strong>2018</strong> como referencia en las cuentas nacionales del Banco Central.</p>

---

#### BLOQUE 3 · EJEMPLO NUMÉRICO

# Una economía con dos bienes: pan y vino.

| Bien | Precio 2025 | Cant. 2025 | P×Q 2025 | Precio 2026 | Cant. 2026 | P×Q 2026 |
|---|---|---|---|---|---|---|
| Pan | \$1 | 100 | \$100 | \$2 | 110 | \$220 |
| Vino | \$5 | 50 | \$250 | \$7 | 60 | \$420 |
| **Total nominal** | | | **\$350** | | | **\$640** |

**PIB nominal** subió de **\$350 a \$640** → variación nominal de **+82,9%**.

> **¿Chile creció 83% en un año?** Obviamente no. La cifra mezcla dos efectos. Hay que separar precio y cantidad.

---

#### BLOQUE 3 · CÁLCULO DEL PIB REAL

# Mismas cantidades, precios del año base.

**PIB real 2026** = cantidades de 2026 valoradas a precios de 2025 (año base).

| Bien | Precio 2025 (base) | Cantidad 2026 | Aporte al PIB real |
|---|---|---|---|
| Pan | \$1 | 110 | \$110 |
| Vino | \$5 | 60 | \$300 |
| **PIB real 2026** | | | **\$410** |

**Crecimiento real** = (410 − 350) / 350 = **+17,1%**.

> En el año base, **PIB nominal = PIB real** (estamos usando los mismos precios). Por eso siempre hace falta un año base de referencia.

---

<!-- _class: stat -->

<div class="num-side">
<p class="label">Ejemplo de dos bienes · 2025 → 2026</p>
<p class="value">17,1%</p>
</div>

<div class="text-side">

## El crecimiento real, no 82,9%.

La economía sí creció — pero **17,1%**, no **82,9%**. La diferencia (~66 puntos) es lo que se atribuye al alza de precios.

**Crecimiento nominal:** +82,9% — mezcla precios y cantidades.
**Crecimiento real:** +17,1% — solo cantidades.
**Diferencia:** inflación capturada por el deflactor.

> Mirar solo el PIB nominal hace creer que la economía explotó. La fotografía correcta de "produjimos más" es siempre el PIB **real**.

</div>

---

#### BLOQUE 4 · DEFLACTOR DEL PIB

# El índice de precios implícito en el PIB.

$$
\text{Deflactor} = \frac{\text{PIB nominal}}{\text{PIB real}} \times 100
$$

| Año | PIB nominal | PIB real | Deflactor |
|---|---|---|---|
| 2025 (base) | \$350 | \$350 | **100,0** |
| 2026 | \$640 | \$410 | **156,1** |

**Inflación acumulada 2025 → 2026:** **56,1%**. Coherente con que el pan duplicó precio y el vino subió 40%.

> El deflactor en el año base es siempre **100**. En cualquier otro año mide cuánto subieron los precios en promedio respecto del año base.

---

#### BLOQUE 4 · ACLARACIÓN IMPORTANTE

# Deflactor del PIB ≠ IPC.

El **deflactor del PIB** se calcula desde el PIB. Cubre **todo** lo que el PIB cubre: consumo, inversión, gasto público, exportaciones netas.

El **IPC** (Índice de Precios al Consumidor) cubre solo una **canasta de consumo de hogares**. Es el índice que el INE publica mensualmente y que el Banco Central usa como referencia para su meta de inflación.

> **Cuándo aparecen.** El deflactor sale **trimestralmente** con las cuentas nacionales del Banco Central. El IPC sale **mensualmente** con el INE. Los dos miden alza general de precios — desde ángulos distintos.

**El IPC tiene su propia clase: Clase 23.** Hoy nos quedamos en el deflactor.

---

<!-- _class: stat -->

<div class="num-side">
<p class="label">PIB per cápita · Chile 2025</p>
<p class="value">US$17.000</p>
</div>

<div class="text-side">

## Una división simple — pero importante.

**PIB per cápita** = PIB real ÷ población.

**Chile 2025:** US\$340 mil millones / ~20 millones ≈ **US\$17.000 por persona al año**.

Si el PIB crece **2,5%** y la población crece **1,0%**, el PIB per cápita crece solo **~1,5%**.

> Crecer en PIB total puede deberse a que cada persona produce más **o** a que hay más personas. El per cápita aísla el primer efecto.

</div>

---

<!-- _class: grid-2 -->

#### BLOQUE 6 · CASOS APLICADOS

# Por qué importa separar nominal de real.

<div class="grid">
<div>
<p class="num">01</p>
<h3>Argentina con inflación alta</h3>
<p>2023: inflación &gt; <strong>200%</strong> interanual. PIB nominal explota — la cifra en pesos sube enormemente. Pero el PIB real <strong>cayó</strong> ~1,6%. La economía se contrajo.</p>
<p><em>Mirar solo el PIB nominal en pesos haría creer que la economía se duplicó. La realidad era recesión.</em></p>
</div>
<div class="dark">
<p class="num">02</p>
<h3>Chile 1990 → 2026</h3>
<p>PIB per cápita real: de ~<strong>US$5.000</strong> en 1990 a ~<strong>US$17.000</strong> en 2026. Multiplicador <strong>~3,4×</strong> en 36 años.</p>
<p><em>Crecimiento real ~3,5% promedio anual, descontando inflación y crecimiento poblacional. Es producción, no precios.</em></p>
</div>
</div>

<p class="footer-note">El PIB per cápita real es la mejor primera aproximación a "qué tan rico es un país" — pero no captura desigualdad ni sostenibilidad. Eso lo veremos con Sen en Clase 22.</p>

---

<!-- _class: quote -->

#### CITA DEL DÍA

<p class="citation">"El PIB nominal se calcula a los precios actuales. El PIB real se calcula a los precios constantes de un año base. Solo el PIB real mide variaciones genuinas de la producción."</p>

<p class="source">Samuelson & Nordhaus · Economía, 18ª ed. · Cap. 21, p. 415</p>

---

<!-- _class: manifesto -->

#### BLOQUE 7 · SÍNTESIS

# Tres herramientas — y una división.

1. PIB nominal: a precios del año. Mezcla precio y cantidad.
2. PIB real: a precios de un año base. Aísla cantidades.
3. Deflactor: PIB nominal sobre PIB real, por 100. Mide cuánto subieron los precios desde el año base.
4. PIB per cápita: PIB real dividido por población. Aísla cuánto produce cada persona en promedio.

<p class="footer-note">Cuando se reporta "el PIB creció", se refiere — siempre — al <strong>PIB real</strong>. Si la cifra es nominal, hay que descontar inflación para saber si hubo crecimiento de verdad.</p>

---

<!-- _class: close -->

#### PRÓXIMA CLASE · JUEVES 7 DE MAYO

# Demanda y oferta agregadas.

Mañana entramos al modelo más usado de la macroeconomía: **DA y OA**. Las dos curvas que, juntas, determinan **el PIB real (Y) y el nivel general de precios (P)**. Y qué pasa cuando llega un **shock**.

**Tarea.** Samuelson cap. 21 pp. 415–422 + anotar de [bcentral.cl](https://www.bcentral.cl) el PIB nominal y el PIB a precios constantes del último trimestre.

<p class="meta">DERE-A0004 · Introducción a la Economía · Universidad Autónoma de Chile</p>
