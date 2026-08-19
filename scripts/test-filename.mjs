// Unit checks for the resume download filename.
// Run: node scripts/test-filename.mjs

import { buildResumeFilename, slugify } from "../src/utils/filename.js";

let pass = 0;
let fail = 0;

const eq = (label, actual, expected) => {
  if (actual === expected) {
    pass++;
    console.log(`  pass  ${label} -> ${actual}`);
  } else {
    fail++;
    console.log(`  FAIL  ${label} -> ${actual}   (expected ${expected})`);
  }
};

console.log("\nresume filenames:");
eq('"Daniel Gate"', buildResumeFilename("Daniel Gate"), "daniel-gate-resume.pdf");
eq('"daniel gate"', buildResumeFilename("daniel gate"), "daniel-gate-resume.pdf");
eq('"  Daniel   Gate  "', buildResumeFilename("  Daniel   Gate  "), "daniel-gate-resume.pdf");
eq('"Chinedu Okonkwo"', buildResumeFilename("Chinedu Okonkwo"), "chinedu-okonkwo-resume.pdf");
eq("apostrophes join", buildResumeFilename("Jose O'Brien-Smith"), "jose-obrien-smith-resume.pdf");
eq("accents stripped", buildResumeFilename("José Álvarez"), "jose-alvarez-resume.pdf");
eq("titles/punctuation", buildResumeFilename("Dr. Ada Lovelace, PhD"), "dr-ada-lovelace-phd-resume.pdf");
eq("multi-part surname", buildResumeFilename("Ana-Maria de la Cruz"), "ana-maria-de-la-cruz-resume.pdf");

console.log("\nfallbacks (must never produce '-resume.pdf' or '.pdf'):");
eq("empty string", buildResumeFilename(""), "resume.pdf");
eq("whitespace only", buildResumeFilename("   "), "resume.pdf");
eq("punctuation only", buildResumeFilename("!!! ???"), "resume.pdf");
eq("null", buildResumeFilename(null), "resume.pdf");
eq("undefined", buildResumeFilename(undefined), "resume.pdf");
eq("emoji only", buildResumeFilename("🙂🙂"), "resume.pdf");

console.log("\nlength guard:");
const long = buildResumeFilename("Alexander".repeat(20));
const lengthOk = long.length <= 60 + "-resume.pdf".length;
const noTrailingDash = !/-resume\.pdf$/.test(long) || !/--/.test(long);
console.log(`  ${lengthOk ? "pass" : "FAIL"}  capped length (${long.length} chars)`);
console.log(`  ${noTrailingDash ? "pass" : "FAIL"}  no doubled dashes`);
lengthOk ? pass++ : fail++;
noTrailingDash ? pass++ : fail++;

console.log("\nslugify directly:");
eq("no trailing dash", slugify("Daniel Gate!!!"), "daniel-gate");
eq("collapses runs", slugify("a---b"), "a-b");

console.log(`\n${pass} passed, ${fail} failed\n`);
process.exit(fail === 0 ? 0 : 1);
