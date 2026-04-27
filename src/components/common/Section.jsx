import React from "react";

export default function Section({ show = true, children }) {
  if (!show) return null;
  return <>{children}</>;
}
