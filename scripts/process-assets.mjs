/**
 * process-assets.mjs
 * Generates responsive hero images, favicons, og:image, and icon-512.
 * Run: node scripts/process-assets.mjs
 */

import sharp from 'sharp';
import { mkdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'public', 'brand');
const OUT = path.join(ROOT, 'public', 'brand', 'gen');

// ── helpers ──────────────────────────────────────────────────────────────────

async function ensureDir(dir) {
  await mkdir(dir, { recursive: true });
}

async function kb(filePath) {
  try {
    const s = await stat(filePath);
    return (s.size / 1024).toFixed(1);
  } catch {
    return '?';
  }
}

function roundedSquareSvg(size, radius, fillColor) {
  const r = Math.round(size * radius);
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">` +
      `<rect width="${size}" height="${size}" rx="${r}" ry="${r}" fill="${fillColor}"/>` +
      `</svg>`
  );
}

// ── Step 1: ensure output dir ─────────────────────────────────────────────────

await ensureDir(OUT);
console.log(`\nOutput dir: ${OUT}\n`);

const results = [];

// ── Step 2: Hero images ───────────────────────────────────────────────────────

const heroSrc = path.join(SRC, 'alice_header.png');
const heroWidths = [800, 1200, 1600];

for (const w of heroWidths) {
  // WebP
  const webpOut = path.join(OUT, `alice-hero-${w}.webp`);
  await sharp(heroSrc)
    .resize({ width: w, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(webpOut);
  results.push({ file: `brand/gen/alice-hero-${w}.webp`, kb: await kb(webpOut) });

  // AVIF (degrade gracefully if encoder fails)
  const avifOut = path.join(OUT, `alice-hero-${w}.avif`);
  try {
    await sharp(heroSrc)
      .resize({ width: w, fit: 'inside', withoutEnlargement: true })
      .avif({ quality: 55 })
      .toFile(avifOut);
    results.push({ file: `brand/gen/alice-hero-${w}.avif`, kb: await kb(avifOut) });
  } catch (err) {
    console.warn(`  [WARN] AVIF ${w}px skipped: ${err.message}`);
  }
}

console.log('Hero images done.');

// ── Step 3: Icons ─────────────────────────────────────────────────────────────

const iconSrc = path.join(SRC, 'alice_logo_light.webp');
const iconSizes = [
  { size: 32, name: 'favicon-32.png' },
  { size: 180, name: 'favicon-180.png' },
  { size: 512, name: 'icon-512.png' },
];

for (const { size, name } of iconSizes) {
  const plateRadius = 0.22; // ~22% rounded corners
  const iconScale = 0.70;   // icon fills 70% of plate

  // Build rounded-square plate as SVG buffer
  const plateSvg = roundedSquareSvg(size, plateRadius, '#161616');

  // Resize the A-mark to 70% of the plate
  const markSize = Math.round(size * iconScale);
  const markBuf = await sharp(iconSrc)
    .resize({ width: markSize, height: markSize, fit: 'inside', withoutEnlargement: false })
    .toBuffer();

  // Get actual resized dimensions (may be smaller due to aspect ratio)
  const markMeta = await sharp(markBuf).metadata();
  const left = Math.round((size - markMeta.width) / 2);
  const top = Math.round((size - markMeta.height) / 2);

  const outPath = path.join(OUT, name);
  await sharp(plateSvg)
    .composite([{ input: markBuf, left, top }])
    .png()
    .toFile(outPath);

  results.push({ file: `brand/gen/${name}`, kb: await kb(outPath) });
}

console.log('Icons done.');

// ── Step 4: og.png 1200×630 ───────────────────────────────────────────────────

const OG_W = 1200;
const OG_H = 630;
const CREAM = '#E8DCC8';
const DARK  = '#161616';

// Base: solid dark + diagonal cream line SVG
// Diagonal from (720, -20) to (480, 650) — 4px wide
const diagonalSvg = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${OG_W}" height="${OG_H}">` +
    `<rect width="${OG_W}" height="${OG_H}" fill="${DARK}"/>` +
    `<line x1="720" y1="-20" x2="480" y2="650" stroke="${CREAM}" stroke-width="4" stroke-linecap="round"/>` +
  `</svg>`
);

// alice_text_logo_light → resize to 420px wide, place left half vertically centered
// Use left half center: x ∈ [0, 600], center at (300, 315)
const LOGO_W = 420;

const aliceLogoSrc = path.join(SRC, 'alice_text_logo_light.webp');
const continuumLogoSrc = path.join(SRC, 'continuum_text_logo_light.webp');

const aliceBuf = await sharp(aliceLogoSrc)
  .resize({ width: LOGO_W, fit: 'inside', withoutEnlargement: false })
  .toBuffer();
const aliceMeta = await sharp(aliceBuf).metadata();

const continuumBuf = await sharp(continuumLogoSrc)
  .resize({ width: LOGO_W, fit: 'inside', withoutEnlargement: false })
  .toBuffer();
const continuumMeta = await sharp(continuumBuf).metadata();

// Position: alice in left half, continuum in right half
// Left half: x in [0..600]. Diagonal at x=600 is approximately y=89, at x=0 is y=375
// Keep alice entirely left of x=475 (safe margin from diagonal)
// alice: center it at x=230, y=315
const aliceLeft = Math.round(230 - aliceMeta.width / 2);
const aliceTop  = Math.round(315 - aliceMeta.height / 2);

// Right half: x in [600..1200]. Diagonal at x=720 is y=-20 (above canvas)
// Keep continuum right of x=725 (safe margin)
// continuum: center at x=950, y=315
const continuumLeft = Math.round(950 - continuumMeta.width / 2);
const continuumTop  = Math.round(315 - continuumMeta.height / 2);

const ogOut = path.join(OUT, 'og.png');
await sharp(diagonalSvg)
  .composite([
    { input: aliceBuf,     left: Math.max(0, aliceLeft),     top: Math.max(0, aliceTop) },
    { input: continuumBuf, left: Math.max(0, continuumLeft), top: Math.max(0, continuumTop) },
  ])
  .png({ compressionLevel: 9 })
  .toFile(ogOut);

results.push({ file: 'brand/gen/og.png', kb: await kb(ogOut) });
console.log('og.png done.');

// ── Summary table ─────────────────────────────────────────────────────────────

console.log('\n┌─────────────────────────────────────────────────────┬──────────┐');
console.log('│ File                                                 │   KB     │');
console.log('├─────────────────────────────────────────────────────┼──────────┤');
for (const r of results) {
  const filePad = r.file.padEnd(52);
  const kbPad   = r.kb.padStart(8);
  console.log(`│ ${filePad} │ ${kbPad} │`);
}
console.log('└─────────────────────────────────────────────────────┴──────────┘');

// Sanity check
const hero1600avif = results.find(r => r.file.includes('alice-hero-1600.avif'));
const ogResult     = results.find(r => r.file.includes('og.png'));

if (hero1600avif && parseFloat(hero1600avif.kb) > 150) {
  console.warn(`\n[WARN] alice-hero-1600.avif is ${hero1600avif.kb} KB (target < 150 KB)`);
}
if (ogResult && parseFloat(ogResult.kb) > 300) {
  console.warn(`\n[WARN] og.png is ${ogResult.kb} KB (target < 300 KB)`);
}

console.log('\nAll assets generated successfully.\n');
