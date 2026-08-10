import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const serverScript = path.join(root, "scripts", "local-server.mjs");
const watched = [path.join(root, "dist", "server", "index.js"), path.join(root, "dist", "client", ".vite", "manifest.json")];
let child;
let signature = "";
let restarting = false;

async function buildSignature() {
  const stats = await Promise.all(watched.map((file) => fs.stat(file)));
  return stats.map((item) => `${item.mtimeMs}:${item.size}`).join("|");
}

function startServer() {
  child = spawn(process.execPath, [serverScript], { cwd: root, stdio: "ignore", windowsHide: true });
}

async function restartServer() {
  if (restarting) return;
  restarting = true;
  if (child && !child.killed) {
    await new Promise((resolve) => { child.once("exit", resolve); child.kill(); setTimeout(resolve, 1200); });
  }
  startServer();
  restarting = false;
}

signature = await buildSignature();
startServer();
setInterval(async () => {
  try {
    const next = await buildSignature();
    if (next !== signature) { signature = next; await restartServer(); }
  } catch { /* A build can replace files briefly; retry on the next interval. */ }
}, 750);

function close() { if (child && !child.killed) child.kill(); process.exit(0); }
process.on("SIGINT", close);
process.on("SIGTERM", close);
