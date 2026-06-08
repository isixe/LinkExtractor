# PROJECT KNOWLEDGE BASE

**Generated:** 2026-06-08
**Commit:** 803df68
**Branch:** main

## OVERVIEW

Link Extractor — privacy-first, client-side batch URL extraction/validation/export tool. Astro 6 + React 19 + Tailwind CSS 4. SPA on a single page, fully client-side.

## STRUCTURE

```
link-extractor/
├── src/
│   ├── components/     # React UI components (14 files)
│   ├── assets/icons/   # SVG inline icon components (23 files)
│   ├── lib/            # Core business logic
│   ├── locales/        # i18next EN/ZH JSON + config
│   ├── types/          # TypeScript type declarations
│   ├── styles/         # global.css (Tailwind + CSS vars for theme)
│   ├── layouts/        # Layout.astro (HTML shell, OG/SEO)
│   └── pages/          # index.astro (single page entry)
├── astro.config.mjs
├── tsconfig.json
└── package.json
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Add/change UI component | `src/components/` | React + Tailwind |
| Add icon | `src/assets/icons/` → `src/assets/icons/index.tsx` + `src/components/icons.tsx` | SVG as TSX |
| Modify link extraction/validation | `src/lib/link-utils.ts` | Core logic |
| Change translations | `src/locales/{en,zh}/common.json` | i18next |
| Add type | `src/types/app.d.ts` | Global types |
| Change CSS var/token | `src/styles/global.css` | Tailwind + design tokens |
| Change page layout/SEO | `src/layouts/Layout.astro` | Astro component |
| Change page entry | `src/pages/index.astro` | Astro page |

## CONVENTIONS

- **Imports**: React components use `"react"`, i18n via `react-i18next` + `useTranslation()`
- **Icons**: SVG as React components in `src/assets/icons/`, re-exported through `src/components/icons.tsx`. Props: `className`, optionally `strokeWidth`
- **CSS**: Tailwind v4 class names + CSS custom properties (`var(--primary)`, `var(--background)`, etc.). No module CSS
- **Types**: Global `LinkInfo`, `FilterType`, `CheckResult`, `DomainGroup`, `LinkInfoWithDomain` in `src/types/app.d.ts`
- **Exports**: Named exports (`export function`). No default exports
- **State**: `useState` + `useMemo` + `useCallback`. No external state management
- **Dark mode**: `.dark` class on `<html>`, CSS vars invert, localStorage `theme` key
- **i18n**: `i18next` auto-detects browser language, stores preference in localStorage

## ANTI-PATTERNS (THIS PROJECT)

- Do NOT add server-side processing — everything must be client-side
- Do NOT add routing (single page app)
- Do NOT use `as any` or `@ts-ignore`
- Do NOT add new dependencies unless absolutely necessary (current: astro, react, tailwindcss, i18next)

## UNIQUE STYLES

- Green-primary theme (`#84cc16` / lime) across light and dark modes
- Rounded-2xl cards, pill-shaped buttons, organic blob decorations
- Smooth CSS transitions on background-color/border-color/color (0.3s ease)
- `client:load` for all interactive React components in Astro

## COMMANDS

```bash
pnpm dev      # Start dev server at localhost:4321 (--host 0.0.0.0)
pnpm build    # Build to ./dist/
pnpm preview  # Preview production build
```

## NOTES

- Must use `client:load` directive for interactive React islands in `.astro` files
- i18n initialization happens via side-effect import (`import "../locales/i18n"`)
- Link validation uses CORS GET with no-cors HEAD fallback (5 concurrent, 10s timeout)