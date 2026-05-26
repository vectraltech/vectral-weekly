// End-to-end verification (per CLAUDE.md L1).
// Spawns a localhost mock for the Reader API, points the MCP server at it via
// READER_BASE_URL, exercises full MCP protocol: initialize → tools/list → tools/call.

import { spawn } from "node:child_process";
import http from "node:http";
import { AddressInfo } from "node:net";

const MOCK_BODY = "# Mocked Page\n\nThis came from the localhost mock, not the real internet.";

const mock = http.createServer((_req, res) => res.end(MOCK_BODY));
await new Promise<void>((r) => mock.listen(0, r));
const port = (mock.address() as AddressInfo).port;
const baseUrl = `http://127.0.0.1:${port}`;

const child = spawn("node", ["dist/index.js"], {
  stdio: ["pipe", "pipe", "inherit"],
  env: { ...process.env, READER_BASE_URL: baseUrl },
});

const requests = [
  { jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2024-11-05", capabilities: {}, clientInfo: { name: "test", version: "1.0" } } },
  { jsonrpc: "2.0", method: "notifications/initialized", params: {} },
  { jsonrpc: "2.0", id: 2, method: "tools/list", params: {} },
  { jsonrpc: "2.0", id: 3, method: "tools/call", params: { name: "fetch_url", arguments: { url: "https://example.com" } } },
];

for (const r of requests) child.stdin.write(JSON.stringify(r) + "\n");

let buf = "";
const responses: any[] = [];
child.stdout.on("data", (c) => {
  buf += c.toString();
  const lines = buf.split("\n");
  buf = lines.pop()!;
  for (const line of lines) if (line.trim()) responses.push(JSON.parse(line));
});

await new Promise((r) => setTimeout(r, 3000));
child.kill();
mock.close();

const init = responses.find((r) => r.id === 1);
const list = responses.find((r) => r.id === 2);
const call = responses.find((r) => r.id === 3);

let pass = true;
console.log("\n=== Verification ===");

if (init?.result?.serverInfo?.name === "url-reader") console.log("✓ initialize → server identified");
else { console.log("✗ initialize failed:", init); pass = false; }

if (list?.result?.tools?.[0]?.name === "fetch_url") console.log("✓ tools/list → fetch_url exposed");
else { console.log("✗ tools/list failed:", list); pass = false; }

const text = call?.result?.content?.[0]?.text;
if (text === MOCK_BODY) console.log("✓ tools/call → received exact mock body via MCP server's fetch path");
else { console.log("✗ tools/call failed. Got:", text); pass = false; }

console.log(pass ? "\n✅ ALL CHECKS PASS — server, protocol, and fetch path all work end-to-end.\n" : "\n❌ VERIFICATION FAILED\n");
process.exit(pass ? 0 : 1);
