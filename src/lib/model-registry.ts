import { researchBatchSchema } from "./model-registry-schema";
import type { BenchmarkResultRow } from "./benchmark-hub";
import {
  classifyModels,
  sizeFromParameters,
  sizeFromPrice,
  type ClassifiedResult,
  type ModelRecord,
  type SubmissionRecord,
} from "./model-classification";

export function buildModelRegistry(rawBatches: unknown[]): Map<string, ModelRecord> {
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
  for (const rawBatch of rawBatches) {
    for (const model of researchBatchSchema.parse(rawBatch).models) {
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

export function classifyBenchmarkRows(
  rows: BenchmarkResultRow[],
  rawBatches: unknown[],
  models: Map<string, ModelRecord>
): ClassifiedResult[] {
  const submissions = new Map<string, SubmissionRecord>();
  for (const rawBatch of rawBatches) {
    for (const submission of researchBatchSchema.parse(rawBatch).submissions) {
      if (submissions.has(submission.systemName))
        throw new Error(`Duplicate submission: ${submission.systemName}`);
      submissions.set(submission.systemName, submission);
    }
  }
  const names = new Set(rows.map((row) => row.systemName));
  for (const name of submissions.keys()) {
    if (!names.has(name)) throw new Error(`Research has no matching result: ${name}`);
  }
  return rows.map((row) => {
    const submission = submissions.get(row.systemName);
    if (!submission) throw new Error(`Missing model research: ${row.systemName}`);
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
