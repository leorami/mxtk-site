#!/bin/sh
set -e

# Wave 9 public folder cleanup: move photos and remove legacy waves/textures
ROOT_DIR=$(cd "$(dirname "$0")/.." && pwd)
PUB="$ROOT_DIR/public"

mkdir -p "$PUB/art/photos"

# Move backgrounds/* to art/photos/ with specified names (if present)
move_if_exists() {
  src="$1"; dest="$2";
  if [ -f "$src" ]; then
    echo "Moving $(basename "$src") -> $dest"
    mv "$src" "$dest"
  fi
}

for name in \
  home_gold.jpg \
  owners_citrine.jpg \
  institutions_lapis.jpg \
  transparency_tigereye.jpg \
  whitepaper_obsidian.jpg \
  elitedrop_jade.jpg \
  careers_amber.jpg \
  roadmap_copper.jpg \
  media_onyx.jpg \
  ecosystem_jade.jpg \
  faq_quartz.jpg \
  resources_hematite.jpg \
  contact_diamond.jpg \
  team_sapphire.jpg
do
  move_if_exists "$PUB/art/backgrounds/$name" "$PUB/art/photos/$name"
done

# Remove legacy paths if present
rm -rf "$PUB/art/waves" || true
rm -rf "$PUB/minerals/supporting" || true
rm -rf "$PUB/photos" || true

echo "Cleanup complete."

#!/usr/bin/env bash
set -euo pipefail

ROOT="${1:-.}"

# remove old/stylized assets we no longer want
rm -rf "$ROOT/public/art/waves" || true
rm -rf "$ROOT/public/minerals/supporting" || true

# optional: remove duplicate logo/icon sets we don’t use
# rm -rf "$ROOT/public/legacy-icons" || true

# ensure backgrounds dir exists
mkdir -p "$ROOT/public/art/backgrounds"

echo "Cleanup complete."


