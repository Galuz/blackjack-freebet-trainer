# Blackjack Free Bet Trainer — Product Spec

## 1. Objetivo
PWA mobile-first para aprender estrategia básica de Blackjack y practicar una mesa de Free Bet Blackjack de forma progresivamente cercana a la experiencia real de casino.

El producto debe separar claramente dos objetivos:

1. **Learning / Entrenamiento:** aprender y automatizar decisiones correctas.
2. **Game / Mesa:** practicar sesiones completas con zapato, bankroll, apuestas y reglas Free Bet sin feedback de estrategia durante la mano.

La aplicación no debe presentar una sesión ganadora o perdedora como prueba de ventaja matemática. Las métricas de EV, conteo y riesgo se incorporarán posteriormente como herramientas educativas.

---

## 2. Reglas base de la mesa objetivo

Configuración conocida/confirmada para la mesa que se quiere reproducir:

- 6 mazos (312 cartas).
- Dealer se planta en todos los 17 (S17), salvo que posteriormente se confirme otra regla para la mesa real.
- Blackjack natural paga 3:2.
- Dealer 22 hace push contra manos activas que no sean blackjack natural.
- Insurance cuando el dealer muestra As; apuesta máxima equivalente a la mitad de la apuesta principal y pago 2:1.
- Dealer realiza peek con As o carta de valor 10 según el flujo correspondiente.
- Double normal permitido con dos cartas según reglas de mesa.
- DAS (**Double After Split**) confirmado.
- Resplit confirmado.
- Free Double solamente en manos **Hard de dos cartas con total 9, 10 u 11**.
- Las manos Soft no reciben Free Double. Si la estrategia indica Double en una mano Soft, es un Double pagado por el jugador.
- Free Split para pares elegibles excepto pares de cartas de valor 10, de acuerdo con la regla observada/esperada de Free Bet.
- Después de un split, las nuevas manos pueden volver a generar oportunidades de Free Double o Free Split cuando cumplan sus condiciones.
- Un 21 obtenido después de split debe tratarse como 21 de una mano dividida, no como blackjack natural 3:2.

### Reglas pendientes de confirmar en casino

- Número máximo exacto de manos/resplits permitido.
- Restricciones exactas al dividir ases: número de cartas, posibilidad de hit y resplit de ases.
- Definición exacta de pares aceptados por la mesa si existiera alguna particularidad de house rules.
- Penetración/cut card real del zapato.

Estas reglas deben quedar modeladas de forma configurable internamente para evitar rehacer el motor cuando se confirmen.

---

## 3. Estrategia básica de referencia

### Hard totals

| Mano | Acción |
|---|---|
| 17+ | Stand siempre |
| 13–16 | Stand vs 2–6; Hit vs 7–A |
| 12 | Stand vs 4–6; Hit vs 2, 3, 7–A |
| 11 | Double |
| 10 | Double vs 2–9; Hit vs 10/A |
| 9 | Double vs 3–6; Hit resto |
| 8 o menos | Hit |

### Soft totals

- A2/A3: Double vs 5–6; Hit resto.
- A4/A5: Double vs 4–6; Hit resto.
- A6: Double vs 3–6; Hit resto.
- A7: Double vs 2–6; Stand vs 7–8; Hit vs 9–A. Si Double no está disponible en 2–6, Stand.
- A8: Double vs 6; Stand resto. Si Double no está disponible vs 6, Stand.
- A9: Stand siempre.

Regla mental de aprendizaje: **A2–A6 = o Double o Hit; nunca Stand.**

### Pair Splitting — DAS activo

Dealer: 2,3,4,5,6,7,8,9,10,A.

- A,A: Split siempre.
- 10,10: nunca Split.
- 9,9: Split vs 2–6 y 8–9; no Split vs 7,10,A.
- 8,8: Split siempre.
- 7,7: Split vs 2–7; no Split vs 8–A.
- 6,6: Split vs 2–6; no Split vs 7–A.
- 5,5: nunca Split.
- 4,4: Split vs 5–6; no Split resto.
- 3,3: Split vs 2–7; no Split vs 8–A.
- 2,2: Split vs 2–7; no Split vs 8–A.

Las antiguas celdas Y/N se interpretan como Split porque DAS está confirmado.

---

## 4. Learning Mode

### 4.1 Entrenamiento general

El modo Learning mantiene el entrenamiento actual de decisiones H/S/D y se ampliará con Split.

Debe registrar como mínimo:

- decisiones totales;
- decisiones correctas;
- precisión;
- tiempo de decisión;
- promedio de tiempo;
- tipo de decisión/tema;
- errores cometidos.

El cronómetro comienza únicamente cuando termina el reparto inicial y la decisión está disponible.

### 4.2 Refuerzo selectivo

Agregar un selector de entrenamiento con estética gaming para elegir qué familia de manos reforzar.

Opciones exclusivas mediante **radio buttons visuales / segmented cards**:

- **Hard** — generar únicamente situaciones cuyo objetivo sea reforzar Hard totals.
- **Soft** — generar únicamente situaciones cuyo objetivo sea reforzar Soft totals.
- **Splits** — generar únicamente manos iniciales con pares y decisiones de Split/No Split.
- **Mixto** — entrenamiento normal con todas las familias. Debe existir para volver fácilmente al comportamiento general.

Solo una opción puede estar activa a la vez. El control debe sentirse como un selector de modo de videojuego, no como un formulario web tradicional: tarjetas compactas, estado seleccionado muy claro, iconografía discreta y touch targets adecuados para iPhone.

El selector pertenece al modo Learning y no debe modificar la distribución real de cartas del Game Mode.

### 4.3 Reglas del generador de refuerzo

- Hard: asegurar variedad de dealer upcards y especialmente fronteras 9/10/11/12/16/17.
- Soft: cubrir A2–A9 y situaciones donde Double tiene fallback diferente.
- Splits: cubrir todos los pares y todos los upcards relevantes; incluir tanto decisiones Split como No Split.
- Mixto: reparto no sesgado artificialmente salvo lo necesario para entrenamiento razonable.
- Evitar patrones demasiado predecibles o repeticiones inmediatas excesivas.
- Registrar precisión por categoría para identificar debilidades.

### 4.4 Guía rápida

La guía debe incluir Hard, Soft y Pair Splitting, con DAS reflejado. Durante una decisión, abrir la guía no debe alterar las cartas. Se evaluará posteriormente si el cronómetro debe pausarse o si consultar la guía debe marcar la mano como asistida.

---

## 5. Split — experiencia y motor

### 5.1 UI

Cuando la mano sea spliteable debe aparecer una acción **SPLIT** claramente diferenciada. Stand ya utiliza S, por lo que para atajos futuros se recomienda **P** para Split.

Al dividir:

- mostrar las manos resultantes simultáneamente;
- destacar visualmente la mano activa;
- indicar Mano 1, Mano 2, etc. sin sobrecargar la mesa;
- mover el foco automáticamente a la siguiente mano cuando termina la actual;
- mostrar fichas/markers **FREE BET** donde corresponda;
- mantener visibles dealer, shoe y discard tray.

### 5.2 Estado

El jugador deja de ser una sola lista de cartas. El motor debe soportar una colección de manos con, como mínimo:

- cards;
- status: active / stand / bust / doubled / resolved;
- wager;
- origen de la apuesta: paid/free cuando aplique;
- isSplitHand;
- splitDepth/origen;
- freeBetMarkers generados;
- eligibility para hit/double/split/resplit.

El dealer juega una sola vez después de terminar todas las manos activas del jugador.

### 5.3 Free Split / Free Double después de Split

- Un Free Split elegible no debe descontar del bankroll la apuesta equivalente cubierta por el marker Free Bet.
- Un split pagado, si alguna regla futura lo requiere, sí debe afectar bankroll.
- DAS está habilitado.
- Una mano post-split Hard 9/10/11 de dos cartas puede obtener Free Double si cumple las reglas.
- Una nueva pareja post-split puede volver a Free Split si es elegible y el límite de resplit no se ha alcanzado.
- El sistema debe contar todos los markers Free Bet generados durante la ronda.

---

## 6. Game Mode

### Estado actual/esperado

- bankroll inicial: $1,000 MXN;
- apuesta base actual: $50 MXN;
- zapato de 6 mazos persistente entre manos;
- shoe visual transparente con cartas decreciendo;
- discard tray creciendo con cartas usadas;
- animación inicial: stack de 6 mazos → división en dos mitades → riffle/interleaving visible → recombinación → inserción al shoe;
- sonidos de deal, hit, stand, double, flip/peek, chips, win/loss/push y shuffle;
- sin feedback de estrategia durante la mano;
- dealer reveal y draws secuenciales.

### Próxima evolución de apuestas

El stake fijo de $50 debe convertirse posteriormente en apuesta seleccionable. La finalidad educativa será comparar:

- flat betting;
- resultados con diferentes tamaños de apuesta;
- bankroll y riesgo de ruina;
- en una fase avanzada, bet spread basado en conteo.

No implementar progresiones tipo Martingala como si generaran ventaja matemática. Variar apuestas solo tiene sentido de ventaja cuando responde a un cambio real del EV estimado.

---

## 7. Side bets / Pot of Gold

No forman parte del MVP de Splits, pero el motor debe quedar preparado.

La mesa observada dispone de apuestas laterales, incluyendo una modalidad en la que el pago está relacionado con la cantidad de markers Free Bet obtenidos durante la ronda. Por eso **freeBetMarkers debe contabilizarse desde ahora**, incluso antes de implementar visualmente el side bet.

Las side bets nunca deben alterar la recomendación de estrategia básica principal.

---

## 8. Conteo de cartas — fase futura

Después de dominar Hard + Soft + Splits:

1. entrenamiento de Running Count (Hi-Lo u otro sistema validado);
2. True Count para zapato multi-deck;
3. precisión y velocidad del conteo;
4. desviaciones de estrategia basadas en conteo cuando estén documentadas para las reglas objetivo;
5. bet spread educativo basado en ventaja estimada;
6. simulaciones masivas para estimar EV, varianza y riesgo de ruina.

No asumir que índices de blackjack tradicional producen automáticamente ventaja en Free Bet. Antes de mostrar recomendaciones de advantage play, validar específicamente las reglas y matemática de Free Bet utilizada por la aplicación.

---

## 9. Métricas avanzadas futuras

Además de % de respuestas correctas:

- precisión Hard / Soft / Splits por separado;
- matriz de errores por mano y dealer upcard;
- tiempo medio por categoría;
- decisiones asistidas/no asistidas;
- costo estimado de errores en EV;
- bankroll real del usuario vs bankroll de estrategia perfecta usando exactamente las mismas cartas;
- total de acción apostada;
- resultado observado vs EV esperado;
- varianza;
- riesgo de ruina para escenarios simulados;
- running/true count accuracy cuando se habilite conteo.

El producto debe dejar claro que una sesión corta ganadora no demuestra EV positivo y una sesión perdedora no demuestra una estrategia incorrecta.

---

## 10. UX/UI

- Mobile-first, especialmente iPhone/PWA instalada.
- Tema visual de mesa/casino con sensación gaming, sin sacrificar legibilidad.
- Acciones principales grandes y accesibles con una mano.
- Animaciones rápidas y con propósito; no retrasar innecesariamente el entrenamiento.
- Learning debe sentirse como entrenamiento de habilidad; Game como mesa real.
- Los radio buttons de refuerzo deben verse como selección de modo gaming y conservar un único estado activo.
- La mano activa en splits debe ser inequívoca.
- Markers Free Bet deben distinguirse de fichas pagadas.
- Mantener funcionamiento offline mediante service worker.

---

## 11. Persistencia y compatibilidad

- Conservar estadísticas y preferencias razonables localmente.
- Los cambios de modelo de estado deben migrar o tolerar el estado anterior sin romper la PWA instalada.
- Cada release que cambie assets cacheados debe actualizar la versión del service worker.
- No requerir reinstalar la PWA para recibir actualizaciones.