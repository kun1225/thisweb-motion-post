import type { ReactNode } from 'react';
import { interpolate } from 'remotion';

import type {
  CarouselLineArtProps,
  CarouselPost,
} from '../../carousel/carousel.type';
import { InkPath } from '../../carousel/carousel-ink';
import { COLOR } from '../../carousel/carousel-parts';
import {
  ArtSvg,
  CLAMP_EASE,
  circlePath,
  roundedRect,
} from '../../carousel/carousel-line-art';

/**
 * One drawing per slide, each showing that slide's idea in a few lines.
 * Each one starts and ends empty (or at rest), so the slide loops without a jump.
 */
export const AI_CODE_REVIEW_ARTS: NonNullable<CarouselPost['arts']> = {
  bot: BotArt,
  verify: VerifyArt,
  runner: RunnerArt,
  risk: RiskArt,
  loop: LoopArt,
  learn: LearnArt,
  direction: DirectionArt,
};

// *** BotArt ***
const HEAD = { x: 320, y: 90, w: 220, h: 170, r: 40 };
const EYES = { y: 165, gap: 46, r: 14 };
const BLINKS = [
  [0.52, 0.56],
  [0.66, 0.7],
] as const;

/** A bot head draws itself, opens its eyes, blinks twice, then rubs itself out. */
function BotArt({
  progress,
  accent = COLOR.text,
  ...props
}: CarouselLineArtProps) {
  const middle = HEAD.x + HEAD.w / 2;
  // Antenna and ears grow out of the head and shrink back into it, so no loose dots show up at their tips.
  const head = ramp(progress, 0.04, 0.2);
  const parts = ramp(progress, 0.2, 0.3) * (1 - ramp(progress, 0.8, 0.86));
  const erase = ramp(progress, 0.86, 0.96);
  const fade = 1 - ramp(progress, 0.8, 0.86);
  const eyes = ramp(progress, 0.3, 0.36) * fade;
  const blinking = BLINKS.some(
    ([from, to]) => progress >= from && progress < to,
  );
  const glow = ramp(progress, 0.36, 0.42) * fade;
  return (
    <ArtSvg {...props} accent={accent} id="bot" width={860} height={300}>
      <InkPath
        d={roundedRect(HEAD.x, HEAD.y, HEAD.w, HEAD.h, HEAD.r)}
        from={erase}
        to={head}
      />
      <InkPath d={`M ${middle} ${HEAD.y} V ${HEAD.y - 40}`} to={parts} />
      <InkPath
        d={`M ${HEAD.x} 150 H ${HEAD.x - 24} V 200 H ${HEAD.x} M ${HEAD.x + HEAD.w} 150 H ${HEAD.x + HEAD.w + 24} V 200 H ${HEAD.x + HEAD.w}`}
        to={parts}
      />
      <Dot x={middle} y={HEAD.y - 52} r={12 * glow} color={accent} />
      {[-1, 1].map((side) => {
        const x = middle + side * EYES.gap;
        return blinking ? (
          <InkPath
            key={side}
            d={`M ${x - EYES.r} ${EYES.y} H ${x + EYES.r}`}
            accent
          />
        ) : (
          <Dot key={side} x={x} y={EYES.y} r={EYES.r * eyes} color={accent} />
        );
      })}
      <InkPath
        d={`M ${middle - 36} 215 Q ${middle} 238 ${middle + 36} 215`}
        to={ramp(progress, 0.36, 0.44) * fade}
        accent
      />
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
        return <InkPath key={y} d={`M ${x} ${y} H ${x + width}`} accent />;
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

// *** RunnerArt ***
const RUN = {
  ground: 225,
  // The stone sits at 3/4 of the 860 wide box.
  stone: 'M 618 225 C 618 197 638 185 656 187 C 674 189 678 209 678 225',
  offscreen: -60,
  tripX: 600,
  // He lands past the stone, so he doesn't lie on top of it.
  throwX: 84,
  stride: 90,
  lean: 8,
};
const RUN_TIMELINE = {
  forward: [0.03, 0.56],
  fall: [0.56, 0.64],
  getUp: [0.76, 0.82],
  turn: [0.82, 0.85],
  back: [0.85, 0.97],
} as const;
const BODY = { hip: 70, shoulder: 122, head: { y: 148, r: 17 } };
const LIMB = { thigh: 36, shin: 34, upper: 24, fore: 22 };

type Limb = [angle: number, bend: number];
type Pose = Record<'legA' | 'legB' | 'armA' | 'armB', Limb>;

const FLOP_POSE: Pose = {
  legA: [0.5, 0.3],
  legB: [-0.4, 0.3],
  armA: [2.6, 0.3],
  armB: [-2.4, 0.3],
};

/** A little guy runs right, trips on a stone at 3/4, then gets up and dashes back. */
function RunnerArt({
  progress,
  accent = COLOR.text,
  ...props
}: CarouselLineArtProps) {
  const { forward, fall, getUp, turn, back } = RUN_TIMELINE;
  const trip = ramp(progress, ...fall) ** 2;
  const rise = ramp(progress, ...getUp);
  const down = trip * (1 - rise);
  const facing = 1 - 2 * ramp(progress, ...turn);
  const dash = line(progress, ...back);
  const x =
    dash > 0
      ? lerp(RUN.tripX + RUN.throwX, RUN.offscreen, dash)
      : lerp(RUN.offscreen, RUN.tripX, line(progress, ...forward)) +
        RUN.throwX * trip;
  // Hop over the stone on the way back.
  const hop =
    50 * Math.sin(Math.PI * clamp01((694 - x) / 90)) * (dash > 0 ? 1 : 0);
  const stumble = 24 * Math.sin(Math.PI * trip) * (1 - rise);
  const angle = RUN.lean + (90 - RUN.lean) * down;
  const y = RUN.ground - hop - stumble - 10 * down;
  const phase = (2 * Math.PI * x * facing) / RUN.stride;
  return (
    <ArtSvg {...props} accent={accent} id="runner" width={860} height={240}>
      <InkPath d={`M 20 ${RUN.ground} H 840`} />
      <InkPath d={RUN.stone} />
      <g transform={`translate(${x} ${y}) scale(${facing} 1) rotate(${angle})`}>
        <Runner
          pose={mixPose(runPose(phase), FLOP_POSE, down)}
          accent={accent}
        />
      </g>
    </ArtSvg>
  );
}

function Runner({ pose, accent }: { pose: Pose; accent: string }) {
  const hip = { x: 0, y: -BODY.hip };
  const shoulder = { x: 0, y: -BODY.shoulder };
  return (
    <>
      <InkPath d={circlePath(0, -BODY.head.y, BODY.head.r)} accent />
      <InkPath d={`M ${shoulder.x} ${shoulder.y} V ${hip.y}`} />
      <InkPath d={limbPath(hip, pose.legA, LIMB.thigh, LIMB.shin)} />
      <InkPath d={limbPath(hip, pose.legB, LIMB.thigh, LIMB.shin)} />
      <InkPath d={limbPath(shoulder, pose.armA, LIMB.upper, LIMB.fore)} />
      <InkPath d={limbPath(shoulder, pose.armB, LIMB.upper, LIMB.fore)} />
    </>
  );
}

function runPose(phase: number): Pose {
  // The knee bends most while the leg swings forward, and each arm swings against its leg.
  const leg = (p: number): Limb => [
    0.75 * Math.sin(p),
    0.2 + 0.9 * Math.max(0, Math.cos(p)),
  ];
  const arm = (p: number): Limb => [-0.9 * Math.sin(p), -1.2];
  return {
    legA: leg(phase),
    legB: leg(phase + Math.PI),
    armA: arm(phase),
    armB: arm(phase + Math.PI),
  };
}

function mixPose(from: Pose, to: Pose, t: number): Pose {
  const mix = (a: Limb, b: Limb): Limb => [
    lerp(a[0], b[0], t),
    lerp(a[1], b[1], t),
  ];
  return {
    legA: mix(from.legA, to.legA),
    legB: mix(from.legB, to.legB),
    armA: mix(from.armA, to.armA),
    armB: mix(from.armB, to.armB),
  };
}

/** Angles are from straight down; the bend swings the lower part back. */
function limbPath(
  from: Point,
  [angle, bend]: Limb,
  upper: number,
  lower: number,
) {
  const mid = {
    x: from.x + upper * Math.sin(angle),
    y: from.y + upper * Math.cos(angle),
  };
  const end = {
    x: mid.x + lower * Math.sin(angle - bend),
    y: mid.y + lower * Math.cos(angle - bend),
  };
  return `M ${from.x} ${from.y} L ${mid.x} ${mid.y} L ${end.x} ${end.y}`;
}

// *** RiskArt ***
const RISK_BASE = 340;
const RISK_FILL = 'rgba(255, 255, 255, 0.12)';
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
        // The fill waits for the outline, so the bar is drawn first and then filled.
        const fill = ramp(progress, start + 0.14, start + 0.24) * (1 - erase);
        return (
          <g key={x}>
            <path
              d={`M ${x - 50} ${RISK_BASE} V ${top} H ${x + 50} V ${RISK_BASE} Z`}
              fill={RISK_FILL}
              stroke="none"
              opacity={fill}
            />
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
                <InkPath d="M -22 -34 L -6 -18 L 24 -50" accent />
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
      <InkPath d={circlePath(x, -56, 13)} accent />
      <InkPath d={`M ${x - 22} -16 A 22 22 0 0 1 ${x + 22} -16`} accent />
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
              <InkPath
                d={`M ${ruleX} ${ruleY} H ${ruleX + width}`}
                to={rule}
                accent
              />
            </g>
          );
        })}
      </g>
    </ArtSvg>
  );
}

// *** DirectionArt ***
const BOAT = { x: 440, y: 270, bob: 6, tilt: 3, cycles: 2 };
const WAVES = [
  { y: 305, left: 220, right: 660, phase: 0 },
  { y: 340, left: 290, right: 590, phase: Math.PI },
];
const WAVE = { length: 120, height: 10, cycles: 3 };

/** A boat sails on, rocking on waves that flow past it. */
function DirectionArt({
  progress,
  accent = COLOR.text,
  ...props
}: CarouselLineArtProps) {
  // Whole cycles only, so the last frame matches the first.
  const rock = 2 * Math.PI * BOAT.cycles * progress;
  const flow = 2 * Math.PI * WAVE.cycles * progress;
  return (
    <ArtSvg {...props} accent={accent} id="direction" width={860} height={360}>
      <g
        transform={`translate(0 ${BOAT.bob * Math.sin(rock)}) rotate(${BOAT.tilt * Math.cos(rock)} ${BOAT.x} ${BOAT.y})`}
      >
        <path d="M 430 80 L 430 235 L 335 235 Z" fill={accent} stroke="none" />
        <InkPath d="M 430 80 L 430 235 L 335 235 Z" />
        <InkPath d="M 452 100 L 452 235 L 525 235 Z" />
        <InkPath d={`M ${BOAT.x} 250 V 66`} />
        <InkPath d="M 320 250 H 550 L 508 290 H 356 Z" />
      </g>
      {WAVES.map((wave) => (
        <InkPath key={wave.y} d={wavePath(wave, flow + wave.phase)} />
      ))}
    </ArtSvg>
  );
}

function wavePath({ y, left, right }: (typeof WAVES)[number], phase: number) {
  const steps = Math.ceil((right - left) / 8);
  const points = Array.from({ length: steps + 1 }, (_, i) => {
    const x = left + ((right - left) * i) / steps;
    // Adding the phase moves the crests left, so the boat looks like it heads right.
    const waveY =
      y + WAVE.height * Math.sin((2 * Math.PI * x) / WAVE.length + phase);
    return `${x.toFixed(1)} ${waveY.toFixed(1)}`;
  });
  return `M ${points.join(' L ')}`;
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

function line(progress: number, from: number, to: number) {
  return interpolate(progress, [from, to], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
}

function lerp(from: number, to: number, t: number) {
  return from + (to - from) * t;
}

function clamp01(value: number) {
  return Math.min(Math.max(value, 0), 1);
}
