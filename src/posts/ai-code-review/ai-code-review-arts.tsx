import type { ReactNode } from 'react';
import { Easing, interpolate } from 'remotion';

import type {
  CarouselLineArtProps,
  CarouselPost,
} from '../../carousel/carousel.type';
import { InkPath } from '../../carousel/carousel-ink';
import {
  ArtSvg,
  CLAMP_EASE,
  circlePath,
} from '../../carousel/carousel-line-art';

/**
 * One drawing per slide, each showing that slide's idea in a few lines.
 * Each one starts and ends empty (or at rest), so the slide loops without a jump.
 */
export const AI_CODE_REVIEW_ARTS: NonNullable<CarouselPost['arts']> = {
  points: PointsArt,
  verify: VerifyArt,
  layers: LayersArt,
  risk: RiskArt,
  loop: LoopArt,
  learn: LearnArt,
  direction: DirectionArt,
  reply: ReplyArt,
};

// *** PointsArt ***
const POINTS = { count: 6, x: 80, gap: 140, y: 120, r: 16 };

/** Six points joined one by one, like the six ideas in this post. */
function PointsArt({ progress, color, ...props }: CarouselLineArtProps) {
  const last = POINTS.count - 1;
  // Head and tail start before the first dot and end past the last, so every dot is empty at the loop point.
  const head = ramp(progress, 0.05, 0.6) * (last + 0.6) - 0.3;
  const tail = ramp(progress, 0.68, 0.95) * (last + 0.6) - 0.3;
  return (
    <ArtSvg {...props} color={color} id="points" width={860} height={240}>
      {Array.from({ length: POINTS.count }, (_, i) => {
        const x = POINTS.x + i * POINTS.gap;
        const fill = Math.min(
          clamp01((head - i) / 0.3),
          1 - clamp01((tail - i) / 0.3),
        );
        return (
          <g key={x}>
            <InkPath d={circlePath(x, POINTS.y, POINTS.r)} />
            <Dot x={x} y={POINTS.y} r={POINTS.r * 0.5 * fill} color={color} />
            {i < last && (
              <InkPath
                d={`M ${x + POINTS.r + 10} ${POINTS.y} H ${x + POINTS.gap - POINTS.r - 10}`}
                from={clamp01(tail - i)}
                to={clamp01(head - i)}
              />
            )}
          </g>
        );
      })}
    </ArtSvg>
  );
}

// *** VerifyArt ***
const PAGE = { x: 330, y: 20, w: 200, h: 300 };
const CODE_WIDTHS = [110, 70, 130, 90, 50];
const SCANS = [
  { range: [0.06, 0.3], dashed: false },
  // The second pass is the fresh agent, so it gets its own line style.
  { range: [0.36, 0.6], dashed: true },
] as const;
// Ink has no dash pattern, so a dashed line is drawn as its pieces: 14 on, 12 off.
const SCAN_LENGTH = PAGE.w + 68;
const SCAN_DASHES = Array.from(
  { length: Math.ceil(SCAN_LENGTH / 26) },
  (_, i) => [(i * 26) / SCAN_LENGTH, Math.min((i * 26 + 14) / SCAN_LENGTH, 1)],
);

/** A page of code scanned twice, then checked off. */
function VerifyArt({ progress, ...props }: CarouselLineArtProps) {
  return (
    <ArtSvg {...props} id="verify" width={860} height={360}>
      <InkPath d={roundedRect(PAGE.x, PAGE.y, PAGE.w, PAGE.h, 20)} />
      {CODE_WIDTHS.map((width, i) => {
        const x = PAGE.x + 36;
        const y = PAGE.y + 64 + i * 46;
        return <InkPath key={y} d={`M ${x} ${y} H ${x + width}`} />;
      })}
      {SCANS.map(({ range, dashed }) => {
        const t = ramp(progress, range[0], range[1]);
        const y = PAGE.y + 20 + t * (PAGE.h - 40);
        const d = `M ${PAGE.x - 34} ${y} H ${PAGE.x + PAGE.w + 34}`;
        return (
          <g key={range[0]} opacity={Math.sin(Math.PI * t)}>
            {dashed ? (
              SCAN_DASHES.map(([from, to]) => (
                <InkPath key={from} d={d} from={from} to={to} />
              ))
            ) : (
              <InkPath d={d} />
            )}
          </g>
        );
      })}
      <InkPath
        d="M 600 190 L 640 230 L 730 130"
        from={ramp(progress, 0.86, 0.96)}
        to={ramp(progress, 0.64, 0.74)}
      />
    </ArtSvg>
  );
}

// *** LayersArt ***
const GATES = { count: 6, left: 50, right: 290, top: 50, gap: 46 };

/** A change drops through six gates; each one bends as it checks it. */
function LayersArt({ progress, color, ...props }: CarouselLineArtProps) {
  const middle = (GATES.left + GATES.right) / 2;
  const dotY = 10 + ramp(progress, 0.06, 0.82) * 310;
  const dotOpacity = Math.min(
    ramp(progress, 0, 0.06),
    1 - ramp(progress, 0.82, 0.92),
  );
  return (
    <ArtSvg {...props} color={color} id="layers" width={340} height={340}>
      {Array.from({ length: GATES.count }, (_, i) => {
        const y = GATES.top + i * GATES.gap;
        const dip = 16 * Math.exp(-(((dotY - y) / 22) ** 2));
        return (
          <InkPath
            key={y}
            d={`M ${GATES.left} ${y} Q ${middle} ${y + 2 * dip} ${GATES.right} ${y}`}
          />
        );
      })}
      <g opacity={dotOpacity}>
        <Dot x={middle} y={dotY} r={9} color={color} />
      </g>
    </ArtSvg>
  );
}

// *** RiskArt ***
const RISK_BASE = 340;
const RISK_BARS = [
  { x: 270, height: 80, people: 0 },
  { x: 430, height: 160, people: 1 },
  { x: 590, height: 240, people: 2 },
];

/** Three bars for low, mid and high risk. Higher risk needs more people. */
function RiskArt({ progress, ...props }: CarouselLineArtProps) {
  const erase = ramp(progress, 0.84, 0.96);
  return (
    <ArtSvg {...props} id="risk" width={860} height={360}>
      <InkPath d={`M 170 ${RISK_BASE} H 690`} />
      {RISK_BARS.map(({ x, height, people }, i) => {
        const top = RISK_BASE - height;
        const start = 0.05 + i * 0.14;
        const pop = ramp(progress, start + 0.17, start + 0.25) * (1 - erase);
        return (
          <g key={x}>
            <InkPath
              d={`M ${x - 50} ${RISK_BASE} V ${top} H ${x + 50} V ${RISK_BASE}`}
              from={erase}
              to={ramp(progress, start, start + 0.2)}
            />
            <g
              transform={`translate(${x} ${top}) scale(${pop})`}
              visibility={pop > 0 ? 'visible' : 'hidden'}
            >
              {people === 0 ? (
                // No people: the AI checks are enough.
                <InkPath d="M -22 -34 L -6 -18 L 24 -50" />
              ) : (
                Array.from({ length: people }, (_, p) => (
                  <Person key={p} x={(p - (people - 1) / 2) * 56} />
                ))
              )}
            </g>
          </g>
        );
      })}
    </ArtSvg>
  );
}

function Person({ x }: { x: number }) {
  return (
    <>
      <InkPath d={circlePath(x, -56, 13)} />
      <InkPath d={`M ${x - 22} -16 A 22 22 0 0 1 ${x + 22} -16`} />
    </>
  );
}

// *** LoopArt ***
// The slide's own size, so on a `full` slide the path can run round the text instead of over it.
const LOOP = { width: 1080, height: 1350, x: 130, y: 230, r: 80, step: 34 };
const LOOP_LAPS = 3;
const LOOP_EXIT = { x: 1010, turn: 110, end: 1180 };
const LOOP_POINTS = loopPoints();
const LOOP_LENGTHS = runningLengths(LOOP_POINTS);
const LOOP_PATH = `M ${LOOP_POINTS.map(({ x, y }) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L ')}`;

/** An arrow loops three times along the top, like three review rounds, then breaks out down to the bottom right. */
function LoopArt({ progress, ...props }: CarouselLineArtProps) {
  // The tail chases the head, so the arrow travels instead of piling up, and the slide ends empty.
  const head = ramp(progress, 0.04, 0.75);
  const tail = ramp(progress, 0.25, 0.95);
  const tip = loopPointAt(head);
  return (
    <ArtSvg {...props} id="loop" width={LOOP.width} height={LOOP.height}>
      <InkPath d={LOOP_PATH} from={tail} to={head} />
      <g opacity={clamp01((1 - tail) * 20)}>
        <InkPath
          d="M -30 -22 L 0 0 L -30 22"
          transform={`translate(${tip.x} ${tip.y}) rotate(${tip.angle})`}
        />
      </g>
    </ArtSvg>
  );
}

type Point = { x: number; y: number };

function loopPoints(): Point[] {
  const steps = 240;
  const startX = LOOP.x - LOOP.step * Math.PI;
  // A stretched cycloid: it rolls forward but swings back at the top of each lap, which draws the loops.
  const loops = Array.from({ length: steps + 1 }, (_, i) => {
    const t = Math.PI + (i / steps) * 2 * Math.PI * LOOP_LAPS;
    return {
      x: startX + LOOP.step * t - LOOP.r * Math.sin(t),
      y: LOOP.y - LOOP.r * Math.cos(t),
    };
  });
  const bottom = LOOP.y + LOOP.r;
  const corner = {
    x: LOOP_EXIT.x - LOOP_EXIT.turn,
    y: bottom + LOOP_EXIT.turn,
  };
  const bend = Array.from({ length: 13 }, (_, i) => {
    const angle = -Math.PI / 2 + (i / 12) * (Math.PI / 2);
    return {
      x: corner.x + LOOP_EXIT.turn * Math.cos(angle),
      y: corner.y + LOOP_EXIT.turn * Math.sin(angle),
    };
  });
  return [
    { x: -60, y: bottom },
    ...loops,
    ...bend,
    { x: LOOP_EXIT.x, y: LOOP_EXIT.end },
  ];
}

function runningLengths(points: Point[]) {
  return points.reduce<number[]>((lengths, point, i) => {
    const before = points[i - 1] ?? point;
    const total = lengths[i - 1] ?? 0;
    return [
      ...lengths,
      total + Math.hypot(point.x - before.x, point.y - before.y),
    ];
  }, []);
}

/** Where the head is at `at` (0 to 1 along the path), and which way it points in degrees. */
function loopPointAt(at: number) {
  const total = LOOP_LENGTHS[LOOP_LENGTHS.length - 1] ?? 0;
  const length = at * total;
  const i = Math.max(
    LOOP_LENGTHS.findIndex((value) => value >= length),
    1,
  );
  const a = LOOP_POINTS[i - 1] ?? { x: 0, y: 0 };
  const b = LOOP_POINTS[i] ?? a;
  const start = LOOP_LENGTHS[i - 1] ?? 0;
  const share = (length - start) / ((LOOP_LENGTHS[i] ?? start) - start || 1);
  return {
    x: a.x + (b.x - a.x) * share,
    y: a.y + (b.y - a.y) * share,
    angle: (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI,
  };
}

// *** LearnArt ***
const DOC = { x: 520, y: 30, w: 220, h: 300 };
const RULE_WIDTHS = [130, 100, 150];
const BUG = { x: 200, y: 180, size: 22 };

/** Each bug travels into the rule book and becomes a new rule. */
function LearnArt({ progress, ...props }: CarouselLineArtProps) {
  const fade = 1 - ramp(progress, 0.86, 0.96);
  return (
    <ArtSvg {...props} id="learn" width={860} height={360}>
      <InkPath d={roundedRect(DOC.x, DOC.y, DOC.w, DOC.h, 20)} />
      <InkPath
        d={`M 290 ${BUG.y} H 440 M 418 ${BUG.y - 22} L 440 ${BUG.y} L 418 ${BUG.y + 22}`}
      />
      <g opacity={fade}>
        {RULE_WIDTHS.map((width, i) => {
          const start = 0.06 + i * 0.25;
          const move = ramp(progress, start + 0.07, start + 0.15);
          const rule = ramp(progress, start + 0.14, start + 0.22);
          const ruleX = DOC.x + 40;
          const ruleY = DOC.y + 70 + i * 70;
          const x = BUG.x + move * (ruleX - BUG.x);
          const y = BUG.y + move * (ruleY - BUG.y);
          const scale = ramp(progress, start, start + 0.05) * (1 - move * 0.6);
          const s = BUG.size;
          return (
            <g key={ruleY}>
              <InkPath
                d={`M ${-s} ${-s} L ${s} ${s} M ${s} ${-s} L ${-s} ${s}`}
                transform={`translate(${x} ${y}) scale(${scale})`}
                visibility={scale > 0 && rule === 0 ? 'visible' : 'hidden'}
              />
              <InkPath d={`M ${ruleX} ${ruleY} H ${ruleX + width}`} to={rule} />
            </g>
          );
        })}
      </g>
    </ArtSvg>
  );
}

// *** DirectionArt ***
const COMPASS = { x: 430, y: 180, r: 150 };
const HEADINGS = [-35, 30, -15, 50];
const SWING = Easing.out(Easing.back(1.8));

/** A compass needle swings to a new heading, settles, and swings again. */
function DirectionArt({ progress, color, ...props }: CarouselLineArtProps) {
  const step = Math.floor(progress * HEADINGS.length) % HEADINGS.length;
  const t = progress * HEADINGS.length - Math.floor(progress * HEADINGS.length);
  const turn = interpolate(t, [0, 0.5], [0, 1], {
    easing: SWING,
    extrapolateRight: 'clamp',
  });
  const from = HEADINGS[step] ?? 0;
  const to = HEADINGS[(step + 1) % HEADINGS.length] ?? 0;
  return (
    <ArtSvg {...props} color={color} id="direction" width={860} height={360}>
      <InkPath d={circlePath(COMPASS.x, COMPASS.y, COMPASS.r)} />
      {[0, 90, 180, 270].map((tick) => (
        <InkPath
          key={tick}
          d={`M 0 ${-COMPASS.r} V ${-COMPASS.r + 20}`}
          transform={`translate(${COMPASS.x} ${COMPASS.y}) rotate(${tick})`}
        />
      ))}
      <g
        transform={`translate(${COMPASS.x} ${COMPASS.y}) rotate(${from + (to - from) * turn})`}
      >
        <InkPath d="M 0 -112 L 18 0 L 0 112 L -18 0 Z" />
        <path d="M 0 -112 L 18 0 L -18 0 Z" fill={color} stroke="none" />
      </g>
      <Dot x={COMPASS.x} y={COMPASS.y} r={7} color={color} />
    </ArtSvg>
  );
}

// *** ReplyArt ***
const BUBBLE_PATH =
  'M 330 100 H 530 A 40 40 0 0 1 570 140 V 260 A 40 40 0 0 1 530 300 H 380 L 320 360 L 335 300 H 330 A 40 40 0 0 1 290 260 V 140 A 40 40 0 0 1 330 100 Z';

/** A speech bubble draws itself, and three dots type a reply. */
function ReplyArt({ progress, color, ...props }: CarouselLineArtProps) {
  const hide = 1 - ramp(progress, 0.7, 0.76);
  return (
    <ArtSvg {...props} color={color} id="reply" width={860} height={460}>
      <InkPath
        d={BUBBLE_PATH}
        from={ramp(progress, 0.72, 0.95)}
        to={ramp(progress, 0.04, 0.38)}
      />
      {[0, 1, 2].map((i) => {
        const start = 0.4 + i * 0.06;
        const size = ramp(progress, start, start + 0.06) * hide;
        const bounce = Math.max(
          0,
          Math.sin(2 * Math.PI * (progress * 5 - i / 6)),
        );
        return (
          <Dot
            key={i}
            x={370 + i * 60}
            y={200 - 10 * bounce}
            r={13 * size}
            color={color}
          />
        );
      })}
    </ArtSvg>
  );
}

// *** Shared ***
function Dot({
  x,
  y,
  r,
  color,
}: {
  x: number;
  y: number;
  r: number;
  color: string;
}): ReactNode {
  if (r <= 0) return null;
  return <path d={circlePath(x, y, r)} fill={color} stroke="none" />;
}

function ramp(progress: number, from: number, to: number) {
  return interpolate(progress, [from, to], [0, 1], CLAMP_EASE);
}

function clamp01(value: number) {
  return Math.min(Math.max(value, 0), 1);
}

function roundedRect(x: number, y: number, w: number, h: number, r: number) {
  return `M ${x + r} ${y} H ${x + w - r} A ${r} ${r} 0 0 1 ${x + w} ${y + r} V ${y + h - r} A ${r} ${r} 0 0 1 ${x + w - r} ${y + h} H ${x + r} A ${r} ${r} 0 0 1 ${x} ${y + h - r} V ${y + r} A ${r} ${r} 0 0 1 ${x + r} ${y} Z`;
}
