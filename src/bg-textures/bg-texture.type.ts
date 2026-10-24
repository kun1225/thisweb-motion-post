export type BgTextureVariant =
  'none' | 'grain' | 'paper' | 'halftone' | 'linen' | 'dust' | 'scanline';

export type BgTexturePreviewProps = {
  texture: BgTextureVariant;
  /** A real ai-code-review slide: 1 = cover, 3 = art and body, 4 = the longest body. */
  slide: 1 | 3 | 4;
};
