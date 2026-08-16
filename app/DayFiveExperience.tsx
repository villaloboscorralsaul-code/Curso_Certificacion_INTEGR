"use client";
import { useEffect, useRef, useState } from "react";
import DayFiveLanding from "./DayFiveLanding";
import { PageIntro, CompletionBar, ManualBanner } from "./shared";

type Tab = "overview" | "proyecto";
type Fact = { label: string; value: string; note?: string };
type FactGroup = { heading?: string; facts: Fact[] };
type Station = { id: string; code: string; sessions: string; title: string; intro: string; factGroups: FactGroup[]; noteLabel: string; noteText: string };

const stations: Station[] = [
  {
    id: "e1", code: "ESTACIÓN 1", sessions: "SESIONES 1 A 6", title: "Fundamentos y sistemas eléctricos",
    intro: "El equipo recibe el diagrama unifilar y los datos del motor M-401. Deben decidir qué variables comprobar antes de recibir las mediciones.",
    factGroups: [{ facts: [
      { label: "MOTOR M-401", value: "Trifásico · 460 V · 60 Hz", note: "15 HP · accionamiento mediante VFD · control 24 VDC" },
      { label: "L1-L2", value: "461 V" }, { label: "L2-L3", value: "458 V" }, { label: "L1-L3", value: "460 V" },
      { label: "CONTROL", value: "24.2 VDC" }, { label: "QF-401", value: "Cerrado" },
      { label: "PROTECCIÓN", value: "Normal" }, { label: "TIERRA FÍSICA", value: "Continuidad aparente" },
    ] }],
    noteLabel: "PREGUNTA CLAVE",
    noteText: "¿Existe evidencia suficiente para concluir que la falla está en la alimentación eléctrica? No basta responder sí/no: debe justificarse con las mediciones (voltaje, corriente, resistencia, Ley de Ohm, AC/DC, protecciones).",
  },
  {
    id: "e2", code: "ESTACIÓN 2", sessions: "SESIONES 7 A 9", title: "Instrumentación y seguridad",
    intro: "No se trata solo de saber usar el instrumento: se evalúa si el equipo sabe cuándo corresponde utilizarlo y bajo qué condiciones de seguridad.",
    factGroups: [{ facts: [
      { label: "VERIFICAR ALIMENTACIÓN", value: "Multímetro", note: "Variable: voltaje" },
      { label: "CORRIENTE DEL MOTOR", value: "Pinza amperimétrica", note: "Variable: corriente" },
      { label: "PUNTO CALIENTE", value: "Cámara termográfica", note: "Variable: temperatura" },
      { label: "AISLAMIENTO", value: "Megger", note: "Variable: resistencia de aislamiento" },
    ] }],
    noteLabel: "SECUENCIA DE DECISIÓN",
    noteText: "¿Qué instrumento utilizar? → ¿qué variable medir? → ¿dónde medir? → ¿qué resultado espera? → ¿qué riesgo existe? El probador de contacto también está disponible entre los instrumentos.",
  },
  {
    id: "e3", code: "ESTACIÓN 3", sessions: "SESIONES 10 A 12", title: "Evaluación mecánica",
    intro: "Ruta de inspección: motor → acoplamiento → reductor → transmisión → transportador → rodamientos → lubricación → alineación → vibración.",
    factGroups: [{ facts: [
      { label: "EVIDENCIA A CLASIFICAR", value: "Vibración perceptible en el conjunto" },
      { label: "EVIDENCIA A CLASIFICAR", value: "Temperatura elevada en un rodamiento" },
      { label: "EVIDENCIA A CLASIFICAR", value: "Presencia insuficiente de lubricante" },
      { label: "EVIDENCIA A CLASIFICAR", value: "Desgaste aparente en elemento flexible del acoplamiento" },
    ] }],
    noteLabel: "CLASIFICA CADA EVIDENCIA",
    noteText: "Condición normal — condición de vigilancia — anomalía — posible causa de falla. Error común a evitar: encontrar una anomalía mecánica no significa automáticamente que sea la causa del paro; hay que relacionarla con el síntoma original.",
  },
  {
    id: "e4", code: "ESTACIÓN 4", sessions: "SESIONES 13 Y 14", title: "Electrónica industrial y control",
    intro: "Aquí comienza el verdadero razonamiento diagnóstico: el sensor indica activación físicamente, pero la señal no llega correctamente al PLC.",
    factGroups: [
      { heading: "Estado de señales que entrega el instructor", facts: [
        { label: "PLC", value: "RUN" }, { label: "VFD", value: "READY" }, { label: "VFD FAULT", value: "OFF" }, { label: "E-STOP", value: "OK" },
        { label: "START", value: "ON" }, { label: "SENSOR S-401", value: "LED ON" }, { label: "ENTRADA PLC S-401", value: "OFF" }, { label: "RUN VFD", value: "OFF" },
      ] },
      { heading: "Hallazgos ya clasificados", facts: [
        { label: "CAUSA INMEDIATA DEL PARO", value: "Falso contacto en señal S-401" },
        { label: "ANOMALÍA DE MANTENIMIENTO", value: "Lubricación deficiente del reductor" },
        { label: "CONDICIÓN DE DETERIORO", value: "Desalineación incipiente del acoplamiento" },
      ] },
    ],
    noteLabel: "RUTA DE INVESTIGACIÓN",
    noteText: "Sensor → alimentación → salida → conector → cable → terminal → entrada PLC → lógica → salida PLC → VFD.",
  },
];

const productoFinal = ["Descripción de la falla", "Evaluación de riesgos y medidas de seguridad", "Ruta de diagnóstico utilizada", "Mediciones realizadas", "Diagnóstico eléctrico", "Diagnóstico mecánico", "Diagnóstico de instrumentación/control", "Evidencias encontradas", "Causa inmediata", "Causas contribuyentes", "Acción correctiva", "Acciones preventivas", "Prueba funcional posterior a reparación", "Conclusión técnica"];

export default function DayFiveExperience({ onBack, onProgressChange, resetToken }: { onBack: () => void; onProgressChange: (progress: number) => void; resetToken: number }) {
  const rootRef = useRef<HTMLElement>(null);
  const [tab, setTab] = useState<Tab>("overview");
  const [stationIndex, setStationIndex] = useState(0);
  const [reviewed, setReviewed] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);
  const [presenting, setPresenting] = useState(false);
  const activeStation = stations[stationIndex];

  useEffect(() => {
    try {
      const savedReviewed: string[] = JSON.parse(localStorage.getItem("integr-day5-estaciones") ?? "[]");
      const done = localStorage.getItem("integr-day5-completed") === "true";
      setReviewed(savedReviewed);
      setCompleted(done);
      onProgressChange(done ? 100 : Math.round((savedReviewed.length / stations.length) * 100));
    } catch { localStorage.removeItem("integr-day5-estaciones"); localStorage.removeItem("integr-day5-completed"); }
  }, [onProgressChange]);
  useEffect(() => { if (resetToken) { setTab("overview"); setStationIndex(0); } }, [resetToken]);
  useEffect(() => {
    const sync = () => { if (!document.fullscreenElement) setPresenting(false); };
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);

  const nav = (next: Tab) => { setTab(next); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const openStation = (index: number) => { setStationIndex(index); window.scrollTo({ top: 0, behavior: "smooth" }); };
  function markReviewed(id: string) {
    const next = reviewed.includes(id) ? reviewed : [...reviewed, id];
    setReviewed(next);
    localStorage.setItem("integr-day5-estaciones", JSON.stringify(next));
    if (!completed) onProgressChange(Math.round((next.length / stations.length) * 100));
  }
  function markDone() {
    const next = !completed;
    setCompleted(next);
    localStorage.setItem("integr-day5-completed", String(next));
    onProgressChange(next ? 100 : Math.round((reviewed.length / stations.length) * 100));
  }
  async function togglePresenting() {
    if (document.fullscreenElement) { await document.exitFullscreen(); setPresenting(false); }
    else { await rootRef.current?.requestFullscreen(); setPresenting(true); }
  }

  if (tab === "overview") return <DayFiveLanding onOpen={() => nav("proyecto")} onBack={onBack} completed={completed} />;

  const stationsDoneCount = reviewed.length;
  const stationsProgress = Math.round((stationsDoneCount / stations.length) * 100);

  return <section ref={rootRef} className={`debate-experience ${presenting ? "debate-presenting" : ""}`}>
    <header className="debate-hero"><div><span className="debate-overline">MÓDULO VI · PROYECTO INTEGRADOR</span><h1>Diagnostica el paro del CT-401</h1><p>Un solo caso, cuatro estaciones. Recorre cada una con tu equipo antes de escribir el reporte final.</p></div><button className="debate-present" onClick={togglePresenting}>{presenting ? "✕ Salir" : "⛶ Presentar"}</button></header>

    <section className="simple-card">
      <b>Caso integrador — "Paro inesperado del sistema de transportación CT-401"</b>
      <p>El sistema transportador CT-401 se detuvo durante operación normal. El operador intentó reiniciarlo desde la estación local, pero el motor principal M-401 no arrancó. La HMI indica "Sistema no disponible". Durante el turno anterior se reportaron vibraciones intermitentes y un incremento aparente de temperatura en el área del motor-reductor. No existen trabajos de mantenimiento registrados durante las últimas 24 horas.</p>
      <p><b>La gerencia de mantenimiento solicita al equipo técnico:</b> "Diagnosticar el sistema, determinar la causa o causas probables, identificar condiciones adicionales de riesgo y presentar una propuesta de intervención."</p>
    </section>

    <ManualBanner dayLabel="DÍA 5" moduleLabel="MÓDULO VI" moduleTitle={<>Proyecto<br/>integrador</>} pdfHref="/modulo-6-dia-5.pdf" pdfTitle="Módulo VI Día 5 — Guía del proyecto integrador" pageCount={6} sessionCount={4} sessionsLabel="Estaciones" badgeLabel="GUÍA OFICIAL DEL DÍA 5" summaryTitle="Consulta la guía del caso y las 4 estaciones cuando la necesites" summaryCopy="Incluye el caso integrador, los datos que entrega el instructor en cada estación y el listado del reporte final que debe entregar cada equipo." coverLabel="Guía del proyecto" checklistHref="/checklist-dia5.pdf" checklistLabel="Checklist de evaluación (100 pts)" />

    <div className="debate-progress-card"><div><span>ESTACIONES DEL PROYECTO</span><b>{stationsDoneCount} de {stations.length} estaciones revisadas</b></div><div className="debate-progress-track"><span style={{ width: `${stationsProgress}%` }} /></div><strong>{stationsProgress}%</strong></div>

    <nav className="dynamic-case-nav station-nav-4" aria-label="Estaciones del proyecto integrador">
      {stations.map((item, index) => <button key={item.id} onClick={() => openStation(index)} className={`${index === stationIndex ? "active" : ""} ${reviewed.includes(item.id) ? "answered" : ""}`}>
        <span>{String(index + 1).padStart(2, "0")}</span><div><small>{item.sessions}</small><b>{item.title}</b></div><i>{reviewed.includes(item.id) ? "✓" : "→"}</i>
      </button>)}
    </nav>

    <article key={activeStation.id} className="decision-panel">
      <div className="decision-heading"><span className="panel-kicker">{activeStation.code} · {activeStation.sessions}</span><h2>{activeStation.title}</h2><p>{activeStation.intro}</p></div>

      {activeStation.factGroups.map((group, gi) => <div key={gi}>
        {group.heading && <p style={{ fontSize: 11, fontWeight: 700, color: "#5a6b75", margin: gi === 0 ? "0 0 10px" : "22px 0 10px" }}>{group.heading}</p>}
        <div className="decision-checklist">{group.facts.map((fact, fi) => <div key={fi}><span>{fact.label}</span><b>{fact.value}</b>{fact.note && <p>{fact.note}</p>}</div>)}</div>
      </div>)}

      <div className="why-card" style={{ marginTop: 20 }}><span>{activeStation.noteLabel}</span><p>{activeStation.noteText}</p></div>

      <div className={`decision-feedback ${reviewed.includes(activeStation.id) ? "success" : "pending"}`}>
        <div className="feedback-mark">{reviewed.includes(activeStation.id) ? "✓" : String(stationIndex + 1)}</div>
        <div><span>{reviewed.includes(activeStation.id) ? "ESTACIÓN REVISADA" : "MARCA CUANDO EL EQUIPO TERMINE ESTA ESTACIÓN"}</span><p>{reviewed.includes(activeStation.id) ? "Puedes seguir con la siguiente estación cuando quieras." : "Discutan la pregunta clave con el equipo antes de avanzar."}</p></div>
        <button onClick={() => { markReviewed(activeStation.id); if (stationIndex < stations.length - 1) openStation(stationIndex + 1); }}>{reviewed.includes(activeStation.id) ? (stationIndex < stations.length - 1 ? "Siguiente estación →" : "Ir al producto final ↓") : "Marcar revisada y continuar →"}</button>
      </div>
    </article>

    <section className="section-block">
      <div className="section-heading"><div><span>PRODUCTO FINAL</span><h2>Reporte de Diagnóstico Electromecánico</h2></div><p>Cada equipo entrega un reporte con estos 14 puntos, evaluado con el checklist de 100 puntos de la guía.</p></div>
      <div className="decision-checklist">
        {productoFinal.map((item, index) => <div key={item}><span>{String(index + 1).padStart(2, "0")}</span><b>{item}</b></div>)}
      </div>
    </section>

    <CompletionBar done={completed} label="Marcar proyecto integrador como completado" onDone={markDone} />
    <footer className="debate-footer"><button onClick={() => nav("overview")}>← Volver al resumen del Día 5</button><span className={completed ? "complete" : ""}>{completed ? "✓ Proyecto integrador completado" : `Revisa las ${stations.length} estaciones y entrega el reporte para cerrar el día`}</span></footer>
  </section>;
}
