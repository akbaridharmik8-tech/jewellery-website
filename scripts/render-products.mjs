// Exports a transparent PNG for every entry in `renders` (lib/site.ts), plus the
// DSLR poster used when WebGL is unavailable.
// Usage: start the app (npm run dev), then: npm run renders [baseUrl] [outDir]
import { chromium } from "playwright";
import { readFileSync, mkdirSync } from "node:fs";

const base = process.argv[2] ?? "http://localhost:3000";
const out = process.argv[3] ?? "public/renders";
mkdirSync(out, { recursive: true });

// Pull render rows straight out of lib/site.ts so there is one source of truth.
const src = readFileSync(new URL("../lib/site.ts", import.meta.url), "utf8");
const rows = [...src.matchAll(/slug: "([^"]+)".*?kind: "([^"]+)", metal: "([^"]+)", stone: "([^"]+)"/g)].map(
  ([, slug, kind, metal, stone]) => ({ slug, kind, metal, stone }),
);

const browser = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
const page = await browser.newPage({ viewport: { width: 900, height: 900 }, deviceScaleFactor: 1 });
for (const r of rows) {
  await page.goto(`${base}/studio?kind=${r.kind}&metal=${r.metal}&stone=${r.stone}`);
  await page.waitForSelector("body[data-ready=true]", { timeout: 60000 });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${out}/${r.slug}.png`, omitBackground: true });
  console.log("rendered", r.slug);
}
await page.setViewportSize({ width: 1400, height: 900 });
await page.goto(`${base}/studio?model=camera&angle=-0.55`);
await page.waitForSelector("body[data-ready=true]", { timeout: 60000 });
await page.waitForTimeout(1500);
await page.screenshot({ path: `${out}/camera-poster.png`, omitBackground: true });
console.log("rendered camera-poster");
await browser.close();
