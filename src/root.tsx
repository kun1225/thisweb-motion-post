import { Composition, Folder } from 'remotion';

import { CAROUSEL_FPS, CAROUSEL_SIZE } from './carousel/carousel-slide';
import {
  COVER_PREVIEW_FRAMES,
  CoverGallery,
  CoverPreview,
} from './covers/cover-preview';

export function RemotionRoot() {
  // Separate nodes let Studio save each slide without changing the others.
  return (
    <Folder name="covers">
      <Composition
        id="cover-all"
        component={CoverGallery}
        defaultProps={{
          layers: {
            background: 'drift',
            title: {
              text: 'Post Title',
              fontSize: 87,
              color: '#31E8FF',
              x: 0,
              y: 0,
            },
            subtitle: {
              text: 'One line about what you will learn',
              fontSize: 53,
              color: '#F7F7F7',
              x: 0,
              y: 0,
            },
            media: {
              x: 0,
              y: 0,
              scale: 1,
            },
          },
        }}
        fps={CAROUSEL_FPS}
        durationInFrames={COVER_PREVIEW_FRAMES}
        width={CAROUSEL_SIZE.width}
        height={CAROUSEL_SIZE.height}
      />
      <Composition
        id="cover-all-zh"
        component={CoverGallery}
        defaultProps={{
          lang: 'zh',
          layers: {
            background: 'drift',
            title: {
              text: 'View Transitions 入門',
              fontSize: 87,
              color: '#31E8FF',
              x: 0,
              y: 0,
            },
            subtitle: {
              text: '用幾行 CSS 做出頁面切換動畫',
              fontSize: 53,
              color: '#F7F7F7',
              x: 0,
              y: 0,
            },
            media: {
              x: 0,
              y: 0,
              scale: 1,
            },
          },
        }}
        fps={CAROUSEL_FPS}
        durationInFrames={COVER_PREVIEW_FRAMES}
        width={CAROUSEL_SIZE.width}
        height={CAROUSEL_SIZE.height}
      />
      <Composition
        id="cover-stack"
        component={CoverPreview}
        defaultProps={{
          layers: {
            background: 'drift',
            coverLayout: 'stack',
            title: {
              text: 'Post Title',
              fontSize: 87,
              color: '#31E8FF',
              x: 0,
              y: 0,
            },
            subtitle: {
              text: 'One line about what you will learn',
              fontSize: 53,
              color: '#F7F7F7',
              x: 0,
              y: 0,
            },
            media: {
              x: 0,
              y: 0,
              scale: 1,
            },
          },
        }}
        fps={CAROUSEL_FPS}
        durationInFrames={COVER_PREVIEW_FRAMES}
        width={CAROUSEL_SIZE.width}
        height={CAROUSEL_SIZE.height}
      />
      <Composition
        id="cover-split"
        component={CoverPreview}
        defaultProps={{
          layers: {
            background: 'drift',
            coverLayout: 'split',
            title: {
              text: 'Post Title',
              fontSize: 120,
              color: '#31E8FF',
              x: 0,
              y: 0,
            },
            subtitle: {
              text: 'One line about what you will learn',
              fontSize: 96,
              color: '#F7F7F7',
              x: 0,
              y: 0,
            },
            media: {
              x: 0,
              y: 0,
              scale: 1,
            },
          },
        }}
        fps={CAROUSEL_FPS}
        durationInFrames={COVER_PREVIEW_FRAMES}
        width={CAROUSEL_SIZE.width}
        height={CAROUSEL_SIZE.height}
      />
      <Composition
        id="cover-caption"
        component={CoverPreview}
        defaultProps={{
          layers: {
            background: 'drift',
            coverLayout: 'caption',
            title: {
              text: 'Post Title',
              fontSize: 72,
              color: '#31E8FF',
              x: 0,
              y: 0,
            },
            subtitle: {
              text: 'One line about what you will learn',
              fontSize: 32,
              color: '#F7F7F7',
              x: 0,
              y: 0,
            },
            media: {
              x: 0,
              y: 0,
              scale: 1,
            },
          },
        }}
        fps={CAROUSEL_FPS}
        durationInFrames={COVER_PREVIEW_FRAMES}
        width={CAROUSEL_SIZE.width}
        height={CAROUSEL_SIZE.height}
      />
      <Composition
        id="cover-poster"
        component={CoverPreview}
        defaultProps={{
          layers: {
            background: 'drift',
            coverLayout: 'poster',
            title: {
              text: 'Post Title',
              fontSize: 160,
              color: '#31E8FF',
              x: 0,
              y: 0,
            },
            subtitle: {
              text: 'One line about what you will learn',
              fontSize: 40,
              color: '#F7F7F7',
              x: 0,
              y: 0,
            },
            media: {
              x: 0,
              y: 0,
              scale: 1,
            },
          },
        }}
        fps={CAROUSEL_FPS}
        durationInFrames={COVER_PREVIEW_FRAMES}
        width={CAROUSEL_SIZE.width}
        height={CAROUSEL_SIZE.height}
      />
      <Folder name="backgrounds">
        <Composition
          id="cover-bg-drift"
          component={CoverPreview}
          defaultProps={{
            layers: {
              background: 'drift',
              coverLayout: 'stack',
              title: {
                text: 'Post Title',
                fontSize: 87,
                color: '#31E8FF',
                x: 0,
                y: 0,
              },
              subtitle: {
                text: 'One line about what you will learn',
                fontSize: 53,
                color: '#F7F7F7',
                x: 0,
                y: 0,
              },
              media: {
                x: 0,
                y: 0,
                scale: 1,
              },
            },
          }}
          fps={CAROUSEL_FPS}
          durationInFrames={COVER_PREVIEW_FRAMES}
          width={CAROUSEL_SIZE.width}
          height={CAROUSEL_SIZE.height}
        />
        <Composition
          id="cover-bg-grid"
          component={CoverPreview}
          defaultProps={{
            layers: {
              background: 'grid',
              coverLayout: 'stack',
              title: {
                text: 'Post Title',
                fontSize: 87,
                color: '#31E8FF',
                x: 0,
                y: 0,
              },
              subtitle: {
                text: 'One line about what you will learn',
                fontSize: 53,
                color: '#F7F7F7',
                x: 0,
                y: 0,
              },
              media: {
                x: 0,
                y: 0,
                scale: 1,
              },
            },
          }}
          fps={CAROUSEL_FPS}
          durationInFrames={COVER_PREVIEW_FRAMES}
          width={CAROUSEL_SIZE.width}
          height={CAROUSEL_SIZE.height}
        />
        <Composition
          id="cover-bg-code"
          component={CoverPreview}
          defaultProps={{
            layers: {
              background: 'code',
              coverLayout: 'stack',
              title: {
                text: 'Post Title',
                fontSize: 87,
                color: '#31E8FF',
                x: 0,
                y: 0,
              },
              subtitle: {
                text: 'One line about what you will learn',
                fontSize: 53,
                color: '#F7F7F7',
                x: 0,
                y: 0,
              },
              media: {
                x: 0,
                y: 0,
                scale: 1,
              },
            },
          }}
          fps={CAROUSEL_FPS}
          durationInFrames={COVER_PREVIEW_FRAMES}
          width={CAROUSEL_SIZE.width}
          height={CAROUSEL_SIZE.height}
        />
      </Folder>
    </Folder>
  );
}
