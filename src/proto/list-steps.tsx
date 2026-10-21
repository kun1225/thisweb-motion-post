// PROTO — a connected sequence: mono numbers on a thin rail, so order reads as part of the content.
import { AbsoluteFill } from 'remotion';

import { CarouselBackground } from '../carousel/carousel-background';
import type { ListSample } from './proto-content';
import {
  COLOR,
  Column,
  FONT,
  Footer,
  Lead,
  MONO,
  RichText,
  Title,
} from './proto-kit';
import type { Lang } from './proto-kit';

export function ListSteps({
  lang,
  sample,
}: {
  lang: Lang;
  sample: ListSample;
}) {
  const last = sample.items.length - 1;
  return (
    <AbsoluteFill style={{ color: COLOR.text, fontFamily: FONT[lang].sans }}>
      <CarouselBackground />
      <Column>
        <Title>{sample.title}</Title>
        <Lead text={sample.body} />
        <div style={{ marginTop: 64 }}>
          {sample.items.map((item, i) => (
            <div key={item.label} style={{ display: 'flex', gap: 36 }}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: 56,
                }}
              >
                <span
                  style={{
                    fontFamily: MONO,
                    fontSize: 32,
                    lineHeight: '64px',
                    color: COLOR.title,
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                {i < last && (
                  <span
                    style={{
                      flex: 1,
                      width: 2,
                      margin: '8px 0',
                      backgroundColor: 'rgba(49, 232, 255, 0.25)',
                    }}
                  />
                )}
              </div>
              <div style={{ flex: 1, paddingBottom: i < last ? 44 : 0 }}>
                <div
                  style={{ fontSize: 40, lineHeight: '64px', fontWeight: 700 }}
                >
                  {item.label}
                </div>
                <div
                  style={{ fontSize: 34, lineHeight: 1.6, color: COLOR.muted }}
                >
                  <RichText text={item.text} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Column>
      <Footer />
    </AbsoluteFill>
  );
}
