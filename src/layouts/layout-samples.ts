import { ThumbsDown, ThumbsUp, Workflow } from 'lucide-react';

import type { CarouselLang, CarouselListItem } from '../carousel/carousel.type';

// Long zh lines, a two-line item, and inline code: the content most likely to break a layout.
export const TEXT_SAMPLE: Record<CarouselLang, string> = {
  zh: '相信現在大家平常都會使用 Claude Code、Codex 提高生產力，但你知道這些工具背後用到哪些 Agent 設計方式嗎？\n\n這篇文章會快速介紹 **6 種常見** 的 AI Agent 設計模式，分別為：\n\n1. Single Agent\n2. Sequential Agent\n3. Parallel Agent\n4. Loop／Review and Critique\n5. Coordinator／Router\n6. Agent as a Tool',
  en: 'You probably use Claude Code or Codex every day. But do you know which agent designs these tools are built on?\n\nThis post covers **6 common** AI agent patterns:\n\n1. Single Agent\n2. Sequential Agent\n3. Parallel Agent\n4. Loop / Review and Critique\n5. Coordinator / Router\n6. Agent as a Tool',
};

export const LIST_SAMPLE: Record<
  CarouselLang,
  { body: string; items: CarouselListItem[] }
> = {
  zh: {
    body: '**多個 Agent 按照固定順序執行**，系統會將任務拆成多個階段，前一個 Agent 的輸出會成為下一個 Agent 的輸入。',
    items: [
      {
        icon: ThumbsUp,
        name: '優點',
        text: '流程穩定、容易測試，執行結果也比較容易預測。',
      },
      {
        icon: ThumbsDown,
        name: '缺點',
        text: '固定結構不易應對動態需求，前一步出錯也會影響後續結果。',
      },
      {
        icon: Workflow,
        name: '適合',
        text: '步驟明確的任務，例如 `清理 → 摘要 → 翻譯`。',
      },
    ],
  },
  en: {
    body: '**Agents run in a fixed order.** The task is split into stages, and each agent’s output becomes the next agent’s input.',
    items: [
      {
        icon: ThumbsUp,
        name: 'Pros',
        text: 'Stable and easy to test. Results are easy to predict.',
      },
      {
        icon: ThumbsDown,
        name: 'Cons',
        text: 'A fixed shape can’t adapt to changing needs, and one bad step breaks every step after it.',
      },
      {
        icon: Workflow,
        name: 'Best for',
        text: 'Tasks with clear steps, like `clean → summarize → translate`.',
      },
    ],
  },
};

// Two lines at most, so the media keeps most of the slide.
export const CONTENT_SAMPLE: Record<CarouselLang, string> = {
  zh: '每次點擊卡片，它都會 **平滑地展開** 到新位置，而不是直接跳過去。',
  en: 'Each click makes the card **expand smoothly** into place instead of jumping there.',
};

export const TEXT_MOTION_SAMPLE: Record<CarouselLang, string> = {
  zh: '**多個 Agent 按照固定順序執行**，系統會將任務拆成多個階段，前一個 Agent 的輸出會成為下一個 Agent 的輸入。\n\n流程穩定、容易測試，但前一步出錯也會影響後續結果。',
  en: '**Agents run in a fixed order.** The task is split into stages, and each agent’s output becomes the next agent’s input.\n\nIt is stable and easy to test, but one bad step breaks every step after it.',
};
