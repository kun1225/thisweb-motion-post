import { Easing, interpolate, random } from 'remotion';

import { CLAMP_EASE } from '../../carousel/carousel-line-art';
import { COLOR, MONO } from '../../carousel/carousel-parts';
import type { CarouselLineArtProps } from '../../carousel/carousel.type';
import { AsciiSvg, INK, clamp01 } from './ascii-kit';

const BOX = { width: 860, height: 460 };
const BUTTON = { x: 130, y: 150, width: 600, height: 120, split: 440 };
const PIXEL = 20;
const GRID = { cols: BUTTON.width / PIXEL, rows: BUTTON.height / PIXEL };
/** Two hovers per slide, so the effect is easy to catch. */
const CYCLES = 2;
const CYCLE_FRAMES = 120;
const BEAT = {
  arrive: [8, 28],
  fillIn: [26, 44],
  leave: [76, 96],
  fillOut: [80, 98],
} as const;
// Most of a pixel's delay comes from its column, so the fill sweeps left to right.
const SWEEP = 0.6;
const SPREAD = 0.4;
const SHADES = 4;

/**
 * An outlined button. On hover, grey pixels fill it from left to right and the label flips
 * to dark; on leave, the pixels clear the same way.
 */
export function ButtonArt({ progress }: CarouselLineArtProps) {
  const frame = ((progress * CYCLES) % 1) * CYCLE_FRAMES;
  const fillIn = clamp01(
    (frame - BEAT.fillIn[0]) / (BEAT.fillIn[1] - BEAT.fillIn[0]),
  );
  const fillOut = clamp01(
    (frame - BEAT.fillOut[0]) / (BEAT.fillOut[1] - BEAT.fillOut[0]),
  );
  const pixels = buttonPixels(fillIn, fillOut);
  const move = interpolate(
    frame,
    [...BEAT.arrive, ...BEAT.leave],
    [0, 1, 1, 0],
    { ...CLAMP_EASE, easing: Easing.inOut(Easing.cubic) },
  );
  return (
    <AsciiSvg width={BOX.width} height={BOX.height}>
      <defs>
        <mask id="ascii-button-pixels">
          <Pixels pixels={pixels} fill="#fff" />
        </mask>
      </defs>
      <ButtonLabel color={COLOR.text} />
      <Pixels pixels={pixels} fill={COLOR.text} />
      <g mask="url(#ascii-button-pixels)">
        <ButtonLabel color={INK.dark} />
      </g>
      <rect
        x={BUTTON.x}
        y={BUTTON.y}
        width={BUTTON.width}
        height={BUTTON.height}
        fill="none"
        stroke={INK.soft}
        strokeWidth={2}
      />
      <rect
        x={interpolate(move, [0, 1], [500, 470])}
        y={interpolate(move, [0, 1], [400, 240])}
        width={22}
        height={22}
        fill={COLOR.highlight}
      />
    </AsciiSvg>
  );
}

type Pixel = { col: number; row: number; level: number };

/** How much of each pixel shows, in a few grey steps so it reads as pixels, not a fade. */
function buttonPixels(fillIn: number, fillOut: number): Pixel[] {
  return Array.from({ length: GRID.cols * GRID.rows }, (_, i) => {
    const col = i % GRID.cols;
    const row = Math.floor(i / GRID.cols);
    const delay = (col / GRID.cols) * SWEEP + random(`button-${i}`) * SPREAD;
    const shown = (amount: number) =>
      clamp01((amount * (1 + SPREAD) - delay) / SPREAD);
    const level = clamp01(shown(fillIn) - shown(fillOut));
    return { col, row, level: Math.round(level * SHADES) / SHADES };
  }).filter((pixel) => pixel.level > 0);
}

function Pixels({ pixels, fill }: { pixels: Pixel[]; fill: string }) {
  return (
    // Without crisp edges, thin seams show between neighbouring pixels.
    <g fill={fill} shapeRendering="crispEdges">
      {pixels.map(({ col, row, level }) => (
        <rect
          key={`${col}-${row}`}
          x={BUTTON.x + col * PIXEL}
          y={BUTTON.y + row * PIXEL}
          width={PIXEL}
          height={PIXEL}
          fillOpacity={level}
        />
      ))}
    </g>
  );
}

function ButtonLabel({ color }: { color: string }) {
  const middle = BUTTON.y + BUTTON.height / 2;
  return (
    <g fill={color} fontFamily={MONO}>
      <text
        x={BUTTON.x + 56}
        y={middle + 13}
        fontSize={38}
        letterSpacing="0.08em"
      >
        LEARN MORE
      </text>
      <line
        x1={BUTTON.x + BUTTON.split}
        x2={BUTTON.x + BUTTON.split}
        y1={BUTTON.y + 24}
        y2={BUTTON.y + BUTTON.height - 24}
        stroke={color}
        strokeWidth={2}
        strokeDasharray="6 8"
      />
      <text
        x={BUTTON.x + (BUTTON.split + BUTTON.width) / 2}
        y={middle + 14}
        fontSize={44}
        textAnchor="middle"
      >
        →
      </text>
    </g>
  );
}
