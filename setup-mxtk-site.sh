#!/usr/bin/env bash
set -euo pipefail

# setup-mxtk-site.sh
# PURPOSE: root-level helper to manage the /mxtk dev instance and proxy wiring.
# Commands:
#   share [dev_proxy_dir]  - Write NGINX app config and (re)load dev proxy
#   start                  - Start /mxtk dev container (web_mxtk)
#   stop                   - Stop /mxtk dev container
#   restart                - Restart /mxtk dev container and reload proxy
#   status                 - Show container status and proxy URL/health
#   logs                   - Show recent logs for /mxtk + dev-proxy

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SITE_DIR="$HERE"
DEV_PROXY_DIR="${2:-${HERE}/../dev-tunnel-proxy}"
COMPOSE_YML="${SITE_DIR}/docker-compose.yml"
COMPOSE_OVERLAY="${SITE_DIR}/docker-compose.mxtk.yml"
APP_SERVICE="web_mxtk"

ensure_network() {
  docker network create devproxy >/dev/null 2>&1 || true
}

start_mxtk() {
  docker compose -f "${COMPOSE_YML}" -f "${COMPOSE_OVERLAY}" up -d ${APP_SERVICE}
}

stop_mxtk() {
  docker compose -f "${COMPOSE_YML}" -f "${COMPOSE_OVERLAY}" stop ${APP_SERVICE} || true
}

restart_mxtk() {
  docker compose -f "${COMPOSE_YML}" -f "${COMPOSE_OVERLAY}" restart ${APP_SERVICE} || start_mxtk
}

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
  # Containers
  for c in dev-ngrok dev-proxy; do
    docker ps --filter "name=$c" --filter "status=running" | grep -q "$c" || continue
    url=$(docker exec "$c" curl -s --max-time 2 http://localhost:4040/api/tunnels 2>/dev/null | grep -o '"public_url":"https:[^"]*"' | head -n1 | sed -E 's/.*"public_url":"([^"]*)".*/\1/')
    [ -n "$url" ] && { echo "$url"; return; }
    url=$(docker logs --tail 300 "$c" 2>/dev/null | sed -n "s/.*using static domain '\([^']*\)'.*/https:\/\/\1/p" | head -n1)
    [ -n "$url" ] && { echo "$url"; return; }
  done
  echo ""
}

write_proxy_configs() {
  mkdir -p "${DEV_PROXY_DIR}/config" "${DEV_PROXY_DIR}/apps"

  cat > "${DEV_PROXY_DIR}/config/default.conf" <<'NGINX'
server {
  listen 80;
  server_name _;
  include /etc/nginx/conf.d/apps/*.conf;
}
NGINX

  cat > "${DEV_PROXY_DIR}/apps/mxtk.conf" <<'NGINX'
# INTERNAL canonicalization: /mxtk -> /mxtk/ w/o external redirect
location = /mxtk {
  rewrite ^ /mxtk/ last;
}

# HMR/chunks/etc.
location /mxtk/_next/ {
  proxy_http_version 1.1;
  proxy_set_header Host $host;
  proxy_set_header X-Forwarded-Proto $scheme;
  proxy_set_header X-Forwarded-Host $host;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header X-Forwarded-Prefix /mxtk;
  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection "upgrade";
  proxy_read_timeout 300s;
  proxy_send_timeout 300s;
  proxy_pass http://mxtk-app:2000/mxtk/_next/;
}


location ~ ^/((robots\.txt|sitemap\.xml|manifest\.json|site\.webmanifest|apple-touch-icon\.png|favicon\.(ico|png|svg)))$ {
  proxy_http_version 1.1;
  proxy_set_header Host $host;
  proxy_set_header X-Forwarded-Prefix /mxtk;
  proxy_pass http://mxtk-app:2000/mxtk/$1;
}

# Pages/RSC/data
location /mxtk/ {
  proxy_http_version 1.1;
  proxy_set_header Host $host;
  proxy_set_header X-Forwarded-Proto $scheme;
  proxy_set_header X-Forwarded-Host $host;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header X-Forwarded-Prefix /mxtk;
  proxy_set_header ngrok-skip-browser-warning true;
  proxy_buffering off;
  proxy_request_buffering off;
  proxy_read_timeout 300s;
  proxy_send_timeout 300s;
  proxy_pass http://mxtk-app:2000/mxtk/;
}
NGINX
}

restart_proxy() {
  ( cd "${DEV_PROXY_DIR}" && docker compose up -d )
  # ensure proxy container is on devproxy and reload nginx (idempotent)
  for name in dev-proxy dev-tunnel-proxy; do
    docker network connect devproxy "$name" >/dev/null 2>&1 || true
    docker exec "$name" nginx -s reload >/dev/null 2>&1 || true
  done
}

cmd_share() {
  echo "==> ensuring shared docker network 'devproxy'..."
  ensure_network
  echo "==> starting /mxtk Next dev server (service: web_mxtk)..."
  start_mxtk
  echo "==> writing dev proxy config to ${DEV_PROXY_DIR}..."
  write_proxy_configs
  echo "==> restarting dev proxy..."
  restart_proxy
  local u; u=$(get_ngrok_url)
  echo "\n🌐 ACCESS INFORMATION\n======================================"
  echo "Local:  http://localhost:2000"
  if [ -n "$u" ]; then
    echo "Proxy:  ${u}/mxtk"
    local hc sc
    hc=$(curl -s -o /dev/null -w '%{http_code}' --max-time 3 "${u}/health.json" 2>/dev/null || echo 000)
    sc=$(curl -s -o /dev/null -w '%{http_code}' --max-time 3 "${u}/status.json" 2>/dev/null || echo 000)
    [ "$hc" = "200" ] && echo "Health: OK (200)" || echo "Health: FAIL (${hc})"
    [ "$sc" = "200" ] && echo "Status: OK (200)" || echo "Status: FAIL (${sc})"
  else
    echo "Proxy:  (Not configured or dev-proxy not running)"
  fi
}

cmd_start()   { ensure_network; start_mxtk; echo "==> ${APP_SERVICE} started"; }
cmd_stop()    { stop_mxtk; echo "==> ${APP_SERVICE} stopped"; }
cmd_restart() { ensure_network; restart_mxtk; restart_proxy; echo "==> ${APP_SERVICE} restarted"; }

cmd_status() {
  echo "==> Containers"
  docker compose -f "${COMPOSE_YML}" -f "${COMPOSE_OVERLAY}" ps | cat
  echo
  local u; u=$(get_ngrok_url)
  echo "==> Access"
  echo "Local:  http://localhost:2000"
  if [ -n "$u" ]; then
    echo "Proxy:  ${u}/mxtk"
    hc=$(curl -s -o /dev/null -w '%{http_code}' --max-time 3 "${u}/health.json" 2>/dev/null || echo 000)
    sc=$(curl -s -o /dev/null -w '%{http_code}' --max-time 3 "${u}/status.json" 2>/dev/null || echo 000)
    [ "$hc" = "200" ] && echo "Health: OK (200)" || echo "Health: FAIL (${hc})"
    [ "$sc" = "200" ] && echo "Status: OK (200)" || echo "Status: FAIL (${sc})"
  else
    echo "Proxy:  (Not configured or dev-proxy not running)"
  fi
}

cmd_logs() {
  echo "==> Recent logs (${APP_SERVICE})"
  docker compose -f "${COMPOSE_YML}" -f "${COMPOSE_OVERLAY}" logs --since 10m ${APP_SERVICE} | tail -n 200 | cat || true
  echo
  if docker ps --filter "name=dev-proxy" --filter "status=running" | grep -q dev-proxy; then
    echo "==> Recent logs (dev-proxy)"
    docker logs --since 10m dev-proxy 2>&1 | tail -n 200 | cat || true
  fi
}

usage() {
  cat <<EOF
Usage:
  $(basename "$0") share <dev_proxy_dir>
    Configure and (re)start the dev proxy to mount this app at /mxtk via mxtk-app:2000.
    dev_proxy_dir defaults to ../dev-tunnel-proxy

  $(basename "$0") start|stop|restart|status|logs [dev_proxy_dir]
    Manage the /mxtk dev container and show status/access information.
EOF
}

main() {
  local cmd="${1:-help}"
  case "$cmd" in
    share) shift; DEV_PROXY_DIR="${1:-${DEV_PROXY_DIR}}"; cmd_share;;
    start) cmd_start;;
    stop) cmd_stop;;
    restart) cmd_restart;;
    status) cmd_status;;
    logs) cmd_logs;;
    *) usage; exit 1;;
  esac
}

main "$@"
