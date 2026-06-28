// ABOUTME: Shared model-credential resolution for the discovery LLM passes (research via
// ABOUTME: Atlas, judgment via Vercel AI SDK generateObject). Both route to z.ai's
// ABOUTME: Anthropic-compatible endpoint (ZAI_API_KEY + ZAI_API_ENDPOINT, model glm-5.2) when
// ABOUTME: present, else fall back to real Anthropic. Fail fast before any LLM cost. The
// ABOUTME: Anthropic account on this box is out of credits and claude-* ids 404 on z.ai, so the
// ABOUTME: funded route is z.ai. See memory: anthropic-base-url-zai-routing.

import { anthropic, createAnthropic } from "@ai-sdk/anthropic";
import type { LanguageModel } from "ai";

export const DEFAULT_ANTHROPIC_MODEL = "claude-sonnet-4-5";
export const DEFAULT_ZAI_MODEL = "glm-5.2";

// Atlas types its `model` config field as `Exclude<LanguageModel, string>` (the concrete object
// form, not the string shorthand). Both `.languageModel(id)` and `anthropic(id)` return the object
// form at runtime, so we narrow the declared `LanguageModel` union to satisfy Atlas's type.
export type ResolvedLanguageModel = Exclude<LanguageModel, string>;

// @ai-sdk/anthropic POSTs to `${baseURL}/messages`, so baseURL must carry the /v1 version
// segment: z.ai serves https://api.z.ai/api/anthropic/v1/messages, while the bare
// /api/anthropic/messages path 404s. ZAI_API_ENDPOINT is conventionally given without /v1.
export function zaiBaseURL(raw: string): string {
  return raw.replace(/\/+$/, "").replace(/\/v\d+$/, "") + "/v1";
}

export interface ResolvedModel {
  model: ResolvedLanguageModel;
  modelId: string;
  viaZai: boolean;
  endpoint?: string;
}

// Returns the language model + how it was routed. Exits the process if no credentials.
export function resolveDiscoveryModel(modelOverride?: string): ResolvedModel {
  const zaiKey = process.env.ZAI_API_KEY || process.env.ATLAS_ZAI_API_KEY;
  const zaiEndpoint =
    process.env.ZAI_API_ENDPOINT || process.env.ZAI_BASE_URL || process.env.ATLAS_ZAI_BASE_URL;
  const viaZai = Boolean(zaiKey && zaiEndpoint);
  if (!viaZai && !process.env.ANTHROPIC_API_KEY) {
    console.error(
      "No model credentials. Set ANTHROPIC_API_KEY, or ZAI_API_KEY + ZAI_API_ENDPOINT for z.ai."
    );
    process.exit(1);
  }
  const modelId = modelOverride ?? (viaZai ? DEFAULT_ZAI_MODEL : DEFAULT_ANTHROPIC_MODEL);
  const model = (
    viaZai
      ? createAnthropic({ baseURL: zaiBaseURL(zaiEndpoint!), apiKey: zaiKey }).languageModel(
          modelId
        )
      : anthropic(modelId)
  ) as ResolvedLanguageModel;
  return { model, modelId, viaZai, endpoint: viaZai ? zaiEndpoint : undefined };
}
