import type { ReactNode } from 'react';
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

import type {
  CarouselLineArt,
  CarouselLineArtProps,
  CarouselMotionPosition,
  CarouselPost,
} from './carousel.type';
import { InkContext, InkPath } from './carousel-ink';
import { COLOR } from './carousel-parts';

export const CAROUSEL_LINE_ARTS: CarouselLineArt[] = [
  'draw',
  'turn',
  'field',
  'swing',
  'spin',
];

/** One-colour line drawing that fills its box. One full cycle per slide, so it loops without a jump. */
export function CarouselLineArtView({
  art,
  arts,
  ...props
}: Omit<CarouselLineArtProps, 'progress'> & {
  art: string;
  arts: CarouselPost['arts'];
}) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const Art = arts?.[art] ?? ARTS[art as CarouselLineArt];
  if (Art === undefined) {
    const names = [...CAROUSEL_LINE_ARTS, ...Object.keys(arts ?? {})];
    throw new Error(
      `Unknown line art "${art}". Use one of: ${names.join(', ')}.`,
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
  swing: SwingArt,
  spin: SpinArt,
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
            <InkPath
              key={stroke.d}
              d={stroke.d}
              from={from}
              to={to}
              accent={stroke.accent}
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
function TurnArt({
  progress,
  accent = COLOR.text,
  ...props
}: CarouselLineArtProps) {
  const step = Math.floor(progress * TICKS);
  const t = progress * TICKS - step;
  const turn = interpolate(t, [0, MOVE], [0, 1], {
    easing: EASE_IN_OUT,
    extrapolateRight: 'clamp',
  });
  return (
    <ArtSvg
      {...props}
      accent={accent}
      id="turn"
      width={SQUARE_BOX}
      height={SQUARE_BOX}
    >
      <g transform={`${SQUARE_CENTER} rotate(${TILT + 90 * (step + turn)})`}>
        <InkPath d={SQUARE_PATH} />
        <path
          d={circlePath(DOT.x, DOT.y, DOT.r * 0.45)}
          fill={accent}
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
        <InkPath key={i} d={fieldLine(i, progress)} accent={i % 3 === 1} />
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

// *** SwingArt ***
const SWING = { width: 860, height: 460, balls: 7, r: 30, reach: 150, laps: 2 };

/**
 * A pendulum wave: each ball swings one more time per loop than the one before,
 * so the row breaks into waves and lines up again exactly at the loop point.
 */
function SwingArt({ progress, ...props }: CarouselLineArtProps) {
  const gap = (SWING.width - 4 * SWING.r) / (SWING.balls - 1);
  return (
    <ArtSvg {...props} id="swing" width={SWING.width} height={SWING.height}>
      {Array.from({ length: SWING.balls }, (_, i) => {
        const x = 2 * SWING.r + i * gap;
        const swing = Math.sin(2 * Math.PI * progress * (SWING.laps + i));
        const y = SWING.height / 2 - SWING.reach * swing;
        return (
          <InkPath
            key={x}
            d={circlePath(x, y, SWING.r)}
            accent={i === (SWING.balls - 1) / 2}
          />
        );
      })}
    </ArtSvg>
  );
}

// *** SpinArt ***
// The slide's own size, so on `full` slides the coins cross the whole post.
const SPIN = { width: 1080, height: 1350, r: 120 };
const COINS = [
  { y: 330, offset: 0, spins: 3 },
  { y: 760, offset: 0.4, spins: 4 },
  { y: 1080, offset: 0.75, spins: 2 },
];
const RINGS = [1, 0.7, 0.4];

/** Coins roll across, each spinning on its edge. Each crosses once per loop, off-screen at the loop point. */
function SpinArt({ progress, ...props }: CarouselLineArtProps) {
  return (
    <ArtSvg {...props} id="spin" width={SPIN.width} height={SPIN.height}>
      {COINS.map(({ y, offset, spins }) => {
        const travel = (progress + offset) % 1;
        const x = -SPIN.r + travel * (SPIN.width + 2 * SPIN.r);
        const turn = Math.cos(2 * Math.PI * (progress * spins + offset));
        return RINGS.map((ring) => {
          const r = SPIN.r * ring;
          // A coin seen edge-on is a line; 2 keeps the ellipse from collapsing to nothing.
          const width = Math.max(Math.abs(turn) * r, 2);
          return (
            <InkPath
              key={`${y}-${ring}`}
              d={ellipsePath(x, y, width, r)}
              accent={ring === RINGS[1]}
            />
          );
        });
      })}
    </ArtSvg>
  );
}

// *** Shared ***
const SQUARE_BOX = 460;
const SQUARE_HALF = 150;
const SQUARE_CENTER = `translate(${SQUARE_BOX / 2} ${SQUARE_BOX / 2})`;
const TILT = -36;
const SQUARE_PATH = `M ${-SQUARE_HALF} ${-SQUARE_HALF} L ${SQUARE_HALF} ${-SQUARE_HALF} L ${SQUARE_HALF} ${SQUARE_HALF} L ${-SQUARE_HALF} ${SQUARE_HALF} Z`;
const DOT = { x: -62, y: 58, r: 44 };

export function circlePath(x: number, y: number, r: number) {
  return ellipsePath(x, y, r, r);
}

export function roundedRect(
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  return `M ${x + r} ${y} H ${x + w - r} A ${r} ${r} 0 0 1 ${x + w} ${y + r} V ${y + h - r} A ${r} ${r} 0 0 1 ${x + w - r} ${y + h} H ${x + r} A ${r} ${r} 0 0 1 ${x} ${y + h - r} V ${y + r} A ${r} ${r} 0 0 1 ${x + r} ${y} Z`;
}

function ellipsePath(x: number, y: number, rx: number, ry: number) {
  return `M ${x - rx} ${y} A ${rx} ${ry} 0 1 0 ${x + rx} ${y} A ${rx} ${ry} 0 1 0 ${x - rx} ${y}`;
}

// SVG restarts the dash at every subpath, so each shape is its own path, drawn one after the other.
const SQUARE_LENGTH = 8 * SQUARE_HALF;
const DOT_LENGTH = 2 * Math.PI * DOT.r;
const DRAW_STROKES = [
  { d: SQUARE_PATH, start: 0, length: SQUARE_LENGTH, accent: false },
  {
    d: circlePath(DOT.x, DOT.y, DOT.r),
    start: SQUARE_LENGTH,
    length: DOT_LENGTH,
    accent: true,
  },
];

function strokeShare(at: number, stroke: (typeof DRAW_STROKES)[number]) {
  const drawn = at * (SQUARE_LENGTH + DOT_LENGTH) - stroke.start;
  return Math.min(Math.max(drawn / stroke.length, 0), 1);
}

export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);
export const CLAMP_EASE = {
  easing: EASE_IN_OUT,
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
} as const;

// Small art hugs the edge next to the text; big art sits in the middle of its box.
const ART_ALIGN: Record<CarouselMotionPosition, string> = {
  right: 'xMaxYMax meet',
  center: 'xMidYMax meet',
  top: 'xMidYMid meet',
  full: 'xMidYMid meet',
};

/** The shared SVG box and hand-drawn ink style, also used by posts' own arts. Draw lines with `InkPath`. */
export function ArtSvg({
  id,
  width,
  height,
  align,
  color,
  accent = COLOR.text,
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
      preserveAspectRatio={ART_ALIGN[align]}
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
        <InkContext value={{ color, accent, width: strokeWidth }}>
          {children}
        </InkContext>
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
