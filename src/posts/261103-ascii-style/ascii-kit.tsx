import type { ReactNode } from 'react';

import { COLOR, MONO } from '../../carousel/carousel-parts';
import type { AsciiGridProps } from './ascii-style.type';

export const INK = {
  dim: 'rgba(249, 250, 251, 0.22)',
  soft: 'rgba(249, 250, 251, 0.6)',
  /** Dark text on a filled light surface. */
  dark: '#0B1218',
};

// The post keeps its short names; the shared versions also drive the `ascii` background and highlight.
export {
  ASCII_RAMP as RAMP,
  asciiNoiseChar as noiseChar,
  asciiRampChar as rampChar,
  asciiWaveField as waveField,
  clamp01,
} from '../../carousel/carousel-ascii';

// *** AsciiSvg ***
/** The box every ASCII art draws in. */
export function AsciiSvg({
  width,
  height,
  fit = 'xMidYMid meet',
  children,
}: {
  width: number;
  height: number;
  fit?: string;
  children: ReactNode;
}) {
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height="100%"
      preserveAspectRatio={fit}
      style={{ position: 'absolute', inset: 0 }}
    >
      {children}
    </svg>
  );
}

// *** AsciiGrid ***
/**
 * Lines of text on an exact grid. Each character gets its own x, so the grid
 * stays even whatever the font's width is.
 */
export function AsciiGrid({
  lines,
  x,
  y,
  cell,
  fontSize,
  color = COLOR.text,
  colorAt,
  anchor = 'start',
}: AsciiGridProps) {
  const widest = Math.max(...lines.map((line) => line.length));
  const left = anchor === 'middle' ? x - (widest * cell.width) / 2 : x;
  return (
    <text fontFamily={MONO} fontSize={fontSize} textAnchor="middle">
      {lines.flatMap((line, row) =>
        gridRuns(line, row, colorAt).map((run) => (
          <tspan
            key={`${row}-${run.start}`}
            x={run.chars
              .map((_, i) => left + (run.start + i + 0.5) * cell.width)
              .join(' ')}
            y={y + (row + 0.8) * cell.height}
            fill={run.color ?? color}
          >
            {run.chars.join('')}
          </tspan>
        )),
      )}
    </text>
  );
}

/** Groups the characters next to each other that share a colour; spaces are skipped. */
function gridRuns(
  line: string,
  row: number,
  colorAt: AsciiGridProps['colorAt'],
) {
  type Run = { start: number; chars: string[]; color?: string };
  return Array.from(line).reduce<Run[]>((runs, char, col) => {
    if (char === ' ') return runs;
    const color = colorAt?.(row, col, char);
    const last = runs.at(-1);
    if (
      last &&
      last.color === color &&
      last.start + last.chars.length === col
    ) {
      return [...runs.slice(0, -1), { ...last, chars: [...last.chars, char] }];
    }
    return [...runs, { start: col, chars: [char], color }];
  }, []);
}
