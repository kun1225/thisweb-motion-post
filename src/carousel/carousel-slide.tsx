import { Fragment } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import {
  AbsoluteFill,
  Loop,
  OffthreadVideo,
  Sequence,
  staticFile,
} from 'remotion';

import type {
  CarouselBrandingProps,
  CarouselCoverLayout,
  CarouselCoverProps,
  CarouselLang,
  CarouselLayerSettings,
  CarouselMedia,
  CarouselMediaLayer,
  CarouselPost,
  CarouselSlide,
  CarouselTextLayer,
} from './carousel.type';
import {
  CarouselAnimatedBackground,
  CarouselBackground,
  DEFAULT_BACKGROUND_VARIANT,
} from './carousel-background';

export const CAROUSEL_SIZE = { width: 1080, height: 1350 };
export const CAROUSEL_FPS = 30;

// Matches the ThisWeb carousel template in Canva.
const COLOR = {
  title: '#31E8FF',
  highlight: '#F0893C',
  text: '#F9FAFB',
  muted: '#C4C4C4',
  card: 'rgba(0, 0, 0, 0.25)',
};
const MONO = '"Paper Mono", ui-monospace, monospace';
const FONT: Record<CarouselLang, string> = {
  en: '"IBM Plex Sans", sans-serif',
  zh: '"LINE Seed TW_TTF", "LINE Seed TW", sans-serif',
};
const PAD_X = 110;
const CONTENT_WIDTH = CAROUSEL_SIZE.width - PAD_X * 2;

/** One ThisWeb carousel slide. Text never animates; only the media plays. */
export function CarouselSlideView({
  slide,
  lang,
  layers,
  renderClip,
}: {
  slide: CarouselSlide;
  lang: CarouselLang;
  layers: CarouselLayerSettings;
  renderClip: CarouselPost['renderClip'];
}) {
  return (
    <AbsoluteFill
      style={{
        color: COLOR.text,
        fontFamily: FONT[lang],
      }}
    >
      {slide.layout === 'cover' ? (
        <CarouselAnimatedBackground
          variant={layers.background ?? DEFAULT_BACKGROUND_VARIANT}
        />
      ) : (
        <CarouselBackground />
      )}
      {slide.layout === 'cover' && (
        <CarouselCover slide={slide} layers={layers} renderClip={renderClip} />
      )}
      {slide.layout === 'content' && (
        <CarouselContent
          slide={slide}
          layers={layers}
          renderClip={renderClip}
        />
      )}
      {slide.layout === 'list' && (
        <CarouselList slide={slide} layers={layers} renderClip={renderClip} />
      )}
      {slide.layout === 'result' && (
        <CarouselResult slide={slide} layers={layers} renderClip={renderClip} />
      )}
      <CarouselFooter settings={layers.footer} />
    </AbsoluteFill>
  );
}

/** A slide lasts as long as its media, so it plays without a jump. One frame means a still. */
export function carouselSlideDuration(slide: CarouselSlide) {
  const media = slide.layout === 'list' ? null : slide.media;
  if (media?.kind === 'video') return media.frames;
  if (media?.kind === 'clip') return media.frames * media.loops;
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
  return (
    <>
      <CarouselLogo settings={props.layers.logo} />
      <Layout {...props} />
    </>
  );
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

// Starts below the logo and ends above the footer, so long titles wrap instead of overlapping them.
const COVER_INSET = `230px ${PAD_X}px 200px`;

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
function CoverStack({ slide, layers, renderClip }: CarouselCoverProps) {
  return (
    <>
      <div
        style={{
          position: 'absolute',
          top: 250,
          left: 0,
          right: 0,
          textAlign: 'center',
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
        style={{ top: 560, bottom: 170 }}
      />
    </>
  );
}

/** Title at the top left, subtitle at the bottom right. Text only. */
function CoverSplit({ slide, layers }: CarouselCoverProps) {
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
function CoverCaption({ slide, layers, renderClip }: CarouselCoverProps) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: COVER_INSET,
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',
      }}
    >
      <CoverText
        name="Title"
        settings={layers.title}
        style={{
          fontSize: COVER_TEXT_SIZE.caption.title,
          lineHeight: 1.15,
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
          textWrap: 'balance',
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
function CoverPoster({ slide, layers }: CarouselCoverProps) {
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
          fontWeight: 700,
          color: COLOR.title,
        }}
      >
        {slide.title}
      </CoverText>
    </div>
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
      <p
        style={{
          margin: '36px 0 0',
          fontSize: 40,
          lineHeight: 1.6,
          whiteSpace: 'pre-line',
        }}
      >
        <CarouselRichText text={slide.body} />
      </p>
      <CarouselMediaBox
        media={slide.media}
        settings={layers.media}
        renderClip={renderClip}
        style={{ position: 'relative', flex: 1, marginTop: 56 }}
      />
    </CarouselColumn>
  );
}

// *** CarouselList ***
function CarouselList({
  slide,
  layers,
}: {
  slide: Extract<CarouselSlide, { layout: 'list' }>;
  layers: CarouselLayerSettings;
  renderClip: CarouselPost['renderClip'];
}) {
  return (
    <CarouselColumn>
      <CarouselTitle settings={layers.title}>{slide.title}</CarouselTitle>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
          marginTop: 64,
        }}
      >
        {slide.items.map((item) => (
          <div
            key={item.letter}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 40,
              padding: '36px 44px',
              borderRadius: 16,
              backgroundColor: COLOR.card,
            }}
          >
            <span
              style={{
                width: 72,
                fontFamily: MONO,
                fontSize: 96,
                lineHeight: 1,
                color: COLOR.title,
              }}
            >
              {item.letter}
            </span>
            <div>
              <div style={{ fontSize: 40, fontWeight: 700 }}>{item.name}</div>
              <div style={{ marginTop: 8, fontSize: 34, color: COLOR.muted }}>
                <CarouselRichText text={item.text} />
              </div>
            </div>
          </div>
        ))}
      </div>
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

// *** CarouselColumn ***
function CarouselColumn({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: `105px ${PAD_X}px 160px`,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {children}
    </div>
  );
}

// *** CarouselTitle ***
function CarouselTitle({
  children,
  settings,
}: {
  children: ReactNode;
  settings: CarouselTextLayer;
}) {
  return (
    <Sequence name="Title" layout="none">
      <h1
        style={{
          margin: 0,
          fontSize: 54,
          lineHeight: 1.3,
          fontWeight: 700,
          color: COLOR.title,
          ...carouselTextStyle(settings),
        }}
      >
        {children}
      </h1>
    </Sequence>
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

function carouselTextStyle(settings?: CarouselTextLayer): CSSProperties {
  if (!settings) return {};

  return {
    fontFamily: settings.fontFamily,
    fontSize: settings.fontSize,
    color: settings.color,
    translate: `${settings.x}px ${settings.y}px`,
  };
}

// *** CarouselRichText ***
function CarouselRichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*.+?\*\*|`.+?`)/);
  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('**')) {
          return (
            <strong key={index} style={{ color: COLOR.highlight }}>
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith('`')) {
          return (
            <code key={index} style={{ fontFamily: MONO, fontSize: '0.9em' }}>
              {part.slice(1, -1)}
            </code>
          );
        }
        return <Fragment key={index}>{part}</Fragment>;
      })}
    </>
  );
}

// *** CarouselLogo ***
function CarouselLogo({ settings }: CarouselBrandingProps) {
  return (
    <Sequence name="Logo" layout="none">
      <div
        style={{
          position: 'absolute',
          left: 84,
          top: 70,
          // Closest local match to the Canva logo's light condensed face.
          fontFamily: '"Avenir Next Condensed", sans-serif',
          fontWeight: 200,
          fontSize: 85,
          letterSpacing: -2,
          color: '#D9DCE3',
          ...carouselTextStyle(settings),
        }}
      >
        {settings?.text ?? '.W'}
      </div>
    </Sequence>
  );
}

// *** CarouselFooter ***
function CarouselFooter({ settings }: CarouselBrandingProps) {
  return (
    <Sequence name="Footer" layout="none">
      <div
        style={{
          position: 'absolute',
          bottom: 70,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: MONO,
          fontSize: 35,
          color: 'rgba(255, 255, 255, 0.6)',
          ...carouselTextStyle(settings),
        }}
      >
        {settings?.text ?? '@this.web'}
      </div>
    </Sequence>
  );
}
