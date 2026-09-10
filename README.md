# Chan Pheng's Mandarin Cuisine — Website

The one-page brochure site for [cpmandarincuisine.com](https://cpmandarincuisine.com/).

Plain HTML + CSS, with the exported page runtime kept in `assets/js/`. No build step and no `npm install` required to deploy.

## File layout

```
.
├── index.html              ← the page everyone sees
├── 404.html                ← branded "page not found" with the same nav + footer
├── favicon.svg             ← modern browsers (sharp at any size)
├── favicon.ico             ← legacy / Windows
├── apple-touch-icon.png    ← iOS home-screen icon (180×180)
├── site.webmanifest        ← PWA basics
├── robots.txt              ← tells Google what to crawl
├── sitemap.xml             ← Google's roadmap of the site
├── image-slots.state.json  ← persisted favorite-dish image data
├── assets/
│   ├── css/main.css        ← every visual style lives here
│   ├── js/
│   │   ├── support.js      ← exported page runtime used by index.html
│   │   └── image-slot.js   ← image component used by the favorite-dishes grid
│   └── img/
│       ├── og-cover.jpg    ← social-share preview (Facebook, Twitter, etc.)
│       └── dishes/         ← the 10 dish photos
├── netlify.toml            ← Netlify publish settings (no build step)
└── .netlifyignore          ← keeps local metadata off the live site
```

## How to make common edits

All edits are find-and-replace in `index.html`. Save, push to GitHub, and the site updates on its own (see "Deployment" below).

### Change a menu price
Open `index.html`, search for the dish name (e.g. `Sweet & Sour Pork`), and edit the price next to it inside the `<span class="menu-item__price">` tag.

### Add or remove a menu item
Each item is a `<li class="menu-item">…</li>` row inside the category's `<ul class="menu-list">`. Copy an existing row and edit the name + price. For spicy items, add `<span class="spicy" aria-label="Spicy">🌶</span>` at the start of the name.

### Swap a dish photo
1. Drop the new image into `assets/img/dishes/` with a lowercase, hyphenated name (e.g. `kung-pao-chicken.webp`).
2. Open `index.html`, find the `<img src="/assets/img/dishes/old-name.webp">` reference, change the filename.

### Update phone number / DoorDash URL / address
These appear in a few places. Open `index.html` — at the top there's an `EDITING CONSTANTS` comment block listing every value. Search-and-replace each one in the whole file.

| What | Where it appears |
|------|------------------|
| Phone (display: `(530) 894-6888`) | `tel:+15308946888` and the `>(530) 894-6888<` text — 3 spots |
| DoorDash URL | `doordash.com/store/...` — 4 spots (nav, hero, menu footer, contact, site footer) |
| Address | Visit section, footer |
| Hours | Visit section, footer |

### Update hours
Open `index.html`, search for `Tuesday – Sunday · 11:00 AM – 8:30 PM`. Change the visible text **and** the matching value in the JSON-LD block at the top (`openingHoursSpecification` → `opens`, `closes`).

### Change brand colors
Open `assets/css/main.css`. The `:root { ... }` block at the top defines:

```css
--color-bg-dark:    #1A1410   /* main dark background      */
--color-bg-cream:   #FAF6EE   /* main cream background     */
--color-burgundy:   #8B1A1A   /* logo circle, accents      */
--color-gold:       #C9A24B   /* CTAs, headings            */
--color-gold-soft:  #E7C77B   /* hover gold, highlights    */
--color-spice:      #E07A52   /* 🌶 marker                 */
```

Change a value here and it propagates everywhere.

## Deployment — Netlify (free)

[Netlify](https://www.netlify.com/) hosts the site and auto-deploys on every push to `main`. No Namecheap hosting or FTP credentials needed — only your domain DNS at Namecheap.

### One-time setup

1. **Sign up at [netlify.com](https://www.netlify.com/)** with your GitHub account (free).
2. **Add new site → Import from GitHub** → pick `chanphengs-mandarin-cuisine-branding`. Grant Netlify access to the private repo if prompted.
3. **Build settings:**
   - Build command: *(leave blank)*
   - Publish directory: `.` (root)
   - Click **Deploy site**. In ~30 seconds you'll get a `*.netlify.app` preview URL.
4. **Add your custom domain:** Site settings → Domain management → **Add domain** → `cpmandarincuisine.com` (and optionally `www.cpmandarincuisine.com`).
5. **Update DNS at Namecheap** (Domain List → Manage → Advanced DNS):
   - **A record** — Host `@`, Value `75.2.60.5` (Netlify load balancer)
   - **CNAME record** — Host `www`, Value `<your-site-name>.netlify.app` (Netlify shows the exact value)
   - **Leave MX records alone** if you use email at `@cpmandarincuisine.com`.
6. Back in Netlify: **Verify DNS** → **Provision SSL certificate**. HTTPS is free and auto-renewed.

After setup, every `git push` to `main` triggers a new deploy automatically.

### Branded 404 page

Netlify serves `404.html` from the repo root for missing URLs — no `.htaccess` needed.

### Submit sitemap to Google (one-time)

After the site is live:

1. Go to [Google Search Console](https://search.google.com/search-console).
2. Add `https://cpmandarincuisine.com/` as a property (verify by uploading the HTML file Google gives you to the repo root, then commit + push).
3. Sidebar → "Sitemaps" → submit `https://cpmandarincuisine.com/sitemap.xml`.

## Local preview

To check changes before pushing, from the project root:

```bash
python3 -m http.server 8000
# open http://localhost:8000/ in your browser
```

That's it — no build step.

## What's intentionally NOT in this codebase

- No bundler (Vite, webpack, Parcel). The site is small enough that static HTML/CSS plus the exported runtime is the right shape.
- No app framework source tree. The production page is the exported static artifact in `index.html`.
- No test suite. Visual changes are verified by eye; functional changes are caught by the few `<a>`/`<img>` tags that exist.
- No analytics. Easy to add later (Plausible, GA4) by dropping a single `<script>` into `index.html`.

## Credits

Original design exported from a design-composer tool; refactored, cleaned, and made deploy-ready for production at cpmandarincuisine.com.
