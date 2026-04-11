import type { DayEntry } from '../types/index';
import type { CodeVolumeEntry, SessionEntry, BugEntry, DerivedMetric, StackEntry } from './bipMetrics';

export const ibgCodeVolume: CodeVolumeEntry[] = [
  { session: 'Session 26', date: 'Mar 7', label: 'Addon v0.1 + Data Fetcher', added: 596, deleted: 53, net: 543, total: 543 },
  { session: 'Session 27', date: 'Mar 7', label: 'Scanner + Dashboard Deploy', added: 203, deleted: 161, net: 42, total: 585 },
  { session: 'Session 28', date: 'Mar 7', label: 'UX Overhaul + Item Class Detection', added: 414, deleted: 47, net: 367, total: 952 },
  { session: 'Session 41', date: 'Mar 11', label: 'Playwright Suite + CI', added: 1605, deleted: 0, net: 1605, total: 2557 },
  { session: 'Session 43', date: 'Mar 12', label: 'Dashboard Bug Fixes', added: 125, deleted: 171, net: -46, total: 2511 },
  { session: 'Session 50', date: 'Mar 13', label: 'Dependabot + Quality Gates', added: 31, deleted: 0, net: 31, total: 2542 },
  { session: 'Session 77', date: 'Mar 31', label: 'Changelog System', added: 227, deleted: 0, net: 227, total: 2769 },
  { session: 'Session 78', date: 'Apr 1', label: 'LOC Audit + Gitignore data.json', added: 12, deleted: 7103, net: -7091, total: -4322 },
  { session: 'Session 80', date: 'Apr 5', label: 'R2 Storage + Exclude Items', added: 400, deleted: 50, net: 350, total: -3972 },
];

export const ibgSessions: SessionEntry[] = [
  { session: 'Session 24', date: 'Mar 6', label: 'Research Kickoff', duration: 0.5, prs: 0, decisions: 0, deadEnds: 0, focus: 'Initial API research: tooltip hooks, quest/achievement detection, item classification, GW2_UI compat, existing addon landscape, architecture plan', chapterId: 'ibg-ch-research', workCategory: 'Research', tool: 'Claude Code', taskCount: 0, phase: 'Research', driver: 'agent-led' }, // estimated — no time tracked originally
  { session: 'Session 25', date: 'Mar 7', label: 'Architecture Decisions', duration: 0.5, prs: 0, decisions: 6, deadEnds: 0, focus: 'Zone-restricted items, ATT/DataStore integration APIs, plugin vs standalone analysis, keep category, web dashboard concept, decisions framework', chapterId: 'ibg-ch-research', workCategory: 'Planning', tool: 'Claude Code', taskCount: 0, phase: 'Spec', driver: 'collaborative' }, // estimated — no time tracked originally // 3 sub-agents used this session (ATT API, plugin patterns, cost items) \u2014 subAgents field pending Phase 3 type extension
  { session: 'Session 26', date: 'Mar 7', label: 'Addon v0.1 + Data Fetcher', duration: 0.75, prs: 0, decisions: 3, deadEnds: 0, focus: 'Addon skeleton, detection engine, tooltip hook, confidence model, Wowhead/Blizzard data fetcher, repo setup, in-game testing passed', chapterId: 'ibg-ch-first-build', workCategory: 'Feature', tool: 'Claude Code', taskCount: 0, phase: 'Build', driver: 'agent-led' }, // estimated — no time tracked originally
  { session: 'Session 27', date: 'Mar 7', label: 'Scanner + Dashboard Deploy', duration: 1.5, prs: 1, decisions: 3, deadEnds: 0, focus: 'Scanner module, dashboard (parser + UI + deploy), Cloudflare Pages setup, auto-sync, first real data: 3 chars / 819 items', chapterId: 'ibg-ch-first-build', workCategory: 'Feature', tool: 'Claude Code', taskCount: 0, phase: 'Build', driver: 'agent-led' }, // estimated — no time tracked originally
  { session: 'Session 28', date: 'Mar 7', label: 'UX Overhaul + Item Class Detection', duration: 1, prs: 4, decisions: 3, deadEnds: 0, focus: 'Dashboard UX review (20 findings), UX overhaul (sticky header, pill counts, Wowhead links/tooltips, icons, reason text cleanup), item class detection (reagents, recipes, legendaries, toys, currency), parse.js bugfix', chapterId: 'ibg-ch-dashboard-detection', workCategory: 'Feature', tool: 'Claude Code', taskCount: 0, phase: 'Review', driver: 'collaborative' }, // estimated — no time tracked originally
  { session: 'Session 41', date: 'Mar 11', label: 'Playwright Suite + CI', duration: 1, prs: 1, decisions: 0, deadEnds: 0, focus: 'Full Playwright test suite: 37 tests across 5 specs (navigation, data integrity, upload flow, filtering, deep interactions). GitHub Actions CI workflow. Tasks #31-#33.', chapterId: 'ibg-ch-dashboard-detection', workCategory: 'Tooling', tool: 'Claude Code', taskCount: 3, phase: 'Review', driver: 'agent-led' },
  { session: 'Session 43', date: 'Mar 12', label: 'Dashboard Bug Fixes', duration: 1, prs: 2, decisions: 0, deadEnds: 0, focus: 'Fix confidence labels, raw WoW strings, verdict filtering (PR #5). Simplify UI: fix stat cards, remove filter pills, legend read-only (PR #6). 2 dashboard PRs.', chapterId: 'ibg-ch-dashboard-detection', workCategory: 'Bug', tool: 'Claude Code', taskCount: 0, phase: 'Review', driver: 'collaborative' },
  { session: 'Session 50', date: 'Mar 13', label: 'Dependabot + Quality Gates', duration: 0.25, prs: 2, decisions: 0, deadEnds: 0, focus: 'Dependabot config (Dashboard PR #7) + PR quality gates — lint, typecheck, build (Dashboard PR #8). Part of cross-project tooling sweep.', chapterId: 'ibg-ch-dashboard-detection', workCategory: 'Tooling', tool: 'Claude Code', taskCount: 0, phase: 'Review', driver: 'agent-led' },
  { session: 'Session 77', date: 'Mar 31', label: 'Changelog System', duration: 0, prs: 1, decisions: 0, deadEnds: 0, focus: 'Part of cross-cutting S77 changelog rollout. PR template + extract-to-JSON workflow + /changelog page + dispatch to landing. Dashboard PR #10.', chapterId: 'ibg-ch-dashboard-detection', workCategory: 'Feature', tool: 'Claude Code', taskCount: 0, phase: 'Build', driver: 'collaborative' }, // TBD duration
  { session: 'Session 78', date: 'Apr 1', label: 'LOC Audit + Gitignore data.json', duration: 0.5, prs: 1, decisions: 2, deadEnds: 0, focus: 'LOC audit: data.json was 7,101 LOC inflating metrics. Gitignored data.json (Dashboard PR #11), added sample-data.json fallback, fixed 4 e2e tests. Tasks #41-#42 done.', chapterId: 'ibg-ch-dashboard-detection', workCategory: 'Bug', tool: 'Claude Code', taskCount: 2, phase: 'Build', driver: 'agent-led' },
  { session: 'Session 80', date: 'Apr 5', label: 'R2 Storage + Exclude Items', duration: 2, prs: 4, decisions: 1, deadEnds: 1, focus: 'R2 scan data storage (#43): migrated from git-committed JSON to CF R2. Exclude items (#22): Alt+click + slash commands + dashboard badge. Fixed GW2_UI hook compat. 4 PRs across 2 repos.', chapterId: 'ibg-ch-dashboard-detection', workCategory: 'Feature', tool: 'Claude Code', taskCount: 2, phase: 'Build', driver: 'collaborative' },
];

export const ibgDateRange = { start: 'Mar 2026', end: 'Apr 2026' };

export const ibgBugs: BugEntry[] = [];

export const ibgDerived: DerivedMetric[] = [
  { label: 'Detection Coverage', value: '32%', detail: '258/819 items classified', color: '#f59e0b' },
  { label: 'Decisions', value: '3.0', detail: 'Per session avg', color: '#22d3ee' },
];

export const ibgStack: StackEntry[] = [
  { name: 'Lua (WoW API)', cat: 'Core' },
  { name: 'Node.js', cat: 'Build' },
  { name: 'HTML/CSS/JS', cat: 'UI' },
  { name: 'Cloudflare Pages', cat: 'Core' },
];

/** Migrated from ibgSessions — each Day groups sessions that share a date. */
export const ibgDays: DayEntry[] = [
  {
    date: 'Mar 6',
    title: 'Research Kickoff',
    projectId: 'ibg',
    phase: 'Research',
    chapterId: 'ibg-ch-research',
    blocks: [
      { id: 'ibg-session-24', dayId: 'Mar 6', label: 'Research Kickoff', workCategory: 'Research', driver: 'agent-led', operator: 'claude-code', timeMinutes: 30, linesAdded: 0, linesDeleted: 0, note: 'Initial API research: tooltip hooks, quest/achievement detection, item classification, GW2_UI compat, existing addon landscape, architecture plan', contextWindowOrigin: false },
    ],
    metrics: { totalTimeMinutes: 30, linesAdded: 0, linesDeleted: 0, totalDecisions: 0 },
    driverSummary: { human: 0, ai: 1, collaborative: 0 },
  },
  {
    date: 'Mar 7',
    projectId: 'ibg',
    phase: 'Spec',
    chapterId: 'ibg-ch-research',
    blocks: [
      { id: 'ibg-session-25', dayId: 'Mar 7', label: 'Architecture Decisions', workCategory: 'Planning', driver: 'collaborative', operator: 'claude-code', timeMinutes: 30, linesAdded: 0, linesDeleted: 0, note: 'Zone-restricted items, ATT/DataStore integration APIs, plugin vs standalone analysis, keep category, web dashboard concept, decisions framework', contextWindowOrigin: false },
      { id: 'ibg-session-26', dayId: 'Mar 7', label: 'Addon v0.1 + Data Fetcher', workCategory: 'Feature', driver: 'agent-led', operator: 'claude-code', timeMinutes: 45, linesAdded: 596, linesDeleted: 53, note: 'Addon skeleton, detection engine, tooltip hook, confidence model, Wowhead/Blizzard data fetcher, repo setup, in-game testing passed', contextWindowOrigin: false },
      { id: 'ibg-session-27', dayId: 'Mar 7', label: 'Scanner + Dashboard Deploy', workCategory: 'Feature', driver: 'agent-led', operator: 'claude-code', timeMinutes: 90, linesAdded: 203, linesDeleted: 161, note: 'Scanner module, dashboard (parser + UI + deploy), Cloudflare Pages setup, auto-sync, first real data: 3 chars / 819 items', contextWindowOrigin: false },
      { id: 'ibg-session-28', dayId: 'Mar 7', label: 'UX Overhaul + Item Class Detection', workCategory: 'Feature', driver: 'collaborative', operator: 'claude-code', timeMinutes: 60, linesAdded: 414, linesDeleted: 47, note: 'Dashboard UX review (20 findings), UX overhaul (sticky header, pill counts, Wowhead links/tooltips, icons, reason text cleanup), item class detection (reagents, recipes, legendaries, toys, currency), parse.js bugfix', contextWindowOrigin: false },
    ],
    metrics: { totalTimeMinutes: 225, linesAdded: 1213, linesDeleted: 261, totalDecisions: 15 },
    driverSummary: { human: 0, ai: 2, collaborative: 2 },
  },
  {
    date: 'Mar 11',
    title: 'Playwright Suite + CI',
    projectId: 'ibg',
    phase: 'Review',
    chapterId: 'ibg-ch-dashboard-detection',
    blocks: [
      { id: 'ibg-session-41', dayId: 'Mar 11', label: 'Playwright Suite + CI', workCategory: 'Tooling', driver: 'agent-led', operator: 'claude-code', timeMinutes: 60, linesAdded: 1605, linesDeleted: 0, note: 'Full Playwright test suite: 37 tests across 5 specs (navigation, data integrity, upload flow, filtering, deep interactions). GitHub Actions CI workflow. Tasks #31-#33.', contextWindowOrigin: false },
    ],
    metrics: { totalTimeMinutes: 60, linesAdded: 1605, linesDeleted: 0, totalDecisions: 0 },
    driverSummary: { human: 0, ai: 1, collaborative: 0 },
  },
  {
    date: 'Mar 12',
    title: 'Dashboard Bug Fixes',
    projectId: 'ibg',
    phase: 'Review',
    chapterId: 'ibg-ch-dashboard-detection',
    blocks: [
      { id: 'ibg-session-43', dayId: 'Mar 12', label: 'Dashboard Bug Fixes', workCategory: 'Bug', driver: 'collaborative', operator: 'claude-code', timeMinutes: 60, linesAdded: 125, linesDeleted: 171, note: 'Fix confidence labels, raw WoW strings, verdict filtering (PR #5). Simplify UI: fix stat cards, remove filter pills, legend read-only (PR #6). 2 dashboard PRs.', contextWindowOrigin: false },
    ],
    metrics: { totalTimeMinutes: 60, linesAdded: 125, linesDeleted: 171, totalDecisions: 0 },
    driverSummary: { human: 0, ai: 0, collaborative: 1 },
  },
  {
    date: 'Mar 13',
    title: 'Dependabot + Quality Gates',
    projectId: 'ibg',
    phase: 'Review',
    chapterId: 'ibg-ch-dashboard-detection',
    blocks: [
      { id: 'ibg-session-50', dayId: 'Mar 13', label: 'Dependabot + Quality Gates', workCategory: 'Tooling', driver: 'agent-led', operator: 'claude-code', timeMinutes: 15, linesAdded: 31, linesDeleted: 0, note: 'Dependabot config (Dashboard PR #7) + PR quality gates — lint, typecheck, build (Dashboard PR #8). Part of cross-project tooling sweep.', contextWindowOrigin: false },
    ],
    metrics: { totalTimeMinutes: 15, linesAdded: 31, linesDeleted: 0, totalDecisions: 0 },
    driverSummary: { human: 0, ai: 1, collaborative: 0 },
  },
  {
    date: 'Mar 31',
    title: 'Changelog System',
    projectId: 'ibg',
    phase: 'Build',
    chapterId: 'ibg-ch-dashboard-detection',
    blocks: [
      { id: 'ibg-session-77', dayId: 'Mar 31', label: 'Changelog System', workCategory: 'Feature', driver: 'collaborative', operator: 'claude-code', timeMinutes: 0, linesAdded: 227, linesDeleted: 0, note: 'Part of cross-cutting S77 changelog rollout. PR template + extract-to-JSON workflow + /changelog page + dispatch to landing. Dashboard PR #10.', contextWindowOrigin: false }, // TBD timeMinutes
    ],
    metrics: { totalTimeMinutes: 0, linesAdded: 227, linesDeleted: 0, totalDecisions: 0 }, // TBD totalTimeMinutes
    driverSummary: { human: 0, ai: 0, collaborative: 1 },
  },
  {
    date: 'Apr 1',
    title: 'LOC Audit + Gitignore data.json',
    projectId: 'ibg',
    phase: 'Build',
    chapterId: 'ibg-ch-dashboard-detection',
    blocks: [
      { id: 'ibg-session-78', dayId: 'Apr 1', label: 'LOC Audit + Gitignore data.json', workCategory: 'Bug', driver: 'agent-led', operator: 'claude-code', timeMinutes: 30, linesAdded: 12, linesDeleted: 7103, note: 'LOC audit: data.json was 7,101 LOC inflating metrics. Gitignored data.json (Dashboard PR #11), added sample-data.json fallback, fixed 4 e2e tests. Tasks #41-#42 done.', contextWindowOrigin: false },
    ],
    metrics: { totalTimeMinutes: 30, linesAdded: 12, linesDeleted: 7103, totalDecisions: 2 },
    driverSummary: { human: 0, ai: 1, collaborative: 0 },
  },
  {
    date: 'Apr 5',
    title: 'R2 Storage + Exclude Items',
    projectId: 'ibg',
    phase: 'Build',
    chapterId: 'ibg-ch-dashboard-detection',
    blocks: [
      { id: 'ibg-session-80-r2', dayId: 'Apr 5', label: 'R2 Scan Data Storage', workCategory: 'Feature', driver: 'agent-led', operator: 'claude-code', timeMinutes: 45, linesAdded: 200, linesDeleted: 25, note: 'Migrated scan data from git-committed JSON to CF R2. Storage provider abstraction (swappable to Supabase). sync.js uploads to R2. Dashboard fetches with 3-tier fallback. CORS configured. Dashboard PR #12.', contextWindowOrigin: false },
      { id: 'ibg-session-80-exclude', dayId: 'Apr 5', label: 'Exclude Items from Scan', workCategory: 'Feature', driver: 'collaborative', operator: 'claude-code', timeMinutes: 75, linesAdded: 200, linesDeleted: 25, note: 'Alt+click items in bags to toggle exclusion. /ibg slash commands. Excluded items show gray tooltip + dashboard badge. Fixed GW2_UI compat (HandleModifiedItemClick). Fixed parse.js exclusion cross-ref. Addon PR #3, Dashboard PRs #13+#16.', contextWindowOrigin: false },
    ],
    metrics: { totalTimeMinutes: 120, linesAdded: 400, linesDeleted: 50, totalDecisions: 1 },
    driverSummary: { human: 0, ai: 1, collaborative: 1 },
  },
];
