#!/usr/bin/env bash
set -euo pipefail

# smart-dev-build.sh
# PURPOSE: Dev utility for build/status/apply. Root-level, proxy-aware.
# Commands: install, typecheck, lint, build, clean, format, status, apply, all

get_ngrok_url() {
  # Env overrides
  if [ -n "${NGROK_STATIC_DOMAIN:-}" ]; then echo "https://${NGROK_STATIC_DOMAIN}"; return; fi
  if [ -n "${NGROK_DOMAIN:-}" ]; then echo "https://${NGROK_DOMAIN}"; return; fi
  # Local API
  for _ in 1 2 3 4 5; do
    url=$(curl -s --max-time 2 http://localhost:4040/api/tunnels 2>/dev/null | grep -o '"public_url":"https:[^"]*"' | head -n1 | sed -E 's/.*"public_url":"([^"]*)".*/\1/')
    [ -n "$url" ] && { echo "$url"; return; }
    sleep 1
  done
  # Common containers
  for c in dev-ngrok dev-proxy; do
    docker ps --filter "name=$c" --filter "status=running" | grep -q "$c" || continue
    url=$(docker exec "$c" curl -s --max-time 2 http://localhost:4040/api/tunnels 2>/dev/null | grep -o '"public_url":"https:[^"]*"' | head -n1 | sed -E 's/.*"public_url":"([^"]*)".*/\1/')
    [ -n "$url" ] && { echo "$url"; return; }
    url=$(docker logs --tail 300 "$c" 2>/dev/null | sed -n "s/.*using static domain '\([^']*\)'.*/https:\/\/\1/p" | head -n1)
    [ -n "$url" ] && { echo "$url"; return; }
  done
  echo ""
}

show_access_info() {
  echo "\n🌐 ACCESS INFORMATION\n======================================"
  echo "Local:   http://localhost:2000"
  local ngrok
  ngrok=$(get_ngrok_url)
  if [ -n "$ngrok" ]; then
    echo "Proxy:   ${ngrok}/mxtk"
    # Human-readable health checks (no raw JSON)
    local hc sc
    hc=$(curl -s -o /dev/null -w '%{http_code}' --max-time 3 "${ngrok}/health.json" 2>/dev/null || echo 000)
    sc=$(curl -s -o /dev/null -w '%{http_code}' --max-time 3 "${ngrok}/status.json" 2>/dev/null || echo 000)
    if [ "$hc" = "200" ]; then echo "Health:  OK (200)"; else echo "Health:  FAIL (${hc})"; fi
    if [ "$sc" = "200" ]; then echo "Status:  OK (200)"; else echo "Status:  FAIL (${sc})"; fi
  else
    echo "Proxy:   (Not configured or dev-proxy not running)"
  fi
}

detect_pm() {
  if command -v pnpm >/dev/null 2>&1; then echo pnpm; return; fi
  if command -v yarn >/dev/null 2>&1; then echo yarn; return; fi
  echo npm
}

pm_run() {
  local pm; pm="$(detect_pm)"
  case "$pm" in
    pnpm) pnpm "$@";;
    yarn) yarn "$@";;
    npm)
      if [ "${1:-}" = "install" ]; then shift; npm i "$@";
      else npm run "$@"; fi;;
  esac
}

cmd_install()   { pm_run install; }
cmd_typecheck() { pm_run typecheck || true; }
cmd_lint()      { pm_run lint || true; }
cmd_build()     { pm_run build; }
cmd_clean()     { rm -rf .next .next-mxtk node_modules/.cache || true; }
cmd_format()    { pm_run format || true; }
cmd_all()       { cmd_install; cmd_typecheck; cmd_lint; cmd_build; }

cmd_status() {
  echo "==> Dev containers"
  docker compose ps | cat
  show_access_info
}

cmd_apply() {
  local force="${1:-}"
  if [ "$force" = "--force-build" ]; then
    echo "==> Cleaning caches before rebuild...";
    cmd_clean;
  fi
  echo "==> Re-applying dev containers...";
  # Restart root dev container
  docker compose up -d web || true
  # Restart /mxtk dev container if overlay exists
  if [ -f "docker-compose.mxtk.yml" ]; then
    docker compose -f docker-compose.yml -f docker-compose.mxtk.yml up -d web_mxtk || true
  fi
  show_access_info
}

usage() {
  cat <<EOF2
Usage: $(basename "$0") <command> [--force-build]
Commands:
  install     Install dependencies
  typecheck   Run TS types (if available)
  lint        Run linter (if available)
  build       Next.js build
  clean       Remove build caches
  format      Run formatter (if available)
  status      Show container status and access URLs
  apply       Restart dev containers; add --force-build to clean caches first
  all         install + typecheck + lint + build
EOF2
}

main() {
  local cmd="${1:-all}"; shift || true
  case "$cmd" in
    install|typecheck|lint|build|clean|format|status|all) "cmd_${cmd}" "$@";;
    apply) cmd_apply "${1:-}";;
    *) usage; exit 1;;
  esac
}

main "$@"

