// Downloads Pexels photos and turns them into self-hosted WebP files for the portfolio.
//
//   node scripts/fetch-work.mjs review <outDir> <id> [id...]
//     Saves a 1200px JPEG of each photo into <outDir> so they can be looked at first.
//
//   node scripts/fetch-work.mjs build <slug>=<id> [<slug>=<id> ...]
//     Writes public/work/<slug>.webp (longest side max 2000px). next/image
//     generates the smaller sizes from it, so one file per photo is enough.
//
// Behind a proxy, run with NODE_USE_ENV_PROXY=1.
//
// Pexels License: free for commercial use, no attribution required (we still credit).
import sharp from "sharp";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const urls = (id, w) => [
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`,
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.png?auto=compress&cs=tinysrgb&w=${w}`,
];

async function fetchPhoto(id, w) {
  for (const url of urls(id, w)) {
    const res = await fetch(url);
    if (res.ok && (res.headers.get("content-type") ?? "").startsWith("image/")) {
      return Buffer.from(await res.arrayBuffer());
    }
  }
  throw new Error(`photo ${id}: not found`);
}

const [mode, ...args] = process.argv.slice(2);

if (mode === "review") {
  const [outDir, ...ids] = args;
  mkdirSync(outDir, { recursive: true });
  for (const id of ids) {
    try {
      const buf = await fetchPhoto(id, 1200);
      const meta = await sharp(buf).metadata();
      writeFileSync(join(outDir, `${id}.jpg`), await sharp(buf).jpeg({ quality: 80 }).toBuffer());
      console.log(`ok   ${id}  ${meta.width}x${meta.height}`);
    } catch (e) {
      console.log(`fail ${id}  ${e.message}`);
    }
  }
} else if (mode === "build") {
  const out = "public/work";
  mkdirSync(out, { recursive: true });
  for (const pair of args) {
    const [slug, id] = pair.split("=");
    const buf = await fetchPhoto(id, 2000);
    await sharp(buf).resize({ width: 2000, height: 2000, fit: "inside", withoutEnlargement: true }).webp({ quality: 80 }).toFile(join(out, `${slug}.webp`));
    console.log(`built ${slug} (pexels ${id})`);
  }
} else {
  console.log("usage: fetch-work.mjs review <outDir> <ids...> | build <slug=id ...>");
  process.exit(1);
}
