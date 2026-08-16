"use client";

import type { ReactNode } from "react";
import { PageIntro, CompletionBar, SlideDeck, ManualBanner, type Slide } from "./shared";

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
  checklistHref?: string;
  checklistLabel?: string;
};

export default function TheoryStudio({ dayLabel, moduleLabel, moduleTitle, overline, introTitle, introCopy, slides, pdfHref, pdfTitle, pageCount, sessionCount, completed, onDone, checklistHref, checklistLabel }: Props) {
  return <div className="page-content lesson-page theory-page">
    <PageIntro index="01" overline={overline} title={introTitle} copy={introCopy} />
    <SlideDeck slides={slides} moduleLabel={moduleLabel} />
    <ManualBanner dayLabel={dayLabel} moduleLabel={moduleLabel} moduleTitle={moduleTitle} pdfHref={pdfHref} pdfTitle={pdfTitle} pageCount={pageCount} sessionCount={sessionCount} checklistHref={checklistHref} checklistLabel={checklistLabel} />
    <CompletionBar done={completed} label="Marcar teoría como completada" onDone={onDone} />
  </div>;
}
