# GitHub Copilot Instructions

> **Source canonique des conventions : [`AGENTS.md`](../AGENTS.md)**. Ce fichier est un condensé pour Copilot.

## Stack

Monorepo Bun + Turborepo. Apps Next.js 15 / React 19. Packages internes en TS brut (no build step). Biome pour lint/format. TypeScript 6 strict. Lefthook pour les git hooks. Conventional Commits obligatoires.

## Règles non-négociables

1. **No barrel imports.** Pas de `src/index.ts`. Chaque module = une entrée dédiée dans `exports` du `package.json`. Importer via le chemin nommé : `@erp/utils/format`, jamais `@erp/utils`.

2. **NodeNext `.js` extension** sur imports relatifs intra-package (`./foo.js`), sauf dans `@erp/ui` et apps Next.js (Bundler resolution).

3. **`transpilePackages` Next.js** : toute app Next.js doit lister tous les `@erp/*` consommés dans `next.config.ts > transpilePackages`.

4. **Forme package interne** : `private: true`, `type: "module"`, `sideEffects: false`, `exports` (jamais `main`/`types`), extends `@erp/tsconfig/*`, `include: ["src"]`.

5. **Naming** : kebab-case partout (dossiers, fichiers, noms de package).

6. **Commits** : `<type>(<scope>?): <description>` — types `feat|fix|chore|docs|refactor|test|build|ci|perf|style|revert`.

## Commandes

```bash
bun run dev                       # toutes les apps
bun run dev:landing-page          # une app
bun run lint / typecheck / test / build
```

## Workflow

Avant de proposer du code :
- Vérifier la forme attendue d'un package interne avant d'en créer un nouveau.
- Si un import inter-package échoue : ajouter une entrée `exports`, **pas** un barrel.
- Ne jamais suggérer `git commit --no-verify` : si un hook plante, corriger la cause.
