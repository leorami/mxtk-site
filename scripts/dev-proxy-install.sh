#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   DEV_TUNNEL_PROXY_DIR=/path/to/dev-tunnel-proxy ./scripts/dev-proxy-install.sh
#   # or add DEV_TUNNEL_PROXY_DIR to your .env file
#
# Copies this repo's mxtk snippet into the dev proxy and reloads Nginx.

# Load from .env if it exists and DEV_TUNNEL_PROXY_DIR is not set
if [[ -z "${DEV_TUNNEL_PROXY_DIR:-}" && -f .env ]]; then
    # shellcheck disable=SC1091
    source .env
fi

: "${DEV_TUNNEL_PROXY_DIR:?Set DEV_TUNNEL_PROXY_DIR to the dev-tunnel-proxy repo root}"

# Expand ~ to home directory and resolve relative paths
DEV_TUNNEL_PROXY_DIR=$(eval echo "$DEV_TUNNEL_PROXY_DIR")
if [[ ! "$DEV_TUNNEL_PROXY_DIR" = /* ]]; then
    # If it's a relative path, make it absolute relative to current directory
    DEV_TUNNEL_PROXY_DIR="$(pwd)/$DEV_TUNNEL_PROXY_DIR"
fi

SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/config/dev-proxy/apps/mxtk.conf"
DEST="$DEV_TUNNEL_PROXY_DIR/apps/mxtk.conf"

install -m 0644 "$SRC" "$DEST"
echo "Installed $SRC -> $DEST"

if docker ps --format '{{.Names}}' | grep -q '^dev-proxy$'; then
  docker exec -it dev-proxy nginx -t
  docker exec -it dev-proxy nginx -s reload
  echo "Reloaded dev-proxy."
else
  echo "dev-proxy is not running; start it in $DEV_TUNNEL_PROXY_DIR with: ./scripts/smart-build.sh up"
fi
