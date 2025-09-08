#!/usr/bin/env bash
set -euo pipefail

# Auto-merge current branch into main and push both.
# Safe for single-developer workflow.

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
MAIN_BRANCH="main"

# Allow override via env
MAIN_BRANCH=${MAIN_BRANCH_OVERRIDE:-$MAIN_BRANCH}

if [[ "$CURRENT_BRANCH" == "$MAIN_BRANCH" || "$CURRENT_BRANCH" == "master" ]]; then
  echo "Already on $CURRENT_BRANCH; skipping auto-merge."
  exit 0
fi

echo "[auto-merge] Pushing branch: $CURRENT_BRANCH"
git push -u origin "$CURRENT_BRANCH"

echo "[auto-merge] Ensuring $MAIN_BRANCH exists locally and is up-to-date"
git fetch origin "$MAIN_BRANCH" || true
if git show-ref --verify --quiet "refs/heads/$MAIN_BRANCH"; then
  git checkout "$MAIN_BRANCH" >/dev/null 2>&1
else
  if git show-ref --verify --quiet "refs/remotes/origin/$MAIN_BRANCH"; then
    git checkout -b "$MAIN_BRANCH" "origin/$MAIN_BRANCH" >/dev/null 2>&1
  else
    # Create main if it does not exist remotely (rare)
    git checkout -b "$MAIN_BRANCH" >/dev/null 2>&1
  fi
fi

# Update main with remote
git pull --ff-only || true

echo "[auto-merge] Merging $CURRENT_BRANCH -> $MAIN_BRANCH"
if git merge --ff-only "$CURRENT_BRANCH"; then
  echo "[auto-merge] Fast-forwarded $MAIN_BRANCH to $CURRENT_BRANCH"
else
  git merge --no-ff -m "Auto-merge $CURRENT_BRANCH -> $MAIN_BRANCH" "$CURRENT_BRANCH"
fi

echo "[auto-merge] Pushing $MAIN_BRANCH"
git push -u origin "$MAIN_BRANCH"

echo "[auto-merge] Switching back to $CURRENT_BRANCH"
git checkout - >/dev/null 2>&1 || git checkout "$CURRENT_BRANCH" >/dev/null 2>&1

echo "[auto-merge] Done."


