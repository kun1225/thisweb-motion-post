import type { CarouselPost } from '../../carousel/carousel.type';
import { AI_CODE_REVIEW_ARTS } from './ai-code-review-arts';
import { AI_CODE_REVIEW_SLIDES } from './ai-code-review.copy';

export const aiCodeReviewPost: CarouselPost = {
  id: 'ai-code-review',
  slides: AI_CODE_REVIEW_SLIDES,
  arts: AI_CODE_REVIEW_ARTS,
};
