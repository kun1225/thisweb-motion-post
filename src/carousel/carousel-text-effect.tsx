import { Sequence } from 'remotion';

import type {
  CarouselLang,
  CarouselLayerSettings,
  CarouselPost,
  CarouselSlide,
} from './carousel.type';
import { CarouselLineArtView } from './carousel-line-art';
import { CENTRED_INSET, DEFAULT_MOTION } from './carousel-motion';
import { CarouselBody, CarouselTitle, PAD_X } from './carousel-parts';

/** Big title and body at the bottom left or in the middle. The effect is on the title itself, or fills the slide behind the text. */
export function CarouselTextEffect({
  slide,
  lang,
  layers,
  arts,
  renderTitle,
}: {
  slide: Extract<CarouselSlide, { layout: 'text-effect' }>;
  lang: CarouselLang;
  layers: CarouselLayerSettings;
  arts: CarouselPost['arts'];
  renderTitle: CarouselPost['renderTitle'];
}) {
  const centred = (layers.textPosition ?? 'bottom') === 'center';
  const { position: _, ...motion } = layers.motion ?? DEFAULT_MOTION;
  const title =
    layers.titleMotion && renderTitle
      ? renderTitle(slide.title, layers.titleMotion)
      : slide.title;
  return (
    <>
      {layers.motion && (
        <Sequence name="Motion" layout="none">
          <CarouselLineArtView {...motion} arts={arts} align="full" />
        </Sequence>
      )}
      <div
        style={{
          position: 'absolute',
          // Clears the footer, like the other layouts.
          inset: centred ? CENTRED_INSET : `105px ${PAD_X}px 210px`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: centred ? 'center' : 'flex-end',
          textAlign: centred ? 'center' : 'left',
          textWrap: 'balance',
        }}
      >
        <CarouselTitle
          settings={layers.title}
          style={{
            fontSize: 88,
            lineHeight: 1.15,
            // Without it, zh lines break in the middle of a word.
            wordBreak: lang === 'zh' ? 'keep-all' : undefined,
          }}
        >
          {title}
        </CarouselTitle>
        <CarouselBody text={slide.body} settings={layers.body} />
      </div>
    </>
  );
}
