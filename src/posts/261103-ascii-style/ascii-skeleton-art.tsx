import { COLOR } from '../../carousel/carousel-parts';
import type { CarouselLineArtProps } from '../../carousel/carousel.type';
import { AsciiGrid, AsciiSvg, INK, noiseChar } from './ascii-kit';

const POST_LINES = [
  '(@) this.web',
  '    2 min ago',
  '',
  '            /\\                   ',
  '      /\\   /  \\        .         ',
  '     /  \\_/    \\   /\\            ',
  '    /    \\      \\_/  \\___        ',
  '___/      \\___________   \\_______',
  '',
  'Text is the lightest loading',
  'state you can ship.',
  '#ascii #web',
];
const IMAGE_ROWS = [3, 4, 5, 6, 7];
const POST_WIDTH = Math.max(...POST_LINES.map((line) => line.length));
const SKELETON_LINES = POST_LINES.map((line, row) =>
  IMAGE_ROWS.includes(row) ? '░'.repeat(POST_WIDTH) : skeletonOf(line),
);
const CELL = { width: 18, height: 38 };
const CARD = {
  pad: 40,
  width: POST_WIDTH * CELL.width,
  height: POST_LINES.length * CELL.height,
};
const BOX = { width: 860, height: CARD.height + CARD.pad * 2 + 4 };
const SLIDE_FRAMES = 240;
const BEAT = { decode: 120, hide: 215 };
const SHIMMER_FRAMES = 60;

/** Grey blocks in the shape of a post, a shine sweeping across, then the real post decodes in. */
export function SkeletonArt({ progress }: CarouselLineArtProps) {
  const frame = progress * SLIDE_FRAMES;
  const left = (BOX.width - CARD.width) / 2;
  const lines = POST_LINES.map((line, row) =>
    Array.from(SKELETON_LINES[row] ?? '')
      .map((shape, col) =>
        skeletonCell(frame, row, col, shape, line[col] ?? ' '),
      )
      .join(''),
  );
  return (
    <AsciiSvg width={BOX.width} height={BOX.height}>
      <rect
        x={left - CARD.pad}
        y={2}
        width={CARD.width + CARD.pad * 2}
        height={CARD.height + CARD.pad * 2}
        rx={20}
        fill="rgba(255,255,255,0.03)"
        stroke="rgba(255,255,255,0.12)"
      />
      <AsciiGrid
        lines={lines}
        x={left}
        y={CARD.pad}
        cell={CELL}
        fontSize={28}
        color={INK.dim}
        colorAt={(row, _, char) => {
          if ('▒▓'.includes(char)) return INK.soft;
          if (char === '░') return undefined;
          if (IMAGE_ROWS.includes(row) || row === 0) return COLOR.title;
          if (row === POST_LINES.length - 1) return COLOR.highlight;
          return COLOR.text;
        }}
      />
    </AsciiSvg>
  );
}

function skeletonCell(
  frame: number,
  row: number,
  col: number,
  shape: string,
  real: string,
) {
  if (shape === ' ') return ' ';
  const lockAt = BEAT.decode + row * 2 + col * 0.5;
  const hideAt = BEAT.hide + row * 1.5;
  if (frame >= lockAt && frame < hideAt) return real;
  if (frame >= BEAT.decode && frame < lockAt) {
    return noiseChar(row * 100 + col, frame);
  }
  // A diagonal band of light, twice before the data arrives.
  const band =
    ((frame % SHIMMER_FRAMES) / SHIMMER_FRAMES) * (POST_WIDTH + 16) - 8;
  const distance = Math.abs(col + row * 0.6 - band);
  if (distance < 1) return '▓';
  if (distance < 3) return '▒';
  return shape;
}

/** The same line as blocks, from its first to its last character. */
function skeletonOf(line: string) {
  const start = line.search(/\S/);
  if (start === -1) return '';
  const end = line.trimEnd().length;
  return ' '.repeat(start) + '░'.repeat(end - start);
}
