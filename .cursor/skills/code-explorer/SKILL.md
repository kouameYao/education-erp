---
name: code-explorer
description: >-
  Deeply analyze how an existing feature or area works: entry points, execution paths,
  layers (RSC, client, services, actions), and dependencies. Use before implementing
  changes in unfamiliar code, when onboarding, or when the user asks "how does X work"
  with enough depth to inform implementation. Read-only exploration — no behavior changes.
---

# Code explorer

Map **how things work today** so the next change fits the stack. This is **discovery**, not design (for blueprints use **`code-architect/SKILL.md`**).

## Provenance

Adapted from [everything-claude-code — `agents/code-explorer.md`](https://github.com/affaan-m/everything-claude-code/blob/62519f2b622b44d8289d573bb6e74c4c95fc7400/agents/code-explorer.md).

## Repo layers (Paynah / Next.js App Router)

When tracing, expect these **common** boundaries (not every feature uses all):

| Layer | Typical locations | Notes |
|-------|-------------------|--------|
| **Routing / RSC** | `app/`, `app/[locale]/` | `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`; async server components |
| **Client UI** | `components/` | `'use client'`; hooks, browser APIs, TanStack Query **hooks** |
| **HTTP + cache** | `services/` | Fetchers + `useQuery` / `useMutation`; **`prefetch-*.ts`** is **server-only** (see **`server-client-bundle-boundary.mdc`**) |
| **Server mutations** | `app/**`, colocated `actions.ts` | Server Actions — validate + session checks per **`nextjs-authentication.mdc`** |
| **API surface** | `app/**/route.ts` | Route Handlers — same validation/auth discipline |
| **Auth** | Better Auth integration, middleware, protected layouts | **`nextjs-authentication.mdc`** |
| **Shared logic** | `lib/` | Pure helpers, clients, utilities |
| **Types / schemas** | `models/` | Prefer **`@/models/<domain>`** imports per **`barrel-files.mdc`** |

## Analysis process

### 1. Entry point discovery

- **User-facing:** URL → `app/.../page.tsx` (and parent `layout.tsx`).
- **API:** `route.ts` methods, webhooks, cron if present.
- **Background / jobs:** scripts, scheduled tasks (if any).

### 2. Execution path tracing

- Follow **imports and calls** from entry through completion.
- Mark **async** boundaries (`await`, React Query, transitions).
- Note **data shape** changes (DTO → UI model, Zod parse, etc.).
- Trace **error** and **empty** paths, not only happy path.

### 3. Architecture layer mapping

- Which of the table above does the feature touch?
- Where does **server** work end and **client** work begin?
- Where is **authorization** enforced (must be server-side for security)?

### 4. Pattern recognition

- Naming, folder placement, duplicate vs shared utilities.
- How **TanStack Query** keys and fetchers are organized (**`create-service.md`** patterns).
- Whether **prefetch** exists for the same data as client hooks.

### 5. Dependency documentation

- **External:** npm packages used on the path (axios, query, auth SDK, etc.).
- **Internal:** modules imported; shared **`lib/`** worth reusing.
- **Env / config:** `process.env` reads (server-only vs `NEXT_PUBLIC_*`).

## Output format

Use this structure (fill every section; omit only if truly N/A).

```markdown
## Exploration: [Feature / area name]

### Entry points
- [Trigger]: [File/route and how it is reached]

### Execution flow
1. …
2. …

### Architecture insights
- [Pattern or boundary]: [Where and why]

### Key files
| File | Role | Importance |
|------|------|------------|
| … | … | P0 / P1 |

### Dependencies
- **External:** …
- **Internal:** …

### Data & auth
- [What crosses RSC → client, caching, session checks]

### Recommendations for new development
- **Follow:** …
- **Reuse:** …
- **Avoid:** …
```

## After exploration

- Hand off to **`code-architect/SKILL.md`** if the user needs an **implementation blueprint**.
- Hand off to **`code-review/SKILL.md`** or **`security-reviewer/SKILL.md`** after edits touch auth, data boundaries, or APIs.

## Scope

- Stay within the **named feature or paths** unless the user widens scope.
- **Do not** change code in this skill’s pass unless the user explicitly asks to implement next.
