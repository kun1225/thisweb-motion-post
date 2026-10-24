import { AbsoluteFill } from 'remotion';

// Dots fade out toward the bottom right, like a print screen following the light.
export function Halftone() {
  const fade =
    'radial-gradient(ellipse 120% 90% at 0% 0%, black 0%, transparent 85%)';
  return (
    <AbsoluteFill
      style={{
        backgroundImage:
          'radial-gradient(circle, rgba(170, 230, 240, 0.16) 1.6px, transparent 2.2px)',
        backgroundSize: '9px 9px',
        rotate: '15deg',
        scale: 1.4,
        maskImage: fade,
        WebkitMaskImage: fade,
        mixBlendMode: 'screen',
      }}
    />
  );
}
