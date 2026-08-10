"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type LabId = "ohm" | "potencia" | "eficiencia" | "perdidas";
type Phase = "observar" | "calcular" | "interpretar" | "reto";
type Props = { completed: boolean; onComplete: () => void; onNext: () => void };
type Lab = { code: string; icon: string; title: string; question: string; simple: string; scenario: string; formula: string; use: string; fields: { key: string; label: string; unit: string; help: string }[]; challenge: string; expected: number; tolerance: number; challengeUnit: string; hint: string };

const phases: { id: Phase; label: string; verb: string }[] = [
  { id: "observar", label: "Comprende el caso", verb: "Observar" }, { id: "calcular", label: "Trabaja los datos", verb: "Calcular" },
  { id: "interpretar", label: "Da sentido al número", verb: "Interpretar" }, { id: "reto", label: "Comprueba lo aprendido", verb: "Resolver" },
];

const labs: Record<LabId, Lab> = {
  ohm: { code: "LAB 01", icon: "V÷Ω", title: "Ley de Ohm", question: "¿Cuánta corriente circulará?", simple: "El voltaje empuja la corriente y la resistencia limita su paso.", scenario: "Un calentador industrial se conecta a una fuente de 230 V. Su resistencia es de 28.75 Ω. Antes de energizarlo, necesitamos estimar la corriente.", formula: "I = V ÷ R", use: "Anticipar corriente y compararla con la placa, el conductor y la protección.", fields: [{ key: "voltage", label: "Voltaje disponible", unit: "V", help: "El empuje eléctrico de la fuente." }, { key: "resistance", label: "Resistencia de la carga", unit: "Ω", help: "La oposición de la carga al paso de corriente." }], challenge: "Si conectas una resistencia de 20 Ω a 120 V, ¿cuánta corriente circulará?", expected: 6, tolerance: .05, challengeUnit: "A", hint: "Divide 120 entre 20." },
  potencia: { code: "LAB 02", icon: "kW", title: "Potencia activa", question: "¿Cuánta energía se convierte en trabajo?", simple: "La potencia activa es la parte de la energía eléctrica que realmente produce trabajo.", scenario: "Una carga opera a 230 V, consume 10 A y tiene factor de potencia 0.86. Queremos estimar la potencia activa que utiliza.", formula: "P = V × I × FP ÷ 1000", use: "Estimar consumo y comparar condiciones de operación de una carga.", fields: [{ key: "voltage", label: "Voltaje medido", unit: "V", help: "Tensión presente durante la medición." }, { key: "current", label: "Corriente medida", unit: "A", help: "Carga eléctrica que circula." }, { key: "pf", label: "Factor de potencia", unit: "FP", help: "Proporción entre potencia útil y demanda total." }], challenge: "Una carga opera a 200 V, 5 A y FP 0.80. ¿Cuál es su potencia activa?", expected: .8, tolerance: .02, challengeUnit: "kW", hint: "Multiplica 200 × 5 × 0.80 y divide entre 1000." },
  eficiencia: { code: "LAB 03", icon: "η", title: "Eficiencia", question: "¿Qué porcentaje llega al trabajo útil?", simple: "La máquina recibe energía, aprovecha una parte y pierde otra como calor, fricción o ruido.", scenario: "Un motor recibe 18.5 kW y entrega 15 kW en su eje. Queremos saber qué porcentaje de la entrada se convierte en salida útil.", formula: "η = P salida ÷ P entrada × 100", use: "Comparar equipos y detectar aumento de pérdidas o deterioro.", fields: [{ key: "input", label: "Potencia de entrada", unit: "kW", help: "Todo lo que el equipo recibe." }, { key: "output", label: "Potencia útil de salida", unit: "kW", help: "La parte transformada en trabajo útil." }], challenge: "Una máquina recibe 10 kW y entrega 8.5 kW. ¿Cuál es su eficiencia?", expected: 85, tolerance: .1, challengeUnit: "%", hint: "Divide 8.5 entre 10 y multiplica por 100." },
  perdidas: { code: "LAB 04", icon: "I²R", title: "Pérdidas en cable", question: "¿Cuánta potencia termina como calor?", simple: "La corriente y la resistencia del cable producen calor. La corriente influye al cuadrado.", scenario: "Un circuito conduce 10 A por 120 m. El conductor presenta 0.00115 Ω por metro. Calcularemos la pérdida considerando ida y vuelta.", formula: "P pérdida = I² × R/m × distancia × 2 ÷ 1000", use: "Analizar calentamiento, longitud y selección del conductor.", fields: [{ key: "current", label: "Corriente", unit: "A", help: "Valor que circula por el conductor." }, { key: "distance", label: "Distancia de ida", unit: "m", help: "La fórmula considera ida y regreso." }, { key: "cableR", label: "Resistencia por metro", unit: "Ω/m", help: "Dato propio del material y calibre." }], challenge: "Con 10 A, 100 m y 0.001 Ω/m, ¿cuántos kW se pierden?", expected: .02, tolerance: .002, challengeUnit: "kW", hint: "Calcula 10² × 0.001 × 100 × 2 ÷ 1000." },
};

const initialValues: Record<string, string> = { voltage: "230", resistance: "28.75", current: "10", pf: "0.86", input: "18.5", output: "15", distance: "120", cableR: "0.00115" };

export default function PracticeExperience({ completed, onComplete, onNext }: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const [labId, setLabId] = useState<LabId>("ohm");
  const [phase, setPhase] = useState<Phase>("observar");
  const [values, setValues] = useState(initialValues);
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [finishedLabs, setFinishedLabs] = useState<LabId[]>([]);
  const lab = labs[labId];
  const phaseIndex = phases.findIndex((item) => item.id === phase);

  useEffect(() => { const saved = localStorage.getItem("integr-practice-labs"); if (saved) setFinishedLabs(JSON.parse(saved)); }, []);
  useEffect(() => { const sync = () => setFullscreen(Boolean(document.fullscreenElement)); document.addEventListener("fullscreenchange", sync); return () => document.removeEventListener("fullscreenchange", sync); }, []);
  useEffect(() => { document.body.style.overflow = expanded ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [expanded]);
  useEffect(() => {
    if (!expanded && !fullscreen) return;
    const keys = (event: KeyboardEvent) => { if (event.key === "ArrowRight") move(1); if (event.key === "ArrowLeft") move(-1); };
    window.addEventListener("keydown", keys); return () => window.removeEventListener("keydown", keys);
  });

  const result = useMemo(() => {
    const n = (key: string) => Number(values[key]) || 0;
    if (labId === "ohm") return { value: n("resistance") ? n("voltage") / n("resistance") : 0, unit: "A", work: `${n("voltage")} ÷ ${n("resistance")}` };
    if (labId === "potencia") return { value: n("voltage") * n("current") * n("pf") / 1000, unit: "kW", work: `${n("voltage")} × ${n("current")} × ${n("pf")} ÷ 1000` };
    if (labId === "eficiencia") return { value: n("input") ? n("output") / n("input") * 100 : 0, unit: "%", work: `${n("output")} ÷ ${n("input")} × 100` };
    return { value: n("current") ** 2 * n("cableR") * n("distance") * 2 / 1000, unit: "kW", work: `${n("current")}² × ${n("cableR")} × ${n("distance")} × 2 ÷ 1000` };
  }, [labId, values]);

  function selectLab(id: LabId) { setLabId(id); setPhase("observar"); setAnswer(""); setChecked(false); }
  function move(direction: number) { const next = Math.max(0, Math.min(phases.length - 1, phaseIndex + direction)); setPhase(phases[next].id); }
  function checkAnswer() {
    setChecked(true);
    if (Math.abs(Number(answer) - lab.expected) <= lab.tolerance && !finishedLabs.includes(labId)) {
      const next = [...finishedLabs, labId]; setFinishedLabs(next); localStorage.setItem("integr-practice-labs", JSON.stringify(next));
    }
  }
  function speak() { if (!("speechSynthesis" in window)) return; speechSynthesis.cancel(); const text = phase === "observar" ? `${lab.title}. ${lab.scenario}. ${lab.simple}` : phase === "calcular" ? `${lab.formula}. El resultado actual es ${result.value.toFixed(result.unit === "%" ? 1 : 2)} ${result.unit}` : phase === "interpretar" ? interpretation(labId, result.value) : `${lab.challenge}. Pista: ${lab.hint}`; const voice = new SpeechSynthesisUtterance(text); voice.lang = "es-MX"; voice.rate = .9; speechSynthesis.speak(voice); }
  async function toggleFullscreen() { if (document.fullscreenElement) await document.exitFullscreen(); else await rootRef.current?.requestFullscreen(); }
  const correct = checked && Math.abs(Number(answer) - lab.expected) <= lab.tolerance;

  return <section ref={rootRef} className={`practice-experience ${expanded ? "practice-expanded" : ""}`}>
    <header className="practice-experience-head"><div><span>03 · PRÁCTICA GUIADA</span><h1>Laboratorio eléctrico</h1><p>Una tarea por pantalla. Comprende, calcula, interpreta y comprueba.</p></div><div className="practice-view-tools"><button onClick={speak}>▶ Escuchar</button><button onClick={() => setExpanded(!expanded)}>↗ {expanded ? "Reducir" : "Vista para exponer"}</button><button onClick={toggleFullscreen}>□ {fullscreen ? "Salir" : "Pantalla completa"}</button></div></header>
    <div className="practice-progress"><span style={{ width: `${((phaseIndex + 1) / phases.length) * 100}%` }}/><b>Paso {phaseIndex + 1} de {phases.length}</b></div>
    <div className="practice-layout">
      <aside className="lab-menu"><span>ELIGE UN LABORATORIO</span>{(Object.keys(labs) as LabId[]).map((id) => <button key={id} onClick={() => selectLab(id)} className={`${id === labId ? "active" : ""} ${finishedLabs.includes(id) ? "done" : ""}`}><i>{labs[id].icon}</i><div><small>{labs[id].code}</small><b>{labs[id].title}</b></div><em>{finishedLabs.includes(id) ? "✓" : "→"}</em></button>)}<div className="lab-menu-progress"><b>{finishedLabs.length}/4</b><span>laboratorios comprobados</span></div></aside>
      <main className="practice-main">
        <nav className="practice-phases">{phases.map((item, index) => <button key={item.id} onClick={() => setPhase(item.id)} className={`${item.id === phase ? "active" : ""} ${index < phaseIndex ? "visited" : ""}`}><span>{index < phaseIndex ? "✓" : index + 1}</span><div><b>{item.verb}</b><small>{item.label}</small></div></button>)}</nav>
        <div key={`${labId}-${phase}`} className="practice-scene">
          {phase === "observar" && <div className="observe-scene"><section><div className="scene-label">{lab.code} · PRIMERO COMPRENDE</div><h2>{lab.question}</h2><p className="scenario-copy">{lab.scenario}</p><div className="simple-card"><span>EN PALABRAS SIMPLES</span><p>{lab.simple}</p></div></section><aside><div className="flow-visual"><div><small>ENTRADA</small><b>{lab.fields[0].unit}</b></div><i><span/><span/><span/></i><div><small>RESULTADO</small><b>?</b></div></div><div className="scene-objective"><span>OBJETIVO DE ESTA PRÁCTICA</span><p>{lab.use}</p></div></aside></div>}
          {phase === "calcular" && <div className="calculate-scene"><section className="data-panel"><span className="scene-label">1 · INGRESA LOS DATOS</span><h2>Cambia un valor y observa</h2><div className="presentation-fields">{lab.fields.map((field) => <label key={field.key}><span>{field.label}</span><div><input type="number" step="any" value={values[field.key]} onChange={(event) => setValues({ ...values, [field.key]: event.target.value })}/><b>{field.unit}</b></div><small>{field.help}</small></label>)}</div><button className="practice-reset" onClick={() => setValues(initialValues)}>↺ Restablecer ejemplo</button></section><section className="calculation-board"><span>2 · SIGUE EL PROCESO</span><div className="formula-large">{lab.formula}</div><div className="substitution"><small>SUSTITUCIÓN</small><b>{result.work}</b></div><div className="live-result"><small>RESULTADO EN VIVO</small><b>{result.value.toFixed(result.unit === "%" ? 1 : 2)} <em>{result.unit}</em></b></div></section></div>}
          {phase === "interpretar" && <div className="interpret-scene"><div className="result-orbit"><span>RESULTADO CALCULADO</span><b>{result.value.toFixed(result.unit === "%" ? 1 : 2)}</b><em>{result.unit}</em></div><section><span className="scene-label">EL NÚMERO NO ES EL FINAL</span><h2>¿Qué significa?</h2><p>{interpretation(labId, result.value)}</p><div className="decision-checklist"><div><span>1</span><p><b>Verifica unidades</b>Confirma que el resultado está expresado correctamente.</p></div><div><span>2</span><p><b>Compara</b>Usa placa, límite, historial o una condición normal.</p></div><div><span>3</span><p><b>Decide</b>Define qué medirías o revisarías después.</p></div></div></section></div>}
          {phase === "reto" && <div className="challenge-scene"><section><span className="scene-label">COMPRUEBA SIN COPIAR EL EJEMPLO</span><h2>{lab.challenge}</h2><p>Escribe únicamente el valor numérico.</p><details><summary>Necesito una pista</summary><p>{lab.hint}</p></details></section><aside><label><span>TU RESPUESTA</span><div><input type="number" step="any" value={answer} onChange={(event) => { setAnswer(event.target.value); setChecked(false); }}/><b>{lab.challengeUnit}</b></div></label><button onClick={checkAnswer} disabled={!answer}>Comprobar respuesta</button>{checked && <div className={correct ? "answer-correct" : "answer-review"}><b>{correct ? "✓ Correcto" : "Revisa el procedimiento"}</b><p>{correct ? `La respuesta es ${lab.expected} ${lab.challengeUnit}. Ya puedes explicarla.` : lab.hint}</p></div>}</aside></div>}
        </div>
        <footer className="practice-presenter-controls"><button onClick={() => move(-1)} disabled={phaseIndex === 0}>← Anterior</button><div><span>{lab.code}</span><b>{phases[phaseIndex].verb}</b><small>En modo exposición usa ← y →</small></div>{phaseIndex < phases.length - 1 ? <button className="next" onClick={() => move(1)}>Siguiente →</button> : <button className="next" disabled={!finishedLabs.includes(labId)} onClick={() => finishedLabs.length === 4 ? onComplete() : selectLab((Object.keys(labs) as LabId[]).find((id) => !finishedLabs.includes(id)) ?? "ohm")}>{!finishedLabs.includes(labId) ? "Resuelve el reto" : finishedLabs.length === 4 ? "Completar práctica ✓" : "Siguiente laboratorio →"}</button>}</footer>
      </main>
    </div>
    <div className="practice-final-bar"><span className={completed ? "done" : ""}>{completed ? "✓ Práctica completada" : "Completa los cuatro retos para cerrar la práctica"}</span><button onClick={onNext}>Entrar al debate →</button></div>
  </section>;
}

function interpretation(id: LabId, value: number) {
  if (id === "ohm") return `La carga permitiría aproximadamente ${value.toFixed(2)} A. Compáralos con la corriente nominal, el conductor y la protección. El cálculo anticipa una condición; no reemplaza una medición segura.`;
  if (id === "potencia") return `La carga convierte aproximadamente ${value.toFixed(2)} kW en potencia activa con estos datos. En sistemas trifásicos la relación cambia y debe considerarse √3.`;
  if (id === "eficiencia") return `De cada 100 unidades que entran, ${value.toFixed(1)} se convierten en trabajo útil. El resto aparece principalmente como calor, fricción, ventilación o ruido.`;
  return `El cable disipa aproximadamente ${value.toFixed(3)} kW como calor. Si la corriente aumenta, la pérdida crece rápidamente porque la corriente está elevada al cuadrado.`;
}
