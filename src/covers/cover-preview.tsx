import { AbsoluteFill } from 'remotion';

import {
  CAROUSEL_COVER_LAYOUTS,
  CAROUSEL_SIZE,
  COVER_TEXT_SIZE,
  CarouselSlideView,
} from '../carousel/carousel-slide';
import type {
  CarouselCompositionProps,
  CarouselCoverLayout,
  CarouselLayerSettings,
  CarouselMedia,
} from '../carousel/carousel.type';

// Long enough that the background animation moves slowly, like on a real cover.
export const COVER_PREVIEW_FRAMES = 240;

/** One cover with sample content, so layouts can be tuned without a real post. */
export function CoverPreview({ layers }: CarouselCompositionProps) {
  return (
    <CarouselSlideView
      slide={{
        layout: 'cover',
        title: layers.title.text,
        subtitle: layers.subtitle?.text ?? '',
        media: SAMPLE_MEDIA,
      }}
      lang="en"
      layers={layers}
      renderClip={renderMediaPlaceholder}
    />
  );
}

/** Every cover layout in one 2×2 grid, each with its own text sizes. */
export function CoverGallery({ layers }: CarouselCompositionProps) {
  return (
    <AbsoluteFill
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: '1fr 1fr',
      }}
    >
      {CAROUSEL_COVER_LAYOUTS.map((coverLayout) => (
        <div
          key={coverLayout}
          style={{ position: 'relative', overflow: 'hidden' }}
        >
          <div
            style={{
              position: 'absolute',
              ...CAROUSEL_SIZE,
              scale: 0.5,
              transformOrigin: 'top left',
            }}
          >
            <CoverPreview layers={withLayout(layers, coverLayout)} />
          </div>
          <div
            style={{
              position: 'absolute',
              top: 16,
              right: 20,
              fontFamily: 'ui-monospace, monospace',
              fontSize: 20,
              color: 'rgba(255, 255, 255, 0.5)',
            }}
          >
            {coverLayout}
          </div>
        </div>
      ))}
    </AbsoluteFill>
  );
}

const SAMPLE_MEDIA: CarouselMedia = {
  kind: 'clip',
  id: 'placeholder',
  frames: COVER_PREVIEW_FRAMES,
  loops: 1,
  ratio: 0.8,
};

function withLayout(
  layers: CarouselLayerSettings,
  coverLayout: CarouselCoverLayout,
): CarouselLayerSettings {
  const size = COVER_TEXT_SIZE[coverLayout];
  return {
    ...layers,
    coverLayout,
    title: { ...layers.title, fontSize: size.title },
    subtitle: layers.subtitle && {
      ...layers.subtitle,
      fontSize: size.subtitle,
    },
  };
}

function renderMediaPlaceholder() {
  return (
    <AbsoluteFill
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 24,
        border: '2px dashed rgba(255, 255, 255, 0.2)',
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        fontFamily: 'ui-monospace, monospace',
        fontSize: 32,
        color: 'rgba(255, 255, 255, 0.4)',
      }}
    >
      media
    </AbsoluteFill>
  );
}
