import type { APIRoute, GetStaticPaths } from "astro";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { getAllBenchmarkPages } from "../../lib/benchmark-hub";
import fs from "node:fs/promises";
import path from "node:path";

export const getStaticPaths: GetStaticPaths = async () => {
  const pages = getAllBenchmarkPages();
  return [{ params: { slug: "home" } }, ...pages.map((p) => ({ params: { slug: p.meta.slug } }))];
};

const BG = "#0f0f0f";
const BORDER = "#222";
const TEXT_STRONG = "#f7f7f7";
const ACCENT = "#30A46C";
const MONO = "JetBrains Mono";
const TEXT_MUTED = "#aeb6b0";

async function loadFont(weight: "Regular" | "Bold"): Promise<ArrayBuffer> {
  const file = await fs.readFile(path.resolve(`public/fonts/JetBrainsMono-${weight}.ttf`));
  return file.buffer as ArrayBuffer;
}

export const GET: APIRoute = async ({ params }) => {
  const pages = getAllBenchmarkPages();

  let benchmarkName: string;
  let top3: { rank: number; systemName: string; organization: string; scoreDisplay: string }[];

  if (params.slug === "home") {
    benchmarkName = "AI Agent Leaderboards";
    top3 = pages.slice(0, 3).map((p, i) => ({
      rank: i + 1,
      systemName: p.meta.name,
      organization: p.meta.category,
      scoreDisplay: p.results[0]?.scoreDisplay ?? "—",
    }));
  } else {
    const page = pages.find((p) => p.meta.slug === params.slug);
    if (!page) return new Response("Not found", { status: 404 });
    benchmarkName = page.meta.name;
    top3 = page.results.slice(0, 3);
  }

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
        props: {
          src: logoData,
          style: { width: "120px", height: "88px", borderRadius: "6px", objectFit: "contain" },
        },
      }
    : {
        type: "div",
        props: {
          style: { width: "120px", height: "88px", background: "transparent", borderRadius: "6px" },
        },
      };

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          display: "flex",
          flexDirection: "column",
          width: "1200px",
          height: "630px",
          background: BG,
          padding: "72px 84px",
          fontFamily: MONO,
          boxSizing: "border-box",
          border: `1px solid ${BORDER}`,
        },
        children: [
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "20px",
                marginBottom: "40px",
              },
              children: [
                logoNode,
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: "30px",
                      color: ACCENT,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
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
              style: { display: "flex", gap: "16px", marginBottom: "36px" },
              children: [
                {
                  type: "div",
                  props: {
                    style: {
                      width: "3px",
                      background: ACCENT,
                      borderRadius: "2px",
                      alignSelf: "stretch",
                    },
                  },
                },
                {
                  type: "div",
                  props: {
                    style: { display: "flex", flexDirection: "column", gap: "6px" },
                    children: [
                      {
                        type: "div",
                        props: {
                          style: {
                            fontSize: "14px",
                            color: TEXT_MUTED,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                          },
                          children: "leaderboard",
                        },
                      },
                      {
                        type: "div",
                        props: {
                          style: {
                            fontSize: "64px",
                            fontWeight: "700",
                            color: TEXT_STRONG,
                            lineHeight: "1",
                          },
                          children: benchmarkName,
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            type: "div",
            props: { style: { height: "1px", background: BORDER, marginBottom: "20px" } },
          },

          {
            type: "div",
            props: {
              style: {
                display: "flex",
                fontSize: "13px",
                color: "#444",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: "16px",
              },
              children: [
                { type: "div", props: { style: { width: "80px" }, children: "rank" } },
                { type: "div", props: { style: { flex: "1" }, children: "system" } },
                { type: "div", props: { style: { width: "220px" }, children: "org" } },
                {
                  type: "div",
                  props: { style: { width: "120px", textAlign: "right" }, children: "score" },
                },
              ],
            },
          },

          ...top3.map((row) => ({
            type: "div",
            props: {
              style: { display: "flex", alignItems: "center", marginBottom: "22px" },
              children: [
                {
                  type: "div",
                  props: {
                    style: {
                      width: "80px",
                      fontSize: "16px",
                      color: row.rank === 1 ? ACCENT : TEXT_MUTED,
                      fontWeight: row.rank === 1 ? "700" : "400",
                    },
                    children: `#${row.rank}`,
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      flex: "1",
                      fontSize: "22px",
                      color: TEXT_STRONG,
                      fontWeight: row.rank === 1 ? "700" : "400",
                    },
                    children: row.systemName,
                  },
                },
                {
                  type: "div",
                  props: {
                    style: { width: "220px", fontSize: "16px", color: TEXT_MUTED },
                    children: row.organization,
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      width: "120px",
                      fontSize: "22px",
                      color: row.rank === 1 ? ACCENT : TEXT_STRONG,
                      fontWeight: row.rank === 1 ? "700" : "400",
                      textAlign: "right",
                    },
                    children: row.scoreDisplay,
                  },
                },
              ],
            },
          })),
          {
            type: "div",
            props: {
              style: { marginTop: "auto", height: "1px", background: BORDER, marginBottom: "16px" },
            },
          },
          {
            type: "div",
            props: {
              style: { fontSize: "12px", color: TEXT_MUTED, alignSelf: "center", fontWeight: 700 },
              children: `leaderboard.steel.dev`,
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: MONO, data: await loadFont("Regular"), weight: 400, style: "normal" },
        { name: MONO, data: await loadFont("Bold"), weight: 700, style: "normal" },
      ],
    }
  );

  if (params.slug === "home") {
    const allPages = getAllBenchmarkPages();
    const benchmarkCount = allPages.length;

    const svg = await satori(
      {
        type: "div",
        props: {
          style: {
            display: "flex",
            flexDirection: "column",
            width: "1200px",
            height: "630px",
            background: BG,
            padding: "64px 72px",
            fontFamily: MONO,
            boxSizing: "border-box",
            border: `1px solid ${BORDER}`,
          },
          children: [
            {
              type: "div",
              props: {
                style: {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "20px",
                  marginBottom: "60px",
                },
                children: [
                  logoData
                    ? {
                        type: "img",
                        props: {
                          src: logoData,
                          style: { width: "120px", height: "88px", objectFit: "contain" },
                        },
                      }
                    : { type: "div", props: { style: { width: "36px", height: "26px" } } },
                  {
                    type: "div",
                    props: {
                      style: {
                        fontSize: "30px",
                        color: ACCENT,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
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
                style: {
                  width: "180px",
                  height: "3px",
                  background: ACCENT,
                  borderRadius: "2px",
                  marginBottom: "28px",
                },
              },
            },

            {
              type: "div",
              props: {
                style: {
                  fontSize: "72px",
                  fontWeight: "700",
                  color: TEXT_STRONG,
                  lineHeight: "1.05",
                  marginBottom: "8px",
                },
                children: "Browser Agent",
              },
            },
            {
              type: "div",
              props: {
                style: {
                  fontSize: "72px",
                  fontWeight: "700",
                  color: TEXT_STRONG,
                  lineHeight: "1.05",
                  marginBottom: "28px",
                },
                children: "Leaderboards",
              },
            },

            {
              type: "div",
              props: {
                style: { fontSize: "18px", color: TEXT_MUTED, marginBottom: "32px" },
                children:
                  "Track the best-performing AI agents across browser, computer use, coding & research.",
              },
            },

            {
              type: "div",
              props: {
                style: { display: "flex", gap: "10px", flexWrap: "wrap" },
                children: [
                  "Browser agents",
                  "Computer use",
                  "Coding",
                  "Research",
                  "Model evals",
                ].map((label) => ({
                  type: "div",
                  props: {
                    style: {
                      fontSize: "12px",
                      color: TEXT_STRONG,
                      background: "#0b0b0b",
                      border: `1px solid ${ACCENT}`,
                      borderRadius: "4px",
                      padding: "6px 14px",
                      letterSpacing: "0.04em",
                      fontWeight: 700,
                    },
                    children: label,
                  },
                })),
              },
            },

            { type: "div", props: { style: { flex: "1" } } },

            {
              type: "div",
              props: { style: { height: "1px", background: "#1a1a1a", marginBottom: "18px" } },
            },
            {
              type: "div",
              props: {
                style: { display: "flex", justifyContent: "space-between", fontSize: "12px" },
                children: [
                  {
                    type: "div",
                    props: {
                      style: { color: "#abababff" },
                      children: `${benchmarkCount} benchmarks · sourced & maintained by STEEL.DEV®`,
                    },
                  },
                  {
                    type: "div",
                    props: {
                      style: { color: ACCENT, fontWeight: 700 },
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
        height: 630,
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
  }

  const png = new Resvg(svg).render().asPng();

  return new Response(Uint8Array.from(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=604800, immutable",
    },
  });
};
