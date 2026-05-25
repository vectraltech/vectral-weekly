# Issue #0 — Gemini Managed Agents

> Your first agent in 30 lines. One Gemini API call → an LLM with a sandboxed Linux box, code execution, and file I/O.

📰 **Read the full issue:** [weekly.vectraltech.com](https://weekly.vectraltech.com) — or see [`issue.md`](./issue.md) in this folder.

## What this demo does

Sends a single instruction to the `antigravity-preview-05-2026` managed agent:

> Generate 30 days of synthetic e-commerce sales data, save it as `sales.csv`, then analyze it with pandas and report the top 3 insights.

The agent will:

1. Generate the synthetic dataset
2. Write `sales.csv` to its ephemeral Linux sandbox
3. Run pandas analysis on it
4. Return a natural-language summary back to your terminal

No orchestration code on your side. No tool definitions. No sandbox container to provision. Just one API call.

## Run it

Requires Node 20+.

```bash
npm install
cp .env.example .env   # then edit and add your GEMINI_API_KEY
npm start
```

Get a free Gemini API key at [ai.google.dev](https://ai.google.dev).

## Files

| File | What it is |
|---|---|
| `index.ts` | The whole demo (~30 lines) |
| `package.json` | Minimal deps: `@google/genai`, `dotenv`, `tsx` |
| `tsconfig.json` | Strict TS config |
| `.env.example` | `GEMINI_API_KEY` placeholder |
| `issue.md` | Mirror of the published newsletter issue |

## Modify for your use case

The entire interaction is one prompt. Change the `TASK` constant near the top of `index.ts` to your own goal — the agent figures out the steps. A few ideas to try:

- "Scrape the front page of Hacker News, group stories by topic, save as `hn.json`"
- "Convert this PDF to plain markdown and extract any tables as CSV"
- "Generate 50 product description variants for a coffee subscription and rank by readability"

## Notes on SDK compatibility

This matches the public docs at [ai.google.dev/gemini-api/docs/managed-agents-quickstart](https://ai.google.dev/gemini-api/docs/managed-agents-quickstart) as of May 2026. The Managed Agents endpoint is in preview, so the exact method name on the JS SDK may evolve. If `ai.interactions.create({ agent: ... })` errors with a method-not-found, check the latest [`@google/genai` releases](https://www.npmjs.com/package/@google/genai) for the current naming.

## License

MIT — see [LICENSE](../../LICENSE).
