# Día 6 · Módulo VII — Hidráulica industrial
Curso de Certificación INTEGR · Material fuente para generación de video y diapositivas

## Estación 1 — Presión, caudal y fuerza

La hidráulica multiplica y transmite fuerza usando un fluido confinado. Antes de hablar de componentes o fallas, hay que dominar tres cantidades y cómo se relacionan.

- **Presión (P)** = Fuerza ÷ Área. Se mide en bar, psi o kg/cm². 1 bar ≈ 14.5 psi.
- **Caudal (Q)** = Volumen ÷ Tiempo. Se mide en L/min o GPM. El caudal determina la VELOCIDAD del actuador, no la fuerza.
- **Principio de Pascal**: la presión se transmite por igual en todo el fluido confinado. Es la base para multiplicar fuerza (gatos, prensas hidráulicas).
- **Potencia hidráulica** ≈ (bar × L/min) ÷ 600, resultado aproximado en kW.

**Idea clave:** la bomba no genera presión, genera caudal. La presión aparece como reacción a la resistencia de la carga. Un sistema sin carga (por ejemplo con la válvula abierta) puede tener caudal circulando casi sin presión.

## Estación 2 — Componentes de un sistema hidráulico

Cada componente cumple una función específica. Reconocerlos permite ubicar dónde investigar cuando algo falla.

- **Depósito / tanque**: almacena, enfría y separa aire del fluido.
- **Filtro**: retiene partículas antes de que dañen bomba y válvulas.
- **Bomba** (engranes, paletas o pistones): convierte energía mecánica en caudal hidráulico.
- **Válvula de alivio (relief)**: limita la presión máxima del sistema; protege bomba, mangueras y actuadores.
- **Válvula direccional**: controla hacia dónde va el flujo (avance, retroceso o neutro).
- **Válvula reguladora de caudal**: controla la velocidad del actuador.
- **Cilindro**: convierte presión en fuerza y movimiento lineal.
- **Motor hidráulico**: convierte presión en movimiento rotativo continuo.
- **Acumulador**: almacena energía hidráulica; amortigua picos de presión.

**Ruta del fluido:** depósito → filtro → bomba → válvula de alivio (en paralelo, como protección) → válvula direccional → actuador → línea de retorno → filtro de retorno → depósito.

## Estación 3 — Cómo leer un circuito hidráulico básico

No hace falta memorizar todos los símbolos ISO para orientarse en un diagrama: basta con reconocer las líneas principales y los símbolos más comunes.

- **Línea de presión**: línea continua gruesa, lleva el fluido a presión de trabajo.
- **Línea de retorno**: línea continua, regresa el fluido al depósito, normalmente a baja presión.
- **Línea de dren / piloto**: línea discontinua fina, fugas internas controladas o señal piloto, sin restricción.
- **Válvula direccional 4/3**: 4 vías, 3 posiciones, se dibuja como tres cuadros (avance / neutro / retroceso).
- **Bomba de desplazamiento fijo**: círculo con triángulo relleno apuntando hacia afuera.
- **Cilindro de doble efecto**: rectángulo con vástago en un extremo, dos puertos, uno por cada cámara.

**Cómo se lee:** sigue la línea de presión desde la bomba hasta el actuador, y la de retorno de regreso al depósito. Un circuito "en reposo" (energizado, sin movimiento) casi siempre tiene la válvula direccional en posición neutra.

## Estación 4 — Fallas comunes y diagnóstico

Igual que en electricidad o mecánica, un síntoma hidráulico rara vez tiene una sola causa posible. La evidencia debe correlacionarse antes de intervenir.

| Síntoma | Causas probables a descartar |
|---|---|
| Movimiento lento o con poca fuerza | Fuga interna, bomba desgastada o caudal insuficiente |
| Ruido agudo tipo "canicas" (cavitación) | Filtro de succión tapado, nivel bajo o línea de succión restringida |
| Sistema se sobrecalienta | Alivio derivando de forma continua, enfriador sucio o fluido incorrecto |
| Fluido lechoso o espumoso | Contaminación con agua o entrada de aire por la succión |
| Movimiento errático o "a saltos" | Aire atrapado en el circuito o desgaste interno variable |

**Método de diagnóstico:** antes de desarmar un componente, revisa nivel y estado del fluido, condición del filtro, temperatura de operación y ajuste de la válvula de alivio. EVIDENCIA ≠ DIAGNÓSTICO — el mismo síntoma puede tener varias causas.

## Estación 5 — Seguridad en sistemas hidráulicos

La energía hidráulica es energía almacenada y a alta presión. Los riesgos no siempre son visibles a simple vista.

- **Presión de trabajo típica**: 100–350 bar (1,450–5,000 psi), suficiente para penetrar la piel sin dejar herida visible.
- **Inyección de fluido bajo la piel**: es una emergencia médica inmediata. Nunca se busca una fuga fina con la mano — se usa cartón o papel.
- **Antes de abrir una línea**: bloqueo y etiquetado (LOTO) + despresurizar el circuito. Verificar el manómetro en cero antes de aflojar conexiones.
- **Energía almacenada**: los acumuladores retienen presión aunque la bomba esté apagada; deben descargarse antes de dar servicio.

**Regla de oro:** si una fuga fina de aceite a alta presión toca la piel, es una urgencia médica aunque no se vea sangre ni herida grande — el fluido puede inyectarse bajo la piel y dañar tejido profundo. Se debe acudir a atención médica de inmediato e informar que fue una inyección de fluido hidráulico a presión.

## Casos de práctica (para referencia de tono y ejemplos)

1. **El cilindro que perdió fuerza** — un cilindro de prensa avanza pero no completa el ciclo ni logra la fuerza necesaria; se debe medir presión real antes de cambiar componentes.
2. **Ruido de "canicas" en la bomba** — cavitación causada por un filtro de succión de menor capacidad instalado por error.
3. **El sistema que se calienta cada tarde** — sobrecalentamiento por válvula de alivio derivando, enfriador sucio o viscosidad inadecuada del fluido.
4. **"Solo es una gotita, la reviso con la mano"** — riesgo de inyección de fluido bajo la piel al buscar una fuga fina con la mano en un sistema presurizado.
5. **Movimiento a saltos después del mantenimiento** — aire atrapado en el circuito tras cambiar una manguera; se purga antes de intervenir el cilindro.
