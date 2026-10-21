// PROTO — every variant as its own Studio composition; the Studio sidebar is the picker.
import type { ReactNode } from 'react';
import { Composition, Folder, useCurrentFrame, useVideoConfig } from 'remotion';

import { CarouselSlideView } from '../carousel/carousel-slide';
import { ListBaseline } from './list-baseline';
import { ListCards } from './list-cards';
import { ListRuled } from './list-ruled';
import { ListSteps } from './list-steps';
import { MotionDraw } from './motion-draw';
import { MotionField } from './motion-field';
import { MotionFrame } from './motion-frame';
import type { MotionArtProps, MotionSettings } from './motion-frame';
import { MotionTurn } from './motion-turn';
import { LIST_SAMPLE, TEXT_SAMPLE } from './proto-content';
import type { Lang } from './proto-kit';

const SIZE = { width: 1080, height: 1350, fps: 30 };
const MOTION_FRAMES = 240;
const LANGS: Lang[] = ['zh', 'en'];

const LIST_VARIANTS = {
  baseline: ListBaseline,
  cards: ListCards,
  ruled: ListRuled,
  steps: ListSteps,
};
type ListVariant = keyof typeof LIST_VARIANTS;

const MOTION_VARIANTS = {
  draw: MotionDraw,
  turn: MotionTurn,
  field: MotionField,
};
type MotionVariant = keyof typeof MOTION_VARIANTS;

const MOTION_DEFAULTS: MotionSettings = {
  ink: '#1C1B19',
  paper: '#ECE8DF',
  boil: 2.5,
  strokeWidth: 3,
};

export function ProtoCompositions() {
  return (
    <Folder name="proto">
      <Folder name="text">
        {LANGS.map((lang) => (
          <Composition
            key={lang}
            id={`proto-text-${lang}`}
            component={TextPreview}
            defaultProps={{ lang }}
            durationInFrames={1}
            {...SIZE}
          />
        ))}
      </Folder>
      <Folder name="list">
        {Object.keys(LIST_VARIANTS).flatMap((variant, i) =>
          LANGS.map((lang) => (
            <Composition
              key={`${variant}-${lang}`}
              id={`proto-list-${i + 1}-${variant}-${lang}`}
              component={ListPreview}
              defaultProps={{ variant: variant as ListVariant, lang }}
              durationInFrames={1}
              {...SIZE}
            />
          )),
        )}
      </Folder>
      <Folder name="motion">
        {Object.keys(MOTION_VARIANTS).flatMap((variant, i) =>
          LANGS.map((lang) => (
            <Composition
              key={`${variant}-${lang}`}
              id={`proto-motion-${i + 1}-${variant}-${lang}`}
              component={MotionPreview}
              defaultProps={{
                variant: variant as MotionVariant,
                lang,
                ...MOTION_DEFAULTS,
              }}
              durationInFrames={MOTION_FRAMES}
              {...SIZE}
            />
          )),
        )}
      </Folder>
    </Folder>
  );
}

function TextPreview({ lang }: { lang: Lang }) {
  const sample = TEXT_SAMPLE[lang];
  return (
    <CarouselSlideView
      slide={{ layout: 'content', ...sample, media: { kind: 'none' } }}
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

function ListPreview({ variant, lang }: { variant: ListVariant; lang: Lang }) {
  const Variant = LIST_VARIANTS[variant];
  return <Variant lang={lang} sample={LIST_SAMPLE[lang]} />;
}

function MotionPreview({
  variant,
  lang,
  ...settings
}: MotionSettings & { variant: MotionVariant; lang: Lang }) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const Art: (props: MotionArtProps) => ReactNode = MOTION_VARIANTS[variant];
  return (
    <MotionFrame lang={lang} settings={settings}>
      <Art {...settings} progress={frame / durationInFrames} />
    </MotionFrame>
  );
}
