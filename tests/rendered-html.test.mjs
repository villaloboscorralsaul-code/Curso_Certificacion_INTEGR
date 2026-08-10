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
  const [page, layout, sourcePdf, socialCard] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../public/modulo-1-dia-1.pdf", import.meta.url)),
    readFile(new URL("../public/og.png", import.meta.url)),
  ]);
  assert.match(page, /type Stage = "caso" \| "debate" \| "incisos"/);
  assert.match(page, /integr-day1-completed/);
  assert.match(page, /speechSynthesis/);
  assert.match(page, /Ppérdida = I² × Rtotal/);
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
  const [page, coach] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/LearningCoach.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(page, /EN PALABRAS SIMPLES/);
  assert.match(page, /Tres errores que debes evitar/);
  assert.match(page, /IDEA CLAVE/);
  assert.match(coach, /¿Qué hago aquí\?/);
  assert.match(coach, /integr-large-text/);
});

test("local server reloads the worker when a new build changes asset hashes", async () => {
  const server = await readFile(new URL("../scripts/local-server.mjs", import.meta.url), "utf8");
  assert.match(server, /stats\.mtimeMs !== workerModified/);
  assert.match(server, /compilación local sincronizada/);
  assert.match(server, /cache-control", "no-store/);
});
