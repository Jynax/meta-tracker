// src/utils/brushUtils.ts

/**
 * Calculate which x-axis labels to show to prevent overlap.
 * Returns an array of booleans — true = show this label.
 */
export function thinLabels(labels: string[], maxVisible: number): boolean[] {
  if (labels.length <= maxVisible) return labels.map(() => true);
  const interval = Math.ceil(labels.length / maxVisible);
  return labels.map((_, i) => i % interval === 0 || i === labels.length - 1);
}

/**
 * Calculate the default visible window for dense charts.
 * Returns [startIndex, endIndex] showing the last `windowSize` items.
 */
export function defaultWindow(totalPoints: number, windowSize = 30): [number, number] {
  const start = Math.max(0, totalPoints - windowSize);
  return [start, totalPoints - 1];
}
