import { Fragment } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import {
  Sequence,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

import type { CarouselLang, CarouselTextLayer } from './carousel.type';

export const CAROUSEL_SIZE = { width: 1080, height: 1350 };

// Matches the ThisWeb carousel template in Canva.
export const COLOR = {
  title: '#31E8FF',
  highlight: '#F0893C',
  text: '#F9FAFB',
  muted: '#C4C4C4',
  card: 'rgba(0, 0, 0, 0.25)',
};
export const MONO = '"Paper Mono", ui-monospace, monospace';
// The Latin font comes first in zh too, so English words in Chinese text match the en slides.
export const FONT: Record<CarouselLang, { sans: string; serif: string }> = {
  en: {
    sans: '"IBM Plex Sans", sans-serif',
    serif: '"Source Serif 4", serif',
  },
  zh: {
    sans: '"IBM Plex Sans", "Noto Sans TC", sans-serif',
    serif: '"Source Serif 4", "Noto Serif TC", serif',
  },
};
export const PAD_X = 110;
export const CONTENT_WIDTH = CAROUSEL_SIZE.width - PAD_X * 2;

// *** CarouselColumn ***
export function CarouselColumn({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: `105px ${PAD_X}px 160px`,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {children}
    </div>
  );
}

// *** CarouselTitle ***
export function CarouselTitle({
  children,
  settings,
  style,
}: {
  children: ReactNode;
  settings: CarouselTextLayer;
  style?: CSSProperties;
}) {
  return (
    <Sequence name="Title" layout="none">
      <h1
        style={{
          margin: 0,
          fontSize: 60,
          lineHeight: 1.3,
          fontWeight: 700,
          color: COLOR.title,
          ...style,
          ...carouselTextStyle(settings),
        }}
      >
        {children}
      </h1>
    </Sequence>
  );
}

// *** CarouselBody ***
export function CarouselBody({ text }: { text: string }) {
  return (
    <p
      style={{
        margin: '36px 0 0',
        fontSize: 40,
        lineHeight: 1.6,
        whiteSpace: 'pre-line',
      }}
    >
      {/* Chrome balances only one paragraph of a block, so each paragraph is its own block. */}
      {text.split('\n\n').map((paragraph, i) => (
        <span
          key={i}
          style={{ display: 'block', marginTop: i === 0 ? 0 : '1.6em' }}
        >
          <CarouselRichText text={paragraph} />
        </span>
      ))}
    </p>
  );
}

export function carouselTextStyle(settings?: CarouselTextLayer): CSSProperties {
  if (!settings) return {};

  return {
    // An unset font must not erase the layout's font when spread over it.
    ...(settings.fontFamily && { fontFamily: settings.fontFamily }),
    fontSize: settings.fontSize,
    color: settings.color,
    translate: `${settings.x}px ${settings.y}px`,
  };
}

// *** CarouselRichText ***
export function CarouselRichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*.+?\*\*|`.+?`)/);
  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('**')) {
          return <CarouselHighlight key={index} text={part.slice(2, -2)} />;
        }
        if (part.startsWith('`')) {
          return (
            <code key={index} style={{ fontFamily: MONO, fontSize: '0.9em' }}>
              {part.slice(1, -1)}
            </code>
          );
        }
        return <Fragment key={index}>{part}</Fragment>;
      })}
    </>
  );
}

// *** CarouselHighlight ***
// White, through brand blue, to orange, like aren.com, but back to white before the loop point.
// OKLCH [lightness, chroma, hue] of COLOR.text, COLOR.title and COLOR.highlight, so the steps stay bright.
// White has no hue, so it borrows blue's to avoid a spin. Orange's hue is plus 360, so blue turns
// through purple and pink instead of lime green.
const HIGHLIGHT_STEPS: [number, number, number][] = [
  [0.985, 0.002, 208.2],
  [0.729, 0.154, 53.9 + 360],
  [0.855, 0.139, 208.2],
];
const HIGHLIGHT = { delay: 1, change: 8, stagger: 20, maxStagger: 16 };
const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

/** Bold text whose letters turn orange one after another, hold, then turn back to white. */
function CarouselHighlight({ text }: { text: string }) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const letters = Array.from(text);
  // Long words sweep in the same time as short ones, so the hold stays the same.
  const stagger = Math.min(
    HIGHLIGHT.stagger,
    HIGHLIGHT.maxStagger / letters.length,
  );
  return (
    <strong>
      {letters.map((letter, i) => (
        <span
          key={i}
          style={{
            color: highlightColor(
              frame - i * stagger,
              durationInFrames - HIGHLIGHT.maxStagger,
            ),
          }}
        >
          {letter}
        </span>
      ))}
    </strong>
  );
}

function highlightColor(frame: number, duration: number) {
  const { delay, change } = HIGHLIGHT;
  // A still has no time to animate, so it shows the final colour.
  if (duration <= 2 * (delay + change)) return COLOR.highlight;
  const holdEnd = duration - delay - change;
  const last = HIGHLIGHT_STEPS.length - 1;
  const rise = HIGHLIGHT_STEPS.map((_, i) => delay + (change * i) / last);
  const fall = HIGHLIGHT_STEPS.map((_, i) => holdEnd + (change * i) / last);
  const input = [...rise, ...fall];
  const steps = [...HIGHLIGHT_STEPS, ...HIGHLIGHT_STEPS.toReversed()];
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

// *** CarouselFooter ***
// Not a layer, so the brand looks the same on every post.
export function CarouselFooter() {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 70,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontFamily: MONO,
        fontSize: 32,
        color: 'rgba(255, 255, 255, 0.6)',
      }}
    >
      @this.web
    </div>
  );
}
