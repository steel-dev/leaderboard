import { researchBatchSchema, type ResearchBatch } from "./model-registry-schema";
import type { BenchmarkResultRow } from "./benchmark-hub";
import {
  classifyModels,
  sizeFromParameters,
  sizeFromPrice,
  type ClassifiedResult,
  type ModelRecord,
  type SubmissionRecord,
} from "./model-classification";

export function parseResearchBatches(rawBatches: unknown[]): ResearchBatch[] {
  return rawBatches.map((rawBatch) => researchBatchSchema.parse(rawBatch));
}

export function buildModelRegistry(batches: ResearchBatch[]): Map<string, ModelRecord> {
  const models = new Map<string, ModelRecord>();
  const classificationFields = [
    "size",
    "weights",
    "basis",
    "totalParametersB",
    "activeParametersB",
    "inputUsdPerMillion",
    "outputUsdPerMillion",
    "parameterEstimateB",
  ] as const;
  for (const batch of batches) {
    for (const model of batch.models) {
      if (
        model.basis === "parameters" &&
        (model.totalParametersB === undefined ||
          sizeFromParameters(model.totalParametersB) !== model.size)
      )
        throw new Error(`Invalid parameter classification: ${model.id}`);
      if (
        model.basis === "price" &&
        (model.inputUsdPerMillion === undefined ||
          model.outputUsdPerMillion === undefined ||
          sizeFromPrice(model.inputUsdPerMillion, model.outputUsdPerMillion) !== model.size)
      )
        throw new Error(`Invalid price classification: ${model.id}`);
      const previous = models.get(model.id);
      if (
        previous &&
        classificationFields.some(
          (field) => JSON.stringify(previous[field]) !== JSON.stringify(model[field])
        )
      ) {
        throw new Error(`Conflicting research records: ${model.id}`);
      }
      models.set(model.id, previous ?? model);
    }
  }
  return models;
}

function submissionsByName(batches: ResearchBatch[]): Map<string, SubmissionRecord> {
  const submissions = new Map<string, SubmissionRecord>();
  for (const batch of batches) {
    for (const submission of batch.submissions) {
      if (submissions.has(submission.systemName))
        throw new Error(`Duplicate submission: ${submission.systemName}`);
      submissions.set(submission.systemName, submission);
    }
  }
  return submissions;
}

// Result rows without research (e.g. a fresh discovery add) and research left behind by a renamed
// row are reported rather than thrown, so a data-only change never breaks the site build.
export function findResearchGaps(rows: BenchmarkResultRow[], batches: ResearchBatch[]) {
  const submissions = submissionsByName(batches);
  const names = new Set(rows.map((row) => row.systemName));
  return {
    unresearched: [...names].filter((name) => !submissions.has(name)),
    orphaned: [...submissions.keys()].filter((name) => !names.has(name)),
  };
}

export function classifyBenchmarkRows(
  rows: BenchmarkResultRow[],
  batches: ResearchBatch[],
  models: Map<string, ModelRecord>
): ClassifiedResult[] {
  const submissions = submissionsByName(batches);
  return rows.map((row) => {
    const submission = submissions.get(row.systemName);
    if (!submission) return { ...row, classification: null };
    const components = submission.modelIds.map((id) => {
      const model = models.get(id);
      if (!model) throw new Error(`Missing model: ${id}`);
      return model;
    });
    return {
      ...row,
      classification: { ...submission, models: components, ...classifyModels(components) },
    };
  });
}
