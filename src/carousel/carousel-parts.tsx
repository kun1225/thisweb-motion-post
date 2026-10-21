import { Fragment } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { Sequence } from 'remotion';

import type { CarouselLang, CarouselTextLayer } from './carousel.type';

export const CAROUSEL_SIZE = { width: 1080, height: 1350 };

// Matches the ThisWeb carousel template in Canva.
export const COLOR = {
  title: '#31E8FF',
  highlight: '#F0893C',
  text: '#F9FAFB',
  muted: '#C4C4C4',
  card: 'rgba(0, 0, 0, 0.25)',
};
export const MONO = '"Paper Mono", ui-monospace, monospace';
// The Latin font comes first in zh too, so English words in Chinese text match the en slides.
export const FONT: Record<CarouselLang, { sans: string; serif: string }> = {
  en: {
    sans: '"IBM Plex Sans", sans-serif',
    serif: '"Source Serif 4", serif',
  },
  zh: {
    sans: '"IBM Plex Sans", "Noto Sans TC", sans-serif',
    serif: '"Source Serif 4", "Noto Serif TC", serif',
  },
};
export const PAD_X = 110;
export const CONTENT_WIDTH = CAROUSEL_SIZE.width - PAD_X * 2;

// *** CarouselColumn ***
export function CarouselColumn({ children }: { children: ReactNode }) {
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
export function CarouselTitle({
  children,
  settings,
  style,
}: {
  children: ReactNode;
  settings: CarouselTextLayer;
  style?: CSSProperties;
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
          ...style,
          ...carouselTextStyle(settings),
        }}
      >
        {children}
      </h1>
    </Sequence>
  );
}

// *** CarouselBody ***
export function CarouselBody({ text }: { text: string }) {
  return (
    <p
      style={{
        margin: '36px 0 0',
        fontSize: 40,
        lineHeight: 1.6,
        whiteSpace: 'pre-line',
      }}
    >
      <CarouselRichText text={text} />
    </p>
  );
}

export function carouselTextStyle(settings?: CarouselTextLayer): CSSProperties {
  if (!settings) return {};

  return {
    // An unset font must not erase the layout's font when spread over it.
    ...(settings.fontFamily && { fontFamily: settings.fontFamily }),
    fontSize: settings.fontSize,
    color: settings.color,
    translate: `${settings.x}px ${settings.y}px`,
  };
}

// *** CarouselRichText ***
export function CarouselRichText({ text }: { text: string }) {
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

// *** CarouselFooter ***
// Not a layer, so the brand looks the same on every post.
export function CarouselFooter() {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 70,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontFamily: MONO,
        fontSize: 32,
        color: 'rgba(255, 255, 255, 0.6)',
      }}
    >
      @this.web
    </div>
  );
}
