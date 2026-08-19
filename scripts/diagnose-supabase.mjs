// Throwaway diagnostic: does the SERVER verify tokens against the SAME Supabase
// project the BROWSER signs in to? A mismatch produces exactly the symptom we're
// chasing — a valid session that the server rejects as invalid_token.
//
// Prints only hosts, match booleans, and the public `role` claim. No secrets.
//
// Run: node scripts/diagnose-supabase.mjs

import { readFileSync, existsSync } from "fs";

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

const names = [
  "SUPABASE_URL",
  "VITE_SUPABASE_PUBLIC_URL",
  "SUPABASE_ANON_KEY",
  "VITE_SUPABASE_PUBLIC_ANON_KEY",
];

console.log("present in env files:");
for (const n of names) console.log(`  ${env[n] ? "yes" : "NO "}  ${n}`);

// Mirrors api/_lib/config.js resolution order.
const serverUrl = env.SUPABASE_URL || env.VITE_SUPABASE_PUBLIC_URL;
const serverKey = env.SUPABASE_ANON_KEY || env.VITE_SUPABASE_PUBLIC_ANON_KEY;
const clientUrl = env.VITE_SUPABASE_PUBLIC_URL;
const clientKey = env.VITE_SUPABASE_PUBLIC_ANON_KEY;

const host = (u) => {
  try {
    return new URL(u).host;
  } catch {
    return "(unparseable)";
  }
};

const claim = (jwt, field) => {
  try {
    const part = jwt.split(".")[1];
    const json = JSON.parse(Buffer.from(part, "base64").toString("utf8"));
    return json[field] ?? "(absent)";
  } catch {
    return "(not a JWT)";
  }
};

console.log("\nresolution:");
console.log(`  server URL host : ${serverUrl ? host(serverUrl) : "(none)"}`);
console.log(`  client URL host : ${clientUrl ? host(clientUrl) : "(none)"}`);
console.log(
  `  URL hosts match : ${Boolean(serverUrl && clientUrl && host(serverUrl) === host(clientUrl))}`
);
console.log(
  `  anon keys match : ${Boolean(serverKey && clientKey && serverKey === clientKey)}`
);

if (serverKey) {
  console.log(`\n  server key role : ${claim(serverKey, "role")}`);
  console.log(`  server key ref  : ${claim(serverKey, "ref")}`);
}
if (clientKey) {
  console.log(`  client key role : ${claim(clientKey, "role")}`);
  console.log(`  client key ref  : ${claim(clientKey, "ref")}`);
}

const problems = [];
if (!serverUrl) problems.push("server has no Supabase URL");
if (!serverKey) problems.push("server has no anon key");
if (serverUrl && clientUrl && host(serverUrl) !== host(clientUrl))
  problems.push("server and client point at DIFFERENT Supabase projects");
if (serverKey && claim(serverKey, "role") === "service_role")
  problems.push("server key is a service_role key — auth.uid() will be NULL in RPCs");

console.log(
  problems.length
    ? `\nPROBLEMS:\n${problems.map((p) => `  - ${p}`).join("\n")}`
    : "\nconfig looks consistent — the token itself is the likely cause"
);
