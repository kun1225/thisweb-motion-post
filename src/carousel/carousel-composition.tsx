import { useVideoConfig } from 'remotion';
import type { CalculateMetadataFunction } from 'remotion';

import { POSTS } from '../posts';
import { CarouselSlideView, carouselSlideDuration } from './carousel-slide';
import type {
  CarouselCompositionProps,
  ResolvedCarouselComposition,
} from './carousel.type';

export function CarouselComposition(props: CarouselCompositionProps) {
  const { id } = useVideoConfig();
  const { post, slide, lang } = resolveCarouselComposition(id, props.layers);

  return (
    <CarouselSlideView
      slide={slide}
      lang={lang}
      layers={props.layers}
      renderClip={post.renderClip}
    />
  );
}

export const calculateCarouselMetadata: CalculateMetadataFunction<
  CarouselCompositionProps
> = ({ props, compositionId }) => {
  const { slide } = resolveCarouselComposition(compositionId, props.layers);
  return { durationInFrames: carouselSlideDuration(slide) };
};

function resolveCarouselComposition(
  compositionId: string,
  layers: CarouselCompositionProps['layers'],
): ResolvedCarouselComposition {
  const match = /^(.*)-(en|zh)-([1-9]\d*)$/.exec(compositionId);
  const postId = match?.[1];
  const lang = match?.[2];
  const index = Number(match?.[3]) - 1;
  if (lang !== 'en' && lang !== 'zh') {
    throw new Error(`Invalid carousel composition ID "${compositionId}"`);
  }
  const post = POSTS.find((candidate) => candidate.id === postId);
  const originalSlide = post?.slides[lang]?.[index];
  if (post === undefined || originalSlide === undefined) {
    throw new Error(`No slide ${index + 1} in "${postId}" (${lang})`);
  }

  const slide = { ...originalSlide, title: layers.title.text };
  if (slide.layout === 'cover' && layers.subtitle) {
    slide.subtitle = layers.subtitle.text;
  }
  if (slide.layout === 'motion' && layers.subtitle) {
    slide.caption = layers.subtitle.text;
  }
  if ('media' in slide && slide.media.kind === 'video') {
    slide.media = {
      ...slide.media,
      file: layers.media?.file ?? slide.media.file,
      frames: layers.media?.frames ?? slide.media.frames,
      ratio: layers.media?.ratio ?? slide.media.ratio,
    };
    if (!Number.isInteger(slide.media.frames) || slide.media.frames < 1) {
      throw new Error('Video frames must be a positive whole number.');
    }
    if (!Number.isFinite(slide.media.ratio) || slide.media.ratio <= 0) {
      throw new Error('Video ratio must be greater than zero.');
    }
  }

  return { post, slide, lang };
}
