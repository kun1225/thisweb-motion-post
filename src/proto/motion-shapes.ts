// PROTO — the tilted square and dot from image 3, as line geometry in a 460×460 box.
import { Easing } from 'remotion';

export const ART = 460;
const C = ART / 2;
const HALF = 150;
export const TILT = -36;
export const SQUARE_SIDE = HALF * 2;

export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);

/** Square corners in the square's own frame (centre at 0,0). */
export const SQUARE_PATH = `M ${-HALF} ${-HALF} L ${HALF} ${-HALF} L ${HALF} ${HALF} L ${-HALF} ${HALF} Z`;
export const DOT = { x: -62, y: 58, r: 44 };

export function circlePath(x: number, y: number, r: number) {
  return `M ${x - r} ${y} A ${r} ${r} 0 1 0 ${x + r} ${y} A ${r} ${r} 0 1 0 ${x - r} ${y}`;
}

export const CENTER = `translate(${C} ${C})`;
