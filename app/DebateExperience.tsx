"use client";

import { useEffect, useMemo, useRef, useState } from "react";
type Stage = "caso" | "debate" | "incisos";
type Stance = "detener" | "investigar" | "continuar";
type DebateCase = { code: string; title: string; case: string; prompt: string; lenses: string[]; options: string[]; answer: number; feedback: string };
type Props = { debates: DebateCase[]; completed: boolean; onComplete: () => void; onBack: () => void };

const stanceLabels: Record<Stance, string> = { detener: "Detener y proteger", investigar: "Investigar primero", continuar: "Continuar con control" };

export default function DebateExperience({ debates, completed, onComplete, onBack }: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const [caseIndex, setCaseIndex] = useState(0);
  const [stage, setStage] = useState<Stage>("caso");
  const [choice, setChoice] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [votes, setVotes] = useState<Record<string, Record<Stance, number>>>({});
  const [seconds, setSeconds] = useState(240);
  const [running, setRunning] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const activeCase = debates[caseIndex];

  useEffect(() => {
    const savedAnswers = localStorage.getItem("integr-day1-debates");
    const savedNotes = localStorage.getItem("integr-debate-notes");
    const savedVotes = localStorage.getItem("integr-debate-votes");
    if (savedAnswers) setAnswers(JSON.parse(savedAnswers));
    if (savedNotes) setNotes(JSON.parse(savedNotes));
    if (savedVotes) setVotes(JSON.parse(savedVotes));
  }, []);
  useEffect(() => {
    if (!running || seconds <= 0) return;
    const timer = window.setInterval(() => setSeconds((current) => Math.max(0, current - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [running, seconds]);
  useEffect(() => { if (seconds === 0) setRunning(false); }, [seconds]);
  useEffect(() => {
    const sync = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);
  useEffect(() => {
    document.body.style.overflow = expanded ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [expanded]);

  const progress = Math.round((Object.keys(answers).length / debates.length) * 100);
  const caseVotes = votes[activeCase.code] ?? { detener: 0, investigar: 0, continuar: 0 };
  const time = useMemo(() => `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`, [seconds]);

  function openCase(index: number) { setCaseIndex(index); setStage("caso"); setChoice(answers[debates[index].code] ?? null); setSeconds(240); setRunning(false); }
  function beginDebate() { setStage("debate"); setSeconds(240); setRunning(true); }
  function decide(index: number) { if (choice !== null) return; const next = { ...answers, [activeCase.code]: index }; setChoice(index); setAnswers(next); localStorage.setItem("integr-day1-debates", JSON.stringify(next)); }
  function saveNote(value: string) { const next = { ...notes, [activeCase.code]: value }; setNotes(next); localStorage.setItem("integr-debate-notes", JSON.stringify(next)); }
  function vote(stance: Stance) { const nextCase = { ...caseVotes, [stance]: caseVotes[stance] + 1 }; const next = { ...votes, [activeCase.code]: nextCase }; setVotes(next); localStorage.setItem("integr-debate-votes", JSON.stringify(next)); }
  function readCase() { if (!("speechSynthesis" in window)) return; speechSynthesis.cancel(); const voice = new SpeechSynthesisUtterance(`${activeCase.title}. ${activeCase.case}`); voice.lang = "es-MX"; voice.rate = 0.92; speechSynthesis.speak(voice); }
  async function toggleFullscreen() { if (document.fullscreenElement) await document.exitFullscreen(); else await rootRef.current?.requestFullscreen(); }

  return <section ref={rootRef} className={`debate-experience ${expanded ? "debate-expanded" : ""}`}>
    <header className="debate-hero"><div><span className="debate-overline">MÓDULO I · EXPERIENCIA DE DECISIÓN</span><h1>Debate técnico guiado</h1><p>Analiza el caso sin sesgos, construye argumentos y revela los incisos cuando el equipo haya fijado una postura.</p></div><div className="debate-toolbar" aria-label="Controles de visualización"><button onClick={() => setExpanded(!expanded)} aria-pressed={expanded}><span>↗</span>{expanded ? "Reducir vista" : "Vista amplia"}</button><button onClick={toggleFullscreen} aria-pressed={isFullscreen}><span>□</span>{isFullscreen ? "Salir de pantalla" : "Pantalla completa"}</button></div></header>
    <div className="debate-progress-card"><div><span>PROGRESO DEL EQUIPO</span><b>{Object.keys(answers).length} de {debates.length} casos resueltos</b></div><div className="debate-progress-track"><span style={{ width: `${progress}%` }}/></div><strong>{progress}%</strong></div>
    <details className="facilitator-guide"><summary><span>i</span>Guía para dirigir una conversación útil <small>Abrir instrucciones</small></summary><div><article><span>PASO 1</span><b>Lee sin opciones</b><p>Evita que las respuestas condicionen la primera opinión.</p></article><article><span>PASO 2</span><b>Pide evidencia</b><p>Cada postura debe mencionar un dato, riesgo o medición.</p></article><article><span>PASO 3</span><b>Escucha dos lados</b><p>Contrasta seguridad, operación, costo y confiabilidad.</p></article><article><span>PASO 4</span><b>Cierra con acción</b><p>Define qué harían, quién lo haría y qué verificarían.</p></article></div></details>
    <nav className="dynamic-case-nav" aria-label="Casos del debate">{debates.map((item, index) => <button key={item.code} onClick={() => openCase(index)} className={`${index === caseIndex ? "active" : ""} ${answers[item.code] !== undefined ? "answered" : ""}`}><span>{String(index + 1).padStart(2, "0")}</span><div><small>{item.code}</small><b>{item.title}</b></div><i>{answers[item.code] !== undefined ? "✓" : "→"}</i></button>)}</nav>
    <div className="debate-stage-rail" aria-label="Etapas del caso">{["Caso", "Debate", "Incisos"].map((label, index) => { const current = ["caso", "debate", "incisos"].indexOf(stage); return <div key={label} className={index === current ? "active" : index < current ? "done" : ""}><span>{index < current ? "✓" : index + 1}</span><b>{label}</b>{index < 2 && <i/>}</div>; })}</div>
    <div key={`${caseIndex}-${stage}`} className="facilitator-stage">
      {stage === "caso" && <article className="case-presentation"><div className="case-presentation-copy"><div className="case-meta"><span>{activeCase.code}</span><small>CASO {caseIndex + 1} DE {debates.length}</small></div><h2>{activeCase.title}</h2><p>{activeCase.case}</p><div className="hidden-options"><span>◎</span><div><b>Incisos ocultos</b><small>El equipo aún no verá posibles respuestas.</small></div></div><div className="case-actions"><button className="secondary-action" onClick={readCase}>▶ Escuchar caso</button><button className="primary-action" onClick={beginDebate}>Iniciar debate <span>→</span></button></div></div><aside className="case-brief"><span>ANTES DE DECIDIR</span><h3>Observen la evidencia</h3><ol><li><b>01</b>¿Qué hecho conocen?</li><li><b>02</b>¿Qué dato hace falta?</li><li><b>03</b>¿Qué riesgo no aceptarían?</li></ol></aside></article>}
      {stage === "debate" && <div className="debate-workspace"><article className="debate-question"><span className="panel-kicker">PREGUNTA PARA EL EQUIPO</span><h2>{activeCase.prompt}</h2><div className="lens-grid-dynamic">{activeCase.lenses.map((lens, index) => <div key={lens} style={{ animationDelay: `${index * 80}ms` }}><span>{String(index + 1).padStart(2, "0")}</span><b>{lens}</b></div>)}</div></article><aside className={`timer-card ${running ? "running" : ""} ${seconds === 0 ? "finished" : ""}`}><span>TIEMPO DE DISCUSIÓN</span><div className="timer-display">{time}</div><div className="timer-controls"><button onClick={() => setRunning(!running)} disabled={seconds === 0}>{running ? "Pausar" : seconds === 0 ? "Finalizado" : "Continuar"}</button><button onClick={() => { setSeconds(240); setRunning(false); }}>Reiniciar</button></div><small>Una voz a favor · una en contra · una conclusión</small></aside><article className="perspective-panel"><span>CAMBIEN DE PERSPECTIVA</span><div><section><small>ROL 01</small><b>Responsable de seguridad</b><p>Defiende la opción con menor exposición y explica qué control es indispensable.</p></section><section><small>ROL 02</small><b>Responsable de operación</b><p>Defiende la continuidad y define qué evidencia permitiría operar de forma controlada.</p></section></div></article><article className="stance-panel"><span>POSTURA PRELIMINAR DEL GRUPO</span><p>Voten antes de ver los incisos. No es la respuesta final.</p><div>{(Object.keys(stanceLabels) as Stance[]).map((stance) => <button key={stance} onClick={() => vote(stance)}><b>{stanceLabels[stance]}</b><span>{caseVotes[stance]}</span></button>)}</div></article><label className="notes-panel"><span>BITÁCORA DEL EQUIPO</span><textarea value={notes[activeCase.code] ?? ""} onChange={(event) => saveNote(event.target.value)} placeholder="Escriban evidencia, riesgos, desacuerdos y la conclusión del grupo…"/><small>Guardado automáticamente en este equipo</small></label><div className="reveal-row"><span>Cuando todos hayan defendido una postura, comparen su criterio con las opciones.</span><button className="primary-action" onClick={() => { setStage("incisos"); setRunning(false); }}>Mostrar incisos <span>→</span></button></div></div>}
      {stage === "incisos" && <article className="decision-panel"><div className="decision-heading"><span className="panel-kicker">DECISIÓN TÉCNICA</span><h2>{activeCase.title}</h2><p>Selecciona la alternativa mejor sustentada. La primera selección queda registrada.</p></div><div className="dynamic-options">{activeCase.options.map((option, index) => <button key={option} style={{ animationDelay: `${index * 100}ms` }} disabled={choice !== null} onClick={() => decide(index)} className={choice === null ? "" : index === activeCase.answer ? "correct" : choice === index ? "wrong" : "muted"}><span>{String.fromCharCode(65 + index)}</span><p>{option}</p><i>{choice !== null && index === activeCase.answer ? "✓" : choice === index ? "×" : ""}</i></button>)}</div>{choice !== null && <div className={`decision-feedback ${choice === activeCase.answer ? "success" : "review"}`}><div className="feedback-mark">{choice === activeCase.answer ? "✓" : "!"}</div><div><span>{choice === activeCase.answer ? "DECISIÓN SÓLIDA" : "REVISA EL CRITERIO"}</span><p>{activeCase.feedback}</p></div><button onClick={() => caseIndex < debates.length - 1 ? openCase(caseIndex + 1) : onComplete()}>{caseIndex < debates.length - 1 ? "Siguiente caso →" : "Completar debate ✓"}</button></div>}</article>}
    </div>
    <footer className="debate-footer"><button onClick={onBack}>← Volver al resumen</button><span className={completed ? "complete" : ""}>{completed ? "✓ Debate completado" : "Completa los cinco casos para cerrar la actividad"}</span></footer>
  </section>;
}
