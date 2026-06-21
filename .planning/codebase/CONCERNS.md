# Concerns

This codebase is a raw export from a design-composer tool ("dc-runtime" / "omelette"). It looks fine in a browser because the inline HTML+CSS renders independently, but the supporting machinery is broken, bloated, and not deploy-ready. Concerns grouped by severity.

## 🔴 Critical — blocks deployment to cpmandarincuisine.com

### 1. No `index.html` entry point
- The main file is named `Chanphengs Mandarin Cuisine.dc.html`.
- Apache (Namecheap shared hosting) serves `index.html` by default. With spaces in the URL and a non-standard extension, the live site URL would be `https://cpmandarincuisine.com/Chanphengs%20Mandarin%20Cuisine.dc.html`.
- **Fix:** rename to `index.html` (after the cleanup step).

### 2. `support.js` references globals that never exist in the browser
- File header: "GENERATED from dc-runtime/src/*.ts — do not edit."
- Uses `window.React`, `window.ReactDOM`, `window.omelette` — none are loaded.
- Throws on first execution (silently — console only).
- Currently the page survives because the throw happens after the HTML has rendered, but **it's a constant console error and any future feature that depends on it will silently fail**.
- **Fix:** delete `support.js` and the `<script src="./support.js">` tag entirely.

### 3. `image-slot.js` is editor scaffolding, not runtime
- The `<image-slot>` custom element only does anything inside the omelette host. In a normal browser it shows a placeholder, then tries to fetch `.image-slots.state.json` and pull the fill from there.
- This works *only* because the 139KB sidecar is bundled alongside.
- **Fix:** replace the 3 `<x-import>` favorite tiles with plain `<img src="assets/img/dishes/...">` tags; delete `image-slot.js`.

### 4. `.image-slots.state.json` is 139KB of editor state shipped to every visitor
- It contains base64-encoded image data used only by the design-composer to repopulate slots on reload.
- Every visitor downloads it, gets nothing useful from it (without `window.omelette`).
- **Fix:** delete from the deployed bundle.

### 5. SEO is invisible
- No `<title>`, no `<meta name="description">`, no Open Graph or Twitter cards, no canonical URL, no `<html lang>`, no favicon, no `robots.txt`, no `sitemap.xml`, no JSON-LD `Restaurant` schema.
- Google won't crawl meaningfully; social shares show an empty preview.
- **Fix:** add all of the above during refactor; this is the single biggest lift for a local-business site.

## 🟠 High — breaks under realistic future maintenance

### 6. Inline `style="..."` on nearly every element
- ~600 lines of HTML, almost every tag carries `style="..."`. Changing one color means find/replace across the file.
- Two media queries (lines 33–67) override everything with `!important` because the base styles are inline.
- **Fix:** extract to `assets/css/main.css`, introduce CSS custom properties for the 5 brand colors, replace inline styles with classes.

### 7. Hardcoded content scattered in markup
- DoorDash storefront URL appears 4 times (lines 88, 108, 219, 287).
- Phone number `+15308946888` and display form `(530) 894-6888` appear 3 times each.
- Address appears multiple times.
- Change any of them → audit every occurrence.
- **Fix:** define constants once (in HTML as `data-*` if no JS, or in a tiny `assets/js/config.js`); single source of truth.

### 8. `uploads/` directory is uncurated
- 24 files including screenshots (`Screenshot 2026-06-19 at 10.26.50 PM.png`), unused stock photos (`istockphoto-181096273-612x612.webp`), and pre-rename dish photos (`Dish 1.avif`, `dish 2.avif`).
- Spaces and timestamps in filenames are URL-hostile.
- Nothing in the live HTML references `uploads/` — confirmed via grep — so all 24 files are deployable cruft.
- **Fix:** move to `_archive/`, exclude from deploy.

### 9. `style-hover="..."` is a non-standard attribute
- Used on every interactive element. Browsers ignore it — current hover transitions only fire because the inline `style="..."` also declares the transition property and the target value matches the unhovered state. Fragile.
- **Fix:** replace with real CSS `:hover` rules.

### 10. Non-standard custom tags in production HTML
- `<x-dc>`, `<helmet>`, `<x-import>` only have meaning inside the omelette runtime. They render fine because browsers treat unknown elements as inline divs, but they confuse SEO crawlers and assistive tech.
- **Fix:** strip during extraction; promote `<helmet>` children into the real `<head>`.

## 🟡 Medium — affects polish, performance, accessibility

### 11. No `width`/`height` on `<img>` tags → layout shift
- Cumulative Layout Shift will be high on slow connections.
- **Fix:** add intrinsic dimensions to every image during refactor.

### 12. No `prefers-reduced-motion` honor
- All `floatA`–`floatE`, `marquee`, `tileBob`, `tileGleam` run infinite for users who've requested reduced motion.
- Accessibility regression risk + battery drain.
- **Fix:** wrap animations in a `@media (prefers-reduced-motion: no-preference)` block, or add the global override.

### 13. Continuous animations on mobile drain battery
- 9 keyframes running infinite, several on multiple elements.
- **Fix:** pause animations off-screen via CSS `animation-play-state` driven by IntersectionObserver, *or* simply rely on `prefers-reduced-motion`.

### 14. No image `alt` text strategy
- Decorative images need `alt=""`; menu dishes need descriptive alt for screen readers and image search.
- **Fix:** audit every `<img>` during refactor and assign appropriate `alt`.

### 15. No skip-to-content link
- Keyboard users have to tab through the nav on every visit.
- **Fix:** add `<a class="skip-link" href="#main">Skip to main content</a>` at top of body.

### 16. Google Fonts as third-party
- Three families (Playfair Display, Work Sans, Noto Serif SC). Each request goes to a Google domain → render-blocking unless preloaded.
- **Fix (optional, v2):** self-host the woff2s; saves 1 DNS lookup + 1 TLS handshake + privacy.

### 17. Map iframe is render-jank-prone if loaded early
- Currently `loading="lazy"` ✓ — keep that.

## 🔵 Low — cleanup, nice-to-have

### 18. `.thumbnail` (5KB) is editor preview, not used by site
- **Fix:** delete; gitignore.

### 19. No `.gitignore`
- Editor will re-export `.image-slots.state.json` and `.thumbnail` on every save. Without `.gitignore`, those keep getting committed.
- **Fix:** add a `.gitignore` covering editor artifacts + OS files.

### 20. No `README.md`
- Future you / future maintainer has no idea how to edit the site or deploy.
- **Fix:** add a short README — "How to edit", "How to deploy", "Where the brand colors live."

### 21. No `404.html`
- Namecheap's default 404 looks unprofessional vs. the rest of the site.
- **Fix:** ship a branded `404.html` reusing the nav + footer.

## Security

The site is fully static and accepts no user input → small attack surface. Two minor notes:

- `support.js` exposes `window.omelette` API in code (as a *consumer*, not a producer). The omelette host is never present in the browser, so there's no real exposure, but the unused bridge code is still cruft.
- The Google Maps iframe loads `https://maps.google.com/...` — Google sets cookies. If GDPR/CCPA matters for a U.S. local business, this is the only third-party cookie set.

## Deployment-readiness summary

Before this site can responsibly be hosted at `cpmandarincuisine.com`:

| Must | Status |
|------|--------|
| `index.html` entry point | ❌ |
| Dead-code (`support.js`, `image-slot.js`, `.image-slots.state.json`) removed | ❌ |
| `<title>`, meta description, OG, favicon, robots, sitemap | ❌ |
| Inline styles externalized | ❌ (optional but strongly recommended) |
| Image alts | ❌ |
| `prefers-reduced-motion` | ❌ |
| Visual + animation regression check | ⚠️ (capture baseline first) |
| Lighthouse ≥ 90 / 95 / 100 / 100 | ❌ (current is ~50/?/?/0 due to missing SEO) |
| Namecheap upload + HTTPS confirmed | ❌ |

Refactor must touch all 🔴 critical items + at least items 6, 11, 14, 15 from 🟠/🟡 to be production-grade.
