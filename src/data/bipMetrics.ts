export type SessionTool = 'Claude Code' | 'Codex' | 'Cowork' | 'Mixed';

export type WorkCategory = 'Feature' | 'Refactor' | 'Bug' | 'Tooling' | 'Scripting' | 'Data' | 'Local-Tooling' | 'Planning';

export interface CodeVolumeEntry {
  session: string;
  date: string;
  label: string;
  added: number;
  deleted: number;
  net: number;
  total: number;
}

export type SessionPhase = 'Research' | 'Spec' | 'Build' | 'Review';
export type SessionDriver = 'human' | 'ai' | 'collaborative';
export type SessionOperator = 'michael' | 'hrpatel' | 'joint';

export interface SessionEntry {
  session: string;
  date: string;
  label: string;
  duration: number;
  prs: number;
  decisions: number;
  deadEnds: number;
  focus: string;
  chapterId: string;
  workCategory: WorkCategory;
  tool: SessionTool;
  taskCount: number;
  phase?: SessionPhase;
  driver?: SessionDriver;
  operator?: SessionOperator;
}

export interface BugEntry {
  id: number;
  session: string;
  date: string;
  label: string;
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
  { session: 'Cowork 13', date: 'Mar 4', label: 'Deep Decomposition', added: 1797, deleted: 1380, net: 417, total: 3451 },
  { session: 'Claude Code 2', date: 'Mar 5', label: 'State Extraction', added: 1470, deleted: 1124, net: 346, total: 3797 },
  { session: 'Claude Code 4', date: 'Mar 5', label: 'Messy Ingestion', added: 277, deleted: 0, net: 277, total: 4074 },
  { session: 'Claude Code 4', date: 'Mar 5', label: 'Bug Fixes #08-10', added: 51, deleted: 52, net: -1, total: 4073 },
  { session: 'Claude Code 5', date: 'Mar 5', label: 'React.memo', added: 61, deleted: 50, net: 11, total: 4084 },
  { session: 'Claude Code 5', date: 'Mar 5', label: 'Export Cleaned', added: 62, deleted: 4, net: 58, total: 4142 },
  { session: 'Claude Code 5', date: 'Mar 5', label: 'Code Review', added: 42, deleted: 102, net: -60, total: 4082 },
];

export const bipSessions: SessionEntry[] = [
  {
    session: 'ChatGPT 1',
    date: 'Feb 14',
    label: 'Scaffold & Cards',
    duration: 2,
    prs: 2,
    decisions: 4,
    deadEnds: 0,
    focus: 'Initial Scaffold & Card Exports',
    chapterId: 'bip-spark',
    workCategory: 'Feature', tool: 'Cowork', taskCount: 1,
    phase: 'Build',
    driver: 'collaborative',
  },
  {
    session: 'ChatGPT 2',
    date: 'Feb 15',
    label: 'Refactoring',
    duration: 1,
    prs: 1,
    decisions: 0,
    deadEnds: 0,
    focus: 'Refactoring & Cleanup',
    chapterId: 'bip-spark',
    workCategory: 'Refactor', tool: 'Cowork', taskCount: 1,
    phase: 'Build',
    driver: 'collaborative',
  },
  {
    session: 'ChatGPT 3',
    date: 'Feb 16',
    label: 'Data & Charts',
    duration: 4,
    prs: 16,
    decisions: 8,
    deadEnds: 0,
    focus: 'Data Pipeline, Charts & Normalization',
    chapterId: 'bip-wrangling',
    workCategory: 'Feature', tool: 'Cowork', taskCount: 1,
    phase: 'Build',
    driver: 'collaborative',
  },
  {
    session: 'ChatGPT 4',
    date: 'Feb 17',
    label: 'Representation',
    duration: 5,
    prs: 27,
    decisions: 6,
    deadEnds: 0,
    focus: 'Representation Engine & Polish',
    chapterId: 'bip-repr',
    workCategory: 'Feature', tool: 'Cowork', taskCount: 1,
    phase: 'Build',
    driver: 'collaborative',
  },
  {
    session: 'Cowork 1',
    date: 'Feb 21',
    label: 'Audit',
    duration: 2,
    prs: 0,
    decisions: 3,
    deadEnds: 1,
    focus: 'Audit & Worker Fix',
    chapterId: 'bip-deploy',
    workCategory: 'Tooling', tool: 'Cowork', taskCount: 2,
    phase: 'Review',
    driver: 'ai',
  },
  {
    session: 'Cowork 2',
    date: 'Feb 22',
    label: 'Data Wrangling',
    duration: 3,
    prs: 1,
    decisions: 2,
    deadEnds: 0,
    focus: 'Multi-Sheet Ingestion',
    chapterId: 'bip-wrangling',
    workCategory: 'Feature', tool: 'Cowork', taskCount: 1,
    phase: 'Build',
    driver: 'ai',
  },
  {
    session: 'Cowork 3',
    date: 'Feb 25',
    label: 'Decomposition',
    duration: 3,
    prs: 2,
    decisions: 3,
    deadEnds: 1,
    focus: 'App.tsx Decomposition',
    chapterId: 'bip-decomp',
    workCategory: 'Refactor', tool: 'Cowork', taskCount: 2,
    phase: 'Build',
    driver: 'ai',
  },
  {
    session: 'Cowork 4',
    date: 'Feb 26',
    label: 'Timeline',
    duration: 2,
    prs: 4,
    decisions: 5,
    deadEnds: 2,
    focus: 'Timeline & Fixes',
    chapterId: 'bip-windows',
    workCategory: 'Feature', tool: 'Cowork', taskCount: 2,
    phase: 'Build',
    driver: 'ai',
  },
  {
    session: 'Cowork 13',
    date: 'Mar 4',
    label: 'Deep Decomposition',
    duration: 2,
    prs: 1,
    decisions: 1,
    deadEnds: 0,
    focus: 'Deep App.tsx Decomposition',
    chapterId: 'bip-decomp',
    workCategory: 'Refactor', tool: 'Cowork', taskCount: 1,
    phase: 'Build',
    driver: 'ai',
  },
  {
    session: 'Claude Code 2',
    date: 'Mar 5',
    label: 'State Extraction',
    duration: 3,
    prs: 2,
    decisions: 4,
    deadEnds: 0,
    focus: 'ThemeContext + 5 Hooks + ErrorBoundary',
    chapterId: 'ch-state-extraction',
    workCategory: 'Refactor', tool: 'Claude Code', taskCount: 3,
    phase: 'Build',
    driver: 'ai',
  },
  {
    session: 'Claude Code 4',
    date: 'Mar 5',
    label: 'Messy Ingestion + Bugs',
    duration: 2,
    prs: 2,
    decisions: 1,
    deadEnds: 0,
    focus: 'BIP Auto-Cleaning + Bug Fixes #08-12',
    chapterId: 'ch-messy-ingestion',
    workCategory: 'Feature', tool: 'Claude Code', taskCount: 2,
    phase: 'Build',
    driver: 'ai',
  },
  {
    session: 'Claude Code 5',
    date: 'Mar 5',
    label: 'Memo + Export + Review',
    duration: 2,
    prs: 3,
    decisions: 0,
    deadEnds: 0,
    focus: 'React.memo, Export Cleaned File, Code Review & Cleanup',
    chapterId: 'ch-perf-review',
    workCategory: 'Refactor', tool: 'Claude Code', taskCount: 3,
    phase: 'Review',
    driver: 'ai',
  },
];

export const bipDateRange = {
  start: 'Feb 2026',
  end: 'Mar 2026',
};

export const bipBugs: BugEntry[] = [
  {
    id: 1,
    session: 'ChatGPT 4',
    date: 'Feb 17',
    label: 'Representation',
    summary: "Boolean 'f' globally truthy \u2014 corrupted representation data",
    severity: 'Critical',
    source: 'ChatGPT Code Review',
    status: 'Fixed',
    category: 'Technical',
  },
  {
    id: 2,
    session: 'Cowork 1',
    date: 'Feb 21',
    label: 'Audit',
    summary: 'Worker debug redirect blocking app access',
    severity: 'High',
    source: 'Cowork Audit',
    status: 'Fixed',
    category: 'Technical',
  },
  {
    id: 3,
    session: 'Cowork 3',
    date: 'Feb 25',
    label: 'Decomposition',
    summary: 'PR #18 merge conflict (29+ PRs behind)',
    severity: 'Medium',
    source: 'Code Review',
    status: "Won't Fix",
    category: 'Technical',
  },
  {
    id: 4,
    session: 'Cowork 3',
    date: 'Feb 25',
    label: 'Decomposition',
    summary: 'parseAllDataSheets() possibly unused dead code',
    severity: 'Low',
    source: 'Cowork Code Review',
    status: 'Deferred',
    category: 'Technical',
  },
  {
    id: 5,
    session: 'Cowork 4',
    date: 'Feb 26',
    label: 'Timeline',
    summary: "'% All' section header showing 'Women'",
    severity: 'Medium',
    source: 'User Report',
    status: 'Fixed',
    category: 'Functional',
  },
  {
    id: 6,
    session: 'Cowork 4',
    date: 'Feb 26',
    label: 'Timeline',
    summary: 'Timeline renders as modal overlay (position:fixed)',
    severity: 'High',
    source: 'User Report',
    status: 'Fixed',
    category: 'UX',
  },
  {
    id: 7,
    session: 'Cowork 4',
    date: 'Feb 26',
    label: 'Timeline',
    summary: "Timeline doesn't auto-expand on view switch",
    severity: 'Medium',
    source: 'User Report',
    status: 'Fixed',
    category: 'UX',
  },
  {
    id: 8,
    session: 'Cowork 4',
    date: 'Feb 26',
    label: 'Timeline',
    summary: 'window.open() noopener severs sessionStorage',
    severity: 'High',
    source: 'Codex Auto-Review',
    status: 'Fixed',
    category: 'Technical',
  },
  {
    id: 9,
    session: 'Claude Code 2',
    date: 'Mar 5',
    label: 'State Extraction',
    summary: 'Book ID format duplicated in 3 locations (drift risk)',
    severity: 'Low',
    source: 'Code Review',
    status: 'Fixed (PR #65)',
    category: 'Technical',
  },
  {
    id: 10,
    session: 'Claude Code 2',
    date: 'Mar 5',
    label: 'State Extraction',
    summary: 'Dead resetBook logic in useFileUpload (~10 lines)',
    severity: 'Low',
    source: 'Code Review',
    status: 'Fixed (PR #65)',
    category: 'Technical',
  },
  {
    id: 11,
    session: 'Claude Code 2',
    date: 'Mar 5',
    label: 'State Extraction',
    summary: 'Double resetMonths call in onYearScopeChange',
    severity: 'Low',
    source: 'Code Review',
    status: 'Fixed (PR #65)',
    category: 'Technical',
  },
  {
    id: 12,
    session: 'Claude Code 4',
    date: 'Mar 5',
    label: 'Messy Ingestion + Bugs',
    summary: 'parseAllDataSheets re-reads raw file, bypassing BIP cleaning',
    severity: 'High',
    source: 'Code Review (PR #64)',
    status: 'Fixed (PR #65)',
    category: 'Technical',
  },
  {
    id: 13,
    session: 'Claude Code 5',
    date: 'Mar 5',
    label: 'Code Review',
    summary: 'useSummaryData uses selectedMonths.length in deps instead of selectedMonths',
    severity: 'Medium',
    source: 'Code Review (PR #68)',
    status: 'Fixed (PR #68)',
    category: 'Technical',
  },
  {
    id: 14,
    session: 'Claude Code 5',
    date: 'Mar 5',
    label: 'Code Review',
    summary: 'PublishedWork form controls hardcoded light-mode-only (broken in dark mode)',
    severity: 'Medium',
    source: 'Code Review (PR #68)',
    status: 'Fixed (PR #68)',
    category: 'UX',
  },
  {
    id: 15,
    session: 'Claude Code 5',
    date: 'Mar 5',
    label: 'Code Review',
    summary: 'ErrorBoundary fallback UI hardcoded dark-mode-only (invisible in light mode)',
    severity: 'Medium',
    source: 'Code Review (PR #68)',
    status: 'Fixed (PR #68)',
    category: 'UX',
  },
];

export const bipDerived: DerivedMetric[] = [
  { label: 'Churn Rate', value: '0.53', detail: 'Includes heavy refactoring', color: '#a78bfa' },
  { label: 'Codex Success', value: '88%', detail: '7/8 Cowork-era PRs', color: '#34d399' },
  { label: 'Cycle Time', value: '0.36h', detail: 'Per merged PR (all eras)', color: '#34d399' },
  { label: 'Decisions', value: '3.73', detail: 'Per session avg', color: '#22d3ee' },
  { label: 'Bug Rate', value: '0.17', detail: 'Per PR merged', color: '#fbbf24' },
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
