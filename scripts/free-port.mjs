#!/usr/bin/env node
/**
 * Release a TCP port before starting the dev server.
 *
 * Why: the old `dev` script used `fuser -k 3000/tcp`, which only exists on Linux.
 * On Windows/macOS it fails silently and the stale process keeps the port,
 * so `next dev` dies with EADDRINUSE.
 *
 * Usage: node scripts/free-port.mjs [port]
 * Behaviour: never blocks startup — if the port cannot be freed, it prints a
 * warning and exits 0 so the next command still runs and reports the real error.
 */
import net from "node:net";
import { execFileSync } from "node:child_process";

const port = Number(process.argv[2] ?? 3000);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.log(`[free-port] invalid port "${process.argv[2]}", skipping`);
  process.exit(0);
}

function isPortBusy() {
  return new Promise((resolve) => {
    const socket = net.connect({ host: "127.0.0.1", port });
    const done = (busy) => {
      socket.removeAllListeners();
      socket.destroy();
      resolve(busy);
    };
    socket.setTimeout(800);
    socket.once("connect", () => done(true));
    socket.once("timeout", () => done(false));
    socket.once("error", () => done(false));
  });
}

function run(cmd, args) {
  try {
    return execFileSync(cmd, args, { encoding: "utf8", windowsHide: true, stdio: ["ignore", "pipe", "ignore"] });
  } catch {
    return "";
  }
}

function listenerPids() {
  if (process.platform === "win32") {
    const out = run("netstat", ["-ano", "-p", "tcp"]);
    return [...out.matchAll(/^\s*TCP\s+\S+:(\d+)\s+\S+\s+LISTENING\s+(\d+)/gim)]
      .filter((m) => Number(m[1]) === port)
      .map((m) => m[2]);
  }

  // Linux/macOS: prefer lsof, fall back to fuser output.
  const lsof = run("lsof", ["-nP", `-iTCP:${port}`, "-sTCP:LISTEN", "-t"]);
  if (lsof.trim()) return lsof.trim().split(/\s+/);

  const fuser = run("fuser", [`${port}/tcp`]);
  return fuser.trim().split(/\s+/).filter(Boolean);
}

function killPid(pid) {
  if (process.platform === "win32") {
    run("taskkill", ["/PID", pid, "/T", "/F"]);
  } else {
    try {
      process.kill(Number(pid), "SIGKILL");
    } catch {
      run("kill", ["-9", pid]);
    }
  }
}

const busy = await isPortBusy();
if (!busy) {
  process.exit(0);
}

const pids = [...new Set(listenerPids().map((p) => p.trim()).filter(Boolean))];
if (pids.length === 0) {
  console.log(`[free-port] port ${port} is busy but no listener pid was found; continuing`);
  process.exit(0);
}

for (const pid of pids) killPid(pid);
console.log(`[free-port] released port ${port} (pid ${pids.join(", ")})`);

if (await isPortBusy()) {
  console.log(`[free-port] port ${port} is still busy; continuing anyway`);
}
process.exit(0);
