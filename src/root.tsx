import { Composition, Folder } from 'remotion';

import {
  CAROUSEL_FPS,
  CAROUSEL_SIZE,
  CarouselSlideView,
  carouselSlideDuration,
} from './carousel/carousel-slide';
import type { CarouselLang } from './carousel/carousel.type';
import { POSTS } from './posts';

const LANGS: CarouselLang[] = ['en', 'zh'];

/** Every slide is one composition: `<post>-<lang>-<n>`. */
export function RemotionRoot() {
  return (
    <>
      {POSTS.map((post) => (
        <Folder key={post.id} name={post.id}>
          {LANGS.flatMap((lang) =>
            post.slides[lang].map((slide, index) => (
              <Composition
                key={`${lang}-${index}`}
                id={`${post.id}-${lang}-${index + 1}`}
                component={CarouselComposition}
                // Only plain values here, so the studio can show and edit props.
                defaultProps={{ postId: post.id, lang, index }}
                fps={CAROUSEL_FPS}
                durationInFrames={carouselSlideDuration(slide)}
                {...CAROUSEL_SIZE}
              />
            )),
          )}
        </Folder>
      ))}
    </>
  );
}

// *** CarouselComposition ***
function CarouselComposition({
  postId,
  lang,
  index,
}: {
  postId: string;
  lang: CarouselLang;
  index: number;
}) {
  const post = POSTS.find((candidate) => candidate.id === postId);
  const slide = post?.slides[lang][index];
  if (post === undefined || slide === undefined) {
    throw new Error(`No slide ${index + 1} in "${postId}" (${lang})`);
  }

  return (
    <CarouselSlideView slide={slide} lang={lang} renderClip={post.renderClip} />
  );
}
