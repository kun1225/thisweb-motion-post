import type { ComponentType, ReactNode } from 'react';

export type CarouselLang = 'en' | 'zh';

export type CarouselTextLayer = {
  text: string;
  /** Leave unset to use the layout's font for the slide's language. */
  fontFamily?: string;
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

export type CarouselBackgroundVariant = 'drift' | 'grid' | 'code';

export type CarouselBackgroundProps = {
  /** 0 at the first frame, approaching 1 at the last. */
  progress: number;
};

export type CarouselCoverLayout = 'stack' | 'split' | 'caption' | 'poster';

export type CarouselListLayout = 'icon' | 'cards' | 'ruled' | 'steps';

export type CarouselLineArt = 'draw' | 'turn' | 'field';

export type CarouselMotionLayer = {
  /** A shared art, or one from the post's own `arts`. */
  art: CarouselLineArt | (string & {});
  /** `text-motion` slides only. */
  position?: 'center' | 'right';
  color: string;
  /** Hand-drawn wobble in pixels; 0 turns it off. */
  boil: number;
  strokeWidth: number;
};

export type CarouselLineArtProps = Omit<
  CarouselMotionLayer,
  'position' | 'art'
> & {
  /** 0 at the first frame, approaching 1 at the last. */
  progress: number;
  align: 'center' | 'right';
};

export type CarouselLayerSettings = {
  /** Cover slides only; other slides use the static background. */
  background?: CarouselBackgroundVariant;
  /** Cover slides only. */
  coverLayout?: CarouselCoverLayout;
  /** List slides only. */
  listLayout?: CarouselListLayout;
  /** `motion` and `text-motion` slides only. */
  motion?: CarouselMotionLayer;
  title: CarouselTextLayer;
  /** The cover subtitle, or the caption on `motion` slides. */
  subtitle?: CarouselTextLayer;
  media?: CarouselMediaLayer;
};

export type CarouselCoverProps = {
  slide: Extract<CarouselSlide, { layout: 'cover' }>;
  lang: CarouselLang;
  layers: CarouselLayerSettings;
  renderClip: CarouselPost['renderClip'];
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

/** A lucide-react icon, or any component that takes the same props. */
export type CarouselIcon = ComponentType<{
  size?: number;
  color?: string;
  strokeWidth?: number;
}>;

export type CarouselListItem = {
  /** Shown by the `icon` list layout. Without one, it shows the item number. */
  icon?: CarouselIcon;
  name: string;
  text: string;
};

export type CarouselListSlide = Extract<CarouselSlide, { layout: 'list' }>;

/** Text may use **highlight** and `code`. */
export type CarouselSlide =
  | { layout: 'cover'; subtitle: string; title: string; media: CarouselMedia }
  | { layout: 'content'; title: string; body: string; media: CarouselMedia }
  | { layout: 'list'; title: string; body?: string; items: CarouselListItem[] }
  | { layout: 'result'; title: string; tips: string[]; media: CarouselMedia }
  | { layout: 'motion'; title: string; caption: string }
  | { layout: 'text-motion'; title: string; body: string };

export type CarouselPost = {
  /** Kebab-case; also the composition id prefix and the output folder. */
  id: string;
  slides: Record<CarouselLang, CarouselSlide[]>;
  /** Draws a `clip` media by its id, at the size of the media box. */
  renderClip?: (
    id: string,
    size: { width: number; height: number },
  ) => ReactNode;
  /** Line art drawn for this post only, picked by `layers.motion.art`. */
  arts?: Record<string, (props: CarouselLineArtProps) => ReactNode>;
};
