import type { CarouselPost } from '../../carousel/carousel.type';
import { FLIP_ANIMATION_SLIDES } from './flip-animation.copy';
import { FLIP_STEP_SIZE, FlipStep } from './flip-step';
import type { FlipStepName } from './flip-step.type';

export const flipAnimationPost: CarouselPost = {
  id: 'flip-animation',
  slides: FLIP_ANIMATION_SLIDES,
  renderClip: (id, size) => (
    <div
      style={{
        // Out of the Loop's flex flow, which would squeeze it.
        position: 'absolute',
        left: 0,
        top: 0,
        ...FLIP_STEP_SIZE,
        transformOrigin: 'top left',
        // Drawn at its own size, then scaled to the media box.
        transform: `scale(${size.width / FLIP_STEP_SIZE.width})`,
      }}
    >
      <FlipStep step={id as FlipStepName} />
    </div>
  ),
};
