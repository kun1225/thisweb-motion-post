import { Composition, Folder } from 'remotion';

import {
  CarouselComposition,
  calculateCarouselMetadata,
} from './carousel/carousel-composition';

export function RemotionRoot() {
  // Separate nodes let Studio save each slide without changing the others.
  return (
    <Folder name="flip-animation">
      <Composition
        id="flip-animation-en-1"
        component={CarouselComposition}
        defaultProps={{
          layers: {
            title: {
              text: 'FLIP Animation',
              fontFamily: '"IBM Plex Sans", sans-serif',
              fontSize: 87,
              color: '#31E8FF',
              x: 0,
              y: 0,
            },
            subtitle: {
              text: 'Make elements grow from where they are',
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
              file: 'flip-animation/flip-normal.mp4',
              frames: 255,
              ratio: 0.8,
            },
          },
        }}
        calculateMetadata={calculateCarouselMetadata}
        fps={30}
        durationInFrames={255}
        width={1080}
        height={1350}
      />
      <Composition
        id="flip-animation-en-2"
        component={CarouselComposition}
        defaultProps={{
          layers: {
            title: {
              text: 'It just appears',
              fontFamily: '"IBM Plex Sans", sans-serif',
              fontSize: 54,
              color: '#31E8FF',
              x: 0,
              y: 0,
            },
            media: {
              x: 0,
              y: 0,
              scale: 1,
              file: 'flip-animation/no-flip.mp4',
              frames: 120,
              ratio: 0.8,
            },
          },
        }}
        calculateMetadata={calculateCarouselMetadata}
        fps={30}
        durationInFrames={120}
        width={1080}
        height={1350}
      />
      <Composition
        id="flip-animation-en-3"
        component={CarouselComposition}
        defaultProps={{
          layers: {
            title: {
              text: 'What is FLIP?',
              fontFamily: '"IBM Plex Sans", sans-serif',
              fontSize: 54,
              color: '#31E8FF',
              x: 0,
              y: 0,
            },
          },
        }}
        calculateMetadata={calculateCarouselMetadata}
        fps={30}
        durationInFrames={1}
        width={1080}
        height={1350}
      />
      <Composition
        id="flip-animation-en-4"
        component={CarouselComposition}
        defaultProps={{
          layers: {
            title: {
              text: 'First: measure the start',
              fontFamily: '"IBM Plex Sans", sans-serif',
              fontSize: 54,
              color: '#31E8FF',
              x: 0,
              y: 0,
            },
            media: { x: 0, y: 0, scale: 1 },
          },
        }}
        calculateMetadata={calculateCarouselMetadata}
        fps={30}
        durationInFrames={180}
        width={1080}
        height={1350}
      />
      <Composition
        id="flip-animation-en-5"
        component={CarouselComposition}
        defaultProps={{
          layers: {
            title: {
              text: 'Last: measure the end',
              fontFamily: '"IBM Plex Sans", sans-serif',
              fontSize: 54,
              color: '#31E8FF',
              x: 0,
              y: 0,
            },
            media: { x: 0, y: 0, scale: 1 },
          },
        }}
        calculateMetadata={calculateCarouselMetadata}
        fps={30}
        durationInFrames={180}
        width={1080}
        height={1350}
      />
      <Composition
        id="flip-animation-en-6"
        component={CarouselComposition}
        defaultProps={{
          layers: {
            title: {
              text: 'Invert: put it back',
              fontFamily: '"IBM Plex Sans", sans-serif',
              fontSize: 54,
              color: '#31E8FF',
              x: 0,
              y: 0,
            },
            media: { x: 0, y: 0, scale: 1 },
          },
        }}
        calculateMetadata={calculateCarouselMetadata}
        fps={30}
        durationInFrames={180}
        width={1080}
        height={1350}
      />
      <Composition
        id="flip-animation-en-7"
        component={CarouselComposition}
        defaultProps={{
          layers: {
            title: {
              text: 'Play: let it go',
              fontFamily: '"IBM Plex Sans", sans-serif',
              fontSize: 54,
              color: '#31E8FF',
              x: 0,
              y: 0,
            },
            media: { x: 0, y: 0, scale: 1 },
          },
        }}
        calculateMetadata={calculateCarouselMetadata}
        fps={30}
        durationInFrames={180}
        width={1080}
        height={1350}
      />
      <Composition
        id="flip-animation-en-8"
        component={CarouselComposition}
        defaultProps={{
          layers: {
            title: {
              text: 'The result (slow-mo)',
              fontFamily: '"IBM Plex Sans", sans-serif',
              fontSize: 54,
              color: '#31E8FF',
              x: 0,
              y: 0,
            },
            media: {
              x: 0,
              y: 0,
              scale: 1,
              file: 'flip-animation/flip-slow.mp4',
              frames: 237,
              ratio: 0.8,
            },
          },
        }}
        calculateMetadata={calculateCarouselMetadata}
        fps={30}
        durationInFrames={237}
        width={1080}
        height={1350}
      />
      <Composition
        id="flip-animation-zh-1"
        component={CarouselComposition}
        defaultProps={{
          layers: {
            title: {
              text: 'FLIP 動畫',
              fontFamily: '"LINE Seed TW_TTF", "LINE Seed TW", sans-serif',
              fontSize: 87,
              color: '#31E8FF',
              x: 0,
              y: 0,
            },
            subtitle: {
              text: '讓元素從原地長出來',
              fontFamily: '"LINE Seed TW_TTF", "LINE Seed TW", sans-serif',
              fontSize: 53,
              color: '#F7F7F7',
              x: 0,
              y: 0,
            },
            media: {
              x: 0,
              y: 0,
              scale: 1,
              file: 'flip-animation/flip-normal.mp4',
              frames: 255,
              ratio: 0.8,
            },
          },
        }}
        calculateMetadata={calculateCarouselMetadata}
        fps={30}
        durationInFrames={255}
        width={1080}
        height={1350}
      />
      <Composition
        id="flip-animation-zh-2"
        component={CarouselComposition}
        defaultProps={{
          layers: {
            title: {
              text: 'Dialog 突然出現',
              fontFamily: '"LINE Seed TW_TTF", "LINE Seed TW", sans-serif',
              fontSize: 54,
              color: '#31E8FF',
              x: 0,
              y: 0,
            },
            media: {
              x: 0,
              y: 0,
              scale: 1,
              file: 'flip-animation/no-flip.mp4',
              frames: 120,
              ratio: 0.8,
            },
          },
        }}
        calculateMetadata={calculateCarouselMetadata}
        fps={30}
        durationInFrames={120}
        width={1080}
        height={1350}
      />
      <Composition
        id="flip-animation-zh-3"
        component={CarouselComposition}
        defaultProps={{
          layers: {
            title: {
              text: '什麼是 FLIP？',
              fontFamily: '"LINE Seed TW_TTF", "LINE Seed TW", sans-serif',
              fontSize: 54,
              color: '#31E8FF',
              x: 0,
              y: 0,
            },
          },
        }}
        calculateMetadata={calculateCarouselMetadata}
        fps={30}
        durationInFrames={1}
        width={1080}
        height={1350}
      />
      <Composition
        id="flip-animation-zh-4"
        component={CarouselComposition}
        defaultProps={{
          layers: {
            title: {
              text: 'First：記下開始位置',
              fontFamily: '"LINE Seed TW_TTF", "LINE Seed TW", sans-serif',
              fontSize: 54,
              color: '#31E8FF',
              x: 0,
              y: 0,
            },
            media: { x: 0, y: 0, scale: 1 },
          },
        }}
        calculateMetadata={calculateCarouselMetadata}
        fps={30}
        durationInFrames={180}
        width={1080}
        height={1350}
      />
      <Composition
        id="flip-animation-zh-5"
        component={CarouselComposition}
        defaultProps={{
          layers: {
            title: {
              text: 'Last：記下結束位置',
              fontFamily: '"LINE Seed TW_TTF", "LINE Seed TW", sans-serif',
              fontSize: 54,
              color: '#31E8FF',
              x: 0,
              y: 0,
            },
            media: { x: 0, y: 0, scale: 1 },
          },
        }}
        calculateMetadata={calculateCarouselMetadata}
        fps={30}
        durationInFrames={180}
        width={1080}
        height={1350}
      />
      <Composition
        id="flip-animation-zh-6"
        component={CarouselComposition}
        defaultProps={{
          layers: {
            title: {
              text: 'Invert：反轉回去',
              fontFamily: '"LINE Seed TW_TTF", "LINE Seed TW", sans-serif',
              fontSize: 54,
              color: '#31E8FF',
              x: 0,
              y: 0,
            },
            media: { x: 0, y: 0, scale: 1 },
          },
        }}
        calculateMetadata={calculateCarouselMetadata}
        fps={30}
        durationInFrames={180}
        width={1080}
        height={1350}
      />
      <Composition
        id="flip-animation-zh-7"
        component={CarouselComposition}
        defaultProps={{
          layers: {
            title: {
              text: 'Play：播放',
              fontFamily: '"LINE Seed TW_TTF", "LINE Seed TW", sans-serif',
              fontSize: 54,
              color: '#31E8FF',
              x: 0,
              y: 0,
            },
            media: { x: 0, y: 0, scale: 1 },
          },
        }}
        calculateMetadata={calculateCarouselMetadata}
        fps={30}
        durationInFrames={180}
        width={1080}
        height={1350}
      />
      <Composition
        id="flip-animation-zh-8"
        component={CarouselComposition}
        defaultProps={{
          layers: {
            title: {
              text: '成果（慢動作）',
              fontFamily: '"LINE Seed TW_TTF", "LINE Seed TW", sans-serif',
              fontSize: 54,
              color: '#31E8FF',
              x: 0,
              y: 0,
            },
            media: {
              x: 0,
              y: 0,
              scale: 1,
              file: 'flip-animation/flip-slow.mp4',
              frames: 237,
              ratio: 0.8,
            },
          },
        }}
        calculateMetadata={calculateCarouselMetadata}
        fps={30}
        durationInFrames={237}
        width={1080}
        height={1350}
      />
    </Folder>
  );
}
