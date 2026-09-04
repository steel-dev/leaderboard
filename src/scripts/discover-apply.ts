// ABOUTME: APPLY pass — the ONLY step that touches src/data, git, and gh. Fully deterministic:
// ABOUTME: no LLM. It reads each proposal (.discovery/proposals/<dataKey>-<week>.json), runs
// ABOUTME: hard gates (schema.json $defs/entry via Ajv, finite score, dedup), a freshness ROUTER
// ABOUTME: (future-dated -> reject; past-dated -> surfaced, capped Backfill tier instead of a silent
// ABOUTME: drop — a recurring sweep catches genuine misses from prior weeks), a deterministic
// ABOUTME: intra-proposal window-contradiction alarm, and a soft SSRF-guarded evidence re-fetch flag,
// ABOUTME: then STABLY re-ranks (existing rows keep relative order; new rows inserted by score;
// ABOUTME: per-board tie convention preserved), writes src/data + README, runs update-readme/lint/build,
// ABOUTME: and opens one PR per leaderboard with per-row reasoning for every add AND dismissal.
// ABOUTME: --dry-run (default) never touches src/data — it writes .discovery/apply/* for local
// ABOUTME: emulation. --write is the CI path. The judge LLM never ran git/gh; this script does.

import fs from "fs";
import path from "path";
import { execFileSync } from "node:child_process";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import { dataKeyForSlug, dataFileForDataKey, validateDiscoveryMap } from "../lib/discovery-map.js";
import { safeFetchText, extractSearchableText } from "../lib/ssrf-guard.js";

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, ".discovery");
const PROPOSALS_DIR = path.join(OUT_DIR, "proposals");
const REVIEWED_DIR = path.join(OUT_DIR, "reviewed"); // populated by the review pass (claude-code-action)
const APPLY_DIR = path.join(OUT_DIR, "apply");
const SCHEMA_PATH = path.join(ROOT, "src", "data", "schema.json");

interface Entry {
  rank: number;
  systemName: string;
  organization: string;
  scoreDisplay: string;
  scoreValue: number | null;
  sourceUrl: string;
  repoUrl?: string;
  notesShort: string;
  reportedAt?: string;
  isNew?: boolean;
}

interface ProposalAdd {
  entry: Omit<Entry, "rank">;
  reasoning: string;
  evidenceTier: string;
  quotedEvidence: string;
}
interface ProposalDismissal {
  candidateSystemName?: string;
  scoreDisplay?: string;
  sourceUrl?: string;
  reasoning: string;
  category: string;
}
interface Proposal {
  schemaVersion: number;
  sweepWeek: string;
  sinceDate: string;
  judgedAt: string;
  model: string;
  slug: string;
  dataKey: string;
  summary: string;
  adds: ProposalAdd[];
  dismissals: ProposalDismissal[];
  coverageNote: string;
  review?: Review; // present only when the final-review pass (claude-code-action) annotated this proposal
}

// The final-review pass writes a top-level `review` object onto the proposal. Its `adds` are
// ANNOTATIONS keyed by systemName — the original adds/dismissals stay intact. apply consumes them:
// notesShortFix is adopted into the written row; recommend-dismiss pulls an add out of the candidate
// set into a surfaced (listed, not written) review-dismissal; keep / needs-attribution-fix surface in
// the PR body so the human sees the LLM final pass. OPTIONAL — a raw judge proposal has no review.
interface ReviewAnnotation {
  systemName: string;
  reviewAction: "keep" | "needs-attribution-fix" | "recommend-dismiss";
  reviewReason: string;
  notesShortFix?: string;
}
interface Review {
  reviewedAt: string;
  reviewerModel: string;
  diff?: string;
  windowInconsistent?: boolean;
  adds: ReviewAnnotation[];
}

type VerifyFlag =
  | { status: "verified" }
  | { status: "cooccurrence-miss"; detail: string }
  | { status: "unreachable"; detail: string }
  | { status: "pdf-unverifiable"; detail: string }
  | { status: "skipped" };

interface SurvivingAdd {
  add: ProposalAdd;
  verify: VerifyFlag;
  tier: "fresh" | "backfill";
}
interface RejectedAdd {
  add: ProposalAdd;
  reason: string;
}
// Backfill flood bounds: a per-board cap and a per-sweep global cap stop a false-quiet / wide sweep
// from dumping a wall of stale rows on a reviewer. Overflow is DEMOTED to a visible (listed, not
// written) dismissal — never silently dropped.
interface BackfillOverflow {
  add: ProposalAdd;
  reason: string;
}
const BACKFILL_PER_BOARD = 3;
const BACKFILL_GLOBAL = 15;

function parseArgs(): {
  write: boolean;
  slugs: Set<string> | null;
  week: string | null;
  noFetch: boolean;
} {
  const args = process.argv.slice(2);
  let write = false;
  let slugs: Set<string> | null = null;
  let week: string | null = null;
  let noFetch = false;
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--write") write = true;
    else if (a === "--dry-run") write = false;
    else if (a === "--slug" && args[i + 1]) slugs = new Set(args[++i].split(","));
    else if (a === "--week" && args[i + 1]) week = args[++i];
    else if (a === "--no-fetch") noFetch = true;
  }
  return { write, slugs, week, noFetch };
}

// ---- sanitization: strip anything that could break a code fence, inject a link, or carry HTML ----
function sanitizeText(s: string, max = 300): string {
  return (
    s
      .replace(/`/g, "'")
      .replace(/\[([^\]]+)\]\([^)]*\)/gi, "$1") // markdown link -> label only
      .replace(/<\/?[a-z][^>]*>/gi, "") // HTML tags
      .replace(/[<>]/g, "") // strip ANY remaining angle bracket — defeats unclosed-tag XSS (e.g.
      // "<img src=x onerror=...>" with no closing '>'), so no entry-derived text reaching a set:html
      // sink (notably the FAQ's top-ranked systemName) can ever form a tag. Entry text never legitimately
      // contains < or >, so this is safe.
      .replace(/\|/g, "/") // pipes break markdown tables (raw table rows e.g. "| 74.1 | 83.7 |") -> slash
      .replace(/\p{Extended_Pictographic}/gu, "") // emoji / pictographs
      .replace(/./gs, (ch) =>
        (ch.codePointAt(0) ?? 0x20) < 0x20 || ch === String.fromCharCode(127) ? "" : ch
      ) // drop C0 controls + DEL by code point
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, max)
  );
}
function sanitizeEntry(entry: Omit<Entry, "rank">): Omit<Entry, "rank"> {
  return {
    systemName: sanitizeText(entry.systemName, 120),
    organization: sanitizeText(entry.organization, 120),
    scoreDisplay: sanitizeText(entry.scoreDisplay, 40),
    scoreValue: entry.scoreValue,
    sourceUrl: entry.sourceUrl.trim(),
    repoUrl: entry.repoUrl?.trim() || undefined,
    notesShort: sanitizeText(entry.notesShort, 280),
    reportedAt: entry.reportedAt?.trim() || undefined,
    isNew: true,
  };
}

// ---- stable re-rank: existing rows keep EXACT relative order; new rows inserted by score ----

// Tie handling is a PER-FILE convention, not a global constant: sweBenchVerified uses
// competition ranks (tied scores share a rank, the next rank skips), while browsecomp,
// osworld, tauBench and most other boards use strictly sequential 1..N. Detect the
// convention from the board's own history so a pipeline PR never flips it: a tie group
// sharing one rank proves competition; a tie group split across ranks proves sequential.
// With no tied scores the convention is unobservable — either choice yields the same
// numbers for the existing rows — so we default to sequential (the majority convention)
// and the PR body names the detected convention for the human to confirm.
type RankConvention = "competition" | "sequential";
function detectRankConvention(existing: Entry[]): RankConvention {
  for (let i = 1; i < existing.length; i++) {
    const a = existing[i - 1];
    const b = existing[i];
    if (a.scoreValue == null || b.scoreValue == null || a.scoreValue !== b.scoreValue) continue;
    return b.rank === a.rank ? "competition" : "sequential";
  }
  return "sequential";
}

function rankInsert(
  existing: Entry[],
  adds: Omit<Entry, "rank">[],
  convention: RankConvention
): Entry[] {
  const result: Entry[] = existing.map((e) => ({ ...e }));
  for (const add of adds) {
    const sv = add.scoreValue;
    let idx = result.length;
    for (let i = 0; i < result.length; i++) {
      const cur = result[i].scoreValue;
      if (cur == null) {
        idx = i;
        break;
      } // null-scored rows sit at the bottom; insert before them
      if (sv != null && cur < sv) {
        idx = i;
        break;
      } // first strictly-lower row -> insert here (strict < keeps ties above the new row)
    }
    // rank is assigned for every row by assignRanks immediately below.
    result.splice(idx, 0, { ...add } as Entry);
  }
  assignRanks(result, convention);
  return result;
}
function assignRanks(rows: Entry[], convention: RankConvention): void {
  let prev: number | null = null;
  for (let i = 0; i < rows.length; i++) {
    const sv = rows[i].scoreValue;
    rows[i].rank = convention === "sequential" || i === 0 || sv !== prev ? i + 1 : rows[i - 1].rank;
    prev = sv;
  }
}

function normalizeDate(d: string): string {
  return d.length === 7 ? `${d}-01` : d; // YYYY-MM -> YYYY-MM-01
}
// Freshness is a ROUTER, not a publication-correctness gate. A genuine, missing, verbatim-confirmed
// result is valuable even when it predates the lookback window — a recurring sweep is exactly how we
// catch things missed last week. So: future-dated rows are incoherent (hard-reject); past-dated rows
// are routed to a SURFACED backfill tier (capped, flagged) instead of being silently dropped.
type Freshness =
  | { kind: "in-window" }
  | { kind: "past"; reason: string } // reportedAt < sinceDate -> backfill candidate
  | { kind: "future"; reason: string } // reportedAt > today -> genuinely incoherent, hard-reject
  | { kind: "missing"; reason: string }
  | { kind: "bad"; reason: string };
function classifyFreshness(d: string | undefined, sinceDate: string, today: string): Freshness {
  if (!d) return { kind: "missing", reason: "reportedAt missing" };
  const day = normalizeDate(d);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day))
    return { kind: "bad", reason: `reportedAt "${d}" not a date` };
  if (day > today) return { kind: "future", reason: `reportedAt ${d} in the future` };
  if (day < sinceDate)
    return { kind: "past", reason: `reportedAt ${d} before window ${sinceDate}` };
  return { kind: "in-window" };
}

function normKey(name: string, score: number | null): string {
  return `${name.toLowerCase().replace(/\s+/g, " ").trim()}::${score ?? "null"}`;
}

function longestToken(name: string): string {
  const toks = name.match(/[A-Za-z0-9]{3,}/g) ?? [];
  return toks.sort((a, b) => b.length - a.length)[0] ?? "";
}

async function softVerify(entry: Omit<Entry, "rank">, noFetch: boolean): Promise<VerifyFlag> {
  if (noFetch) return { status: "skipped" };
  const f = await safeFetchText(entry.sourceUrl, { timeoutMs: 12_000 });
  if (!f.ok) return { status: "unreachable", detail: f.reason };
  // Route PDF bodies through pdftotext; raw includes() over compressed PDF bytes false-negatives
  // (a PDF source can genuinely contain score+name yet report hasName:false -> wrong dismissal).
  const body = await extractSearchableText(f.bytes, f.contentType);
  if (body === null)
    return {
      status: "pdf-unverifiable",
      detail: "PDF source; pdftotext unavailable or failed — text not extracted",
    };
  const num = entry.scoreValue != null ? String(entry.scoreValue) : "";
  const token = longestToken(entry.systemName);
  const hasNum = num !== "" && body.includes(num);
  // Short system names (e.g. "o3") yield no 3+ char token — longestToken returns "". Do NOT pass
  // attribution trivially in that case: require the FULL systemName to co-occur with the score, else
  // flag a co-occurrence miss (the number may belong to a different row in an unlabelled table).
  const name = entry.systemName.toLowerCase().trim();
  const hasName =
    token !== ""
      ? body.toLowerCase().includes(token.toLowerCase())
      : name !== "" && body.toLowerCase().includes(name);
  if (hasNum && hasName) return { status: "verified" };
  return {
    status: "cooccurrence-miss",
    detail: `fetched body did not contain both score "${num}" and system token "${token}"`,
  };
}

function verifyEmoji(v: VerifyFlag): string {
  switch (v.status) {
    case "verified":
      return "✅ verified at source";
    case "cooccurrence-miss":
      return `⚠️ co-occurrence miss — ${v.detail}`;
    case "pdf-unverifiable":
      return `⚠️ pdf-unverifiable — ${v.detail}`;
    case "unreachable":
      return `⚠️ unreachable — ${v.detail}`;
    case "skipped":
      return "— (fetch skipped)";
  }
}

// ---- PR body ----
function renderAdd(s: SurvivingAdd): string[] {
  const e = s.add.entry;
  return [
    `- **${e.systemName}** — ${e.scoreDisplay} (${e.organization}) — [source](${e.sourceUrl})`,
    `  - ${verifyEmoji(s.verify)} · tier: \`${s.add.evidenceTier}\``,
    `  - _Reasoning:_ ${sanitizeText(s.add.reasoning, 400)}`,
    `  - _Verbatim:_ "${sanitizeText(s.add.quotedEvidence, 240)}"`,
    `  - _notesShort:_ ${e.notesShort}`,
  ];
}

function renderPrBody(
  p: Proposal,
  survivors: SurvivingAdd[],
  overflow: BackfillOverflow[],
  rejected: RejectedAdd[],
  reviewDismissed: { add: ProposalAdd; reason: string }[],
  meta: {
    dryRun: boolean;
    inconsistent: boolean;
    topThreeRisk: string[];
    addSetHash: string;
    rankConvention: RankConvention;
  }
): string {
  const fresh = survivors.filter((s) => s.tier === "fresh");
  const backfill = survivors.filter((s) => s.tier === "backfill");
  const lines: string[] = [];
  // Every LLM-derived string interpolated into the PR body is run through sanitizeText: it maps
  // backticks -> apostrophe (so no field can close a ```json fence or break inline `code`) and strips
  // <> (so no HTML reaches the merge-gate PR body). Deterministic fields (counts, the fixed banner
  // text) are interpolated as-is.
  const slug = sanitizeText(p.slug, 120);
  const week = sanitizeText(p.sweepWeek, 20);
  const model = sanitizeText(p.model, 60);
  lines.push(`### Discovery proposal — \`${slug}\` — week ${week}`);
  lines.push("");
  lines.push(`_${sanitizeText(p.summary, 400)}_`);
  lines.push("");
  lines.push(
    `> Generated by the discovery pipeline (model \`${model}\`). A human must review and **merge**; auto-merge is off. The judge LLM never touched git — a deterministic apply step validated, re-ranked, and opened this PR.`
  );
  lines.push("");

  if (p.review) {
    const verdicts = p.review.adds.filter((a) => a.reviewAction !== "keep");
    const suffix =
      verdicts.length > 0
        ? ` Downgraded/fixed ${verdicts.length} add(s): see verdicts below.`
        : " All adds kept.";
    // The diff text carries its own trailing punctuation — strip it so we emit a single period.
    const diffClean = p.review.diff ? sanitizeText(p.review.diff, 400).replace(/[.\s]+$/, "") : "";
    const hdr = diffClean ? ` — ${diffClean}` : "";
    const reviewer = sanitizeText(p.review.reviewerModel || "claude-code", 60);
    lines.push(`> 🤖 Reviewed by \`${reviewer}\` (final pass)${hdr}.${suffix}`);
    lines.push("");
  }

  if (meta.inconsistent) {
    lines.push(
      "> ⚠️ **WINDOW-INCONSISTENCY** — the judge admitted a pre-window row as a backfill AND dismissed another row as out-of-window in the same proposal (it applied two different windows). Verify every date by hand before merging."
    );
    lines.push("");
  }
  if (meta.topThreeRisk.length > 0) {
    lines.push(
      `> ⚠️ **Backfill in top-3** — ${meta.topThreeRisk.join(
        ", "
      )} is a pre-window (backfill) row now sitting in ranks 1–3. Confirm it is real and not a self-reported/mis-tiered score before merging.`
    );
    lines.push("");
  }

  lines.push(`#### ➕ Fresh adds (${fresh.length})`);
  if (fresh.length === 0) lines.push("_None._");
  for (const s of fresh) lines.push(...renderAdd(s));
  lines.push("");

  lines.push(`#### 🕘 Backfill adds (${backfill.length}) — pre-window, surfaced for catch-up`);
  if (backfill.length === 0) {
    lines.push("_None._");
  } else {
    lines.push(
      "_These predate the lookback window but are not on the leaderboard. A recurring sweep surfaces things we missed — review and merge if genuine._"
    );
  }
  for (const s of backfill) lines.push(...renderAdd(s));
  lines.push("");

  if (overflow.length > 0) {
    lines.push(`#### 🪣 Backfill overflow — listed, NOT written (${overflow.length})`);
    for (const o of overflow) {
      lines.push(
        `- **${sanitizeText(o.add.entry.systemName, 120)}** — ${sanitizeText(o.add.entry.scoreDisplay, 40)}: ${o.reason}`
      );
    }
    lines.push("");
  }

  lines.push(`#### ➖ Dismissals (${p.dismissals.length})`);
  if (p.dismissals.length === 0) lines.push("_None._");
  for (const d of p.dismissals) {
    lines.push(
      `- **${sanitizeText(d.candidateSystemName ?? "?", 120)}**${d.scoreDisplay ? ` — ${sanitizeText(d.scoreDisplay, 40)}` : ""} — [\`${sanitizeText(d.category, 40)}\`] ${sanitizeText(d.reasoning, 300)}`
    );
  }
  lines.push("");

  if (rejected.length > 0) {
    lines.push(`#### ⛔ Rejected by apply hard-gates (${rejected.length})`);
    for (const r of rejected) {
      lines.push(
        `- **${sanitizeText(r.add.entry.systemName, 120)}** — ${sanitizeText(r.add.entry.scoreDisplay, 40)}: ${r.reason}`
      );
    }
    lines.push("");
  }

  if (p.review) {
    const verdicts = p.review.adds.filter((a) => a.reviewAction !== "keep");
    if (verdicts.length > 0) {
      lines.push(`#### 🤖 Review-pass verdicts (${verdicts.length})`);
      for (const v of verdicts) {
        lines.push(
          `- **${sanitizeText(v.systemName, 120)}** — [\`${sanitizeText(v.reviewAction, 40)}\`] ${sanitizeText(v.reviewReason, 300)}${v.notesShortFix ? ` · _notesShort fixed to:_ ${sanitizeText(v.notesShortFix, 280)}` : ""}`
        );
      }
      lines.push("");
    }
  }

  if (reviewDismissed.length > 0) {
    lines.push(`#### 🚫 Review-pass dismissals — listed, NOT written (${reviewDismissed.length})`);
    for (const r of reviewDismissed) {
      lines.push(
        `- **${sanitizeText(r.add.entry.systemName, 120)}** — ${sanitizeText(r.add.entry.scoreDisplay, 40)}: ${r.reason}`
      );
    }
    lines.push("");
  }

  lines.push("#### Reviewer checklist");
  lines.push("- [ ] Each add's `sourceUrl` opens and contains the exact score.");
  lines.push(
    `- [ ] Ranks are correct (${meta.rankConvention} ranking${
      meta.rankConvention === "competition" ? "; ties share a rank" : "; strictly 1..N"
    }) and match the board's pre-PR convention.`
  );
  lines.push("- [ ] Backfill rows' dates are acceptable (they predate the window by design).");
  lines.push("- [ ] `notesShort` states setup + any self-report / subset caveat.");
  lines.push(
    "- [ ] Bump `lastUpdated` for this benchmark in `src/lib/benchmark-hub.ts` (human step)."
  );
  lines.push("");

  // Sanitized projection of the proposal into the audit block. We do NOT spread raw `...p`: judge
  // text (reasoning/quotedEvidence/summary) and review annotations (notesShortFix/reviewReason) are
  // LLM-controlled and would be dumped verbatim between ```json fences — a field containing a backtick
  // could close the fence early and inject markdown/HTML into the merge-gate PR body. sanitizeText maps
  // backticks -> apostrophe and strips <>, so no sanitized field can break the fence or carry HTML.
  const audit = {
    schemaVersion: p.schemaVersion,
    sweepWeek: p.sweepWeek,
    sinceDate: p.sinceDate,
    judgedAt: p.judgedAt,
    model: p.model,
    slug: sanitizeText(p.slug, 120),
    dataKey: p.dataKey,
    summary: sanitizeText(p.summary, 400),
    coverageNote: sanitizeText(p.coverageNote, 400),
    adds: p.adds.map((a) => ({
      entry: {
        systemName: sanitizeText(a.entry.systemName, 120),
        organization: sanitizeText(a.entry.organization, 120),
        scoreDisplay: sanitizeText(a.entry.scoreDisplay, 40),
        scoreValue: a.entry.scoreValue,
        sourceUrl: a.entry.sourceUrl,
        notesShort: sanitizeText(a.entry.notesShort, 280),
        reportedAt: a.entry.reportedAt,
      },
      reasoning: sanitizeText(a.reasoning, 400),
      quotedEvidence: sanitizeText(a.quotedEvidence, 240),
      evidenceTier: a.evidenceTier,
    })),
    dismissals: p.dismissals.map((d) => ({
      candidateSystemName: sanitizeText(d.candidateSystemName ?? "", 120),
      scoreDisplay: sanitizeText(d.scoreDisplay ?? "", 40),
      sourceUrl: d.sourceUrl,
      reasoning: sanitizeText(d.reasoning, 300),
      category: d.category,
    })),
    review: p.review
      ? {
          reviewedAt: p.review.reviewedAt,
          reviewerModel: sanitizeText(p.review.reviewerModel, 60),
          diff: sanitizeText(p.review.diff ?? "", 400),
          windowInconsistent: p.review.windowInconsistent,
          adds: p.review.adds.map((ra) => ({
            systemName: sanitizeText(ra.systemName, 120),
            reviewAction: ra.reviewAction,
            reviewReason: sanitizeText(ra.reviewReason, 300),
            notesShortFix: ra.notesShortFix ? sanitizeText(ra.notesShortFix, 280) : undefined,
          })),
        }
      : undefined,
    addSetHash: meta.addSetHash,
    windowInconsistent: meta.inconsistent,
    topThreeRisk: meta.topThreeRisk,
    appliedAdds: survivors.map((s) => ({
      tier: s.tier,
      entry: { ...s.add.entry, isNew: true },
      verify: s.verify.status,
    })),
    backfillOverflow: overflow.map((o) => ({
      systemName: o.add.entry.systemName,
      reason: o.reason,
    })),
    rejectedByApply: rejected.map((r) => ({
      systemName: r.add.entry.systemName,
      reason: r.reason,
    })),
  };
  lines.push("<details><summary>Audit (proposal + apply decisions)</summary>");
  lines.push("");
  lines.push("```json");
  lines.push(JSON.stringify(audit, null, 2));
  lines.push("```");
  lines.push("");
  lines.push("</details>");
  if (meta.dryRun) lines.push("\n_DRY-RUN preview — no src/data write, no PR opened._");
  return lines.join("\n");
}

function run(cmd: string, args: string[], label: string): void {
  try {
    execFileSync(cmd, args, { stdio: "inherit", cwd: ROOT });
  } catch {
    throw new Error(`${label} failed`);
  }
}

function loadProposals(slugs: Set<string> | null, week: string | null): Proposal[] {
  // Merge raw proposals (.discovery/proposals/) with reviewed ones (.discovery/reviewed/), preferring
  // the REVIEWED file PER board when present. This way a board the review pass skipped (or a local run
  // with no review stage at all) still applies from its raw proposal — we never silently drop a board
  // just because the review pass only covered some of them.
  const byName = new Map<string, Proposal>();
  let reviewed = 0;
  let raw = 0;
  for (const dir of [REVIEWED_DIR, PROPOSALS_DIR]) {
    const isReviewed = dir === REVIEWED_DIR;
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
    for (const f of files) {
      let p: Proposal;
      try {
        p = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) as Proposal;
      } catch {
        console.warn(`  SKIP unparsable proposal ${f}`);
        continue;
      }
      if (slugs && !slugs.has(p.slug)) continue;
      if (week && p.sweepWeek !== week) continue;
      if (byName.has(f)) continue; // a higher-priority (reviewed) version already loaded
      byName.set(f, p);
      if (isReviewed) reviewed++;
      else raw++;
    }
  }
  if (reviewed > 0) console.log(`Loading ${reviewed} reviewed + ${raw} raw proposal(s).`);
  else console.log(`No reviewed proposals — loading ${raw} raw judge proposal(s).`);
  return [...byName.values()];
}

// Deterministic intra-proposal contradiction alarm. The audit found the judge admitting pre-window
// rows ("06-02 ... inside the lookback window") while dismissing other pre-window dates as
// out-of-window — an internal contradiction the LLM failed to catch in itself, that a deterministic
// freshness gate caught. Now that past-dated rows ROUTE to a backfill tier (not hard-reject), we keep
// the catch as a code property: any admitted backfill alongside an out-of-window dismissal means the
// judge applied two different windows in one proposal. Surfaced as a banner the human clears.
function windowInconsistency(hasBackfill: boolean, dismissals: ProposalDismissal[]): string | null {
  if (!hasBackfill) return null;
  if (!dismissals.some((d) => d.category === "out-of-window")) return null;
  return (
    "WINDOW-INCONSISTENCY: this proposal ADMITTED a pre-window row as a backfill AND DISMISSED at least " +
    "one row as out-of-window. The judge applied two different windows — verify every date by hand."
  );
}

// A stable hash of the add-set (org + score + sourceUrl + reportedAt, sorted) so a re-run can tell
// whether the SAME proposal already produced a PR — idempotency on content, not just the branch name.
function addSetHash(adds: ProposalAdd[]): string {
  const parts = adds
    .map((a) =>
      [a.entry.organization, a.entry.scoreValue, a.entry.sourceUrl, a.entry.reportedAt ?? ""]
        .map((x) => String(x ?? ""))
        .join("|")
    )
    .sort();
  const s = parts.join(";;"); // djb2 — short, stable, no deps
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = (h * 33) ^ s.charCodeAt(i);
  return (h >>> 0).toString(16);
}

async function processProposal(
  p: Proposal,
  validateEntry: (d: unknown) => boolean,
  validateFile: (d: unknown) => boolean,
  today: string,
  opts: { write: boolean; noFetch: boolean },
  backfillBudget: { remaining: number }
): Promise<{
  prOpened: boolean;
  survivors: number;
  dismissals: number;
  rejected: number;
  backfill?: number;
  overflow?: number;
  windowInconsistent?: boolean;
}> {
  const { slug, sweepWeek, sinceDate, dataKey: statedDataKey } = p;
  const dataKey = dataKeyForSlug(slug);
  if (!dataKey) {
    console.error(`  ✗ ${slug}: no dataKey mapping — skipping.`);
    return { prOpened: false, survivors: 0, dismissals: p.dismissals.length, rejected: 0 };
  }
  if (statedDataKey && statedDataKey !== dataKey) {
    console.error(
      `  ✗ ${slug}: proposal dataKey "${statedDataKey}" !== derived "${dataKey}" — skipping (possible injection).`
    );
    return { prOpened: false, survivors: 0, dismissals: p.dismissals.length, rejected: 0 };
  }

  const filePath = dataFileForDataKey(dataKey);
  const fileRaw = fs.readFileSync(filePath, "utf8");
  const fileJson = JSON.parse(fileRaw) as Record<string, Entry[]>;
  const existing = fileJson[dataKey] ?? [];
  if (!Array.isArray(existing)) {
    console.error(`  ✗ ${slug}: ${filePath} is not an array under "${dataKey}".`);
    return { prOpened: false, survivors: 0, dismissals: p.dismissals.length, rejected: 0 };
  }

  // Apply the final-review overlay FIRST (when present). The review pass may (a) FIX an add's
  // notesShort (self-report caveat, attribution wording) — we adopt the fix BEFORE gating so the
  // written row + PR body carry it; (b) RECOMMEND-DISMISS an add — honored by pulling it out of the
  // candidate set into a surfaced (listed, not written) review-dismissal; (c) FLAG attribution. keep
  // is a no-op. Optional — a raw judge proposal (p.review undefined) gates unchanged.
  const reviewMap = new Map<string, ReviewAnnotation>(
    (p.review?.adds ?? []).map((a) => [a.systemName, a])
  );
  const reviewDismissed: { add: ProposalAdd; reason: string }[] = [];
  const addsToGate: ProposalAdd[] = [];
  for (const original of p.adds) {
    const ra = reviewMap.get(original.entry.systemName);
    if (ra?.reviewAction === "recommend-dismiss") {
      reviewDismissed.push({ add: original, reason: `review: ${ra.reviewReason}` });
      continue;
    }
    addsToGate.push(
      ra?.notesShortFix
        ? { ...original, entry: { ...original.entry, notesShort: ra.notesShortFix } }
        : original
    );
  }

  // Hard gates per add. Survivors are collected as `pending` (with their freshness tier); the tier is
  // resolved into fresh vs backfill AFTER the loop so caps apply across the whole proposal.
  const pending: SurvivingAdd[] = [];
  const rejected: RejectedAdd[] = [];
  const existingKeys = new Set(existing.map((e) => normKey(e.systemName, e.scoreValue)));
  for (const add of addsToGate) {
    const entry = sanitizeEntry(add.entry);
    const probe = { rank: 1, ...entry }; // validate entry shape with a placeholder rank
    if (!validateEntry(probe)) {
      rejected.push({ add, reason: `schema validation failed (see build)` });
      continue;
    }
    try {
      const u = new URL(entry.sourceUrl);
      if (u.protocol !== "http:" && u.protocol !== "https:") {
        rejected.push({ add, reason: `sourceUrl scheme ${u.protocol} not http(s)` });
        continue;
      }
    } catch {
      rejected.push({ add, reason: "sourceUrl is not a valid URL" });
      continue;
    }
    if (entry.scoreValue == null || !Number.isFinite(entry.scoreValue) || entry.scoreValue < 0) {
      rejected.push({ add, reason: "scoreValue not a finite number >= 0" });
      continue;
    }
    if (existingKeys.has(normKey(entry.systemName, entry.scoreValue))) {
      rejected.push({ add, reason: "duplicate of an existing row (systemName + scoreValue)" });
      continue;
    }
    // Freshness ROUTES rather than hard-rejects: a future date is genuinely incoherent (reject), but a
    // past date is a genuine miss -> backfill tier (surfaced, not dropped). Missing/malformed still rejects.
    const fr = classifyFreshness(entry.reportedAt, sinceDate, today);
    if (fr.kind === "missing" || fr.kind === "bad" || fr.kind === "future") {
      rejected.push({ add, reason: `freshness: ${fr.reason}` });
      continue;
    }
    const tier: "fresh" | "backfill" = fr.kind === "past" ? "backfill" : "fresh";
    const verify = await softVerify(entry, opts.noFetch);
    pending.push({ add: { ...add, entry }, verify, tier });
    existingKeys.add(normKey(entry.systemName, entry.scoreValue)); // dedup among adds too
  }

  // Split by freshness tier and bound the backfill flood. Fresh adds are in-window; backfills are
  // genuine pre-window misses we still surface. Keep the highest-scoring backfills first, up to the
  // per-board cap AND the shared per-sweep global budget; the rest are demoted to a visible overflow
  // (listed in the PR body for awareness, never silently dropped).
  const fresh = pending.filter((s) => s.tier === "fresh");
  const backfillAll = pending
    .filter((s) => s.tier === "backfill")
    .sort((a, b) => (b.add.entry.scoreValue ?? -1) - (a.add.entry.scoreValue ?? -1));
  const boardBudget = Math.max(0, Math.min(BACKFILL_PER_BOARD, backfillBudget.remaining));
  const backfill = backfillAll.slice(0, boardBudget);
  backfillBudget.remaining -= backfill.length;
  const overflow: BackfillOverflow[] = backfillAll.slice(boardBudget).map((a) => ({
    add: a.add,
    reason: `backfill overflow — per-board ${BACKFILL_PER_BOARD} / per-sweep ${BACKFILL_GLOBAL} cap reached; listed for awareness, not written`,
  }));
  const survivors = [...fresh, ...backfill];

  // The audit's catch, preserved as a code property (now that past dates route instead of hard-reject).
  // Also honor the review pass's own windowInconsistent flag — it may catch one the heuristic missed.
  const inconsistent =
    windowInconsistency(backfill.length > 0, p.dismissals) !== null ||
    p.review?.windowInconsistent === true;

  if (survivors.length === 0) {
    console.log(
      `  · ${slug}: 0 surviving add(s) (${p.adds.length} proposed, ${reviewDismissed.length} review-dismissed, ${rejected.length} rejected, ${overflow.length} backfill-overflow, ${p.dismissals.length} dismissed) — no PR.`
    );
    return {
      prOpened: false,
      survivors: 0,
      backfill: 0,
      overflow: overflow.length,
      dismissals: p.dismissals.length,
      rejected: rejected.length,
      windowInconsistent: inconsistent,
    };
  }

  const newEntries = survivors.map((s) => ({ ...s.add.entry, isNew: true }));
  const rankConvention = detectRankConvention(existing);
  const ranked = rankInsert(existing, newEntries, rankConvention);
  const newFileObj = { [dataKey]: ranked };

  // A backfill that captured a top-3 rank is exactly the audit's self-reported-top-tie concern: flag it
  // loudly. We do NOT distort the rank (a real, verified score earns its true position) — we surface it.
  const backfillKeys = new Set(
    backfill.map((b) => normKey(b.add.entry.systemName, b.add.entry.scoreValue))
  );
  const topThreeRisk = ranked
    .slice(0, 3)
    .filter((r) => backfillKeys.has(normKey(r.systemName, r.scoreValue)))
    .map((r) => `${r.systemName} (${r.scoreDisplay})`);

  // Defense: the re-ranked file must validate against schema.json.
  if (!validateFile(newFileObj)) {
    console.error(
      `  ✗ ${slug}: re-ranked file failed schema.json validation — NOT writing. (Inspect .discovery/apply/${dataKey}-${sweepWeek}.json.)`
    );
    fs.mkdirSync(APPLY_DIR, { recursive: true });
    fs.writeFileSync(
      path.join(APPLY_DIR, `${dataKey}-${sweepWeek}.json`),
      JSON.stringify(newFileObj, null, 2) + "\n"
    );
    return {
      prOpened: false,
      survivors: survivors.length,
      backfill: backfill.length,
      overflow: overflow.length,
      dismissals: p.dismissals.length,
      rejected: rejected.length,
      windowInconsistent: inconsistent,
    };
  }

  const body = renderPrBody(p, survivors, overflow, rejected, reviewDismissed, {
    dryRun: !opts.write,
    inconsistent,
    topThreeRisk,
    addSetHash: addSetHash(p.adds),
    rankConvention,
  });
  fs.mkdirSync(APPLY_DIR, { recursive: true });
  fs.writeFileSync(
    path.join(APPLY_DIR, `${dataKey}-${sweepWeek}.json`),
    JSON.stringify(newFileObj, null, 2) + "\n"
  );
  fs.writeFileSync(path.join(APPLY_DIR, `${dataKey}-${sweepWeek}.md`), body + "\n");
  console.log(
    `  ✓ ${slug}: ${fresh.length} fresh + ${backfill.length} backfill (${overflow.length} overflow, ${reviewDismissed.length} review-dismissed, ${rejected.length} rejected, ${p.dismissals.length} dismissed) -> .discovery/apply/${dataKey}-${sweepWeek}.{json,md}`
  );

  if (!opts.write) {
    return {
      prOpened: false,
      survivors: survivors.length,
      backfill: backfill.length,
      overflow: overflow.length,
      dismissals: p.dismissals.length,
      rejected: rejected.length,
      windowInconsistent: inconsistent,
    };
  }

  // ---- --write (CI): write src/data, build, branch, PR. Restore on any failure. ----
  const branch = `discovery/${dataKey}-${sweepWeek}`;
  // Idempotency: skip if a PR for this branch is already open.
  try {
    const open = execFileSync(
      "gh",
      ["pr", "list", "--head", branch, "--state", "open", "--json", "number"],
      {
        cwd: ROOT,
        encoding: "utf8",
      }
    ).trim();
    if (open !== "[]") {
      console.log(`  · ${slug}: open PR on ${branch} already exists — skipping.`);
      return {
        prOpened: false,
        survivors: survivors.length,
        dismissals: p.dismissals.length,
        rejected: rejected.length,
      };
    }
  } catch {
    console.warn(
      `  ! ${slug}: could not check existing PRs for ${branch} (gh absent?) — proceeding.`
    );
  }

  fs.writeFileSync(filePath, JSON.stringify(newFileObj, null, 2) + "\n");
  try {
    run("pnpm", ["run", "update-readme"], "update-readme");
    run("pnpm", ["run", "lint"], "lint");
    run("pnpm", ["run", "build"], "build");
    // Assert the write surface is exactly {src/data/<file>, README.md}.
    const changed = execFileSync("git", ["diff", "--name-only"], { cwd: ROOT, encoding: "utf8" })
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const expected = new Set([path.relative(ROOT, filePath), "README.md"]);
    const extra = changed.filter((f) => !expected.has(f));
    if (extra.length > 0) {
      throw new Error(`write surface exceeded — also changed: ${extra.join(", ")}`);
    }
  } catch (e) {
    // Restore the original file; never leave src/data broken or commit a failing build.
    fs.writeFileSync(filePath, fileRaw);
    console.error(`  ✗ ${slug}: aborted PR — ${(e as Error).message}. src/data restored.`);
    return {
      prOpened: false,
      survivors: survivors.length,
      dismissals: p.dismissals.length,
      rejected: rejected.length,
    };
  }

  try {
    run("git", ["checkout", "-b", branch], "git checkout -b");
    execFileSync("git", ["add", path.relative(ROOT, filePath), "README.md"], {
      cwd: ROOT,
      stdio: "inherit",
    });
    execFileSync(
      "git",
      ["commit", "-m", `feat(data): discovery ${slug} week ${sweepWeek} (${survivors.length} add)`],
      { cwd: ROOT, stdio: "inherit" }
    );
    run("git", ["push", "--set-upstream", "origin", branch], "git push");
    const prUrl = execFileSync(
      "gh",
      [
        "pr",
        "create",
        "--base",
        "main",
        "--head",
        branch,
        "--title",
        `Discovery: ${slug} — week ${sweepWeek}`,
        "--body-file",
        path.join(APPLY_DIR, `${dataKey}-${sweepWeek}.md`),
      ],
      { cwd: ROOT, encoding: "utf8" }
    ).trim();
    console.log(`  📤 opened PR: ${prUrl}`);
    // Return to main so the next proposal branches cleanly.
    run("git", ["checkout", "main"], "git checkout main");
    return {
      prOpened: true,
      survivors: survivors.length,
      dismissals: p.dismissals.length,
      rejected: rejected.length,
    };
  } catch (e) {
    console.error(`  ✗ ${slug}: git/gh step failed — ${(e as Error).message}.`);
    try {
      run("git", ["checkout", "main"], "git checkout main");
    } catch {
      /* ignore */
    }
    return {
      prOpened: false,
      survivors: survivors.length,
      dismissals: p.dismissals.length,
      rejected: rejected.length,
    };
  }
}

async function main(): Promise<void> {
  const opts = parseArgs();
  console.log(`Apply mode: ${opts.write ? "--write (CI)" : "--dry-run (no src/data writes)"}`);

  const mapProblems = validateDiscoveryMap();
  if (mapProblems.length > 0) {
    console.error("Discovery map validation failed:");
    for (const x of mapProblems) console.error(`  ${x.slug}: ${x.message}`);
    process.exit(1);
  }

  const schema = JSON.parse(fs.readFileSync(SCHEMA_PATH, "utf8"));
  const ajv = new Ajv2020({ allErrors: true });
  addFormats(ajv);
  const validateEntry = ajv.compile(schema.$defs.entry) as (d: unknown) => boolean;
  const validateFile = ajv.compile(schema) as (d: unknown) => boolean;

  const proposals = loadProposals(opts.slugs, opts.week);
  if (proposals.length === 0) {
    console.log("No proposals to apply. (Run discover:judge first.)");
  }

  const today = new Date().toISOString().slice(0, 10);
  const manifest: Record<string, unknown> = {
    runDate: today,
    mode: opts.write ? "write" : "dry-run",
    proposals: [],
  };

  let totalSurvivors = 0;
  let totalBackfill = 0;
  // Shared across all proposals so a wide sweep can't exceed the global backfill ceiling.
  const backfillBudget = { remaining: BACKFILL_GLOBAL };
  for (const p of proposals) {
    const r = await processProposal(p, validateEntry, validateFile, today, opts, backfillBudget);
    totalSurvivors += r.survivors;
    totalBackfill += r.backfill ?? 0;
    (manifest.proposals as unknown[]).push({ slug: p.slug, week: p.sweepWeek, ...r });
  }

  fs.mkdirSync(APPLY_DIR, { recursive: true });
  fs.writeFileSync(
    path.join(APPLY_DIR, `manifest-${today}.json`),
    JSON.stringify(manifest, null, 2) + "\n"
  );

  if (totalSurvivors === 0) {
    console.log("\nNo results survived any proposal this run — no PRs opened (quiet week).");
  } else {
    console.log(
      `\nDone. ${totalSurvivors} add(s) (${totalBackfill} backfill) across ${proposals.length} proposal(s). Artifacts in .discovery/apply/.`
    );
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
