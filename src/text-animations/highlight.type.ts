import type { CarouselLang } from '../carousel/carousel.type';

/**
 * `sweep` turns the letters orange one by one; `underline` draws a hand-inked blue line under them;
 * `ascii` decodes them from random symbols, letter by letter.
 */
export type HighlightVariant = 'sweep' | 'underline' | 'ascii';

export type HighlightPreviewProps = {
  variant: HighlightVariant;
  /** Use **highlight** for the bold parts. */
  text: string;
  fontSize: number;
  lang: CarouselLang;
};
