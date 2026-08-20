"use client";
import { useEffect, useState } from "react";
import DaySixLanding, { type DaySixSection } from "./DaySixLanding";
import DebateExperience from "./DebateExperience";
import TheoryStudio from "./TheoryStudio";
import VideoSlides from "./VideoSlides";
import { type Slide } from "./shared";

const sectionItems: { id: DaySixSection; label: string }[] = [
  { id: "teoria", label: "Teoría" },
  { id: "video", label: "Video" },
  { id: "practica", label: "Práctica" },
];

function DaySixNav({ active, completed, onSelect }: { active: DaySixSection; completed: DaySixSection[]; onSelect: (id: DaySixSection) => void }) {
  return <nav className="section-nav" aria-label="Cambiar de sección">
    {sectionItems.map((item, index) => <button key={item.id} className={`${item.id === active ? "active" : ""} ${completed.includes(item.id) ? "done" : ""}`} onClick={() => onSelect(item.id)}>
      <span>{String(index + 1).padStart(2, "0")}</span><b>{item.label}</b>{completed.includes(item.id) && <i>✓</i>}
    </button>)}
  </nav>;
}

const theorySlides: Slide[] = [
  { src: "/slides/dia6/slide-01.jpg", alt: "Hidráulica Industrial — Portada del Módulo VII" },
  { src: "/slides/dia6/slide-02.jpg", alt: "Presión y caudal: dos variables, dos preguntas distintas" },
  { src: "/slides/dia6/slide-03.jpg", alt: "Principio de Pascal — multiplicar fuerza en un fluido confinado" },
  { src: "/slides/dia6/slide-04.jpg", alt: "Potencia hidráulica y unidades" },
  { src: "/slides/dia6/slide-05.jpg", alt: "Componentes principales: depósito, filtro, bomba" },
  { src: "/slides/dia6/slide-06.jpg", alt: "Válvulas: de alivio, direccional y reguladora de caudal" },
  { src: "/slides/dia6/slide-07.jpg", alt: "Actuadores: cilindros, motores hidráulicos y acumulador" },
  { src: "/slides/dia6/slide-08.jpg", alt: "Ruta del fluido en un circuito completo" },
  { src: "/slides/dia6/slide-09.jpg", alt: "Cómo leer un circuito: líneas de presión, retorno y dren" },
  { src: "/slides/dia6/slide-10.jpg", alt: "Fallas comunes en sistemas hidráulicos" },
  { src: "/slides/dia6/slide-11.jpg", alt: "Seguridad: presión de trabajo, inyección de fluido, LOTO" },
  { src: "/slides/dia6/slide-12.jpg", alt: "Cierre del Módulo VII — resumen y regla de oro" },
];

type Tab = "overview" | DaySixSection;

const referenceVideos = [
  { id: "TaLDbcR4Pek", title: "Cómo funciona un power pack hidráulico", caption: "Animación 3D del recorrido completo del fluido: depósito, bomba, válvulas y actuador." },
  { id: "qlR4ZvCup9A", title: "Mecánica de un cilindro hidráulico", caption: "Vista interna animada de cómo un cilindro convierte presión en fuerza y movimiento." },
  { id: "vGXjZNmK8ps", title: "Cómo funciona una válvula direccional", caption: "Explica cómo una válvula direccional dirige el flujo hacia avance, retroceso o neutro." },
];

const debates = [
  { code: "H-01", title: "El cilindro que perdió fuerza", case: "Un cilindro de prensa hidráulica que normalmente cierra con firmeza ahora avanza, pero se detiene antes de completar el ciclo y no logra la fuerza necesaria. La bomba suena normal y el nivel de aceite está correcto.", prompt: "¿Qué deberían revisar primero: la bomba, la válvula de alivio o el propio cilindro? ¿Qué evidencia ayuda a decidir?", lenses: ["Fuga interna vs. fuga externa", "Ajuste de la válvula de alivio", "Desgaste de sellos del cilindro", "Presión disponible vs. presión requerida"], options: ["Cambiar la bomba de inmediato porque es el componente más caro y crítico.", "Medir la presión en el manómetro durante el ciclo: si no alcanza el valor esperado, comparar válvula de alivio y posible fuga interna en el cilindro antes de intervenir la bomba.", "Aumentar el ajuste de la válvula de alivio hasta que el cilindro cierre con fuerza."], answer: 1, feedback: "Sin medir presión real durante el ciclo, cambiar la bomba es una suposición cara. La secuencia correcta es medir, comparar contra el valor esperado y correlacionar con válvula de alivio y sellos del cilindro antes de reemplazar el componente más costoso." },
  { code: "H-02", title: "Ruido de 'canicas' en la bomba", case: "Una bomba hidráulica empieza a producir un ruido agudo, como canicas dentro de una lata, poco después de que mantenimiento cambió el filtro de succión por uno de menor capacidad disponible en almacén.", prompt: "¿Qué fenómeno describe mejor este ruido? ¿Qué relación tiene con el cambio de filtro?", lenses: ["Cavitación por restricción de succión", "Capacidad de flujo del filtro", "Formación de burbujas de vapor", "Daño acumulativo a la bomba"], options: ["Es ruido normal de una bomba nueva y desaparecerá solo.", "Es probable cavitación: el filtro de menor capacidad restringe la succión, la bomba no recibe suficiente fluido y se forman burbujas que colapsan dentro de ella.", "Es un problema eléctrico del motor que impulsa la bomba."], answer: 1, feedback: "Un filtro de succión con menor capacidad que la requerida restringe el flujo hacia la bomba. Esto genera baja presión en la succión, formación de burbujas de vapor y su colapso violento (cavitación), que además daña la bomba si continúa operando así." },
  { code: "H-03", title: "El sistema que se calienta cada tarde", case: "Una máquina hidráulica trabaja con normalidad en la mañana, pero cada tarde el aceite alcanza temperaturas muy por encima de lo habitual y un operador reporta que 'huele a aceite caliente'. El nivel de fluido es correcto y no hay fugas visibles.", prompt: "¿Qué condiciones pueden elevar la temperatura de un sistema hidráulico sin que haya fuga ni bajo nivel de aceite?", lenses: ["Derivación continua por la válvula de alivio", "Estado del enfriador/radiador", "Viscosidad del fluido para la temporada", "Presión de trabajo mal ajustada"], options: ["Es normal que el aceite se caliente por la tarde debido al clima; no requiere atención.", "Revisar si la válvula de alivio está derivando de forma continua, el estado del enfriador y si el fluido tiene la viscosidad adecuada, antes de asumir que es solo el clima.", "Agregar más aceite al depósito para 'diluir' el calor."], answer: 1, feedback: "El calor en un sistema hidráulico casi siempre indica energía que se está perdiendo en forma de calor: una válvula de alivio derivando de forma continua, un enfriador sucio o restringido, o un fluido con viscosidad inadecuada. Subir el nivel de aceite no corrige la causa." },
  { code: "H-04", title: "'Solo es una gotita, la reviso con la mano'", case: "Un técnico nota una fuga muy fina, casi invisible, en una manguera de alta presión y se dispone a pasar la mano cerca para 'sentir' de dónde sale, mientras el sistema sigue presurizado.", prompt: "¿Por qué esta práctica es peligrosa aunque la fuga parezca mínima? ¿Qué debería hacer el técnico en su lugar?", lenses: ["Presión de trabajo del sistema", "Riesgo de inyección de fluido bajo la piel", "Método seguro para localizar una fuga", "Procedimiento antes de intervenir"], options: ["No hay riesgo real si la fuga es pequeña y el técnico tiene experiencia.", "Una fuga fina a alta presión puede inyectar fluido bajo la piel sin dejar una herida visible; debe despresurizar el sistema y usar cartón o papel, nunca la mano, para localizarla.", "Debe taponar la fuga con un trapo mientras el sistema sigue en operación."], answer: 1, feedback: "A presiones industriales típicas (100–350 bar), una fuga fina puede inyectar fluido bajo la piel sin causar una herida visible externamente, lo cual retrasa la atención médica y agrava el daño. La forma segura de localizar una fuga es con cartón o papel, y solo después de despresurizar y aplicar bloqueo y etiquetado." },
  { code: "H-05", title: "Movimiento a saltos después del mantenimiento", case: "Después de reemplazar una manguera, el cilindro de una máquina se mueve 'a saltos' en lugar de un movimiento suave, aunque la presión en el manómetro parece normal.", prompt: "¿Qué relación puede tener el mantenimiento reciente con este síntoma? ¿Qué hipótesis deberían probar primero?", lenses: ["Aire atrapado tras el mantenimiento", "Procedimiento de purgado", "Desgaste interno variable", "Relación entre causa y momento de aparición"], options: ["Cambiar el cilindro completo, ya que el movimiento irregular indica que está dañado.", "Sospechar aire atrapado introducido durante el cambio de manguera y purgar el sistema siguiendo el procedimiento antes de intervenir el cilindro.", "Aumentar la presión del sistema para forzar un movimiento más firme."], answer: 1, feedback: "El aire es compresible y el aceite no: cuando queda aire atrapado en el circuito (frecuente después de abrir líneas), el actuador se mueve de forma errática o 'a saltos'. Como el síntoma apareció justo después del mantenimiento, purgar el aire es la hipótesis prioritaria antes de intervenir el cilindro." },
];

export default function DaySixExperience({ onBack, onProgressChange, resetToken }: { onBack: () => void; onProgressChange: (progress: number) => void; resetToken: number }) {
  const [tab, setTab] = useState<Tab>("overview");
  const [completed, setCompleted] = useState<DaySixSection[]>([]);
  const [debateAnswers, setDebateAnswers] = useState<Record<string, number>>({});

  function refreshDebateAnswers() { const saved = localStorage.getItem("integr-day6-debates"); setDebateAnswers(saved ? JSON.parse(saved) : {}); }
  useEffect(() => { try { const saved = localStorage.getItem("integr-day6-completed"); const next: DaySixSection[] = saved ? JSON.parse(saved) : []; setCompleted(next); onProgressChange(Math.round((next.length / 3) * 100)); } catch { localStorage.removeItem("integr-day6-completed"); } refreshDebateAnswers(); }, [onProgressChange]);
  useEffect(() => { if (resetToken) setTab("overview"); }, [resetToken]);

  const nav = (next: Tab) => { if (next === "overview") refreshDebateAnswers(); setTab(next); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const markDone = (id: DaySixSection) => { const next = completed.includes(id) ? completed.filter((item) => item !== id) : [...completed, id]; setCompleted(next); localStorage.setItem("integr-day6-completed", JSON.stringify(next)); onProgressChange(Math.round((next.length / 3) * 100)); };

  if (tab === "overview") return <DaySixLanding onOpen={nav} onBack={onBack} completed={completed} debateAnswers={Object.keys(debateAnswers).length} />;
  return <>
    <DaySixNav active={tab as DaySixSection} completed={completed} onSelect={nav} />
    {tab === "teoria" && <>
      <TheoryStudio dayLabel="DÍA 6" moduleLabel="MÓDULO VII" moduleTitle={<>Hidráulica<br/>industrial</>} overline="TEORÍA INTERACTIVA · PRESENTACIÓN Y MANUAL" introTitle="Hidráulica industrial, explicada visualmente" introCopy="Recorre la presentación del Módulo VII y consulta el manual completo cuando lo necesites." slides={theorySlides} sessionCount={1} pdfHref="/modulo-7-dia-6.pdf" pdfTitle="Módulo VII Día 6" pageCount={11} completed={completed.includes("teoria")} onDone={() => markDone("teoria")} />
      <div className="page-content" style={{ paddingTop: 0 }}>
        <section className="section-block">
          <div className="section-heading"><div><span>RECURSOS ADICIONALES</span><h2>Videos de referencia</h2></div><p>Animaciones 3D que refuerzan los conceptos de esta sesión.</p></div>
          <div className="video-resources">
            {referenceVideos.map((video) => <article key={video.id}>
              <div className="video-resources-frame"><iframe src={`https://www.youtube.com/embed/${video.id}`} title={video.title} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /></div>
              <b>{video.title}</b>
              <p>{video.caption}</p>
            </article>)}
          </div>
        </section>
      </div>
    </>}
    {tab === "video" && <VideoSlides overline="VIDEO-LECCIÓN" introTitle="De la presión a la decisión técnica" introCopy="Reproduce el video completo del Módulo VII. Consulta la presentación y el manual en la sección de Teoría cuando quieras repasar un concepto." featureLabel="VIDEO PRINCIPAL · MÓDULO VII" featureTitle="Hidráulica industrial, explicada paso a paso" featureCopy="Reproduce el video completo para repasar presión, caudal, componentes, lectura de circuitos, diagnóstico y seguridad hidráulica." videoSrc="/hidraulica-industrial.mp4" poster="/dia6-video-poster.jpg" videoAriaLabel="Video de lección Hidráulica Industrial del Módulo VII" completed={completed.includes("video")} onDone={() => markDone("video")} />}
    {tab === "practica" && <DebateExperience debates={debates} completed={completed.includes("practica")} onComplete={() => { if (!completed.includes("practica")) markDone("practica"); }} onBack={() => nav("overview")} moduleLabel="MÓDULO VII · HIDRÁULICA" storageKey="integr-day6-debates" />}
  </>;
}
