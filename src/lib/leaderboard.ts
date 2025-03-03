export interface LeaderboardEntry {
  rank: number;
  model: string;
  webArena: {
    score: string;
    source: string;
  };
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
    model: "Browser Use",
    webArena: {
      score: "N/A",
      source: "N/A",
    },
    webVoyager: {
      score: "89.1%",
      source: "https://browser-use.com/posts/sota-technical-report",
    },
    isNew: true,
    isSota: true,
  },
  {
    rank: 2,
    model: "Operator",
    webArena: {
      score: "58.1%",
      source:
        "https://www.convergenceindia.org/industry-news/artificial-intelligence/test-scores-of-chatgpts-all-new-computer-using-agent-operator-might-blow-your-minds-119000/",
    },
    webVoyager: {
      score: "87%",
      source:
        "https://www.convergenceindia.org/industry-news/artificial-intelligence/test-scores-of-chatgpts-all-new-computer-using-agent-operator-might-blow-your-minds-119000/",
    },
  },
  {
    rank: 3,
    model: "Runner H 0.1",
    webArena: {
      score: "N/A",
      source: "N/A",
    },
    webVoyager: {
      score: "67%",
      source: "https://www.hcompany.ai/blog/a-research-update",
    },
  },
  {
    rank: 4,
    model: "Computer Use",
    webArena: {
      score: "N/A",
      source: "N/A",
    },
    webVoyager: {
      score: "52%",
      source: "https://www.hcompany.ai/blog/a-research-update",
    },
  },
  {
    rank: 5,
    model: "Web Voyager",
    webArena: {
      score: "N/A",
      source: "N/A",
    },
    webVoyager: {
      score: "59.1%",
      source: "https://arxiv.org/html/2401.13919v3",
    },
  },
];
