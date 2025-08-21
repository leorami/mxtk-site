#!/usr/bin/env bash
# =============================================================================
# 🔧 Simple Route Adder for MXTK Shared Dev Proxy
# =============================================================================
set -e

# Colors
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
BLUE='\033[0;34m'; CYAN='\033[0;36m'; NC='\033[0m'

# Configuration
NGINX_CONFIG_FILE="nginx-proxy.conf"

# Printer helpers
print_status()  { echo -e "${GREEN}[INFO]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARN]${NC} $1"; }
print_error()   { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# Usage
show_usage() {
    cat <<EOF
$(echo -e "${BLUE}🔧 Simple Route Adder${NC}")

USAGE: $0 <project-name> <route-path> <target-url>

EXAMPLES:
  $0 mxtk-site /mxtk/ http://mxtk-site-dev:2000/
  $0 other-project /other/ http://other-project-dev:3000/
EOF
    exit 1
}

# Add project route
add_project_route() {
    local project_name="$1"
    local route_path="$2"
    local target_url="$3"
    
    print_status "Adding route for $project_name: $route_path → $target_url"
    
    # Check if config file exists
    if [[ ! -f "$NGINX_CONFIG_FILE" ]]; then
        print_error "Nginx config file not found: $NGINX_CONFIG_FILE"
    fi
    
    # Check if markers exist
    if ! grep -q "START_EXTERNAL_PROJECTS" "$NGINX_CONFIG_FILE" || ! grep -q "END_EXTERNAL_PROJECTS" "$NGINX_CONFIG_FILE"; then
        print_error "Nginx config file does not contain required markers. Please ensure it has START_EXTERNAL_PROJECTS and END_EXTERNAL_PROJECTS markers."
    fi
    
    # Create backup
    local timestamp=$(date +"%Y%m%d_%H%M%S")
    cp "$NGINX_CONFIG_FILE" "nginx-proxy.conf.backup.${timestamp}"
    print_status "Backup created: nginx-proxy.conf.backup.${timestamp}"
    
    # Create a temporary file with the new route
    local temp_file="${NGINX_CONFIG_FILE}.tmp"
    
    # Create the route configuration
    cat > "$temp_file" << EOF
# $project_name project route
location $route_path {
    proxy_pass $target_url;
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
    proxy_set_header X-Forwarded-Host \$host;
    proxy_set_header X-Forwarded-Port \$server_port;
    proxy_http_version 1.1;
    proxy_set_header Upgrade \$http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header ngrok-skip-browser-warning "true";
    proxy_set_header User-Agent "MXTK-Development-Proxy/1.0";
    # Next.js/React specific headers
    proxy_set_header Origin \$scheme://\$host;
    proxy_set_header Referer \$scheme://\$host;
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;
}
EOF
    
    # Insert the route before END_EXTERNAL_PROJECTS marker
    awk -v route_file="$temp_file" '
        /END_EXTERNAL_PROJECTS/ {
            # Read and print the route file content
            while ((getline line < route_file) > 0) {
                print line
            }
            close(route_file)
            print ""
            next
        }
        { print }
    ' "$NGINX_CONFIG_FILE" > "${NGINX_CONFIG_FILE}.new"
    
    # Check if the insertion was successful
    if [[ -f "${NGINX_CONFIG_FILE}.new" ]]; then
        mv "${NGINX_CONFIG_FILE}.new" "$NGINX_CONFIG_FILE"
        rm -f "$temp_file"
        print_status "✅ Route added successfully"
    else
        rm -f "$temp_file"
        print_error "Failed to add route - new file not created"
    fi
}

# Main argument parsing
if [[ $# -ne 3 ]]; then
    show_usage
fi

add_project_route "$1" "$2" "$3"
print_status "✅ Route addition completed successfully!"
