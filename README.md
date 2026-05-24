# sitewisers-ig

Automated Instagram posting for Sitewisers. A GitHub Actions cron runs daily at
**09:00 UTC**, picks the next due post from `content/queue.json`, publishes via
the Instagram Graph API (`v21.0`), and commits the updated queue state back to
the repo. A weekly workflow rotates the long-lived access token.

## Layout

```
.github/workflows/
  post.yml              # daily publish cron (09:00 UTC)
  refresh-token.yml     # weekly token rotation (Mon 05:00 UTC)
  generate.yml          # weekly AI draft batch (Sun 12:00 UTC)
src/
  publish.js            # entrypoint
  instagram.js          # Graph API client (image / carousel / reel)
  queue.js              # queue.json read / write / select
  setup-token.js        # one-time: short→long token + IG account discovery
  refresh-token.js      # rotate IG_ACCESS_TOKEN secret via GitHub REST API
  validate-queue.js     # local + CI sanity checks on queue.json
  topic-bank.js         # seed array of post angles (each with template + data)
  generate-post.js      # Anthropic caption + template → drafts.json
  render-image.js       # Puppeteer-based HTML/CSS → 1080x1080 PNG renderer
  review-drafts.js      # interactive CLI: approve drafts into queue.json
templates/
  _base.css             # shared resets + brand variables
  stat-tile.html        # big stat + caption
  quote-tile.html       # short hook with lime accent bar
  comparison-tile.html  # left/right list comparison
  niche-callout.html    # "Dentists." + two-line statement
  lighthouse-flex.html  # four 100/100 circles + subtitle
content/
  queue.json            # production queue (publish.js reads this)
  drafts.json           # pre-approval drafts (review-drafts.js reads this)
  topic-bank.json       # persisted angle state (used_count, last_used)
  images/
```

## Setup

### 1. Install deps

```sh
npm install
```

Installs `uuid` (for authoring new queue entries) and `libsodium-wrappers`
(required to encrypt secrets when calling the GitHub REST API from
`refresh-token.js`).

### 2. Create the Meta app

1. https://developers.facebook.com → create app of type **Business**.
2. Add the **Instagram Graph API** product.
3. Grab `App ID` and `App Secret` → put them in `.env`:

```sh
cp .env.example .env
# fill META_APP_ID and META_APP_SECRET
```

### 3. Run setup-token

In the Graph API Explorer, generate a short-lived user token with these scopes:

- `instagram_basic`
- `instagram_content_publish`
- `pages_show_list`
- `pages_read_engagement`

Then:

```sh
node --env-file=.env src/setup-token.js <short_lived_token>
```

This exchanges it for a long-lived token (~60-day expiry), discovers the
Instagram Business account linked to your Page, and writes both
`IG_ACCESS_TOKEN` and `IG_BUSINESS_ACCOUNT_ID` to `.env`.

### 4. Add GitHub secrets

In the repo's **Settings → Secrets and variables → Actions**, add:

| Secret | Source | Used by |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | https://console.anthropic.com/settings/keys | `generate.yml` (caption generation) |
| `META_APP_ID` | Meta app → Settings → Basic | `refresh-token.yml` |
| `META_APP_SECRET` | Meta app → Settings → Basic | `refresh-token.yml` |
| `IG_ACCESS_TOKEN` | from `.env` after `npm run setup-token` | `post.yml`, `refresh-token.yml` |
| `IG_BUSINESS_ACCOUNT_ID` | from `.env` after `npm run setup-token` | `post.yml` |
| `GH_TOKEN` | PAT - see note below | `refresh-token.yml` (rotates `IG_ACCESS_TOKEN`) |

**`GH_TOKEN`** must be a personal access token, not the auto-provided
`GITHUB_TOKEN` (which lacks permission to update Actions secrets):

- Classic: `repo` scope.
- Fine-grained: `Actions: Read`, `Secrets: Read & Write`, scoped to this repo.

### 5. Try a dry run

```sh
npm run dry-run
```

Logs the post that *would* be published - no API call.

## Authoring posts

Drop media into `content/images/` and append to `content/queue.json`:

```json
{
  "posts": [
    {
      "id": "2026-05-23-launch",
      "type": "image",
      "media": ["images/launch.jpg"],
      "caption": "We're live. #sitewisers #launch",
      "scheduled_for": "2026-05-23",
      "status": "pending",
      "posted_at": null,
      "ig_media_id": null,
      "error": null
    }
  ]
}
```

| Field | Notes |
| --- | --- |
| `id` | Any string; UUIDs work - `uuid` is installed for convenience. |
| `type` | `"image"` (1 file), `"carousel"` (2–10), `"reel"` (1 video). |
| `media` | Paths relative to `content/`. Served via `raw.githubusercontent.com`. |
| `caption` | ≤ 2200 chars, ≤ 30 hashtags. |
| `scheduled_for` | `YYYY-MM-DD`. Oldest `pending` post with date `<= today (UTC)` wins. |

Run the validator before committing:

```sh
npm run validate-queue
```

CI runs it too, before publishing.

## Pipeline (end-to-end)

```
                  ┌──────────────────────────────────────┐
                  │ src/topic-bank.js  (128 angles)      │
                  └──────────────────┬───────────────────┘
                                     │ pickAngle: cooldown + category + niche rotation
                                     ▼
       ┌─────────────────────────────────────────────────────────┐
       │ Anthropic claude-sonnet-4-5  (3x retry, 1s/2s/4s)       │
       │  + 200-char rewrite loop                                │
       │  + data-coupling: image stats injected into prompt      │
       └────────────────────────────┬────────────────────────────┘
                                    │ caption (UK English, no em-dash, 8-12 #)
                                    ▼
              ┌─────────────────────────────────────────┐
              │ render-image.js  (Puppeteer + HTML/CSS) │
              │  -> 1080x1080 PNG, local, free          │
              │  7 templates in templates/              │
              └─────────────────┬───────────────────────┘
                                │
                                ▼
                    content/drafts.json (status: draft)
                                │
                                │ npm run review
                                ▼
                    content/queue.json (status: pending)
                                │
                                ▼
       ┌──────────────────────────────────────────────────────┐
       │ post.yml cron  (09:00 UTC + 18:00 UTC daily)         │
       │  + workflow_dispatch                                 │
       └────────────────────────┬─────────────────────────────┘
                                ▼
       ┌──────────────────────────────────────────────────────┐
       │ src/publish.js -> Instagram Graph API v21.0          │
       │  /media (container) -> poll status -> /media_publish │
       │  -> commit queue.json back with [skip ci]            │
       └──────────────────────────────────────────────────────┘
```

## How the daily run works

1. Checkout repo.
2. `npm ci`.
3. `npm run validate-queue`. Fails the run if `queue.json` is malformed.
4. `npm start` (`node src/publish.js`):
   - Load queue.
   - Find oldest `pending` post where `scheduled_for <= today (UTC)`. Exit cleanly if none.
   - Build `raw.githubusercontent.com/<repo>/<sha>/content/<media>` URLs.
   - Create IG media container (image / carousel children + parent / reel).
   - Poll `status_code` until `FINISHED` (mostly for reels).
   - `POST /media_publish`.
   - Mark `posted` (with `posted_at`, `ig_media_id`) or `failed` (with `error`).
   - Write `queue.json` back.
5. Commit the modified `queue.json` with `[skip ci]`.

## How the refresh works

`refresh-token.yml` runs **Mondays at 05:00 UTC**:

1. Read current `IG_ACCESS_TOKEN`.
2. Call `/oauth/access_token?grant_type=fb_exchange_token` to extend it
   (resets the ~60-day clock).
3. Fetch the repo's secret public key (`GET /repos/{repo}/actions/secrets/public-key`).
4. Encrypt the new token with `crypto_box_seal` (libsodium).
5. `PUT /repos/{repo}/actions/secrets/IG_ACCESS_TOKEN`.

If this fails for a couple of weeks in a row the token will expire and posts
will start failing with auth errors. Watch the workflow's failure
notifications.

To verify the refresh flow without rotating, run:

```sh
node --env-file=.env src/refresh-token.js --dry-run
```

This validates env vars, checks the GitHub public-key endpoint (proves
`GH_TOKEN` works), and exchanges the Meta token (which issues a new long-lived
token without invalidating the old one), then **skips** the secret PUT.

## AI content generation

Sitewisers posts twice a day (09:00 UTC, 18:00 UTC). To keep the queue full
without writing every caption by hand, `generate.yml` runs every **Sunday at
12:00 UTC** and produces 14 drafts - a full week of twice-daily posts.

### Weekly rhythm

```
Sun 12:00 UTC   generate.yml fires → 14 drafts written to content/drafts.json
                + images committed to content/images/
Sun any time    you run `npm run review` locally to approve/edit/skip/delete
                approved drafts move into content/queue.json with status="pending"
Mon-Sun 09:00   post.yml publishes the next due post
```

### How a draft is produced

1. `generate-post.js` reads `content/topic-bank.json`. On first run, seeds it
   from `src/topic-bank.js`. New angles added to the `.js` file are merged on
   subsequent runs (preserving existing `used_count` / `last_used`).
2. Picks the angle with the lowest `used_count` whose `last_used` is older
   than 14 days (or null). Ties broken by oldest `last_used`.
3. Calls **Anthropic** (`claude-sonnet-4-5`) with a system prompt enforcing
   the brand voice (UK English, no em-dashes, no LinkedIn-speak, ≤200 chars,
   exactly 10 hashtags). If the body exceeds 200 chars, sends up to two
   rewrite turns asking Claude to shorten while keeping the hook.
4. Renders a 1080×1080 PNG **locally** by piping the angle's `template` +
   `data` through `render-image.js`. Puppeteer loads the matching HTML file
   from `templates/`, substitutes `{{placeholders}}`, screenshots the page.
   No API, no cost, perfect text every time. Saved to
   `content/images/{uuid}.png`.
5. Finds the next unfilled `(date, slot)` pair starting tomorrow, where slots
   are `09:00` and `18:00`. Appends to `content/drafts.json` with
   `status="draft"`.
6. Bumps `used_count` and `last_used` for the angle.

### `npm run review`

Interactive CLI loop over each draft. For each, prints the caption, the image
path (open it in Finder/Preview to inspect), and the scheduled slot. Then:

```
[a]pprove   - move into content/queue.json as status="pending"
[e]dit      - open the caption in $EDITOR (defaults to nano)
[s]kip      - leave in drafts.json, move on
[d]elete    - remove from drafts.json + delete the image file
[q]uit      - save and exit
```

### Adding angles manually

Append to the array in `src/topic-bank.js`:

```js
{
  id: "dental-fluoride-myth",
  category: "niche",
  niche: "dental",
  hook_template: "Dental angle: the fluoride myth as a content marketing trap...",
  template: "quote-tile",
  data: { quote: "The fluoride myth is content marketing. Not science." },
}
```

`used_count: 0` and `last_used: null` are added automatically. On the next
`generate-post` run, the new entry is merged into `content/topic-bank.json`.

### Templates

Each template is an HTML file in `templates/`. `render-image.js` loads the
file matching `angle.template`, replaces `{{key}}` with the angle's `data[key]`,
then screenshots the page at 1080×1080 with Puppeteer.

| Template | Data shape | Best for |
| --- | --- | --- |
| `stat-tile` | `{ stat, caption }` | Big percentage / number with one supporting line |
| `quote-tile` | `{ quote }` | Short punchy hook (≤12 words works best) |
| `comparison-tile` | `{ left_label, left_1..3, right_label, right_1..3 }` | Before/after, pain/win, them/us |
| `niche-callout` | `{ niche, statement_line_1, statement_line_2 }` | Niche-tagged two-line statement |
| `lighthouse-flex` | `{ subtitle }` | Four 100/100 circles + subtitle |

To add a template: drop a new HTML file in `templates/` with `{{placeholders}}`,
link `_base.css` for the shared brand variables/resets, then reference it in
`angle.template`.

## npm scripts

| Script | What it does |
| --- | --- |
| `npm start` | Publish the next due post. |
| `npm run dry-run` | Same, but log instead of calling the API. |
| `npm run status` | Local-only snapshot: drafts, pending, posted this week, next post + ETA, spend estimate. |
| `npm run setup-token` | One-time: short-lived to long-lived token + discover IG account. |
| `npm run refresh-token` | Rotate `IG_ACCESS_TOKEN` GitHub secret. Append `-- --dry-run` to simulate without writing. |
| `npm run validate-queue` | Sanity-check `queue.json`: em-dash reject, hashtag 8-12 reject, UK English + banned-word warn. |
| `npm run generate [n]` | Produce `n` drafts (default 1) via Anthropic + local template renderer. |
| `npm run review` | Interactive draft review loop. |

## Weekly Monday routine

The cadence assumes drafts were generated Sunday at 12:00 UTC. Monday morning:

```sh
git pull --ff-only                        # grab any [skip ci] commits the bot pushed
npm run status                            # see what's queued, drafts awaiting review, spend
npm run review                            # walk through Sunday's drafts; approve / edit / skip
git add content/drafts.json content/queue.json
git commit -m "approve week of <date>"
git push                                  # so the runner sees the approved queue
```

Optional that week:

- Spot-check next post: open `content/images/<id>.png` for the next pending entry.
- If something's wrong with the *next* slot only, edit its caption directly in
  `queue.json` and push. Or flip its `status` to `failed` to skip it.
- To publish out of cycle: `gh workflow run post.yml --repo deana132/sitewisers-ig`.

## Troubleshooting

Real issues we hit, with fixes:

**Workflow ran but `No pending posts due today` even though local queue has pending entries.**
The runner checks out `origin/main`. Local edits to `content/queue.json` only
affect the next run after they're pushed. Always:
`git add content/queue.json && git commit && git push` before triggering.

**`fetch failed` from Anthropic during generation.**
Transient. `callAnthropic` in `src/generate-post.js` already retries 3x with
1s / 2s / 4s backoff and ignores terminal 4xx (auth/bad-request). If it still
fails on retry 3, check `https://status.anthropic.com` then `npm run generate`
again to fill the empty slot.

**Anthropic key 401 invalid x-api-key.**
Confirm the key starts with `sk-ant-` (full prefix). A common paste mistake
drops the leading `s` and the key looks like `k-ant-...` which fails silently
with 401.

**`Author identity unknown` when committing.**
Set per-repo identity (not `--global`):
`git config user.name "..." && git config user.email "..."`.

**`Refusing to update secret` from GitHub REST.**
The default `GITHUB_TOKEN` cannot write Actions secrets. `refresh-token.yml`
requires a personal `GH_TOKEN` (PAT) with `repo` scope (classic) or
`Actions: Read + Secrets: Read & Write` (fine-grained).

**`Node.js 20 actions are deprecated` annotation in CI.**
Bump `actions/checkout` and `actions/setup-node` to `@v5` before
**2026-06-02**. Non-blocking until then.

**Image PNG renders with a white background instead of brand black.**
The `_base.css` link in templates is relative. `setContent` defaults its base
URL to `about:blank` so the stylesheet 404s silently. `render-image.js` already
inlines `_base.css` at render time, so this only bites if you add a new
`<link rel="stylesheet">` to a template. Keep all template CSS inline or in
`_base.css`.

**Local `.env` exposes secrets in `git status`.**
Already gitignored. Confirm with `git check-ignore -v .env`. If you ever see
`.env` in `git status`, abort the commit and check `.gitignore`.

**Caption number disagrees with image stat (e.g. caption says "40%" but
image renders "63%").**
The data-coupling fix in `generateCaption` injects `angle.data` into the
Claude prompt with explicit instruction to match. If it slips through, fix
the angle's `hook_template` to name the figure explicitly, e.g. "Hook off the
63% stat...".

## Gotchas

- **Public repo or public media bucket.** `raw.githubusercontent.com` URLs only
  resolve for public repos. IG fetches the media itself, so a private repo
  won't work without swapping in a CDN / signed-URL scheme.
- **Failed posts stay failed.** No auto-retry. Edit the entry back to
  `pending` in `queue.json` after fixing the cause.
- **One post per cron tick.** The 09:00 and 18:00 crons each publish at most
  one. Trigger `workflow_dispatch` on `post.yml` to drain a backlog faster.
- **Token rotation needs `GH_TOKEN` with secrets:write.** The default
  `GITHUB_TOKEN` cannot update Actions secrets.
