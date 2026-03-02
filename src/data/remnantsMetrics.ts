import type { CodeVolumeEntry, SessionEntry, BugEntry, DerivedMetric, StackEntry } from './bipMetrics';

// --- Code Volume ---
export const remnantsCodeVolume: CodeVolumeEntry[] = [
  { session: 'Claude 1', label: 'Vertical Slice', added: 850, deleted: 0, net: 850, total: 850 },
  { session: 'Claude 2', label: 'Balance & Xenoflora', added: 0, deleted: 0, net: 0, total: 850 },
  { session: 'Claude 3', label: 'Home Base & Recovery', added: 0, deleted: 0, net: 0, total: 850 },
  { session: 'Git Setup', label: 'Repo Init + Docs', added: 4131, deleted: 2, net: 4129, total: 4129 },
  { session: 'Codex 1', label: 'Launcher & Deploy', added: 680, deleted: 38, net: 642, total: 4771 },
  { session: 'Legacy Port', label: 'Source Restructure', added: 4038, deleted: 4131, net: -93, total: 4678 },
];

// --- Sessions ---
export const remnantsSessions: SessionEntry[] = [
  { session: 'Claude 1', duration: 0, prs: 0, decisions: 4, deadEnds: 0, focus: 'Vertical slice: map, combat, inventory, extraction', chapterId: 'ch-core-loop' },
  { session: 'Claude 2', duration: 0, prs: 0, decisions: 3, deadEnds: 0, focus: 'Balance, terrain, xenoflora, zone difficulty', chapterId: 'ch-living-world' },
  { session: 'Claude 3', duration: 0, prs: 0, decisions: 3, deadEnds: 0, focus: 'Home base, recovery system, character naming', chapterId: 'ch-the-house' },
  { session: 'Git Setup', duration: 1, prs: 0, decisions: 1, deadEnds: 0, focus: 'Created repos, uploaded docs + code', chapterId: 'ch-repo-deployment' },
  { session: 'Codex 1', duration: 1, prs: 3, decisions: 1, deadEnds: 0, focus: 'Launcher, README, deploy fix', chapterId: 'ch-repo-deployment' },
];

// --- Date Range ---
export const remnantsDateRange = {
  start: 'Feb 2025',
  end: 'Feb 2025',
};

// --- Bugs ---
export const remnantsBugs: BugEntry[] = [
  { id: 1, summary: 'Navigation unclear in first playtest', severity: 'Medium', source: 'Playtest', status: 'Fixed (minimap + compass)', category: 'UX' },
  { id: 2, summary: 'Visual elements too small in Claude side panel', severity: 'Low', source: 'Playtest', status: 'Noted', category: 'UX' },
  { id: 3, summary: 'Inventory limit (4 slots) felt too restrictive', severity: 'Medium', source: 'Playtest', status: 'By Design', category: 'UX' },
  { id: 4, summary: 'Deploy button not responding on GitHub Pages', severity: 'High', source: 'Codex Testing', status: 'Fixed (PR #3)', category: 'Technical' },
];

// --- Derived Metrics ---
export const remnantsDerived: DerivedMetric[] = [
  { label: 'Churn Rate', value: '0.43', detail: 'Repo restructuring inflates deletions', color: '#f59e0b' },
  { label: 'Codex Success', value: '100%', detail: '2/2 tasks successful', color: '#10b981' },
  { label: 'Avg Cycle Time', value: '0.33 hrs/PR', detail: 'Codex 1 only (3 PRs in ~1 hr)', color: '#6366f1' },
  { label: 'Decision Density', value: '2.4/session', detail: '12 decisions across 5 sessions', color: '#8b5cf6' },
  { label: 'Bug Discovery', value: '1.33/PR', detail: '4 bugs across 3 PRs', color: '#ef4444' },
];

// --- Stack ---
export const remnantsStack: StackEntry[] = [
  { name: 'React 18', cat: 'Core' },
  { name: 'HTML5 Canvas', cat: 'Core' },
  { name: 'JavaScript (ES6+)', cat: 'Core' },
  { name: 'Python (launcher)', cat: 'Utility' },
  { name: 'GitHub Pages', cat: 'Build' },
];
