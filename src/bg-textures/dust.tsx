import { AbsoluteFill, random, useCurrentFrame } from 'remotion';

import { NoiseLayer, useBoilSeed } from './bg-texture-parts';

const SPECKS = 40;
const SCRATCHES = 3;

export function Dust() {
  const frame = useCurrentFrame();
  const seed = useBoilSeed(2, 8);
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <NoiseLayer id="dust-grain" blend="soft-light" opacity={0.3}>
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.8"
          numOctaves={1}
          seed={seed}
        />
        <feColorMatrix type="saturate" values="0" />
      </NoiseLayer>
      <svg width="100%" height="100%" style={{ position: 'absolute' }}>
        {Array.from({ length: SPECKS }, (_, i) => {
          const key = `${seed}-${i}`;
          if (random(`show-${key}`) > 0.35) return null;
          return (
            <ellipse
              key={i}
              cx={`${random(`x-${key}`) * 100}%`}
              cy={`${random(`y-${key}`) * 100}%`}
              rx={0.8 + random(`r-${key}`) * 2.2}
              ry={0.6 + random(`q-${key}`) * 1.4}
              fill="rgba(230, 240, 245, 0.35)"
            />
          );
        })}
        {Array.from({ length: SCRATCHES }, (_, i) => {
          const key = `${Math.floor(frame / 5)}-${i}`;
          if (random(`scratch-${key}`) > 0.4) return null;
          const x = random(`sx-${key}`) * 100;
          return (
            <line
              key={i}
              x1={`${x}%`}
              x2={`${x + 0.3}%`}
              y1="0%"
              y2="100%"
              stroke="rgba(230, 240, 245, 0.08)"
              strokeWidth={1}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
}
