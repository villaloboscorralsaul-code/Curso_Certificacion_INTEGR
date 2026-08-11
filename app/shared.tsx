"use client";

import { useEffect, useRef, useState } from "react";

const introMeta: Record<string, { time: string; result: string }> = {
  "01": { time: "6 h de aprendizaje", result: "Manual + presentación" },
  "02": { time: "1 video completo", result: "Observación guiada" },
  "03": { time: "4 laboratorios", result: "Cálculo + criterio" },
  "04": { time: "5 casos · 20 min", result: "Debate + decisión" },
};

export function PageIntro({ index, overline, title, copy, metaTime, metaResult }: { index: string; overline: string; title: string; copy: string; metaTime?: string; metaResult?: string }) {
  const info = introMeta[index] ?? introMeta["01"];
  return <header className="page-intro"><span className="big-index">{index}</span><div className="page-intro-copy"><small>{overline}</small><h1>{title}</h1><p>{copy}</p></div><aside className="page-intro-meta"><span>ESTA SECCIÓN</span><b>{metaTime ?? info.time}</b><small>{metaResult ?? info.result}</small></aside></header>;
}

export function CompletionBar({ done, label, onDone }: { done: boolean; label: string; onDone: () => void }) {
  return <div className="completion-bar"><button className={done ? "done" : ""} onClick={onDone}><span>{done ? "✓" : "○"}</span>{done ? "Etapa completada" : label}</button></div>;
}

export type SectionId = "teoria" | "video" | "practica" | "debate";
const sectionItems: { id: SectionId; label: string }[] = [
  { id: "teoria", label: "Teoría" },
  { id: "video", label: "Video" },
  { id: "practica", label: "Práctica" },
  { id: "debate", label: "Debate" },
];

export function SectionNav({ active, completed, onSelect }: { active: SectionId; completed: SectionId[]; onSelect: (id: SectionId) => void }) {
  return <nav className="section-nav" aria-label="Cambiar de sección">
    {sectionItems.map((item, index) => <button key={item.id} className={`${item.id === active ? "active" : ""} ${completed.includes(item.id) ? "done" : ""}`} onClick={() => onSelect(item.id)}>
      <span>{String(index + 1).padStart(2, "0")}</span><b>{item.label}</b>{completed.includes(item.id) && <i>✓</i>}
    </button>)}
  </nav>;
}

export type Slide = { src: string; alt: string };

export function SlideDeck({ slides, moduleLabel }: { slides: Slide[]; moduleLabel: string }) {
  const rootRef = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const [presenting, setPresenting] = useState(false);
  const slide = slides[index];
  const go = (next: number) => setIndex(Math.max(0, Math.min(slides.length - 1, next)));

  useEffect(() => {
    const sync = () => { if (!document.fullscreenElement) setPresenting(false); };
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);
  useEffect(() => {
    if (!presenting) return;
    const keys = (event: KeyboardEvent) => { if (event.key === "ArrowRight") go(index + 1); if (event.key === "ArrowLeft") go(index - 1); if (event.key === "Escape") stopPresenting(); };
    window.addEventListener("keydown", keys);
    return () => window.removeEventListener("keydown", keys);
  }, [presenting, index]);

  async function startPresenting() { await rootRef.current?.requestFullscreen(); setPresenting(true); }
  async function stopPresenting() { if (document.fullscreenElement) await document.exitFullscreen(); setPresenting(false); }

  return <section ref={rootRef} className={`slide-deck ${presenting ? "slide-deck-presenting" : ""}`}>
    <div className="slide-deck-head"><span>{moduleLabel} · PRESENTACIÓN</span><b>{index + 1} / {slides.length}</b><button className="slide-deck-present" onClick={presenting ? stopPresenting : startPresenting}>{presenting ? "✕ Salir" : "⛶ Presentar"}</button></div>
    <div className="slide-deck-frame"><img src={slide.src} alt={slide.alt} /></div>
    {!presenting && <p className="slide-deck-caption">{slide.alt}</p>}
    <div className="slide-deck-controls">
      <button onClick={() => go(index - 1)} disabled={index === 0}>← Anterior</button>
      <div className="slide-deck-dots">{slides.map((item, i) => <button key={item.src} className={i === index ? "active" : ""} onClick={() => setIndex(i)} aria-label={`Ir a la diapositiva ${i + 1}`} />)}</div>
      <button onClick={() => go(index + 1)} disabled={index === slides.length - 1}>Siguiente →</button>
    </div>
  </section>;
}
