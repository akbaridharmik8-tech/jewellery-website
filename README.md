# Verdane Studio: jewellery marketing website

A Next.js site for a jewellery marketing studio, built around 3D motion.

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
| Services list, marquee and hover previews | `services` |
| Numbers section | `stats` (**placeholders: replace with real results**) |
| Process steps | `process` |
| Client quotes | `testimonials` (**placeholders: replace with real quotes**) |

### Adding your own photos and reels
1. Put files in `public/work/`. Use JPG/WebP for photos and MP4 (H.264) for reels; keep reels under about 8 MB.
2. In `works`, set `media` to one of:
   ```ts
   { type: "image", src: "/work/bridal-01.jpg" }
   { type: "video", src: "/work/reel-01.mp4", poster: "/work/reel-01.jpg" }
   ```
   Your own photos fill the screen edge to edge. The placeholder renders in `/renders/` are shown centred on their `tone` colour instead.
3. The **first** item in `works` is also what the 3D camera's LCD shows before the zoom, so pick your strongest shot.

### Colours, fonts, spacing
The design tokens are at the top of `app/globals.css`. **`DESIGN.md`** explains the palette, contrast checks, type scale and motion rules. Read it before changing colours.

## 3D details

| File | What it is |
|---|---|
| `components/three/DslrCamera.tsx` | The camera, modelled in code (no model file to download). `LCD` sets the screen position the hero flies into. |
| `components/three/HeroCameraScene.tsx` | Intro spin, idle turntable, drag-to-rotate, tap-to-open, and the scroll-scrubbed dolly into the screen. |
| `components/three/jewels.tsx` | Procedural ring, necklace, earrings and bracelet with brilliant-cut stones. |
| `components/three/StudioLights.tsx` | A studio light rig built from light panels, so there is no HDR download. |
| `components/three/ConfiguratorScene.tsx` | The "3D product viewer" demo: metal and stone swap live. |

**Accessibility and performance:**
- Scenes stop rendering when they are off-screen.
- Visitors who prefer reduced motion get no spin and no smooth scrolling, and the buttons jump straight to the work.
- If a device has no WebGL, it sees a static poster image instead of a broken page.

### Regenerating the placeholder renders
The PNGs in `public/renders/` are rendered from the same 3D models. To re-shoot them after changing a model or the `renders` list:

```bash
npx playwright install chromium   # once
npm run dev                        # in one terminal
npm run renders                    # in another; writes public/renders/*.png
```

## Enquiries
The contact form validates the name and phone number, then opens WhatsApp with a pre-filled brief, so no backend is needed. To send leads to a CRM or Google Sheet instead, replace the `window.open(...)` call in `components/sections/Contact.tsx` with a `fetch()` to your endpoint.
