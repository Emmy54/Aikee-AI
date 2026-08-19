// Catches a class of bug that `vite build` does NOT: calling a setter (or reading
// a state variable) that was never declared with useState. Rollup happily bundles
// it and the component throws at runtime — e.g. "setAutosaveError is not defined"
// on the first keystroke.
//
// Heuristic, not a type checker: it compares `setFoo(` call sites against
// `const [foo, setFoo] = useState(...)` declarations in the same file.
//
// Run: node scripts/check-state-setters.mjs

import { readFileSync } from "fs";

const FILES = [
  "src/BuilderApp.jsx",
  "src/AppRoutes.jsx",
  "src/components/pages/HeadshotGenerator.jsx",
  "src/components/steps/PersonalInfoStep.jsx",
  "src/services/apiClient.js",
  "src/utils/imageCompression.js",
];

let problems = 0;

for (const file of FILES) {
  let src;
  try {
    src = readFileSync(file, "utf8");
  } catch {
    console.log(`  skip  ${file} (not found)`);
    continue;
  }

  // Declared setters: const [x, setX] = useState(...)
  const declared = new Set();
  for (const m of src.matchAll(/const\s*\[\s*([A-Za-z0-9_]+)\s*,\s*([A-Za-z0-9_]+)\s*\]\s*=\s*useState/g)) {
    declared.add(m[1]);
    declared.add(m[2]);
  }
  // Other local bindings and params that could legitimately provide a setter
  // (props destructuring, plain const/let, function params, imports).
  const otherBindings = new Set();
  for (const m of src.matchAll(/(?:const|let|var)\s+([A-Za-z0-9_]+)\s*=/g)) otherBindings.add(m[1]);
  for (const m of src.matchAll(/\b(?:function\s+)?([A-Za-z0-9_]+)\s*(?=\()/g)) otherBindings.add(m[1]);
  // Anything inside a destructuring pattern or import list.
  for (const m of src.matchAll(/[{,]\s*([A-Za-z0-9_]+)\s*[,}=]/g)) otherBindings.add(m[1]);

  // Called setters: setFoo(
  const called = new Set();
  for (const m of src.matchAll(/\b(set[A-Z][A-Za-z0-9_]*)\s*\(/g)) called.add(m[1]);

  for (const setter of called) {
    if (declared.has(setter) || otherBindings.has(setter)) continue;
    console.log(`  MISSING  ${file}: ${setter}() is called but never declared`);
    problems++;
  }
}

console.log(problems === 0 ? "\nno undeclared state setters found" : `\n${problems} problem(s)`);
process.exit(problems === 0 ? 0 : 1);
