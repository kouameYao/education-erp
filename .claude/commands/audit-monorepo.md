---
description: Audit every @erp/* package and Next.js app for monorepo convention compliance. Read-only, no edits.
---

# /audit-monorepo

Vérifie que chaque package interne et chaque app respecte les conventions documentées dans `CLAUDE.md`. **Read-only** — n'édite **rien**, produis seulement un rapport.

## Périmètre

- Tous les `packages/*/package.json` et `packages/*/tsconfig.json`
- Tous les `apps/*/package.json`, `apps/*/tsconfig.json`, et `apps/*/next.config.{ts,js}`
- `turbo.json` (pour vérifier que les tasks référencées existent dans les packages)

## Checks à exécuter

### Packages (`packages/*`)

Pour chaque `packages/<nom>/package.json` :
- [ ] `"private": true`
- [ ] `"type": "module"`
- [ ] `"sideEffects": false`
- [ ] champ `"exports"` présent **et** non vide (sauf packages de config type `@erp/tsconfig` qui exposent des `.json` via `files`)
- [ ] **pas** de champ `"main"` ni `"types"` (sauf justification explicite)
- [ ] scripts `lint`, `lint:fix`, `typecheck` présents et conformes (`biome check .`, `biome check --write .`, `tsc --noEmit`)

Pour chaque `packages/<nom>/tsconfig.json` :
- [ ] `"extends"` pointe sur `@erp/tsconfig/{base,react-library,nextjs}.json`
- [ ] `"include"` est `["src"]` (pas `["."]` ni autre)

Pour le dossier `packages/<nom>/src/` :
- [ ] Pas de `index.ts` qui re-exporte (`export * from ...` ou `export { ... } from ...` comme seul contenu) — c'est un barrel interdit
- [ ] Chaque fichier référencé dans `exports` du `package.json` existe bien
- [ ] Imports relatifs internes utilisent l'extension `.js` (sauf `@erp/ui` et packages qui extends `react-library.json`)

### Apps (`apps/*`)

Pour chaque `apps/<nom>/next.config.{ts,js}` :
- [ ] `transpilePackages` contient **tous** les `@erp/*` listés en `dependencies` du `package.json` de l'app
- [ ] `outputFileTracingRoot` pointe sur la racine du monorepo

Pour chaque `apps/<nom>/tsconfig.json` :
- [ ] `"extends"` pointe sur `@erp/tsconfig/nextjs.json`

### `turbo.json`
- [ ] Chaque task référencée (`build`, `lint`, etc.) a un script correspondant dans au moins un package
- [ ] Aucun task déclaré et jamais utilisé (drift)

## Format du rapport

Produis un tableau Markdown groupé par sévérité :

### 🔴 Bloquant
Convention violée qui va casser un build, un typecheck, ou une publication. Référence : `package:check`.

### 🟡 Drift
Incohérence entre packages, ou config morte. À aligner mais pas urgent.

### 🟢 Conforme
Listing court des packages/apps qui passent tous les checks (1 ligne chacun).

## Exemple de sortie

```
🔴 Bloquant
- @erp/utils:include — tsconfig.json a `"include": ["."]` (attendu `["src"]`)
- apps/landing-page:transpilePackages — manque `@erp/logger` qui est en dependencies

🟡 Drift
- @erp/logger:version — `0.0.0` alors que les autres sont en `1.0.0`

🟢 Conforme
- @erp/env, @erp/testing, @erp/ui
```

## Notes
- Si un package est intentionnellement "config-only" (comme `@erp/tsconfig` qui shippe des `.json`), documente-le dans le rapport plutôt que de le marquer non-conforme.
- Si un check révèle une nouvelle convention non documentée dans `CLAUDE.md`, signale-le à la fin pour que l'utilisateur tranche (à ajouter à `CLAUDE.md` ou exception ponctuelle).
