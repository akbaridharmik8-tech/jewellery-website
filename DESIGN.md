# Design guidelines

The site follows the **landing-page-design** skill (`.claude/skills/landing-page-design`, MIT, from elayadesign/ai-design-skills), applied selectively. Its rules for copy, type scale, spacing, motion curve, states, navigation and ship requirements apply. The brand exceptions below (serif display font, Pantone-matched palette, lighting gradients) are deliberate owner decisions, and `CLAUDE.md` lists them.

These rules keep the site looking deliberate and premium rather than templated. Follow them when you add or change anything.

## 1. Colour: ivory, champagne and black (Pantone-matched)

**Theory:** this is a near-achromatic palette with a single warm metallic accent, the way fine jewellery is shown in a vitrine. The neutrals stay quiet so the photography carries the colour: gold, stones and skin tones never compete with a coloured background. Every neutral is tinted warm, toward champagne, so the surfaces read as one family. Champagne is the only hue, and it echoes the product itself.

**Palette.** The Pantone code is the reference. HEX values are screen approximations (Pantone publishes no official HEX), so check print work against a physical Pantone guide. The same data drives the site tokens in `app/globals.css`, `lib/brand.ts` and the `/brand` page.

| Token | Name | Pantone | HEX (screen) | Role |
|---|---|---|---|---|
| `ivory` | Ivory | 11-0602 TCX Snow White | #F2F0EB | Page background |
| `cream` | Cream | 11-0507 TCX Winter White | #F5ECD2 | Soft fills behind photos and small surfaces |
| `onyx` | Onyx | Black C | #2D2926 | Dark surfaces: work viewer, device mockups |
| `ink` | Ink | Neutral Black C | #222223 | All text on ivory, primary buttons |
| `champagne` | Champagne | 7502 C | #CEB888 | Accent: CTAs, labels, one highlighted word |
| `champagne-deep` | Deep champagne | 7503 C | #A89968 | Decorative detail; text on dark only |
| `taupe` | Taupe | Warm Gray 11 C | #6E6259 | Secondary text and labels on light |
| `greige` | Greige | Warm Gray 2 C | #CBC4BC | Secondary text on dark |

**Proportion (60 · 30 · 10):** 60% ivory and cream, 30% ink and onyx, 10% champagne. The whole landing page sits on ivory with a faint paper grain, like the hero. Ink carries the type and primary buttons, and thin hairlines (`line-light`) separate the sections instead of colour blocks. Onyx is kept for dark surfaces such as the work viewer.

**Contrast (WCAG 2.1, every pair used for text):**

| Text on background | Ratio | Passes |
|---|---|---|
| ink on ivory | 14.0 : 1 | AAA |
| taupe on ivory | 5.2 : 1 | AA |
| ivory on onyx | 12.7 : 1 | AAA |
| champagne on onyx | 7.4 : 1 | AAA |
| greige on onyx | 8.3 : 1 | AAA |
| deep champagne on onyx | 5.1 : 1 | AA |
| onyx on champagne (buttons) | 7.4 : 1 | AAA |

**Rules:**
- Never put `champagne` or `champagne-deep` text on a light background (2.5 : 1). Use `taupe` or `ink` instead.
- Champagne is for things that matter: CTAs, labels and one highlighted word. If it's everywhere, it stops meaning anything.
- No background gradients and no background grids. The page is flat ivory with a faint paper grain. The only gradient is the metal of the pendant frame.
- Form errors use a deep red (`#9E2F3B`, 6.3 : 1 on ivory). This is a functional colour, not part of the brand palette.
- Focus rings are ink (2px), clearly visible on ivory.

## 2. Typography
- **Display:** Instrument Serif, used for headlines, numbers and quotes. Tight leading (0.92) and slight negative tracking, set large (`clamp()` up to about 9.5rem). Italic is reserved for one emphasised word per headline.
- **Text/UI:** Manrope. Body text is 15–17px with 1.6 line-height, and line length stays under about 65 characters.
- **Labels:** 11px uppercase with 0.24em tracking, opening each section with a number (`01 — The studio`).
- **Scale:** headlines use `clamp()` so they grow smoothly from 375px to 1440px with no breakpoint jumps.

## 3. Layout and spacing
- A 12-column grid with asymmetric splits (3/9, 5/7, 7/4). Avoid centring everything.
- Section padding is `clamp(88px, 11vw, 160px)`. Gutters are `clamp(16px, 4vw, 56px)`.
- Use hairline rules (`line-light`/`line-dark`) instead of boxes and shadows. Corners are sharp (2px), apart from pill buttons.
- Touch targets are at least 44 × 44px, and there's no horizontal scroll at 375px.

## 4. Motion
- **Easing:** `cubic-bezier(0.22, 1, 0.36, 1)` (`--ease-luxe`, also Tailwind's default transition curve). Reveals rise 32px over 0.7s; hover colour changes take 300ms, never under 200ms.
- Animate **transform and opacity only**.
- Motion should mean something: headlines rise from behind a mask, the statement fills in as you read, and the process line draws as you progress.
- With `prefers-reduced-motion`, the hero ring stays still, Lenis is off, and Motion skips transform animations.

## 5. Hero
- The hero is a light ivory "atelier" with a faint paper grain. A real pendant photo sits in a round champagne frame and hangs from a beaded chain. Eight work photos turn slowly around it.
- Each tile's frame faces the centre while the photo inside stays upright. The ring takes about 90 seconds per turn, and scrolling adds a quarter turn. Hover or focus pauses it.
- There is no 3D on the site. 3D jewellery and the 3D camera were removed at the owner's request, and the work is shown as real photography.
- The layout was inspired by the "Lumière" concept on getlayers.ai. It is an original implementation in this site's palette and copy, not a copy of that paid template.

## 6. Things to avoid (they make a site look generic or AI-made)
Glassmorphism cards, purple/blue gradient blobs, emoji icons, centred text everywhere, stock "rocket" illustrations, more than one accent colour per section, and drop shadows on everything.
