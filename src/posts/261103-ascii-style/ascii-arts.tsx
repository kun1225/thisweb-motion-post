import { interpolate } from 'remotion';

import { CLAMP_EASE } from '../../carousel/carousel-line-art';
import { CAROUSEL_SIZE, COLOR } from '../../carousel/carousel-parts';
import type {
  CarouselLineArtProps,
  CarouselPost,
} from '../../carousel/carousel.type';
import { ButtonArt } from './ascii-button-art';
import { SkeletonArt } from './ascii-skeleton-art';
import {
  AsciiGrid,
  AsciiSvg,
  INK,
  clamp01,
  rampChar,
  waveField,
} from './ascii-kit';

/** Each one starts where it ends, so the slide loops without a jump. */
export const ASCII_ARTS: NonNullable<CarouselPost['arts']> = {
  wave: WaveArt,
  field: FieldArt,
  button: ButtonArt,
  image: ImageArt,
  loading: LoadingArt,
  skeleton: SkeletonArt,
};

// *** WaveArt ***
const WAVE = { width: 860, height: 300 };
const WAVE_CELL = { width: 16, height: 25 };

/** A strip of the character wave, under the text. */
function WaveArt({
  progress,
  color,
  accent = COLOR.title,
}: CarouselLineArtProps) {
  const values = waveField(
    progress,
    Math.floor(WAVE.width / WAVE_CELL.width),
    Math.floor(WAVE.height / WAVE_CELL.height),
  );
  return (
    <AsciiSvg width={WAVE.width} height={WAVE.height} fit="xMidYMax meet">
      <AsciiGrid
        lines={values.map((row) => row.map(rampChar).join(''))}
        x={0}
        y={0}
        cell={WAVE_CELL}
        fontSize={20}
        color={color}
        colorAt={(row, col) =>
          (values[row]?.[col] ?? 0) > 0.6 ? accent : undefined
        }
      />
    </AsciiSvg>
  );
}

// *** FieldArt ***
const FIELD_CELL = { width: 18, height: 28 };
const FIELD_GRID = {
  cols: Math.ceil(CAROUSEL_SIZE.width / FIELD_CELL.width),
  rows: Math.ceil(CAROUSEL_SIZE.height / FIELD_CELL.height),
};

/** The character wave over the whole slide, faded in the middle so the text on top stays easy to read. */
function FieldArt({
  progress,
  color,
  accent = COLOR.title,
}: CarouselLineArtProps) {
  const values = waveField(progress, FIELD_GRID.cols, FIELD_GRID.rows);
  return (
    <AsciiSvg
      width={CAROUSEL_SIZE.width}
      height={CAROUSEL_SIZE.height}
      fit="xMidYMid slice"
    >
      <defs>
        <radialGradient id="ascii-field-fade" r={0.7}>
          <stop offset="0.35" stopColor="#fff" stopOpacity={0} />
          <stop offset="1" stopColor="#fff" />
        </radialGradient>
        <mask id="ascii-field-mask">
          <rect width="100%" height="100%" fill="url(#ascii-field-fade)" />
        </mask>
      </defs>
      <g mask="url(#ascii-field-mask)">
        <AsciiGrid
          lines={values.map((row) => row.map(rampChar).join(''))}
          x={0}
          y={0}
          cell={FIELD_CELL}
          fontSize={22}
          color={color}
          colorAt={(row, col) =>
            (values[row]?.[col] ?? 0) > 0.6 ? accent : undefined
          }
        />
      </g>
    </AsciiSvg>
  );
}

// *** ImageArt ***
const SCENE = { width: 860, height: 460 };
const SPHERE = { r: 160, y: 230, image: 200, text: 660 };
const SPHERE_CELL = { width: 12, height: 20 };

/** A lit ball as an image, and the same ball as characters, picked by how bright each cell is. */
function ImageArt({ progress }: CarouselLineArtProps) {
  const light = lightAt(progress);
  const lines = sphereLines(light);
  return (
    <AsciiSvg width={SCENE.width} height={SCENE.height}>
      <defs>
        <radialGradient
          id="ascii-ball"
          fx={0.5 + light.x * 0.35}
          fy={0.5 + light.y * 0.35}
          r={0.75}
        >
          <stop offset="0" stopColor="#F9FAFB" />
          <stop offset="0.45" stopColor="#6B7280" />
          <stop offset="1" stopColor="#0B0F14" />
        </radialGradient>
      </defs>
      <circle
        cx={SPHERE.image}
        cy={SPHERE.y}
        r={SPHERE.r}
        fill="url(#ascii-ball)"
      />
      <AsciiGrid
        lines={['→']}
        x={SCENE.width / 2}
        y={SPHERE.y - 30}
        anchor="middle"
        cell={{ width: 48, height: 48 }}
        fontSize={48}
        color={INK.soft}
      />
      <AsciiGrid
        lines={lines}
        x={SPHERE.text}
        y={SPHERE.y - (lines.length * SPHERE_CELL.height) / 2}
        anchor="middle"
        cell={SPHERE_CELL}
        fontSize={17}
        color={COLOR.title}
        colorAt={(_, __, char) =>
          '#%@'.includes(char) ? COLOR.text : undefined
        }
      />
    </AsciiSvg>
  );
}

/** The light circles above the ball once per slide. */
function lightAt(progress: number) {
  const angle = progress * Math.PI * 2;
  const x = Math.cos(angle) * 0.7;
  const y = Math.sin(angle) * 0.4 - 0.35;
  return { x, y, z: Math.sqrt(Math.max(0, 1 - x * x - y * y)) };
}

function sphereLines(light: ReturnType<typeof lightAt>) {
  const cols = Math.ceil((SPHERE.r * 2) / SPHERE_CELL.width);
  const rows = Math.ceil((SPHERE.r * 2) / SPHERE_CELL.height);
  return Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => {
      const nx = ((col + 0.5) * SPHERE_CELL.width - SPHERE.r) / SPHERE.r;
      const ny = ((row + 0.5) * SPHERE_CELL.height - SPHERE.r) / SPHERE.r;
      const outside = nx * nx + ny * ny;
      if (outside > 1) return ' ';
      const nz = Math.sqrt(1 - outside);
      const lit = clamp01(nx * light.x + ny * light.y + nz * light.z);
      // Keeps the dark side faintly visible, like the edge of the image.
      return rampChar(0.08 + lit * 0.92);
    }).join(''),
  );
}

// *** LoadingArt ***
const COMMAND = '$ pnpm build';
const BAR_WIDTH = 24;
const SPINNER = '|/-\\';
const LOADING_CELL = { width: 20.4, height: 64 };
const LOADING_FRAMES = 240;
const LOAD_START = 24;
// Stalls on the way, like a real build.
const LOAD_FRAMES = [LOAD_START, 60, 80, 130, 150, 200];
const LOAD_PROGRESS = [0, 0.35, 0.4, 0.8, 0.82, 1];

/** A command types in, a spinner turns, and a `[####....]` bar fills to 100%. */
function LoadingArt({ progress }: CarouselLineArtProps) {
  const frame = progress * LOADING_FRAMES;
  const typed = Math.round(clamp01(frame / LOAD_START) * COMMAND.length);
  const loaded = interpolate(frame, LOAD_FRAMES, LOAD_PROGRESS, CLAMP_EASE);
  const started = frame >= LOAD_START;
  const done = loaded === 1;
  const filled = Math.round(loaded * BAR_WIDTH);
  const spinner = SPINNER[Math.floor(frame / 4) % SPINNER.length];
  const lines = [
    COMMAND.slice(0, typed),
    started ? (done ? '✓ Done in 5.9s' : `${spinner} Loading assets`) : '',
    started
      ? `[${'#'.repeat(filled)}${'.'.repeat(BAR_WIDTH - filled)}] ${String(Math.round(loaded * 100)).padStart(3)}%`
      : '',
  ];
  return (
    <AsciiSvg width={SCENE.width} height={SCENE.height}>
      <AsciiGrid
        lines={lines}
        x={(SCENE.width - 31 * LOADING_CELL.width) / 2}
        y={(SCENE.height - lines.length * LOADING_CELL.height) / 2}
        cell={LOADING_CELL}
        fontSize={34}
        color={INK.soft}
        colorAt={(row, _, char) => {
          if (row === 1 && done) return COLOR.title;
          if (row === 1 && SPINNER.includes(char)) return COLOR.highlight;
          if (row === 2 && char === '#') return COLOR.title;
          if (row === 2 && char === '.') return INK.dim;
          return undefined;
        }}
      />
    </AsciiSvg>
  );
}
