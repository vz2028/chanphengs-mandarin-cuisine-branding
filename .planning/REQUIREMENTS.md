# Requirements: Chanpheng's Mandarin Cuisine — Branding Site

**Defined:** 2026-06-21
**Core Value:** Pixel-identical refactor of the existing one-pager — clean codebase, full SEO, deployed live at `cpmandarincuisine.com` via push-to-deploy.

## v1 Requirements

### Structure (clean file layout + naming)

- [ ] **STRUCT-01**: Reorganize files into a deploy-ready layout — `index.html` at root, `assets/css/main.css`, `assets/js/` (if needed), `assets/img/dishes/`, `assets/img/brand/`. Filenames lowercase + hyphenated, no spaces, no `.dc.html` suffix.
- [ ] **STRUCT-02**: Extract the inline `<style>` block from the HTML into `assets/css/main.css`. Define CSS custom properties at `:root` for the brand palette (`--color-bg-dark #1A1410`, `--color-bg-cream #FAF6EE`, `--color-burgundy #8B1A1A`, `--color-gold #C9A24B`, `--color-gold-soft #E7C77B`) and the three font stacks.
- [ ] **STRUCT-03**: Replace per-element `style="..."` and `style-hover="..."` attributes with semantic class names (BEM-ish kebab-case) and real CSS `:hover` rules.
- [ ] **STRUCT-04**: Replace the 3 `<x-import component-from-global-scope="image-slot">` favorites tiles with plain `<img>` tags pointing at the corresponding curated dish photos.

### Cleanup (delete dead code)

- [ ] **CLEAN-01**: Remove `support.js`, `image-slot.js`, `.image-slots.state.json`, `.thumbnail`, the `<script src="./support.js">` tag, the `<x-dc>`/`<helmet>` wrappers, and the `<script type="text/x-dc" data-dc-script>` props block. Move the originals into `_archive/original-export/` for reference.
- [ ] **CLEAN-02**: Audit `uploads/` against live HTML references. Move any unreferenced files into `_archive/uploads/`. Do not include `_archive/` in the deploy bundle.
- [ ] **CONST-01**: Extract repeated content constants into one source of truth — DoorDash storefront URL (4 occurrences), phone E.164 `+15308946888` and display form `(530) 894-6888` (3+ occurrences each), street address. If no JS is needed, use HTML `data-*` plus a single comment block at the top of `index.html`.

### SEO (make site indexable)

- [ ] **SEO-01**: Add to `<head>` — `<title>`, `<meta name="description">` (~150 chars including "Chico, CA"), canonical link, `<html lang="en">`, theme-color, `<meta name="viewport">` already present, Open Graph tags (`og:title`, `og:description`, `og:image`, `og:url`, `og:type=restaurant.restaurant`), Twitter card tags.
- [ ] **SEO-02**: Ship favicon set — `favicon.ico` (32×32), `favicon.svg`, `apple-touch-icon.png` (180×180), `site.webmanifest`. Add `robots.txt` (allow all + sitemap pointer), `sitemap.xml` (root URL).
- [ ] **SEO-03**: Add JSON-LD `Restaurant` structured data inside `<head>` — name, address (street/city/region/postal/country), phone, geo (lat/lng of 1140 Mangrove Ave), `openingHoursSpecification`, `image`, `priceRange`, `servesCuisine=["Chinese", "Mandarin"]`, `url`, `sameAs` (DoorDash storefront).

### Accessibility

- [ ] **A11Y-01**: Add `alt` attribute to every `<img>` — descriptive for menu/favorites dishes, empty `alt=""` for decorative imagery. Add a skip-to-content link as the first focusable element in `<body>`. Add appropriate `aria-label` on icon-only buttons. Confirm `<html lang="en">`.
- [ ] **A11Y-02**: Add `@media (prefers-reduced-motion: reduce)` block to `assets/css/main.css` that disables continuous animations (`floatA`–`floatE`, `marquee`, `marquee-v`, `tileBob`, `tileGleam`) for users who request it.

### Performance

- [ ] **PERF-01**: Add intrinsic `width` + `height` to every `<img>` (eliminate CLS). Use `loading="eager"` + `fetchpriority="high"` on the hero/above-fold image; `loading="lazy"` on every image below the fold. Keep `loading="lazy"` on the Google Maps `<iframe>`.

### Branded error page

- [ ] **404-01**: Ship a branded `404.html` reusing `assets/css/main.css`, the nav, and the footer. Include a friendly message and a "Back to home" CTA.

### Repository hygiene

- [ ] **REPO-01**: Add `.gitignore` covering editor artifacts (`.image-slots.state.json`, `.thumbnail`, `*.dc.html`), OS files (`.DS_Store`, `Thumbs.db`), and any future build output. Add `README.md` covering: site overview, where the brand colors live, how to swap a dish photo, how to update menu prices, how to deploy.

### Deployment

- [ ] **DEPLOY-01**: Add `.github/workflows/deploy.yml` that runs on push to `main`, uses an FTP-deploy action (e.g., `SamKirkland/FTP-Deploy-Action`) to sync `index.html`, `404.html`, and `assets/` into Namecheap's `public_html/`. Use repository secrets `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`. Document the one-time secrets-creation steps in `README.md`.
- [ ] **DEPLOY-02**: After first push, verify the live site at `https://cpmandarincuisine.com/` — HTTPS cert valid, `http://` redirects to `https://`, `www.cpmandarincuisine.com` behavior consistent with apex, every nav anchor scrolls correctly, all 10 dish images load, all 9 animations fire, all 4 DoorDash CTAs reach the storefront, all 3 `tel:` links trigger the dialer on mobile, Google Maps iframe loads, no console errors, no mixed-content warnings.

### Verification / regression safety

- [ ] **VERIFY-01**: Before refactor, capture a baseline — screenshots at 1440×900 / 768×1024 / 390×844 (Chrome + Safari + Firefox), a screen-recording of hero load + menu hover + scroll-to-visit, and a network HAR. Store everything in `_archive/baseline/`. After each refactor phase, walk through the regression checklist in `.planning/codebase/TESTING.md` and confirm pixel match against the baseline at the same breakpoints.

## v2 Requirements

Deferred from v1. Not in current roadmap.

### Performance / Privacy

- **PERF-02**: Self-host Google Fonts woff2 files; remove third-party CDN dependency.
- **PERF-03**: IntersectionObserver-based animation pause for off-screen elements (battery + CPU win).

### Analytics

- **ANLT-01**: Privacy-friendly analytics integration (Plausible or Fathom).

### Content

- **CONT-01**: Real menu data extraction into JSON; HTML regenerated from it (still no build pipeline — could be a small Node script run manually).
- **CONT-02**: Photo gallery / lightbox for dish images.
- **CONT-03**: Reservations link (OpenTable or Resy if the restaurant adopts one).
- **CONT-04**: Newsletter signup (Mailchimp / Buttondown).

### Polish

- **POL-01**: Custom-designed favicon and Open Graph cover image (currently using a placeholder mark for v1).
- **POL-02**: Localized French / Mandarin language toggle (if owner wants).

## Out of Scope

| Feature | Reason |
|---------|--------|
| Visual redesign | Owner chose pixel-identical; protects brand recognition |
| Build pipeline (Vite/Parcel/esbuild) | Site too small to justify; adds maintenance with no payoff |
| JS framework (React/Vue/Astro) | Fully static content; framework is pure overhead |
| Self-hosted ordering / payments | DoorDash is the storefront; we link to it |
| CMS | One-pager with handful of menu items doesn't need it |
| Automated test suite | Surface area too small; manual QA per TESTING.md suffices |
| Multi-page site | Out of scope for v1; could be revisited in v2 |
| Server-side anything | Namecheap shared hosting is static-only for this project |

## Traceability

Mapping each requirement to the phase that delivers it. Phases assigned during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| STRUCT-01 | Phase 1 | Pending |
| STRUCT-02 | Phase 1 | Pending |
| STRUCT-03 | Phase 1 | Pending |
| STRUCT-04 | Phase 1 | Pending |
| CLEAN-01 | Phase 1 | Pending |
| CLEAN-02 | Phase 1 | Pending |
| CONST-01 | Phase 1 | Pending |
| SEO-01 | Phase 2 | Pending |
| SEO-02 | Phase 2 | Pending |
| SEO-03 | Phase 2 | Pending |
| A11Y-01 | Phase 2 | Pending |
| A11Y-02 | Phase 2 | Pending |
| PERF-01 | Phase 2 | Pending |
| 404-01 | Phase 2 | Pending |
| REPO-01 | Phase 2 | Pending |
| DEPLOY-01 | Phase 3 | Pending |
| DEPLOY-02 | Phase 3 | Pending |
| VERIFY-01 | Phase 0 + Phase 3 | Pending |

**Coverage:**
- v1 requirements: 18 total
- Mapped to phases: 18
- Unmapped: 0 ✓

---
*Requirements defined: 2026-06-21*
*Last updated: 2026-06-21 after initial definition*
