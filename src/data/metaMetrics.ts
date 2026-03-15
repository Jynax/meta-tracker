export type SessionTool = 'Claude Code' | 'Codex' | 'Cowork' | 'Mixed';

export type WorkCategory = 'Feature' | 'Refactor' | 'Bug' | 'Tooling';

export interface CodeVolumeEntry {
  session: string;
  date: string;
  label: string;
  added: number;
  deleted: number;
  net: number;
  total: number;
}

export interface PRDetail {
  number: number;
  title: string;
  createdAt: string;
  mergedAt: string;
}

/** @deprecated Use DayEntry + WorkBlock from types/index.ts instead. Kept for migration compatibility. */
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
  prDetails?: PRDetail[];
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
  { session: 'Pre-Tracking A', date: 'Mar 2', label: 'Decisions & Metrics Template Design', added: 0, deleted: 0, net: 0, total: 0 },
  { session: 'Pre-Tracking B', date: 'Mar 2', label: 'Metrics Dashboard & Workflow Design', added: 0, deleted: 0, net: 0, total: 0 },
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
  { session: 'Session 18', date: 'Mar 4', label: 'How We Work Content', added: 20, deleted: 20, net: 0, total: 4674 },
  { session: 'Session 19', date: 'Mar 4', label: 'Date-Based Labels', added: 218, deleted: 509, net: 0, total: 4674 },
  { session: 'Session 20', date: 'Mar 4', label: 'Bugs + UX Batch', added: 125, deleted: 35, net: 81, total: 4797 },
  { session: 'Session 22', date: 'Mar 5', label: 'Deploy Fix + Data Cleanup', added: 249, deleted: 41, net: 208, total: 5005 },
  { session: 'Session 23', date: 'Mar 5', label: 'How We Work Rewrite + UX', added: 128, deleted: 141, net: -13, total: 5797 },
  { session: 'Session 24', date: 'Mar 5', label: 'Code Health + ESLint', added: 988, deleted: 996, net: -8, total: 5691 },
  { session: 'Session 25', date: 'Mar 5', label: 'Chart Scaling + Tool Tracking', added: 245, deleted: 50, net: 195, total: 6083 },
  { session: 'Session 26', date: 'Mar 5', label: 'Bugs + UX Batch 2', added: 77, deleted: 55, net: 22, total: 6105 },
  { session: 'Session 27', date: 'Mar 6', label: 'Security Audit + Hardening', added: 7, deleted: 0, net: 7, total: 6112 },
  { session: 'Session 28', date: 'Mar 6', label: 'SC Theme Toggle', added: 199, deleted: 68, net: 131, total: 6243 },
  { session: 'Session 29', date: 'Mar 6', label: 'Accessibility + Link Fixes', added: 18, deleted: 13, net: 5, total: 6248 },
  { session: 'Session 30', date: 'Mar 6', label: 'Time Machine + Bugfixes', added: 306, deleted: 25, net: 281, total: 6529 },
  { session: 'Session 31', date: 'Mar 8', label: 'Data Model + New Projects', added: 406, deleted: 45, net: 361, total: 6890 },
  { session: 'Session 32', date: 'Mar 9', label: 'Batch Update + Phase 3', added: 646, deleted: 34, net: 612, total: 7502 },
  { session: 'Session 34', date: 'Mar 10', label: 'ChatGPT Audit + VB Data', added: 126, deleted: 29, net: 97, total: 7599 },
  { session: 'Session 35', date: 'Mar 10', label: 'Playwright Setup', added: 350, deleted: 1, net: 0, total: 7599 },
  { session: 'Session 37', date: 'Mar 10', label: 'Playwright Deep Tests', added: 686, deleted: 32, net: 33, total: 7632 },
  { session: 'Session 40', date: 'Mar 11', label: 'Playwright CI + PR Timestamps', added: 233, deleted: 17, net: 216, total: 7848 },
  { session: 'Session 43', date: 'Mar 12', label: 'Landing + FC Projects & S43 Data', added: 372, deleted: 11, net: 361, total: 8209 },
  { session: 'Session 44', date: 'Mar 12', label: 'T-1–T-4 Data Migration', added: 1753, deleted: 318, net: 1435, total: 9644 },
  { session: 'Session 45', date: 'Mar 12', label: 'Code Tab Day-Awareness', added: 103, deleted: 42, net: 61, total: 9705 },
  { session: 'Session 46', date: 'Mar 12', label: 'Migration Complete + T-5/T-6', added: 125, deleted: 44, net: 81, total: 9786 },
  { session: 'Session 47', date: 'Mar 13', label: 'Data Integrity + Driver Reclassification', added: 67, deleted: 67, net: 0, total: 9786 },
  { session: 'Session 48', date: 'Mar 13', label: 'UX Brief — Bugs + Improvements', added: 102, deleted: 54, net: 48, total: 9834 },
  { session: 'Session 49', date: 'Mar 13', label: 'UX Brief #78 + Metrics Reformat', added: 0, deleted: 0, net: 0, total: 9834 },
  { session: 'Session 50', date: 'Mar 13', label: 'Cross-Project Tooling', added: 22, deleted: 0, net: 22, total: 9856 },
  { session: 'Session 52', date: 'Mar 14', label: 'Dep Migration', added: 1147, deleted: 1335, net: -188, total: 9668 },
  { session: 'Session 53', date: 'Mar 15', label: 'Data Push + v1.0', added: 140, deleted: 26, net: 114, total: 9782 },
];

export const metaSessions: SessionEntry[] = [
  { session: 'Pre-Tracking A', date: 'Mar 2', label: 'Decisions & Metrics Template Design', duration: 0, prs: 0, decisions: 0, deadEnds: 0, focus: 'Decisions & metrics template design', chapterId: 'meta-ch-inception', workCategory: 'Planning', tool: 'Cowork', taskCount: 0, phase: 'Spec', driver: 'collaborative' }, // APPROXIMATE — early session, pre-formal tracking
  { session: 'Pre-Tracking B', date: 'Mar 2', label: 'Metrics Dashboard & Workflow Design', duration: 0, prs: 0, decisions: 0, deadEnds: 0, focus: 'Metrics dashboard & workflow design', chapterId: 'meta-ch-inception', workCategory: 'Planning', tool: 'Cowork', taskCount: 0, phase: 'Spec', driver: 'collaborative' }, // APPROXIMATE — early session, pre-formal tracking
  { session: 'Session 1', date: 'Feb 26', label: 'Scaffold & Auth', duration: 3, prs: 4, decisions: 2, deadEnds: 0, focus: 'Scaffold, deploy, auth setup', chapterId: 'meta-ch-inception', workCategory: 'Feature', tool: 'Cowork', taskCount: 4, phase: 'Build', driver: 'collaborative' },
  { session: 'Session 2', date: 'Feb 26', label: 'Vertical Tree', duration: 2, prs: 2, decisions: 2, deadEnds: 0, focus: 'Vertical tree exploration', chapterId: 'meta-ch-horizontal', workCategory: 'Feature', tool: 'Cowork', taskCount: 2, phase: 'Build', driver: 'collaborative' },
  { session: 'Session 3', date: 'Feb 26', label: 'React Flow Rebuild', duration: 3, prs: 4, decisions: 2, deadEnds: 1, focus: 'React Flow rebuild', chapterId: 'meta-ch-horizontal', workCategory: 'Refactor', tool: 'Cowork', taskCount: 4, phase: 'Build', driver: 'collaborative' },
  { session: 'Session 4', date: 'Feb 27', label: 'Overlap & Filters', duration: 2, prs: 3, decisions: 3, deadEnds: 0, focus: 'Overlap fix, category filter', chapterId: 'meta-ch-layout-overhaul', workCategory: 'Feature', tool: 'Cowork', taskCount: 3, phase: 'Build', driver: 'collaborative' },
  { session: 'Session 5', date: 'Feb 28', label: 'Layout Refactor', duration: 3, prs: 4, decisions: 2, deadEnds: 2, focus: 'Vertical layout, spacing tuning', chapterId: 'meta-ch-spacing-wars', workCategory: 'Refactor', tool: 'Cowork', taskCount: 4, phase: 'Build', driver: 'collaborative' },
  { session: 'Session 7', date: 'Feb 28', label: 'Data Model Alignment', duration: 3, prs: 5, decisions: 5, deadEnds: 0, focus: 'Type system, multi-project, alternating layout', chapterId: 'meta-ch-data-alignment', workCategory: 'Refactor', tool: 'Cowork', taskCount: 5, phase: 'Build', driver: 'collaborative' },
  { session: 'Session 8', date: 'Mar 2', label: 'Spine Fix & Dashboard', duration: 3, prs: 4, decisions: 5, deadEnds: 0, focus: 'Spine fix, dashboard infrastructure', chapterId: 'meta-ch-spine-dashboard', workCategory: 'Bug', tool: 'Cowork', taskCount: 4, phase: 'Build', driver: 'collaborative' },
  { session: 'Session 9', date: 'Mar 2', label: 'UX Polish', duration: 2, prs: 5, decisions: 4, deadEnds: 0, focus: 'Dashboard UX Polish', chapterId: 'meta-ch-ux-polish', workCategory: 'Feature', tool: 'Cowork', taskCount: 5, phase: 'Review', driver: 'collaborative' },
  { session: 'Session 10', date: 'Mar 2', label: 'Data Verification', duration: 1, prs: 2, decisions: 1, deadEnds: 0, focus: 'Data verification & fixes via GitHub API', chapterId: 'meta-ch-ux-polish', workCategory: 'Bug', tool: 'Cowork', taskCount: 2, phase: 'Review', driver: 'collaborative' },
  { session: 'Session 11', date: 'Mar 2', label: 'Data Scrape', duration: 3, prs: 5, decisions: 0, deadEnds: 0, focus: 'Data scrape: BIP Pre-Cowork + Remnants bootstrap', chapterId: 'meta-ch-ux-polish', workCategory: 'Feature', tool: 'Cowork', taskCount: 4, phase: 'Research', driver: 'agent-led' },
  { session: 'Session 12', date: 'Mar 3', label: 'Dashboard Data Overhaul', duration: 3, prs: 8, decisions: 2, deadEnds: 0, focus: 'Wire Remnants, date-grouped charts, code review + 4 bugs found/fixed', chapterId: 'meta-ch-dashboard-data-overhaul', workCategory: 'Refactor', tool: 'Cowork', taskCount: 4, phase: 'Build', driver: 'collaborative' },
  { session: 'Session 13', date: 'Mar 3', label: 'Stacked Tree View', duration: 3, prs: 6, decisions: 2, deadEnds: 0, focus: 'StackedTreeView component, stacked/canvas toggle, parity polish', chapterId: 'meta-ch-stacked-tree-view', workCategory: 'Feature', tool: 'Cowork', taskCount: 3, phase: 'Build', driver: 'collaborative' },
  { session: 'Session 14', date: 'Mar 3', label: 'UX Final Pass', duration: 3, prs: 5, decisions: 5, deadEnds: 0, focus: 'UX Final Pass: fonts, layout, charts, scalability', chapterId: 'meta-ch-ux-final-pass', workCategory: 'Feature', tool: 'Cowork', taskCount: 3, phase: 'Review', driver: 'collaborative' },
  { session: 'Session 15', date: 'Mar 3', label: 'How We Work View', duration: 3, prs: 4, decisions: 3, deadEnds: 0, focus: 'How We Work view: ProcessWorkflow component + view switcher wiring', chapterId: 'meta-ch-how-we-work', workCategory: 'Feature', tool: 'Cowork', taskCount: 1, phase: 'Build', driver: 'collaborative' },
  { session: 'Session 16', date: 'Mar 4', label: 'Codebase Audit', duration: 3, prs: 15, decisions: 3, deadEnds: 0, focus: 'Codebase audit + bug fixes, process overhaul (START HERE, STATUS.md, task folders), file decomposition (ProcessWorkflow + MetricsDashboard split)', chapterId: 'meta-ch-process-overhaul', workCategory: 'Tooling', tool: 'Cowork', taskCount: 2, phase: 'Review', driver: 'collaborative' }, // REVIEW: driver could be ai (Cowork executed, but Michael directed the process overhaul)
  { session: 'Session 17', date: 'Mar 4', label: 'Mojibake Fix', duration: 1, prs: 8, decisions: 1, deadEnds: 0, focus: 'Fixed 53 triple-encoded UTF-8 mojibake across 6 files. Iterative decoder, 6 API commits.', chapterId: 'meta-ch-mojibake-fix', workCategory: 'Bug', tool: 'Cowork', taskCount: 1, phase: 'Review', driver: 'collaborative' },
  { session: 'Session 18', date: 'Mar 4', label: 'How We Work Content', duration: 1, prs: 1, decisions: 1, deadEnds: 0, focus: 'Updated ProcessWorkflow.tsx for task-based workflow. 1 API commit.', chapterId: 'meta-ch-process-overhaul', workCategory: 'Tooling', tool: 'Cowork', taskCount: 1, phase: 'Review', driver: 'collaborative' },
  { session: 'Session 19', date: 'Mar 4', label: 'Date-Based Labels', duration: 2, prs: 2, decisions: 1, deadEnds: 0, focus: 'Replaced session-number labels with date + descriptor format across all views. 2 API commits.', chapterId: 'meta-ch-process-overhaul', workCategory: 'Refactor', tool: 'Cowork', taskCount: 2, phase: 'Build', driver: 'collaborative' },
  { session: 'Session 20', date: 'Mar 4', label: 'Bugs + UX Batch', duration: 2, prs: 7, decisions: 1, deadEnds: 0, focus: '5 tasks via Claude Code CLI: workCategory data, Work Mix chart, Bugs table overhaul, donut polish, reverse chron order.', chapterId: 'meta-ch-process-overhaul', workCategory: 'Feature', tool: 'Claude Code', taskCount: 7, phase: 'Build', driver: 'collaborative' },
  { session: 'Session 22', date: 'Mar 5', label: 'Deploy Fix + Data Cleanup', duration: 3, prs: 5, decisions: 4, deadEnds: 0, focus: 'Fixed failed deploys, established all-PRs workflow, PR count true-up, Session 16 data fix, History tab for How We Work.', chapterId: 'meta-ch-process-overhaul', workCategory: 'Tooling', tool: 'Claude Code', taskCount: 3, phase: 'Review', driver: 'collaborative' }, // REVIEW: driver could be ai (Claude Code executed, but Michael decided the all-PRs workflow change)
  { session: 'Session 23', date: 'Mar 5', label: 'How We Work Rewrite + UX', duration: 2, prs: 3, decisions: 2, deadEnds: 0, focus: '5 tasks via Claude Code: How We Work rewrite (Cowork→Claude Code), Lucide icons, stacked tree collapse/multi-open, pills visual-only, reverse chron audit.', chapterId: 'meta-ch-process-overhaul', workCategory: 'Feature', tool: 'Claude Code', taskCount: 5, phase: 'Build', driver: 'collaborative' },
  { session: 'Session 24', date: 'Mar 5', label: 'Code Health + ESLint', duration: 2, prs: 3, decisions: 2, deadEnds: 0, focus: 'MetricsDashboard decomposed into 4 tab components (1071→176 LOC). ESLint + Prettier setup with lint fixes. Bug fix for prop removal regression.', chapterId: 'meta-ch-process-overhaul', workCategory: 'Tooling', tool: 'Claude Code', taskCount: 3, phase: 'Build', driver: 'agent-led' },
  { session: 'Session 25', date: 'Mar 5', label: 'Chart Scaling + Tool Tracking', duration: 2, prs: 2, decisions: 0, deadEnds: 0, focus: 'Chart scaling (milestone labels, weekly toggle) and session tool tracking (tool field, badges, Avg Task Time chart). PRs #57-58.', chapterId: 'meta-ch-process-overhaul', workCategory: 'Feature', tool: 'Claude Code', taskCount: 2, phase: 'Build', driver: 'collaborative' },
  { session: 'Session 26', date: 'Mar 5', label: 'Bugs + UX Batch 2', duration: 2, prs: 2, decisions: 3, deadEnds: 0, focus: '5 tasks batched: fix weekly chart grouping, remove Dead Ends line, donut layout overhaul, default project, live app links. Follow-up fix for chart grouping and per-tool lines. PRs #59-60.', chapterId: 'meta-ch-process-overhaul', workCategory: 'Bug', tool: 'Claude Code', taskCount: 5, phase: 'Review', driver: 'collaborative' },
  { session: 'Session 27', date: 'Mar 6', label: 'Security Audit + Hardening', duration: 1, prs: 3, decisions: 4, deadEnds: 0, focus: 'Full security audit across all 3 projects (Task #17). Security headers added (Task #39). BIP link attributes fixed.', chapterId: 'meta-ch-process-overhaul', workCategory: 'Tooling', tool: 'Claude Code', taskCount: 2, phase: 'Review', driver: 'agent-led' },
  { session: 'Session 28', date: 'Mar 6', label: 'SC Theme Toggle', duration: 1, prs: 1, decisions: 0, deadEnds: 0, focus: 'CSS custom properties theme system, SC dark theme toggle. 3 new files, 7 modified. PR #66.', chapterId: 'meta-ch-process-overhaul', workCategory: 'Feature', tool: 'Claude Code', taskCount: 1, phase: 'Build', driver: 'collaborative' },
  { session: 'Session 29', date: 'Mar 6', label: 'Accessibility + Link Fixes', duration: 1, prs: 1, decisions: 0, deadEnds: 0, focus: 'Accessibility pass: landmarks, nav, aria-current, button conversions. Fixed project app links. PR #67.', chapterId: 'meta-ch-process-overhaul', workCategory: 'Tooling', tool: 'Claude Code', taskCount: 2, phase: 'Review', driver: 'agent-led' },
  { session: 'Session 30', date: 'Mar 6', label: 'Time Machine + Bugfixes', duration: 2, prs: 2, decisions: 0, deadEnds: 0, focus: 'Time Machine toggle on History tab (Task #10, PR #70). Fix category bar + parent date bar regressions from SC theme (Task #43, PR #71).', chapterId: 'meta-ch-process-overhaul', workCategory: 'Feature', tool: 'Claude Code', taskCount: 2, phase: 'Build', driver: 'collaborative' },
  { session: 'Session 31', date: 'Mar 8', label: 'Data Model + New Projects', duration: 1, prs: 3, decisions: 0, deadEnds: 0, focus: 'Phase 1 data model extension (projectType, currentPhase, phase, driver, operator, expanded workCategory). Phase 2: Item-B-Gone + Vuln Bank projects added. PRs #75-77.', chapterId: 'meta-ch-process-overhaul', workCategory: 'Data', tool: 'Claude Code', taskCount: 2, phase: 'Build', driver: 'collaborative', prDetails: [
    { number: 75, title: 'Phase 1: Data model extension — project metadata + session classification', createdAt: '2026-03-08T21:32:34Z', mergedAt: '2026-03-08T21:59:02Z' },
    { number: 76, title: 'Fix flagged phase assignments (Session 11 + Remnants Claude 1)', createdAt: '2026-03-08T22:29:17Z', mergedAt: '2026-03-08T22:36:14Z' },
    { number: 77, title: 'Phase 2: Add Item-B-Gone and Vuln Bank projects', createdAt: '2026-03-08T23:00:38Z', mergedAt: '2026-03-08T23:03:46Z' },
  ] },
  { session: 'Session 32', date: 'Mar 9', label: 'Batch Update + Phase 3', duration: 2, prs: 4, decisions: 0, deadEnds: 0, focus: 'Designer credit, planning session backfill, metrics crash fix (Bug #31), decision tree updates + SC Easter egg, Phase 3 cross-project visuals. PRs #78-81.', chapterId: 'meta-ch-process-overhaul', workCategory: 'Feature', tool: 'Claude Code', taskCount: 7, phase: 'Build', driver: 'collaborative', prDetails: [
    { number: 78, title: 'Tasks #48 + #50: Designer credit + backfill planning sessions', createdAt: '2026-03-09T15:53:46Z', mergedAt: '2026-03-09T16:03:07Z' },
    { number: 79, title: 'Fix Metrics crash + Session 31 data push + Bug #31', createdAt: '2026-03-09T17:00:24Z', mergedAt: '2026-03-09T17:03:44Z' },
    { number: 80, title: 'Tasks #51, #52, #42: Decision tree updates + Easter egg', createdAt: '2026-03-09T18:15:25Z', mergedAt: '2026-03-09T18:19:48Z' },
    { number: 81, title: 'Phase 3: Cross-project phase view, driver chart, phase badges', createdAt: '2026-03-09T18:44:00Z', mergedAt: '2026-03-09T18:45:22Z' },
  ] },
  { session: 'Session 34', date: 'Mar 10', label: 'ChatGPT Audit + VB Data', duration: 1, prs: 3, decisions: 0, deadEnds: 0, focus: 'ChatGPT export audit (86 conversations parsed, tool attribution fixed, ChatGPT 5 session added). Vuln Bank data syncs (Sessions 2-5). PRs #82-84.', chapterId: 'meta-ch-process-overhaul', workCategory: 'Data', tool: 'Claude Code', taskCount: 1, phase: 'Review', driver: 'agent-led', prDetails: [
    { number: 82, title: 'Vuln Bank data push: Sessions 2-4, coordination chapter', createdAt: '2026-03-09T21:18:37Z', mergedAt: '2026-03-09T21:20:22Z' },
    { number: 83, title: 'Add Vuln Bank Session 5 metrics', createdAt: '2026-03-10T16:50:03Z', mergedAt: '2026-03-10T16:51:58Z' },
    { number: 84, title: 'Task #49: ChatGPT export audit — tool fix + new session', createdAt: '2026-03-10T18:30:52Z', mergedAt: '2026-03-10T19:03:23Z' },
  ] },
  { session: 'Session 35', date: 'Mar 10', label: 'Playwright Setup', duration: 1, prs: 1, decisions: 5, deadEnds: 0, focus: 'Playwright e2e testing framework with Chromium. 27 baseline tests across 4 spec files covering navigation, decision tree, metrics, data integrity. PR #85.', chapterId: 'meta-ch-playwright-testing', workCategory: 'Tooling', tool: 'Claude Code', taskCount: 1, phase: 'Review', driver: 'agent-led', prDetails: [
    { number: 85, title: 'Add Playwright e2e testing framework (Task #18)', createdAt: '2026-03-10T19:25:24Z', mergedAt: '2026-03-10T19:26:57Z' },
  ] },
  { session: 'Session 37', date: 'Mar 10', label: 'Playwright Deep Tests', duration: 2, prs: 2, decisions: 0, deadEnds: 0, focus: '54 deep Playwright tests (27→81 total) across 5 spec files. Stacked tree interactions, all 4 metrics tabs, canvas view, How We Work overlay, regression guards. Fixed BIP duplicate React key warning. VB Session 8 sync. PRs #86-87.', chapterId: 'meta-ch-playwright-testing', workCategory: 'Tooling', tool: 'Claude Code', taskCount: 4, phase: 'Review', driver: 'agent-led', prDetails: [
    { number: 86, title: 'Vuln Bank Session 8 sync: full metrics + 4 bugs + phase change', createdAt: '2026-03-10T19:59:55Z', mergedAt: '2026-03-10T20:07:01Z' },
    { number: 87, title: 'Add deep Playwright tests (Tasks #54-57) + fix BIP React key', createdAt: '2026-03-10T20:12:35Z', mergedAt: '2026-03-10T20:14:08Z' },
  ] },
  { session: 'Session 39', date: 'Mar 11', label: 'Task Triage & Housekeeping', duration: 1, prs: 0, decisions: 0, deadEnds: 0, focus: 'Task triage and housekeeping. 2 tasks completed (Remnants #06, MT #45), 3 tasks created (#09, #10, MT #66). Screenshot cleanup, PAT permissions updated, memory hygiene. Voice mode first use.', chapterId: 'meta-ch-process-overhaul', workCategory: 'Tooling', tool: 'Claude Code', taskCount: 2, phase: 'Review', driver: 'collaborative' },
  { session: 'Session 40', date: 'Mar 11', label: 'Playwright CI + PR Timestamps', duration: 1, prs: 2, decisions: 0, deadEnds: 0, focus: 'MT #58 Playwright GitHub Actions CI workflow. MT #66 PR timestamp enrichment (fetch-pr-timestamps.cjs script + Sessions tab merged/created columns). Remnants #04 pause + #05 save/load. PRs #92, Remnants #5.', chapterId: 'meta-ch-playwright-testing', workCategory: 'Tooling', tool: 'Claude Code', taskCount: 4, phase: 'Build', driver: 'agent-led', prDetails: [
    { number: 92, title: 'Tasks #58 + #66: Playwright CI + PR timestamp enrichment', createdAt: '2026-03-11T17:00:26Z', mergedAt: '2026-03-11T18:05:43Z' },
  ] },
  { session: 'Session 41', date: 'Mar 11', label: 'Playwright Sweep', duration: 1, prs: 3, decisions: 1, deadEnds: 0, focus: 'Complete Playwright test suites for all remaining projects: IBG Dashboard (37 tests), JynaxxApps Landing (30 tests), Remnants (26 tests). Each includes framework setup, deep interaction tests, and GitHub Actions CI. 93 new tests total. Created Remnants Playwright tasks (#07-#09).', chapterId: 'meta-ch-playwright-testing', workCategory: 'Tooling', tool: 'Claude Code', taskCount: 9, phase: 'Build', driver: 'agent-led' },
  { session: 'Session 43', date: 'Mar 12', label: 'Landing + FC Projects & S43 Data', duration: 1, prs: 1, decisions: 0, deadEnds: 0, focus: 'Added JynaxxApps Landing + Feedback Capture as tracked projects (7 total). Backfilled 4 Landing sessions. Processed 2 feedback captures for Landing. Session 43 metrics.', chapterId: 'meta-ch-process-overhaul', workCategory: 'Data', tool: 'Claude Code', taskCount: 3, phase: 'Review', driver: 'collaborative', prDetails: [
    { number: 95, title: 'Add Landing + Feedback Capture projects; Session 43 data', createdAt: '2026-03-12T18:00:00Z', mergedAt: '2026-03-12T18:28:47Z' },
  ] },
  { session: 'Session 44', date: 'Mar 12', label: 'T-1–T-4 Data Migration', duration: 3, prs: 4, decisions: 0, deadEnds: 0, focus: 'Full Day/Block data migration: T-1 type definitions + Easter egg (PR #96), T-2 migration script 84 sessions→42 days (PR #98), T-3 Sessions tab Day/Block UI (PR #99), T-4 Decision tree date anchoring with 192 nodes tagged (PR #100). All 81 Playwright tests pass.', chapterId: 'meta-ch-time-machine-data-model', workCategory: 'Refactor', tool: 'Claude Code', taskCount: 4, phase: 'Review', driver: 'collaborative', prDetails: [
    { number: 96, title: 'T-1: Migration type definitions + rogue pixel Easter egg', createdAt: '2026-03-12T19:00:00Z', mergedAt: '2026-03-12T19:24:38Z' },
    { number: 98, title: 'T-2: Migration script — sessions to Day/Block model', createdAt: '2026-03-12T19:30:00Z', mergedAt: '2026-03-12T19:36:29Z' },
    { number: 99, title: 'T-3: Sessions tab — Day/Block UI hierarchy', createdAt: '2026-03-12T20:00:00Z', mergedAt: '2026-03-12T20:36:51Z' },
    { number: 100, title: 'T-4: Decision tree date anchoring', createdAt: '2026-03-12T20:45:00Z', mergedAt: '2026-03-12T21:00:58Z' },
  ] },
  { session: 'Session 45', date: 'Mar 12', label: 'Code Tab Day-Awareness', duration: 1, prs: 1, decisions: 0, deadEnds: 0, focus: 'Code tab migrated to Day/Block model. Tooltips show block metadata (category/driver/operator). Inline category badges. Removed sessionFocusMap dependency. PR #102.', chapterId: 'meta-ch-time-machine-data-model', workCategory: 'Refactor', tool: 'Claude Code', taskCount: 1, phase: 'Review', driver: 'collaborative', prDetails: [
    { number: 102, title: 'Code tab: migrate to Day/Block model', createdAt: '2026-03-13T00:11:36Z', mergedAt: '2026-03-13T00:13:57Z' },
  ] },
  { session: 'Session 46', date: 'Mar 12', label: 'Migration Complete + T-5/T-6', duration: 1, prs: 2, decisions: 0, deadEnds: 0, focus: 'Migration complete: Overview tab migrated to Day/Block (PR #103). T-5 tracking mode — lightweight on Landing + FC, Micro badges, 7-project Phase View. T-6 phase chapter visuals — Date/Phase badges in decision tree (PR #104).', chapterId: 'meta-ch-time-machine-data-model', workCategory: 'Feature', tool: 'Claude Code', taskCount: 3, phase: 'Review', driver: 'collaborative', prDetails: [
    { number: 103, title: 'Migrate Overview tab to Day/Block model', createdAt: '2026-03-13T00:31:34Z', mergedAt: '2026-03-13T00:36:31Z' },
    { number: 104, title: 'T-5: Tracking mode + T-6: Phase chapter visuals', createdAt: '2026-03-13T00:51:07Z', mergedAt: '2026-03-13T01:02:00Z' },
  ] },
  { session: 'Session 47', date: 'Mar 13', label: 'Data Integrity + Driver Reclassification', duration: 3, prs: 1, decisions: 2, deadEnds: 0, focus: 'Decision counts realigned to tree (66 total, 11 dates fixed). Driver values reclassified: 28 blocks agent-led→collaborative. Chart now reads from DayEntry. 12-item UX brief broken into tasks #68-79. PR #106.', chapterId: 'meta-ch-time-machine-data-model', workCategory: 'Data', tool: 'Claude Code', taskCount: 2, phase: 'Review', driver: 'collaborative', prDetails: [
    { number: 106, title: 'Data integrity: decision counts + driver reclassification', createdAt: '2026-03-13T00:00:00Z', mergedAt: '2026-03-13T00:00:00Z' },
  ] },
  { session: 'Session 48', date: 'Mar 13', label: 'UX Brief — Bugs + Improvements', duration: 1, prs: 2, decisions: 0, deadEnds: 0, focus: 'Tasks #70-75: Fixed badge color (#70), scrollbar layout shift (#71), driver chart init (#72), Bugs tab day grouping (#73), shared Day/Session toggle (#74), smart tick density (#75). PRs #107-108.', chapterId: 'meta-ch-time-machine-data-model', workCategory: 'Bug', tool: 'Claude Code', taskCount: 6, phase: 'Review', driver: 'collaborative', prDetails: [
    { number: 107, title: 'UX brief bugs: badge color, scrollbar, driver chart init', createdAt: '2026-03-13T00:00:00Z', mergedAt: '2026-03-13T00:00:00Z' },
    { number: 108, title: 'UX brief: day grouping, shared toggle, tick density', createdAt: '2026-03-13T00:00:00Z', mergedAt: '2026-03-13T00:00:00Z' },
  ] },
  { session: 'Session 49', date: 'Mar 13', label: 'UX Brief #78 + Metrics Reformat', duration: 0, prs: 0, decisions: 0, deadEnds: 0, focus: 'UX Brief #78 (Joint project type) shipped — 12/12 complete. Cross-project metrics.md reformat to Day/Block schema (MT, BIP, Landing, Remnants). Data push for Sessions 47-49.', chapterId: 'meta-ch-time-machine-data-model', workCategory: 'Data', tool: 'Claude Code', taskCount: 5, phase: 'Review', driver: 'collaborative' },
  { session: 'Session 50', date: 'Mar 13', label: 'Cross-Project Tooling', duration: 2, prs: 2, decisions: 0, deadEnds: 0, focus: 'PR quality gates (lint, typecheck, build) rolled out to 5 repos. Dependabot config for all repos. CF deploy checker, workflow audit, gh-dash, Prettier hook. PRs #115-116.', chapterId: 'meta-ch-time-machine-data-model', workCategory: 'Tooling', tool: 'Claude Code', taskCount: 2, phase: 'Review', driver: 'agent-led' },
  { session: 'Session 52', date: 'Mar 14', label: 'Dep Migration', duration: 1.5, prs: 4, decisions: 0, deadEnds: 0, focus: 'Cross-project dep migration task #13. Safe bumps + React 19 (PR #117), Vite 5→8 Rolldown (PR #118), ESLint hooks 5→7 (PR #119), lint fixes (PR #120).', chapterId: 'meta-ch-time-machine-data-model', workCategory: 'Tooling', tool: 'Claude Code', taskCount: 1, phase: 'Review', driver: 'agent-led', prDetails: [
    { number: 117, title: 'Bump deps + React 19', createdAt: '2026-03-14T00:00:00Z', mergedAt: '2026-03-14T00:00:00Z' },
    { number: 118, title: 'Migrate Vite 5→8 (Rolldown)', createdAt: '2026-03-14T00:00:00Z', mergedAt: '2026-03-14T00:00:00Z' },
    { number: 119, title: 'Upgrade eslint-plugin-react-hooks 5→7', createdAt: '2026-03-14T00:00:00Z', mergedAt: '2026-03-14T00:00:00Z' },
    { number: 120, title: 'Fix hooks v7 lint errors', createdAt: '2026-03-14T00:00:00Z', mergedAt: '2026-03-14T00:00:00Z' },
  ] },
  { session: 'Session 53', date: 'Mar 15', label: 'Data Push + v1.0', duration: 2, prs: 1, decisions: 0, deadEnds: 0, focus: 'Full metrics audit across 5 projects. Data push PR #121 — backfilled ~20 PRs (Sessions 50-52). MT v1.0 milestone. USB refresh + bootstrapping folder.', chapterId: 'meta-ch-time-machine-data-model', workCategory: 'Data', tool: 'Claude Code', taskCount: 2, phase: 'Shipped', driver: 'collaborative', prDetails: [
    { number: 121, title: 'Data push: Sessions 50-52 + Meta Tracker v1.0 milestone', createdAt: '2026-03-15T00:00:00Z', mergedAt: '2026-03-15T12:24:46Z' },
  ] },
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
  { id: 27, session: 'Session 24', date: 'Mar 5', label: 'Code Health + ESLint', summary: 'ESLint fix PR accidentally removed codeVolume prop from OverviewTab and CodeTab — Metrics view crashed on all projects', severity: 'High', source: 'User Report', status: 'Fixed', category: 'Technical' },
  { id: 28, session: 'Session 25', date: 'Mar 5', label: 'Chart Scaling + Tool Tracking', summary: 'Weekly chart view showed only 2 data points (calendar weeks) — appeared cumulative. Changed to per-date grouping.', severity: 'Medium', source: 'User Report', status: 'Fixed', category: 'UX' },
  { id: 29, session: 'Session 30', date: 'Mar 6', label: 'Time Machine + Bugfixes', summary: 'Category bars invisible in Decision Tree under SC theme — hex-alpha concat on CSS custom properties produced invalid CSS values. Fixed with color-mix().', severity: 'Medium', source: 'User Report', status: 'Fixed', category: 'UX' },
  { id: 30, session: 'Session 30', date: 'Mar 6', label: 'Time Machine + Bugfixes', summary: 'Parent date bars squished in Code tab — accessibility pass converted div to button but dropped w-full class.', severity: 'Low', source: 'User Report', status: 'Fixed', category: 'UX' },
  { id: 31, session: 'Session 32', date: 'Mar 9', label: 'Batch Update + Data Push', summary: 'Metrics tab crashed with Invalid time value — backfill sessions had no CodeVolume entries, sessionDateMap fell back to session name string which failed date parsing', severity: 'High', source: 'User Report', status: 'Fixed (PR #79)', category: 'Technical' },
  { id: 32, session: 'Session 53', date: 'Mar 15', label: 'Data Push + v1.0', summary: 'Driver Breakdown chart missing Mar 14 bar — chart reads from metaSessions (legacy) but new data only added to metaDays', severity: 'Medium', source: 'Feedback Capture', status: 'Fixed (PR #122)', category: 'Functional' },
  { id: 33, session: 'Session 53', date: 'Mar 15', label: 'Data Push + v1.0', summary: 'v1.0 milestone marker not rendering — milestones require matching CodeVolumeEntry by session name, Session 53 had no entry', severity: 'Medium', source: 'Feedback Capture', status: 'Fixed (PR #122)', category: 'Functional' },
  { id: 34, session: 'Session 53', date: 'Mar 15', label: 'Data Push + v1.0', summary: 'BIP decision tree dates out of order — nodes with dayId "Unknown" and "Feb 2026" parsed to invalid sort keys (0 and 2226) by parseDateKey()', severity: 'Medium', source: 'Feedback Capture', status: 'Fixed (PR #122)', category: 'Technical' },
  { id: 35, session: 'Session 53', date: 'Mar 15', label: 'Data Push + v1.0', summary: 'Decision tree empty for Mar 12-15 — four days of active work (Day/Block migration, UX brief, dep migration, v1.0) had no chapter nodes in metaProject.ts', severity: 'Medium', source: 'Feedback Capture', status: 'Fixed (PR #123)', category: 'Functional' },
];

export const metaDerived: DerivedMetric[] = [
  { label: 'Churn Rate', value: '0.33', detail: 'Session 17: character fixes', color: '#34d399' },
  { label: 'Codex Success', value: '98%', detail: '40/41 tasks', color: '#34d399' },
  { label: 'Cycle Time', value: '0.77h', detail: 'Per merged PR', color: '#22d3ee' },
  { label: 'Decisions', value: '3.4', detail: 'Per session avg', color: '#22d3ee' },
  { label: 'Bug Rate', value: '0.34', detail: '31 bugs / 90 PRs', color: '#34d399' },
];

export const metaStack: StackEntry[] = [
  { name: 'React', cat: 'Core' },
  { name: 'TypeScript', cat: 'Core' },
  { name: 'Vite', cat: 'Build' },
  { name: 'Tailwind CSS v4', cat: 'UI' },
  { name: '@xyflow/react v12', cat: 'UI' },
  { name: 'Cloudflare Pages', cat: 'Core' },
];

/** Migrated from metaSessions — each Day groups sessions that share a date. */
export const metaDays: DayEntry[] = [
  {
    date: 'Mar 2',
    projectId: 'meta',
    phase: 'Spec',
    chapterId: 'meta-ch-inception',
    blocks: [
      { id: 'meta-pre-tracking-a', dayId: 'Mar 2', label: 'Decisions & Metrics Template Design', workCategory: 'Planning', driver: 'collaborative', operator: 'claude-ai', timeMinutes: 0, linesAdded: 0, linesDeleted: 0, note: 'Decisions & metrics template design', contextWindowOrigin: false },
      { id: 'meta-pre-tracking-b', dayId: 'Mar 2', label: 'Metrics Dashboard & Workflow Design', workCategory: 'Planning', driver: 'collaborative', operator: 'claude-ai', timeMinutes: 0, linesAdded: 0, linesDeleted: 0, note: 'Metrics dashboard & workflow design', contextWindowOrigin: false },
      { id: 'meta-session-8', dayId: 'Mar 2', label: 'Spine Fix & Dashboard', workCategory: 'Bug', driver: 'collaborative', operator: 'claude-ai', timeMinutes: 180, linesAdded: 650, linesDeleted: 41, note: 'Spine fix, dashboard infrastructure', contextWindowOrigin: false },
      { id: 'meta-session-9', dayId: 'Mar 2', label: 'UX Polish', workCategory: 'Feature', driver: 'collaborative', operator: 'claude-ai', timeMinutes: 120, linesAdded: 432, linesDeleted: 104, note: 'Dashboard UX Polish', contextWindowOrigin: false },
      { id: 'meta-session-10', dayId: 'Mar 2', label: 'Data Verification', workCategory: 'Bug', driver: 'collaborative', operator: 'claude-ai', timeMinutes: 60, linesAdded: 10, linesDeleted: 10, note: 'Data verification & fixes via GitHub API', contextWindowOrigin: false },
      { id: 'meta-session-11', dayId: 'Mar 2', label: 'Data Scrape', workCategory: 'Feature', driver: 'agent-led', operator: 'claude-ai', timeMinutes: 180, linesAdded: 0, linesDeleted: 0, note: 'Data scrape: BIP Pre-Cowork + Remnants bootstrap', contextWindowOrigin: false },
    ],
    metrics: { totalTimeMinutes: 540, linesAdded: 1092, linesDeleted: 155, totalDecisions: 10 },
    driverSummary: { human: 0, ai: 1, collaborative: 5 },
  },
  {
    date: 'Feb 26',
    projectId: 'meta',
    phase: 'Build',
    chapterId: 'meta-ch-inception',
    blocks: [
      { id: 'meta-session-1', dayId: 'Feb 26', label: 'Scaffold & Auth', workCategory: 'Feature', driver: 'collaborative', operator: 'claude-ai', timeMinutes: 180, linesAdded: 862, linesDeleted: 6, note: 'Scaffold, deploy, auth setup', contextWindowOrigin: false },
      { id: 'meta-session-2', dayId: 'Feb 26', label: 'Vertical Tree', workCategory: 'Feature', driver: 'collaborative', operator: 'claude-ai', timeMinutes: 120, linesAdded: 239, linesDeleted: 265, note: 'Vertical tree exploration', contextWindowOrigin: false },
      { id: 'meta-session-3', dayId: 'Feb 26', label: 'React Flow Rebuild', workCategory: 'Refactor', driver: 'collaborative', operator: 'claude-ai', timeMinutes: 180, linesAdded: 438, linesDeleted: 362, note: 'React Flow rebuild', contextWindowOrigin: false },
    ],
    metrics: { totalTimeMinutes: 480, linesAdded: 1539, linesDeleted: 633, totalDecisions: 6 },
    driverSummary: { human: 0, ai: 0, collaborative: 3 },
  },
  {
    date: 'Feb 27',
    title: 'Overlap & Filters',
    projectId: 'meta',
    phase: 'Build',
    chapterId: 'meta-ch-layout-overhaul',
    blocks: [
      { id: 'meta-session-4', dayId: 'Feb 27', label: 'Overlap & Filters', workCategory: 'Feature', driver: 'collaborative', operator: 'claude-ai', timeMinutes: 120, linesAdded: 157, linesDeleted: 37, note: 'Overlap fix, category filter', contextWindowOrigin: false },
    ],
    metrics: { totalTimeMinutes: 120, linesAdded: 157, linesDeleted: 37, totalDecisions: 3 },
    driverSummary: { human: 0, ai: 0, collaborative: 1 },
  },
  {
    date: 'Feb 28',
    projectId: 'meta',
    phase: 'Build',
    chapterId: 'meta-ch-spacing-wars',
    blocks: [
      { id: 'meta-session-5', dayId: 'Feb 28', label: 'Layout Refactor', workCategory: 'Refactor', driver: 'collaborative', operator: 'claude-ai', timeMinutes: 180, linesAdded: 202, linesDeleted: 141, note: 'Vertical layout, spacing tuning', contextWindowOrigin: false },
      { id: 'meta-session-7', dayId: 'Feb 28', label: 'Data Model Alignment', workCategory: 'Refactor', driver: 'collaborative', operator: 'claude-ai', timeMinutes: 180, linesAdded: 671, linesDeleted: 289, note: 'Type system, multi-project, alternating layout', contextWindowOrigin: false },
    ],
    metrics: { totalTimeMinutes: 360, linesAdded: 873, linesDeleted: 430, totalDecisions: 7 },
    driverSummary: { human: 0, ai: 0, collaborative: 2 },
  },
  {
    date: 'Mar 3',
    projectId: 'meta',
    phase: 'Build',
    chapterId: 'meta-ch-dashboard-data-overhaul',
    blocks: [
      { id: 'meta-session-12', dayId: 'Mar 3', label: 'Dashboard Data Overhaul', workCategory: 'Refactor', driver: 'collaborative', operator: 'claude-ai', timeMinutes: 180, linesAdded: 515, linesDeleted: 117, note: 'Wire Remnants, date-grouped charts, code review + 4 bugs found/fixed', contextWindowOrigin: false },
      { id: 'meta-session-13', dayId: 'Mar 3', label: 'Stacked Tree View', workCategory: 'Feature', driver: 'collaborative', operator: 'claude-ai', timeMinutes: 180, linesAdded: 714, linesDeleted: 74, note: 'StackedTreeView component, stacked/canvas toggle, parity polish', contextWindowOrigin: false },
      { id: 'meta-session-14', dayId: 'Mar 3', label: 'UX Final Pass', workCategory: 'Feature', driver: 'collaborative', operator: 'claude-ai', timeMinutes: 180, linesAdded: 587, linesDeleted: 385, note: 'UX Final Pass: fonts, layout, charts, scalability', contextWindowOrigin: false },
      { id: 'meta-session-15', dayId: 'Mar 3', label: 'How We Work View', workCategory: 'Feature', driver: 'collaborative', operator: 'claude-ai', timeMinutes: 180, linesAdded: 1067, linesDeleted: 5, note: 'How We Work view: ProcessWorkflow component + view switcher wiring', contextWindowOrigin: false },
    ],
    metrics: { totalTimeMinutes: 720, linesAdded: 2883, linesDeleted: 581, totalDecisions: 12 },
    driverSummary: { human: 0, ai: 0, collaborative: 4 },
  },
  {
    date: 'Mar 4',
    projectId: 'meta',
    phase: 'Review',
    chapterId: 'meta-ch-process-overhaul',
    blocks: [
      { id: 'meta-session-16', dayId: 'Mar 4', label: 'Codebase Audit', workCategory: 'Tooling', driver: 'collaborative', operator: 'claude-ai', timeMinutes: 180, linesAdded: 95, linesDeleted: 42, note: 'Codebase audit + bug fixes, process overhaul (START HERE, STATUS.md, task folders), file decomposition (ProcessWorkflow + MetricsDashboard split)', contextWindowOrigin: false },
      { id: 'meta-session-17', dayId: 'Mar 4', label: 'Mojibake Fix', workCategory: 'Bug', driver: 'collaborative', operator: 'claude-ai', timeMinutes: 60, linesAdded: 53, linesDeleted: 53, note: 'Fixed 53 triple-encoded UTF-8 mojibake across 6 files. Iterative decoder, 6 API commits.', contextWindowOrigin: false },
      { id: 'meta-session-18', dayId: 'Mar 4', label: 'How We Work Content', workCategory: 'Tooling', driver: 'collaborative', operator: 'claude-ai', timeMinutes: 60, linesAdded: 20, linesDeleted: 20, note: 'Updated ProcessWorkflow.tsx for task-based workflow. 1 API commit.', contextWindowOrigin: false },
      { id: 'meta-session-19', dayId: 'Mar 4', label: 'Date-Based Labels', workCategory: 'Refactor', driver: 'collaborative', operator: 'claude-ai', timeMinutes: 120, linesAdded: 218, linesDeleted: 509, note: 'Replaced session-number labels with date + descriptor format across all views. 2 API commits.', contextWindowOrigin: false },
      { id: 'meta-session-20', dayId: 'Mar 4', label: 'Bugs + UX Batch', workCategory: 'Feature', driver: 'collaborative', operator: 'claude-code', timeMinutes: 120, linesAdded: 125, linesDeleted: 35, note: '5 tasks via Claude Code CLI: workCategory data, Work Mix chart, Bugs table overhaul, donut polish, reverse chron order.', contextWindowOrigin: false },
    ],
    metrics: { totalTimeMinutes: 540, linesAdded: 511, linesDeleted: 659, totalDecisions: 7 },
    driverSummary: { human: 0, ai: 0, collaborative: 5 },
  },
  {
    date: 'Mar 5',
    projectId: 'meta',
    phase: 'Review',
    chapterId: 'meta-ch-process-overhaul',
    blocks: [
      { id: 'meta-session-22', dayId: 'Mar 5', label: 'Deploy Fix + Data Cleanup', workCategory: 'Tooling', driver: 'collaborative', operator: 'claude-code', timeMinutes: 180, linesAdded: 249, linesDeleted: 41, note: 'Fixed failed deploys, established all-PRs workflow, PR count true-up, Session 16 data fix, History tab for How We Work.', contextWindowOrigin: false },
      { id: 'meta-session-23', dayId: 'Mar 5', label: 'How We Work Rewrite + UX', workCategory: 'Feature', driver: 'collaborative', operator: 'claude-code', timeMinutes: 120, linesAdded: 128, linesDeleted: 141, note: '5 tasks via Claude Code: How We Work rewrite (Cowork→Claude Code), Lucide icons, stacked tree collapse/multi-open, pills visual-only, reverse chron audit.', contextWindowOrigin: false },
      { id: 'meta-session-24', dayId: 'Mar 5', label: 'Code Health + ESLint', workCategory: 'Tooling', driver: 'agent-led', operator: 'claude-code', timeMinutes: 120, linesAdded: 988, linesDeleted: 996, note: 'MetricsDashboard decomposed into 4 tab components (1071→176 LOC). ESLint + Prettier setup with lint fixes. Bug fix for prop removal regression.', contextWindowOrigin: false },
      { id: 'meta-session-25', dayId: 'Mar 5', label: 'Chart Scaling + Tool Tracking', workCategory: 'Feature', driver: 'collaborative', operator: 'claude-code', timeMinutes: 120, linesAdded: 245, linesDeleted: 50, note: 'Chart scaling (milestone labels, weekly toggle) and session tool tracking (tool field, badges, Avg Task Time chart). PRs #57-58.', contextWindowOrigin: false },
      { id: 'meta-session-26', dayId: 'Mar 5', label: 'Bugs + UX Batch 2', workCategory: 'Bug', driver: 'collaborative', operator: 'claude-code', timeMinutes: 120, linesAdded: 77, linesDeleted: 55, note: '5 tasks batched: fix weekly chart grouping, remove Dead Ends line, donut layout overhaul, default project, live app links. Follow-up fix for chart grouping and per-tool lines. PRs #59-60.', contextWindowOrigin: false },
    ],
    metrics: { totalTimeMinutes: 660, linesAdded: 1687, linesDeleted: 1283, totalDecisions: 11 },
    driverSummary: { human: 0, ai: 1, collaborative: 4 },
  },
  {
    date: 'Mar 6',
    projectId: 'meta',
    phase: 'Review',
    chapterId: 'meta-ch-process-overhaul',
    blocks: [
      { id: 'meta-session-27', dayId: 'Mar 6', label: 'Security Audit + Hardening', workCategory: 'Tooling', driver: 'agent-led', operator: 'claude-code', timeMinutes: 60, linesAdded: 7, linesDeleted: 0, note: 'Full security audit across all 3 projects (Task #17). Security headers added (Task #39). BIP link attributes fixed.', contextWindowOrigin: false },
      { id: 'meta-session-28', dayId: 'Mar 6', label: 'SC Theme Toggle', workCategory: 'Feature', driver: 'collaborative', operator: 'claude-code', timeMinutes: 60, linesAdded: 199, linesDeleted: 68, note: 'CSS custom properties theme system, SC dark theme toggle. 3 new files, 7 modified. PR #66.', contextWindowOrigin: false },
      { id: 'meta-session-29', dayId: 'Mar 6', label: 'Accessibility + Link Fixes', workCategory: 'Tooling', driver: 'agent-led', operator: 'claude-code', timeMinutes: 60, linesAdded: 18, linesDeleted: 13, note: 'Accessibility pass: landmarks, nav, aria-current, button conversions. Fixed project app links. PR #67.', contextWindowOrigin: false },
      { id: 'meta-session-30', dayId: 'Mar 6', label: 'Time Machine + Bugfixes', workCategory: 'Feature', driver: 'collaborative', operator: 'claude-code', timeMinutes: 120, linesAdded: 306, linesDeleted: 25, note: 'Time Machine toggle on History tab (Task #10, PR #70). Fix category bar + parent date bar regressions from SC theme (Task #43, PR #71).', contextWindowOrigin: false },
    ],
    metrics: { totalTimeMinutes: 300, linesAdded: 530, linesDeleted: 106, totalDecisions: 4 },
    driverSummary: { human: 0, ai: 2, collaborative: 2 },
  },
  {
    date: 'Mar 8',
    title: 'Data Model + New Projects',
    projectId: 'meta',
    phase: 'Build',
    chapterId: 'meta-ch-process-overhaul',
    blocks: [
      { id: 'meta-session-31', dayId: 'Mar 8', label: 'Data Model + New Projects', workCategory: 'Data', driver: 'collaborative', operator: 'claude-code', timeMinutes: 60, linesAdded: 406, linesDeleted: 45, note: 'Phase 1 data model extension (projectType, currentPhase, phase, driver, operator, expanded workCategory). Phase 2: Item-B-Gone + Vuln Bank projects added. PRs #75-77.', contextWindowOrigin: false },
    ],
    metrics: { totalTimeMinutes: 60, linesAdded: 406, linesDeleted: 45, totalDecisions: 0 },
    driverSummary: { human: 0, ai: 0, collaborative: 1 },
  },
  {
    date: 'Mar 9',
    title: 'Batch Update + Phase 3',
    projectId: 'meta',
    phase: 'Build',
    chapterId: 'meta-ch-process-overhaul',
    blocks: [
      { id: 'meta-session-32', dayId: 'Mar 9', label: 'Batch Update + Phase 3', workCategory: 'Feature', driver: 'collaborative', operator: 'claude-code', timeMinutes: 120, linesAdded: 646, linesDeleted: 34, note: 'Designer credit, planning session backfill, metrics crash fix (Bug #31), decision tree updates + SC Easter egg, Phase 3 cross-project visuals. PRs #78-81.', contextWindowOrigin: false },
    ],
    metrics: { totalTimeMinutes: 120, linesAdded: 646, linesDeleted: 34, totalDecisions: 0 },
    driverSummary: { human: 0, ai: 0, collaborative: 1 },
  },
  {
    date: 'Mar 10',
    projectId: 'meta',
    phase: 'Review',
    chapterId: 'meta-ch-process-overhaul',
    blocks: [
      { id: 'meta-session-34', dayId: 'Mar 10', label: 'ChatGPT Audit + VB Data', workCategory: 'Data', driver: 'agent-led', operator: 'claude-code', timeMinutes: 60, linesAdded: 126, linesDeleted: 29, note: 'ChatGPT export audit (86 conversations parsed, tool attribution fixed, ChatGPT 5 session added). Vuln Bank data syncs (Sessions 2-5). PRs #82-84.', contextWindowOrigin: false },
      { id: 'meta-session-35', dayId: 'Mar 10', label: 'Playwright Setup', workCategory: 'Tooling', driver: 'agent-led', operator: 'claude-code', timeMinutes: 60, linesAdded: 350, linesDeleted: 1, note: 'Playwright e2e testing framework with Chromium. 27 baseline tests across 4 spec files covering navigation, decision tree, metrics, data integrity. PR #85.', contextWindowOrigin: false },
      { id: 'meta-session-37', dayId: 'Mar 10', label: 'Playwright Deep Tests', workCategory: 'Tooling', driver: 'agent-led', operator: 'claude-code', timeMinutes: 120, linesAdded: 686, linesDeleted: 32, note: '54 deep Playwright tests (27→81 total) across 5 spec files. Stacked tree interactions, all 4 metrics tabs, canvas view, How We Work overlay, regression guards. Fixed BIP duplicate React key warning. VB Session 8 sync. PRs #86-87.', contextWindowOrigin: false },
    ],
    metrics: { totalTimeMinutes: 240, linesAdded: 1162, linesDeleted: 62, totalDecisions: 5 },
    driverSummary: { human: 0, ai: 3, collaborative: 0 },
  },
  {
    date: 'Mar 11',
    projectId: 'meta',
    phase: 'Review',
    chapterId: 'meta-ch-process-overhaul',
    blocks: [
      { id: 'meta-session-39', dayId: 'Mar 11', label: 'Task Triage & Housekeeping', workCategory: 'Tooling', driver: 'collaborative', operator: 'claude-code', timeMinutes: 60, linesAdded: 0, linesDeleted: 0, note: 'Task triage and housekeeping. 2 tasks completed (Remnants #06, MT #45), 3 tasks created (#09, #10, MT #66). Screenshot cleanup, PAT permissions updated, memory hygiene. Voice mode first use.', contextWindowOrigin: false },
      { id: 'meta-session-40', dayId: 'Mar 11', label: 'Playwright CI + PR Timestamps', workCategory: 'Tooling', driver: 'agent-led', operator: 'claude-code', timeMinutes: 60, linesAdded: 233, linesDeleted: 17, note: 'MT #58 Playwright GitHub Actions CI workflow. MT #66 PR timestamp enrichment (fetch-pr-timestamps.cjs script + Sessions tab merged/created columns). Remnants #04 pause + #05 save/load. PRs #92, Remnants #5.', contextWindowOrigin: false },
      { id: 'meta-session-41', dayId: 'Mar 11', label: 'Playwright Sweep', workCategory: 'Tooling', driver: 'agent-led', operator: 'claude-code', timeMinutes: 60, linesAdded: 0, linesDeleted: 0, note: 'Complete Playwright test suites for all remaining projects: IBG Dashboard (37 tests), JynaxxApps Landing (30 tests), Remnants (26 tests). Each includes framework setup, deep interaction tests, and GitHub Actions CI. 93 new tests total. Created Remnants Playwright tasks (#07-#09).', contextWindowOrigin: false },
    ],
    metrics: { totalTimeMinutes: 180, linesAdded: 233, linesDeleted: 17, totalDecisions: 1 },
    driverSummary: { human: 0, ai: 2, collaborative: 1 },
  },
  {
    date: 'Mar 12',
    title: 'Day/Block Migration Complete (T-1–T-6)',
    projectId: 'meta',
    phase: 'Review',
    chapterId: 'meta-ch-time-machine-data-model',
    blocks: [
      { id: 'meta-session-43', dayId: 'Mar 12', label: 'Landing + FC Projects & S43 Data', workCategory: 'Data', driver: 'collaborative', operator: 'claude-code', timeMinutes: 60, linesAdded: 372, linesDeleted: 11, note: 'Added Landing + Feedback Capture as tracked projects (7 total). Backfilled 4 Landing sessions. Processed 2 feedback captures. PR #95.', contextWindowOrigin: false },
      { id: 'meta-session-44', dayId: 'Mar 12', label: 'T-1–T-4 Data Migration', workCategory: 'Refactor', driver: 'collaborative', operator: 'claude-code', timeMinutes: 180, linesAdded: 1753, linesDeleted: 318, note: 'Full Day/Block migration: T-1 types (PR #96), T-2 script (PR #98), T-3 Sessions tab UI (PR #99), T-4 Decision tree date anchoring 192 nodes (PR #100). All 81 tests pass.', contextWindowOrigin: false },
      { id: 'meta-session-45', dayId: 'Mar 12', label: 'Code Tab Day-Awareness', workCategory: 'Refactor', driver: 'collaborative', operator: 'claude-code', timeMinutes: 60, linesAdded: 103, linesDeleted: 42, note: 'Code tab migrated to Day/Block. Tooltips show block metadata (category/driver/operator). Inline category badges. Removed sessionFocusMap. PR #102.', contextWindowOrigin: false },
      { id: 'meta-session-46', dayId: 'Mar 12', label: 'Migration Complete + T-5/T-6', workCategory: 'Feature', driver: 'collaborative', operator: 'claude-code', timeMinutes: 60, linesAdded: 125, linesDeleted: 44, note: 'Migration complete: Overview tab Day/Block (PR #103). T-5 tracking mode — lightweight projects, Micro badges, 7-project Phase View. T-6 phase chapter visuals — Date/Phase badges in decision tree (PR #104).', contextWindowOrigin: false },
    ],
    metrics: { totalTimeMinutes: 360, linesAdded: 2353, linesDeleted: 415, totalDecisions: 0 },
    driverSummary: { human: 0, ai: 0, collaborative: 4 },
  },
  {
    date: 'Mar 13',
    title: 'UX Brief Complete + Data Alignment',
    projectId: 'meta',
    phase: 'Review',
    chapterId: 'meta-ch-time-machine-data-model',
    blocks: [
      { id: 'meta-session-47', dayId: 'Mar 13', label: 'Data Integrity + Driver Reclassification', workCategory: 'Data', driver: 'collaborative', operator: 'claude-code', timeMinutes: 180, linesAdded: 67, linesDeleted: 67, note: 'Decision counts realigned to tree (66 total, 11 dates fixed). Driver values reclassified: 28 blocks agent-led→collaborative. Chart reads from DayEntry. 12-item UX brief broken into tasks #68-79. PR #106.', contextWindowOrigin: false },
      { id: 'meta-session-48', dayId: 'Mar 13', label: 'UX Brief — Bugs + Improvements', workCategory: 'Bug', driver: 'collaborative', operator: 'claude-code', timeMinutes: 60, linesAdded: 102, linesDeleted: 54, note: 'Tasks #70-75: badge color, scrollbar, driver chart init, day grouping, shared toggle, tick density. PRs #107-108.', contextWindowOrigin: false },
      { id: 'meta-session-49', dayId: 'Mar 13', label: 'UX Brief #78 + Metrics Reformat', workCategory: 'Data', driver: 'collaborative', operator: 'claude-code', timeMinutes: 0, linesAdded: 0, linesDeleted: 0, note: 'UX Brief #78 (Joint project type) shipped — 12/12 complete. Cross-project metrics.md reformat to Day/Block schema. Data push for Sessions 47-49.', contextWindowOrigin: false },
      { id: 'meta-session-50', dayId: 'Mar 13', label: 'Cross-Project Tooling', workCategory: 'Tooling', driver: 'agent-led', operator: 'claude-code', timeMinutes: 120, linesAdded: 22, linesDeleted: 0, note: 'PR quality gates (lint, typecheck, build) rolled out to 5 repos. Dependabot config for all repos. CF deploy checker, workflow audit (16 tools evaluated), gh-dash, Prettier hook. PRs #115-116.', contextWindowOrigin: false },
    ],
    metrics: { totalTimeMinutes: 360, linesAdded: 191, linesDeleted: 121, totalDecisions: 2 },
    driverSummary: { human: 0, ai: 1, collaborative: 3 },
  },
  {
    date: 'Mar 14',
    title: 'Dependency Migration — Vite 8, React 19',
    projectId: 'meta',
    phase: 'Review',
    chapterId: 'meta-ch-time-machine-data-model',
    blocks: [
      { id: 'meta-session-52', dayId: 'Mar 14', label: 'Dep Migration', workCategory: 'Tooling', driver: 'agent-led', operator: 'claude-code', timeMinutes: 90, linesAdded: 1147, linesDeleted: 1335, note: 'Cross-project dep migration task #13. Safe bumps + React 19 (PR #117), Vite 5→8 with Rolldown (PR #118, 2.4s→300ms build), ESLint hooks 5→7 (PR #119), lint fixes (PR #120). 4 PRs merged.', contextWindowOrigin: false },
    ],
    metrics: { totalTimeMinutes: 90, linesAdded: 1147, linesDeleted: 1335, totalDecisions: 0 },
    driverSummary: { human: 0, ai: 1, collaborative: 0 },
  },
  {
    date: 'Mar 15',
    title: 'Data Push + v1.0 Milestone',
    projectId: 'meta',
    phase: 'Shipped',
    chapterId: 'meta-ch-time-machine-data-model',
    blocks: [
      { id: 'meta-session-53', dayId: 'Mar 15', label: 'Data Push + v1.0', workCategory: 'Data', driver: 'collaborative', operator: 'claude-code', timeMinutes: 120, linesAdded: 140, linesDeleted: 26, note: 'Full metrics audit across 5 projects. Data push PR #121 — backfilled ~20 PRs (Sessions 50-52). MT v1.0 milestone added. USB refresh (task #07) + bootstrapping folder (task #14).', contextWindowOrigin: false },
    ],
    metrics: { totalTimeMinutes: 120, linesAdded: 140, linesDeleted: 26, totalDecisions: 0 },
    driverSummary: { human: 0, ai: 0, collaborative: 1 },
  },
];
