import { AbsoluteFill } from 'remotion';

import { NoiseLayer } from './bg-texture-parts';

export function Linen() {
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          backgroundImage: [
            'repeating-linear-gradient(0deg, rgba(255,255,255,0.035) 0 1px, transparent 1px 4px)',
            'repeating-linear-gradient(90deg, rgba(0,0,0,0.12) 0 1px, transparent 1px 4px)',
          ].join(', '),
        }}
      />
      {/* Uneven threads: stretched noise so some rows look thicker than others. */}
      <NoiseLayer id="linen" blend="overlay" opacity={0.4}>
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.008 0.5"
          numOctaves={2}
          seed={3}
        />
        <feColorMatrix type="saturate" values="0" />
      </NoiseLayer>
    </AbsoluteFill>
  );
}
