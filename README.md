# Chanpheng's Mandarin Cuisine — Website

The one-page brochure site for [cpmandarincuisine.com](https://cpmandarincuisine.com/).

Plain HTML + CSS + a small vanilla-JS file. No build step, no framework, no `npm install` required to deploy.

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
├── assets/
│   ├── css/main.css        ← every visual style lives here
│   ├── js/main.js          ← menu tabs + marquee arrows + scroll reveal
│   └── img/
│       ├── og-cover.jpg    ← social-share preview (Facebook, Twitter, etc.)
│       └── dishes/         ← the 10 dish photos
├── .github/workflows/
│   └── deploy.yml          ← auto-deploys to Namecheap on push to main
├── .planning/              ← project planning docs (not deployed)
└── _archive/               ← old files kept for reference (not deployed)
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

## Deployment — push to GitHub, the site updates

A GitHub Actions workflow (`.github/workflows/deploy.yml`) deploys the site to Namecheap shared hosting via FTP every time you push to `main`.

### One-time setup

1. **Push this repo to GitHub.** Create a new repository (private is fine), then:
   ```bash
   git remote add origin https://github.com/<you>/<repo>.git
   git push -u origin main
   ```
2. **Get your FTP credentials from Namecheap.** Log into Namecheap → cPanel → "FTP Accounts." You need:
   - **Server** (looks like `server###.web-hosting.com`)
   - **Username** (looks like `youraccount@cpmandarincuisine.com` or just `youraccount`)
   - **Password**
3. **Add them as GitHub secrets.** In your GitHub repo: Settings → Secrets and variables → Actions → "New repository secret." Create:
   - `FTP_SERVER` — the server hostname
   - `FTP_USERNAME` — the FTP user
   - `FTP_PASSWORD` — the FTP password
4. **Push any change to `main`.** GitHub will run the workflow (Actions tab) and sync your files to Namecheap's `public_html/` folder. After 1–2 minutes the live site updates.

### Make sure SSL is on (one-time, in cPanel)

In Namecheap cPanel → "SSL/TLS Status" → enable AutoSSL for `cpmandarincuisine.com`. This gives you free HTTPS. After the first deploy, visit `https://cpmandarincuisine.com/` to confirm the green padlock.

### After first deploy: branded 404 page

If you visit a random URL like `https://cpmandarincuisine.com/anything` and see the generic Namecheap error page instead of our branded `404.html`, create a tiny file called `.htaccess` in `public_html/` containing:

```apache
ErrorDocument 404 /404.html
```

(One-time, then you'll see our 404 for missing pages.)

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

- No bundler (Vite, webpack, Parcel). The site is small enough that one HTML file + one CSS file + one JS file is the right shape.
- No framework (React, Vue). All content is in the HTML; the menu uses 80 lines of vanilla JS for tab switching.
- No test suite. Visual changes are verified by eye; functional changes are caught by the few `<a>`/`<img>` tags that exist.
- No analytics. Easy to add later (Plausible, GA4) by dropping a single `<script>` into `index.html`.

## Credits

Original design exported from a design-composer tool; refactored, cleaned, and made deploy-ready for production at cpmandarincuisine.com.
