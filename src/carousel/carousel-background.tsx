import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';

import type { CarouselBackgroundVariant } from './carousel.type';

export const DEFAULT_BACKGROUND_VARIANT: CarouselBackgroundVariant = 'drift';

export function CarouselBackground() {
  return <AbsoluteFill style={{ background: `${tealGlow({})}, ${base()}` }} />;
}

/** One full cycle per slide, so the cover video loops on Instagram without a jump. */
export function CarouselAnimatedBackground({
  variant,
}: {
  variant: CarouselBackgroundVariant;
}) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const draw = VARIANTS[variant];
  if (draw === undefined) {
    throw new Error(
      `Unknown background "${variant}". Use one of: ${Object.keys(VARIANTS).join(', ')}.`,
    );
  }
  return (
    <AbsoluteFill style={{ background: draw(frame / durationInFrames) }} />
  );
}

// The static glow is almost the same shade as the base, so motion needs a brighter one to be seen.
const VARIANTS: Record<
  CarouselBackgroundVariant,
  (progress: number) => string
> = {
  drift: (progress) => {
    const turn = progress * Math.PI * 2;
    return `${tealGlow({
      x: 25 + 25 * Math.cos(turn),
      y: 20 + 20 * Math.sin(turn),
      width: 90,
      height: 60,
      color: BRIGHT_TEAL,
      alpha: 0.5,
    })}, ${base()}`;
  },
  breathe: (progress) => {
    const wave = Math.sin(progress * Math.PI * 2);
    return `${tealGlow({
      width: 75 + 30 * wave,
      height: 50 + 20 * wave,
      color: BRIGHT_TEAL,
      alpha: 0.35 + 0.25 * wave,
    })}, ${base()}`;
  },
  aurora: (progress) => {
    const turn = progress * Math.PI * 2;
    const teal = tealGlow({
      x: 15 + 20 * Math.cos(turn),
      y: 10 + 15 * Math.sin(turn),
      width: 80,
      height: 50,
      color: BRIGHT_TEAL,
      alpha: 0.5,
    });
    const violet = `radial-gradient(ellipse 70% 45% at ${85 - 20 * Math.cos(turn)}% ${10 - 15 * Math.sin(turn)}%, rgba(${VIOLET}, 0.4) 0%, rgba(${VIOLET}, 0) 100%)`;
    return `${teal}, ${violet}, ${base()}`;
  },
  sway: (progress) =>
    `${tealGlow({})}, ${base(160 + 35 * Math.sin(progress * Math.PI * 2))}`,
  sheen: (progress) => {
    // The band starts and ends off-screen, so the loop point is invisible.
    const center = -30 + 160 * progress;
    const band = `linear-gradient(115deg, rgba(255, 255, 255, 0) ${center - 20}%, rgba(255, 255, 255, 0.1) ${center}%, rgba(255, 255, 255, 0) ${center + 20}%)`;
    return `${band}, ${tealGlow({})}, ${base()}`;
  },
};

const TEAL = '13, 41, 52';
const BRIGHT_TEAL = '30, 90, 105';
const VIOLET = '110, 90, 170';

function base(angle = 160) {
  return `linear-gradient(${angle}deg, #31313D 0%, #24242E 45%, #0D2934 100%)`;
}

// The teal glow in the top-left echoes the teal at the bottom, so the slide feels balanced.
function tealGlow({
  x = 0,
  y = 0,
  width = 75,
  height = 45,
  color = TEAL,
  alpha = 0.6,
}: {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  color?: string;
  alpha?: number;
}) {
  return `radial-gradient(ellipse ${width}% ${height}% at ${x}% ${y}%, rgba(${color}, ${alpha}) 0%, rgba(${color}, 0) 100%)`;
}
