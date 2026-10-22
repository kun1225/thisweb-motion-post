import {
  Sequence,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

import type {
  CarouselLang,
  CarouselLayerSettings,
  CarouselSlide,
} from './carousel.type';
import { InkPath } from './carousel-ink';
import { ArtSvg, CLAMP_EASE, roundedRect } from './carousel-line-art';
import { CENTRED_INSET, DEFAULT_MOTION } from './carousel-motion';
import {
  COLOR,
  CarouselRichText,
  CarouselTitle,
  carouselTextStyle,
} from './carousel-parts';

const BOX = { width: 640, height: 190, radius: 28 };
// Keeps the stroke and its wobble inside the SVG, so the edge is never cut off.
const BOX_MARGIN = 16;
// A soft edge and the list cards' fill, so the box looks like the other cards.
const INK = {
  color: 'rgba(255, 255, 255, 0.14)',
  boil: DEFAULT_MOTION.boil,
  strokeWidth: 4,
};
// Starts and ends empty, so the slide loops without a jump.
const DRAW = [0.04, 0.3];
const ERASE = [0.86, 0.97];

/** A short closing line, the comment call-to-action in an inked box, and a small note. All centred. */
export function CarouselOutro({
  slide,
  lang,
  layers,
}: {
  slide: Extract<CarouselSlide, { layout: 'outro' }>;
  lang: CarouselLang;
  layers: CarouselLayerSettings;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: CENTRED_INSET,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 72,
        textAlign: 'center',
        textWrap: 'balance',
        // Without it, zh lines break in the middle of a word.
        wordBreak: lang === 'zh' ? 'keep-all' : undefined,
      }}
    >
      <CarouselTitle settings={layers.title}>{slide.title}</CarouselTitle>
      <CtaBox>{slide.cta}</CtaBox>
      <Sequence name="Note" layout="none">
        <div
          style={{
            fontSize: 40,
            lineHeight: 1.6,
            ...carouselTextStyle(layers.subtitle),
          }}
        >
          {slide.note}
        </div>
      </Sequence>
      {slide.source && (
        <div
          style={{
            marginTop: -24,
            fontSize: 28,
            fontWeight: 500,
            color: COLOR.muted,
          }}
        >
          {slide.source}
        </div>
      )}
    </div>
  );
}

function CtaBox({ children }: { children: string }) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const progress = frame / durationInFrames;
  const width = BOX.width + 2 * BOX_MARGIN;
  const height = BOX.height + 2 * BOX_MARGIN;
  const draw = interpolate(progress, DRAW, [0, 1], CLAMP_EASE);
  const erase = interpolate(progress, ERASE, [0, 1], CLAMP_EASE);
  return (
    <Sequence name="Box" layout="none">
      <div style={{ position: 'relative', width, height }}>
        <div
          style={{
            position: 'absolute',
            inset: BOX_MARGIN,
            borderRadius: BOX.radius,
            backgroundColor: COLOR.card,
            opacity: draw * (1 - erase),
          }}
        />
        <ArtSvg
          {...INK}
          id="outro"
          width={width}
          height={height}
          align="center"
        >
          <InkPath
            d={roundedRect(
              BOX_MARGIN,
              BOX_MARGIN,
              BOX.width,
              BOX.height,
              BOX.radius,
            )}
            from={erase}
            to={draw}
          />
        </ArtSvg>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 60,
            fontWeight: 700,
          }}
        >
          <CarouselRichText text={children} />
        </div>
      </div>
    </Sequence>
  );
}
