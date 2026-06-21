# Stack

Static single-page restaurant site exported from a design-composer ("dc-runtime" / "omelette") tool. No build system, no package manager, no framework runtime actually loaded by the page.

## Runtime

- **HTML5** single-page document — `Chanphengs Mandarin Cuisine.dc.html` (666 lines)
- **CSS** — inline `<style>` block in `<helmet>` (lines 14–67, ~25KB) + per-element `style="..."` attributes throughout the body
- **JavaScript** — two vanilla-IIFE scripts, no modules, no bundler:
  - `support.js` (1,513 lines) — design-composer runtime; references `window.React` / `window.ReactDOM` / `window.omelette` (none of which the page loads)
  - `image-slot.js` (643 lines) — custom-element `<image-slot>` editor component; only meaningful inside the omelette host (read-only outside)

## Fonts

Loaded via Google Fonts `<link>` (lines 11–13):
- `Playfair Display` (weights 500–900, italic 500/600) — display/headline
- `Work Sans` (weights 300–600) — body
- `Noto Serif SC` (weights 500/700/900) — single 福 glyph in nav logo

## Browser custom elements

- `<x-dc>` — design-composer document wrapper (line 8)
- `<helmet>` — head-content slot used by the dc-runtime
- `<x-import component-from-global-scope="image-slot" from="./image-slot.js" ...>` — used 3× for the "favorites" grid (lines 135–137)
- `<image-slot>` — custom element registered by `image-slot.js`

None of these are standard browsers tags; they only have meaning when `support.js`/`image-slot.js` initialize successfully.

## Dependencies

| Source | Purpose | Loaded by |
|--------|---------|-----------|
| Google Fonts CDN | Web fonts | `<link>` in `<helmet>` |
| `./support.js` | dc-runtime (currently broken in browser) | `<script src="./support.js">` line 6 |
| `./image-slot.js` | Image-slot custom element | `<x-import from="./image-slot.js">` 3× |
| `.image-slots.state.json` | Sidecar persistence for image-slot fills (139KB) | Fetched by `image-slot.js` at runtime |
| `maps.google.com/maps?...&output=embed` | Map iframe | `<iframe>` line 257 |

## Configuration

- **No `package.json`** — nothing to install, nothing to build
- **No `.env`** — no secrets in repo
- **No bundler/minifier config** — assets shipped raw
- **No favicon, robots.txt, sitemap, manifest** — all missing
- **No `<title>`, `<meta name="description">`, Open Graph or Twitter cards** — SEO-blind
- **Filename `Chanphengs Mandarin Cuisine.dc.html` has spaces + `.dc.html` suffix** — not the conventional `index.html` web hosts expect

## Versions

Static — no version pinning required. Google Fonts uses `display=swap` (good), but no `font-display` fallbacks declared in CSS.

## Browser support

- Modern evergreen browsers only — uses `backdrop-filter`, CSS grid with `minmax()`, AVIF + WebP images, `clip-path`, custom elements
- No polyfills — Safari < 15.4 (no `backdrop-filter`), Firefox < 113 (no AVIF) will degrade
