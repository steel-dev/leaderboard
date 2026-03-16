#!/usr/bin/env bash
# ABOUTME: Script to scrape paper and github pages for all benchmarks in the registry.
# ABOUTME: Saves markdown output into docs/research/<benchmark-slug>/ folders.

set -euo pipefail

DOCS_DIR="/Users/nikola/dev/steel/steel-leaderboard/docs/research"
MAX_PARALLEL=5
ACTIVE=0

mkdir -p "$DOCS_DIR"

scrape_url() {
  local dir="$1"
  local url="$2"
  local filename="$3"

  mkdir -p "$dir"
  echo "[SCRAPING] $url -> $dir/$filename"
  if steel scrape "$url" --format markdown > "$dir/$filename" 2>/dev/null; then
    echo "[OK] $dir/$filename"
  else
    echo "[FAIL] $url"
    echo "# Failed to scrape $url" > "$dir/$filename"
  fi
}

wait_for_slot() {
  while (( ACTIVE >= MAX_PARALLEL )); do
    wait -n 2>/dev/null || true
    (( ACTIVE-- )) || true
  done
}

# Each line: slug|paper_url|github_url_or_NULL
BENCHMARKS=(
  "webvoyager|https://arxiv.org/abs/2401.13919|https://github.com/MinorJerry/WebVoyager"
  "webarena|https://arxiv.org/abs/2307.13854|https://github.com/web-arena-x/webarena"
  "visualwebarena|https://arxiv.org/abs/2401.13649|https://github.com/web-arena-x/visualwebarena"
  "online-mind2web|https://arxiv.org/abs/2504.01382|https://github.com/OSU-NLP-Group/Mind2Web"
  "browsergym|https://arxiv.org/abs/2412.05467|https://github.com/ServiceNow/BrowserGym"
  "assistantbench|https://arxiv.org/abs/2407.15711|https://github.com/oriyor/assistantbench"
  "webchorearena|https://arxiv.org/abs/2506.03673|https://github.com/WebChoreArena/WebChoreArena"
  "workarena|https://arxiv.org/abs/2403.07718|https://github.com/ServiceNow/WorkArena"
  "webshop|https://arxiv.org/abs/2207.01206|https://github.com/princeton-nlp/WebShop"
  "webbench|https://arxiv.org/abs/2505.10798|https://github.com/halluminate/webbench"
  "browsecomp|https://openai.com/index/browsecomp/|NULL"
  "mmsearch-plus|https://arxiv.org/abs/2409.12202|https://github.com/CaraJ7/MMSearch"
  "osworld|https://arxiv.org/abs/2404.07972|https://github.com/xlang-ai/OSWorld"
  "osuniverse|https://arxiv.org/abs/2412.04747|https://github.com/agentsea/osuniverse"
  "macosworld|https://arxiv.org/abs/2501.12083|https://github.com/showlab/macosworld"
  "windows-agent-arena|https://arxiv.org/abs/2409.08264|https://github.com/microsoft/WindowsAgentArena"
  "androidworld|https://arxiv.org/abs/2405.14573|https://github.com/google-research/android_world"
  "mobile-env|https://arxiv.org/abs/2305.08144|https://github.com/X-LANCE/Mobile-Env"
  "swe-bench-verified|https://arxiv.org/abs/2310.06770|https://github.com/SWE-bench/SWE-bench"
  "swe-bench-lite|https://arxiv.org/abs/2310.06770|https://github.com/SWE-bench/SWE-bench"
  "terminal-bench-2-0|https://arxiv.org/abs/2506.05253|https://github.com/harbor-framework/terminal-bench-2"
  "mle-bench|https://arxiv.org/abs/2410.07095|https://github.com/openai/mle-bench"
  "scicode|https://arxiv.org/abs/2407.13168|https://github.com/scicode-bench/SciCode"
  "cve-bench|https://arxiv.org/abs/2503.17332|https://github.com/uiuc-kang-lab/cve-bench"
  "humaneval-plus|https://arxiv.org/abs/2305.01210|https://github.com/evalplus/evalplus"
  "aider-benchmark|https://aider.chat/docs/leaderboards/|https://github.com/Aider-AI/aider"
  "intercode|https://arxiv.org/abs/2306.14898|https://github.com/princeton-nlp/intercode"
  "repobench|https://arxiv.org/abs/2306.03091|https://github.com/Leolty/repobench"
  "toolbench|https://arxiv.org/abs/2307.16789|https://github.com/OpenBMB/ToolBench"
  "tau-bench|https://arxiv.org/abs/2406.12045|https://github.com/sierra-research/tau-bench"
  "api-bank|https://arxiv.org/abs/2304.08244|https://github.com/AlibabaResearch/DAMO-ConvAI/tree/main/api-bank"
  "gorilla-apibench|https://arxiv.org/abs/2305.15334|https://github.com/ShishirPatil/gorilla"
  "toolsandbox|https://arxiv.org/abs/2408.04682|https://github.com/apple/ToolSandbox"
  "mcp-atlas|https://github.com/scaleapi/mcp-atlas|https://github.com/scaleapi/mcp-atlas"
  "gaia|https://arxiv.org/abs/2311.12983|https://huggingface.co/datasets/gaia-benchmark/GAIA"
  "agentbench|https://arxiv.org/abs/2308.03688|https://github.com/THUDM/AgentBench"
  "humanitys-last-exam|https://arxiv.org/abs/2501.14249|NULL"
  "arc-agi-2|https://arcprize.org/arc-agi-2|https://github.com/arcprize/ARC-AGI-2"
  "gpqa-diamond|https://arxiv.org/abs/2311.12022|https://github.com/idavidrein/gpqa"
  "livebench|https://arxiv.org/abs/2406.19314|https://github.com/LiveBench/LiveBench"
  "simpleqa|https://openai.com/index/introducing-simpleqa/|https://github.com/openai/simple-evals"
  "agentboard|https://arxiv.org/abs/2401.13178|https://github.com/hkust-nlp/AgentBoard"
  "odysseybench|https://arxiv.org/abs/2406.08177|NULL"
  "appworld|https://arxiv.org/abs/2407.18901|https://github.com/stonybrooknlp/appworld"
  "sotopia|https://arxiv.org/abs/2310.11667|https://github.com/sotopia-lab/sotopia"
  "agentharm|https://arxiv.org/abs/2410.09024|https://github.com/AIEvals/AgentHarm"
  "medagentbench|https://arxiv.org/abs/2501.07765|https://github.com/stanfordmlgroup/MedAgentBench"
  "multiagentbench|https://arxiv.org/abs/2503.01935|https://github.com/ulab-uiuc/MARBLE"
  "fortress|https://arxiv.org/abs/2503.17388|NULL"
  "vending-bench|https://arxiv.org/abs/2410.03850|NULL"
  "charactereval|https://arxiv.org/abs/2401.01275|https://github.com/morecry/CharacterEval"
  "bullshit-benchmark|https://github.com/petergpt/bullshit-benchmark|https://github.com/petergpt/bullshit-benchmark"
)

TOTAL=${#BENCHMARKS[@]}
CURRENT=0

for entry in "${BENCHMARKS[@]}"; do
  IFS='|' read -r slug paper_url github_url <<< "$entry"
  (( CURRENT++ )) || true
  dir="$DOCS_DIR/$slug"

  echo ""
  echo "=== [$CURRENT/$TOTAL] $slug ==="

  # Scrape paper
  wait_for_slot
  scrape_url "$dir" "$paper_url" "paper.md" &
  (( ACTIVE++ )) || true

  # Scrape github if not NULL
  if [[ "$github_url" != "NULL" ]]; then
    wait_for_slot
    scrape_url "$dir" "$github_url" "github.md" &
    (( ACTIVE++ )) || true
  fi
done

# Wait for all remaining jobs
wait
echo ""
echo "=== DONE: Scraped $TOTAL benchmarks into $DOCS_DIR ==="
