import type { CarouselLang, CarouselSlide } from '../../carousel/carousel.type';
import { TITLE_FRAMES } from './ascii-title';

export const ASCII_STYLE_SLIDES: Record<CarouselLang, CarouselSlide[]> = {
  zh: [
    {
      layout: 'cover',
      subtitle: '在網站上使用',
      title: 'ASCII 風格',
      media: { kind: 'none' },
      titleFrames: TITLE_FRAMES,
    },
    {
      layout: 'text-motion',
      title: '什麼是 ASCII 風格？',
      body: '只用**文字和符號**排出畫面，像早期的電腦和終端機。\n\n它很輕、很有個性，而且只要文字就能做到。這篇整理 **6 種**用法：\n\n標題、背景、按鈕、圖片轉文字、載入動畫、骨架載入',
    },
    {
      layout: 'text-effect',
      title: '1. 標題',
      body: '標題先變成亂碼，再一個字一個字**解開**。記得加上 `aria-label`，螢幕閱讀器才讀得到。',
    },
    {
      layout: 'text-effect',
      title: '2. 背景',
      body: '用 `.:-=+*#` 由淺到深，排出一片**會流動的字元**。放在內容後面時，記得降低對比。',
    },
    {
      layout: 'text-motion',
      title: '3. 按鈕',
      body: '滑過時，用**像素方塊**從左到右填滿按鈕，文字也跟著反白。',
    },
    {
      layout: 'text-motion',
      title: '4. 圖片轉文字',
      body: '看每一格有多**亮**，換成對應的字元，圖片就變成了文字。',
    },
    {
      layout: 'text-motion',
      title: '5. 載入動畫',
      body: '用 `[####....]` 做進度條，加上 `|/-\\` 轉圈，就是**終端機風格**的載入畫面。',
    },
    {
      layout: 'text-motion',
      title: '6. 骨架載入',
      body: '用 `░` 排出內容的形狀，讓**一道光**掃過。資料到了，再解碼成文字。',
    },
    {
      layout: 'list',
      title: '做 ASCII 風格的小技巧',
      items: [
        { name: '等寬字體', text: '用 `monospace` 字體，字元才會對齊。' },
        { name: '行高', text: '設成 `line-height: 1`，上下的字才接得起來。' },
        {
          name: '無障礙',
          text: '裝飾用的字元加 `aria-hidden`，標題用 `aria-label`。',
        },
        { name: '效能', text: '字元很多時用 `<canvas>` 畫，不要塞一堆 DOM。' },
        {
          name: '減少動態',
          text: '遇到 `prefers-reduced-motion` 時，讓字元停下來。',
        },
      ],
    },
  ],
  en: [
    {
      layout: 'cover',
      subtitle: 'Use it on your website',
      title: 'ASCII Style',
      media: { kind: 'none' },
      titleFrames: TITLE_FRAMES,
    },
    {
      layout: 'text-motion',
      title: 'What is ASCII style?',
      body: 'You build the screen with **only letters and symbols**, like old computers and terminals.\n\nIt is light, it has character, and all you need is text. Here are **6 ways** to use it:\n\nheading, background, button, image to text, loading, and skeleton',
    },
    {
      layout: 'text-effect',
      title: '1. Heading',
      body: 'Turn the heading into noise, then **decode** it letter by letter. Add `aria-label` so screen readers can read it.',
    },
    {
      layout: 'text-effect',
      title: '2. Background',
      body: 'Use `.:-=+*#` from light to dark to make a **field of moving characters**. Keep the contrast low behind content.',
    },
    {
      layout: 'text-motion',
      title: '3. Button',
      body: 'On hover, **pixel blocks** fill the button from left to right, and the text flips color.',
    },
    {
      layout: 'text-motion',
      title: '4. Image to text',
      body: 'Check how **bright** each cell is and swap in a matching character. The image turns into text.',
    },
    {
      layout: 'text-motion',
      title: '5. Loading',
      body: 'Make a progress bar with `[####....]` and a `|/-\\` spinner for a **terminal-style** loader.',
    },
    {
      layout: 'text-motion',
      title: '6. Skeleton loading',
      body: 'Draw the shape of the content with `░` and sweep **a band of light** across it. When the data arrives, decode it into text.',
    },
    {
      layout: 'list',
      title: 'Tips for ASCII style',
      items: [
        {
          name: 'Monospace',
          text: 'Use a `monospace` font so the characters line up.',
        },
        {
          name: 'Line height',
          text: 'Set `line-height: 1` so rows touch each other.',
        },
        {
          name: 'Accessibility',
          text: 'Add `aria-hidden` to art for looks, and `aria-label` to headings.',
        },
        {
          name: 'Performance',
          text: 'With lots of characters, draw on a `<canvas>` instead of many DOM nodes.',
        },
        {
          name: 'Reduced motion',
          text: 'Stop the characters for `prefers-reduced-motion`.',
        },
      ],
    },
  ],
};
