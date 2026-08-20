import fs from "node:fs/promises";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const NAVY = rgb(12 / 255, 42 / 255, 63 / 255);
const ORANGE = rgb(238 / 255, 108 / 255, 47 / 255);
const INK = rgb(23 / 255, 38 / 255, 49 / 255);
const MUTED = rgb(102 / 255, 118 / 255, 128 / 255);
const LINE = rgb(220 / 255, 227 / 255, 230 / 255);
const CREAM = rgb(245 / 255, 243 / 255, 238 / 255);

const PAGE_W = 612;
const PAGE_H = 792;
const MARGIN_X = 64;
const CONTENT_W = PAGE_W - MARGIN_X * 2;

function wrapText(text, font, size, maxWidth) {
  const words = text.split(/\s+/);
  const lines = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
}

class Doc {
  constructor(pdf, fonts) {
    this.pdf = pdf;
    this.fonts = fonts;
    this.page = null;
    this.y = 0;
    this.pageNumber = 0;
  }

  newPage(kicker, title) {
    this.page = this.pdf.addPage([PAGE_W, PAGE_H]);
    this.pageNumber += 1;
    this.page.drawRectangle({ x: 0, y: PAGE_H - 10, width: PAGE_W, height: 10, color: ORANGE });
    if (kicker) {
      this.page.drawText(kicker.toUpperCase(), { x: MARGIN_X, y: PAGE_H - 56, size: 9, font: this.fonts.bold, color: ORANGE, characterSpacing: 1.2 });
    }
    if (title) {
      this.page.drawText(title, { x: MARGIN_X, y: PAGE_H - 84, size: 22, font: this.fonts.bold, color: NAVY });
      this.page.drawLine({ start: { x: MARGIN_X, y: PAGE_H - 98 }, end: { x: PAGE_W - MARGIN_X, y: PAGE_H - 98 }, thickness: 1, color: LINE });
    }
    this.y = title ? PAGE_H - 124 : PAGE_H - 70;
    this.page.drawText("MÓDULO VII · HIDRÁULICA INDUSTRIAL · DÍA 6", { x: MARGIN_X, y: 34, size: 7.5, font: this.fonts.regular, color: MUTED, characterSpacing: 0.6 });
    this.page.drawText(String(this.pageNumber).padStart(2, "0"), { x: PAGE_W - MARGIN_X - 14, y: 34, size: 8, font: this.fonts.bold, color: NAVY });
    return this;
  }

  ensureSpace(needed) {
    if (this.y - needed < 56) this.newPage();
  }

  h2(text) {
    this.ensureSpace(30);
    this.y -= 4;
    this.page.drawText(text, { x: MARGIN_X, y: this.y, size: 14, font: this.fonts.bold, color: NAVY });
    this.y -= 20;
  }

  p(text, opts = {}) {
    const size = opts.size ?? 10.3;
    const font = opts.bold ? this.fonts.bold : this.fonts.regular;
    const color = opts.color ?? INK;
    const lineHeight = size * 1.5;
    const lines = wrapText(text, font, size, opts.width ?? CONTENT_W);
    for (const line of lines) {
      this.ensureSpace(lineHeight);
      this.page.drawText(line, { x: opts.x ?? MARGIN_X, y: this.y, size, font, color });
      this.y -= lineHeight;
    }
    this.y -= opts.gapAfter ?? 8;
  }

  bullet(label, text) {
    const size = 10.1;
    const lineHeight = size * 1.5;
    const labelWidth = label ? this.fonts.bold.widthOfTextAtSize(`${label}  `, size) : 0;
    const lines = wrapText(text, this.fonts.regular, size, CONTENT_W - 16 - labelWidth);
    this.ensureSpace(lineHeight);
    this.page.drawCircle({ x: MARGIN_X + 3, y: this.y + 3.5, size: 2, color: ORANGE });
    let cursorX = MARGIN_X + 14;
    if (label) {
      this.page.drawText(label, { x: cursorX, y: this.y, size, font: this.fonts.bold, color: NAVY });
      cursorX += labelWidth;
    }
    this.page.drawText(lines[0] ?? "", { x: cursorX, y: this.y, size, font: this.fonts.regular, color: INK });
    this.y -= lineHeight;
    for (const line of lines.slice(1)) {
      this.ensureSpace(lineHeight);
      this.page.drawText(line, { x: MARGIN_X + 14, y: this.y, size, font: this.fonts.regular, color: INK });
      this.y -= lineHeight;
    }
    this.y -= 4;
  }

  calloutBox(kicker, text, opts = {}) {
    const size = 10;
    const lineHeight = size * 1.5;
    const pad = 14;
    const lines = wrapText(text, this.fonts.regular, size, CONTENT_W - pad * 2);
    const boxHeight = 22 + lines.length * lineHeight + 8;
    this.ensureSpace(boxHeight + 10);
    const top = this.y;
    const bg = opts.danger ? rgb(255 / 255, 241 / 255, 233 / 255) : rgb(234 / 255, 244 / 255, 248 / 255);
    const bar = opts.danger ? ORANGE : rgb(40 / 255, 120 / 255, 167 / 255);
    this.page.drawRectangle({ x: MARGIN_X, y: top - boxHeight, width: CONTENT_W, height: boxHeight, color: bg });
    this.page.drawRectangle({ x: MARGIN_X, y: top - boxHeight, width: 3, height: boxHeight, color: bar });
    let cy = top - 16;
    this.page.drawText(kicker.toUpperCase(), { x: MARGIN_X + pad, y: cy, size: 8, font: this.fonts.bold, color: opts.danger ? ORANGE : bar, characterSpacing: 1 });
    cy -= 16;
    for (const line of lines) {
      this.page.drawText(line, { x: MARGIN_X + pad, y: cy, size, font: this.fonts.regular, color: INK });
      cy -= lineHeight;
    }
    this.y = top - boxHeight - 16;
  }

  table(headers, rows) {
    const colW = CONTENT_W / headers.length;
    const size = 9;
    const rowPad = 8;
    const headerHeight = 22;

    const rowLines = rows.map((row) => row.map((cell) => wrapText(cell, this.fonts.regular, size, colW - 14)));
    const rowHeights = rowLines.map((cells) => Math.max(...cells.map((lines) => lines.length)) * (size * 1.4) + rowPad * 2);

    this.ensureSpace(headerHeight + rowHeights[0] + 10);
    const top = this.y;
    this.page.drawRectangle({ x: MARGIN_X, y: top - headerHeight, width: CONTENT_W, height: headerHeight, color: NAVY });
    headers.forEach((header, i) => {
      this.page.drawText(header.toUpperCase(), { x: MARGIN_X + i * colW + 8, y: top - headerHeight + 8, size: 8.5, font: this.fonts.bold, color: rgb(1, 1, 1), characterSpacing: 0.4 });
    });
    let cursorY = top - headerHeight;

    rowLines.forEach((cells, rowIndex) => {
      const rh = rowHeights[rowIndex];
      if (cursorY - rh < 56) {
        this.newPage();
        cursorY = this.y + headerHeight;
        this.y = cursorY;
      }
      const shaded = rowIndex % 2 === 1;
      if (shaded) this.page.drawRectangle({ x: MARGIN_X, y: cursorY - rh, width: CONTENT_W, height: rh, color: CREAM });
      cells.forEach((lines, colIndex) => {
        let ly = cursorY - rowPad - size;
        for (const line of lines) {
          this.page.drawText(line, { x: MARGIN_X + colIndex * colW + 8, y: ly, size, font: this.fonts.regular, color: INK });
          ly -= size * 1.4;
        }
      });
      cursorY -= rh;
      this.page.drawLine({ start: { x: MARGIN_X, y: cursorY }, end: { x: PAGE_W - MARGIN_X, y: cursorY }, thickness: 0.6, color: LINE });
    });
    this.y = cursorY - 16;
  }
}

const pdf = await PDFDocument.create();
pdf.setTitle("Módulo VII · Día 6 · Hidráulica industrial");
pdf.setSubject("Habilidades Electromecánicas · INTEGR");
pdf.setAuthor("INTEGR — Ingeniería y Tecnología");

const fonts = {
  regular: await pdf.embedFont(StandardFonts.Helvetica),
  bold: await pdf.embedFont(StandardFonts.HelveticaBold),
};

const doc = new Doc(pdf, fonts);

// ---------------------------------------------------------------------------
// Portada
// ---------------------------------------------------------------------------
{
  const page = pdf.addPage([PAGE_W, PAGE_H]);
  doc.page = page;
  doc.pageNumber = 1;
  page.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: PAGE_H, color: NAVY });
  page.drawRectangle({ x: 0, y: PAGE_H - 14, width: PAGE_W, height: 14, color: ORANGE });
  page.drawText("MÓDULO VII", { x: MARGIN_X, y: PAGE_H - 210, size: 12, font: fonts.bold, color: ORANGE, characterSpacing: 2 });
  page.drawText("Hidráulica", { x: MARGIN_X, y: PAGE_H - 260, size: 42, font: fonts.bold, color: rgb(1, 1, 1) });
  page.drawText("industrial", { x: MARGIN_X, y: PAGE_H - 306, size: 42, font: fonts.bold, color: ORANGE });
  page.drawText("Manual del participante — Día 6", { x: MARGIN_X, y: PAGE_H - 344, size: 13, font: fonts.regular, color: rgb(0.75, 0.83, 0.87) });
  page.drawLine({ start: { x: MARGIN_X, y: PAGE_H - 372 }, end: { x: MARGIN_X + 90, y: PAGE_H - 372 }, thickness: 2, color: ORANGE });
  const introLines = wrapText(
    "Fundamentos de presión y caudal, componentes de un sistema hidráulico, lectura básica de circuitos, diagnóstico de fallas comunes y seguridad con fluidos a presión — para técnicos de mantenimiento electromecánico.",
    fonts.regular, 11.5, 420,
  );
  let iy = PAGE_H - 400;
  for (const line of introLines) { page.drawText(line, { x: MARGIN_X, y: iy, size: 11.5, font: fonts.regular, color: rgb(0.75, 0.83, 0.87) }); iy -= 18; }
  page.drawText("Habilidades Electromecánicas Industriales · Curso de Certificación INTEGR", { x: MARGIN_X, y: 60, size: 9, font: fonts.regular, color: rgb(0.55, 0.65, 0.7) });
}

// ---------------------------------------------------------------------------
// Objetivos y competencias
// ---------------------------------------------------------------------------
doc.newPage("Módulo VII · Día 6", "Objetivos y competencias");
doc.h2("Objetivos de aprendizaje");
doc.p("Al finalizar esta sesión, el participante será capaz de:");
doc.bullet("1.", "Explicar la relación entre presión, caudal y fuerza en un sistema hidráulico, y aplicar el principio de Pascal para justificar por qué la hidráulica permite multiplicar fuerza con equipos relativamente compactos.");
doc.bullet("2.", "Identificar los componentes principales de un sistema hidráulico industrial (depósito, filtro, bomba, válvulas, actuadores, acumulador) y describir la función específica de cada uno dentro de la ruta del fluido.");
doc.bullet("3.", "Interpretar un diagrama hidráulico básico, reconociendo líneas de presión, retorno y dren, así como los símbolos más comunes de bombas, válvulas y cilindros.");
doc.bullet("4.", "Aplicar un método de diagnóstico estructurado ante fallas hidráulicas comunes (cavitación, sobrecalentamiento, contaminación, fugas), evitando conclusiones prematuras basadas en un solo síntoma.");
doc.bullet("5.", "Reconocer los riesgos específicos de la energía hidráulica —en particular la inyección de fluido bajo la piel— y aplicar procedimientos de seguridad antes de intervenir un sistema presurizado.");

doc.h2("Competencias que desarrolla esta sesión");
doc.bullet("", "Análisis técnico de sistemas de fluidos de potencia aplicados a mantenimiento industrial.");
doc.bullet("", "Lectura e interpretación de diagramas hidráulicos como herramienta de diagnóstico.");
doc.bullet("", "Razonamiento diagnóstico basado en evidencia, consistente con la metodología utilizada en los módulos eléctrico y mecánico del curso.");
doc.bullet("", "Cultura de seguridad ante energías almacenadas y fluidos a alta presión.");

doc.calloutBox("Cómo está organizada esta sesión", "El contenido se recorre en cinco estaciones dentro de la plataforma del curso (Presión y fuerza, Componentes, Lectura de circuitos, Diagnóstico y Seguridad), seguidas de cinco casos de práctica. Este manual desarrolla cada estación con mayor profundidad que la presentación, y puede consultarse en cualquier momento durante o después de la sesión.");

// ---------------------------------------------------------------------------
// Estación 1
// ---------------------------------------------------------------------------
doc.newPage("Estación 1 · Fundamentos", "Presión, caudal y fuerza");
doc.p("La hidráulica industrial aprovecha una propiedad simple pero poderosa de los líquidos: son prácticamente incompresibles. Esa incompresibilidad permite transmitir y multiplicar fuerza a través de un fluido confinado, con un control de velocidad y posición muy preciso. Antes de hablar de componentes o de fallas, es indispensable dominar tres cantidades y la relación que existe entre ellas.");

doc.h2("Presión (P)");
doc.p("La presión es la fuerza aplicada dividida entre el área sobre la que actúa: P = F ÷ A. Se expresa comúnmente en bar, psi o kg/cm². Como referencia de conversión, 1 bar equivale aproximadamente a 14.5 psi. La presión es la variable que determina la FUERZA que puede ejercer un actuador hidráulico.");

doc.h2("Caudal (Q)");
doc.p("El caudal es el volumen de fluido que se mueve por unidad de tiempo, y se mide en litros por minuto (L/min) o galones por minuto (GPM). El caudal es la variable que determina la VELOCIDAD a la que se mueve un actuador: a mayor caudal disponible, más rápido avanza un cilindro o gira un motor hidráulico, independientemente de la fuerza que esté ejerciendo.");

doc.h2("Principio de Pascal");
doc.p("El principio de Pascal establece que la presión aplicada a un fluido confinado se transmite, sin pérdida, a todos los puntos del fluido y a las paredes del recipiente que lo contiene. Esta propiedad es la base de todos los sistemas que multiplican fuerza mediante hidráulica: un pistón pequeño puede generar una presión que, transmitida a un pistón de mayor área, produce una fuerza de salida mucho mayor a la fuerza de entrada. Es el principio detrás de gatos hidráulicos, prensas industriales y frenos hidráulicos.");

doc.h2("Potencia hidráulica");
doc.p("La potencia entregada por un sistema hidráulico puede aproximarse con la fórmula: Potencia (kW) ~ (Presión en bar × Caudal en L/min) ÷ 600. Esta relación es útil para dimensionar y para verificar si una bomba y un motor eléctrico son compatibles entre sí.");

doc.calloutBox("Idea clave", "La bomba no genera presión: genera caudal. La presión aparece como reacción a la resistencia que opone la carga. Un sistema sin carga —por ejemplo, con la válvula direccional en posición de libre retorno— puede tener caudal circulando prácticamente sin presión. Confundir estas dos variables es el error conceptual más común al diagnosticar sistemas hidráulicos.");

doc.h2("Ejemplo aplicado");
doc.p("Un cilindro debe levantar una carga de 5,000 kg (~49,050 N) con un pistón de 10 cm de diámetro (área ~ 78.5 cm²). La presión necesaria es aproximadamente P = F ÷ A ~ 49,050 N ÷ 0.00785 m² ~ 6.25 MPa, equivalente a unos 62.5 bar. Si la bomba entrega 20 L/min, la velocidad de avance del pistón —no su fuerza— dependerá de ese caudal y del área del cilindro. Este tipo de cálculo es la base para verificar si un sistema hidráulico está correctamente dimensionado para su aplicación.");

// ---------------------------------------------------------------------------
// Estación 2
// ---------------------------------------------------------------------------
doc.newPage("Estación 2 · Componentes", "Componentes de un sistema hidráulico");
doc.p("Cada componente de un sistema hidráulico cumple una función específica dentro de la ruta del fluido. Reconocer esa función permite ubicar rápidamente dónde investigar cuando algo falla, en lugar de revisar el sistema completo al azar.");

doc.table(
  ["Componente", "Función principal", "Qué observar en campo"],
  [
    ["Depósito / tanque", "Almacena el fluido, permite que se enfríe y separa el aire que pudiera arrastrar.", "Nivel visible, ausencia de espuma, respiradero libre."],
    ["Filtro", "Retiene partículas antes de que dañen la bomba, las válvulas y los sellos.", "Indicador de saturación, frecuencia de cambio."],
    ["Bomba (engranes, paletas o pistones)", "Convierte energía mecánica del motor eléctrico en caudal hidráulico.", "Ruido anormal, vibración, temperatura de carcasa."],
    ["Válvula de alivio (relief)", "Limita la presión máxima del sistema; protege bomba, mangueras y actuadores.", "Ajuste de calibración, si deriva de forma continua."],
    ["Válvula direccional", "Controla hacia dónde se dirige el flujo: avance, retroceso o neutro.", "Respuesta a la señal de mando, fugas por el carrete."],
    ["Válvula reguladora de caudal", "Controla la velocidad de un actuador limitando el flujo que recibe.", "Ajuste correcto para la velocidad de proceso esperada."],
    ["Cilindro", "Convierte presión hidráulica en fuerza y movimiento lineal.", "Fugas en vástago, avance/retroceso suave y sin saltos."],
    ["Motor hidráulico", "Convierte presión hidráulica en movimiento rotativo continuo.", "Velocidad estable, ausencia de ruido metálico."],
    ["Acumulador", "Almacena energía hidráulica y amortigua picos de presión.", "Debe descargarse antes de dar servicio al sistema."],
  ],
);

doc.calloutBox("Ruta del fluido", "Depósito -> filtro de succión -> bomba -> válvula de alivio (en paralelo, como protección) -> válvula direccional -> actuador (cilindro o motor) -> línea de retorno -> filtro de retorno -> depósito. Trazar esta ruta mentalmente en cualquier sistema real ayuda a ubicar rápidamente en qué tramo puede originarse una falla.");

// ---------------------------------------------------------------------------
// Estación 3
// ---------------------------------------------------------------------------
doc.newPage("Estación 3 · Lectura de circuito", "Cómo leer un circuito hidráulico básico");
doc.p("No es necesario memorizar todos los símbolos normalizados (ISO 1219) para orientarse en un diagrama hidráulico industrial. Basta con reconocer las líneas principales y un puñado de símbolos frecuentes para poder seguir el recorrido del fluido en un plano.");

doc.h2("Tipos de línea");
doc.bullet("Línea de presión —", "línea continua gruesa; representa el fluido circulando a la presión de trabajo del sistema, típicamente desde la bomba hacia el actuador.");
doc.bullet("Línea de retorno —", "línea continua; regresa el fluido de vuelta al depósito, normalmente a baja presión.");
doc.bullet("Línea de dren o piloto —", "línea discontinua fina; representa fugas internas controladas (dren) o una señal de mando de baja potencia (piloto), sin restricción significativa al paso del fluido.");

doc.h2("Símbolos frecuentes");
doc.bullet("Bomba de desplazamiento fijo —", "círculo con un triángulo relleno apuntando hacia afuera del círculo, indicando el sentido de flujo que genera.");
doc.bullet("Válvula direccional 4/3 —", "se dibuja como tres cuadros contiguos, cada uno representando una posición de la válvula (avance, neutro y retroceso), con flechas internas que muestran cómo se conectan los puertos en cada posición.");
doc.bullet("Cilindro de doble efecto —", "rectángulo con un vástago que sobresale por un extremo; tiene dos puertos, uno por cada cámara, lo que le permite recibir presión tanto para avanzar como para retroceder.");

doc.h2("Cómo abordar un diagrama en campo");
doc.p("La forma más práctica de leer un circuito real es siguiendo la línea de presión desde la bomba hasta el actuador, identificando qué válvulas atraviesa en el camino, y después siguiendo la línea de retorno de vuelta al depósito. Un circuito 'en reposo' —energizado eléctricamente pero sin movimiento en los actuadores— casi siempre tiene la válvula direccional principal en posición neutra, derivando el caudal de la bomba directamente hacia el depósito o hacia la válvula de alivio.");

doc.calloutBox("Aplicación práctica", "Antes de intervenir cualquier sistema hidráulico desconocido, localizar primero: (1) la bomba y su sentido de giro, (2) la válvula de alivio y su punto de calibración, (3) la válvula direccional principal, y (4) el o los actuadores. Ese recorrido de cuatro puntos suele ser suficiente para entender la lógica general del sistema antes de medir presión o intervenir un componente.");

// ---------------------------------------------------------------------------
// Estación 4
// ---------------------------------------------------------------------------
doc.newPage("Estación 4 · Diagnóstico", "Fallas comunes y diagnóstico");
doc.p("Igual que en los módulos eléctrico y mecánico de este curso, un síntoma hidráulico rara vez tiene una sola causa posible. La evidencia debe correlacionarse con el historial del equipo y con mediciones reales antes de decidir qué intervenir.");

doc.table(
  ["Síntoma", "Causas probables a descartar"],
  [
    ["Movimiento lento o con poca fuerza", "Fuga interna en el actuador o en una válvula, bomba desgastada, o caudal insuficiente para la demanda del actuador."],
    ["Ruido agudo tipo \"canicas\" (cavitación)", "Filtro de succión tapado o subdimensionado, nivel bajo de fluido, o línea de succión restringida por un codo o diámetro insuficiente."],
    ["El sistema se sobrecalienta", "Válvula de alivio derivando de forma continua, enfriador sucio o restringido, o fluido con viscosidad inadecuada para la temperatura de operación."],
    ["Fluido lechoso o espumoso", "Contaminación con agua (condensación o fuga externa hacia el sistema), o entrada de aire por la línea de succión."],
    ["Movimiento errático o \"a saltos\"", "Aire atrapado en el circuito —frecuente después de un mantenimiento reciente— o desgaste interno variable en un componente."],
  ],
);

doc.h2("Método de diagnóstico recomendado");
doc.p("Antes de desarmar cualquier componente, se recomienda seguir esta secuencia:");
doc.bullet("1.", "Revisar nivel y estado visual del fluido (color, transparencia, olor a quemado).");
doc.bullet("2.", "Verificar la condición del filtro y su indicador de saturación, si existe.");
doc.bullet("3.", "Medir la temperatura de operación del sistema y compararla contra el historial.");
doc.bullet("4.", "Confirmar el ajuste de la válvula de alivio contra el valor de diseño.");
doc.bullet("5.", "Correlacionar el síntoma con cualquier mantenimiento o cambio reciente en el sistema.");

doc.calloutBox("Principio central del diagnóstico", "EVIDENCIA no es igual a DIAGNÓSTICO. El mismo síntoma —por ejemplo, un cilindro lento— puede originarse en la bomba, en una válvula, en el propio cilindro o en el fluido. Reemplazar el primer componente sospechoso sin medir es una apuesta cara: la secuencia correcta siempre es medir, comparar contra el valor esperado, y solo entonces decidir qué intervenir.");

// ---------------------------------------------------------------------------
// Estación 5
// ---------------------------------------------------------------------------
doc.newPage("Estación 5 · Seguridad", "Seguridad en sistemas hidráulicos");
doc.p("La energía hidráulica es energía almacenada y transmitida a alta presión. A diferencia de un riesgo mecánico visible —como un punto de atrapamiento— muchos de los riesgos hidráulicos no son evidentes a simple vista, lo que exige un procedimiento disciplinado antes de intervenir cualquier sistema.");

doc.h2("Presión de trabajo típica");
doc.p("Los sistemas hidráulicos industriales operan comúnmente entre 100 y 350 bar (aproximadamente 1,450 a 5,000 psi). A esas presiones, una fuga fina —del tamaño de la punta de un alfiler— puede tener suficiente energía para penetrar la piel sin dejar una herida visible en la superficie.");

doc.calloutBox("Inyección de fluido bajo la piel — emergencia médica", "Si una fuga fina de aceite a alta presión toca la piel, se trata de una urgencia médica inmediata, aunque no se observe sangre ni una herida grande. El fluido puede inyectarse bajo la piel y dañar tejido profundo, con riesgo de pérdida del miembro afectado si no se trata a tiempo. Nunca se debe buscar una fuga fina con la mano, ni siquiera con guante: se utiliza un trozo de cartón o madera para interceptar el flujo. Ante cualquier sospecha de inyección de fluido, se debe acudir de inmediato a atención médica e informar explícitamente que se trata de una inyección de fluido hidráulico a presión, ya que el tratamiento requerido es distinto al de una herida convencional.", { danger: true });

doc.h2("Antes de abrir cualquier línea hidráulica");
doc.bullet("1.", "Aplicar bloqueo y etiquetado (LOTO, conforme a NOM-002-STPS) sobre la fuente de energía eléctrica que impulsa la bomba.");
doc.bullet("2.", "Despresurizar completamente el circuito, accionando los mandos correspondientes con el sistema sin energía.");
doc.bullet("3.", "Verificar en el manómetro que la presión residual sea cero antes de aflojar cualquier conexión.");
doc.bullet("4.", "Descargar cualquier acumulador presente en el sistema: retienen presión aunque la bomba esté apagada.");

doc.h2("Otras prácticas de seguridad relevantes");
doc.bullet("", "Usar siempre lentes de seguridad al trabajar cerca de conexiones hidráulicas, por el riesgo de salpicadura de fluido.");
doc.bullet("", "No usar mangueras ni acoples visiblemente dañados, abultados o con abrasión en el refuerzo metálico.");
doc.bullet("", "Contener y disponer el fluido derramado conforme a los procedimientos ambientales de la planta.");

// ---------------------------------------------------------------------------
// Ejemplos industriales
// ---------------------------------------------------------------------------
doc.newPage("Aplicación", "Ejemplos industriales");
doc.p("Los conceptos de esta sesión se aplican de forma directa en el equipo hidráulico más común en planta. Estos ejemplos conectan la teoría de las cinco estaciones con situaciones reales de mantenimiento.");

doc.h2("Prensas hidráulicas");
doc.p("Una prensa hidráulica es la aplicación más directa del principio de Pascal: multiplica la fuerza generada por una bomba relativamente pequeña hasta alcanzar decenas o cientos de toneladas en el cilindro principal. El diagnóstico de una prensa que 'pierde fuerza' casi siempre comienza midiendo la presión real en el manómetro durante el ciclo, no reemplazando componentes a ciegas.");

doc.h2("Sistemas de elevación e inyección de plástico");
doc.p("En equipos de elevación hidráulica y en máquinas inyectoras de plástico, la relación entre caudal y velocidad de ciclo es crítica: un caudal insuficiente —por una bomba desgastada o una válvula reguladora mal ajustada— se traduce directamente en ciclos de producción más lentos, incluso si la presión disponible es suficiente.");

doc.h2("Equipos móviles y bandas transportadoras con accionamiento hidráulico");
doc.p("En equipos que combinan movimiento hidráulico con estructuras mecánicas —como bandas transportadoras con tensores hidráulicos o brazos de posicionamiento— el diagnóstico exige distinguir entre una causa hidráulica (presión, caudal, fuga) y una causa puramente mecánica (desalineación, desgaste de guías), aplicando el mismo criterio de 'evidencia antes que diagnóstico' que se usa en el resto del curso.");

// ---------------------------------------------------------------------------
// Actividades guiadas
// ---------------------------------------------------------------------------
doc.newPage("Práctica", "Actividades guiadas");
doc.p("La sección de práctica del Día 6 presenta cinco casos de diagnóstico hidráulico. En cada caso, el participante debe decidir qué evidencia reunir antes de proponer una intervención, replicando el método de diagnóstico presentado en la Estación 4.");

doc.table(
  ["Caso", "Situación", "Aprendizaje central"],
  [
    ["H-01", "Un cilindro de prensa pierde fuerza y no completa el ciclo.", "Medir presión real antes de sustituir un componente costoso."],
    ["H-02", "Ruido de \"canicas\" en la bomba tras un cambio de filtro.", "Reconocer cavitación causada por restricción de succión."],
    ["H-03", "El sistema se sobrecalienta cada tarde sin fugas visibles.", "Distinguir entre derivación por alivio, enfriador y viscosidad del fluido."],
    ["H-04", "Un técnico busca una fuga fina con la mano.", "Aplicar el procedimiento seguro ante riesgo de inyección de fluido."],
    ["H-05", "Movimiento a saltos tras cambiar una manguera.", "Identificar aire atrapado como hipótesis prioritaria."],
  ],
);

doc.calloutBox("Instrucciones para el facilitador", "Cada caso puede trabajarse de forma individual o en equipo. Se recomienda pedir a los participantes que argumenten su respuesta antes de revelar la retroalimentación de la plataforma, replicando la dinámica de debate técnico utilizada en los módulos anteriores del curso.");

// ---------------------------------------------------------------------------
// Evidencias de aprendizaje
// ---------------------------------------------------------------------------
doc.newPage("Cierre", "Evidencias de aprendizaje");
doc.p("Para considerar completada esta sesión, el participante debe ser capaz de demostrar lo siguiente:");
doc.bullet("", "Explicar, en sus propias palabras, la diferencia entre presión y caudal, y qué variable determina cada uno (fuerza vs. velocidad).");
doc.bullet("", "Nombrar los componentes principales de un sistema hidráulico y describir la función de al menos cinco de ellos.");
doc.bullet("", "Trazar, sobre un diagrama simple, la ruta del fluido desde el depósito hasta el actuador y de regreso.");
doc.bullet("", "Proponer al menos dos hipótesis distintas ante un síntoma hidráulico dado, antes de decidir una intervención.");
doc.bullet("", "Describir el procedimiento correcto ante una fuga fina de fluido a presión, incluyendo por qué nunca debe buscarse con la mano.");
doc.bullet("", "Haber completado los cinco casos de práctica de la plataforma con una justificación técnica para cada decisión.");

doc.calloutBox("Regla de oro del módulo", "La hidráulica multiplica fuerza usando presión y controla velocidad usando caudal — pero la energía que hace posible ambas cosas es energía almacenada y potencialmente peligrosa. Diagnosticar con evidencia y despresurizar antes de intervenir no son pasos opcionales: son la diferencia entre una reparación exitosa y un incidente grave.");

doc.p("Fin del manual del Día 6 — Módulo VII: Hidráulica industrial.", { color: MUTED, size: 9 });

const bytes = await pdf.save({ useObjectStreams: true });
await fs.writeFile("public/modulo-7-dia-6.pdf", bytes);
console.log(`Manual generado: ${pdf.getPageCount()} páginas`);
