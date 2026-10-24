import type { CarouselLang, CarouselSlide } from '../../carousel/carousel.type';
import { CLAWD_CLIP, CLAWD_FRAMES } from './ai-code-review-mascot';

// Only zh for now; the en slides come later.
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
  en: [],
};
