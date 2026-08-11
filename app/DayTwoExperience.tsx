"use client";
import { useEffect, useState } from "react";
import DayTwoLanding, { type DayTwoSection } from "./DayTwoLanding";
import DebateExperience from "./DebateExperience";
import TheoryStudio from "./TheoryStudio";
import VideoSlides from "./VideoSlides";
import VideoPractice, { type PracticeVideo } from "./VideoPractice";
import { SectionNav, type Slide } from "./shared";

const theorySlides: Slide[] = [
 { src: "/slides/dia2/slide-01.jpg", alt: "Sistemas Eléctricos Industriales — Portada del Módulo II" },
 { src: "/slides/dia2/slide-02.jpg", alt: "Arquitectura del Sistema Eléctrico Industrial" },
 { src: "/slides/dia2/slide-03.jpg", alt: "Transformadores: El Corazón de la Distribución" },
 { src: "/slides/dia2/slide-04.jpg", alt: "Tableros Eléctricos y Centros de Control" },
 { src: "/slides/dia2/slide-05.jpg", alt: "Protecciones Eléctricas: Tipos y Funciones" },
 { src: "/slides/dia2/slide-06.jpg", alt: "Sistemas de Puesta a Tierra" },
 { src: "/slides/dia2/slide-07.jpg", alt: "Lectura de Diagramas Unifilares" },
 { src: "/slides/dia2/slide-08.jpg", alt: "Sistemas Trifásicos en Planta" },
 { src: "/slides/dia2/slide-09.jpg", alt: "Variadores de Frecuencia (VFD)" },
 { src: "/slides/dia2/slide-10.jpg", alt: "Diagnóstico de Sistemas Eléctricos — Metodología Aplicada" },
 { src: "/slides/dia2/slide-11.jpg", alt: "Cierre del Módulo II — Lo que Llevas a Planta" },
];

type Tab = "overview" | DayTwoSection;

const module2Videos: PracticeVideo[] = [
 { youtubeId: "eqJaiEskVj0", title: "Diagrama unifilar eléctrico paso a paso", source: "PRÁCTICA · LECTURA DE UNIFILARES", description: "Reconoce cómo se representa con una sola línea el recorrido de la energía: fuente, protección, distribución y carga, tal como lo pide la Sesión 4 del manual." },
 { youtubeId: "9lAN8rdRI60", title: "Cómo interpretar un diagrama unifilar eléctrico", source: "PRÁCTICA · LECTURA DE UNIFILARES", description: "Segundo ejemplo para reforzar la lectura de fuente a carga y, en diagnóstico, de carga a fuente." },
 { youtubeId: "caHrHxKIsS8", title: "¿Qué es un Centro de Control de Motores (MCC) y qué función realiza?", source: "PRÁCTICA · TABLEROS Y MCC", description: "Identifica qué agrupa un MCC (arrancadores, contactores, protecciones) y por qué es el punto donde normalmente se aísla un motor para intervenir." },
 { youtubeId: "oba5ilvZLrQ", title: "Cómo funciona un sistema de puesta a tierra según la NOM-001-SEDE", source: "PRÁCTICA · PUESTA A TIERRA", description: "Repasa por qué la tierra no es solo 'mandar la corriente al suelo': protege personas y garantiza que las protecciones actúen ante una falla." },
 { youtubeId: "n6afWQvmizA", title: "¿Qué es un interruptor termomagnético y para qué sirve?", source: "PRÁCTICA · PROTECCIONES", description: "Observa en un dispositivo real la diferencia entre el mecanismo térmico (sobrecarga) y el magnético (cortocircuito) que viste en la teoría." },
];

const module2Debates = [
 { code: "D2-01", title: "El motor no arranca y el HMI indica MOTOR NOT READY.", case: "El operador presiona arranque y el HMI muestra 'MOTOR NOT READY'. El motor no gira y no hay alarma de falla activa visible en el tablero principal.", prompt: "Debatan por dónde empezar: ¿el problema está en la potencia, en el control o en un enclavamiento (interlock)? ¿Qué revisarían primero y por qué?", lenses: ["Fuente y protección", "Señal de habilitación", "Enclavamientos de seguridad", "Secuencia de arranque"], options: ["Forzar la salida del PLC para saltarse la condición 'not ready'.", "Verificar en orden: alimentación al variador/arrancador, señales de permisivos (paros de emergencia, guardas) y estado del PLC antes de intervenir.", "Cambiar el motor asumiendo que está dañado."], answer: 1, feedback: "Un mensaje de 'not ready' casi siempre señala un permisivo no satisfecho (paro de emergencia, guarda abierta, falla aguas arriba), no necesariamente una falla del motor. Forzar el enclavamiento oculta la causa y puede ser peligroso." },
 { code: "D2-02", title: "La banda consume 21.9 A en las tres fases y su placa indica 18 A.", case: "Las tres fases del motor de la banda transportadora miden 21.9 A de forma consistente y balanceada. La placa indica 18 A nominales. La banda sigue moviendo material sin detenerse.", prompt: "¿Una lectura balanceada y estable en las tres fases cambia el diagnóstico frente a una corriente desbalanceada? ¿Qué evidencia adicional pedirían antes de decidir?", lenses: ["Balance entre fases", "Carga mecánica real", "Tensión de alimentación", "Tendencia en el tiempo"], options: ["Ignorarlo porque está balanceado y el equipo sigue produciendo.", "Investigar causa mecánica u operativa (sobre-tensado, material extra, rodamiento), ya que el balance descarta una falla eléctrica interna pero no una sobrecarga real.", "Aumentar de inmediato el ajuste del relevador térmico para evitar el disparo."], answer: 1, feedback: "Un desbalance apuntaría a una falla eléctrica (fase, devanado); un exceso balanceado suele señalar carga mecánica real. Elevar la protección sin investigar solo retrasa la falla y arriesga el devanado." },
 { code: "D2-03", title: "Un breaker dispara después de varios minutos, no instantáneamente.", case: "El breaker principal de un tablero dispara consistentemente entre 5 y 8 minutos después de energizar, nunca de inmediato.", prompt: "¿Qué tipo de falla es compatible con un disparo retardado en vez de instantáneo? ¿Qué revisarían para diferenciar entre sobrecarga y otra causa?", lenses: ["Curva térmica vs. magnética", "Temperatura del tablero", "Carga acumulada", "Ventilación"], options: ["Concluir que es un cortocircuito y revisar aislamiento con el equipo energizado.", "Reconocer el patrón como propio de disparo térmico (sobrecarga acumulada) y medir corriente real, temperatura y ventilación antes de reenergizar.", "Cambiar el breaker por uno de mayor capacidad sin medir nada."], answer: 1, feedback: "Un disparo instantáneo sugiere cortocircuito o falla a tierra; un disparo retardado de varios minutos es la firma típica de la curva térmica ante sobrecarga sostenida. Cambiar el breaker sin medir solo posterga el problema." },
 { code: "D2-04", title: "Una terminal registra 71 °C frente a otras de 39 °C y 40 °C.", case: "Una termografía de rutina muestra una terminal de conexión a 71 °C mientras las otras dos fases del mismo circuito están a 39 °C y 40 °C, con la misma carga.", prompt: "¿Qué explica una diferencia de temperatura tan grande en una sola terminal cuando las tres fases llevan corriente similar?", lenses: ["Resistencia de contacto", "Apriete de conexión", "Corrosión u oxidación", "Riesgo de falla progresiva"], options: ["Es normal: alguna terminal siempre estará más caliente.", "Sospechar una conexión floja, corroída u oxidada que aumenta la resistencia de contacto localmente, y programar corrección antes de que falle.", "Esperar al siguiente mantenimiento programado sin registrar el hallazgo."], answer: 1, feedback: "Una temperatura muy superior en una sola terminal, con corriente similar en las tres fases, es la firma clásica de alta resistencia de contacto (conexión floja o corroída). Suele preceder una falla si no se corrige." },
 { code: "D2-05", title: "Producción pide aumentar la capacidad de la protección para evitar paros.", case: "El equipo de producción solicita subir el ajuste del relevador térmico de un motor porque los paros por sobrecarga afectan la meta de producción.", prompt: "¿Qué riesgos implica aumentar la protección sin investigar la causa del disparo? ¿Qué información necesitarían antes de aceptar o rechazar la solicitud?", lenses: ["Función real de la protección", "Causa del disparo", "Vida del devanado", "Alternativas de solución"], options: ["Aceptar el cambio porque reduce los paros inmediatos.", "Investigar primero la causa del disparo (carga, mecánica, tensión) y explicar que subir la protección solo retrasa una falla que ya se está anunciando.", "Desactivar la protección térmica temporalmente durante la producción."], answer: 1, feedback: "La protección dispara porque detecta una condición real; subirla sin investigar no elimina la causa, solo permite que el motor opere más tiempo en una condición dañina. La decisión técnica correcta es diagnosticar antes de tocar el ajuste." },
];

export default function DayTwoExperience({ onBack, onProgressChange, resetToken }: { onBack: () => void; onProgressChange: (progress: number) => void; resetToken: number }) {
 const [tab, setTab] = useState<Tab>("overview");
 const [completed, setCompleted] = useState<DayTwoSection[]>([]);
 const [debateAnswers, setDebateAnswers] = useState<Record<string, number>>({});

 function refreshDebateAnswers() { const saved = localStorage.getItem("integr-day2-debates"); setDebateAnswers(saved ? JSON.parse(saved) : {}); }
 useEffect(() => { try { const saved = localStorage.getItem("integr-day2-completed"); const next: DayTwoSection[] = saved ? JSON.parse(saved) : []; setCompleted(next); onProgressChange(Math.round((next.length / 4) * 100)); } catch { localStorage.removeItem("integr-day2-completed"); } refreshDebateAnswers(); }, [onProgressChange]);
 useEffect(() => { if (resetToken) setTab("overview"); }, [resetToken]);

 const nav = (next: Tab) => { if (next === "overview") refreshDebateAnswers(); setTab(next); window.scrollTo({ top: 0, behavior: "smooth" }); };
 const markDone = (id: DayTwoSection) => { const next = completed.includes(id) ? completed.filter((item) => item !== id) : [...completed, id]; setCompleted(next); localStorage.setItem("integr-day2-completed", JSON.stringify(next)); onProgressChange(Math.round((next.length / 4) * 100)); };

 if (tab === "overview") return <DayTwoLanding onOpen={nav} onBack={onBack} completed={completed} debateAnswers={Object.keys(debateAnswers).length} />;
 return <>
  <SectionNav active={tab} completed={completed} onSelect={nav} />
  {tab === "teoria" && <TheoryStudio dayLabel="DÍA 2" moduleLabel="MÓDULO II" moduleTitle={<>Sistemas eléctricos<br/>industriales</>} overline="TEORÍA INTERACTIVA · PRESENTACIÓN Y MANUAL" introTitle="Sistemas eléctricos industriales, explicados visualmente" introCopy="Recorre la presentación del Módulo II y consulta el manual completo cuando lo necesites." slides={theorySlides} sessionCount={3} pdfHref="/modulo-2-dia-2.pdf" pdfTitle="Módulo II Día 2" pageCount={43} completed={completed.includes("teoria")} onDone={() => markDone("teoria")} />}
  {tab === "video" && <VideoSlides overline="VIDEO-LECCIÓN" introTitle="De la fuente al diagnóstico" introCopy="Reproduce el video completo del Módulo II. Consulta la presentación y el manual en la sección de Teoría cuando quieras repasar un concepto." featureLabel="VIDEO PRINCIPAL · MÓDULO II" featureTitle="Electricidad industrial" featureCopy="Video específico del Día 2 para conectar la teoría de sistemas eléctricos industriales con equipos, protecciones y recorridos reales." videoSrc="/electricidad-industrial.mp4" poster="/day2-hero.png" videoAriaLabel="Video de Electricidad Industrial del Módulo II" completed={completed.includes("video")} onDone={() => markDone("video")} />}
  {tab === "practica" && <VideoPractice eyebrow="03 · PRÁCTICA GUIADA" heading="Reconoce los sistemas en video" subheading="Cinco videos que conectan la teoría del Módulo II con equipos y diagramas reales: unifilares, MCC, puesta a tierra y protecciones." videos={module2Videos} completed={completed.includes("practica")} onComplete={() => !completed.includes("practica") && markDone("practica")} />}
  {tab === "debate" && <DebateExperience debates={module2Debates} completed={completed.includes("debate")} onComplete={() => { if (!completed.includes("debate")) markDone("debate"); }} onBack={() => nav("overview")} moduleLabel="MÓDULO II" storageKey="integr-day2-debates" />}
 </>;
}
