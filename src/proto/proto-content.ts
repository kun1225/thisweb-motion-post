// PROTO — worst-case sample copy: long zh lines, a lead paragraph, a two-line item, inline code.
import type { Lang } from './proto-kit';

export const TEXT_SAMPLE: Record<Lang, { title: string; body: string }> = {
  zh: {
    title: '6 大 Agent 模式',
    body: '相信現在大家平常都會使用 Claude Code、Codex 提高生產力，但你知道這些工具背後用到哪些 Agent 設計方式嗎？\n\n這篇文章會快速介紹 **6 種常見** 的 AI Agent 設計模式，分別為：\n\n1. Single Agent\n2. Sequential Agent\n3. Parallel Agent\n4. Loop／Review and Critique\n5. Coordinator／Router\n6. Agent as a Tool',
  },
  en: {
    title: '6 Agent Patterns',
    body: 'You probably use Claude Code or Codex every day. But do you know which agent designs these tools are built on?\n\nThis post covers **6 common** AI agent patterns:\n\n1. Single Agent\n2. Sequential Agent\n3. Parallel Agent\n4. Loop / Review and Critique\n5. Coordinator / Router\n6. Agent as a Tool',
  },
};

export type ListSample = {
  title: string;
  body: string;
  items: { label: string; text: string }[];
};

export const LIST_SAMPLE: Record<Lang, ListSample> = {
  zh: {
    title: '二、Sequential Agent',
    body: '**多個 Agent 按照固定順序執行**，系統會將任務拆成多個階段，前一個 Agent 的輸出會成為下一個 Agent 的輸入。',
    items: [
      { label: '優點', text: '流程穩定、容易測試，執行結果也比較容易預測。' },
      {
        label: '缺點',
        text: '固定結構不易應對動態需求，前一步出錯也會影響後續結果。',
      },
      {
        label: '適合',
        text: '步驟明確的任務，例如 `清理 → 摘要 → 翻譯`。',
      },
    ],
  },
  en: {
    title: '2. Sequential Agent',
    body: '**Agents run in a fixed order.** The task is split into stages, and each agent’s output becomes the next agent’s input.',
    items: [
      {
        label: 'Pros',
        text: 'Stable and easy to test. Results are easy to predict.',
      },
      {
        label: 'Cons',
        text: 'A fixed shape can’t adapt to changing needs, and one bad step breaks every step after it.',
      },
      {
        label: 'Best for',
        text: 'Tasks with clear steps, like `clean → summarize → translate`.',
      },
    ],
  },
};

export const QUOTE_SAMPLE: Record<Lang, { quote: string; caption: string }> = {
  zh: {
    quote: '「先讓它能動，再讓它正確，最後才讓它變快。」',
    caption: 'Kent Beck',
  },
  en: {
    quote: '“Make it work, make it right, make it fast.”',
    caption: 'Kent Beck',
  },
};
