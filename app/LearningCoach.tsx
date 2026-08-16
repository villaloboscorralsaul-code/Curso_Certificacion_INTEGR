"use client";

import { useEffect, useState } from "react";

type View = "inicio" | "teoria" | "video" | "practica" | "debate" | "dia2" | "dia3" | "dia4" | "dia5";
type Props = { view: View };

const guides: Record<View, { title: string; purpose: string; steps: string[]; finish: string }> = {
  inicio: { title: "Tu ruta del Día 1", purpose: "Aquí ves todo lo que aprenderás y el avance que ya guardaste.", steps: ["Comienza en Teoría", "Continúa con el video", "Practica con datos", "Termina defendiendo decisiones"], finish: "Completa las cuatro etapas; puedes regresar cuando quieras." },
  teoria: { title: "Cómo estudiar la teoría", purpose: "No necesitas leer las 29 páginas de una sola vez. Aprende un concepto a la vez.", steps: ["Elige un capítulo a la izquierda", "Lee la explicación sencilla", "Observa el diagrama", "Responde la comprobación rápida"], finish: "Cuando puedas explicar el concepto con tus palabras, avanza al siguiente." },
  video: { title: "Cómo usar la video-lección", purpose: "Las cinco escenas resumen lo esencial del manual con narración.", steps: ["Activa el audio si lo deseas", "Pausa después de cada escena", "Lee la idea clave", "Responde mentalmente la pregunta"], finish: "Terminas cuando puedes relacionar las cinco ideas con una situación real." },
  practica: { title: "Cómo usar el laboratorio", purpose: "La calculadora enseña el proceso, no solo entrega un número.", steps: ["Selecciona un laboratorio", "Cambia un dato a la vez", "Observa qué cambia", "Interpreta y completa el reto"], finish: "Terminas cuando sabes qué representa el resultado y qué revisarías en campo." },
  debate: { title: "Cómo participar en el debate", purpose: "Primero construye criterio; después compara tu decisión con los incisos.", steps: ["Lee o escucha el caso", "Identifica evidencia y riesgos", "Vota una postura preliminar", "Revela los incisos y decide"], finish: "Terminas al resolver los cinco casos y explicar por qué elegiste cada respuesta." },
  dia2: { title: "Tu ruta del Día 2", purpose: "Aquí ves todo lo que aprenderás en el Módulo II y el avance que ya guardaste.", steps: ["Comienza en Teoría", "Continúa con el video", "Revisa la práctica en video", "Termina con el debate técnico"], finish: "Completa las cuatro etapas; puedes regresar cuando quieras." },
  dia3: { title: "Tu ruta del Día 3", purpose: "Aquí ves todo lo que aprenderás en el Módulo III y el avance que ya guardaste.", steps: ["Comienza en Teoría", "Continúa con el video", "Revisa la práctica en video", "Termina con el debate técnico"], finish: "Completa las cuatro etapas; puedes regresar cuando quieras." },
  dia4: { title: "Tu ruta del Día 4", purpose: "Aquí ves todo lo que aprenderás en el Módulo IV y el avance que ya guardaste.", steps: ["Comienza en Teoría", "Continúa con el video", "Revisa la práctica en video", "Termina con el debate técnico"], finish: "Completa las cuatro etapas; puedes regresar cuando quieras." },
  dia5: { title: "Tu ruta del Día 5", purpose: "El Día 5 es distinto: no hay teoría ni video, es un solo proyecto integrador por equipos.", steps: ["Lee el caso integrador del CT-401", "Recorre las 4 estaciones en orden", "Consulta la guía y el checklist cuando lo necesites", "Entrega el reporte de diagnóstico final"], finish: "Termina cuando tu equipo entregue el reporte con los 14 puntos y el instructor complete el checklist de evaluación." },
};

export default function LearningCoach({ view }: Props) {
  const [open, setOpen] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const guide = guides[view];

  useEffect(() => {
    const saved = localStorage.getItem("integr-large-text") === "true";
    setLargeText(saved); document.documentElement.classList.toggle("large-learning-text", saved);
  }, []);
  useEffect(() => { setOpen(false); }, [view]);

  function toggleText() {
    const next = !largeText; setLargeText(next);
    document.documentElement.classList.toggle("large-learning-text", next);
    localStorage.setItem("integr-large-text", String(next));
  }
  function speak() {
    if (!("speechSynthesis" in window)) return;
    speechSynthesis.cancel();
    const text = `${guide.title}. ${guide.purpose}. ${guide.steps.join(". ")}. ${guide.finish}`;
    const voice = new SpeechSynthesisUtterance(text); voice.lang = "es-MX"; voice.rate = .9; speechSynthesis.speak(voice);
  }

  return <div className={`learning-coach ${open ? "open" : ""}`}>
    {open && <aside className="coach-panel" role="dialog" aria-label="Guía de esta sección">
      <header><div><span>GUÍA RÁPIDA</span><h2>{guide.title}</h2></div><button onClick={() => setOpen(false)} aria-label="Cerrar guía">×</button></header>
      <p>{guide.purpose}</p>
      <ol>{guide.steps.map((step, index) => <li key={step}><span>{index + 1}</span><b>{step}</b></li>)}</ol>
      <div className="coach-finish"><span>✓</span><p><b>¿Cómo sé que terminé?</b>{guide.finish}</p></div>
      <button className="coach-speak" onClick={speak}>▶ Escuchar instrucciones</button>
    </aside>}
    <div className="coach-actions"><button onClick={toggleText} aria-pressed={largeText} title="Cambiar tamaño del texto"><span>Aa</span>{largeText ? "Texto normal" : "Texto grande"}</button><button className="coach-main" onClick={() => setOpen(!open)} aria-expanded={open}><span>?</span>{open ? "Cerrar ayuda" : "¿Qué hago aquí?"}</button></div>
  </div>;
}
