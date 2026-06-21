# Chanpheng's Mandarin Cuisine — Branding Site

## What This Is

A single-page brand-and-ordering site for Chanpheng's Mandarin Cuisine in Chico, CA. Visitors land on a one-pager that shows the restaurant's story, dish photos, hours, address, an embedded map, and order/call CTAs that route to DoorDash and the storefront phone. The page is currently a design-composer export that needs to be refactored into a clean, developer-maintainable codebase and deployed to `cpmandarincuisine.com` (Namecheap shared hosting), with auto-deploy on `git push`.

## Core Value

The page must look and behave exactly as it does today (same layout, same animations, same photos) — but live at the real domain, indexable by Google, and easy for a developer to update without re-running the design-composer tool.

## Requirements

### Validated

<!-- Capabilities already present in the existing export. Locked. -->

- ✓ **NAV-01**: Fixed translucent navbar with logo, section links (Menu / About / Hours / Contact), and "Order on DoorDash" CTA — existing
- ✓ **HERO-01**: Hero section with headline, "Order Now" + "Call (530) 894-6888" CTAs, and animated marquee strip — existing
- ✓ **ABOUT-01**: About section with restaurant story copy and a 3-tile featured-dish grid — existing
- ✓ **MENU-01**: Menu section with 10 dish tiles (image + name + price) and a "Order full menu on DoorDash" CTA — existing
- ✓ **VISIT-01**: Visit section with hours, address, phone, and embedded Google Map iframe — existing
- ✓ **FOOT-01**: Footer with brand block, link columns, contact info, and a final DoorDash CTA — existing
- ✓ **ANIM-01**: Nine CSS-driven animations preserved: `floatA`–`floatE`, `marquee`, `marquee-v`, `tileBob`, `tileGleam` — existing
- ✓ **RESP-01**: Responsive layout with `≤1099px` and `≤560px` breakpoints (mobile marquee swap, single-column collapse, nav simplification) — existing

### Active

<!-- v1 scope: refactor + deploy. No new user-facing features. -->

- [ ] **STRUCT-01**: Reorganize files into a clean, deploy-ready layout (`index.html`, `assets/css/`, `assets/js/`, `assets/img/dishes/`) with developer-friendly naming (lowercase, hyphenated, no spaces, no `.dc.html` suffix)
- [ ] **STRUCT-02**: Externalize the inline `<style>` block into `assets/css/main.css` with CSS custom properties for the brand palette (`#1A1410`, `#FAF6EE`, `#8B1A1A`, `#C9A24B`, `#E7C77B`)
- [ ] **STRUCT-03**: Replace inline `style="..."` and `style-hover="..."` attributes with semantic class names and real CSS `:hover` rules
- [ ] **STRUCT-04**: Replace the 3 `<x-import>` favorites tiles with plain `<img>` tags pointing at the corresponding dish photos
- [ ] **CLEAN-01**: Delete dead-code: `support.js`, `image-slot.js`, `.image-slots.state.json`, `.thumbnail`, and the `<script type="text/x-dc">` props block — archive the originals under `_archive/`
- [ ] **CLEAN-02**: Audit and prune the `uploads/` directory; archive everything not referenced by the live HTML
- [ ] **CONST-01**: Extract repeated content (DoorDash URL ×4, phone number ×3, address) into a single source of truth so future updates are one-line changes
- [ ] **SEO-01**: Add `<title>`, `<meta name="description">`, canonical link, `<html lang="en">`, Open Graph + Twitter card tags, favicon (ICO + SVG + apple-touch-icon), `site.webmanifest`, `robots.txt`, `sitemap.xml`
- [ ] **SEO-02**: Add `Restaurant` JSON-LD structured data (name, address, phone, hours, image, cuisine, URL) so Google can show rich results
- [ ] **A11Y-01**: Add `alt` text to every image (descriptive for content images, empty for decorative), a skip-to-content link, ARIA labels where needed, and `@media (prefers-reduced-motion: reduce)` to disable continuous animations
- [ ] **PERF-01**: Add `width` + `height` to every `<img>` (eliminate CLS), `loading="lazy"` below the fold, `loading="eager" fetchpriority="high"` on hero imagery
- [ ] **404-01**: Ship a branded `404.html` reusing the nav + footer
- [ ] **REPO-01**: Add `.gitignore` (editor artifacts, OS files), `README.md` (how to edit, how to deploy, where the brand colors live)
- [ ] **DEPLOY-01**: Configure GitHub Actions workflow that auto-deploys `index.html`, `404.html`, and `assets/` to Namecheap `public_html/` via FTP on every push to `main`; document the one-time secrets setup
- [ ] **DEPLOY-02**: Verify the live site at `https://cpmandarincuisine.com/` — HTTPS valid, HTTP redirects to HTTPS, `www` and apex behave consistently, all 10 dish images load, all 9 animations fire, all 4 DoorDash CTAs work, all 3 `tel:` links work, no console errors
- [ ] **VERIFY-01**: Pre-refactor baseline (screenshots desktop+tablet+mobile, animation video, HAR) captured and stored under `_archive/baseline/`; post-refactor regression checklist passes on Chrome / Safari / Firefox / Edge

### Out of Scope

- **New design / layout changes** — user explicitly chose pixel-identical. Any visual change is a separate project. Why: maintain trust with current customers who've seen the brand.
- **New content sections** (reservations form, newsletter signup, blog, gift cards) — out of scope for v1. Why: refactor is about safety + deploy, not feature growth.
- **CMS** (Sanity, Contentful, even a hand-rolled JSON) — out of scope. Why: a single-page brochure with a handful of menu items doesn't justify the operational overhead yet.
- **Real online ordering** — DoorDash is the storefront; we link to it. Why: payments, menu sync, and fulfillment are solved problems for an existing DoorDash partner.
- **Self-hosting Google Fonts** — out of scope for v1, defer to v2. Why: privacy/perf benefit is real but not blocking; one less moving part for the initial deploy.
- **Build pipeline / bundler** (Vite, Parcel, esbuild) — out of scope. Why: site is small enough to ship as plain files; adding a build step adds maintenance cost with no current payoff.
- **JavaScript framework** (React, Vue, Astro) — out of scope. Why: site is fully static, no app state, frameworks are pure overhead here.
- **Tests / CI test runs** — manual QA per `.planning/codebase/TESTING.md` is sufficient. Why: surface area is tiny; auto-tests add cost with no real safety win at v1.
- **Analytics** (GA4, Plausible) — defer to v2. Why: privacy-conscious owner can decide later; not blocking deploy.

## Context

- **Domain status:** `cpmandarincuisine.com` is registered at Namecheap and currently empty/parked — clean slate, no swap-over risk, no rollback coordination needed.
- **Current site state:** Lives only as a local export from a design-composer tool ("dc-runtime" / "omelette"). Renders fine in a browser but ships ~225KB of dead JavaScript and a 139KB editor-state JSON file. Full diagnostic in `.planning/codebase/CONCERNS.md`.
- **Brand identity:** Cuisine + brand are restaurant-grade rustic-luxe. Palette is locked: deep brown `#1A1410`, cream `#FAF6EE`, burgundy `#8B1A1A`, brushed gold `#C9A24B`, soft gold highlight `#E7C77B`. Typography: Playfair Display (display), Work Sans (body), Noto Serif SC (single 福 glyph in logo).
- **Audience:** Local Chico, CA diners deciding where to eat. Mobile-first behavior (most discover restaurants on phones); desktop must still look polished for laptop browsing.
- **Maintenance reality:** Owner is not a daily developer. Future edits will likely be tweaking a menu price, swapping a dish photo, or updating hours. The codebase needs to make those edits a single-file change with confidence.

## Constraints

- **Hosting:** Namecheap shared hosting (Apache) — supports static files, `.htaccess`, FTP upload. No Node.js runtime, no edge functions, no server-side rendering.
- **Deploy method:** GitHub Actions → FTP. Requires FTP credentials stored as GitHub repository secrets. One-time setup.
- **Tech stack:** Plain HTML + CSS + (minimal) vanilla JS. No build step. No framework. No package manager required for the live site (no `npm install` needed to deploy).
- **Visual contract:** Pixel-identical to the current export at the breakpoints in `.planning/codebase/CONCERNS.md`. Any deviation must be agreed.
- **External services kept:** Google Fonts CDN (Playfair Display, Work Sans, Noto Serif SC), Google Maps embed (1140 Mangrove Ave, Suite E, Chico CA 95926, `&output=embed` URL with no API key), DoorDash storefront URL (`https://www.doordash.com/store/chan-pheng's-mandarin-cuisine-chico-34992320/`).
- **Performance budget:** Lighthouse mobile ≥ 90 Perf, ≥ 95 A11y, 100 BP, 100 SEO. LCP < 2.5s, CLS < 0.1, TBT < 200ms.
- **Browser support:** Evergreen Chrome, Safari (incl. iOS 16+), Firefox, Edge. No IE11 support needed.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Pixel-identical refactor (no redesign) | Owner wants safety, not surprise; existing design works | — Pending |
| Plain HTML/CSS/JS, no build pipeline | Site is small; build step adds cost without benefit at v1 | — Pending |
| GitHub Actions → FTP for deploy | Push-to-deploy ergonomics on a shared-hosting domain | — Pending |
| Delete `support.js` + `image-slot.js` + `.image-slots.state.json` entirely | Dead in the browser; ships ~360KB for zero user benefit | — Pending |
| Keep `images/` (curated) + `assets/img/dishes/`; archive `uploads/` (uncurated) | Live HTML only references the curated set; uploads is cruft | — Pending |
| Extract DoorDash URL, phone, address into single constants | Three+ duplicates each; one-line update is the point of refactoring | — Pending |
| Add SEO, favicon, structured data in the refactor | Site can't responsibly go live without them | — Pending |
| `prefers-reduced-motion` guard added during CSS extraction | A11y floor + small lift while CSS is being moved anyway | — Pending |
| Manual QA only (no automated tests for v1) | Surface area too small to justify test infra | — Pending |

---
*Last updated: 2026-06-21 after initialization (post-codebase-map)*
