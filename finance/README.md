# Private Finance OS · ops & deploy notes

A single-tenant, demo-auth, Apple-vari personal finance dashboard
that sits **inside** the existing `tahaberk.com` static site without
disturbing any of the public pages.

> ⚠️ **This is a DEMO**. Hardcoded client-side credentials provide
> **no real security**. See "Security" below before going public.

---

## Routes

| Path | What it serves |
|---|---|
| `/`              | existing public homepage (untouched) |
| `/work.html`     | existing public CV (untouched) |
| `/personal.html` | existing public Personal page (untouched) |
| `/research.html` | existing public Research page (untouched) |
| `/blog.html`     | existing public Blog index (untouched) |
| `/posts/*.html`  | existing public blog posts (untouched) |
| **`/finance/`**  | **new** Private Finance OS (auth-gated, `noindex,nofollow`) |
| `/finance/#/{page}` | direct deep-link to a finance sub-page (dashboard, ai, reports, etc.) |

Existing public pages get **only one new line** each — a `<script defer
src="/assets/finance-launcher.js">` that injects a small login-icon
affordance in the bottom-right corner. Nothing else on the public site
changes (no design, no copy, no animations, no fonts).

---

## Demo credentials

```
Email:    terekli@tahaberk.com
Password: taha123
```

Defined in `finance/app/auth.js`. **Do not ship this to a public URL
without first replacing it with a real auth provider.**

---

## How login works (today)

1. User clicks the small lock icon (bottom-right) on any public page.
2. They land on `/finance/`.
3. `finance/app/app.jsx` mounts. If `TBTAuth.isAuthed()` is `true`
   (an active sessionStorage item), the dashboard renders.
4. Otherwise, `<Login>` renders.
5. On submit, `TBTAuth.signIn(email, password)` validates the
   hardcoded credentials with a tiny artificial delay (~280ms) for
   perceived calm.
6. On success, a session blob is written to `sessionStorage` for 7 days.
7. Logout (sidebar lock icon) clears the session.

The session is **session-scoped** (lost on tab close, valid 7 days
otherwise). No tokens, no PII, no plaintext financial data are stored.

---

## Local dev

This repo is fully static. Use any static server:

```bash
# from repo root
npx serve -l 3000 .
# → open http://localhost:3000/
# → click the lock icon (bottom-right)
# → /finance/ → log in
```

Or:

```bash
python3 -m http.server 3000
```

---

## Vercel deploy (recommended)

The site is a pure static project — no build step.

1. **Push** the repo to GitHub (it already is: `TerekliTahaBerk/TerekliTahaBerk.github.io`).
2. **Import** the repo on Vercel as a **Static** project.
   - Framework Preset: **Other**
   - Build Command: *(leave empty)*
   - Output Directory: *(leave empty — deploys repo root)*
3. **Domains:** add `tahaberk.com` and `www.tahaberk.com`.
4. **Environment variables:** none needed for the demo. When you upgrade
   to a real auth provider, add e.g.:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_AUTH_PROVIDER`
   *(none of these are read by the current demo — placeholders for the next phase.)*
5. The included `vercel.json` already:
   - serves `/finance` and any `/finance/...` deep link as `/finance/index.html`
     (so refresh / hash routes survive)
   - sets `X-Robots-Tag: noindex, nofollow` on the entire `/finance` tree
   - disables caching for `/finance/*` (no stale finance bundles)
   - adds basic security headers globally

> ⚠️ GitHub Pages also works (no `vercel.json` needed there), but
> Vercel is preferred for the headers and clean rewrites.

---

## Vercel pre-deploy checklist

- [ ] `vercel.json` is at the repo root.
- [ ] `package.json` exists (helps Vercel detect a "Node" project; build
      command is intentionally a no-op).
- [ ] All public HTML pages still load and look identical.
- [ ] The lock icon appears in the bottom-right of every public page.
- [ ] `/finance/` shows the login screen.
- [ ] Login with the demo credentials lands on the dashboard.
- [ ] Logout clears the session and bounces back to `/finance/` login.
- [ ] Refreshing on a deep page (e.g. `/finance/#/reports`) still works.
- [ ] `noindex` headers are present on `/finance/*` (DevTools → Network).
- [ ] Mobile launcher icon does not overlap any existing UI.

---

## Security · current state vs production

The current build is **explicitly a demo**. Specifically:

| Concern | Today (MVP) | Production target |
|---|---|---|
| Credentials | Hardcoded in `auth.js` | Server-side, env vars |
| Session | `sessionStorage` blob, 7 days | HTTP-only secure cookie + JWT/refresh |
| Auth provider | None | Supabase Auth · Clerk · Auth0 · Firebase |
| Validation | Client only | Server-side route guard (middleware) |
| Storage | Mock data in JS | Encrypted DB (e.g. Supabase + pgcrypto / Postgres RLS) |
| PII / financial data | None persisted | Encrypted at rest, scoped to user_id |
| Multi-tab logout | Best-effort via `storage` event | Server session invalidation |
| Brute force | None | Rate limit + captcha + exponential backoff |
| Indexing | `noindex,nofollow` headers | Same + private DNS / VPN-only access |

When you upgrade:
1. Move credential check into a serverless function (`/api/login`).
2. Replace `TBTAuth.signIn` with a `fetch('/api/login', …)` call.
3. Replace sessionStorage with HTTP-only cookies set by the API.
4. Add a middleware (Vercel Edge or Next.js if you migrate) that
   denies `/finance/*` to unauthenticated requests.
5. Persist user data in a real DB; never store balances, card limits,
   etc. as plaintext in `localStorage`.

---

## File map

```
/                                  ← existing public site (untouched layout/visuals)
├─ index.html                      ← + 1 launcher script line
├─ work.html  / personal.html      ← + 1 launcher script line
├─ research.html / blog.html       ← + 1 launcher script line
├─ posts/*.html                    ← + 1 launcher script line each
│
├─ assets/
│   └─ finance-launcher.js         ← NEW · injects bottom-right login icon
│
├─ finance/
│   ├─ index.html                  ← finance app entry (React via CDN, Babel-standalone)
│   └─ app/
│       ├─ auth.js                 ← demo session helpers (DEMO ONLY)
│       ├─ data.js                 ← mock TR data
│       ├─ icons.jsx               ← Lucide-style icon set
│       ├─ charts.jsx              ← SVG charts (Sparkline, AreaChart, Donut, LineChart, StackBar, BarChart)
│       ├─ widgets.jsx             ← AIRow / AINote / TimeFilter / PeriodSwitch / Confidence / ProgressRing
│       ├─ login.jsx               ← Apple-vari login screen
│       ├─ shell.jsx               ← Sidebar + Topbar
│       ├─ dashboard.jsx           ← Dashboard (greeting, KPIs, cash flow, etc.)
│       ├─ pages.jsx               ← Transactions, Investments, AI Coach
│       ├─ money.jsx               ← Budget, Cards, Goals, Debts, Income
│       ├─ reports.jsx             ← Reports hub + monthly/yearly/all-time
│       ├─ settings.jsx            ← Profile · Data Sources · AI · Privacy · Manage
│       ├─ whatsapp.jsx            ← WhatsApp inbox / parse flow
│       ├─ mobile.jsx              ← iOS phone-frame previews
│       ├─ app.jsx                 ← root: auth gate + page router
│       └─ style.css               ← Apple-vari design system
│
├─ vercel.json                     ← NEW · headers + rewrites
└─ package.json                    ← NEW · static site, no build
```

---

## Next-phase suggestions

- **Real auth**: Supabase + Postgres RLS scoped to a single `user_id`.
- **Server-rendered route guard**: migrate to Next.js (App Router) or
  add a Vercel middleware that 401's `/finance/*` without a valid cookie.
- **Live WhatsApp ingest**: a tiny Node webhook on `/api/wa-inbox` +
  Twilio number, AI parse, persisted to DB.
- **Google Sheets**: real OAuth + delta sync; the current Settings page
  already mirrors the right UX.
- **OCR + LLM** for payslip / receipt uploads (currently UI only).
- **Push / email** for "Akbank kart son ödeme yaklaşıyor" reminders.
- **Theme toggle** inside the finance app (currently dark-only —
  Apple-vari dark fits best for a private finance OS).
- **PWA**: `manifest.json` + service worker so `/finance/` opens like
  a real app on iOS Home Screen.
