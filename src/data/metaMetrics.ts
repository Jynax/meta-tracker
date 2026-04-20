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
  { session: 'Session 58', date: 'Mar 21', label: 'NW Project Added', added: 20, deleted: 0, net: 20, total: 9802 },
  { session: 'Session 62', date: 'Mar 22', label: 'Favicon + Data Pushes', added: 57, deleted: 0, net: 57, total: 9859 },
  { session: 'Session 62b', date: 'Mar 25', label: 'OTM + NW URLs', added: 192, deleted: 4, net: 188, total: 10047 },
  { session: 'Session 70', date: 'Mar 28', label: 'LOC Fix + Data Push', added: 2, deleted: 1, net: 1, total: 10048 },
  { session: 'Session 71', date: 'Mar 29', label: 'Cross-Project Insights', added: 987, deleted: 105, net: 882, total: 10930 },
  { session: 'Session 72', date: 'Mar 30', label: 'InsightsView Redesign Planning', added: 0, deleted: 0, net: 0, total: 10930 },
  { session: 'Session 73', date: 'Mar 30', label: 'InsightsView Redesign', added: 816, deleted: 479, net: 337, total: 11267 },
  { session: 'Session 74', date: 'Mar 31', label: 'Maintenance + Timeline', added: 737, deleted: 888, net: -151, total: 11116 },
  { session: 'Session 75', date: 'Mar 31', label: 'Shared Design Tokens', added: 25, deleted: 5, net: 20, total: 11136 },
  { session: 'Session 76', date: 'Mar 31', label: 'InsightsView Readability', added: 32, deleted: 25, net: 7, total: 11143 },
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
  { session: 'Session 27', date: 'Mar 6', label: 'Security Audit + Hardening', duration: 1, prs: 3, decisions: 4, deadEnds: 0, focus: 'Full security audit across all 3 projects (Task #17). Security headers added (Task #39). BIP link attributes fixed.', chapterId: 'meta-ch-process-overhaul', workCategory: 'Tooling', tool: 'Claude Code', taskCount: 2, phase: 'Review', driver: 'collaborative' },
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
  { session: 'Session 58', date: 'Mar 21', label: 'NW Project Added', duration: 0.5, prs: 1, decisions: 0, deadEnds: 0, focus: 'Added Note Worthy as 8th tracked project in Meta Tracker dropdown. PR #126.', chapterId: 'meta-ch-time-machine-data-model', workCategory: 'Data', tool: 'Claude Code', taskCount: 1, phase: 'Shipped', driver: 'agent-led', prDetails: [
    { number: 126, title: 'Add Note Worthy as tracked project', createdAt: '2026-03-21T00:00:00Z', mergedAt: '2026-03-21T00:00:00Z' },
  ] },
  { session: 'Session 62', date: 'Mar 22', label: 'Favicon + Data Pushes', duration: 0.5, prs: 2, decisions: 0, deadEnds: 0, focus: 'Custom favicon (PR #128). Session 62 metrics push (PR #129). NW sessions 58-60 data push (PR #127).', chapterId: 'meta-ch-time-machine-data-model', workCategory: 'Data', tool: 'Claude Code', taskCount: 1, phase: 'Shipped', driver: 'agent-led', prDetails: [
    { number: 128, title: 'Add custom favicon', createdAt: '2026-03-22T00:00:00Z', mergedAt: '2026-03-23T10:35:19Z' },
    { number: 129, title: 'data: session 62 metrics push', createdAt: '2026-03-23T00:00:00Z', mergedAt: '2026-03-23T14:24:39Z' },
  ] },
  { session: 'Session 62b', date: 'Mar 25', label: 'OTM + NW URLs', duration: 0.5, prs: 1, decisions: 0, deadEnds: 0, focus: 'Added On The Move as 9th tracked project. Added Note Worthy app URL. Updated Playwright test to expect 9 projects. PR #134.', chapterId: 'meta-ch-time-machine-data-model', workCategory: 'Feature', tool: 'Claude Code', taskCount: 1, phase: 'Shipped', driver: 'agent-led', prDetails: [
    { number: 134, title: 'Add On The Move + Note Worthy URL', createdAt: '2026-03-25T00:00:00Z', mergedAt: '2026-03-25T22:57:51Z' },
  ] },
  { session: 'Session 70', date: 'Mar 28', label: 'LOC Fix + Data Push', duration: 1, prs: 4, decisions: 0, deadEnds: 0, focus: 'Fixed LOC chart y-axis overflow (PR #135). Reviewed Dependabot PRs: lucide-react 1.0 merged (PR #132), dev deps closed (PR #131, ESLint 10 blocked). Session 62 flex data push part 2 merged (PR #133).', chapterId: 'meta-ch-time-machine-data-model', workCategory: 'Bug', tool: 'Claude Code', taskCount: 2, phase: 'Shipped', driver: 'collaborative', prDetails: [
    { number: 132, title: 'Bump lucide-react from 0.577.0 to 1.0.1', createdAt: '2026-03-23T00:00:00Z', mergedAt: '2026-03-29T01:27:35Z' },
    { number: 133, title: 'data: session 62 flex metrics push (part 2)', createdAt: '2026-03-24T00:00:00Z', mergedAt: '2026-03-29T01:27:18Z' },
    { number: 135, title: 'fix: LOC chart y-axis overflow on some projects (#82)', createdAt: '2026-03-28T00:00:00Z', mergedAt: '2026-03-29T01:36:52Z' },
  ] },
  { session: 'Session 71', date: 'Mar 29', label: 'Cross-Project Insights', duration: 3.5, prs: 1, decisions: 1, deadEnds: 0, focus: 'Cross-project insights (#83): "All Projects" in dropdown → InsightsView with portfolio banner + 6 insight cards/tabs (Velocity, Estimates, Drivers, Timeline, Work Mix, Bug Trends). New files: InsightsView.tsx, insightsData.ts. 8 commits. PR #138.', chapterId: 'meta-ch-time-machine-data-model', workCategory: 'Feature', tool: 'Claude Code', taskCount: 1, phase: 'Shipped', driver: 'collaborative', prDetails: [
    { number: 138, title: 'feat: cross-project InsightsView (#83)', createdAt: '2026-03-29T00:00:00Z', mergedAt: '2026-03-29T00:00:00Z' },
  ] },
  { session: 'Session 72', date: 'Mar 30', label: 'InsightsView Redesign Planning', duration: 1.5, prs: 0, decisions: 5, deadEnds: 0, focus: 'Planning session. Reviewed 5 feedback captures on InsightsView. Deep research: IBG LOC/hr data gap, 7x multiplier debunked (honest 2-3x per ISBSG/Cortex 2026), driver audit. Brainstormed full redesign: 5 narrative chapters replacing 6 data tabs. Spec + 7-task plan written.', chapterId: 'meta-ch-time-machine-data-model', workCategory: 'Data', tool: 'Claude Code', taskCount: 0, phase: 'Shipped', driver: 'collaborative' },
  { session: 'Session 73', date: 'Mar 30', label: 'InsightsView Redesign', duration: 1, prs: 1, decisions: 0, deadEnds: 0, focus: 'InsightsView redesign via subagent-driven development. 7 tasks, 7 commits. IBG data gaps fixed, insightsNarrative.ts (5 chapters), rewrote insightsData.ts + InsightsView.tsx. All 85 tests green. PR #139.', chapterId: 'meta-ch-time-machine-data-model', workCategory: 'Feature', tool: 'Claude Code', taskCount: 7, phase: 'Shipped', driver: 'agent-led', prDetails: [
    { number: 139, title: 'feat: InsightsView redesign — narrative chapters + honest data', createdAt: '2026-03-30T00:00:00Z', mergedAt: '2026-03-30T00:00:00Z' },
  ] },
  { session: 'Session 74', date: 'Mar 31', label: 'Maintenance + Timeline', duration: 2, prs: 4, decisions: 0, deadEnds: 0, focus: 'Data push sessions 71-73 (PR #142). Fixed PR #130 Timeline Overhaul (rebased, 4 Playwright tests rewritten). Investigated 3 broken Dependabot PRs (ESLint 10 + TS 6 conflicts, closed). Safe dep bumps PR #143 (8 patch/minor updates). All PRs resolved.', chapterId: 'meta-ch-time-machine-data-model', workCategory: 'Tooling', tool: 'Claude Code', taskCount: 3, phase: 'Shipped', driver: 'collaborative', prDetails: [
    { number: 130, title: 'feat: replace History tab with horizontal process timeline (#67)', createdAt: '2026-03-23T23:52:03Z', mergedAt: '2026-03-31T11:14:17Z' },
    { number: 141, title: 'build(deps): bump production-dependencies group with 2 updates', createdAt: '2026-03-30T23:59:50Z', mergedAt: '2026-03-31T11:16:32Z' },
    { number: 142, title: 'data: push sessions 71-73 metrics', createdAt: '2026-03-31T10:45:40Z', mergedAt: '2026-03-31T10:50:42Z' },
    { number: 143, title: 'build(deps): safe patch/minor dependency bumps', createdAt: '2026-03-31T11:26:19Z', mergedAt: '2026-03-31T11:29:33Z' },
  ] },
  { session: 'Session 75', date: 'Mar 31', label: 'Shared Design Tokens', duration: 3, prs: 1, decisions: 1, deadEnds: 0, focus: 'Cross-cutting session. Brainstormed + spec\'d + implemented shared design system: jynaxxapps-tokens package. Rolled out to 6 projects. MT: Inter font, 10px card radius, InsightsView font size bumps. PR #144.', chapterId: 'meta-ch-time-machine-data-model', workCategory: 'Feature', tool: 'Claude Code', taskCount: 1, phase: 'Shipped', driver: 'collaborative', prDetails: [
    { number: 144, title: 'Shared design tokens + InsightsView font size fix', createdAt: '2026-03-31T11:36:41Z', mergedAt: '2026-03-31T11:59:43Z' },
  ] },
  { session: 'Session 76', date: 'Mar 31', label: 'InsightsView Readability', duration: 1, prs: 1, decisions: 0, deadEnds: 0, focus: 'InsightsView readability pass (#85): font size bumps, timeline label widening, clickable source links, legend size increases. Feedback triage session. PR #145.', chapterId: 'meta-ch-time-machine-data-model', workCategory: 'Bug', tool: 'Claude Code', taskCount: 1, phase: 'Shipped', driver: 'collaborative', prDetails: [
    { number: 145, title: 'fix: InsightsView readability pass (#85)', createdAt: '2026-03-31T14:22:57Z', mergedAt: '2026-03-31T14:26:11Z' },
  ] },
];

export const metaDateRange = { start: 'Feb 2026', end: 'Apr 2026' };

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
  { id: 36, session: 'Session 78', date: 'Apr 1', label: 'IBG LOC Correction', summary: 'IBG LOC/hr inflated to 1,777 (true ~391) — data.json was 7,101 lines of auto-synced WoW item dumps counted as human-written code. Gitignored data.json on dashboard side, corrected MT session data', severity: 'Medium', source: 'Feedback Capture', status: 'Fixed (PR #149)', category: 'Technical' },
  { id: 37, session: 'Session 79', date: 'Apr 1', label: 'Data Viz Heuristics', summary: 'Velocity scatter plot labels collide when two points are close — Task #86 queued', severity: 'Low', source: 'Data Viz Audit', status: 'Fixed (PR #163)', category: 'UX' },
  { id: 38, session: 'Session 82', date: 'Apr 8', label: 'Canvas Fix + Changelog Backfill', summary: 'Changelog system silently dead since Session 77 — PRs were not using the exact **Category:**/**Summary:** format the GH Actions workflow regex expected, so CHANGELOG.json never got updated. Backfilled 68 entries across 24 dates from full PR history', severity: 'Medium', source: 'Self-Discovered', status: 'Fixed (PR #156)', category: 'Functional' },
  { id: 39, session: 'Session 82', date: 'Apr 8', label: 'Canvas Fix + Changelog Backfill', summary: 'Canvas nodes show interactive grab handles — React Flow default. Three fix attempts (isConnectable={false} wrapper PR #156, H wrapper swap PR #158, force 1px transparent PR #159) all still show handles on live. Resolved by canvas mode retirement (PR #173) — bug surface no longer exists', severity: 'Low', source: 'User Report', status: 'Fixed (PR #173 — canvas retired)', category: 'UX' },
  { id: 40, session: 'Session 85', date: 'Apr 11', label: 'Metrics Catch-Up Push', summary: 'computeInsights() reads legacy *CodeVolume and *Sessions arrays for portfolio totals, but those arrays have only been maintained for IBG since ~Mar 23. Portfolio totals on All Projects view are silently wrong for BIP/Landing/NW/OTM/Remnants/MT (reflect data through ~Mar 23, not current). Discovered during PR #160 when mid-array insertion into IBG legacy arrays felt fragile', severity: 'Medium', source: 'Self-Discovered', status: 'Fixed (PR #162)', category: 'Functional' },
  { id: 41, session: 'Session 85', date: 'Apr 11', label: 'Metrics Catch-Up Push', summary: 'E2E tests hard-code running totals (41,026 LOC, 190.25 hours) — broke twice during PR #160 backfill as totals shifted to 41,253 and 190.5. Resolved by PR #162 — insights.spec.ts no longer hard-codes LOC/hours numbers, asserts labels render without numeric assertions', severity: 'Low', source: 'Self-Discovered', status: 'Fixed (PR #162)', category: 'Technical' },
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
      { id: 'meta-session-27', dayId: 'Mar 6', label: 'Security Audit + Hardening', workCategory: 'Tooling', driver: 'collaborative', operator: 'claude-code', timeMinutes: 60, linesAdded: 7, linesDeleted: 0, note: 'Full security audit across all 3 projects (Task #17). Security headers added (Task #39). BIP link attributes fixed.', contextWindowOrigin: false },
      { id: 'meta-session-28', dayId: 'Mar 6', label: 'SC Theme Toggle', workCategory: 'Feature', driver: 'collaborative', operator: 'claude-code', timeMinutes: 60, linesAdded: 199, linesDeleted: 68, note: 'CSS custom properties theme system, SC dark theme toggle. 3 new files, 7 modified. PR #66.', contextWindowOrigin: false },
      { id: 'meta-session-29', dayId: 'Mar 6', label: 'Accessibility + Link Fixes', workCategory: 'Tooling', driver: 'agent-led', operator: 'claude-code', timeMinutes: 60, linesAdded: 18, linesDeleted: 13, note: 'Accessibility pass: landmarks, nav, aria-current, button conversions. Fixed project app links. PR #67.', contextWindowOrigin: false },
      { id: 'meta-session-30', dayId: 'Mar 6', label: 'Time Machine + Bugfixes', workCategory: 'Feature', driver: 'collaborative', operator: 'claude-code', timeMinutes: 120, linesAdded: 306, linesDeleted: 25, note: 'Time Machine toggle on History tab (Task #10, PR #70). Fix category bar + parent date bar regressions from SC theme (Task #43, PR #71).', contextWindowOrigin: false },
    ],
    metrics: { totalTimeMinutes: 300, linesAdded: 530, linesDeleted: 106, totalDecisions: 4 },
    driverSummary: { human: 0, ai: 1, collaborative: 3 },
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
  {
    date: 'Mar 21',
    title: 'Note Worthy Project Added',
    projectId: 'meta',
    phase: 'Shipped',
    chapterId: 'meta-ch-time-machine-data-model',
    blocks: [
      { id: 'meta-session-58', dayId: 'Mar 21', label: 'NW Project Added', workCategory: 'Data', driver: 'agent-led', operator: 'claude-code', timeMinutes: 30, linesAdded: 20, linesDeleted: 0, note: 'Added Note Worthy as 8th tracked project in Meta Tracker dropdown. PR #126.', contextWindowOrigin: false },
    ],
    metrics: { totalTimeMinutes: 30, linesAdded: 20, linesDeleted: 0, totalDecisions: 0 },
    driverSummary: { human: 0, ai: 1, collaborative: 0 },
  },
  {
    date: 'Mar 22',
    title: 'Favicon',
    projectId: 'meta',
    phase: 'Shipped',
    chapterId: 'meta-ch-time-machine-data-model',
    blocks: [
      { id: 'meta-session-62', dayId: 'Mar 22', label: 'Favicon', workCategory: 'UX', driver: 'agent-led', operator: 'claude-code', timeMinutes: 10, linesAdded: 9, linesDeleted: 0, note: 'Custom favicon. PR #128.', contextWindowOrigin: false },
    ],
    metrics: { totalTimeMinutes: 10, linesAdded: 9, linesDeleted: 0, totalDecisions: 0 },
    driverSummary: { human: 0, ai: 1, collaborative: 0 },
  },
  {
    date: 'Mar 25',
    title: 'OTM + NW URLs Added',
    projectId: 'meta',
    phase: 'Shipped',
    chapterId: 'meta-ch-time-machine-data-model',
    blocks: [
      { id: 'meta-session-62b', dayId: 'Mar 25', label: 'OTM + NW URLs', workCategory: 'Feature', driver: 'agent-led', operator: 'claude-code', timeMinutes: 30, linesAdded: 192, linesDeleted: 4, note: 'Added On The Move as 9th tracked project. Added Note Worthy URL. Updated Playwright test to expect 9 projects. PR #134.', contextWindowOrigin: false },
    ],
    metrics: { totalTimeMinutes: 30, linesAdded: 192, linesDeleted: 4, totalDecisions: 0 },
    driverSummary: { human: 0, ai: 1, collaborative: 0 },
  },
  {
    date: 'Mar 28',
    title: 'LOC Fix + Data Push',
    projectId: 'meta',
    phase: 'Shipped',
    chapterId: 'meta-ch-time-machine-data-model',
    blocks: [
      { id: 'meta-session-70', dayId: 'Mar 28', label: 'LOC Chart Fix + Data Push', workCategory: 'Bug', driver: 'collaborative', operator: 'claude-code', timeMinutes: 60, linesAdded: 2, linesDeleted: 1, note: 'Fixed LOC chart y-axis overflow — axis now scales from max data point, not just currentLoc (PR #135). Reviewed + closed Dependabot PRs #131-132. Lucide-react bumped to 1.0.1 (PR #132). Session 62 flex data push (PR #133).', contextWindowOrigin: false },
    ],
    metrics: { totalTimeMinutes: 60, linesAdded: 2, linesDeleted: 1, totalDecisions: 0 },
    driverSummary: { human: 0, ai: 0, collaborative: 1 },
  },
  {
    date: 'Mar 29',
    title: 'Cross-Project Insights',
    projectId: 'meta',
    phase: 'Shipped',
    chapterId: 'meta-ch-time-machine-data-model',
    blocks: [
      { id: 'meta-session-71', dayId: 'Mar 29', label: 'Cross-Project Insights (#83)', workCategory: 'Feature', driver: 'collaborative', operator: 'claude-code', timeMinutes: 210, linesAdded: 987, linesDeleted: 105, note: '"All Projects" in dropdown → InsightsView with portfolio banner + 6 insight cards/tabs (Velocity, Estimates, Drivers, Timeline, Work Mix, Bug Trends). New files: InsightsView.tsx, insightsData.ts. 8 commits. 4 new Playwright tests. PR #138.', contextWindowOrigin: false },
    ],
    metrics: { totalTimeMinutes: 210, linesAdded: 987, linesDeleted: 105, totalDecisions: 1 },
    driverSummary: { human: 0, ai: 0, collaborative: 1 },
  },
  {
    date: 'Mar 30',
    title: 'InsightsView Redesign — Planning + Implementation',
    projectId: 'meta',
    phase: 'Shipped',
    chapterId: 'meta-ch-time-machine-data-model',
    blocks: [
      { id: 'meta-session-72', dayId: 'Mar 30', label: 'InsightsView Redesign Planning', workCategory: 'Data', driver: 'collaborative', operator: 'claude-code', timeMinutes: 90, linesAdded: 0, linesDeleted: 0, note: 'Planning session. Reviewed 5 feedback captures on InsightsView. Deep research: IBG LOC/hr data gap, 7x multiplier debunked (honest range 2-3x per ISBSG/Cortex 2026), driver audit. Brainstormed full redesign: 5 narrative chapters replacing 6 data tabs. Spec + 7-task implementation plan written.', contextWindowOrigin: false },
      { id: 'meta-session-73', dayId: 'Mar 30', label: 'InsightsView Redesign Implementation', workCategory: 'Feature', driver: 'agent-led', operator: 'claude-code', timeMinutes: 60, linesAdded: 816, linesDeleted: 479, note: 'Executed redesign plan via subagent-driven development. 7 tasks, 7 commits. IBG data gaps fixed, session 27 driver fix, new insightsNarrative.ts (5 chapters), rewrote insightsData.ts (honest aggregation), rewrote InsightsView.tsx (narrative chapters + 10 charts), updated e2e tests. All 85 tests green. PR #139.', contextWindowOrigin: false },
    ],
    metrics: { totalTimeMinutes: 150, linesAdded: 816, linesDeleted: 479, totalDecisions: 5 },
    driverSummary: { human: 0, ai: 1, collaborative: 1 },
  },
  {
    date: 'Mar 31',
    title: 'Maintenance + Timeline Overhaul',
    projectId: 'meta',
    phase: 'Shipped',
    chapterId: 'meta-ch-time-machine-data-model',
    blocks: [
      { id: 'meta-session-74', dayId: 'Mar 31', label: 'Maintenance + Timeline (#67)', workCategory: 'Tooling', driver: 'collaborative', operator: 'claude-code', timeMinutes: 120, linesAdded: 737, linesDeleted: 888, note: 'Data push sessions 71-73 (PR #142). Fixed PR #130 Timeline Overhaul (rebased, 4 Playwright tests rewritten, merged). Investigated 3 broken Dependabot PRs (ESLint 10 + TS 6 conflicts, closed all). Safe dep bumps PR #143 (8 patch/minor updates, merged). Dependabot PR #141 merged.', contextWindowOrigin: false },
      { id: 'meta-session-75', dayId: 'Mar 31', label: 'Shared Design Tokens', workCategory: 'Feature', driver: 'collaborative', operator: 'claude-code', timeMinutes: 180, linesAdded: 25, linesDeleted: 5, note: 'Cross-cutting session. Built jynaxxapps-tokens design system package, rolled out to 6 projects. MT portion: Inter font, 10px card radius, consistent shadows, InsightsView font size bumps. PR #144.', contextWindowOrigin: false },
      { id: 'meta-session-76', dayId: 'Mar 31', label: 'InsightsView Readability (#85)', workCategory: 'Bug', driver: 'collaborative', operator: 'claude-code', timeMinutes: 60, linesAdded: 32, linesDeleted: 25, note: 'InsightsView readability pass: font size bumps (headings, intro, disclaimers, legends), timeline label widening (120→160px), clickable source links with hover states. Feedback triage (11 captures). PR #145.', contextWindowOrigin: false },
    ],
    metrics: { totalTimeMinutes: 360, linesAdded: 794, linesDeleted: 918, totalDecisions: 1 },
    driverSummary: { human: 0, ai: 0, collaborative: 3 },
  },
  {
    date: 'Mar 31',
    title: 'Changelog System (MT)',
    projectId: 'meta',
    phase: 'Shipped',
    chapterId: 'meta-ch-time-machine-data-model',
    blocks: [
      { id: 'meta-session-77', dayId: 'Mar 31', label: 'Changelog System (MT)', workCategory: 'Feature', driver: 'collaborative', operator: 'claude-code', timeMinutes: 45, linesAdded: 218, linesDeleted: 1, note: 'MT portion of cross-cutting changelog rollout. PR template, GH Actions workflow, /changelog page, cross-repo dispatch receiver. Rolled out to 7 apps same sitting. PR #147.', contextWindowOrigin: false }, // estimated
    ],
    metrics: { totalTimeMinutes: 45, linesAdded: 218, linesDeleted: 1, totalDecisions: 0 }, // estimated
    driverSummary: { human: 0, ai: 0, collaborative: 1 },
  },
  {
    date: 'Apr 1',
    title: 'IBG LOC Correction',
    projectId: 'meta',
    phase: 'Shipped',
    chapterId: 'meta-ch-time-machine-data-model',
    blocks: [
      { id: 'meta-session-78', dayId: 'Apr 1', label: 'IBG LOC Correction', workCategory: 'Data', driver: 'collaborative', operator: 'claude-code', timeMinutes: 10, linesAdded: 18, linesDeleted: 11, note: 'Corrected MT session data after IBG LOC audit (data.json gitignored). IBG LOC/hr 1,777 → ~391. PR #149.', contextWindowOrigin: false }, // estimated
    ],
    metrics: { totalTimeMinutes: 10, linesAdded: 18, linesDeleted: 11, totalDecisions: 0 }, // estimated
    driverSummary: { human: 0, ai: 0, collaborative: 1 },
  },
  {
    date: 'Apr 1',
    title: 'Data Viz Heuristics',
    projectId: 'meta',
    phase: 'Shipped',
    chapterId: 'meta-ch-time-machine-data-model',
    blocks: [
      { id: 'meta-session-79a', dayId: 'Apr 1', label: 'Legend Tightening', workCategory: 'UX', driver: 'agent-led', operator: 'claude-code', timeMinutes: 10, linesAdded: 5, linesDeleted: 5, note: 'Tighten chart legends to parent charts. PR #148.', contextWindowOrigin: false }, // estimated
      { id: 'meta-session-79b', dayId: 'Apr 1', label: 'Phase Labels + FC Milestone', workCategory: 'Data', driver: 'agent-led', operator: 'claude-code', timeMinutes: 10, linesAdded: 9, linesDeleted: 2, note: 'Correct phase labels (NW+OTM → Build), FC v1.0 milestone. PR #150.', contextWindowOrigin: false }, // estimated
      { id: 'meta-session-79c', dayId: 'Apr 1', label: 'Data Viz Heuristics', workCategory: 'Feature', driver: 'collaborative', operator: 'claude-code', timeMinutes: 120, linesAdded: 486, linesDeleted: 280, note: 'Researched Tufte/Few/Tableau/Grafana. 5-rule standard (direct labels, legend fallback, tooltips, brush+zoom, color consistency). Implemented brushUtils + 6 charts. Task #86 queued (scatter label collisions). PR #151.', contextWindowOrigin: false }, // estimated
    ],
    metrics: { totalTimeMinutes: 140, linesAdded: 500, linesDeleted: 287, totalDecisions: 1 }, // estimated
    driverSummary: { human: 0, ai: 2, collaborative: 1 },
  },
  {
    date: 'Apr 7',
    title: 'Design Polish Pass',
    projectId: 'meta',
    phase: 'Shipped',
    chapterId: 'meta-ch-time-machine-data-model',
    blocks: [
      { id: 'meta-session-81', dayId: 'Apr 7', label: 'Emil Design Polish', workCategory: 'UX', driver: 'collaborative', operator: 'claude-code', timeMinutes: 75, linesAdded: 59, linesDeleted: 22, note: 'emil-design-eng audit, 15 issues, 8-task plan via subagent-driven dev. prefers-reduced-motion, press feedback, hover gating, custom easing vars, replaced 17 transitions, enhanced FadeIn. 11 files, 85/85 tests. Dependabot #153 closed (ESLint 10). PR #154.', contextWindowOrigin: false }, // estimated
    ],
    metrics: { totalTimeMinutes: 75, linesAdded: 59, linesDeleted: 22, totalDecisions: 0 }, // estimated
    driverSummary: { human: 0, ai: 0, collaborative: 1 },
  },
  {
    date: 'Apr 8',
    title: 'Decision Tree Backfill + Canvas Fix',
    projectId: 'meta',
    phase: 'Shipped',
    chapterId: 'meta-ch-time-machine-data-model',
    blocks: [
      { id: 'meta-session-82a', dayId: 'Apr 8', label: 'Decision Tree Backfill', workCategory: 'Data', driver: 'collaborative', operator: 'claude-code', timeMinutes: 60, linesAdded: 450, linesDeleted: 25, note: 'Decision Tree data gaps: 33 missing entries across 4 projects (Landing 7→26, BIP 42→48, IBG 15→21, OTM 7→12). Task #90 via subagent-driven dev. PR #155.', contextWindowOrigin: false }, // estimated
      { id: 'meta-session-82b', dayId: 'Apr 8', label: 'Canvas Fix + Changelog Backfill', workCategory: 'Bug', driver: 'collaborative', operator: 'claude-code', timeMinutes: 45, linesAdded: 206, linesDeleted: 23, note: 'Canvas handle bug (isConnectable={false} wrapper). Changelog system dead since S77 (PR format regex mismatch) — backfilled CHANGELOG.json with 68 entries across 24 dates. Task #91 queued. PR #156.', contextWindowOrigin: false }, // estimated
    ],
    metrics: { totalTimeMinutes: 105, linesAdded: 656, linesDeleted: 48, totalDecisions: 1 }, // estimated
    driverSummary: { human: 0, ai: 0, collaborative: 2 },
  },
  {
    date: 'Apr 10',
    title: 'Canvas Handles + Mind Map Brainstorm',
    projectId: 'meta',
    phase: 'Shipped',
    chapterId: 'meta-ch-time-machine-data-model',
    blocks: [
      { id: 'meta-session-86a', dayId: 'Apr 10', label: 'Canvas Handle Fix Attempt 1', workCategory: 'Bug', driver: 'agent-led', operator: 'claude-code', timeMinutes: 10, linesAdded: 5, linesDeleted: 5, note: 'Swap raw Handle → H wrapper on PhaseNode. Still visible on live — superseded by #159. PR #158.', contextWindowOrigin: false }, // estimated
      { id: 'meta-session-86b', dayId: 'Apr 10', label: 'Canvas Handle Fix #2 + Mind Map Spec', workCategory: 'Bug', driver: 'collaborative', operator: 'claude-code', timeMinutes: 90, linesAdded: 19, linesDeleted: 2, note: 'Force H wrapper handles to 1px transparent. Still visible on live — deferred since canvas being replaced. Task #91 brainstorm: Obsidian-style force-directed mind map, 3 edge-model mockups via visual companion, Option B chosen (category clustering) for phase-one. Spec written. PR #159.', contextWindowOrigin: false }, // estimated
    ],
    metrics: { totalTimeMinutes: 100, linesAdded: 24, linesDeleted: 7, totalDecisions: 3 }, // estimated
    driverSummary: { human: 0, ai: 1, collaborative: 1 },
  },
  {
    date: 'Apr 11',
    title: 'Local Model Research',
    projectId: 'meta',
    phase: 'Shipped',
    chapterId: 'meta-ch-time-machine-data-model',
    blocks: [
      { id: 'meta-session-85', dayId: 'Apr 11', label: 'Local Model Research + Task #07', workCategory: 'Data', driver: 'collaborative', operator: 'claude-code', timeMinutes: 30, linesAdded: 0, linesDeleted: 0, note: 'Research-only session. Investigated "Gemma in Claude Code reduces tokens" claim (mislabeled — replaces Claude, not hybrid). Audited local Ollama stack (7 models). Created _Shared task #07 Local Model Experiment with 2 narrow experiments. Saved user_resource_cost_framing memory. No code.', contextWindowOrigin: false }, // estimated
    ],
    metrics: { totalTimeMinutes: 30, linesAdded: 0, linesDeleted: 0, totalDecisions: 1 }, // estimated
    driverSummary: { human: 0, ai: 0, collaborative: 1 },
  },
  {
    date: 'Apr 14',
    title: 'Mind Map Iteration + Canvas Mode Retirement',
    projectId: 'meta',
    phase: 'Shipped',
    chapterId: 'meta-ch-decision-tree-completeness',
    blocks: [
      { id: 'meta-session-89a', dayId: 'Apr 14', label: 'Dependabot Triage + Safe Subset', workCategory: 'Tooling', driver: 'agent-led', operator: 'claude-code', timeMinutes: 15, linesAdded: 175, linesDeleted: 173, note: 'PR #167 bundled ESLint 10 + TS 6 majors (still blocked upstream per #80) with 4 safe bumps. Closed #167, opened #170 with safe subset: playwright 1.59.1, prettier 3.8.2, typescript-eslint 8.58.2, vite 8.0.8. Flagged #168 prod deps (lucide 1.8 minor, react/react-dom 19.2.5 patch) as safe. PRs #170 and #168 merged.', contextWindowOrigin: false }, // estimated
      { id: 'meta-session-89b', dayId: 'Apr 14', label: 'Mind Map Iteration 1', workCategory: 'UX', driver: 'collaborative', operator: 'claude-code', timeMinutes: 45, linesAdded: 32, linesDeleted: 11, note: 'Task #91 iter 1 after S88 checkpoint 2 review. Labels-on-interaction-only (new hasSelection prop), force tuning (charge -220→-400, distanceMax 600→1400, collision +15, link 120→180), chapter pills with post-layout vertical deconfliction, fitView padding 0.2→0.35. tsc + build + 83 e2e passed + 3 skipped. PR #171 merged.', contextWindowOrigin: false }, // estimated
      { id: 'meta-session-89c', dayId: 'Apr 14', label: 'Mind Map Iteration 2', workCategory: 'UX', driver: 'collaborative', operator: 'claude-code', timeMinutes: 75, linesAdded: 150, linesDeleted: 39, note: 'Task #91 iter 2: zoom-aware progressive disclosure (useViewport via onMove), wayfinding via new BaseNode.featured field + 5 seed nodes (All-PRs, Cowork Retired, Security Audit, Playwright, Day/Block Migration), medoid-based chapter anchors, collision-hide replacing vertical push, zoom-fade on chapter pills. Featured nodes render at 22px with purple halo. 5 files, 83 e2e passed. PR #172 merged.', contextWindowOrigin: false }, // estimated
      { id: 'meta-session-89d', dayId: 'Apr 14', label: 'Canvas Mode Retirement', workCategory: 'Refactor', driver: 'collaborative', operator: 'claude-code', timeMinutes: 60, linesAdded: 15, linesDeleted: 933, note: 'Michael called it post-iter2 review — mind map exposed a data quality problem: most "decision" nodes aren\'t real forks, they\'re tasks that happened to have alternatives listed. Retired canvas mode entirely. Deleted MindMap.tsx, MindMapNode.tsx, mindMapLayout.ts. Removed d3-force + @types/d3-force. Dropped Stacked/Canvas view toggle + dead scaffolding (CategoryBar, CATEGORY_META, getChapterStats, projectSummary useMemo, detailNodes, activeFilterLabel). Reverted BaseNode.featured schema + 5 seed flags. Deleted 9 canvas e2e tests. Bundle 847kB→651kB (-23%). Task #91 moved to done/ with retirement rationale. Task #100 Decision Node Audit queued as follow-up. 77 e2e passed. PR #173 merged.', contextWindowOrigin: false }, // estimated
    ],
    metrics: { totalTimeMinutes: 195, linesAdded: 372, linesDeleted: 1156, totalDecisions: 2 }, // estimated
    driverSummary: { human: 0, ai: 1, collaborative: 3 },
  },
  {
    date: 'Apr 15',
    title: 'Data Model Rethink — Phase 1 Planning + Execution',
    projectId: 'meta',
    phase: 'Shipped',
    chapterId: 'meta-ch-decision-tree-completeness',
    blocks: [
      { id: 'meta-session-90', dayId: 'Apr 15', label: 'Phase 1 Planning (spec + plan)', workCategory: 'Data', driver: 'collaborative', operator: 'claude-code', timeMinutes: 180, linesAdded: 0, linesDeleted: 0, note: 'Pure planning session — zero code. Refined spec §6.6 parallel-rails rule + §6.7 archive strategy. Confirmed cross-project epic over new Saga unit (YAGNI). Consolidated 33 MT chapters into 14 epics (10 MT + 4 shared) with Michael era-by-era. Wrote 1914-line Phase 1 plan at plans/2026-04-15-data-model-rethink-phase-1.md with 10 tasks, TDD discipline on generator, full code for every step, scope-discipline check. Self-review passed on all 5 checks. No PR (local files only).', contextWindowOrigin: false }, // estimated
      { id: 'meta-session-91', dayId: 'Apr 15', label: 'Phase 1 Execution (foundation plumbing)', workCategory: 'Data', driver: 'collaborative', operator: 'claude-code', timeMinutes: 90, linesAdded: 1084, linesDeleted: 1, note: 'Executed all 10 Phase 1 tasks via subagent-driven-development. Branch feat/data-model-rethink-phase-1, 4 commits, 6 files: gray-matter dep, src/types/tracker.ts (Epic/Task/Decision types), scripts/generate-tracker-data.mjs (Node ESM generator with --verify mode), scripts/generate-tracker-data.test.mjs (11 unit tests via node:test, all pass), src/data/generated-tracker-data.ts (first committed generation, 14 epics + 9 tasks, 463 LOC), npm run generate:data script. Locally created 14 epic files + standardized 9 MT task files to YAML frontmatter. tsc clean, 77/77 e2e, --verify smoke passed both positive and semantic-negative tests. No destructive edits — metaProject.ts/metaMetrics.ts untouched. PR #176 merged.', contextWindowOrigin: false }, // estimated
    ],
    metrics: { totalTimeMinutes: 270, linesAdded: 1084, linesDeleted: 1, totalDecisions: 1 }, // estimated
    driverSummary: { human: 0, ai: 0, collaborative: 2 },
  },
  {
    date: 'Apr 16',
    title: 'Data Model Rethink — Phase 2 Backfill + Phase 3 Dashboard Rewrite',
    projectId: 'meta',
    phase: 'Shipped',
    chapterId: 'meta-ch-decision-tree-completeness',
    blocks: [
      { id: 'meta-session-92', dayId: 'Apr 16', label: 'Phase 2 Historical Backfill', workCategory: 'Data', driver: 'collaborative', operator: 'claude-code', timeMinutes: 150, linesAdded: 4482, linesDeleted: 88, note: 'Phase 2 of Data Model Rethink. Built backfill script (scripts/backfill-historical-tasks.mjs + tests, 920 LOC of real code). Script produced 113 task files (was 9 in Phase 1): 76 done-tasks converted from legacy format, 16 historical tasks created where none existed before, 12 missing tasks filled in from session memory + git. CRLF parser bug in parseBoldMarkdown fixed (Windows line endings broke YAML emit). 79 decisions reclassified — 24 retained as true forks, 55 demoted to events (typed: discovery, pivot, dead-end, completion, milestone). +3536/-82 is the regen output of generated-tracker-data.ts. PR #178 merged.', contextWindowOrigin: false }, // estimated
      { id: 'meta-session-93a', dayId: 'Apr 16', label: 'Phase 3 Dashboard Rewrite ship', workCategory: 'Feature', driver: 'collaborative', operator: 'claude-code', timeMinutes: 180, linesAdded: 1610, linesDeleted: 31, note: 'Phase 3 of Data Model Rethink shipped end-to-end. 8 commits, 13 files. New trackerDataAdapter.ts (~221 LOC) single import point for generated-tracker-data.ts. New EpicGantt.tsx (~186 LOC) renders 14-epic timeline as div bars with status colors + ongoing-pattern fill. New TasksTab.tsx (~516 LOC) replaces SessionsTab for MT — weekly throughput stacked bar with gold decision-pin diamonds, expandable tasks by week. OverviewTab adds task-model stat cards + EpicGantt at top (MT only). MetricsDashboard conditional Sessions→Tasks tab label via useMemo. DecisionTree adds expandedEpics state + mode=epics discriminator. StackedTreeView keeps legacy path + adds EpicTreeView (~440 LOC). 3 plan deviations: Task 8 no-op (callbacks are shared infra, not MT-only), charts use custom SVG not Recharts, tab id stays "sessions" (avoid state migration). 5 e2e specs updated, 4 new MT tests added. 77 baseline → 82 passing. PR #179 merged.', contextWindowOrigin: false }, // estimated
      { id: 'meta-session-93b', dayId: 'Apr 16', label: 'Bug triage — stale open/deferred', workCategory: 'Bug', driver: 'agent-led', operator: 'claude-code', timeMinutes: 20, linesAdded: 4, linesDeleted: 4, note: 'Post-PR #179 live review surfaced stale open bugs. Bug #4 (tsconfig misconfig) deliberately stays Deferred per memory. Bug #37 (velocity scatter labels) → Fixed (PR #163). Bug #39 (canvas grab handles) → Fixed (PR #173 — canvas retired). Bug #40 (computeInsights legacy arrays) → Fixed (PR #162). Bug #41 (E2E hard-coded totals) → Fixed (PR #162). Open/deferred count drops from 5 to 1 (just #4). Task #105. PR #180 merged.', contextWindowOrigin: false }, // estimated
      { id: 'meta-session-93c', dayId: 'Apr 16', label: 'Remove collapse/expand animation', workCategory: 'UX', driver: 'collaborative', operator: 'claude-code', timeMinutes: 30, linesAdded: 10, linesDeleted: 10, note: 'Michael flagged jumpy progressive-disclosure animation on Apr 16 review — Emil Kowalski transitions from S81 made max-height: 0/N clamp visibly mismatch real content height. Replaced max-height transitions with display: block/none (truly instant) across CodeTab/SessionsTab/BugsTab. Removed chevron rotation transitions on those plus the project switcher dropdown. Kept rotation transforms (visual cue), kept button-press scale + hover + data viz transitions. 82/82 e2e. Task #106. PR #181 merged.', contextWindowOrigin: false }, // estimated
    ],
    metrics: { totalTimeMinutes: 380, linesAdded: 6106, linesDeleted: 133, totalDecisions: 2 }, // estimated
    driverSummary: { human: 0, ai: 1, collaborative: 3 },
  },
  {
    date: 'Apr 17',
    title: 'Data Model Rethink — Follow-ups + #107 metrics-push flow',
    projectId: 'meta',
    phase: 'Shipped',
    chapterId: 'meta-ch-decision-tree-completeness',
    blocks: [
      { id: 'meta-session-94a', dayId: 'Apr 17', label: 'Epic-task linkage re-tag (#103)', workCategory: 'Data', driver: 'collaborative', operator: 'claude-code', timeMinutes: 45, linesAdded: 10, linesDeleted: 10, note: 'Phase 3 live review surfaced 6 epics with 0 tasks despite real work. Root cause: Phase 2 backfill used epic-meta-day-block-v1 as a temporary catch-all; intended re-sort never happened. Edited 9 task frontmatter ({82, 83, 85, 86, 87, 90, 92, 94, 95}-*.md). Added wikilink sections to 6 epic files (epic-meta-{insights-redesign, ux-data-fixes}.md + epic-shared-{decision-tree-backfill, project-milestones, infra-dep-migration, quality-audit}.md). Results: day-block-v1 22 → 13 tasks, insights-redesign 0 → 5, ux-data-fixes 0 → 2, shared-decision-tree-backfill 0 → 2. Three shared epics stay at 0 with explanatory notes (follow-ups). Task #103. PR #183 merged.', contextWindowOrigin: false }, // estimated
      { id: 'meta-session-94b', dayId: 'Apr 17', label: 'Option A — namespaced string task IDs', workCategory: 'Data', driver: 'collaborative', operator: 'claude-code', timeMinutes: 90, linesAdded: 391, linesDeleted: 148, note: 'Option A follow-through from #103. Chose honest namespacing over offset hack. Task.id number→string ("meta-103"), depends_on number[]→string[], DecisionPin.taskId + TaskTreeNode.id also strings. Generator now parses Meta Tracker/tasks/ AND _Shared/tasks-general/ — files without YAML frontmatter skipped silently (YAML-ify to opt in). normalizeTask() applies prefix at emit time; task frontmatter keeps numeric IDs. Sort uses Intl.Collator numeric for natural ordering. UI displayTaskId(id) strips prefix — users still see #103. First shared-epic population: epic-shared-infra-dep-migration 0 → 3. 5 new generator unit tests. 16/16 generator, 82/82 e2e, tsc + build clean. Task #114. PR #184 merged.', contextWindowOrigin: false }, // estimated
      { id: 'meta-session-94c', dayId: 'Apr 17', label: 'YAML-ify 11 shared tasks + new workflow-tooling epic', workCategory: 'Data', driver: 'agent-led', operator: 'claude-code', timeMinutes: 45, linesAdded: 322, linesDeleted: 1, note: 'Follow-up to PR #184. All 11 remaining _Shared/tasks-general/ files YAML-ified. New epic-shared-workflow-tooling created (startDate Mar 4, status In Progress) housing 10 tasks (#01 Desktop Workflow through #14 USB Bootstrapping). Task #09 Code Comments Audit → epic-shared-quality-audit (0 → 1). Counts: 14 → 15 epics, 122 → 133 tasks. Only epic-shared-project-milestones stays at 0 (events-only). Task #118. PR #185 merged.', contextWindowOrigin: false }, // estimated
      { id: 'meta-session-94d', dayId: 'Apr 17', label: 'Extend process-foundation endDate', workCategory: 'Data', driver: 'collaborative', operator: 'claude-code', timeMinutes: 15, linesAdded: 74, linesDeleted: 2, note: 'Michael spotted 63-tasks-in-3-days absurdity on Epic Timeline. Root cause: epic-meta-process-foundation endDate set to initial v1.0-prep window, but consolidatesChapters covers work through Mar 10 (Playwright e2e, SC theme, bug sweep). Extended endDate 2026-03-06 → 2026-03-10. Regen picks up 3 new task stubs (#108/#109/#110). 82/82 e2e. Task #119. PR #186 merged.', contextWindowOrigin: false }, // estimated
      { id: 'meta-session-94e', dayId: 'Apr 17', label: 'Plumbing — regen + tag Apr 17 follow-ups', workCategory: 'Tooling', driver: 'agent-led', operator: 'claude-code', timeMinutes: 10, linesAdded: 52, linesDeleted: 4, note: 'Mechanical regen. Added task #111 (Epic Timeline Gantt viz re-eval). Re-tagged #108/#109/#110 from epic: null → epic-data-model-rethink for consistency with #102/#104/#107. Orphan warnings 9 → 6 (#97, #98, #105, #106 remain — older separate concerns). Data-only, no code changes. PR #187 merged.', contextWindowOrigin: false }, // estimated
      { id: 'meta-session-95', dayId: 'Apr 17', label: '#107 metrics-push task-file sync + S95 closeout regen', workCategory: 'Tooling', driver: 'collaborative', operator: 'claude-code', timeMinutes: 300, linesAdded: 533, linesDeleted: 484, note: 'Brainstorm → spec → plan → execute → 2 rounds review → 2 rounds smoke fixes. Task #107 shipped: ~/.claude/commands/metrics-push.md full rewrite with 6-step flow (gather/classify/prompt/stage/validate/commit-or-rollback), pre-flight idempotency, 3-way status linking, atomic backup/rollback. session-end.md gained read-only verify step. How We Work.md got new section. Stage 1 = prompt-and-fill (auto-sync Option A deferred). Classification heuristics validated 5/5 on S94 PRs. Smoke test surfaced + fixed 5 real bugs (regex not multi-line, leaked uncommitted Metrics.ts, pre-git-setup task writes, ambiguous plumbing prompt, done.md wikilink double-add). Dogfood surfaced data integrity fix: 14 historical-backfill task IDs (Phase 2) colliding with modern tasks; renumbered to 9xx (13 pairs on ids 3, 102-114). Generator emits 139 distinct tasks, zero duplicate IDs. No PR for commands (outside repo). PR #188 carries the regen + renumber work: 533/484 in generated-tracker-data.ts only.', contextWindowOrigin: false }, // estimated
    ],
    metrics: { totalTimeMinutes: 505, linesAdded: 1382, linesDeleted: 649, totalDecisions: 3 }, // estimated
    driverSummary: { human: 0, ai: 2, collaborative: 4 },
  },
  {
    date: 'Apr 18',
    title: 'Session 96 close — backfill dogfood + disclosure fix + tooltip sweep',
    projectId: 'meta',
    phase: 'Shipped',
    chapterId: 'meta-ch-decision-tree-completeness',
    blocks: [
      { id: 'meta-session-96a', dayId: 'Apr 18', label: '#113 S92-S95 backfill (metrics-push dogfood replay)', workCategory: 'Tooling', driver: 'collaborative', operator: 'claude-code', timeMinutes: 60, linesAdded: 144, linesDeleted: 6, note: 'Replayed /metrics-push retroactively against 6 S93-S94 untracked PRs. Idempotency pre-flight correctly skipped PR #180 (in done/105-*) and #181 (in done/106-*). Remaining 4 classified: #184 → new-intent task #114; #185 → new-intent task #118; #186 → new-intent task #119; #187 → plumbing (4/4 signals) in session-2026-04-17-plumbing.md bucket. Legacy rail filled the S92-S95 gap: Apr 16 + Apr 17 day-blocks covering PRs #178/#179/#180/#181/#183/#184/#185/#186/#187/#188 (10 blocks, 885 min estimated). Task #113. PR #189.', contextWindowOrigin: false }, // estimated
      { id: 'meta-session-96b', dayId: 'Apr 18', label: '#108 disclosure press-feedback root cause + fix', workCategory: 'Bug', driver: 'collaborative', operator: 'claude-code', timeMinutes: 45, linesAdded: 19, linesDeleted: 0, note: 'Michael flagged jumpy disclosures still present after PR #181. Root cause: not in-component transitions but the global `button:active { transform: scale(0.97); transition: transform 100ms }` rule from S81 Design Polish firing on every disclosure button, creating a visible pulse during the 100ms :active hold. Fix: added `aria-expanded={isExpanded}` to 9 disclosure buttons across 5 files + CSS override in index.css targeting `button[aria-expanded]:active` to null out transform/transition. Primary action buttons keep press-feedback. 6 files, 82/82 e2e. Task #108. PR #190.', contextWindowOrigin: false }, // estimated
      { id: 'meta-session-96c', dayId: 'Apr 18', label: '#110 custom tooltip sweep — zero native titles + hook-rule fix', workCategory: 'UX', driver: 'collaborative', operator: 'claude-code', timeMinutes: 120, linesAdded: 196, linesDeleted: 35, note: 'Scope extended in live review from EpicGantt bar-tooltip to every remaining native `title` in MT. 7 surfaces converted to custom cursor-following tooltips via onMouseMove: EpicGantt bar + title column, TasksTab chart bar/decision-pin/row decision marker/row event marker, StackedTreeView category-bar tile and Epic Tree task marker. StackedTreeView self-hosts its own tooltip state (called from DecisionTree, not MetricsDashboard, so no plumbing to a shared owner). Hook-rule violation caught during validation: hoisted React.useMemo(dayGroups) above the epic-mode early return — MT rendered 1 hook, non-MT rendered 2 until fix (14 chapters-mode e2e failing with "Rendered more hooks than during the previous render"). 4 files, 82/82 e2e. Task #110. PR #191.', contextWindowOrigin: false }, // estimated
    ],
    metrics: { totalTimeMinutes: 225, linesAdded: 359, linesDeleted: 41, totalDecisions: 3 }, // estimated
    driverSummary: { human: 0, ai: 0, collaborative: 3 },
  },
  {
    date: 'Apr 19',
    title: 'Session 97 — S96 metrics close + Active Epic Progress + OpenCode A/B capture',
    projectId: 'meta',
    phase: 'Shipped',
    chapterId: 'meta-ch-decision-tree-completeness',
    blocks: [
      { id: 'meta-session-97a', dayId: 'Apr 19', label: 'Session 96 metrics close push', workCategory: 'Tooling', driver: 'collaborative', operator: 'claude-code', timeMinutes: 30, linesAdded: 57, linesDeleted: 16, note: 'Second push for S96 close-out — Apr 18 day-block with 3 sub-sessions (#189/#190/#191) and task-file rail sync appending PR #190 to #108 outputs and PR #191 to #110 outputs. Both adapter validation (generate:data) and tsc clean. Hubs already synced from prior push. PR #192.', contextWindowOrigin: false }, // estimated
      { id: 'meta-session-97b', dayId: 'Apr 19', label: '#104 Active Epic Progress — rethink + ship', workCategory: 'Feature', driver: 'collaborative', operator: 'claude-code', timeMinutes: 270, linesAdded: 1117, linesDeleted: 276, note: 'Full brainstorm → spec → plan → subagent-driven build → review → ship of Tasks-tab chart redesign. Task #104 Task Throughput replaced with Active Epic Progress cumulative-completion line chart. Brainstorm used visual companion (4 shape options → C2 overlapping curves → 2 layout mockups → proposed-defaults sign-off). Decisions: cap=6 applies to non-stalled only (stalled always visible, prepended); empty-points placeholder for never-started stalled epics; inline curve-end labels with 14px collision bump; cursor-following tooltip via shipped #110 pattern; no decision pins on this chart. Velocity chart captured to ideas-inbox for Corp CC MT clone. Adapter: new getEpicCumulativeSeries in trackerDataAdapter.ts + 6 node:test smoke tests via tsx. Component: new ActiveEpicProgress.tsx (285 LOC). Integration: TasksTab.tsx shrank 566 → 297 LOC (dead chart helpers removed). E2E: 82 → 87 tests, 2 retargeted + 5 new + 1 regression guard. Subagent-driven-development: 6 implementer dispatches, 3 review cycles (2 with fixes — points-array clone + stalled-exempt-from-cap). 18 commits. Spec at specs/2026-04-19-active-epic-progress-chart-spec.md, plan at plans/2026-04-19-active-epic-progress-chart.md. PR #193.', contextWindowOrigin: false }, // estimated
      { id: 'meta-session-97c', dayId: 'Apr 19', label: 'OpenCode A/B test chain capture + Obsidian exploration task', workCategory: 'Tooling', driver: 'collaborative', operator: 'claude-code', timeMinutes: 20, linesAdded: 0, linesDeleted: 0, note: '/capture flow filed 4 cross-project tasks to _Shared/tasks-general/. #16 Explore Obsidian results after Claude Code skill reduction sweep. #17 OpenCode parity setup (desktop shortcut + slash commands port + MCP reuse + agent routing validation; folds in unresolved items from Apr 8 opencode-setup-summary). #18 OpenCode A/B test — simple task (defines speed/quality/security/completeness/workflow-fit scoring framework, go/no-go gate for #19). #19 OpenCode A/B test — complex task (final viability call). Dependency chain: #17 blocks #18 blocks #19. No code changes this block.', contextWindowOrigin: false }, // estimated
    ],
    metrics: { totalTimeMinutes: 320, linesAdded: 1174, linesDeleted: 292, totalDecisions: 4 }, // estimated
    driverSummary: { human: 0, ai: 0, collaborative: 3 },
  },
];
