# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Kill anything on port 3000, then start Next.js dev server
npm run build    # Static export build → out/
npm start        # Serve the built static site
```

No test suite or linter is configured.

## Architecture

**Static-export Next.js 16 + Tailwind CSS v4**, deployed to GitHub Pages via Actions.

- `next.config.mjs` — `output: 'export'`, `images: { unoptimized: true }`, `basePath` and `trailingSlash` gated on `BASE_PATH` env var (set in CI for GitHub Pages).
- Every page is `'use client'` — this is a purely client-rendered SPA. There are no Server Components, no route handlers.
- **CSS theme**: Dark and classic themes are applied via JS setting CSS custom properties (`--bg`, `--fg`, `--accent`, etc.) on `document.documentElement`. Tailwind `@theme` blocks in `globals.css` define fallback values. The theme toggle is in `Header.tsx`, persisted to `localStorage('bg-theme')`.

## Directory Map

| Directory | Purpose |
|-----------|---------|
| `src/data/` | All static content as typed TS objects — hexagram definitions, bagua, yao lines, glossary, pinyin mappings, liuyao steps, etc. This is the "database." |
| `src/components/` | Shared UI components (`Header`, `PageHeader`, `Yao`, `Coin`, `HexagramRelations`, `Ruby`, etc.) |
| `src/contexts/` | `PinyinContext` — toggles ruby/pinyin annotations site-wide |
| `src/hooks/` | `usePageTitle`, `useDivineHistory` (localStorage-backed), `divineTypes.ts` |
| `src/app/` | App Router pages — one folder per route, each with a `page.tsx` |
| `public/` | PWA manifest, service worker, icons, `mcp-actions.json` (WebMCP agent action manifest) |

## Key Patterns

**Pages** follow a consistent structure:
1. `usePageTitle('页面标题 · 八卦入门')` at the top
2. `<PageHeader title="..." subtitle="..." />` for the heading
3. Content below, often referencing `src/data/` objects

**Data layer** (`src/data/`):
- `bagua.ts` — 8 trigrams (`Bagua` interface), plus utility functions (`baguaMap`, `numToBagua`, `getHexagramName`, `getHexagramSymbol`)
- `hexagrams.ts` — 64 hexagram details (`HexagramDetail` with `judgment`, `image`, `meaning`) keyed by `"upperId-lowerId"`
- `yao_lines.ts` — 384 individual yao line texts
- `pinyin.ts` — character → pinyin map for ruby annotations
- `liuyao.ts` — Liuyao (Six Yao) divination computation logic
- `hexagramRelations.ts` — inter-hexagram relationships (mutual, inverse, reverse hexagrams)

**Theme**: Dark/classic themes are stored in `localStorage('bg-theme')` and applied by setting 14 CSS custom properties directly on `documentElement` in `Header.tsx`. The `Providers` component wraps the app with `PinyinProvider`.

**Pinyin toggle**: The `PinyinContext` toggles a `show-pinyin` class on `<body>`, which CSS uses to show/hide `<rt>` elements. The `Ruby` and `RubyText` components in `Ruby.tsx` wrap Chinese characters in `<ruby>` tags.

**Divination history**: `useDivineHistory` hook persists divination records to `localStorage('bagua-divine-history')`, with add/delete/clear operations and date grouping.

**AI Reading**: The `/ai-reading` page calls DeepSeek API directly from the client with streaming, using an API key stored in `localStorage`.

**WebMCP**: `public/mcp-actions.json` declares actions (divine, AI reading, life gua calculation) that AI agents can discover and invoke on the site.

## Tailwind v4 Notes

- No `tailwind.config.js` — config is in `globals.css` via `@theme` blocks
- PostCSS plugin: `@tailwindcss/postcss`
- Custom colors use `--color-*` convention in `@theme`, accessible as Tailwind classes
