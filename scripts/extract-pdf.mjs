import fs from "node:fs/promises";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

const [input, output] = process.argv.slice(2);
if (!input || !output) {
  throw new Error("Usage: node scripts/extract-pdf.mjs <input.pdf> <output.txt>");
}

const bytes = new Uint8Array(await fs.readFile(input));
const document = await getDocument({ data: bytes, useSystemFonts: true }).promise;
const pages = [];

for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
  const page = await document.getPage(pageNumber);
  const content = await page.getTextContent();
  const lines = [];
  let currentY = null;
  let currentLine = [];

  for (const item of content.items) {
    if (!("str" in item)) continue;
    const y = Math.round(item.transform[5]);
    if (currentY !== null && Math.abs(y - currentY) > 3) {
      lines.push(currentLine.join(" ").replace(/\s+/g, " ").trim());
      currentLine = [];
    }
    currentY = y;
    if (item.str.trim()) currentLine.push(item.str.trim());
  }
  if (currentLine.length) lines.push(currentLine.join(" ").replace(/\s+/g, " ").trim());
  pages.push(`\n===== PÁGINA ${pageNumber} =====\n${lines.filter(Boolean).join("\n")}`);
  if (pageNumber % 25 === 0 || pageNumber === document.numPages) {
    process.stdout.write(`Procesadas ${pageNumber}/${document.numPages} páginas\n`);
  }
}

await fs.writeFile(output, pages.join("\n"), "utf8");
