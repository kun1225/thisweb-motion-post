import type {
  CarouselCompositionProps,
  CarouselLang,
} from '../carousel/carousel.type';

export type LayoutPreviewProps = CarouselCompositionProps & {
  /** Picks the sample body text. Defaults to 繁中. */
  lang?: CarouselLang;
};
