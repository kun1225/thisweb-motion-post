# motion-post

ThisWeb carousel posts for Instagram, built with Remotion. Each post has an English and a Traditional Chinese version. Every slide is 1080×1350. Text stays still; only the media and line art move.

## Commands

```sh
pnpm install
pnpm studio                 # preview and tweak every slide
pnpm render <post-id>      # render one post to out/<post-id>/<lang>/
pnpm check-types
```

Slides with video or a clip render as MP4. Slides with no media render as PNG.

## Edit in Studio

Open a slide, press Escape to clear the layer selection, and expand the right sidebar. Under **Default Props → layers**, edit:

- `title`, `subtitle`, and `body`: text, font size, color, and position. `body` is the paragraph on `content`, `list`, and `text-motion` slides; use `\n\n` between paragraphs. Add `fontFamily` only to override the default font.
- `background` (cover slides): the background animation. Use `drift` (default; a teal glow moving in a circle), `grid` (a dot grid with a band of light passing through), or `code` (faint code lines scrolling up). Other slides use the static background.
- `coverLayout` (cover slides): `stack` (default; subtitle and title on top, media below), `split` (title top left, subtitle bottom right, no media), `caption` (title on top, media in the middle, subtitle as a small caption), or `poster` (big title at the bottom left, no media). Raise the title `fontSize` for `split` and `poster`.
- `listLayout` (list slides): `icon` (default; one card per item with its icon, or its number when it has no icon), `cards` (a bold label on top of each card), `ruled` (no cards; thin lines between rows), or `steps` (numbers on a line, for items that happen in order).
- `motion` (`motion` and `text-motion` slides): the line art. `art` is `draw` (a pen line draws a square and dot, then wipes them), `turn` (a square makes quarter turns), `field` (parallel lines with a slow wave), `swing` (a row of balls in a pendulum wave), or `spin` (coins roll across the slide, spinning on their edge). A post can also add its own line art in its `arts` (see `src/posts/261026-ai-code-review/ai-code-review-arts.tsx`); use its name as `art`. `color` is the line colour, `boil` is the hand-drawn wobble in pixels (0 turns it off), and `strokeWidth` is the line width. `x`, `y`, and `scale` move and resize the art from where its layout puts it. On `text-motion` slides, `position` is `right` (default; small art in the bottom right), `center` (wider art along the bottom), `top` (big art on top, text at the bottom), or `full` (centred text, with the art moving across the whole slide on top of it). Lines are drawn as ink with [perfect-freehand](https://github.com/steveruizok/perfect-freehand), so they swell, thin, and taper like a brush pen; draw a post's own lines with `InkPath` from `src/carousel/carousel-ink.tsx`.
- `media`: position and scale. Videos also have a file path, frame count, and aspect ratio.

Positions are offsets in pixels: positive `x` moves right and positive `y` moves down. Video paths are relative to `public/`. At 30 fps, 30 frames equal one second. Changing the frame count updates the slide duration; it does not change the video's playback speed.

Studio saves edits to that slide's `defaultProps` in `src/root.tsx`. Each composition has its own JSX node and plain values so edits stay separate and also apply to command-line renders. The slide text and media defaults in `src/posts/` remain the starting template; the editable layer values in `src/root.tsx` take priority.

## Structure

- `src/carousel/`: the shared ThisWeb look (background, title, footer, media box) and seven layouts:
  - `cover`: subtitle, big title, media
  - `content`: title, body, media. With `media: { kind: 'none' }` it is a pure text slide.
  - `list`: title, optional lead `body`, and items in one of four `listLayout`s
  - `result`: title, media, tip list
  - `motion`: a short centred statement, line art, and a small `caption`
  - `text-motion`: title and body, with line art below, above, or across the whole slide (see `position`)
  - `outro`: a short closing title, a `cta` inside a hand-inked box that draws itself (`**keyword**` is highlighted), a small `note`, and an optional `source`. The `note` comes from `layers.subtitle`.
- `src/posts/<post-id>/`: one folder per post. It has the slide text and any animations of its own.
- `src/posts/index.ts`: the post data and animations used by the compositions.
- `src/covers/`: sample covers for trying layouts and backgrounds without a real post.
- `src/layouts/`: sample slides for the other layouts, with the same goal.
- `src/root.tsx`: one composition per slide, with its saved Studio settings.
- `public/<post-id>/`: footage the slides play. Git ignores `.mp4` files, so keep the originals in the post's asset folder (in `database/resources/assets/`).

## Cover previews

The **covers** folder in Studio shows each cover layout with sample text and a dashed placeholder where the media goes. `cover-all` puts all four layouts in one 2×2 grid, and `cover-all-zh` does the same with 繁中 text. Each uses the text from its own `layers` and each layout's own font sizes. `cover-stack`, `cover-split`, `cover-caption`, and `cover-poster` show one layout each, so you can tune it like a real slide.

## Layout previews

The **layouts** folder in Studio shows the other layouts with sample 繁中 text: `content` (a dashed box where the media goes, like `cover-stack`; change `layers.media.ratio` to try other media shapes), `text`, `list-icon`, `list-cards`, `list-ruled`, `list-steps`, `motion`, `text-motion`, `text-motion-top`, `text-motion-full`, and `outro`. Set `lang` to `en` for the English sample. The title comes from `layers.title`; the `motion` caption comes from `layers.subtitle`.

`motion`, `text-motion`, and `outro` slides last 8 seconds and render as MP4. The line art makes one full cycle per slide, so it loops without a jump.

## List icons

List items take an optional `icon`: any [lucide-react](https://lucide.dev/icons) icon, such as `icon: ThumbsUp`, or your own component that accepts `size`, `color`, and `strokeWidth`.

## Add a post

1. Make `src/posts/<post-id>/<post-id>.copy.ts` with `en` and `zh` slide lists. Text can use `**highlight**` (orange) and `` `code` `` (mono).
2. Make `src/posts/<post-id>/<post-id>.tsx` that exports a `CarouselPost`. Add `renderClip` only if the post draws its own animations.
3. Add the post to `src/posts/index.ts`, then add one `<Composition>` per slide in `src/root.tsx`. Use IDs like `<post-id>-<lang>-<slide-number>`, starting at 1, with `CarouselComposition` and `calculateCarouselMetadata`. Copy an existing composition's inline `defaultProps` and fill in its layer values. Keep each composition separate so Studio can save it independently.
4. Put the footage in `public/<post-id>/`, then run `pnpm render <post-id>`.

## Fonts

Fonts load from the system, so they must be installed on this Mac: Source Serif 4 and Noto Serif TC (cover titles), IBM Plex Sans and Noto Sans TC (all other text), and Paper Mono (code). In 繁中 slides, English words use Source Serif 4 or Plex, and Chinese characters use Noto.

## Browser

Remotion's bundled headless Chrome can hang on "Waiting for root component to load". The render script then uses Chrome for Testing from the Playwright cache. To use a different browser, set `REMOTION_BROWSER_EXECUTABLE`.
