---
name: Budapest Expert Hub
description: A suspended city atlas for finding local expertise with clarity.
colors:
  page: "#f4f5f7"
  surface: "#ffffff"
  surface-soft: "#e9edf2"
  ink: "#111822"
  muted: "#5e6875"
  line: "rgba(17, 24, 34, 0.12)"
  danube-blue: "#087aea"
  danube-blue-deep: "#075eb2"
  locator-orange: "#e45436"
  map-night: "#0d3656"
  interior: "#155f98"
  housing: "#d5e8d4"
  mortgage: "#efc7a7"
  translation: "#d7ddf5"
  legal: "#7e3b44"
  dark-page: "#10151c"
  dark-surface: "#18212b"
  dark-surface-soft: "#222d39"
  dark-ink: "#f0f4f7"
  dark-muted: "#a5b1bd"
  dark-line: "rgba(233, 240, 246, 0.13)"
  dark-blue: "#55aaff"
  dark-blue-deep: "#3b98ef"
typography:
  display:
    fontFamily: "Urbanist, sans-serif"
    fontSize: "clamp(3.5rem, 5.8vw, 5.75rem)"
    fontWeight: 750
    lineHeight: 0.92
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Urbanist, sans-serif"
    fontSize: "clamp(2.55rem, 4.3vw, 4.6rem)"
    fontWeight: 750
    lineHeight: 0.98
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Urbanist, sans-serif"
    fontSize: "clamp(1.6rem, 2.1vw, 2.4rem)"
    fontWeight: 750
    lineHeight: 1
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Manrope, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "normal"
  label:
    fontFamily: "Manrope, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "0.04em"
rounded:
  field: "12px"
  icon: "14px"
  surface: "16px"
  pill: "999px"
  circle: "50%"
spacing:
  compact: "8px"
  small: "12px"
  regular: "16px"
  content: "24px"
  roomy: "32px"
  section-mobile: "90px"
  section-desktop: "130px"
components:
  button-dark:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.surface}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 20px"
    height: "46px"
  button-blue:
    backgroundColor: "{colors.danube-blue-deep}"
    textColor: "{colors.surface}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 20px"
    height: "46px"
  search-action:
    backgroundColor: "{colors.danube-blue-deep}"
    textColor: "{colors.surface}"
    rounded: "{rounded.field}"
    size: "58px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.surface}"
    padding: "26px"
---

# Design System: Budapest Expert Hub

## Overview

**Creative North Star: "The Suspended City Atlas"**

Budapest expertise is presented as a place to explore, not a generic directory. Silver-white architectural surfaces, precise dark type, Danube blue wayfinding, and a warm locator pin make service and district selection feel spatial while retaining calm marketplace clarity.

The system pairs Apple-like restraint with one purposeful expressive layer: the miniature city. Discovery controls remain conventional, readable, and honest; 3D explains the local network but never gates the task.

**Key Characteristics:**
- Architectural light surfaces with thin structural rules.
- Oversized, tightly set Urbanist headings over compact Manrope UI text.
- Blue for navigation and action; orange only for physical location.
- Large calm fields interrupted by sculpted cards, circles, and map geometry.
- Explicit labels for illustrative, sample, and integration-ready states.

## Colors

The base palette is cool, civic, and quiet. Category cards provide controlled muted color fields without changing the global hierarchy.

### Primary
- **Danube Blue:** The main wayfinding and action color for links, focus, search, and primary CTAs; the deeper variant carries filled controls.

### Secondary
- **Locator Orange:** Reserved for map pins, geographic emphasis, and warm spatial accents. It is not a second general-purpose CTA color.
- **Service Fields:** Interior blue, housing sage, mortgage clay, translation periwinkle, and legal burgundy identify the five service routes. Preserve their paired high-contrast foregrounds from the implementation.

### Neutral
- **Silver Page:** The continuous architectural canvas.
- **White Surface:** Search, profile, dialog, and floating-label material.
- **Soft Silver:** Recessed controls and quiet status labels.
- **Precision Ink:** Primary type, marks, and dark actions.
- **Muted Slate:** Supporting copy and metadata.
- **Structural Line:** Low-contrast dividers; never a heavy card outline.
- **Map Night:** Deep geographic panels and matching explanations.
- **Dark Mode:** The system follows `prefers-color-scheme`, remapping the core page, surface, ink, muted, line, and blue roles to the `dark-*` tokens.

**The Blue Means Direction Rule.** Use blue for movement, selection, location context, and actionable emphasis, not as ambient decoration.

**The Orange Pin Rule.** Keep orange rare and geographic so the active location remains instantly legible.

## Typography

**Display Font:** Urbanist (with `sans-serif` fallback)  
**Body Font:** Manrope (with `sans-serif` fallback)

**Character:** Urbanist supplies geometric, city-scale confidence; its italic creates the hero's human inflection. Manrope keeps navigation, forms, metadata, and longer copy neutral and highly legible.

### Hierarchy
- **Display:** Heavy, tightly tracked Urbanist for the hero only; the second thought may use the italic weight in blue.
- **Headline:** Responsive Urbanist for major section statements, generally at near-solid line height.
- **Title:** Urbanist for service promises, profile names, steps, and panel headings.
- **Body:** Manrope at comfortable line heights (`1.55` to `1.7`) with restrained line lengths of roughly `38ch` to `65ch`.
- **Label:** Compact Manrope at weights `700` to `800`; uppercase and letter-spaced only for eyebrow and status labels.

**The Two-Voice Rule.** Urbanist carries meaning and momentum; Manrope carries operation and explanation. Do not introduce a third type voice.

## Layout

The desktop hero is an asymmetric two-column composition inside a `1480px` maximum width, with copy on the left and the city scene on the right. Content sections use a `1240px` maximum width, `24px` gutters, and generous `130px` vertical section spacing; the header uses `32px` gutters. Grids favor unequal proportions so priority is visible rather than mechanically centered.

At `1080px`, navigation becomes a floating menu and expert content simplifies. At `820px`, layouts become single-column, gutters reduce to `18px`, section spacing becomes `90px`, the search fields stack beside one full-height search action, cards become a horizontal snap rail, and the sticky process heading becomes static. At `430px`, hero type and scene height reduce again and footer links become one column.

The mobile reading order is always task first: promise, selectors, then city. Core controls and results must remain available without the visual scene.

**The Useful-First Rule.** Preserve the service-and-district action in the first viewport before adding visual spectacle or explanatory content.

## Elevation & Depth

Depth is a hybrid of restrained ambient shadows, translucent white material, and literal city geometry. Standard floating surfaces use a broad cool shadow (`0 28px 80px rgba(56, 69, 84, 0.14)`); controls and labels use smaller, tighter shadows. Dark feature panels use tonal depth and radial light rather than borders. In dark mode, ambient depth becomes denser (`0 28px 80px rgba(0, 0, 0, 0.27)`).

### 3D Behavior
- On viewports at least `821px` wide, lazily load the React Three Fiber city: a silver rounded platform, blue river, white bridges and buildings, and an orange service pin offset by district.
- The camera is fixed for scale; users may orbit within constrained polar angles, but cannot pan or zoom. Slow auto-rotation, subtle city drift, and pin float communicate a live atlas rather than a game.
- With `prefers-reduced-motion: reduce`, auto-rotation, city drift, and pin float stop; CSS transitions and animations collapse to effectively instant state changes.
- Below `821px`, do not initialize WebGL. Use the CSS isometric city fallback with the same river, architecture, bridge, pin, and active-service label. It is decorative and hidden from assistive technology while the parent visual retains a descriptive label.

**The Purposeful Depth Rule.** Elevation clarifies hierarchy or spatial matching. Never add ornamental 3D objects, gratuitous parallax, or controls that make discovery depend on WebGL.

## Shapes

The form language combines softly machined rectangles with circles from cartography. Primary surfaces and cards use a consistent `16px` radius; form fields and search actions use `12px`; icon wells use `14px`; chips and buttons are fully pill-shaped. Map rings, pins, status dots, and the brand mark are circular. Borders are thin and low contrast, used to divide information rather than frame every surface.

**The One Surface Radius Rule.** Use the `16px` surface radius for new cards, panels, dialogs, and large calls to action unless the element is explicitly a field, icon well, pill, or circle.

## Components

### Buttons
- Filled actions are compact pills with a `46px` minimum height, bold Manrope labels, and dark, blue, or inverse-light color roles.
- Hover lifts filled buttons by `2px`; active returns them to the plane and scales to `0.98`. Focus always uses the shared visible blue outline.
- Inline actions remain text-led with a single underline or baseline rule and a directional arrow.

### Search Console and Inputs
- The hero search is a translucent white `16px` surface with two semantic native selects and one square blue action. Dividers separate fields without boxing each one.
- Dialog fields use the page tone, a `12px` radius, and a subtle line. Focus shifts the border to deep blue and adds a soft blue ring.
- Labels stay visible above values; placeholders supplement labels and never replace them.

### Cards and Status
- Service cards are full-surface category colors, left aligned, and content-led. A quiet circular contour and lift-on-hover provide depth without decorative imagery.
- Expert cards pair a large portrait crop with structured facts. Demo and sample states must remain visibly labeled.
- Chips are small pills for sample state, match criteria, scene context, or location, never a substitute for buttons.

### Navigation and Dialogs
- Desktop navigation is centered and gains a fine animated underline on hover. At narrow widths it becomes a compact, elevated menu opened by a `44px` circular control.
- The request dialog enters from the lower-right on desktop and becomes an inset near-full-height sheet on mobile. It traps focus, closes on Escape or backdrop activation, makes the page inert, and returns focus to its trigger.

### Interaction and Accessibility
- All task actions use semantic buttons, links, labels, selects, and form controls. Keep the skip link and `3px` visible focus outline with `4px` offset.
- Search results receive focus after navigation and announce updates through a polite live region. Notices and submission status also use live regions.
- Respect reduced motion and reduced transparency. Maintain readable contrast in both system light and dark modes and retain a non-WebGL discovery path.

## Do's and Don'ts

### Do:
- **Do** use location and service state to drive both the search result and the atlas pin.
- **Do** preserve generous negative space, asymmetric proportions, and the `16px` surface grammar.
- **Do** make demo profiles, illustrative views, and unconnected integrations explicit in the interface.
- **Do** test desktop, `820px` mobile behavior, dark mode, reduced motion, keyboard navigation, and no-WebGL use.

### Don't:
- **Don't** turn the experience into a generic equal-card directory grid or a dense dashboard.
- **Don't** use orange as a general CTA color, scatter blue decoratively, or add ungoverned accent colors.
- **Don't** add glass effects everywhere; translucency belongs to floating search, navigation, labels, and modal context.
- **Don't** depend on hover, animation, 3D interaction, or portrait imagery to communicate essential task state.
- **Don't** invent ratings, verification marks, marketplace totals, testimonials, or production readiness.
