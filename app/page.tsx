"use client";

import { useEffect, useMemo, useState } from "react";

type Module = {
  id: string;
  number: string;
  title: string;
  eyebrow: string;
  duration: string;
  icon: string;
  description: string;
  lessonTitle: string;
  lessonCopy: string;
  bullets: string[];
  image: string;
  imageAlt: string;
  source: string;
  sourceUrl: string;
};

const modules: Module[] = [
  {
    id: "electricidad",
    number: "01",
    title: "Electricidad",
    eyebrow: "Diagnóstico + seguridad",
    duration: "12 min",
    icon: "⚡",
    description: "Aislamiento de motores, uso del megóhmetro y protección frente al arco eléctrico.",
    lessonTitle: "Mide el aislamiento antes de energizar",
    lessonCopy: "El megóhmetro aplica una tensión de prueba controlada y mide resistencias muy altas. Así detecta humedad, contaminación o degradación antes de que aparezca una falla.",
    bullets: ["Aísla y desenergiza el equipo", "Verifica ausencia de tensión", "Descarga el devanado al terminar"],
    image: "https://www.vpowerjsc.com/Data/Sites/1/media/chia-se-kt/dien-tro-cach-dien-motor_thumb.jpg",
    imageAlt: "Técnico realizando una prueba de aislamiento en un motor industrial",
    source: "VPower — prueba de aislamiento",
    sourceUrl: "https://www.vpowerjsc.com/chia-se-kien-thuc/kien-thuc-bao-tri-chan-doan/ket-hop-bao-tri-dinh-ky-pm-va-bao-tri-chan-doan-pdm-cho-dong-co-dien",
  },
  {
    id: "mecanica",
    number: "02",
    title: "Sistemas mecánicos",
    eyebrow: "Condición + causa raíz",
    duration: "10 min",
    icon: "⚙",
    description: "Relaciona vibración, temperatura, alineación y consumo de corriente en bombas y motores.",
    lessonTitle: "La desalineación deja una firma",
    lessonCopy: "Cuando los ejes no comparten el mismo centro, aumentan la vibración, la carga radial, el desgaste de rodamientos y la demanda de corriente.",
    bullets: ["Compara vibración axial y radial", "Revisa acoplamiento y base", "Alinea antes de sustituir piezas"],
    image: "https://control.com/uploads/thumbnails/image3_insulation_testing.jpg",
    imageAlt: "Mantenimiento y medición en equipo industrial",
    source: "Control.com — pruebas industriales",
    sourceUrl: "https://control.com/technical-articles/insulation-testing-with-resistance-meters/",
  },
  {
    id: "electronica",
    number: "03",
    title: "Electrónica industrial",
    eyebrow: "Sensado + retroalimentación",
    duration: "11 min",
    icon: "◉",
    description: "Comprende cómo sensores y encoders convierten el proceso físico en decisiones de control.",
    lessonTitle: "Del movimiento a una señal útil",
    lessonCopy: "Un sensor convierte una variable física en una señal. El encoder añade pulsos de posición y velocidad para cerrar el lazo de control con precisión.",
    bullets: ["Variable física → sensor", "Señal → controlador", "Orden → actuador → retroalimentación"],
    image: "https://labsiz.ru/upload/iblock/aae/cgrogqmcpke3vzfmdpa83ur79ls66wz1.jpg",
    imageAlt: "Instrumentación de medición en una instalación industrial",
    source: "Labsiz — instrumentación industrial",
    sourceUrl: "https://labsiz.ru/poleznye-stati/izmerenie_soprotivleniya_izolyatsii_megaommetrom",
  },
];

const questions = [
  { q: "¿Qué equipo verifica el aislamiento de un motor?", options: ["Cámara térmica", "Probador", "Megóhmetro", "Amperímetro"], answer: 2, why: "El megóhmetro aplica tensión DC de prueba y mide resistencia de aislamiento en MΩ o GΩ." },
  { q: "¿Cuál es la función principal del traje Arc Flash?", options: ["Evitar toda descarga", "Proteger de energía térmica y quemaduras", "Mejorar visibilidad", "Crear puesta a tierra"], answer: 1, why: "El EPP Arc Flash reduce la exposición a calor, plasma y partículas; no elimina el peligro." },
  { q: "Una bomba vibra, se calienta y consume más corriente. ¿Qué causa debes investigar primero?", options: ["Falta de tierra", "Desalineación", "Color del lubricante", "Ventiladores cercanos"], answer: 1, why: "La desalineación transmite cargas anormales y suele elevar simultáneamente vibración, temperatura y corriente." },
  { q: "¿Cuál es la función principal de un sensor?", options: ["Generar potencia", "Evitar todos los picos", "Medir variables físicas", "Aumentar velocidad"], answer: 2, why: "El sensor mide una variable y la transforma en una señal interpretable por el sistema de control." },
  { q: "¿Qué dispositivo retroalimenta posición y velocidad?", options: ["Reductor", "Voltímetro", "Canalización", "Encoder"], answer: 3, why: "El encoder entrega pulsos o palabras digitales que representan desplazamiento, posición y velocidad." },
  { q: "¿Cómo se integra la seguridad entre electricidad, mecánica y electrónica?", options: ["Cada área trabaja aislada", "Solo con más sensores", "Con análisis de riesgos, bloqueo y comunicación coordinada", "Aumentando la velocidad"], answer: 2, why: "La seguridad sistémica exige riesgo compartido, LOTO, permisos, pruebas y comunicación entre disciplinas." },
];

type Dilemma = {
  number: string;
  module: "Electricidad" | "Mecánico" | "Electrónica";
  title: string;
  setup: string;
  sides: [string, string];
  prompt: string;
  options: string[];
  answer: number;
  feedback: string;
  videoId: string;
};

const dilemmas: Dilemma[] = [
  { number:"E-01", module:"Electricidad", title:"Seguridad vs. comodidad", setup:"El traje Arc Flash nivel 4 es caluroso y estorboso. El técnico solo quiere abrir la puerta de un tablero para una inspección visual rápida.", sides:["Exigir el traje completo en toda apertura, sin excepción.","Permitir la inspección rápida sin traje porque no habrá contacto."], prompt:"¿Qué datos deben gobernar la decisión: energía incidente, condición del equipo, distancia, tarea o tiempo de exposición?", options:["Flexibilizar por ser una inspección corta","Usar siempre nivel 4, aunque el estudio indique otra categoría","Aplicar la evaluación de riesgo y el EPP definido para esa tarea y energía incidente"], answer:2, feedback:"La duración no elimina el peligro. La decisión debe salir del análisis de riesgo, límites de aproximación, condición del equipo y EPP definido, no de la comodidad ni de una regla universal sin contexto.", videoId:"xDLKLnVdlWE" },
  { number:"E-02", module:"Electricidad", title:"Producción vs. punto caliente", setup:"Una cámara termográfica muestra un interruptor principal de baja tensión anormalmente caliente mientras la planta está en plena producción.", sides:["Parar toda la planta inmediatamente.","Poner un ventilador y esperar hasta el fin de semana."], prompt:"Antes de decidir, compara carga, tendencia térmica, temperatura absoluta, criticidad, posibilidad de transferencia y señales de daño.", options:["Ventilar y continuar sin seguimiento","Activar respuesta de emergencia basada en criticidad: reducir carga, aislar o parar de forma controlada","Ignorar la imagen porque el interruptor aún funciona"], answer:1, feedback:"Un ventilador puede ocultar el síntoma. La respuesta correcta se escala con el riesgo: confirmar medición, reducir exposición y ejecutar una parada controlada si la criticidad lo exige.", videoId:"HDppR406W-g" },
  { number:"E-03", module:"Electricidad", title:"Cables mezclados", setup:"En una planta antigua se usaron colores incorrectos: rojo para tierras, verde para fases y otras combinaciones peligrosas.", sides:["Recablear todo de inmediato, sin evaluar el impacto.","Conservar todo y confiar únicamente en etiquetas nuevas."], prompt:"¿Cómo reduces el riesgo hoy sin crear otro durante una intervención masiva?", options:["Dejarlo igual y avisar verbalmente","Crear un plan por riesgo: identificar, documentar, etiquetar de forma durable y recablear circuitos críticos por etapas","Cambiar solo los cables visibles"], answer:1, feedback:"La corrección debe ser trazable y priorizada. Primero se controla el riesgo y se documenta; después se normaliza por etapas, empezando por protección, tierra y circuitos críticos.", videoId:"HDppR406W-g" },
  { number:"E-04", module:"Electricidad", title:"Prueba rápida vs. completa", setup:"Para una revisión rutinaria de motor, el equipo quiere omitir el megóhmetro y revisar únicamente continuidad con un multímetro.", sides:["Usar megóhmetro en cada ronda sin importar el contexto.","La continuidad basta para declarar sano el aislamiento."], prompt:"Diferencia continuidad del conductor, resistencia de devanado y resistencia de aislamiento. ¿Qué historial y periodicidad exige el plan?", options:["Usar solo continuidad","Aplicar megóhmetro según el plan preventivo, condición y tendencia, con el motor aislado y descargado","Energizar y observar si dispara"], answer:1, feedback:"El multímetro no sustituye una prueba de aislamiento. La frecuencia debe corresponder al plan y criticidad; el megóhmetro se usa bajo un procedimiento seguro y con tendencias comparables.", videoId:"xDLKLnVdlWE" },
  { number:"E-05", module:"Electricidad", title:"El interruptor que se dispara", setup:"Un motor se apaga repetidamente porque opera la protección térmica. Producción exige subir la capacidad del interruptor para mantenerlo encendido.", sides:["Aumentar el interruptor para recuperar producción.","Mantenerlo detenido hasta cambiar el motor completo."], prompt:"¿Qué protege el interruptor y qué causas pueden elevar la corriente: sobrecarga, atasco, desalineación, tensión o ventilación?", options:["Subir la protección sin cálculo","Rearmar indefinidamente","Conservar la coordinación de protección, diagnosticar la sobrecorriente y corregir la causa antes de operar"], answer:2, feedback:"Sobredimensionar la protección puede trasladar la falla al cableado o al motor. Primero se verifica carga, corriente, tensión, mecánica y ajuste contra placa y coordinación.", videoId:"xDLKLnVdlWE" },
  { number:"M-01", module:"Mecánico", title:"Falla hasta romperse", setup:"Motores y bombas pequeñas son baratos. El equipo debate si vale la pena analizar vibración y alineación o sustituirlos cuando fallen.", sides:["Monitorear cada activo con la máxima tecnología.","Dejar que todos fallen porque reemplazarlos es barato."], prompt:"El precio del equipo no es el costo total: considera paro, seguridad, acceso, inventario, efecto en calidad y daño secundario.", options:["Aplicar la misma estrategia a todos","Elegir la estrategia por criticidad y costo total del ciclo de vida","Esperar la falla aunque detenga la línea"], answer:1, feedback:"Run-to-failure puede ser válido en activos no críticos, seguros y con repuesto disponible. La estrategia se decide por consecuencia y costo total, no solo por precio de compra.", videoId:"W5AzPHJrZlk" },
  { number:"M-02", module:"Mecánico", title:"El mito de más grasa", setup:"Un rodamiento parece reseco, pero el programa indica que aún falta un mes para lubricarlo.", sides:["Agregar grasa por si acaso.","Respetar el calendario aunque existan síntomas nuevos."], prompt:"¿Qué evidencia necesitas: ultrasonido, temperatura, historial, cantidad, tipo de grasa, velocidad y condición de sellos?", options:["Engrasar hasta que salga por los sellos","No tocarlo sin importar la condición","Verificar condición y especificación; lubricar solo con cantidad, tipo y método controlados"], answer:2, feedback:"Tanto falta como exceso de grasa elevan el riesgo. La intervención debe combinar condición real con especificación, evitando contaminar o presurizar los sellos.", videoId:"W5AzPHJrZlk" },
  { number:"M-03", module:"Mecánico", title:"El fusible mecánico", setup:"El acoplamiento flexible de una banda se rompe cada semana por carga elevada. Proponen instalar uno de acero.", sides:["Poner acero y eliminar la pieza débil.","Aceptar la rotura semanal como protección normal."], prompt:"¿El acoplamiento es un elemento fusible diseñado o está revelando sobrecarga, desalineación, arranques bruscos o selección incorrecta?", options:["Cambiarlo por acero sin cálculo","Investigar causa y torque; seleccionar protección y acoplamiento compatibles con todo el tren","Comprar más coples de plástico"], answer:1, feedback:"Endurecer un componente puede trasladar la falla a la flecha o transmisión. La solución exige conocer torque, factor de servicio, alineación y protección contra sobrecarga.", videoId:"1fqugj_kiyQ" },
  { number:"M-04", module:"Mecánico", title:"Neumática vs. hidráulica", setup:"Debes diseñar una máquina para empujar cajas de cartón: aire limpio y rápido o aceite con mayor fuerza.", sides:["Neumática por limpieza y simplicidad.","Hidráulica por fuerza y control."], prompt:"Calcula fuerza, velocidad, ciclo, precisión, ruido, eficiencia, limpieza, mantenimiento y consecuencia de una fuga.", options:["Elegir siempre hidráulica porque es más fuerte","Elegir neumática dimensionada si cubre fuerza y ciclo; comparar costo total antes de decidir","Elegir por la tecnología que el proveedor tenga disponible"], answer:1, feedback:"Para cajas ligeras suele favorecerse neumática si satisface fuerza y ciclo, pero la decisión final sale del dimensionamiento, eficiencia y entorno, no de una preferencia absoluta.", videoId:"NHBi_JAi5Jg" },
  { number:"M-05", module:"Mecánico", title:"¿Láser o vieja escuela?", setup:"Un mecánico experimentado afirma que puede alinear poleas y motores con regla e hilo igual que con un equipo láser.", sides:["Sin láser no existe alineación aceptable.","La experiencia vuelve innecesaria toda medición digital."], prompt:"Define tolerancia requerida, velocidad, criticidad, repetibilidad, documentación y habilidad del ejecutor.", options:["Usar siempre hilo, sin medir tolerancia","Escoger el método que demuestre la tolerancia exigida; usar láser cuando precisión y trazabilidad lo justifiquen","Comprar láser y omitir la revisión de pie suave"], answer:1, feedback:"Regla e hilo pueden servir en trabajos de menor exigencia; el láser aporta precisión y reporte. El criterio es cumplir tolerancia verificada, no defender una herramienta.", videoId:"1fqugj_kiyQ" },
  { number:"C-01", module:"Electrónica", title:"PLC vs. PC industrial", setup:"El equipo debe elegir entre un PLC robusto y determinista o una PC industrial flexible con interfaces avanzadas.", sides:["PLC: resistente y predecible, pero menos flexible.","PC industrial: potente y visual, pero con mayor complejidad de software."], prompt:"¿La función es control determinista, visualización, datos, visión, seguridad o una mezcla? ¿Qué arquitectura puede separar responsabilidades?", options:["Usar Windows para toda función, incluida seguridad","Elegir por arquitectura: PLC para control determinista y PC para cómputo/HMI cuando aporte valor","Usar PLC siempre, aunque no cubra la aplicación"], answer:1, feedback:"No son rivales universales. Una arquitectura híbrida suele separar control crítico y determinista de analítica, visualización o aplicaciones de alto nivel.", videoId:"C-iMjNnP1go" },
  { number:"C-02", module:"Electrónica", title:"Puenteo de seguridad", setup:"Un sensor de puerta falla intermitentemente y detiene producción. El repuesto llegará mañana; proponen puentearlo por unas horas.", sides:["Puente temporal con un aviso al operador.","Paro absoluto hasta cambiar el sensor."], prompt:"¿Existe un modo seguro alternativo validado, con reducción de riesgo, autorización, vigilancia y bloqueo del acceso?", options:["Puentear y dejar la máquina en automático","Mantener la función de seguridad; aplicar solo un modo alternativo formalmente evaluado y autorizado, o detener","Puentear si el gerente firma"], answer:1, feedback:"Una firma no elimina el peligro. Nunca se normaliza el bypass: se conserva la función o se utiliza un modo alternativo diseñado, evaluado, controlado y temporal.", videoId:"Ad5s1cSzkX2" },
  { number:"C-03", module:"Electrónica", title:"Automático vs. manual", setup:"Una máquina tiene tantos sensores que la falla de uno impide operarla. Se propone agregar controles manuales para seguir produciendo.", sides:["Control manual total cuando falle la automatización.","Sin modo manual: cualquier sensor detiene todo."], prompt:"Distingue recuperación, mantenimiento, modo degradado y producción. ¿Qué movimientos requieren velocidad reducida, pulsación mantenida o acceso restringido?", options:["Botones directos que ignoren todas las seguridades","Diseñar modos manuales/degradados con permisos, enclavamientos, límites y diagnóstico","Eliminar sensores para simplificar"], answer:1, feedback:"El modo manual debe ser diseñado, no improvisado. Conserva funciones de seguridad, limita energía y movimiento y deja claro el diagnóstico.", videoId:"Ad5s1cSzkX2" },
  { number:"C-04", module:"Electrónica", title:"Reparar vs. sustituir", setup:"Se quema una tarjeta interna de un variador de 1 HP. Repararlo tomaría cuatro horas; reemplazarlo es rápido pero genera costo y residuo.", sides:["Reparar siempre para evitar desperdicio.","Desechar siempre porque la electrónica pequeña es barata."], prompt:"Considera seguridad de la reparación, garantía, tiempo de paro, disponibilidad, causa raíz, capacidad de prueba y costo total.", options:["Soldar en campo y energizar sin prueba","Decidir con una matriz de riesgo y costo; reparar solo con competencia, diagnóstico y prueba controlada","Cambiarlo sin investigar por qué falló"], answer:1, feedback:"La decisión depende de riesgo y capacidad real de validar la reparación. Aun al reemplazar, investigar la causa evita quemar el nuevo variador.", videoId:"C-iMjNnP1go" },
  { number:"C-05", module:"Electrónica", title:"Variador: moda o necesidad", setup:"Proponen instalar variador en todo motor, incluso en cargas que solo encienden y apagan a velocidad fija.", sides:["Todo motor merece variador por modernización.","Ningún motor fijo necesita electrónica adicional."], prompt:"¿La carga requiere velocidad variable, arranque suave, control de proceso o ahorro por leyes de afinidad? Compara pérdidas y complejidad.", options:["Instalarlo siempre para ahorrar energía en el arranque","Usarlo cuando el perfil de carga y control justifique el costo total; si no, elegir un arranque apropiado","Elegirlo solo por tener pantalla"], answer:1, feedback:"El ahorro importante suele venir de reducir velocidad en cargas variables, no solo del arranque. El perfil de operación y el proceso deben justificar la inversión.", videoId:"C-iMjNnP1go" },
];

const videoLibrary = [
  { id:"xDLKLnVdlWE", tag:"SEGURIDAD ELÉCTRICA", title:"Peligros del Arc Flash", source:"Fluke" },
  { id:"HDppR406W-g", tag:"TERMOGRAFÍA", title:"Imágenes térmicas en aplicaciones eléctricas", source:"Fluke / TestersAndTools" },
  { id:"1fqugj_kiyQ", tag:"ALINEACIÓN", title:"Alineación láser de ejes", source:"SKF tool demonstration" },
  { id:"W5AzPHJrZlk", tag:"RODAMIENTOS", title:"Sistema de rodamientos autoalineables", source:"SKF Group" },
  { id:"NHBi_JAi5Jg", tag:"FLUID POWER", title:"Hidráulica vs. neumática", source:"Material técnico en español" },
  { id:"C-iMjNnP1go", tag:"AUTOMATIZACIÓN", title:"PC industrial SIMATIC", source:"Siemens" },
];

function ProgressRing({ value }: { value: number }) {
  return <div className="progress-ring" style={{ "--progress": `${value * 3.6}deg` } as React.CSSProperties}><span>{value}%</span></div>;
}

export default function Home() {
  const [active, setActive] = useState(0);
  const [completed, setCompleted] = useState<string[]>([]);
  const [vibration, setVibration] = useState(4.2);
  const [temperature, setTemperature] = useState(72);
  const [examOpen, setExamOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const [question, setQuestion] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [caseIndex, setCaseIndex] = useState(0);
  const [caseStage, setCaseStage] = useState<"case" | "debate" | "decision">("case");
  const [caseChoice, setCaseChoice] = useState<number | null>(null);
  const [caseAnswers, setCaseAnswers] = useState<Record<string, number>>({});
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("integr-course-progress");
    if (saved) setCompleted(JSON.parse(saved));
    const savedCases = window.localStorage.getItem("integr-case-progress");
    if (savedCases) setCaseAnswers(JSON.parse(savedCases));
    return () => window.speechSynthesis?.cancel();
  }, []);

  const progress = Math.round((completed.length / modules.length) * 75);
  const risk = useMemo(() => {
    const points = (vibration > 7 ? 2 : vibration > 4.5 ? 1 : 0) + (temperature > 85 ? 2 : temperature > 70 ? 1 : 0);
    return points >= 3 ? { label: "Crítico", action: "Detén, bloquea y diagnostica", tone: "critical" } : points >= 1 ? { label: "Atención", action: "Inspecciona alineación y rodamientos", tone: "warning" } : { label: "Estable", action: "Continúa monitoreando tendencia", tone: "stable" };
  }, [vibration, temperature]);

  const current = modules[active];
  const activeCase = dilemmas[caseIndex];

  function markComplete() {
    const next = completed.includes(current.id) ? completed : [...completed, current.id];
    setCompleted(next);
    window.localStorage.setItem("integr-course-progress", JSON.stringify(next));
  }

  function answer(index: number) {
    if (selected !== null) return;
    setSelected(index);
    if (index === questions[question].answer) setScore((value) => value + 1);
  }

  function nextQuestion() {
    if (question === questions.length - 1) {
      setFinished(true);
      return;
    }
    setQuestion((value) => value + 1);
    setSelected(null);
  }

  function resetExam() {
    setQuestion(0); setSelected(null); setScore(0); setFinished(false);
  }

  function stopNarration() {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  }

  function narrateCase() {
    if (!("speechSynthesis" in window)) return;
    if (speaking) { stopNarration(); return; }
    const voice = new SpeechSynthesisUtterance(`${activeCase.title}. ${activeCase.setup}. Para el debate: ${activeCase.prompt}`);
    voice.lang = "es-MX";
    voice.rate = 0.92;
    voice.pitch = 1;
    voice.onend = () => setSpeaking(false);
    voice.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(voice);
  }

  function openCase(index: number) {
    stopNarration();
    setCaseIndex(index);
    setCaseStage("case");
    setCaseChoice(null);
  }

  function decideCase(index: number) {
    if (caseChoice !== null) return;
    setCaseChoice(index);
    const next = { ...caseAnswers, [activeCase.number]: index };
    setCaseAnswers(next);
    window.localStorage.setItem("integr-case-progress", JSON.stringify(next));
  }

  return (
    <main>
      <nav className="topbar" aria-label="Navegación principal">
        <a className="brand" href="#inicio"><img src="/integr-logo.png" alt="INTEGR Ingeniería y Tecnología" /></a>
        <div className="nav-links"><a href="#ruta">Ruta</a><a href="#laboratorio">Simulador</a><a href="#casos">Casos</a><a href="#videoteca">Videos</a></div>
        <button className="ghost-button" onClick={() => setVideoOpen(true)}>▶ Material original</button>
      </nav>

      <section className="hero" id="inicio">
        <div className="hero-copy">
          <div className="eyebrow"><span className="live-dot" /> RUTA TÉCNICA · CERTIFICACIÓN INTEGR</div>
          <h1>Domina el sistema.<br /><em>Protege la operación.</em></h1>
          <p>Una experiencia práctica para conectar electricidad, mecánica y electrónica industrial con criterio de seguridad.</p>
          <div className="hero-actions">
            <a className="primary-button" href="#ruta">Comenzar recorrido <span>→</span></a>
            <button className="text-button" onClick={() => setExamOpen(true)}>Ir al examen final</button>
          </div>
          <div className="hero-stats"><div><strong>3</strong><span>bloques técnicos</span></div><div><strong>15</strong><span>casos de debate</span></div><div><strong>6</strong><span>videos técnicos</span></div></div>
        </div>
        <div className="hero-visual" aria-label="Sistema industrial conectado">
          <div className="grid-overlay" />
          <div className="system-orbit orbit-one" /><div className="system-orbit orbit-two" />
          <div className="core"><span>INTEGR</span><small>SISTEMA SEGURO</small></div>
          <div className="node node-a"><b>01</b><span>Eléctrico</span></div>
          <div className="node node-b"><b>02</b><span>Mecánico</span></div>
          <div className="node node-c"><b>03</b><span>Control</span></div>
          <div className="status-chip">● Operación conectada</div>
        </div>
      </section>

      <section className="route-section" id="ruta">
        <div className="section-heading"><div><span className="kicker">RUTA DE APRENDIZAJE</span><h2>Tres disciplinas. <em>Un solo criterio.</em></h2></div><div className="progress-cluster"><ProgressRing value={progress} /><span>Tu avance<br /><b>{completed.length} de 3 bloques</b></span></div></div>
        <div className="module-grid">
          {modules.map((item, index) => <button key={item.id} className={`module-card ${active === index ? "active" : ""}`} onClick={() => setActive(index)} aria-pressed={active === index}>
            <div className="module-top"><span>{item.number}</span><i>{completed.includes(item.id) ? "✓" : item.icon}</i></div>
            <span className="module-eyebrow">{item.eyebrow}</span><h3>{item.title}</h3><p>{item.description}</p>
            <div className="module-footer"><span>{item.duration}</span><span>Explorar →</span></div>
          </button>)}
        </div>

        <article className="lesson-panel">
          <div className="lesson-image"><img src={current.image} alt={current.imageAlt} /><span className="image-label">BLOQUE {current.number}</span><a href={current.sourceUrl} target="_blank" rel="noreferrer">Fuente de imagen ↗</a></div>
          <div className="lesson-content"><span className="kicker">CONCEPTO CLAVE · {current.title.toUpperCase()}</span><h2>{current.lessonTitle}</h2><p>{current.lessonCopy}</p>
            <ol>{current.bullets.map((bullet, i) => <li key={bullet}><span>0{i + 1}</span>{bullet}</li>)}</ol>
            <button className="primary-button dark" onClick={markComplete}>{completed.includes(current.id) ? "Bloque completado ✓" : "Marcar como aprendido"}</button>
          </div>
        </article>
      </section>

      <section className="lab-section" id="laboratorio">
        <div className="lab-copy"><span className="kicker light">LABORATORIO DE DIAGNÓSTICO</span><h2>Lee las señales<br />antes de la falla.</h2><p>Ajusta las mediciones y observa cómo cambia la prioridad de intervención. Los umbrales son didácticos; en campo utiliza la línea base y los límites del fabricante.</p><div className="lab-rule"><span /> AISLAR · MEDIR · INTERPRETAR · ACTUAR</div></div>
        <div className="simulator">
          <div className="sim-header"><span>SIM-02 / BOMBA CENTRÍFUGA</span><span className="online">● EN LÍNEA</span></div>
          <label><span>Vibración RMS <b>{vibration.toFixed(1)} mm/s</b></span><input type="range" min="1" max="11" step="0.1" value={vibration} onChange={(e) => setVibration(Number(e.target.value))} /></label>
          <label><span>Temperatura rodamiento <b>{temperature} °C</b></span><input type="range" min="35" max="110" value={temperature} onChange={(e) => setTemperature(Number(e.target.value))} /></label>
          <div className={`diagnosis ${risk.tone}`}><span>PRIORIDAD</span><strong>{risk.label}</strong><p>{risk.action}</p></div>
          <div className="signal-flow"><span>SENSOR</span><i>→</i><span>CONTROL</span><i>→</i><span>ACCIÓN</span></div>
        </div>
      </section>

      <section className="dilemma-section" id="casos">
        <div className="dilemma-heading">
          <div><span className="kicker">15 CASOS · DECISIONES REALES</span><h2>Primero entiende.<br /><em>Luego debate. Después decide.</em></h2></div>
          <div className="case-completion"><b>{Object.keys(caseAnswers).length}</b><span>casos<br />respondidos</span></div>
        </div>
        <div className="case-workspace">
          <aside className="case-list" aria-label="Lista de casos">
            {(["Electricidad", "Mecánico", "Electrónica"] as const).map((group) => <div key={group} className="case-group">
              <h3>{group === "Electricidad" ? "⚡" : group === "Mecánico" ? "⚙" : "◉"} {group}</h3>
              {dilemmas.map((item, index) => item.module === group && <button key={item.number} className={caseIndex === index ? "active" : ""} onClick={() => openCase(index)}><span>{caseAnswers[item.number] !== undefined ? "✓" : item.number}</span>{item.title}</button>)}
            </div>)}
          </aside>
          <article className="case-player">
            <div className="case-player-top"><div><span>{activeCase.number}</span><b>{activeCase.module}</b></div><button className={speaking ? "speaking" : ""} onClick={narrateCase} aria-label={speaking ? "Detener narración" : "Escuchar narración"}>{speaking ? "■ Detener audio" : "◖)) Escuchar caso"}</button></div>
            <div className="stage-rail" aria-label="Etapas del caso"><span className={caseStage === "case" ? "active" : "done"}>1. Caso</span><span className={caseStage === "debate" ? "active" : caseStage === "decision" ? "done" : ""}>2. Debate</span><span className={caseStage === "decision" ? "active" : ""}>3. Incisos</span></div>
            {caseStage === "case" && <div className="case-stage case-intro"><span className="stage-label">EL DILEMA</span><h2>{activeCase.title}</h2><p>{activeCase.setup}</p><div className="case-alert"><span>!</span><p><b>No respondas todavía.</b><br />Identifica primero el peligro, las personas expuestas y la consecuencia de equivocarte.</p></div><button className="primary-button dark" onClick={() => setCaseStage("debate")}>Abrir el debate →</button></div>}
            {caseStage === "debate" && <div className="case-stage"><span className="stage-label">DOS POSTURAS EN TENSIÓN</span><h2>¿Qué defenderías en una reunión de turno?</h2><div className="debate-sides"><div><span>A</span><p>{activeCase.sides[0]}</p></div><div><span>B</span><p>{activeCase.sides[1]}</p></div></div><div className="missing-data"><b>Antes de decidir, pregunta:</b><p>{activeCase.prompt}</p></div><div className="stage-actions"><button className="text-button" onClick={() => setCaseStage("case")}>← Volver al caso</button><button className="primary-button dark" onClick={() => setCaseStage("decision")}>Ver incisos →</button></div></div>}
            {caseStage === "decision" && <div className="case-stage decision-stage"><span className="stage-label">TOMA UNA POSICIÓN</span><h2>Selecciona la respuesta más defendible.</h2><div className="case-options">{activeCase.options.map((option, index) => <button key={option} onClick={() => decideCase(index)} className={caseChoice === null ? "" : index === activeCase.answer ? "correct" : caseChoice === index ? "wrong" : "muted"}><span>{String.fromCharCode(65 + index)}</span><p>{option}</p></button>)}</div>{caseChoice !== null && <div className={`case-feedback ${caseChoice === activeCase.answer ? "good" : "bad"}`}><strong>{caseChoice === activeCase.answer ? "Decisión sólida" : "Esa ruta aumenta el riesgo"}</strong><p>{activeCase.feedback}</p><div><button onClick={() => setCaseStage("debate")}>Revisar debate</button><button onClick={() => openCase((caseIndex + 1) % dilemmas.length)}>Siguiente caso →</button></div></div>}</div>}
            <div className="case-video-link"><span>VIDEO RELACIONADO</span><a href={`https://www.youtube.com/watch?v=${activeCase.videoId}`} target="_blank" rel="noreferrer">Abrir apoyo técnico ↗</a></div>
          </article>
        </div>
      </section>

      <section className="video-library" id="videoteca">
        <div className="video-library-heading"><div><span className="kicker light">VIDEOTECA TÉCNICA</span><h2>Observa el riesgo.<br />Conecta la teoría.</h2></div><p>Seis recursos para preparar el debate. Activa subtítulos en YouTube cuando estén disponibles.</p></div>
        <div className="video-grid">{videoLibrary.map((video) => <article key={video.id} className="video-card"><div className="video-frame"><iframe loading="lazy" src={`https://www.youtube-nocookie.com/embed/${video.id}`} title={video.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div><div className="video-meta"><span>{video.tag}</span><h3>{video.title}</h3><p>{video.source}</p></div></article>)}</div>
        <p className="video-disclaimer">Los videos complementan el análisis y no sustituyen procedimientos, estudios de riesgo, manuales ni capacitación autorizada.</p>
      </section>

      <section className="exam-banner" id="recursos">
        <div><span className="kicker">VALIDACIÓN FINAL</span><h2>¿Listo para tomar decisiones?</h2><p>Seis situaciones, retroalimentación inmediata y una meta mínima del 80%.</p></div>
        <button className="primary-button" onClick={() => { resetExam(); setExamOpen(true); }}>Iniciar examen <span>→</span></button>
      </section>

      <footer><img src="/integr-logo.png" alt="INTEGR" /><p>Curso interactivo basado en “Examen de Certificación”.</p><div className="credits">Imágenes educativas: {modules.map((m, i) => <span key={m.id}><a href={m.sourceUrl} target="_blank" rel="noreferrer">{m.source}</a>{i < modules.length - 1 ? " · " : ""}</span>)}</div></footer>

      {videoOpen && <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Video original"><div className="video-modal"><button className="close" onClick={() => setVideoOpen(false)} aria-label="Cerrar">×</button><div className="modal-title"><span>REFERENCIA ORIGINAL</span><h2>Examen de Certificación</h2></div><video src="/examen-certificacion.mp4" controls autoPlay /></div></div>}

      {examOpen && <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="exam-title"><div className="exam-modal"><button className="close" onClick={() => setExamOpen(false)} aria-label="Cerrar">×</button>
        {!finished ? <><div className="exam-progress"><span>EXAMEN FINAL</span><b>{String(question + 1).padStart(2, "0")} / {String(questions.length).padStart(2, "0")}</b></div><div className="exam-bar"><span style={{ width: `${((question + 1) / questions.length) * 100}%` }} /></div><h2 id="exam-title">{questions[question].q}</h2><div className="options">{questions[question].options.map((option, index) => <button key={option} onClick={() => answer(index)} className={selected === null ? "" : index === questions[question].answer ? "correct" : selected === index ? "wrong" : "muted"}><span>{String.fromCharCode(65 + index)}</span>{option}</button>)}</div>
          {selected !== null && <div className={`feedback ${selected === questions[question].answer ? "good" : "bad"}`}><strong>{selected === questions[question].answer ? "Correcto" : "Revisa el criterio"}</strong><p>{questions[question].why}</p><button onClick={nextQuestion}>{question === questions.length - 1 ? "Ver resultado" : "Siguiente reto →"}</button></div>}</> : <div className="result"><span className="result-score">{score}/{questions.length}</span><span className="kicker">RESULTADO</span><h2>{score >= 5 ? "Criterio técnico validado." : "Refuerza la ruta y vuelve a intentar."}</h2><p>{score >= 5 ? "Reconoces los equipos, riesgos y señales clave para una intervención coordinada." : "Tu resultado aún no alcanza el 80%. Repasa los tres bloques antes del siguiente intento."}</p><div><button className="primary-button" onClick={() => setExamOpen(false)}>Cerrar</button><button className="text-button" onClick={resetExam}>Repetir examen</button></div></div>}
      </div></div>}
    </main>
  );
}
