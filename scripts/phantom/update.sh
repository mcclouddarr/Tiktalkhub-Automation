#!/usr/bin/env bash
set -euo pipefail

if [ $# -lt 1 ]; then
  echo "Usage: $0 <DOWNLOAD_URL> [INSTALL_DIR]"
  exit 1
fi

SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &> /dev/null && pwd)
"$SCRIPT_DIR/install.sh" "$@"

echo "Update completed. Existing profiles are untouched."