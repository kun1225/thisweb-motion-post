import { AbsoluteFill } from 'remotion';

import { CarouselSlideView } from '../carousel/carousel-slide';
import type { CarouselLayerSettings } from '../carousel/carousel.type';
import { aiCodeReviewPost } from '../posts/261026-ai-code-review/ai-code-review';
import { BgTexture } from './bg-texture';
import type { BgTexturePreviewProps } from './bg-texture.type';

const TEXT = { color: '#F9FAFB', x: 0, y: 0 };
const LAYERS: Record<BgTexturePreviewProps['slide'], CarouselLayerSettings> = {
  1: {
    background: 'code',
    coverLayout: 'poster',
    title: {
      ...TEXT,
      text: 'AI Code Review 流程',
      fontSize: 140,
      color: '#31E8FF',
    },
    subtitle: { ...TEXT, text: 'Anthropic 的', fontSize: 40 },
  },
  3: {
    motion: {
      art: 'verify',
      position: 'top',
      color: '#E5E7EB',
      boil: 2.5,
      strokeWidth: 4,
    },
    title: {
      ...TEXT,
      text: '1. 開 PR 前，先讓 AI 驗證過',
      fontSize: 54,
      color: '#31E8FF',
    },
  },
  4: {
    motion: {
      art: 'runner',
      position: 'center',
      color: '#E5E7EB',
      boil: 2.5,
      strokeWidth: 4,
    },
    title: { ...TEXT, text: '2. 設計多層檢查', fontSize: 54, color: '#31E8FF' },
  },
};

/** A real slide with a texture behind its content, so textures are judged in context. */
export function BgTexturePreview({ texture, slide }: BgTexturePreviewProps) {
  const real = aiCodeReviewPost.slides.zh[slide - 1];
  if (real === undefined) throw new Error(`No slide ${slide}`);
  return (
    <AbsoluteFill>
      <CarouselSlideView
        slide={real}
        lang="zh"
        layers={LAYERS[slide]}
        renderClip={aiCodeReviewPost.renderClip}
        arts={aiCodeReviewPost.arts}
        highlight={aiCodeReviewPost.highlight}
        texture={<BgTexture variant={texture} />}
      />
      <div
        style={{
          position: 'absolute',
          top: 20,
          right: 24,
          fontFamily: 'ui-monospace, monospace',
          fontSize: 20,
          color: 'rgba(255, 255, 255, 0.5)',
        }}
      >
        {texture}
      </div>
    </AbsoluteFill>
  );
}
