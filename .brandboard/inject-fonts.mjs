// Reads the authored board template, inlines the woff2 files as base64 @font-face
// data URIs (so the published Artifact renders in real Fraunces + Inter, no CDN),
// and writes the final self-contained HTML. The base64 never enters the model context.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));

const FACES = [
  ['fonts/fraunces-300.woff2',  'Fraunces', 300, 'normal'],
  ['fonts/fraunces-400.woff2',  'Fraunces', 400, 'normal'],
  ['fonts/fraunces-600.woff2',  'Fraunces', 600, 'normal'],
  ['fonts/fraunces-400i.woff2', 'Fraunces', 400, 'italic'],
  ['fonts/inter-400.woff2',     'Inter',    400, 'normal'],
  ['fonts/inter-500.woff2',     'Inter',    500, 'normal'],
  ['fonts/inter-600.woff2',     'Inter',    600, 'normal'],
  ['fonts/inter-700.woff2',     'Inter',    700, 'normal'],
];

const css = FACES.map(([file, family, weight, style]) => {
  const b64 = readFileSync(join(here, file)).toString('base64');
  return `@font-face{font-family:'${family}';font-style:${style};font-weight:${weight};` +
         `font-display:swap;src:url(data:font/woff2;base64,${b64}) format('woff2');}`;
}).join('\n');

const tpl = readFileSync(join(here, 'brand-board.html'), 'utf8');
if (!tpl.includes('/*__FONTFACES__*/')) throw new Error('placeholder /*__FONTFACES__*/ not found');
const out = tpl.replace('/*__FONTFACES__*/', css);
writeFileSync(join(here, 'brand-board.built.html'), out);
console.log(`Injected ${FACES.length} faces -> brand-board.built.html (${(out.length/1024).toFixed(0)} KB)`);
