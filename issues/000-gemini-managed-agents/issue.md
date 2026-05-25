# Vectral Weekly #0 — Your first agent in 30 lines

*Issue 000 · May 25, 2026*

**TL;DR:** Google quietly shipped Managed Agents in the Gemini API this week. One call now does what used to take E2B + Modal + a 200-line orchestrator: spins up an isolated Linux sandbox, hands an LLM a tool belt, runs code, manages turns, returns files. We built a working starter you can clone and ship a real agent app this weekend.

---

## What shipped

At Google I/O on May 19th, Google announced **Managed Agents** in the Gemini API. It's a single endpoint — `ai.interactions.create` — that takes a natural-language prompt and gives you back an agent that:

- Plans a multi-step approach
- Writes and executes Python in an ephemeral Linux sandbox
- Reads and writes files (PDFs, images, CSVs)
- Persists state across multi-turn conversations

It's powered by the `antigravity-preview-05-2026` agent built on Gemini 3.5 Flash. Free tier credits available out of the gate.

---

## Why this matters

For the last 18 months, "build a real agent" has meant gluing together:

- An LLM with tool use
- A sandboxed code-runtime provider (E2B, Modal, Daytona)
- Your own state machine for multi-turn interactions
- File I/O plumbing
- Error handling for tool failures

That's a 2-3 week project for one developer. The entire stack is now collapsed into one API call. The wall that kept indie devs out of agentic apps just got knocked down.

This is Software 3.0 happening in real time — capabilities that needed teams now ship as a single library import.

---

## What to build with this

The "obviously buildable" idea: a **document-to-analysis** tool.

User uploads a messy CSV, PDF, or pile of receipts. Your one-page app calls Managed Agents with the file plus a goal ("categorize and chart this"). The agent runs Python in the sandbox, writes a chart PNG, returns it. Total app code: maybe 100 lines. Ship in a weekend.

A few other shapes worth trying:

- **PR summarizer that actually checks out the code** and runs lint/tests before commenting on the PR
- **Travel research agent** that scrapes 5 booking sites, dedupes, ranks by price + reviews
- **Quarterly report generator** — connect to a database, agent writes the SQL and charts the result
- **Onboarding bot** that runs through a startup checklist and outputs a tracking spreadsheet

The reusable insight: anywhere you were going to do "LLM + scripted Python" is now "agent + natural-language instructions."

---

## The starter repo

We built a minimal working TypeScript starter here:

👉 [github.com/vectraltech/vectral-weekly/tree/main/issues/000-gemini-managed-agents](https://github.com/vectraltech/vectral-weekly/tree/main/issues/000-gemini-managed-agents)

It includes:

- A clean TypeScript setup with `@google/genai`
- A demo prompt that hands the agent a multi-step task (generate data → save CSV → analyze → summarize)
- `.env.example`, `package.json`, ready to clone and run
- Comments showing exactly where to swap in your own task

Three commands to ship:

```bash
git clone https://github.com/vectraltech/vectral-weekly
cd vectral-weekly/issues/000-gemini-managed-agents
cp .env.example .env  # add your GEMINI_API_KEY
npm install && npm start
```

---

## Next week

We're tracking three candidates for Tuesday's issue: Claude Skills going GA, the new WebMCP origin trial in Chrome 149, and Gemini Spark agent rollout. Reply with a preference if you've got one.

— Ship something this week.

*Vectral Weekly is a thing we made. Forward to a builder.*
