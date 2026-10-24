import type { CarouselLang } from '../carousel/carousel.type';

/** `sweep` turns the letters orange one by one; `underline` draws a hand-inked blue line under them. */
export type HighlightVariant = 'sweep' | 'underline';

export type HighlightPreviewProps = {
  variant: HighlightVariant;
  /** Use **highlight** for the bold parts. */
  text: string;
  fontSize: number;
  lang: CarouselLang;
};
