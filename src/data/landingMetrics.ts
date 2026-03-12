import type { CodeVolumeEntry, SessionEntry, DerivedMetric, StackEntry } from './bipMetrics';
import type { BugEntry } from './remnantsMetrics';

// --- Code Volume ---
export const landingCodeVolume: CodeVolumeEntry[] = [
  { session: 'Session 33', date: 'Mar 9', label: 'Scaffold + Theme & Sections', added: 4232, deleted: 12, net: 4220, total: 4220 },
  { session: 'Session 36', date: 'Mar 10', label: 'CMS Backend + Admin + OAuth', added: 1586, deleted: 167, net: 1419, total: 5639 },
  { session: 'Session 41', date: 'Mar 11', label: 'Playwright Suite + CI', added: 483, deleted: 2, net: 481, total: 6120 },
  { session: 'Session 43', date: 'Mar 12', label: 'Hero Polish + Coming Soon Border', added: 88, deleted: 5, net: 83, total: 6203 },
];

// --- Sessions ---
export const landingSessions: SessionEntry[] = [
  { session: 'Session 33', date: 'Mar 9', label: 'Scaffold + Theme & Sections', duration: 1.5, prs: 1, decisions: 3, deadEnds: 0, focus: 'Initial React + Vite + TypeScript scaffold with dark theme. Added light/dark theme system, hero section, project cards grid, about section, footer. Cloudflare Pages deploy. PR #1.', chapterId: 'landing-ch-build', workCategory: 'Feature', tool: 'Claude Code', taskCount: 2, phase: 'Build', driver: 'collaborative' },
  { session: 'Session 36', date: 'Mar 10', label: 'CMS Backend + Admin + OAuth', duration: 2, prs: 3, decisions: 3, deadEnds: 0, focus: 'Cloudflare Pages Functions + KV backend for CMS. Admin panel at #/admin with live content editing. Replaced password auth with Google OAuth. PRs #2-4.', chapterId: 'landing-ch-cms', workCategory: 'Feature', tool: 'Claude Code', taskCount: 3, phase: 'Build', driver: 'collaborative' },
  { session: 'Session 41', date: 'Mar 11', label: 'Playwright Suite + CI', duration: 0.5, prs: 1, decisions: 0, deadEnds: 0, focus: 'Playwright e2e test suite + GitHub Actions CI workflow. Part of cross-project Playwright sweep. PR #5.', chapterId: 'landing-ch-testing', workCategory: 'Tooling', tool: 'Claude Code', taskCount: 1, phase: 'Review', driver: 'agent-led' },
  { session: 'Session 43', date: 'Mar 12', label: 'Hero Polish + Coming Soon Border', duration: 1, prs: 1, decisions: 0, deadEnds: 0, focus: 'Reduced hero section height (80vh→50vh), added bouncing scroll-down arrow. Brightened Coming Soon card dashed border to white for "under construction" feel. Feedback capture workflow first real use. PR #6.', chapterId: 'landing-ch-build', workCategory: 'Feature', tool: 'Claude Code', taskCount: 2, phase: 'Build', driver: 'collaborative' },
];

// --- Date Range ---
export const landingDateRange = {
  start: 'Mar 2026',
  end: 'Mar 2026',
};

// --- Bugs ---
export const landingBugs: BugEntry[] = [];

// --- Derived Metrics ---
export const landingDerived: DerivedMetric[] = [
  { label: 'Build Speed', value: '1,555 LOC/session', detail: '6,203 LOC across 4 sessions', color: '#22d3ee' },
  { label: 'Decision Density', value: '1.5/session', detail: '6 decisions in 4 sessions', color: '#8b5cf6' },
  { label: 'PR Pace', value: '1.5/session', detail: '6 PRs in 4 sessions', color: '#f59e0b' },
  { label: 'Time to CMS', value: '2 sessions', detail: 'From scaffold to full CMS with OAuth', color: '#10b981' },
];

// --- Stack ---
export const landingStack: StackEntry[] = [
  { name: 'React', cat: 'Core' },
  { name: 'TypeScript', cat: 'Core' },
  { name: 'Vite', cat: 'Build' },
  { name: 'Cloudflare Pages', cat: 'Core' },
  { name: 'Cloudflare KV', cat: 'Core' },
  { name: 'Playwright', cat: 'Utility' },
];
