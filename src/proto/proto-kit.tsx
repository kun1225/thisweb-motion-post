// PROTO — throwaway. Copies of the private carousel-slide helpers, so production stays untouched.
import { Fragment } from 'react';
import type { CSSProperties, ReactNode } from 'react';

export type Lang = 'en' | 'zh';

export const COLOR = {
  title: '#31E8FF',
  highlight: '#F0893C',
  text: '#F9FAFB',
  muted: '#C4C4C4',
  card: 'rgba(0, 0, 0, 0.25)',
};
export const MONO = '"Paper Mono", ui-monospace, monospace';
export const FONT: Record<Lang, { sans: string; serif: string }> = {
  en: {
    sans: '"IBM Plex Sans", sans-serif',
    serif: '"Source Serif 4", serif',
  },
  zh: {
    sans: '"IBM Plex Sans", "Noto Sans TC", sans-serif',
    serif: '"Source Serif 4", "Noto Serif TC", serif',
  },
};
export const PAD_X = 110;

export function Column({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: `105px ${PAD_X}px 160px`,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {children}
    </div>
  );
}

export function Title({ children }: { children: ReactNode }) {
  return (
    <h1
      style={{
        margin: 0,
        fontSize: 54,
        lineHeight: 1.3,
        fontWeight: 700,
        color: COLOR.title,
      }}
    >
      {children}
    </h1>
  );
}

export function Lead({ text, style }: { text: string; style?: CSSProperties }) {
  return (
    <p style={{ margin: '36px 0 0', fontSize: 40, lineHeight: 1.6, ...style }}>
      <RichText text={text} />
    </p>
  );
}

export function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*.+?\*\*|`.+?`)/);
  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('**')) {
          return (
            <strong key={index} style={{ color: COLOR.highlight }}>
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith('`')) {
          return (
            <code key={index} style={{ fontFamily: MONO, fontSize: '0.9em' }}>
              {part.slice(1, -1)}
            </code>
          );
        }
        return <Fragment key={index}>{part}</Fragment>;
      })}
    </>
  );
}

export function Footer({
  color = 'rgba(255, 255, 255, 0.6)',
}: {
  color?: string;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 70,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontFamily: MONO,
        fontSize: 32,
        color,
      }}
    >
      @this.web
    </div>
  );
}
