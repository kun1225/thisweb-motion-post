import { Fragment } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { Sequence } from 'remotion';

import { Highlight } from '../text-animations/highlight';
import type { CarouselTextLayer } from './carousel.type';
import { COLOR, MONO, PAD_X } from './carousel-theme';

export {
  CAROUSEL_SIZE,
  COLOR,
  CONTENT_WIDTH,
  FONT,
  MONO,
  PAD_X,
} from './carousel-theme';

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
          fontSize: 60,
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
export function CarouselBody({
  text,
  settings,
}: {
  text: string;
  settings?: CarouselTextLayer;
}) {
  return (
    <Sequence name="Body" layout="none">
      <p
        style={{
          margin: '36px 0 0',
          fontSize: 40,
          lineHeight: 1.6,
          whiteSpace: 'pre-line',
          ...carouselTextStyle(settings),
        }}
      >
        {/* Chrome balances only one paragraph of a block, so each paragraph is its own block. */}
        {text.split('\n\n').map((paragraph, i) => (
          <span
            key={i}
            style={{ display: 'block', marginTop: i === 0 ? 0 : '1.6em' }}
          >
            <CarouselRichText text={paragraph} />
          </span>
        ))}
      </p>
    </Sequence>
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
          return <Highlight key={index} text={part.slice(2, -2)} />;
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
