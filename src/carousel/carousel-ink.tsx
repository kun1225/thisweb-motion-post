import { createContext, useContext } from 'react';
import type { SVGProps } from 'react';
import { getSubpaths } from '@remotion/paths';
import { getStroke } from 'perfect-freehand';

/** The ink colours and average line width, set by `ArtSvg` for every `InkPath` inside it. */
export const InkContext = createContext({
  color: '#F9FAFB',
  accent: '#F9FAFB',
  width: 3,
});

/**
 * A hand-inked line: it swells and thins along the way and tapers at loose ends, like a brush pen.
 * `from` and `to` (0 to 1 along each subpath) show only part of it, for lines that draw themselves.
 * `accent` draws it in the second ink colour.
 */
export function InkPath({
  d,
  from = 0,
  to = 1,
  accent = false,
  ...rest
}: Omit<SVGProps<SVGPathElement>, 'd' | 'from' | 'to'> & {
  d: string;
  from?: number;
  to?: number;
  accent?: boolean;
}) {
  const ink = useContext(InkContext);
  const { width } = ink;
  const color = accent ? ink.accent : ink.color;
  if (to <= from) return null;
  const outline = getSubpaths(d)
    .map((subpath) => inkOutline(subpath, from, to, width))
    .join(' ');
  return <path {...rest} d={outline} fill={color} stroke="none" />;
}

const STEP = 4;
const TAPER = 6;

function inkOutline(d: string, from: number, to: number, width: number) {
  const path = samplerPath(d);
  const length = path.getTotalLength();
  const start = from * length;
  const span = (to - from) * length;
  const count = Math.max(2, Math.ceil(span / STEP));
  const points = Array.from({ length: count + 1 }, (_, i) =>
    path.getPointAtLength(start + (span * i) / count),
  );
  const first = points[0];
  const last = points[count];
  // A closed shape has no loose end, so a taper would leave a gap where it meets itself.
  const closed =
    first !== undefined &&
    last !== undefined &&
    Math.hypot(first.x - last.x, first.y - last.y) < 0.5;
  const taper = closed ? 0 : Math.min(span / 3, width * TAPER);
  return outlinePath(
    getStroke(
      points.map(({ x, y }) => [x, y, pressureAt(x, y)]),
      {
        size: width * 1.25,
        thinning: 0.8,
        smoothing: 0.5,
        streamline: 0.15,
        simulatePressure: false,
        start: { taper },
        end: { taper },
        last: true,
      },
    ),
  );
}

// Tied to the place, not the order of the points, so a moving or growing line keeps its thick and thin parts.
function pressureAt(x: number, y: number) {
  return (
    0.5 +
    0.25 * Math.sin(x * 0.031 + y * 0.017) +
    0.2 * Math.sin(x * 0.012 - y * 0.027 + 1.7)
  );
}

// The browser measures paths natively; parsing them in JS (`@remotion/paths`) cost 60 ms a frame for the field art.
let sampler: SVGPathElement | undefined;
function samplerPath(d: string) {
  sampler ??= document.createElementNS('http://www.w3.org/2000/svg', 'path');
  sampler.setAttribute('d', d);
  return sampler;
}

function outlinePath(points: number[][]) {
  if (points.length === 0) return '';
  const coords = points.map(
    ([x = 0, y = 0]) => `${x.toFixed(1)} ${y.toFixed(1)}`,
  );
  return `M ${coords.join(' L ')} Z`;
}
