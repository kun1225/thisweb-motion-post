import { CarouselSlideView } from '../carousel/carousel-slide';
import { renderMediaPlaceholder } from '../covers/cover-preview';
import type { LayoutPreviewProps } from './layout-preview.type';
import {
  CONTENT_SAMPLE,
  LIST_SAMPLE,
  TEXT_MOTION_SAMPLE,
  TEXT_SAMPLE,
} from './layout-samples';

/** Title and body on top, a dashed box where the media goes, like `cover-stack`. */
export function ContentPreview({ layers, lang = 'zh' }: LayoutPreviewProps) {
  return (
    <CarouselSlideView
      slide={{
        layout: 'content',
        title: layers.title.text,
        body: CONTENT_SAMPLE[lang],
        media: {
          kind: 'clip',
          id: 'placeholder',
          frames: 1,
          loops: 1,
          ratio: layers.media?.ratio ?? 1,
        },
      }}
      lang={lang}
      layers={layers}
      renderClip={renderMediaPlaceholder}
    />
  );
}

/** Sample slides for the non-cover layouts, so they can be tuned without a real post. */
export function TextPreview({ layers, lang = 'zh' }: LayoutPreviewProps) {
  return (
    <CarouselSlideView
      slide={{
        layout: 'content',
        title: layers.title.text,
        body: TEXT_SAMPLE[lang],
        media: { kind: 'none' },
      }}
      lang={lang}
      layers={layers}
      renderClip={undefined}
    />
  );
}

export function ListPreview({ layers, lang = 'zh' }: LayoutPreviewProps) {
  return (
    <CarouselSlideView
      slide={{ layout: 'list', title: layers.title.text, ...LIST_SAMPLE[lang] }}
      lang={lang}
      layers={layers}
      renderClip={undefined}
    />
  );
}

export function MotionPreview({ layers, lang = 'zh' }: LayoutPreviewProps) {
  return (
    <CarouselSlideView
      slide={{
        layout: 'motion',
        title: layers.title.text,
        caption: layers.subtitle?.text ?? '',
      }}
      lang={lang}
      layers={layers}
      renderClip={undefined}
    />
  );
}

export function TextMotionPreview({ layers, lang = 'zh' }: LayoutPreviewProps) {
  return (
    <CarouselSlideView
      slide={{
        layout: 'text-motion',
        title: layers.title.text,
        body: TEXT_MOTION_SAMPLE[lang],
      }}
      lang={lang}
      layers={layers}
      renderClip={undefined}
    />
  );
}
