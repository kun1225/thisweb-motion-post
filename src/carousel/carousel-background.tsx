import type { ReactNode } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';

import type {
  CarouselBackgroundProps,
  CarouselBackgroundVariant,
} from './carousel.type';

export const DEFAULT_BACKGROUND_VARIANT: CarouselBackgroundVariant = 'drift';

export function CarouselBackground() {
  return <AbsoluteFill style={{ background: STILL }} />;
}

/** One full cycle per slide, so the cover video loops on Instagram without a jump. */
export function CarouselAnimatedBackground({
  variant,
}: {
  variant: CarouselBackgroundVariant;
}) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const Variant = VARIANTS[variant];
  if (Variant === undefined) {
    throw new Error(
      `Unknown background "${variant}". Use one of: ${Object.keys(VARIANTS).join(', ')}.`,
    );
  }
  return <Variant progress={frame / durationInFrames} />;
}

const VARIANTS: Record<
  CarouselBackgroundVariant,
  (props: CarouselBackgroundProps) => ReactNode
> = {
  drift: DriftBackground,
  grid: GridBackground,
  code: CodeBackground,
};

// *** DriftBackground ***
// The still glow is almost the same shade as the base, so motion needs a brighter one to be seen.
function DriftBackground({ progress }: CarouselBackgroundProps) {
  const turn = progress * Math.PI * 2;
  const glow = tealGlow({
    x: 25 + 25 * Math.cos(turn),
    y: 20 + 20 * Math.sin(turn),
    width: 90,
    height: 60,
    color: BRIGHT_TEAL,
    alpha: 0.5,
  });
  return <AbsoluteFill style={{ background: `${glow}, ${BASE}` }} />;
}

// *** GridBackground ***
function GridBackground({ progress }: CarouselBackgroundProps) {
  // The band starts and ends off-screen, so the loop point is invisible.
  const center = -30 + 160 * progress;
  const band = `linear-gradient(120deg, transparent ${center - 25}%, black ${center}%, transparent ${center + 25}%)`;
  return (
    <AbsoluteFill style={{ background: STILL }}>
      <AbsoluteFill style={{ ...DOT_GRID, backgroundImage: dots(0.07) }} />
      <AbsoluteFill
        style={{
          ...DOT_GRID,
          backgroundImage: dots(0.4),
          maskImage: band,
          WebkitMaskImage: band,
        }}
      />
    </AbsoluteFill>
  );
}

const DOT_GRID = {
  backgroundSize: '40px 40px',
  backgroundPosition: '20px 20px',
};

function dots(alpha: number) {
  return `radial-gradient(circle, rgba(${LIGHT}, ${alpha}) 1.5px, transparent 2.5px)`;
}

// *** CodeBackground ***
function CodeBackground({ progress }: CarouselBackgroundProps) {
  const fade =
    'linear-gradient(transparent 0%, black 20%, black 80%, transparent 100%)';
  const tile = CODE_LINES.map((line, i) => <div key={i}>{line || ' '}</div>);
  return (
    <AbsoluteFill style={{ background: STILL }}>
      <AbsoluteFill
        style={{
          padding: '0 70px',
          overflow: 'hidden',
          fontFamily: '"Paper Mono", ui-monospace, monospace',
          fontSize: 24,
          lineHeight: `${CODE_LINE_HEIGHT}px`,
          whiteSpace: 'pre',
          color: `rgba(${LIGHT}, 0.07)`,
          maskImage: fade,
          WebkitMaskImage: fade,
        }}
      >
        {/* Two copies, so scrolling one tile height lands on an identical frame. */}
        <div style={{ translate: `0 ${-progress * CODE_TILE_HEIGHT}px` }}>
          {tile}
          {tile}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

const CODE_LINES = [
  'const first = card.getBoundingClientRect();',
  "card.classList.add('expanded');",
  'const last = card.getBoundingClientRect();',
  'const dx = first.left - last.left;',
  'const dy = first.top - last.top;',
  'card.animate(',
  '  [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "none" }],',
  '  { duration: 300, easing: "cubic-bezier(0.32, 0.72, 0, 1)" },',
  ');',
  '',
  '.card {',
  '  view-transition-name: card;',
  '  transition: transform 200ms ease-out;',
  '}',
  '',
  '@keyframes fade-in {',
  '  from { opacity: 0; translate: 0 8px; }',
  '}',
  '',
  'document.startViewTransition(() => update());',
  '',
  'export function Card({ title }) {',
  '  return <div className="card">{title}</div>;',
  '}',
  '',
];
const CODE_LINE_HEIGHT = 54;
const CODE_TILE_HEIGHT = CODE_LINES.length * CODE_LINE_HEIGHT;

// *** Shared ***
const TEAL = '13, 41, 52';
const BRIGHT_TEAL = '30, 90, 105';
const LIGHT = '170, 230, 240';

const BASE = 'linear-gradient(160deg, #31313D 0%, #24242E 45%, #0D2934 100%)';

// The teal glow in the top-left echoes the teal at the bottom, so the slide feels balanced.
function tealGlow({
  x = 0,
  y = 0,
  width = 75,
  height = 45,
  color = TEAL,
  alpha = 0.6,
}: {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  color?: string;
  alpha?: number;
}) {
  return `radial-gradient(ellipse ${width}% ${height}% at ${x}% ${y}%, rgba(${color}, ${alpha}) 0%, rgba(${color}, 0) 100%)`;
}

const STILL = `${tealGlow({})}, ${BASE}`;
