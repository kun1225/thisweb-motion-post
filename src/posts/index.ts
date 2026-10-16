import type { CarouselPost } from '../carousel/carousel.type';
import { flipAnimationPost } from './flip-animation/flip-animation';

// Keep post-specific animations out of the shared carousel layout.
export const POSTS: CarouselPost[] = [flipAnimationPost];
