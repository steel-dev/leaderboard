#!/usr/bin/env bash
# Thin wrapper around the SSRF-guarded verify helper, invoked by the claude-code-action REVIEW agent
# INSTEAD of `node` directly. Rationale: .github/discovery-review-settings.json denies every interpreter
# (node, bun, deno, python, perl, ...) so the agent cannot run `node -e '<env dump>'` or `node /tmp/x.js`
# to exfiltrate ANTHROPIC_API_KEY. This wrapper is the ONE permitted way to fetch: it execs the
# committed, agent-unwritable discover-verify.js, which forces every hop through src/lib/ssrf-guard.ts.
#
# Usage: ./.github/discovery-verify.sh <url> <scoreValue> <systemName>
# This file is committed and outside the agent's Write allow-list (.discovery/reviewed/** only), so a
# prompt-injected source page cannot alter it.
set -euo pipefail

DIR="$(cd "$(dirname "$0")" && pwd)"
HELPER="$DIR/../dist/scripts/discover-verify.js"

if [ ! -f "$HELPER" ]; then
  echo '{"status":"unreachable","reason":"discover-verify.js not built (run pnpm exec tsc -p tsconfig.script.json)"}' >&2
  exit 3
fi

exec node "$HELPER" "$@"
