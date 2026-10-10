import { z } from "zod";
import { sizes } from "./model-classification";

const sourceSchema = z.object({ title: z.string().min(1), url: z.url() });
export const modelSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    name: z.string().min(1),
    weights: z.enum(["open", "closed", "uncertain"]),
    totalParametersB: z.number().positive().optional(),
    activeParametersB: z.number().positive().optional(),
    parameterEstimateB: z.tuple([z.number().positive(), z.number().positive()]).optional(),
    inputUsdPerMillion: z.number().nonnegative().optional(),
    outputUsdPerMillion: z.number().nonnegative().optional(),
    size: z.enum(sizes),
    basis: z.enum(["parameters", "price", "estimate"]),
    confidence: z.enum(["high", "medium", "low"]),
    notes: z.string().min(1),
    sources: z.array(sourceSchema).min(1),
    checkedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  })
  .superRefine((model, context) => {
    if (
      model.activeParametersB !== undefined &&
      model.totalParametersB !== undefined &&
      model.activeParametersB > model.totalParametersB
    ) {
      context.addIssue({
        code: "custom",
        message: "Active parameters cannot exceed total parameters",
        path: ["activeParametersB"],
      });
    }
    if (model.parameterEstimateB && model.parameterEstimateB[0] > model.parameterEstimateB[1]) {
      context.addIssue({
        code: "custom",
        message: "Parameter estimate must be an ordered range",
        path: ["parameterEstimateB"],
      });
    }
  });
export const submissionSchema = z.object({
  systemName: z.string().min(1),
  kind: z.enum(["model", "harness", "system"]),
  modelIds: z.array(z.string()).min(1),
  harnessCode: z.enum(["open", "closed", "uncertain", "not-applicable"]),
  notes: z.string(),
  sources: z.array(sourceSchema),
});
export const researchBatchSchema = z.object({
  models: z.array(modelSchema),
  submissions: z.array(submissionSchema),
});
export type ModelRecord = z.infer<typeof modelSchema>;
export type SubmissionRecord = z.infer<typeof submissionSchema>;
