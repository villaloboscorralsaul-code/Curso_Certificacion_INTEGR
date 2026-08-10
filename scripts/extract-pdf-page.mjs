import fs from "node:fs/promises";
import { PDFDocument } from "pdf-lib";

const [input, pageNumber, output] = process.argv.slice(2);
if (!input || !pageNumber || !output) {
  throw new Error("Usage: node scripts/extract-pdf-page.mjs <input.pdf> <page> <output.pdf>");
}

const source = await PDFDocument.load(await fs.readFile(input));
const target = await PDFDocument.create();
const [page] = await target.copyPages(source, [Number(pageNumber) - 1]);
target.addPage(page);
target.setTitle("Módulo I · Día 1 · Fundamentos eléctricos");
target.setSubject("Habilidades Electromecánicas · INTEGR");
await fs.writeFile(output, await target.save({ useObjectStreams: true }));
