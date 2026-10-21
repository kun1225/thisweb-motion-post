import { Sequence } from 'remotion';

import type {
  CarouselLang,
  CarouselLayerSettings,
  CarouselMotionLayer,
  CarouselSlide,
} from './carousel.type';
import { CarouselLineArtView } from './carousel-line-art';
import {
  COLOR,
  CarouselBody,
  CarouselColumn,
  CarouselTitle,
  PAD_X,
  carouselTextStyle,
} from './carousel-parts';

/** 8 seconds: slow enough that the line art reads as calm, not busy. */
export const CAROUSEL_MOTION_FRAMES = 240;

export const DEFAULT_MOTION: CarouselMotionLayer = {
  art: 'turn',
  position: 'right',
  color: COLOR.text,
  boil: 2.5,
  strokeWidth: 3,
};

/** A short statement on top, line art in the middle, a small caption below. All centred. */
export function CarouselMotion({
  slide,
  lang,
  layers,
}: {
  slide: Extract<CarouselSlide, { layout: 'motion' }>;
  lang: CarouselLang;
  layers: CarouselLayerSettings;
}) {
  const { position: _, ...motion } = layers.motion ?? DEFAULT_MOTION;
  return (
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
      <CarouselTitle
        settings={layers.title}
        style={{
          textWrap: 'balance',
          // Without it, zh lines break in the middle of a word.
          wordBreak: lang === 'zh' ? 'keep-all' : undefined,
        }}
      >
        {slide.title}
      </CarouselTitle>
      <Sequence name="Motion" layout="none">
        <div style={{ position: 'relative', width: '100%', height: 460 }}>
          <CarouselLineArtView {...motion} align="center" />
        </div>
      </Sequence>
      <Sequence name="Caption" layout="none">
        <div
          style={{
            fontSize: 28,
            fontWeight: 500,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: COLOR.muted,
            ...carouselTextStyle(layers.subtitle),
          }}
        >
          {slide.caption}
        </div>
      </Sequence>
    </div>
  );
}

/** Title and body like a text slide, with small line art in the space below. */
export function CarouselTextMotion({
  slide,
  layers,
}: {
  slide: Extract<CarouselSlide, { layout: 'text-motion' }>;
  layers: CarouselLayerSettings;
}) {
  const { position = 'right', ...motion } = layers.motion ?? DEFAULT_MOTION;
  return (
    <CarouselColumn>
      <CarouselTitle settings={layers.title}>{slide.title}</CarouselTitle>
      <CarouselBody text={slide.body} />
      <Sequence name="Motion" layout="none">
        <div
          style={{ position: 'relative', flex: 1, minHeight: 0, marginTop: 56 }}
        >
          <div
            style={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              // The art shrinks when the body is long, so it never overlaps the text.
              ...(position === 'right'
                ? { width: 340, height: 'min(100%, 340px)' }
                : { left: 0, height: 'min(100%, 400px)' }),
            }}
          >
            <CarouselLineArtView {...motion} align={position} />
          </div>
        </div>
      </Sequence>
    </CarouselColumn>
  );
}
