#!/usr/bin/env bash
set -euo pipefail

RUNNER_URL="${RUNNER_URL:-http://localhost:4000}"

if curl -sSf -X GET "$RUNNER_URL/health" >/dev/null 2>&1; then
  echo "Runner healthy at $RUNNER_URL"
  exit 0
else
  echo "Runner not reachable at $RUNNER_URL" >&2
  exit 1
fi