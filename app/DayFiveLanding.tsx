"use client";

type Props = {
  onOpen: () => void;
  onBack: () => void;
  completed: boolean;
};

const estaciones = [
  { number: "01", label: "Estación 1", title: "Fundamentos y sistemas eléctricos", detail: "Sesiones 1 a 6 · voltaje, corriente, Ley de Ohm, AC/DC, protecciones" },
  { number: "02", label: "Estación 2", title: "Instrumentación y seguridad", detail: "Sesiones 7 a 9 · multímetro, pinza, termografía, megger" },
  { number: "03", label: "Estación 3", title: "Evaluación mecánica", detail: "Sesiones 10 a 12 · acoplamiento, reductor, lubricación, vibración, alineación" },
  { number: "04", label: "Estación 4", title: "Electrónica industrial y control", detail: "Sesiones 13 y 14 · sensores, PLC, VFD, análisis de señal" },
];

export default function DayFiveLanding({ onOpen, onBack, completed }: Props) {
  return <div className="page-content dashboard">
    <div className="hero-panel">
      <div className="hero-copy">
        <div className="eyebrow"><span>DÍA 5</span> MÓDULO VI · 4 HORAS</div>
        <h1>Proyecto<br/><em>integrador</em></h1>
        <p>Un solo caso, todo el curso: diagnostica el paro del sistema de transportación CT-401 recorriendo 4 estaciones que integran las 14 sesiones anteriores, por equipos.</p>
        <div className="hero-actions">
          <button className="primary" onClick={onOpen}>Abrir proyecto integrador <span>→</span></button>
          <a className="secondary" href="/modulo-6-dia-5.pdf" target="_blank">Ver guía del caso ↗</a>
        </div>
      </div>
      <div className="hero-photo">
        <img src="/dia4-hero.png" alt="Equipo técnico diagnosticando un sistema electromecánico industrial"/>
        <div className="photo-caption"><span>ENTORNO DE APRENDIZAJE</span><b>Del síntoma al diagnóstico integral</b></div>
        <div className="floating-reading"><small>CASO INTEGRADOR</small><b>CT<span>-401</span></b><em>Motor · reductor · PLC · VFD</em></div>
      </div>
    </div>

    <div className="metric-grid">
      <article><span className="metric-icon cyan">◎</span><div><small>CONTENIDO ACTIVO</small><b>5 de 6 días</b><p>Día 5 disponible para cursar.</p></div></article>
      <article><span className="metric-icon amber">◒</span><div><small>MODALIDAD</small><b>Práctica integradora</b><p>Sin teoría ni video: es el cierre del curso.</p></div></article>
      <article><span className="metric-icon green">✓</span><div><small>EVALUACIÓN</small><b>{completed ? "Completado" : "Pendiente"}</b><p>Checklist de evaluación · 100 puntos.</p></div></article>
    </div>

    <section className="course-orientation">
      <div><span>CÓMO UTILIZAR ESTE DÍA</span><h2>Un solo caso, cuatro estaciones</h2><p>No hay etapas separadas: el equipo recorre las 4 estaciones del mismo caso, en orden, y entrega un reporte final.</p></div>
      <ol>
        {estaciones.map((item) => <li key={item.number}><span>{item.number}</span><p><b>{item.title}</b>{item.detail}</p></li>)}
      </ol>
    </section>

    <button className="day2-back" onClick={onBack}>← Volver al resumen del Día 1</button>
  </div>;
}
