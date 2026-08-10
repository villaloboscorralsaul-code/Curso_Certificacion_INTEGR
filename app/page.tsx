"use client";

import { useEffect, useRef, useState } from "react";
import DebateExperience from "./DebateExperience";
import LearningCoach from "./LearningCoach";
import PracticeExperience from "./PracticeExperience";
import DayTwoExperience from "./DayTwoExperience";

type View = "inicio" | "teoria" | "video" | "practica" | "debate" | "dia2";
type Stage = "caso" | "debate" | "incisos";

const days = [
  { day: 1, title: "Fundamentos eléctricos", hours: "6 h teoría · 3 h práctica", status: "Publicado", active: true },
  { day: 2, title: "Sistemas eléctricos industriales", hours: "6 h teoría · 3 h práctica", status: "Programado" },
  { day: 3, title: "Instrumentación y seguridad", hours: "5 h teoría · 4 h práctica", status: "Programado" },
  { day: 4, title: "Sistemas mecánicos", hours: "6 h teoría · 3 h práctica", status: "Programado" },
  { day: 5, title: "Electrónica industrial", hours: "3 h teoría · 3 h práctica", status: "Programado" },
];

const sections: { id: View; label: string; short: string; detail: string; icon: string }[] = [
  { id: "teoria", label: "Teoría", short: "Manual", detail: "8 conceptos · PDF incluido", icon: "01" },
  { id: "video", label: "Video-lección", short: "Multimedia", detail: "Narración y animaciones", icon: "02" },
  { id: "practica", label: "Práctica", short: "Laboratorio", detail: "4 calculadoras guiadas", icon: "03" },
  { id: "debate", label: "Debate", short: "Decisiones", detail: "5 casos progresivos", icon: "04" },
];

const lessons = [
  { n: "1.1", title: "Principios de electricidad", text: "La electricidad describe el movimiento y la interacción de cargas. En un circuito cerrado, una diferencia de potencial impulsa corriente a través de una oposición.", tag: "Base conceptual" },
  { n: "1.2", title: "Voltaje, corriente y resistencia", text: "Voltaje (V) es la fuerza eléctrica; corriente (A), el flujo de carga; resistencia (Ω), la oposición. Ninguna medición aislada cuenta toda la historia.", tag: "Tres magnitudes" },
  { n: "1.3", title: "Ley de Ohm", text: "V = I × R relaciona las tres magnitudes. Si conoces dos, puedes calcular la tercera y comprobar si una lectura de campo es coherente.", tag: "V = I × R" },
  { n: "1.4", title: "Corriente alterna y directa", text: "DC mantiene polaridad; AC cambia periódicamente. La industria usa AC para distribución y motores, y DC en control, electrónica y almacenamiento.", tag: "AC vs. DC" },
  { n: "1.5", title: "Potencia industrial", text: "La potencia activa P realiza trabajo (kW), la reactiva Q sostiene campos (kVAR) y la aparente S representa la demanda total (kVA). Se relacionan como un triángulo.", tag: "P · Q · S" },
  { n: "1.6", title: "Eficiencia y pérdidas", text: "η = Psalida / Pentrada × 100. La diferencia se pierde principalmente como calor, fricción o efectos electromagnéticos y debe investigarse como tendencia.", tag: "η %" },
  { n: "1.7", title: "Medición segura", text: "El voltímetro se conecta en paralelo; la corriente se mide en serie o con pinza apropiada. Antes de medir se define categoría, rango, estado del instrumento y EPP.", tag: "V y A" },
  { n: "1.8", title: "Identificación de sobrecargas", text: "Una corriente mayor a la nominal puede revelar carga mecánica, baja tensión, pérdida de fase, mala ventilación o falla interna. El disparo es un síntoma que protege al sistema.", tag: "Diagnóstico" },
];

const theoryTopics = [
  { session: "Sesión 1", pages: "Págs. 2-3", title: "Electricidad, conductores y aislantes", eyebrow: "El punto de partida", copy: "La electricidad surge de la presencia y movimiento de cargas. En la industria, cobre y aluminio permiten el flujo; los aislantes contienen la energía y protegen a personas y equipos.", facts: ["Carga eléctrica", "Flujo de electrones", "Material y aislamiento"], visual: "charges", color: "blue" },
  { session: "Sesión 1", pages: "Págs. 4-5", title: "Voltaje, corriente y resistencia", eyebrow: "Tres variables conectadas", copy: "El voltaje impulsa, la corriente fluye y la resistencia se opone. La resistencia depende del material, la longitud, el área transversal y la temperatura.", facts: ["Voltaje · V", "Corriente · A", "Resistencia · Ω"], visual: "vir", color: "orange" },
  { session: "Sesión 1", pages: "Págs. 5-6", title: "Ley de Ohm y AC vs. DC", eyebrow: "Relaciones y comportamiento", copy: "La Ley de Ohm permite analizar circuitos simples. DC fluye en un sentido y alimenta control y sensores; AC alterna y domina motores, transformadores y potencia industrial.", facts: ["V = I × R", "24 VDC · control", "480 VAC · motores"], visual: "wave", color: "blue" },
  { session: "Sesión 2", pages: "Págs. 7-12", title: "Potencia y factor de potencia", eyebrow: "Lo que la instalación realmente transporta", copy: "La potencia activa realiza trabajo, la reactiva sostiene campos electromagnéticos y la aparente dimensiona transformadores, generadores y conductores.", facts: ["P · kW", "Q · kVAR", "S · kVA"], visual: "triangle", color: "orange" },
  { session: "Sesión 2", pages: "Págs. 13-16", title: "Eficiencia y pérdidas", eyebrow: "Energía útil frente a energía consumida", copy: "Ninguna máquina convierte toda la energía de entrada en trabajo. Calor, fricción, ventilación, desalineación y operación fuera del punto óptimo explican la diferencia.", facts: ["η = salida / entrada", "Pérdidas I²R", "Calor como indicador"], visual: "efficiency", color: "green" },
  { session: "Sesión 3", pages: "Págs. 17-23", title: "Parámetros y medición industrial", eyebrow: "Medir con una expectativa", copy: "Una lectura adquiere significado al compararse con placa, historial y condición de carga. Voltaje, corriente y balance de fases forman una evidencia conjunta.", facts: ["Nominal", "Medido", "Histórico"], visual: "meter", color: "blue" },
  { session: "Sesión 3", pages: "Págs. 24-29", title: "Sobrecarga y método diagnóstico", eyebrow: "De la desviación a la causa", copy: "La sobrecarga no es un cortocircuito. Puede tener origen eléctrico, mecánico u operativo. El método es identificar, medir, comparar, interpretar, verificar y diagnosticar.", facts: ["Identificar", "Comparar", "Diagnosticar"], visual: "process", color: "orange" },
];

const videoSlides = [
  { title: "La electricidad es una relación", kicker: "Voltaje · Corriente · Resistencia", copy: "Una fuente crea diferencia de potencial. El circuito permite flujo. La carga se opone y transforma energía.", visual: "circuit" },
  { title: "Ley de Ohm", kicker: "V = I × R", copy: "Con dos magnitudes puedes encontrar la tercera. Cambiar resistencia o voltaje modifica la corriente del circuito.", visual: "ohm" },
  { title: "AC y DC", kicker: "Dos comportamientos, usos distintos", copy: "La señal DC conserva polaridad. La AC alterna y permite distribuir energía eficientemente en la planta.", visual: "wave" },
  { title: "El triángulo de potencia", kicker: "P² + Q² = S²", copy: "La potencia activa produce trabajo; la reactiva sostiene campos; la aparente dimensiona la infraestructura.", visual: "power" },
  { title: "Medir para diagnosticar", kicker: "Dato + contexto + tendencia", copy: "Compara placa, carga, tensión, corriente, eficiencia y temperatura antes de decidir una intervención.", visual: "meter" },
];

const theorySupport = [
  { simple: "Piensa en un cable como una carretera: los electrones son los vehículos, el conductor es el camino y el aislante es la barrera que evita que salgan.", check: "¿Por qué el cobre conduce y el recubrimiento plástico protege?", answer: "Porque el cobre facilita el movimiento de cargas y el plástico ofrece gran oposición a ese movimiento." },
  { simple: "El voltaje es el empuje, la corriente es lo que circula y la resistencia es la dificultad para pasar, como agua dentro de una tubería.", check: "Si mantienes el voltaje y aumenta la resistencia, ¿qué pasa con la corriente?", answer: "Disminuye, porque existe mayor oposición al paso de la carga." },
  { simple: "La Ley de Ohm es una relación de causa y efecto. AC cambia de dirección muchas veces por segundo; DC conserva una dirección.", check: "¿Dónde es común encontrar 24 V DC en una planta?", answer: "En sensores, controles, relevadores y sistemas electrónicos." },
  { simple: "kW es el trabajo útil; kVA es todo lo que la instalación debe transportar. Por eso un transformador no se elige comparando solo kW.", check: "¿Qué potencia ayuda a dimensionar un transformador?", answer: "La potencia aparente, expresada en kVA, junto con margen y condiciones de operación." },
  { simple: "Una máquina nunca aprovecha toda la energía. La parte que no se vuelve trabajo aparece como calor, fricción, ruido u otras pérdidas.", check: "¿Qué puede indicar un aumento de temperatura sin cambio de carga?", answer: "Que las pérdidas aumentaron y conviene investigar condición eléctrica, mecánica y ventilación." },
  { simple: "Una lectura aislada es solo un número. Se vuelve información cuando la comparas con la placa, otras fases, la carga y el historial.", check: "¿Es suficiente medir corriente una sola vez para diagnosticar?", answer: "No. Se necesita contexto, comparación y tendencia antes de concluir." },
  { simple: "El disparo de una protección es una señal de ayuda. No se debe ocultar: se investiga qué condición hizo que actuara.", check: "¿La primera acción debe ser aumentar la protección?", answer: "No. Primero se identifica la causa y se verifica que equipo, conductor y protección estén coordinados." },
];

const videoSupport = [
  { key: "Voltaje empuja, corriente circula y resistencia limita.", example: "Como una bomba que mueve agua por una tubería.", question: "¿Qué variable representa el flujo?" },
  { key: "Con dos valores puedes calcular el tercero.", example: "Si conoces 230 V y 28.75 Ω, obtienes 8 A.", question: "¿Qué ocurre con la corriente si aumenta la resistencia?" },
  { key: "AC y DC no son mejores o peores: sirven para necesidades distintas.", example: "Motores suelen usar AC; sensores y control suelen usar DC.", question: "¿Qué tipo encontrarías normalmente en un sensor de 24 V?" },
  { key: "La infraestructura transporta potencia aparente, no solo trabajo útil.", example: "Una carga de 72 kW con FP 0.80 demanda 90 kVA.", question: "¿Por qué kW y kVA no siempre son iguales?" },
  { key: "Diagnosticar significa comparar datos, contexto y tendencia.", example: "9.8 A dicen poco sin placa, voltaje, carga e historial.", question: "¿Qué dato buscarías después de medir una corriente alta?" },
];

const debates = [
  { code: "D1-01", title: "El motor que pide más corriente", case: "Un motor de banda marca 9.8 A en operación, aunque su placa indica 8.2 A. Producción afirma que mientras siga girando no hay problema.", prompt: "Debatan qué significa esa diferencia. ¿Es una falla eléctrica, una carga mecánica o una condición normal? ¿Qué dato falta antes de detener?", lenses: ["Riesgo para el devanado", "Carga real de la banda", "Tensión entre fases", "Tiempo y tendencia"], options: ["Aumentar el ajuste de protección para evitar paros.", "Comparar tensión, corriente por fase y carga; corregir la causa antes de cambiar protección.", "Esperar hasta que el motor se detenga por sí solo."], answer: 1, feedback: "La corriente es evidencia, no diagnóstico completo. Debe compararse con placa, balance de tensión, carga y tendencia. Cambiar la protección puede eliminar la defensa del motor sin eliminar la causa." },
  { code: "D1-02", title: "¿Un multímetro en cualquier punto?", case: "Un técnico nuevo quiere medir corriente colocando las puntas del multímetro directamente entre fase y neutro, igual que cuando mide voltaje.", prompt: "Expliquen qué diferencia existe entre una medición de voltaje en paralelo y una medición de corriente. ¿Qué podría ocurrir?", lenses: ["Impedancia del instrumento", "Conexión serie/paralelo", "Categoría de medición", "Método con pinza"], options: ["Es correcto si selecciona amperes antes de conectar.", "Solo es riesgoso en circuitos de más de 480 V.", "No hacerlo: provocaría un cortocircuito; usar conexión en serie controlada o pinza adecuada."], answer: 2, feedback: "En modo corriente el instrumento presenta muy baja impedancia. Conectarlo en paralelo puede crear un cortocircuito. El método, rango, fusible y categoría deben verificarse antes de medir." },
  { code: "D1-03", title: "kW no es lo mismo que kVA", case: "Una nueva carga necesita 72 kW y opera con factor de potencia 0.80. El equipo propone un transformador de 75 kVA porque 75 es mayor que 72.", prompt: "Debatan qué potencia debe dimensionar la infraestructura y qué margen o datos adicionales se necesitan.", lenses: ["Potencia activa", "Potencia aparente", "Factor de potencia", "Margen y demanda"], options: ["75 kVA basta porque supera los 72 kW.", "Calcular S = P/FP: la carga demanda 90 kVA antes de considerar margen.", "Multiplicar 72 × 0.80 para obtener 57.6 kVA."], answer: 1, feedback: "S = P / FP. Con 72 kW y FP 0.80, la demanda es 90 kVA. El dimensionamiento final también considera demanda, crecimiento, temperatura y criterios de ingeniería." },
  { code: "D1-04", title: "El precio de la ineficiencia", case: "Dos motores entregan 15 kW mecánicos. El motor A tiene 90% de eficiencia y el B 82%. Compras prefiere B porque cuesta menos.", prompt: "¿El precio inicial debe decidir? Comparen potencia de entrada, pérdidas, horas de uso, temperatura y costo de ciclo de vida.", lenses: ["Pérdidas en kW", "Horas anuales", "Costo de energía", "Confiabilidad"], options: ["Elegir B: ambos entregan la misma potencia.", "Comparar costo total; B consume más y disipa más calor para la misma salida.", "Elegir A únicamente porque su porcentaje es más alto."], answer: 1, feedback: "A requiere ≈16.67 kW y B ≈18.29 kW. La diferencia de ≈1.62 kW se acumula durante todas las horas de operación y también eleva la carga térmica." },
  { code: "D1-05", title: "AC o DC para el circuito de control", case: "Una modificación requiere sensores y relevadores cerca de una zona húmeda. Hay disponibles 120 V AC y una fuente de 24 V DC.", prompt: "Debatan seguridad, compatibilidad, caída de tensión, distancia, diagnóstico y comportamiento ante fallas. ¿Existe una respuesta universal?", lenses: ["Energía de contacto", "Compatibilidad de cargas", "Distancia del cable", "Protección y referencia"], options: ["Usar siempre 120 V AC porque ya está disponible.", "Usar siempre 24 V DC sin revisar corriente ni caída.", "Diseñar con evaluación de riesgo y carga; 24 V DC suele favorecer control, pero debe verificarse el circuito completo."], answer: 2, feedback: "24 V DC suele reducir exposición y es común en control, pero la elección depende de carga, distancia, caída de tensión, ambiente, aislamiento y protección. La ingeniería valida el sistema completo." }
];

const narration = videoSlides.map((slide) => `${slide.title}. ${slide.copy}`);

function WaveVisual({ kind }: { kind: string }) {
  return <div className={`lesson-visual ${kind}`} aria-hidden="true"><div className="grid-lines" />
    {kind === "circuit" && <><div className="wire wire-a"/><div className="wire wire-b"/><span className="node n1">V</span><span className="node n2">I</span><span className="node n3">R</span></>}
    {kind === "ohm" && <div className="formula-stack"><strong>V</strong><span>I × R</span><small>12 V = 2 A × 6 Ω</small></div>}
    {kind === "wave" && <><div className="dc-line"><b>DC</b></div><div className="sine"><i/><i/><i/><i/><b>AC</b></div></>}
    {kind === "power" && <div className="power-triangle"><span className="p">P</span><span className="q">Q</span><span className="s">S</span></div>}
    {kind === "meter" && <div className="meter"><span>8.2</span><small>A</small><i/></div>}
  </div>;
}

function TheoryVisual({ kind }: { kind: string }) {
  return <div className={`theory-visual theory-${kind}`} aria-hidden="true">
    {kind === "charges" && <><div className="atom-ring ring-one"/><div className="atom-ring ring-two"/><span className="charge c1">−</span><span className="charge c2">−</span><span className="charge c3">−</span><b>Cu</b></>}
    {kind === "vir" && <div className="vir-system"><div><span>V</span><small>Impulsa</small></div><i>→</i><div><span>I</span><small>Fluye</small></div><i>→</i><div><span>R</span><small>Se opone</small></div></div>}
    {kind === "wave" && <div className="compare-waves"><div><span>DC</span><i/></div><div><span>AC</span><i/><i/><i/><i/></div></div>}
    {kind === "triangle" && <div className="clean-triangle"><span className="tp">P</span><span className="tq">Q</span><span className="ts">S</span><small>FP = P / S</small></div>}
    {kind === "efficiency" && <div className="energy-flow"><div><b>100%</b><small>Entrada</small></div><i/><div><b>86%</b><small>Trabajo útil</small></div><span><b>14%</b><small>Pérdidas</small></span></div>}
    {kind === "meter" && <div className="clean-meter"><div><small>L1</small><b>12.8 A</b></div><div><small>L2</small><b>13.1 A</b></div><div><small>L3</small><b>12.9 A</b></div><span>Lecturas uniformes</span></div>}
    {kind === "process" && <div className="diagnostic-process">{["Identificar","Medir","Comparar","Interpretar","Verificar","Diagnosticar"].map((step,index)=><div key={step}><span>{index+1}</span><b>{step}</b></div>)}</div>}
  </div>;
}

export default function CourseAdmin() {
  const [view, setView] = useState<View>("inicio");
  const [completed, setCompleted] = useState<View[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [theoryIndex, setTheoryIndex] = useState(0);
  const [manualOpen, setManualOpen] = useState(false);
  const [videoIndex, setVideoIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [sound, setSound] = useState(true);
  const videoTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const [caseIndex, setCaseIndex] = useState(0);
  const [stage, setStage] = useState<Stage>("caso");
  const [choice, setChoice] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  useEffect(() => { const saved = localStorage.getItem("integr-day1-completed"); const savedAnswers = localStorage.getItem("integr-day1-debates"); if (saved) setCompleted(JSON.parse(saved)); if (savedAnswers) setAnswers(JSON.parse(savedAnswers)); }, []);
  useEffect(() => {
    if (!playing) { if (videoTimer.current) clearInterval(videoTimer.current); speechSynthesis?.cancel(); return; }
    if (sound && "speechSynthesis" in window) { speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(narration[videoIndex]); utterance.lang = "es-MX"; utterance.rate = .93; speechSynthesis.speak(utterance); }
    videoTimer.current = setInterval(() => setVideoIndex((current) => { if (current === videoSlides.length - 1) { setPlaying(false); return current; } return current + 1; }), 9000);
    return () => { if (videoTimer.current) clearInterval(videoTimer.current); };
  }, [playing, videoIndex, sound]);

  const progress = Math.round((completed.length / sections.length) * 100);
  function go(next: View) { setView(next); setMenuOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); }
  function markDone(id: View) { const next = completed.includes(id) ? completed.filter((item) => item !== id) : [...completed, id]; setCompleted(next); localStorage.setItem("integr-day1-completed", JSON.stringify(next)); }
  function openCase(index: number) { setCaseIndex(index); setStage("caso"); setChoice(null); }
  function decide(index: number) { if (choice !== null) return; setChoice(index); const next = { ...answers, [debates[caseIndex].code]: index }; setAnswers(next); localStorage.setItem("integr-day1-debates", JSON.stringify(next)); }

  const activeCase = debates[caseIndex], activeSlide = videoSlides[videoIndex];
  return <main className="admin-shell">
    <aside className={`sidebar ${menuOpen ? "open" : ""}`}><button className="close-menu" onClick={() => setMenuOpen(false)} aria-label="Cerrar menú">×</button>
      <button className="brand" onClick={() => go("inicio")}><img src="/integr-logo.png" alt="INTEGR"/><span><b>Course OS</b><small>Administrador</small></span></button>
      <div className="side-label">NAVEGACIÓN</div><button className={`side-link ${view === "inicio" ? "selected" : ""}`} onClick={() => go("inicio")}><span>⌂</span> Resumen del curso</button>
      <div className="side-label course-label">PLAN DE 5 DÍAS <em>2 / 5</em></div><div className="day-list">{days.map((day) => <button key={day.day} disabled={!day.active && day.day !== 2} className={`day-button ${day.active || day.day === 2 ? "current" : "locked"}`} onClick={() => day.day === 2 ? go("dia2") : day.active && go("inicio")}><span className="day-number">{String(day.day).padStart(2,"0")}</span><span><b>Día {day.day}</b><small>{day.title}</small></span><i>{day.active || day.day === 2 ? "●" : "◌"}</i></button>)}</div>
      <div className="sidebar-footer"><div className="mini-progress"><span style={{width:`${progress}%`}}/></div><div><span>Progreso Día 1</span><b>{progress}%</b></div></div>
    </aside>{menuOpen && <button className="menu-backdrop" onClick={() => setMenuOpen(false)} aria-label="Cerrar menú"/>}
    <section className="workspace"><header className="topbar"><button className="menu-toggle" onClick={() => setMenuOpen(true)} aria-label="Abrir menú">☰</button><div className="crumbs"><span>Habilidades electromecánicas</span><b>/</b><strong>{view === "inicio" ? "Día 1" : sections.find((item) => item.id === view)?.label}</strong></div><div className="top-actions"><span className="live-dot">Publicado</span><button className="avatar" aria-label="Perfil del administrador">SG</button></div></header>
      {view === "inicio" && <div className="page-content dashboard"><span className="sr-only">Programa de cinco días</span>
        <div className="hero-panel"><div className="hero-copy"><div className="eyebrow"><span>DÍA 1</span> MÓDULO I · 9 HORAS</div><h1>Fundamentos<br/><em>eléctricos</em></h1><p>Una experiencia completa para comprender, calcular, medir y defender decisiones eléctricas con criterio técnico.</p><div className="hero-actions"><button className="primary" onClick={() => go("teoria")}>Abrir experiencia <span>→</span></button><a className="secondary" href="/modulo-1-dia-1.pdf" target="_blank">Ver manual del módulo ↗</a></div></div>
          <div className="hero-photo"><img src="/og-professional.png" alt="Laboratorio industrial con tablero eléctrico, multímetro y motor"/><div className="photo-caption"><span>ENTORNO DE APRENDIZAJE</span><b>Del fundamento al diagnóstico</b></div><div className="floating-reading"><small>LECTURA DE REFERENCIA</small><b>480 <span>V AC</span></b><em>3 fases · 60 Hz</em></div></div></div>
        <div className="metric-grid"><article><span className="metric-icon cyan">◎</span><div><small>CONTENIDO ACTIVO</small><b>1 de 5 días</b><p>Los próximos módulos están programados.</p></div></article><article><span className="metric-icon amber">◒</span><div><small>RUTA DEL DÍA 1</small><b>{completed.length} de 4 etapas</b><p>{progress ? "Continúa donde lo dejaste." : "Comienza con la teoría."}</p></div></article><article><span className="metric-icon green">✓</span><div><small>DEBATES RESUELTOS</small><b>{Object.keys(answers).length} de 5 casos</b><p>Decisiones guardadas en este equipo.</p></div></article></div>
        <section className="course-orientation"><div><span>CÓMO UTILIZAR ESTE DÍA</span><h2>Aprende sin perderte</h2><p>Cada etapa responde una pregunta distinta. Avanza en orden y marca tu progreso al terminar.</p></div><ol><li><span>01</span><p><b>Comprende</b>Lee la teoría visual y consulta el manual.</p></li><li><span>02</span><p><b>Observa</b>Mira la video-lección con narración.</p></li><li><span>03</span><p><b>Practica</b>Calcula con guía y recibe interpretación.</p></li><li><span>04</span><p><b>Decide</b>Defiende tu criterio en cinco casos.</p></li></ol></section>
        <section className="section-block"><div className="section-heading"><div><span>RUTA DE APRENDIZAJE</span><h2>Todo el Día 1, en orden</h2></div><p>La teoría habilita el contexto; la práctica convierte fórmulas en decisiones.</p></div><div className="learning-path">{sections.map((item,index) => <button key={item.id} onClick={() => go(item.id)} className={completed.includes(item.id)?"done":""}><span className="step-no">{item.icon}</span><span className="step-copy"><small>{item.short}</small><b>{item.label}</b><em>{item.detail}</em></span><span className="step-status">{completed.includes(item.id)?"✓":"→"}</span>{index<sections.length-1&&<i className="connector"/>}</button>)}</div></section>
      </div>}
      {view === "teoria" && <div className="page-content lesson-page theory-page"><PageIntro index="01" overline="TEORÍA INTERACTIVA · 3 SESIONES · 29 PÁGINAS" title="Fundamentos eléctricos, explicados visualmente" copy="Recorre el manual del Módulo I como una experiencia por capítulos. Cada concepto conserva su referencia exacta al PDF original."/>
        <div className="theory-studio">
          <nav className="topic-list" aria-label="Capítulos del manual">{theoryTopics.map((topic,index)=><button key={topic.title} className={index===theoryIndex?"active":""} onClick={()=>setTheoryIndex(index)}><span>{String(index+1).padStart(2,"0")}</span><div><small>{topic.session} · {topic.pages}</small><b>{topic.title}</b></div><i>{index===theoryIndex?"→":""}</i></button>)}</nav>
          <article className={`topic-stage accent-${theoryTopics[theoryIndex].color}`} key={theoryIndex}>
            <div className="topic-copy"><span>{theoryTopics[theoryIndex].eyebrow}</span><small>{theoryTopics[theoryIndex].session} · {theoryTopics[theoryIndex].pages}</small><h2>{theoryTopics[theoryIndex].title}</h2><p>{theoryTopics[theoryIndex].copy}</p><div className="plain-language"><span>EN PALABRAS SIMPLES</span><p>{theorySupport[theoryIndex].simple}</p></div><div className="topic-facts">{theoryTopics[theoryIndex].facts.map((fact,index)=><div key={fact}><span>{index+1}</span><b>{fact}</b></div>)}</div><details className="quick-check"><summary>Comprueba si lo entendiste <span>+</span></summary><p><b>{theorySupport[theoryIndex].check}</b>{theorySupport[theoryIndex].answer}</p></details></div>
            <TheoryVisual kind={theoryTopics[theoryIndex].visual}/>
            <div className="topic-controls"><button disabled={theoryIndex===0} onClick={()=>setTheoryIndex(theoryIndex-1)}>← Anterior</button><span><b>{theoryIndex+1}</b> / {theoryTopics.length}</span><button disabled={theoryIndex===theoryTopics.length-1} onClick={()=>setTheoryIndex(theoryIndex+1)}>Siguiente →</button></div>
          </article>
        </div>
        <section className="manual-banner"><div className="manual-cover"><span>MÓDULO I</span><b>Fundamentos<br/>Eléctricos</b><small>Manual completo · 29 páginas</small></div><div className="manual-summary"><span>DOCUMENTO OFICIAL DEL DÍA 1</span><h3>Consulta la teoría completa cuando la necesites</h3><p>Incluye objetivos, competencias, desarrollo teórico, ejemplos industriales, actividades guiadas, prácticas de medición y evidencias de aprendizaje para las tres sesiones.</p><div><button className="primary" onClick={()=>setManualOpen(true)}>Leer dentro del curso <span>↗</span></button><a href="/modulo-1-dia-1.pdf" target="_blank">Abrir PDF en otra pestaña</a></div></div><div className="manual-stats"><div><b>03</b><span>Sesiones</span></div><div><b>29</b><span>Páginas</span></div><div><b>09h</b><span>Duración</span></div></div></section>
        <CompletionBar done={completed.includes("teoria")} label="Marcar teoría como completada" onDone={()=>markDone("teoria")} next="Continuar a la video-lección" onNext={()=>go("video")}/>
        {manualOpen&&<div className="manual-modal" role="dialog" aria-modal="true" aria-label="Manual Módulo I"><button className="modal-backdrop" onClick={()=>setManualOpen(false)} aria-label="Cerrar manual"/><div className="pdf-window"><header><div><span>MÓDULO I · DÍA 1</span><b>Fundamentos eléctricos</b></div><a href="/modulo-1-dia-1.pdf" target="_blank">Abrir aparte ↗</a><button onClick={()=>setManualOpen(false)} aria-label="Cerrar">×</button></header><iframe title="Módulo I Día 1" src="/modulo-1-dia-1.pdf#view=FitH"/></div></div>}
      </div>}
      {view === "video" && <div className="page-content lesson-page"><PageIntro index="02" overline="VIDEO-LECCIÓN · AUDIO EN ESPAÑOL" title="De la carga al diagnóstico" copy="Una explicación visual de cinco escenas, narrada y sincronizada con los temas del manual."/><section className="lesson-video-feature"><div className="lesson-video-copy"><span>VIDEO PRINCIPAL · MÓDULO I</span><h2>Sistemas electromecánicos, explicados paso a paso</h2><p>Reproduce el video completo para obtener una vista general. Después usa las escenas interactivas para detenerte, repasar y comprobar cada concepto.</p><div><b>▶ Video completo</b><small>Usa los controles del reproductor para pausar, avanzar o abrir pantalla completa.</small></div></div><div className="lesson-video-frame"><video controls playsInline preload="metadata" poster="/og-professional.png" aria-label="Video de lección Electricidad Industrial"><source src="/electricidad-industrial.mp4" type="video/mp4"/>Tu navegador no puede reproducir este video.</video></div></section><div className="video-shell"><div className="video-stage"><div className="video-label">INTEGR · DÍA 1</div><div className="video-counter">{String(videoIndex+1).padStart(2,"0")} / 05</div><div className="video-copy"><span>{activeSlide.kicker}</span><h2>{activeSlide.title}</h2><p>{activeSlide.copy}</p></div><WaveVisual kind={activeSlide.visual}/><div className="video-controls"><button onClick={()=>setPlaying(!playing)} aria-label={playing?"Pausar":"Reproducir"}>{playing?"Ⅱ":"▶"}</button><div className="timeline">{videoSlides.map((_,index)=><button key={index} onClick={()=>{setVideoIndex(index);setPlaying(false)}} className={index<=videoIndex?"watched":""} aria-label={`Ir a escena ${index+1}`}><span/></button>)}</div><button onClick={()=>setSound(!sound)} aria-label={sound?"Silenciar":"Activar audio"}>{sound?"◖))":"◖×"}</button></div></div><div className="chapter-list">{videoSlides.map((slide,index)=><button key={slide.title} className={index===videoIndex?"active":""} onClick={()=>{setVideoIndex(index);setPlaying(false)}}><span>{String(index+1).padStart(2,"0")}</span><div><b>{slide.title}</b><small>{slide.kicker}</small></div><i>{index<videoIndex?"✓":""}</i></button>)}</div></div><section className="scene-learning" key={videoIndex}><div><span>IDEA CLAVE</span><b>{videoSupport[videoIndex].key}</b></div><div><span>EJEMPLO COTIDIANO</span><p>{videoSupport[videoIndex].example}</p></div><div><span>PIENSA ANTES DE AVANZAR</span><p>{videoSupport[videoIndex].question}</p></div></section><div className="audio-note"><span>♫</span><p><b>Narración inteligente</b>El audio utiliza la voz en español disponible en tu dispositivo. Puedes silenciarlo y recorrer las escenas manualmente.</p></div><CompletionBar done={completed.includes("video")} label="Marcar video como completado" onDone={()=>markDone("video")} next="Ir al laboratorio" onNext={()=>go("practica")}/></div>}
      {view === "practica" && <PracticeExperience completed={completed.includes("practica")} onComplete={() => !completed.includes("practica") && markDone("practica")} onNext={() => go("debate")} />}
      {view === "dia2" && <DayTwoExperience onBack={() => go("inicio")} />}
      {view === "debate" && <DebateExperience debates={debates} completed={completed.includes("debate")} onComplete={() => markDone("debate")} onBack={() => go("inicio")} />}
      <LearningCoach view={view}/>
    </section>
  </main>;
}

function PageIntro({index,overline,title,copy}:{index:string;overline:string;title:string;copy:string}){const meta:Record<string,{time:string;result:string}>={"01":{time:"6 h de aprendizaje",result:"Manual + conceptos"},"02":{time:"5 escenas · 12 min",result:"Video + audio"},"03":{time:"4 laboratorios",result:"Cálculo + criterio"},"04":{time:"5 casos · 20 min",result:"Debate + decisión"}};const info=meta[index]??meta["01"];return <header className="page-intro"><span className="big-index">{index}</span><div className="page-intro-copy"><small>{overline}</small><h1>{title}</h1><p>{copy}</p></div><aside className="page-intro-meta"><span>ESTA SECCIÓN</span><b>{info.time}</b><small>{info.result}</small></aside></header>}
function CompletionBar({done,label,onDone,next,onNext}:{done:boolean;label:string;onDone:()=>void;next:string;onNext:()=>void}){return <div className="completion-bar"><button className={done?"done":""} onClick={onDone}><span>{done?"✓":"○"}</span>{done?"Etapa completada":label}</button><button onClick={onNext}>{next} <span>→</span></button></div>}
