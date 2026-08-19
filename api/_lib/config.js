// ============================================================================
// Shared server configuration (env vars + local .env loading)
// ============================================================================
// Imported by BOTH adapters:
//   * the Vercel functions in api/**            (env comes from the dashboard)
//   * the local dev server in server/index.js   (env comes from .env.local)
//
// Files beginning with "_" are ignored by Vercel's function detection, so
// nothing in api/_lib/ is ever exposed as an HTTP endpoint.

import { existsSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

// Walk up to the nearest package.json rather than hardcoding a depth like
// "../..". If this file ever moves, a fixed depth would silently stop finding
// .env.local — and the symptom would look like an auth bug (no SUPABASE_URL ->
// every paid route 503s), not a path bug.
const findRepoRoot = () => {
  let dir = dirname(fileURLToPath(import.meta.url));
  for (let i = 0; i < 6; i++) {
    if (existsSync(join(dir, "package.json"))) return dir;
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return process.cwd();
};

// Minimal .env reader for local development. On Vercel these files do not
// exist (env vars are injected by the platform), so both calls no-op via the
// existsSync guard.
const loadEnvFile = (filePath) => {
  if (!existsSync(filePath)) return;
  const raw = readFileSync(filePath, "utf8");
  raw.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) return;
    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }
    // Never override a value the platform (or the shell) already set.
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  });
};

// IMPORTANT: env loading and every process.env read both live in THIS file, with
// the loading above the reads. ESM evaluates modules depth-first in import order,
// so splitting them across two modules risks another module reading process.env
// before the loader has run.
const ROOT_DIR = findRepoRoot();
loadEnvFile(join(ROOT_DIR, ".env.local"));
loadEnvFile(join(ROOT_DIR, ".env"));

export const PORT = Number(process.env.PORT || 8787);

// --- AI providers -----------------------------------------------------------
// NOTE: deliberately no VITE_-prefixed fallbacks for provider secrets. Anything
// named VITE_* is inlined into the public client bundle by Vite, so a provider
// key under that name is one stray reference away from shipping to the browser.
// Server-only names only.
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
export const GEMINI_API_KEY_FALLBACK = process.env.GEMINI_API_KEY_FALLBACK;

export const GEMINI_MODEL_PRIMARY =
  process.env.GEMINI_MODEL_PRIMARY ||
  process.env.GEMINI_MODEL ||
  "gemini-2.5-flash-lite";

export const GEMINI_MODEL_FALLBACK =
  process.env.GEMINI_MODEL_FALLBACK ||
  (GEMINI_MODEL_PRIMARY.includes("flash-lite")
    ? "gemini-2.5-flash"
    : "gemini-2.5-flash-lite");

export const GROQ_API_KEY = process.env.GROQ_QUESTIONS_API_KEY;
export const GROQ_MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-20b";

export const STABILITY_API_KEY = process.env.STABILITY_API_KEY;

// --- Supabase auth / beta gating -------------------------------------------
// The VITE_SUPABASE_PUBLIC_* fallbacks are kept on purpose: unlike the provider
// keys above, the project URL and anon key are *designed* to be public (the
// browser already ships them; RLS is what protects the data).
export const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_PUBLIC_URL;
export const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLIC_ANON_KEY;

// Full-CV generations allowed per beta tester (change without a migration).
export const FULL_CV_LIMIT = Number(process.env.BETA_FULL_CV_LIMIT || 2);

// How long a tester's access lasts, measured from their FIRST SIGN-IN (not from
// a fixed global deadline — so someone who is busy on launch day still gets a
// full window whenever they first arrive). Also change-without-a-migration:
// it's passed to the RPCs as an argument.
export const BETA_WINDOW_HOURS = Number(process.env.BETA_WINDOW_HOURS || 24);

// Fail-closed by default: every paid endpoint requires a valid Supabase session
// whose email is on the beta allowlist. Set BETA_REQUIRE_AUTH=false ONLY for
// local development without Supabase configured — never in production.
// Uses ?? so an empty string still means "on"; only the literal "false" disables.
export const REQUIRE_AUTH =
  String(process.env.BETA_REQUIRE_AUTH ?? "true") !== "false";

if (REQUIRE_AUTH && (!SUPABASE_URL || !SUPABASE_ANON_KEY)) {
  console.warn(
    "[auth] BETA_REQUIRE_AUTH is on but SUPABASE_URL / SUPABASE_ANON_KEY are missing — " +
      "every paid endpoint will return 503. See docs/BETA_LAUNCH_CHECKLIST.md."
  );
}
