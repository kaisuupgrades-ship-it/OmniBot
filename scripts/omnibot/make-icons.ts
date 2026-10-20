/**
 * Draws the placeholder OmniBot mark and writes every app and web icon from it: a rounded square
 * with two ring eyes. The shape comes from `packages/brand/src/app-logo-shape.ts`, so the icons
 * match the logo that the app draws as SVG.
 *
 *   bun scripts/omnibot/make-icons.ts
 *
 * To use your own artwork instead, replace the files that this script writes (see `main`).
 * The script needs no image library: it draws the shapes itself and writes PNG with `node:zlib`.
 */
import { mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { crc32, deflateSync } from "node:zlib";
import {
  APP_LOGO_COLOR_HEX,
  APP_LOGO_COLORS,
  APP_LOGO_EYE_HEX,
  DEFAULT_APP_LOGO_COLOR,
  DEFAULT_APP_LOGO_EYE_HEX,
} from "@omnibot/contracts/app-logo-color";
import {
  APP_LOGO_CORNER,
  APP_LOGO_EYE_CENTERS,
  APP_LOGO_EYE_RADIUS,
  APP_LOGO_EYE_STROKE,
  APP_LOGO_SIZE,
} from "../../packages/brand/src/app-logo-shape";

type Rgb = readonly [number, number, number];

const ROOT = resolve(import.meta.dirname, "../..");
const BUILD = join(ROOT, "build");

/** The build colors of the dev and preview apps, `--omnibot-logo-dev` and `--omnibot-logo-preview`. */
const DEV_HEX = "#e3b866";
const PREVIEW_HEX = "#61c985";

/** macOS draws app icons inside a safe area: the mark fills 80.5% of the canvas. */
const MACOS_SAFE_AREA = 1288 / 1600;

function hexToRgb(hex: string): Rgb {
  const value = Number.parseInt(hex.slice(1), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

/** Draws the mark on a square canvas of `size` pixels. `scale` is the part of the canvas it fills. */
function drawMark(size: number, body: Rgb, eye: Rgb, scale = 1): Buffer {
  const pixels = Buffer.alloc(size * size * 4);
  const markSize = size * scale;
  const offset = (size - markSize) / 2;
  const unit = markSize / APP_LOGO_SIZE;
  const corner = APP_LOGO_CORNER * unit;
  const half = markSize / 2;
  const centerX = offset + half;
  const centerY = offset + half;
  const eyes = APP_LOGO_EYE_CENTERS.map(([x, y]) => [offset + x * unit, offset + y * unit] as const);
  const radius = APP_LOGO_EYE_RADIUS * unit;
  const halfStroke = (APP_LOGO_EYE_STROKE * unit) / 2;
  // More samples for small icons, where each pixel matters.
  const samples = size <= 64 ? 8 : size <= 256 ? 6 : 4;
  const step = 1 / samples;
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      let bodyHits = 0;
      let eyeHits = 0;
      for (let sy = 0; sy < samples; sy += 1) {
        for (let sx = 0; sx < samples; sx += 1) {
          const px = x + (sx + 0.5) * step;
          const py = y + (sy + 0.5) * step;
          // Signed distance to the rounded square.
          const qx = Math.abs(px - centerX) - (half - corner);
          const qy = Math.abs(py - centerY) - (half - corner);
          const outside = Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - corner;
          if (outside > 0) continue;
          bodyHits += 1;
          for (const [ex, ey] of eyes) {
            if (Math.abs(Math.hypot(px - ex, py - ey) - radius) <= halfStroke) {
              eyeHits += 1;
              break;
            }
          }
        }
      }
      if (bodyHits === 0) continue;
      const total = samples * samples;
      const alpha = bodyHits / total;
      const eyeShare = eyeHits / bodyHits;
      const index = (y * size + x) * 4;
      for (let channel = 0; channel < 3; channel += 1) {
        const value = (body[channel] ?? 0) * (1 - eyeShare) + (eye[channel] ?? 0) * eyeShare;
        pixels[index + channel] = Math.round(value);
      }
      pixels[index + 3] = Math.round(alpha * 255);
    }
  }
  return pixels;
}

const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

function pngChunk(type: string, body: Buffer): Buffer {
  const chunk = Buffer.alloc(12 + body.length);
  chunk.writeUInt32BE(body.length, 0);
  chunk.write(type, 4, "latin1");
  body.copy(chunk, 8);
  chunk.writeUInt32BE(crc32(chunk.subarray(4, 8 + body.length)), 8 + body.length);
  return chunk;
}

/** An 8-bit RGBA PNG with no interlace. Each row uses the "up" filter. */
function encodePng(size: number, pixels: Buffer): Buffer {
  const stride = size * 4;
  const rows = Buffer.alloc((stride + 1) * size);
  for (let y = 0; y < size; y += 1) {
    rows[y * (stride + 1)] = 2;
    for (let x = 0; x < stride; x += 1) {
      const up = y > 0 ? (pixels[(y - 1) * stride + x] ?? 0) : 0;
      rows[y * (stride + 1) + 1 + x] = ((pixels[y * stride + x] ?? 0) - up) & 255;
    }
  }
  const header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0);
  header.writeUInt32BE(size, 4);
  header.set([8, 6, 0, 0, 0], 8);
  return Buffer.concat([
    PNG_SIGNATURE,
    pngChunk("IHDR", header),
    pngChunk("IDAT", deflateSync(rows, { level: 9 })),
    pngChunk("IEND", Buffer.alloc(0)),
  ]);
}

function png(size: number, body: Rgb, eye: Rgb, scale = 1): Buffer {
  return encodePng(size, drawMark(size, body, eye, scale));
}

/** A Windows icon with one PNG image for each size. */
function encodeIco(images: readonly { size: number; data: Buffer }[]): Buffer {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  const entries: Buffer[] = [];
  let offset = 6 + 16 * images.length;
  for (const image of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(image.size >= 256 ? 0 : image.size, 0);
    entry.writeUInt8(image.size >= 256 ? 0 : image.size, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(image.data.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += image.data.length;
    entries.push(entry);
  }
  return Buffer.concat([header, ...entries, ...images.map((image) => image.data)]);
}

/** A macOS icon with PNG images: ic07 128, ic08 256, ic09 512, ic10 1024 pixels. */
function encodeIcns(images: readonly { type: string; data: Buffer }[]): Buffer {
  const chunks = images.map((image) => {
    const chunk = Buffer.alloc(8 + image.data.length);
    chunk.write(image.type, 0, "latin1");
    chunk.writeUInt32BE(chunk.length, 4);
    image.data.copy(chunk, 8);
    return chunk;
  });
  const header = Buffer.alloc(8);
  header.write("icns", 0, "latin1");
  header.writeUInt32BE(8 + chunks.reduce((sum, chunk) => sum + chunk.length, 0), 4);
  return Buffer.concat([header, ...chunks]);
}

function icoFor(body: Rgb, eye: Rgb, sizes: readonly number[]): Buffer {
  return encodeIco(sizes.map((size) => ({ size, data: png(size, body, eye) })));
}

function svgFor(body: string, eye: string): string {
  const eyes = APP_LOGO_EYE_CENTERS.map(
    ([x, y]) =>
      `  <circle cx="${x}" cy="${y}" r="${APP_LOGO_EYE_RADIUS}" fill="none" stroke="${eye}" stroke-width="${APP_LOGO_EYE_STROKE}"/>`,
  ).join("\n");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 ${APP_LOGO_SIZE} ${APP_LOGO_SIZE}">
  <title>OmniBot</title>
  <rect width="${APP_LOGO_SIZE}" height="${APP_LOGO_SIZE}" rx="${APP_LOGO_CORNER}" fill="${body}"/>
${eyes}
</svg>
`;
}

function write(path: string, data: Buffer | string): void {
  writeFileSync(join(ROOT, path), data);
  // The script does not use the repository logger: the rebrand renames its exports.
  process.stdout.write(`Wrote ${path}\n`);
}

function main(): void {
  const eye = hexToRgb(DEFAULT_APP_LOGO_EYE_HEX);
  const variants = {
    production: hexToRgb(APP_LOGO_COLOR_HEX[DEFAULT_APP_LOGO_COLOR]),
    dev: hexToRgb(DEV_HEX),
    preview: hexToRgb(PREVIEW_HEX),
  } as const;
  const icoSizes = [16, 24, 32, 48, 64, 128, 256] as const;

  for (const [variant, body] of Object.entries(variants)) {
    write(`build/icon-${variant}.png`, png(1600, body, eye));
    write(`build/icon-${variant}-macos-safe-area.png`, png(1600, body, eye, MACOS_SAFE_AREA));
    write(`build/icon-${variant}.ico`, icoFor(body, eye, icoSizes));
    write(`src/renderer/src/assets/omnibot-logo-${variant}.png`, png(1600, body, eye));
  }
  write("build/icon.ico", icoFor(variants.production, eye, icoSizes));
  write(
    "build/icon-production.icns",
    encodeIcns(
      (
        [
          ["ic07", 128],
          ["ic08", 256],
          ["ic09", 512],
          ["ic10", 1024],
        ] as const
      ).map(([type, size]) => ({ type, data: png(size, variants.production, eye, MACOS_SAFE_AREA) })),
    ),
  );
  write("build/icon.svg", svgFor(APP_LOGO_COLOR_HEX[DEFAULT_APP_LOGO_COLOR], DEFAULT_APP_LOGO_EYE_HEX));

  // One icon for each logo color the user can pick. The default color uses the release icon.
  const colorsDirectory = join(BUILD, "logo-colors");
  mkdirSync(colorsDirectory, { recursive: true });
  for (const file of readdirSync(colorsDirectory)) rmSync(join(colorsDirectory, file));
  for (const color of APP_LOGO_COLORS) {
    if (color === DEFAULT_APP_LOGO_COLOR) continue;
    const body = hexToRgb(APP_LOGO_COLOR_HEX[color]);
    const colorEye = hexToRgb(APP_LOGO_EYE_HEX[color]);
    write(`build/logo-colors/icon-${color}.png`, png(1600, body, colorEye));
    write(`build/logo-colors/icon-${color}-macos-safe-area.png`, png(1600, body, colorEye, MACOS_SAFE_AREA));
  }

  // The account service web pages.
  const production = variants.production;
  write("apps/auth-api/public/favicon.ico", icoFor(production, eye, [16, 32, 48]));
  write("apps/auth-api/public/favicon-32x32.png", png(32, production, eye));
  write("apps/auth-api/public/apple-touch-icon.png", png(180, production, eye));
  write("apps/auth-api/public/icon-192x192.png", png(192, production, eye));
  write("apps/auth-api/public/icon-512x512.png", png(512, production, eye));
}

main();
