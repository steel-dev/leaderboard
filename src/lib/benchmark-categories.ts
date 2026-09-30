import { getAllBenchmarkPages, type BenchmarkCategory } from "./benchmark-hub";

export interface BenchmarkCategoryPage {
  key: BenchmarkCategory;
  slug: string;
  name: string;
  description: string;
}

export const benchmarkCategories: BenchmarkCategoryPage[] = [
  {
    key: "browser_agents",
    slug: "browser-agents",
    name: "Browser agent benchmarks",
    description:
      "Compare agents that navigate websites and complete browser tasks. Check the task environment, observation mode, and evaluator before comparing scores.",
  },
  {
    key: "computer_use",
    slug: "computer-use",
    name: "Computer use benchmarks",
    description:
      "Use these computer use agent leaderboards to compare desktop workflows. Check operating systems, application access, and task variants.",
  },
  {
    key: "research_search",
    slug: "research-search",
    name: "Research and search benchmarks",
    description:
      "Compare systems that find evidence and answer research questions. Tool access, search budgets, and context policies can change results.",
  },
  {
    key: "coding",
    slug: "coding-agents",
    name: "Coding agent benchmarks",
    description:
      "Compare code editing and issue resolution. Check repository splits, test requirements, and the agent harness for each result.",
  },
  {
    key: "model_eval",
    slug: "model-tool-use",
    name: "General model and tool-use benchmarks",
    description:
      "Compare broader agent reasoning and tool use. These benchmarks cover different tasks, so read each metric and scope before using a rank.",
  },
];

export function getCategoryBenchmarks(category: BenchmarkCategoryPage) {
  return getAllBenchmarkPages().filter((page) => page.meta.category === category.key);
}
