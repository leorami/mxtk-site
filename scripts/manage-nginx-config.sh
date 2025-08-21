#!/usr/bin/env bash
# =============================================================================
# 🔧 Simplified Nginx Configuration Manager for MXTK Shared Dev Proxy
# =============================================================================
set -e

# Colors
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
BLUE='\033[0;34m'; CYAN='\033[0;36m'; NC='\033[0m'

# Configuration
NGINX_CONFIG_FILE="${NGINX_CONFIG_FILE:-nginx-proxy.conf}"
PROJECT_NAME=""
ROUTE_PATH=""
TARGET_URL=""
ACTION=""

# Printer helpers
print_status()  { echo -e "${GREEN}[INFO]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARN]${NC} $1"; }
print_error()   { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# Usage
show_usage() {
cat <<EOF
$(echo -e "${BLUE}🔧 Simplified Nginx Configuration Manager${NC}")

USAGE: $0 <action> [args]

ACTIONS:
  add <project-name> <route-path> <target-url>    Add project route
  remove <project-name>                           Remove project routes
  list                                           List all external routes
  backup                                         Create backup of current config

EXAMPLES:
  $0 add other-project /other/ http://other-project-dev:3000/
  $0 remove other-project
  $0 list
  $0 backup
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
    
    # Remove existing routes for this project first
    remove_project_routes "$project_name" "silent"
    
    # Create a temporary file with the new route
    local temp_file="${NGINX_CONFIG_FILE}.tmp"
    
    # Create the route configuration as a separate file first
    cat > "$temp_file" << 'EOF'
# PROJECT_NAME project route
location ROUTE_PATH {
    proxy_pass TARGET_URL;
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
    # Next.js/React specific headers
    proxy_set_header Origin $scheme://$host;
    proxy_set_header Referer $scheme://$host;
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;
}
EOF
    
    # Replace placeholders in the temp file
    sed -i.bak "s/PROJECT_NAME/$project_name/g; s|ROUTE_PATH|$route_path|g; s|TARGET_URL|$target_url|g" "$temp_file"
    
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
        rm -f "$temp_file" "$temp_file.bak"
        print_status "✅ Route added successfully"
        return 0
    else
        rm -f "$temp_file" "$temp_file.bak"
        print_error "Failed to add route - new file not created"
        return 1
    fi
}

# Remove project routes
remove_project_routes() {
    local project_name="$1"
    local silent="${2:-false}"
    
    [[ "$silent" != "silent" ]] && print_status "Removing routes for $project_name"
    
    # Create a temporary file without the project's routes
    awk -v project="$project_name" '
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
        in_external && /# '"$project_name"' project route/ {
            # Skip this line and the next 20 lines (the route block)
            skip_lines = 20
            next
        }
        skip_lines > 0 {
            skip_lines--
            next
        }
        { print }
    ' "$NGINX_CONFIG_FILE" > "${NGINX_CONFIG_FILE}.tmp"
    
    mv "${NGINX_CONFIG_FILE}.tmp" "$NGINX_CONFIG_FILE"
    
    [[ "$silent" != "silent" ]] && print_status "✅ Routes removed"
}

# List external routes
list_external_routes() {
    print_status "External Project Routes in $NGINX_CONFIG_FILE:"
    echo
    
    awk '
        /START_EXTERNAL_PROJECTS/ {
            in_external = 1
            next
        }
        /END_EXTERNAL_PROJECTS/ {
            in_external = 0
            next
        }
        in_external && /# .* project route/ {
            gsub(/^[[:space:]]*# /, "")
            gsub(/ project route$/, "")
            project = $0
            next
        }
        in_external && /location / {
            gsub(/^[[:space:]]*location /, "")
            gsub(/ {/, "")
            route = $0
            next
        }
        in_external && /proxy_pass / {
            gsub(/^[[:space:]]*proxy_pass /, "")
            gsub(/;/, "")
            target = $0
            printf "  %-15s %-15s %s\n", project, route, target
            project = ""
            route = ""
            target = ""
        }
    ' "$NGINX_CONFIG_FILE"
}

# Create backup
create_backup() {
    local timestamp=$(date +"%Y%m%d_%H%M%S")
    local backup_file="nginx-proxy.conf.backup.${timestamp}"
    
    cp "$NGINX_CONFIG_FILE" "$backup_file"
    print_status "Backup created: $backup_file"
}

# Main argument parsing
case "${1:-}" in
    add)
        if [[ $# -ne 4 ]]; then
            print_error "Usage: $0 add <project-name> <route-path> <target-url>"
        fi
        add_project_route "$2" "$3" "$4"
        ;;
    remove)
        if [[ $# -ne 2 ]]; then
            print_error "Usage: $0 remove <project-name>"
        fi
        remove_project_routes "$2"
        ;;
    list)
        list_external_routes
        ;;
    backup)
        create_backup
        ;;
    *)
        show_usage
        ;;
esac

print_status "✅ $1 completed successfully!"
