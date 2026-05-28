import type { APIRoute, GetStaticPaths } from "astro";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { getAllBenchmarkPages } from "../../../lib/benchmark-hub";
import fs from "node:fs/promises";
import path from "node:path";

export const getStaticPaths: GetStaticPaths = async () => {
  const pages = getAllBenchmarkPages();
  const paths = [];
  for (const page of pages) {
    if (!Array.isArray(page.results)) continue;
    const seenRanks = new Set<number>();
    for (const result of page.results) {
      if (seenRanks.has(result.rank)) continue;
      seenRanks.add(result.rank);
      paths.push({
        params: {
          slug: page.meta.slug,
          rank: String(result.rank),
        },
      });
    }
  }
  return paths;
};

const BG = "#0f0f0f";
const BORDER = "#222";
const TEXT_STRONG = "#f7f7f7";
const ACCENT = "#30A46C";
const TEXT_MUTED = "#aeb6b0";
const MONO = "JetBrains Mono";

async function loadFont(weight: "Regular" | "Bold"): Promise<ArrayBuffer> {
  const file = await fs.readFile(path.resolve(`public/fonts/JetBrainsMono-${weight}.ttf`));
  return file.buffer as ArrayBuffer;
}

export const GET: APIRoute = async ({ params }) => {
  const pages = getAllBenchmarkPages();
  const page = pages.find((p) => p.meta.slug === params.slug);
  if (!page) return new Response("Not found", { status: 404 });

  const rank = Number(params.rank);
  const result = page.results.find((r) => r.rank === rank);
  if (!result) return new Response("Not found", { status: 404 });

  const logoPath = path.resolve("public/logo.png");
  let logoData: string | null = null;
  try {
    const buf = await fs.readFile(logoPath);
    logoData = `data:image/png;base64,${Buffer.from(buf).toString("base64")}`;
  } catch {
    logoData = null;
  }

  const logoNode = logoData
    ? {
        type: "img",
        props: { src: logoData, style: { width: "100px", height: "74px", objectFit: "contain" } },
      }
    : { type: "div", props: { style: { width: "100px", height: "74px" } } };

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          display: "flex",
          flexDirection: "column",
          width: "1200px",
          height: "1200px",
          background: BG,
          padding: "80px",
          fontFamily: MONO,
          boxSizing: "border-box",
          color: TEXT_STRONG,
        },
        children: [
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "100px",
              },
              children: [
                logoNode,
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: "30px",
                      color: ACCENT,
                      letterSpacing: "0.15em",
                      fontWeight: 800,
                    },
                    children: "STEEL.DEV®",
                  },
                },
              ],
            },
          },

          {
            type: "div",
            props: {
              style: { display: "flex", alignItems: "center", gap: "24px", marginBottom: "20px" },
              children: [
                {
                  type: "div",
                  props: { style: { width: "8px", height: "48px", background: ACCENT } },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: "32px",
                      color: ACCENT,
                      letterSpacing: "0.1em",
                      fontWeight: 700,
                      textTransform: "uppercase",
                    },
                    children: page.meta.name,
                  },
                },
              ],
            },
          },

          {
            type: "div",
            props: {
              style: {
                fontSize: "110px",
                fontWeight: "800",
                lineHeight: "0.9",
                letterSpacing: "-0.04em",
                marginBottom: "16px",
              },
              children: result.systemName,
            },
          },
          {
            type: "div",
            props: {
              style: { fontSize: "32px", color: TEXT_MUTED, marginBottom: "80px" },
              children: `by ${result.organization}`,
            },
          },

          {
            type: "div",
            props: {
              style: { display: "flex", borderTop: `1px solid ${BORDER}`, paddingTop: "60px" },
              children: [
                {
                  type: "div",
                  props: {
                    style: { display: "flex", flexDirection: "column", flex: 1 },
                    children: [
                      {
                        type: "div",
                        props: {
                          style: {
                            fontSize: "20px",
                            color: TEXT_MUTED,
                            textTransform: "uppercase",
                            letterSpacing: "0.2em",
                            marginBottom: "10px",
                          },
                          children: "Score",
                        },
                      },
                      {
                        type: "div",
                        props: {
                          style: {
                            fontSize: "180px",
                            fontWeight: "700",
                            color: TEXT_STRONG,
                            lineHeight: "1",
                          },
                          children: result.scoreDisplay,
                        },
                      },
                    ],
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                      paddingLeft: "40px",
                      borderLeft: `1px solid ${BORDER}`,
                    },
                    children: [
                      {
                        type: "div",
                        props: {
                          style: {
                            fontSize: "20px",
                            color: TEXT_MUTED,
                            textTransform: "uppercase",
                            letterSpacing: "0.2em",
                            marginBottom: "10px",
                          },
                          children: "Global Rank",
                        },
                      },
                      {
                        type: "div",
                        props: {
                          style: {
                            fontSize: "80px",
                            fontWeight: "700",
                            color: ACCENT,
                            lineHeight: "1",
                          },
                          children: `#${result.rank}`,
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },

          { type: "div", props: { style: { flex: 1 } } },

          {
            type: "div",
            props: {
              style: { display: "flex", justifyContent: "center" },
              children: [
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: "24px",
                      color: TEXT_MUTED,
                      fontWeight: "700",
                      letterSpacing: "0.05em",
                    },
                    children: "leaderboard.steel.dev",
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 1200,
      fonts: [
        { name: MONO, data: await loadFont("Regular"), weight: 400, style: "normal" },
        { name: MONO, data: await loadFont("Bold"), weight: 700, style: "normal" },
      ],
    }
  );

  const png = new Resvg(svg).render().asPng();
  return new Response(Uint8Array.from(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=604800, immutable",
    },
  });
};
