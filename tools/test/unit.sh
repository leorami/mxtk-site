#!/usr/bin/env bash
set -euo pipefail

mkdir -p .tmp
LOG_TS=".tmp/vitest.$(date +%s).out"
LOG_LAST=".tmp/vitest.last.out"

(
  echo "==> vitest starting at $(date -Iseconds)"
  npx vitest run --reporter=verbose --threads=false
) 2>&1 | tee "$LOG_TS" | tee "$LOG_LAST"

ECODE=${PIPESTATUS[0]}
echo "==> vitest exit code: $ECODE" | tee -a "$LOG_TS" | tee -a "$LOG_LAST"
exit $ECODE


