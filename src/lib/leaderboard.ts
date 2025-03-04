export interface LeaderboardEntry {
  model: string;
  company: string;
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
    company: "Browser Use",
    webVoyager: {
      score: "89.1%",
      source: "https://browser-use.com/posts/sota-technical-report",
    },
    isNew: true,
    github: "https://github.com/browser-use/browser-use",
    homepage: "https://browser-use.com",
  },
  {
    model: "Kura",
    company: "Kura",
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
    company: "Google",
    webVoyager: {
      score: "83.5%",
      source: "https://deepmind.google/technologies/project-mariner/",
    },
    github: null,
    homepage: "https://deepmind.google/technologies/project-mariner/",
  },
  {
    model: "Proxy",
    company: "Convergence AI",
    webVoyager: {
      score: "82%",
      source: "https://convergence.ai/training-web-agents-with-web-world-models-dec-2024/",
    },
    github: null,
    homepage: "https://convergence.ai",
  },
  {
    model: "Agent-E",
    company: "Emergence",
    webVoyager: {
      score: "73.1%",
      source: "https://www.emergence.ai/blog/agent-e-sota",
    },
    github: null,
    homepage: "https://www.emergence.ai",
  },
  {
    model: "Runner H 0.1",
    company: "H Company",
    webVoyager: {
      score: "67%",
      source: "https://www.hcompany.ai/blog/a-research-update",
    },
    github: null,
    homepage: "https://www.hcompany.ai",
  },
  {
    model: "WILBUR",
    company: "Unknown",
    webVoyager: {
      score: "60.6%",
      source: "https://arxiv.org/abs/2404.05902",
    },
    github: null,
    homepage: "https://arxiv.org/abs/2404.05902",
  },
  {
    model: "WebVoyager",
    company: "Unknown",
    webVoyager: {
      score: "59.1%",
      source: "https://arxiv.org/abs/2401.13919",
    },
    github: "https://github.com/MinorJerry/WebVoyager",
    homepage: "https://github.com/MinorJerry/WebVoyager",
  },
  {
    model: "Computer Use",
    company: "H Company",
    webVoyager: {
      score: "52%",
      source: "https://www.hcompany.ai/blog/a-research-update",
    },
    github: null,
    homepage: "https://www.anthropic.com/news/3-5-models-and-computer-use",
  },
];
