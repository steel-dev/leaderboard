export interface LeaderboardEntry {
  model: string;
  organization: string;
  webVoyager: {
    score: string;
    source: string;
  };
  isNew?: boolean;
  github: string | null;
  homepage: string;
}

export const leaderboardEntries: LeaderboardEntry[] = [
  {
    model: "Browser Use",
    organization: "Browser Use",
    webVoyager: {
      score: "89.1%",
      source: "https://browser-use.com/posts/sota-technical-report",
    },
    isNew: true,
    github: "https://github.com/browser-use/browser-use",
    homepage: "https://browser-use.com",
  },
  {
    model: "Operator",
    organization: "OpenAI",
    webVoyager: {
      score: "87%",
      source: "https://openai.com/index/introducing-operator/",
    },
    isNew: true,
    github: null,
    homepage: "hhttps://operator.chatgpt.com/",
  },
  {
    model: "Kura",
    organization: "Kura",
    webVoyager: {
      score: "87%",
      source: "https://www.trykura.com/benchmarks",
    },
    isNew: true,
    github: null,
    homepage: "https://www.trykura.com",
  },
  {
    model: "Project Mariner",
    organization: "Google",
    webVoyager: {
      score: "83.5%",
      source: "https://deepmind.google/technologies/project-mariner/",
    },
    github: null,
    homepage: "https://deepmind.google/technologies/project-mariner/",
  },
  {
    model: "Proxy",
    organization: "Convergence AI",
    webVoyager: {
      score: "82%",
      source: "https://convergence.ai/training-web-agents-with-web-world-models-dec-2024/",
    },
    github: null,
    homepage: "https://convergence.ai",
  },
  {
    model: "Agent-E",
    organization: "Emergence AI",
    webVoyager: {
      score: "73.1%",
      source: "https://www.emergence.ai/blog/agent-e-sota",
    },
    github: null,
    homepage: "https://www.emergence.ai",
  },
  {
    model: "Runner H 0.1",
    organization: "H Company",
    webVoyager: {
      score: "67%",
      source: "https://www.hcompany.ai/blog/a-research-update",
    },
    github: null,
    homepage: "https://www.hcompany.ai",
  },
  {
    model: "WILBUR",
    organization: "Academic Research",
    webVoyager: {
      score: "60.6%",
      source: "https://arxiv.org/abs/2404.05902",
    },
    github: null,
    homepage: "https://arxiv.org/abs/2404.05902",
  },
  {
    model: "WebVoyager",
    organization: "Academic Research",
    webVoyager: {
      score: "59.1%",
      source: "https://arxiv.org/abs/2401.13919",
    },
    github: "https://github.com/MinorJerry/WebVoyager",
    homepage: "https://github.com/MinorJerry/WebVoyager",
  },
  {
    model: "Computer Use",
    organization: "Anthropic",
    webVoyager: {
      score: "52%",
      source: "https://www.hcompany.ai/blog/a-research-update",
    },
    github: null,
    homepage: "https://www.anthropic.com/news/3-5-models-and-computer-use",
  },
];
