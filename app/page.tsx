"use client";

import { useEffect, useState } from "react";
import DebateExperience from "./DebateExperience";
import LearningCoach from "./LearningCoach";
import PracticeExperience, { day1Labs, day1InitialValues } from "./PracticeExperience";
import DayTwoExperience from "./DayTwoExperience";
import LoginGate from "./LoginGate";
import TheoryStudio from "./TheoryStudio";
import VideoSlides from "./VideoSlides";
import { SectionNav, type SectionId, type Slide } from "./shared";

const theorySlides: Slide[] = [
  { src: "/slides/dia1/slide-01.jpg", alt: "Fundamentos Eléctricos — Portada del Módulo I" },
  { src: "/slides/dia1/slide-02.jpg", alt: "La electricidad es una relación" },
  { src: "/slides/dia1/slide-03.jpg", alt: "Voltaje, Corriente y Resistencia" },
  { src: "/slides/dia1/slide-04.jpg", alt: "Ley de Ohm" },
  { src: "/slides/dia1/slide-05.jpg", alt: "Corriente Alterna vs. Corriente Directa" },
  { src: "/slides/dia1/slide-06.jpg", alt: "El Triángulo de Potencia" },
  { src: "/slides/dia1/slide-07.jpg", alt: "Factor de Potencia" },
  { src: "/slides/dia1/slide-08.jpg", alt: "Eficiencia y Pérdidas en Equipos Eléctricos" },
  { src: "/slides/dia1/slide-09.jpg", alt: "Medición Segura en Campo" },
  { src: "/slides/dia1/slide-10.jpg", alt: "Identificando Sobrecargas" },
  { src: "/slides/dia1/slide-11.jpg", alt: "Caso real: El motor que comenzó a calentarse" },
  { src: "/slides/dia1/slide-12.jpg", alt: "Cierre del Módulo I — Metodología de 6 Pasos" },
];

type View = "inicio" | "teoria" | "video" | "practica" | "debate" | "dia2";

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

const debates = [
  { code: "D1-01", title: "El motor que pide más corriente", case: "Un motor de banda marca 9.8 A en operación, aunque su placa indica 8.2 A. Producción afirma que mientras siga girando no hay problema.", prompt: "Debatan qué significa esa diferencia. ¿Es una falla eléctrica, una carga mecánica o una condición normal? ¿Qué dato falta antes de detener?", lenses: ["Riesgo para el devanado", "Carga real de la banda", "Tensión entre fases", "Tiempo y tendencia"], options: ["Aumentar el ajuste de protección para evitar paros.", "Comparar tensión, corriente por fase y carga; corregir la causa antes de cambiar protección.", "Esperar hasta que el motor se detenga por sí solo."], answer: 1, feedback: "La corriente es evidencia, no diagnóstico completo. Debe compararse con placa, balance de tensión, carga y tendencia. Cambiar la protección puede eliminar la defensa del motor sin eliminar la causa." },
  { code: "D1-02", title: "¿Un multímetro en cualquier punto?", case: "Un técnico nuevo quiere medir corriente colocando las puntas del multímetro directamente entre fase y neutro, igual que cuando mide voltaje.", prompt: "Expliquen qué diferencia existe entre una medición de voltaje en paralelo y una medición de corriente. ¿Qué podría ocurrir?", lenses: ["Impedancia del instrumento", "Conexión serie/paralelo", "Categoría de medición", "Método con pinza"], options: ["Es correcto si selecciona amperes antes de conectar.", "Solo es riesgoso en circuitos de más de 480 V.", "No hacerlo: provocaría un cortocircuito; usar conexión en serie controlada o pinza adecuada."], answer: 2, feedback: "En modo corriente el instrumento presenta muy baja impedancia. Conectarlo en paralelo puede crear un cortocircuito. El método, rango, fusible y categoría deben verificarse antes de medir." },
  { code: "D1-03", title: "kW no es lo mismo que kVA", case: "Una nueva carga necesita 72 kW y opera con factor de potencia 0.80. El equipo propone un transformador de 75 kVA porque 75 es mayor que 72.", prompt: "Debatan qué potencia debe dimensionar la infraestructura y qué margen o datos adicionales se necesitan.", lenses: ["Potencia activa", "Potencia aparente", "Factor de potencia", "Margen y demanda"], options: ["75 kVA basta porque supera los 72 kW.", "Calcular S = P/FP: la carga demanda 90 kVA antes de considerar margen.", "Multiplicar 72 × 0.80 para obtener 57.6 kVA."], answer: 1, feedback: "S = P / FP. Con 72 kW y FP 0.80, la demanda es 90 kVA. El dimensionamiento final también considera demanda, crecimiento, temperatura y criterios de ingeniería." },
  { code: "D1-04", title: "El precio de la ineficiencia", case: "Dos motores entregan 15 kW mecánicos. El motor A tiene 90% de eficiencia y el B 82%. Compras prefiere B porque cuesta menos.", prompt: "¿El precio inicial debe decidir? Comparen potencia de entrada, pérdidas, horas de uso, temperatura y costo de ciclo de vida.", lenses: ["Pérdidas en kW", "Horas anuales", "Costo de energía", "Confiabilidad"], options: ["Elegir B: ambos entregan la misma potencia.", "Comparar costo total; B consume más y disipa más calor para la misma salida.", "Elegir A únicamente porque su porcentaje es más alto."], answer: 1, feedback: "A requiere ≈16.67 kW y B ≈18.29 kW. La diferencia de ≈1.62 kW se acumula durante todas las horas de operación y también eleva la carga térmica." },
  { code: "D1-05", title: "AC o DC para el circuito de control", case: "Una modificación requiere sensores y relevadores cerca de una zona húmeda. Hay disponibles 120 V AC y una fuente de 24 V DC.", prompt: "Debatan seguridad, compatibilidad, caída de tensión, distancia, diagnóstico y comportamiento ante fallas. ¿Existe una respuesta universal?", lenses: ["Energía de contacto", "Compatibilidad de cargas", "Distancia del cable", "Protección y referencia"], options: ["Usar siempre 120 V AC porque ya está disponible.", "Usar siempre 24 V DC sin revisar corriente ni caída.", "Diseñar con evaluación de riesgo y carga; 24 V DC suele favorecer control, pero debe verificarse el circuito completo."], answer: 2, feedback: "24 V DC suele reducir exposición y es común en control, pero la elección depende de carga, distancia, caída de tensión, ambiente, aislamiento y protección. La ingeniería valida el sistema completo." }
];

export default function CourseAdmin() {
  const [view, setView] = useState<View>("inicio");
  const [completed, setCompleted] = useState<View[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [dayTwoProgress, setDayTwoProgress] = useState(0);
  const [dayTwoResetToken, setDayTwoResetToken] = useState(0);

  function refreshAnswers() { const saved = localStorage.getItem("integr-day1-debates"); setAnswers(saved ? JSON.parse(saved) : {}); }
  useEffect(() => { const saved = localStorage.getItem("integr-day1-completed"); if (saved) setCompleted(JSON.parse(saved)); refreshAnswers(); }, []);
  useEffect(() => { setSidebarCollapsed(localStorage.getItem("integr-sidebar-collapsed") === "true"); }, []);
  function toggleSidebar() { setSidebarCollapsed((current) => { const next = !current; localStorage.setItem("integr-sidebar-collapsed", String(next)); return next; }); }

  const progress = Math.round((completed.length / sections.length) * 100);
  function go(next: View) { if (next === "inicio") refreshAnswers(); setView(next); setMenuOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); }
  function markDone(id: View) { const next = completed.includes(id) ? completed.filter((item) => item !== id) : [...completed, id]; setCompleted(next); localStorage.setItem("integr-day1-completed", JSON.stringify(next)); }
  function openDayTwo() { setDayTwoResetToken((token) => token + 1); go("dia2"); }

  return <LoginGate><main className="admin-shell">
    <aside className={`sidebar ${menuOpen ? "open" : ""} ${sidebarCollapsed ? "collapsed" : ""}`}><button className="close-menu" onClick={() => setMenuOpen(false)} aria-label="Cerrar menú">×</button>
      <button className="sidebar-collapse-handle" onClick={toggleSidebar} aria-label="Ocultar menú lateral">‹</button>
      <button className="brand" onClick={() => go("inicio")}><img src="/integr-logo.png" alt="INTEGR"/><span><b>Course OS</b><small>Administrador</small></span></button>
      <div className="side-label">NAVEGACIÓN</div><button className={`side-link ${view === "inicio" ? "selected" : ""}`} onClick={() => go("inicio")}><span>⌂</span> Resumen del curso</button>
      <div className="side-label course-label">PLAN DE 5 DÍAS <em>2 / 5</em></div><div className="day-list">{days.map((day) => { const available = day.active || day.day === 2; const selected = day.day === 2 ? view === "dia2" : day.day === 1 && view !== "dia2"; return <button key={day.day} disabled={!available} className={`day-button ${selected ? "current" : available ? "available" : "locked"}`} onClick={() => day.day === 2 ? openDayTwo() : day.active && go("inicio")}><span className="day-number">{String(day.day).padStart(2,"0")}</span><span><b>Día {day.day}</b><small>{day.title}</small></span><i>{available ? "●" : "◌"}</i></button> })}</div>
      <div className="sidebar-footer"><div className="mini-progress"><span style={{width:`${view === "dia2" ? dayTwoProgress : progress}%`}}/></div><div><span>Progreso Día {view === "dia2" ? "2" : "1"}</span><b>{view === "dia2" ? dayTwoProgress : progress}%</b></div></div>
    </aside>{menuOpen && <button className="menu-backdrop" onClick={() => setMenuOpen(false)} aria-label="Cerrar menú"/>}
    <section className={`workspace ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}><header className="topbar"><button className="menu-toggle" onClick={() => setMenuOpen(true)} aria-label="Abrir menú">☰</button>{sidebarCollapsed && <button className="sidebar-expand" onClick={toggleSidebar} aria-label="Mostrar menú lateral">☰</button>}<div className="crumbs"><span>Habilidades electromecánicas</span><b>/</b><strong>{view === "inicio" ? "Día 1" : view === "dia2" ? "Día 2" : sections.find((item) => item.id === view)?.label}</strong></div><div className="top-actions"><span className="live-dot">Publicado</span><button className="avatar" aria-label="Perfil del administrador">SG</button></div></header>
      {(view === "teoria" || view === "video" || view === "practica" || view === "debate") && <SectionNav active={view as SectionId} completed={completed.filter((item): item is SectionId => item !== "inicio" && item !== "dia2")} onSelect={(id) => go(id)} />}
      {view === "inicio" && <div className="page-content dashboard"><span className="sr-only">Programa de cinco días</span>
        <div className="hero-panel"><div className="hero-copy"><div className="eyebrow"><span>DÍA 1</span> MÓDULO I · 9 HORAS</div><h1>Fundamentos<br/><em>eléctricos</em></h1><p>Una experiencia completa para comprender, calcular, medir y defender decisiones eléctricas con criterio técnico.</p><div className="hero-actions"><button className="primary" onClick={() => go("teoria")}>Abrir experiencia <span>→</span></button><a className="secondary" href="/modulo-1-dia-1.pdf" target="_blank">Ver manual del módulo ↗</a></div></div>
          <div className="hero-photo"><img src="/og-professional.png" alt="Laboratorio industrial con tablero eléctrico, multímetro y motor"/><div className="photo-caption"><span>ENTORNO DE APRENDIZAJE</span><b>Del fundamento al diagnóstico</b></div><div className="floating-reading"><small>LECTURA DE REFERENCIA</small><b>480 <span>V AC</span></b><em>3 fases · 60 Hz</em></div></div></div>
        <div className="metric-grid"><article><span className="metric-icon cyan">◎</span><div><small>CONTENIDO ACTIVO</small><b>1 de 5 días</b><p>Los próximos módulos están programados.</p></div></article><article><span className="metric-icon amber">◒</span><div><small>RUTA DEL DÍA 1</small><b>{completed.length} de 4 etapas</b><p>{progress ? "Continúa donde lo dejaste." : "Comienza con la teoría."}</p></div></article><article><span className="metric-icon green">✓</span><div><small>DEBATES RESUELTOS</small><b>{Object.keys(answers).length} de 5 casos</b><p>Decisiones guardadas en este equipo.</p></div></article></div>
        <section className="course-orientation"><div><span>CÓMO UTILIZAR ESTE DÍA</span><h2>Aprende sin perderte</h2><p>Cada etapa responde una pregunta distinta. Avanza en orden y marca tu progreso al terminar.</p></div><ol><li><span>01</span><p><b>Comprende</b>Lee la teoría visual y consulta el manual.</p></li><li><span>02</span><p><b>Observa</b>Mira la video-lección con narración.</p></li><li><span>03</span><p><b>Practica</b>Calcula con guía y recibe interpretación.</p></li><li><span>04</span><p><b>Decide</b>Defiende tu criterio en cinco casos.</p></li></ol></section>
        <section className="section-block"><div className="section-heading"><div><span>RUTA DE APRENDIZAJE</span><h2>Todo el Día 1, en orden</h2></div><p>La teoría habilita el contexto; la práctica convierte fórmulas en decisiones.</p></div><div className="learning-path">{sections.map((item,index) => <button key={item.id} onClick={() => go(item.id)} className={completed.includes(item.id)?"done":""}><span className="step-no">{item.icon}</span><span className="step-copy"><small>{item.short}</small><b>{item.label}</b><em>{item.detail}</em></span><span className="step-status">{completed.includes(item.id)?"✓":"→"}</span>{index<sections.length-1&&<i className="connector"/>}</button>)}</div></section>
      </div>}
      {view === "teoria" && <TheoryStudio dayLabel="DÍA 1" moduleLabel="MÓDULO I" moduleTitle={<>Fundamentos<br/>Eléctricos</>} overline="TEORÍA INTERACTIVA · PRESENTACIÓN Y MANUAL" introTitle="Fundamentos eléctricos, explicados visualmente" introCopy="Recorre la presentación del Módulo I y consulta el manual completo cuando lo necesites." slides={theorySlides} sessionCount={3} pdfHref="/modulo-1-dia-1.pdf" pdfTitle="Módulo I Día 1" pageCount={29} completed={completed.includes("teoria")} onDone={() => markDone("teoria")} />}
      {view === "video" && <VideoSlides overline="VIDEO-LECCIÓN" introTitle="De la carga al diagnóstico" introCopy="Reproduce el video completo del Módulo I. Consulta la presentación y el manual en la sección de Teoría cuando quieras repasar un concepto." featureLabel="VIDEO PRINCIPAL · MÓDULO I" featureTitle="Sistemas electromecánicos, explicados paso a paso" featureCopy="Reproduce el video completo para obtener una vista general de los fundamentos eléctricos aplicados a planta." videoSrc="/sistemas-electromecanicos.mp4" poster="/og-professional.png" videoAriaLabel="Video de lección Sistemas Electromecánicos" completed={completed.includes("video")} onDone={() => markDone("video")} />}
      {view === "practica" && <PracticeExperience labs={day1Labs} initialValues={day1InitialValues} storageKey="integr-practice-labs" eyebrow="03 · PRÁCTICA GUIADA" heading="Laboratorio eléctrico" subheading="Una tarea por pantalla. Comprende, calcula, interpreta y comprueba." menuLabel="ELIGE UN LABORATORIO" completed={completed.includes("practica")} onComplete={() => !completed.includes("practica") && markDone("practica")} />}
      {view === "dia2" && <DayTwoExperience onBack={() => go("inicio")} onProgressChange={setDayTwoProgress} resetToken={dayTwoResetToken} />}
      {view === "debate" && <DebateExperience debates={debates} completed={completed.includes("debate")} onComplete={() => markDone("debate")} onBack={() => go("inicio")} />}
      <LearningCoach view={view}/>
    </section>
  </main></LoginGate>;
}
