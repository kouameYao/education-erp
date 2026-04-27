# AGENTS.md

Guide canonique pour **tout agent IA** travaillant sur ce repo (Claude Code, Codex, Cursor, GitHub Copilot, OpenCode, Aider, etc.). `CLAUDE.md` et `.github/copilot-instructions.md` redirigent vers ce fichier — toute mise à jour des conventions se fait **ici**.

## Project

**SIMATINTA** — ERP scolaire SaaS multi-tenant pour le marché OHADA / Côte d'Ivoire. Le nom de produit est **SIMATINTA** ; "Axiome" est le nom de la société (et du dossier parent).

**Périmètre du repo : frontend uniquement.** Persistance, business rules et API sont implémentées dans un service backend séparé (Java/Spring Boot, repo distinct). Ce repo contient **exclusivement** :
- des apps web Next.js (4 surfaces : `landing-page`, `web`, `portal`, `admin`)
- des packages TypeScript partagés (`@erp/*`)

**Conséquences** :
- Toute logique métier "dure" (validation business, calculs de bulletins, génération de factures…) appartient au backend, pas à un package `@erp/*`. Les packages frontend portent : présentation, validation de **formulaires** (zod côté client), client HTTP typé, état UI, RBAC côté UI.
- Les schémas zod côté frontend reflètent les contrats du backend, ils ne sont pas la source de vérité.
- Pas de DB, pas d'ORM, pas de migrations dans ce repo.

## Stack

- **Bun 1.3.11** workspaces (`packages/*`, `apps/*`)
- **Turborepo 2.x** pour l'orchestration
- **Biome 2.4** pour lint + format
- **TypeScript 6** strict (`exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`, `noImplicitOverride`, `noFallthroughCasesInSwitch`)
- **Next.js 15.5 + React 19.2** côté apps
- **shadcn/ui + Tailwind 3** côté UI
- **Lefthook** pour les git hooks
- **Conventional Commits** obligatoires (validé par lefthook `commit-msg`)

## Workspace layout

```
apps/
  landing-page/        site marketing public (SSG)
  web/                 dashboard SaaS — ENS, DIR, SEC, CPT, RH, BIB, ADM-établissement
  portal/              portail PWA offline-first — ETU, PAR
  admin/               back-office multi-tenant — ADM plateforme, INSP MEN
packages/
  env/                 validation env (T3 env + zod)
  logger/              logger pino
  testing/             configs vitest + MSW + Testing Library
  tsconfig/            base.json / nextjs.json / react-library.json
  ui/                  composants shadcn + Tailwind preset
  utils/               helpers génériques
```

**Mapping persona → app** :
- `web` → ENS (enseignant), DIR (directeur), SEC (secrétaire), CPT (comptable), RH, BIB (bibliothécaire), ADM-établissement
- `portal` → ETU (étudiant), PAR (parent)
- `admin` → ADM-plateforme, INSP (inspecteur MEN)

## Conventions monorepo (à respecter)

### 1. Pas de barrel imports

Chaque module est exposé via une entrée **dédiée** du champ `exports` dans `package.json`. Pas de `src/index.ts` qui re-exporte. Exemple correct (cf. `@erp/utils`, `@erp/logger`) :

```json
"exports": {
  "./format": "./src/format.ts",
  "./sanitize-redirect": "./src/sanitize-redirect.ts"
}
```

Pas de champ `main` ni `types` — uniquement `exports`.

Côté consommateur :

```ts
import { format } from "@erp/utils/format";        // ✓
import { format } from "@erp/utils";               // ✗ pas de barrel
```

### 2. Imports relatifs avec `.js`

`moduleResolution: NodeNext` (cf. `@erp/tsconfig/base.json`) impose l'extension `.js` sur les imports relatifs intra-package, **même si le fichier source est `.ts`** :

```ts
import { baseLogger } from "./instance.js"; // ✓
```

**Exceptions** : `@erp/ui` (extends `react-library.json` → `Bundler`) et toutes les apps Next.js (extends `nextjs.json` → `Bundler`). Là, pas d'extension nécessaire.

### 3. `transpilePackages` exhaustif côté Next.js

Tous les packages internes (`@erp/*`) shippent du **TS brut** sans build. Toute app Next.js qui en consomme **doit** les lister dans `next.config.ts > transpilePackages`. Voir `apps/landing-page/next.config.ts` comme référence.

### 4. Forme de package interne

Tout package `@erp/<nom>` doit avoir :

- `"private": true`
- `"type": "module"`
- `"sideEffects": false`
- `"exports": { ... }` (jamais `main`/`types`)
- `tsconfig.json` qui extends `@erp/tsconfig/{base,nextjs,react-library}.json`
- `tsconfig.json` avec `"include": ["src"]`
- Scripts `lint` (`biome check .`), `lint:fix` (`biome check --write .`), `typecheck` (`tsc --noEmit`)

### 5. Naming

- Dossiers : kebab-case
- Packages : `@erp/<kebab-case>`
- Fichiers source : kebab-case

### 6. Conventional Commits (obligatoire)

Le hook `commit-msg` (lefthook) rejette tout commit qui ne respecte pas :

```
<type>(<scope>?): <description>
```

Types acceptés : `build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `style`, `test`.

Exemple : `feat(landing-page): add hero section`.

### 7. Organisation interne d'une app — feature-first par module

Chaque app suit la même arborescence. Une "feature" = un module M-XX du backlog (cf. `docs-erp-scolaire/user_stories_erp_scolaire.html`).

```
apps/<app>/src/
  app/                     routes Next.js (App Router) — fichiers fins
    layout.tsx             root pass-through (juste `return children`)
    [locale]/              segment d'URL locale — html/body, lang={locale}
      layout.tsx
      page.tsx
    api/                   route handlers / proxy
  features/                bounded contexts, 1:1 avec les modules backend
    iam/                   M-01 — IAM & Authentification
      components/
      hooks/
      schemas/             zod côté client (validation formulaires)
      queries/             TanStack Query (queryKeys + fetchers)
      actions/             server actions Next.js
      permissions.ts       guards RBAC du module
      README.md            US couvertes (US-001..US-007), contrats backend
    users/                 M-02 …
  lib/                     wrappers config-locaux des packages @erp/*
  middleware.ts            tenant resolver + redirect locale + auth guard
```

**Règles** :
- **Pas de barrel `features/<x>/index.ts`** — l'interdit du §1 s'applique aussi aux apps. Importer via path alias : `@/features/iam/components/login-form`.
- **Une feature = un dossier**. Naming kebab-case. La correspondance avec le code module M-XX est notée dans le README de la feature, pas dans le nom de dossier.
- **Pas de logique métier dans les features**. Ce qui appartient au backend reste au backend (cf. "Périmètre du repo : frontend uniquement"). Les features portent : composants, formulaires, requêtes, permissions UI.
- **README par feature** obligatoire — liste les US implémentées + endpoints backend consommés. Permet à un agent IA d'avoir le contexte sans relire toute la spec.

### 8. Multi-tenant

- **Résolution du tenant par subdomain** (US-020) : `middleware.ts` lit `host`, résout `tenantId`, l'injecte en header `x-tenant-id` (et en cookie pour les client components).
- **Accès au tenant** : helper `getTenant()` dans `@erp/tenancy` côté server, `useTenant()` côté client. Ne **jamais** lire `host` directement dans une page.
- **Isolation cache TanStack Query** : toute queryKey doit commencer par `[tenantId, ...]`. Sinon : fuite de cache cross-tenant. Ce préfixe est appliqué automatiquement par les helpers de `@erp/api-client` — ne pas court-circuiter.
- **White-labeling** (US-016) : theme par tenant via override de variables CSS dans le root layout (style inline SSR). Tokens dans `@erp/ui/theme/tokens.ts`.
- **`apps/admin`** est l'exception : il opère **cross-tenant**. Pas de tenant resolver dans son `middleware.ts` ; les queries portent un `tenantId` explicite passé en paramètre.

### 9. Routing locale (sans i18n pour l'instant)

L'i18n applicative (next-intl, traductions, formatters) a été retirée — elle sera réintroduite plus tard. **La structure interne est conservée mais l'URL utilisateur n'expose pas la locale.**

- **Structure interne** : toutes les routes vivent sous `app/[locale]/`. Locales déclarées : `fr` (défaut) et `en`.
- **URL utilisateur sans préfixe** : `/`, `/dashboard` — pas de `/fr` visible.
- **`middleware.ts`** :
  - Si l'URL contient un préfixe explicite (`/fr`, `/fr/dashboard`, `/en`, …) → **redirect 308** vers la version sans préfixe (`/`, `/dashboard`) **+** dépose un cookie `NEXT_LOCALE`.
  - Sinon → **rewrite interne** vers `/{locale}{path}` (lit le cookie `NEXT_LOCALE`, fallback `fr`). L'URL exposée reste sans préfixe.
- Le layout `[locale]/layout.tsx` valide la locale (`notFound()` sinon) et la passe à `<html lang={locale}>`.
- **Aucun appel `useTranslations` / `getTranslations`** dans le code pour l'instant — strings en dur. Quand l'i18n reviendra : ces hooks et le cookie `NEXT_LOCALE` deviendront actifs ; le wrapping URL n'aura pas à bouger.
- **Liens internes** : utiliser des paths sans préfixe (`<Link href="/dashboard">`). Le middleware résout vers la bonne locale via cookie.

## Git hooks (lefthook)

| Hook | Action |
|---|---|
| `pre-commit` | `biome check --write` (fichiers stagés) + `bun run lint` (turbo lint) |
| `commit-msg` | Validation Conventional Commits |
| `pre-push` | `bun run test` + `bun run build` (parallèle) |

Réinstaller après modification du fichier : `bunx lefthook install`.

## Commandes courantes

```bash
bun run dev                              # toutes les apps en parallèle
bun run dev:landing-page                 # marketing (port 3000)
bun run dev:web                          # dashboard SaaS (port 3001)
bun run dev:portal                       # portail PWA ETU/PAR (port 3002)
bun run dev:admin                        # back-office multi-tenant (port 3003)
bun run lint
bun run lint:fix
bun run typecheck
bun run test
bun run build
bun run format                           # biome format --write .
bun run clean                            # git clean -xdf node_modules
```

Pour cibler un package précis sans script dédié :

```bash
bunx turbo <task> --filter=@erp/<nom>
```

## Déploiement Vercel

**Une app = un projet Vercel.** Chaque app `apps/<app>/` ship son propre `vercel.json` qui verrouille la config (framework, install/build, output) — la deploy ne dépend pas du dashboard.

### Setup d'un nouveau projet Vercel pour une app

1. Vercel dashboard → "Add New… → Project" → import du repo Git
2. **Settings → General → Root Directory** : `apps/<app>` (ex: `apps/landing-page`)
3. Save. Vercel lit le `vercel.json` de l'app et applique :
   - `framework: nextjs`
   - `installCommand: "cd ../.. && bun install --frozen-lockfile"` — install à la racine du monorepo (workspace-aware)
   - `buildCommand: "cd ../.. && bunx turbo build --filter=@erp/<app>..."` — turbo gère le cache + les deps internes
   - `outputDirectory: ".next"` — relatif à l'app, **explicite pour éviter le fallback `public/` qui fait planter Vercel**

### Ajouter une nouvelle app à Vercel

À la création d'un nouveau `apps/<nom>` :

1. Créer `apps/<nom>/vercel.json` en copiant celui d'une app existante, en remplaçant le filter `@erp/<nom>...`.
2. Vérifier que `bunx turbo build --filter=@erp/<nom>...` passe en local.
3. Créer le projet Vercel avec Root Directory = `apps/<nom>`.

### Variables d'environnement

À ajouter par projet Vercel (Settings → Environment Variables). À documenter dans le `README.md` de chaque app au fur et à mesure (URL backend, clés OAuth, etc.).

## Pièges connus

- **Ajouter un nouveau `@erp/*` consommé par Next.js** sans le mettre dans `transpilePackages` → build OK en dev, plante en prod sur les imports `.js` non transpilés. Toujours mettre à jour les `next.config.ts`.
- **Supprimer `types/css.d.ts`** : casse `import "./globals.css"` au typecheck. Ce fichier est nécessaire malgré son apparence redondante.
- **Mettre `"include": ["."]` dans un tsconfig de package** : typecheck `package.json` etc. Toujours scoper sur `["src"]`.
- **Ajouter une nouvelle app** sans script `dev:<app>` dans `package.json` racine → l'agent ne pourra pas la lancer isolément.
- **Déploiement Vercel sans `vercel.json` ou sans Root Directory configuré** → erreur `No Output Directory named "public" found`. Solution : un `vercel.json` par app + Root Directory = `apps/<app>` dans le dashboard.

## Workflow attendu pour un agent IA

1. Lire `AGENTS.md` (ce fichier) avant toute modification structurelle.
2. Avant de créer un nouveau package : vérifier la **section 4** ; respecter exports nommés (pas de barrel).
3. Avant de créer une feature dans une app : vérifier la **section 7** ; ajouter un `README.md` listant les US couvertes.
4. Avant de modifier des imports inter-packages : vérifier l'`exports` du package cible — créer une entrée si elle manque, **ne pas** ajouter d'`index.ts`.
5. Avant de commit : laisser lefthook faire son travail. Si un hook échoue, **corriger la cause**, ne pas bypasser avec `--no-verify`.
6. Pour les changements UI : tester dans le navigateur (`bun run dev:<app>`).
7. Ne pas implémenter de logique backend dans ce repo — c'est la frontière du périmètre.
