// PROTO — no surfaces: hairline rules split the rows, labels sit in their own left column.
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

const RULE = '1px solid rgba(255, 255, 255, 0.14)';

export function ListRuled({
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
        <div style={{ marginTop: 64, borderBottom: RULE }}>
          {sample.items.map((item) => (
            <div
              key={item.label}
              style={{
                display: 'grid',
                gridTemplateColumns: '190px 1fr',
                columnGap: 32,
                padding: '36px 0',
                borderTop: RULE,
              }}
            >
              <div
                style={{
                  fontSize: 34,
                  lineHeight: 1.6,
                  fontWeight: 700,
                  color: COLOR.title,
                }}
              >
                {item.label}
              </div>
              <div style={{ fontSize: 34, lineHeight: 1.6 }}>
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
