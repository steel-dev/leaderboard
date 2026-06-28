// ABOUTME: Minimal SSRF guard for discover-apply's soft evidence re-fetch. The RESEARCH
// ABOUTME: fetch is already guarded by Atlas's built-in safety.js (we pass
// ABOUTME: safety:{allowPrivateNetworks:false} to new Atlas()). The APPLY step re-fetches a
// ABOUTME: candidate's sourceUrl *independently* to confirm the score number is really there,
// ABOUTME: so it must enforce the same host/IP rules itself. These rules mirror Atlas's
// ABOUTME: isPrivateIPv4Octets + scheme restriction + DNS-resolution check.

import dns from "node:dns/promises";
import net from "node:net";
import type { LookupAddress } from "node:dns";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { tmpdir } from "node:os";
import { writeFile, unlink } from "node:fs/promises";
import path from "node:path";

const execFileP = promisify(execFile);

// Upper bound on a fetched body's size (bytes). Guards the soft evidence re-fetch against a
// multi-GB response OOMing the process before pdftotext/UTF-8 decoding can run. Header-based: a
// chunked response without Content-Length is not pre-capped (acceptable for an SSRF-validated source).
const MAX_FETCH_BYTES = 16 * 1024 * 1024; // 16 MiB

export type SsrfVerdict = { ok: true } | { ok: false; reason: string };

// URL-level checks (no DNS): scheme must be http/https, no embedded credentials.
export function assertSafePublicUrl(rawUrl: string): SsrfVerdict {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return { ok: false, reason: "not a valid URL" };
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return { ok: false, reason: `scheme ${url.protocol} not allowed (http/https only)` };
  }
  if (url.username || url.password) {
    return { ok: false, reason: "URL must not contain credentials" };
  }
  return { ok: true };
}

// Resolve a hostname and reject if ANY resolved address is private/loopback/link-local/metadata.
// For a literal IP, check it directly. This is the per-hop guard run before every fetch.
export async function assertSafeHost(host: string): Promise<SsrfVerdict> {
  if (net.isIP(host)) return checkIp(host);
  let addrs: LookupAddress[];
  try {
    addrs = await dns.lookup(host, { all: true });
  } catch (e) {
    return { ok: false, reason: `DNS lookup failed: ${(e as Error).message}` };
  }
  if (addrs.length === 0) return { ok: false, reason: "DNS returned no addresses" };
  for (const a of addrs) {
    const v = checkIp(a.address);
    if (!v.ok) return { ok: false, reason: `${host} -> ${a.address}: ${v.reason}` };
  }
  return { ok: true };
}

export type SafeFetchResult =
  | { ok: true; status: number; text: string; contentType: string; bytes: Uint8Array }
  | { ok: false; reason: string };

// Fetch a URL as text with SSRF protection on EVERY hop: validate scheme/creds, resolve + check
// the host's IPs, fetch with redirect:"manual", and re-validate each Location before following.
// Bounded to maxHops (default 3). Never follows a redirect to a private/metadata host.
export async function safeFetchText(
  rawUrl: string,
  opts: { timeoutMs?: number; maxHops?: number } = {}
): Promise<SafeFetchResult> {
  const maxHops = opts.maxHops ?? 3;
  const timeoutMs = opts.timeoutMs ?? 12_000;
  let current = rawUrl;
  for (let hop = 0; hop <= maxHops; hop++) {
    const urlCheck = assertSafePublicUrl(current);
    if (!urlCheck.ok) return { ok: false, reason: urlCheck.reason };
    const url = new URL(current);
    const hostCheck = await assertSafeHost(url.hostname);
    if (!hostCheck.ok) return { ok: false, reason: hostCheck.reason };
    let res: Response;
    try {
      res = await fetch(current, {
        redirect: "manual",
        signal: AbortSignal.timeout(timeoutMs),
        headers: { "user-agent": "leaderboard-discovery-apply/1.0 (+verify)" },
      });
    } catch (e) {
      return { ok: false, reason: `fetch failed: ${(e as Error).message}` };
    }
    // 2xx -> done. 3xx -> validate + follow one hop. Anything else -> unreachable (soft miss).
    if (res.status >= 200 && res.status < 300) {
      // Reject oversized bodies before buffering: res.arrayBuffer() materializes the whole response,
      // so a multi-GB file OOMs the process before pdftotext/decoding runs. (A missing/zero
      // Content-Length — e.g. chunked — is not pre-capped; the source is already SSRF-validated.)
      const cl = Number(res.headers.get("content-length") ?? 0);
      if (cl && cl > MAX_FETCH_BYTES) {
        return { ok: false, reason: `body too large (${cl} bytes > ${MAX_FETCH_BYTES})` };
      }
      // Capture raw bytes (+ content-type) so PDF bodies can be routed through pdftotext instead of
      // a naive substring search (res.text() UTF-8-decodes compressed PDF streams -> false negatives).
      const ab = await res.arrayBuffer().catch(() => null);
      if (ab === null) return { ok: false, reason: "empty/undecodable response body" };
      const bytes = new Uint8Array(ab);
      return {
        ok: true,
        status: res.status,
        contentType: res.headers.get("content-type") ?? "",
        bytes,
        text: Buffer.from(bytes).toString("utf8"),
      };
    }
    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get("location");
      if (!location) return { ok: false, reason: `redirect ${res.status} without Location` };
      try {
        current = new URL(location, current).toString(); // resolve relative redirects
      } catch {
        return { ok: false, reason: `redirect Location unparseable: ${location.slice(0, 80)}` };
      }
      continue;
    }
    return { ok: false, reason: `HTTP ${res.status}` };
  }
  return { ok: false, reason: `exceeded ${maxHops} redirects` };
}

// True when a fetched body is a PDF — by content-type, or the %PDF- magic bytes (some servers omit
// content-type). Used to route through pdftotext instead of a naive substring search.
export function isPdfBody(contentType: string, bytes: Uint8Array): boolean {
  if (/pdf/i.test(contentType)) return true;
  return (
    bytes.length >= 5 &&
    bytes[0] === 0x25 && // %
    bytes[1] === 0x50 && // P
    bytes[2] === 0x44 && // D
    bytes[3] === 0x46 // F
  );
}

// Extract text suitable for substring attribution checks. HTML/text -> UTF-8 decode. PDF ->
// pdftotext, because raw `includes()` over compressed PDF bytes false-negatives: a source can
// genuinely contain the score + system name yet report hasName:false (verified 2026-06-28 on an
// openreview.net PDF). Returns null for a PDF we could not extract (pdftotext missing/failed) OR whose
// extraction yielded no text (image-only/scanned/encrypted) — so callers emit a distinct
// "pdf-unverifiable" verdict instead of a misleading "cooccurrence-miss" (which reads as evidence the
// score is absent when really we just couldn't read the page).
//
// Security: `bytes` come from an already-SSRF-validated fetch. pdftotext reads a temp file whose name
// is process-generated; fetched text is NEVER placed in argv (fixed args ["-q", file, "-"]), so an
// attacker controlling the PDF body cannot inject shell arguments.
export async function extractSearchableText(
  bytes: Uint8Array,
  contentType: string
): Promise<string | null> {
  if (!isPdfBody(contentType, bytes)) return Buffer.from(bytes).toString("utf8");
  const file = path.join(tmpdir(), `dv-${process.pid}-${bytes.length}.pdf`);
  try {
    await writeFile(file, bytes);
    const { stdout } = await execFileP("pdftotext", ["-q", file, "-"], {
      maxBuffer: 24 * 1024 * 1024,
      timeout: 20_000,
    });
    // pdftotext exits 0 with "" on an image-only/scanned/encrypted PDF (no extractable text layer).
    // Treat an empty/whitespace extraction like a failure -> pdf-unverifiable, not cooccurrence-miss.
    return stdout.trim() === "" ? null : stdout;
  } catch {
    return null; // pdftotext missing or failed -> caller marks pdf-unverifiable
  } finally {
    await unlink(file).catch(() => {});
  }
}

function checkIp(ip: string): SsrfVerdict {
  if (net.isIPv4(ip)) return checkIpv4(ip);
  if (net.isIPv6(ip)) return checkIpv6(ip);
  return { ok: false, reason: `not an IP: ${ip}` };
}

// Mirrors @steel-dev/atlas safety.js isPrivateIPv4Octets.
function checkIpv4(ip: string): SsrfVerdict {
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some((n) => Number.isNaN(n) || n < 0 || n > 255)) {
    return { ok: false, reason: `bad IPv4 ${ip}` };
  }
  const [a, b] = parts;
  const blocked =
    a === 0 || // 0.0.0.0/8 "this host"
    a === 10 || // 10.0.0.0/8 private
    a === 127 || // 127.0.0.0/8 loopback
    (a === 100 && b >= 64 && b <= 127) || // 100.64.0.0/10 CGNAT
    (a === 169 && b === 254) || // 169.254.0.0/16 link-local + cloud metadata (169.254.169.254)
    (a === 172 && b >= 16 && b <= 31) || // 172.16.0.0/12 private
    (a === 192 && b === 168); // 192.168.0.0/16 private
  return blocked ? { ok: false, reason: `private/loopback/link-local IPv4 ${ip}` } : { ok: true };
}

function checkIpv6(ip: string): SsrfVerdict {
  const v = ip.toLowerCase();
  if (v === "::1") return { ok: false, reason: `loopback IPv6 ${ip}` };
  if (v === "::" || v.startsWith("::ffff:0:0"))
    return { ok: false, reason: `unspecified IPv6 ${ip}` };
  if (v.startsWith("fe80")) return { ok: false, reason: `link-local IPv6 ${ip}` };
  if (v.startsWith("fc") || v.startsWith("fd")) return { ok: false, reason: `ULA IPv6 ${ip}` };
  // IPv4-mapped that hide a private v4 (e.g. ::ffff:127.0.0.1).
  if (v.startsWith("::ffff:")) {
    const inner = v.slice("::ffff:".length);
    if (net.isIPv4(inner)) return checkIpv4(inner);
  }
  return { ok: true };
}
