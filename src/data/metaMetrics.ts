export interface CodeVolumeEntry {
  session: string;
  date: string;
  label: string;
  added: number;
  deleted: number;
  net: number;
  total: number;
}

export interface SessionEntry {
  session: string;
  duration: number;
  prs: number;
  decisions: number;
  deadEnds: number;
  focus: string;
  chapterId: string;
}

export interface BugEntry {
  id: number;
  session: string;
  summary: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  source: string;
  status: string;
  category: 'Technical' | 'Functional' | 'UX';
}

export interface DerivedMetric {
  label: string;
  value: string;
  detail: string;
  color: string;
}

export interface StackEntry {
  name: string;
  cat: 'Core' | 'UI' | 'Build' | 'Utility';
}

export const metaCodeVolume: CodeVolumeEntry[] = [
  { session: 'Session 1', date: 'Feb 26', label: 'Scaffold & Auth', added: 862, deleted: 6, net: 856, total: 770 },
  { session: 'Session 2', date: 'Feb 26', label: 'Vertical Tree', added: 239, deleted: 265, net: -26, total: 744 },
  { session: 'Session 3', date: 'Feb 26', label: 'React Flow Rebuild', added: 438, deleted: 362, net: 76, total: 820 },
  { session: 'Session 4', date: 'Feb 27', label: 'Overlap & Filters', added: 157, deleted: 37, net: 120, total: 940 },
  { session: 'Session 5', date: 'Feb 28', label: 'Layout Refactor', added: 202, deleted: 141, net: 61, total: 1000 },
  { session: 'Session 7', date: 'Feb 28', label: 'Data Model Alignment', added: 671, deleted: 289, net: 382, total: 1382 },
  { session: 'Session 8', date: 'Mar 2', label: 'Spine Fix & Dashboard', added: 650, deleted: 41, net: 609, total: 1991 },
  { session: 'Session 9', date: 'Mar 2', label: 'UX Polish', added: 432, deleted: 104, net: 328, total: 2319 },
  { session: 'Session 10', date: 'Mar 2', label: 'Data Verification', added: 10, deleted: 10, net: 0, total: 2319 },
  { session: 'Session 11', date: 'Mar 2', label: 'Data Scrape', added: 0, deleted: 0, net: 0, total: 2319 },
  { session: 'Session 12', date: 'Mar 3', label: 'Dashboard Data Overhaul', added: 515, deleted: 117, net: 398, total: 2717 },
  { session: 'Session 13', date: 'Mar 3', label: 'Stacked Tree View', added: 714, deleted: 74, net: 640, total: 3357 },
];

export const metaSessions: SessionEntry[] = [
  {
    session: 'Session 1',
    duration: 3,
    prs: 4,
    decisions: 3,
    deadEnds: 0,
    focus: 'Scaffold, deploy, auth setup',
    chapterId: 'meta-ch-inception',
  },
  {
    session: 'Session 2',
    duration: 2,
    prs: 2,
    decisions: 4,
    deadEnds: 0,
    focus: 'Vertical tree exploration',
    chapterId: 'meta-ch-horizontal',
  },
  {
    session: 'Session 3',
    duration: 3,
    prs: 4,
    decisions: 5,
    deadEnds: 1,
    focus: 'React Flow rebuild',
    chapterId: 'meta-ch-horizontal',
  },
  {
    session: 'Session 4',
    duration: 2,
    prs: 3,
    decisions: 3,
    deadEnds: 0,
    focus: 'Overlap fix, category filter',
    chapterId: 'meta-ch-layout-overhaul',
  },
  {
    session: 'Session 5',
    duration: 3,
    prs: 4,
    decisions: 4,
    deadEnds: 2,
    focus: 'Vertical layout, spacing tuning',
    chapterId: 'meta-ch-spacing-wars',
  },
  {
    session: 'Session 7',
    duration: 3,
    prs: 5,
    decisions: 8,
    deadEnds: 0,
    focus: 'Type system, multi-project, alternating layout',
    chapterId: 'meta-ch-data-alignment',
  },
  {
    session: 'Session 8',
    duration: 3,
    prs: 4,
    decisions: 7,
    deadEnds: 0,
    focus: 'Spine fix, dashboard infrastructure',
    chapterId: 'meta-ch-spine-dashboard',
  },
  {
    session: 'Session 9',
    duration: 2,
    prs: 5,
    decisions: 6,
    deadEnds: 0,
    focus: 'Dashboard UX Polish',
    chapterId: 'meta-ch-ux-polish',
  },
  {
    session: 'Session 10',
    duration: 1,
    prs: 2,
    decisions: 1,
    deadEnds: 0,
    focus: 'Data verification & fixes via GitHub API',
    chapterId: 'meta-ch-ux-polish',
  },
  {
    session: 'Session 11',
    duration: 3,
    prs: 4,
    decisions: 0,
    deadEnds: 0,
    focus: 'Data scrape: BIP Pre-Cowork + Remnants bootstrap',
    chapterId: 'meta-ch-ux-polish',
  },
  {
    session: 'Session 12',
    duration: 3,
    prs: 4,
    decisions: 3,
    deadEnds: 0,
    focus: 'Wire Remnants, date-grouped charts, code review + 4 bugs found/fixed',
    chapterId: 'meta-ch-dashboard-data-overhaul',
  },
  {
    session: 'Session 13',
    duration: 3,
    prs: 3,
    decisions: 3,
    deadEnds: 0,
    focus: 'StackedTreeView component, stacked/canvas toggle, parity polish',
    chapterId: 'meta-ch-stacked-tree-view',
  },
];

export const metaDateRange = { start: 'Feb 2026', end: 'Mar 2026' };
export const dateRange = { start: 'Feb 2026', end: 'Mar 2026' };

export const metaBugs: BugEntry[] = [
  {
    id: 1,
    session: 'Session 1',
    summary: 'Tailwind CSS not rendering \u2014 missing @tailwindcss/vite plugin',
    severity: 'High',
    source: 'Testing',
    status: 'Fixed',
    category: 'Technical',
  },
  {
    id: 2,
    session: 'Session 1',
    summary: 'Auth atob crash on malformed Base64',
    severity: 'Medium',
    source: 'Code Review',
    status: 'Fixed',
    category: 'Technical',
  },
  {
    id: 3,
    session: 'Session 1',
    summary: 'Auth scheme case-sensitivity rejecting valid requests',
    severity: 'Low',
    source: 'Code Review',
    status: 'Fixed',
    category: 'Technical',
  },
  {
    id: 4,
    session: 'Session 2',
    summary: 'tsconfig.node.json misconfiguration',
    severity: 'Low',
    source: 'Codex Auto-Review',
    status: 'Deferred',
    category: 'Technical',
  },
  {
    id: 5,
    session: 'Session 3',
    summary: 'Codex stub files breaking Cloudflare build',
    severity: 'High',
    source: 'Testing',
    status: 'Fixed',
    category: 'Technical',
  },
  {
    id: 6,
    session: 'Session 3',
    summary: 'React Flow CSS layer ordering conflict with Tailwind v4',
    severity: 'Medium',
    source: 'Testing',
    status: 'Fixed',
    category: 'Technical',
  },
  {
    id: 7,
    session: 'Session 3',
    summary: '@xyflow/react v12 import syntax (named vs default)',
    severity: 'Medium',
    source: 'Testing',
    status: 'Fixed',
    category: 'Technical',
  },
  {
    id: 8,
    session: 'Session 5',
    summary: 'Node overlap when multiple phases expanded',
    severity: 'High',
    source: 'User Report',
    status: 'Fixed',
    category: 'UX',
  },
  {
    id: 9,
    session: 'Session 5',
    summary: 'Unicode escape sequences rendering as literal text',
    severity: 'Medium',
    source: 'User Report',
    status: 'Fixed',
    category: 'Technical',
  },
  {
    id: 10,
    session: 'Session 7',
    summary: 'Codex task reverted earlier spacing fix',
    severity: 'Medium',
    source: 'User Report',
    status: 'Fixed',
    category: 'Technical',
  },
  {
    id: 11,
    session: 'Session 7',
    summary: 'Node overlap when descriptions expand (fixed 60px insufficient)',
    severity: 'Medium',
    source: 'User Report',
    status: 'Fixed',
    category: 'UX',
  },
  {
    id: 12,
    session: 'Session 7',
    summary: 'Thick/doubled root-to-chapter line (smoothstep artifact)',
    severity: 'Low',
    source: 'User Report',
    status: 'Fixed',
    category: 'UX',
  },
  {
    id: 13,
    session: 'Session 8',
    summary: 'Vertical spine edge clips through left-side child nodes',
    severity: 'Medium',
    source: 'User Report',
    status: 'Fixed',
    category: 'UX',
  },
  {
    id: 14,
    session: 'Session 9',
    summary: 'Session bar chart renders 6px min bar for zero values (misleading visual)',
    severity: 'Low',
    source: 'Cowork Code Review',
    status: 'Fixed',
    category: 'UX',
  },
  {
    id: 15,
    session: 'Session 9',
    summary: 'Net Change chart includes zero-activity sessions that Lines Added filters out',
    severity: 'Low',
    source: 'Cowork Code Review',
    status: 'Fixed',
    category: 'Functional',
  },
  {
    id: 16,
    session: 'Session 10',
    summary: 'Net Change label missing toLocaleString formatting',
    severity: 'Low',
    source: 'Cowork Code Review',
    status: 'Fixed',
    category: 'UX',
  },
  {
    id: 17,
    session: 'Session 11',
    summary: 'Variable shadowing: isDateExpandable redefined in nested scope',
    severity: 'Low',
    source: 'Cowork Code Review',
    status: 'Fixed',
    category: 'Technical',
  },
  {
    id: 18,
    session: 'Session 12',
    summary: 'metaMetrics.ts stray line prepended — Session 12 entry placed at file start instead of sessions array',
    severity: 'High',
    source: 'Cowork Code Review',
    status: 'Fixed',
    category: 'Technical',
  },
  {
    id: 19,
    session: 'Session 13',
    summary: 'StackedTreeView category filter not working — nodeMatchesFilter only checked node.type',
    severity: 'Medium',
    source: 'Cowork Code Review',
    status: 'Fixed',
    category: 'Functional',
  },
  {
    id: 20,
    session: 'Session 13',
    summary: 'Duplicate summary bar + filter UI in stacked mode',
    severity: 'Medium',
    source: 'Cowork Code Review',
    status: 'Fixed',
    category: 'UX',
  },
  {
    id: 21,
    session: 'Session 13',
    summary: 'formatCategory returns UX Design instead of UX/Design (missing slash)',
    severity: 'Low',
    source: 'Cowork Code Review',
    status: 'Fixed',
    category: 'UX',
  },
];

export const metaDerived: DerivedMetric[] = [
  { label: 'Churn Rate', value: '0.30', detail: 'Session 13 parity refactoring', color: '#34d399' },
  { label: 'Codex Success', value: '97%', detail: '37/38 tasks', color: '#34d399' },
  { label: 'Cycle Time', value: '0.71h', detail: 'Per merged PR', color: '#22d3ee' },
  { label: 'Decisions', value: '3.9', detail: 'Per session avg', color: '#22d3ee' },
  { label: 'Bug Rate', value: '0.51', detail: 'Per PR merged', color: '#34d399' },
];

export const metaStack: StackEntry[] = [
  { name: 'React', cat: 'Core' },
  { name: 'TypeScript', cat: 'Core' },
  { name: 'Vite', cat: 'Build' },
  { name: 'Tailwind CSS v4', cat: 'UI' },
  { name: '@xyflow/react v12', cat: 'UI' },
  { name: 'Cloudflare Pages', cat: 'Core' },
];
