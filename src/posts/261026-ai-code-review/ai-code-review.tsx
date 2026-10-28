import type { CarouselPost } from '../../carousel/carousel.type';
import { AI_CODE_REVIEW_ARTS } from './ai-code-review-arts';
import { CLAWD_CLIP, ClawdHello } from './ai-code-review-mascot';
import { AI_CODE_REVIEW_SLIDES } from './ai-code-review.copy';

export const aiCodeReviewPost: CarouselPost = {
  id: '261026-ai-code-review',
  slides: AI_CODE_REVIEW_SLIDES,
  arts: AI_CODE_REVIEW_ARTS,
  highlight: 'underline',
  renderClip: (id) => {
    if (id === CLAWD_CLIP) return <ClawdHello />;
    throw new Error(`Unknown clip "${id}" in 261026-ai-code-review.`);
  },
};
