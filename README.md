# tahaberk.com

Personal site for Taha Berk Terekli — a static, hand-authored HTML/CSS/JS
portfolio. No framework, no build step, no backend.

## Architecture — why plain static HTML

The custom domain (`www.tahaberk.com`) is served by **GitHub Pages**
directly from this repository (see `CNAME`, `.nojekyll`). GitHub Pages does
not run a build step — it serves whatever is committed, as-is. That rules
out any static-site generator or framework: there is nowhere for a build to
run before the browser sees the files.

So the site is deliberately **zero-build, hand-authored static HTML/CSS/JS**:

- Every public page is its own `.html` file (or `index.html` inside a clean
  URL folder, e.g. `/work/index.html` serves `/work/`).
- Shared design tokens, layout primitives (nav, footer, buttons, cards) and
  the theme toggle live in `assets/css/tokens.css` and `assets/css/base.css`,
  loaded by every page — this is the single place to change the site's look.
- Each page adds one small page-specific stylesheet (`assets/css/home.css`,
  `work.css`, `projects.css`, `research.css`, `about.css`, `notes.css`,
  `notes-article.css`) for layout that isn't shared.
- There is intentionally **no templating layer**. A few small pieces of
  content (nav links, footer, the experience teaser on the homepage) are
  duplicated across a handful of files rather than pulled from one data
  file — see "Updating content" below for exactly which files to touch.

A `vercel.json` is still present in case the domain is ever pointed at
Vercel instead of GitHub Pages — it only defines general security headers
and 301 redirects from old URLs, nothing more. There is no serverless
backend, database, or API in this repository.

## Local development

```bash
npm install
npm run dev
```

This runs `npx serve -l 3000 .` and serves the repository root exactly like
GitHub Pages would (static files, clean URLs via `/work/index.html`, and a
custom `404.html`). Open `http://localhost:3000`.

There is no build step — edit HTML/CSS/JS directly and refresh.

## Site structure

```
/                       Homepage
/work/                  Experience, education, research & volunteering (CV)
/projects/              5 flagship projects (problem → approach → result)
/research/              TÜBİTAK 2209-A U-Net research write-up
/notes/                 Long-form notes (blog), + /notes/<slug>/ per post
/about/                 Personal/human supporting page
/404.html               Custom not-found page

/assets/css/            Design tokens + shared + per-page stylesheets
/assets/js/             theme.js (toggle), github-activity.js (home grid),
                         toc.js (auto table of contents for long notes)
/assets/img/og-cover.png  Social preview image (all pages share one)

/work.html, /personal.html, /research.html, /blog.html, /posts/*.html
                         Old URLs — thin meta-refresh redirect stubs to the
                         new clean URLs, kept for anyone with an old link
                         bookmarked or indexed. `vercel.json` also defines
                         real 301s for whenever Vercel serves the domain.
```

## Updating content

There's no CMS or data file — update the HTML directly. Exact spots:

- **Change current employer / add a role** — edit the `.row` blocks in
  [`work/index.html`](work/index.html) (full CV) and the shorter `.exp-row`
  teaser in [`index.html`](index.html) (homepage "Experience" section).
- **Add a project** — add a new `.pj-item` block in
  [`projects/index.html`](projects/index.html). Only add projects you can
  describe factually (problem/approach/engineering/stack/result) — see the
  "no fabrication" note below.
- **Update research status** — [`research/index.html`](research/index.html)
  is a single self-contained page.
- **Add a note/post** — create `notes/<slug>/index.html` (copy an existing
  one as a template — it already wires up the shared TOC script via
  `<article data-toc>`), then add a card to [`notes/index.html`](notes/index.html)
  and a `<url>` entry in [`sitemap.xml`](sitemap.xml).
- **Change social links / email** — these are inline per page (footer +
  hero + about). A repo-wide search for `contact@tahaberk.com` or
  `TerekliTahaBerk` will find every instance.
- **Design system** (colors, spacing, type scale) — edit
  [`assets/css/tokens.css`](assets/css/tokens.css) only; every page picks
  up the change automatically.

### No-fabrication policy

Do not add metrics, results, publication claims, or achievements that
aren't independently verifiable (a real repo, a real live URL, a real
number from a real source). The research and projects pages were written
specifically to avoid this — keep that bar.

## GitHub activity data

The homepage's decorative activity grid reads `github-activity.json`
(mirrored at both `/github-activity.json` and `/public/github-activity.json`
for path-safety). It's generated daily by
[`.github/workflows/github-activity.yml`](.github/workflows/github-activity.yml)
from the real GitHub GraphQL contribution calendar and committed back to the
repo — there is no live API call from the browser, so there's no rate-limit
or availability risk. If the JSON fails to load for any reason, the grid
falls back to a deterministic decorative pattern and the label reads
"sample activity · pattern only" — it never claims to be live data it
doesn't have.

## Deployment

Nothing to configure — push to `main` and GitHub Pages serves it directly.
The public pages need no build step and will work on GitHub Pages, Vercel,
or any static host as-is.
