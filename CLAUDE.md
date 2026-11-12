# Project notes for Claude

@AGENTS.md

## Design rules
Design work follows `.claude/skills/landing-page-design` (MIT, from elayadesign/ai-design-skills) and `DESIGN.md`.

The owner chose to apply the skill **selectively**. These brand decisions override the skill and must be kept:
- **Fonts:** Instrument Serif for display headlines and big numbers, with an italic accent word allowed per headline. Manrope is used for all other text.
- **Colour:** the Pantone-matched ivory, champagne and black palette in `DESIGN.md` and `lib/brand.ts`, including Black C (#2D2926) and Neutral Black C (#222223) for dark sections, in place of the skill's dark background list. Keep tokens, `lib/brand.ts` and the `/brand` page in sync.
- **Lighting gradients:** used to suggest light in the hero and the services journey: a champagne key light over onyx, vignettes and photo scrims. Flat colour everywhere else.
- **No 3D jewellery.** The owner removed it. The DSLR camera in the hero is the only 3D element, and work is shown as photography.
- **Display sizes:** may use fluid `clamp()` sizes. Body and UI text must land on the Tailwind type scale.

Everything else in the skill applies, including copy, spacing, motion curve, states, ship requirements and "never invent facts". Content in `lib/site.ts` flagged as sample stays marked until the owner supplies real figures.
