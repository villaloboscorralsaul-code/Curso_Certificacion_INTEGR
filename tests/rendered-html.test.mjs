import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request("http://localhost/", { headers: { accept: "text/html" } }), {
    ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
  }, { waitUntil() {}, passThroughOnException() {} });
}

test("renders the five-day course administrator", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /<title>Administrador de Curso \| INTEGR<\/title>/i);
  assert.match(html, /Fundamentos eléctricos/);
  assert.match(html, /Programa de cinco días/);
  assert.match(html, /Video-lección/);
  assert.match(html, /5 casos progresivos/);
  assert.doesNotMatch(html, /codex-preview|Building your site/);
});

test("keeps the learning experiences and source material wired", async () => {
  const [page, practice, layout, sourcePdf, socialCard] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/PracticeExperience.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../public/modulo-1-dia-1.pdf", import.meta.url)),
    readFile(new URL("../public/og.png", import.meta.url)),
  ]);
  assert.match(page, /type Stage = "caso" \| "debate" \| "incisos"/);
  assert.match(page, /integr-day1-completed/);
  assert.match(page, /speechSynthesis/);
  assert.match(practice, /P pérdida = I²/);
  assert.match(layout, /og\.png/);
  assert.ok(sourcePdf.byteLength > 1_000_000);
  assert.ok(socialCard.byteLength > 100_000);
});

test("includes the guided debate facilitation tools", async () => {
  const debate = await readFile(new URL("../app/DebateExperience.tsx", import.meta.url), "utf8");
  assert.match(debate, /TIEMPO DE DISCUSIÓN/);
  assert.match(debate, /Vista amplia/);
  assert.match(debate, /Pantalla completa/);
  assert.match(debate, /integr-debate-notes/);
  assert.match(debate, /POSTURA PRELIMINAR DEL GRUPO/);
  assert.match(debate, /Guía para dirigir una conversación útil/);
});

test("provides plain-language and contextual learning support", async () => {
  const [page, practice, coach] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/PracticeExperience.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/LearningCoach.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(page, /EN PALABRAS SIMPLES/);
  assert.match(practice, /EN PALABRAS SIMPLES/);
  assert.match(page, /IDEA CLAVE/);
  assert.match(coach, /¿Qué hago aquí\?/);
  assert.match(coach, /integr-large-text/);
});

test("organizes practice for classroom presentation", async () => {
  const practice = await readFile(new URL("../app/PracticeExperience.tsx", import.meta.url), "utf8");
  assert.match(practice, /Vista para exponer/);
  assert.match(practice, /Pantalla completa/);
  assert.match(practice, /ArrowRight/);
  assert.match(practice, /Observar/);
  assert.match(practice, /Calcular/);
  assert.match(practice, /Interpretar/);
  assert.match(practice, /Resolver/);
});

test("keeps debate readable for projection", async () => {
  const [debateCss, layout] = await Promise.all([
    readFile(new URL("../app/debate-legibility.css", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(debateCss, /optimized for projection/);
  assert.match(layout, /debate-legibility\.css/);
});

test("wires the industrial electricity lesson video", async () => {
  const [page, video] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../public/electricidad-industrial.mp4", import.meta.url)),
  ]);
  assert.match(page, /electricidad-industrial\.mp4/);
  assert.match(page, /lesson-video-feature/);
  assert.ok(video.byteLength > 10_000_000);
});

test("rebuilds the lesson video from repository-safe parts", async () => {
  const [packageJson, prep] = await Promise.all([
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../scripts/prepare-video.mjs", import.meta.url), "utf8"),
  ]);
  assert.match(packageJson, /prepare-video\.mjs/);
  assert.match(prep, /electricidad-industrial-parts/);
  assert.match(prep, /createReadStream/);
});

test("local preview restarts when a build changes asset hashes", async () => {
  const [server, supervisor] = await Promise.all([
    readFile(new URL("../scripts/local-server.mjs", import.meta.url), "utf8"),
    readFile(new URL("../scripts/local-dev.mjs", import.meta.url), "utf8"),
  ]);
  assert.match(supervisor, /manifest\.json/);
  assert.match(supervisor, /restartServer/);
  assert.match(supervisor, /setInterval/);
  assert.match(server, /cache-control", "no-store/);
});
