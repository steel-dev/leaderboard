export type BenchmarkCategory =
  | "browser_agents"
  | "computer_use"
  | "research_search"
  | "coding"
  | "model_eval";

export type BenchmarkScope = "agent" | "model" | "mixed";

export interface BenchmarkPageMeta {
  slug: string;
  name: string;
  category: BenchmarkCategory;
  scope: BenchmarkScope;
  about: string[];
  methodology: string[];
  importantNotes: string[];
  links: { label: string; url: string }[];
  relatedBenchmarks: string[];
  featuredOnHome: boolean;
  lastUpdated: string;
}

export interface BenchmarkResultRow {
  rank: number;
  systemName: string;
  organization: string;
  scoreDisplay: string;
  scoreValue: number | null;
  sourceUrl: string;
  notesShort: string;
  isNew?: boolean;
}

export interface BenchmarkFaqFacts {
  bestCurrentLabel: string;
  bestCurrentScore: string;
  scope: BenchmarkScope;
  lastUpdated: string;
  hasVerificationCaveat: boolean;
  hasComparabilityCaveat: boolean;
}

export interface BenchmarkFaqItem {
  q: string;
  a: string;
}

export interface BenchmarkPageData {
  meta: BenchmarkPageMeta;
  results: BenchmarkResultRow[];
}

export const benchmarkCategoryLabels: Record<BenchmarkCategory, string> = {
  browser_agents: "Browser agents",
  computer_use: "Computer use",
  research_search: "Research/search",
  coding: "Coding",
  model_eval: "Model evals / reasoning",
};

export const benchmarkScopeLabels: Record<BenchmarkScope, string> = {
  model: "Model",
  agent: "Agent",
  mixed: "Mixed",
};

export const benchmarkPages: BenchmarkPageData[] = [
  {
    meta: {
      slug: "webvoyager",
      name: "WebVoyager",
      category: "browser_agents",
      scope: "agent",
      about: [
        "WebVoyager is a benchmark for browser agents operating on live websites. It focuses on practical tasks such as navigation, search, form completion, and multi-step workflows across a broad website mix.",
        "Builders use WebVoyager to compare end-to-end browsing systems under a shared task suite. It is one of the most commonly cited public references for web agent capability in production-like browsing flows.",
        "Scores here generally reflect full system setup, not only a base model. Prompting strategy, tool policies, retries, and browser execution stack can all materially change outcomes.",
      ],
      methodology: [
        "Evaluation typically reports pass rates over benchmark tasks and may differ by run policy (for example pass@1 vs multi-attempt settings).",
        "Reported rows can mix independent studies and team-published updates; always check source methodology before direct comparisons.",
        "Last tracked update for this page uses the timestamp shown on this page, and rows can be revised as better-source reports are added.",
      ],
      importantNotes: [
        "Rows may use different evaluation settings and are not always strict apples-to-apples.",
      ],
      links: [
        { label: "WebVoyager paper", url: "https://arxiv.org/abs/2401.13919" },
        { label: "WebVoyager repository", url: "https://github.com/MinorJerry/WebVoyager" },
      ],
      relatedBenchmarks: ["webarena", "browsecomp", "osworld"],
      featuredOnHome: true,
      lastUpdated: "2026-03-22",
    },
    results: [
      {
        rank: 1,
        systemName: "Surfer 2",
        organization: "H Company",
        scoreDisplay: "97.1%",
        scoreValue: 97.1,
        sourceUrl: "https://hcompany.ai/surfer-2",
        notesShort: "System-level result; setup details published by submitter.",
        isNew: true,
      },
      {
        rank: 2,
        systemName: "Magnitude",
        organization: "Magnitude",
        scoreDisplay: "93.9%",
        scoreValue: 93.9,
        sourceUrl: "https://magnitude.run/webvoyager",
        notesShort: "Open-source stack; score from public team report.",
      },
      {
        rank: 3,
        systemName: "AIME Browser-Use",
        organization: "AIME",
        scoreDisplay: "92.34%",
        scoreValue: 92.34,
        sourceUrl: "https://aime-browser-use.github.io/",
        notesShort: "System submission with custom orchestration and tooling.",
      },
    ],
  },
  {
    meta: {
      slug: "osworld",
      name: "OSWorld",
      category: "computer_use",
      scope: "agent",
      about: [
        "OSWorld evaluates computer-use agents across desktop-style tasks spanning common software workflows and multi-step interactions.",
        "It is useful when you care about full desktop execution behavior instead of browser-only performance, including action sequencing across applications.",
        "Because it measures a complete acting stack, rankings primarily represent configured systems rather than isolated base-model capability.",
      ],
      methodology: [
        "Evaluations are generally execution-based and emphasize completed task trajectories.",
        "Reported results can vary by environment configuration, tooling policy, and run-time assumptions.",
        "Treat these rows as directional unless sources provide fully matched setups.",
      ],
      importantNotes: [
        "Desktop environments and setup policy can materially influence measured outcomes.",
      ],
      links: [
        { label: "OSWorld paper", url: "https://arxiv.org/abs/2404.07972" },
        { label: "OSWorld repository", url: "https://github.com/xlang-ai/OSWorld" },
      ],
      relatedBenchmarks: ["webvoyager", "webarena"],
      featuredOnHome: true,
      lastUpdated: "2026-03-22",
    },
    results: [
      {
        rank: 1,
        systemName: "VisionAgent",
        organization: "AskUI",
        scoreDisplay: "66.2%",
        scoreValue: 66.2,
        sourceUrl: "https://github.com/xlang-ai/OSWorld",
        notesShort: "Execution-based row from published benchmark tracking.",
      },
      {
        rank: 2,
        systemName: "Claude Computer Use",
        organization: "Anthropic",
        scoreDisplay: "40.0%",
        scoreValue: 40.0,
        sourceUrl: "https://www.anthropic.com/news/3-5-models-and-computer-use",
        notesShort: "System setup details differ from benchmark-native harness rows.",
      },
      {
        rank: 3,
        systemName: "Reference baseline",
        organization: "Community",
        scoreDisplay: "29.8%",
        scoreValue: 29.8,
        sourceUrl: "https://github.com/xlang-ai/OSWorld",
        notesShort: "Illustrative placeholder row to keep template structure stable.",
      },
    ],
  },
  {
    meta: {
      slug: "browsecomp",
      name: "BrowseComp",
      category: "research_search",
      scope: "mixed",
      about: [
        "BrowseComp targets difficult browse-and-synthesize research questions that are easy to verify but hard to answer without strong search and reasoning strategy.",
        "The benchmark is valuable for teams building deep research systems where retrieval strategy, persistence, and answer synthesis quality matter.",
        "Results may include model-centric and system-augmented submissions, so score ownership should be interpreted carefully.",
      ],
      methodology: [
        "Scoring emphasizes verifiable final answers over intermediate browsing traces.",
        "Rows can combine model-only evaluations and agent-with-tools submissions depending on source.",
        "For procurement decisions, review each source for retrieval tooling and attempt policy.",
      ],
      importantNotes: [
        "Mixed-scope benchmark: model-only and tool-augmented rows are not inherently directly comparable.",
      ],
      links: [{ label: "BrowseComp overview", url: "https://openai.com/index/browsecomp/" }],
      relatedBenchmarks: ["webvoyager", "webarena"],
      featuredOnHome: true,
      lastUpdated: "2026-03-22",
    },
    results: [
      {
        rank: 1,
        systemName: "Kimi K2 Thinking",
        organization: "Moonshot AI",
        scoreDisplay: "60.2%",
        scoreValue: 60.2,
        sourceUrl: "https://openai.com/index/browsecomp/",
        notesShort: "Score from public leaderboard context; row type may be model-centric.",
      },
      {
        rank: 2,
        systemName: "Frontier baseline A",
        organization: "Public report",
        scoreDisplay: "51.0%",
        scoreValue: 51.0,
        sourceUrl: "https://openai.com/index/browsecomp/",
        notesShort: "Placeholder ranking row for template testing and FAQ generation.",
      },
      {
        rank: 3,
        systemName: "Tool-augmented setup B",
        organization: "Community",
        scoreDisplay: "47.4%",
        scoreValue: 47.4,
        sourceUrl: "https://openai.com/index/browsecomp/",
        notesShort: "Illustrative mixed setup row; replace with verified source later.",
      },
    ],
  },
  {
    meta: {
      slug: "webarena",
      name: "WebArena",
      category: "browser_agents",
      scope: "agent",
      about: [
        "WebArena evaluates browser agents in controlled, self-hosted web environments that represent realistic application patterns such as e-commerce, forums, and developer workflows.",
        "It is commonly used when teams want more reproducible benchmarking conditions than fully live-web tasks.",
        "Scores still represent configured end-to-end systems, including model choice, planning approach, and browser interaction stack.",
      ],
      methodology: [
        "The benchmark uses programmatic evaluation with task-level success criteria.",
        "Rows often come from a shared public tracker and can reflect different submission dates and system revisions.",
        "Use notes and source links to verify attempt policy and setup assumptions.",
      ],
      importantNotes: [
        "Even with controlled environments, ranking rows can differ by setup and submission policy.",
      ],
      links: [
        { label: "WebArena paper", url: "https://arxiv.org/abs/2307.13854" },
        { label: "WebArena repository", url: "https://github.com/web-arena-x/webarena" },
      ],
      relatedBenchmarks: ["webvoyager", "browsecomp", "osworld"],
      featuredOnHome: true,
      lastUpdated: "2026-03-22",
    },
    results: [
      {
        rank: 1,
        systemName: "DeepSeek v3.2",
        organization: "DeepSeek",
        scoreDisplay: "74.3%",
        scoreValue: 74.3,
        sourceUrl:
          "https://docs.google.com/spreadsheets/d/1M801lEpBbKSNwP-vDBkC_pF7LdyGU1f_ufZb_NWNBZQ",
        notesShort:
          "Public benchmark tracker row; compare against same policy rows where possible.",
      },
      {
        rank: 2,
        systemName: "OpAgent",
        organization: "CodeFuse AI",
        scoreDisplay: "71.6%",
        scoreValue: 71.6,
        sourceUrl:
          "https://docs.google.com/spreadsheets/d/1M801lEpBbKSNwP-vDBkC_pF7LdyGU1f_ufZb_NWNBZQ",
        notesShort: "Programmatic evaluation in WebArena environment; setup-specific result.",
      },
      {
        rank: 3,
        systemName: "ColorBrowserAgent",
        organization: "ColorBrowser",
        scoreDisplay: "71.2%",
        scoreValue: 71.2,
        sourceUrl:
          "https://docs.google.com/spreadsheets/d/1M801lEpBbKSNwP-vDBkC_pF7LdyGU1f_ufZb_NWNBZQ",
        notesShort: "Open-source submission on shared tracker; verify date and run assumptions.",
      },
    ],
  },
  {
    meta: {
      slug: "swe-bench-verified",
      name: "SWE-bench Verified",
      category: "coding",
      scope: "model",
      about: [
        "SWE-bench Verified evaluates software engineering performance on real GitHub issues with stricter quality controls than the broader SWE-bench set.",
        "This benchmark helps teams estimate bug-fixing and code-edit reliability in realistic repository contexts.",
        "Compared with browsing benchmarks, this page leans more model-centric, though harness details and agent wrappers can still influence observed scores.",
      ],
      methodology: [
        "Results typically report issue-resolution success rates on the verified subset.",
        "Leaderboard sources can differ by harness, timeout policy, or tool permissions.",
        "Treat rows as model-focused directional signals unless source methodology is fully matched.",
      ],
      importantNotes: [
        "Model-focused benchmark, but harness and evaluation policy still affect outcomes.",
      ],
      links: [
        { label: "SWE-bench leaderboard", url: "https://www.swebench.com/" },
        {
          label: "SWE-bench repository",
          url: "https://github.com/princeton-nlp/SWE-bench",
        },
      ],
      relatedBenchmarks: ["webvoyager", "browsecomp"],
      featuredOnHome: true,
      lastUpdated: "2026-03-22",
    },
    results: [
      {
        rank: 1,
        systemName: "Claude 3.5 Sonnet (agentic setup)",
        organization: "Anthropic",
        scoreDisplay: "70.3%",
        scoreValue: 70.3,
        sourceUrl: "https://www.swebench.com/",
        notesShort: "Verified subset result; tooling policy can impact reproducibility.",
      },
      {
        rank: 2,
        systemName: "GPT-4.1",
        organization: "OpenAI",
        scoreDisplay: "54.6%",
        scoreValue: 54.6,
        sourceUrl: "https://www.swebench.com/",
        notesShort: "Model-centric row from public leaderboard context.",
      },
      {
        rank: 3,
        systemName: "DeepSeek R1",
        organization: "DeepSeek",
        scoreDisplay: "49.2%",
        scoreValue: 49.2,
        sourceUrl: "https://www.swebench.com/",
        notesShort: "Placeholder-safe entry to validate table and schema behavior.",
      },
    ],
  },
];

export const benchmarkPageBySlug: Record<string, BenchmarkPageData> = Object.fromEntries(
  benchmarkPages.map((page) => [page.meta.slug, page])
);

export function getAllBenchmarkPages(): BenchmarkPageData[] {
  return benchmarkPages;
}

export function getBenchmarkPage(slug: string): BenchmarkPageData | undefined {
  return benchmarkPageBySlug[slug];
}

export function getFeaturedBenchmarkPages(): BenchmarkPageData[] {
  return benchmarkPages.filter((page) => page.meta.featuredOnHome);
}

export function getTopResult(rows: BenchmarkResultRow[]): BenchmarkResultRow | null {
  if (rows.length === 0) return null;
  return [...rows].sort((a, b) => a.rank - b.rank)[0];
}

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getScopeOwnershipCopy(scope: BenchmarkScope): string {
  if (scope === "model") {
    return "This page is model-focused, so rankings mostly reflect model capability under the reported harness.";
  }
  return "This ranking reflects submitted system setups (model plus tools and policy), not just a base model.";
}

export function buildBenchmarkFaqFacts(page: BenchmarkPageData): BenchmarkFaqFacts {
  const top = getTopResult(page.results);
  const notes = page.results.map((row) => row.notesShort.toLowerCase()).join(" ");
  const metaNotes = page.meta.importantNotes.join(" ").toLowerCase();

  return {
    bestCurrentLabel: top?.systemName ?? "No tracked system",
    bestCurrentScore: top?.scoreDisplay ?? "N/A",
    scope: page.meta.scope,
    lastUpdated: page.meta.lastUpdated,
    hasVerificationCaveat:
      notes.includes("self-report") || notes.includes("verified") || metaNotes.includes("verified"),
    hasComparabilityCaveat: page.meta.scope === "mixed" || metaNotes.includes("apples-to-apples"),
  };
}

export function generateBenchmarkFaq(
  meta: BenchmarkPageMeta,
  facts: BenchmarkFaqFacts
): BenchmarkFaqItem[] {
  const scopeTarget =
    facts.scope === "model" ? "model currently leading" : "system/agent setup currently leading";

  const items: BenchmarkFaqItem[] = [
    {
      q: `Which system is currently best on ${meta.name}?`,
      a: `${facts.bestCurrentLabel} is the ${scopeTarget} with a tracked score of ${facts.bestCurrentScore}. ${getScopeOwnershipCopy(
        facts.scope
      )} Based on our latest tracked results, last updated ${formatDate(facts.lastUpdated)}.`,
    },
    {
      q: `What should I read into a ${meta.name} score?`,
      a: `${meta.name} scores are most useful for within-benchmark ranking. Read the Notes column to understand setup context, and use the methodology section before making procurement or architecture decisions.`,
    },
  ];

  if (facts.hasVerificationCaveat) {
    items.push({
      q: "Are these independently verified?",
      a: "Not always. Some rows are independently benchmarked and some are team-reported. Use each source link and notes field to verify evidence level before drawing strong conclusions.",
    });
  }

  if (facts.scope === "mixed" || facts.hasComparabilityCaveat) {
    items.push({
      q: "Can I compare model-only and agent-with-tools rows directly?",
      a: "Not directly. Mixed pages can combine model-centric and full-system submissions. Treat those comparisons as directional unless evaluation setup and tool policy are explicitly aligned.",
    });
  }

  return items;
}

export const homeFaqs: BenchmarkFaqItem[] = [
  {
    q: "How should I choose a benchmark for my use case?",
    a: "Start from deployment context: browser workflow automation usually maps to WebVoyager or WebArena, desktop automation maps to OSWorld, deep research maps to BrowseComp, and code-fixing reliability maps to SWE-bench Verified.",
  },
  {
    q: "Are scores comparable across different benchmarks?",
    a: "No. Benchmark objectives, datasets, evaluators, and pass criteria differ. Use each benchmark page for within-benchmark comparison, then validate directly on your own workload.",
  },
  {
    q: "Do leaderboard scores belong to models or systems?",
    a: "Both exist, depending on page scope. Model pages emphasize base-model capability, while agent pages represent full systems (model + tooling + policy). Mixed pages include both and require extra caution.",
  },
];
