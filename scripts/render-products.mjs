// Exports the DSLR poster used when a device has no WebGL: public/renders/camera-poster.png
// Usage: start the app (npm run dev), then: npm run renders [baseUrl] [outDir]
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const base = process.argv[2] ?? "http://localhost:3000";
const out = process.argv[3] ?? "public/renders";
mkdirSync(out, { recursive: true });

// Set PW_CHROMIUM to a Chromium binary if Playwright's own browser isn't installed.
const browser = await chromium.launch({
  executablePath: process.env.PW_CHROMIUM || undefined,
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
});
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
await page.goto(`${base}/studio?angle=-0.55`);
await page.waitForSelector("body[data-ready=true]", { timeout: 60000 });
await page.waitForTimeout(1500);
await page.screenshot({ path: `${out}/camera-poster.png`, omitBackground: true });
console.log("rendered camera-poster");
await browser.close();
