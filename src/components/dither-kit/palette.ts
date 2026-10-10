// Shared seed palette for the dither chart family. Mirrors the seeds in
// `dither-chart.tsx` so a series rendered through the composable engine reads
// with the exact same fill / line / star hues as the legacy sparkline.

export type Rgb = [number, number, number];

export type DitherColor =
  | "steel"
  | "stone"
  | "warm"
  | "green"
  | "blue"
  | "purple"
  | "pink"
  | "orange"
  | "red"
  | "grey";

export type Seed = { fill: Rgb; line: Rgb; star: Rgb };

// Each seed: the area-fill hue, the bright series line, and the star sparkle.
export const PALETTE: Record<DitherColor, Seed> = {
  steel: { fill: [240, 192, 0], line: [240, 192, 0], star: [240, 192, 0] },
  stone: { fill: [161, 160, 154], line: [225, 225, 225], star: [225, 225, 225] },
  warm: { fill: [174, 135, 82], line: [217, 154, 53], star: [217, 154, 53] },
  green: { fill: [40, 210, 110], line: [150, 255, 180], star: [200, 255, 220] },
  blue: { fill: [53, 143, 243], line: [150, 200, 255], star: [205, 228, 255] },
  purple: {
    fill: [150, 110, 255],
    line: [200, 175, 255],
    star: [225, 210, 255],
  },
  pink: { fill: [240, 90, 190], line: [255, 170, 220], star: [255, 205, 235] },
  orange: {
    fill: [255, 150, 50],
    line: [255, 195, 130],
    star: [255, 220, 175],
  },
  red: { fill: [240, 70, 70], line: [255, 150, 140], star: [255, 195, 185] },
  // No-data: a muted grey so empty metrics read as "nothing here".
  grey: { fill: [92, 92, 100], line: [140, 140, 150], star: [165, 165, 175] },
};

export const rgb = ([r, g, b]: Rgb, k = 1, a = 1) =>
  `rgba(${Math.round(r * k)},${Math.round(g * k)},${Math.round(b * k)},${a})`;

export const seedOfColor = (color: DitherColor): Seed => PALETTE[color];

export const isDitherColor = (value: unknown): value is DitherColor =>
  typeof value === "string" && value in PALETTE;
