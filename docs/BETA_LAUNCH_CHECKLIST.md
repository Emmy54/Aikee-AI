# Aikee AI — Beta Launch Checklist

Everything that must be true **before** you hand the URL to beta testers. Grouped
by the launch tasks. Check each box as you go.

> Status legend: ✅ built into the code already · ⬜ an action **you** must take at deploy time.

---

## 1. Database (tasks #1, #2, #4)

- ⬜ **Run the migrations** on the live project: Supabase Dashboard → SQL Editor →
  paste and Run, **in this order**:
  1. [`database/beta_launch.sql`](../database/beta_launch.sql) — creates
     `beta_allowlist` + `usage` + the gating RPCs.
  2. [`database/beta_window.sql`](../database/beta_window.sql) — adds the
     per-tester 24-hour access window, and **closes a hole**: the old
     `refund_full_cv_generation()` was callable from the browser, so any tester
     could reset their own counter and generate without limit.

  Both are idempotent and additive; re-running is safe.
- ⬜ **Add your testers' emails** to the allowlist (this is what "verifies
  waitlisted testers"):
  ```sql
  INSERT INTO beta_allowlist (email) VALUES
    ('tester1@example.com'),
    ('tester2@example.com')
  ON CONFLICT (email) DO NOTHING;
  ```
  Anyone who signs up with an email **not** on this list still gets an account but
  sees the "You're on the waitlist" screen and every paid API call is rejected.
- ⬜ **Verify RLS** — run [`database/verify_rls.sql`](../database/verify_rls.sql)
  and confirm every `verdict` column says **PASS**. This is the proof that
  testers can't read each other's `usage` rows and nobody can read the allowlist
  (task #6).

### How the 24-hour window works

Each tester's clock starts at their **first sign-in**, not at a fixed global
deadline — so someone who's busy on launch day still gets a full 24 hours
whenever they first arrive. The clock is write-once (reloading can't restart or
extend it), and it is started by both the client *and* the server, so a tester
can't dodge it by blocking a request.

When it elapses they get a **"The beta test has closed"** page, and the server
independently rejects every paid call with `beta_window_closed`. There is no
countdown in the UI by design.

Useful operations (full list in the notes at the bottom of `beta_window.sql`):

```sql
-- Give a tester a fresh 24 hours (e.g. they never got a chance to try it)
UPDATE usage SET access_started_at = NULL WHERE user_id =
  (SELECT id FROM auth.users WHERE lower(email) = 'tester@example.com');

-- See where everyone stands
SELECT u.email, us.full_cv_count, us.access_started_at,
       us.access_started_at + interval '24 hours' AS expires_at,
       now() >= us.access_started_at + interval '24 hours' AS expired
FROM usage us JOIN auth.users u ON u.id = us.user_id
ORDER BY us.access_started_at NULLS FIRST;
```

Window length is `BETA_WINDOW_HOURS` (default 24) — an env var, no migration
needed to change it.

---

## 2. Environment variables

The app reads two *kinds* of variable, and the difference is the whole ballgame:

| Kind | Prefix | Where it ends up | Safe for secrets? |
|---|---|---|---|
| Server-only | **no** `VITE_` | Stays on the server / inside the function | ✅ yes |
| Client | `VITE_` | **Compiled into the public JS bundle** | ❌ never |

> ⚠️ A `VITE_`-prefixed variable is readable by anyone who opens devtools on your
> site. That is why the provider keys below have no prefix, and why
> `api/_lib/config.js` deliberately does **not** fall back to `VITE_GEMINI_API_KEY`
> and friends any more. The Supabase URL and anon key are the exception — they are
> *designed* to be public, and Row Level Security is what protects your data.

Copy [`.env.example`](../.env.example) to `.env.local` for local work. On Vercel,
"setting env vars" just means pasting these same name/value pairs into
**Project → Settings → Environment Variables** (apply them to Production, Preview
and Development). `.env.local` is gitignored and never leaves your machine.

### Set these on Vercel
| Variable | Value |
|---|---|
| `GEMINI_API_KEY` | your Google AI key |
| `GEMINI_API_KEY_FALLBACK` | *(optional)* second key, used on rate-limit |
| `GROQ_QUESTIONS_API_KEY` | your Groq key |
| `STABILITY_API_KEY` | your Stability key |
| `VITE_SUPABASE_PUBLIC_URL` | your Supabase project URL |
| `VITE_SUPABASE_PUBLIC_ANON_KEY` | your Supabase anon key |
| `BETA_FULL_CV_LIMIT` | `2` |
| `BETA_WINDOW_HOURS` | `24` |

### Do NOT set these on Vercel
| Variable | Why |
|---|---|
| `BETA_REQUIRE_AUTH` | Defaults to **on**. Only ever set it to `false` locally — it disables auth *and* metering. |
| `ENFORCE_HTTPS` | Gone. Vercel is HTTPS-only and HSTS is set in `vercel.json`. |
| `PORT` | Functions have no port. |
| `VITE_API_BASE_URL` | Leave empty — the SPA and API share one origin. |
| `VITE_GEMINI_API_KEY` / `VITE_STABILITY_API_KEY` / `VITE_GROQ_QUESTIONS_API_KEY` | Would leak the key into the browser bundle. |

- ⬜ Fill [`src/constants/site.js`](../src/constants/site.js) with your real
  `CONTACT_EMAIL` and `SOCIAL_LINKS` (task #5). Blank entries are simply not
  rendered — no dead links ship, but the footer shows "Contact details coming
  soon" until you set at least one.

---

## 3. Hosting on Vercel (task #6)

The API is **not** a long-running Node process any more — Vercel has nothing to
keep alive on a port. Each route is a serverless function:

```
api/gemini/generate-content.js   ->  POST /api/gemini/generate-content
api/gemini/status.js             ->  GET  /api/gemini/status
api/groq/generate-content.js     ->  POST /api/groq/generate-content
api/groq/status.js               ->  GET  /api/groq/status
api/stability/headshot.js        ->  POST /api/stability/headshot
api/stability/status.js          ->  GET  /api/stability/status
```

Each of those files is a thin wrapper; the real logic lives in `api/_lib/`
(a leading `_` tells Vercel not to treat those files as endpoints). The local dev
server, `server/index.js`, imports **the same handlers** — so local and
production cannot drift apart.

**HTTPS is automatic** — Vercel provisions and renews the certificate and serves
HTTPS only. `vercel.json` adds HSTS plus `X-Content-Type-Options`,
`Referrer-Policy` and `X-Frame-Options` at the edge. There is nothing to
configure and no reverse proxy to run.

**CORS is a non-issue**: the SPA and the functions are served from the same
origin, so `VITE_API_BASE_URL` stays empty and requests are relative.

### Deploy steps
- ⬜ Push the `beta` branch to GitHub.
- ⬜ On vercel.com: **Add New → Project → import the repo**. It should detect
  Vite automatically (`vercel.json` also states it explicitly).
- ⬜ Add the environment variables from §2 **before** the first deploy, or the
  build will succeed but every AI call will fail.
- ⬜ Deploy, then run the §4 smoke tests against the live URL.

> **Free-tier caveats.** Hobby gives 300s max function duration (a full CV
> generation measures ~2.5s, so there is plenty of headroom) and 1M invocations.
> But Hobby is limited to **non-commercial, personal use** under Vercel's fair-use
> terms — if Aikee AI starts charging, move to Pro or another host.

### Local development (unchanged)
Two terminals, exactly as before — no Vercel CLI needed:
```bash
npm run server   # local API on :8787
npm run dev      # Vite on :5173, proxies /api -> :8787
```

---

## 4. "API routes reject requests without a valid email" (task #6)

✅ Already enforced in `api/_lib/auth.js` — no action needed, but here's how to
**confirm** it after deploy:

- Every paid route (`/api/gemini/generate-content`, `/api/stability/headshot`,
  `/api/groq/generate-content`) calls `authorize()` first:
  - no / invalid Supabase token → **401** (`missing_token` / `invalid_token`)
  - valid token but email **not** on `beta_allowlist` → **403 `not_allowlisted`**
  - allowlisted but past their 24h window → **403 `beta_window_closed`**
  - allowlisted but over the cap (full-CV only) → **429 `limit_reached`**
- The gate is **fail-closed**: `BETA_REQUIRE_AUTH` defaults to on, and only the
  exact string `"false"` disables it.
- A full-CV credit is consumed **only after** a generation actually succeeds, so a
  failed or timed-out request never costs a tester one of their two.
- The three `GET /api/*/status` routes are intentionally public, but they now only
  report whether a key is *present* — none of them calls a provider, so they cost
  nothing and can't be abused to burn your quota.
- Smoke test (should return 401, proving no anonymous access):
  ```bash
  curl -i -X POST https://your-domain.com/api/gemini/generate-content \
    -H "Content-Type: application/json" -d '{}'
  ```
- ⬜ Confirm 401 with no token, and a real allowlisted tester can generate exactly
  `BETA_FULL_CV_LIMIT` CVs, then gets the limit message on the next attempt.

> **Known trade-off, honestly stated.** Because credits are consumed after success
> rather than reserved up front, a tester who fires several generations *at the
> same time* can exceed the cap by up to (concurrent requests − 1): each request
> checks the count before any of them increments it. This was a deliberate swap —
> the previous consume-then-refund design relied on a refund RPC that was callable
> straight from the browser, which made the cap bypassable entirely. Closing the
> concurrency gap too would need request-scoped reservations with expiry, which is
> more machinery than a 24-hour beta justifies.

---

## 5. Final polish

- ✅ Header rebuilt (task #3): SVG icons, real avatar, error-only AI status, crash-guarded step bar.
- ✅ Footer real links + beta note (task #5) — pending your `site.js` values.
- ✅ `DebugAuthStatus` is commented out in `BuilderApp.jsx` (import + render) — leave it off.
- ✅ API restructured for Vercel: `api/**` functions over a shared `api/_lib/` core.
- ⬜ Confirm the build passes locally: `npm run build`. Vercel runs the same command.

---

## Quick deploy order
1. Run `beta_launch.sql`, add tester emails, run `verify_rls.sql` (all PASS).
2. Fill `site.js`.
3. Verify locally: `npm run build`, `npm run test:readbody`, then `npm run server`
   + `npm run dev` and click through a real generation.
4. Push the `beta` branch to GitHub.
5. Import the repo on vercel.com, add the §2 env vars, deploy.
6. Run the §4 smoke test against the live URL. Invite testers. 🎉
