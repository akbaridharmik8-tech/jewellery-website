# Verdane Studio: jewellery marketing website

A Next.js site for a jewellery marketing studio, with a 3D camera hero and a Pantone-matched ivory, champagne and black palette.

When the site opens, a 3D DSLR spins a full 360°. Scrolling, or clicking/tapping the camera, turns it around and flies into its rear screen. The camera disappears and the screen fills the view as a playback display of your work: photos and reels, with arrows, keyboard, swipe and autoplay.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · three.js with React Three Fiber and drei · Motion · Lenis.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start   # production
```

To deploy, push to GitHub and import the repo in [Vercel](https://vercel.com/new). No environment variables are needed.

## Make it yours

Everything client-specific lives in **`lib/site.ts`**:

| What | Where in `lib/site.ts` |
|---|---|
| Brand name, phone, WhatsApp number, email, address, socials | `site` |
| Work shown on the camera screen and in "Selected work" | `works` |
| Services journey (scroll section): name, pitch, key points, result and the work shown beside each service | `services` (`shots` = the images; `layout` = gallery, reels, phone feed, ads or browser) |
| Numbers section | `stats` (**samples: replace with real results**) |
| FAQ questions and answers | `faq` (anything in `{{double braces}}` is a fact only you can supply; it shows highlighted until replaced) |
| "Sample" tags on stats, quotes and results | `site.sampleContent` (set to `false` once every figure and quote is real) |
| Live domain for share previews | `site.url` |
| Process steps | `process` |
| Client quotes | `testimonials` (**placeholders: replace with real quotes**) |

### Placeholder photos (temporary)
Until your own work is uploaded, the portfolio uses free-licence stock photos from [Pexels](https://www.pexels.com/license/), which allows free commercial use. They load straight from `images.pexels.com` and are captioned "Placeholder photo · …".
- If a photo ever fails to load, a calm neutral placeholder is shown instead of a broken image.
- **Replace them before launch.** A portfolio has to show *your* work.

### Adding your own photos and reels
1. Put files in `public/work/`. Use JPG/WebP for photos and MP4 (H.264) for reels; keep reels under about 8 MB.
2. In `works`, set `media` to one of:
   ```ts
   { type: "image", src: "/work/bridal-01.jpg" }
   { type: "video", src: "/work/reel-01.mp4", poster: "/work/reel-01.jpg" }
   ```
   Then delete that item's `credit` line. Photos fill the screen edge to edge on the item's `tone` colour.
3. When no Pexels photos are left, you can remove the `remotePatterns` entry in `next.config.ts`.
4. The **first** item in `works` is also what the 3D camera's LCD shows before the zoom, so pick your strongest shot.

### Before launch
- Replace every `{{placeholder}}` in `lib/site.ts` (FAQ) and in `app/privacy` and `app/terms`, and have the legal pages reviewed.
- Replace sample stats, quotes and results, then set `site.sampleContent = false`.
- Fill in `site.social` (empty links are hidden) and `site.url`.

### Colours, fonts, spacing
The palette is **ivory, champagne and black, matched to Pantone**. The tokens are at the top of `app/globals.css`, and the same values with Pantone codes live in `lib/brand.ts`. The **`/brand`** page shows each colour with its Pantone code, HEX, RGB, role and contrast; it's linked as "Brand colours" in the footer. **`DESIGN.md`** explains the colour theory, type scale and motion rules. Keep all three in sync when changing a colour.

## 3D details

| File | What it is |
|---|---|
| `components/three/DslrCamera.tsx` | The camera, modelled in code (no model file to download). `LCD` sets the screen position the hero flies into. |
| `components/three/HeroCameraScene.tsx` | Intro spin, idle turntable, drag-to-rotate, tap-to-open, and the scroll-scrubbed dolly into the screen. |
| `components/three/StudioLights.tsx` | A studio light rig built from light panels, so there is no HDR download. |

**Accessibility and performance:**
- Scenes stop rendering when they are off-screen.
- Visitors who prefer reduced motion get no spin and no smooth scrolling, and the buttons jump straight to the work.
- If a device has no WebGL, it sees a static poster image instead of a broken page.

### Using a real 3D camera model
The hero supports a real DSLR model (GLB) instead of the built-in coded camera:
1. Put the file in `public/models/`, e.g. `public/models/dslr.glb`. Free CC-BY models from Sketchfab work: download them as **GLB/glTF**.
2. In `lib/site.ts`, set `cameraModel`:
   ```ts
   export const cameraModel = {
     src: "/models/dslr.glb",
     rotation: [0, 0, 0],      // turn the file so the lens faces the viewer
     screenMesh: "screen",     // part of the rear-LCD mesh/material name (optional)
     credit: "Model name by Author (CC-BY)",
     creditUrl: "https://sketchfab.com/...",
   };
   ```
The model is auto-centred and scaled, and its rear screen gets your work image; the zoom flies into that screen. If the file fails to load, the built-in camera is used. The credit appears in the footer, which CC-BY models require.

### Self-hosting work photos
`scripts/fetch-work.mjs` downloads Pexels photos and converts them to WebP in `public/work/`. Run it with `NODE_USE_ENV_PROXY=1` behind a proxy:
```bash
node scripts/fetch-work.mjs review ./review 8398936 5050491    # preview JPEGs to look at first
node scripts/fetch-work.mjs build solitaire=8398936           # public/work/solitaire.webp (+ -card.webp)
```

### Regenerating the share image
`app/opengraph-image.jpg` is a screenshot of the internal page `/studio/og`. After changing the brand name or headline, open that page at 1200×630 and save a new screenshot as `app/opengraph-image.jpg`.

### Regenerating the camera poster
`public/renders/camera-poster.png` is the still image shown when a device has no WebGL. To re-shoot it after changing the camera:

```bash
npx playwright install chromium   # once
npm run dev                        # in one terminal
npm run renders                    # in another; writes public/renders/camera-poster.png
```

## Enquiries
The contact form validates the name and phone number, then opens WhatsApp with a pre-filled brief, so no backend is needed. To send leads to a CRM or Google Sheet instead, replace the `window.open(...)` call in `components/sections/Contact.tsx` with a `fetch()` to your endpoint.
