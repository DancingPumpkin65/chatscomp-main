# EV Design System

This folder packages the main UI system used in the EV app so it can be copied into another project.

## What is included

- `design-tokens.css`
  Core colors, fonts, theme variables, focus rules, and light/dark mode tokens.
- `utils.ts`
  Shared `cn()` helper based on `clsx` and `tailwind-merge`.
- `components/`
  Copy-ready React primitives:
  - `Button.tsx`
  - `Card.tsx`
  - `Input.tsx`
  - `Badge.tsx`
  - `ThemeIconButton.tsx`
  - `MarketingNavbar.tsx`
  - `DashboardNavbar.tsx`
- `theme/ThemeProvider.tsx`
  Light/dark mode provider using `data-theme`.
- `brand-assets.md`
  Paths and notes for brand visuals already used in this repo.
- `system-details.md`
  Detailed notes on colors, borders, combinations, navbar construction, and motion.
- `index.ts`
  Simple export barrel.

## Core style direction

- Mood: brutalist, mono-first, sharp edges, bold contrast.
- Shape language: no rounded corners by default.
- Borders: `2px` dark border on almost everything interactive.
- Shadows: hard offset shadows, not blur-heavy shadows.
- Typography: Geist Mono by default, uppercase labels, black-heavy headings.
- Accent: forest green.
- Navigation: fixed or sticky cream bars with sharp separators and utility actions grouped on the right.
- Motion: short `150ms` to `200ms` transitions, translate + hard-shadow changes instead of soft scaling.

## Color tokens

- Background: `#f0f0e8`
- Foreground: `#1a1a1a`
- Surface alt: `#e8e8e0`
- Accent: `#2d5a2d`
- Accent hover: `#3a6a3a`
- Accent light: `#7cb87c`
- Danger: `#dc2626`
- Warning: `#ca8a04`

## Install requirements

These reusable files expect:

- `react`
- `class-variance-authority`
- `clsx`
- `lucide-react`
- `tailwind-merge`
- `tailwindcss`

## Typical usage

1. Copy this folder into your target app.
2. Import `design-tokens.css` once at your app root.
3. Wrap the app with `ThemeProvider`.
4. Import primitives from `index.ts`.

## Notes

- The token CSS here is focused on the reusable app shell and UI primitives.
- Video-player-specific CSS from the main repo is intentionally left out.
- If you want the exact live brand visuals too, use the asset references in `brand-assets.md`.
