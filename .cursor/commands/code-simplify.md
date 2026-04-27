---
description: >-
  Clarity refactors with same behavior — nesting, naming, noise. Delegates to
  skills/code-simplifier/SKILL.md. Not for behavior or security changes.
---

# Code simplify

Read **`.cursor/skills/code-simplifier/SKILL.md`** end-to-end.

**Scope:** Recently changed or user-named files only unless widened.

**Guardrails:** **`react-components-hooks-pure.mdc`**, **`server-client-bundle-boundary.mdc`** — no “simplify” that adds wrong effects or breaks RSC/client split.

**Verify:** `pnpm run lint` and `pnpm test` when non-trivial.
