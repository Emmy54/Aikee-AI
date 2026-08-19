// Unit checks for the portable readBody() in api/_lib/http.js.
//
// readBody has to work in two environments that hand over the body differently:
//   * locally  — raw Node stream, nothing pre-parsed
//   * Vercel   — req.body is a lazy getter that has already consumed the stream,
//                THROWS on malformed JSON, and varies by Content-Type
//                (object / string / Buffer / null / undefined)
//
// Run: node scripts/test-readbody.mjs

import { Readable } from "stream";
import { readBody } from "../api/_lib/http.js";

let pass = 0;
let fail = 0;

const eq = (name, actual, expected) => {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a === e) {
    pass++;
    console.log(`  pass  ${name}`);
  } else {
    fail++;
    console.log(`  FAIL  ${name}\n        expected ${e}\n        actual   ${a}`);
  }
};

// A local request: a readable stream, no `body` property at all.
const streamReq = (text) => {
  const r = Readable.from(text === null ? [] : [Buffer.from(text, "utf8")]);
  return r; // no .body -> undefined, readableEnded false
};

// A Vercel-style request: body already parsed, stream drained.
// readableEnded is getter-only on Readable, so it has to be redefined.
const drained = (r) => {
  Object.defineProperty(r, "readableEnded", { get: () => true });
  return r;
};

const vercelReq = (value) => {
  const r = drained(Readable.from([]));
  Object.defineProperty(r, "body", { get: () => value });
  return r;
};

// A Vercel request whose body getter throws (malformed JSON upstream).
const vercelThrowingReq = () => {
  const r = drained(Readable.from([]));
  Object.defineProperty(r, "body", {
    get: () => {
      throw new SyntaxError("Unexpected token } in JSON");
    },
  });
  return r;
};

// The subtle one: a request with NO Content-Type. Vercel sets req.body to ""
// but does NOT consume the stream, so the real payload is still there to read.
const noContentTypeReq = (text) => {
  const r = Readable.from([Buffer.from(text, "utf8")]);
  Object.defineProperty(r, "body", { get: () => "" });
  return r;
};

console.log("\nlocal (stream) path:");
eq("valid JSON object", await readBody(streamReq('{"a":1,"b":"x"}')), { a: 1, b: "x" });
eq("nested JSON", await readBody(streamReq('{"m":[{"r":"user"}]}')), { m: [{ r: "user" }] });
eq("empty body -> {}", await readBody(streamReq("")), {});
eq("malformed JSON -> {}", await readBody(streamReq("{not json")), {});
eq("no chunks -> {}", await readBody(streamReq(null)), {});
eq("bare number is not an object -> {}", await readBody(streamReq("5")), {});
eq("JSON array stays an array", await readBody(streamReq("[1,2]")), [1, 2]);

console.log("\nVercel (pre-parsed) path:");
eq("body already an object", await readBody(vercelReq({ meter: "full_cv" })), { meter: "full_cv" });
eq("body as JSON string", await readBody(vercelReq('{"a":2}')), { a: 2 });
eq("body as Buffer", await readBody(vercelReq(Buffer.from('{"a":3}', "utf8"))), { a: 3 });
eq("body null (no body sent) -> {}", await readBody(vercelReq(null)), {});
eq("body undefined (no Content-Type) -> {}", await readBody(vercelReq(undefined)), {});
eq("body a bare string (text/plain) -> {}", await readBody(vercelReq("hello")), {});
eq("getter throws (malformed) -> {}", await readBody(vercelThrowingReq()), {});

console.log("\nno Content-Type: body is '' but the stream is still intact:");
eq(
  'empty body string must NOT short-circuit — reads the stream',
  await readBody(noContentTypeReq('{"real":"payload"}')),
  { real: "payload" }
);

console.log(`\n${pass} passed, ${fail} failed\n`);
process.exit(fail === 0 ? 0 : 1);
