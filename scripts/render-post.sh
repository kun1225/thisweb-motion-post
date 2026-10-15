#!/usr/bin/env bash
# Renders every slide of one post: MP4 for slides with media, PNG for stills.
# Usage: pnpm render <post-id>   →   out/<post-id>/<lang>/01.mp4 …
set -euo pipefail

post="${1:?Usage: pnpm render <post-id>}"

# Remotion's own headless shell hangs on this machine, so prefer Chrome for Testing.
fallback="$HOME/Library/Caches/ms-playwright/chromium-1248/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing"
if [ -z "${REMOTION_BROWSER_EXECUTABLE:-}" ] && [ -x "$fallback" ]; then
  export REMOTION_BROWSER_EXECUTABLE="$fallback"
fi

list=$(remotion compositions src/index.ts 2>/dev/null | grep -E "^$post-(en|zh)-[0-9]+ " || true)
if [ -z "$list" ]; then
  echo "No slides found for \"$post\". Is it in src/posts/index.ts?" >&2
  exit 1
fi

while read -r id rest; do
  lang=$(echo "$id" | sed -E "s/^$post-([a-z]+)-[0-9]+$/\1/")
  n=$(printf "%02d" "${id##*-}")
  mkdir -p "out/$post/$lang"
  if [[ "$rest" == *Still* ]]; then
    remotion still src/index.ts "$id" "out/$post/$lang/$n.png"
  else
    remotion render src/index.ts "$id" "out/$post/$lang/$n.mp4"
  fi
done <<< "$list"
