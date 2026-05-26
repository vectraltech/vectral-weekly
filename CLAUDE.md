# CLAUDE.md

This file is loaded into Claude's context on every session that opens this repo. It defines the coding discipline Claude must follow for any code work in `vectral-weekly` — including the autonomous weekly issue generator.

---

## Project

**Vectral Weekly** is a weekly AI newsletter at [weekly.vectraltech.com](https://weekly.vectraltech.com). Each issue covers one new AI release with a working starter repo under [`/issues`](./issues).

## Coding discipline: Karpathy Guidelines

Source: [multica-ai/andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills/blob/main/skills/karpathy-guidelines/SKILL.md) (MIT)

Derived from [Andrej Karpathy's observations on LLM coding pitfalls](https://x.com/karpathy/status/2015883857489522876). These bias toward caution over speed. For trivial tasks, use judgment.

### 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them — don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it — don't delete it.

When your changes create orphans:
- Remove imports/variables/functions YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: every changed line should trace directly to the user's request.

### 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

## How this applies to the weekly issue generator

The scheduled task that produces each weekly issue MUST:

1. **Think before coding** — if the chosen AI release has an unverified SDK shape, flag it; don't ship speculative code as if it's known-good.
2. **Simplicity first** — starter repos should be the minimum that demonstrates the API. Target ~30 lines, not 300.
3. **Surgical changes** — when adding a new issue, only touch `/issues/NNN-slug/` and update the index in this repo's root `README.md`. Don't refactor old issues.
4. **Goal-driven execution** — every starter must be verified before being shown to the human reviewer: `npm install` succeeds, `tsc --noEmit` clean, demo runs end-to-end where possible.

---

## Lessons learned (real failures, encoded so we don't repeat them)

### L1 — Verify SDK shape against the installed library, not against web search

**What went wrong:** Issue #0 first draft was written around Google's "Managed Agents" announcement at I/O 2026. I sourced the API shape (`interaction.output`, agent ID `antigravity-preview-05-2026`) from blog posts and the published quickstart docs. Pushed the starter to the repo. On running `tsc --noEmit` against the actual installed `@google/genai` package, *both* turned out to be wrong: the response property is `outputs` (plural) and `antigravity-preview-05-2026` isn't in the SDK's typed agent enum (only `deep-research-*` variants are). The published docs were ahead of the SDK.

**Why it happened:** I treated authoritative-looking documentation as ground truth for the SDK surface, instead of running a single type-check against the package I was telling readers to install. Web docs can describe preview features that haven't shipped in the SDK yet, or describe a different surface (Antigravity desktop app ≠ Gemini API).

**Rule going forward:** Before shipping any starter that depends on a third-party SDK, you MUST run `npm install` + `tsc --noEmit` (or the language equivalent) against the actual package. Documentation is a hypothesis; the installed library is ground truth. If they disagree, the library wins and either the code or the topic gets rewritten — never paper over with a footnote saying "may need a tweak."

**Verification check to add to every issue:** "Did I type-check the starter against the installed SDK? Did the demo run end-to-end (or, if it requires a paid API key, did I prove the call shape compiles)?" Both must be yes before the human reviewer sees the issue.
