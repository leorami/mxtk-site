#!/usr/bin/env bash
# =============================================================================
# 🚀  MXTK Site Development Environment Manager
# =============================================================================
# Manages environment setup, validation, status, logs, and Docker operations
# for the MXTK Mineral Token website.
# -----------------------------------------------------------------------------
set -e

# ───────────────────────────────────────────────────────── Colors
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
BLUE='\033[0;34m'; CYAN='\033[0;36m'; NC='\033[0m'

# ─────────────────────────────────────────── Configuration & Defaults
WORKING_DIR=${MXTK_WORKING_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}
VALID_ENVIRONMENTS=("development" "staging" "production")
VALID_ACTIONS=("start" "stop" "restart" "reset" "build" "logs" "status" "clean" "setup-env" "validate-env" "share" "restart-ngrok")

ENVIRONMENT="development"
ACTION="start"
DOCKER_CHECKED=false

# ─────────────────────────────────────────────── Printer helpers
print_status()  { echo -e "${GREEN}[INFO]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARN]${NC} $1"; }
print_error()   { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }
print_header()  { echo -e "${BLUE}$1${NC}"; }
print_subheader(){ echo -e "${CYAN}$1${NC}"; }

# ─────────────────────────────────────────────────────────── Usage
show_usage() {
cat <<EOF
$(print_header "🚀 MXTK Site Development Environment Manager")

$(print_subheader "USAGE:")
  $0 [options] [action]

$(print_subheader "ACTIONS:")
  start | stop | restart | reset    Docker container lifecycle
  build                            Build the Next.js application
  setup-env | validate-env          Environment file management
  status | logs | clean             Monitoring and utilities
  share                            Connect to shared ngrok network
  restart-ngrok                    Restart ngrok service (for static domain changes)


$(print_subheader "OPTIONS:")
  --env <environment> development | staging | production
  --force-build                    Force rebuild (clean build)
  --currenturl                     For share command: only output the current ngrok URL
  --updateurl                      For share command: update ngrok configuration
  --help                           Show this help

$(print_subheader "EXAMPLES:")
  $0 start                         # Start development server (port 2000)
  $0 --env staging start           # Start staging environment (port 2001)
  $0 --env production start        # Start production environment (port 2002)
  $0 restart                       # Restart current environment
  $0 build                         # Build the application
  $0 logs                          # Follow environment logs
  $0 status                        # Show all environments status
  $0 clean                         # Clean all Docker environments
  $0 setup-env                     # Setup environment files
  $0 share                         # Connect to shared ngrok network
  $0 share --currenturl            # Get current ngrok URL only
  $0 share --updateurl             # Update ngrok configuration
  $0 restart-ngrok                 # Restart ngrok service


EOF
exit 1
}

# ─────────────────────────────────────────── Environment switching
switch_env() {
  local TARGET=$1
  local CUR=$(grep -E '^NODE_ENV=' .env 2>/dev/null | cut -d= -f2)

  if [[ "$CUR" == "$TARGET" ]]; then
      print_status "Environment already $CUR"
      # Always load variables from .env so they are available in the current shell
      if [[ -f .env ]]; then
          # shellcheck disable=SC1091
          source .env
      fi
      return
  fi
  
  # Map environment names to suffixes
  local CUR_SUF=""
  local NEW_SUF=""
  case "$CUR" in
    "development") CUR_SUF="dev" ;;
    "staging") CUR_SUF="staging" ;;
    "production") CUR_SUF="prod" ;;
  esac
  case "$TARGET" in
    "development") NEW_SUF="dev" ;;
    "staging") NEW_SUF="staging" ;;
    "production") NEW_SUF="prod" ;;
  esac

  [[ -f .env && -n $CUR_SUF ]] && cp .env "config/environments/.env.$CUR_SUF"

  rm -f .env

  if [[ -f "config/environments/.env.$NEW_SUF" ]]; then
  cp "config/environments/.env.$NEW_SUF" .env
  print_status "Restored .env from config/environments/.env.$NEW_SUF"
else
  local TPL="config/environments/.env.$NEW_SUF.template"
    if [[ -f $TPL ]]; then
      print_status "Creating .env from $TPL"
      cp "$TPL" .env
      print_warning "⚠️  Please update .env with your actual API keys and tokens"
    else
      print_status "Creating basic .env for $TARGET"
      echo "NODE_ENV=$TARGET" > .env
      echo "NEXT_PUBLIC_SITE_URL=http://localhost:2000" >> .env
      echo "NGROK_AUTHTOKEN=your_ngrok_authtoken_here" >> .env
      echo "EXTERNAL_PORT=2000" >> .env
      echo "CORS_ALLOWED_ORIGINS=http://localhost:2000,http://localhost:2001,http://localhost:2002,https://*.ngrok-free.app" >> .env
      echo "CSRF_TRUSTED_ORIGINS=http://localhost:2000,http://localhost:2001,http://localhost:2002,https://*.ngrok-free.app" >> .env
    fi
  fi
  # shellcheck disable=SC1091
  source .env
  print_status "Switched to $TARGET"
}

# ─────────────────────────────────────────── Docker health check
check_docker() {
  [[ "$(uname)" != "Darwin" ]] && return 0
  
  print_status "Checking Docker daemon health..."
  
  if docker info > /dev/null 2>&1; then
    print_status "Docker daemon is responsive."
    return 0
  fi

  print_warning "Docker daemon not responding. Attempting to restart Docker Desktop..."
  osascript -e 'tell application "Docker" to quit' >/dev/null 2>&1 || true
  sleep 5
  open -a Docker

  print_status "Waiting for Docker daemon to start..."
  local attempts=0
  while ! docker info > /dev/null 2>&1; do
    sleep 1
    ((attempts++))
    if [[ $attempts -ge 60 ]]; then
      print_error "Docker daemon failed to start within 60 seconds"
    fi
  done

  print_status "Docker daemon is now running."
}

ensure_docker_ready() {
  if [[ "$DOCKER_CHECKED" == "false" ]]; then
    check_docker
    DOCKER_CHECKED=true
  fi
}

get_ngrok_url() {
    # 0) Env overrides (support static domains)
    if [[ -n "${NGROK_STATIC_DOMAIN:-}" ]]; then
        echo "https://${NGROK_STATIC_DOMAIN}"; return
    fi
    if [[ -n "${NGROK_DOMAIN:-}" ]]; then
        echo "https://${NGROK_DOMAIN}"; return
    fi

    # Probe known containers for the ngrok API
    local candidates=()
    # 1) Explicit env var for ngrok container
    if [[ -n "${DEV_NGROK_CONTAINER:-}" ]] && docker ps --filter "name=${DEV_NGROK_CONTAINER}" --filter "status=running" | grep -q "${DEV_NGROK_CONTAINER}"; then
        candidates+=("${DEV_NGROK_CONTAINER}")
    fi
    # 2) Conventional name
    if docker ps --filter "name=dev-ngrok" --filter "status=running" | grep -q "dev-ngrok"; then
        candidates+=("dev-ngrok")
    fi
    # 3) Any running container with 'ngrok' in its name
    while IFS= read -r c; do
        [[ -n "$c" ]] && candidates+=("$c")
    done < <(docker ps --filter "name=ngrok" --filter "status=running" --format "{{.Names}}" | grep -v '^dev-ngrok$' || true)

    # De-duplicate candidates
    local uniq=()
    local seen=""
    for c in "${candidates[@]}"; do
        if [[ ",$seen," != *",$c,"* ]]; then
            uniq+=("$c"); seen+=",$c"
        fi
    done

    for container in "${uniq[@]}"; do
        for _ in {1..5}; do
            url=$(docker exec "$container" curl -s --max-time 2 http://localhost:4040/api/tunnels 2>/dev/null \
                  | grep -o '"public_url":"https:[^"]*"' \
                  | head -n1 | sed -E 's/.*"public_url":"([^"]*)".*/\1/')
            [[ -n "$url" ]] && { echo "$url"; return; }
            sleep 1
        done
    done

    # Fallback: scrape logs from typical containers that might print ngrok URL
    for logc in dev-ngrok dev-proxy; do
        if docker ps -a --format "{{.Names}}" | grep -q "^${logc}$"; then
            # Try to capture a full https URL first
            url=$(docker logs --tail 400 "$logc" 2>&1 | grep -m1 -o 'https://[a-z0-9.-]*\.ngrok\.(io|app)' | head -n1)
            [[ -n "$url" ]] && { echo "$url"; return; }
            # Static domain line (no scheme): ngrok: using static domain 'ramileo.ngrok.app'
            domain=$(docker logs --tail 400 "$logc" 2>&1 | sed -n "s/.*using static domain '\([^']*\)'.*/\1/p" | head -n1)
            if [[ -n "$domain" ]]; then
                echo "https://${domain}"; return
            fi
        fi
    done

    # Last resort: host-local ngrok
    for _ in {1..2}; do
        url=$(curl -s --max-time 2 http://localhost:4040/api/tunnels 2>/dev/null \
              | grep -o '"public_url":"https:[^"]*"' \
              | head -n1 | sed -E 's/.*"public_url":"([^"]*)".*/\1/')
        [[ -n "$url" ]] && { echo "$url"; return; }
        sleep 1
    done

    echo ""
}

# ─────────────────────────────────────────── Environment management
setup_environment() {
    print_subheader "Setting up environment for $ENVIRONMENT"
    
    # Create basic .env if it doesn't exist
    if [[ ! -f .env ]]; then
        print_status "Creating basic .env file"
        cat > .env << EOF
NODE_ENV=$ENVIRONMENT
NEXT_PUBLIC_SITE_URL=http://localhost:2000

# Ngrok Configuration
NGROK_AUTHTOKEN=2ys22TN5DNODqFfkisK86gaBDN1_3cyhFAiU8Zce19LjiRkFg
# Optional: Static domain for ngrok (e.g., ramileo.ngrok.app)
# NGROK_STATIC_DOMAIN=ramileo.ngrok.app

# External Access
EXTERNAL_PORT=2000

# CORS and CSRF Configuration
CORS_ALLOWED_ORIGINS=http://localhost:2000,http://localhost:2001,http://localhost:2002,https://*.ngrok-free.app
CSRF_TRUSTED_ORIGINS=http://localhost:2000,http://localhost:2001,http://localhost:2002,https://*.ngrok-free.app
EOF
    fi
    
    # Create environment-specific files if templates exist
    for template in config/environments/.env.*.template; do
        if [[ -f "$template" ]]; then
            local env_name="${template#config/environments/.env.}"
            env_name="${env_name%.template}"
            if [[ ! -f "config/environments/.env.$env_name" ]]; then
                print_status "Creating config/environments/.env.$env_name from template"
                cp "$template" "config/environments/.env.$env_name"
                print_warning "⚠️  Please update config/environments/.env.$env_name with your actual API keys and tokens"
            fi
        fi
    done
    
    print_status "Environment setup complete"
}

validate_environment() {
    print_subheader "Validating environment for $ENVIRONMENT"
    
    if [[ -f .env ]]; then
        print_status "✅ Environment file exists: .env"
        
        # Check for required variables
        local required_vars=("NODE_ENV" "NEXT_PUBLIC_SITE_URL")
        for var in "${required_vars[@]}"; do
            if grep -q "^${var}=" .env; then
                print_status "✅ $var is set"
            else
                print_warning "⚠️  $var is not set"
            fi
        done
        
        # Check for optional ngrok configuration
        if grep -q "^NGROK_AUTHTOKEN=" .env; then
            local token=$(grep "^NGROK_AUTHTOKEN=" .env | cut -d= -f2)
            if [[ "$token" != "your_ngrok_token_here" && -n "$token" ]]; then
                print_status "✅ NGROK_AUTHTOKEN is configured"
            else
                print_warning "⚠️  NGROK_AUTHTOKEN needs to be set for ngrok tunnels"
            fi
        else
            print_warning "⚠️  NGROK_AUTHTOKEN not found (optional for ngrok)"
        fi
        
        # Check for optional static domain configuration
        if grep -q "^NGROK_STATIC_DOMAIN=" .env; then
            local domain=$(grep "^NGROK_STATIC_DOMAIN=" .env | cut -d= -f2)
            if [[ -n "$domain" && "$domain" != "# NGROK_STATIC_DOMAIN=ramileo.ngrok.app" ]]; then
                print_status "✅ NGROK_STATIC_DOMAIN is configured: $domain"
            else
                print_warning "⚠️  NGROK_STATIC_DOMAIN is commented out (will use dynamic URL)"
            fi
        else
            print_warning "⚠️  NGROK_STATIC_DOMAIN not found (will use dynamic URL)"
        fi
        
        # Check for CORS and CSRF configuration
        local security_vars=("CORS_ALLOWED_ORIGINS" "CSRF_TRUSTED_ORIGINS")
        for var in "${security_vars[@]}"; do
            if grep -q "^${var}=" .env; then
                print_status "✅ $var is configured"
            else
                print_warning "⚠️  $var not found (recommended for security)"
            fi
        done
    else
        print_warning "❌ No environment file found: .env"
        return 1
    fi
    
    # Check for Docker Compose file
    if [[ -f docker-compose.yml ]]; then
        print_status "✅ Docker Compose file exists"
    else
        print_warning "⚠️  Docker Compose file not found"
    fi
    
    # Check for ngrok shared network
    if docker network ls | grep -q "ngrok-shared"; then
        print_status "✅ ngrok-shared network exists"
    else
        print_warning "⚠️  ngrok-shared network not found (will be created when needed)"
    fi
    
    # Check for package.json
    if [[ -f package.json ]]; then
        print_status "✅ Package.json exists"
    else
        print_warning "⚠️  Package.json not found"
    fi
}

# ─────────────────────────────────────────── Docker operations
start_services() {
    ensure_docker_ready
    
    local compose_file="docker-compose.yml"
    local port="2000"
    local service_name="web"
    
    # Create ngrok shared network for development environment
    if [[ "$ENVIRONMENT" == "development" ]]; then
        if ! docker network ls | grep -q "ngrok-shared"; then
            print_status "Creating ngrok-shared network"
            docker network create ngrok-shared
        fi
    fi
    
    # Determine environment-specific settings
    case "$ENVIRONMENT" in
        "development")
            compose_file="docker-compose.yml"
            port="2000"
            service_name="web"
            print_subheader "Starting MXTK site development environment..."
            ;;
        "staging")
            compose_file="config/docker/docker-compose.staging.yml"
            port="2001"
            service_name="web-staging"
            print_subheader "Starting MXTK site staging environment..."
            ;;
        "production")
            compose_file="config/docker/docker-compose.prod.yml"
            port="2002"
            service_name="web-prod"
            print_subheader "Starting MXTK site production environment..."
            ;;
    esac
    
    # Check if compose file exists
    if [[ ! -f "$compose_file" ]]; then
        print_error "Docker Compose file not found: $compose_file"
        return 1
    fi
    
    # Check if we need to build first
    if [[ "$FORCE_BUILD" == "true" ]] || [[ ! -d ".next" ]]; then
        print_status "Building application first..."
        build_application "$ENVIRONMENT"
    fi
    
    # Check for existing shared proxy containers in development environment
    if [[ "$ENVIRONMENT" == "development" ]]; then
        local existing_proxy_containers=()
        
        # Check for ngrok-external-proxy
        if docker ps -a --format "table {{.Names}}" | grep -q "^ngrok-external-proxy$"; then
            existing_proxy_containers+=("ngrok-external-proxy")
        fi
        
        # Check for dev-proxy
        if docker ps -a --format "table {{.Names}}" | grep -q "^dev-proxy$"; then
            existing_proxy_containers+=("dev-proxy")
        fi
        
        if [[ ${#existing_proxy_containers[@]} -gt 0 ]]; then
            print_status "🔗 Found existing shared proxy containers: ${existing_proxy_containers[*]}"
            print_status "Integrating MXTK with existing proxy system..."
            
            # Start only MXTK services, skip proxy containers
            docker compose -f "$compose_file" up -d web
            print_status "✅ MXTK site started at http://localhost:$port"
            
            # Try to integrate with existing proxy
            print_status "Attempting to integrate with existing proxy..."
            if [[ -f "scripts/manage-nginx-config.sh" ]]; then
                # Look for the nginx config file in common locations
                local nginx_config_locations=(
                    "./nginx-proxy.conf"
                )
                
                local nginx_config_found=""
                for config_path in "${nginx_config_locations[@]}"; do
                    if [[ -f "$config_path" ]]; then
                        nginx_config_found="$config_path"
                        break
                    fi
                done
                
                if [[ -n "$nginx_config_found" ]]; then
                    print_status "Found nginx config at: $nginx_config_found"
                    # Add MXTK routes using our proven working configuration
                    print_status "Adding MXTK routes to proxy configuration..."
                    
                    # Create backup
                    local timestamp=$(date +"%Y%m%d_%H%M%S")
                    cp "$nginx_config_found" "${nginx_config_found}.backup.${timestamp}"
                    
                    # Add MXTK routes using awk
                    if awk '/END_EXTERNAL_PROJECTS/ { 
                        print "# MXTK app"
                        print "location ^~ /mxtk/ {"
                        print "  # Strip /mxtk prefix and proxy to MXTK"
                        print "  rewrite ^/mxtk/(.*)$ /$1 break;"
                        print "  proxy_pass http://mxtk-site-dev:2000;"
                        print "  proxy_set_header Host $host;"
                        print "  proxy_http_version 1.1;"
                        print "  proxy_set_header Upgrade $http_upgrade;"
                        print "  proxy_set_header Connection \"upgrade\";"
                        print "  # Add sub_filter to rewrite absolute root links to /mxtk/"
                        print "  sub_filter \"href=\\\"/\" \"href=\\\"/mxtk/\";"
                        print "  sub_filter \"src=\\\"/\" \"src=\\\"/mxtk/\";"
                        print "  sub_filter_once off; # Apply filter multiple times"
                        print "}"
                        print ""
                        print "# MXTK static assets (Next.js _next directory)"
                        print "location ^~ /mxtk/_next/ {"
                        print "  # Strip /mxtk prefix and proxy to MXTK"
                        print "  rewrite ^/mxtk/_next/(.*)$ /_next/$1 break;"
                        print "  proxy_pass http://mxtk-site-dev:2000;"
                        print "  proxy_set_header Host $host;"
                        print "  proxy_http_version 1.1;"
                        print "  proxy_set_header Upgrade $http_upgrade;"
                        print "  proxy_set_header Connection \"upgrade\";"
                        print "}"
                        print ""
                        print "# MXTK public assets (images, etc.)"
                        print "location ^~ /mxtk/public/ {"
                        print "  # Strip /mxtk prefix and proxy to MXTK"
                        print "  rewrite ^/mxtk/public/(.*)$ /public/$1 break;"
                        print "  proxy_pass http://mxtk-site-dev:2000;"
                        print "  proxy_set_header Host $host;"
                        print "}"
                        print ""
                    } { print }' "$nginx_config_found" > "${nginx_config_found}.new" && mv "${nginx_config_found}.new" "$nginx_config_found"; then
                        print_status "✅ MXTK routes added to proxy configuration"
                        print_status "🌐 MXTK should now be accessible via the shared proxy"
                    else
                        print_warning "⚠️  Failed to add MXTK routes to proxy configuration"
                        print_status "You may need to manually integrate with the proxy system"
                    fi
                else
                    print_warning "⚠️  No nginx config found in common locations"
                    print_status "You may need to manually integrate with the proxy system"
                fi
            else
                print_warning "⚠️  manage-nginx-config.sh script not found"
                print_status "You may need to manually integrate with the proxy system"
            fi
            return 0
        fi
    fi
    
    docker compose -f "$compose_file" up -d
    print_status "Environment started at http://localhost:$port"
}

stop_services() {
    ensure_docker_ready
    
    local compose_file="docker-compose.yml"
    
    # Determine environment-specific settings
    case "$ENVIRONMENT" in
        "development")
            compose_file="docker-compose.yml"
            print_subheader "Stopping MXTK site development environment..."
            ;;
        "staging")
            compose_file="config/docker/docker-compose.staging.yml"
            print_subheader "Stopping MXTK site staging environment..."
            ;;
        "production")
            compose_file="config/docker/docker-compose.prod.yml"
            print_subheader "Stopping MXTK site production environment..."
            ;;
    esac
    
    # Check if compose file exists
    if [[ ! -f "$compose_file" ]]; then
        print_error "Docker Compose file not found: $compose_file"
        return 1
    fi
    
    docker compose -f "$compose_file" down
    print_status "Environment stopped"
}

restart_services() {
    local force_rebuild="$1"
    
    ensure_docker_ready
    
    local compose_file="docker-compose.yml"
    
    # Determine environment-specific settings
    case "$ENVIRONMENT" in
        "development")
            compose_file="docker-compose.yml"
            ;;
        "staging")
            compose_file="config/docker/docker-compose.staging.yml"
            ;;
        "production")
            compose_file="config/docker/docker-compose.prod.yml"
            ;;
    esac
    
    if [[ "$force_rebuild" == "true" ]]; then
        print_subheader "Force rebuilding and restarting..."
        stop_services
        build_application "$ENVIRONMENT"
        start_services
    else
        print_subheader "Restarting environment..."
        docker compose -f "$compose_file" restart
        print_status "Environment restarted"
    fi
}

reset_services() {
    ensure_docker_ready
    print_warning "This will destroy all data and rebuild from scratch!"
    read -p "Continue? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_status "Reset cancelled."
        return 0
    fi
    
    print_subheader "Resetting development environment..."
    docker compose down -v --remove-orphans
    rm -rf .next node_modules/.cache
    build_application
    docker compose up -d
    print_status "Reset complete - fresh development environment ready"
}

build_application() {
    local environment="${1:-development}"
    print_subheader "Building MXTK site application for $environment environment..."
    
    # Determine build target based on environment
    local build_target="dev"
    case "$environment" in
        "development")
            build_target="dev"
            ;;
        "staging"|"production")
            build_target="web-prod"
            ;;
    esac
    
    # Check if we're in Docker or local environment
    if [[ -f docker-compose.yml ]]; then
        print_status "Building via Docker with target: $build_target"
        docker compose build --no-cache --target "$build_target"
    else
        print_status "Building locally..."
        npm run build
    fi
    
    print_status "Build complete for $environment environment"
}

show_status() {
    ensure_docker_ready
    print_subheader "MXTK Site Environment Status:"
    
    local compose_file="docker-compose.yml"
    local port="2000"
    
    # Determine environment-specific settings
    case "$ENVIRONMENT" in
        "development")
            compose_file="docker-compose.yml"
            port="2000"
            ;;
        "staging")
            compose_file="docker-compose.staging.yml"
            port="2001"
            ;;
        "production")
            compose_file="docker-compose.prod.yml"
            port="2002"
            ;;
    esac
    
    if [[ -f "$compose_file" ]]; then
        print_status "Environment: $ENVIRONMENT (port $port)"
        docker compose -f "$compose_file" ps
    else
        print_status "No Docker Compose file found for $ENVIRONMENT environment"
        print_status "Check if server is running on http://localhost:$port"
    fi
    
    # Show all environments status
    echo
    print_subheader "All Environments:"
    if [[ -f "docker-compose.yml" ]]; then
        print_status "Development: http://localhost:2000"
        docker compose ps --filter "name=mxtk-site-dev" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" 2>/dev/null || print_warning "Development not running"
    fi
    
    if [[ -f "config/docker/docker-compose.staging.yml" ]]; then
        print_status "Staging: http://localhost:2001"
        docker compose -f config/docker/docker-compose.staging.yml ps --filter "name=mxtk-site-staging" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" 2>/dev/null || print_warning "Staging not running"
    fi
    
    if [[ -f "config/docker/docker-compose.prod.yml" ]]; then
        print_status "Production: http://localhost:2002"
        docker compose -f config/docker/docker-compose.prod.yml ps --filter "name=mxtk-site-prod" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" 2>/dev/null || print_warning "Production not running"
    fi
}

show_logs() {
    ensure_docker_ready
    
    local compose_file="docker-compose.yml"
    
    # Determine environment-specific settings
    case "$ENVIRONMENT" in
        "development")
            compose_file="docker-compose.yml"
            print_subheader "Following development logs..."
            ;;
        "staging")
            compose_file="docker-compose.staging.yml"
            print_subheader "Following staging logs..."
            ;;
        "production")
            compose_file="docker-compose.prod.yml"
            print_subheader "Following production logs..."
            ;;
    esac
    
    if [[ -f "$compose_file" ]]; then
        docker compose -f "$compose_file" logs -f
    else
        print_status "No Docker Compose file found for $ENVIRONMENT environment"
    fi
}

clean_environment() {
    ensure_docker_ready
    print_warning "This will remove ALL Docker containers, volumes, and images!"
    read -p "Continue? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_status "Clean cancelled."
        return 0
    fi
    
    print_subheader "Cleaning Docker environment..."
    
    # Clean all environments
    if [[ -f "docker-compose.yml" ]]; then
        docker compose down -v --remove-orphans
    fi
    if [[ -f "config/docker/docker-compose.staging.yml" ]]; then
        docker compose -f config/docker/docker-compose.staging.yml down -v --remove-orphans
    fi
    if [[ -f "config/docker/docker-compose.prod.yml" ]]; then
        docker compose -f config/docker/docker-compose.prod.yml down -v --remove-orphans
    fi
    
    docker system prune -af
    docker volume prune -f
    
    # Clean local build artifacts
    print_status "Cleaning local build artifacts..."
    rm -rf .next node_modules/.cache
    
    print_status "Cleanup complete"
}

share_with_ngrok() {
    local current_url_only="$1"
    local update_url="$2"
    
    # If only current URL is requested, suppress all output
    if [[ "$current_url_only" == "true" ]]; then
        # Get URL silently
        local url
        url=$(get_ngrok_url)
        if [[ -z "$url" ]]; then
            echo "ERROR: Ngrok URL not available. Check if dev-proxy is running." >&2
            return 1
        fi
        
        echo "$url"
        return 0
    fi
    
    ensure_docker_ready
    
    if [[ "$ENVIRONMENT" != "development" ]]; then
        print_error "Ngrok sharing is only available in development environment"
        return 1
    fi
    
    print_subheader "Connecting MXTK site to shared ngrok network"
    
    # Check if ngrok-shared network exists
    if ! docker network ls | grep -q "ngrok-shared"; then
        print_status "Creating ngrok-shared network"
        docker network create ngrok-shared
    else
        print_status "✅ ngrok-shared network exists"
    fi
    
    # Check if MXTK containers are running
    if ! docker ps --filter "name=mxtk-site-dev" --filter "status=running" | grep -q "mxtk-site-dev"; then
        print_warning "MXTK development containers are not running"
        print_status "Starting MXTK development environment..."
        start_services
    fi
    
    # Get list of actual running MXTK containers
    local mxtk_containers=$(docker ps --filter "name=mxtk-site" --format "{{.Names}}")
    
    if [[ -z "$mxtk_containers" ]]; then
        print_error "No MXTK containers found running"
        return 1
    fi
    
    print_status "Found MXTK containers: $mxtk_containers"
    
    # Connect each MXTK container to ngrok-shared network
    while IFS= read -r container; do
        if [[ -n "$container" ]]; then
            if docker network inspect ngrok-shared | grep -q "$container"; then
                print_status "✅ $container already connected to ngrok-shared"
            else
                docker network connect ngrok-shared "$container"
                print_status "✅ Connected $container to ngrok-shared"
            fi
        fi
    done <<< "$mxtk_containers"
    
    # Ensure dev-tunnel-proxy integration is set up
    print_status "Setting up dev-tunnel-proxy integration..."
    if ensure_dev_tunnel_proxy_integration; then
        print_status "✅ Dev-tunnel-proxy integration ready"
    else
        print_warning "⚠️  Dev-tunnel-proxy integration not available"
        print_status "MXTK will still be accessible via direct ngrok URL"
    fi
    
    # Try to get and display the ngrok URL when sharing
    print_status "Getting ngrok URL..."
    local url
    url=$(get_ngrok_url)
    if [[ -n "$url" ]]; then
        print_status "🌍  Ngrok URL → $url"
        print_status "📖 Access MXTK site at: $url/mxtk"
    else
        print_warning "⚠️  Could not automatically detect ngrok URL"
        print_status "If ngrok is running in another container, set DEV_PROXY_CONTAINER or visit your ngrok dashboard."
    fi
    
    print_status "🎉 MXTK site is now connected to the shared ngrok network!"
    echo
    echo -e "${CYAN}Access Points:${NC}"
    echo "  • MXTK Site (direct): http://localhost:2000"
    if [[ -n "$url" ]]; then
        echo "  • MXTK Site (tunnel): $url/mxtk"
        echo "  • Root redirects to:  $url/mxtk"
    else
        echo "  • MXTK Site (tunnel): [URL will appear when ngrok starts]"
    fi
    echo
    echo -e "${YELLOW}Note:${NC} MXTK is now connected to the dev-tunnel-proxy network"
    echo "      The tunnel URL will be available once ngrok establishes the connection"
    echo
    echo -e "${CYAN}Network Status:${NC}"
    local members
    members=$(docker network inspect ngrok-shared -f '{{range .Containers}}{{.Name}}{{"\n"}}{{end}}' 2>/dev/null | sed '/^$/d')
    if [[ -n "$members" ]]; then
        echo "$members"
    else
        echo "No containers in network"
    fi
}

restart_ngrok_service() {
    ensure_docker_ready
    
    print_subheader "Restarting Ngrok Service"
    
    print_status "Stopping ngrok service..."
    docker compose stop ngrok
    
    print_status "Starting ngrok service..."
    docker compose up -d ngrok
    
    print_status "Waiting for ngrok to start..."
    sleep 5
    
    # Get the current URL
    local url
    url=$(curl -s http://localhost:4040/api/tunnels 2>/dev/null | jq -r '.tunnels[0].public_url' 2>/dev/null || echo "checking...")
    
    if [[ "$url" != "null" && "$url" != "checking..." ]]; then
        print_status "Ngrok restarted successfully!"
        echo "  • Current URL: $url"
    else
        print_warning "Ngrok may still be starting up..."
        echo "  • Check dashboard: http://localhost:4040"
    fi
    
    print_status "Ngrok restart complete"
}

# ─────────────────────────────────────────── Dev Tunnel Proxy Integration
ensure_dev_tunnel_proxy_integration() {
    ensure_docker_ready
    
    # Check if dev-proxy is running
    if ! docker ps --filter "name=dev-proxy" --filter "status=running" | grep -q "dev-proxy"; then
        print_warning "⚠️  dev-proxy not found running"
        print_status "Please start the dev-tunnel-proxy project first:"
        print_status "  cd /path/to/dev-tunnel-proxy && ./scripts/smart-build.sh up"
        return 1
    fi
    
    print_status "✅ Found dev-proxy running"
    
    # Check if MXTK config is already installed
    local proxy_dir=""
    
    # Try to find dev-tunnel-proxy directory
    if [[ -n "${DEV_TUNNEL_PROXY_DIR:-}" ]]; then
        proxy_dir="$DEV_TUNNEL_PROXY_DIR"
    elif [[ -f .env ]]; then
        # Load from .env if available
        # shellcheck disable=SC1091
        source .env
        proxy_dir="${DEV_TUNNEL_PROXY_DIR:-}"
    fi
    
    # Expand ~ and resolve relative paths
    if [[ -n "$proxy_dir" ]]; then
        proxy_dir=$(eval echo "$proxy_dir")
        if [[ ! "$proxy_dir" = /* ]]; then
            proxy_dir="$(pwd)/$proxy_dir"
        fi
    fi
    
    # Check if MXTK config exists in the proxy
    local mxtk_config_exists=false
    if [[ -n "$proxy_dir" && -f "$proxy_dir/apps/mxtk.conf" ]]; then
        mxtk_config_exists=true
        print_status "✅ MXTK config found in dev-tunnel-proxy"
    else
        print_status "📝 MXTK config not found in dev-tunnel-proxy"
    fi
    
    # If config doesn't exist, try to install it
    if [[ "$mxtk_config_exists" == "false" ]]; then
        print_status "Installing MXTK config into dev-tunnel-proxy..."
        
        if [[ -n "$proxy_dir" && -f "$proxy_dir/scripts/smart-build.sh" ]]; then
            # Use the dev-proxy-install script
            if [[ -f "scripts/dev-proxy-install.sh" ]]; then
                DEV_TUNNEL_PROXY_DIR="$proxy_dir" ./scripts/dev-proxy-install.sh
                print_status "✅ MXTK config installed successfully"
            else
                print_warning "⚠️  dev-proxy-install.sh script not found"
                print_status "Please install MXTK config manually or run:"
                print_status "  DEV_TUNNEL_PROXY_DIR=$proxy_dir ./scripts/dev-proxy-install.sh"
            fi
        else
            print_warning "⚠️  Could not determine dev-tunnel-proxy directory"
            print_status "Please set DEV_TUNNEL_PROXY_DIR in your .env file or run:"
            print_status "  DEV_TUNNEL_PROXY_DIR=/path/to/dev-tunnel-proxy ./scripts/dev-proxy-install.sh"
        fi
    fi
    
    # Ensure dev-proxy is connected to ngrok-shared network
    if docker network inspect ngrok-shared | grep -q "dev-proxy"; then
        print_status "✅ dev-proxy already connected to ngrok-shared"
    else
        docker network connect ngrok-shared dev-proxy
        print_status "✅ Connected dev-proxy to ngrok-shared"
    fi
    
    return 0
}

# ─────────────────────────────────────────── Argument parsing
FORCE_BUILD=false
CURRENT_URL_ONLY=false
UPDATE_URL=false

while [[ "$#" -gt 0 ]]; do
  case $1 in
    start|stop|restart|reset|build|setup-env|validate-env|status|logs|clean|share|restart-ngrok)
      ACTION="$1"; shift ;;
    --env|--environment)
      ENVIRONMENT="$2"
      [[ " ${VALID_ENVIRONMENTS[*]} " =~ " $ENVIRONMENT " ]] || print_error "Invalid environment: $ENVIRONMENT"
      shift 2 ;;
    --force-build)
      FORCE_BUILD=true; shift ;;
    --currenturl)
      CURRENT_URL_ONLY=true; shift ;;
    --updateurl)
      UPDATE_URL=true; shift ;;
    --help|-h)
      show_usage ;;
    *)
      print_error "Unknown parameter: $1"
      shift ;;
  esac
done

# ─────────────────────────────────────────── Prepare environment
cd "$WORKING_DIR" || exit 1

[[ -f .env ]] || touch .env
switch_env "$ENVIRONMENT"

print_header "🚀 MXTK Site Development Environment Manager"
echo "Working directory: $WORKING_DIR"
echo "Environment: $ENVIRONMENT"
echo "Action:      $ACTION"
[[ "$FORCE_BUILD" == "true" ]] && echo "Force build: enabled"
echo ""

# ─────────────────────────────────────────── Dispatcher
case $ACTION in
  start)
    start_services ;;
  stop)
    stop_services ;;
  restart)
    restart_services "$FORCE_BUILD" ;;
  reset)
    reset_services ;;
  build)
    build_application ;;
  setup-env)
    setup_environment ;;
  validate-env)
    validate_environment ;;
  status)       
    show_status ;;
  logs)         
    show_logs ;;
  clean)        
    clean_environment ;;
  share)        
    share_with_ngrok "$CURRENT_URL_ONLY" "$UPDATE_URL" ;;
  restart-ngrok)
    restart_ngrok_service ;;

  *)
    print_error "Unknown action: $ACTION" ;;
esac

print_status "✨ $ACTION completed successfully!"
