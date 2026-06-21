# Architecture

Static brochure-style single-page site. No SPA framework, no router, no API. Sections are anchored `<section id="...">` blocks scrolled to via in-page hash links.

## Pattern

**Single-document static site** exported from a design-composer tool ("dc-runtime" / "omelette"). The export bundles editor scaffolding (`support.js`, `image-slot.js`, `.image-slots.state.json`) that has no runtime effect in a normal browser — the page renders entirely from the inline HTML + inline CSS in `<helmet><style>`.

## Layers

```
┌────────────────────────────────────────────────────┐
│  Chanphengs Mandarin Cuisine.dc.html (presentation)│
│  ├─ <helmet>                                        │
│  │  ├─ <link> Google Fonts                          │
│  │  └─ <style>  global CSS + @keyframes + media qs  │
│  └─ <x-dc>                                          │
│     ├─ nav                                          │
│     ├─ #top (hero + marquee)                        │
│     ├─ #about (image-slot favorites grid)           │
│     ├─ #menu                                        │
│     ├─ #visit (map iframe)                          │
│     └─ footer                                       │
├────────────────────────────────────────────────────┤
│  support.js  (dc-runtime — INERT without window.React) │
│  image-slot.js  (read-only without window.omelette)│
└────────────────────────────────────────────────────┘
```

There is no logical separation between markup, style, and behavior — almost every element carries an inline `style="..."` attribute, and behavioral hooks are `data-*` attributes that the inline `<style>` block targets directly.

## Entry point

Browser loads `Chanphengs Mandarin Cuisine.dc.html`. Order of events:

1. `<head>` parses → `<script src="./support.js">` queued
2. Google Fonts requested in parallel (preconnect + stylesheet)
3. `<helmet>` `<style>` applied as global CSS
4. `<x-dc>` body parsed; inline styles render the page immediately
5. `support.js` executes IIFE — references `window.React` → throws silently (uncaught), but page has already rendered
6. The 3× `<x-import>` elements fetch `./image-slot.js`; element upgrades to `<image-slot>` and tries to load `./.image-slots.state.json` for slot fills
7. `<iframe>` lazy-loads the Google Maps embed when `#visit` enters viewport

Outside the omelette host runtime, the page is **read-only static content** — the editor scaffolding is dead weight.

## Data flow

There is no data flow in the runtime sense. Two pseudo-flows exist only inside the design tool:

1. **Image-slot persistence:** drop image onto `<image-slot>` → `image-slot.js` calls `window.omelette.writeFile(.image-slots.state.json, ...)` → reload reads it back. In the browser, only the *read* half fires.
2. **`text/x-dc` script** (line 302) carries author-time props (`showFavorites`, `showWatermarks`, `revealAnimations`) — parsed only by `support.js` if React is present.

The user-visible site has no state, no form posts, no fetches beyond fonts/maps/images.

## Abstractions

- **Image slot** (`<image-slot>` custom element, `image-slot.js`) — designed for the omelette editor; used in 3 places to hold the favorites-grid dish photos. Loses meaning post-export.
- **`data-*` selectors** — the inline `<style>` block targets attributes like `[data-nav]`, `[data-hero-marquee]`, `[data-fav-grid]`, `[data-reveal]`. These are the de-facto component boundaries.
- **`style-hover="..."`** — design-composer's bespoke hover-style attribute. Standard browsers ignore it; hover transitions only happen on properties already declared via inline `transition:`.
- **`<x-import>`** — dc-runtime's lazy-import wrapper. Effectively replaced by a plain `<script type="module">` once refactored.

## Animations

All CSS-driven, defined in the inline `<style>` block:

| Keyframe | Used on | Purpose |
|----------|---------|---------|
| `floatA`–`floatE` | hero floating elements | Subtle vertical drift, infinite |
| `marquee`, `marquee-v` | hero image strip | Horizontal/vertical scrolling tape |
| `tileBob` | menu tiles | Hover/idle bob |
| `tileGleam` | menu tile shine sweep | Diagonal shimmer overlay |

Animations are applied via inline `style="animation: ..."` on the target elements (not via classes). `data-reveal` is referenced as a selector — implies a scroll-reveal pattern, but no JS toggles a `.is-visible` class anywhere in the live runtime (likely dead, or driven by `support.js` which never initializes).

## Sections (markup map)

| ID / data-attr | Lines | Role |
|----------------|-------|------|
| `nav[data-nav]` | ~71–90 | Fixed translucent navbar with logo + links + DoorDash CTA |
| `header#top` | ~92–118 | Hero with vertical marquee tape on the right, headline + CTAs on the left |
| `section#about` | ~120–141 | Story copy + 3-tile image-slot grid (`[data-fav-grid]`) |
| `section#menu` | ~143–222 | Menu tiles using `images/dish-*.{webp,avif}` + "Order full menu" CTA |
| `section#visit` | ~225–262 | Hours + contact + embedded Google Map |
| `footer[data-footer]` | ~265–295 | Brand block + links + contact + CTA |
| `<script type="text/x-dc">` | 302 | Inert author-time props |

## Build order implications for refactor

To turn this into a maintainable codebase without changing what users see, work in this order:

1. **Rename + entry point** — extract `index.html` from the `.dc.html` export (strip `<x-dc>`, `<helmet>`, `<script type="text/x-dc">`)
2. **Externalize CSS** — move the inline `<style>` block to `assets/css/main.css`; replace inline `style="..."` with classes section-by-section
3. **Externalize content constants** — phone, DoorDash URL, address into one config block (single source of truth)
4. **Replace image-slot scaffolding** — swap the 3 `<x-import>` favorites for plain `<img>` tags pointing at `images/dish-*.{webp,avif}`
5. **Delete dead runtime** — remove `support.js`, `image-slot.js`, `.image-slots.state.json`, `uploads/`
6. **Add deploy basics** — favicon, `<title>`, meta description, Open Graph, robots.txt
7. **Verify** — every animation keyframe still attached, every image still resolves, every CTA still reaches the same URL
