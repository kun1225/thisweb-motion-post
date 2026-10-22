import type { CSSProperties, ReactNode } from 'react';
import {
  AbsoluteFill,
  Loop,
  OffthreadVideo,
  Sequence,
  staticFile,
} from 'remotion';

import type {
  CarouselCoverLayout,
  CarouselCoverProps,
  CarouselLang,
  CarouselLayerSettings,
  CarouselMascot,
  CarouselMedia,
  CarouselMediaLayer,
  CarouselPost,
  CarouselSlide,
  CarouselTextLayer,
} from './carousel.type';
import {
  CONTENT_BACKGROUND_VARIANT,
  CarouselAnimatedBackground,
  DEFAULT_BACKGROUND_VARIANT,
} from './carousel-background';
import { CarouselList } from './carousel-list';
import {
  CAROUSEL_MOTION_FRAMES,
  CarouselMotion,
  CarouselTextMotion,
} from './carousel-motion';
import {
  COLOR,
  CONTENT_WIDTH,
  CarouselBody,
  CarouselColumn,
  CarouselFooter,
  CarouselRichText,
  CarouselTitle,
  FONT,
  PAD_X,
  carouselTextStyle,
} from './carousel-parts';

export { CAROUSEL_SIZE } from './carousel-parts';
export const CAROUSEL_FPS = 30;

/** One ThisWeb carousel slide. Text never animates; only the media and line art move. */
export function CarouselSlideView({
  slide,
  lang,
  layers,
  renderClip,
  arts,
}: {
  slide: CarouselSlide;
  lang: CarouselLang;
  layers: CarouselLayerSettings;
  renderClip: CarouselPost['renderClip'];
  arts?: CarouselPost['arts'];
}) {
  return (
    <AbsoluteFill
      style={{
        color: COLOR.text,
        fontFamily: FONT[lang].sans,
      }}
    >
      <CarouselAnimatedBackground
        variant={
          slide.layout === 'cover'
            ? (layers.background ?? DEFAULT_BACKGROUND_VARIANT)
            : CONTENT_BACKGROUND_VARIANT
        }
      />
      {slide.layout === 'cover' && (
        <CarouselCover
          slide={slide}
          lang={lang}
          layers={layers}
          renderClip={renderClip}
        />
      )}
      {slide.layout === 'cover' && slide.mascot && (
        <CoverMascot mascot={slide.mascot} renderClip={renderClip} />
      )}
      {slide.layout === 'content' && (
        <CarouselContent
          slide={slide}
          layers={layers}
          renderClip={renderClip}
        />
      )}
      {slide.layout === 'list' && (
        <CarouselList slide={slide} layers={layers} />
      )}
      {slide.layout === 'result' && (
        <CarouselResult slide={slide} layers={layers} renderClip={renderClip} />
      )}
      {slide.layout === 'motion' && (
        <CarouselMotion slide={slide} lang={lang} layers={layers} arts={arts} />
      )}
      {slide.layout === 'text-motion' && (
        <CarouselTextMotion slide={slide} layers={layers} arts={arts} />
      )}
      <CarouselFooter />
    </AbsoluteFill>
  );
}

/** A slide lasts as long as its media, so it plays without a jump. One frame means a still. */
export function carouselSlideDuration(slide: CarouselSlide) {
  if (slide.layout === 'motion' || slide.layout === 'text-motion') {
    return CAROUSEL_MOTION_FRAMES;
  }
  const media = 'media' in slide ? slide.media : null;
  if (media?.kind === 'video') return media.frames;
  if (media?.kind === 'clip') return media.frames * media.loops;
  // Without this the cover is a one-frame still, so its background never moves.
  if (slide.layout === 'cover' && slide.mascot) return slide.mascot.frames;
  return 1;
}

// *** CarouselCover ***
function CarouselCover(props: CarouselCoverProps) {
  const layout = props.layers.coverLayout ?? 'stack';
  const Layout = COVER_LAYOUTS[layout];
  if (Layout === undefined) {
    throw new Error(
      `Unknown cover layout "${layout}". Use one of: ${Object.keys(COVER_LAYOUTS).join(', ')}.`,
    );
  }
  return <Layout {...props} />;
}

/** Each layout's own text sizes; a slide's `layers` values override them. */
export const COVER_TEXT_SIZE: Record<
  CarouselCoverLayout,
  { title: number; subtitle: number }
> = {
  stack: { title: 87, subtitle: 53 },
  split: { title: 120, subtitle: 96 },
  caption: { title: 72, subtitle: 32 },
  poster: { title: 160, subtitle: 40 },
};

export const CAROUSEL_COVER_LAYOUTS = Object.keys(
  COVER_TEXT_SIZE,
) as CarouselCoverLayout[];

// Ends well above the footer, so long titles wrap instead of overlapping it.
const COVER_INSET = `150px ${PAD_X}px 280px`;

const COVER_LAYOUTS: Record<
  CarouselCoverLayout,
  (props: CarouselCoverProps) => ReactNode
> = {
  stack: CoverStack,
  split: CoverSplit,
  caption: CoverCaption,
  poster: CoverPoster,
};

/** Subtitle and title centred at the top, media below. */
function CoverStack({ slide, lang, layers, renderClip }: CarouselCoverProps) {
  return (
    <>
      <div
        style={{
          position: 'absolute',
          top: 170,
          left: 0,
          right: 0,
          textAlign: 'center',
          textWrap: 'balance',
        }}
      >
        <CoverText
          name="Subtitle"
          settings={layers.subtitle}
          style={{ fontSize: COVER_TEXT_SIZE.stack.subtitle, color: '#F7F7F7' }}
        >
          {slide.subtitle}
        </CoverText>
        <CoverText
          name="Title"
          settings={layers.title}
          style={{
            marginTop: 28,
            fontSize: COVER_TEXT_SIZE.stack.title,
            fontFamily: FONT[lang].serif,
            fontWeight: 700,
            color: COLOR.title,
          }}
        >
          {slide.title}
        </CoverText>
      </div>
      <CarouselMediaBox
        media={slide.media}
        settings={layers.media}
        renderClip={renderClip}
        style={{ top: 480, bottom: 250 }}
      />
    </>
  );
}

/** Title at the top left, subtitle at the bottom right. Text only. */
function CoverSplit({ slide, lang, layers }: CarouselCoverProps) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: COVER_INSET,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <CoverText
        name="Title"
        settings={layers.title}
        style={{
          fontSize: COVER_TEXT_SIZE.split.title,
          lineHeight: 1.05,
          fontFamily: FONT[lang].serif,
          fontWeight: 700,
          color: COLOR.title,
        }}
      >
        {slide.title}
      </CoverText>
      <CoverText
        name="Subtitle"
        settings={layers.subtitle}
        style={{
          fontSize: COVER_TEXT_SIZE.split.subtitle,
          lineHeight: 1.1,
          fontWeight: 300,
          textAlign: 'right',
        }}
      >
        {slide.subtitle}
      </CoverText>
    </div>
  );
}

/** Title at the top, media in the middle, subtitle as a small caption. All centred. */
function CoverCaption({ slide, lang, layers, renderClip }: CarouselCoverProps) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: COVER_INSET,
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',
        textWrap: 'balance',
      }}
    >
      <CoverText
        name="Title"
        settings={layers.title}
        style={{
          fontSize: COVER_TEXT_SIZE.caption.title,
          lineHeight: 1.15,
          fontFamily: FONT[lang].serif,
          fontWeight: 700,
          color: COLOR.title,
        }}
      >
        {slide.title}
      </CoverText>
      <CarouselMediaBox
        media={slide.media}
        settings={layers.media}
        renderClip={renderClip}
        style={{ position: 'relative', flex: 1, marginTop: 64 }}
      />
      <CoverText
        name="Subtitle"
        settings={layers.subtitle}
        style={{
          marginTop: 56,
          fontSize: COVER_TEXT_SIZE.caption.subtitle,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}
      >
        {slide.subtitle}
      </CoverText>
    </div>
  );
}

/** A large title pushed to the bottom left, subtitle as a small label above it. Text only. */
function CoverPoster({ slide, lang, layers }: CarouselCoverProps) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: COVER_INSET,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}
    >
      <CoverText
        name="Subtitle"
        settings={layers.subtitle}
        style={{ marginBottom: 40, fontSize: COVER_TEXT_SIZE.poster.subtitle }}
      >
        {slide.subtitle}
      </CoverText>
      <CoverText
        name="Title"
        settings={layers.title}
        style={{
          fontSize: COVER_TEXT_SIZE.poster.title,
          lineHeight: 1.02,
          fontFamily: FONT[lang].serif,
          fontWeight: 700,
          color: COLOR.title,
        }}
      >
        {slide.title}
      </CoverText>
    </div>
  );
}

// Above the cover inset, where no cover layout puts text.
const MASCOT_BOX = { top: 90, left: PAD_X, width: CONTENT_WIDTH, height: 240 };

function CoverMascot({
  mascot,
  renderClip,
}: {
  mascot: CarouselMascot;
  renderClip: CarouselPost['renderClip'];
}) {
  const { top, left, ...size } = MASCOT_BOX;
  return (
    <Sequence name="Mascot" layout="none">
      <div style={{ position: 'absolute', top, left, ...size }}>
        <Loop durationInFrames={mascot.frames}>
          {renderClip?.(mascot.clip, size)}
        </Loop>
      </div>
    </Sequence>
  );
}

function CoverText({
  name,
  settings,
  style,
  children,
}: {
  name: string;
  settings?: CarouselTextLayer;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <Sequence name={name} layout="none">
      <div style={{ ...style, ...carouselTextStyle(settings) }}>{children}</div>
    </Sequence>
  );
}

// *** CarouselContent ***
function CarouselContent({
  slide,
  layers,
  renderClip,
}: {
  slide: Extract<CarouselSlide, { layout: 'content' }>;
  layers: CarouselLayerSettings;
  renderClip: CarouselPost['renderClip'];
}) {
  return (
    <CarouselColumn>
      <CarouselTitle settings={layers.title}>{slide.title}</CarouselTitle>
      <CarouselBody text={slide.body} />
      <CarouselMediaBox
        media={slide.media}
        settings={layers.media}
        renderClip={renderClip}
        style={{ position: 'relative', flex: 1, marginTop: 56 }}
      />
    </CarouselColumn>
  );
}

// *** CarouselResult ***
function CarouselResult({
  slide,
  layers,
  renderClip,
}: {
  slide: Extract<CarouselSlide, { layout: 'result' }>;
  layers: CarouselLayerSettings;
  renderClip: CarouselPost['renderClip'];
}) {
  return (
    <CarouselColumn>
      <CarouselTitle settings={layers.title}>{slide.title}</CarouselTitle>
      <CarouselMediaBox
        media={slide.media}
        settings={layers.media}
        renderClip={renderClip}
        style={{ position: 'relative', flex: 1, marginTop: 44 }}
      />
      <ul
        style={{
          margin: '40px 0 0',
          padding: '32px 44px',
          listStyle: 'none',
          borderRadius: 16,
          backgroundColor: COLOR.card,
          fontSize: 34,
          lineHeight: 1.7,
        }}
      >
        {slide.tips.map((tip) => (
          <li key={tip}>
            <span style={{ marginRight: 20, color: COLOR.title }}>•</span>
            <CarouselRichText text={tip} />
          </li>
        ))}
      </ul>
    </CarouselColumn>
  );
}

// *** CarouselMediaBox ***
/** Centres the media in the space it gets and keeps its ratio. */
function CarouselMediaBox({
  media,
  settings,
  renderClip,
  style,
}: {
  media: CarouselMedia;
  settings?: CarouselMediaLayer;
  renderClip: CarouselPost['renderClip'];
  style: CSSProperties;
}) {
  if (media.kind === 'none') return null;
  const { ratio } = media;

  return (
    <Sequence
      name={media.kind === 'video' ? 'Video' : 'Animation'}
      layout="none"
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 0,
          ...style,
        }}
      >
        <div
          style={{
            position: 'relative',
            aspectRatio: ratio,
            // A tall clip fills the height, a wide one the width.
            ...(ratio < 1 ? { height: '100%' } : { width: '100%' }),
            maxWidth: '100%',
            maxHeight: '100%',
            borderRadius: 24,
            overflow: 'hidden',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.35)',
            translate: settings ? `${settings.x}px ${settings.y}px` : undefined,
            scale: settings?.scale,
          }}
        >
          {media.kind === 'video' ? (
            <OffthreadVideo
              src={staticFile(media.file)}
              muted
              style={{ width: '100%', height: '100%' }}
            />
          ) : (
            <Loop durationInFrames={media.frames}>
              {renderClip?.(media.id, {
                width: CONTENT_WIDTH,
                height: CONTENT_WIDTH / ratio,
              })}
            </Loop>
          )}
        </div>
      </div>
    </Sequence>
  );
}
