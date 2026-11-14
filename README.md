# Krishangee Tayal — Portfolio

A static personal portfolio: eight sections, four real projects, real numbers.

Plain HTML, CSS and a little vanilla JavaScript. No framework, no build step,
no bundler, no npm install, no database. Every dependency is free and every
asset is either hers or self-hosted.

```
site/
├── index.html              the whole page
├── projects/               one case-study page per project (clean URLs)
│   ├── swasthyasetu-ai/index.html
│   ├── incidentmind/index.html
│   ├── energize/index.html
│   └── scopeshield/index.html
├── netlify.toml            Netlify config (headers + cache)
├── vercel.json             Vercel config (headers + cache)
├── _headers                Cloudflare Pages / GitHub Pages header rules
├── robots.txt
├── sitemap.xml
└── assets/
    ├── css/site.css        design tokens → base → components → responsive
    ├── js/boot.js          adds the reveal class before first paint
    ├── js/site.js          header, nav, reveals, hero handoff, counters, form
    ├── fonts/              Playfair Display, Inter, JetBrains Mono (OFL, subset)
    ├── img/                photos + real product screenshots (WebP + fallback)
    ├── Krishangee_Tayal_Resume.pdf
    ├── favicon.svg / favicon.ico / apple-touch-icon.png / og.png
    └── site.webmanifest
```

Total payload on first load is roughly **0.7 MB** — about 160 KB of fonts,
120 KB of HTML/CSS/JS and 400 KB of images.

---

## Structure

**Home page** — eight sections: Hero → About → Selected Work → Experience →
Toolkit → Proof → Contact → Footer. Two marquee bands of type separate the
hero from About and Proof from Contact.

**Projects** — four deliberately small tiles in a row, each no wider than
about 345px. Each tile carries the real product screenshot in a browser-chrome
frame, one line of context and a **View case study →** link. The tiles are
small on purpose: they read as teasers, so the only sensible next move is to
click. Every tile is a single link to the full case study.

**Case studies** — one static page per project at `/projects/<slug>/`. Each
has a back link, the big title, live + repository buttons, four real numbers,
the full-width screenshot, the problem and what was built, a callout on the
honest limits, more screenshots and prev/next navigation.

Because every case study is a plain `index.html` in its own folder, the URLs
resolve on any static host without rewrite rules.

---

## Motion

**The hero hands over to the About.** The hero pins in the viewport; the
About section is a rounded sheet that rises over it while the hero dissolves
behind it — so the second section physically takes the place of the first, and
the photo goes with it. The sheet is timed so it never cuts across the photo.
On phones the hero is taller than the screen, so there it simply dissolves as
it leaves.

**Scroll reveals** are opt-in: add `data-reveal` to any element and it fades
and rises once, the first time it enters the viewport. `data-reveal="mask"`
runs a line-by-line masked reveal instead, for headings — wrap each line in
`<span class="rline"><span>…</span></span>`.

**Count-ups**: give any element `data-count="92" data-suffix="%"` and it
counts up from zero when it scrolls into view. The finished number is already
in the markup, so it shows correctly with JavaScript off.

**Ambient motion**: marquee bands, breathing glow fields, a drifting hero
shape, pulsing rays, a bouncing scroll cue, a scroll-progress bar, and tiles
that lift and zoom on hover.

The hidden state lives behind a `.js-reveal` class that `assets/js/boot.js`
adds to `<html>`, and only when the visitor has not asked for reduced motion.
So with JavaScript off, or with reduced motion on, nothing is ever hidden,
the hero never dissolves, and every marquee, glow and drift is switched off.

---

## Deploying — pick any one, all free

The folder *is* the site. Upload it and it works. There is nothing to compile,
no `npm install`, no database, no API key required to host it.

| Host | Free tier (verified Nov 2026) | How |
|---|---|---|
| **Vercel** | Hobby, $0, no card. 100 GB transfer/month, 1M edge requests/month. Personal, non-commercial use. | `vercel` from this folder, or import the Git repo at [vercel.com/new](https://vercel.com/new) |
| **Netlify** | Free, $0. 300 credits/month. **Form submissions are free and unlimited** on current plans. | Drag the folder onto [app.netlify.com/drop](https://app.netlify.com/drop) |
| **Cloudflare Pages** | Free, $0. **Unlimited bandwidth and requests** for static assets, 500 builds/month, 100 projects, 100 custom domains per project. | Connect a Git repo at [dash.cloudflare.com](https://dash.cloudflare.com) → Pages |
| **GitHub Pages** | Free for **public** repos on GitHub Free. 1 GB site, ~100 GB/month soft bandwidth, free HTTPS. | Push to a repo → Settings → Pages → deploy from branch, root `/` |
| **Surge** | Free, no card. | `npx surge . your-site.surge.sh` |

All of them give you a working `*.vercel.app`, `*.netlify.app`, `*.pages.dev`,
`*.github.io` or `*.surge.sh` address with free TLS, and all of them let you
attach a domain you already own with free automatic SSL.

The one caveat worth knowing: **Vercel's Hobby plan is for personal,
non-commercial use.** A portfolio for your own job search qualifies. If the
site ever earns money for you, move to Cloudflare Pages or Netlify — both allow
commercial use on their free tiers for static sites, and Cloudflare Pages has
no bandwidth cap at all.

### Vercel, specifically
`vercel.json` is already configured for a no-build static site:

```json
"framework": null,
"buildCommand": null,
"outputDirectory": "."
```

If you import the repo through the dashboard instead, pick **Framework Preset:
Other**, leave the build command blank and the output directory empty.

### Netlify, specifically
`netlify.toml` sets the publish directory, the cache headers, a CSP and the
security headers. Netlify detects the contact form from `data-netlify="true"`
in `index.html` automatically — no form registration needed.

### Cloudflare Pages, specifically
Build command: leave empty. Build output directory: `/`. The `_headers` file
in this folder is applied automatically for cache and security headers.

---

## The contact form

The form is written to work **on any host**, and all options are free.
It never costs money and never asks for a card.

How it behaves is decided by one line in `assets/js/site.js`:

```js
var CONFIG = {
  formProvider: 'auto',          // 'auto' | 'netlify' | 'web3forms' | 'mailto'
  web3formsEndpoint: 'https://api.web3forms.com/submit',
  web3formsAccessKey: '',        // free key from https://web3forms.com
  contactEmail: 'krishangeetayal@gmail.com',
  subject: 'Hello from your portfolio'
};
```

### Option A — Netlify Forms (free, unlimited submissions)
Deploy to Netlify and leave `formProvider: 'auto'`. Netlify detects the form
from `data-netlify="true"` and handles it natively. Submissions land in the
Netlify dashboard and can be emailed to her. Nothing to configure.
Netlify's current credit-based plans make form submissions **free and
unlimited**, and there is a built-in honeypot for spam.

### Option B — Web3Forms (free: 250 submissions/month, works on every host)
This is the one to use on **Vercel, Cloudflare Pages or GitHub Pages**.

1. Go to [web3forms.com](https://web3forms.com), enter her email, verify it.
2. Copy the access key.
3. Paste it into `web3formsAccessKey` in `assets/js/site.js`.
4. Set `formProvider: 'web3forms'` (or leave `'auto'` — it picks the key up).

The access key is designed to be public — it is a public client key, not a secret.
Free plan: 250 submissions a month, unlimited forms and domains, no card.

### Option C — mail app (free, zero setup, works anywhere)
Set `formProvider: 'mailto'`. The visitor's mail app opens with the message
already filled in. Nothing is stored, nothing is sent to a third party.

### What `'auto'` does
```
web3forms key set?  → Web3Forms
host ends .netlify.app? → Netlify Forms
otherwise           → mail app
```

With JavaScript switched off, the form still posts natively to `/`, which
Netlify handles and every other host simply reloads.

## Before publishing

- [ ] Update `sitemap.xml` and the `Sitemap:` line in `robots.txt` to the final domain — the sitemap already lists the home page and all four case studies.
- [ ] Set `og:image` / `twitter:image` to an absolute URL (`https://yourdomain/assets/og.png`) — some platforms need the full URL to show the preview card. The case-study pages use `../../assets/og.png` for the same reason.
- [ ] Pick the form provider (above) and set `formProvider` accordingly.
- [ ] Replace `assets/Krishangee_Tayal_Resume.pdf` if the résumé changes.
- [ ] Optional: `assets/img/about-photo.*` is the old About portrait. It is no longer referenced — delete it, or drop a new photo in and re-enable the `.about__media` block in `assets/css/site.css`.
- [ ] Optional: `assets/img/about-visual.*` is the illustration in the About section. Swap it for a real photo of the same aspect ratio (3:4) and update the `alt` text in `index.html`.

## Editing content

All copy lives in `index.html` and in the four files under `projects/`, as
plain, readable text. The colour palette and type scale live at the top of
`assets/css/site.css` as CSS custom properties:

```css
--cream:#FFF9F2;  --ink:#231D18;  --coral-deep:#C43F19;  --lilac:#EBD9FF;
```

Change one variable and the whole page follows.

### Accessibility notes
- Colours are checked for WCAG AA: body text is 5.5:1 or better, coral links
  are 4.9:1, white on coral buttons is 5.2:1. Small coral text on a tinted
  field uses `--coral-ink` (#A83714), which clears 4.9:1 on lilac, mint, yellow
  and coral tint alike.
- Every image has descriptive alt text; decorative SVGs are `aria-hidden`.
- The project track is keyboard operable: the tab strip responds to arrow keys,
  and the track itself is a focusable scroll region.
- The mobile menu closes on Escape, on outside click and on resize, and returns
  focus to the button.
- `prefers-reduced-motion` and `prefers-contrast` are both respected.
- A skip link, one `h1` per page, and labelled form fields are all in place.

### Licences
Playfair Display, Inter and JetBrains Mono are SIL Open Font License 1.1 and are
subset and self-hosted here. Screenshots are her own projects. No paid or
stock assets are used anywhere.
