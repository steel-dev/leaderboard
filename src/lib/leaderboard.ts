export interface LeaderboardEntry {
  agent: string;
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
    agent: "Jina",
    organization: "Om Labs",
    webVoyager: {
      score: "98.9%",
      source: "https://webvoyager.omlabs.xyz",
    },
    isNew: true,
    github: null,
    homepage: "https://webvoyager.omlabs.xyz",
  },
  {
    agent: "Alumnium",
    organization: "Alumnium",
    webVoyager: {
      score: "98.5%",
      source: "https://alumnium.ai/blog/webvoyager-benchmark",
    },
    isNew: true,
    github: "https://github.com/alumnium-hq/alumnium",
    homepage: "https://alumnium.ai",
  },
  {
    agent: "Surfer 2",
    organization: "H Company",
    webVoyager: {
      score: "97.1%",
      source: "https://hcompany.ai/surfer-2",
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
    isNew: false,
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
    isNew: false,
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
    isNew: false,
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
    isNew: false,
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
    isNew: true,
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
    github: null,
    homepage: "https://arxiv.org/abs/2404.05902",
  },
];
