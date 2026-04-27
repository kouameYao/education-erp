---
description: Scaffold a new @erp/<name> package under packages/<name>/ following monorepo conventions.
---

# /new-package

Tu vas créer un nouveau package interne `@erp/<nom>` sous `packages/<nom>/`.

## Input
`$ARGUMENTS` = nom du package en kebab-case, **sans** le préfixe `@erp/` (ex: `auth`, `query-client`, `domain-models`).

Si l'argument est manquant ou n'est pas en kebab-case, demande-le avant de continuer.

## Pré-flight

1. Vérifie que `packages/<nom>/` n'existe pas déjà (`ls packages/<nom>` doit échouer).
2. Lis `CLAUDE.md` à la racine pour rappeler les conventions exactes.

## Étapes

### 1. Créer la structure
```
packages/<nom>/
  package.json
  tsconfig.json
  src/
    .gitkeep
```

### 2. `package.json`
**Modèle exact** (remplace `<nom>` partout) :
```json
{
  "name": "@erp/<nom>",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "sideEffects": false,
  "exports": {},
  "scripts": {
    "clean": "rm -rf .turbo node_modules",
    "lint": "biome check .",
    "lint:fix": "biome check --write .",
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "typescript": "^6.0.2"
  }
}
```
- **Jamais** de `main` ni `types`. Le champ `exports` reste vide pour l'instant ; l'utilisateur ajoutera ses entrées au fur et à mesure (ex: `"./format": "./src/format.ts"`).
- Si l'utilisateur a précisé que le package contiendra du React (composants, hooks), demande-lui s'il veut un package "react-library" — auquel cas `tsconfig` extends `@erp/tsconfig/react-library.json` au lieu de `base.json`.

### 3. `tsconfig.json`
Par défaut (Node/utility package) :
```json
{
  "extends": "@erp/tsconfig/base.json",
  "include": ["src"],
  "exclude": ["node_modules"]
}
```
Pour un package React :
```json
{
  "extends": "@erp/tsconfig/react-library.json",
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
```

### 4. `src/.gitkeep`
Fichier vide pour committer le dossier.

### 5. Mise à jour des `next.config.ts` des apps
Si une app Next.js de ce repo va consommer ce package, **ajoute** `@erp/<nom>` dans son `transpilePackages` (ordre alphabétique). À ce stade, c'est `apps/landing-page/next.config.ts`. Demande à l'utilisateur si le package doit être consommé par les apps existantes — si oui, fais l'ajout. Sinon, laisse pour plus tard.

### 6. `bun install`
Pour générer les symlinks workspace.

## Vérifications post-création
```bash
bun run lint --filter=@erp/<nom>
bun run typecheck --filter=@erp/<nom>
```
Les deux doivent passer (vide = succès).

## Rapport
Termine par un récap court :
- Chemin du package créé
- Convention utilisée (`base` vs `react-library`)
- Apps mises à jour avec `transpilePackages` (le cas échéant)
- Prochaine étape : ajouter une 1ère entrée dans `exports` quand un module est créé
