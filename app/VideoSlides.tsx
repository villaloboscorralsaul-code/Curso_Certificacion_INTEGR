"use client";

import { PageIntro, CompletionBar } from "./shared";

type Props = {
  overline: string;
  introTitle: string;
  introCopy: string;
  featureLabel: string;
  featureTitle: string;
  featureCopy: string;
  videoSrc: string;
  poster: string;
  videoAriaLabel: string;
  completed: boolean;
  onDone: () => void;
};

export default function VideoSlides({ overline, introTitle, introCopy, featureLabel, featureTitle, featureCopy, videoSrc, poster, videoAriaLabel, completed, onDone }: Props) {
  return <div className="page-content lesson-page">
    <PageIntro index="02" overline={overline} title={introTitle} copy={introCopy} />
    <section className="lesson-video-feature"><div className="lesson-video-copy"><span>{featureLabel}</span><h2>{featureTitle}</h2><p>{featureCopy}</p><div><b>▶ Video completo</b><small>Usa los controles del reproductor para pausar, avanzar o abrir pantalla completa.</small></div></div><div className="lesson-video-frame"><video controls playsInline preload="metadata" poster={poster} aria-label={videoAriaLabel}><source src={videoSrc} type="video/mp4" />Tu navegador no puede reproducir este video.</video></div></section>
    <CompletionBar done={completed} label="Marcar video como completado" onDone={onDone} />
  </div>;
}
