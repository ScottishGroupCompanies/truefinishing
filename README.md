# True Finishing

Next.js site for [truefinishing.com](https://truefinishing.com), a Denver concrete flooring contractor. Content lives in Markdown in this repo. The app is meant to deploy on the Scottish Group Companies Vercel account.

## Scripts

```bash
npm install
npm run dev      # http://localhost:3000
npm run validate # titles, descriptions, H1s, internal links
npm run build
npm start
```

`npm run build` runs the content check first.

## Editing a page or post

Pages, services, cities, case studies, and posts are Markdown files under `content/` with YAML frontmatter.

Required frontmatter:

- `title` — unique, used as the document title
- `description` — unique meta description
- `h1` — the only H1. Do not put a Markdown `#` heading in the body
- `path` — the public URL, with a trailing slash, for example `/floor-finishings/epoxy-flooring/`
- `type` — `post`, `service`, `service_hub`, `city`, `city_hub`, `case_study`, `case_hub`, `page`, `blog_hub`, or `home`
- `publishDate` — ISO timestamp. For posts, use 10:00 America/Denver (`-07:00` in winter, `-06:00` in summer)

Optional: `updated`, `category`, `hero` (a path under `/images/`), `directAnswer`, `faq` (a list of `{ q, a }`), `noindex`.

Body copy is Markdown. Internal links use site paths (`/floor-finishings/epoxy-flooring/`). Images use paths like `/images/example.webp`.

The homepage layout is `src/app/page.tsx`. Its title and description still come from `content/pages/home.md`.

## Adding a post

1. Create `content/posts/<category>/<slug>.md`.
2. Set `path` to `/<category>/<slug>/`. The category must match a slug in `src/lib/site.ts` (`CATEGORY_META`) if you want a category archive.
3. Set `publishDate`. A future timestamp stays off the site, the blog index, category pages, the sitemap, and the RSS feed until that moment.
4. Add images under `public/images/` as WebP. `next/image` serves them.

Do not add a city or service URL that the current site does not already have.

## Scheduled publishing

Posts are included in the deployment, then filtered at render time:

- `publishDate` must be at or before now.
- `incomplete: true` keeps a post hidden even after that date. The 18 WordPress posts scheduled after 4 Nov 2026 were not on the public API. Their files are stubs. Paste the body, remove the TODO, and set `incomplete: false` before the publish morning.

Two backstops publish them without a new deploy:

- Pages revalidate every hour (`revalidate = 3600`).
- `vercel.json` runs `/api/cron/publish` at 16:00 and 17:00 UTC. The route republishes only when the America/Denver hour is 10, which is 10:00 MDT or 10:00 MST depending on the season. Set `CRON_SECRET`. Vercel sends it as `Authorization: Bearer <CRON_SECRET>`.

## Environment variables

Copy `.env.example` to `.env.local`. Nothing in the form is hardcoded to a recipient.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical host. Defaults to `https://truefinishing.com`. |
| `NEXT_PUBLIC_GA_ID` | Optional GA4 measurement ID. |
| `LEAD_TO_EMAIL` | Inbox for estimate requests. |
| `LEAD_FROM_EMAIL` | Verified Resend from-address, for example `True Finishing <estimates@truefinishing.com>`. |
| `RESEND_API_KEY` | Resend API key. |
| `LEAD_WEBHOOK_URL` | Optional JSON POST of each lead (Zapier, Zoho, a sheet). |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Optional Cloudflare Turnstile site key. |
| `TURNSTILE_SECRET_KEY` | Optional Turnstile secret. If both are set, Turnstile is required. |
| `CRON_SECRET` | Protects the publish cron. |

The form sends email when `LEAD_TO_EMAIL`, `LEAD_FROM_EMAIL`, and `RESEND_API_KEY` are set. It also POSTs to `LEAD_WEBHOOK_URL` when that is set. If neither path is configured, the visitor gets an error instead of a fake thank-you. A honeypot field is always on. Turnstile is added only when its keys exist.

After a real submission the API redirects to `/thank-you-for-contacting-us/`, which is `noindex`.

## Vercel

1. Import this repo into the Scottish Group Companies Vercel team.
2. Framework preset: Next.js. Do not set a custom output directory.
3. Add the environment variables above to Production and Preview.
4. Deploy. `vercel.json` registers the cron.
5. At cutover, point `truefinishing.com` at the project. Vercel handles HTTPS. `www` redirects to the apex.
6. Confirm an estimate email or webhook with a test submission before DNS cutover.
7. In Search Console, submit `https://truefinishing.com/sitemap.xml`.

Redirects, including the old Aurora shortcut (it used to land on a blog post), legacy Squarespace paths, and the 14 broken internal targets, are in `redirects.mjs`. `?page_id=353` goes to `/about/`. `?page_id=1530` returns 410. No new city or service pages were added, so shortcuts such as `/wheat-ridge/` and `/commercial-floors/` land on the closest existing page (`/cities-we-serve/` and the epoxy page).

## TODOs for Jenny

- Paste the 18 scheduled post bodies (see the TODO inside each stub) and set `incomplete: false`.
- Choose the lead destination: Resend inbox, webhook, or both. Confirm `LEAD_FROM_EMAIL` on a domain Resend can send from.
- The live site says the company was established in 2007, and also “15 years,” “three decades,” and “for the last 30 years.” Schema uses 2007 because the About page says “Established in 2007.” Confirm the year before you treat it as a fact in ads.
- Opening hours were not on the WordPress site. Add them on the contact page and in schema if you want them public.
- Add `sameAs` URLs (Google Business Profile, BBB, Yelp, Houzz) in `src/lib/seo.ts` when you have the real profiles. None were linked in the footer.
- Price ranges on the service pages are only repeated where a published 2026 article already states them (epoxy, polished concrete, self-leveling). Other services have a `TODO(Jenny)` instead of a made-up number. Same for lifespans and for any license numbers.
- Moisture warranties on the old page say both “up to 15 years” and “25 years.” Reconcile that sentence before quoting it.
- The leveling page describes pumped self-leveling underlayment, not mudjacking. Say so in public only if you also sell slab lifting.
- Kinsta’s redirect list was not visible from outside the host. Compare it to `redirects.mjs` before cutover.
- Turnstile keys, GA4, and Search Console stay in the Vercel project, not in git.
