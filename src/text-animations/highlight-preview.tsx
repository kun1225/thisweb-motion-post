import { CarouselRichText, PAD_X } from '../carousel/carousel-parts';
import { CarouselStage } from '../carousel/carousel-stage';
import type { HighlightPreviewProps } from './highlight.type';

/** A centred paragraph with **highlights**, so a highlight style can be tuned without a real post. */
export function HighlightPreview({
  variant,
  text,
  fontSize,
  lang,
}: HighlightPreviewProps) {
  return (
    <CarouselStage lang={lang} highlight={variant}>
      <div
        style={{
          position: 'absolute',
          inset: `0 ${PAD_X}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          textWrap: 'balance',
          fontSize,
          lineHeight: 1.6,
        }}
      >
        <p style={{ margin: 0 }}>
          <CarouselRichText text={text} />
        </p>
      </div>
    </CarouselStage>
  );
}
