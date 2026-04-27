---
description: >-
  Security pass — auth, input, secrets, OWASP-style issues. Delegates to
  skills/security-reviewer/SKILL.md. Pair with nextjs-data-security / authentication rules.
---

# Security review

Read **`.cursor/skills/security-reviewer/SKILL.md`** end-to-end.

**Prioritize:** Route Handlers, Server Actions, auth, webhooks, uploads, redirects, `fetch` to user-influenced URLs.

**Run when useful:** `pnpm audit --audit-level=high`, `pnpm run lint`.
