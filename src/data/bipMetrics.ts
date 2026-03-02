export interface CodeVolumeEntry {
  session: string;
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
  { session: 'Pre-Cowork', label: 'ChatGPT Era', added: 3066, deleted: 0, net: 3066, total: 3066 },
  { session: 'Session 1', label: 'Audit', added: 0, deleted: 0, net: 0, total: 3066 },
  { session: 'Session 2', label: 'Data Wrangling', added: 275, deleted: 8, net: 267, total: 3333 },
  { session: 'Session 3', label: 'Decomposition', added: 136, deleted: 570, net: -434, total: 2899 },
  { session: 'Session 4', label: 'Timeline', added: 173, deleted: 38, net: 135, total: 3034 },
];

export const bipSessions: SessionEntry[] = [
  {
    session: 'Session 1',
    duration: 2,
    prs: 0,
    decisions: 3,
    deadEnds: 1,
    focus: 'Audit & Worker Fix',
    chapterId: 'bip-deploy',
  },
  {
    session: 'Session 2',
    duration: 3,
    prs: 1,
    decisions: 2,
    deadEnds: 0,
    focus: 'Multi-Sheet Ingestion',
    chapterId: 'bip-wrangling',
  },
  {
    session: 'Session 3',
    duration: 3,
    prs: 2,
    decisions: 3,
    deadEnds: 1,
    focus: 'App.tsx Decomposition',
    chapterId: 'bip-decomp',
  },
  {
    session: 'Session 4',
    duration: 2,
    prs: 4,
    decisions: 5,
    deadEnds: 2,
    focus: 'Timeline & Fixes',
    chapterId: 'bip-windows',
  },
];

export const bipBugs: BugEntry[] = [
  {
    id: 1,
    summary: "Boolean 'f' globally truthy — corrupted representation data",
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
  { label: 'Churn Rate', value: '1.06', detail: 'Refactoring-heavy', color: '#a78bfa' },
  { label: 'Codex Success', value: '88%', detail: '7/8 clean PRs', color: '#34d399' },
  { label: 'Cycle Time', value: '1.4h', detail: 'Per merged PR', color: '#34d399' },
  { label: 'Decisions', value: '3.25', detail: 'Per session avg', color: '#22d3ee' },
  { label: 'Bug Rate', value: '1.14', detail: 'Per PR merged', color: '#fbbf24' },
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
