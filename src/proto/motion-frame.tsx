// PROTO — shared frame for the motion layout: paper, still quote, the moving art, caption.
import type { ReactNode } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';

import { QUOTE_SAMPLE } from './proto-content';
import { FONT, Footer, PAD_X } from './proto-kit';
import type { Lang } from './proto-kit';

export type MotionSettings = {
  ink: string;
  paper: string;
  /** Hand-drawn wobble in px; 0 turns it off. */
  boil: number;
  strokeWidth: number;
};

export type MotionArtProps = MotionSettings & { progress: number };

export function MotionFrame({
  lang,
  settings,
  children,
}: {
  lang: Lang;
  settings: MotionSettings;
  children: ReactNode;
}) {
  const { quote, caption } = QUOTE_SAMPLE[lang];
  return (
    <AbsoluteFill
      style={{ backgroundColor: settings.paper, color: settings.ink }}
    >
      <PaperTexture />
      <div
        style={{
          position: 'absolute',
          inset: `130px ${PAD_X}px 210px`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 80,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: FONT[lang].serif,
            fontWeight: 400,
            textWrap: 'balance',
            ...(lang === 'en'
              ? { fontSize: 72, lineHeight: 1.12, letterSpacing: '-0.015em' }
              : { fontSize: 60, lineHeight: 1.45, wordBreak: 'keep-all' }),
          }}
        >
          {quote}
        </div>
        <div style={{ position: 'relative', width: '100%', height: 460 }}>
          {children}
        </div>
        <div
          style={{
            fontFamily: FONT[lang].sans,
            fontSize: 26,
            fontWeight: 500,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            opacity: 0.8,
          }}
        >
          {caption}
        </div>
      </div>
      <Footer color={`color-mix(in oklch, ${settings.ink} 55%, transparent)`} />
    </AbsoluteFill>
  );
}

/** Wobbles strokes like a hand-drawn line. Steps at 7.5 fps, the classic "line boil" rate. */
export function InkBoil({ id, amount }: { id: string; amount: number }) {
  const frame = useCurrentFrame();
  return (
    <filter id={id} x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.035"
        numOctaves={2}
        seed={Math.floor(frame / 4) % 6}
      />
      <feDisplacementMap
        in="SourceGraphic"
        scale={amount}
        xChannelSelector="R"
        yChannelSelector="G"
      />
    </filter>
  );
}

// Two noise layers: fine grain for the tooth, a slow cloud so the sheet isn't perfectly flat.
function PaperTexture() {
  return (
    <svg
      width="100%"
      height="100%"
      style={{ position: 'absolute', inset: 0, mixBlendMode: 'multiply' }}
    >
      <filter id="paper-grain" x="0" y="0" width="100%" height="100%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.9"
          numOctaves={3}
          seed={3}
          stitchTiles="stitch"
        />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.35  0 0 0 0 0.32  0 0 0 0 0.28  0 0 0 -1.4 1"
        />
      </filter>
      <filter id="paper-cloud" x="0" y="0" width="100%" height="100%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.004 0.008"
          numOctaves={4}
          seed={11}
        />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.45  0 0 0 0 0.42  0 0 0 0 0.36  0 0 0 -2 1.25"
        />
      </filter>
      <rect
        width="100%"
        height="100%"
        filter="url(#paper-grain)"
        opacity={0.22}
      />
      <rect
        width="100%"
        height="100%"
        filter="url(#paper-cloud)"
        opacity={0.1}
      />
    </svg>
  );
}
