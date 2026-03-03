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

export const bipCodeVolume: CodeVolumeEntry[] = [
  { session: 'ChatGPT 1', date: 'Feb 14', label: 'Scaffold & Cards', added: 1102, deleted: 89, net: 1013, total: 640 },
  { session: 'ChatGPT 2', date: 'Feb 15', label: 'Refactoring', added: 146, deleted: 231, net: -85, total: 585 },
  { session: 'ChatGPT 3', date: 'Feb 16', label: 'Data & Charts', added: 2230, deleted: 1043, net: 1187, total: 1330 },
  { session: 'ChatGPT 4', date: 'Feb 17', label: 'Representation', added: 4287, deleted: 1534, net: 2753, total: 3066 },
  { session: 'Cowork 1', date: 'Feb 21', label: 'Audit', added: 0, deleted: 0, net: 0, total: 3066 },
  { session: 'Cowork 2', date: 'Feb 22', label: 'Data Wrangling', added: 275, deleted: 8, net: 267, total: 3333 },
  { session: 'Cowork 3', date: 'Feb 25', label: 'Decomposition', added: 136, deleted: 570, net: -434, total: 2899 },
  { session: 'Cowork 4', date: 'Feb 26', label: 'Timeline', added: 173, deleted: 38, net: 135, total: 3034 },
];

export const bipSessions: SessionEntry[] = [
  {
    session: 'ChatGPT 1',
    duration: 2,
    prs: 2,
    decisions: 4,
    deadEnds: 0,
    focus: 'Initial Scaffold & Card Exports',
    chapterId: 'bip-spark',
  },
  {
    session: 'ChatGPT 2',
    duration: 1,
    prs: 1,
    decisions: 0,
    deadEnds: 0,
    focus: 'Refactoring & Cleanup',
    chapterId: 'bip-spark',
  },
  {
    session: 'ChatGPT 3',
    duration: 4,
    prs: 16,
    decisions: 8,
    deadEnds: 0,
    focus: 'Data Pipeline, Charts & Normalization',
    chapterId: 'bip-wrangling',
  },
  {
    session: 'ChatGPT 4',
    duration: 5,
    prs: 27,
    decisions: 6,
    deadEnds: 0,
    focus: 'Representation Engine & Polish',
    chapterId: 'bip-repr',
  },
  {
    session: 'Cowork 1',
    duration: 2,
    prs: 0,
    decisions: 3,
    deadEnds: 1,
    focus: 'Audit & Worker Fix',
    chapterId: 'bip-deploy',
  },
  {
    session: 'Cowork 2',
    duration: 3,
    prs: 1,
    decisions: 2,
    deadEnds: 0,
    focus: 'Multi-Sheet Ingestion',
    chapterId: 'bip-wrangling',
  },
  {
    session: 'Cowork 3',
    duration: 3,
    prs: 2,
    decisions: 3,
    deadEnds: 1,
    focus: 'App.tsx Decomposition',
    chapterId: 'bip-decomp',
  },
  {
    session: 'Cowork 4',
    duration: 2,
    prs: 4,
    decisions: 5,
    deadEnds: 2,
    focus: 'Timeline & Fixes',
    chapterId: 'bip-windows',
  },
];

export const bipDateRange = {
  start: 'Feb 2026',
  end: 'Feb 2026',
};

export const bipBugs: BugEntry[] = [
  {
    id: 1,
    summary: "Boolean 'f' globally truthy \u2014 corrupted representation data",
    severity: 'Critical',
    source: 'ChatGPT Code Review',
    status: 'Fixed',
    category: 'Technical',
  },
  {
    id: 2,
    summary: 'Worker debug redirect blocking app access',
    severity: 'High',
    source: 'Cowork Audit',
    status: 'Fixed',
    category: 'Technical',
  },
  {
    id: 3,
    summary: 'PR #18 merge conflict (29+ PRs behind)',
    severity: 'Medium',
    source: 'Code Review',
    status: "Won't Fix",
    category: 'Technical',
  },
  {
    id: 4,
    summary: 'parseAllDataSheets() possibly unused dead code',
    severity: 'Low',
    source: 'Cowork Code Review',
    status: 'Deferred',
    category: 'Technical',
  },
  {
    id: 5,
    summary: "'% All' section header showing 'Women'",
    severity: 'Medium',
    source: 'User Report',
    status: 'Fixed',
    category: 'Functional',
  },
  {
    id: 6,
    summary: 'Timeline renders as modal overlay (position:fixed)',
    severity: 'High',
    source: 'User Report',
    status: 'Fixed',
    category: 'UX',
  },
  {
    id: 7,
    summary: "Timeline doesn't auto-expand on view switch",
    severity: 'Medium',
    source: 'User Report',
    status: 'Fixed',
    category: 'UX',
  },
  {
    id: 8,
    summary: 'window.open() noopener severs sessionStorage',
    severity: 'High',
    source: 'Codex Auto-Review',
    status: 'Fixed',
    category: 'Technical',
  },
];

export const bipDerived: DerivedMetric[] = [
  { label: 'Churn Rate', value: '0.49', detail: 'Includes heavy refactoring', color: '#a78bfa' },
  { label: 'Codex Success', value: '88%', detail: '7/8 Cowork-era PRs', color: '#34d399' },
  { label: 'Cycle Time', value: '0.38h', detail: 'Per merged PR (all eras)', color: '#34d399' },
  { label: 'Decisions', value: '3.88', detail: 'Per session avg', color: '#22d3ee' },
  { label: 'Bug Rate', value: '0.15', detail: 'Per PR merged', color: '#fbbf24' },
];

export const bipStack: StackEntry[] = [
  { name: 'React 18', cat: 'Core' },
  { name: 'TypeScript', cat: 'Core' },
  { name: 'Vite', cat: 'Build' },
  { name: 'Tailwind CSS', cat: 'UI' },
  { name: 'Recharts', cat: 'UI' },
  { name: 'SheetJS (CDN)', cat: 'Utility' },
  { name: 'Cloudflare Pages', cat: 'Core' },
  { name: 'Cloudflare Workers', cat: 'Core' },
];
