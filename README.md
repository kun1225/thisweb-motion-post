# motion-post

ThisWeb carousel posts for Instagram, built with Remotion. Each post has an English and a Traditional Chinese version. Every slide is 1080×1350. Text stays still; only the media moves.

## Commands

```sh
pnpm install
pnpm studio                 # preview and tweak every slide
pnpm render flip-animation  # render one post to out/<post-id>/<lang>/
pnpm check-types
```

Slides with video or a clip render as MP4. Slides with no media render as PNG.

## Structure

- `src/carousel/`: the shared ThisWeb look (background, `.W` logo, title, footer, media box) and four layouts:
  - `cover`: subtitle, big title, media
  - `content`: title, body, media
  - `list`: title and lettered cards
  - `result`: title, media, tip list
- `src/posts/<post-id>/`: one folder per post. It has the slide text and any animations of its own.
- `src/posts/index.ts`: the list of posts shown in the studio.
- `public/<post-id>/`: footage the slides play. Git ignores `.mp4` files, so keep the originals in the post's asset folder (in `database/resources/assets/`).

## Add a post

1. Make `src/posts/<post-id>/<post-id>.copy.ts` with `en` and `zh` slide lists. Text can use `**highlight**` (orange) and `` `code` `` (mono).
2. Make `src/posts/<post-id>/<post-id>.tsx` that exports a `CarouselPost`. Add `renderClip` only if the post draws its own animations.
3. Add the post to `src/posts/index.ts`.
4. Put the footage in `public/<post-id>/`, then run `pnpm render <post-id>`.

## Fonts

Fonts load from the system, so they must be installed on this Mac: LINE Seed TW (繁中), IBM Plex Sans (EN), Paper Mono (code), Avenir Next Condensed (logo).

## Browser

Remotion's bundled headless Chrome can hang on "Waiting for root component to load". The render script then uses Chrome for Testing from the Playwright cache. To use a different browser, set `REMOTION_BROWSER_EXECUTABLE`.
