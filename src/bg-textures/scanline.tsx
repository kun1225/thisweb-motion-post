import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';

const PITCH = 4;
// One full roll per slide, so the loop point is invisible.
const BAND_HEIGHT = 30;

export function Scanline() {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const y = -BAND_HEIGHT + (frame / durationInFrames) * (100 + BAND_HEIGHT);
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <AbsoluteFill
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.22) 0 1px, transparent 1px ${PITCH}px)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `linear-gradient(transparent ${y}%, rgba(170, 230, 240, 0.04) ${y + BAND_HEIGHT / 2}%, transparent ${y + BAND_HEIGHT}%)`,
        }}
      />
    </AbsoluteFill>
  );
}
