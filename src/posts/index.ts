import type { CarouselPost } from '../carousel/carousel.type';
import { aiCodeReviewPost } from './ai-code-review/ai-code-review';

// Keep post-specific animations out of the shared carousel layout.
export const POSTS: CarouselPost[] = [aiCodeReviewPost];
