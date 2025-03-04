export interface LeaderboardEntry {
  rank: number;
  model: string;
  webVoyager: {
    score: string;
    source: string;
  };
  isNew?: boolean;
  isSota?: boolean;
}

export const leaderboardEntries: LeaderboardEntry[] = [
  {
    rank: 1,
    model: "Kura",
    webVoyager: {
      score: "87%",
      source: "https://github.com/MinorJerry/WebVoyager",
    },
    isNew: true,
    isSota: true,
  },
  {
    rank: 2,
    model: "Browser Use",
    webVoyager: {
      score: "89.1%",
      source: "https://browser-use.com/posts/sota-technical-report",
    },
    isNew: true,
    isSota: true,
  },
  {
    rank: 3,
    model: "Project Mariner",
    webVoyager: {
      score: "83.5%",
      source: "https://deepmind.google/technologies/project-mariner/",
    },
  },
  {
    rank: 4,
    model: "Proxy",
    webVoyager: {
      score: "82%",
      source: "https://convergence.ai/training-web-agents-with-web-world-models-dec-2024/",
    },
  },
  {
    rank: 5,
    model: "Agent-E",
    webVoyager: {
      score: "73.1%",
      source: "https://www.emergence.ai/blog/agent-e-sota",
    },
  },
  {
    rank: 6,
    model: "Runner H 0.1",
    webVoyager: {
      score: "67%",
      source: "https://www.hcompany.ai/blog/a-research-update",
    },
  },
  {
    rank: 7,
    model: "WILBUR",
    webVoyager: {
      score: "60.6%",
      source: "https://arxiv.org/abs/2404.05902",
    },
  },
  {
    rank: 8,
    model: "WebVoyager",
    webVoyager: {
      score: "59.1%",
      source: "https://arxiv.org/abs/2401.13919",
    },
  },
  {
    rank: 9,
    model: "Computer Use",
    webVoyager: {
      score: "52%",
      source: "https://www.hcompany.ai/blog/a-research-update",
    },
  },
];
