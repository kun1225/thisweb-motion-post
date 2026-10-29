import { useCurrentFrame } from 'remotion';

import { COLOR, MONO } from '../../carousel/carousel-parts';
import { RAMP, clamp01, noiseChar } from './ascii-kit';
import type { AsciiTitleFrame, AsciiTitleMotion } from './ascii-style.type';

/** 5 seconds. The title is whole on the first and last frame, so the thumbnail reads and the loop has no jump. */
export const TITLE_FRAMES = 150;
const OUT = [20, 50] as const;
const IN = [55, 115] as const;

/** The cover title breaks into characters and comes back, in the motion `layers.titleMotion` picks. */
export function AsciiTitle({
  text,
  motion = 'decode',
}: {
  text: string;
  motion?: string;
}) {
  const frame = useCurrentFrame();
  const show = TITLE_MOTIONS[motion as AsciiTitleMotion];
  if (show === undefined) {
    throw new Error(
      `Unknown title motion "${motion}". Use one of: ${Object.keys(TITLE_MOTIONS).join(', ')}.`,
    );
  }
  const chars = Array.from(text);
  // One blank cell after the last letter, where the `type` cursor waits.
  const cells = [...chars, NBSP];
  return (
    <>
      {cells.map((char, index) => (
        <TitleCell
          key={index}
          char={char}
          shown={show({ char, index, count: chars.length, frame })}
        />
      ))}
    </>
  );
}

const NBSP = '\u00A0';

const TITLE_MOTIONS: Record<AsciiTitleMotion, AsciiTitleFrame> = {
  decode: decodeFrame,
  density: densityFrame,
  type: typeFrame,
};

/** Left to right, each letter turns into noise, then locks back into place. */
function decodeFrame({
  char,
  index,
  count,
  frame,
}: Parameters<AsciiTitleFrame>[0]) {
  if (char.trim() === '') return char;
  const t = index / Math.max(1, count - 1);
  const scrambleAt = OUT[0] + t * (OUT[1] - OUT[0]);
  const lockAt = IN[0] + t * (IN[1] - IN[0]);
  if (frame < scrambleAt || frame >= lockAt) return char;
  return noiseChar(index, frame);
}

const FADE_FRAMES = 12;
// Fades out from dense to light, and back in from light to dense.
const FADE_STEPS = RAMP.slice(1).split('').reverse().join('');

/** Each letter thins out through the ramp to nothing, then fills back in. */
function densityFrame({
  char,
  index,
  count,
  frame,
}: Parameters<AsciiTitleFrame>[0]) {
  if (char.trim() === '') return char;
  const t = index / Math.max(1, count - 1);
  const outAt = OUT[0] + t * (OUT[1] - OUT[0]);
  const inAt = IN[0] + t * (IN[1] - IN[0] - FADE_FRAMES);
  const fadeOut = clamp01((frame - outAt) / FADE_FRAMES);
  const fadeIn = clamp01((frame - inAt) / FADE_FRAMES);
  if (fadeOut === 0 || fadeIn === 1) return char;
  // 0 is the real letter, 1 is empty.
  const level = fadeIn > 0 ? 1 - fadeIn : fadeOut;
  if (level === 1) return '';
  return FADE_STEPS[Math.floor(level * FADE_STEPS.length)] ?? '';
}

const BLINK_FRAMES = 8;

/** Backspaces the title away, then types it again behind a block cursor. */
function typeFrame({
  index,
  count,
  frame,
  char,
}: Parameters<AsciiTitleFrame>[0]) {
  const deleted = clamp01((frame - OUT[0]) / (OUT[1] - OUT[0]));
  const typed = clamp01((frame - IN[0]) / (IN[1] - IN[0]));
  const visible =
    frame < IN[0]
      ? Math.round(count * (1 - deleted))
      : Math.round(count * typed);
  if (index < visible) return char;
  // The cursor sits on the next cell, and blinks only while waiting.
  const moving = frame >= OUT[0] && frame < IN[1];
  const blinkOn = Math.floor(frame / BLINK_FRAMES) % 2 === 0;
  const atEnd = frame >= OUT[0] - 10 && frame < IN[1] + 20;
  if (index === visible && atEnd && (moving || blinkOn)) return '█';
  return '';
}

/** Keeps the real letter's width, so the line never reflows while letters change. */
function TitleCell({ char, shown }: { char: string; shown: string }) {
  if (shown === char) return <>{char}</>;
  return (
    <span style={{ position: 'relative' }}>
      <span style={{ visibility: 'hidden' }}>{char}</span>
      {shown && (
        <span
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: MONO,
            fontWeight: 400,
            color: COLOR.highlight,
          }}
        >
          {shown}
        </span>
      )}
    </span>
  );
}
