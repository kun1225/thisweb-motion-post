import type { ReactNode } from 'react';

import type {
  CarouselLayerSettings,
  CarouselListItem,
  CarouselListLayout,
  CarouselListSlide,
} from './carousel.type';
import {
  COLOR,
  CarouselBody,
  CarouselColumn,
  CarouselRichText,
  CarouselTitle,
  MONO,
} from './carousel-parts';

export const CAROUSEL_LIST_LAYOUTS: CarouselListLayout[] = [
  'icon',
  'cards',
  'ruled',
  'steps',
];

/** Title, an optional lead paragraph, then the items in the chosen layout. */
export function CarouselList({
  slide,
  layers,
}: {
  slide: CarouselListSlide;
  layers: CarouselLayerSettings;
}) {
  const layout = layers.listLayout ?? 'icon';
  const Items = LIST_LAYOUTS[layout];
  if (Items === undefined) {
    throw new Error(
      `Unknown list layout "${layout}". Use one of: ${CAROUSEL_LIST_LAYOUTS.join(', ')}.`,
    );
  }
  return (
    <CarouselColumn>
      <CarouselTitle settings={layers.title}>{slide.title}</CarouselTitle>
      {slide.body && <CarouselBody text={slide.body} settings={layers.body} />}
      <Items items={slide.items} />
    </CarouselColumn>
  );
}

const LIST_LAYOUTS: Record<
  CarouselListLayout,
  (props: { items: CarouselListItem[] }) => ReactNode
> = {
  icon: IconList,
  cards: CardList,
  ruled: RuledList,
  steps: StepList,
};

/** One card per item, with an icon on the left. */
function IconList({ items }: { items: CarouselListItem[] }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        marginTop: 48,
      }}
    >
      {items.map((item, i) => (
        <div
          key={item.name}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 36,
            padding: '30px 44px',
            borderRadius: 16,
            backgroundColor: COLOR.card,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexShrink: 0,
              width: 72,
              fontFamily: MONO,
              fontSize: 48,
              color: COLOR.title,
            }}
          >
            {item.icon ? (
              <item.icon size={64} strokeWidth={1.75} color={COLOR.title} />
            ) : (
              itemNumber(i)
            )}
          </div>
          <div>
            <div style={{ fontSize: 40, fontWeight: 700 }}>{item.name}</div>
            <div
              style={{
                marginTop: 8,
                fontSize: 34,
                lineHeight: 1.5,
                color: COLOR.muted,
              }}
            >
              <CarouselRichText text={item.text} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/** One card per item, with a bold label on top. */
function CardList({ items }: { items: CarouselListItem[] }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        marginTop: 56,
      }}
    >
      {items.map((item) => (
        <div
          key={item.name}
          style={{
            padding: '36px 48px 40px',
            borderRadius: 16,
            backgroundColor: COLOR.card,
          }}
        >
          <div style={{ fontSize: 40, fontWeight: 700 }}>{item.name}</div>
          <div
            style={{
              marginTop: 12,
              fontSize: 34,
              lineHeight: 1.6,
              color: COLOR.muted,
            }}
          >
            <CarouselRichText text={item.text} />
          </div>
        </div>
      ))}
    </div>
  );
}

const RULE = '1px solid rgba(255, 255, 255, 0.14)';

/** No cards: thin lines split the rows, and labels get their own column. */
function RuledList({ items }: { items: CarouselListItem[] }) {
  return (
    <div style={{ marginTop: 64, borderBottom: RULE }}>
      {items.map((item) => (
        <div
          key={item.name}
          style={{
            display: 'grid',
            gridTemplateColumns: '190px 1fr',
            columnGap: 32,
            padding: '36px 0',
            borderTop: RULE,
            fontSize: 34,
            lineHeight: 1.6,
          }}
        >
          <div style={{ fontWeight: 700, color: COLOR.title }}>{item.name}</div>
          <div>
            <CarouselRichText text={item.text} />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Numbers on a thin line, for items that happen in order. */
function StepList({ items }: { items: CarouselListItem[] }) {
  const last = items.length - 1;
  return (
    <div style={{ marginTop: 64 }}>
      {items.map((item, i) => (
        <div key={item.name} style={{ display: 'flex', gap: 36 }}>
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
              {itemNumber(i)}
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
            <div style={{ fontSize: 40, lineHeight: '64px', fontWeight: 700 }}>
              {item.name}
            </div>
            <div style={{ fontSize: 34, lineHeight: 1.6, color: COLOR.muted }}>
              <CarouselRichText text={item.text} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function itemNumber(index: number) {
  return String(index + 1).padStart(2, '0');
}
