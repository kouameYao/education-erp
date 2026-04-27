# ERP Scolaire — SIMATINTA

Monorepo client web d'un ERP scolaire SaaS multi-tenant pour le marché ivoirien / zone OHADA.

L'API et la persistance sont gérées par un service externe ; ce repo héberge uniquement les applications web et les packages partagés.

## Stack

- **Bun** workspaces — gestion du monorepo
- **Turborepo** — orchestration des tâches
- **Biome** — lint + format
- **TypeScript** strict — strictness renforcée (`exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`, `noImplicitOverride`, `noFallthroughCasesInSwitch`)
- **Next.js 15** + **React 19** — apps web
- **shadcn/ui** + **Tailwind CSS** — design system

## Structure

```
apps/
  landing-page/         site marketing public
  web/                  (à venir) dashboard SaaS multi-rôles
  admin/                (à venir) back-office plateforme
packages/
  ui/                   composants partagés (shadcn + Radix + Tailwind)
  utils/                utilitaires génériques (format, sanitize, envs)
  logger/               logger pino partagé
  tsconfig/             configurations TS partagées (base, nextjs, react-library)
```

## Démarrer

Prérequis : Bun ≥ `1.3.11` (cf. [`.bun-version`](.bun-version)).

```bash
bun install
bun run dev                              # lance toutes les apps en parallèle
bun run dev --filter=@erp/landing-page   # cible une app spécifique (idem pour build, lint, etc.)
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

## Conventions

- Tous les packages internes sont nommés sous le scope `@erp/*`
- Les configs TS héritent de `@erp/tsconfig/{base,nextjs,react-library}.json`
- **Pas de barrel imports** : exposer chaque module via `exports` dédiée dans le `package.json`, jamais d'`index.ts` qui se contente de re-exporter
- Imports relatifs avec extension `.js` (requis par `moduleResolution: NodeNext`) sauf dans `@erp/ui` et apps Next.js (Bundler)

## Ajouter une app

1. Créer `apps/<nom>/` avec son propre `package.json` nommé `@erp/<nom>`
2. Hériter de `@erp/tsconfig/nextjs.json` ou `@erp/tsconfig/base.json` selon le contexte
3. Ajouter les scripts `dev`, `build`, `lint`, `typecheck` (Turbo détecte automatiquement)
