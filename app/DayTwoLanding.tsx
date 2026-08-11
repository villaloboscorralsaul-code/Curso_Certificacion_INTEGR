"use client";

export type DayTwoSection = "teoria" | "video" | "practica" | "debate";

type Props = {
  onOpen: (id: DayTwoSection) => void;
  onBack: () => void;
  completed: DayTwoSection[];
  debateAnswers: number;
};

const items: { id: DayTwoSection; number: string; short: string; label: string; detail: string }[] = [
  { id: "teoria", number: "01", short: "Manual", label: "Teoría", detail: "43 páginas · PDF oficial" },
  { id: "video", number: "02", short: "Multimedia", label: "Video-lección", detail: "Electricidad industrial" },
  { id: "practica", number: "03", short: "Videos", label: "Práctica", detail: "5 videos: unifilares, MCC, tierra, protecciones" },
  { id: "debate", number: "04", short: "Decisiones", label: "Debate", detail: "5 casos técnicos" },
];

export default function DayTwoLanding({ onOpen, onBack, completed, debateAnswers }: Props) {
  const progress = Math.round((completed.length / items.length) * 100);

  return <div className="page-content dashboard">
    <div className="hero-panel">
      <div className="hero-copy">
        <div className="eyebrow"><span>DÍA 2</span> MÓDULO II · 9 HORAS</div>
        <h1>Sistemas eléctricos<br/><em>industriales</em></h1>
        <p>Comprende cómo llega, se protege y se diagnostica la energía antes de intervenir una máquina.</p>
        <div className="hero-actions">
          <button className="primary" onClick={() => onOpen("teoria")}>Abrir experiencia <span>→</span></button>
          <a className="secondary" href="/modulo-2-dia-2.pdf" target="_blank">Ver manual del módulo ↗</a>
        </div>
      </div>
      <div className="hero-photo">
        <img src="/day2-hero.png" alt="Módulo II: sistemas eléctricos industriales"/>
        <div className="photo-caption"><span>ENTORNO DE APRENDIZAJE</span><b>De la fuente al diagnóstico</b></div>
        <div className="floating-reading"><small>RUTA INDUSTRIAL</small><b>480 <span>V AC</span></b><em>Fuente · MCC · motor</em></div>
      </div>
    </div>

    <div className="metric-grid">
      <article><span className="metric-icon cyan">◎</span><div><small>CONTENIDO ACTIVO</small><b>2 de 5 días</b><p>Día 2 disponible para cursar.</p></div></article>
      <article><span className="metric-icon amber">◒</span><div><small>RUTA DEL DÍA 2</small><b>{completed.length} de 4 etapas</b><p>{progress ? "Continúa donde lo dejaste." : "Comienza con la teoría."}</p></div></article>
      <article><span className="metric-icon green">✓</span><div><small>DEBATE TÉCNICO</small><b>{debateAnswers} de 5 casos</b><p>Diagnóstico y seguridad eléctrica.</p></div></article>
    </div>

    <section className="course-orientation">
      <div><span>CÓMO UTILIZAR ESTE DÍA</span><h2>Aprende sin perderte</h2><p>Cada etapa responde una pregunta distinta. Avanza en orden y marca tu progreso al terminar.</p></div>
      <ol>
        <li><span>01</span><p><b>Comprende</b>Estudia la teoría y consulta el manual.</p></li>
        <li><span>02</span><p><b>Observa</b>Relaciona el video con la instalación.</p></li>
        <li><span>03</span><p><b>Practica</b>Reconoce equipos y diagramas en video.</p></li>
        <li><span>04</span><p><b>Decide</b>Defiende tu criterio técnico.</p></li>
      </ol>
    </section>

    <section className="section-block">
      <div className="section-heading"><div><span>RUTA DE APRENDIZAJE</span><h2>Todo el Día 2, en orden</h2></div><p>La teoría explica el sistema; la práctica convierte el diagrama en decisiones seguras.</p></div>
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
