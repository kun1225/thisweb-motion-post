import type { ReactNode } from 'react';
import { Sequence } from 'remotion';

import type {
  CarouselLang,
  CarouselLayerSettings,
  CarouselMotionLayer,
  CarouselMotionPosition,
  CarouselPost,
  CarouselSlide,
  CarouselTextMotionLayoutProps,
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

// Clears the footer, so centred text never sits on it.
export const CENTRED_INSET = `130px ${PAD_X}px 210px`;

/** A short statement on top, line art in the middle, a small caption below. All centred. */
export function CarouselMotion({
  slide,
  lang,
  layers,
  arts,
}: {
  slide: Extract<CarouselSlide, { layout: 'motion' }>;
  lang: CarouselLang;
  layers: CarouselLayerSettings;
  arts: CarouselPost['arts'];
}) {
  const { position: _, ...motion } = layers.motion ?? DEFAULT_MOTION;
  return (
    <div
      style={{
        position: 'absolute',
        inset: CENTRED_INSET,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 80,
        textAlign: 'center',
        textWrap: 'balance',
      }}
    >
      <CarouselTitle
        settings={layers.title}
        style={{
          // Without it, zh lines break in the middle of a word.
          wordBreak: lang === 'zh' ? 'keep-all' : undefined,
        }}
      >
        {slide.title}
      </CarouselTitle>
      <Sequence name="Motion" layout="none">
        <div style={{ position: 'relative', width: '100%', height: 460 }}>
          <CarouselLineArtView {...motion} arts={arts} align="center" />
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

/** Title and body like a text slide, with line art placed by `layers.motion.position`. */
export function CarouselTextMotion({
  slide,
  layers,
  arts,
}: {
  slide: Extract<CarouselSlide, { layout: 'text-motion' }>;
  layers: CarouselLayerSettings;
  arts: CarouselPost['arts'];
}) {
  const { position = 'right', ...motion } = layers.motion ?? DEFAULT_MOTION;
  const Layout = TEXT_MOTION_LAYOUTS[position];
  if (Layout === undefined) {
    throw new Error(
      `Unknown motion position "${position}". Use one of: ${Object.keys(TEXT_MOTION_LAYOUTS).join(', ')}.`,
    );
  }
  return (
    <Layout
      slide={slide}
      layers={layers}
      position={position}
      art={<CarouselLineArtView {...motion} arts={arts} align={position} />}
    />
  );
}

const TEXT_MOTION_LAYOUTS: Record<
  CarouselMotionPosition,
  (props: CarouselTextMotionLayoutProps) => ReactNode
> = {
  right: TextMotionBelow,
  center: TextMotionBelow,
  top: TextMotionTop,
  full: TextMotionFull,
};

/** Small art in the space below the text. */
function TextMotionBelow({
  slide,
  layers,
  position,
  art,
}: CarouselTextMotionLayoutProps) {
  return (
    <CarouselColumn>
      <CarouselTitle settings={layers.title}>{slide.title}</CarouselTitle>
      <CarouselBody text={slide.body} settings={layers.body} />
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
            {art}
          </div>
        </div>
      </Sequence>
    </CarouselColumn>
  );
}

/** Big art on top, title and body at the bottom. */
function TextMotionTop({ slide, layers, art }: CarouselTextMotionLayoutProps) {
  return (
    <CarouselColumn>
      <Sequence name="Motion" layout="none">
        {/* Takes only the space the text leaves, so a long body shrinks the art instead of overlapping it. */}
        <div
          style={{
            position: 'relative',
            flex: 1,
            minHeight: 0,
            marginBottom: 64,
          }}
        >
          {art}
        </div>
      </Sequence>
      <CarouselTitle settings={layers.title}>{slide.title}</CarouselTitle>
      <CarouselBody text={slide.body} settings={layers.body} />
    </CarouselColumn>
  );
}

/** Title and body centred, with the art moving across the whole slide on top of them. */
function TextMotionFull({ slide, layers, art }: CarouselTextMotionLayoutProps) {
  return (
    <>
      <div
        style={{
          position: 'absolute',
          inset: CENTRED_INSET,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          textAlign: 'center',
          textWrap: 'balance',
        }}
      >
        <CarouselTitle settings={layers.title}>{slide.title}</CarouselTitle>
        <CarouselBody text={slide.body} settings={layers.body} />
      </div>
      <Sequence name="Motion" layout="none">
        <div style={{ position: 'absolute', inset: 0 }}>{art}</div>
      </Sequence>
    </>
  );
}
