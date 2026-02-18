import { serverConfig } from "./config";
import { json, textResponse } from "./lib/http";
const server = Bun.serve({ port: serverConfig.port, fetch(request) { const url = new URL(request.url); if (request.method === "GET" && url.pathname === "/api/health") return json({ ok: true, ollamaLocalUrl: serverConfig.ollamaLocalUrl }); if (request.method === "GET" && url.pathname === "/") return textResponse("Chat Comp API is running."); return json({ error: `Unknown route: ${url.pathname}` }, 404); } });
console.log(`Chat Comp API listening on http://127.0.0.1:${server.port}`);
