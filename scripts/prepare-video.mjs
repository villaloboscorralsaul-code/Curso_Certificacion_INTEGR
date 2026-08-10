import { createReadStream, createWriteStream } from "node:fs";
import { once } from "node:events";
import { access, readdir } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
// Repository-safe parts directories: electricidad-industrial-parts and sistemas-electromecanicos-parts.
async function joinVideo(name) {
  const partsDir = path.join(root, "public", `${name}-parts`);
  const output = path.join(root, "public", `${name}.mp4`);
  const parts = (await readdir(partsDir)).filter((file) => /^part-\d+\.bin$/i.test(file)).sort();
  if (!parts.length) throw new Error(`No se encontraron partes para ${name}.`);
  const target = createWriteStream(output);
  for (const part of parts) { const source = createReadStream(path.join(partsDir, part)); for await (const chunk of source) if (!target.write(chunk)) await once(target, "drain"); }
  target.end(); await once(target, "finish"); await access(output); console.log(`Video ${name} preparado (${parts.length} partes).`);
}
await joinVideo("electricidad-industrial");
await joinVideo("sistemas-electromecanicos");
