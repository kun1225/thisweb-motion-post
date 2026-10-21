// PROTO — "Turn": the square ticks a quarter turn, rests, ticks again. Four ticks = one loop.
import { interpolate } from 'remotion';

import { InkBoil } from './motion-frame';
import type { MotionArtProps } from './motion-frame';
import {
  ART,
  CENTER,
  DOT,
  SQUARE_PATH,
  TILT,
  circlePath,
  easeInOut,
} from './motion-shapes';

const TICKS = 4;
const MOVE = 0.6;

export function MotionTurn({
  progress,
  ink,
  boil,
  strokeWidth,
}: MotionArtProps) {
  const step = Math.floor(progress * TICKS);
  const t = progress * TICKS - step;
  const turn = interpolate(t, [0, MOVE], [0, 1], {
    easing: easeInOut,
    extrapolateRight: 'clamp',
  });
  const angle = TILT + 90 * (step + turn);
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
        <InkBoil id="ink-boil-turn" amount={boil} />
      </defs>
      <g transform={`${CENTER} rotate(${angle})`} filter="url(#ink-boil-turn)">
        <path
          d={SQUARE_PATH}
          fill="none"
          stroke={ink}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
        />
        <path d={circlePath(DOT.x, DOT.y, DOT.r * 0.45)} fill={ink} />
      </g>
    </svg>
  );
}
