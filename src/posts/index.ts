import type { CarouselPost } from '../carousel/carousel.type';
import { aiCodeReviewPost } from './261026-ai-code-review/ai-code-review';

// Keep post-specific animations out of the shared carousel layout.
export const POSTS: CarouselPost[] = [aiCodeReviewPost];
