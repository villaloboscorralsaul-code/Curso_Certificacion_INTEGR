"use client";

import { useEffect, useRef, useState } from "react";

type Stage = "inicio" | "pregunta" | "incisos";
type DebateCase = { code: string; title: string; case: string; prompt: string; lenses: string[]; options: string[]; answer: number; feedback: string };
type Props = { debates: DebateCase[]; completed: boolean; onComplete: () => void; onBack: () => void; moduleLabel?: string; storageKey?: string };

export default function DebateExperience({ debates, completed, onComplete, onBack, moduleLabel = "MÓDULO I", storageKey = "integr-day1-debates" }: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const [caseIndex, setCaseIndex] = useState(0);
  const [stage, setStage] = useState<Stage>("inicio");
  const [choice, setChoice] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [presenting, setPresenting] = useState(false);
  const activeCase = debates[caseIndex];

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) setAnswers(JSON.parse(saved));
  }, [storageKey]);
  useEffect(() => {
    const sync = () => { if (!document.fullscreenElement) setPresenting(false); };
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);

  const progress = Math.round((Object.keys(answers).length / debates.length) * 100);

  function openCase(index: number) {
    setCaseIndex(index);
    const existing = answers[debates[index].code];
    setChoice(existing ?? null);
    setStage(existing !== undefined ? "incisos" : "inicio");
  }
  function decide(index: number) {
    if (choice !== null) return;
    const next = { ...answers, [activeCase.code]: index };
    setChoice(index);
    setAnswers(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  }
  async function togglePresenting() {
    if (document.fullscreenElement) { await document.exitFullscreen(); setPresenting(false); }
    else { await rootRef.current?.requestFullscreen(); setPresenting(true); }
  }

  return <section ref={rootRef} className={`debate-experience ${presenting ? "debate-presenting" : ""}`}>
    <header className="debate-hero"><div><span className="debate-overline">{moduleLabel} · DEBATE TÉCNICO</span><h1>Casos de decisión</h1><p>Lee cada caso con tu equipo y compara su criterio con la respuesta técnica.</p></div><button className="debate-present" onClick={togglePresenting}>{presenting ? "✕ Salir" : "⛶ Presentar"}</button></header>
    <div className="debate-progress-card"><div><span>PROGRESO DEL EQUIPO</span><b>{Object.keys(answers).length} de {debates.length} casos resueltos</b></div><div className="debate-progress-track"><span style={{ width: `${progress}%` }} /></div><strong>{progress}%</strong></div>
    <nav className="dynamic-case-nav" aria-label="Casos del debate">{debates.map((item, index) => <button key={item.code} onClick={() => openCase(index)} className={`${index === caseIndex ? "active" : ""} ${answers[item.code] !== undefined ? "answered" : ""}`}><span>{String(index + 1).padStart(2, "0")}</span><div><small>{item.code}</small><b>{item.title}</b></div><i>{answers[item.code] !== undefined ? "✓" : "→"}</i></button>)}</nav>
    <div key={`${caseIndex}-${stage}`} className="facilitator-stage">
      {stage === "inicio" && <div className="debate-launch"><span>{activeCase.code} · CASO {caseIndex + 1} DE {debates.length}</span><h2>{activeCase.title}</h2><button className="debate-launch-button" onClick={() => setStage("pregunta")}>Iniciar<span>▶</span></button></div>}
      {stage === "pregunta" && <div className="debate-question"><span>{activeCase.code} · CASO {caseIndex + 1} DE {debates.length}</span><h1>{activeCase.case}</h1><button className="debate-advance-button" onClick={() => setStage("incisos")}>Avanzar<span>→</span></button></div>}
      {stage === "incisos" && <article className="decision-panel"><div className="decision-heading"><span className="panel-kicker">DECISIÓN TÉCNICA</span><h2>{activeCase.title}</h2><p>Selecciona la alternativa mejor sustentada. La primera selección queda registrada.</p></div><div className="dynamic-options">{activeCase.options.map((option, index) => <button key={option} style={{ animationDelay: `${index * 100}ms` }} disabled={choice !== null} onClick={() => decide(index)} className={choice === null ? "" : index === activeCase.answer ? "correct" : choice === index ? "wrong" : "muted"}><span>{String.fromCharCode(65 + index)}</span><p>{option}</p><i>{choice !== null && index === activeCase.answer ? "✓" : choice === index ? "×" : ""}</i></button>)}</div>{choice !== null && <div className={`decision-feedback ${choice === activeCase.answer ? "success" : "review"}`}><div className="feedback-mark">{choice === activeCase.answer ? "✓" : "!"}</div><div><span>{choice === activeCase.answer ? "DECISIÓN SÓLIDA" : "REVISA EL CRITERIO"}</span><p>{activeCase.feedback}</p></div><button onClick={() => caseIndex < debates.length - 1 ? openCase(caseIndex + 1) : onComplete()}>{caseIndex < debates.length - 1 ? "Siguiente caso →" : "Completar debate ✓"}</button></div>}</article>}
    </div>
    <footer className="debate-footer"><button onClick={onBack}>← Volver al resumen</button><span className={completed ? "complete" : ""}>{completed ? "✓ Debate completado" : `Completa los ${debates.length} casos para cerrar la actividad`}</span></footer>
  </section>;
}
