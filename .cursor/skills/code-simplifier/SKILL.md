---
name: code-simplifier
description: >-
  Simplify and refine code for clarity, consistency, and maintainability while
  preserving behavior. Default scope is recently modified or user-named files unless
  the user widens it. Use when asked to simplify, clean up, reduce nesting, improve
  readability, or remove noise—without changing product behavior.
---

# Code simplifier

You **simplify** code while **preserving functionality** exactly. Prefer small, reviewable diffs.

## Provenance

Adapted from [everything-claude-code — `agents/code-simplifier.md`](https://github.com/affaan-m/everything-claude-code/blob/62519f2b622b44d8289d573bb6e74c4c95fc7400/agents/code-simplifier.md). **This repo:** match existing style (imports, naming, file layout) and respect **`.cursor/rules`**—especially **`react-components-hooks-pure.mdc`** ([You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)), **`semantic-html.mdc`**, **`server-client-bundle-boundary.mdc`** (do not move server-only code into client modules or vice versa for “simplicity”).

## Principles

1. **Clarity over cleverness** — Obvious beats cute.
2. **Consistency** — Follow patterns already in the same folder/feature.
3. **Preserve behavior** — Same inputs/outputs, same side effects, same error paths unless the user explicitly asked for a bugfix.
4. **Simplify only when maintenance wins** — If the result is harder to test or splits boundaries wrong, stop.

## Simplification targets

### Structure

- Extract **deep nesting** into named functions or early returns.
- Replace tangled conditionals with **guard clauses** where readability improves.
- Prefer **`async`/`await`** over confusing promise chains when equivalent.
- Remove **dead code** and **unused imports** (for larger unused surfaces, prefer **`refactor-cleaner/SKILL.md`** + Knip).

### Readability

- **Descriptive names**; avoid abbreviations the file does not already use.
- Avoid **nested ternaries**; use variables or `if`/`return`.
- Break **long expressions** into named intermediates when it helps.
- Use **destructuring** when it clarifies intent.

### Quality

- Remove stray **`console.log`** and **commented-out** blocks (unless comments are legal/docs requirements).
- **Consolidate** duplicated logic only when the abstraction is stable and used in more than one place—do not invent one-off “frameworks.”
- Remove **over-abstracted** single-use helpers if inlining is clearer.

## React / Next.js guardrails

- Do **not** “simplify” by adding **`useEffect`** to sync derived state—**derive during render** or use handlers/Query/RSC per **`react-components-hooks-pure.mdc`**.
- Do **not** collapse **server** and **client** concerns in one file if that breaks **`server-client-bundle-boundary.mdc`**.
- Keep **hooks** at the top level of components/hooks only; no conditional hook calls.

## Approach

1. **Read** the target files (default: **recently changed** or **user-listed** paths).
2. **List** simplification opportunities; skip anything that might change behavior or security (`nextjs-data-security`, `nextjs-authentication`).
3. **Apply** functionally equivalent edits only.
4. **Verify** — run **`pnpm run lint`** and **`pnpm test`** when the touched surface is non-trivial; then **`code-review/SKILL.md`** on the diff if the change is material.

## Overlap with other skills

- **Dead exports / deps / duplicate modules** at scale → **`refactor-cleaner/SKILL.md`**.
- **Architecture or new feature shape** → **`code-architect/SKILL.md`**.
- **Security or auth paths** → do not “simplify away” checks; use **`security-reviewer/SKILL.md`** if unsure.
