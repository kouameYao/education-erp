# ERP Scolaire — SIMATINTA

Monorepo client web d'un ERP scolaire SaaS multi-tenant pour le marché ivoirien / zone OHADA.

L'API et la persistance sont gérées par un service externe ; ce repo héberge uniquement les applications web et les packages partagés.

## Stack

- **Bun** workspaces — gestion du monorepo
- **Turborepo** — orchestration des tâches
- **Biome** — lint + format
- **TypeScript** strict — strictness renforcée (`exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`, `noImplicitOverride`, `noFallthroughCasesInSwitch`)
- **Next.js 16** + **React 19** — apps web
- **shadcn/ui** + **Tailwind CSS** — design system

## Structure

```
apps/
  landing-page/         site marketing public (port 3000)
  web/                  dashboard SaaS — ENS, DIR, SEC, CPT, RH, BIB (port 3001)
  portal/               portail PWA offline-first — ETU, PAR (port 3002)
  admin/                back-office multi-tenant — ADM-plateforme, INSP MEN (port 3003)
packages/
  env/                  validation env (T3 env + zod)
  i18n/                 wrapper next-intl (locales fr/en)
  logger/               logger pino partagé
  testing/              configs vitest + MSW + Testing Library
  tsconfig/             configurations TS partagées (base, nextjs, react-library)
  ui/                   composants partagés (shadcn + Radix + Tailwind)
  utils/                utilitaires génériques (format, sanitize, envs)
```

## Démarrer

Prérequis : Bun ≥ `1.3.11` (cf. [`.bun-version`](.bun-version)).

```bash
bun install
bun run dev                # lance toutes les apps en parallèle
bun run dev:landing-page   # marketing (port 3000)
bun run dev:web            # dashboard SaaS (port 3001)
bun run dev:portal         # portail PWA (port 3002)
bun run dev:admin          # back-office (port 3003)
```

## Scripts utiles

```bash
bun run lint         # Biome check
bun run lint:fix     # Biome check --write
bun run format       # Biome format
bun run typecheck    # tsc --noEmit sur tous les packages
bun run test         # tests unitaires
bun run build        # build de production
```

## Utiliser un package partagé dans une app

**Important** : les packages `@erp/*` ne sont pas auto-injectés dans les apps. Pour qu'une app accède à `@erp/utils` (ou n'importe quel autre), tu dois **l'installer comme un package classique**, même si c'est interne au monorepo.

### Étape 1 — Déclarer la dépendance

Dans `apps/<app>/package.json`, ajouter le package en `workspace:*` :

```jsonc
// apps/web/package.json
{
  "dependencies": {
    "@erp/env": "workspace:*",
    "@erp/logger": "workspace:*",
    "@erp/ui": "workspace:*",
    "@erp/utils": "workspace:*"
  }
}
```

Ou en CLI :

```bash
cd apps/web && bun add @erp/utils@workspace:*
```

Puis à la racine :

```bash
bun install
```

### Étape 2 — Déclarer dans `transpilePackages`

Tous les packages internes shippent du **TS brut sans build**. Next.js a besoin de savoir quels packages transpiler. Dans `apps/<app>/next.config.ts` :

```ts
const nextConfig: NextConfig = {
  transpilePackages: [
    "@erp/env",
    "@erp/logger",
    "@erp/ui",
    "@erp/utils",
    // …tout @erp/* consommé doit apparaître ici
  ],
};
```

⚠️ Oublier cette étape = build OK en dev, plante en prod sur les imports relatifs `.js` non transpilés.

### Étape 3 — Importer via une entrée nommée

Les packages exposent leurs modules via le champ `exports` de leur `package.json`. **Pas de barrel** — un import = un module précis :

```ts
import { env } from "@erp/env/next";
import { logger } from "@erp/logger/logger";
import { Button } from "@erp/ui/button";
import { format } from "@erp/utils/format";
```

Ce qui suit `@erp/<pkg>/` correspond aux clés du champ `exports` du package (ex: `@erp/utils/format` → `./src/format.ts`).

## Conventions

- Tous les packages internes sont nommés sous le scope `@erp/*`
- Les configs TS héritent de `@erp/tsconfig/{base,nextjs,react-library}.json`
- **Pas de barrel imports** : exposer chaque module via `exports` dédiée dans le `package.json`, jamais d'`index.ts` qui se contente de re-exporter
- Imports relatifs avec extension `.js` (requis par `moduleResolution: NodeNext`) sauf dans `@erp/ui`, `@erp/i18n` et apps Next.js (Bundler)
- **Conventional Commits** obligatoires (`feat`, `fix`, `chore`, etc.) — validé au pre-commit par lefthook

Pour les détails des conventions et le workflow agent IA, voir [`AGENTS.md`](./AGENTS.md).

## Ajouter une app

1. Créer `apps/<nom>/` avec son propre `package.json` nommé `@erp/<nom>`
2. Hériter de `@erp/tsconfig/nextjs.json`
3. Ajouter les scripts `dev`, `build`, `lint`, `typecheck` (Turbo détecte automatiquement)
4. Ajouter `dev:<nom>` dans le `package.json` racine
5. Pour le déploiement Vercel : ajouter `apps/<nom>/vercel.json` (cf. apps existantes) et créer un projet Vercel avec **Root Directory = `apps/<nom>`**
