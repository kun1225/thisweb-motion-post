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
            logo: {
              text: '.W',
              fontFamily: '"Avenir Next Condensed", sans-serif',
              fontSize: 85,
              color: '#D9DCE3',
              x: 0,
              y: 0,
            },
            footer: {
              text: '@this.web',
              fontFamily: '"Paper Mono", ui-monospace, monospace',
              fontSize: 35,
              color: 'rgba(255, 255, 255, 0.6)',
              x: 0,
              y: 0,
            },
            title: {
              text: 'Post Title',
              fontFamily: '"IBM Plex Sans", sans-serif',
              fontSize: 87,
              color: '#31E8FF',
              x: 0,
              y: 0,
            },
            subtitle: {
              text: 'One line about what you will learn',
              fontFamily: '"IBM Plex Sans", sans-serif',
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
            logo: {
              text: '.W',
              fontFamily: '"Avenir Next Condensed", sans-serif',
              fontSize: 85,
              color: '#D9DCE3',
              x: 0,
              y: 0,
            },
            footer: {
              text: '@this.web',
              fontFamily: '"Paper Mono", ui-monospace, monospace',
              fontSize: 35,
              color: 'rgba(255, 255, 255, 0.6)',
              x: 0,
              y: 0,
            },
            title: {
              text: 'Post Title',
              fontFamily: '"IBM Plex Sans", sans-serif',
              fontSize: 87,
              color: '#31E8FF',
              x: 0,
              y: 0,
            },
            subtitle: {
              text: 'One line about what you will learn',
              fontFamily: '"IBM Plex Sans", sans-serif',
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
            logo: {
              text: '.W',
              fontFamily: '"Avenir Next Condensed", sans-serif',
              fontSize: 85,
              color: '#D9DCE3',
              x: 0,
              y: 0,
            },
            footer: {
              text: '@this.web',
              fontFamily: '"Paper Mono", ui-monospace, monospace',
              fontSize: 35,
              color: 'rgba(255, 255, 255, 0.6)',
              x: 0,
              y: 0,
            },
            title: {
              text: 'Post Title',
              fontFamily: '"IBM Plex Sans", sans-serif',
              fontSize: 120,
              color: '#31E8FF',
              x: 0,
              y: 0,
            },
            subtitle: {
              text: 'One line about what you will learn',
              fontFamily: '"IBM Plex Sans", sans-serif',
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
            logo: {
              text: '.W',
              fontFamily: '"Avenir Next Condensed", sans-serif',
              fontSize: 85,
              color: '#D9DCE3',
              x: 0,
              y: 0,
            },
            footer: {
              text: '@this.web',
              fontFamily: '"Paper Mono", ui-monospace, monospace',
              fontSize: 35,
              color: 'rgba(255, 255, 255, 0.6)',
              x: 0,
              y: 0,
            },
            title: {
              text: 'Post Title',
              fontFamily: '"IBM Plex Sans", sans-serif',
              fontSize: 72,
              color: '#31E8FF',
              x: 0,
              y: 0,
            },
            subtitle: {
              text: 'One line about what you will learn',
              fontFamily: '"IBM Plex Sans", sans-serif',
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
            logo: {
              text: '.W',
              fontFamily: '"Avenir Next Condensed", sans-serif',
              fontSize: 85,
              color: '#D9DCE3',
              x: 0,
              y: 0,
            },
            footer: {
              text: '@this.web',
              fontFamily: '"Paper Mono", ui-monospace, monospace',
              fontSize: 35,
              color: 'rgba(255, 255, 255, 0.6)',
              x: 0,
              y: 0,
            },
            title: {
              text: 'Post Title',
              fontFamily: '"IBM Plex Sans", sans-serif',
              fontSize: 160,
              color: '#31E8FF',
              x: 0,
              y: 0,
            },
            subtitle: {
              text: 'One line about what you will learn',
              fontFamily: '"IBM Plex Sans", sans-serif',
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
    </Folder>
  );
}
