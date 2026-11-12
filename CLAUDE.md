# Project notes for Claude

@AGENTS.md

## Design rules
Design work follows `.claude/skills/landing-page-design` (MIT, from elayadesign/ai-design-skills) and `DESIGN.md`.

The owner chose to apply the skill **selectively**. These brand decisions override the skill and must be kept:
- **Fonts:** Instrument Serif for display headlines and big numbers, with an italic accent word allowed per headline. Manrope is used for all other text.
- **Colour:** the emerald, champagne gold and garnet palette from `DESIGN.md`, not the skill's neutral dark backgrounds.
- **Lighting gradients:** used to suggest light in the 3D/studio scenes: the hero key light, vignettes, the journey horizon glow and photo scrims. Flat colour everywhere else.
- **Display sizes:** may use fluid `clamp()` sizes. Body and UI text must land on the Tailwind type scale.

Everything else in the skill applies, including copy, spacing, motion curve, states, ship requirements and "never invent facts". Content in `lib/site.ts` flagged as sample stays marked until the owner supplies real figures.
