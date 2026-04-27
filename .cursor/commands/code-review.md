---
description: >-
  Review staged or named changes — quality, security, Next.js rules, tests, URL/routes naming.
  Delegates to skills/code-review/SKILL.md. Use after substantive edits or for PR review.
---

# Code review

Read **`.cursor/skills/code-review/SKILL.md`** end-to-end and execute that pass.

**Scope (unless user overrides):** staged diff first; if nothing staged, files touched this session or paths the user names. For **PR mode**, follow the skill’s **PR review** phases (`gh` when available).

**Output:** Severities, merge verdict, **Recommended directives**, optional **`.cursor/tmp/code-review-*.md`** for multi-turn.

**Also apply:** linked guidance from **code-review** (e.g. Vercel perf skill per **AGENTS.md**), and **URL/routes naming** per **`.cursor/rules/url-routes-review.mdc`** when route changes, new paths, or file structure updates are in scope.

**URL/Routes Review:** When reviewing route constants, file paths, or navigation changes, check **`.cursor/rules/url-routes-review.mdc`** for naming violations (hyphens, lowercase, constants defined), consistency with patterns, and scalability gates.
