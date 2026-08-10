import { createReadStream, createWriteStream } from "node:fs";
import { once } from "node:events";
import { access, readdir } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const partsDir = path.join(root, "public", "electricidad-industrial-parts");
const output = path.join(root, "public", "electricidad-industrial.mp4");
const parts = (await readdir(partsDir)).filter((name) => /^part-\d+\.bin$/i.test(name)).sort();
if (!parts.length) throw new Error("No se encontraron las partes del video de Electricidad Industrial.");

const target = createWriteStream(output);
for (const part of parts) {
  const source = createReadStream(path.join(partsDir, part));
  for await (const chunk of source) if (!target.write(chunk)) await once(target, "drain");
}
target.end();
await once(target, "finish");
await access(output);
console.log(`Video de lección preparado (${parts.length} partes).`);
