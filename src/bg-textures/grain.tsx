import { NoiseLayer, useBoilSeed } from './bg-texture-parts';

export function Grain() {
  const seed = useBoilSeed();
  return (
    <NoiseLayer id="grain" blend="soft-light" opacity={0.9}>
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.9"
        numOctaves={2}
        seed={seed}
        stitchTiles="stitch"
      />
      <feColorMatrix type="saturate" values="0" />
    </NoiseLayer>
  );
}
