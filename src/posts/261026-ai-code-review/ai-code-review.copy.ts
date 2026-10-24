import type { CarouselLang, CarouselSlide } from '../../carousel/carousel.type';
import { CLAWD_CLIP, CLAWD_FRAMES } from './ai-code-review-mascot';

export const AI_CODE_REVIEW_SLIDES: Record<CarouselLang, CarouselSlide[]> = {
  zh: [
    {
      layout: 'cover',
      subtitle: 'Anthropic 的',
      title: 'AI Code Review 流程',
      media: { kind: 'none' },
      mascot: { clip: CLAWD_CLIP, frames: CLAWD_FRAMES },
    },
    {
      layout: 'text-motion',
      title: '6 個重點',
      body: 'Anthropic 前幾天分享了 Claude Code 團隊如何用 AI 審查程式碼，分別有 **6 個重點**：\n\n1. 開 PR 前，要先讓 AI 驗證\n2. 設計多層的檢查\n3. 根據改動的風險，來安排人工審查\n4. 避免 AI 互審反覆修改過多輪\n5. 搜集造成錯誤的原因，來讓 AI 學習\n6. 人類仍然需要負責方向與結果',
    },
    {
      layout: 'text-motion',
      title: '1. 開 PR 前，先讓 AI 驗證過',
      body: '開 PR 或推 Code 之前，先讓 AI **跑測試、建置、檢查畫面、Verify 功能、Simplify Code**。\n\n改完後再由另一個 agent，用**新的上下文**審查改動，找出遺漏。',
    },
    {
      layout: 'text-motion',
      title: '2. 設計多層檢查',
      body: '把驗證安排在不同階段：\n\n1. 本機驗證：跑測試、建置與畫面檢查\n2. AI Verify：找 bug 與連帶影響\n3. AI 資安審查：未處理的漏洞會擋住合併\n4. CI 檢查：格式、型別、測試與建置\n5. 人工核准：依改動風險安排審查\n6. 合併與發布：檢查整合結果，逐步開放\n\n上線後也要保留**監測與快速撤回**的機制。',
    },
    {
      layout: 'text-motion',
      title: '3. 根據改動風險，安排人工審查',
      body: '團隊依改動的風險，設定核准人數：\n\n・文件、文案：通過 AI 檢查後直接上線\n・一般產品功能：**1 人**核准\n・金流、核心邏輯：**2 人以上**核准',
    },
    {
      layout: 'text-motion',
      title: '4. 避免 AI 互審反覆修改',
      body: 'Anthropic 曾經有一個 PR，來回審查、修改超過 **50 輪**。\n\n所以現在**三輪後**就要重新評估方向，避免重複提出相同問題。',
    },
    {
      layout: 'text-motion',
      title: '5. 搜集造成錯誤的原因，讓 AI 學習',
      body: '記錄錯誤原因與修正方式，把反覆出現的問題補進**規則、skills 或自動檢查**。\n\n也把曾造成事故的 PR 留作評估案例，檢查 AI 能否抓到同類問題，並追蹤誤報。',
    },
    {
      layout: 'text-motion',
      title: '6. 人類還是需要負責方向與結果',
      body: '產品方向、功能需求，以及檢查是否足夠，最後都還是需要**人類來判斷**。\n\n也只有人類能為**上線的結果**負責。',
    },
    {
      layout: 'outro',
      title: '想看完整文章嗎？',
      cta: '留言：**Review**',
      note: '我把文章私訊給你～！',
      source: '來源：How the Claude Code team does code review',
    },
  ],
  en: [
    {
      layout: 'cover',
      subtitle: "Anthropic's",
      title: 'AI Code Review Flow',
      media: { kind: 'none' },
      mascot: { clip: CLAWD_CLIP, frames: CLAWD_FRAMES },
    },
    {
      layout: 'text-motion',
      title: 'How Anthropic Does Code Review',
      body: 'Anthropic shared how the Claude Code team uses AI to review code. It has **6 key points**:\n\n1. Let AI verify before you open a PR\n2. Build multiple layers of checks\n3. Match human review to the risk\n4. Stop AI from reviewing in circles\n5. Collect the causes of mistakes so AI learns\n6. Humans own the direction and the result',
    },
    {
      layout: 'text-motion',
      title: '1. Let AI verify before you open a PR',
      body: 'Before you open a PR or push code, let AI **run tests, build, check the screen, verify the feature, and simplify the code**.\n\nAfter the changes, a different agent reviews them with a **fresh context** to find what was missed.',
    },
    {
      layout: 'text-motion',
      title: '2. Build multiple layers of checks',
      body: 'Spread the checks across different stages:\n\n1. Local checks: tests, build, and screen checks\n2. AI Verify: find bugs and side effects\n3. AI security review: blocks the merge\n4. CI checks: format, types, tests, and build\n5. Human approval: depends on risk\n6. Merge and release: roll out step by step\n\nKeep **monitoring and fast rollback** after launch.',
    },
    {
      layout: 'text-motion',
      title: '3. Match human review to the risk',
      body: 'The team sets how many people must approve, based on risk:\n\n・Docs and copy: ship after AI checks pass\n・Normal product features: **1 person** approves\n・Payments and core logic: **2 or more people** approve',
    },
    {
      layout: 'text-motion',
      title: '4. Stop AI from reviewing in circles',
      body: "Anthropic once had a PR that went back and forth for over **50 rounds**.\n\nNow, **after three rounds**, they rethink the direction, so the same issues don't come up again and again.",
    },
    {
      layout: 'text-motion',
      title: '5. Collect the causes of mistakes so AI learns',
      body: 'Record why mistakes happen and how they were fixed. Add the problems that keep coming back to **rules, skills, or automatic checks**.\n\nAlso keep PRs that caused incidents as test cases. Check if the AI can catch similar issues, and track false alarms.',
    },
    {
      layout: 'text-motion',
      title: '6. Humans own the direction and the result',
      body: 'Product direction, feature needs, and whether the checks are enough all need a **human to decide**.\n\nOnly humans can be responsible for **what ships**.',
    },
    {
      layout: 'outro',
      title: 'Want the full article?',
      cta: 'Comment: **Review**',
      note: "I'll DM it to you!",
      source: 'Source: How the Claude Code team does code review',
    },
  ],
};
