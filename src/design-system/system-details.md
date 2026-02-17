# EV Design System Details

This file captures the visual rules behind the EV app, not just the raw components.

## 1. Color logic

### Base surfaces

- Main background: `#f0f0e8`
- Elevated soft surface: `#e8e8e0`
- Strong dark surface: `#1a1a1a`
- White card insert: `#ffffff`

### Text

- Primary text: `#1a1a1a`
- Muted text: `#888888`
- Inverse text on dark: `#f0f0e8`

### Accent set

- Primary accent: `#2d5a2d`
- Hover accent: `#3a6a3a`
- Lifted accent: `#7cb87c`
- Destructive: `#dc2626`
- Warning: `#ca8a04`

### Practical combinations that are used repeatedly

- Cream background + black text + black border
- Black surface + cream text + black border
- Green fill + cream text + black border
- Cream surface + green text for emphasis
- Soft cream panel + muted gray text for support copy

## 2. Border language

- Default border weight is `2px`.
- Borders are high-contrast and structural, not decorative.
- Most components use black or theme-border for the outer frame.
- Inputs, cards, dialogs, badges, and nav sections all keep the same sharp edge language.
- Rounded corners are intentionally avoided.

## 3. Shadow language

- Use hard offset shadows, usually `4px`, `8px`, `10px`, or `12px`.
- Shadows should look printed / poster-like, not soft or floating.
- Hover states often reduce the shadow and move the element by the same offset.

Examples:

- Rest: `shadow-[8px_8px_0px_0px_var(--shadow-color)]`
- Hover: `translate-x-[2px] translate-y-[2px] shadow-[6px_6px_0px_0px_var(--shadow-color)]`

## 4. Typography

- Default body font: `Geist Mono`
- Hero serif accent is available through `Instrument Serif`, but most EV surfaces are mono-first.
- Headings are usually:
  - uppercase
  - black or extra-bold
  - tight tracking
- Labels and microcopy often use uppercase with wide letter spacing.

## 5. Interaction states

### Buttons

- Buttons always feel physical.
- Hover is not subtle:
  - background changes
  - card or button shifts by `2px`
  - shadow shortens accordingly
- Active state keeps the same physical press language.

### Inputs

- Focus state is green-accented.
- Instead of default browser glow, use:
  - border color shift to accent
  - hard accent shadow

### Links

- Text links are usually plain with underline-on-hover.
- Navigation links stay minimal unless they are CTA links.

## 6. Navbar patterns

There are two main navbar/header styles in EV.

### Marketing navbar

Used on the public site.

Rules:

- Fixed to top
- Cream background
- Black bottom border
- Simple brand mark on left
- Text links on right
- CTA rendered like a bordered button

Key classes:

- `fixed top-0 z-50`
- `border-b-2 border-[#1a1a1a]`
- `bg-[#f0f0e8]`
- `px-6 py-4`

### Dashboard header

Used inside authenticated admin pages.

Rules:

- Grid layout, not plain flex, because breadcrumb and utility area need stable alignment
- Brand + breadcrumb on the left
- Actions grouped on the right
- User controls separated with a subtle left divider
- Height is compact on mobile and expands slightly on desktop

Key classes:

- `grid grid-cols-[1fr_auto] sm:grid-cols-[auto_1fr_auto]`
- `border-b-2 border-[#1a1a1a]`
- `bg-[#f0f0e8]`
- `h-11 sm:h-14`

### Host navbar

Used on station screens.

Rules:

- Same visual family as the dashboard header
- Brand + event name on left
- Station identity on right
- Theme toggle included
- Host identity shown inside a bordered square icon block

## 7. Motion and animation

The app motion style is simple, fast, and physical.

### Timing

- Most transitions: `150ms` to `200ms`
- Dialog / dropdown entrance: short fade + zoom or directional slide
- Confetti or celebratory effects can go longer, around `900ms`

### Motion principles

- Prefer translation over large scaling
- Prefer stateful shadow changes over blur-heavy animation
- UI should feel responsive and direct, not floaty
- Decorative motion is used sparingly and mostly around reward moments

### Reused motion patterns

- Hover press:
  - `translate-x-[2px]`
  - `translate-y-[2px]`
- Dialog open:
  - fade-in
  - zoom-in around `95 -> 100`
- Dropdown open:
  - fade + slight directional slide
- Tabs:
  - mostly color-state changes, minimal motion

## 8. Component pairing rules

- Put cards on cream or soft-cream backgrounds
- Put black sections between lighter sections to create rhythm
- Use green for emphasis, not for every container
- Use warning gold for prize/highlight accents, not as the main brand tone
- If a section already has a bold background, keep interior cards lighter for contrast

## 9. Reuse checklist

When recreating this system elsewhere, check:

1. Are borders sharp and consistently `2px`?
2. Are shadows hard and offset, not blurry?
3. Are headings uppercase and high-contrast?
4. Are green accents being used deliberately instead of everywhere?
5. Do hover states move physically and shorten the shadow?
6. Does the navbar keep the same left-brand / right-utility balance?
