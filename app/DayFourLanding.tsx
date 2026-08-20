"use client";

export type DayFourSection = "teoria" | "video" | "practica" | "debate";

type Props = {
  onOpen: (id: DayFourSection) => void;
  onBack: () => void;
  completed: DayFourSection[];
  debateAnswers: number;
};

const items: { id: DayFourSection; number: string; short: string; label: string; detail: string }[] = [
  { id: "teoria", number: "01", short: "Manual", label: "Teoría", detail: "63 páginas · PDF oficial" },
  { id: "video", number: "02", short: "Multimedia", label: "Video-lección", detail: "Sistemas mecánicos industriales" },
  { id: "practica", number: "03", short: "Simulador", label: "Práctica", detail: "5 casos: investiga como detective antes de cambiar la pieza" },
  { id: "debate", number: "04", short: "Decisiones", label: "Debate", detail: "5 casos técnicos" },
];

export default function DayFourLanding({ onOpen, onBack, completed, debateAnswers }: Props) {
  const progress = Math.round((completed.length / items.length) * 100);

  return <div className="page-content dashboard">
    <div className="hero-panel">
      <div className="hero-copy">
        <div className="eyebrow"><span>DÍA 4</span> MÓDULO IV · 6 HORAS</div>
        <h1>Sistemas<br/><em>mecánicos</em></h1>
        <p>Del motor a la carga: acoplamientos, reductores, bombas, transportadores, ventiladores, lubricación, vibración y alineación de ejes.</p>
        <div className="hero-actions">
          <button className="primary" onClick={() => onOpen("teoria")}>Abrir experiencia <span>→</span></button>
          <a className="secondary" href="/modulo-4-dia-4.pdf" target="_blank">Ver manual del módulo ↗</a>
        </div>
      </div>
      <div className="hero-photo">
        <img src="/dia4-hero.png" alt="Módulo IV: sistemas mecánicos industriales"/>
        <div className="photo-caption"><span>ENTORNO DE APRENDIZAJE</span><b>Del síntoma a la causa raíz</b></div>
        <div className="floating-reading"><small>RUTA MECÁNICA</small><b>10<span>:1</span></b><em>Motor · acoplamiento · reductor</em></div>
      </div>
    </div>

    <div className="metric-grid">
      <article><span className="metric-icon cyan">◎</span><div><small>CONTENIDO ACTIVO</small><b>4 de 6 días</b><p>Día 4 disponible para cursar.</p></div></article>
      <article><span className="metric-icon amber">◒</span><div><small>RUTA DEL DÍA 4</small><b>{completed.length} de 4 etapas</b><p>{progress ? "Continúa donde lo dejaste." : "Comienza con la teoría."}</p></div></article>
      <article><span className="metric-icon green">✓</span><div><small>DEBATE TÉCNICO</small><b>{debateAnswers} de 5 casos</b><p>Diagnóstico mecánico y correlación de evidencias.</p></div></article>
    </div>

    <section className="course-orientation">
      <div><span>CÓMO UTILIZAR ESTE DÍA</span><h2>Aprende sin perderte</h2><p>Cada etapa responde una pregunta distinta. Avanza en orden y marca tu progreso al terminar.</p></div>
      <ol>
        <li><span>01</span><p><b>Comprende</b>Estudia la teoría y consulta el manual.</p></li>
        <li><span>02</span><p><b>Observa</b>Relaciona el video con la transmisión mecánica.</p></li>
        <li><span>03</span><p><b>Practica</b>Investiga qué medir primero y correlaciona la evidencia.</p></li>
        <li><span>04</span><p><b>Decide</b>Formula hipótesis antes de cambiar una pieza.</p></li>
      </ol>
    </section>

    <section className="section-block">
      <div className="section-heading"><div><span>RUTA DE APRENDIZAJE</span><h2>Todo el Día 4, en orden</h2></div><p>La teoría explica el sistema; la práctica convierte el síntoma en una hipótesis verificable.</p></div>
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
