export interface Methodology {
  dataset: "full-643" | "filtered" | "custom" | "webvoyager30";
  evaluator: "gpt-4v" | "human" | "custom";
  selfReported: boolean;
  model?: string;
  notes?: string;
}

export interface LeaderboardEntry {
  agent: string;
  organization: string;
  webVoyager: {
    score: string;
    source: string;
  };
  methodology?: Methodology;
  isNew?: boolean;
  github: string | null;
  homepage: string;
}

export const leaderboardEntries: LeaderboardEntry[] = [
  {
    agent: "Surfer 2",
    organization: "H Company",
    webVoyager: {
      score: "97.1%",
      source: "https://hcompany.ai/surfer-2",
    },
    methodology: {
      dataset: "full-643",
      evaluator: "gpt-4v",
      selfReported: true,
      model: "Holo1",
    },
    isNew: true,
    github: null,
    homepage: "https://hcompany.ai/surfer-2",
  },
  {
    agent: "Magnitude",
    organization: "Magnitude",
    webVoyager: {
      score: "93.9%",
      source: "https://magnitude.run/webvoyager",
    },
    methodology: {
      dataset: "full-643",
      evaluator: "gpt-4v",
      selfReported: true,
    },
    isNew: true,
    github: "https://github.com/magnitudedev/magnitude",
    homepage: "https://magnitude.run",
  },
  {
    agent: "AIME Browser-Use",
    organization: "Aime",
    webVoyager: {
      score: "92.34%",
      source: "https://aime-browser-use.github.io/",
    },
    methodology: {
      dataset: "full-643",
      evaluator: "gpt-4v",
      selfReported: true,
      notes: "Score from project page, not independently verified.",
    },
    isNew: true,
    github: null,
    homepage: "https://aime-browser-use.github.io/",
  },
  {
    agent: "Surfer-H + Holo1",
    organization: "H Company",
    webVoyager: {
      score: "92.2%",
      source: "https://arxiv.org/pdf/2506.02865",
    },
    methodology: {
      dataset: "full-643",
      evaluator: "gpt-4v",
      selfReported: false,
      model: "Holo1",
    },
    isNew: true,
    github: null,
    homepage: "https://hcompany.ai",
  },
  {
    agent: "Browserable",
    organization: "Browserable",
    webVoyager: {
      score: "90.4%",
      source: "https://www.browserable.ai/blog/web-voyager-benchmark",
    },
    methodology: {
      dataset: "full-643",
      evaluator: "gpt-4v",
      selfReported: true,
    },
    isNew: true,
    github: "https://github.com/browserable/browserable",
    homepage: "https://www.browserable.ai",
  },
  {
    agent: "Browser Use",
    organization: "Browser Use",
    webVoyager: {
      score: "89.1%",
      source: "https://browser-use.com/posts/sota-technical-report",
    },
    methodology: {
      dataset: "full-643",
      evaluator: "gpt-4v",
      selfReported: true,
    },
    isNew: true,
    github: "https://github.com/browser-use/browser-use",
    homepage: "https://browser-use.com",
  },
  {
    agent: "Operator",
    organization: "OpenAI",
    webVoyager: {
      score: "87%",
      source: "https://openai.com/index/introducing-operator/",
    },
    methodology: {
      dataset: "full-643",
      evaluator: "gpt-4v",
      selfReported: true,
      model: "CUA",
    },
    isNew: true,
    github: null,
    homepage: "https://operator.chatgpt.com/",
  },
  {
    agent: "Skyvern 2.0",
    organization: "Skyvern",
    webVoyager: {
      score: "85.85%",
      source: "https://blog.skyvern.com/skyvern-2-0-state-of-the-art-web-navigation-with-85-8-on-webvoyager-eval/",
    },
    methodology: {
      dataset: "full-643",
      evaluator: "gpt-4v",
      selfReported: true,
    },
    isNew: true,
    github: "https://github.com/Skyvern-AI/Skyvern",
    homepage: "https://www.skyvern.com",
  },
  {
    agent: "Project Mariner",
    organization: "Google",
    webVoyager: {
      score: "83.5%",
      source: "https://deepmind.google/technologies/project-mariner/",
    },
    methodology: {
      dataset: "full-643",
      evaluator: "gpt-4v",
      selfReported: true,
      model: "Gemini 2.0 Flash",
    },
    github: null,
    homepage: "https://deepmind.google/technologies/project-mariner/",
  },
  {
    agent: "Notte",
    organization: "Notte",
    webVoyager: {
      score: "73.1%",
      source: "https://github.com/nottelabs/open-operator-evals#opensource-operators-evals",
    },
    methodology: {
      dataset: "webvoyager30",
      evaluator: "gpt-4v",
      selfReported: false,
      model: "Gemini 2.0 Flash",
      notes:
        "Open Operator Evals reports 79.0% LLM-evaluated, 86.2% self-reported, averaged on WebVoyager30 with 8 tries/task.",
    },
    github: "https://github.com/nottelabs/notte",
    homepage: "https://github.com/nottelabs/notte",
  },
  {
    agent: "Agent-E",
    organization: "Emergence AI",
    webVoyager: {
      score: "73.1%",
      source: "https://www.emergence.ai/blog/agent-e-sota",
    },
    methodology: {
      dataset: "full-643",
      evaluator: "gpt-4v",
      selfReported: true,
    },
    github: null,
    homepage: "https://www.emergence.ai",
  },
  {
    agent: "WebSight",
    organization: "Academic Research",
    webVoyager: {
      score: "68%",
      source: "https://arxiv.org/abs/2508.16987",
    },
    methodology: {
      dataset: "filtered",
      evaluator: "gpt-4v",
      selfReported: false,
      notes: "Evaluated on a filtered 50-task subset, not the full 643-task suite.",
    },
    github: null,
    homepage: "https://arxiv.org/abs/2508.16987",
  },
  {
    agent: "Runner H 0.1",
    organization: "H Company",
    webVoyager: {
      score: "67%",
      source: "https://www.hcompany.ai/blog/a-research-update",
    },
    methodology: {
      dataset: "full-643",
      evaluator: "gpt-4v",
      selfReported: true,
    },
    github: null,
    homepage: "https://www.hcompany.ai",
  },
  {
    agent: "WebVoyager",
    organization: "Academic Research",
    webVoyager: {
      score: "59.1%",
      source: "https://arxiv.org/abs/2401.13919",
    },
    methodology: {
      dataset: "full-643",
      evaluator: "gpt-4v",
      selfReported: false,
    },
    github: "https://github.com/MinorJerry/WebVoyager",
    homepage: "https://github.com/MinorJerry/WebVoyager",
  },
  {
    agent: "WILBUR",
    organization: "Academic Research",
    webVoyager: {
      score: "53%",
      source: "https://arxiv.org/abs/2404.05902",
    },
    methodology: {
      dataset: "full-643",
      evaluator: "gpt-4v",
      selfReported: false,
    },
    github: null,
    homepage: "https://arxiv.org/abs/2404.05902",
  },
];
