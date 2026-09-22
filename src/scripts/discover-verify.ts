// ABOUTME: SSRF-guarded evidence verify helper for the discovery REVIEW pass. A tool-bearing review
// ABOUTME: agent (claude-code-action) calls this instead of curl/fetch directly, so every network hop
// ABOUTME: is forced through src/lib/ssrf-guard.ts (http(s)-only, per-hop DNS check, private/loopback/
// ABOUTME: link-local/169.254.169.254 metadata IPs blocked). Prints a JSON verdict: did the fetched
// ABOUTME: source contain BOTH the score and an attributable system-name token?
// ABOUTME: Usage: node dist/scripts/discover-verify.js <url> <scoreValue> <systemName>

import { safeFetchText, extractSearchableText } from "../lib/ssrf-guard.js";

function usage(): never {
  console.error("Usage: discover-verify <url> <scoreValue> <systemName>");
  process.exit(2);
}

const [, , url, scoreArg, systemName] = process.argv;
if (!url || !scoreArg || !systemName) usage();
const scoreValue = Number(scoreArg);

function longestToken(name: string): string {
  const toks = name.match(/[A-Za-z0-9]{3,}/g) ?? [];
  return toks.sort((a, b) => b.length - a.length)[0] ?? "";
}

async function main(): Promise<void> {
  const f = await safeFetchText(url, { timeoutMs: 15_000 });
  if (!f.ok) {
    console.log(JSON.stringify({ status: "unreachable", reason: f.reason }));
    return;
  }
  // Route PDF bodies through pdftotext; raw includes() over compressed PDF bytes false-negatives.
  const body = await extractSearchableText(f.bytes, f.contentType);
  if (body === null) {
    console.log(
      JSON.stringify({
        status: "pdf-unverifiable",
        reason: "source is a PDF and pdftotext is unavailable or failed",
        hasNum: false,
        hasName: false,
        fetchedBytes: f.bytes.length,
      })
    );
    return;
  }
  const num = Number.isFinite(scoreValue) ? String(scoreValue) : "";
  const token = longestToken(systemName);
  const name = systemName.toLowerCase().trim();
  const hasNum = num !== "" && body.includes(num);
  // Short names (e.g. "o3") yield no 3+ char token — require the FULL name to co-occur, else the
  // number may belong to another row in an unlabelled table (the audit's mis-attribution case).
  const hasName =
    token !== ""
      ? body.toLowerCase().includes(token.toLowerCase())
      : name !== "" && body.toLowerCase().includes(name);
  console.log(
    JSON.stringify({
      status: hasNum && hasName ? "verified" : "cooccurrence-miss",
      hasNum,
      hasName,
      fetchedBytes: f.bytes.length,
    })
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
