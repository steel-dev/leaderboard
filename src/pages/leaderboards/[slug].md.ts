// ABOUTME: Per-benchmark markdown sibling served at /leaderboards/<slug>.md.
// ABOUTME: Mirrors the benchmark page content for AI agents and markdown consumers.

import type { APIRoute, GetStaticPaths } from "astro";
import {
  getAllBenchmarkPages,
  getBenchmarkPage,
  renderBenchmarkMarkdown,
} from "../../lib/benchmark-hub";

export const getStaticPaths: GetStaticPaths = () => {
  return getAllBenchmarkPages().map((page) => ({
    params: { slug: page.meta.slug },
  }));
};

export const GET: APIRoute = ({ params }) => {
  const slug = params.slug;
  if (!slug) {
    return new Response("Not found", { status: 404 });
  }
  const page = getBenchmarkPage(slug);
  if (!page) {
    return new Response("Not found", { status: 404 });
  }

  const body = renderBenchmarkMarkdown(page, { headingLevel: 1 });

  return new Response(`${body}\n`, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
};
