"use client";

import { useState, type ReactNode } from "react";
import { PageIntro, CompletionBar, SlideDeck, type Slide } from "./shared";

type Props = {
  dayLabel: string;
  moduleLabel: string;
  moduleTitle: ReactNode;
  overline: string;
  introTitle: string;
  introCopy: string;
  slides: Slide[];
  pdfHref: string;
  pdfTitle: string;
  pageCount: number;
  sessionCount: number;
  completed: boolean;
  onDone: () => void;
};

export default function TheoryStudio({ dayLabel, moduleLabel, moduleTitle, overline, introTitle, introCopy, slides, pdfHref, pdfTitle, pageCount, sessionCount, completed, onDone }: Props) {
  const [manualOpen, setManualOpen] = useState(false);

  return <div className="page-content lesson-page theory-page">
    <PageIntro index="01" overline={overline} title={introTitle} copy={introCopy} />
    <SlideDeck slides={slides} moduleLabel={moduleLabel} />
    <section className="manual-banner"><div className="manual-cover"><span>{moduleLabel}</span><b>{moduleTitle}</b><small>Manual completo · {pageCount} páginas</small></div><div className="manual-summary"><span>DOCUMENTO OFICIAL DEL {dayLabel}</span><h3>Consulta la teoría completa cuando la necesites</h3><p>Incluye objetivos, competencias, desarrollo teórico, ejemplos industriales, actividades guiadas y evidencias de aprendizaje para todas las sesiones.</p><div><button className="primary" onClick={() => setManualOpen(true)}>Leer dentro del curso <span>↗</span></button><a href={pdfHref} target="_blank">Abrir PDF en otra pestaña</a></div></div><div className="manual-stats"><div><b>{String(sessionCount).padStart(2, "0")}</b><span>Sesiones</span></div><div><b>{pageCount}</b><span>Páginas</span></div><div><b>09h</b><span>Duración</span></div></div></section>
    <CompletionBar done={completed} label="Marcar teoría como completada" onDone={onDone} />
    {manualOpen && <div className="manual-modal" role="dialog" aria-modal="true" aria-label={pdfTitle}><button className="modal-backdrop" onClick={() => setManualOpen(false)} aria-label="Cerrar manual" /><div className="pdf-window"><header><div><span>{moduleLabel} · {dayLabel}</span><b>{moduleTitle}</b></div><a href={pdfHref} target="_blank">Abrir aparte ↗</a><button onClick={() => setManualOpen(false)} aria-label="Cerrar">×</button></header><iframe title={pdfTitle} src={`${pdfHref}#view=FitH`} /></div></div>}
  </div>;
}
