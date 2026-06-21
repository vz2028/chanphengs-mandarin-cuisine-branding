# Structure

Current directory layout (pre-refactor) is the raw export from a design-composer tool. Naming, grouping, and separation are all off the conventional path.

## Current tree

```
chanphengs-mandarin-cuisine-branding/
├── .git/
├── .image-slots.state.json              (139KB — sidecar for editor only)
├── .thumbnail                           (5KB — editor preview)
├── Chanphengs Mandarin Cuisine.dc.html  (50KB — main page; bad filename)
├── image-slot.js                        (31KB — dead in browser)
├── support.js                           (54KB — dead in browser)
├── images/                              (10 optimized dish photos)
│   ├── dish-basilrice.webp
│   ├── dish-beefnoodle.webp
│   ├── dish-eggplant.webp
│   ├── dish-generaltao.avif
│   ├── dish-noodle.avif
│   ├── dish-orangechicken.webp
│   ├── dish-pho.avif
│   ├── dish-potsticker.avif
│   ├── dish-saltpeppershrimp.webp
│   └── dish-singapore.webp
└── uploads/                             (24 files — raw assets, screenshots,
    ├── Dish 1.avif                       likely not referenced by HTML)
    ├── Screenshot 2026-06-19 at ...png  (lots of these — dev artifacts)
    ├── dish 2.avif
    ├── istockphoto-181096273-612x612.webp
    └── ...
```

## Issues with current structure

| Issue | Impact |
|-------|--------|
| `Chanphengs Mandarin Cuisine.dc.html` — spaces in filename, non-standard `.dc.html` suffix | Web hosts expect `index.html`; URL-encoded spaces are ugly and fragile |
| No `assets/` separation — CSS, JS, fonts all live next to the HTML | Hard to scan; no place to add `assets/css/`, `assets/js/` later |
| `images/` (curated) and `uploads/` (raw) coexist | Unclear which folder is canonical; doubles repo size |
| Spaces and timestamps in filenames inside `uploads/` (`Dish 1.avif`, `Screenshot 2026-06-19 at 10.26.50 PM.png`) | URLs become `Screenshot%202026-06-19%20at%2010.26.50%20PM.png` — fragile, slow |
| Editor sidecar `.image-slots.state.json` committed to repo + shipped to visitors (139KB) | Wasted bandwidth, leaks editor state |
| `.thumbnail` committed | Editor artifact; useless in production |
| No `README.md` | Future maintainers have no entry point |
| No `.gitignore` for editor artifacts | Sidecar/thumbnail keep coming back on every export |

## Target tree (post-refactor)

A clean, deploy-ready layout that maps cleanly to Namecheap shared hosting (just upload the project root via cPanel File Manager or FTP):

```
chanphengs-mandarin-cuisine-branding/
├── README.md                       (how to edit & deploy)
├── .gitignore                      (editor artifacts, OS files)
├── index.html                      (entry point; cleaned, semantic, classed)
├── 404.html                        (branded not-found)
├── favicon.ico                     (32×32 — Chanpheng's mark)
├── favicon.svg                     (modern browsers)
├── apple-touch-icon.png            (180×180 — iOS home screen)
├── site.webmanifest                (PWA basics)
├── robots.txt                      (allow all; sitemap pointer)
├── sitemap.xml                     (root URL + anchored sections)
├── assets/
│   ├── css/
│   │   └── main.css                (extracted from inline <style>)
│   ├── js/
│   │   └── main.js                 (only if any real behavior is needed)
│   └── img/
│       ├── og-cover.jpg            (1200×630 Open Graph image)
│       ├── dishes/
│       │   ├── basil-rice.webp
│       │   ├── beef-noodle.webp
│       │   ├── eggplant.webp
│       │   ├── general-tao.avif
│       │   ├── noodle.avif
│       │   ├── orange-chicken.webp
│       │   ├── pho.avif
│       │   ├── potsticker.avif
│       │   ├── salt-pepper-shrimp.webp
│       │   └── singapore.webp
│       └── brand/
│           └── logo-mark.svg       (optional, if available)
└── _archive/                       (NOT deployed; kept locally for reference)
    ├── original-export.html        (the .dc.html before refactor)
    ├── support.js
    ├── image-slot.js
    └── image-slots.state.json
```

## Naming conventions (target)

| Asset type | Rule | Example |
|------------|------|---------|
| HTML files | lowercase, hyphenated, `.html` extension | `index.html`, `404.html` |
| CSS / JS | lowercase, hyphenated, single concern | `main.css`, `nav.js` |
| Image files | lowercase, hyphenated, descriptive noun | `orange-chicken.webp` |
| Folders | lowercase, hyphenated, plural for collections | `assets/img/dishes/` |
| Constants in code | UPPER_SNAKE | `DOORDASH_URL`, `PHONE_E164` |
| CSS classes | BEM-ish kebab-case | `.hero__title`, `.menu-tile--featured` |
| CSS custom props | `--token-name` | `--color-brand-gold` |
| IDs | only for in-page anchors | `#top`, `#menu`, `#about`, `#visit` |

## Mapping from old → new

| Old | New |
|-----|-----|
| `Chanphengs Mandarin Cuisine.dc.html` | `index.html` (cleaned) |
| inline `<style>` block | `assets/css/main.css` |
| `support.js` | _delete (move to `_archive/`)_ |
| `image-slot.js` | _delete_ |
| `.image-slots.state.json` | _delete_ |
| `.thumbnail` | _delete (gitignore future exports)_ |
| `images/dish-basilrice.webp` | `assets/img/dishes/basil-rice.webp` |
| `images/dish-beefnoodle.webp` | `assets/img/dishes/beef-noodle.webp` |
| `images/dish-eggplant.webp` | `assets/img/dishes/eggplant.webp` |
| `images/dish-generaltao.avif` | `assets/img/dishes/general-tao.avif` |
| `images/dish-noodle.avif` | `assets/img/dishes/noodle.avif` |
| `images/dish-orangechicken.webp` | `assets/img/dishes/orange-chicken.webp` |
| `images/dish-pho.avif` | `assets/img/dishes/pho.avif` |
| `images/dish-potsticker.avif` | `assets/img/dishes/potsticker.avif` |
| `images/dish-saltpeppershrimp.webp` | `assets/img/dishes/salt-pepper-shrimp.webp` |
| `images/dish-singapore.webp` | `assets/img/dishes/singapore.webp` |
| `uploads/*` | _audit; move references-only into `assets/img/`, archive the rest_ |

## Why this layout

- **Single `index.html`** lets Namecheap (Apache) serve it as the default document — no `.htaccess` rewrite needed.
- **`assets/` umbrella** is the most universally-recognized convention; deploys, CDNs, and asset pipelines all expect it.
- **`assets/img/dishes/` sub-folder** scales — easy to add menu categories later (`drinks/`, `desserts/`).
- **`_archive/` with underscore prefix** sorts to top in most file managers and signals "not deployed."
- **Hyphenated lowercase** is URL-safe; spaces and capitals are not.
