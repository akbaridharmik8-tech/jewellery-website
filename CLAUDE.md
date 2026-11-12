# Project notes for Claude

@AGENTS.md

## Design rules
Design work follows `.claude/skills/landing-page-design` (MIT, from elayadesign/ai-design-skills) and `DESIGN.md`.

The owner chose to apply the skill **selectively**. These brand decisions override the skill and must be kept:
- **Fonts:** Instrument Serif for display headlines and big numbers, with an italic accent word allowed per headline. Manrope is used for all other text.
- **Colour:** the Pantone-matched ivory, champagne and black palette in `DESIGN.md` and `lib/brand.ts`, including Black C (#2D2926) and Neutral Black C (#222223) for dark sections, in place of the skill's dark background list. Keep tokens, `lib/brand.ts` and the `/brand` page in sync.
- **All-ivory landing page:** the hero's ivory and paper grain cover the whole page, with no dark sections and no background grid. The only gradient is the metal of the pendant frame.
- **No 3D.** The owner removed the 3D jewellery and the 3D camera. The hero is a real pendant photo inside a turning ring of work photos, and all work is shown as photography.
- **Display sizes:** may use fluid `clamp()` sizes. Body and UI text must land on the Tailwind type scale.

Everything else in the skill applies, including copy, spacing, motion curve, states, ship requirements and "never invent facts". Content in `lib/site.ts` flagged as sample stays marked until the owner supplies real figures.
