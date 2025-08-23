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
WORKING_DIR=${MXTK_WORKING_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)}
VALID_ENVIRONMENTS=("development" "staging" "production")
VALID_ACTIONS=("start" "stop" "restart" "reset" "build" "logs" "status" "clean" "setup-env" "validate-env" "share" "setup-proxy" "stop-proxy" "restart-proxy" "integrate-with" "disconnect-from" "integrate-encast" "disconnect-encast")

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
  setup-proxy                      Setup MXTK's own dev proxy system
  stop-proxy | restart-proxy        Manage dev proxy lifecycle
  integrate-with <project> <dir>   Integrate with any project's shared proxy
  disconnect-from <project> <dir>  Disconnect from any project's shared proxy
  integrate-encast [dir]           Quick integrate with encast-web
  disconnect-encast [dir]          Quick disconnect from encast-web
  resolve-conflicts                Resolve container name conflicts

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
  $0 setup-proxy                   # Setup MXTK's own dev proxy
  $0 integrate-with encast-web ../encast.web
  $0 integrate-encast              # Quick integrate with encast-web
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
    # Check if static domain is configured
    if [[ -f .env ]] && grep -q "^NGROK_STATIC_DOMAIN=" .env; then
        local static_domain=$(grep "^NGROK_STATIC_DOMAIN=" .env | cut -d= -f2)
        if [[ -n "$static_domain" && "$static_domain" != "# NGROK_STATIC_DOMAIN=ramileo.ngrok.app" ]]; then
            echo "https://$static_domain"
            return
        fi
    fi
    
    # try the API for 10 s
    for _ in {1..10}; do
        url=$(curl -s http://localhost:4040/api/tunnels 2>/dev/null \
              | grep -o '"public_url":"https:[^"]*"' \
              | head -n1 | sed -E 's/.*"public_url":"([^"]*)".*/\1/')
        [[ -n "$url" ]] && { echo "$url"; return; }
        sleep 1
    done
    # fallback: grep the container logs
    docker logs ngrok-external-proxy 2>&1 \
      | grep -m1 -o 'https://[a-z0-9.-]*\.ngrok\.io'
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
                    "../encast.web/nginx-proxy.conf"
                    "../encast/nginx-proxy.conf"
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
            echo "ERROR: Ngrok did not report a URL within 30 seconds." >&2
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
    
    # Check if ngrok-external-proxy exists (from encast.web project)
    if docker ps --filter "name=ngrok-external-proxy" --filter "status=running" | grep -q "ngrok-external-proxy"; then
        print_status "✅ Found ngrok-external-proxy from encast.web project"
        if docker network inspect ngrok-shared | grep -q "ngrok-external-proxy"; then
            print_status "✅ ngrok-external-proxy already connected to ngrok-shared"
        else
            docker network connect ngrok-shared ngrok-external-proxy
            print_status "✅ Connected ngrok-external-proxy to ngrok-shared"
        fi
    else
        print_warning "⚠️  ngrok-external-proxy not found (may not be running in encast.web project)"
    fi
    
    # Always get and display the ngrok URL when sharing
    print_status "Getting ngrok URL..."
    local url
    url=$(get_ngrok_url)
    if [[ -z "$url" ]]; then
        print_warning "Ngrok URL not available yet. Please check the ngrok dashboard at http://localhost:4040"
        print_status "The URL will be available once ngrok establishes the tunnel."
    else
        print_status "🌍  Ngrok URL → $url"
        print_status "📖 Access MXTK site at: $url/mxtk"
    fi
    
    print_status "🎉 MXTK site is now connected to the shared ngrok network!"
    echo
    echo -e "${CYAN}Access Points:${NC}"
    echo "  • MXTK Site (direct): http://localhost:2000"
    echo "  • Ngrok Dashboard:     http://localhost:4040"
    if [[ -n "$url" ]]; then
        echo "  • MXTK Site (ngrok):  $url/mxtk"
        echo "  • Root redirects to:  $url/mxtk"
    else
        echo "  • MXTK Site (ngrok):  [Check ngrok dashboard for URL]"
    fi
    echo
    echo -e "${YELLOW}Note:${NC} The ngrok tunnel will be available at the URL shown in the ngrok dashboard"
    echo "      Other projects can now access MXTK via the shared network"
    echo
    echo -e "${CYAN}Network Status:${NC}"
    docker network inspect ngrok-shared --format "table {{.Name}}\t{{.IPAddress}}\t{{.EndpointID}}" 2>/dev/null || echo "No containers in network"
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

# ─────────────────────────────────────────── Shared Dev Proxy Management
setup_shared_dev_proxy() {
    ensure_docker_ready
    
    print_subheader "Setting up MXTK shared dev proxy system"
    
    # Create ngrok-shared network if it doesn't exist
    if ! docker network ls | grep -q "ngrok-shared"; then
        print_status "Creating ngrok-shared network"
        docker network create ngrok-shared
    else
        print_status "✅ ngrok-shared network exists"
    fi
    
    # Start dev proxy and ngrok services
    print_status "Starting dev proxy and ngrok services..."
    docker compose up -d proxy ngrok
    
    print_status "🎉 MXTK shared dev proxy system is ready!"
    echo
    echo -e "${CYAN}Access Points:${NC}"
    echo "  • MXTK Site (direct): http://localhost:2000"
    echo "  • MXTK Site (proxy):  http://localhost:8080"
    echo "  • Ngrok Dashboard:     http://localhost:4040"
    echo
    echo -e "${YELLOW}Note:${NC} Other projects can now connect to the shared network"
}

stop_shared_dev_proxy() {
    ensure_docker_ready
    
    print_subheader "Stopping MXTK shared dev proxy system"
    
    docker compose stop proxy ngrok
    print_status "Shared dev proxy system stopped"
}

restart_shared_dev_proxy() {
    ensure_docker_ready
    
    print_subheader "Restarting MXTK shared dev proxy system"
    
    docker compose restart proxy ngrok
    print_status "Shared dev proxy system restarted"
}

# ─────────────────────────────────────────── Universal Project Integration
integrate_with_other_project() {
    ensure_docker_ready
    
    if [[ "$ENVIRONMENT" != "development" ]]; then
        print_error "Integration is only available in development environment"
        return 1
    fi
    
    local other_project_name="$1"
    local other_project_dir="$2"
    
    if [[ -z "$other_project_name" || -z "$other_project_dir" ]]; then
        print_error "Usage: integrate-with <project-name> <project-directory>"
        print_error "Example: integrate-with encast-web ../encast.web"
        return 1
    fi
    
    print_subheader "Integrating MXTK with $other_project_name shared dev proxy"
    
    # Check if shared dev proxy is running (using standard container names)
    local proxy_container_name="dev-proxy"
    if ! docker ps --filter "name=$proxy_container_name" --filter "status=running" | grep -q "$proxy_container_name"; then
        print_warning "Shared dev proxy not found running"
        print_status "Please ensure the shared dev proxy is running (dev-proxy container)"
        return 1
    fi
    
    # Connect MXTK containers to shared network
    print_status "Connecting MXTK containers to shared network..."
    
    # Connect the main MXTK site container
    if docker network inspect ngrok-shared | grep -q "mxtk-site-dev"; then
        print_status "✅ mxtk-site-dev already connected to ngrok-shared"
    else
        docker network connect ngrok-shared mxtk-site-dev
        print_status "✅ Connected mxtk-site-dev to ngrok-shared"
    fi
    
    # Update environment to set base path for shared proxy
    print_status "Updating environment for shared proxy integration..."
    if grep -q "^NEXT_PUBLIC_BASE_PATH=" .env; then
        sed -i.bak 's|^NEXT_PUBLIC_BASE_PATH=.*|NEXT_PUBLIC_BASE_PATH=/mxtk|' .env
    else
        echo "NEXT_PUBLIC_BASE_PATH=/mxtk" >> .env
    fi
    print_status "✅ Set NEXT_PUBLIC_BASE_PATH=/mxtk"
    
    # Restart MXTK container to pick up new environment
    print_status "Restarting MXTK container to apply base path..."
    docker restart mxtk-site-dev
    print_status "✅ Restarted MXTK container"
    
    # Add MXTK route to shared nginx config using working approach
    print_status "Adding MXTK route to shared nginx config..."
    
    if [[ -d "$other_project_dir" ]]; then
        cd "$other_project_dir"
        
        # Create a temporary route file with working configuration
        local temp_route_file="mxtk_route.txt"
        cat > "$temp_route_file" << 'EOF'
# mxtk-site project route - main application
location /mxtk/ {
    # Strip /mxtk prefix and proxy to MXTK
    rewrite ^/mxtk/(.*)$ /$1 break;
    proxy_pass http://mxtk-site-dev:2000/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-Host $host;
    proxy_set_header X-Forwarded-Port $server_port;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header ngrok-skip-browser-warning "true";
    proxy_set_header User-Agent "MXTK-Development-Proxy/1.0";
    # Next.js specific headers
    proxy_set_header Origin $scheme://$host;
    proxy_set_header Referer $scheme://$host;
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;
}

# MXTK static assets - proxy /mxtk/_next/ to /_next/
location /mxtk/_next/ {
    # Strip /mxtk prefix and proxy to MXTK
    rewrite ^/mxtk/_next/(.*)$ /_next/$1 break;
    proxy_pass http://mxtk-site-dev:2000/_next/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-Host $host;
    proxy_set_header X-Forwarded-Port $server_port;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header ngrok-skip-browser-warning "true";
    proxy_set_header User-Agent "MXTK-Development-Proxy/1.0";
    # Next.js specific headers
    proxy_set_header Origin $scheme://$host;
    proxy_set_header Referer $scheme://$host;
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;
}

# MXTK public assets - proxy /mxtk/public/ to /public/
location /mxtk/public/ {
    # Strip /mxtk prefix and proxy to MXTK
    rewrite ^/mxtk/public/(.*)$ /public/$1 break;
    proxy_pass http://mxtk-site-dev:2000/public/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-Host $host;
    proxy_set_header X-Forwarded-Port $server_port;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header ngrok-skip-browser-warning "true";
    proxy_set_header User-Agent "MXTK-Development-Proxy/1.0";
    # Next.js specific headers
    proxy_set_header Origin $scheme://$host;
    proxy_set_header Referer $scheme://$host;
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;
}
EOF
        
        # Add the route to the nginx config
        awk -v route_file="$temp_route_file" '/END_EXTERNAL_PROJECTS/ { while ((getline line < route_file) > 0) { print line }; close(route_file); print ""; next } { print }' nginx-proxy.conf > nginx-proxy.conf.new
        
        # Apply the changes
        if [[ -f "nginx-proxy.conf.new" ]]; then
            mv nginx-proxy.conf.new nginx-proxy.conf
            rm -f "$temp_route_file"
            docker restart dev-proxy
            cd - > /dev/null
            print_status "✅ Added MXTK route to shared proxy"
        else
            rm -f "$temp_route_file"
            cd - > /dev/null
            print_error "Failed to add MXTK route to shared proxy"
        fi
    else
        print_warning "Project directory not found at $other_project_dir"
        print_status "Please manually add MXTK route to the shared nginx config"
    fi
    
    print_status "🎉 MXTK integrated with $other_project_name shared dev proxy!"
    echo
    echo -e "${CYAN}Access Points:${NC}"
    echo "  • MXTK Site (direct): http://localhost:2000"
    echo "  • MXTK Site (via $other_project_name): http://localhost:8080/mxtk/"
    echo "  • Ngrok Dashboard:     http://localhost:4040"
}

disconnect_from_other_project() {
    ensure_docker_ready
    
    local other_project_name="$1"
    local other_project_dir="$2"
    
    if [[ -z "$other_project_name" || -z "$other_project_dir" ]]; then
        print_error "Usage: disconnect-from <project-name> <project-directory>"
        print_error "Example: disconnect-from encast-web ../encast.web"
        return 1
    fi
    
    print_subheader "Disconnecting MXTK from $other_project_name shared dev proxy"
    
    # Remove MXTK route from shared nginx config using working approach
    if [[ -d "$other_project_dir" ]]; then
        cd "$other_project_dir"
        
        # Remove the MXTK route from nginx config
        awk -v project="mxtk-site" '
            /START_EXTERNAL_PROJECTS/ {
                in_external = 1
                print
                next
            }
            /END_EXTERNAL_PROJECTS/ {
                in_external = 0
                print
                next
            }
            in_external && /# '"mxtk-site"' project route/ {
                # Skip this line and the next 20 lines (the route block)
                skip_lines = 20
                next
            }
            skip_lines > 0 {
                skip_lines--
                next
            }
            { print }
        ' nginx-proxy.conf > nginx-proxy.conf.new
        
        # Apply the changes
        if [[ -f "nginx-proxy.conf.new" ]]; then
            mv nginx-proxy.conf.new nginx-proxy.conf
            docker restart dev-proxy
            cd - > /dev/null
            print_status "✅ Removed MXTK route from shared proxy"
        else
            cd - > /dev/null
            print_error "Failed to remove MXTK route from shared proxy"
        fi
    fi
    
    # Remove base path from environment when disconnecting
    print_status "Removing base path from environment..."
    if grep -q "^NEXT_PUBLIC_BASE_PATH=" .env; then
        sed -i.bak 's|^NEXT_PUBLIC_BASE_PATH=.*|NEXT_PUBLIC_BASE_PATH=|' .env
        print_status "✅ Removed NEXT_PUBLIC_BASE_PATH"
    fi
    
    # Disconnect from shared network
    if docker network inspect ngrok-shared | grep -q "mxtk-site-dev"; then
        docker network disconnect ngrok-shared mxtk-site-dev
        print_status "✅ Disconnected mxtk-site-dev from ngrok-shared"
    fi
    
    print_status "MXTK disconnected from $other_project_name shared dev proxy"
}

# ─────────────────────────────────────────── Universal Integration Helper
integrate_with_any_project() {
    local project_name="$1"
    local project_dir="$2"
    
    case "$project_name" in
        "encast-web"|"encast")
            integrate_with_other_project "encast-web" "${project_dir:-../encast.web}"
            ;;
        "other-project"|"other")
            integrate_with_other_project "other-project" "${project_dir:-../other-project}"
            ;;
        *)
            print_error "Unknown project: $project_name"
            print_status "Available projects: encast-web, other-project"
            print_status "Or use: integrate-with <project-name> <project-directory>"
            ;;
    esac
}

disconnect_from_any_project() {
    local project_name="$1"
    local project_dir="$2"
    
    case "$project_name" in
        "encast-web"|"encast")
            disconnect_from_other_project "encast-web" "${project_dir:-../encast.web}"
            ;;
        "other-project"|"other")
            disconnect_from_other_project "other-project" "${project_dir:-../other-project}"
            ;;
        *)
            print_error "Unknown project: $project_name"
            print_status "Available projects: encast-web, other-project"
            print_status "Or use: disconnect-from <project-name> <project-directory>"
            ;;
    esac
}

# ─────────────────────────────────────────── Container conflict resolution
resolve_container_conflicts() {
    ensure_docker_ready
    print_subheader "Container Conflict Resolution"
    
    local conflicting_containers=()
    
    # Check for ngrok-external-proxy conflict
    if docker ps -a --format "table {{.Names}}" | grep -q "^ngrok-external-proxy$"; then
        conflicting_containers+=("ngrok-external-proxy")
    fi
    
    # Check for dev-proxy conflict
    if docker ps -a --format "table {{.Names}}" | grep -q "^dev-proxy$"; then
        conflicting_containers+=("dev-proxy")
    fi
    
    if [[ ${#conflicting_containers[@]} -eq 0 ]]; then
        print_status "✅ No container conflicts detected"
        return 0
    fi
    
    print_warning "⚠️  Found conflicting containers: ${conflicting_containers[*]}"
    print_status "These containers may be from another project's shared proxy system."
    echo ""
    print_status "Options:"
    echo "  1. Integrate with existing proxy (recommended)"
    echo "  2. Stop conflicting containers (if not using them)"
    echo "  3. Rename conflicting containers"
    echo "  4. Start MXTK services only (skip proxy containers)"
    echo "  5. Cancel"
    echo ""
    
    read -p "Choose option (1-4): " -n 1 -r
    echo
    
    case $REPLY in
        1)
            print_status "Integrating with existing proxy..."
            # Start MXTK services
            docker compose -f docker-compose.yml up -d web
            print_status "✅ MXTK site started at http://localhost:2000"
            
            # Try to integrate with existing proxy
            if [[ -f "scripts/manage-nginx-config.sh" ]]; then
                local nginx_config_locations=(
                    "../encast.web/nginx-proxy.conf"
                    "../encast/nginx-proxy.conf"
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
                    fi
                else
                    print_warning "⚠️  No nginx config found in common locations"
                fi
            fi
            ;;
        2)
            print_status "Stopping conflicting containers..."
            for container in "${conflicting_containers[@]}"; do
                docker stop "$container" 2>/dev/null || true
                docker rm "$container" 2>/dev/null || true
                print_status "✅ Removed $container"
            done
            print_status "Conflicts resolved. You can now run 'start' again."
            ;;
        3)
            print_status "Renaming conflicting containers..."
            for container in "${conflicting_containers[@]}"; do
                local new_name="${container}-backup-$(date +%s)"
                docker rename "$container" "$new_name" 2>/dev/null || true
                print_status "✅ Renamed $container to $new_name"
            done
            print_status "Conflicts resolved. You can now run 'start' again."
            ;;
        4)
            print_status "Starting MXTK services only..."
            docker compose -f docker-compose.yml up -d web
            print_status "✅ MXTK site started at http://localhost:2000"
            print_warning "⚠️  Proxy containers not started due to conflicts"
            ;;
        5)
            print_status "Operation cancelled."
            ;;
        *)
            print_error "Invalid option. Operation cancelled."
            ;;
    esac
}

# ─────────────────────────────────────────── Argument parsing
FORCE_BUILD=false
CURRENT_URL_ONLY=false
UPDATE_URL=false

while [[ "$#" -gt 0 ]]; do
  case $1 in
    start|stop|restart|reset|build|setup-env|validate-env|status|logs|clean|share|restart-ngrok|setup-proxy|stop-proxy|restart-proxy|integrate-with|disconnect-from|integrate-encast|disconnect-encast|resolve-conflicts)
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
      # For actions that take additional arguments, store them
      if [[ "$ACTION" == "integrate-with" || "$ACTION" == "disconnect-from" ]]; then
        if [[ -z "$PROJECT_NAME" ]]; then
          PROJECT_NAME="$1"
        elif [[ -z "$PROJECT_DIR" ]]; then
          PROJECT_DIR="$1"
        else
          print_error "Too many arguments for $ACTION"
        fi
      else
        print_error "Unknown parameter: $1"
      fi
      shift ;;
  esac
done

# ─────────────────────────────────────────── Prepare environment
[[ -f .env ]] || touch .env
switch_env "$ENVIRONMENT"

cd "$WORKING_DIR" || exit 1

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
  setup-proxy)
    setup_shared_dev_proxy ;;
  stop-proxy)
    stop_shared_dev_proxy ;;
  restart-proxy)
    restart_shared_dev_proxy ;;
  integrate-with)
    integrate_with_other_project "$PROJECT_NAME" "$PROJECT_DIR" ;;
  disconnect-from)
    disconnect_from_other_project "$PROJECT_NAME" "$PROJECT_DIR" ;;
  integrate-encast)
    integrate_with_any_project "encast-web" "$2" ;;
  disconnect-encast)
    disconnect_from_any_project "encast-web" "$2" ;;
  resolve-conflicts)
    resolve_container_conflicts ;;
  *)
    print_error "Unknown action: $ACTION" ;;
esac

print_status "✨ $ACTION completed successfully!"
