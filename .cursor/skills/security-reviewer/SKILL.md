---
name: security-reviewer
description: >-
  Security vulnerability detection and remediation for this codebase. Use proactively
  after or while writing code that handles user input, authentication, API routes,
  Server Actions, webhooks, file uploads, payments, or sensitive data. Flags secrets,
  SSRF, injection, unsafe patterns, and OWASP-style issues. Align with Next.js App
  Router and Better Auth conventions in-repo.
---

# Security reviewer

Focus on **preventing vulnerabilities** before they ship. This skill complements **`AGENTS.md`** rules—especially **`.cursor/rules/nextjs-data-security.mdc`** and **`.cursor/rules/nextjs-authentication.mdc`**—with a concrete review workflow and pattern list.

## Provenance

Adapted from [everything-claude-code — `agents/security-reviewer.md`](https://github.com/affaan-m/everything-claude-code/blob/62519f2b622b44d8289d573bb6e74c4c95fc7400/agents/security-reviewer.md). Commands and stack references below are **Paynah-specific** (`pnpm`, Next.js App Router, Better Auth).

## Repo must-reads

- **[Next.js Data Security](https://nextjs.org/docs/app/guides/data-security)** — **`.cursor/rules/nextjs-data-security.mdc`**: secrets server-side only, validate Server Actions / Route Handlers / `searchParams` with **Zod** (or equivalent), minimize RSC → client props, no secrets in `NEXT_PUBLIC_*`.
- **[Next.js Authentication](https://nextjs.org/docs/app/guides/authentication)** — **`.cursor/rules/nextjs-authentication.mdc`**: authorize on the server; session via **Better Auth**; no client-only guards as security.
- **`code-review/SKILL.md`** — include security findings in review output (Critical/Major/Minor) when this skill is used.

## Core responsibilities

1. **Vulnerability detection** — OWASP-style and common web issues in a Next.js + TypeScript app.
2. **Secrets** — Hardcoded keys, tokens, passwords; misuse of `NEXT_PUBLIC_*`.
3. **Input validation** — Untrusted input validated **on the server** before use.
4. **Authentication / authorization** — Session checks on mutations and sensitive data paths.
5. **Dependencies** — Known CVEs via package manager audit.
6. **Secure patterns** — SSRF-safe outbound requests, safe HTML/DOM usage, safe redirects.

## Analysis commands (when appropriate)

From repo root:

```bash
pnpm audit --audit-level=high
pnpm run lint
```

If the project adds **`eslint-plugin-security`**, run it as documented in that plugin’s setup. This repo may not include it yet—do not assume the plugin exists.

Use **grep-style** scans in code for high-signal strings (`apiKey`, `secret`, `password`, `BEGIN PRIVATE`, `Authorization: Bearer` literals, etc.) and **verify context** (false positives below).

## Review workflow

### 1. Initial scan

- Run **`pnpm audit`** (and **`pnpm run lint`**) when a full pass is requested.
- Search for **hardcoded secrets** and **dangerous APIs** (see [Code pattern review](#code-pattern-review)).
- Prioritize **auth** (Better Auth config, middleware, protected routes), **Route Handlers** (`app/**/route.ts`), **Server Actions**, **data access**, **file uploads**, **payments**, **webhooks**, **redirects** (`redirect()` / `NextResponse.redirect` with user input), **server-side `fetch`** to URLs influenced by users.

### 2. OWASP Top 10 (App Router lens)

1. **Injection** — Parameterized DB/API usage; no string-concatenated SQL; validate and type inputs with Zod (or equivalent) on the server.
2. **Broken authentication** — Credentials and sessions via **Better Auth**; no ad-hoc token storage in `localStorage` for secrets; server-side session checks on mutations.
3. **Sensitive data exposure** — Secrets only server-side; PII minimized over RSC → client boundary; logs without passwords/tokens.
4. **XXE** — If XML is parsed, ensure safe parser configuration / entities disabled (rare—confirm if applicable).
5. **Broken access control** — Every sensitive Route Handler and Server Action re-validates session/role; no “hidden UI only” protection.
6. **Security misconfiguration** — Debug leakage, default credentials, missing headers (refer to Next.js / deployment docs for this environment).
7. **XSS** — Prefer React escaping; flag `dangerouslySetInnerHTML` without sanitization; CSP where relevant.
8. **Insecure deserialization** — Untrusted JSON parsed without schema validation; `eval` / dynamic code from input.
9. **Vulnerable components** — `pnpm audit`; outdated risky deps.
10. **Logging / monitoring** — Security-relevant failures logged without leaking secrets; enough signal for abuse detection (product-dependent).

### 3. Code pattern review

| Pattern | Severity | Fix direction |
|--------|----------|----------------|
| Hardcoded secrets / private keys in source | **Critical** | Server-only env (never `NEXT_PUBLIC_*` for secrets); rotate if ever exposed |
| Shell/command execution with user-influenced args | **Critical** | Avoid shell; validate inputs; use safe APIs |
| String-concatenated SQL or raw query with interpolation | **Critical** | Parameterized queries / ORM |
| `dangerouslySetInnerHTML` with untrusted HTML | **High** | Avoid, sanitize (e.g. DOMPurify), or use safe alternatives |
| `fetch(userProvidedUrl)` or server fetch to attacker-controlled URL | **High** | Allowlist hosts/schemes; block SSRF |
| Plaintext password compare / storage | **Critical** | Use Better Auth / established password APIs |
| Server Action or Route Handler without auth check | **Critical** | Validate session + authorization on the server |
| Redirect URL from user input without allowlist | **High** | Allowlist paths or use relative-safe redirects |
| Logging tokens, passwords, full cards | **Major** | Redact; log IDs only |
| No rate limiting on sensitive public endpoints | **Major** | Add rate limits (edge middleware, gateway, or platform) where abuse matters |

Map severities to **`code-review`** output labels when reporting: Critical / Major / Minor (see **`code-review/SKILL.md`** severity mapping).

## Principles

1. **Defense in depth** — Validation + auth + least data across boundaries.
2. **Least privilege** — Minimal scopes for tokens and server roles.
3. **Fail secure** — Errors and denials do not leak internals or PII.
4. **Don’t trust input** — Treat `searchParams`, bodies, headers, and webhook payloads as untrusted until validated.
5. **Keep dependencies current** — Audit and patch high/Critical CVEs.

## Common false positives

- **`NEXT_PUBLIC_*`** only for values **meant** to be public (still never put secrets there).
- **`.env.example`** placeholders (not real secrets).
- **Test fixtures** with obvious fake credentials (still avoid copy-paste into prod paths).
- **Hashes** used for checksums, not passwords.

**Always verify context** before flagging.

## Critical findings — response

1. Document: file, line, impact, reproduction sketch, fix.
2. Prefer a **minimal secure patch** or exact steps; if secrets leaked, **rotate** and scrub history per team process.
3. Re-check after remediation (diff + targeted test).

## When to run

- **Always** (scoped): new or changed **Route Handlers**, **Server Actions**, **auth**, **webhooks**, **uploads**, **payments**, **external integrations**, **redirects**, **dependency** bumps with security notes.
- **Immediately**: reported incidents, CVEs affecting direct deps, pre-release hardening when requested.

## Success criteria (for a pass)

- No unaddressed **Critical** issues in scope.
- **Major** issues have a plan or fix.
- No real secrets in client bundles or committed source.
- Audit and lint results noted (pass or tracked exceptions).

**Remember:** financial and identity data demand extra care—pair this skill with **`nextjs-data-security.mdc`** and **`nextjs-authentication.mdc`** on every sensitive change.
