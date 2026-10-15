import { CAROUSEL_FPS } from '../../carousel/carousel-slide';
import type {
  CarouselLang,
  CarouselMedia,
  CarouselSlide,
} from '../../carousel/carousel.type';
import { FLIP_STEP_FRAMES, FLIP_STEP_RATIO } from './flip-step';

const RECORDING_RATIO = 4 / 5;
const STEP = {
  kind: 'clip',
  frames: FLIP_STEP_FRAMES,
  loops: 2,
  ratio: FLIP_STEP_RATIO,
} as const;

const MEDIA = {
  normal: {
    kind: 'video',
    file: 'flip-animation/flip-normal.mp4',
    frames: Math.round(8.5 * CAROUSEL_FPS),
    ratio: RECORDING_RATIO,
  },
  noFlip: {
    kind: 'video',
    file: 'flip-animation/no-flip.mp4',
    frames: 4 * CAROUSEL_FPS,
    ratio: RECORDING_RATIO,
  },
  slow: {
    kind: 'video',
    file: 'flip-animation/flip-slow.mp4',
    frames: Math.round(7.9 * CAROUSEL_FPS),
    ratio: RECORDING_RATIO,
  },
  first: { ...STEP, id: 'first' },
  last: { ...STEP, id: 'last' },
  invert: { ...STEP, id: 'invert' },
  play: { ...STEP, id: 'play' },
} satisfies Record<string, CarouselMedia>;

export const FLIP_ANIMATION_SLIDES: Record<CarouselLang, CarouselSlide[]> = {
  zh: [
    {
      layout: 'cover',
      subtitle: '讓元素從原地長出來',
      title: 'FLIP 動畫',
      media: MEDIA.normal,
    },
    {
      layout: 'content',
      title: 'Dialog 突然出現',
      body: '點開卡片，畫面直接淡入。\n使用者**不知道它從哪裡來**。',
      media: MEDIA.noFlip,
    },
    {
      layout: 'list',
      title: '什麼是 FLIP？',
      items: [
        { letter: 'F', name: 'First', text: '記下開始位置' },
        { letter: 'L', name: 'Last', text: '記下結束位置' },
        { letter: 'I', name: 'Invert', text: '用 transform 移回開始位置' },
        { letter: 'P', name: 'Play', text: '移除 transform，播放動畫' },
      ],
    },
    {
      layout: 'content',
      title: 'First：記下開始位置',
      body: '改變版面前，用\n`getBoundingClientRect()` 量出卡片。',
      media: MEDIA.first,
    },
    {
      layout: 'content',
      title: 'Last：記下結束位置',
      body: '讓元素直接跳到最終位置，再量一次。\n此時**畫面還沒更新**。',
      media: MEDIA.last,
    },
    {
      layout: 'content',
      title: 'Invert：反轉回去',
      body: '算出差距，用 `translate` + `scale`\n把元素**放回卡片上**。',
      media: MEDIA.invert,
    },
    {
      layout: 'content',
      title: 'Play：播放',
      body: '移除 transform，\n元素就會**動到最終位置**。',
      media: MEDIA.play,
    },
    {
      layout: 'result',
      title: '成果（慢動作）',
      tips: [
        '只動 `transform`，不動 `width` / `height`',
        '用 `clip-path` 處理圓角',
        '尊重 `prefers-reduced-motion`',
      ],
      media: MEDIA.slow,
    },
  ],
  en: [
    {
      layout: 'cover',
      subtitle: 'Make elements grow from where they are',
      title: 'FLIP Animation',
      media: MEDIA.normal,
    },
    {
      layout: 'content',
      title: 'It just appears',
      body: 'Click a card and the dialog fades in.\nUsers **lose track of where it came from**.',
      media: MEDIA.noFlip,
    },
    {
      layout: 'list',
      title: 'What is FLIP?',
      items: [
        { letter: 'F', name: 'First', text: 'Measure the start' },
        { letter: 'L', name: 'Last', text: 'Measure the end' },
        { letter: 'I', name: 'Invert', text: 'Move it back with transform' },
        { letter: 'P', name: 'Play', text: 'Remove the transform, animate' },
      ],
    },
    {
      layout: 'content',
      title: 'First: measure the start',
      body: 'Before the layout changes, read the\ncard with `getBoundingClientRect()`.',
      media: MEDIA.first,
    },
    {
      layout: 'content',
      title: 'Last: measure the end',
      body: 'Jump it to the final place and measure\nagain. **Nothing has painted yet**.',
      media: MEDIA.last,
    },
    {
      layout: 'content',
      title: 'Invert: put it back',
      body: 'Use the difference to `translate` +\n`scale` it **back onto the card**.',
      media: MEDIA.invert,
    },
    {
      layout: 'content',
      title: 'Play: let it go',
      body: 'Remove the transform, and it\n**animates to its final place**.',
      media: MEDIA.play,
    },
    {
      layout: 'result',
      title: 'The result (slow-mo)',
      tips: [
        'Animate `transform`, not `width` / `height`',
        'Use `clip-path` for the corners',
        'Respect `prefers-reduced-motion`',
      ],
      media: MEDIA.slow,
    },
  ],
};
