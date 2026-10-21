// PROTO — "Field": no object, just parallel lines with a slow swell passing through.
import { InkBoil } from './motion-frame';
import type { MotionArtProps } from './motion-frame';

const WIDTH = 860;
const HEIGHT = 460;
const LINES = 13;
const POINTS = 72;
const AMPLITUDE = 18;

export function MotionField({
  progress,
  ink,
  boil,
  strokeWidth,
}: MotionArtProps) {
  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      width={WIDTH}
      height={HEIGHT}
      style={{ position: 'absolute', inset: 0 }}
    >
      <defs>
        <InkBoil id="ink-boil-field" amount={boil} />
      </defs>
      <g
        filter="url(#ink-boil-field)"
        fill="none"
        stroke={ink}
        strokeWidth={strokeWidth * 0.7}
        strokeLinecap="round"
      >
        {Array.from({ length: LINES }, (_, i) => (
          <path key={i} d={linePath(i, progress)} />
        ))}
      </g>
    </svg>
  );
}

function linePath(index: number, progress: number) {
  const baseY = 30 + (index * (HEIGHT - 60)) / (LINES - 1);
  const points = Array.from({ length: POINTS + 1 }, (_, j) => {
    const u = j / POINTS;
    // Pinned ends keep the field a calm block instead of a flapping ribbon.
    const envelope = Math.sin(Math.PI * u) ** 2;
    const phase = 2 * Math.PI * (u * 1.1 - progress) + index * 0.32;
    return `${(u * WIDTH).toFixed(1)} ${(baseY + AMPLITUDE * envelope * Math.sin(phase)).toFixed(1)}`;
  });
  return `M ${points.join(' L ')}`;
}
