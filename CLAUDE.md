# CLAUDE.md

Project guide loaded automatically by Claude Code in every session.

## Source canonique

**Toutes les conventions du repo sont dans [`AGENTS.md`](./AGENTS.md)** (stack, layout, no barrel imports, NodeNext `.js`, `transpilePackages`, lefthook, commandes).

Mettre à jour `AGENTS.md` — ce fichier est juste un pointeur pour Claude Code, qui partage le même périmètre que les autres agents IA.

## Spécificités Claude Code

### Slash commands disponibles

- `/new-package <nom>` — scaffold un nouveau `@erp/<nom>` avec toutes les conventions de la section 4 d'`AGENTS.md`
- `/audit-monorepo` — vérifier que tous les packages et apps respectent les conventions

### Memory pertinente

- `feedback_no_barrel_imports` — règle "no barrel" déjà persistée. Voir `AGENTS.md` §1 pour le détail.

### Hooks git actifs

Lefthook configuré (cf. `lefthook.yml`) : `pre-commit` (biome + lint), `commit-msg` (conventional), `pre-push` (test + build). Si un commit échoue : **corriger la cause**, ne pas utiliser `--no-verify`.
