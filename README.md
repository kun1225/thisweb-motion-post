# motion-post

ThisWeb carousel posts for Instagram, built with Remotion. Each post has an English and a Traditional Chinese version. Every slide is 1080×1350. Text stays still; only the media moves.

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

- `title` and `subtitle`: text, font size, color, and position. Add `fontFamily` only to override the default font.
- `background` (cover slides): the background animation. Use `drift` (default; a teal glow moving in a circle), `grid` (a dot grid with a band of light passing through), or `code` (faint code lines scrolling up). Other slides use the static background.
- `coverLayout` (cover slides): `stack` (default; subtitle and title on top, media below), `split` (title top left, subtitle bottom right, no media), `caption` (title on top, media in the middle, subtitle as a small caption), or `poster` (big title at the bottom left, no media). Raise the title `fontSize` for `split` and `poster`.
- `media`: position and scale. Videos also have a file path, frame count, and aspect ratio.

Positions are offsets in pixels: positive `x` moves right and positive `y` moves down. Video paths are relative to `public/`. At 30 fps, 30 frames equal one second. Changing the frame count updates the slide duration; it does not change the video's playback speed.

Studio saves edits to that slide's `defaultProps` in `src/root.tsx`. Each composition has its own JSX node and plain values so edits stay separate and also apply to command-line renders. The slide text and media defaults in `src/posts/` remain the starting template; the editable layer values in `src/root.tsx` take priority.

## Structure

- `src/carousel/`: the shared ThisWeb look (background, title, footer, media box) and four layouts:
  - `cover`: subtitle, big title, media
  - `content`: title, body, media
  - `list`: title and lettered cards
  - `result`: title, media, tip list
- `src/posts/<post-id>/`: one folder per post. It has the slide text and any animations of its own.
- `src/posts/index.ts`: the post data and animations used by the compositions.
- `src/covers/`: sample covers for trying layouts and backgrounds without a real post.
- `src/root.tsx`: one composition per slide, with its saved Studio settings.
- `public/<post-id>/`: footage the slides play. Git ignores `.mp4` files, so keep the originals in the post's asset folder (in `database/resources/assets/`).

## Cover previews

The **covers** folder in Studio shows each cover layout with sample text and a dashed placeholder where the media goes. `cover-all` puts all four layouts in one 2×2 grid, and `cover-all-zh` does the same with 繁中 text. Each uses the text from its own `layers` and each layout's own font sizes. `cover-stack`, `cover-split`, `cover-caption`, and `cover-poster` show one layout each, so you can tune it like a real slide.

## Add a post

1. Make `src/posts/<post-id>/<post-id>.copy.ts` with `en` and `zh` slide lists. Text can use `**highlight**` (orange) and `` `code` `` (mono).
2. Make `src/posts/<post-id>/<post-id>.tsx` that exports a `CarouselPost`. Add `renderClip` only if the post draws its own animations.
3. Add the post to `src/posts/index.ts`, then add one `<Composition>` per slide in `src/root.tsx`. Use IDs like `<post-id>-<lang>-<slide-number>`, starting at 1, with `CarouselComposition` and `calculateCarouselMetadata`. Copy an existing composition's inline `defaultProps` and fill in its layer values. Keep each composition separate so Studio can save it independently.
4. Put the footage in `public/<post-id>/`, then run `pnpm render <post-id>`.

## Fonts

Fonts load from the system, so they must be installed on this Mac: Source Serif 4 and Noto Serif TC (cover titles), IBM Plex Sans and Noto Sans TC (all other text), and Paper Mono (code). In 繁中 slides, English words use Source Serif 4 or Plex, and Chinese characters use Noto.

## Browser

Remotion's bundled headless Chrome can hang on "Waiting for root component to load". The render script then uses Chrome for Testing from the Playwright cache. To use a different browser, set `REMOTION_BROWSER_EXECUTABLE`.
