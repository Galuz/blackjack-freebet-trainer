# Blackjack Free Bet Trainer — Implementation Plan

## Principio de implementación

Evolucionar la PWA sin romper el entrenamiento actual. Primero completar estrategia básica (Hard + Soft + Splits), después mejorar simulación de casino y finalmente introducir conteo/EV. Cada fase debe poder validarse de forma aislada.

---

## Fase 0 — Baseline y regresión

Antes de tocar el motor de manos:

- documentar el comportamiento actual de Learning y Game;
- conservar Hard/Soft existentes;
- verificar dealer peek, insurance, blackjack, double, Free Double y dealer 22 push;
- verificar persistencia del zapato de 6 decks;
- asegurar que cambios posteriores no rompan PWA/offline;
- establecer fixtures/casos deterministas para estrategia.

**Salida:** baseline estable sobre el cual introducir múltiples manos.

---

## Fase 1 — Refuerzo selectivo Learning

Implementar primero el selector porque puede funcionar sobre el motor de entrenamiento sin depender del settlement completo de splits.

### UX

Selector gaming exclusivo:

- Mixto
- Hard
- Soft
- Splits

Semánticamente serán radio buttons; visualmente serán segmented cards/chips grandes con estado activo inequívoco. En móvil pueden usar grid 2x2 o una distribución adaptable que no genere scroll horizontal.

### Generador

Separar generación de escenarios de la lógica que evalúa estrategia:

- `mixed`
- `hard`
- `soft`
- `pairs`

El generador de Splits debe poder presentar una pareja y evaluar **Split / No Split** incluso antes de que el Game Mode tenga el flujo completo de múltiples manos.

### Métricas

Guardar precisión y tiempo por categoría para poder responder “qué me falta reforzar”.

**Criterio de salida:** el usuario puede hacer sesiones exclusivas de Hard, Soft o Splits y regresar a Mixto sin alterar Game Mode.

---

## Fase 2 — Pair Strategy completa

Agregar la tabla de Pair Splitting con DAS activo al evaluador y a Guía rápida.

Validar exhaustivamente todos los pares contra 2–A.

Casos especialmente importantes:

- 9,9 vs 7 = No Split;
- 9,9 vs 8/9 = Split;
- 8,8 = Split siempre;
- 5,5 = No Split siempre;
- 4,4 vs 5/6 = Split por DAS;
- 2,2 / 3,3 vs 2/3 = Split por DAS;
- 10,10 = No Split.

**Criterio de salida:** 100% de la matriz de Pair Strategy coincide con la tabla de referencia.

---

## Fase 3 — Refactor del motor a múltiples manos

Cambiar el estado de `player` a una colección `playerHands[]`.

Cada mano debe poseer su propio:

- cards;
- wager;
- paid/free stake metadata;
- status;
- doubled;
- split origin/depth;
- active index;
- free markers;
- action eligibility.

Separar claramente:

1. reparto inicial;
2. insurance/peek;
3. turno de cada player hand;
4. transición entre manos;
5. dealer turn único;
6. settlement individual;
7. settlement total de ronda.

Mantener una capa de compatibilidad para Learning mientras se migra el estado.

**Criterio de salida:** el motor puede representar 2+ manos simultáneas sin errores de bankroll o settlement.

---

## Fase 4 — Split / Free Split / Resplit

Agregar acción Split al Game Mode.

### Split normalizado

- separar las dos cartas;
- crear dos manos;
- repartir una carta a cada una según flujo de mesa;
- activar y jugar cada mano secuencialmente;
- dealer juega después de todas.

### Free Split

- pares elegibles distintos de pares de valor 10 reciben marker Free Bet;
- no descontar del bankroll la porción cubierta por Free Bet;
- registrar el marker para futura side bet;
- permitir nuevas oportunidades después de split.

### Resplit

- permitir resplit;
- diseñar límite como configuración interna;
- hasta confirmar el máximo exacto de Winpot, no hardcodear una afirmación de house rule en UI.

### Split Aces

Implementar mediante rule flags. Antes de cerrar comportamiento definitivo confirmar:

- hit después de split de ases;
- resplit de ases;
- máximo de manos.

**Criterio de salida:** una ronda puede producir varias manos, Free Splits y resplits y resolverse correctamente contra un único dealer.

---

## Fase 5 — DAS y Free Double post-split

DAS está confirmado.

Para cada mano post-split:

- evaluar si Double está permitido;
- si es Hard 9/10/11 de dos cartas y cumple reglas Free Bet → Free Double;
- si es Soft y estrategia indica Double → Double pagado, nunca Free Double por ser Soft;
- si es otro Double permitido → aplicar stake pagado según reglas;
- recibir exactamente una carta y cerrar esa mano.

Probar combinaciones como:

`8,8 → Free Split → 8+3 = Hard 11 → Free Double`.

**Criterio de salida:** bankroll y markers son correctos incluso con Free Split + Free Double en la misma ronda.

---

## Fase 6 — Settlement, visualización y polish gaming

### Settlement

Resolver cada mano independientemente:

- win;
- loss;
- push;
- bust;
- dealer 22 push;
- double;
- free stake;
- split 21 = 21 normal, no blackjack 3:2.

Mostrar resumen de ronda sin confundir resultado de una mano con resultado total.

### UI

- manos separadas visualmente;
- mano activa destacada;
- ficha FREE BET visible junto a stake cubierto;
- transición suave entre manos;
- sonido específico de split/chips;
- mantener shoe/discard visibles;
- adaptar layout a 2, 3, 4+ manos sin desbordar iPhone.

**Criterio de salida:** la ronda es entendible visualmente sin necesitar texto explicativo.

---

## Fase 7 — Reglas de casino pendientes

En próxima visita confirmar:

1. máximo de resplits/manos;
2. reglas exactas de split aces;
3. resplit de ases;
4. cut card / penetración aproximada;
5. cualquier límite especial de Free Split/Free Double.

Actualizar rule config y tests, no lógica dispersa.

---

## Fase 8 — Apuestas configurables y sesiones

Después de completar estrategia básica:

- selector de apuesta base;
- bankroll configurable;
- total wagered/action;
- duración/número de manos;
- estadísticas por sesión;
- comparación flat betting en simulaciones.

No presentar sistemas de progresión de apuesta como generadores de ventaja.

---

## Fase 9 — Side bet basada en Free Bet markers

Con el conteo de markers ya presente:

- modelar el slot/Pot of Gold cuando se confirme paytable exacta;
- registrar markers generados por Free Double y Free Split;
- liquidar side bet independientemente de las manos principales;
- no modificar estrategia principal por la existencia de side bet salvo que posteriormente se haga un análisis matemático específico.

---

## Fase 10 — Conteo de cartas

Solo después de dominar estrategia básica completa.

### 10A. Running Count

- entrenamiento Hi-Lo;
- cartas una a una y secuencias;
- precisión y velocidad.

### 10B. True Count

- estimación de decks restantes;
- conversión running → true;
- ejercicios con shoe visual.

### 10C. Free Bet específico

- investigar/validar índices y desviaciones aplicables a las reglas objetivo;
- no reutilizar ciegamente índices de blackjack tradicional.

### 10D. Bet spread educativo

- apuesta mínima cuando EV estimado no favorece al jugador;
- escalado solo cuando exista fundamento matemático;
- mostrar varianza y riesgo de ruina.

---

## Fase 11 — Simulador matemático / EV

Crear un motor de simulación desacoplado de las animaciones UI para ejecutar gran volumen de rondas.

Comparar:

- estrategia perfecta + flat bet;
- estrategia del usuario;
- errores del usuario sobre las mismas cartas;
- conteo + desviaciones validadas;
- distintos spreads;
- distintas penetraciones;
- distribución de sesiones equivalentes a ~3 horas.

Métricas:

- EV por 100 unidades/manos;
- desviación/varianza;
- distribución de resultados;
- riesgo de ruina;
- bankroll requerido para escenarios hipotéticos;
- costo de errores.

El simulador debe distinguir claramente expectativa matemática de resultado observado.

---

## Orden recomendado inmediato

**Ahora:** Fase 1 → Fase 2 → Fase 3 → Fase 4 → Fase 5 → Fase 6.

Eso completa el aprendizaje de **Hard + Soft + Splits** y convierte el Game Mode en una simulación Free Bet mucho más fiel. Conteo, apuestas variables y EV quedan deliberadamente después para no mezclar habilidades antes de dominar estrategia básica.