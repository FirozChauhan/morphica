// lib/sharp.ts
// The image-processing pipeline. sharp does everything in memory — nothing is
// ever written to disk, which is exactly the "zero persistence" promise.
import sharp from "sharp";

export type ProcessOptions = {
  width?: number;
  height?: number;
};

// The only formats I accept. Anything else is rejected with 415 before sharp
// ever gets its hands on it.
export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

// Safety cap: a tiny file that claims to be an enormous image ("decompression
// bomb") would eat all the serverless memory. 80 megapixels is far beyond any
// realistic use case, so this blocks the attack without hurting real requests.
const LIMIT_INPUT_PIXELS = 80_000_000;

export function isAllowedMimeType(mime: string): boolean {
  return (ALLOWED_MIME_TYPES as readonly string[]).includes(mime);
}

export type ProcessResult = {
  buffer: Buffer;
  contentType: string;
};

export async function processImage(
  buffer: Buffer,
  { width, height }: ProcessOptions,
): Promise<ProcessResult> {
  // Peek at the image first so I can report the correct Content-Type on the
  // response (the output keeps the input's format).
  const metadata = await sharp(buffer, {
    limitInputPixels: LIMIT_INPUT_PIXELS,
  }).metadata();

  // sharp only reads the FIRST frame of an animated GIF by default, so the
  // output is always a static image — no broken animation handling to worry
  // about in v1.
  const out = await sharp(buffer, { limitInputPixels: LIMIT_INPUT_PIXELS })
    .resize({
      ...(width ? { width } : {}),
      ...(height ? { height } : {}),
      fit: "cover",
      // Never upscale a small image into a blurry mess.
      withoutEnlargement: true,
    })
    .toBuffer();

  return {
    buffer: out,
    contentType: `image/${metadata.format ?? "jpeg"}`,
  };
}
