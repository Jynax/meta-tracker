// Examples:
// "PR #12" -> 1
// "PRs #2-4" -> 3
// "Backend PRs #3-4, Frontend PRs #11, #13" -> 4
// "PRs #189/#190/#191" -> 3
// "PR #167 shipped. Closed #167, opened #170." -> 2

const PR_LIST_REGEX =
  /\b(?:[A-Za-z]+\s+)?PRs?\s*((?:#?\d+(?:\s*[-\u2013]\s*#?\d+)?)(?:\s*(?:[,/+&]|\band\b)\s*#?\d+(?:\s*[-\u2013]\s*#?\d+)?)*)/gi;
const FOLLOWUP_PR_CONTEXT_REGEX = /\b(?:closed|opened|merged|rebased)\s+#(\d+)\b/gi;
const RANGE_REGEX = /#?(\d+)\s*[-\u2013]\s*#?(\d+)/g;
const NUMBER_REGEX = /#(\d+)/g;

export function extractPRNumbersInText(text?: string): Set<number> {
  const prs = new Set<number>();
  if (!text) return prs;

  const addList = (listText: string) => {
    for (const match of listText.matchAll(RANGE_REGEX)) {
      const start = Number(match[1]);
      const end = Number(match[2]);
      if (!Number.isFinite(start) || !Number.isFinite(end)) continue;
      const [lo, hi] = start <= end ? [start, end] : [end, start];
      for (let n = lo; n <= hi; n += 1) prs.add(n);
    }
    for (const match of listText.matchAll(NUMBER_REGEX)) {
      prs.add(Number(match[1]));
    }
  };

  for (const match of text.matchAll(PR_LIST_REGEX)) {
    addList(match[1] ?? '');
  }
  for (const match of text.matchAll(FOLLOWUP_PR_CONTEXT_REGEX)) {
    prs.add(Number(match[1]));
  }
  return prs;
}

export function countPRsInText(text?: string): number {
  return extractPRNumbersInText(text).size;
}
