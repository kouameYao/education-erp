---
name: code-review
description: >-
  Mandatory after generating or materially editing application code in this repo;
  also when the user asks for a review, verification, bug checks, or test coverage.
  Default scope is git-staged files; if nothing is staged, scope is files touched in
  the same turn (post-generation pass). Optional PR mode when the user gives a PR number,
  a github.com pull URL, or --pr (requires gh CLI for fetch/publish). Next.js/React
  conventions, project rules, quality; cross-check vercel-react-best-practices (see
  **AGENTS.md** — `.cursor/skills/` or `.agents/skills/`) for performance; React
  Performance tracks (DevTools) when relevant. Testability, SoC, SOLID per
  **.cursor/rules/testability-solid-soc.mdc**; Next.js auth per
  **.cursor/rules/nextjs-authentication.mdc** when auth is in scope. Optional
  `.cursor/tmp` tracking for multi-turn reviews.
---

# Code review

## When to invoke (agents)

**Read and follow this skill** at the end of any turn where you **generated or materially edited** application code (new files, refactors, feature work)—**before** treating the task as complete—unless the user explicitly asked to **skip review** or the change is **trivial** (e.g. typo in a comment, single-word copy).

If the user’s request was **only** “review my code” with no prior generation in the turn, run the review as usual; scope rules below still apply.

## Provenance (upstream workflow)

Phased **local vs PR** review, expanded category checklists, validation/decision steps, and GitHub publish flow are adapted from [everything-claude-code — `commands/code-review.md`](https://github.com/affaan-m/everything-claude-code/blob/62519f2b622b44d8289d573bb6e74c4c95fc7400/commands/code-review.md). For **this repository**, that generic command is **superseded** by this file: use repo root **`AGENTS.md`**, **`.cursor/rules`**, **`.cursor/commands`**, **`.cursor/skills`** (and **`.agents/skills`** if present per **AGENTS.md**), **`pnpm`**, and the **Review scope** rules below—not `.claude/docs` or `.claude/PRPs` unless your team actually uses those paths. Optional Claude Code **`SKILL.md`** playbooks under **`~/.claude/skills/`** or repo **`.claude/skills/`** may be read when they help the review — see **`claude-skills-paths.mdc`**.

## Modes: local vs PR

| Mode             | When to use                                                                                                                                                                                                                                                                  |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Local review** | Default for agents and for “review my changes” without a PR. Follow **Review scope** (staged first, then files touched this turn).                                                                                                                                           |
| **PR review**    | User supplies a PR **number**, a **GitHub PR URL** (`github.com/.../pull/N`), **`--pr`**, or asks to review a specific open PR. Requires **`gh`** for fetch/publish; if `gh` is missing, fall back to local-only (diff + file reads) and say that GitHub steps were skipped. |

**User asks for all uncommitted work (not only staged):** widen scope explicitly, then gather with `git diff --name-only HEAD` (and `git diff HEAD` for the patch). Do not override **default** agent scope unless they asked.

## Local review phases (structured)

Use this sequence for **local review** so nothing critical is skipped.

### Phase 1 — Gather

1. Resolve paths per **[Review scope](#review-scope-default-staged-first-then-files-touched-this-turn)** (staged → touched this turn → user-widened).
2. If the scope is empty, stop: _Nothing in scope to review_ (suggest `git add` or name paths).
3. Load patches: `git diff --cached` for staged scope, or `git diff -- <paths>` / full file reads as needed.

### Phase 2 — Review

1. Run **[Review Workflow](#review-workflow)** (architecture, correctness, maintainability, tests).
2. Apply **[Purpose](#purpose)** passes (data security, auth, React rules, Vercel perf skill, bundle, testability).
3. Cross-check **[General review categories](#general-review-categories-all-modes)** and **[Security and quality signals](#security-and-quality-signals)**.

### Phase 3 — Validate (recommended)

From repo root, when applicable:

```bash
pnpm run lint
pnpm test
pnpm run build
```

Optional if TypeScript issues are suspected and the project has a valid `tsconfig`: `pnpm exec tsc --noEmit`. Record pass/fail/skipped in the report.

### Phase 4 — Report

Use **[Output Format](#output-format)** (including **Recommended directives** and merge verdict). Treat **Critical**/**Major** as blocking for `needs changes` (aligns with upstream **BLOCK**/**REQUEST CHANGES**).

## PR review mode

**Trigger:** PR number, PR URL, `--pr`, or explicit “review PR #N”.

### Phase 1 — Fetch

1. Resolve PR number (from URL or `gh pr list --head <branch>` if given a branch name).
2. `gh pr view <N> --json number,title,body,author,baseRefName,headRefName,changedFiles,additions,deletions`
3. `gh pr diff <N>` — if not found, stop with error.

### Phase 2 — Context

1. **Project index:** **`AGENTS.md`** at repo root.
2. **Rules / skills:** **`.cursor/rules/*.mdc`**, **`.cursor/skills/*/SKILL.md`**, and **`.agents/skills/*/SKILL.md`** when present (see **AGENTS.md**).
3. **PR intent:** title/body, linked issues, stated test plan.
4. **Changed files:** categorize (source, test, config, docs).

### Phase 3 — Review

Read each changed file **in full** at the PR revision (not only diff hunks)—use `gh`/`git` to fetch head contents when needed. Apply **[Purpose](#purpose)**, **[Review Workflow](#review-workflow)**, **[General review categories](#general-review-categories-all-modes)**, and **[Security and quality signals](#security-and-quality-signals)**.

### Phase 4 — Validate

Run the same commands as **[Local Phase 3](#phase-3--validate-recommended)** on a checkout of the PR head when possible. Record results in the report.

### Phase 5 — Decide

| Condition                                   | Decision                                                  |
| ------------------------------------------- | --------------------------------------------------------- |
| No Critical/Major issues, validation passes | **APPROVE** → merge verdict `ready`                       |
| Only Minor issues, validation passes        | **APPROVE** with comments → `ready` or `ready` with notes |
| Major issues or validation failures         | **REQUEST CHANGES** → `needs changes`                     |
| Critical issues                             | **BLOCK** → `needs changes` (must fix before merge)       |

**Special cases:** Draft PR → **COMMENT** only (do not approve/block). Docs/config-only → lighter review, still validate if trivial. Honor explicit user flags (`--approve` / `--request-changes`) only if the user supplied them; still list all findings.

### Phase 6 — Report (artifact)

Write a compact artifact for the PR, for example **`.cursor/tmp/pr-<N>-review.md`**, containing: metadata, **Decision**, **Summary**, findings by severity (**Critical** / **Major** / **Minor**), **Validation Results** table, **Files reviewed**.

### Phase 7 — Publish (optional)

If `gh` is available and the user wants GitHub feedback:

```bash
gh pr review <N> --approve --body "<summary>"
# or
gh pr review <N> --request-changes --body "<summary>"
# or (draft / informational)
gh pr review <N> --comment --body "<summary>"
```

Use inline review comments via `gh api` when line-specific feedback is required (see [GitHub CLI pr review](https://cli.github.com/manual/gh_pr_review)).

### Phase 8 — Output

Summarize for the user: PR title, **Decision**, counts by severity, validation pass/fail, path to the artifact, link to the PR, and **next steps**.

### Edge cases (local and PR)

- **No `gh` CLI:** PR mode — still review using locally available diff/checkout; skip publish; warn the user.
- **Diverged branches:** suggest `git fetch origin` and rebase/merge against the PR base before treating validation as authoritative.
- **Very large change sets (e.g. >50 files):** warn about scope; prioritize application source, then tests, then config/docs.

## General review categories (all modes)

| Category               | What to check                                                                                                                                                                                 |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Correctness**        | Logic errors, off-by-ones, null handling, edge cases, race conditions                                                                                                                         |
| **Type safety**        | Mismatches, unsafe casts, excessive `any`, missing generics where they add safety                                                                                                             |
| **Pattern compliance** | Project conventions (naming, layout, errors, imports) — **AGENTS.md** + **`.cursor/rules`** + **URL/routes naming** per **`.cursor/rules/url-routes-review.mdc`** when route changes in scope |
| **Security**           | Injection, auth gaps, secret exposure, SSRF, path traversal, XSS — align with **`.cursor/rules/nextjs-data-security.mdc`**; Sentry/PII on error paths — **`.cursor/rules/sentry-error-reporting.mdc`** |
| **Performance**        | N+1 / unbounded work, large payloads, client bundle regressions — **vercel-react-best-practices** + **bundle-size-investigation**                                                             |
| **Completeness**       | Tests, error handling, migrations, docs when the change warrants them                                                                                                                         |
| **Maintainability**    | Dead code, magic numbers, deep nesting, unclear naming                                                                                                                                        |

## Security and quality signals

Use alongside the **Purpose** section—escalate to **Critical**/**Major** when appropriate.

**Security (Critical when confirmed):** hardcoded secrets; missing server-side validation for actions/handlers/inputs; SQL/injection/XSS/path traversal risks; insecure dependencies (flag; verify with tooling when relevant).

**Quality (High / Major):** very large functions or files; deep nesting; missing error handling on user-visible paths; stray `console.log` in production paths; unresolved TODO/FIXME that block correctness.

**Best practices (Medium / Minor):** unnecessary mutation; missing tests for new behavior; a11y gaps; style nits.

## Severity mapping (upstream ↔ this skill)

If you reason with CRITICAL/HIGH/MEDIUM/LOW internally, map to output labels:

| Upstream | This skill                                     |
| -------- | ---------------------------------------------- |
| CRITICAL | **Critical**                                   |
| HIGH     | **Major**                                      |
| MEDIUM   | **Minor** (or **Major** if it is a likely bug) |
| LOW      | **Minor** / optional note                      |

## Purpose

Perform a strict code review pass focused on:

- Next.js and React conventions
- **URL and Route naming** per **`.cursor/rules/url-routes-review.mdc`** when route constants, file paths, or navigation changes are in scope — naming violations (underscores, camelCase, uppercase), consistency with patterns (hyphens, lowercase, plural/singular), dynamic route type safety, minimal query parameters, route constants defined in `constants/routes.ts`
- **Component naming** per **`.cursor/rules/component-naming-review.mdc`** when new components are added or component files renamed — naming violations (PascalCase filenames, underscores, numeric suffixes), clarity and self-documentation (purpose obvious from name), consistency with patterns (forms, steps, modals, flows), semantic suffixes used correctly, type safety (exports match filenames), file organization (shared vs feature-specific)
- **Data security (App Router)** per **`.cursor/rules/nextjs-data-security.mdc`** — [Next.js Data Security](https://nextjs.org/docs/app/guides/data-security): secrets, server validation, env, RSC → client props
- **Sentry / error observability** per **`.cursor/rules/sentry-error-reporting.mdc`** when **`error.tsx`**, **`global-error.tsx`**, **`instrumentation.ts`**, **`instrumentation-client.ts`**, **`next.config.ts`** (Sentry), or manual **`Sentry.captureException`** / context is in scope — auto-capture vs manual reporting, no PII/secrets in events, Session Replay constraints
- **Authentication (App Router)** per **`.cursor/rules/nextjs-authentication.mdc`** — [Next.js Authentication](https://nextjs.org/docs/app/guides/authentication): server-side session checks, Better Auth alignment, no client-only authorization for protected data/actions
- **React component/hook rules** per **`.cursor/rules/react-components-hooks-pure.mdc`** — [purity](https://react.dev/reference/rules/components-and-hooks-must-be-pure), [React calls components and hooks](https://react.dev/reference/rules/react-calls-components-and-hooks), [Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks), [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
- **React / Next.js performance and data-fetching patterns** per **`vercel-react-best-practices/SKILL.md`** (under **`.cursor/skills/`** or **`.agents/skills/`** per **AGENTS.md** — Vercel Engineering guidelines: waterfalls, bundle size, RSC boundaries, re-renders, etc.)
- **Client bundle risk** per **`.cursor/rules/bundle-size-investigation.mdc`** when adding/upgrading heavy **`'use client'`** deps or icon/UI libs — [Developer Way — Bundle Size Investigation](https://www.developerway.com/posts/bundle-size-investigation)
- **Runtime performance (manual check)** — when scoped changes affect **hot UI paths**, **list/virtualized views**, **heavy client subtrees**, or **Server Components / async RSC data**, tie review directives to **[React Performance tracks](https://react.dev/reference/dev-tools/react-performance-tracks)** (Chrome Performance panel + extensibility APIs; dev/profiling builds). See [React Performance tracks](#react-performance-tracks-browser-devtools) below.
- **Testability, separation of concerns, SOLID** per **`.cursor/rules/testability-solid-soc.mdc`** — can scoped code be tested without heroic mocks; clear layer boundaries
- Project rules and existing skills alignment
- Bug and regression risks
- Test quality and missing test cases

**When reviewing UI, routes, hooks, or data loading:** read that skill and flag **Major** (or **Critical** when user-visible latency or bundle regressions are likely) when the changed code clearly conflicts with its high-priority categories (e.g. serial awaits that could run in parallel, barrel imports of heavy modules, missing `dynamic` for large client islands).

## React Performance tracks (browser DevTools)

Official reference: [React Performance tracks](https://react.dev/reference/dev-tools/react-performance-tracks).

Use this **during code review** as a **human-in-the-loop** verification tool—not something the agent runs automatically. When the diff plausibly affects **render cost**, **effect churn**, or **server/async RSC work**, add a **Recommended directive** to record a Performance trace and inspect tracks.

### What to look for (high signal)

- **Scheduler track** — **Blocking / Transition / Suspense / Idle** priorities; render phases (**Update → Render → Commit → Remaining effects**). Watch for **cascading updates** (updates scheduled during render)—often a **Major** signal to fix (state/effect patterns; see [render and commit](https://react.dev/learn/render-and-commit), [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)).
- **Components track** — flamegraph of **component render** and **effect** durations; **changed props** in dev to spot unnecessary re-renders.
- **Server tracks** (dev) — **Server Requests** (async I/O into RSC) and **Server Components** timings; use when reviewing **`app/`** server components and data fetching.

### Constraints (from React docs)

- Tracks are for **development** and **profiling** builds; **not on by default in production** (instrumentation overhead).
- Profiling builds may need **`react-dom/profiling`** (alias from `react-dom/client` per docs / framework support). React DevTools can broaden Components coverage with `<Profiler>`.

### Review output

- Add directives like: “Record a Performance trace on `[flow]` in **dev**, check Scheduler for cascading updates and Components for expensive subtrees per [React Performance tracks](https://react.dev/reference/dev-tools/react-performance-tracks).”
- For RSC-heavy changes: “Inspect **Server Requests** / **Server Components** tracks for duplicate or slow async work.”
- If static analysis already shows a clear perf bug, severity stands alone; tracks are **confirmatory** and help the author **prove** the fix.

## Review scope (default): staged first, then files touched this turn

**Unless the user explicitly asks otherwise** (e.g. “review the whole branch”, “review unstaged”, “review file X”), keep the review **narrow**: do not roam the repo for unrelated findings.

1. **Discover staged changes** with git, for example:
   - `git diff --cached --name-only` (or `git diff --staged --name-only`) for staged paths
   - `git diff --cached` (or `git diff --staged`) for the staged patch when reasoning about edits
2. **If there is at least one staged file:** scope is **staged only**. Use the staged diff; do not report issues in other unstaged work unless the user widens scope.
3. **If there are no staged files** (common right after generation):
   - **Mandatory post-generation pass:** If you added or materially edited application files in this turn, scope is **exactly those paths**. Read those files (and any new tests you added). State **Reviewed scope: unstaged — files touched this turn** and list the paths.
   - **Otherwise** (e.g. user asked for a review but you did not touch files and nothing is staged): say there is no staged diff and no in-session touched paths; ask them to **`git add`** relevant files or name paths / widen scope.
4. **Widened scope:** If the user names paths or asks for unstaged/branch review, note that in the response and the tracking file **Scope** section so later turns stay consistent.

## Review Workflow

1. Understand the change scope (**staged diffs** or **files touched this turn** per [Review scope](#review-scope-default-staged-first-then-files-touched-this-turn)).
2. Check architecture and conventions (include **Vercel best practices** where relevant):
   - Next.js App Router patterns
   - client/server component boundaries
   - hooks usage: unnecessary `useEffect` sync/derivation ([You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)), side effects in the right place (handlers vs effects)
   - naming/location consistency with project structure
   - **URL/routes naming pass** (when scoped files include route constants, navigation, or new paths): **`.cursor/rules/url-routes-review.mdc`** — check for naming violations (hyphens ✓, lowercase ✓, plural/singular patterns), route constants in `constants/routes.ts` with `as Route` type, no hardcoded URLs, dynamic routes use functions, consistency with existing patterns (e.g. `/cards/virtual-card/new` vs `/cards/new`)
   - **Performance pass:** reconcile scoped files with **`vercel-react-best-practices/SKILL.md`** (`.cursor/skills/` or `.agents/skills/` per **AGENTS.md**) — cite the skill’s rule prefix or category when logging a finding (e.g. async waterfalls, bundle imports, server serialization to client). If the change is UI- or RSC-performance sensitive, plan a **[React Performance tracks](https://react.dev/reference/dev-tools/react-performance-tracks)** verification directive ([section above](#react-performance-tracks-browser-devtools)).
   - **Data security pass** (when scoped files include **`app/`**, Server Actions, Route Handlers, or env usage): **`.cursor/rules/nextjs-data-security.mdc`** — [Next.js Data Security](https://nextjs.org/docs/app/guides/data-security)
   - **Sentry pass** (when scoped files include error boundaries, **`instrumentation*.ts`**, Sentry init, or manual capture): **`.cursor/rules/sentry-error-reporting.mdc`**
   - **Authentication pass** (middleware, login/signup, session, protected routes, Better Auth config): **`.cursor/rules/nextjs-authentication.mdc`** — [Next.js Authentication](https://nextjs.org/docs/app/guides/authentication)
   - **Bundle pass** (large new `node_modules` imports, `import *` from UI/icon libs, client islands): **`.cursor/rules/bundle-size-investigation.mdc`** — [Developer Way](https://www.developerway.com/posts/bundle-size-investigation) + Vercel **`bundle-*`** in **vercel-react-best-practices**
3. Check correctness and risk:
   - logic errors
   - null/undefined handling
   - async and state race conditions
   - error handling and fallback behavior
4. Check maintainability:
   - readability
   - duplication
   - unnecessary complexity
   - **Testability / SoC / SOLID** (**`.cursor/rules/testability-solid-soc.mdc`**): one responsibility per module, test seams, no tangled UI+I/O+domain in one blob; flag **Major** if important logic is hard to test by design
5. Check tests:
   - tests exist for the changed behavior
   - happy path + errors + edge cases
   - assertions validate user-visible outcomes
   - mocks are minimal and stable

## Output Format

Start with a **Reviewed scope** line or short list: staged paths from git, **or** “unstaged — files touched this turn” with those paths. If scope was widened by the user, say that explicitly.

Then always return findings first, ordered by severity:

- `Critical`: must-fix bugs or likely regressions
- `Major`: important quality or convention issues
- `Minor`: cleanup or low-risk improvements

For each finding include:

- file path
- concise issue description
- why it matters
- concrete fix suggestion

Then include:

- Open questions/assumptions (if any)
- Test coverage verdict:
  - covered scenarios
  - missing scenarios
  - recommended additional tests
- Final merge readiness verdict: `ready` or `needs changes`

### Recommended directives (required)

Immediately **after** the summary above (merge verdict and test verdict), always add a short **Recommended directives** block aimed at the user. This turns the review into concrete next steps.

- Use a level-3 heading: `### Recommended directives` (or equivalent in the response).
- List **3–7** imperative bullets, ordered by impact (critical fixes first, then tests, then polish).
- Each bullet should be one clear action: what to do, and where (file, area, or command) when it helps.
- Examples of good directives: “Fix null handling in `path/to/file.ts` before merge”, “Add an integration test for the empty-state branch”, “Run `pnpm test` and fix failures in `feature/foo`”, “Align with the infinite-scroll skill for the list query key”, “Apply `vercel-react-best-practices` — remove waterfall / tighten RSC props per skill”, “Record a dev Performance trace and check [React Performance tracks](https://react.dev/reference/dev-tools/react-performance-tracks) for cascading updates / expensive components on `[screen or flow]`”, “Extract pure logic from `Component.tsx` into `lib/` or a testable helper per `testability-solid-soc.mdc`”.
- If the verdict is `ready`, directives can be optional follow-ups (docs, monitoring, refactors) rather than blockers.
- If the verdict is `needs changes`, directives must cover every **Critical** and **Major** finding at minimum.
- Number or label directives (1, 2, 3… or short IDs) so the user can reply with “do 2 and 3” or “skip minor items”.

### Review tracking file (required for multi-turn reviews)

Use a **single workspace temp file** as the source of truth for findings, directive status, and verdicts across turns. This keeps context accurate when the chat is long or the user jumps between topics.

**Path:** `.cursor/tmp/code-review-<slug>.md`

- Choose `<slug>` from scope: feature name, primary path segment, branch topic, or ticket id (kebab-case, short).
- **Create** the file on the first substantive review pass of that scope (or when reopening a review after a long gap).
- **Update** it after every review or implementation pass: sync open vs. done items, refresh merge/test verdict, append a one-line changelog with ISO date.
- **Tell the user** the path once when you create it, and again if the slug changes.

**Suggested sections** (keep compact; link to files with backticks, no huge pasted code):

1. **Scope** — staged file list, or unstaged paths touched in-session, or user-defined scope; optional `git diff --cached` note; PR intent if given.
2. **Status** — one line: `open | in progress | closed` and last updated.
3. **Findings** — table or list: id, severity, file, one-line issue, **status** (`open` / `done` / `deferred` / `wontfix`), optional commit or PR ref when done.
4. **Directives** — numbered list aligned with findings; mark done when resolved.
5. **Verdicts** — latest merge readiness (`ready` | `needs changes`) and test coverage summary.
6. **Notes** — assumptions, open questions, links.

**Cleanup:** When the review is closed (or the user asks), delete the file or move a final summary elsewhere. If the user prefers no repo files, offer to keep state only in chat and skip the file for that session.

### Next step until closure (required)

Unless the user asked for a **read-only** review, treat the review as an open checklist until everything that matters is done.

1. **After** the Recommended directives block, always ask the user for the **next step** in one clear question (for example: which directive to tackle first, whether to implement fixes automatically, or to re-run review after their edits).
2. When the user applies changes or asks you to implement items, do that work, then **either** give a short delta review (what changed vs. remaining findings) **or** re-run against **newly staged** diffs (or the user’s declared scope) if staging or scope changed. **Read and update** the review tracking file on each of these turns so it stays the canonical checklist.
3. Repeat: end each follow-up turn with **what is still open** (Critical / Major / Minor / tests) and **ask again for the next step** until:
   - there are no remaining **Critical** or **Major** items, and
   - tests and merge verdict are acceptable, **or**
   - the user explicitly stops (defer minors, accept risk, or close the thread).
4. On the turn where nothing substantive remains, state that explicitly, set the tracking file **Status** to `closed`, and offer optional minors or a final sign-off instead of another open-ended loop; delete the tracking file after sign-off if the user agrees.

## Quality Bar

Do not approve code if any of these are true:

- clear bug risk is unresolved
- conventions/rules are materially violated (including **URL/routes naming** per **`.cursor/rules/url-routes-review.mdc`** when routes/paths in scope — e.g. underscores in paths, hardcoded URLs, missing route constants, type-unsafe dynamic routes)
- new non-trivial logic is **structurally untestable** or **severely violates SoC/SOLID** with no refactor plan (**`.cursor/rules/testability-solid-soc.mdc`**)
- **secrets or unvalidated server inputs** cross the client boundary or ship in `NEXT_PUBLIC_*` per **`.cursor/rules/nextjs-data-security.mdc`**
- **authorization is client-only** or **server actions skip session checks** per **`.cursor/rules/nextjs-authentication.mdc`**
- **client bundle regression** from `import *` / namespace re-export of large libs or duplicate heavy dependencies with no mitigation (**`.cursor/rules/bundle-size-investigation.mdc`**)
- scoped client code still uses **avoidable sync/derive `useEffect`** patterns that [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect) addresses (derive in render, handlers, `useMemo`, `key`, Query/RSC) with no plan to fix
- **avoidable performance anti-patterns** called out in **`vercel-react-best-practices/SKILL.md`** (`.cursor/skills/` or `.agents/skills/`) remain in scope with no plan (when the change touches fetching, bundles, or client/server splits)
- static review suggests **render or interaction regressions** on hot UI or RSC paths, but there is **no plan** to confirm or fix (e.g. **[React Performance tracks](https://react.dev/reference/dev-tools/react-performance-tracks)** in dev, or a concrete code change)
- key flows have no meaningful tests
- edge cases are ignored where failures are likely

Prefer actionable, specific guidance over generic comments.
