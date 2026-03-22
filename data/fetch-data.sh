#!/bin/bash
# Downloads all game data files listed in Raidbots metadata.json
# Usage: ./fetch-data.sh [output_dir]

set -e

BASE_URL="https://www.raidbots.com/static/data/live"
OUT_DIR="${1:-.}"

mkdir -p "$OUT_DIR"

echo "Fetching metadata..."
curl -sL "$BASE_URL/metadata.json" -o "$OUT_DIR/metadata.json"

echo "Downloading data files..."
for file in $(sed -n 's/.*"\([^"]*\.\(json\|txt\|lua\)\)".*/\1/p' "$OUT_DIR/metadata.json"); do
    echo "  $file"
    curl -sL "$BASE_URL/$file" -o "$OUT_DIR/$file"
done

echo "Done."
