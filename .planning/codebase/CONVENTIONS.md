# Conventions

The current codebase has no enforced conventions — it's a single-export from a design-composer tool, with all behavior baked into inline attributes. This document captures what's there now and what the refactor should standardize to.

## Current state (as-is)

### HTML

- **Generated, not authored.** Markup uses non-standard custom tags: `<x-dc>`, `<helmet>`, `<x-import>`, `<image-slot>`.
- **Every element carries inline `style="..."`** — colors, sizes, transitions, animation declarations all sit on the element.
- **`data-*` attributes are the de-facto class system.** Selectors in the inline `<style>` block target `[data-nav]`, `[data-fav-grid]`, `[data-hero-marquee]`, `[data-reveal]`, etc.
- **`style-hover="..."`** is the design-composer's custom hover attribute — non-standard, ignored by browsers; current hover effects only fire on properties already declared via inline `transition:`.
- **Semantic tags are used** — real `<nav>`, `<header>`, `<section>`, `<footer>` exist, which is the one bright spot.
- **Anchors use `href="#top"`, `#menu`, `#about`, `#visit`** for in-page nav — good.
- **External links** carry `target="_blank" rel="noopener"` — good.

### CSS

- **One inline `<style>` block** in `<helmet>` (lines 14–67, ~25KB) holds:
  - Global resets (`* { box-sizing: border-box }`, body defaults, `::selection`, scrollbar)
  - 9 `@keyframes` rules (`floatA`–`floatE`, `marquee`, `marquee-v`, `tileBob`, `tileGleam`)
  - Two media queries: `(max-width: 1099px)` and `(max-width: 560px)` — these contain `!important` overrides for everything, because the base rules use inline styles
- **Color values inlined as hex** throughout — `#1A1410`, `#FAF6EE`, `#8B1A1A`, `#C9A24B`, `#E7C77B` (the brand palette is consistent, just not tokenized)
- **No CSS custom properties** (no `--color-*` etc.) — adding them is a quick win for maintainability
- **No external stylesheet**

### JavaScript

- **`support.js`**: generated IIFE — first comment line declares "GENERATED from dc-runtime/src/*.ts — do not edit. Rebuild with `cd dc-runtime && bun run build`." The dc-runtime source isn't in this repo, so the file is opaque. Uses `"use strict"`, ES2020+ syntax, depends on `window.React`/`window.ReactDOM`/`window.omelette` which don't exist in the live page. **Effectively dead code.**
- **`image-slot.js`**: hand-written, well-commented at the top with usage docs. Defines `<image-slot>` custom element. Designed for the omelette editor; in the live browser it just shows a placeholder until the sidecar JSON loads.
- **No modules** — both files use plain `<script>` / `<x-import>` global-scope loading.
- **No event delegation, no listeners** for anything that affects the live site's behavior.

### Comments

- `image-slot.js` has a thorough JSDoc-style usage block at the top — well-written.
- `support.js` has a single header comment ("GENERATED...") and minified-style internals — unreadable.
- HTML has section dividers like `<!-- ===== NAV ===== -->` — useful, keep these in the refactor.
- No comments explain animation choices, color palette, or business logic.

## Target conventions (post-refactor)

### File naming

- Lowercase, hyphenated, single concern: `index.html`, `main.css`, `orange-chicken.webp`
- Folders pluralize collections: `assets/img/dishes/`, not `dish/`

### HTML

- Single root `<!doctype html>` → `<html lang="en">`
- `<head>` carries `<title>`, `<meta name="description">`, Open Graph + Twitter cards, favicon links, manifest, canonical
- Body uses semantic structure: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`
- Classes for styling, IDs only for in-page anchors
- ARIA attributes on icon-only buttons / nav landmarks
- `alt=""` on every `<img>` — empty when decorative, descriptive when meaningful
- `loading="lazy"` on images below the fold; `loading="eager"` + `fetchpriority="high"` on hero
- `width` + `height` on every `<img>` (prevent CLS)

### CSS

- Single external stylesheet: `assets/css/main.css`
- Top of file: `:root { --color-... }` design tokens (brand colors, font stacks, spacing scale, radii)
- Layered: Reset → Tokens → Base → Components → Sections → Utilities → Media queries (mobile-first)
- Class naming: BEM-ish kebab-case — `.nav`, `.nav__link`, `.nav--scrolled`, `.menu-tile--featured`
- No `!important` except in narrowly-scoped third-party overrides
- Animations defined once at the bottom of components; `prefers-reduced-motion` honored:
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
  }
  ```

### JavaScript

- Default: **no JavaScript needed** — the live site is fully static. Only add JS if a behavior demands it (mobile nav toggle, scroll-reveal if `data-reveal` is meant to do something).
- If added: `<script src="assets/js/main.js" defer></script>` at the end of `<head>`
- Modern ES2020+, no transpiling needed for evergreen browsers
- Prefer `const`, `let`; never `var`
- Single quotes; semicolons; 2-space indent
- One file per concern; export const constants for `DOORDASH_URL`, `PHONE_E164`, `PHONE_DISPLAY`, `ADDRESS`

### Comments

- Section dividers in HTML: `<!-- ===== Section name ===== -->`
- Block comment at the top of CSS files: purpose, token reference
- Inline comments only when *why* is non-obvious (e.g., "marquee width = 3× viewport for seamless loop")
- No comments restating what the code does

### Error handling

- Static HTML has nothing to fail. If any JS is added, fail soft: feature-detect (`if ('IntersectionObserver' in window)`) and skip silently.

## Linting / formatting (optional, future)

If the owner wants tooling later:
- **Prettier** for HTML/CSS/JS formatting — `.prettierrc` in root, 2-space, single quotes, 100 col
- **HTMLHint** or **html-validate** for HTML lint
- **stylelint** with `stylelint-config-standard` for CSS lint

None are required for v1. The codebase is small enough to hand-review.

## Accessibility floor (must-haves)

- All interactive elements reachable by keyboard (no `tabindex="-1"` on real CTAs)
- Color contrast ≥ AA: white-on-burgundy (`#FAF6EE` on `#8B1A1A`) passes; gold-on-black passes; verify gold-on-cream
- Skip-to-content link at top
- `<html lang="en">`
- Map iframe needs `title="Map to Chanpheng's Mandarin Cuisine"` — currently present ✓
