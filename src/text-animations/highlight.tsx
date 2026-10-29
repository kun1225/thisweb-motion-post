import { createContext, useContext, useMemo } from 'react';
import { getStroke } from 'perfect-freehand';
import {
  Easing,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

import { asciiNoiseChar } from '../carousel/carousel-ascii';
import { COLOR, MONO } from '../carousel/carousel-theme';
import type { HighlightVariant } from './highlight.type';

/** Set once per slide by `CarouselStage`, so every **highlight** in it looks the same. */
export const HighlightContext = createContext<HighlightVariant>('sweep');

/** Bold text with the slide's highlight animation. */
export function Highlight({ text }: { text: string }) {
  const variant = useContext(HighlightContext);
  if (variant === 'underline') return <UnderlineHighlight text={text} />;
  if (variant === 'ascii') return <AsciiHighlight text={text} />;
  return <SweepHighlight text={text} />;
}

const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

// *** UnderlineHighlight ***
// The line is a background image, because a background on an inline element follows the text when it wraps.
// The default `box-decoration-break: slice` lays it across all the lines as one strip, so it draws line by line.
const UNDERLINE = {
  delay: 4,
  draw: 16,
  erase: 10,
  boilEvery: 4,
  boilVariants: 3,
  view: { width: 1000, height: 40 },
  points: 120,
};

/** Bold text with a blue brush-pen line that draws in, wobbles a little, and erases before the loop point. */
function UnderlineHighlight({ text }: { text: string }) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const { from, to } = underlineSpan(frame, durationInFrames);
  const boil = Math.floor(frame / UNDERLINE.boilEvery) % UNDERLINE.boilVariants;
  const image = useMemo(() => underlineImage(boil, from, to), [boil, from, to]);
  return (
    <strong
      style={{
        color: COLOR.title,
        backgroundImage: image,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'left bottom',
        backgroundSize: '100% 0.34em',
        // Pushes the line below the descenders instead of through them.
        paddingBottom: '0.16em',
      }}
    >
      {text}
    </strong>
  );
}

function underlineSpan(frame: number, duration: number) {
  const { delay, draw, erase } = UNDERLINE;
  // A still has no time to animate, so it shows the whole line.
  if (duration <= delay + draw + erase) return { from: 0, to: 1 };
  const easing = Easing.out(Easing.cubic);
  const to = interpolate(frame, [delay, delay + draw], [0, 1], {
    ...CLAMP,
    easing,
  });
  const from = interpolate(frame, [duration - erase, duration - 1], [0, 1], {
    ...CLAMP,
    easing,
  });
  return { from, to };
}

function underlineImage(boil: number, from: number, to: number) {
  if (to <= from) return 'none';
  const { width, height } = UNDERLINE.view;
  const points = underlinePoints(boil);
  const first = Math.floor(from * (points.length - 1));
  const last = Math.ceil(to * (points.length - 1));
  const outline = getStroke(points.slice(first, last + 1), {
    size: 11,
    thinning: 0.6,
    smoothing: 0.5,
    streamline: 0.2,
    simulatePressure: false,
    start: { taper: 60 },
    end: { taper: 90 },
    last: true,
  });
  if (outline.length === 0) return 'none';
  const d = `M ${outline.map(([x = 0, y = 0]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L ')} Z`;
  // `none` stretches the stroke to the text width; it is mostly horizontal, so it keeps its thickness.
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none"><path d="${d}" fill="${COLOR.title}"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

// Rises a little to the right and bows, like a quick stroke made with a wrist.
function underlinePoints(boil: number) {
  const { width, height } = UNDERLINE.view;
  const phase = random(`underline-${boil}`) * Math.PI * 2;
  const jitter = 1.5 + random(`underline-amp-${boil}`) * 1.5;
  return Array.from({ length: UNDERLINE.points }, (_, i) => {
    const t = i / (UNDERLINE.points - 1);
    const x = 10 + t * (width - 20);
    const y =
      height * 0.62 -
      t * 8 -
      Math.sin(t * Math.PI) * 4 +
      Math.sin(t * 9 + phase) * jitter;
    const pressure = 0.55 + 0.3 * Math.sin(t * 5 + phase);
    return [x, y, pressure];
  });
}

// *** AsciiHighlight ***
const ASCII = { delay: 6, stagger: 2, maxSpread: 24, scramble: 14 };

/** Bold text that starts as random symbols and locks in letter by letter, then scrambles again before the loop point. */
function AsciiHighlight({ text }: { text: string }) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const letters = Array.from(text);
  // Long phrases decode in the same time as short ones.
  const stagger = Math.min(ASCII.stagger, ASCII.maxSpread / letters.length);
  // A still has no time to animate, so it shows the plain text.
  const still =
    durationInFrames <= ASCII.delay + ASCII.maxSpread + ASCII.scramble;
  return (
    <strong style={{ color: COLOR.title }}>
      {letters.map((letter, i) => {
        const lockAt = ASCII.delay + i * stagger;
        const scrambleAt =
          durationInFrames - ASCII.scramble + i * (stagger / 2);
        const locked = still || (frame >= lockAt && frame < scrambleAt);
        if (locked || letter.trim() === '') return letter;
        return (
          <AsciiLetter
            key={i}
            letter={letter}
            glyph={asciiNoiseChar(`${text}-${i}`, frame)}
          />
        );
      })}
    </strong>
  );
}

/** Keeps the real letter's width under the symbol, so the line never reflows. */
function AsciiLetter({ letter, glyph }: { letter: string; glyph: string }) {
  return (
    <span style={{ position: 'relative' }}>
      <span style={{ visibility: 'hidden' }}>{letter}</span>
      <span
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          justifyContent: 'center',
          fontFamily: MONO,
          fontWeight: 400,
          color: COLOR.highlight,
        }}
      >
        {glyph}
      </span>
    </span>
  );
}

// *** SweepHighlight ***
// White, through brand blue, to orange, like aren.com, but back to white before the loop point.
// OKLCH [lightness, chroma, hue] of COLOR.text, COLOR.title and COLOR.highlight, so the steps stay bright.
// White has no hue, so it borrows blue's to avoid a spin. Orange's hue is plus 360, so blue turns
// through purple and pink instead of lime green.
const SWEEP_STEPS: [number, number, number][] = [
  [0.985, 0.002, 208.2],
  [0.729, 0.154, 53.9 + 360],
  [0.855, 0.139, 208.2],
];
const SWEEP = { delay: 1, change: 8, stagger: 20, maxStagger: 16 };

/** Bold text whose letters turn orange one after another, hold, then turn back to white. */
function SweepHighlight({ text }: { text: string }) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const letters = Array.from(text);
  // Long words sweep in the same time as short ones, so the hold stays the same.
  const stagger = Math.min(SWEEP.stagger, SWEEP.maxStagger / letters.length);
  return (
    <strong>
      {letters.map((letter, i) => (
        <span
          key={i}
          style={{
            color: sweepColor(
              frame - i * stagger,
              durationInFrames - SWEEP.maxStagger,
            ),
          }}
        >
          {letter}
        </span>
      ))}
    </strong>
  );
}

function sweepColor(frame: number, duration: number) {
  const { delay, change } = SWEEP;
  // A still has no time to animate, so it shows the final colour.
  if (duration <= 2 * (delay + change)) return COLOR.highlight;
  const holdEnd = duration - delay - change;
  const last = SWEEP_STEPS.length - 1;
  const rise = SWEEP_STEPS.map((_, i) => delay + (change * i) / last);
  const fall = SWEEP_STEPS.map((_, i) => holdEnd + (change * i) / last);
  const input = [...rise, ...fall];
  const steps = [...SWEEP_STEPS, ...SWEEP_STEPS.toReversed()];
  const [l, c, h] = [0, 1, 2].map((channel) =>
    interpolate(
      frame,
      input,
      steps.map((step) => step[channel] ?? 0),
      CLAMP,
    ),
  );
  return `oklch(${l} ${c} ${h})`;
}
