// PROTO — image 2: lead paragraph, then one dark card per item with a bold label on top.
import { AbsoluteFill } from 'remotion';

import { CarouselBackground } from '../carousel/carousel-background';
import type { ListSample } from './proto-content';
import {
  COLOR,
  Column,
  FONT,
  Footer,
  Lead,
  RichText,
  Title,
} from './proto-kit';
import type { Lang } from './proto-kit';

export function ListCards({
  lang,
  sample,
}: {
  lang: Lang;
  sample: ListSample;
}) {
  return (
    <AbsoluteFill style={{ color: COLOR.text, fontFamily: FONT[lang].sans }}>
      <CarouselBackground />
      <Column>
        <Title>{sample.title}</Title>
        <Lead text={sample.body} />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
            marginTop: 56,
          }}
        >
          {sample.items.map((item) => (
            <div
              key={item.label}
              style={{
                padding: '36px 48px 40px',
                borderRadius: 16,
                backgroundColor: COLOR.card,
              }}
            >
              <div style={{ fontSize: 40, fontWeight: 700 }}>{item.label}</div>
              <div
                style={{
                  marginTop: 12,
                  fontSize: 34,
                  lineHeight: 1.6,
                  color: COLOR.muted,
                }}
              >
                <RichText text={item.text} />
              </div>
            </div>
          ))}
        </div>
      </Column>
      <Footer />
    </AbsoluteFill>
  );
}
