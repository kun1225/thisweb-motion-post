import type { ComponentType, ReactNode } from 'react';

import type { HighlightVariant } from '../text-animations/highlight.type';

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

export type CarouselBackgroundVariant = 'drift' | 'grid' | 'code' | 'ascii';

export type CarouselBackgroundProps = {
  /** 0 at the first frame, approaching 1 at the last. */
  progress: number;
};

export type CarouselCoverLayout = 'stack' | 'split' | 'caption' | 'poster';

export type CarouselListLayout = 'icon' | 'cards' | 'ruled' | 'steps';

export type CarouselLineArt = 'draw' | 'turn' | 'field' | 'swing' | 'spin';

/**
 * Where `text-motion` slides put the line art: `right` (small, bottom right), `center` (wide, below the text),
 * `top` (big, above the text), or `full` (across the whole slide, over centred text).
 */
export type CarouselMotionPosition = 'center' | 'right' | 'top' | 'full';

export type CarouselMotionLayer = {
  /** A shared art, or one from the post's own `arts`. */
  art: CarouselLineArt | (string & {});
  /** `text-motion` slides only. */
  position?: CarouselMotionPosition;
  color: string;
  /** The second ink colour, for the lines an art marks with `accent`. White when unset. */
  accent?: string;
  /** Hand-drawn wobble in pixels; 0 turns it off. */
  boil: number;
  strokeWidth: number;
  /** Moves the art from where its layout puts it, in pixels. */
  x?: number;
  y?: number;
  scale?: number;
};

/** Where `text-effect` slides put the text: `bottom` (bottom left) or `center`. */
export type CarouselTextEffectPosition = 'bottom' | 'center';

export type CarouselLineArtProps = Omit<
  CarouselMotionLayer,
  'position' | 'art' | 'x' | 'y' | 'scale'
> & {
  /** 0 at the first frame, approaching 1 at the last. */
  progress: number;
  align: CarouselMotionPosition;
};

export type CarouselTextMotionLayoutProps = {
  slide: Extract<CarouselSlide, { layout: 'text-motion' }>;
  layers: CarouselLayerSettings;
  position: CarouselMotionPosition;
  art: ReactNode;
};

export type CarouselLayerSettings = {
  /** Cover slides only; other slides always use `drift`. */
  background?: CarouselBackgroundVariant;
  /** Cover slides only. */
  coverLayout?: CarouselCoverLayout;
  /** Covers with `titleFrames` and `text-effect` slides: which of the post's title motions `renderTitle` plays. */
  titleMotion?: string;
  /** `text-effect` slides only. */
  textPosition?: CarouselTextEffectPosition;
  /** List slides only. */
  listLayout?: CarouselListLayout;
  /** `motion`, `text-motion`, and `text-effect` slides only. On `text-effect` it fills the slide behind the text. */
  motion?: CarouselMotionLayer;
  title: CarouselTextLayer;
  /** The body on `content`, `list`, `text-motion`, and `text-effect` slides. */
  body?: CarouselTextLayer;
  /** The cover subtitle, or the caption on `motion` slides. */
  subtitle?: CarouselTextLayer;
  media?: CarouselMediaLayer;
};

export type CarouselCoverProps = {
  slide: Extract<CarouselSlide, { layout: 'cover' }>;
  lang: CarouselLang;
  layers: CarouselLayerSettings;
  renderClip: CarouselPost['renderClip'];
  renderTitle: CarouselPost['renderTitle'];
};

export type CarouselCoverLayoutProps = CarouselCoverProps & {
  /** The plain title, or the post's moving one. */
  title: ReactNode;
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

/** A post's own clip in the cover's top left corner, drawn by `renderClip`. The cover lasts as long as it. */
export type CarouselMascot = { clip: string; frames: number };

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
  | {
      layout: 'cover';
      subtitle: string;
      title: string;
      media: CarouselMedia;
      mascot?: CarouselMascot;
      /** Moves the title with the post's `renderTitle`; the cover lasts this many frames. */
      titleFrames?: number;
    }
  | { layout: 'content'; title: string; body: string; media: CarouselMedia }
  | { layout: 'list'; title: string; body?: string; items: CarouselListItem[] }
  | { layout: 'result'; title: string; tips: string[]; media: CarouselMedia }
  | { layout: 'motion'; title: string; caption: string }
  | { layout: 'text-motion'; title: string; body: string }
  /** Big text with the effect on the text itself (`titleMotion`) or behind it (`motion`). */
  | { layout: 'text-effect'; title: string; body: string }
  | {
      layout: 'outro';
      title: string;
      /** The text inside the inked box. Use **highlight** for the keyword to comment. */
      cta: string;
      /** The small closing line below the box. */
      note: string;
      /** Where the post comes from, in small muted text at the very bottom. */
      source?: string;
    };

export type CarouselPost = {
  /** Starts with the YYMMDD date, then kebab-case; also the composition id prefix and the output folder. */
  id: string;
  slides: Record<CarouselLang, CarouselSlide[]>;
  /** Draws a `clip` media by its id, at the size of the media box. */
  renderClip?: (
    id: string,
    size: { width: number; height: number },
  ) => ReactNode;
  /** Draws the cover title with the post's own motion, on covers that set `titleFrames`. */
  renderTitle?: (text: string, motion?: string) => ReactNode;
  /** Line art drawn for this post only, picked by `layers.motion.art`. */
  arts?: Record<string, (props: CarouselLineArtProps) => ReactNode>;
  /** How **highlight** text animates on every slide. Defaults to `sweep`. */
  highlight?: HighlightVariant;
};
