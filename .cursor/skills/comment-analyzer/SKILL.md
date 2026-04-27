---
name: comment-analyzer
description: >-
  Analyze code comments for accuracy, completeness, maintainability, and comment-rot
  risk. Use when reviewing a file, PR, or module for documentation debt, before
  merge of comment-heavy changes, or when the user asks to audit comments / JSDoc /
  TODOs.
---

# Comment analyzer

**Advisory** pass: comments should match the code, earn their space, and not mislead future readers.

## Provenance

Adapted from [everything-claude-code — `agents/comment-analyzer.md`](https://github.com/affaan-m/everything-claude-code/blob/62519f2b622b44d8289d573bb6e74c4c95fc7400/agents/comment-analyzer.md).

## Repo bias (Paynah)

This codebase generally prefers **clear names and structure** over **verbose inline narration** (see project norms: avoid obvious comments; document **why**, non-obvious **invariants**, and **security/safety** context). Flag **low-value** comments that only restate identifiers; suggest **deletion** or **replacement** with better naming when that fixes the need.

## Analysis framework

### 1. Factual accuracy

- Claims in comments match the **current** implementation (params, returns, errors).
- References to other files, tickets, or behavior are still valid.
- **Edge cases** described in comments are still true after refactors.

### 2. Completeness

- Non-obvious logic (workarounds, ordering dependencies, React Query key rationale) has **enough** context for the next maintainer.
- **Public or exported** APIs: JSDoc or module-level notes cover contract and failure modes where the type system does not.
- **Side effects** (I/O, auth, cache invalidation) called out when not obvious from signatures.

### 3. Long-term value

- Comments that **duplicate** the code line-for-line → **Low-value** (remove or shorten).
- Comments tied to **volatile** implementation detail that will rot quickly → flag **Stale** risk.
- **`TODO` / `FIXME` / `HACK`**: categorize debt (blocking vs nice-to-have); link to issue id when the team uses that.

### 4. Misleading elements

- Text **contradicts** the code.
- Describes **removed** behavior, old library versions, or wrong modules.
- **Over-promises** guarantees the code does not enforce.

## Output format

Group findings by severity (use these labels consistently):

| Severity | Meaning |
|----------|---------|
| **Inaccurate** | Comment contradicts code or docs—fix or remove urgently |
| **Stale** | Outdated references or behavior; update or delete |
| **Incomplete** | Missing “why”, edge cases, or API contract where needed |
| **Low-value** | Noise, restatement of code—prefer deletion or rename refactor |

For each finding: **file**, **line or block** (approximate), **excerpt**, **issue**, **suggested fix** (rewrite text, delete, or open ticket for TODO).

## Scope

- Default to **user-named paths** or **PR diff**; do not roam the whole repo unless asked.
- **Do not** add large comment blocks unprompted; this skill **analyzes** existing comments unless the user asks for rewrites.

## Overlap

- **Security-sensitive** comments wrong or missing → also consider **`security-reviewer/SKILL.md`**.
- **Dead commented-out code** → prefer removal (**`code-simplifier`** / **`refactor-cleaner`**).
