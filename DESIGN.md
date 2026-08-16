# Design System Document: The Precision Architect

## 1. Overview & Creative North Star
The North Star for this design system is **"The Digital Curator."** 

In the context of a resume builder, the UI should not feel like a database entry tool; it should feel like a high-end editorial suite. We are moving away from the "standard SaaS" look of boxes-within-boxes. Instead, we embrace a layout that feels airy, intentional, and authoritative. By blending the structured clarity of *Linear* with the fluid storytelling of *Stripe*, this system utilizes expansive white space, sophisticated tonal layering, and precise typography to transform user data into professional narratives.

**The Editorial Shift:** We break the "template" look by using intentional asymmetry. Large, bold headers (Manrope) sit offset from compact, high-utility forms (Inter), creating a visual rhythm that guides the eye through the resume-building journey without the friction of heavy borders.

---

## 2. Colors & Surface Philosophy
This system rejects the "boxed-in" aesthetic of traditional web apps. We use color to define space, not lines.

### The Palette
- **Primary (Practical):** `#004ac6` (Primary) / `#2563eb` (Container) — Represents the core utility and reliability of the professional profile.
- **Secondary (Action):** `#9d4300` (Secondary) / `#fd761a` (Container) — High-energy accents for "Publish," "Download," or "Upgrade" actions.
- **Tertiary (Social/Emotional):** `#632ecd` (Tertiary) / `#10B981` (Emotional/Success) — Used for social connectivity and progress milestones.
- **Neutrals:** A range of `surface` tokens from `#ffffff` (Lowest) to `#d3daea` (Dim).

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to section content. Boundaries must be defined solely through background color shifts or negative space. 
*   **Example:** A `surface-container-low` section sitting on a `surface` background is the only "border" you need.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—like stacked sheets of fine paper. 
*   **Level 0 (Canvas):** `surface` (#f9f9ff).
*   **Level 1 (Sections):** `surface-container-low` (#f0f3ff) for broad content areas.
*   **Level 2 (Cards/Inputs):** `surface-container-lowest` (#ffffff) to make interactive elements pop against the section background.

### The "Glass & Gradient" Rule
To elevate beyond the "out-of-the-box" feel:
*   **CTAs:** Use subtle linear gradients for `primary` buttons (e.g., `#004ac6` to `#2563eb`) to add depth.
*   **Overlays:** Use `surface-container-lowest` with a 80% opacity and a `20px` backdrop-blur for modals and floating navigation.

---

## 3. Typography
We use a dual-font strategy to balance editorial elegance with functional precision.

*   **Display & Headlines (Manrope):** These are our "editorial" anchors. Use `display-lg` and `headline-md` with tight letter-spacing (-0.02em) to create an authoritative, premium feel.
*   **Body & UI (Inter):** The "utility" workhorse. `body-md` is the standard for form labels and descriptions, ensuring maximum readability at small scales.

**Hierarchy as Identity:** 
Large `display-sm` titles should be used for section headers (e.g., "Experience," "Education"), while `label-sm` in `on-surface-variant` is reserved for metadata like dates or help text. This creates a clear distinction between the *content* and the *interface*.

---

## 4. Elevation & Depth
Depth is achieved through **Tonal Layering** rather than structural shadows.

### The Layering Principle
Instead of a shadow, place a `surface-container-lowest` (#ffffff) card inside a `surface-container` (#e7eefe) wrapper. The 1% shift in hue creates a more sophisticated "lift" than a drop shadow ever could.

### Ambient Shadows
When an element must float (e.g., a "Live Preview" FAB):
*   **Blur:** 32px – 64px.
*   **Opacity:** 4–6%.
*   **Color:** Use a tinted shadow (e.g., `#00174b` at 5% opacity) rather than pure black. This mimics natural light reflecting off the blue primary surfaces.

### The "Ghost Border" Fallback
If contrast is legally required for accessibility, use a **Ghost Border**: `outline-variant` (#c3c6d7) at **15% opacity**. It should be felt, not seen.

---

## 5. Components

### Buttons
*   **Primary:** Rounded `md` (0.75rem). Gradient fill from `primary` to `primary_container`. White text. No border.
*   **Secondary:** `surface-container-high` background with `on-primary-fixed-variant` text.
*   **Ghost:** No background. Text in `primary`. Background appears as `surface-container-low` only on hover.

### Input Fields
*   **Style:** `surface-container-lowest` background. 
*   **Interaction:** No border in default state. On focus, a 2px outer "glow" using `primary` at 20% opacity and a `Ghost Border` transition.
*   **Layout:** Labels should be `label-md` and placed *above* the field, never inside as placeholders.

### Vertical Stepper (The Resume Journey)
*   **Visual:** Avoid lines connecting the dots. Use a vertical "Progress Fill" where the track is `surface-container-highest` and the active segment is a `primary` gradient. 
*   **State:** Active steps use `primary_container` with a `surface-container-lowest` dot in the center.

### Cards & Sections
*   **Rule:** Forbid divider lines.
*   **Execution:** Use `xl` (1.5rem) vertical spacing to separate resume entries. Use a `surface-container-low` background to group "Job Title" and "Description" together as a single visual unit.

### Additional App-Specific Components
*   **The Live Preview Pane:** A `surface-container-lowest` floating panel with an `xl` corner radius and a 64px Ambient Shadow.
*   **Skill Tags:** `primary-fixed` background with `on-primary-fixed` text. Rounded `full`.

---

## 6. Do’s and Don’ts

### Do
*   **Do** use asymmetrical padding (e.g., more padding at the top of a section than the bottom) to create an editorial feel.
*   **Do** use `surface-bright` for the main workspace to reduce eye strain during long writing sessions.
*   **Do** leverage `backdrop-blur` (12px+) on top navigation bars to maintain a sense of depth as the user scrolls.

### Don't
*   **Don't** use 100% black (#000000) for text. Always use `on-surface` (#151c27) to maintain the premium, soft-minimalist tone.
*   **Don't** use standard 1px gray dividers. If you need a separator, use a 4px wide `surface-container-highest` rounded line or simply white space.
*   **Don't** use sharp corners. Everything interactive must follow the `md` (12px) or `lg` (16px) radius to feel approachable and modern.