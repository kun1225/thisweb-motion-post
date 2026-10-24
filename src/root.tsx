import { Composition, Folder } from 'remotion';

import {
  CarouselComposition,
  calculateCarouselMetadata,
} from './carousel/carousel-composition';
import { CAROUSEL_MOTION_FRAMES } from './carousel/carousel-motion';
import { CAROUSEL_FPS, CAROUSEL_SIZE } from './carousel/carousel-slide';
import {
  COVER_PREVIEW_FRAMES,
  CoverGallery,
  CoverPreview,
} from './covers/cover-preview';
import {
  ContentPreview,
  ListPreview,
  MotionPreview,
  OutroPreview,
  TextMotionPreview,
  TextPreview,
} from './layouts/layout-preview';

export function RemotionRoot() {
  // Separate nodes let Studio save each slide without changing the others.
  return (
    <>
      <Folder name="ai-code-review">
        <Composition
          id="ai-code-review-zh-1"
          component={CarouselComposition}
          defaultProps={{
            layers: {
              background: 'code',
              coverLayout: 'poster',
              title: {
                text: 'AI Code Review 流程',
                fontSize: 140,
                color: '#31E8FF',
                x: 0,
                y: 0,
              },
              subtitle: {
                text: 'Anthropic 的',
                fontSize: 40,
                color: '#F7F7F7',
                x: 0,
                y: 0,
              },
            },
          }}
          calculateMetadata={calculateCarouselMetadata}
          fps={CAROUSEL_FPS}
          durationInFrames={1}
          width={CAROUSEL_SIZE.width}
          height={CAROUSEL_SIZE.height}
        />
        <Composition
          id="ai-code-review-zh-2"
          component={CarouselComposition}
          defaultProps={{
            layers: {
              motion: {
                art: 'points',
                position: 'center',
                color: '#E5E7EB',
                boil: 2.5,
                strokeWidth: 3,
                x: 0,
                y: 0,
                scale: 1,
              },
              title: {
                text: 'Anthropic 如何 Code Review?',
                fontSize: 54,
                color: '#31E8FF',
                x: 0,
                y: 0,
              },
              body: {
                text: 'Anthropic 前幾天分享了 Claude Code 團隊如何用 AI 審查程式碼，分別有 **6 個重點**：\n\n1. 開 PR 前，先讓 AI 驗證過\n2. 設計多層檢查\n3. 根據改動風險，安排人工審查\n4. 避免 AI 互審反覆修改\n5. 搜集造成錯誤的原因，讓 AI 學習\n6. 人類還是需要負責方向與結果',
                fontSize: 40,
                color: '#F9FAFB',
                x: 0,
                y: 0,
              },
            },
          }}
          calculateMetadata={calculateCarouselMetadata}
          fps={CAROUSEL_FPS}
          durationInFrames={1}
          width={CAROUSEL_SIZE.width}
          height={CAROUSEL_SIZE.height}
        />
        <Composition
          id="ai-code-review-zh-3"
          component={CarouselComposition}
          defaultProps={{
            layers: {
              motion: {
                art: 'verify',
                position: 'top',
                color: '#E5E7EB',
                boil: 2.5,
                strokeWidth: 4,
                x: 0,
                y: 0,
                scale: 1,
              },
              title: {
                text: '1. 開 PR 前，先讓 AI 驗證過',
                fontSize: 54,
                color: '#31E8FF',
                x: 0,
                y: 0,
              },
              body: {
                text: '開 PR 或推 Code 之前，先讓 AI **跑測試、建置、檢查畫面、Verify 功能、Simplify Code**。\n\n改完後再由另一個 agent，用**新的上下文**審查改動，找出遺漏。',
                fontSize: 40,
                color: '#F9FAFB',
                x: 0,
                y: 0,
              },
            },
          }}
          calculateMetadata={calculateCarouselMetadata}
          fps={CAROUSEL_FPS}
          durationInFrames={1}
          width={CAROUSEL_SIZE.width}
          height={CAROUSEL_SIZE.height}
        />
        <Composition
          id="ai-code-review-zh-4"
          component={CarouselComposition}
          defaultProps={{
            layers: {
              motion: {
                art: 'layers',
                position: 'right',
                color: '#E5E7EB',
                boil: 2.5,
                strokeWidth: 3,
                x: 0,
                y: 0,
                scale: 1,
              },
              title: {
                text: '2. 設計多層檢查',
                fontSize: 54,
                color: '#31E8FF',
                x: 0,
                y: 0,
              },
              body: {
                text: '把驗證安排在不同階段：\n\n1. 本機驗證：跑測試、建置與畫面檢查\n2. AI Verify：找 bug 與連帶影響\n3. AI 資安審查：未處理的漏洞會擋住合併\n4. CI 檢查：格式、型別、測試與建置\n5. 人工核准：依改動風險安排審查\n6. 合併與發布：檢查整合結果，逐步開放\n\n上線後也要保留**監測與快速撤回**的機制。',
                fontSize: 40,
                color: '#F9FAFB',
                x: 0,
                y: 0,
              },
            },
          }}
          calculateMetadata={calculateCarouselMetadata}
          fps={CAROUSEL_FPS}
          durationInFrames={1}
          width={CAROUSEL_SIZE.width}
          height={CAROUSEL_SIZE.height}
        />
        <Composition
          id="ai-code-review-zh-5"
          component={CarouselComposition}
          defaultProps={{
            layers: {
              motion: {
                art: 'risk',
                position: 'center',
                color: '#E5E7EB',
                boil: 2.5,
                strokeWidth: 3,
                x: 0,
                y: 0,
                scale: 1,
              },
              title: {
                text: '3. 根據改動風險，安排人工審查',
                fontSize: 54,
                color: '#31E8FF',
                x: 0,
                y: 0,
              },
              body: {
                text: '團隊依改動的風險，設定核准人數：\n\n・文件、文案：通過 AI 檢查後直接上線\n・一般產品功能：**1 人**核准\n・金流、核心邏輯：**2 人以上**核准',
                fontSize: 40,
                color: '#F9FAFB',
                x: 0,
                y: 0,
              },
            },
          }}
          calculateMetadata={calculateCarouselMetadata}
          fps={CAROUSEL_FPS}
          durationInFrames={1}
          width={CAROUSEL_SIZE.width}
          height={CAROUSEL_SIZE.height}
        />
        <Composition
          id="ai-code-review-zh-6"
          component={CarouselComposition}
          defaultProps={{
            layers: {
              motion: {
                art: 'loop',
                position: 'full',
                color: '#E5E7EB',
                boil: 2.5,
                strokeWidth: 5,
                x: 0,
                y: 0,
                scale: 1,
              },
              title: {
                text: '4. 避免 AI 互審反覆修改',
                fontSize: 54,
                color: '#31E8FF',
                x: 0,
                y: 0,
              },
              body: {
                text: 'Anthropic 曾有一個 PR，來回審查、修改超過 **50 輪**。\n\n所以現在**三輪後**就要重新評估方向，避免重複提出相同問題。',
                fontSize: 40,
                color: '#F9FAFB',
                x: 0,
                y: 0,
              },
            },
          }}
          calculateMetadata={calculateCarouselMetadata}
          fps={CAROUSEL_FPS}
          durationInFrames={1}
          width={CAROUSEL_SIZE.width}
          height={CAROUSEL_SIZE.height}
        />
        <Composition
          id="ai-code-review-zh-7"
          component={CarouselComposition}
          defaultProps={{
            layers: {
              motion: {
                art: 'learn',
                position: 'top',
                color: '#E5E7EB',
                boil: 2.5,
                strokeWidth: 4,
                x: 0,
                y: 0,
                scale: 1,
              },
              title: {
                text: '5. 搜集造成錯誤的原因，讓 AI 學習',
                fontSize: 54,
                color: '#31E8FF',
                x: 0,
                y: 0,
              },
              body: {
                text: '記錄錯誤原因與修正方式，把反覆出現的問題補進**規則、skills 或自動檢查**。\n\n也把曾造成事故的 PR 留作評估案例，檢查 AI 能否抓到同類問題，並追蹤誤報。',
                fontSize: 40,
                color: '#F9FAFB',
                x: 0,
                y: 0,
              },
            },
          }}
          calculateMetadata={calculateCarouselMetadata}
          fps={CAROUSEL_FPS}
          durationInFrames={1}
          width={CAROUSEL_SIZE.width}
          height={CAROUSEL_SIZE.height}
        />
        <Composition
          id="ai-code-review-zh-8"
          component={CarouselComposition}
          defaultProps={{
            layers: {
              motion: {
                art: 'direction',
                position: 'center',
                color: '#E5E7EB',
                boil: 2.5,
                strokeWidth: 3,
                x: 0,
                y: 0,
                scale: 1,
              },
              title: {
                text: '6. 人類還是需要負責方向與結果',
                fontSize: 54,
                color: '#31E8FF',
                x: 0,
                y: 0,
              },
              body: {
                text: '產品方向、功能需求，以及檢查是否足夠，最後都還是需要**人類來判斷**。\n\n也只有人類能為**上線的結果**負責。',
                fontSize: 40,
                color: '#F9FAFB',
                x: 0,
                y: 0,
              },
            },
          }}
          calculateMetadata={calculateCarouselMetadata}
          fps={CAROUSEL_FPS}
          durationInFrames={1}
          width={CAROUSEL_SIZE.width}
          height={CAROUSEL_SIZE.height}
        />
        <Composition
          id="ai-code-review-zh-9"
          component={CarouselComposition}
          defaultProps={{
            layers: {
              title: {
                text: '想看完整文章嗎？',
                fontSize: 54,
                color: '#31E8FF',
                x: 0,
                y: 0,
              },
              subtitle: {
                text: '我把文章私訊給你～！',
                fontSize: 40,
                color: '#F9FAFB',
                x: 0,
                y: 0,
              },
            },
          }}
          calculateMetadata={calculateCarouselMetadata}
          fps={CAROUSEL_FPS}
          durationInFrames={1}
          width={CAROUSEL_SIZE.width}
          height={CAROUSEL_SIZE.height}
        />
      </Folder>
      <Folder name="layouts">
        <Composition
          id="content"
          component={ContentPreview}
          defaultProps={{
            lang: 'zh',
            layers: {
              title: {
                text: 'FLIP 動畫',
                fontSize: 54,
                color: '#31E8FF',
                x: 0,
                y: 0,
              },
              media: {
                x: 0,
                y: 0,
                scale: 1,
                ratio: 1,
              },
            },
          }}
          fps={CAROUSEL_FPS}
          durationInFrames={1}
          width={CAROUSEL_SIZE.width}
          height={CAROUSEL_SIZE.height}
        />
        <Composition
          id="text"
          component={TextPreview}
          defaultProps={{
            lang: 'zh',
            layers: {
              title: {
                text: '6 大 Agent 模式',
                fontSize: 54,
                color: '#31E8FF',
                x: 0,
                y: 0,
              },
            },
          }}
          fps={CAROUSEL_FPS}
          durationInFrames={1}
          width={CAROUSEL_SIZE.width}
          height={CAROUSEL_SIZE.height}
        />
        <Composition
          id="list-icon"
          component={ListPreview}
          defaultProps={{
            lang: 'zh',
            layers: {
              listLayout: 'icon',
              title: {
                text: '二、Sequential Agent',
                fontSize: 54,
                color: '#31E8FF',
                x: 0,
                y: 0,
              },
            },
          }}
          fps={CAROUSEL_FPS}
          durationInFrames={1}
          width={CAROUSEL_SIZE.width}
          height={CAROUSEL_SIZE.height}
        />
        <Composition
          id="list-cards"
          component={ListPreview}
          defaultProps={{
            lang: 'zh',
            layers: {
              listLayout: 'cards',
              title: {
                text: '二、Sequential Agent',
                fontSize: 54,
                color: '#31E8FF',
                x: 0,
                y: 0,
              },
            },
          }}
          fps={CAROUSEL_FPS}
          durationInFrames={1}
          width={CAROUSEL_SIZE.width}
          height={CAROUSEL_SIZE.height}
        />
        <Composition
          id="list-ruled"
          component={ListPreview}
          defaultProps={{
            lang: 'zh',
            layers: {
              listLayout: 'ruled',
              title: {
                text: '二、Sequential Agent',
                fontSize: 54,
                color: '#31E8FF',
                x: 0,
                y: 0,
              },
            },
          }}
          fps={CAROUSEL_FPS}
          durationInFrames={1}
          width={CAROUSEL_SIZE.width}
          height={CAROUSEL_SIZE.height}
        />
        <Composition
          id="list-steps"
          component={ListPreview}
          defaultProps={{
            lang: 'zh',
            layers: {
              listLayout: 'steps',
              title: {
                text: '二、Sequential Agent',
                fontSize: 54,
                color: '#31E8FF',
                x: 0,
                y: 0,
              },
            },
          }}
          fps={CAROUSEL_FPS}
          durationInFrames={1}
          width={CAROUSEL_SIZE.width}
          height={CAROUSEL_SIZE.height}
        />
        <Composition
          id="motion"
          component={MotionPreview}
          defaultProps={{
            lang: 'zh',
            layers: {
              motion: {
                art: 'turn',
                color: '#F9FAFB',
                boil: 2.5,
                strokeWidth: 3,
                x: 0,
                y: 0,
                scale: 1,
              },
              title: {
                text: '「先讓它能動，再讓它正確，最後才讓它變快。」',
                fontSize: 54,
                color: '#31E8FF',
                x: 0,
                y: 0,
              },
              subtitle: {
                text: 'Kent Beck',
                fontSize: 28,
                color: '#C4C4C4',
                x: 0,
                y: 0,
              },
            },
          }}
          fps={CAROUSEL_FPS}
          durationInFrames={CAROUSEL_MOTION_FRAMES}
          width={CAROUSEL_SIZE.width}
          height={CAROUSEL_SIZE.height}
        />
        <Composition
          id="outro"
          component={OutroPreview}
          defaultProps={{
            lang: 'zh',
            layers: {
              title: {
                text: '想看完整文章嗎？',
                fontSize: 54,
                color: '#31E8FF',
                x: 0,
                y: 0,
              },
              subtitle: {
                text: '我把文章私訊給你～！',
                fontSize: 40,
                color: '#F9FAFB',
                x: 0,
                y: 0,
              },
            },
          }}
          fps={CAROUSEL_FPS}
          durationInFrames={CAROUSEL_MOTION_FRAMES}
          width={CAROUSEL_SIZE.width}
          height={CAROUSEL_SIZE.height}
        />
        <Composition
          id="text-motion"
          component={TextMotionPreview}
          defaultProps={{
            lang: 'zh',
            layers: {
              motion: {
                art: 'draw',
                position: 'right',
                color: '#F9FAFB',
                boil: 2.5,
                strokeWidth: 3,
                x: 0,
                y: 0,
                scale: 1,
              },
              title: {
                text: '二、Sequential Agent',
                fontSize: 54,
                color: '#31E8FF',
                x: 0,
                y: 0,
              },
            },
          }}
          fps={CAROUSEL_FPS}
          durationInFrames={CAROUSEL_MOTION_FRAMES}
          width={CAROUSEL_SIZE.width}
          height={CAROUSEL_SIZE.height}
        />
        <Composition
          id="text-motion-top"
          component={TextMotionPreview}
          defaultProps={{
            lang: 'zh',
            layers: {
              motion: {
                art: 'swing',
                position: 'top',
                color: '#F9FAFB',
                boil: 2.5,
                strokeWidth: 4,
                x: 0,
                y: 0,
                scale: 1,
              },
              title: {
                text: '二、Sequential Agent',
                fontSize: 54,
                color: '#31E8FF',
                x: 0,
                y: 0,
              },
            },
          }}
          fps={CAROUSEL_FPS}
          durationInFrames={CAROUSEL_MOTION_FRAMES}
          width={CAROUSEL_SIZE.width}
          height={CAROUSEL_SIZE.height}
        />
        <Composition
          id="text-motion-full"
          component={TextMotionPreview}
          defaultProps={{
            lang: 'zh',
            layers: {
              motion: {
                art: 'spin',
                position: 'full',
                color: '#F9FAFB',
                boil: 2.5,
                strokeWidth: 5,
                x: 0,
                y: 0,
                scale: 1,
              },
              title: {
                text: '二、Sequential Agent',
                fontSize: 54,
                color: '#31E8FF',
                x: 0,
                y: 0,
              },
            },
          }}
          fps={CAROUSEL_FPS}
          durationInFrames={CAROUSEL_MOTION_FRAMES}
          width={CAROUSEL_SIZE.width}
          height={CAROUSEL_SIZE.height}
        />
      </Folder>
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
    </>
  );
}
