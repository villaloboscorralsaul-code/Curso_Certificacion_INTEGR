"use client";

import { PageIntro, CompletionBar } from "./shared";

export type PracticeVideo = { title: string; source: string; description: string; youtubeId: string };

type Props = {
  eyebrow: string;
  heading: string;
  subheading: string;
  videos: PracticeVideo[];
  completed: boolean;
  onComplete: () => void;
};

export default function VideoPractice({ eyebrow, heading, subheading, videos, completed, onComplete }: Props) {
  return <div className="page-content lesson-page">
    <PageIntro index="03" overline={eyebrow} title={heading} copy={subheading} metaTime={`${videos.length} videos`} metaResult="Observación guiada" />
    <div className="video-practice-grid">
      {videos.map((video) => <article key={video.youtubeId} className="video-practice-card">
        <div className="video-practice-frame"><iframe src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}`} title={video.title} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /></div>
        <div className="video-practice-copy"><span>{video.source}</span><h3>{video.title}</h3><p>{video.description}</p><a href={`https://www.youtube.com/watch?v=${video.youtubeId}`} target="_blank" rel="noreferrer">Abrir en YouTube ↗</a></div>
      </article>)}
    </div>
    <CompletionBar done={completed} label="Marcar práctica como completada" onDone={onComplete} />
  </div>;
}
