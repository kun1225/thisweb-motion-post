import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from 'remotion';

import type { FlipStepName } from './flip-step.type';

export const FLIP_STEP_SIZE = { width: 920, height: 790 };
export const FLIP_STEP_FRAMES = 90;
export const FLIP_STEP_RATIO = FLIP_STEP_SIZE.width / FLIP_STEP_SIZE.height;

const TILE = { left: 70, top: 400, width: 180, height: 225 };
const FINAL = { left: 390, top: 60, width: 460, height: 575 };
const SCALE = TILE.width / FINAL.width;
const DX = TILE.left + TILE.width / 2 - (FINAL.left + FINAL.width / 2);
const DY = TILE.top + TILE.height / 2 - (FINAL.top + FINAL.height / 2);

const CYAN = '#31E8FF';
const ORANGE = '#F0893C';
const MONO = '"Paper Mono", ui-monospace, monospace';
// Same curve as the FLIP in the web app, so the clip shows the real motion.
const EASE_OUT_QUINT = Easing.bezier(0.22, 1, 0.36, 1);

/** One looping clip per FLIP step, for the carousel slides. */
export function FlipStep({ step }: { step: FlipStepName }) {
  const frame = useCurrentFrame();
  const scene = SCENES[step](frame);

  return (
    <AbsoluteFill style={{ backgroundColor: '#15161C' }}>
      <FlipStepGallery />
      {scene.ghost && <FlipStepOutline box={FINAL} opacity={scene.ghost} />}
      <FlipStepPicture progress={scene.progress} />
      {scene.outline && (
        <FlipStepOutline
          box={scene.outline.box}
          opacity={scene.outline.opacity}
        />
      )}
      {scene.label && (
        <FlipStepLabel
          text={scene.label.text}
          color={scene.label.color}
          left={scene.label.box.left}
          top={scene.label.box.top + scene.label.box.height + 28}
          opacity={scene.label.opacity}
        />
      )}
    </AbsoluteFill>
  );
}

type FlipStepScene = {
  /** 0 sits on the tile, 1 sits at the final layout. */
  progress: number;
  ghost?: number;
  outline?: { box: typeof TILE; opacity: number };
  label?: { text: string; color: string; box: typeof TILE; opacity: number };
};

const SCENES: Record<FlipStepName, (frame: number) => FlipStepScene> = {
  first: (frame) => {
    const shown = fadeInOut(frame, 15, 75);
    return {
      progress: 0,
      outline: { box: TILE, opacity: shown },
      label: {
        text: 'x 70  y 400\nw 180 h 225',
        color: CYAN,
        box: TILE,
        opacity: shown,
      },
    };
  },
  last: (frame) => {
    // Layout changes in one frame; nothing animates yet.
    const isAfter = frame >= 15 && frame < 80;
    const shown = fadeInOut(frame, 20, 75);
    return {
      progress: isAfter ? 1 : 0,
      outline: { box: FINAL, opacity: shown },
      label: {
        text: 'x 390  y 60  w 460  h 575',
        color: CYAN,
        box: FINAL,
        opacity: shown,
      },
    };
  },
  invert: (frame) => {
    const isInverted = frame >= 25 && frame < 80;
    const shown = fadeInOut(frame, 28, 75);
    return {
      progress: isInverted ? 0 : 1,
      ghost: 1,
      label: {
        text: `translate(${DX}px, ${DY}px)\nscale(${SCALE.toFixed(2)})`,
        color: ORANGE,
        box: TILE,
        opacity: shown,
      },
    };
  },
  play: (frame) => {
    const grow = interpolate(frame, [15, 33], [0, 1], {
      easing: EASE_OUT_QUINT,
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    const reset = interpolate(frame, [76, 86], [1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    return {
      progress: frame < 76 ? grow : reset,
      label: {
        text: 'transform: none',
        color: CYAN,
        box: FINAL,
        opacity: fadeInOut(frame, 33, 72),
      },
    };
  },
};

// *** FlipStepGallery ***
/** Faint neighbours, so the tile reads as one card in a grid. */
function FlipStepGallery() {
  const cards = [
    { left: 70, top: 60, width: 180, height: 150 },
    { left: 70, top: 230, width: 180, height: 150 },
    { left: TILE.left, top: TILE.top, width: TILE.width, height: TILE.height },
  ];
  return (
    <>
      {cards.map((card) => (
        <div
          key={card.top}
          style={{
            position: 'absolute',
            ...px(card),
            borderRadius: 12,
            backgroundColor: 'rgba(255,255,255,0.06)',
          }}
        />
      ))}
    </>
  );
}

// *** FlipStepPicture ***
function FlipStepPicture({ progress }: { progress: number }) {
  // Laid out at its final box and moved with transform only, like the real FLIP.
  const scale = SCALE + (1 - SCALE) * progress;
  const x = DX * (1 - progress);
  const y = DY * (1 - progress);
  return (
    <div
      style={{
        position: 'absolute',
        ...px(FINAL),
        transform: `translate(${x}px, ${y}px) scale(${scale})`,
        borderRadius: 12 / scale,
        overflow: 'hidden',
        background: 'linear-gradient(#f6d5c3, #e88a6a)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: '62%',
          aspectRatio: '1',
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.85)',
        }}
      />
    </div>
  );
}

// *** FlipStepOutline ***
function FlipStepOutline({
  box,
  opacity,
}: {
  box: typeof TILE;
  opacity: number;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        left: box.left - 10,
        top: box.top - 10,
        width: box.width + 20,
        height: box.height + 20,
        border: `3px dashed ${CYAN}`,
        borderRadius: 18,
        opacity,
      }}
    />
  );
}

// *** FlipStepLabel ***
function FlipStepLabel({
  text,
  color,
  left,
  top,
  opacity,
}: {
  text: string;
  color: string;
  left: number;
  top: number;
  opacity: number;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        whiteSpace: 'pre',
        fontFamily: MONO,
        fontSize: 30,
        lineHeight: 1.5,
        color,
        opacity,
      }}
    >
      {text}
    </div>
  );
}

// *** fadeInOut ***
function fadeInOut(frame: number, start: number, end: number) {
  return interpolate(frame, [start, start + 8, end, end + 8], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
}

// *** px ***
function px(box: typeof TILE) {
  return { left: box.left, top: box.top, width: box.width, height: box.height };
}
