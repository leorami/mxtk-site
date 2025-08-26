#!/usr/bin/env bash
# =============================================================================
# MXTK ORGANIZATION LOGO FINDER & DOWNLOADER (v2.2: dry-run + progress bar)
#   - --dry-run: discover & score, no writes
#   - --jobs/-j: parallelism via xargs -P
#   - --force: overwrite existing files
#   - --no-progress: disable progress bar (e.g., CI)
# =============================================================================
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ORGANIZATIONS_DIR="$PROJECT_ROOT/public/organizations"
mkdir -p "$ORGANIZATIONS_DIR"

# ---- Colors -----------------------------------------------------------------
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
BLUE='\033[0;34m'; CYAN='\033[0;36m'; NC='\033[0m'

UA="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0 Safari/537.36"
CURL_OPTS=(--silent --location --fail --max-time 20 --connect-timeout 7 --retry 2 --retry-delay 1 --user-agent "$UA")

# ---- Flags ------------------------------------------------------------------
CSV_FILE=""; FORCE=false; JOBS=""; DRY_RUN=false; NO_PROGRESS=false

show_help() {
  echo -e "${BLUE}MXTK Organization Logo Finder & Downloader${NC}"
  echo
  echo "Usage:"
  echo "  $0                    # Built-in list"
  echo "  $0 --csv orgs.csv     # CSV: name,domain,filename"
  echo "  $0 --force            # Overwrite existing files"
  echo "  $0 --jobs 6           # Parallel workers (default: CPU cores)"
  echo "  $0 --dry-run          # Discover & score only, no writes"
  echo "  $0 --no-progress      # Disable progress bar"
  echo "  $0 --instructions     # Manual guide"
  echo "  $0 --help             # Help"
  echo
  echo "Outputs normalized transparent PNGs (<=512x512) into:"
  echo "  $ORGANIZATIONS_DIR"
}

need_bins=(curl wget jq convert)
check_dependencies() {
  local missing=()
  for b in "${need_bins[@]}"; do command -v "$b" >/dev/null 2>&1 || missing+=("$b"); done
  if ((${#missing[@]})); then
    echo -e "${RED}❌ Missing deps:${NC} ${missing[*]}"
    echo -e "Install (macOS): ${YELLOW}brew install curl wget jq imagemagick${NC}"
    exit 1
  fi
}

slugify(){ echo "$1" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g;s/^-+|-+$//g'; }

absolutize_url(){
  local base="$1" url="$2"
  if [[ "$url" =~ ^https?:// ]]; then echo "$url"; return; fi
  if [[ "$url" =~ ^// ]]; then local proto; proto="$(echo "$base"|sed -E 's#^(https?)://.*#\1#')"; echo "$proto:$url"; return; fi
  if [[ "$url" =~ ^/ ]]; then echo "$(echo "$base"|sed -E 's#(https?://[^/]+).*#\1#')$url"; return; fi
  echo "$(echo "$base"|sed -E 's#(https?://.*/).*#\1#')$url"
}

download_to(){ local url="$1" out="$2"; curl "${CURL_OPTS[@]}" -o "$out" "$url" 2>/dev/null || return 1; [[ -s "$out" ]] || return 1; file "$out"|grep -qiE 'image|bitmap|png|jpeg|svg|ico'||return 1; }
validate_image_basic(){ local f="$1"; [[ -f "$f" ]] || return 1; local s; s="$(stat -f%z "$f" 2>/dev/null || stat -c%s "$f" 2>/dev/null || echo 0)"; (( s >= 1024 )) || return 1; file "$f"|grep -qiE 'image|bitmap|png|jpeg|svg|ico'||return 1; }
score_image(){
  local path="$1" mime size score=10
  mime="$(file -b --mime-type "$path" 2>/dev/null || true)"
  size="$(stat -f%z "$path" 2>/dev/null || stat -c%s "$path" 2>/dev/null || echo 0)"
  case "$mime" in
    image/svg+xml) score=100;;
    image/png) if identify -format "%[channels]" "$path" 2>/dev/null | grep -q 'a'; then score=80; else score=70; fi;;
    image/jpeg) [[ "$size" -ge 40000 ]] && score=55 || score=45;;
    image/x-icon|image/vnd.microsoft.icon|image/ico) score=30;;
    *) score=10;;
  esac
  echo "$score"
}
normalize_image(){ local in="$1" out="$2"; convert "$in" -density 512 -background none -alpha on -trim +repage -resize '512x512>' -gravity center -extent 512x512 PNG32:"$out" 2>/dev/null; [[ -s "$out" ]]; }
generic_badge(){
  local name="$1" out="$2" initials
  initials="$(echo "$name"|awk '{for(i=1;i<=NF;i++) printf toupper(substr($i,1,1))}'|cut -c1-2)"
  local tmp_svg; tmp_svg="$(mktemp).svg"
  cat >"$tmp_svg" <<EOF
<svg width="512" height="512" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#4f46e5"/><stop offset="1" stop-color="#7c3aed"/>
  </linearGradient></defs>
  <rect x="0" y="0" width="200" height="200" rx="24" fill="url(#g)"/>
  <text x="100" y="118" text-anchor="middle" font-size="84" font-family="Arial" fill="#fff" font-weight="700">$initials</text>
</svg>
EOF
  normalize_image "$tmp_svg" "$out" || cp "$tmp_svg" "$out"
  rm -f "$tmp_svg"
}
extract_image_urls_from_html(){
  local base="$1" html="$2"
  grep -Eoi '(<link[^>]+rel="[^"]*(icon|apple-touch-icon|mask-icon)[^"]*"[^>]*>)|(<meta[^>]+property="(og:image|twitter:image)"[^>]*>)|([a-zA-Z0-9/_\.-]+logo[a-zA-Z0-9/_\.-]*\.(svg|png|jpe?g|ico))' "$html" \
    | grep -Eo '(href|content)=("[^"]+"|'\''[^'\'']+'\'')|([a-zA-Z0-9/_\.-]+logo[a-zA-Z0-9/_\.-]*\.(svg|png|jpe?g|ico))' \
    | sed -E 's/^(href|content)=//; s/^["'\'']|["'\'']$//g' \
    | while read -r u; do absolutize_url "$base" "$u"; done \
    | sed -E 's/#.*$//' \
    | grep -Ei '\.(svg|png|jpe?g|ico)($|\?)' \
    | awk '!seen[$0]++'
}
gather_candidate_urls(){
  local name="$1" domain="$2"
  local homepage="https://${domain#https://}"; homepage="${homepage#http://}"; homepage="https://$homepage"
  cat <<EOF
https://logo.clearbit.com/$domain?size=512
https://icon.horse/icon/$domain
https://www.google.com/s2/favicons?sz=256&domain=$domain
https://icons.duckduckgo.com/ip3/$domain.ico
$homepage/favicon.ico
$homepage/apple-touch-icon.png
$homepage/apple-touch-icon-precomposed.png
$homepage/android-chrome-512x512.png
$homepage/favicon-32x32.png
$homepage/favicon-196x196.png
$homepage/logo.png
$homepage/logo.svg
$homepage/assets/logo.svg
$homepage/assets/logo.png
EOF
  local html; html="$(mktemp)"; curl "${CURL_OPTS[@]}" -o "$html" "$homepage" || true
  if [[ -s "$html" ]]; then extract_image_urls_from_html "$homepage" "$html" || true; fi
  rm -f "$html"
}
wikidata_logo_url(){
  local name="$1" search_json qid claims file enc
  search_json="$(curl "${CURL_OPTS[@]}" "https://www.wikidata.org/w/api.php?action=wbsearchentities&language=en&type=item&format=json&search=$(printf '%s' "$name"|jq -s -R -r @uri)")" || return 1
  qid="$(echo "$search_json"|jq -r '.search[0].id // empty')"; [[ -n "$qid" ]] || return 1
  claims="$(curl "${CURL_OPTS[@]}" "https://www.wikidata.org/w/api.php?action=wbgetclaims&property=P154&entity=$qid&format=json")" || return 1
  file="$(echo "$claims"|jq -r '.claims.P154[0].mainsnak.datavalue.value // empty')"; [[ -n "$file" ]] || return 1
  enc="$(printf '%s' "$file"|sed 's/ /_/g'|jq -s -R -r @uri)"
  echo "https://commons.wikimedia.org/wiki/Special:FilePath/$enc"
}

download_best_logo(){
  local name="$1" domain="$2" out_png="$3" dry="$4"
  echo -e "${CYAN}🔍 Searching:${NC} $name (${domain:-no-domain})"
  local tmpdir; tmpdir="$(mktemp -d)"
  local -a candidates=()
  if [[ -n "${domain:-}" ]]; then mapfile -t candidates < <(gather_candidate_urls "$name" "$domain" | awk '!seen[$0]++'); fi
  local wd_url; wd_url="$(wikidata_logo_url "$name" || true)"; [[ -n "$wd_url" ]] && candidates+=("$wd_url")
  local slug; slug="$(slugify "$name")"
  candidates+=("https://1000logos.net/wp-content/uploads/${slug}-logo.png" "https://logos-world.net/wp-content/uploads/${slug}-logo.png")

  local best_path="" best_score=-1 best_url="" i=0
  for url in "${candidates[@]}"; do
    ((i++))
    local tmp="$tmpdir/cand_$i"
    echo -e "  ${BLUE}→ Trying:${NC} $url"
    if download_to "$url" "$tmp" && validate_image_basic "$tmp"; then
      local s; s="$(score_image "$tmp")"
      printf "     ✓ saved (%s) score=%s\n" "$(file -b "$tmp")" "$s"
      if (( s > best_score )); then best_score="$s"; best_path="$tmp"; best_url="$url"; fi
    fi
  done

  if [[ -z "$best_path" ]]; then
    if [[ "$dry" == "true" ]]; then
      echo -e "  ${YELLOW}⚠️  DRY-RUN:${NC} no viable logo; would generate placeholder"
      rm -rf "$tmpdir"; return 0
    fi
    echo -e "  ${YELLOW}⚠️  No viable logo found. Generating placeholder badge...${NC}"
    generic_badge "$name" "$out_png"
    echo -e "  ${GREEN}✓${NC} Placeholder saved → $out_png"
    rm -rf "$tmpdir"; return 0
  fi

  if [[ "$dry" == "true" ]]; then
    echo -e "  ${GREEN}DRY-RUN:${NC} best='$best_url' score=$best_score → would save $out_png"
    rm -rf "$tmpdir"; return 0
  fi

  if normalize_image "$best_path" "$out_png"; then
    echo -e "  ${GREEN}✅ Saved logo →${NC} $out_png (src: $best_url, score=$best_score)"
  else
    echo -e "  ${YELLOW}⚠️  Normalization failed. Falling back to placeholder...${NC}"
    generic_badge "$name" "$out_png"
    echo -e "  ${GREEN}✓${NC} Placeholder saved → $out_png"
  fi
  rm -rf "$tmpdir"
}

show_instructions(){
  echo -e "${BLUE}🔍 MXTK Organization Logo Finder (Manual)${NC}"
  echo "1) Prefer SVG, then transparent PNG >= 512px."
  echo "2) Use org press kits or Wikidata (P154) for official marks."
  echo "3) Save as slugified name into: $ORGANIZATIONS_DIR"
}

builtin_orgs=(
  "American Cancer Society,cancer.org,american-cancer-society.png"
  "American Heart Association,heart.org,american-heart-association.png"
  "March of Dimes,marchofdimes.org,march-of-dimes.png"
  "American Red Cross,redcross.org,american-red-cross.png"
  "Salvation Army,salvationarmy.org,salvation-army.png"
  "Habitat for Humanity,habitat.org,habitat-for-humanity.png"
  "Doctors Without Borders,doctorswithoutborders.org,doctors-without-borders.png"
  "World Wildlife Fund,worldwildlife.org,world-wildlife-fund.png"
  "Persona,withpersona.com,persona.png"
  "BitGo,bitgo.com,bitgo.png"
  "Chainlink,chain.link,chainlink.png"
  "Arbitrum,arbitrum.io,arbitrum.png"
)

# --- Single-row processor (invoked by xargs) ---------------------------------
process_one_row_cmd(){
  local row="$1" force_flag="$2" dry_flag="$3" progress_fifo="$4"
  IFS=',' read -r name domain filename <<<"$row"
  [[ -n "${filename:-}" ]] || filename="$(slugify "$name").png"
  local out="$ORGANIZATIONS_DIR/$filename"

  if [[ -f "$out" && "$force_flag" != "true" && "$dry_flag" != "true" ]]; then
    echo -e "${GREEN}✅ Exists:${NC} $name → $filename"
  else
    download_best_logo "$name" "${domain:-}" "$out" "$dry_flag" || true
  fi

  # Notify progress (best-effort)
  if [[ -p "$progress_fifo" ]]; then echo "1" >"$progress_fifo" || true; fi
}

# --- Progress bar ------------------------------------------------------------
_draw_progress(){
  local current="$1" total="$2"
  local cols; cols="$(tput cols 2>/dev/null || echo 80)"
  local bar_w=$(( cols - 20 )); (( bar_w < 10 )) && bar_w=10
  local pct=$(( current*100/total ))
  local fill=$(( bar_w*pct/100 ))
  local rest=$(( bar_w - fill ))
  printf "\r[%s%s] %3d%% (%d/%d)" "$(printf '%0.s#' $(seq 1 $fill))" "$(printf '%0.s-' $(seq 1 $rest))" "$pct" "$current" "$total"
}

run_progress_loop(){
  local fifo="$1" total="$2"
  local done=0
  _draw_progress 0 "$total"
  while read -r _ <"$fifo"; do
    done=$((done+1))
    _draw_progress "$done" "$total"
    if (( done >= total )); then break; fi
  done
  echo
}

# --- Orchestration -----------------------------------------------------------
process_orgs(){
  local csv="${1:-}" rows=()

  if [[ -n "$csv" ]]; then
    echo -e "${BLUE}📄 Using CSV:${NC} $csv"
    mapfile -t rows < <(awk -F, 'NR==1 && $1 ~ /name/i {next} {print $1","$2","$3}' "$csv")
  else
    rows=("${builtin_orgs[@]}")
  fi

  local total=${#rows[@]}
  echo -e "${CYAN}📥 Processing ${total} logo(s)...${NC}"

  # Determine jobs
  local default_jobs
  default_jobs="$( (command -v nproc >/dev/null && nproc) || (sysctl -n hw.ncpu 2>/dev/null) || echo 4 )"
  local jobs_to_use="${JOBS:-$default_jobs}"
  [[ "$jobs_to_use" -lt 1 ]] && jobs_to_use=1

  # Progress pipe
  local fifo=""; local progress_pid=""
  if [[ "$NO_PROGRESS" == "false" && -t 1 ]]; then
    fifo="$(mktemp -u)"; mkfifo "$fifo"
    run_progress_loop "$fifo" "$total" &
    progress_pid=$!
  fi

  # Fan out using xargs -P; each child re-enters this script with a subcommand
  printf '%s\0' "${rows[@]}" | xargs -0 -n1 -P "$jobs_to_use" bash -c '
    set -euo pipefail
    SCRIPT="$0"; ROW="$1"; FORCE_STR="$2"; DRY_STR="$3"; FIFO="$4"
    exec "$SCRIPT" __process_one "$ROW" "$FORCE_STR" "$DRY_STR" "$FIFO"
  ' "$0"  _ "$( $FORCE && echo true || echo false )" "$( $DRY_RUN && echo true || echo false )" "${fifo:-/dev/null}"

  # Close progress + wait
  if [[ -n "${progress_pid:-}" ]]; then
    # Give the loop a nudge if something got lost
    for _ in $(seq 1 2); do [[ -p "$fifo" ]] && echo "1" >"$fifo" || true; done
    sleep 0.1
    kill "$progress_pid" 2>/dev/null || true
    rm -f "$fifo" || true
  fi

  # Post-pass summary by inspecting outputs (skip in dry-run)
  if [[ "$DRY_RUN" == "true" ]]; then
    echo -e "${BLUE}📊 Dry-run complete${NC}"
    return 0
  fi

  local ok=0 real=0 generic=0
  for row in "${rows[@]}"; do
    IFS=',' read -r name _ filename <<<"$row"
    [[ -n "${filename:-}" ]] || filename="$(slugify "$name").png"
    local out="$ORGANIZATIONS_DIR/$filename"
    if [[ -f "$out" ]]; then
      ((ok++))
      local sz; sz="$(stat -f%z "$out" 2>/dev/null || stat -c%s "$out" 2>/dev/null || echo 0)"
      if (( sz < 5000 )); then ((generic++)); else ((real++)); fi
    fi
  done

  echo -e "${BLUE}📊 Summary${NC}"
  echo "  Total: $total"
  echo "  Succeeded: $ok"
  echo "  Real logos (≥5KB): $real"
  echo "  Generic badges (<5KB): $generic"
}

# --- CLI & subcommand --------------------------------------------------------
main(){
  # Subcommand used by xargs children
  if [[ "${1:-}" == "__process_one" ]]; then
    shift
    row="$1"; force_str="$2"; dry_str="$3"; fifo="$4"
    $force_str && FORCE=true || FORCE=false
    $dry_str && DRY_RUN=true || DRY_RUN=false
    process_one_row_cmd "$row" "$( $FORCE && echo true || echo false )" "$( $DRY_RUN && echo true || echo false )" "$fifo"
    exit 0
  fi

  # Parse args
  while (( "$#" )); do
    case "$1" in
      --help|-h) show_help; exit 0;;
      --instructions|-i) show_instructions; exit 0;;
      --csv) CSV_FILE="${2:-}"; shift;;
      --force) FORCE=true;;
      --jobs|-j) JOBS="${2:-}"; shift;;
      --dry-run) DRY_RUN=true;;
      --no-progress) NO_PROGRESS=true;;
      *) echo -e "${RED}Unknown option:${NC} $1"; show_help; exit 1;;
    esac
    shift
  done

  check_dependencies
  if [[ -n "$CSV_FILE" && ! -f "$CSV_FILE" ]]; then
    echo -e "${RED}CSV not found:${NC} $CSV_FILE"; exit 1
  fi

  process_orgs "${CSV_FILE:-}"
}

main "$@"