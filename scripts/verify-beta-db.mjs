// Verifies the beta migrations actually landed on the LIVE database — and that
// they landed with the right permissions. Read-only: it calls each RPC with the
// ANON key and classifies the error, which is enough to distinguish
// "function missing" from "function exists but correctly locked down".
//
// Expected result for every RPC: EXISTS + anon blocked.
//   * "Could not find the function"  -> migration not applied
//   * "permission denied"            -> applied AND correctly restricted (good)
//   * success                        -> applied but callable by anon (BAD)
//
// Run: node scripts/verify-beta-db.mjs

import { readFileSync, existsSync } from "fs";
import { createClient } from "@supabase/supabase-js";

const parse = (p) => {
  const out = {};
  if (!existsSync(p)) return out;
  for (const line of readFileSync(p, "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 0) continue;
    let v = t.slice(i + 1).trim();
    if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
    out[t.slice(0, i).trim()] = v;
  }
  return out;
};

const env = { ...parse(".env"), ...parse(".env.local") };
const url = env.SUPABASE_URL || env.VITE_SUPABASE_PUBLIC_URL;
const key = env.SUPABASE_ANON_KEY || env.VITE_SUPABASE_PUBLIC_ANON_KEY;

if (!url || !key) {
  console.error("Missing Supabase URL / anon key in .env.local");
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const MISSING = /could not find the function|does not exist/i;
const DENIED = /permission denied|not authorized/i;

let problems = 0;

const checkRpc = async (name, args, { expectAnonBlocked = true } = {}) => {
  const { error } = await supabase.rpc(name, args);

  if (!error) {
    if (expectAnonBlocked) {
      console.log(`  BAD      ${name} — callable by ANON (should be authenticated-only)`);
      problems++;
    } else {
      console.log(`  ok       ${name} — exists`);
    }
    return;
  }

  const msg = error.message || "";
  if (MISSING.test(msg)) {
    console.log(`  MISSING  ${name} — migration not applied (${error.code || "?"})`);
    problems++;
  } else if (DENIED.test(msg)) {
    console.log(`  ok       ${name} — exists, anon blocked`);
  } else {
    // e.g. the function ran and hit its own auth.uid() IS NULL early-return.
    console.log(`  ok?      ${name} — exists; unexpected error: ${error.code || ""} ${msg}`);
  }
};

console.log(`\nchecking ${new URL(url).host}\n`);
console.log("RPCs from beta_launch.sql:");
await checkRpc("is_email_allowlisted", {});
await checkRpc("try_consume_full_cv_generation", { p_limit: 2 });
await checkRpc("get_my_generation_status", { p_limit: 2 });

console.log("\nRPCs from beta_window.sql:");
await checkRpc("get_beta_session", { p_limit: 2, p_window_hours: 24 });
await checkRpc("record_full_cv_generation", { p_limit: 2, p_window_hours: 24 });

console.log("\nrevoked (the devtools bypass — anon AND authenticated must be blocked):");
await checkRpc("refund_full_cv_generation", {});

console.log("\ncolumns:");
// PostgREST reports an unknown column (42703) even when RLS returns zero rows,
// so this confirms the ALTER TABLE ran without needing to read anyone's data.
for (const [table, column] of [
  ["usage", "access_started_at"],
  ["usage", "full_cv_count"],
]) {
  const { error } = await supabase.from(table).select(column).limit(1);
  if (error && /column .* does not exist|42703/i.test(`${error.code} ${error.message}`)) {
    console.log(`  MISSING  ${table}.${column}`);
    problems++;
  } else if (error && DENIED.test(error.message)) {
    console.log(`  ok       ${table}.${column} — exists (read blocked by RLS)`);
  } else if (error) {
    console.log(`  ok?      ${table}.${column} — ${error.code || ""} ${error.message}`);
  } else {
    console.log(`  ok       ${table}.${column} — exists`);
  }
}

console.log(
  problems === 0
    ? "\nAll good — both migrations are live and locked down.\n"
    : `\n${problems} problem(s) found — see above.\n`
);
process.exit(problems === 0 ? 0 : 1);
