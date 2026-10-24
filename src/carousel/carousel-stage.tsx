import type { ReactNode } from 'react';
import { AbsoluteFill } from 'remotion';

import { HighlightContext } from '../text-animations/highlight';
import type { HighlightVariant } from '../text-animations/highlight.type';
import type { CarouselBackgroundVariant, CarouselLang } from './carousel.type';
import {
  CONTENT_BACKGROUND_VARIANT,
  CarouselAnimatedBackground,
} from './carousel-background';
import { CarouselFooter } from './carousel-parts';
import { COLOR, FONT } from './carousel-theme';

/**
 * The root template for every composition: slides, and previews of layouts, covers, backgrounds and text animations.
 * One place for the brand canvas, so a preview always looks like the slide it is for.
 */
export function CarouselStage({
  lang,
  background = CONTENT_BACKGROUND_VARIANT,
  highlight = 'sweep',
  texture,
  children,
}: {
  lang: CarouselLang;
  background?: CarouselBackgroundVariant;
  highlight?: HighlightVariant;
  /** Sits over the background and under the content. */
  texture?: ReactNode;
  children: ReactNode;
}) {
  return (
    <HighlightContext value={highlight}>
      <AbsoluteFill style={{ color: COLOR.text, fontFamily: FONT[lang].sans }}>
        <CarouselAnimatedBackground variant={background} />
        {texture}
        {children}
        <CarouselFooter />
      </AbsoluteFill>
    </HighlightContext>
  );
}
