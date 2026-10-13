# Contributing to VERILOCK

Thank you for your interest in contributing! This document outlines the process for contributing to this educational blockchain simulation.

## Development Setup

1. **Fork and clone** the repository
2. **Install dependencies**:
   ```bash
   pnpm install
   ```
3. **Start the dev server**:
   ```bash
   pnpm dev
   ```
4. **Open** http://localhost:5173

## Branch Naming

Use descriptive branch names with prefixes:

| Prefix | Use Case |
|--------|----------|
| `feat/` | New features or pages |
| `fix/` | Bug fixes |
| `refactor/` | Code restructuring without behavior change |
| `docs/` | Documentation updates |
| `chore/` | Maintenance, dependencies, config |
| `test/` | Test additions (when test framework is added) |

Examples: `feat/merkle-tree-visualization`, `fix/transaction-modal-validation`, `docs/architecture-diagram`

## Commit Conventions

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `refactor`, `docs`, `chore`, `style`, `perf`, `test`

Examples:
```
feat(transactions): add asset conflict detection
fix(crypto): handle empty input in sha256
refactor(components): extract Icon to common
docs(readme): add deployment section
chore(deps): update react to 19.2.4
```

## Code Style

- **Format**: Run `pnpm format` before committing (uses oxfmt)
- **Lint**: Run `pnpm lint` — CI will fail on formatting issues
- **Types**: Run `pnpm typecheck` — strict TypeScript enabled
- **Imports**: Use `@/` alias for `src/` imports
- **Components**: One component per file, PascalCase filenames
- **Types**: Shared types in `src/types/index.ts`

## Adding a New Page

1. Create `src/pages/NewPage.tsx`
2. Export from `src/pages/index.ts`
3. Add route in `src/App.tsx`:
   - Import the page component
   - Add case in the main render switch
4. Add navigation entry in `src/components/layout/Sidebar.tsx`:
   - Add to `nav` array with `id`, `label`, `icon`, optional `group`
5. Update documentation in `src/pages/Docs.tsx` if applicable

## Pull Request Process

1. **Create** a feature branch from `main`
2. **Make** focused, atomic commits
3. **Run** all checks locally:
   ```bash
   pnpm lint && pnpm typecheck && pnpm build
   ```
4. **Push** and open a PR against `main`
5. **Describe** the change in the PR:
   - What problem does it solve?
   - How was it tested?
   - Any breaking changes?
6. **Address** review feedback
7. **Squash** and merge when approved

## Reporting Issues

Use GitHub Issues with:
- Clear title and description
- Steps to reproduce
- Expected vs actual behavior
- Browser/OS if UI-related
- Screenshots if helpful

## Questions?

Open a GitHub Discussion or issue for questions about architecture, implementation, or contribution ideas.