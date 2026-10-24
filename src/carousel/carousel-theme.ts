import type { CarouselLang } from './carousel.type';

export const CAROUSEL_SIZE = { width: 1080, height: 1350 };

// Matches the ThisWeb carousel template in Canva.
export const COLOR = {
  title: '#31E8FF',
  highlight: '#F0893C',
  text: '#F9FAFB',
  muted: '#C4C4C4',
  card: 'rgba(0, 0, 0, 0.25)',
};
export const MONO = '"Paper Mono", ui-monospace, monospace';
// The Latin font comes first in zh too, so English words in Chinese text match the en slides.
export const FONT: Record<CarouselLang, { sans: string; serif: string }> = {
  en: {
    sans: '"IBM Plex Sans", sans-serif',
    serif: '"Source Serif 4", serif',
  },
  zh: {
    sans: '"IBM Plex Sans", "Noto Sans TC", sans-serif',
    serif: '"Source Serif 4", "Noto Serif TC", serif',
  },
};
export const PAD_X = 110;
export const CONTENT_WIDTH = CAROUSEL_SIZE.width - PAD_X * 2;
