---
name: Aikee AI Polished Simplicity
colors:
  surface: '#f9f9ff'
  surface-dim: '#d3daef'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f3ff'
  surface-container: '#e9edff'
  surface-container-high: '#e1e8fd'
  surface-container-highest: '#dce2f7'
  on-surface: '#141b2b'
  on-surface-variant: '#444656'
  inverse-surface: '#293040'
  inverse-on-surface: '#edf0ff'
  outline: '#757687'
  outline-variant: '#c5c5d9'
  surface-tint: '#2949ec'
  primary: '#0029c0'
  on-primary: '#ffffff'
  primary-container: '#2142e7'
  on-primary-container: '#c7cdff'
  inverse-primary: '#bbc3ff'
  secondary: '#006687'
  on-secondary: '#ffffff'
  secondary-container: '#34c6ff'
  on-secondary-container: '#004f6a'
  tertiary: '#2927ba'
  on-tertiary: '#ffffff'
  tertiary-container: '#4345d1'
  on-tertiary-container: '#ccccff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dee0ff'
  primary-fixed-dim: '#bbc3ff'
  on-primary-fixed: '#000f5d'
  on-primary-fixed-variant: '#002ccd'
  secondary-fixed: '#c1e8ff'
  secondary-fixed-dim: '#73d1ff'
  on-secondary-fixed: '#001e2b'
  on-secondary-fixed-variant: '#004d67'
  tertiary-fixed: '#e1e0ff'
  tertiary-fixed-dim: '#c0c1ff'
  on-tertiary-fixed: '#07006c'
  on-tertiary-fixed-variant: '#2f2ebe'
  background: '#f9f9ff'
  on-background: '#141b2b'
  surface-variant: '#dce2f7'
  surface-alt: '#F9FAFB'
  border-subtle: '#E5E7EB'
  accent-purple: '#4F46E5'
  glass-fill: rgba(255, 255, 255, 0.7)
typography:
  display-xl:
    fontFamily: Inter
    fontSize: 64px
    fontWeight: '800'
    lineHeight: 72px
    letterSpacing: -0.02em
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.05em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1200px
  gutter: 24px
  section-padding-v: 120px
  element-gap-sm: 8px
  element-gap-md: 16px
  element-gap-lg: 32px
---

## Brand & Style

The design system is built around the concept of **Polished Simplicity**. It targets job seekers and students who need a high-stakes tool that feels both authoritative and effortless. The aesthetic is a fusion of **Corporate Modern** and **Glassmorphism**, characterized by expansive white space, precision-engineered typography, and "breathable" layouts.

The visual narrative avoids the clutter of traditional resume builders, opting instead for a high-gloss, SaaS-inspired interface. This approach utilizes subtle gradients and translucent layers to suggest the sophisticated, multi-layered intelligence of the underlying AI. The emotional goal is to instill confidence through a clean, premium environment that feels "expensive" but remains highly accessible.

## Colors

The palette is anchored by **Electric Blue** (`#2142E7`), chosen for its associations with professional reliability and modern technology. This is supported by a spectrum of secondary blues and purples to create depth in gradients and high-conversion elements.

**Color Usage Guidelines:**
- **Primary Action:** Use the Electric Blue for high-priority CTAs to ensure maximum visibility against light backgrounds.
- **Backgrounds:** Utilize the neutral `#F9FAFB` for section alternating to maintain a sense of rhythm without losing the clean aesthetic.
- **Gradients:** Use a linear gradient from `#2142E7` to `#03B5ED` for primary headlines or "AI-powered" feature highlights.
- **Text:** High-contrast `#111827` should be reserved for headlines, while a 60% opacity variant is used for body copy to reduce eye strain.

## Typography

This design system uses **Inter** exclusively to ensure a systematic, utilitarian, and highly legible experience across all touchpoints. The typography relies on heavy weight contrast and tight letter-spacing for large displays to create a "tech-forward" editorial feel.

**Hierarchy Rules:**
- **Display XL:** Reserved for hero sections. Should ideally be set in the Primary Neutral color with tight tracking.
- **Uppercase Labels:** Use for small eyebrow text above headlines or for section tags to add structure.
- **Line Height:** Generous line heights (1.5x for body) are mandatory to preserve the feeling of whitespace and clarity.
- **Mobile Reflow:** On screens smaller than 768px, Display and Headline sizes must scale down by approximately 25-30% to maintain readability without excessive wrapping.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy for desktop, transitioning to a fluid model for mobile. A 12-column grid is the standard for complex sections (like feature grids), while centered single-column layouts are preferred for high-conversion narrative sections.

**Rhythm and Adaptation:**
- **Vertical Breathing:** Sections must be separated by at least 120px of vertical space (`section-padding-v`) on desktop to avoid a "cramped" feel.
- **Grid Gutter:** A consistent 24px gutter ensures that even dense data (like resume templates) feels organized.
- **Mobile Margins:** Use a 20px safe area margin on mobile devices. Gutters should reduce to 16px to maximize content area.
- **Alignment:** Consistent left-alignment is preferred for information-dense areas, while center-alignment should be reserved for the Hero and closing CTA sections.

## Elevation & Depth

Hierarchy is established through **Tonal Layers** and **Ambient Shadows** rather than heavy borders. The design system leverages the "Arcade" aesthetic of floating elements.

- **Surface Layers:** The base page is `#FFFFFF`. Secondary containers use `#F9FAFB` or a very thin `#E5E7EB` border (1px).
- **Shadow Profile:** Use large-radius, low-opacity shadows (e.g., `0px 20px 50px rgba(17, 24, 39, 0.05)`) to make cards feel like they are floating just above the surface.
- **Backdrop Blurs:** When using modals or sticky navigation bars, apply a `blur(12px)` to the background to maintain context while focusing the user's attention.
- **Interaction Depth:** On hover, buttons and cards should lift slightly (using a more pronounced shadow) to provide tactile feedback.

## Shapes

The shape language is **Rounded**, avoiding the harshness of sharp corners while maintaining professional structure. 

- **Base Radius:** 0.5rem (8px) for standard components like input fields and small buttons.
- **Card Radius:** 1rem (16px) for larger layout containers and feature cards.
- **Pill Shapes:** Reserved exclusively for tags, chips, and the secondary "rounded-full" CTA style to differentiate them from primary rectangular-rounded buttons.
- **Icons:** Use a consistent 2px stroke weight with rounded caps and corners to match the UI's geometry.

## Components

### Buttons
- **Primary:** Solid `#2142E7` background, white text. No border. Subtle lift shadow on hover.
- **Secondary:** Transparent background with a `#E5E7EB` border. Transitions to a light blue tint on hover.
- **Ghost:** No border or background. Used for low-emphasis actions like "Cancel" or "Learn More."

### Input Fields
- High-contrast text labels.
- 8px border radius with a light gray border.
- On focus: Border color changes to `#2142E7` with a subtle outer glow (0px 0px 0px 4px rgba(33, 66, 231, 0.1)).

### Cards & Feature Blocks
- Minimalist containers with 16px radius.
- Use a "Glass" effect for feature highlights: `rgba(255, 255, 255, 0.7)` background with a 1px white border and backdrop-blur.
- Icons within cards should use the `secondary_color` (`#03B5ED`) as a background tint at 10% opacity.

### Navigation
- Sticky header with a subtle white-to-transparent gradient or backdrop-blur.
- Active links marked by a small 4px dot below the text in the primary blue color.

### Interactive "Arcade" Demos
- UI snippets should be framed in a browser-like container with a 12px radius and simple window controls (dots) in the top left.