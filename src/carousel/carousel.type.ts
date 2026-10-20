import type { ReactNode } from 'react';

export type CarouselLang = 'en' | 'zh';

export type CarouselTextLayer = {
  text: string;
  fontFamily: string;
  fontSize: number;
  color: string;
  x: number;
  y: number;
};

export type CarouselMediaLayer = {
  x: number;
  y: number;
  scale: number;
  file?: string;
  frames?: number;
  ratio?: number;
};

export type CarouselBackgroundVariant =
  'drift' | 'breathe' | 'aurora' | 'sway' | 'sheen';

export type CarouselCoverLayout = 'stack' | 'split' | 'caption' | 'poster';

export type CarouselLayerSettings = {
  /** Cover slides only; other slides use the static background. */
  background?: CarouselBackgroundVariant;
  /** Cover slides only. */
  coverLayout?: CarouselCoverLayout;
  logo?: CarouselTextLayer;
  footer: CarouselTextLayer;
  title: CarouselTextLayer;
  subtitle?: CarouselTextLayer;
  media?: CarouselMediaLayer;
};

export type CarouselCoverProps = {
  slide: Extract<CarouselSlide, { layout: 'cover' }>;
  layers: CarouselLayerSettings;
  renderClip: CarouselPost['renderClip'];
};

export type CarouselBrandingProps = {
  settings: CarouselTextLayer | undefined;
};

export type CarouselCompositionProps = {
  layers: CarouselLayerSettings;
};

export type ResolvedCarouselComposition = {
  post: CarouselPost;
  slide: CarouselSlide;
  lang: CarouselLang;
};

export type CarouselMedia =
  /** A file in `public/`, played once for the whole slide. */
  | { kind: 'video'; file: string; frames: number; ratio: number }
  /** A post's own animation, looped for the whole slide. */
  | { kind: 'clip'; id: string; frames: number; loops: number; ratio: number }
  | { kind: 'none' };

export type CarouselListItem = { letter: string; name: string; text: string };

/** Text may use **highlight** and `code`. */
export type CarouselSlide =
  | { layout: 'cover'; subtitle: string; title: string; media: CarouselMedia }
  | { layout: 'content'; title: string; body: string; media: CarouselMedia }
  | { layout: 'list'; title: string; items: CarouselListItem[] }
  | { layout: 'result'; title: string; tips: string[]; media: CarouselMedia };

export type CarouselPost = {
  /** Kebab-case; also the composition id prefix and the output folder. */
  id: string;
  slides: Record<CarouselLang, CarouselSlide[]>;
  /** Draws a `clip` media by its id, at the size of the media box. */
  renderClip?: (
    id: string,
    size: { width: number; height: number },
  ) => ReactNode;
};
