// PROTO — "Draw": one pen line writes the square and dot, holds, then the tail chases it away.
import { interpolate } from 'remotion';

import { InkBoil } from './motion-frame';
import type { MotionArtProps } from './motion-frame';
import {
  ART,
  CENTER,
  DOT,
  SQUARE_PATH,
  SQUARE_SIDE,
  TILT,
  circlePath,
  easeInOut,
} from './motion-shapes';

// The loop starts and ends on an empty page, so the cut is invisible.
const DRAW = [0.04, 0.5];
const ERASE = [0.62, 0.96];

export function MotionDraw({
  progress,
  ink,
  boil,
  strokeWidth,
}: MotionArtProps) {
  const head = interpolate(progress, DRAW, [0, 1], clampEase);
  const tail = interpolate(progress, ERASE, [0, 1], clampEase);
  return (
    <svg
      viewBox={`0 0 ${ART} ${ART}`}
      width={ART}
      height={ART}
      style={{
        position: 'absolute',
        left: '50%',
        top: 0,
        marginLeft: -ART / 2,
      }}
    >
      <defs>
        <InkBoil id="ink-boil-draw" amount={boil} />
      </defs>
      <g
        transform={`${CENTER} rotate(${TILT})`}
        filter="url(#ink-boil-draw)"
        fill="none"
        stroke={ink}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {STROKES.map((stroke) => {
          const from = local(tail, stroke);
          const to = local(head, stroke);
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
    </svg>
  );
}

// SVG restarts the dash at every subpath, so each shape is its own path, drawn one after the other.
const SQUARE_LENGTH = 4 * SQUARE_SIDE;
const DOT_LENGTH = 2 * Math.PI * DOT.r;
const TOTAL = SQUARE_LENGTH + DOT_LENGTH;
const STROKES = [
  { d: SQUARE_PATH, start: 0, length: SQUARE_LENGTH },
  {
    d: circlePath(DOT.x, DOT.y, DOT.r),
    start: SQUARE_LENGTH,
    length: DOT_LENGTH,
  },
];

function local(at: number, stroke: (typeof STROKES)[number]) {
  return Math.min(Math.max((at * TOTAL - stroke.start) / stroke.length, 0), 1);
}

const clampEase = {
  easing: easeInOut,
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
} as const;
