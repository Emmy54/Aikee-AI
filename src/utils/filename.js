// ─────────────────────────────────────────────────────────────────────────────
// Download filename helpers
// ─────────────────────────────────────────────────────────────────────────────
// Every export used to land in the user's Downloads folder as "cv.pdf", so a
// second download became "cv (1).pdf" and a folder of them was unidentifiable.
// Naming the file after the person fixes both.

// Turns arbitrary user input into a safe, readable filename fragment.
// "Daniel Gate"        -> "daniel-gate"
// "José  O'Brien-Smith" -> "jose-obrien-smith"
// "  !!!  "            -> ""
export const slugify = (value, maxLength = 60) => {
  const stripped = String(value ?? "")
    // Decompose accents so they can be dropped rather than replaced by dashes.
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    // Apostrophes join words ("O'Brien" -> "obrien"), they don't separate them.
    .replace(/['‘’ʼ]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

  if (stripped.length <= maxLength) return stripped;
  // Trim to the limit without leaving a trailing dash.
  return stripped.slice(0, maxLength).replace(/-+$/g, "");
};

/**
 * Filename for an exported resume PDF.
 * Falls back to a generic name when we have nothing usable to slug, so the
 * download never ends up called "-resume.pdf" or ".pdf".
 */
export const buildResumeFilename = (name, { suffix = "resume", extension = "pdf" } = {}) => {
  const slug = slugify(name);
  return slug ? `${slug}-${suffix}.${extension}` : `${suffix}.${extension}`;
};
