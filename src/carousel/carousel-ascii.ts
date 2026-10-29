import { random } from 'remotion';

// Shared by the `ascii` background, the `ascii` highlight, and posts that draw with characters.

/** Light to dark: more ink in a character reads as a darker pixel. */
export const ASCII_RAMP = ' .:-=+*#%@';
const NOISE = '!<>-_\\/[]{}=+*^?#%&$';

export function asciiRampChar(value: number) {
  const index = Math.round(clamp01(value) * (ASCII_RAMP.length - 1));
  return ASCII_RAMP[index] ?? ' ';
}

/** A random character that changes every `hold` frames, the same on every render. */
export function asciiNoiseChar(seed: number | string, frame: number, hold = 2) {
  const pick = random(`${seed}-${Math.floor(frame / hold)}`);
  return NOISE[Math.floor(pick * NOISE.length)] ?? '#';
}

/** Values from 0 to 1. `progress` goes once around the wave, so it loops without a jump. */
export function asciiWaveField(progress: number, cols: number, rows: number) {
  const t = progress * Math.PI * 2;
  return Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => {
      const wave =
        0.5 +
        0.25 * Math.sin(col * 0.18 + t) +
        0.25 * Math.sin(row * 0.3 + col * 0.07 - t);
      // Squared, so most of the field stays light and the crests stand out.
      return wave * wave;
    }),
  );
}

export function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}
