# Issue #0 — MCP URL Reader

> A 30-line MCP server that gives any LLM a `fetch_url` tool. Turns any URL into clean markdown via [Jina Reader](https://jina.ai/reader).

📰 **Read the full issue:** [weekly.vectraltech.com](https://weekly.vectraltech.com) — or see [`issue.md`](./issue.md) in this folder.

## What it does

Exposes one MCP tool, `fetch_url`, that takes a URL and returns its main content as clean markdown. Any MCP-compatible client (Claude Desktop, Cursor, Claude Code, VS Code MCP extension, etc.) can install this server and the LLM gains the ability to read any public URL.

Implementation uses [Jina Reader](https://jina.ai/reader) (`https://r.jina.ai/<url>`) — free, no API key, returns clean markdown.

## Files

| File | What |
|---|---|
| `index.ts` | The whole MCP server (~35 lines) |
| `test.ts` | End-to-end verification: spawns server, mocks the reader API on localhost, exercises full MCP protocol |
| `package.json` | Deps: `@modelcontextprotocol/sdk` |
| `tsconfig.json` | Strict TS config |

## Run it

Requires Node 20+.

```bash
npm install
npm run build
npm start         # server listens on stdio, waiting for an MCP client
```

To run the verification tests:

```bash
npm test
```

Expected output:
```
✓ initialize → server identified
✓ tools/list → fetch_url exposed
✓ tools/call → received exact mock body via MCP server's fetch path
✅ ALL CHECKS PASS
```

## Wire it up to Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json` (Mac) or the Windows equivalent:

```json
{
  "mcpServers": {
    "url-reader": {
      "command": "node",
      "args": ["/absolute/path/to/this/folder/dist/index.js"]
    }
  }
}
```

Restart Claude Desktop. Try: "Use the fetch_url tool to read https://anthropic.com and summarize it."

## Wire it up to Claude Code

```bash
claude mcp add url-reader -- node /absolute/path/to/this/folder/dist/index.js
```

## Wire it up to Cursor

In Cursor settings → MCP, add a new server with the same config shape. UI varies by Cursor version.

## Modify for your use case

The entire tool is the `setRequestHandler(CallToolRequestSchema, ...)` block. Replace the `fetch` call with anything: a database query, a private API, a filesystem search. The shape stays the same.

## Verification status

- ✅ Type checks (`tsc --noEmit`)
- ✅ Builds (`tsc`)
- ✅ Test suite passes — MCP protocol verified end-to-end with a localhost mock for the reader API
- ⚠️ Live `r.jina.ai` call: works on any machine with internet; the sandbox where this repo was built has no external network, so the live call isn't in CI

## License

MIT — see [LICENSE](../../LICENSE).
