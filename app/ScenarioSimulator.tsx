"use client";

import { useEffect, useRef, useState } from "react";

export type SimStep = { prompt: string; options: string[]; answer: number; feedback: string };
export type SimScenario = { code: string; title: string; situation: string; steps: SimStep[] };
type Stage = "inicio" | "paso" | "resultado";
type Props = {
  scenarios: SimScenario[];
  completed: boolean;
  onComplete: () => void;
  onBack: () => void;
  moduleLabel: string;
  storageKey: string;
  heroLabel: string;
  heroTitle: string;
  heroCopy: string;
};

export default function ScenarioSimulator({ scenarios, completed, onComplete, onBack, moduleLabel, storageKey, heroLabel, heroTitle, heroCopy }: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const [caseIndex, setCaseIndex] = useState(0);
  const [stage, setStage] = useState<Stage>("inicio");
  const [stepIndex, setStepIndex] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<string, number[]>>({});
  const [presenting, setPresenting] = useState(false);
  const activeCase = scenarios[caseIndex];
  const activeStep = activeCase.steps[stepIndex];

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) setAnswers(JSON.parse(saved));
  }, [storageKey]);
  useEffect(() => {
    const sync = () => { if (!document.fullscreenElement) setPresenting(false); };
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);

  const isCaseDone = (code: string) => { const s = scenarios.find((item) => item.code === code); return !!s && (answers[code]?.length ?? 0) === s.steps.length; };
  const doneCount = scenarios.filter((item) => isCaseDone(item.code)).length;
  const progress = Math.round((doneCount / scenarios.length) * 100);

  function openCase(index: number) {
    setCaseIndex(index);
    const existing = answers[scenarios[index].code] ?? [];
    if (existing.length >= scenarios[index].steps.length) { setStage("resultado"); setStepIndex(scenarios[index].steps.length - 1); setChoice(existing[existing.length - 1]); }
    else if (existing.length > 0) { setStage("paso"); setStepIndex(existing.length); setChoice(null); }
    else { setStage("inicio"); setStepIndex(0); setChoice(null); }
  }
  function startCase() { setStage("paso"); setStepIndex(0); setChoice(null); }
  function decide(index: number) {
    if (choice !== null) return;
    setChoice(index);
    const prev = answers[activeCase.code] ?? [];
    const next = { ...answers, [activeCase.code]: [...prev.slice(0, stepIndex), index] };
    setAnswers(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  }
  function nextStep() {
    if (stepIndex < activeCase.steps.length - 1) { setStepIndex(stepIndex + 1); setChoice(null); }
    else setStage("resultado");
  }
  function nextCase() { if (caseIndex < scenarios.length - 1) openCase(caseIndex + 1); else onComplete(); }
  async function togglePresenting() {
    if (document.fullscreenElement) { await document.exitFullscreen(); setPresenting(false); }
    else { await rootRef.current?.requestFullscreen(); setPresenting(true); }
  }

  const savedForCase = answers[activeCase.code] ?? [];
  const correctCount = savedForCase.filter((a, i) => a === activeCase.steps[i]?.answer).length;

  return <section ref={rootRef} className={`debate-experience ${presenting ? "debate-presenting" : ""}`}>
    <header className="debate-hero"><div><span className="debate-overline">{moduleLabel} · {heroLabel}</span><h1>{heroTitle}</h1><p>{heroCopy}</p></div><button className="debate-present" onClick={togglePresenting}>{presenting ? "✕ Salir" : "⛶ Presentar"}</button></header>
    <div className="debate-progress-card"><div><span>PROGRESO</span><b>{doneCount} de {scenarios.length} casos resueltos</b></div><div className="debate-progress-track"><span style={{ width: `${progress}%` }} /></div><strong>{progress}%</strong></div>
    <nav className="dynamic-case-nav" aria-label="Casos de la simulación">{scenarios.map((item, index) => <button key={item.code} onClick={() => openCase(index)} className={`${index === caseIndex ? "active" : ""} ${isCaseDone(item.code) ? "answered" : ""}`}><span>{String(index + 1).padStart(2, "0")}</span><div><small>{item.code}</small><b>{item.title}</b></div><i>{isCaseDone(item.code) ? "✓" : "→"}</i></button>)}</nav>
    <div key={`${caseIndex}-${stage}-${stepIndex}`} className="facilitator-stage">
      {stage === "inicio" && <div className="debate-launch"><span>{activeCase.code} · CASO {caseIndex + 1} DE {scenarios.length}</span><h2>{activeCase.title}</h2><p style={{ maxWidth: 680, color: "#526777", fontSize: 16, lineHeight: 1.6, margin: 0 }}>{activeCase.situation}</p><button className="debate-launch-button" onClick={startCase}>Iniciar simulación<span>▶</span></button></div>}
      {stage === "paso" && <article className="decision-panel"><div className="decision-heading"><span className="panel-kicker">PASO {stepIndex + 1} DE {activeCase.steps.length}</span><h2>{activeStep.prompt}</h2></div><div className="dynamic-options">{activeStep.options.map((option, index) => <button key={option} style={{ animationDelay: `${index * 100}ms` }} disabled={choice !== null} onClick={() => decide(index)} className={choice === null ? "" : index === activeStep.answer ? "correct" : choice === index ? "wrong" : "muted"}><span>{String.fromCharCode(65 + index)}</span><p>{option}</p><i>{choice !== null && index === activeStep.answer ? "✓" : choice === index ? "×" : ""}</i></button>)}</div>{choice !== null && <div className={`decision-feedback ${choice === activeStep.answer ? "success" : "review"}`}><div className="feedback-mark">{choice === activeStep.answer ? "✓" : "!"}</div><div><span>{choice === activeStep.answer ? "BIEN SUSTENTADO" : "REVISA EL CRITERIO"}</span><p>{activeStep.feedback}</p></div><button onClick={nextStep}>{stepIndex < activeCase.steps.length - 1 ? "Siguiente paso →" : "Ver resultado →"}</button></div>}</article>}
      {stage === "resultado" && <article className="decision-panel"><div className="decision-heading"><span className="panel-kicker">RESULTADO DEL CASO</span><h2>{activeCase.title}</h2><p>Respondiste correctamente {correctCount} de {activeCase.steps.length} pasos.</p></div><div className="decision-checklist">{activeCase.steps.map((step, i) => <div key={i}><span>PASO {i + 1}{savedForCase[i] === step.answer ? " · ✓" : " · REVISAR"}</span><b>{step.prompt}</b><p>{step.feedback}</p></div>)}</div><button className="debate-launch-button" onClick={nextCase}>{caseIndex < scenarios.length - 1 ? "Siguiente caso" : "Completar simulación"}<span>→</span></button></article>}
    </div>
    <footer className="debate-footer"><button onClick={onBack}>← Volver al resumen</button><span className={completed ? "complete" : ""}>{completed ? "✓ Simulación completada" : `Completa los ${scenarios.length} casos para cerrar la actividad`}</span></footer>
  </section>;
}
