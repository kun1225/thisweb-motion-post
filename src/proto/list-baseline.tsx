// PROTO — the current `list` layout, unchanged. It has no lead paragraph, so the body is dropped.
import { CarouselSlideView } from '../carousel/carousel-slide';
import type { ListSample } from './proto-content';
import type { Lang } from './proto-kit';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] as const;

export function ListBaseline({
  lang,
  sample,
}: {
  lang: Lang;
  sample: ListSample;
}) {
  return (
    <CarouselSlideView
      slide={{
        layout: 'list',
        title: sample.title,
        items: sample.items.map((item, i) => ({
          letter: LETTERS[i] ?? String(i + 1),
          name: item.label,
          text: item.text,
        })),
      }}
      lang={lang}
      layers={{
        title: {
          text: sample.title,
          fontSize: 54,
          color: '#31E8FF',
          x: 0,
          y: 0,
        },
      }}
      renderClip={undefined}
    />
  );
}
