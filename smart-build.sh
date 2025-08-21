#!/bin/bash

# =============================================================================
# SMART BUILD
# 
# Intelligently determines if Docker containers need to be restarted or rebuilt,
# unless bind-mounted changes are sufficient for the development environment.
# 
# Usage:
#   ./smart-build.sh [check|apply|status]
#   ./smart-build.sh --force-build
# =============================================================================

set -euo pipefail

# =============================================================================
# CONFIGURATION
# =============================================================================

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEV_CACHE_DIR="$PROJECT_ROOT/.dev-cache"
TIMESTAMP_FILE="$DEV_CACHE_DIR/last-check.timestamp"
CHECKSUMS_FILE="${DEV_CACHE_DIR}/file-checksums.cache"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# File patterns that require different actions
INSTANT_PATTERNS=(
    "*.js" "*.jsx" "*.ts" "*.tsx"
    "*.css" "*.scss" "*.less"
    "*.html" "*.json"
    "*.md" "*.txt"
    "app/**/*" "components/**/*" "lib/**/*"
    "public/**/*"
    # Next.js specific instant patterns
    "*.page.tsx" "*.page.jsx" "*.page.ts" "*.page.js"
    "*.layout.tsx" "*.layout.jsx" "*.layout.ts" "*.layout.js"
    "*.loading.tsx" "*.loading.jsx" "*.loading.ts" "*.loading.js"
    "*.error.tsx" "*.error.jsx" "*.error.ts" "*.error.js"
    "*.not-found.tsx" "*.not-found.jsx" "*.not-found.ts" "*.not-found.js"
)

# Configuration changes that require restart
RESTART_PATTERNS=(
    ".env*" "*.env"
    "next.config.mjs" "next.config.js" "next.config.ts"
    "middleware.ts" "middleware.js"
    "app/layout.tsx" "app/layout.jsx" "app/layout.ts" "app/layout.js"
    "app/globals.css"
    "tailwind.config.ts" "tailwind.config.js"
    "postcss.config.js" "postcss.config.ts"
    "tsconfig.json" "tsconfig*.json"
    "package.json"
    "components/ThemeSwitch.tsx"
    "components/SiteHeader.tsx"
    "components/SiteFooter.tsx"
)

# Only rebuild when absolutely necessary - dependency or infrastructure changes
REBUILD_PATTERNS=(
    "package*.json" "yarn.lock" "npm-shrinkwrap.json" "package-lock.json"
    "Dockerfile*" "docker-compose*.yml"
    ".dockerignore"
    "next-env.d.ts"
    "babel.config.js" "babel.config.json"
    ".babelrc" ".babelrc.js" ".babelrc.json"
    "eslint.config.js" "eslint.config.mjs"
    ".eslintrc*" ".eslintrc.js" ".eslintrc.json"
    "prettier.config.js" "prettier.config.mjs"
    ".prettierrc*" ".prettierrc.js" ".prettierrc.json"
)

# Initialize cache directory
mkdir -p "${DEV_CACHE_DIR}"

# =============================================================================
# UTILITY FUNCTIONS
# =============================================================================

log() {
    local level="$1"
    shift
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    case "$level" in
        "INFO")  echo -e "${GREEN}[INFO]${NC}  ${timestamp} $*" ;;
        "WARN")  echo -e "${YELLOW}[WARN]${NC}  ${timestamp} $*" ;;
        "ERROR") echo -e "${RED}[ERROR]${NC} ${timestamp} $*" ;;
        "DEBUG") 
            if [[ "${DEBUG:-}" == "1" || "${VERBOSE:-}" == "true" ]]; then
                echo -e "${BLUE}[DEBUG]${NC} ${timestamp} $*" 
            fi
            ;;
        "TITLE") echo -e "${PURPLE}[SMART]${NC} ${timestamp} $*" ;;
    esac
}

# Check if a file matches any pattern in an array
matches_pattern() {
    local file="$1"
    local pattern_type="$2"
    local basename_file=$(basename "$file")
    
    case "$pattern_type" in
        "INSTANT")
            # Check file extensions
            case "$basename_file" in
                *.js|*.jsx|*.ts|*.tsx|*.css|*.scss|*.less|*.html|*.json|*.md|*.txt)
                    return 0
                    ;;
            esac
            # Check directory patterns
            case "$file" in
                app/*|components/*|lib/*|public/*)
                    return 0
                    ;;
            esac
            # Next.js specific instant patterns
            case "$basename_file" in
                *.page.tsx|*.page.jsx|*.page.ts|*.page.js|*.layout.tsx|*.layout.jsx|*.layout.ts|*.layout.js|*.loading.tsx|*.loading.jsx|*.loading.ts|*.loading.js|*.error.tsx|*.error.jsx|*.error.ts|*.error.js|*.not-found.tsx|*.not-found.jsx|*.not-found.ts|*.not-found.js)
                    return 0
                    ;;
            esac
            ;;
        "RESTART")
            case "$basename_file" in
                .env*|*.env|next.config.mjs|next.config.js|next.config.ts|middleware.ts|middleware.js|package.json|tailwind.config.ts|tailwind.config.js|postcss.config.js|postcss.config.ts|tsconfig.json|tsconfig*.json)
                    return 0
                    ;;
            esac
            # Check specific files
            case "$file" in
                app/layout.tsx|app/layout.jsx|app/layout.ts|app/layout.js|app/globals.css|components/ThemeSwitch.tsx|components/SiteHeader.tsx|components/SiteFooter.tsx)
                    return 0
                    ;;
            esac
            ;;
        "REBUILD")
            case "$basename_file" in
                package*.json|yarn.lock|npm-shrinkwrap.json|package-lock.json|Dockerfile*|.dockerignore|next-env.d.ts)
                    return 0
                    ;;
            esac
            # Check directory patterns
            case "$file" in
                docker-compose*.yml)
                    return 0
                    ;;
            esac
            # Build tool configurations
            case "$basename_file" in
                babel.config.js|babel.config.json|.babelrc|.babelrc.js|.babelrc.json|eslint.config.js|eslint.config.mjs|.eslintrc*|.eslintrc.js|.eslintrc.json|prettier.config.js|prettier.config.mjs|.prettierrc*|.prettierrc.js|.prettierrc.json)
                    return 0
                    ;;
            esac
            ;;
    esac
    return 1
}

# Get file modification time in seconds since epoch
get_file_mtime() {
    local file="$1"
    if [[ -f "$file" ]]; then
        if [[ "$OSTYPE" == "darwin"* ]]; then
            stat -f "%m" "$file" 2>/dev/null || echo "0"
        else
            stat -c "%Y" "$file" 2>/dev/null || echo "0"
        fi
    else
        echo "0"
    fi
}

# Check if a JavaScript/TypeScript file has import changes that might need restart
check_js_import_changes() {
    local file="$1"
    
    if [[ ! -f "$file" ]]; then
        return 1  # File doesn't exist, no import changes
    fi
    
    # Only analyze JS/TS files
    if [[ "$file" != *.js && "$file" != *.jsx && "$file" != *.ts && "$file" != *.tsx ]]; then
        return 1
    fi
    
    local content
    content=$(cat "$file" 2>/dev/null || echo "")
    
    # Check for new dependencies that might need npm install
    local new_deps=(
        "import.*from ['\"]react" "import.*from ['\"]next" "import.*from ['\"]@next"
        "import.*from ['\"]@mui" "import.*from ['\"]@emotion"
        "import.*from ['\"]axios" "import.*from ['\"]lodash" "import.*from ['\"]moment"
        "require\\(['\"]react" "require\\(['\"]next" "require\\(['\"]@mui" "require\\(['\"]axios"
    )
    
    for dep_pattern in "${new_deps[@]}"; do
        if echo "$content" | grep -q "$dep_pattern"; then
            # Check if this is a new import by looking at package.json
            if [[ -f "package.json" ]]; then
                local dep_name
                dep_name=$(echo "$content" | grep -o "$dep_pattern" | head -1 | sed 's/.*['\''"]\\([^'\''"]*\\)['\''"].*/\\1/')
                if [[ -n "$dep_name" ]] && ! grep -q "\"$dep_name\"" "package.json"; then
                    log "DEBUG" "Found new dependency '$dep_name' in $file - might need rebuild"
                    return 0  # Might need rebuild
                fi
            fi
        fi
    done
    
    return 1  # No restart needed
}

# Check if a Next.js file has changes that require specific actions
check_nextjs_changes() {
    local file="$1"
    
    if [[ ! -f "$file" ]]; then
        return 1  # File doesn't exist
    fi
    
    local content
    content=$(cat "$file" 2>/dev/null || echo "")
    local basename_file=$(basename "$file")
    
    # Check for Next.js configuration changes
    if [[ "$file" =~ next\.config\.(mjs|js|ts)$ ]]; then
        log "DEBUG" "Found Next.js config change in $file - requires restart"
        return 0  # Needs restart
    fi
    
    # Check for middleware changes
    if [[ "$file" =~ middleware\.(ts|js)$ ]]; then
        log "DEBUG" "Found middleware change in $file - requires restart"
        return 0  # Needs restart
    fi
    
    # Check for root layout changes
    if [[ "$file" =~ app/layout\.(tsx|jsx|ts|js)$ ]]; then
        log "DEBUG" "Found root layout change in $file - requires restart"
        return 0  # Needs restart
    fi
    
    # Check for global CSS changes
    if [[ "$file" =~ app/globals\.(css|scss)$ ]]; then
        log "DEBUG" "Found global CSS change in $file - requires restart"
        return 0  # Needs restart
    fi
    
    # Check for Tailwind config changes
    if [[ "$file" =~ tailwind\.config\.(ts|js)$ ]]; then
        log "DEBUG" "Found Tailwind config change in $file - requires restart"
        return 0  # Needs restart
    fi
    
    # Check for page changes (these are instant)
    if [[ "$basename_file" =~ \.page\.(tsx|jsx|ts|js)$ ]]; then
        log "DEBUG" "Found page change in $file - instant update"
        return 1  # Instant update, no restart needed
    fi
    
    # Check for component changes (these are instant)
    if [[ "$file" =~ components/.*\.(tsx|jsx|ts|js)$ ]]; then
        log "DEBUG" "Found component change in $file - instant update"
        return 1  # Instant update, no restart needed
    fi
    
    return 1  # No special action needed
}

# Analyze file content to determine if restart/rebuild is needed beyond pattern matching
analyze_file_content() {
    local file="$1"
    local analyze_content="${2:-false}"
    
    if [[ "$analyze_content" != "true" ]]; then
        return 1  # Content analysis disabled
    fi
    
    log "DEBUG" "Analyzing content of $file"
    
    # Check JavaScript/TypeScript files for new dependencies
    if check_js_import_changes "$file"; then
        echo "REBUILD"
        return 0
    fi
    
    # Check Next.js-specific changes
    if check_nextjs_changes "$file"; then
        echo "RESTART"
        return 0
    fi
    
    return 1  # No special action needed
}

# Get list of files to track
get_tracked_files() {
    local tracked_files=()
    
    # Find all relevant files in the project, excluding large/irrelevant directories
    while IFS= read -r file; do
        [[ -n "$file" ]] && tracked_files+=("$file")
    done < <(find . -type f \( \
        -name "*.js" -o \
        -name "*.jsx" -o \
        -name "*.ts" -o \
        -name "*.tsx" -o \
        -name "*.json" -o \
        -name "*.yml" -o \
        -name "*.yaml" -o \
        -name "*.txt" -o \
        -name "*.toml" -o \
        -name "*.lock" -o \
        -name "Dockerfile*" -o \
        -name "*.conf" -o \
        -name "*.env*" -o \
        -name "*.css" -o \
        -name "*.scss" -o \
        -name "*.less" -o \
        -name "*.html" -o \
        -name "*.md" \
    \) \
    -not -path "*/node_modules/*" \
    -not -path "*/.next/*" \
    -not -path "*/build/*" \
    -not -path "*/dist/*" \
    -not -path "*/.git/*" \
    -not -path "*/coverage/*" \
    -not -path "*/.cache/*" \
    -not -path "*/.dev-cache/*" \
    2>/dev/null || true)
    
    printf '%s\n' "${tracked_files[@]}"
}

# Load file manifest from cache
load_file_manifest() {
    local manifest_file="$DEV_CACHE_DIR/file-manifest.txt"
    
    if [[ -f "$manifest_file" ]]; then
        cat "$manifest_file"
    fi
}

# Save file manifest to cache
save_file_manifest() {
    local manifest_file="$DEV_CACHE_DIR/file-manifest.txt"
    
    log "DEBUG" "Saving file manifest to $manifest_file"
    
    # Create manifest directory if it doesn't exist
    mkdir -p "$DEV_CACHE_DIR"
    
    # Get current modification times for all tracked files
    local tracked_files=()
    while IFS= read -r file; do
        [[ -n "$file" ]] && tracked_files+=("$file")
    done < <(get_tracked_files)
    
    log "DEBUG" "Found ${#tracked_files[@]} files to track"
    
    # Write manifest: filepath:mtime
    > "$manifest_file"  # Clear file
    for file in "${tracked_files[@]}"; do
        local mtime
        mtime=$(get_file_mtime "$file")
        echo "$file:$mtime" >> "$manifest_file"
    done
    
    log "DEBUG" "Saved file manifest with ${#tracked_files[@]} files"
}

# =============================================================================
# CHANGE DETECTION
# =============================================================================

detect_changes() {
    local since_timestamp="$1"  # Not used in new implementation, kept for compatibility
    
    log "DEBUG" "Detecting file changes"
    
    local changed_files=()
    local instant_changes=()
    local restart_changes=()
    local rebuild_changes=()
    
    # Load existing manifest
    local manifest
    manifest=$(load_file_manifest)
    
    # Get all currently tracked files
    local tracked_files=()
    while IFS= read -r file; do
        [[ -n "$file" ]] && tracked_files+=("$file")
    done < <(get_tracked_files)
    
    # Check each tracked file for changes
    for file in "${tracked_files[@]}"; do
        local current_mtime
        current_mtime=$(get_file_mtime "$file")
        
        # Extract known mtime for this file from manifest
        local known_mtime="0"
        if [[ -n "$manifest" ]]; then
            known_mtime=$(echo "$manifest" | grep "^$file:" | cut -d':' -f2 || echo "0")
        fi
        
        # If file is newer than what we have recorded, it's changed
        if (( current_mtime > known_mtime )); then
            changed_files+=("$file")
            log "DEBUG" "Changed file: $file (current: $current_mtime, known: $known_mtime)"
        fi
    done

    # Special handling: if .env changed, always require restart
    for file in "${changed_files[@]:-}"; do
        if [[ "$file" == ".env" ]]; then
            restart_changes+=(".env")
            log "WARN" ".env file changed: environment restart required."
        fi
    done
    
    # Categorize changes
    for file in "${changed_files[@]:-}"; do
        # Skip .env here, already handled
        if [[ "$file" == ".env" ]]; then
            continue
        fi
        local categorized=false
        
        # First check content analysis if enabled
        if [[ "${ANALYZE_CONTENT:-false}" == "true" ]]; then
            local content_analysis
            content_analysis=$(analyze_file_content "$file" "true" 2>/dev/null || echo "")
            if [[ -n "$content_analysis" ]]; then
                case "$content_analysis" in
                    "RESTART")
                        restart_changes+=("$file")
                        categorized=true
                        log "DEBUG" "Content analysis: $file requires RESTART"
                        ;;
                    "REBUILD")
                        rebuild_changes+=("$file")
                        categorized=true
                        log "DEBUG" "Content analysis: $file requires REBUILD"
                        ;;
                esac
            fi
        fi
        
        # If not categorized by content analysis, use pattern matching
        if [[ "$categorized" == "false" ]]; then
            if matches_pattern "$file" "REBUILD"; then
                rebuild_changes+=("$file")
            elif matches_pattern "$file" "RESTART"; then
                restart_changes+=("$file")
            elif matches_pattern "$file" "INSTANT"; then
                instant_changes+=("$file")
            else
                # Default to instant for unknown file types (most dev files are bind-mounted)
                instant_changes+=("$file")
            fi
        fi
    done
    
    # Output results with improved logging
    if [[ ${#instant_changes[@]} -gt 0 ]]; then
        log "DEBUG" "Instant changes: ${instant_changes[*]}"
    fi
    if [[ ${#restart_changes[@]} -gt 0 ]]; then
        log "DEBUG" "Restart changes: ${restart_changes[*]}"
    fi
    if [[ ${#rebuild_changes[@]} -gt 0 ]]; then
        log "DEBUG" "Rebuild changes: ${rebuild_changes[*]}"
    fi
    
    echo "INSTANT:${#instant_changes[@]}:$(IFS=,; echo "${instant_changes[*]:-}")"
    echo "RESTART:${#restart_changes[@]}:$(IFS=,; echo "${restart_changes[*]:-}")"
    echo "REBUILD:${#rebuild_changes[@]}:$(IFS=,; echo "${rebuild_changes[*]:-}")"
}

# =============================================================================
# ACTION DETERMINATION
# =============================================================================

determine_action() {
    local force_rebuild="$1"
    local test_mode="$2"
    local force_check="${3:-false}"
    
    if [[ "$force_rebuild" == "true" ]]; then
        echo "REBUILD"
        return
    fi
    
    local last_check=0
    if [[ -f "$TIMESTAMP_FILE" ]]; then
        last_check=$(cat "$TIMESTAMP_FILE")
    fi
    
    local current_time=$(date +%s)
    local check_interval=60  # Check every minute minimum
    # Always re-check on apply path or when force_check is true
    if [[ "$force_check" != "true" ]]; then
        if (( current_time - last_check < check_interval )); then
            log "DEBUG" "Skipping check, too recent (< ${check_interval}s ago)"
            echo "NONE"
            return
        fi
    fi
    
    # Detect changes
    local changes_output
    changes_output=$(detect_changes "$last_check")
    
    local instant_count=0
    local restart_count=0
    local rebuild_count=0
    
    while IFS= read -r line; do
        if [[ "$line" =~ ^INSTANT:([0-9]+): ]]; then
            instant_count="${BASH_REMATCH[1]}"
        elif [[ "$line" =~ ^RESTART:([0-9]+): ]]; then
            restart_count="${BASH_REMATCH[1]}"
        elif [[ "$line" =~ ^REBUILD:([0-9]+): ]]; then
            rebuild_count="${BASH_REMATCH[1]}"
        fi
    done <<< "$changes_output"
    
    # Determine required action (highest priority wins)
    if (( rebuild_count > 0 )); then
        echo "REBUILD"
    elif (( restart_count > 0 )); then
        # In test mode, be more conservative about restarts
        if [[ "$test_mode" == "true" ]]; then
            echo "NONE"  # Let test setup handle environment preparation
        else
            echo "RESTART"
        fi
    elif (( instant_count > 0 )); then
        echo "NONE"  # Instant changes don't require action
    else
        echo "NONE"
    fi
}

# =============================================================================
# DOCKER OPERATIONS
# =============================================================================

execute_action() {
    local action="$1"
    local verbose="$2"
    
    case "$action" in
        "NONE")
            log "INFO" "No action required - bind-mounted changes are live"
            ;;
        "RESTART")
            log "INFO" "Restarting containers for configuration changes"
            docker compose restart
            # Save file manifest
            save_file_manifest
            ;;
        "REBUILD")
            log "INFO" "Rebuilding containers for dependency/structure changes"
            docker compose up --build -d
            # Save file manifest
            save_file_manifest
            ;;
        *)
            log "ERROR" "Unknown action: $action"
            exit 1
            ;;
    esac
}

# =============================================================================
# STATUS REPORTING
# =============================================================================

show_status() {
    local verbose="$1"
    
    log "TITLE" "MXTK Site Development Environment Status"
    echo
    
    # Check Docker status
    if ! docker info > /dev/null 2>&1; then
        log "ERROR" "Docker is not running"
        exit 1
    fi
    
    # Check running containers
    local running_containers
    running_containers=$(docker compose ps --services --filter "status=running" 2>/dev/null || echo "")
    
    if [[ -z "$running_containers" ]]; then
        log "WARN" "No MXTK containers are running"
        echo
        echo "Start the environment with:"
        echo "  ./setup-mxtk-site.sh start"
        return
    fi
    
    echo -e "${GREEN}Service Status:${NC}"
    local unhealthy_services=()
    
    # Check if main container is running
    local container_name="mxtk-site-dev"
    if docker ps --filter "name=${container_name}" --filter "status=running" | grep -q "$container_name"; then
        echo "  ✓ mxtk-site-dev (port 2000) - running"
    else
        echo "  ✗ mxtk-site-dev (port 2000) - not running"
        unhealthy_services+=("mxtk-site-dev")
    fi
    
    # Show summary for non-running services
    if [[ ${#unhealthy_services[@]} -gt 0 ]]; then
        echo
        echo -e "${RED}⚠ Services not running: ${unhealthy_services[*]}${NC}"
        echo "  Check container logs with: docker logs <container-name>"
        echo "  Container names: mxtk-site-dev"
    fi
    
    echo
    
    # Check recent changes
    local last_check=0
    if [[ -f "$TIMESTAMP_FILE" ]]; then
        last_check=$(cat "$TIMESTAMP_FILE")
        echo -e "${BLUE}Last environment check:${NC} $(date -r "$last_check" '+%Y-%m-%d %H:%M:%S')"
    else
        echo -e "${YELLOW}No previous environment check found${NC}"
    fi
    
    echo
    
    # Check for pending changes
    local action
    action=$(determine_action "false" "false")
    
    case "$action" in
        "NONE")
            echo -e "${GREEN}✓ Environment is up to date${NC}"
            ;;
        "RESTART")
            echo -e "${YELLOW}⚠ Environment restart recommended${NC}"
            echo "  Run: ./smart-build.sh apply"
            ;;
        "REBUILD")
            echo -e "${RED}⚠ Environment rebuild required${NC}"
            echo "  Run: ./smart-build.sh apply"
            ;;
    esac
    
    echo
    echo -e "${CYAN}Development Tips:${NC}"
    echo "  • React/Next.js code changes are instant (hot reload)"
    echo "  • Component changes are instant (bind-mounted)"
    echo "  • Configuration changes require restart (Next.js restart)"
    echo "  • Dependency changes require rebuild (npm install + build)"
    echo "  • Use './smart-build.sh check' to verify changes"
    echo "  • Use './smart-build.sh apply' to sync environment"
}

# =============================================================================
# MAIN EXECUTION
# =============================================================================

usage() {
    echo "MXTK Smart Development Environment Manager"
    echo
    echo "Usage:"
    echo "  $0 [check|apply|status]              Main operations"
    echo "  $0 --force-build                   Force complete rebuild"
    echo "  $0 --test-mode                       Optimize for testing scenarios (less aggressive rebuilds)"
    echo "  $0 --analyze-content                 Enable deep content analysis for import changes"
    echo "  $0 --verbose|-v                      Show detailed error messages"
    echo "  $0 --help                            Show this help"
    echo
    echo "Commands:"
    echo "  check      Analyze what changes require action"
    echo "  apply      Execute required actions (restart/rebuild)"
    echo "  status     Show current environment status"

    echo
    echo "Examples:"
    echo "  $0 status                           Show environment status"
    echo "  $0 check                            Check what needs updating"
    echo "  $0 apply                            Apply required changes"
    echo "  $0 --force-build apply            Force rebuild everything"
    echo "  $0 --test-mode check                Optimized check for testing"
    echo "  $0 --analyze-content check          Deep analysis of import changes"
    echo "  $0 --verbose status                 Show detailed service errors"
}

main() {
    local command=""
    local force_rebuild="false"
    local test_mode="false"
    local verbose="false"
    local analyze_content="false"
    
    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --force-build)
                force_rebuild="true"
                shift
                ;;
            --test-mode)
                test_mode="true"
                shift
                ;;
            --analyze-content)
                analyze_content="true"
                shift
                ;;
            --verbose|-v)
                verbose="true"
                shift
                ;;
            --help|-h)
                usage
                exit 0
                ;;
            check|apply|status)
                command="$1"
                shift
                ;;
            *)
                log "ERROR" "Unknown argument: $1"
                usage
                exit 1
                ;;
        esac
    done
    
    # Default to status if no command specified
    if [[ -z "$command" ]]; then
        command="status"
    fi
    
    # Change to project root
    cd "$PROJECT_ROOT"
    
    # Set environment variables for content analysis
    export ANALYZE_CONTENT="$analyze_content"
    
    # Execute command
    case "$command" in
        "status")
            show_status "$verbose"
            ;;
        "check")
            local action
            # Force a re-check when applying so config changes trigger restarts
            action=$(determine_action "$force_rebuild" "$test_mode" "true")
            
            log "TITLE" "Environment Check Results"
            echo
            
            case "$action" in
                "NONE")
                    echo -e "${GREEN}✓ No action required${NC}"
                    if [[ "$test_mode" == "true" ]]; then
                        echo "  Test mode: bind-mounted changes are live"
                    else
                        echo "  All changes are bind-mounted and live"
                    fi
                    ;;
                "RESTART")
                    echo -e "${YELLOW}⚠ Restart required${NC}"
                    echo "  Configuration or environment changes detected"
                    ;;
                "REBUILD")
                    echo -e "${RED}⚠ Rebuild required${NC}"
                    echo "  Dependency or structural changes detected"
                    ;;
            esac
            
            if [[ "$test_mode" == "true" ]]; then
                echo "  Mode: Testing (optimized for test scenarios)"
            fi
            ;;
        "apply")
            local action
            action=$(determine_action "$force_rebuild" "$test_mode")
            
            log "TITLE" "Applying Environment Changes"
            echo
            
            execute_action "$action" "$verbose"
            
            # Update timestamp
            echo "$(date +%s)" > "$TIMESTAMP_FILE"
            
            log "INFO" "Environment update complete"
            ;;

        *)
            log "ERROR" "Unknown command: $command"
            usage
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
