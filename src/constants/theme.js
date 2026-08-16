export const colors = {
  // Primary (Practical)
  primary: "#004ac6",
  primaryContainer: "#2563eb",
  onPrimary: "#ffffff",
  onPrimaryFixed: "#ffffff",
  onPrimaryFixedVariant: "#001a52",
  
  // Secondary (Action)
  secondary: "#9d4300",
  secondaryContainer: "#fd761a",
  onSecondary: "#ffffff",
  
  // Tertiary (Social/Emotional)
  tertiary: "#632ecd",
  tertiaryContainer: "#10b981",
  onTertiary: "#ffffff",
  
  // Surfaces (Layers)
  surface: "#f9f9ff",        // Level 0: Canvas
  surfaceBright: "#ffffff",
  surfaceContainerLow: "#f0f3ff",     // Level 1: Sections
  surfaceContainer: "#e7eefe",
  surfaceContainerHigh: "#e1e5ff",
  surfaceContainerHighest: "#dce0ff",
  surfaceContainerLowest: "#ffffff",  // Level 2: Interactive
  
  // Text
  onSurface: "#151c27",
  onSurfaceVariant: "#49535f",
  onSurfaceDim: "#8b8fff",
  
  // Accents
  outlineVariant: "#c3c6d7",
  outline: "#6c777f",
  
  // Legacy support for green success
  success: "#10b981",
};

export const css = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@600;700&family=Inter:wght@400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: ${colors.surface};
    color: ${colors.onSurface};
    font-family: 'Inter', sans-serif;
    min-height: 100vh;
  }

  .app {
    min-height: 100vh;
    background: ${colors.surface};
    display: flex;
    flex-direction: column;
  }

  .header {
    padding: 1.5rem 2.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    backdrop-filter: blur(12px);
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(249, 249, 255, 0.8);
    border-bottom: none;
  }

  .logo {
    font-family: 'Manrope', sans-serif;
    font-size: 1.375rem;
    font-weight: 700;
    color: ${colors.primary};
    letter-spacing: -0.02em;
  }

  .logo span {
    color: ${colors.onSurface};
    font-weight: 400;
  }

  .step-bar {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .step-dot {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background: ${colors.surfaceContainerHighest};
    transition: all 0.3s;
  }

  .step-dot.active {
    background: ${colors.primary};
    width: 1.5rem;
    border-radius: 0.25rem;
  }

  .step-dot.done {
    background: ${colors.success};
  }

  /* ── Header ──────────────────────────────────────────────────────────────── */

  .hdr-left,
  .hdr-right {
    display: flex;
    align-items: center;
  }

  .hdr-left { gap: 1rem; }
  .hdr-right { gap: 0.75rem; flex-wrap: wrap; justify-content: flex-end; }

  a.logo {
    text-decoration: none;
    transition: opacity 0.2s;
  }

  a.logo:hover { opacity: 0.7; }

  /* One rule replaces the button style that was inlined four times over,
     and :hover replaces the eight JS mouse handlers that went with it. */
  .hdr-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    background: ${colors.surfaceContainerLow};
    border: none;
    color: ${colors.primary};
    padding: 0.5rem 0.75rem;
    border-radius: 0.5rem;
    font-family: 'Inter', sans-serif;
    font-size: 0.75rem;
    font-weight: 500;
    line-height: 1.4;
    cursor: pointer;
    white-space: nowrap;
    text-decoration: none;
    transition: background 0.2s;
  }

  .hdr-btn:hover { background: ${colors.surfaceContainerHigh}; }

  .hdr-btn:focus-visible {
    outline: 2px solid ${colors.primary};
    outline-offset: 2px;
  }

  .hdr-pill {
    padding: 0.25rem 0.5rem;
    border-radius: 9999px;
    font-family: 'Inter', sans-serif;
    font-size: 0.6875rem;
    font-weight: 600;
    white-space: nowrap;
  }

  .hdr-user-label {
    max-width: 11rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .hdr-menu {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 0.5rem;
    min-width: 12rem;
    background: ${colors.surfaceContainerLowest};
    border-radius: 0.5rem;
    box-shadow: 0 0.25rem 0.75rem rgba(0, 23, 75, 0.12);
    overflow: hidden;
    z-index: 1000;
  }

  .hdr-menu-header {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid ${colors.surfaceContainerHigh};
    font-family: 'Inter', sans-serif;
    font-size: 0.75rem;
    color: ${colors.onSurfaceVariant};
    word-break: break-all;
  }

  .hdr-menu-item {
    display: block;
    width: 100%;
    background: transparent;
    border: none;
    padding: 0.75rem 1rem;
    text-align: left;
    font-family: 'Inter', sans-serif;
    font-size: 0.8125rem;
    font-weight: 500;
    color: ${colors.onSurface};
    text-decoration: none;
    cursor: pointer;
    transition: background 0.2s;
  }

  .hdr-menu-item:hover { background: ${colors.surfaceContainerLow}; }
  .hdr-menu-item.danger { color: #dc2626; }

  .main {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 3rem 1.25rem;
    background: ${colors.surface};
  }

  .card {
    background: ${colors.surfaceContainerLowest};
    border: none;
    border-radius: 1rem;
    padding: 3rem 3rem 1.875rem 3rem;
    width: 100%;
    max-width: 62.5rem;
    box-shadow: 0 2rem 4rem rgba(0, 23, 75, 0.05);
    animation: fadeUp 0.4s ease;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(1.25rem); }
    to { opacity: 1; transform: translateY(0); }
  }

  .step-tag {
    font-size: 0.6875rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: ${colors.primary};
    font-weight: 600;
    margin-bottom: 0.75rem;
    font-family: 'Inter', sans-serif;
  }

  h1 {
    font-family: 'Manrope', sans-serif;
    font-size: 2rem;
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 0.5rem;
    color: ${colors.onSurface};
    letter-spacing: -0.02em;
  }

  .subtitle {
    color: ${colors.onSurfaceVariant};
    font-size: 0.9375rem;
    margin-bottom: 2.25rem;
    line-height: 1.5;
    font-family: 'Inter', sans-serif;
  }

  .field {
    margin-bottom: 1.25rem;
  }

  label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: ${colors.onSurface};
    margin-bottom: 0.5rem;
    letter-spacing: 0;
    text-transform: none;
    font-family: 'Inter', sans-serif;
  }

  input, textarea, select {
    width: 100%;
    background: ${colors.surfaceContainerLowest};
    border: none;
    border-radius: 0.75rem;
    color: ${colors.onSurface};
    font-family: 'Inter', sans-serif;
    font-size: 0.9375rem;
    padding: 0.875rem 1rem;
    outline: none;
    transition: box-shadow 0.2s, background 0.2s;
    box-shadow: inset 0 0 0 1px transparent;
  }

  input:focus, textarea:focus, select:focus {
    box-shadow: 0 0 0 2px rgba(0, 74, 198, 0.2), inset 0 0 0 1px rgba(195, 198, 215, 0.15);
  }

  textarea { 
    resize: vertical; 
    min-height: 5.625rem;
    font-family: 'Inter', sans-serif;
  }

  .btn {
    width: 100%;
    padding: 1rem 1.5rem;
    border-radius: 0.75rem;
    font-family: 'Inter', sans-serif;
    font-size: 0.9375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
    margin-top: 0.5rem;
  }

  .btn-primary {
    background: linear-gradient(to right, ${colors.primary}, ${colors.primaryContainer});
    color: ${colors.onPrimary};
  }

  .btn-primary:hover {
    opacity: 0.9;
    box-shadow: 0 0.5rem 1.5rem rgba(0, 74, 198, 0.2);
  }

  .btn-primary:active {
    transform: scale(0.98);
  }

  .btn-secondary {
    background: ${colors.surfaceContainerHigh};
    color: ${colors.onSurfaceVariant};
  }

  .btn-secondary:hover {
    background: ${colors.surfaceContainerHighest};
  }

  .btn-ghost {
    background: transparent;
    border: none;
    color: ${colors.primary};
    margin-top: 0.75rem;
  }

  .btn-ghost:hover {
    background: ${colors.surfaceContainerLow};
  }


  .question-block {
    background: ${colors.surfaceContainerLow};
    border: none;
    border-radius: 0.875rem;
    padding: 1.25rem;
    margin-bottom: 1rem;
    transition: background 0.2s;
  }

  .question-block:focus-within {
    background: ${colors.surface};
    box-shadow: 0 0 0 2px rgba(0, 74, 198, 0.15);
  }

  .question-text {
    font-size: 0.875rem;
    color: ${colors.onSurface};
    margin-bottom: 0.75rem;
    line-height: 1.5;
    font-family: 'Inter', sans-serif;
  }

  .skill-tag {
    display: inline-block;
    background: ${colors.surfaceContainerHigh};
    border: none;
    color: ${colors.onSurface};
    border-radius: 1.25rem;
    padding: 0.375rem 0.875rem;
    font-size: 0.8125rem;
    margin: 0.25rem;
    cursor: pointer;
    transition: all 0.2s;
    user-select: none;
    font-family: 'Inter', sans-serif;
    font-weight: 500;
  }

  .skill-tag.selected {
    background: ${colors.primaryContainer};
    color: ${colors.onPrimary};
    font-weight: 600;
  }

  .skill-tag:hover:not(.selected) {
    background: ${colors.surfaceContainerHighest};
  }

  .ai-bubble {
    background: ${colors.surfaceContainerLow};
    border: none;
    border-radius: 0.875rem;
    border-left: 3px solid ${colors.primary};
    padding: 1rem 1.25rem;
    margin-bottom: 1.5rem;
    font-size: 0.875rem;
    color: ${colors.onSurface};
    line-height: 1.6;
    position: relative;
    font-family: 'Inter', sans-serif;
  }

  .ai-bubble::before {
    content: '✦ AI';
    font-size: 0.625rem;
    color: ${colors.primary};
    letter-spacing: 0.05em;
    display: block;
    margin-bottom: 0.375rem;
    font-weight: 600;
  }

  /* CV Preview Styles */
  .cv-preview {
    background: ${colors.surfaceContainerLowest};
    color: ${colors.onSurface};
    border-radius: 1rem;
    overflow: hidden;
    box-shadow: 0 1.25rem 3.75rem rgba(0, 23, 75, 0.08);
    font-family: 'Inter', sans-serif;
    max-width: 43.75rem;
    width: 100%;
    margin: 0 auto;
  }

  .cv-header {
    background: linear-gradient(to right, ${colors.primary}, ${colors.primaryContainer});
    color: ${colors.onPrimary};
    padding: 2.5rem 3rem;
    display: flex;
    align-items: center;
    gap: 2rem;
  }

  .cv-avatar {
    width: 5rem;
    height: 5rem;
    border-radius: 50%;
    background: linear-gradient(135deg, ${colors.secondaryContainer}, ${colors.secondary});
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.75rem;
    font-family: 'Manrope', sans-serif;
    font-weight: 700;
    color: ${colors.onSecondary};
    flex-shrink: 0;
  }

  .cv-name {
    font-family: 'Manrope', sans-serif;
    font-size: 1.75rem;
    font-weight: 700;
    color: ${colors.onPrimary};
    margin-bottom: 0.25rem;
  }

  .cv-role {
    color: rgba(255, 255, 255, 0.9);
    font-size: 0.875rem;
    font-weight: 500;
    letter-spacing: 0.02em;
  }

  .cv-contact {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.7);
    margin-top: 0.5rem;
  }

  .cv-body {
    display: grid;
    grid-template-columns: 12.5rem 1fr;
    min-height: 25rem;
  }

  .cv-sidebar {
    background: ${colors.surfaceContainerLow};
    padding: 2rem 1.5rem;
    border-right: none;
  }

  .cv-content {
    padding: 2rem 2.25rem;
    background: ${colors.surfaceContainerLowest};
  }

  .cv-section {
    margin-bottom: 1.75rem;
  }

  .cv-section-title {
    font-size: 0.625rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: ${colors.onSurfaceVariant};
    font-weight: 600;
    margin-bottom: 0.875rem;
    padding-bottom: 0.375rem;
    border-bottom: none;
    font-family: 'Inter', sans-serif;
  }

  .cv-sidebar .cv-section-title {
    color: ${colors.onSurface};
    border-bottom: none;
  }

  .cv-skill-pill {
    background: ${colors.primaryContainer};
    color: ${colors.onPrimary};
    border-radius: 0.25rem;
    padding: 0.3125rem 0.625rem;
    font-size: 0.6875rem;
    margin: 0.1875rem 0;
    display: block;
    font-weight: 500;
  }

  .cv-exp-item {
    margin-bottom: 1.125rem;
  }

  .cv-exp-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: ${colors.onSurface};
    margin-bottom: 0.125rem;
    font-family: 'Inter', sans-serif;
  }

  .cv-exp-company {
    font-size: 0.75rem;
    color: ${colors.primary};
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .cv-exp-bullet {
    font-size: 0.75rem;
    color: ${colors.onSurfaceVariant};
    padding-left: 0.75rem;
    position: relative;
    line-height: 1.6;
    margin-bottom: 0.25rem;
  }

  .cv-exp-bullet::before {
    content: '–';
    position: absolute;
    left: 0;
    color: ${colors.primary};
  }

  .cv-summary {
    font-size: 0.8125rem;
    color: ${colors.onSurface};
    line-height: 1.7;
    padding: 0.875rem 1rem;
    background: ${colors.surfaceContainerLow};
    border-left: 3px solid ${colors.primary};
    border-radius: 0.25rem;
    margin-bottom: 1.5rem;
  }

  .export-actions {
    display: flex;
    gap: 0.75rem;
    margin-top: 1.5rem;
    max-width: 43.75rem;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
  }

  .export-actions .btn {
    margin-top: 0;
  }

  .progress-ring {
    width: 3rem;
    height: 3rem;
    position: relative;
    margin-left: auto;
  }

  .step-counter {
    font-size: 0.8125rem;
    color: ${colors.onSurfaceVariant};
    font-weight: 500;
  }

  .two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .add-btn {
    background: ${colors.surfaceContainerLow};
    border: 2px dashed ${colors.outlineVariant};
    border-radius: 0.75rem;
    color: ${colors.primary};
    font-family: 'Inter', sans-serif;
    font-size: 0.875rem;
    padding: 0.75rem;
    cursor: pointer;
    width: 100%;
    transition: all 0.2s;
    margin-bottom: 0.75rem;
    font-weight: 500;
  }

  .add-btn:hover {
    background: ${colors.surfaceContainerHigh};
    border-color: ${colors.primary};
  }

  .exp-entry {
    background: ${colors.surfaceContainerLow};
    border: none;
    border-radius: 0.75rem;
    padding: 1.125rem;
    margin-bottom: 0.75rem;
    position: relative;
  }

  .remove-btn {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    background: none;
    border: none;
    color: ${colors.onSurfaceVariant};
    font-size: 1.125rem;
    cursor: pointer;
    line-height: 1;
    padding: 0.25rem;
    transition: color 0.2s;
  }

  .remove-btn:hover { 
    color: #ef4444;
  }

  .generating {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3.75rem 0;
    gap: 1.25rem;
  }

  .spinner {
    width: 3rem;
    height: 3rem;
    border: 3px solid ${colors.surfaceContainerHighest};
    border-top-color: ${colors.primary};
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .gen-text {
    color: ${colors.onSurfaceVariant};
    font-size: 0.9375rem;
    text-align: center;
  }

  .gen-text strong {
    color: ${colors.primary};
    display: block;
    font-size: 1.125rem;
    font-family: 'Manrope', sans-serif;
    font-weight: 700;
    margin-bottom: 0.25rem;
  }

  .preview-wrap {
    width: 100%;
    max-width: 50rem;
    animation: fadeUp 0.5s ease;
  }

  .template-preview {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${colors.surfaceContainerLow};
    padding: 1.5rem;
    border-radius: 0.75rem;
    margin-top: 1.5rem;
    overflow: hidden;
  }

  .template-scale {
    transform-origin: top center;
  }

  .preview-grid {
    display: grid;
    grid-template-columns: 18.75rem 1fr;
    gap: 1.5rem;
  }

  /* ── Two-pane builder: questions left, live preview right ────────────────
     Activates at >=1024px only. That is deliberately above the 900px point
     where .header reflows to a taller two-row layout, so the sticky preview
     pane never has to guess the header's height. */

  .builder-split {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 1.5rem;
    width: 100%;
    max-width: 82rem;
    align-items: start;
  }

  /* Undo the centered-card sizing inside the left pane only. .card keeps its
     wide centered form on the final preview step, which sits outside .builder-split. */
  .builder-split .card {
    max-width: none;
    padding: 2rem;
  }

  .builder-pane-form {
    min-width: 0;
  }

  .builder-pane-preview {
    min-width: 0;
    position: sticky;
    top: 5.5rem;
    max-height: calc(100vh - 7rem);
    overflow: auto;
    background: ${colors.surfaceContainerLow};
    border-radius: 1rem;
    padding: 1rem;
  }

  .live-preview-bar {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    margin-bottom: 0.75rem;
  }

  .live-preview-label {
    font-size: 0.6875rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-weight: 600;
    color: ${colors.primary};
    white-space: nowrap;
  }

  .live-preview-select {
    flex: 1;
    min-width: 0;
    padding: 0.5rem 0.625rem;
    font-size: 0.8125rem;
    border-radius: 0.5rem;
    background: ${colors.surfaceContainerLowest};
    box-shadow: inset 0 0 0 1px ${colors.outlineVariant};
    cursor: pointer;
  }

  .live-preview-stage {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    background: ${colors.surfaceContainerLowest};
    border-radius: 0.75rem;
    padding: 0.5rem;
    overflow: hidden;
  }

  .live-preview-scale {
    transform-origin: top center;
  }

  /* Paired fields cannot survive the narrower left column */
  @media (min-width: 1024px) and (max-width: 1300px) {
    .builder-split .two-col {
      grid-template-columns: 1fr;
    }
  }

  /* Below the split breakpoint: one pane at a time via the Form/Preview toggle */
  .builder-mobile-switch {
    display: none;
  }

  @media (max-width: 1023px) {
    .builder-split {
      grid-template-columns: 1fr;
      max-width: 42rem;
    }

    .builder-pane-preview {
      position: static;
      max-height: none;
      overflow: visible;
    }

    .builder-split[data-mobile-view="form"] .builder-pane-preview {
      display: none;
    }

    .builder-split[data-mobile-view="preview"] .builder-pane-form {
      display: none;
    }

    .builder-mobile-switch {
      display: flex;
      gap: 0.5rem;
      background: ${colors.surfaceContainerLow};
      padding: 0.3125rem;
      border-radius: 0.75rem;
      margin-bottom: 0.25rem;
    }

    .builder-mobile-switch button {
      flex: 1;
      padding: 0.625rem 0.75rem;
      border: none;
      border-radius: 0.5rem;
      background: transparent;
      color: ${colors.onSurfaceVariant};
      font-family: 'Inter', sans-serif;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .builder-mobile-switch button.active {
      background: ${colors.surfaceContainerLowest};
      color: ${colors.primary};
      font-weight: 600;
      box-shadow: 0 0.0625rem 0.1875rem rgba(0, 23, 75, 0.1);
    }
  }

  @media (max-width: 900px) {
    .header {
      padding: 1rem 1.25rem;
      flex-direction: column;
      align-items: flex-start;
      gap: 0.75rem;
    }

    .step-bar {
      flex-wrap: wrap;
      gap: 0.25rem;
    }

    /* Stacked header: let the action row use the full width and align left
       with the logo instead of hugging the right edge. */
    .hdr-right {
      width: 100%;
      justify-content: flex-start;
    }

    .main {
      padding: 2.5rem 1rem;
    }

    .card {
      padding: 2rem;
      border-radius: 1rem;
    }

    h1 {
      font-size: 1.625rem;
    }

    .subtitle {
      font-size: 0.875rem;
      margin-bottom: 1.5rem;
    }

    .export-actions {
      flex-direction: column;
    }

    .cv-header {
      flex-direction: column;
      align-items: flex-start;
      padding: 1.75rem;
      gap: 1rem;
    }

    .cv-body {
      grid-template-columns: 1fr;
    }

    .cv-sidebar {
      border-right: none;
      border-bottom: none;
    }
  }

  @media (max-width: 700px) {
    .card {
      padding: 1.5rem;
    }

    .two-col {
      grid-template-columns: 1fr;
    }

    .preview-grid {
      grid-template-columns: 1fr;
    }

    .template-preview {
      align-items: flex-start;
      justify-content: flex-start;
    }

    .cv-content {
      padding: 1.5rem;
    }

    .cv-preview {
      border-radius: 0.75rem;
    }
  }

  @media (max-width: 520px) {
    .logo {
      font-size: 1.125rem;
    }

    h1 {
      font-size: 1.375rem;
    }

    .btn {
      padding: 0.875rem;
      font-size: 0.875rem;
    }

    input, textarea, select {
      font-size: 0.875rem;
      padding: 0.75rem 0.875rem;
    }
  }

  #cv-preview section,
  #cv-preview .cv-section,
  #cv-preview .avoid-break {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  #cv-preview h1,
  #cv-preview h2,
  #cv-preview h3,
  #cv-preview h4 {
    break-after: avoid;
    page-break-after: avoid;
  }

  #cv-preview .page-break {
    break-after: page;
    page-break-after: always;
  }

  @media print {
    body {
      margin: 0;
    }

    .cv-page {
      width: 210mm;
      min-height: 297mm;
      padding: 10mm;
    }
  }
`;
