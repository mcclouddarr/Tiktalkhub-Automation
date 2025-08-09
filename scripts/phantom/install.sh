#!/usr/bin/env bash
set -euo pipefail

if [ $# -lt 1 ]; then
  echo "Usage: $0 <DOWNLOAD_URL> [INSTALL_DIR]"
  exit 1
fi

URL="$1"
DIR="${2:-$HOME/phantom-bin}"
mkdir -p "$DIR"
TMP=$(mktemp -d)

cd "$TMP"
echo "Downloading $URL ..."
curl -L "$URL" -o pkg

# Try common formats
if file pkg | grep -qi zip; then
  unzip -q pkg -d extract
elif file pkg | grep -qi gzip; then
  mkdir extract && tar -xzf pkg -C extract
else
  echo "Unknown package format; saved at $TMP/pkg"
  exit 2
fi

# Find executable
CAND=$(find extract -type f -name "chrome" -o -name "phantom" -o -name "chrome.exe" | head -n1)
if [ -z "$CAND" ]; then
  echo "No executable found in archive"
  exit 3
fi

STAMP=$(date +%Y%m%d%H%M%S)
DST="$DIR/phantom-$STAMP"
mkdir -p "$DST"
cp -R "$(dirname "$CAND")"/* "$DST"/
ln -sfn "$DST" "$DIR/phantom-current"

echo "Installed to $DST"
echo "Symlink updated: $DIR/phantom-current"
echo "Set PHANTOM_EXECUTABLE to $DIR/phantom-current/chrome (or phantom)"