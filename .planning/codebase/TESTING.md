# Testing

**No automated tests exist.** No test framework, no test runner, no CI. Verification is entirely manual.

This is acceptable for a static brochure site — but the refactor must be regression-tested by hand at each step. This document defines the manual QA checklist that protects against breakage.

## Pre-refactor baseline snapshot

Before touching anything, capture the current rendered state for visual diff:

- **Desktop screenshot** (1440×900) — full page in Chrome, then Firefox, then Safari
- **Tablet screenshot** (iPad portrait 768×1024)
- **Mobile screenshot** (iPhone 13 390×844, both portrait + landscape)
- **Animation recording** — short screen capture of the hero load (marquee scroll, floating elements), menu tile hover, scroll into `#visit`
- **Network HAR** — record the page-load network waterfall (DevTools → Network → "Preserve log" → reload → right-click → save HAR)

Store these in `_archive/baseline/` so post-refactor work can compare side-by-side.

## Regression checklist (run after every refactor step)

### Visual

- [ ] Nav bar renders at top, fixed, with translucent burgundy background
- [ ] Logo circle ("福") visible in nav, gold ring around it
- [ ] Hero headline + Order Now / Call CTAs visible above the fold
- [ ] Hero marquee strip animates (horizontal on desktop, switches to bottom horizontal on mobile)
- [ ] "About" section shows story copy + 3 dish photo tiles (favorites grid)
- [ ] Menu section renders all 10 dish tiles with names + prices in expected order
- [ ] Visit section shows hours, address, phone, and the embedded Google Map
- [ ] Footer renders with brand block, link columns, and DoorDash CTA

### Animations (must keep working)

- [ ] `floatA`–`floatE` infinite vertical drift on hero floating elements
- [ ] `marquee` horizontal scroll on the hero image strip — seamless loop (no jump at 33.333%)
- [ ] `marquee-v` vertical scroll variant where applicable
- [ ] `tileBob` idle bob on menu tiles
- [ ] `tileGleam` diagonal shimmer sweep across tiles
- [ ] All hover transitions on CTAs (transform + box-shadow) still fire smoothly
- [ ] `prefers-reduced-motion: reduce` disables continuous animations (new — should add to refactor)

### Images

- [ ] All 10 dish images load with no broken-image icon
- [ ] AVIF images render in Chrome/Firefox/Safari ≥ 16
- [ ] WebP fallbacks render where AVIF unsupported
- [ ] Favorites grid (3 tiles) shows the right dish photos in the right positions
- [ ] Menu tiles map each name to the correct image (no swaps)
- [ ] Images don't cause layout shift (CLS ≈ 0) — check `width`/`height` attrs added in refactor
- [ ] No 404s in DevTools Network tab

### Functionality

- [ ] Every nav link scrolls smoothly to the right section
- [ ] All 3 "Order on DoorDash" / "Order Now" CTAs open the correct DoorDash storefront in a new tab
- [ ] "Order full menu" CTA in `#menu` opens DoorDash
- [ ] All 3 `tel:+15308946888` links trigger the phone dialer on mobile
- [ ] Google Maps iframe loads and shows 1140 Mangrove Ave, Suite E, Chico CA
- [ ] No console errors (current page throws from `support.js` — refactor should make console clean)
- [ ] No mixed-content warnings on HTTPS

### Responsive layout

- [ ] 1440px wide — desktop layout, full nav links visible
- [ ] 1099px wide — mobile breakpoint kicks in (hamburger / hidden nav links per `[data-nav-links] { display: none }`)
- [ ] 768px wide — about + visit collapse to single column
- [ ] 560px wide — sub-text in logo hides, hero text padding tightens, favorites grid switches to 3-up row
- [ ] 360px wide — no horizontal scroll, no clipped text

### Cross-browser

- [ ] Chrome (latest)
- [ ] Safari (latest, macOS + iOS)
- [ ] Firefox (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS 16+)
- [ ] Chrome on Android

### Performance (Lighthouse — desktop + mobile)

Targets for the refactor:

| Metric | Target |
|--------|--------|
| Performance | ≥ 90 mobile, ≥ 95 desktop |
| Accessibility | ≥ 95 |
| Best Practices | 100 |
| SEO | 100 |
| LCP | < 2.5s |
| CLS | < 0.1 |
| TBT | < 200ms |

Current page will likely score poorly on Performance (139KB JSON, ~25KB inline CSS) and SEO (no title/meta). Both should fix during refactor.

### SEO checks (post-refactor)

- [ ] `<title>` present, ~50–60 chars, includes "Chanpheng's Mandarin Cuisine" + city
- [ ] `<meta name="description">` present, ~150 chars, includes location
- [ ] Open Graph tags: `og:title`, `og:description`, `og:image`, `og:url`, `og:type`
- [ ] Twitter card tags
- [ ] Canonical link
- [ ] `<html lang="en">`
- [ ] Favicon resolves (32×32 + SVG + apple-touch-icon)
- [ ] `robots.txt` allows all + points to sitemap
- [ ] `sitemap.xml` with one entry for `https://cpmandarincuisine.com/`
- [ ] Structured data: `LocalBusiness` / `Restaurant` JSON-LD with name, address, phone, hours, image

### Deployment smoke test

After uploading to Namecheap:

- [ ] `https://cpmandarincuisine.com/` resolves and shows the site (HTTPS, valid cert)
- [ ] `http://cpmandarincuisine.com/` redirects to HTTPS
- [ ] `https://www.cpmandarincuisine.com/` either works or redirects to apex (consistent choice)
- [ ] `https://cpmandarincuisine.com/index.html` is the same page as `/`
- [ ] A nonexistent path (`/foo`) returns `404.html`, not the Namecheap default 404
- [ ] No 5xx errors during page load
- [ ] DoorDash CTAs work from the live origin (some external services block embedded iframes; CTAs are top-level navigations so they should be fine)

## Tools to use

- **Browser DevTools** — Network, Console, Lighthouse, Device emulation
- **Wave** (wave.webaim.org) — accessibility audit
- **PageSpeed Insights** (pagespeed.web.dev) — confirm Lighthouse scores from Google
- **GTmetrix** — second opinion on performance
- **Mobile-Friendly Test** (search.google.com/test/mobile-friendly)
- **Rich Results Test** (search.google.com/test/rich-results) — validate JSON-LD

## When to add real tests

Skip automated tests for v1. Revisit if:
- Site grows beyond one page
- A CMS or build pipeline is added
- Forms / interactive features ship
- More than one person edits the site
