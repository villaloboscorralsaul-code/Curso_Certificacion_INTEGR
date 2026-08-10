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

  useEffect(() => {
    const saved = window.localStorage.getItem("integr-course-progress");
    if (saved) setCompleted(JSON.parse(saved));
  }, []);

  const progress = Math.round((completed.length / modules.length) * 75);
  const risk = useMemo(() => {
    const points = (vibration > 7 ? 2 : vibration > 4.5 ? 1 : 0) + (temperature > 85 ? 2 : temperature > 70 ? 1 : 0);
    return points >= 3 ? { label: "Crítico", action: "Detén, bloquea y diagnostica", tone: "critical" } : points >= 1 ? { label: "Atención", action: "Inspecciona alineación y rodamientos", tone: "warning" } : { label: "Estable", action: "Continúa monitoreando tendencia", tone: "stable" };
  }, [vibration, temperature]);

  const current = modules[active];

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

  return (
    <main>
      <nav className="topbar" aria-label="Navegación principal">
        <a className="brand" href="#inicio"><img src="/integr-logo.png" alt="INTEGR Ingeniería y Tecnología" /></a>
        <div className="nav-links"><a href="#ruta">Ruta</a><a href="#laboratorio">Laboratorio</a><a href="#recursos">Recursos</a></div>
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
          <div className="hero-stats"><div><strong>3</strong><span>bloques técnicos</span></div><div><strong>6</strong><span>retos de decisión</span></div><div><strong>33'</strong><span>ruta estimada</span></div></div>
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
