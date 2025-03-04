export interface LeaderboardEntry {
  rank: number;
  model: string;
  company: string;
  webVoyager: {
    score: string;
    source: string;
  };
  isNew?: boolean;
  isSota?: boolean;
  isOpenSource: boolean;
  homepage: string;
}

export const leaderboardEntries: LeaderboardEntry[] = [
  {
    rank: 1,
    model: "Kura",
    company: "Unknown",
    webVoyager: {
      score: "87%",
      source: "https://www.trykura.com/benchmarks",
    },
    isNew: true,
    isSota: true,
    isOpenSource: true,
    homepage: "https://www.trykura.com",
  },
  {
    rank: 2,
    model: "Browser Use",
    company: "Browser Use",
    webVoyager: {
      score: "89.1%",
      source: "https://browser-use.com/posts/sota-technical-report",
    },
    isNew: true,
    isSota: true,
    isOpenSource: true,
    homepage: "https://browser-use.com",
  },
  {
    rank: 3,
    model: "Project Mariner",
    company: "Google",
    webVoyager: {
      score: "83.5%",
      source: "https://deepmind.google/technologies/project-mariner/",
    },
    isOpenSource: false,
    homepage: "https://deepmind.google/technologies/project-mariner/",
  },
  {
    rank: 4,
    model: "Proxy",
    company: "Convergence AI",
    webVoyager: {
      score: "82%",
      source: "https://convergence.ai/training-web-agents-with-web-world-models-dec-2024/",
    },
    isOpenSource: false,
    homepage: "https://convergence.ai",
  },
  {
    rank: 5,
    model: "Agent-E",
    company: "Emergence",
    webVoyager: {
      score: "73.1%",
      source: "https://www.emergence.ai/blog/agent-e-sota",
    },
    isOpenSource: false,
    homepage: "https://www.emergence.ai",
  },
  {
    rank: 6,
    model: "Runner H 0.1",
    company: "H Company",
    webVoyager: {
      score: "67%",
      source: "https://www.hcompany.ai/blog/a-research-update",
    },
    isOpenSource: false,
    homepage: "https://www.hcompany.ai",
  },
  {
    rank: 7,
    model: "WILBUR",
    company: "Unknown",
    webVoyager: {
      score: "60.6%",
      source: "https://arxiv.org/abs/2404.05902",
    },
    isOpenSource: false,
    homepage: "https://arxiv.org/abs/2404.05902",
  },
  {
    rank: 8,
    model: "WebVoyager",
    company: "Unknown",
    webVoyager: {
      score: "59.1%",
      source: "https://arxiv.org/abs/2401.13919",
    },
    isOpenSource: true,
    homepage: "https://github.com/MinorJerry/WebVoyager",
  },
  {
    rank: 9,
    model: "Computer Use",
    company: "H Company",
    webVoyager: {
      score: "52%",
      source: "https://www.hcompany.ai/blog/a-research-update",
    },
    isOpenSource: false,
    homepage: "https://www.anthropic.com/news/3-5-models-and-computer-use",
  },
];
