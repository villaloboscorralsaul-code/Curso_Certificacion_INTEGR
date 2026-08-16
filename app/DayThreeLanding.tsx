"use client";

export type DayThreeSection = "teoria" | "video" | "practica" | "debate";

type Props = {
  onOpen: (id: DayThreeSection) => void;
  onBack: () => void;
  completed: DayThreeSection[];
  debateAnswers: number;
};

const items: { id: DayThreeSection; number: string; short: string; label: string; detail: string }[] = [
  { id: "teoria", number: "01", short: "Manual", label: "Teoría", detail: "29 páginas · PDF oficial" },
  { id: "video", number: "02", short: "Multimedia", label: "Video-lección", detail: "Instrumentación y seguridad eléctrica" },
  { id: "practica", number: "03", short: "Simulador", label: "Práctica", detail: "5 casos: elige instrumento, seguridad y decisión" },
  { id: "debate", number: "04", short: "Decisiones", label: "Debate", detail: "5 casos técnicos" },
];

export default function DayThreeLanding({ onOpen, onBack, completed, debateAnswers }: Props) {
  const progress = Math.round((completed.length / items.length) * 100);

  return <div className="page-content dashboard">
    <div className="hero-panel">
      <div className="hero-copy">
        <div className="eyebrow"><span>DÍA 3</span> MÓDULO III · 6 HORAS</div>
        <h1>Instrumentación<br/><em>y seguridad</em></h1>
        <p>Selecciona y utiliza instrumentos de medición con criterio técnico, interpreta termografías y pruebas de aislamiento, y reconoce los riesgos de intervenir un sistema eléctrico.</p>
        <div className="hero-actions">
          <button className="primary" onClick={() => onOpen("teoria")}>Abrir experiencia <span>→</span></button>
          <a className="secondary" href="/modulo-3-dia-3.pdf" target="_blank">Ver manual del módulo ↗</a>
        </div>
      </div>
      <div className="hero-photo">
        <img src="/dia3-hero.png" alt="Módulo III: instrumentación y seguridad eléctrica"/>
        <div className="photo-caption"><span>ENTORNO DE APRENDIZAJE</span><b>De la medición a la decisión segura</b></div>
        <div className="floating-reading"><small>SECUENCIA DE DIAGNÓSTICO</small><b>CAT <span>III · 600V</span></b><em>Instrumento · seguridad · medición</em></div>
      </div>
    </div>

    <div className="metric-grid">
      <article><span className="metric-icon cyan">◎</span><div><small>CONTENIDO ACTIVO</small><b>3 de 5 días</b><p>Día 3 disponible para cursar.</p></div></article>
      <article><span className="metric-icon amber">◒</span><div><small>RUTA DEL DÍA 3</small><b>{completed.length} de 4 etapas</b><p>{progress ? "Continúa donde lo dejaste." : "Comienza con la teoría."}</p></div></article>
      <article><span className="metric-icon green">✓</span><div><small>DEBATE TÉCNICO</small><b>{debateAnswers} de 5 casos</b><p>Medición, diagnóstico y seguridad.</p></div></article>
    </div>

    <section className="course-orientation">
      <div><span>CÓMO UTILIZAR ESTE DÍA</span><h2>Aprende sin perderte</h2><p>Cada etapa responde una pregunta distinta. Avanza en orden y marca tu progreso al terminar.</p></div>
      <ol>
        <li><span>01</span><p><b>Comprende</b>Estudia la teoría y consulta el manual.</p></li>
        <li><span>02</span><p><b>Observa</b>Relaciona el video con instrumentos y procedimientos reales.</p></li>
        <li><span>03</span><p><b>Practica</b>Elige el instrumento, la seguridad y la interpretación correctos.</p></li>
        <li><span>04</span><p><b>Decide</b>Defiende tu criterio técnico y de seguridad.</p></li>
      </ol>
    </section>

    <section className="section-block">
      <div className="section-heading"><div><span>RUTA DE APRENDIZAJE</span><h2>Todo el Día 3, en orden</h2></div><p>La teoría explica el instrumento; la práctica convierte la medición en una decisión segura.</p></div>
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
