import type {
  CarouselCompositionProps,
  CarouselLang,
} from '../carousel/carousel.type';

export type CoverPreviewProps = CarouselCompositionProps & {
  /** Defaults to English. */
  lang?: CarouselLang;
};
