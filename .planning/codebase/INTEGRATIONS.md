# Integrations

External services and third-party endpoints the page touches at runtime.

## Active integrations

### Google Fonts
- **Endpoint:** `fonts.googleapis.com` / `fonts.gstatic.com`
- **Used by:** `<link>` in `<helmet>` (`Chanphengs Mandarin Cuisine.dc.html` lines 11–13)
- **Purpose:** Web font loading (Playfair Display, Work Sans, Noto Serif SC)
- **Failure mode:** falls back to `system-ui, sans-serif`; layout shifts visible
- **Replaceable:** yes — could be self-hosted to remove third-party dependency

### Google Maps embed
- **Endpoint:** `maps.google.com/maps?q=1140%20Mangrove%20Ave%20Suite%20E%20Chico%20CA%2095926&output=embed`
- **Used by:** `<iframe>` in `#visit` section (line 257)
- **Purpose:** Show restaurant location
- **Loaded:** lazy (`loading="lazy"`)
- **Failure mode:** blank iframe; rest of page intact
- **Note:** uses the unauthenticated `/maps?...&output=embed` URL — no API key, no quotas

### DoorDash storefront
- **URL:** `https://www.doordash.com/store/chan-pheng%E2%80%99s-mandarin-cuisine-chico-34992320/?utm_campaign=gpa&pickup=true`
- **Used by:** 3× `<a target="_blank">` CTAs (nav, hero, menu footer, contact footer — lines 88, 108, 219, 287)
- **Purpose:** Online ordering
- **Failure mode:** if store ID changes, all order CTAs 404
- **Hardcoded** — should move to a single config constant in the refactor

### Telephone (`tel:` links)
- **Number:** `+15308946888`
- **Display:** `(530) 894-6888`
- **Used by:** lines 109, 243, 280 (hero CTA + visit section + footer)
- **Hardcoded** — same value repeated 3×; should be one constant

## Design-composer / "omelette" runtime (broken in browser)

These are *intended* integrations baked in by the export tool. None of them function once the page is hosted outside the omelette editor:

| Symbol | Source | Status |
|--------|--------|--------|
| `window.React` | dc-runtime expects pre-loaded | Not loaded → `support.js` throws on demand |
| `window.ReactDOM` | dc-runtime expects pre-loaded | Not loaded → throws |
| `window.omelette` | Editor bridge for sidecar writes | Undefined in browser → image-slot becomes read-only |
| `.image-slots.state.json` | Sidecar fetched by image-slot.js | Fetched but only the 3 favorite slots consume it |
| `<script type="text/x-dc">` | Document props block (line 302) | Parsed only by `support.js` if React is present |

These should all be **removed** during refactor — they shipped as build artifacts but contribute nothing to the live experience.

## Not integrated (notable gaps)

- **No analytics** (no GA4, GTM, Plausible, Fathom)
- **No tag manager**
- **No payment/booking** (DoorDash is the only commerce path)
- **No reservations** (no OpenTable, Resy, Yelp)
- **No social proof embeds** (no Yelp/Google reviews widget)
- **No newsletter / email capture**
- **No live chat / contact form** (only `tel:` link)
- **No CDN / asset host** — images served from same origin
- **No CMS** — content is hand-edited HTML

These gaps are intentional for a starter brochure site, but worth listing so the owner can decide what to add post-deploy.

## Outbound network calls at page load

When `index.html` loads (post-refactor), expect these requests:

1. `fonts.googleapis.com/css2?family=...` (1 stylesheet)
2. `fonts.gstatic.com/...` (woff2 files, several)
3. `./support.js` (will throw silently if React missing — should be removed)
4. `./image-slot.js` × 3 (one per `<x-import>` — same file though, cached after first)
5. `./.image-slots.state.json` (139KB if kept — should be deleted)
6. `./images/dish-*.{webp,avif}` (10 dish images, plus duplicates in marquee DOM)
7. `maps.google.com/maps?...` (lazy — only when visit section scrolls into view)

Refactor should aim to: kill (3), (4), (5); keep (1), (2), (6), (7).
