// ─────────────────────────────────────────────────────────────────────────────
// Public-facing site details.
//
// These are the handful of values that are specific to *you* and that the app
// can't infer. Anything left blank is simply NOT rendered — the footer skips
// unconfigured links — so nothing fake, dead, or misleading ever ships. Fill
// these in before the public launch.
// ─────────────────────────────────────────────────────────────────────────────

// Shown as the footer "Contact" link (turned into a mailto:). Leave "" to hide.
// e.g. "hello@aikee.ai"
export const CONTACT_EMAIL = "aikeeai@outlook.com";

// Social profiles. Add the ones you actually use; each becomes a footer link.
// Remove or leave the array empty to show none.
// e.g. { label: "LinkedIn", href: "https://www.linkedin.com/company/aikee-ai" }
export const SOCIAL_LINKS = [
  { label: "Email", href: "mailto:aikeeai@outlook.com" },
  { label: "Facebook", href: "https://www.facebook.com/share/1BpkHxp5b5/" },
  // { label: "X", href: "https://x.com/…" },
  // { label: "Instagram", href: "https://instagram.com/…" },
];

// One-line note telling visitors this is a beta (task #5). Kept short on
// purpose so it reads cleanly in the footer.
export const BETA_NOTE =
  "Aikee AI is in private beta — features may change and the AI can make mistakes, so please review your CV before sharing it.";
