export type AsciiGridProps = {
  lines: string[];
  /** The left edge, or the centre when `anchor` is `middle`. */
  x: number;
  y: number;
  cell: { width: number; height: number };
  fontSize: number;
  color?: string;
  /** A colour for one character; undefined keeps `color`. */
  colorAt?: (row: number, col: number, char: string) => string | undefined;
  anchor?: 'start' | 'middle';
};

/** `decode` scrambles and solves, `density` fades through `@#*+=-:.`, `type` deletes and types again. */
export type AsciiTitleMotion = 'decode' | 'density' | 'type';

/**
 * What one title character shows on a frame: the real `char`, nothing (`''`),
 * or another character drawn in mono over the space the real one keeps.
 */
export type AsciiTitleFrame = (args: {
  char: string;
  index: number;
  count: number;
  frame: number;
}) => string;
