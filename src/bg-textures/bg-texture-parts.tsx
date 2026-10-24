import type { ReactNode } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';

// 3 frames per seed and 4 seeds: 240 frames / 3 = 80 steps, a multiple of 4, so the loop is seamless.
export function useBoilSeed(every = 3, seeds = 4) {
  return Math.floor(useCurrentFrame() / every) % seeds;
}

export function NoiseLayer({
  id,
  blend,
  opacity,
  children,
}: {
  id: string;
  blend: React.CSSProperties['mixBlendMode'];
  opacity: number;
  children: ReactNode;
}) {
  return (
    <AbsoluteFill
      style={{ mixBlendMode: blend, opacity, pointerEvents: 'none' }}
    >
      <svg width="100%" height="100%">
        <filter id={id} x="0" y="0" width="100%" height="100%">
          {children}
        </filter>
        <rect width="100%" height="100%" filter={`url(#${id})`} />
      </svg>
    </AbsoluteFill>
  );
}
