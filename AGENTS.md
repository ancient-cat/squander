# Repository Guidelines

## Project Structure & Module Organization

Squander is a TypeScript game toolkit built with PixiJS 8 and Svelte 5. Library code lives in `src/lib/`: `core/` contains game logic and viewport code; `ui/` contains Svelte components; `scenes/` contains demos. Public exports are defined in `src/lib/index.ts`; adding a file does not expose it automatically.

Documentation is under `src/routes/(docs)/`; playable examples are under `src/routes/(game)/scenes/`. Static assets belong in `static/`. Vitest tests live beside source files; Playwright tests live in `tests/`. Do not edit generated `build/`, `dist/`, or `.svelte-kit/` files.

## Build, Test, and Development Commands

- `npm ci`: install the exact locked dependencies.
- `npm run dev`: start the local docs and demo server.
- `npm run check`: run Svelte and TypeScript diagnostics.
- `npm run lint`: check Prettier formatting and ESLint rules.
- `npm run test:unit -- --run`: run Vitest once; omit `--run` for watch mode.
- `npm run test:integration`: run browser tests with Playwright.
- `npm run package`: build `dist/` and validate package exports with Publint.
- `npm run build`: build both the static site and library package.

## Coding Style & Naming Conventions

Use two-space indentation, double quotes, trailing commas, and a 140-character print width. Prettier and ESLint enforce these rules. Functions and variables generally use `snake_case`; components and types use `PascalCase`. Keep SvelteKit names such as `+page.svelte`. Use Svelte 5 runes (`$props`, `$state`) in new components and perform DOM work inside lifecycle code.

## Testing Guidelines

Name unit tests `*.test.ts` or `*.spec.ts` beneath `src/`; Vitest only discovers that tree. Place browser flows in `tests/`. Coverage is minimal, so add focused tests and manually exercise the relevant demo for rendering or lifecycle work. Run `npm run package` when changing exports.

## Commit & Pull Request Guidelines

History uses short, imperative subjects such as `Update docs`, `Fix Scenes.current being incorrect`, and `Add demo of scene stack`. Keep each commit focused and avoid mixing generated files with source changes. Pull requests should explain the behavior change, list validation performed, link related issues, and include screenshots or recordings for visible UI or rendering changes.

## Agent-Specific Instructions

Inspect `git status` before editing and preserve unrelated work in a dirty tree. Prefer source code over stale examples when behavior differs. Keep changes scoped, update documentation for public API changes, and report pre-existing check failures separately.
