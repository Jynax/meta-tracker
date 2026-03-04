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
  date: string;
  label: string;
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
  { session: 'Session 14', date: 'Mar 3', label: 'UX Final Pass', added: 587, deleted: 385, net: 202, total: 3559 },
  { session: 'Session 15', date: 'Mar 3', label: 'How We Work View', added: 1067, deleted: 5, net: 1062, total: 4621 },
  { session: 'Session 16', date: 'Mar 4', label: 'Codebase Audit', added: 95, deleted: 42, net: 53, total: 4674 },
  { session: 'Session 17', date: 'Mar 4', label: 'Mojibake Fix', added: 53, deleted: 53, net: 0, total: 4674 },
];

export const metaSessions: SessionEntry[] = [
  { session: 'Session 1', date: 'Feb 26', label: 'Scaffold & Auth', duration: 3, prs: 4, decisions: 3, deadEnds: 0, focus: 'Scaffold, deploy, auth setup', chapterId: 'meta-ch-inception' },
  { session: 'Session 2', date: 'Feb 26', label: 'Vertical Tree', duration: 2, prs: 2, decisions: 4, deadEnds: 0, focus: 'Vertical tree exploration', chapterId: 'meta-ch-horizontal' },
  { session: 'Session 3', date: 'Feb 26', label: 'React Flow Rebuild', duration: 3, prs: 4, decisions: 5, deadEnds: 1, focus: 'React Flow rebuild', chapterId: 'meta-ch-horizontal' },
  { session: 'Session 4', date: 'Feb 27', label: 'Overlap & Filters', duration: 2, prs: 3, decisions: 3, deadEnds: 0, focus: 'Overlap fix, category filter', chapterId: 'meta-ch-layout-overhaul' },
  { session: 'Session 5', date: 'Feb 28', label: 'Layout Refactor', duration: 3, prs: 4, decisions: 4, deadEnds: 2, focus: 'Vertical layout, spacing tuning', chapterId: 'meta-ch-spacing-wars' },
  { session: 'Session 7', date: 'Feb 28', label: 'Data Model Alignment', duration: 3, prs: 5, decisions: 8, deadEnds: 0, focus: 'Type system, multi-project, alternating layout', chapterId: 'meta-ch-data-alignment' },
  { session: 'Session 8', date: 'Mar 2', label: 'Spine Fix & Dashboard', duration: 3, prs: 4, decisions: 7, deadEnds: 0, focus: 'Spine fix, dashboard infrastructure', chapterId: 'meta-ch-spine-dashboard' },
  { session: 'Session 9', date: 'Mar 2', label: 'UX Polish', duration: 2, prs: 5, decisions: 6, deadEnds: 0, focus: 'Dashboard UX Polish', chapterId: 'meta-ch-ux-polish' },
  { session: 'Session 10', date: 'Mar 2', label: 'Data Verification', duration: 1, prs: 2, decisions: 1, deadEnds: 0, focus: 'Data verification & fixes via GitHub API', chapterId: 'meta-ch-ux-polish' },
  { session: 'Session 11', date: 'Mar 2', label: 'Data Scrape', duration: 3, prs: 4, decisions: 0, deadEnds: 0, focus: 'Data scrape: BIP Pre-Cowork + Remnants bootstrap', chapterId: 'meta-ch-ux-polish' },
  { session: 'Session 12', date: 'Mar 3', label: 'Dashboard Data Overhaul', duration: 3, prs: 4, decisions: 3, deadEnds: 0, focus: 'Wire Remnants, date-grouped charts, code review + 4 bugs found/fixed', chapterId: 'meta-ch-dashboard-data-overhaul' },
  { session: 'Session 13', date: 'Mar 3', label: 'Stacked Tree View', duration: 3, prs: 3, decisions: 3, deadEnds: 0, focus: 'StackedTreeView component, stacked/canvas toggle, parity polish', chapterId: 'meta-ch-stacked-tree-view' },
  { session: 'Session 14', date: 'Mar 3', label: 'UX Final Pass', duration: 3, prs: 3, decisions: 6, deadEnds: 0, focus: 'UX Final Pass: fonts, layout, charts, scalability', chapterId: 'meta-ch-ux-final-pass' },
  { session: 'Session 15', date: 'Mar 3', label: 'How We Work View', duration: 3, prs: 0, decisions: 3, deadEnds: 0, focus: 'How We Work view: ProcessWorkflow component + view switcher wiring', chapterId: 'meta-ch-how-we-work' },
  { session: 'Session 16', date: 'Mar 4', label: 'Codebase Audit', duration: 3, prs: 8, decisions: 0, deadEnds: 0, focus: 'Full codebase audit, bug fixes, component extraction, ErrorBoundary, accessibility', chapterId: 'meta-ch-how-we-work' },
  { session: 'Session 17', date: 'Mar 4', label: 'Mojibake Fix', duration: 1, prs: 6, decisions: 1, deadEnds: 0, focus: 'Fixed 53 triple-encoded UTF-8 mojibake across 6 files. Iterative decoder, 6 API commits.', chapterId: 'meta-ch-mojibake-fix' },
];

export const metaDateRange = { start: 'Feb 2026', end: 'Mar 2026' };

export const metaBugs: BugEntry[] = [
  { id: 1, session: 'Session 1', date: 'Feb 26', label: 'Scaffold & Auth', summary: 'Tailwind CSS not rendering \u2014 missing @tailwindcss/vite plugin', severity: 'High', source: 'Testing', status: 'Fixed', category: 'Technical' },
  { id: 2, session: 'Session 1', date: 'Feb 26', label: 'Scaffold & Auth', summary: 'Auth atob crash on malformed Base64', severity: 'Medium', source: 'Code Review', status: 'Fixed', category: 'Technical' },
  { id: 3, session: 'Session 1', date: 'Feb 26', label: 'Scaffold & Auth', summary: 'Auth scheme case-sensitivity rejecting valid requests', severity: 'Low', source: 'Code Review', status: 'Fixed', category: 'Technical' },
  { id: 4, session: 'Session 2', date: 'Feb 26', label: 'Vertical Tree', summary: 'tsconfig.node.json misconfiguration', severity: 'Low', source: 'Codex Auto-Review', status: 'Deferred', category: 'Technical' },
  { id: 5, session: 'Session 3', date: 'Feb 26', label: 'React Flow Rebuild', summary: 'Codex stub files breaking Cloudflare build', severity: 'High', source: 'Testing', status: 'Fixed', category: 'Technical' },
  { id: 6, session: 'Session 3', date: 'Feb 26', label: 'React Flow Rebuild', summary: 'React Flow CSS layer ordering conflict with Tailwind v4', severity: 'Medium', source: 'Testing', status: 'Fixed', category: 'Technical' },
  { id: 7, session: 'Session 3', date: 'Feb 26', label: 'React Flow Rebuild', summary: '@xyflow/react v12 import syntax (named vs default)', severity: 'Medium', source: 'Testing', status: 'Fixed', category: 'Technical' },
  { id: 8, session: 'Session 5', date: 'Feb 28', label: 'Layout Refactor', summary: 'Node overlap when multiple phases expanded', severity: 'High', source: 'User Report', status: 'Fixed', category: 'UX' },
  { id: 9, session: 'Session 5', date: 'Feb 28', label: 'Layout Refactor', summary: 'Unicode escape sequences rendering as literal text', severity: 'Medium', source: 'User Report', status: 'Fixed', category: 'Technical' },
  { id: 10, session: 'Session 7', date: 'Feb 28', label: 'Data Model Alignment', summary: 'Codex task reverted earlier spacing fix', severity: 'Medium', source: 'User Report', status: 'Fixed', category: 'Technical' },
  { id: 11, session: 'Session 7', date: 'Feb 28', label: 'Data Model Alignment', summary: 'Node overlap when descriptions expand (fixed 60px insufficient)', severity: 'Medium', source: 'User Report', status: 'Fixed', category: 'UX' },
  { id: 12, session: 'Session 7', date: 'Feb 28', label: 'Data Model Alignment', summary: 'Thick/doubled root-to-chapter line (smoothstep artifact)', severity: 'Low', source: 'User Report', status: 'Fixed', category: 'UX' },
  { id: 13, session: 'Session 8', date: 'Mar 2', label: 'Spine Fix & Dashboard', summary: 'Vertical spine edge clips through left-side child nodes', severity: 'Medium', source: 'User Report', status: 'Fixed', category: 'UX' },
  { id: 14, session: 'Session 9', date: 'Mar 2', label: 'UX Polish', summary: 'Session bar chart renders 6px min bar for zero values (misleading visual)', severity: 'Low', source: 'Cowork Code Review', status: 'Fixed', category: 'UX' },
  { id: 15, session: 'Session 9', date: 'Mar 2', label: 'UX Polish', summary: 'Net Change chart includes zero-activity sessions that Lines Added filters out', severity: 'Low', source: 'Cowork Code Review', status: 'Fixed', category: 'Functional' },
  { id: 16, session: 'Session 10', date: 'Mar 2', label: 'Data Verification', summary: 'Net Change label missing toLocaleString formatting', severity: 'Low', source: 'Cowork Code Review', status: 'Fixed', category: 'UX' },
  { id: 17, session: 'Session 11', date: 'Mar 2', label: 'Data Scrape', summary: 'Variable shadowing: isDateExpandable redefined in nested scope', severity: 'Low', source: 'Cowork Code Review', status: 'Fixed', category: 'Technical' },
  { id: 18, session: 'Session 12', date: 'Mar 3', label: 'Dashboard Data Overhaul', summary: 'metaMetrics.ts stray line prepended \u2014 Session 12 entry placed at file start instead of sessions array', severity: 'High', source: 'Cowork Code Review', status: 'Fixed', category: 'Technical' },
  { id: 19, session: 'Session 13', date: 'Mar 3', label: 'Stacked Tree View', summary: 'StackedTreeView category filter not working \u2014 nodeMatchesFilter only checked node.type', severity: 'Medium', source: 'Cowork Code Review', status: 'Fixed', category: 'Functional' },
  { id: 20, session: 'Session 13', date: 'Mar 3', label: 'Stacked Tree View', summary: 'Duplicate summary bar + filter UI in stacked mode', severity: 'Medium', source: 'Cowork Code Review', status: 'Fixed', category: 'UX' },
  { id: 21, session: 'Session 13', date: 'Mar 3', label: 'Stacked Tree View', summary: 'formatCategory returns UX Design instead of UX/Design (missing slash)', severity: 'Low', source: 'Cowork Code Review', status: 'Fixed', category: 'UX' },
  { id: 22, session: 'Session 16', date: 'Mar 4', label: 'Codebase Audit', summary: 'metaProject.ts ch-how-we-work used wrong property names (title/session/date instead of name/period/toolLabel)', severity: 'Critical', source: 'Cowork Audit', status: 'Fixed', category: 'Technical' },
  { id: 23, session: 'Session 16', date: 'Mar 4', label: 'Codebase Audit', summary: 'Mojibake remnants in metaProject.ts, metaMetrics.ts, and StackedTreeView.tsx', severity: 'High', source: 'Cowork Audit', status: 'Fixed', category: 'Technical' },
  { id: 24, session: 'Session 16', date: 'Mar 4', label: 'Codebase Audit', summary: 'Card and DonutBreakdown re-created every render (defined inside MetricsDashboard)', severity: 'High', source: 'Cowork Audit', status: 'Fixed', category: 'Technical' },
  { id: 25, session: 'Session 16', date: 'Mar 4', label: 'Codebase Audit', summary: 'onJumpToSession fired on every chapter toggle instead of dedicated action', severity: 'Medium', source: 'Cowork Audit', status: 'Fixed', category: 'Functional' },
  { id: 26, session: 'Session 16', date: 'Mar 4', label: 'Codebase Audit', summary: 'No ErrorBoundary components anywhere in app', severity: 'High', source: 'Cowork Audit', status: 'Fixed', category: 'Technical' },
];

export const metaDerived: DerivedMetric[] = [
  { label: 'Churn Rate', value: '0.33', detail: 'Session 17: character fixes', color: '#34d399' },
  { label: 'Codex Success', value: '98%', detail: '40/41 tasks', color: '#34d399' },
  { label: 'Cycle Time', value: '0.78h', detail: 'Per merged PR', color: '#22d3ee' },
  { label: 'Decisions', value: '3.7', detail: 'Per session avg', color: '#22d3ee' },
  { label: 'Bug Rate', value: '0.43', detail: 'Per PR merged', color: '#34d399' },
];

export const metaStack: StackEntry[] = [
  { name: 'React', cat: 'Core' },
  { name: 'TypeScript', cat: 'Core' },
  { name: 'Vite', cat: 'Build' },
  { name: 'Tailwind CSS v4', cat: 'UI' },
  { name: '@xyflow/react v12', cat: 'UI' },
  { name: 'Cloudflare Pages', cat: 'Core' },
];
