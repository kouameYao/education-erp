---
version: alpha
name: SIMATINTA
description: ERP scolaire SaaS OHADA — identité orange chaleureuse, institutionnelle et moderne, optimisée pour la lisibilité administrative et la confiance.
colors:
  # Couleur d'accent principale — orange chaleureux et moderne
  primary: "#EA580C"
  primary-hover: "#C2410C"
  primary-foreground: "#FFFFFF"

  # Surface
  background: "#FFFFFF"
  foreground: "#0F172A"
  card: "#FFFFFF"
  card-foreground: "#0F172A"
  popover: "#FFFFFF"
  popover-foreground: "#0F172A"

  # Neutres (palette slate, légèrement teintée bleu pour cohérence avec primary)
  muted: "#F1F5F9"
  muted-foreground: "#475569"
  secondary: "#F1F5F9"
  secondary-foreground: "#0F172A"
  accent: "#FFF7ED"
  accent-foreground: "#C2410C"
  border: "#E2E8F0"
  input: "#E2E8F0"
  ring: "#EA580C"

  # États sémantiques
  destructive: "#DC2626"
  destructive-foreground: "#FFFFFF"
  success: "#16A34A"
  success-foreground: "#FFFFFF"
  warning: "#D97706"
  warning-foreground: "#FFFFFF"
  info: "#0EA5E9"
  info-foreground: "#FFFFFF"

typography:
  display:
    fontFamily: Inter
    fontSize: 3.75rem
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.025em"
  h1:
    fontFamily: Inter
    fontSize: 3rem
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  h2:
    fontFamily: Inter
    fontSize: 2.25rem
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  h3:
    fontFamily: Inter
    fontSize: 1.5rem
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  h4:
    fontFamily: Inter
    fontSize: 1.25rem
    fontWeight: 600
    lineHeight: 1.35
  body-lg:
    fontFamily: Inter
    fontSize: 1.125rem
    fontWeight: 400
    lineHeight: 1.6
  body-md:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.6
  body-sm:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.5
  caption:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.01em"
  mono:
    fontFamily: JetBrains Mono
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.5

rounded:
  none: 0px
  sm: 4px
  md: 8px
  lg: 12px
  xl: 16px
  "2xl": 20px
  "3xl": 24px
  full: 9999px

spacing:
  "0": 0px
  "1": 4px
  "2": 8px
  "3": 12px
  "4": 16px
  "5": 20px
  "6": 24px
  "8": 32px
  "10": 40px
  "12": 48px
  "16": 64px
  "20": 80px
  "24": 96px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "12px 20px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.primary-foreground}"
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.secondary-foreground}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "12px 20px"
  button-ghost:
    backgroundColor: transparent
    textColor: "{colors.foreground}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "12px 20px"
  button-destructive:
    backgroundColor: "{colors.destructive}"
    textColor: "{colors.destructive-foreground}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "12px 20px"
  input:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: "10px 14px"
    height: 40px
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    rounded: "{rounded.lg}"
    padding: 24px
  badge:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-foreground}"
    typography: "{typography.caption}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
---

## Overview

**SIMATINTA** est un ERP scolaire multi-tenant pour le marché OHADA / Côte d'Ivoire. L'identité visuelle conjugue deux registres :

- **Institutionnel** — l'outil gère des données administratives et pédagogiques sensibles (notes, présences, paiements). Le visuel doit transmettre fiabilité, sérieux, durabilité.
- **Moderne** — l'utilisateur quotidien (chef d'établissement, surveillant général, parent, élève) attend une expérience SaaS contemporaine, pas un logiciel administratif des années 2000.

L'équilibre se traduit par : un **orange chaleureux assumé** comme accent unique, une **typographie sans-serif géométrique** (Inter) lisible à toutes les tailles, et un **système de neutres légèrement teintés bleu** (slate) qui contrebalance la chaleur de l'orange et préserve la sobriété administrative.

## Colors

### Palette de base

- **Primary `#EA580C`** — orange chaleureux et moderne (orange-600), unique pilote d'interaction. Utilisé pour les CTA principaux, les liens actifs, les états sélectionnés, le focus ring. Contraste 4.0:1 avec texte blanc → réservé aux boutons texte ≥ 16px bold ou ≥ 18px regular ; pour les liens en texte courant sur fond blanc, utiliser `primary-hover` qui passe AAA.
- **Primary-hover `#C2410C`** — variante assombrie (orange-700) pour les états :hover, :active, et pour les liens en texte courant. Contraste 6.5:1 avec blanc.
- **Accent `#FFF7ED`** — orange très pâle (orange-50) pour les badges informatifs, les surlignages, les zones d'emphase douce. À ne **jamais** utiliser comme fond de bouton.

### Neutres (slate)

Choix délibéré du **slate** plutôt que du zinc/gray neutre : la légère teinte bleutée crée une harmonie avec la primary et adoucit les longues sessions d'utilisation administrative.

- `foreground #0F172A` — texte principal, titres
- `muted-foreground #475569` — texte secondaire, libellés, métadonnées
- `border #E2E8F0` — séparateurs, contours d'inputs
- `muted #F1F5F9` — fonds de tableaux alternés, zones désactivées

### États sémantiques

| Token | Hex | Usage |
|-------|-----|-------|
| `success` | `#16A34A` | Validation, paiement reçu, présence confirmée |
| `warning` | `#D97706` | Échéance proche, données incomplètes |
| `destructive` | `#DC2626` | Suppression, échec, retard de paiement |
| `info` | `#0EA5E9` | Information neutre, tooltips contextuels |

### Règle d'or

**Une seule couleur d'accent à l'écran.** L'orange primary est rare et précieux — il signale l'action principale. Multiplier les boutons oranges dilue la hiérarchie et tire l'identité vers le "fast-food". Pour les actions secondaires, utiliser `button-secondary` (slate) ou `button-ghost`.

## Typography

**Inter** est la police unique de l'interface (sans-serif géométrique humaniste, conçue pour les écrans, excellent rendu en français avec accents et caractères OHADA). `JetBrains Mono` est réservée aux contextes monospace (codes d'inscription, identifiants techniques).

### Échelle

| Token | Taille | Usage |
|-------|--------|-------|
| `display` | 60px / 700 | Hero landing page uniquement |
| `h1` | 48px / 700 | Titre de page |
| `h2` | 36px / 700 | Section majeure |
| `h3` | 24px / 600 | Sous-section, titre de carte |
| `h4` | 20px / 600 | Titre de bloc, en-tête de tableau |
| `body-lg` | 18px / 400 | Texte d'introduction, paragraphes longs |
| `body-md` | 16px / 400 | Texte courant — **défaut** |
| `body-sm` | 14px / 400 | Métadonnées, libellés de formulaire |
| `caption` | 12px / 500 | Badges, timestamps, mentions légales |

### Letter-spacing négatif sur les gros titres

Les titres `display`, `h1`, `h2` utilisent `-0.02em` à `-0.025em` pour un rendu plus dense et moderne. Au-delà de 24px, Inter respire mieux serrée.

## Layout & Spacing

Système d'espacement **basé sur 4px** — chaque valeur est un multiple de 4 pour garantir l'alignement sur la grille pixel.

- **Densité par défaut** : `padding: 16px` (`spacing.4`) sur les blocs, `gap: 24px` (`spacing.6`) entre sections.
- **Densité dense** (tableaux, listes administratives) : `padding: 8-12px`, `gap: 8px`.
- **Largeur max de contenu lecture** : 65ch (~720px). Au-delà, le texte devient fatigant.

## Elevation & Depth

Approche **plate avec ombres minimales**. L'ERP scolaire n'est pas un produit "ludique" — les ombres prononcées feraient amateur. Hiérarchie par :

1. **Bordure 1px** (`border` token) — séparation par défaut entre éléments.
2. **Ombre subtile** (`shadow-sm` Tailwind) — popovers, dropdowns, modales.
3. **Pas d'ombre sur les cartes** dans le contexte d'un dashboard dense — utiliser la bordure.

## Shapes

Identité **généreusement arrondie** — moderne, doux, contemporain. Toujours un radius non nul sur les éléments interactifs et les surfaces.

- **Boutons** : `rounded.lg` (sm), `rounded.xl` (default/icon), `rounded.2xl` (lg) — l'arrondi grandit avec la taille.
- **Inputs, badges textuels** → `rounded.xl` (16px).
- **Cartes internes (dashboard, formulaires)** → `rounded.2xl` (20px).
- **Cartes hero, panels marketing, modales** → `rounded.3xl` (24px).
- **Avatars, pastilles de statut, chips** → `rounded.full`.
- **Tableaux, sections de page large** → `rounded.lg` ou `rounded.xl`.
- **Conteneurs imbriqués** : descendre d'un cran (parent `rounded.3xl` → enfant `rounded.2xl`) pour préserver la lisibilité visuelle des bordures concentriques.

## Components

Voir bloc YAML pour les tokens canoniques. Règles d'application :

- **Boutons** : hauteur 40px par défaut (`spacing.10`), 36px en mode dense, 48px pour les CTA hero. Toujours un seul `button-primary` par vue.
- **Inputs** : hauteur 40px, padding `10px 14px`, bordure visible (`border` token) — jamais d'inputs "fantômes" sans contour, contre-intuitif pour les utilisateurs administratifs.
- **Cartes** : padding interne `24px` (`spacing.6`), bordure 1px, pas d'ombre par défaut.

## Developer usage

Toute la charte est exposée via Tailwind dans `@erp/ui` (preset `tailwind.config.ts` + CSS vars `globals.css`). **Pas besoin de retenir hex/sizes/letter-spacing** — utiliser les classes utilitaires.

### Couleurs

Toutes les couleurs sémantiques sont disponibles en `bg-*`, `text-*`, `border-*`, `ring-*`, `fill-*`, `stroke-*`.

| Token | Classes |
|-------|---------|
| Primary | `bg-primary text-primary-foreground`, hover : `bg-primary-hover` |
| Accent | `bg-accent text-accent-foreground` |
| Secondary | `bg-secondary text-secondary-foreground` |
| Muted | `bg-muted text-muted-foreground` |
| Card | `bg-card text-card-foreground` |
| Popover | `bg-popover text-popover-foreground` |
| Destructive | `bg-destructive text-destructive-foreground` |
| Success | `bg-success text-success-foreground` |
| Warning | `bg-warning text-warning-foreground` |
| Info | `bg-info text-info-foreground` |
| Border / Input | `border-border`, `border-input` |
| Ring (focus) | `ring-ring focus-visible:ring-2 focus-visible:ring-ring` |

Le **dark mode** est déjà câblé : ajouter la classe `dark` sur `<html>` (ou via `next-themes`).

### Typographie

Une seule classe applique d'un coup `font-size` + `line-height` + `letter-spacing` + `font-weight` (les valeurs sont liées dans `fontSize` du config).

| Classe | Usage |
|--------|-------|
| `text-display` | Hero landing uniquement (60px / 700 / -0.025em) |
| `text-h1` | Titre de page (48px / 700 / -0.02em) |
| `text-h2` | Section majeure (36px / 700 / -0.02em) |
| `text-h3` | Sous-section, titre de carte (24px / 600 / -0.01em) |
| `text-h4` | Titre de bloc, en-tête de tableau (20px / 600) |
| `text-body-lg` | Intro, paragraphe long (18px / 400) |
| `text-body-md` | Texte courant — **défaut** (16px / 400) |
| `text-body-sm` | Métadonnées, libellés (14px / 400) |
| `text-caption` | Badges, timestamps (12px / 500) |

Familles : `font-sans` (Inter, défaut sur `<body>`) et `font-mono` (JetBrains Mono).

> Important : `text-h1` ne pose **pas** d'élément HTML. Utiliser la classe sur n'importe quel tag — l'élément `<h1>` reste réservé au véritable titre de page (un seul par page, pour l'a11y).

### Espacement

Système 4px **déjà natif Tailwind**, pas d'extend nécessaire :

| Token spec | Tailwind | Pixel |
|------------|----------|-------|
| spacing.1 | `p-1` / `m-1` / `gap-1` | 4px |
| spacing.2 | `p-2` | 8px |
| spacing.4 | `p-4` | 16px |
| spacing.6 | `p-6` | 24px |
| spacing.8 | `p-8` | 32px |
| spacing.12 | `p-12` | 48px |

### Border radius

| Token | Classe | Pixel | Usage typique |
|-------|--------|-------|---------------|
| sm | `rounded-sm` | 4px | Tableaux denses, séparateurs |
| md | `rounded-md` | 8px | Petites pastilles, séparateurs |
| lg | `rounded-lg` | 12px | Boutons `size="sm"`, sections de page |
| xl | `rounded-xl` | 16px | **Boutons défaut**, inputs, badges |
| 2xl | `rounded-2xl` | 20px | Cartes internes, boutons `size="lg"` |
| 3xl | `rounded-3xl` | 24px | Cartes hero, panels marketing, modales |
| full | `rounded-full` | 9999px | Avatars, pastilles de statut, chips |

### Ombres

| Classe | Usage |
|--------|-------|
| `shadow-xs` | Très subtile (cartes flottantes denses) |
| `shadow-sm` | Popovers, dropdowns, tooltips |
| `shadow-md` | Modales, dialogues |
| `shadow-lg` | Surfaces flottantes prioritaires (rare) |

### Exemples canoniques

```tsx
// Bouton primary CTA
<button className="bg-primary text-primary-foreground hover:bg-primary-hover text-body-md font-medium rounded-md px-5 py-3 transition-colors">
  S'inscrire
</button>

// Bouton secondaire
<button className="bg-secondary text-secondary-foreground hover:bg-muted text-body-md font-medium rounded-md px-5 py-3 transition-colors">
  Annuler
</button>

// Bouton destructif
<button className="bg-destructive text-destructive-foreground text-body-md font-medium rounded-md px-5 py-3">
  Supprimer
</button>

// Titre de page
<h1 className="text-h1 text-foreground">Tableau de bord</h1>

// Carte
<article className="bg-card text-card-foreground border border-border rounded-lg p-6">
  <h3 className="text-h3 mb-2">Élèves inscrits</h3>
  <p className="text-body-md text-muted-foreground">847 élèves répartis sur 24 classes.</p>
</article>

// Input
<input
  type="text"
  className="bg-background text-foreground border border-input rounded-md px-3.5 py-2.5 h-10 text-body-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
/>

// Badge
<span className="bg-accent text-accent-foreground text-caption rounded-full px-2.5 py-1">
  Nouveau
</span>

// État sémantique : succès
<div className="bg-success/10 text-success border border-success/20 rounded-md px-4 py-3 text-body-sm">
  Paiement reçu.
</div>
```

## Do's and Don'ts

### Do

- ✅ Utiliser `primary` **uniquement** pour l'action principale d'une vue.
- ✅ Privilégier `button-secondary` ou `button-ghost` pour les actions secondaires.
- ✅ Charger Inter via `next/font` (pré-rendu, zéro CLS).
- ✅ Respecter la hiérarchie typographique — un seul `h1` par page.
- ✅ Tester le contraste AA (4.5:1) sur tous les textes — outil : `pnpm dlx design-md lint` une fois la spec stabilisée.

### Don't

- ❌ Pas de gradient sur les CTA — l'identité reste plate et institutionnelle.
- ❌ Pas de couleur primary saturée comme fond de page entière (réserver à l'accent).
- ❌ Pas plus de **3 niveaux d'ombre** distincts dans toute l'app.
- ❌ Pas d'orange hors palette pour les liens (utiliser `primary-hover` pour le texte courant).
- ❌ Pas de combinaison orange + rouge (`destructive`) côte-à-côte — les hues se chevauchent et créent du bruit visuel.
- ❌ Pas de border-radius mixé sans logique : un parent `rounded-3xl` ne contient pas un enfant `rounded-md` — descendre d'un cran à la fois.
- ❌ Pas d'utilisation de `destructive` comme accent décoratif — réservé aux actions destructives réelles.
