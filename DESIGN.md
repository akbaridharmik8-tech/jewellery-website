# Design guidelines

These rules keep the site looking deliberate and premium rather than templated. Follow them when you add or change anything.

## 1. Colour: emerald, champagne, garnet

**Theory:** emerald green (hue ≈160°) is the base. It's the classic jewel tone, and it reads as wealth, calm and trust. The accents are its **split complements**: a warm champagne gold (≈38°) and a deep garnet (≈350°). Warm against cool creates contrast without clashing, and gold literally echoes the product.

**Proportion (60 · 30 · 10):**

| Share | Role | Tokens |
|---|---|---|
| 60% | Light neutrals: page background, reading areas | `ivory #F4EFE6`, `bone #E9E1D3` |
| 30% | Emerald darks: hero, 3D, process, contact, footer | `emerald #0C2620`, `emerald-2 #123A31` |
| 10% | Champagne gold: CTAs, labels, key highlights | `gold #CFAE72`, `gold-ink #7E5F2B` (gold for text on light) |
| under 2% | Garnet: a single work backdrop only | `garnet #8E2B3A` |

The neutrals are tinted warm (toward gold) rather than pure white or grey, so every surface belongs to the same family. Dark and light sections alternate down the page to give it rhythm.

**Contrast (WCAG 2.1, all pairs used for text):**

| Text on background | Ratio | Passes |
|---|---|---|
| ink on ivory | 16.2 : 1 | AAA |
| stone on ivory | 6.2 : 1 | AA |
| gold-ink on ivory | 5.2 : 1 | AA |
| ivory on emerald | 14.0 : 1 | AAA |
| gold on emerald | 7.6 : 1 | AAA |
| mist on emerald | 7.8 : 1 | AAA |
| gold on emerald-2 | 5.9 : 1 | AA |

**Rules:**
- Never put `gold` text on a light background. Use `gold-ink` instead.
- Gold is for things that matter (CTAs, labels, one highlighted word). If it's everywhere, it stops meaning anything.
- No gradients for decoration. The only gradients are lighting: the studio key light in the hero, vignettes and floor falloff.

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
- **Easing:** `cubic-bezier(.16, 1, .3, 1)` (`--ease-luxe`). Reveals take about 0.9–1.1s, UI feedback about 0.3s.
- Animate **transform and opacity only**.
- Motion should mean something: headlines rise from behind a mask, the statement fills in as you read, and the process line draws as you progress.
- 3D scenes pause when off-screen. With `prefers-reduced-motion`, the camera doesn't spin, Lenis is off, and Motion skips transform animations.

## 5. 3D
- One light rig (`StudioLights`) is shared by every scene, so metal and stones look consistent everywhere.
- The camera body stays matte black. The **gold ring on the lens** is its only warm note, which ties it to the palette.
- Keep scenes lightweight: `dpr ≤ 1.75`, 256px contact shadows, and instancing for repeated parts (chain links, pavé, dial ribs).

## 6. Things to avoid (they make a site look generic or AI-made)
Glassmorphism cards, purple/blue gradient blobs, emoji icons, centred text everywhere, stock "rocket" illustrations, more than one accent colour per section, and drop shadows on everything.
