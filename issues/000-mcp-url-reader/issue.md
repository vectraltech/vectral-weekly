# Vectral Weekly #0 — Your first MCP server in 30 lines

*Issue 000 · May 25, 2026*

**TL;DR:** MCP — the open standard Anthropic introduced and now backs across every Claude product — is having a moment this month. Cursor, Claude Desktop, Claude Code, VS Code, and JetBrains IDEs all speak it. Which means: if you ship one tiny server that does one useful thing, every major LLM client can call your tool. Today's starter is a 30-line MCP server that gives any of those clients a `fetch_url` tool — turning any URL into clean markdown the LLM can read.

---

## What's happening with MCP this month

May 12, Anthropic launched **Claude for Legal** with 20+ MCP connectors and 12 practice-area plugins. Self-hosted MCP sandboxes hit public beta. MCP tunnels (so your server can live behind your firewall) shipped to research preview. Every major code editor — Cursor, VS Code, Claude Code, JetBrains — now ships native MCP support.

MCP went from "interesting protocol" to "the way LLMs get custom tools" in roughly six months. If you're not building MCP servers for your domain, someone else will own that integration before you.

---

## What MCP actually is, plainly

A specification. A 30-line stdio server that follows the spec can:

- Expose **tools** (functions the LLM can call)
- Expose **resources** (files/data the LLM can read)
- Expose **prompts** (templates the LLM can use)

Any MCP-compatible client reads a config that says "spawn this command, talk to it over stdio." Once spawned, the client discovers your tools and lets the LLM call them.

That's the whole thing. No HTTP server. No auth dance. No deploy. Just a script that reads JSON-RPC from stdin and writes responses to stdout.

---

## The demo: `fetch_url` — any URL → clean markdown

Why this one? It's the missing primitive — most LLM clients can't fetch arbitrary URLs by default. With this server installed, you can say "read this article and summarize it" or "compare these three docs pages" and Claude (or Cursor, or whichever client) will actually go grab them.

Implementation: 30-ish lines. Uses the free [Jina Reader API](https://jina.ai/reader) (`https://r.jina.ai/<url>`) which returns any web page as Claude-friendly markdown — no API key, no rate-limit headaches.

The interesting half of the code:

```typescript
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [{
    name: "fetch_url",
    description: "Fetch a web page and return its main content as clean markdown.",
    inputSchema: {
      type: "object",
      properties: { url: { type: "string" } },
      required: ["url"],
    },
  }],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const url = request.params.arguments?.url as string;
  const text = await (await fetch(`https://r.jina.ai/${url}`)).text();
  return { content: [{ type: "text", text }] };
});
```

Full working version (with imports, transport, and a test harness that proves it works end-to-end) is in the starter repo.

---

## Run it in Claude Desktop in 60 seconds

```bash
git clone https://github.com/vectraltech/vectral-weekly
cd vectral-weekly/issues/000-mcp-url-reader
npm install && npm run build
```

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json` on Mac):

```json
{
  "mcpServers": {
    "url-reader": {
      "command": "node",
      "args": ["/absolute/path/to/vectral-weekly/issues/000-mcp-url-reader/dist/index.js"]
    }
  }
}
```

Restart Claude Desktop. Ask: "fetch this URL and summarize it: https://anthropic.com" — it'll use your server.

---

## What to build with the same pattern

Anywhere you have data Claude can't reach today is an MCP server opportunity:

- **Search your Pocket / Pinboard / linkding bookmarks**
- **Query your team's Linear / Notion / Asana** without paying the official connector tax
- **Read your private RSS reader** (Miniflux, Feedbin)
- **Search your local files** with semantic search
- **Hit your company's internal Wiki**

The ~30-line shape stays the same. Swap the tool name, swap the underlying call, ship.

---

## Next week

Tracking three candidates: **WebMCP** (browser-native MCP just shipped in Chrome 149 origin trial), Claude self-hosted sandboxes hitting GA, and a wildcard from reader requests. Reply with a preference.

— Ship something this week.

*Vectral Weekly is a thing we made. Forward to a builder.*
