export type ChartRevision = { data: unknown; token: number; revision: number };

function isPlainRow(value: unknown): value is Record<PropertyKey, unknown> {
  if (typeof value !== "object" || value === null) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

/** Compare immutable chart rows without serializing or traversing nested values.
 * Other input shapes and accessor properties conservatively replay. */
function sameChartRows(previous: unknown, next: unknown): boolean {
  if (Object.is(previous, next)) return true;
  if (!Array.isArray(previous) || !Array.isArray(next) || previous.length !== next.length)
    return false;
  for (let index = 0; index < previous.length; index++) {
    if (!(index in previous) || !(index in next)) return false;
    const row = previous[index];
    const other = next[index];
    if (Object.is(row, other)) continue;
    if (!isPlainRow(row) || !isPlainRow(other)) return false;
    const keys = Reflect.ownKeys(row);
    if (keys.length !== Reflect.ownKeys(other).length) return false;
    const unchanged = keys.every((key) => {
      const before = Object.getOwnPropertyDescriptor(row, key);
      const after = Object.getOwnPropertyDescriptor(other, key);
      return (
        before !== undefined &&
        after !== undefined &&
        "value" in before &&
        "value" in after &&
        Object.is(before.value, after.value)
      );
    });
    if (!unchanged) return false;
  }
  return true;
}

/** Track the latest input reference even when its values need no entrance replay.
 * Explicit replay-token changes always advance the animation revision. */
export function nextChartRevision(
  previous: ChartRevision,
  data: unknown,
  token: number
): ChartRevision {
  if (Object.is(previous.data, data) && Object.is(previous.token, token)) return previous;
  return {
    data,
    token,
    revision:
      previous.revision +
      (!Object.is(previous.token, token) || !sameChartRows(previous.data, data) ? 1 : 0),
  };
}
