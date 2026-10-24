import { NoiseLayer } from './bg-texture-parts';

export function Paper() {
  return (
    <NoiseLayer id="paper" blend="overlay" opacity={0.45}>
      {/* `turbulence` folds the noise at zero, so its valleys are sharp lines: they read as creases. */}
      <feTurbulence
        type="turbulence"
        baseFrequency="0.0016 0.0022"
        numOctaves={2}
        seed={11}
        result="folds"
      />
      {/* A low exponent pinches each valley into a thin, sharp fold. */}
      <feComponentTransfer in="folds" result="creases">
        <feFuncA type="gamma" exponent={0.45} />
      </feComponentTransfer>
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.45"
        numOctaves={3}
        seed={7}
        result="tooth"
      />
      <feComposite
        in="creases"
        in2="tooth"
        operator="arithmetic"
        k2={2}
        k3={0.15}
        result="height"
      />
      <feDiffuseLighting in="height" surfaceScale={6} lightingColor="#ffffff">
        <feDistantLight azimuth={225} elevation={50} />
      </feDiffuseLighting>
    </NoiseLayer>
  );
}
