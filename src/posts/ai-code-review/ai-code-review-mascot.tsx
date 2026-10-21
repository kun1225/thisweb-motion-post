import { Easing, interpolate, useCurrentFrame } from 'remotion';

import { CLAMP_EASE } from '../../carousel/carousel-line-art';
import { MONO } from '../../carousel/carousel-parts';

export const CLAWD_CLIP = 'clawd';
export const CLAWD_FRAMES = 210;

// Frames at 30 fps. Clawd ends where it starts, so the cover loops without a jump.
const BEAT = {
  walkOut: [15, 75],
  hello: [85, 145],
  walkBack: [150, 200],
} as const;
const WALK_DISTANCE = 300;
/** One sprite pixel, in slide pixels. */
const UNIT = 16;
const STEP_FRAMES = 5;
const WAVE_FRAMES = 6;

/** Claude's pixel mascot walks out, waves hello, and walks back home. */
export function ClawdHello() {
  const frame = useCurrentFrame();
  const x = interpolate(
    frame,
    [BEAT.walkOut[0], BEAT.walkOut[1], BEAT.walkBack[0], BEAT.walkBack[1]],
    [0, WALK_DISTANCE, WALK_DISTANCE, 0],
    { ...CLAMP_EASE, easing: Easing.inOut(Easing.sin) },
  );
  const hop = frame > BEAT.hello[0] && frame < BEAT.hello[0] + 6 ? -UNIT : 0;
  return (
    <div style={{ position: 'absolute', left: x, bottom: 0 }}>
      <ClawdSprite pose={clawdPose(frame)} y={hop} />
      <HelloBubble frame={frame} />
    </div>
  );
}

type ClawdPose = {
  move: 'stand' | 'walk' | 'wave';
  /** The sprite is drawn facing left; 1 flips it to face right. */
  facing: -1 | 1;
  step: 0 | 1;
  blink: boolean;
};

function clawdPose(frame: number): ClawdPose {
  const step = (Math.floor(frame / STEP_FRAMES) % 2) as 0 | 1;
  const blink = (frame >= 4 && frame < 7) || (frame >= 120 && frame < 123);
  if (frame >= BEAT.walkOut[0] && frame < BEAT.walkOut[1]) {
    return { move: 'walk', facing: 1, step, blink };
  }
  if (frame >= BEAT.walkBack[0] && frame < BEAT.walkBack[1]) {
    return { move: 'walk', facing: -1, step, blink };
  }
  if (frame >= BEAT.hello[0] && frame < BEAT.hello[1]) {
    const wave = (Math.floor(frame / WAVE_FRAMES) % 2) as 0 | 1;
    return { move: 'wave', facing: -1, step: wave, blink };
  }
  return { move: 'stand', facing: -1, step, blink };
}

// *** ClawdSprite ***
type Pixel = readonly [x: number, y: number, w: number, h: number];

const COLOR = { body: '#D97757', shade: '#B5603F', eye: '#141413' };
const SPRITE = { width: 12, top: -3, height: 11 };
const BODY: Pixel = [2, 0, 8, 5];
const ARM_LEFT: Pixel = [0, 2, 2, 2];
const ARM_RIGHT: Pixel = [10, 2, 2, 2];
// Out to the side, then straight up, so swapping them reads as a wave.
const WAVE_ARMS: readonly (readonly Pixel[])[] = [
  [
    [10, 2, 1, 1],
    [11, -1, 1, 3],
  ],
  [[10, -2, 1, 5]],
];
const LEGS_X = [2, 4, 7, 9];

function ClawdSprite({ pose, y }: { pose: ClawdPose; y: number }) {
  const side = pose.move === 'walk';
  // Seen from the side, the far half sits in shadow and the eyes look ahead.
  const eyesX = side ? [3, 7] : [3, 8];
  const rightArm = pose.move === 'wave' ? WAVE_ARMS[pose.step] : [ARM_RIGHT];
  const flip =
    pose.facing === 1 ? `translate(${SPRITE.width} 0) scale(-1 1)` : undefined;
  return (
    <svg
      viewBox={`0 ${SPRITE.top} ${SPRITE.width} ${SPRITE.height}`}
      width={SPRITE.width * UNIT}
      height={SPRITE.height * UNIT}
      shapeRendering="crispEdges"
      style={{ display: 'block', translate: `0 ${y}px` }}
    >
      <g transform={flip}>
        <Pixels
          list={[BODY, ARM_LEFT, ...(rightArm ?? [])]}
          fill={COLOR.body}
        />
        {side && <Pixels list={[[9, 0, 1, 5], ARM_RIGHT]} fill={COLOR.shade} />}
        <Pixels list={legs(pose)} fill={COLOR.body} />
        {!pose.blink && (
          <Pixels list={eyesX.map((x) => [x, 1, 1, 1])} fill={COLOR.eye} />
        )}
      </g>
    </svg>
  );
}

/** While walking, every other leg lifts and kicks its foot forward. */
function legs({ move, step }: ClawdPose): Pixel[] {
  return LEGS_X.flatMap((x, i): Pixel[] => {
    const lifted = move === 'walk' && i % 2 === step;
    return lifted
      ? [
          [x, 5, 1, 2],
          [x - 1, 6, 1, 1],
        ]
      : [[x, 5, 1, 3]];
  });
}

function Pixels({ list, fill }: { list: readonly Pixel[]; fill: string }) {
  return (
    <>
      {list.map(([x, y, width, height]) => (
        <rect
          key={`${x},${y},${width},${height}`}
          x={x}
          y={y}
          width={width}
          height={height}
          fill={fill}
        />
      ))}
    </>
  );
}

// *** HelloBubble ***
const POP = Easing.out(Easing.back(2));

/** A square speech bubble that pops up by Clawd's head while it waves. */
function HelloBubble({ frame }: { frame: number }) {
  const start = BEAT.hello[0] + 3;
  const end = BEAT.hello[1] - 2;
  const scale =
    interpolate(frame, [start, start + 8], [0, 1], {
      ...CLAMP_EASE,
      easing: POP,
    }) *
    (1 - interpolate(frame, [end - 6, end], [0, 1], CLAMP_EASE));
  if (scale <= 0) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: (SPRITE.width + 2) * UNIT,
        bottom: 10 * UNIT,
        scale,
        transformOrigin: 'bottom left',
        padding: '14px 22px',
        backgroundColor: '#F9FAFB',
        color: COLOR.eye,
        fontFamily: MONO,
        fontSize: 40,
        lineHeight: 1,
        whiteSpace: 'nowrap',
      }}
    >
      Hello!
      {/* A two-step pixel tail pointing down at Clawd's head. */}
      {[0, 1].map((i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: -i * UNIT,
            top: `calc(100% + ${i * UNIT}px)`,
            width: UNIT,
            height: UNIT,
            backgroundColor: '#F9FAFB',
          }}
        />
      ))}
    </div>
  );
}
