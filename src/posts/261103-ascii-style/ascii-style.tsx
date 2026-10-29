import type { CarouselPost } from '../../carousel/carousel.type';
import { ASCII_ARTS } from './ascii-arts';
import { ASCII_STYLE_SLIDES } from './ascii-style.copy';
import { AsciiTitle } from './ascii-title';

export const asciiStylePost: CarouselPost = {
  id: '261103-ascii-style',
  slides: ASCII_STYLE_SLIDES,
  arts: ASCII_ARTS,
  highlight: 'ascii',
  renderTitle: (text, motion) => <AsciiTitle text={text} motion={motion} />,
};
