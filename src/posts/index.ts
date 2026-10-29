import type { CarouselPost } from '../carousel/carousel.type';
import { aiCodeReviewPost } from './261026-ai-code-review/ai-code-review';
import { asciiStylePost } from './261103-ascii-style/ascii-style';

// Keep post-specific animations out of the shared carousel layout.
export const POSTS: CarouselPost[] = [aiCodeReviewPost, asciiStylePost];
