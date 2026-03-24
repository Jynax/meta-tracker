import type { DayEntry } from '../types/index';
import type { CodeVolumeEntry, SessionEntry, DerivedMetric, StackEntry } from './bipMetrics';

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

// --- Code Volume ---
export const remnantsCodeVolume: CodeVolumeEntry[] = [
  { session: 'Pre-Tracking', date: 'Feb 17', label: 'Remnants — World & Scope Definition', added: 0, deleted: 0, net: 0, total: 0 },
  { session: 'Claude 1', date: 'Feb 17', label: 'Vertical Slice', added: 850, deleted: 0, net: 850, total: 850 },
  { session: 'Claude 2', date: 'Feb 18', label: 'Balance & Xenoflora', added: 0, deleted: 0, net: 0, total: 850 },
  { session: 'Claude 3', date: 'Feb 18', label: 'Home Base & Recovery', added: 0, deleted: 0, net: 0, total: 850 },
  { session: 'Git Setup', date: 'Feb 19', label: 'Repo Init + Docs', added: 4131, deleted: 2, net: 4129, total: 4129 },
  { session: 'Codex 1', date: 'Feb 21', label: 'Launcher & Deploy', added: 680, deleted: 38, net: 642, total: 4771 },
  { session: 'Legacy Port', date: 'Feb 21', label: 'Source Restructure', added: 4038, deleted: 4131, net: -93, total: 4678 },
  { session: 'Session 40', date: 'Mar 11', label: 'Pause + Save/Load', added: 122, deleted: 13, net: 109, total: 4787 },
  { session: 'Session 41', date: 'Mar 11', label: 'Playwright Suite + CI', added: 433, deleted: 2, net: 431, total: 5218 },
  { session: 'Session 50', date: 'Mar 13', label: 'Dependabot + Quality Gates + Safe Bumps', added: 50, deleted: 35, net: 15, total: 5233 },
];

// --- Sessions ---
export const remnantsSessions: SessionEntry[] = [
  { session: 'Pre-Tracking', date: 'Feb 17', label: 'Remnants — World & Scope Definition', duration: 0, prs: 0, decisions: 0, deadEnds: 0, focus: 'World & scope definition — 20yr concept, first formal documentation session', chapterId: 'ch-core-loop', workCategory: 'Planning', tool: 'Cowork', taskCount: 0, phase: 'Research', driver: 'human' }, // APPROXIMATE — 20yr concept, first formal documentation session
  { session: 'Claude 1', date: 'Feb 17', label: 'Vertical Slice', duration: 0, prs: 0, decisions: 4, deadEnds: 0, focus: 'Vertical slice: map, combat, inventory, extraction', chapterId: 'ch-core-loop', workCategory: 'Feature', tool: 'Cowork', taskCount: 1, phase: 'Spec', driver: 'collaborative' },
  { session: 'Claude 2', date: 'Feb 18', label: 'Balance & Xenoflora', duration: 0, prs: 0, decisions: 3, deadEnds: 0, focus: 'Balance, terrain, xenoflora, zone difficulty', chapterId: 'ch-living-world', workCategory: 'Feature', tool: 'Cowork', taskCount: 1, phase: 'Spec', driver: 'collaborative' },
  { session: 'Claude 3', date: 'Feb 18', label: 'Home Base & Recovery', duration: 0, prs: 0, decisions: 3, deadEnds: 0, focus: 'Home base, recovery system, character naming', chapterId: 'ch-the-house', workCategory: 'Feature', tool: 'Cowork', taskCount: 1, phase: 'Spec', driver: 'collaborative' },
  { session: 'Git Setup', date: 'Feb 19', label: 'Repo Init + Docs', duration: 1, prs: 0, decisions: 1, deadEnds: 0, focus: 'Created repos, uploaded docs + code', chapterId: 'ch-repo-deployment', workCategory: 'Tooling', tool: 'Cowork', taskCount: 1, phase: 'Build', driver: 'agent-led' },
  { session: 'Codex 1', date: 'Feb 21', label: 'Launcher & Deploy', duration: 1, prs: 3, decisions: 1, deadEnds: 0, focus: 'Launcher, README, deploy fix', chapterId: 'ch-repo-deployment', workCategory: 'Tooling', tool: 'Codex', taskCount: 1, phase: 'Build', driver: 'agent-led' },
  { session: 'Session 40', date: 'Mar 11', label: 'Pause + Save/Load', duration: 1, prs: 1, decisions: 0, deadEnds: 0, focus: 'Pause button (spacebar) with auto-save on pause. Save/load system using localStorage with full game state serialization. Tasks #04-#05.', chapterId: 'ch-core-loop', workCategory: 'Feature', tool: 'Claude Code', taskCount: 2, phase: 'Build', driver: 'agent-led' },
  { session: 'Session 41', date: 'Mar 11', label: 'Playwright Suite + CI', duration: 1, prs: 1, decisions: 0, deadEnds: 0, focus: 'Full Playwright test suite: 26 tests across 6 specs (title screen, game flow, controls, save/load, deep interactions, responsive). GitHub Actions CI workflow. Tasks #07-#09.', chapterId: 'ch-repo-deployment', workCategory: 'Tooling', tool: 'Claude Code', taskCount: 3, phase: 'Review', driver: 'agent-led' },
];

// --- Date Range ---
export const remnantsDateRange = {
  start: 'Feb 2025',
  end: 'Mar 2026',
};

// --- Bugs ---
export const remnantsBugs: BugEntry[] = [
  { id: 1, session: 'Claude 1', date: 'Feb 17', label: 'Vertical Slice', summary: 'Navigation unclear in first playtest', severity: 'Medium', source: 'Playtest', status: 'Fixed (minimap + compass)', category: 'UX' },
  { id: 2, session: 'Claude 2', date: 'Feb 18', label: 'Balance & Xenoflora', summary: 'Visual elements too small in Claude side panel', severity: 'Low', source: 'Playtest', status: 'Noted', category: 'UX' },
  { id: 3, session: 'Claude 3', date: 'Feb 18', label: 'Home Base & Recovery', summary: 'Inventory limit (4 slots) felt too restrictive', severity: 'Medium', source: 'Playtest', status: 'By Design', category: 'UX' },
  { id: 4, session: 'Codex 1', date: 'Feb 21', label: 'Launcher & Deploy', summary: 'Deploy button not responding on GitHub Pages', severity: 'High', source: 'Codex Testing', status: 'Fixed (PR #3)', category: 'Technical' },
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
  { name: 'Cloudflare Pages', cat: 'Core' },
  { name: 'GitHub Pages', cat: 'Core' },
];

/** Migrated from remnantsSessions — each Day groups sessions that share a date. */
export const remnantsDays: DayEntry[] = [
  {
    date: 'Feb 17',
    projectId: 'remnants',
    phase: 'Research',
    chapterId: 'ch-core-loop',
    blocks: [
      { id: 'remnants-pre-tracking', dayId: 'Feb 17', label: 'Remnants — World & Scope Definition', workCategory: 'Planning', driver: 'human', operator: 'claude-ai', timeMinutes: 0, linesAdded: 0, linesDeleted: 0, note: 'World & scope definition — 20yr concept, first formal documentation session', contextWindowOrigin: false },
      { id: 'remnants-claude-1', dayId: 'Feb 17', label: 'Vertical Slice', workCategory: 'Feature', driver: 'collaborative', operator: 'claude-ai', timeMinutes: 0, linesAdded: 850, linesDeleted: 0, note: 'Vertical slice: map, combat, inventory, extraction', contextWindowOrigin: false },
    ],
    metrics: { totalTimeMinutes: 0, linesAdded: 850, linesDeleted: 0, totalDecisions: 4 },
    driverSummary: { human: 1, ai: 0, collaborative: 1 },
  },
  {
    date: 'Feb 18',
    projectId: 'remnants',
    phase: 'Spec',
    chapterId: 'ch-living-world',
    blocks: [
      { id: 'remnants-claude-2', dayId: 'Feb 18', label: 'Balance & Xenoflora', workCategory: 'Feature', driver: 'collaborative', operator: 'claude-ai', timeMinutes: 0, linesAdded: 0, linesDeleted: 0, note: 'Balance, terrain, xenoflora, zone difficulty', contextWindowOrigin: false },
      { id: 'remnants-claude-3', dayId: 'Feb 18', label: 'Home Base & Recovery', workCategory: 'Feature', driver: 'collaborative', operator: 'claude-ai', timeMinutes: 0, linesAdded: 0, linesDeleted: 0, note: 'Home base, recovery system, character naming', contextWindowOrigin: false },
    ],
    metrics: { totalTimeMinutes: 0, linesAdded: 0, linesDeleted: 0, totalDecisions: 6 },
    driverSummary: { human: 0, ai: 0, collaborative: 2 },
  },
  {
    date: 'Feb 19',
    title: 'Repo Init + Docs',
    projectId: 'remnants',
    phase: 'Build',
    chapterId: 'ch-repo-deployment',
    blocks: [
      { id: 'remnants-git-setup', dayId: 'Feb 19', label: 'Repo Init + Docs', workCategory: 'Tooling', driver: 'agent-led', operator: 'claude-ai', timeMinutes: 60, linesAdded: 4131, linesDeleted: 2, note: 'Created repos, uploaded docs + code', contextWindowOrigin: false },
    ],
    metrics: { totalTimeMinutes: 60, linesAdded: 4131, linesDeleted: 2, totalDecisions: 1 },
    driverSummary: { human: 0, ai: 1, collaborative: 0 },
  },
  {
    date: 'Feb 21',
    title: 'Launcher & Deploy',
    projectId: 'remnants',
    phase: 'Build',
    chapterId: 'ch-repo-deployment',
    blocks: [
      { id: 'remnants-codex-1', dayId: 'Feb 21', label: 'Launcher & Deploy', workCategory: 'Tooling', driver: 'agent-led', operator: 'claude-ai', timeMinutes: 60, linesAdded: 680, linesDeleted: 38, note: 'Launcher, README, deploy fix', contextWindowOrigin: false },
    ],
    metrics: { totalTimeMinutes: 60, linesAdded: 680, linesDeleted: 38, totalDecisions: 1 },
    driverSummary: { human: 0, ai: 1, collaborative: 0 },
  },
  {
    date: 'Mar 11',
    projectId: 'remnants',
    phase: 'Build',
    chapterId: 'ch-core-loop',
    blocks: [
      { id: 'remnants-session-40', dayId: 'Mar 11', label: 'Pause + Save/Load', workCategory: 'Feature', driver: 'agent-led', operator: 'claude-code', timeMinutes: 60, linesAdded: 122, linesDeleted: 13, note: 'Pause button (spacebar) with auto-save on pause. Save/load system using localStorage with full game state serialization. Tasks #04-#05.', contextWindowOrigin: false },
      { id: 'remnants-session-41', dayId: 'Mar 11', label: 'Playwright Suite + CI', workCategory: 'Tooling', driver: 'agent-led', operator: 'claude-code', timeMinutes: 60, linesAdded: 433, linesDeleted: 2, note: 'Full Playwright test suite: 26 tests across 6 specs (title screen, game flow, controls, save/load, deep interactions, responsive). GitHub Actions CI workflow. Tasks #07-#09.', contextWindowOrigin: false },
    ],
    metrics: { totalTimeMinutes: 120, linesAdded: 555, linesDeleted: 15, totalDecisions: 0 },
    driverSummary: { human: 0, ai: 2, collaborative: 0 },
  },
  {
    date: 'Mar 13',
    title: 'Dependabot + Quality Gates + Safe Bumps',
    projectId: 'remnants',
    phase: 'Review',
    chapterId: 'ch-repo-deployment',
    blocks: [
      { id: 'remnants-session-50', dayId: 'Mar 13', label: 'Dependabot + Quality Gates + Safe Bumps', workCategory: 'Tooling', driver: 'agent-led', operator: 'claude-code', timeMinutes: 15, linesAdded: 50, linesDeleted: 35, note: 'Dependabot config (PR #7), PR quality gates (PR #10), production dep safe bumps (PR #9). Part of cross-project tooling sweep.', contextWindowOrigin: false },
    ],
    metrics: { totalTimeMinutes: 15, linesAdded: 50, linesDeleted: 35, totalDecisions: 0 },
    driverSummary: { human: 0, ai: 1, collaborative: 0 },
  },
  {
    date: 'Mar 23',
    title: 'Vite 8 Migration',
    projectId: 'remnants',
    phase: 'Build',
    chapterId: 'ch-repo-deployment',
    blocks: [
      { id: 'remnants-session-62-flex', dayId: 'Mar 23', label: 'Vite 8 Migration', workCategory: 'Tooling', driver: 'agent-led', operator: 'claude-code', timeMinutes: 10, linesAdded: 490, linesDeleted: 1322, note: 'Dependabot PR #8: Vite 6 to 8 (Rolldown) + plugin-react 4 to 6. Build verified.', contextWindowOrigin: false },
    ],
    metrics: { totalTimeMinutes: 10, linesAdded: 490, linesDeleted: 1322, totalDecisions: 0 },
    driverSummary: { human: 0, ai: 1, collaborative: 0 },
  },
];
