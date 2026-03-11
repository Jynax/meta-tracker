import type { CodeVolumeEntry, SessionEntry, BugEntry, DerivedMetric, StackEntry } from './bipMetrics';

export const ibgCodeVolume: CodeVolumeEntry[] = [
  { session: 'Session 26', date: 'Mar 7', label: 'Addon v0.1 + Data Fetcher', added: 596, deleted: 53, net: 543, total: 543 },
  { session: 'Session 27', date: 'Mar 7', label: 'Scanner + Dashboard Deploy', added: 9224, deleted: 174, net: 9050, total: 9593 },
  { session: 'Session 28', date: 'Mar 7', label: 'UX Overhaul + Item Class Detection', added: 414, deleted: 47, net: 367, total: 9960 },
  { session: 'Session 41', date: 'Mar 11', label: 'Playwright Suite + CI', added: 1605, deleted: 0, net: 1605, total: 11565 },
];

export const ibgSessions: SessionEntry[] = [
  { session: 'Session 24', date: 'Mar 6', label: 'Research Kickoff', duration: 0, prs: 0, decisions: 0, deadEnds: 0, focus: 'Initial API research: tooltip hooks, quest/achievement detection, item classification, GW2_UI compat, existing addon landscape, architecture plan', chapterId: 'ibg-ch-research', workCategory: 'Research', tool: 'Claude Code', taskCount: 0, phase: 'Research', driver: 'agent-led' },
  { session: 'Session 25', date: 'Mar 7', label: 'Architecture Decisions', duration: 0, prs: 0, decisions: 6, deadEnds: 0, focus: 'Zone-restricted items, ATT/DataStore integration APIs, plugin vs standalone analysis, keep category, web dashboard concept, decisions framework', chapterId: 'ibg-ch-research', workCategory: 'Planning', tool: 'Claude Code', taskCount: 0, phase: 'Spec', driver: 'collaborative' }, // 3 sub-agents used this session (ATT API, plugin patterns, cost items) \u2014 subAgents field pending Phase 3 type extension
  { session: 'Session 26', date: 'Mar 7', label: 'Addon v0.1 + Data Fetcher', duration: 0, prs: 0, decisions: 3, deadEnds: 0, focus: 'Addon skeleton, detection engine, tooltip hook, confidence model, Wowhead/Blizzard data fetcher, repo setup, in-game testing passed', chapterId: 'ibg-ch-first-build', workCategory: 'Feature', tool: 'Claude Code', taskCount: 0, phase: 'Build', driver: 'agent-led' },
  { session: 'Session 27', date: 'Mar 7', label: 'Scanner + Dashboard Deploy', duration: 0, prs: 1, decisions: 3, deadEnds: 0, focus: 'Scanner module, dashboard (parser + UI + deploy), Cloudflare Pages setup, auto-sync, first real data: 3 chars / 819 items', chapterId: 'ibg-ch-first-build', workCategory: 'Feature', tool: 'Claude Code', taskCount: 0, phase: 'Build', driver: 'agent-led' },
  { session: 'Session 28', date: 'Mar 7', label: 'UX Overhaul + Item Class Detection', duration: 0, prs: 4, decisions: 3, deadEnds: 0, focus: 'Dashboard UX review (20 findings), UX overhaul (sticky header, pill counts, Wowhead links/tooltips, icons, reason text cleanup), item class detection (reagents, recipes, legendaries, toys, currency), parse.js bugfix', chapterId: 'ibg-ch-dashboard-detection', workCategory: 'Feature', tool: 'Claude Code', taskCount: 0, phase: 'Review', driver: 'collaborative' },
  { session: 'Session 41', date: 'Mar 11', label: 'Playwright Suite + CI', duration: 1, prs: 1, decisions: 0, deadEnds: 0, focus: 'Full Playwright test suite: 37 tests across 5 specs (navigation, data integrity, upload flow, filtering, deep interactions). GitHub Actions CI workflow. Tasks #31-#33.', chapterId: 'ibg-ch-dashboard-detection', workCategory: 'Tooling', tool: 'Claude Code', taskCount: 3, phase: 'Review', driver: 'agent-led' },
];

export const ibgDateRange = { start: 'Mar 2026', end: 'Mar 2026' };

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
