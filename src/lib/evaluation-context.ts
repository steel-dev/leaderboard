export const evaluationDimensions = [
  { key: "taskRealism", label: "Task realism" },
  { key: "stateChanges", label: "State changes" },
  { key: "permissions", label: "Permission assumptions" },
  { key: "recovery", label: "Recovery behavior" },
  { key: "failureScoring", label: "Failure scoring" },
] as const;
export type EvaluationDimension = (typeof evaluationDimensions)[number]["key"];
export type EvaluationFact =
  | { status: "documented"; summary: string; sourceLabel: string; sourceUrl: string }
  | { status: "not_documented"; summary: string };
export type EvaluationContext = Record<EvaluationDimension, EvaluationFact>;

function fact(summary: string, sourceLabel: string, sourceUrl: string): EvaluationFact {
  return { status: "documented", summary, sourceLabel, sourceUrl };
}
function unknown(summary: string): EvaluationFact {
  return { status: "not_documented", summary };
}
const recoveryUnknown = unknown(
  "The hub has no sourced recovery rate or common retry policy for this benchmark. Read each run's notes and traces."
);
const permissionsUnknown = unknown(
  "The hub has not documented a common authentication, approval, or action-permission policy. Check the source for each run."
);
const webvoyager = "https://github.com/MinorJerry/WebVoyager/blob/main/README.md";
const webarena = "https://github.com/web-arena-x/webarena/blob/main/README.md";
const osworld = "https://arxiv.org/html/2404.07972v1";
const osworld2 = "https://arxiv.org/html/2606.29537v1";
const clawbench = "https://arxiv.org/html/2604.08523v1";
const health = "https://arxiv.org/html/2604.09937v1";
const mind2web = "https://github.com/OSU-NLP-Group/Online-Mind2Web/blob/main/README.md";

const contexts: Record<string, EvaluationContext> = {
  webvoyager: {
    taskRealism: fact(
      "Browser tasks run on live websites. Travel dates can become stale and require updates.",
      "WebVoyager run instructions",
      webvoyager
    ),
    stateChanges: fact(
      "The public tasks include adding an item to a cart. This task example does not establish a common final-submission policy.",
      "WebVoyager public task dataset",
      "https://raw.githubusercontent.com/MinorJerry/WebVoyager/main/data/WebVoyager_data.jsonl"
    ),
    permissions: permissionsUnknown,
    recovery: recoveryUnknown,
    failureScoring: fact(
      "The original evaluator judges task completion from the response and final screenshots. Exceeding max_iter without completion counts as failure.",
      "WebVoyager evaluation instructions",
      webvoyager
    ),
  },
  webarena: {
    taskRealism: fact(
      "Self-hosted websites provide a controlled environment. The evaluation uses 812 tasks and resets websites to their initial state.",
      "WebArena evaluation instructions",
      webarena
    ),
    stateChanges: fact(
      "Tasks include changes to website state, such as editing content. Functional checks assess whether the task achieves its intended outcome.",
      "WebArena paper",
      "https://arxiv.org/html/2307.13854v3"
    ),
    permissions: fact(
      "The canonical setup obtains login cookies for the benchmark websites before evaluation. This differs from testing sign-in on public services.",
      "WebArena authentication setup",
      webarena
    ),
    recovery: recoveryUnknown,
    failureScoring: fact(
      "Task success uses functional correctness, including answer checks and website state. A correct action sequence alone does not establish success.",
      "WebArena paper",
      "https://arxiv.org/html/2307.13854v3"
    ),
  },
  osworld: {
    taskRealism: fact(
      "369 tasks run in real desktop applications and virtual machines. Tasks include files and workflows across applications.",
      "OSWorld paper, sections 2–3",
      osworld
    ),
    stateChanges: fact(
      "Each task has an initial-state configuration and an execution-based evaluation script. Evaluation checks the resulting computer state.",
      "OSWorld paper, section 3.2",
      osworld
    ),
    permissions: fact(
      "The environment supports keyboard and mouse control inside a virtual machine. Operating-system and action-space settings depend on the run.",
      "OSWorld paper, section 2",
      osworld
    ),
    recovery: recoveryUnknown,
    failureScoring: fact(
      "Execution-based reward evaluates completion after termination or the step limit. Compare the task version and step budget in each row's source.",
      "OSWorld paper, section 2.1",
      osworld
    ),
  },
  "osworld-2": {
    taskRealism: fact(
      "108 long desktop workflows use realistic input files and stateful user profiles. Tasks span applications and self-hosted websites.",
      "OSWorld 2.0 paper",
      osworld2
    ),
    stateChanges: fact(
      "Fine-grained checkpoints assess final state. The benchmark includes files, documents, forms, and cross-application changes.",
      "OSWorld 2.0 paper, section 2.1.3",
      osworld2
    ),
    permissions: fact(
      "The paper audits safety-sensitive execution separately from task completion. A passing task score does not certify permission handling.",
      "OSWorld 2.0 paper, appendix H.4",
      osworld2
    ),
    recovery: fact(
      "A case study shows an agent discarding document recovery data after forced application termination. This is qualitative evidence, not a recovery success rate.",
      "OSWorld 2.0 paper, appendix H.4.3",
      osworld2
    ),
    failureScoring: fact(
      "Binary completion requires all checkpoints. Partial score measures checkpoint progress. This leaderboard ranks partial score; read binary completion in each row's notes.",
      "OSWorld 2.0 paper, section 2.1.3",
      osworld2
    ),
  },
  clawbench: {
    taskRealism: fact(
      "The original paper evaluates 153 everyday tasks on 144 live platforms. These are the original-version results tracked here.",
      "ClawBench original paper, section 2",
      clawbench
    ),
    stateChanges: fact(
      "Tasks require transaction or form submissions. A targeted interceptor blocks the final irreversible request before it reaches the service.",
      "ClawBench original paper, section 2.3",
      clawbench
    ),
    permissions: fact(
      "The original protocol intercepts annotated transaction requests. It does not establish permission to perform those transactions outside the benchmark.",
      "ClawBench original paper, section 2.3",
      clawbench
    ),
    recovery: recoveryUnknown,
    failureScoring: fact(
      "The original evaluator compares recorded actions and other evidence with human reference trajectories, then assigns a binary verdict. Newer rubric versions need separate comparisons.",
      "ClawBench original paper, section 2.5",
      clawbench
    ),
  },
  healthadminbench: {
    taskRealism: fact(
      "135 expert-designed healthcare workflows run in four simulated portals with synthetic patient data, not live patient systems.",
      "HealthAdminBench paper, section 3.1",
      health
    ),
    stateChanges: fact(
      "Tasks modify simulated portal state and documentation. Deterministic checks and model judges verify individual subtasks.",
      "HealthAdminBench paper, section 3.5",
      health
    ),
    permissions: fact(
      "The benchmark abstracts away CAPTCHAs, multi-factor authentication, and session timeouts to isolate workflow execution.",
      "HealthAdminBench paper, section 3.1",
      health
    ),
    recovery: recoveryUnknown,
    failureScoring: fact(
      "Full-task success requires every subtask to pass. Subtask success measures partial progress and must not be read as full workflow completion.",
      "HealthAdminBench paper, section 4",
      health
    ),
  },
  "online-mind2web": {
    taskRealism: fact(
      "300 tasks run on 136 live websites. The protocol starts each task at its specified website rather than a search engine.",
      "Online-Mind2Web evaluation instructions",
      mind2web
    ),
    stateChanges: unknown(
      "The hub has not documented a benchmark-wide final-submission or rollback policy. Inspect the task and run source."
    ),
    permissions: permissionsUnknown,
    recovery: recoveryUnknown,
    failureScoring: fact(
      "WebJudge assesses key points using screenshots and factual action history. Human evaluation and automated judges are separate comparison conditions.",
      "Online-Mind2Web evaluator documentation",
      mind2web
    ),
  },
};

export function getEvaluationContext(slug: string): EvaluationContext {
  return (
    contexts[slug] ?? {
      taskRealism: unknown(
        "Task realism has not yet been documented in this hub. Read the benchmark's methodology and examples."
      ),
      stateChanges: unknown(
        "State-change and rollback behavior have not yet been documented in this hub."
      ),
      permissions: permissionsUnknown,
      recovery: recoveryUnknown,
      failureScoring: unknown(
        "Failure scoring has not yet been documented in this section. Read the benchmark's methodology and run sources."
      ),
    }
  );
}
