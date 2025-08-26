#!/bin/bash

# Ngrok Static Domain Management Script
# Based on dev-tunnel-proxy pattern

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Load environment variables
if [[ -f "$PROJECT_ROOT/.env" ]]; then
    source "$PROJECT_ROOT/.env"
fi

# Check required environment variables
check_env() {
    if [[ -z "$NGROK_AUTHTOKEN" ]]; then
        log_error "NGROK_AUTHTOKEN not set in .env"
        exit 1
    fi
    
    if [[ -z "$NGROK_STATIC_DOMAIN" ]]; then
        log_warning "NGROK_STATIC_DOMAIN not set - will use dynamic URL"
    else
        log_info "Using static domain: $NGROK_STATIC_DOMAIN"
    fi
}

# Start/restart ngrok with static domain
restart() {
    log_info "Restarting ngrok with static domain..."
    
    # Stop existing ngrok container
    docker compose stop ngrok 2>/dev/null || true
    
    # Start ngrok container
    if [[ -n "$NGROK_STATIC_DOMAIN" ]]; then
        log_info "Starting ngrok with static domain: $NGROK_STATIC_DOMAIN"
        docker run -d --name ngrok-external-proxy \
            --network ngrok-shared \
            -e NGROK_AUTHTOKEN="$NGROK_AUTHTOKEN" \
            -p 4040:4040 \
            ngrok/ngrok:latest \
            http proxy:80 --url="https://$NGROK_STATIC_DOMAIN"
    else
        log_info "Starting ngrok with dynamic URL"
        docker run -d --name ngrok-external-proxy \
            --network ngrok-shared \
            -e NGROK_AUTHTOKEN="$NGROK_AUTHTOKEN" \
            -p 4040:4040 \
            ngrok/ngrok:latest \
            http proxy:80
    fi
    
    log_success "Ngrok container started"
    log_info "Waiting for ngrok to initialize..."
    sleep 5
    
    # Get the URL
    local url
    url=$(curl -s http://localhost:4040/api/tunnels 2>/dev/null | jq -r '.tunnels[0].public_url' 2>/dev/null || echo "")
    
    if [[ -n "$url" && "$url" != "null" ]]; then
        log_success "Ngrok tunnel active: $url"
        if [[ -n "$NGROK_STATIC_DOMAIN" ]]; then
            log_info "MXTK site available at: $url/mxtk"
        fi
    else
        log_warning "Ngrok may still be starting up..."
        log_info "Check dashboard: http://localhost:4040"
    fi
}

# Check ngrok status
status() {
    if docker ps --filter "name=ngrok-external-proxy" --filter "status=running" | grep -q "ngrok-external-proxy"; then
        log_success "Ngrok container is running"
        
        local url
        url=$(curl -s http://localhost:4040/api/tunnels 2>/dev/null | jq -r '.tunnels[0].public_url' 2>/dev/null || echo "")
        
        if [[ -n "$url" && "$url" != "null" ]]; then
            log_info "Tunnel URL: $url"
            if [[ -n "$NGROK_STATIC_DOMAIN" ]]; then
                log_info "MXTK site: $url/mxtk"
            fi
        else
            log_warning "Tunnel not yet active"
        fi
    else
        log_error "Ngrok container is not running"
        exit 1
    fi
}

# Show ngrok logs
logs() {
    if docker ps --filter "name=ngrok-external-proxy" | grep -q "ngrok-external-proxy"; then
        docker logs ngrok-external-proxy --tail 50 -f
    else
        log_error "Ngrok container is not running"
        exit 1
    fi
}

# Test the tunnel
test() {
    log_info "Testing ngrok tunnel..."
    
    local url
    url=$(curl -s http://localhost:4040/api/tunnels 2>/dev/null | jq -r '.tunnels[0].public_url' 2>/dev/null || echo "")
    
    if [[ -z "$url" || "$url" == "null" ]]; then
        log_error "No active tunnel found"
        exit 1
    fi
    
    log_info "Testing tunnel URL: $url"
    
    # Test the tunnel
    if curl -s -o /dev/null -w "%{http_code}" "$url/mxtk/" | grep -q "200"; then
        log_success "Tunnel test passed! MXTK site is accessible at: $url/mxtk/"
    else
        log_error "Tunnel test failed"
        exit 1
    fi
}

# Show usage
usage() {
    echo "🔧 Ngrok Static Domain Manager"
    echo
    echo "USAGE: $0 <action>"
    echo
    echo "ACTIONS:"
    echo "  restart    Restart ngrok with static domain"
    echo "  status     Check ngrok status and tunnel URL"
    echo "  logs       Show ngrok logs (follow mode)"
    echo "  test       Test the tunnel connectivity"
    echo
    echo "ENVIRONMENT:"
    echo "  NGROK_AUTHTOKEN      Your ngrok authtoken"
    echo "  NGROK_STATIC_DOMAIN  Static domain (optional)"
    echo
    echo "EXAMPLES:"
    echo "  $0 restart"
    echo "  $0 status"
    echo "  $0 logs"
    echo "  $0 test"
}

# Main script
main() {
    cd "$PROJECT_ROOT"
    
    case "${1:-}" in
        restart)
            check_env
            restart
            ;;
        status)
            check_env
            status
            ;;
        logs)
            logs
            ;;
        test)
            check_env
            test
            ;;
        *)
            usage
            exit 1
            ;;
    esac
}

main "$@"
