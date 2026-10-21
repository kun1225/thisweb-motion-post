import type { ReactNode } from 'react';
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import type { CarouselLineArt, CarouselLineArtProps } from './carousel.type';

export const CAROUSEL_LINE_ARTS: CarouselLineArt[] = ['draw', 'turn', 'field'];

/** One-colour line drawing that fills its box. One full cycle per slide, so it loops without a jump. */
export function CarouselLineArtView({
  art,
  ...props
}: Omit<CarouselLineArtProps, 'progress'> & { art: CarouselLineArt }) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const Art = ARTS[art];
  if (Art === undefined) {
    throw new Error(
      `Unknown line art "${art}". Use one of: ${CAROUSEL_LINE_ARTS.join(', ')}.`,
    );
  }
  return <Art {...props} progress={frame / durationInFrames} />;
}

const ARTS: Record<
  CarouselLineArt,
  (props: CarouselLineArtProps) => ReactNode
> = {
  draw: DrawArt,
  turn: TurnArt,
  field: FieldArt,
};

// *** DrawArt ***
// Starts and ends on an empty box, so the loop point is invisible.
const DRAW = [0.04, 0.5];
const ERASE = [0.62, 0.96];

/** A pen line draws the square and dot, holds, then the tail chases it away. */
function DrawArt({ progress, ...props }: CarouselLineArtProps) {
  const head = interpolate(progress, DRAW, [0, 1], CLAMP_EASE);
  const tail = interpolate(progress, ERASE, [0, 1], CLAMP_EASE);
  return (
    <ArtSvg {...props} id="draw" width={SQUARE_BOX} height={SQUARE_BOX}>
      <g transform={`${SQUARE_CENTER} rotate(${TILT})`}>
        {DRAW_STROKES.map((stroke) => {
          const from = strokeShare(tail, stroke);
          const to = strokeShare(head, stroke);
          return (
            <path
              key={stroke.d}
              d={stroke.d}
              pathLength={1}
              strokeDasharray={`${to - from} 2`}
              strokeDashoffset={-from}
              visibility={to > from ? 'visible' : 'hidden'}
            />
          );
        })}
      </g>
    </ArtSvg>
  );
}

// *** TurnArt ***
const TICKS = 4;
const MOVE = 0.6;

/** The square ticks a quarter turn, rests, and ticks again. Four ticks make one loop. */
function TurnArt({ progress, color, ...props }: CarouselLineArtProps) {
  const step = Math.floor(progress * TICKS);
  const t = progress * TICKS - step;
  const turn = interpolate(t, [0, MOVE], [0, 1], {
    easing: EASE_IN_OUT,
    extrapolateRight: 'clamp',
  });
  return (
    <ArtSvg
      {...props}
      color={color}
      id="turn"
      width={SQUARE_BOX}
      height={SQUARE_BOX}
    >
      <g transform={`${SQUARE_CENTER} rotate(${TILT + 90 * (step + turn)})`}>
        <path d={SQUARE_PATH} />
        <path
          d={circlePath(DOT.x, DOT.y, DOT.r * 0.45)}
          fill={color}
          stroke="none"
        />
      </g>
    </ArtSvg>
  );
}

// *** FieldArt ***
const FIELD = { width: 860, height: 460, lines: 13, points: 72, amplitude: 18 };

/** Parallel lines with a slow swell passing through. */
function FieldArt({ progress, strokeWidth, ...props }: CarouselLineArtProps) {
  return (
    <ArtSvg
      {...props}
      strokeWidth={strokeWidth * 0.7}
      id="field"
      width={FIELD.width}
      height={FIELD.height}
    >
      {Array.from({ length: FIELD.lines }, (_, i) => (
        <path key={i} d={fieldLine(i, progress)} />
      ))}
    </ArtSvg>
  );
}

function fieldLine(index: number, progress: number) {
  const baseY = 30 + (index * (FIELD.height - 60)) / (FIELD.lines - 1);
  const points = Array.from({ length: FIELD.points + 1 }, (_, j) => {
    const u = j / FIELD.points;
    // Pinned ends keep the field a calm block instead of a flapping ribbon.
    const envelope = Math.sin(Math.PI * u) ** 2;
    const phase = 2 * Math.PI * (u * 1.1 - progress) + index * 0.32;
    const y = baseY + FIELD.amplitude * envelope * Math.sin(phase);
    return `${(u * FIELD.width).toFixed(1)} ${y.toFixed(1)}`;
  });
  return `M ${points.join(' L ')}`;
}

// *** Shared ***
const SQUARE_BOX = 460;
const SQUARE_HALF = 150;
const SQUARE_CENTER = `translate(${SQUARE_BOX / 2} ${SQUARE_BOX / 2})`;
const TILT = -36;
const SQUARE_PATH = `M ${-SQUARE_HALF} ${-SQUARE_HALF} L ${SQUARE_HALF} ${-SQUARE_HALF} L ${SQUARE_HALF} ${SQUARE_HALF} L ${-SQUARE_HALF} ${SQUARE_HALF} Z`;
const DOT = { x: -62, y: 58, r: 44 };

function circlePath(x: number, y: number, r: number) {
  return `M ${x - r} ${y} A ${r} ${r} 0 1 0 ${x + r} ${y} A ${r} ${r} 0 1 0 ${x - r} ${y}`;
}

// SVG restarts the dash at every subpath, so each shape is its own path, drawn one after the other.
const SQUARE_LENGTH = 8 * SQUARE_HALF;
const DOT_LENGTH = 2 * Math.PI * DOT.r;
const DRAW_STROKES = [
  { d: SQUARE_PATH, start: 0, length: SQUARE_LENGTH },
  {
    d: circlePath(DOT.x, DOT.y, DOT.r),
    start: SQUARE_LENGTH,
    length: DOT_LENGTH,
  },
];

function strokeShare(at: number, stroke: (typeof DRAW_STROKES)[number]) {
  const drawn = at * (SQUARE_LENGTH + DOT_LENGTH) - stroke.start;
  return Math.min(Math.max(drawn / stroke.length, 0), 1);
}

const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);
const CLAMP_EASE = {
  easing: EASE_IN_OUT,
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
} as const;

function ArtSvg({
  id,
  width,
  height,
  align,
  color,
  boil,
  strokeWidth,
  children,
}: Omit<CarouselLineArtProps, 'progress'> & {
  id: string;
  width: number;
  height: number;
  children: ReactNode;
}) {
  const filterId = `line-art-boil-${id}`;
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height="100%"
      preserveAspectRatio={
        align === 'right' ? 'xMaxYMax meet' : 'xMidYMax meet'
      }
      style={{ position: 'absolute', inset: 0 }}
    >
      <defs>
        <InkBoil id={filterId} amount={boil} />
      </defs>
      <g
        filter={`url(#${filterId})`}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {children}
      </g>
    </svg>
  );
}

/** Wobbles strokes like a hand-drawn line. Steps at 7.5 fps, the classic "line boil" rate. */
function InkBoil({ id, amount }: { id: string; amount: number }) {
  const frame = useCurrentFrame();
  return (
    <filter id={id} x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.035"
        numOctaves={2}
        seed={Math.floor(frame / 4) % 6}
      />
      <feDisplacementMap
        in="SourceGraphic"
        scale={amount}
        xChannelSelector="R"
        yChannelSelector="G"
      />
    </filter>
  );
}
