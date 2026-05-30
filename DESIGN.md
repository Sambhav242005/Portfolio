---
name: "Sambhav Surana Portfolio"
description: "An AI engineering portfolio with a crisp systems-map visual language."
colors:
  background-light: "#f9fafb"
  foreground-light: "#121a2b"
  card-light: "#ffffff"
  muted-light: "#e1e5eb"
  border-light: "#d2d9e3"
  primary-orange: "#e65c06"
  primary-orange-dark: "#f47724"
  accent-cyan: "#c9effb"
  accent-cyan-dark: "#187b96"
  background-dark: "#090d15"
  card-dark: "#0f1724"
  foreground-dark: "#f3f5f7"
typography:
  display:
    fontFamily: "Geist, Arial, Helvetica, sans-serif"
    fontSize: "clamp(3rem, 8vw, 7rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Geist, Arial, Helvetica, sans-serif"
    fontSize: "clamp(2rem, 4vw, 3.5rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Geist, Arial, Helvetica, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "Geist, Arial, Helvetica, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.16em"
rounded:
  sm: "6px"
  md: "8px"
  full: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  section: "96px"
components:
  button-primary:
    backgroundColor: "{colors.primary-orange}"
    textColor: "{colors.card-light}"
    rounded: "{rounded.md}"
    padding: "10px 32px"
    height: "40px"
  button-outline:
    backgroundColor: "{colors.background-light}"
    textColor: "{colors.foreground-light}"
    rounded: "{rounded.md}"
    padding: "10px 32px"
    height: "40px"
  card-standard:
    backgroundColor: "{colors.card-light}"
    textColor: "{colors.foreground-light}"
    rounded: "{rounded.md}"
    padding: "24px"
  chip:
    backgroundColor: "{colors.muted-light}"
    textColor: "{colors.foreground-light}"
    rounded: "{rounded.full}"
    padding: "4px 12px"
---

# Design System: Sambhav Surana Portfolio

## 1. Overview

**Creative North Star: "The Working AI Bench"**

This portfolio should feel like a precise engineering workbench: clean enough to scan quickly, technical enough to show real capability, and warm enough to feel like a person built it. The brand is not a generic AI landing page. It is a student engineer showing tangible systems: agents, vision, model architecture, APIs, repositories, and proof of practice.

The visual system uses restrained neutrals with a small amount of orange for decisive action and cyan for secondary technical signal. Sections should feel connected by the same material rules, not by repeating the same card over and over. The Three.js hero is the signature image, and every section after it should echo that systems-map feeling with lines, labels, icons, and well-organized surfaces.

**Key Characteristics:**
- Asymmetric page rhythm with left-aligned section headings.
- One primary accent: confident orange used sparingly.
- Cyan only as a secondary technical signal.
- Solid, readable surfaces in both light and dark mode.
- Icon-led skill and proof elements, not percentage bars.

## 2. Colors

The palette is a restrained AI-systems palette: cool tinted neutrals, one assertive orange, and one quiet cyan.

### Primary
- **Signal Orange**: Used for primary buttons, hero status chips, project labels, active accents, and Three.js energy nodes.
- **Signal Orange Bright**: Used in dark mode where the primary orange needs more luminosity against the deep background.

### Secondary
- **Circuit Cyan**: Used for secondary accents, data-link language, and subtle technical contrast.
- **Deep Circuit Cyan**: Used in dark mode for cyan surfaces and accent-foreground relationships.

### Neutral
- **Pearl Workbench**: The light page background. It should feel nearly white but not blank.
- **Ink Navy**: The light-mode text color. Use this instead of pure black.
- **Deep Console**: The dark page background. Use this instead of pure black.
- **Raised Panel**: The card surface in dark mode.
- **Soft Divider**: Borders, dividers, section lines, and low-emphasis separators.

### Named Rules
**The One Signal Rule.** Orange is the only primary accent. Do not add purple, rainbow gradients, or neon color families.

**The Dark Contrast Rule.** Dark mode surfaces must remain readable without relying on glow. Cards, Three.js panels, and chips need real foreground/background contrast.

## 3. Typography

**Display Font:** Geist with Arial and Helvetica fallbacks.
**Body Font:** Geist with Arial and Helvetica fallbacks.
**Label/Mono Font:** Geist Mono only for code-like labels, technical metadata, and short system text.

**Character:** The typography should feel direct, technical, and calm. It should read like an engineering interface, not a magazine page or a generic startup template.

### Hierarchy
- **Display** (800, fluid 3rem to 7rem, 0.95 line-height): Hero name only.
- **Headline** (700, fluid 2rem to 3.5rem, 1.05 line-height): Section titles and major narrative shifts.
- **Title** (700, 1.25rem to 1.5rem, 1.2 line-height): Project names, card titles, and component headings.
- **Body** (400, 1rem, 1.7 line-height): Summaries, project descriptions, and section copy. Keep line length near 65 characters.
- **Label** (700, 0.75rem, 0.16em letter-spacing): Short chips and section identifiers only.

### Named Rules
**The No Gradient Type Rule.** Do not use gradient text for headings. Use size, weight, spacing, and color hierarchy instead.

## 4. Elevation

Elevation is mostly tonal. Surfaces are separated by borders, background shifts, and very soft shadows. Shadows should be ambient, not dramatic; the interface must stay crisp in dark mode and readable on low-contrast displays.

### Shadow Vocabulary
- **Surface Rest** (`0 1px 2px rgba(15, 23, 42, 0.05)`): Default card depth.
- **Accent Hover** (`0 22px 60px -36px var(--glow-primary)`): Project-card hover only.
- **Header Float** (`0 10px 30px rgba(15, 23, 42, 0.08)`): Fixed header and high-priority navigation surfaces.

### Named Rules
**The Flat First Rule.** Surfaces are flat at rest. Hover may lift slightly, but never use decorative glow as the main way to separate content.

## 5. Components

### Buttons
- **Shape:** Gently rectangular (8px radius), except icon-only social buttons which may be circular.
- **Primary:** Signal Orange background with light text, used for the main hero action and decisive commands.
- **Hover / Focus:** Slight darkening, a visible focus ring, and optional one-pixel translate for tactile feedback.
- **Secondary / Outline:** Background-tinted surface with a real border. It must remain legible in dark mode.

### Chips
- **Style:** Rounded pills with a 1px border, tinted background, and a small icon when the chip identifies a capability.
- **State:** Chips are informational by default. Avoid making them look like disabled buttons.

### Cards / Containers
- **Corner Style:** 8px radius.
- **Background:** Use `bg-card` or `bg-background/80`, never fully transparent glass as the default.
- **Shadow Strategy:** Soft shadow at rest, accent hover only for interactive project cards.
- **Border:** 1px tokenized border. Do not use thick colored side borders.
- **Internal Padding:** 24px for regular cards, 32px only for large feature cards.

### Inputs / Fields
- **Style:** Tokenized background, 1px border, 8px radius.
- **Focus:** Primary orange ring or border shift.
- **Error / Disabled:** Error should be text and border based. Disabled should reduce opacity without hiding labels.

### Navigation
- **Style:** Floating pill header with translucent background, real border, and backdrop blur.
- **Typography:** Medium-weight Geist labels with compact spacing.
- **States:** Hover uses foreground tint and subtle background, not underlines.
- **Mobile:** Menu becomes a rounded panel below the header with full-width tap targets.

### Three.js Hero Scene
- **Role:** The signature visual asset. It should communicate AI systems, not decoration.
- **Materials:** Nodes can glow, but panels must use high-contrast solid materials so they work in dark mode.
- **Motion:** Auto-rotation and subtle float are allowed. Respect reduced-motion and mobile fallbacks.

## 6. Do's and Don'ts

### Do:
- **Do** keep section headers left-aligned or asymmetrically paired with supporting content.
- **Do** use icons for skills, proof chips, social buttons, and technical categories.
- **Do** use solid readable surfaces for project, skill, timeline, and certification cards.
- **Do** keep cards at 8px radius and use borders as the main content separator.
- **Do** verify both light and dark mode after touching the hero scene or theme tokens.

### Don't:
- **Don't** bring back skill percentage bars or visible "level" scoring.
- **Don't** use gradient text for section headings.
- **Don't** make every section the same centered heading plus equal-card grid.
- **Don't** use purple-blue AI gradients, neon glow, or pure black backgrounds.
- **Don't** rely on transparent glass cards in dark mode.
- **Don't** add a blog section unless there is a real plan to maintain it.
