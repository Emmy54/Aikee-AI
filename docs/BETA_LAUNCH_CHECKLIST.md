# Aikee AI — Beta Launch Checklist

Everything that must be true **before** you hand the URL to beta testers. Grouped
by the launch tasks. Check each box as you go.

> Status legend: ✅ built into the code already · ⬜ an action **you** must take at deploy time.

---

## 1. Database (tasks #1, #2, #4)

- ⬜ **Run the migration** on the live project: Supabase Dashboard → SQL Editor →
  paste [`database/beta_launch.sql`](../database/beta_launch.sql) → Run. It is
  idempotent and additive (creates `usage` + `beta_allowlist` + the gating RPCs;
  touches no existing data).
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

---

## 2. Environment variables

### Server (`server/index.js`) — secret, never shipped to the browser
| Variable | Value | Notes |
|---|---|---|
| `SUPABASE_URL` | your project URL | or reuse `VITE_SUPABASE_PUBLIC_URL` |
| `SUPABASE_ANON_KEY` | your anon key | or reuse `VITE_SUPABASE_PUBLIC_ANON_KEY` |
| `GEMINI_API_KEY` | Google AI key | resume generation |
| `GEMINI_API_KEY_FALLBACK` | *(optional)* | second key used on rate-limit |
| `GROQ_QUESTIONS_API_KEY` | Groq key | interview questions |
| `STABILITY_API_KEY` | Stability key | headshots |
| `BETA_REQUIRE_AUTH` | `true` | ✅ default; **leave it true in prod** |
| `BETA_FULL_CV_LIMIT` | `2` | full-CV generations per tester |
| `ENFORCE_HTTPS` | `true` | turn **on** in prod (behind a TLS proxy); leave off locally |
| `PORT` | `8787` | or whatever your host assigns |

### Client build (`import.meta.env.VITE_*`) — **baked into the public bundle**
| Variable | Value | Notes |
|---|---|---|
| `VITE_SUPABASE_PUBLIC_URL` | your project URL | public by design (RLS protects data) |
| `VITE_SUPABASE_PUBLIC_ANON_KEY` | your anon key | public by design |
| `VITE_API_BASE_URL` | *(leave empty)* | same-origin; the proxy forwards `/api/*` |

> ⚠️ **Never** put `GEMINI_/GROQ_/STABILITY_` keys in a `VITE_` variable — anything
> `VITE_*` is embedded in the JS bundle and readable by anyone. All provider calls
> now go through the server precisely so these stay secret. (Verified: the built
> bundle contains no provider keys or endpoints.)

- ⬜ Fill [`src/constants/site.js`](../src/constants/site.js) with your real
  `CONTACT_EMAIL` and `SOCIAL_LINKS` (task #5). Blank entries are simply not
  rendered — no dead links ship, but the footer shows "Contact details coming
  soon" until you set at least one.

---

## 3. HTTPS (task #6)

Not deployed yet, so this can't be "confirmed live" — but here is exactly how to
enforce it. The app is **same-origin**: a reverse proxy serves the built static
site and forwards `/api/*` to the Node server. That proxy is the primary place
HTTPS is enforced. The server also 301s plaintext → https and sends HSTS when
`ENFORCE_HTTPS=true` (defense in depth).

**Option A — Caddy (automatic Let's Encrypt certificate, simplest):**
```caddyfile
your-domain.com {
    encode gzip
    # API → Node server (adds X-Forwarded-Proto so the app sees the real scheme)
    handle /api/* {
        reverse_proxy localhost:8787
    }
    # Everything else → the built SPA, with SPA fallback to index.html
    handle {
        root * /var/www/aikee/dist
        try_files {path} /index.html
        file_server
    }
    header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
}
```
Caddy obtains + renews the TLS cert and redirects HTTP→HTTPS automatically.

**Option B — nginx + certbot:**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$host$request_uri;      # force HTTPS
}
server {
    listen 443 ssl http2;
    server_name your-domain.com;
    # ssl_certificate / ssl_certificate_key managed by `certbot --nginx`
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;

    root /var/www/aikee/dist;
    location /api/ {
        proxy_pass http://127.0.0.1:8787;
        proxy_set_header X-Forwarded-Proto $scheme;   # lets the server verify https
        proxy_set_header Host $host;
    }
    location / { try_files $uri /index.html; }        # SPA fallback
}
```

**Option C — managed platform (Vercel/Netlify for the static build + Render/
Railway/Fly for the Node server):** HTTPS is automatic. If the SPA and API end up
on **different** origins, set `VITE_API_BASE_URL` to the API's https URL **and**
add CORS to `server/index.js` (it currently assumes same-origin and sends no
`Access-Control-Allow-Origin`).

- ⬜ Certificate installed and auto-renewing
- ⬜ HTTP→HTTPS redirect verified (`curl -I http://your-domain.com` → `301`)
- ⬜ HSTS header present (`curl -I https://your-domain.com` shows `strict-transport-security`)
- ⬜ `ENFORCE_HTTPS=true` set on the server

---

## 4. "API routes reject requests without a valid email" (task #6)

✅ Already enforced in `server/index.js` — no action needed, but here's how to
**confirm** it after deploy:

- Every paid route (`/api/gemini/generate-content`, `/api/stability/headshot`,
  `/api/groq/generate-content`) calls `authorize()` first:
  - no / invalid Supabase token → **401**
  - valid token but email **not** on `beta_allowlist` → **403 `not_allowlisted`**
  - allowlisted but over the cap (full-CV only) → **429 `limit_reached`**
- Smoke test (should return 401, proving no anonymous access):
  ```bash
  curl -i -X POST https://your-domain.com/api/gemini/generate-content \
    -H "Content-Type: application/json" -d '{}'
  ```
- ⬜ Confirm 401 with no token, and a real allowlisted tester can generate exactly
  `BETA_FULL_CV_LIMIT` CVs, then gets the limit message on the next attempt.

---

## 5. Final polish

- ✅ Header rebuilt (task #3): SVG icons, real avatar, error-only AI status, crash-guarded step bar.
- ✅ Footer real links + beta note (task #5) — pending your `site.js` values.
- ✅ `DebugAuthStatus` is commented out in `BuilderApp.jsx` (import + render) — leave it off.
- ⬜ Build the production bundle: `npm run build` (outputs to `dist/`), deploy `dist/` behind the proxy above.
- ⬜ Start the API server with the env vars from §2 (`node server/index.js`), ideally under a process manager (pm2/systemd) so it restarts on crash.

---

## Quick deploy order
1. Run `beta_launch.sql`, add tester emails, run `verify_rls.sql` (all PASS).
2. Set server + client env vars (§2); fill `site.js`.
3. `npm run build`.
4. Bring up the reverse proxy with TLS (§3) and start the API server.
5. Run the §3 and §4 smoke tests. Invite testers. 🎉
