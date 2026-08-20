"use client";

export type DaySixSection = "teoria" | "video" | "practica";

type Props = {
  onOpen: (id: DaySixSection) => void;
  onBack: () => void;
  completed: DaySixSection[];
  debateAnswers: number;
};

const items: { id: DaySixSection; number: string; short: string; label: string; detail: string }[] = [
  { id: "teoria", number: "01", short: "Manual", label: "Teoría", detail: "12 diapositivas · PDF oficial" },
  { id: "video", number: "02", short: "Multimedia", label: "Video-lección", detail: "Hidráulica industrial, explicada paso a paso" },
  { id: "practica", number: "03", short: "Decisiones", label: "Práctica", detail: "5 casos de diagnóstico hidráulico" },
];

export default function DaySixLanding({ onOpen, onBack, completed, debateAnswers }: Props) {
  const progress = Math.round((completed.length / items.length) * 100);

  return <div className="page-content dashboard">
    <div className="hero-panel">
      <div className="hero-copy">
        <div className="eyebrow"><span>DÍA 6</span> MÓDULO VII · ≈ 4 HORAS</div>
        <h1>Hidráulica<br/><em>industrial</em></h1>
        <p>Un recorrido conciso por los fundamentos de la hidráulica aplicada a planta: presión y caudal, componentes de un sistema, lectura básica de circuitos, diagnóstico de fallas comunes y seguridad con fluidos a presión.</p>
        <div className="hero-actions">
          <button className="primary" onClick={() => onOpen("teoria")}>Abrir experiencia <span>→</span></button>
          <a className="secondary" href="/modulo-7-dia-6.pdf" target="_blank">Ver manual del módulo ↗</a>
        </div>
      </div>
      <div className="hero-photo">
        <img src="/dia6-video-poster.jpg" alt="Hidráulica industrial: pizarra animada del Módulo VII"/>
        <div className="photo-caption"><span>ENTORNO DE APRENDIZAJE</span><b>De la presión a la decisión técnica</b></div>
        <div className="floating-reading"><small>PRESIÓN TÍPICA</small><b>100–350<span> bar</span></b><em>Equipo hidráulico industrial</em></div>
      </div>
    </div>

    <div className="metric-grid">
      <article><span className="metric-icon cyan">◎</span><div><small>CONTENIDO ACTIVO</small><b>6 de 6 días</b><p>Día 6 disponible para cursar.</p></div></article>
      <article><span className="metric-icon amber">◒</span><div><small>RUTA DEL DÍA 6</small><b>{completed.length} de {items.length} etapas</b><p>{progress ? "Continúa donde lo dejaste." : "Comienza con la teoría."}</p></div></article>
      <article><span className="metric-icon green">✓</span><div><small>PRÁCTICA</small><b>{debateAnswers} de 5 casos</b><p>Diagnóstico hidráulico aplicado con criterio técnico.</p></div></article>
    </div>

    <section className="course-orientation">
      <div><span>CÓMO UTILIZAR ESTE DÍA</span><h2>Conciso: teoría, video y práctica</h2><p>Cada etapa responde una pregunta distinta. Avanza en orden y marca tu progreso al terminar. Pensado para completarse en una sesión de estudio de ≈4 horas.</p></div>
      <ol>
        <li><span>01</span><p><b>Comprende</b>Recorre la presentación y consulta el manual.</p></li>
        <li><span>02</span><p><b>Observa</b>Mira la video-lección completa del módulo.</p></li>
        <li><span>03</span><p><b>Decide</b>Aplica el criterio en cinco casos de diagnóstico.</p></li>
      </ol>
    </section>

    <section className="section-block">
      <div className="section-heading"><div><span>RUTA DE APRENDIZAJE</span><h2>Todo el Día 6, en orden</h2></div><p>La teoría habilita el contexto; la práctica convierte los conceptos en decisiones.</p></div>
      <div className="learning-path">
        {items.map((item, index) => <button key={item.id} onClick={() => onOpen(item.id)} className={completed.includes(item.id) ? "done" : ""}>
          <span className="step-no">{item.number}</span>
          <span className="step-copy"><small>{item.short}</small><b>{item.label}</b><em>{item.detail}</em></span>
          <span className="step-status">{completed.includes(item.id) ? "✓" : "→"}</span>
          {index < items.length - 1 && <i className="connector"/>}
        </button>)}
      </div>
    </section>

    <button className="day2-back" onClick={onBack}>← Volver al resumen del Día 1</button>
  </div>;
}
