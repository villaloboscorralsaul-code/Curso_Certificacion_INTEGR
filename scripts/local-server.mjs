import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const host = "127.0.0.1";
const port = Number(process.env.INTEGR_LOCAL_PORT || 4173);
const root = process.cwd();
const clientRoot = path.resolve(root, "dist/client");
const workerPath = path.resolve(root, "dist/server/index.js");
const { default: worker } = await import(`${pathToFileURL(workerPath).href}?local=${Date.now()}`);

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".pdf": "application/pdf",
  ".mp4": "video/mp4",
};

async function staticResponse(request) {
  const url = new URL(request.url);
  const decoded = decodeURIComponent(url.pathname).replace(/^\/+/, "");
  const filePath = path.resolve(clientRoot, decoded);
  if (!filePath.startsWith(`${clientRoot}${path.sep}`)) return new Response("Forbidden", { status: 403 });
  try {
    const data = await fs.readFile(filePath);
    return new Response(data, { status: 200, headers: { "content-type": contentTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream", "cache-control": "no-store" } });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}

const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url || "/", `http://${host}:${port}`);
    const asset = await staticResponse(new Request(url));
    const result = asset.status === 200
      ? asset
      : await worker.fetch(new Request(url, { method: request.method }), { ASSETS: { fetch: staticResponse } }, { waitUntil() {}, passThroughOnException() {} });
    response.statusCode = result.status;
    result.headers.forEach((value, key) => response.setHeader(key, value));
    response.setHeader("cache-control", "no-store");
    response.end(Buffer.from(await result.arrayBuffer()));
  } catch (error) {
    response.statusCode = 500;
    response.end(`Local server error: ${error instanceof Error ? error.message : String(error)}`);
  }
});

server.listen(port, host, () => {
  console.log(`INTEGR local listo en http://${host}:${port}`);
});
