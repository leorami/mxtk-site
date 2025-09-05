#!/usr/bin/env bash
set -euo pipefail

# tools/test_runner.sh
# Unified test runner for nav/crawl regressions and console checks.

BASE_URL="${BASE_URL:-}"
if [ -z "${BASE_URL}" ]; then
  echo "Usage: BASE_URL=<url> $0 [nav|crawl|all]" >&2
  echo "Example: BASE_URL=https://ramileo.ngrok.app/mxtk $0 all" >&2
  exit 1
fi

MODE="${1:-all}"

wait_for_health() {
  local url="$BASE_URL"
  local timeout="${WAIT_TIMEOUT_SECS:-60}"
  local start=$(date +%s)
  echo "==> Waiting for health at ${url}/api/health (timeout ${timeout}s)"
  while true; do
    if curl -sf --max-time 2 "${url%/}/api/health" >/dev/null; then
      echo "==> Health OK"; return 0; fi
    sleep 2
    now=$(date +%s)
    if [ $((now-start)) -ge $timeout ]; then
      echo "ERROR: Health check did not pass within ${timeout}s at ${url}/api/health" >&2
      exit 1
    fi
  done
}

run_nav() {
  echo "==> Running nav-regression.mjs"
  BASE_URL="$BASE_URL" node "$(dirname "$0")/test/nav-regression.mjs"
}

run_guide_alignment() {
  echo "==> Running guide-alignment.mjs"
  BASE_URL="$BASE_URL" node "$(dirname "$0")/test/guide-alignment.mjs"
}

run_crawl() {
  echo "==> Running crawl-regression.mjs"
  BASE_URL="$BASE_URL" node "$(dirname "$0")/test/crawl-regression.mjs"
}

case "$MODE" in
  nav) wait_for_health; run_nav;;
  crawl) wait_for_health; run_crawl;;
  guide) wait_for_health; run_guide_alignment;;
  all) wait_for_health; run_nav; run_crawl; run_guide_alignment;;
  *) echo "Unknown mode: $MODE" >&2; exit 2;;
esac


