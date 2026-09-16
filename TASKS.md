# Blackjack Free Bet Trainer — Tasks

Estados: `[ ] pendiente` · `[~] en progreso` · `[x] terminado`

## P0 — Documentación / reglas

- [x] Documentar Hard strategy actual.
- [x] Documentar Soft strategy actual.
- [x] Documentar Pair Splitting según tabla del usuario.
- [x] Registrar DAS = habilitado.
- [x] Registrar resplit = habilitado.
- [x] Registrar Free Double = solo Hard 9/10/11 de dos cartas.
- [x] Registrar que Soft Doubles son pagados, no Free Double.
- [x] Registrar Free Split para pares elegibles excepto valor 10 como regla objetivo actual.
- [ ] Confirmar máximo exacto de resplits/manos en Winpot.
- [ ] Confirmar comportamiento de split aces.
- [ ] Confirmar resplit de ases.
- [ ] Confirmar cut card / penetración aproximada.

## P0 — Refuerzo selectivo Learning

- [ ] Diseñar selector gaming con 4 opciones exclusivas: Mixto / Hard / Soft / Splits.
- [ ] Implementar semántica de radio buttons accesibles.
- [ ] Diseñar estado activo claro y touch targets mobile.
- [ ] Validar layout a 320 px y iPhone instalado como PWA.
- [ ] Añadir `trainingFocus = mixed | hard | soft | pairs` al estado.
- [ ] Crear generador de escenarios Hard.
- [ ] Crear generador de escenarios Soft.
- [ ] Crear generador de escenarios Pair/Split.
- [ ] Mantener generador Mixto.
- [ ] Evitar repeticiones excesivas/predecibles.
- [ ] Registrar precisión por categoría.
- [ ] Registrar tiempo promedio por categoría.
- [ ] Mantener el selector fuera de Game Mode.
- [ ] Persistir preferencia de refuerzo sin romper storage anterior.

## P0 — Pair Strategy

- [ ] Añadir acción estratégica `P/SPLIT` al evaluador.
- [ ] Añadir matriz de pares 2–A.
- [ ] Aplicar DAS a las antiguas celdas Y/N.
- [ ] Test A,A = Split siempre.
- [ ] Test 10,10 = nunca Split.
- [ ] Test 9,9: Split 2–6,8,9; no 7,10,A.
- [ ] Test 8,8 = Split siempre.
- [ ] Test 7,7 = Split 2–7.
- [ ] Test 6,6 = Split 2–6 con DAS.
- [ ] Test 5,5 = nunca Split.
- [ ] Test 4,4 = Split 5–6 con DAS.
- [ ] Test 3,3 = Split 2–7 con DAS.
- [ ] Test 2,2 = Split 2–7 con DAS.
- [ ] Añadir Pair Splitting a Guía rápida.
- [ ] Añadir feedback Split/No Split en Learning.

## P0 — Motor multi-hand

- [ ] Diseñar `playerHands[]`.
- [ ] Migrar mano única actual al nuevo modelo.
- [ ] Añadir `activeHandIndex`.
- [ ] Añadir status por mano.
- [ ] Añadir wager por mano.
- [ ] Añadir metadata paid/free por stake.
- [ ] Añadir `isSplitHand`.
- [ ] Añadir `splitDepth` / parent origin.
- [ ] Añadir freeBetMarkers por ronda/mano.
- [ ] Separar player phase de dealer phase.
- [ ] Hacer que dealer juegue una sola vez al terminar todas las manos.
- [ ] Mantener insurance/peek antes de decisiones de split.
- [ ] Proteger compatibilidad con Learning Mode.

## P0 — Split / Free Split / Resplit

- [ ] Añadir botón `SPLIT` al Game Mode.
- [ ] Reservar `P` como posible keyboard shortcut para Split.
- [ ] Mostrar Split solo cuando sea legal.
- [ ] Separar cartas correctamente en dos manos.
- [ ] Repartir cartas post-split en secuencia correcta.
- [ ] Navegar automáticamente entre manos activas.
- [ ] Implementar Free Split para pares elegibles no-10.
- [ ] No descontar bankroll por stake cubierto por Free Split.
- [ ] Crear/mostrar marker FREE BET.
- [ ] Contabilizar cada marker generado.
- [ ] Permitir resplit.
- [ ] Hacer límite de resplit configurable.
- [ ] Implementar rule flags para split aces pendientes de confirmar.
- [ ] Permitir nuevas oportunidades de Free Split post-split.

## P0 — DAS / Doubles post-split

- [ ] Permitir Double After Split.
- [ ] Free Double post-split solo para Hard 9/10/11 de dos cartas elegible.
- [ ] Soft Double post-split debe ser pagado.
- [ ] Double normal debe descontar stake correcto.
- [ ] Double entrega una sola carta y cierra esa mano.
- [ ] Test: 8,8 → Free Split → 8+3 → Free Double.
- [ ] Test combinaciones de Free Split + Free Double + resplit.

## P0 — Settlement multi-hand

- [ ] Resolver win/loss/push por mano.
- [ ] Resolver bust por mano sin terminar prematuramente otras manos.
- [ ] Aplicar dealer 22 push por mano elegible.
- [ ] Liquidar paid doubles correctamente.
- [ ] Liquidar Free Doubles correctamente.
- [ ] Liquidar Free Splits correctamente.
- [ ] Tratar 21 post-split como 21 normal, no BJ 3:2.
- [ ] Blackjack natural original conserva 3:2.
- [ ] Actualizar bankroll una sola vez por evento económico.
- [ ] Añadir resumen total de ronda.

## P1 — UX/UI de múltiples manos

- [ ] Diseñar layout responsive para 2 manos.
- [ ] Diseñar comportamiento para 3/4+ manos.
- [ ] Resaltar mano activa inequívocamente.
- [ ] Mostrar número/posición de mano sin ruido visual.
- [ ] Diferenciar fichas pagadas y markers FREE BET.
- [ ] Animar split.
- [ ] Añadir SFX de split/fichas.
- [ ] Mantener dealer, shoe y discard legibles.
- [ ] Verificar que no haya overflow horizontal en iPhone.
- [ ] Respetar reduced motion donde corresponda.

## P1 — Shoe / casino realism

- [ ] Revisar visual final de riffle shuffle de 6 decks.
- [ ] Validar que se perciban cartas individuales intercalándose.
- [ ] Validar animación de inserción al shoe.
- [ ] Hacer que shoe visual decrezca con cartas realmente extraídas.
- [ ] Hacer que discard tray refleje cartas usadas de forma coherente durante/entre rondas.
- [ ] Reemplazar umbral `<20 cards` por cut-card configurable cuando se confirme penetración.

## P1 — Métricas Learning

- [ ] Dashboard de precisión Hard / Soft / Splits.
- [ ] Matriz de errores por player hand + dealer upcard.
- [ ] Historial de errores recientes.
- [ ] Tiempo medio por familia.
- [ ] Decidir política de Guía durante cronómetro: pausar vs marcar decisión asistida.
- [ ] Mostrar progreso sin convertir una sesión corta en conclusión estadística sobre rentabilidad.

## P2 — Apuestas y bankroll

- [ ] Sustituir apuesta fija $50 por selector de apuesta.
- [ ] Mantener $50 como default inicial si sigue siendo conveniente.
- [ ] Permitir bankroll inicial configurable.
- [ ] Registrar total de acción apostada.
- [ ] Añadir métricas de sesión.
- [ ] Añadir simulación educativa de flat betting.
- [ ] No presentar Martingala/progresiones como ventaja matemática.

## P2 — Pot of Gold / side bets

- [ ] Mantener contador interno de Free Bet markers desde la implementación de Splits.
- [ ] Obtener paytable exacta del side bet de la mesa.
- [ ] Modelar apuesta y payout de Pot of Gold/slot Free Bet.
- [ ] Liquidar side bet independientemente del resultado principal.
- [ ] Evaluar Perfect Pairs/Any Pair solo si se decide ampliar alcance.
- [ ] Evaluar 21+3 solo si se decide ampliar alcance.

## P3 — Card Counting Trainer

- [ ] Diseñar modo Running Count.
- [ ] Implementar sistema Hi-Lo solo después de validar su uso objetivo.
- [ ] Entrenamiento carta por carta.
- [ ] Entrenamiento por secuencias.
- [ ] Mostrar precisión y velocidad.
- [ ] Diseñar estimación de decks restantes.
- [ ] Añadir True Count trainer.
- [ ] Investigar desviaciones específicas para Free Bet/reglas objetivo.
- [ ] No asumir índices de blackjack tradicional sin validación.

## P3 — EV / simulación

- [ ] Desacoplar motor matemático de animaciones/UI.
- [ ] Permitir simulación masiva de zapatos.
- [ ] Calcular EV de estrategia perfecta con reglas configuradas.
- [ ] Calcular varianza/distribución de resultados.
- [ ] Simular sesiones equivalentes a ~3 horas.
- [ ] Comparar flat betting con spreads fundamentados en conteo.
- [ ] Calcular riesgo de ruina para escenarios simulados.
- [ ] Comparar bankroll del usuario vs estrategia perfecta con las mismas cartas.
- [ ] Estimar costo EV de cada error del usuario.
- [ ] Mostrar claramente diferencia entre EV y resultado observado.

## P0 — Regresión antes de cada release

- [ ] Hard strategy sigue coincidiendo con tabla.
- [ ] Soft strategy sigue coincidiendo con tabla y fallbacks Ds.
- [ ] Pair strategy coincide con tabla DAS.
- [ ] Timer comienza después del reparto/peek cuando corresponde.
- [ ] Insurance funciona.
- [ ] Dealer blackjack peek funciona.
- [ ] Dealer 22 push funciona.
- [ ] Blackjack 3:2 funciona.
- [ ] Free Double no se concede a Soft hands.
- [ ] Bankroll no se descuenta dos veces.
- [ ] Shoe persiste entre manos.
- [ ] Learning no altera Game shoe.
- [ ] Audio toggle funciona.
- [ ] PWA abre offline con assets cacheados.
- [ ] Incrementar versión de cache del service worker en releases que cambien assets.